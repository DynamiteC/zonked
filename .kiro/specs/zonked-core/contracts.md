# Zonked Core: Shared Contracts

Every agent builds against these. Change them only by editing this file first.

## C1. WASM ABI (`crates/dsp-core`, exports, wasm32, no imports)

```
zk_init(sample_rate: f32)            // resets engine, seeds noise with fixed seed
zk_param_block() -> *mut f32         // pointer to 8 f32 slots (see below), JS writes here
zk_apply_params()                    // engine reads the block, sanitizes, sets targets
zk_render(frames: u32)               // frames clamped to 1..=128
zk_out_left() -> *const f32          // 128 f32
zk_out_right() -> *const f32         // 128 f32
zk_reset_phase()                     // zero phases (never called during playback)
```

Param block slots: `0 carrier_hz, 1 beat_hz, 2 gain, 3 mode (0 binaural, 1 monaural, 2 isochronic), 4 noise_kind (0 off, 1 white, 2 pink, 3 brown), 5 noise_level 0..1, 6 ramp_seconds (smoothing time constant scale, 0.05..30), 7 reserved`.

Output file: `crates/dsp-core/pkg/` via `wasm-pack build crates/dsp-core --target web --release`. The web build copies `dsp_core_bg.wasm` to `web/src/wasm/dsp_core.wasm` (raw bytes loaded with `WebAssembly.Module`, no wasm-bindgen glue is needed because the ABI is plain C). The crate must not depend on wasm-bindgen at all; wasm-pack is used only as the build driver (or `cargo build --target wasm32-unknown-unknown --release` as fallback, same output).

## C2. Parser API (`web/src/sbg`)

```ts
export const LIMITS: { maxBytes: 262144; maxEvents: 500; maxLineLength: 512 };
export interface Voice { carrierHz: number; beatHz: number; noise: 'off'|'white'|'pink'|'brown'; noiseLevel: number; mode: 'binaural'|'monaural'|'isochronic'; gain: number }
export interface SbgEvent { tSec: number; voice: Voice; ramp: boolean; line: number }
export interface Diagnostic { line: number; severity: 'error'|'warning'; message: string }
export interface ParseResult { events: SbgEvent[]; durationSec: number; diagnostics: Diagnostic[]; ok: boolean }
export function parseSbg(text: string): ParseResult;   // pure, never throws, ok=false if any error
export function voiceAt(events: SbgEvent[], tSec: number): Voice; // linear interpolation across ramp events
export interface Preset { id: string; name: string; description: string; sbg: string; breath?: { inSec: number; outSec: number } }
export const PRESETS: readonly Preset[];  // exactly 6, ids: deep-focus, flow-state, burnout-reset, breathwork-sync, deep-rest, classic-1998
```

Subset syntax: see design.md section 5.1. `HH:MM:SS name`, `name: 200@10`, `name: 200+10`, `name: pink/40`, `->` ramp marker, `mode: iso|mono|bin` option, `# comment`.

## C3. Crew state (`.zonked-state.json`, bridge, app)

```
{ version: 1, at: int, burnout: { score: 0..100, level: "focus"|"flow"|"recovery"|"decompress" },
  target: { presetId?: string, beatHz: 0.5..40, carrierHz: 20..1500, gain: 0..0.85, transitionSec: 5..600, breathe: boolean },
  sbg: string|null, why?: string }
```
`why` is optional: one plain sentence for the person, at most 160 characters. Every reader strips control, line-break and bidi-override characters, collapses spaces, cuts to 160 code points and drops the field when nothing is left. It is shown as text only and never carries file names, commit messages or paths. When absent the web builds a sentence from level, score, beat and transition.
Bridge: `GET /events` (SSE; `event: state`, data = validated JSON, plus `event: ping`), `GET /state`, `GET /health` -> `{ok, hasState, lastError, warnings[], clients}`. Port 43210, bind 127.0.0.1, accepts Host `localhost:43210` and `127.0.0.1:43210`.

## C4. Param protocol (main thread to Worklet)

SAB (`SharedArrayBuffer`, 4 + 8*4 bytes... laid out as `Int32Array(1)` seq then `Float32Array(8)` params). Writer sets seq odd, writes, sets seq even (Atomics). Reader accepts only a stable even seq. Fallback `port.postMessage({type:'params', p: Float32Array})`. Telemetry: SPSC ring of interleaved stereo float32, 8192 frames, plus `Int32Array(2)` write and read indices; decimation by 4 in the Worklet.
Worklet message types: `init {wasm: ArrayBuffer|Module, sab?, tele?, sampleRate}`, `params`, `stats-request` -> `stats {peak, rms, frames, nonZero}`.
