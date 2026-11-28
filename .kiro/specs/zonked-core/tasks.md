# Zonked Core: Tasks

Order is strict. A phase is done when every box is ticked and its gate passes.

## Phase 0: Harness (done)
- [x] AGENTS.md, steering, hook, crew manifest, three agent files
- [x] Spec: requirements, design, tasks
- [x] Spec review (gate: approval to proceed)

## Phase 1: Rust no_std DSP (`crates/dsp-core`)
Gate: `cargo test`, `cargo clippy -D warnings`, `wasm-pack build --target web --release` all pass.
- [x] 1.0 Install `wasm32-unknown-unknown` target and `wasm-pack`; create crate, `Cargo.toml` (`crate-type = ["cdylib","rlib"]`, release `panic = "abort"`, `opt-level = 3`, `lto`), lint attributes (R1.1, R1.3)
- [x] 1.1 `params.rs`: clamps and sanitizers; tests for bounds, NaN, infinity (R1.6-1.8, R1.14)
- [x] 1.2 `phase.rs`: u64 accumulator and polynomial sine; tests for accuracy and phase continuity across frequency steps (R1.4, R1.5)
- [x] 1.3 `smooth.rs`: one-pole smoothing; test step response and no discontinuity above threshold (R1.12)
- [x] 1.4 `noise.rs`: Xoshiro256**, white, pink, brown; tests for determinism, mean near 0, spectral slope (pink about -3 dB/oct, brown about -6 dB/oct) via Goertzel bins (R1.11)
- [x] 1.5 `limiter.rs`: brickwall; test bound under extreme input (R1.13)
- [x] 1.6 `engine.rs`: binaural, monaural, isochronic modes; test L/R frequency accuracy by zero-crossing and Goertzel (R1.4, R1.9, R1.10)
- [x] 1.7 `abi.rs`: C exports and param block; test via rlib calls (R1.15)
- [x] 1.8 Frame cost test: fixed op count independent of params (R1.2); allocation-free review by `dsp-verifier`
- [x] 1.9 `wasm-pack build` and size report

## Phase 2: Crew app and bridge (`crew-bridge/`, `.kiro/crew/`)
Gate: `npm --prefix crew-bridge test` passes; manual SSE check with curl.
- [x] 2.1 Scaffold TypeScript project, `tsconfig` strict, `node:test` (R2.9)
- [x] 2.2 `validate.ts` with clamps and size cap; tests including hostile input (R2.6)
- [x] 2.3 `watch.ts` debounced directory watcher; tests with temp dirs (R2.5)
- [x] 2.4 `server.ts` SSE, `/state`, `/health`, Host and Origin checks; tests (R2.4, R2.7, R2.8)
- [x] 2.5 `cli.ts` and `bin` entry; `--help`; graceful shutdown
- [x] 2.6 Sample state fixtures and a `scripts/fake-crew.mjs` that cycles score 10 to 90 as a simulated crew feed, for demos without a Kiro Crew host
- [x] 2.7 Dry-run the three agents' instruction files against fixtures (`kirocrew agent validate .kiro/crew/agents`)

## Phase 3: Parser and AudioWorklet bridge (`web/src/sbg`, `web/src/audio`)
Gate: `npm --prefix web test` passes.
- [x] 3.1 Scaffold Vite + TS + vitest in `web/` (strict, no `any`)
- [x] 3.2 Lexer and parser with limits and line-numbered diagnostics; fuzz tests, 256 KB and 500-event limits (R3.1-3.6)
- [x] 3.3 Sequencer with ramps; tests with a fake clock (R3.12)
- [x] 3.4 Six presets as `.sbg` files, each parsed in tests (R3.11)
- [x] 3.5 Seqlock param protocol and telemetry ring; tests for torn reads and overflow (R3.8, R3.10)
- [x] 3.6 Worklet and main-thread engine controller with `postMessage` fallback (R3.7, R3.9)
- [x] 3.7 Copy built WASM into `web/src/wasm/` via a build script

## Phase 4: UI and offline PWA (`web/src/ui`, `web/public`)
Gate: manual run in Chrome, Lighthouse PWA installable, production build works offline.
- [x] 4.1 `logo.svg` redraw with separable eyes (R4.1)
- [x] 4.2 Mask controller, eye pulse, reduced-motion handling (R4.2, R4.3)
- [x] 4.3 Oscilloscope and Lissajous canvas at 60 fps (R4.4)
- [x] 4.4 Pacer and recovery mode (R4.5)
- [x] 4.5 Safety notice gate (R4.6)
- [x] 4.6 Preset picker, `.sbg` editor with diagnostics, import and export (R4.9)
- [x] 4.7 Bridge client: SSE, backoff, Crew Synced badge, burnout meter (R2.10-2.12, R4.x)
- [x] 4.8 IndexedDB storage for scripts and recovery logs (R4.8)
- [x] 4.9 `vite-plugin-pwa`, manifest, icons (R4.7)
- [x] 4.10 Keyboard and ARIA pass (R4.10)

## Phase 5: Hardening, E2E, hosting
Gate: `npm --prefix web run verify:e2e` green on production build.
- [x] 5.1 `web/public/_headers` (R5.1, R5.4)
- [x] 5.2 `the host config file in web/` (R5.3)
- [x] 5.3 Static scan: no `eval`, `new Function`, inline script, `innerHTML` (R5.2)
- [x] 5.4 Playwright script: headers, PCM non-zero and bounded, preset transitions, offline reload (R5.5)
- [x] 5.5 README: Crew workflow, bridge, PWA, build (R5.6)
- [x] 5.6 Final verification run and dsp-verifier report
