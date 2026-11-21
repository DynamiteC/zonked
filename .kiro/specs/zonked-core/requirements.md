# Zonked Core: Requirements (EARS)

Terms: **Engine** is `crates/dsp-core`. **Worklet** is the AudioWorkletProcessor hosting the Engine. **Bridge** is `crew-bridge`. **App** is the `web/` PWA. **Crew** is the three Kiro Crew agents. **State file** is `.zonked-state.json`.

## R1. DSP engine (Phase 1)

- R1.1 The Engine shall be built with `#![no_std]` and shall perform no heap allocation.
- R1.2 When asked to render a frame of N samples (N from 1 to 128), the Engine shall complete in time independent of parameter values.
- R1.3 The Engine shall not panic for any input, including NaN, infinity and out-of-range values.
- R1.4 The Engine shall generate left and right sine channels at `f_L = f_c - df/2` and `f_R = f_c + df/2` from `u64` phase accumulators.
- R1.5 While a frequency changes, the Engine shall keep each oscillator phase continuous (no reset, no jump).
- R1.6 When a carrier frequency outside 20-1500 Hz is requested, the Engine shall clamp it to the nearest bound.
- R1.7 When a beat offset outside 0.5-40 Hz is requested, the Engine shall clamp it to the nearest bound.
- R1.8 When a master gain above 0.85 is requested, the Engine shall clamp it to 0.85. Negative gain shall clamp to 0.
- R1.9 Where isochronic mode is selected, the Engine shall modulate the carrier with a raised-cosine gate at the beat rate.
- R1.10 Where monaural mode is selected, the Engine shall output the sum of the two tones identically on both channels.
- R1.11 Where a noise bed is enabled, the Engine shall mix white, pink or brown noise from a Xoshiro256** generator at a level from 0 to 1.
- R1.12 When a parameter target changes, the Engine shall move to it by per-sample exponential smoothing with a time constant of at least 20 ms for gain and 50 ms for frequency.
- R1.13 The Engine shall pass every output sample through a brickwall limiter so that the output is within [-0.95, 0.95].
- R1.14 If a parameter input is not finite, then the Engine shall keep the previous valid value.
- R1.15 The Engine shall build to `wasm32-unknown-unknown` with `wasm-pack --target web` and expose a C-ABI surface of fixed-size buffers.

## R2. Crew and bridge (Phase 2)

- R2.1 The `burnout-sentinel` agent shall write `.zonked-signals.json` containing commit velocity, session duration, build failures, dirty file count and a 0-100 score.
- R2.2 When the signals file changes, the `acoustic-sequencer` agent shall write `.zonked-state.json` with a target preset, beat, carrier, gain and transition time.
- R2.3 The `dsp-verifier` agent shall write `.zonked-verify.json` after each change in `crates/dsp-core/`.
- R2.4 The Bridge shall listen on `127.0.0.1:43210` only.
- R2.5 When the state file changes, the Bridge shall validate it and push an event to every connected App within 500 ms.
- R2.6 If the state file is larger than 64 KB, malformed, or of an unknown version, then the Bridge shall ignore it and report the reason on `/health`.
- R2.7 If a request has a `Host` not in `{127.0.0.1:43210, localhost:43210}` or an `Origin` not on the allow-list, then the Bridge shall answer 403.
- R2.8 The Bridge shall not write to the project directory and shall not execute commands.
- R2.9 The Bridge shall have zero runtime dependencies.
- R2.10 While the Bridge is unreachable, the App shall run in standalone mode with no error dialogs.
- R2.11 While connected to the Bridge, the App shall show "Crew Synced" and a burnout meter.
- R2.12 If the Bridge connection drops, then the App shall retry with exponential backoff capped at 30 seconds and keep playing the current sound.

## R3. Parser and audio bridge (Phase 3)

- R3.1 The parser shall accept SBaGen `.sbg` text and return events, warnings and errors.
- R3.2 If input exceeds 256 KB, then the parser shall reject it with one error.
- R3.3 If input defines more than 500 events, then the parser shall stop and report an error with the line number.
- R3.4 The parser shall attach a line number to every diagnostic.
- R3.5 The parser shall not use `eval`, `Function` or dynamic code of any kind.
- R3.6 When a parsed value is outside a safety bound, the parser shall clamp it and emit a warning with the line number.
- R3.7 The Worklet shall instantiate the Engine from WASM bytes supplied by the main thread.
- R3.8 The main thread shall send parameters through a lock-free shared-memory protocol; the Worklet shall never block or allocate on the audio thread.
- R3.9 Where `SharedArrayBuffer` is unavailable, the App shall fall back to `postMessage` parameter updates.
- R3.10 The Worklet shall publish stereo samples to a lock-free ring buffer for oscilloscope and Lissajous drawing.
- R3.11 The App shall ship six presets: Deep Focus (40 Hz gamma), Flow State (18 Hz beta), AI Burnout Reset (10 Hz alpha to 6 Hz theta), Breathwork Sync (5.5 Hz theta with 6-breath pacer), Deep Rest (2.5 Hz delta), Classic 1998 SBaGen Demo.
- R3.12 When a preset or sequence event changes the target, the App shall cross-fade by the Engine smoothing, with no audible click.

## R4. UI and PWA (Phase 4)

- R4.1 The App shall show the yellow Zonked mask at `web/public/logo.svg` as the main control.
- R4.2 While playing, the two eyes shall pulse in sync with `f_L` and `f_R` scaled to a visible rate of at most 3 Hz.
- R4.3 Where reduced-motion is requested by the OS or the user, the App shall disable eye pulsing and pacer flashing.
- R4.4 The App shall draw a dual-channel oscilloscope at 60 fps.
- R4.5 When recovery mode starts, the App shall show a Breathe In / Breathe Out pacer at 5.5 breaths per minute by default.
- R4.6 Before first playback, the App shall show a headphone, volume and not-a-medical-device notice that the user must accept.
- R4.7 The App shall precache all HTML, JS, CSS, Worklet and `.wasm` assets and shall run fully with the network off.
- R4.8 The App shall store custom `.sbg` scripts and recovery logs in IndexedDB.
- R4.9 The App shall let the user import and export `.sbg` files and shall show parser diagnostics with line numbers.
- R4.10 The App shall be operable by keyboard and expose labels for assistive technology.

## R5. Security, verification, hosting (Phase 5)

- R5.1 The App shall be served with the headers in `.kiro/steering/zonked-standards.md` section 3.
- R5.2 The App shall contain no inline script and no `eval`.
- R5.3 the host config file shall set `name = "zonked"`, `compatibility_date = "2026-11-01"`, `[assets] directory = "./dist"` and `not_found_handling = "single-page-application"`.
- R5.4 Hashed `.wasm` and `.js` assets shall carry `Cache-Control: public, max-age=31536000, immutable`.
- R5.5 `npm run verify:e2e` shall check production headers, non-zero and bounded PCM from the Worklet, preset transitions, and offline reload through the Service Worker.
- R5.6 The README shall document running the Crew workflow, the Bridge, the PWA and how to build the static site.

## R6. Cross-cutting

- R6.1 The App shall work with no Bridge and no network after first load.
- R6.2 Where a requirement conflicts with a hearing-safety bound, the bound shall win.
- R6.3 All shipped text and code shall follow the style rules in the steering file.
