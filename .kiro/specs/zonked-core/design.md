# Zonked Core: Design

## 1. Architecture

```
 coding session (Kiro / git)
        |
 burnout-sentinel --> .zonked-signals.json --> acoustic-sequencer --> .zonked-state.json
                                                                          |
 dsp-verifier --> .zonked-verify.json                              crew-bridge (127.0.0.1:43210, SSE)
                                                                          |
                                   web app (main thread) <----------------+
                                     | sbg parser, sequencer, UI, IndexedDB
                                     | SharedArrayBuffer params (or postMessage fallback)
                                     v
                           AudioWorkletProcessor --> dsp-core.wasm --> stereo out
                                     | telemetry ring (SAB)
                                     v
                           oscilloscope + Lissajous canvas
```

Transport choice: Server-Sent Events, not WebSocket. The data flow is one way, SSE needs no dependency in Node and reconnects natively. The spec wording "WebSocket/SSE" is met by SSE.

## 2. `crates/dsp-core`

Files: `lib.rs` (exports, lints), `params.rs` (clamps, sanitizing), `phase.rs` (u64 accumulator, sine), `smooth.rs`, `noise.rs` (Xoshiro256**, white/pink/brown), `limiter.rs`, `engine.rs` (frame render), `abi.rs` (C exports).

- **Phase**: `phase: u64`, `inc = round(f / sr * 2^64)` using `f64` math once per parameter update (not per sample). The smoothed frequency changes `inc` each sample by a cheap multiply; to stay `O(1)` and exact enough, smooth frequency in Hz then recompute `inc = (f * k) as u64` with `k = 2^64 / sr` precomputed. Phase advances with `wrapping_add`.
- **Sine**: no `libm`. Quarter-wave symmetry from the top 2 bits of phase; a 5th-order odd polynomial on the reduced range. Target error under 1e-4 (about -80 dB). Verified in tests by comparing to a reference computed in the test harness (std allowed in tests).
- **Modes**: `Binaural` (L=f_L, R=f_R), `Monaural` (both = 0.5*(sin_L + sin_R)), `Isochronic` (both = sin(fc) * gate, gate = 0.5*(1 - cos(2*pi*phase_beat)) built from the same polynomial at phase + half turn).
- **Smoothing**: `y += a * (target - y)`, `a = 1 - exp(-1/(tau*sr))` precomputed per time constant with a small `exp` approximation at construction. Tau: gain 50 ms, frequency 100 ms, noise level 50 ms.
- **Noise**: Xoshiro256** (SplitMix64 seeding). White = scaled `u64 -> f32`. Pink = Paul Kellet 3-pole filter on white. Brown = leaky integrator (`b = 0.998*b + 0.02*w`) with gain compensation. All with fixed state.
- **Limiter**: sample-wise: `y = x.clamp(-0.95, 0.95)` after a soft knee `tanh`-free rational approximation above 0.8 to avoid harsh clipping, then hard clamp as the guarantee. NaN input maps to 0.
- **Master gain** applies before the limiter; gain ramp from 0 on start lasts 2 s (set by the App via target and the smoothing time constant switch `ramp_start`).
- **ABI** (`abi.rs`): one static `Engine`, exported functions use only integers and floats:
  `zk_init(sample_rate: f32)`, `zk_apply_params()` reads a `#[repr(C)]` block of 12 `f32` from linear memory, `zk_render(frames: u32)` writes to two static 128-sample `f32` buffers, `zk_out_left() -> *const f32`, `zk_out_right() -> *const f32`, `zk_param_block() -> *mut f32`. `frames` is clamped to 1..=128. Single-threaded use by the Worklet only.

Param block layout (f32 index): 0 carrier_hz, 1 beat_hz, 2 gain, 3 mode (0 bin, 1 mono, 2 iso), 4 noise_kind (0 off, 1 white, 2 pink, 3 brown), 5 noise_level, 6 ramp_seconds, 7 reserved.

## 3. Crew files and state schema

`.zonked-signals.json` (sentinel) and `.zonked-state.json` (sequencer) are defined in the agent instruction files. The Bridge validates:

```
State { version: 1, at: int, burnout: { score: 0..100, level: focus|flow|recovery|decompress },
        target: { presetId?: string(<=32), beatHz: 0.5..40, carrierHz: 20..1500, gain: 0..0.85,
                  transitionSec: 5..600, breathe: bool }, sbg: string|null (<=4096 bytes, <=20 events) }
```

Out-of-range numbers are clamped and flagged in `/health.warnings`. Unknown `version` is rejected.

## 4. `crew-bridge`

- `src/server.ts`: `node:http`. Routes: `GET /events` (SSE, `event: state`, heartbeat every 15 s), `GET /state` (latest JSON), `GET /health`. `Host` and `Origin` checks. `Access-Control-Allow-Origin` echoes only allow-listed origins (default: `http://localhost:5173`, `http://127.0.0.1:5173`, plus any `--origin` flag, including an https origin (for example `https://zonked.example.invalid`)).
- `src/watch.ts`: `fs.watch` on the directory (editors rename files), debounce 100 ms, size cap 64 KB, schema validation in `src/validate.ts`.
- `src/cli.ts`: `zonked-bridge --state <path> [--port 43210] [--origin <url>]`. Built to plain JS by `tsc`; dev dependency only on `typescript` and `@types/node`. Tests use `node:test`.
- Known limit: Safari blocks `https` pages from calling `http://127.0.0.1`. Chrome and Firefox treat loopback as secure. Documented in README; local dev over `http://localhost:5173` works in all browsers.

## 5. `web/`

Vite + TypeScript, no UI framework (small, CSP-friendly). Layout:

```
web/src/sbg/        lexer.ts parser.ts types.ts sequencer.ts presets/*.sbg limits.ts
web/src/audio/      engine.ts (main-thread controller) worklet.ts (processor) params.ts (SAB protocol) telemetry.ts
web/src/ui/         app.ts mask.ts scope.ts pacer.ts bridge.ts storage.ts notice.ts styles/*.css
web/public/         logo.svg _headers manifest.webmanifest icons/
```

### 5.1 `.sbg` subset

Supported SBaGen syntax: comments (`#`), tone-set definitions (`name: 200+10/0.5`, `200@10`, `pink/40`, `mix/60`), timed sequence lines (`HH:MM:SS name [->]`, `NOW`), `ramp`/`slide` via `->`, sequence line repeat is rejected. Unsupported tokens yield a warning with line number and are skipped. Mapping: `carrier+beat` sets `f_c` and `df`; `@beat` uses the default carrier 200 Hz and sets `df`; `pink/N`, `white/N`, `brown/N` set noise level. Values clamp to safety bounds with a warning. Lines longer than 512 chars produce an error. Events capped at 500, input at 256 KB.

### 5.2 Param protocol

SAB layout (`Int32Array` header + `Float32Array` data): `[seq, ...12 floats]`. Writer (main): increment `seq` to odd, write floats, increment to even (seqlock). Reader (Worklet): read `seq`, copy, re-read `seq`, accept only if equal and even; else keep previous. Wait-free for the audio thread. Telemetry ring: SPSC, power-of-two capacity 8192 stereo frames, `Atomics.load/store` on write index; the Worklet decimates by 4 and drops on overflow. Fallback: `port.postMessage` of the same 12-float block.

### 5.3 Worklet

Receives `{wasm: ArrayBuffer, sab?: SharedArrayBuffer}` via `processorOptions`/message, compiles synchronously with `new WebAssembly.Module`. `process()` copies params, calls `zk_set_params` then `zk_render(128)`, copies from WASM memory views to outputs. Allocation-free in `process()`. Output sanity check: any non-finite output is replaced with 0 (defense in depth).

### 5.4 Sequencer

Main thread `setTimeout`-free scheduler driven by `AudioContext.currentTime`: compute the active event from elapsed seconds and push target values; the Engine smoothing does the crossfade. Ramps (`->`) interpolate linearly at 10 Hz update rate on the main thread; the Engine smooths the 10 Hz steps.

### 5.5 UI

Mask SVG inline-referenced as an `<img>`-free, CSP-safe external `logo.svg`. The eyes are separate elements in the SVG loaded as an inline SVG via `fetch` at build time (embedded by Vite `?raw` import, no `innerHTML` of dynamic data). Eye pulse: CSS custom property `--pulse-l` and `--pulse-r` updated per animation frame from a phase value, scaled to a visible rate of `min(f, 3 Hz)` using `visible = f mod 3` style mapping (beat shown at `beat/ceil(beat/3)`). Oscilloscope and Lissajous on a canvas at 60 fps via `requestAnimationFrame`, reading the telemetry ring. Pacer: SVG circle with CSS transform, 5.5 breaths per minute default; "Breathwork Sync" preset uses 6-breath cycles.

### 5.6 PWA and storage

`vite-plugin-pwa` (generateSW) with `globPatterns: ['**/*.{html,js,css,wasm,svg,webmanifest,sbg}']`, `registerType: 'autoUpdate'`, and an explicit entry for the worklet file (built as a separate hashed asset via `new URL('./worklet.ts', import.meta.url)`). IndexedDB via a tiny wrapper: stores `scripts` (id, name, text, updatedAt) and `logs` (id, startedAt, endedAt, peakScore, presetId).

## 6. Hosting

The app is a static site built to `web/dist`; `the host config file in web/` is a plain config file. `_headers` is copied to `dist/_headers` by Vite from `public/`. `COEP: require-corp` requires every subresource to be same-origin or CORP-tagged; the app has no third-party resources, so it holds.

## 7. Verification

- Rust: unit tests (see tasks). Property-style sweeps over parameter ranges using a deterministic LCG in tests.
- TypeScript: `vitest` for parser, protocol, bridge validation. Bridge tests with `node:test`.
- E2E: Playwright against `vite preview` or the local dev server. Checks: header values, PCM captured from an `OfflineAudioContext`-free live path (the Worklet posts a peak/RMS report on request), offline reload via `context.setOffline(true)`.

## 8. Risks and decisions

| Risk | Decision |
|---|---|
| `wasm-pack` and `wasm32` target not installed here | Phase 1 first installs `rustup target add wasm32-unknown-unknown` and `cargo install wasm-pack`. Needs network. |
| Safari mixed content to loopback | Documented; use Chrome/Firefox or local dev. |
| Logo file not available as a file | Redraw as hand-written `logo.svg` from the reference image (circle, mask panels, two eyes, headphone cups, green diamond). |
| COEP breaks `SharedArrayBuffer` if misconfigured | `postMessage` fallback plus E2E check for `crossOriginIsolated`. |
| Reference app is third-party Android Java (GPLv3) | Used only as reference for published parameter values; kept in `legacy/` read-only, credited in `NOTICE`. |
