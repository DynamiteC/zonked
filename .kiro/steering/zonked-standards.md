---
inclusion: always
---

# Zonked Standards

These rules bind every change. A change that breaks one is a defect, even if tests pass.

## 1. DSP core (`crates/dsp-core`)

- Crate attribute: `#![no_std]`. No `alloc`, no `std`, no `libm`. All state lives in fixed-size structs.
- Zero allocation after construction. No `Vec`, `Box`, `String`, no heap in any form.
- `O(1)` per frame: rendering one 128-sample frame costs a fixed, input-independent number of operations per sample. No loops bounded by input values, no recursion.
- Zero panics. Deny in `lib.rs`: `clippy::unwrap_used`, `clippy::expect_used`, `clippy::panic`, `clippy::indexing_slicing`, `clippy::arithmetic_side_effects` where practical. Use `wrapping_*`, `saturating_*`, masked indices and `get()`. Release profile sets `panic = "abort"`; the panic handler traps and is never expected to run.
- Phase is a `u64` fixed-point accumulator (full turn = 2^64). Increment is computed from the clamped frequency once per parameter update, not per sample.
- No NaN or infinity may reach output. Sanitize every `f32` input with `is_finite()` before use; fall back to the last good value.
- Parameter changes use per-sample one-pole exponential smoothing. A step in frequency or gain must never produce a discontinuity audible as a click.
- The last stage is a brickwall limiter. Output is always within `[-0.95, 0.95]`.
- Randomness: Xoshiro256** with a fixed seed constructor. No OS entropy in the core.

## 2. Hearing safety

| Parameter | Allowed range | On violation |
|---|---|---|
| Carrier frequency | 20 Hz to 1500 Hz | clamp |
| Beat offset (delta f) | 0.5 Hz to 40 Hz | clamp |
| Master gain | 0.0 to 0.85 | clamp |
| Output sample | -0.95 to 0.95 | hard limit |

- Clamp in three places: the `.sbg` parser (with a line-numbered warning), the AudioWorklet message layer, and `dsp-core` itself. The core is the last line of defense and must be correct alone.
- Playback starts with a gain ramp of at least 2 seconds. Stop and pause ramp down over at least 250 ms.
- The UI shows a headphone and volume notice before first playback. It states that binaural beats need stereo headphones and that Zonked is not a medical device. Photosensitive users get a reduced-motion mode that disables eye pulsing and the pacer flash.
- Isochronic and visual pulses never exceed 3 flashes per second in any full-screen luminance change.

## 3. Web security

- `web/public/_headers` must contain, at minimum:
  - `Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws://localhost:43210 http://localhost:43210; object-src 'none'; base-uri 'none'; frame-ancestors 'none'` (project decision: inline styles allowed for React style props; scripts stay strict)
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: no-referrer`
  - `Cache-Control: public, max-age=31536000, immutable` for hashed `/assets/*`
- No network at run time. Vetted licensed loops may be bundled; every file is listed in `docs/SAMPLES-LICENSES.md` and checked by `scripts/check-samples.mjs`. No remote audio, no download of any sound at run time.
- No inline scripts, no inline event handlers, no `eval`, no `new Function`, no `innerHTML` with dynamic data. Inline `style` attributes are allowed; inline `<script>` is not.
- The `.sbg` parser caps input at 256 KB and 500 events, reports errors with line numbers, and never executes input.
- Imported files and bridge messages are untrusted. Validate with explicit schemas. Reject unknown versions.

## 4. Crew bridge

- Zero runtime dependencies. Node built-ins only.
- Bind `127.0.0.1` only. Check the `Host` header (DNS rebinding) and allow-list `Origin`.
- Read-only toward the project: the bridge reads `.zonked-state.json` and never writes it or runs commands.
- State file is untrusted data. Cap size (64 KB), validate schema, clamp values, re-parse any embedded `.sbg` text with the same limits as the web parser.

## 5. Code quality

- Functions under 50 lines, files under 400 lines typical, 800 max. No deep nesting.
- Immutable data by default in TypeScript. Explicit error handling. No silent catches.
- TypeScript: `strict`, `noUncheckedIndexedAccess`, no `any`.
- Tests: DSP and parser at 90 percent or higher line coverage of logic; whole repo at 80 percent or higher.
- Tests must cover the safety bounds with out-of-range, NaN and infinity inputs.

## 6. Process and style

- Plan from `.kiro/specs/zonked-core/`. Do not widen scope without updating the spec.
- Commit on a feature or bugfix branch from the latest base. Pull and merge the base before committing. Never push. No model name or AI attribution in commits.
- No emoji, no em-dashes, no section sign in any produced text, code or docs. Use colons or commas.
