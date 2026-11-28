# AGENTS.md: Zonked

Zonked is an acoustic recovery companion for AI-assisted coding sessions. A Rust `no_std` WASM DSP engine runs inside an `AudioWorklet`. A Kiro Crew workflow watches session intensity and steers the sound between focus, recovery and decompression states.

Read `.kiro/steering/zonked-standards.md` first. It is the binding rule set. This file is the map.

## Layout

| Path | Job |
|---|---|
| `crates/dsp-core/` | `#![no_std]` DSP: oscillators, noise, smoothing, limiter. Built to WASM. |
| `crew-bridge/` | Zero-dependency TypeScript CLI. Watches `.zonked-state.json`, serves it on `127.0.0.1:43210`. |
| `web/` | Vite + React + TypeScript PWA: `.sbg` parser, AudioWorklet bridge, mascot UI, static server headers (`_headers`). |
| `.kiro/specs/zonked-core/` | Requirements (EARS), design, tasks. Source of truth for scope. |
| `.kiro/crew/` | Crew manifest and agent instructions: `burnout-sentinel`, `acoustic-sequencer`, `dsp-verifier`. |
| `.kiro/hooks/` | `verify-dsp.json`: runs DSP tests when `crates/dsp-core/` changes. |
| `legacy/` | Read-only reference from the 2018 Android app and SBaGen. Never imported by shipped code. |

## Hard rules (summary)

1. `crates/dsp-core` is `#![no_std]`, allocation-free, `O(1)` per 128-sample frame, and must never panic.
2. Carrier `20-1500 Hz`. Beat offset `0.5-40 Hz`. Master gain `<= 0.85`. Output hard-limited to `[-0.95, 0.95]`. Clamp every input; never reject silently, never exceed.
3. CSP is `script-src 'self' 'wasm-unsafe-eval'`. `COOP: same-origin` and `COEP: require-corp` ship in `web/public/_headers`.
4. No `eval`, no `new Function`, no remote scripts, no analytics, no network at run time except the optional loopback bridge. Vetted licensed loops may be bundled; every file is listed in `docs/SAMPLES-LICENSES.md` and checked by `scripts/check-samples.mjs`.
5. Treat `.sbg` files and `.zonked-state.json` as untrusted input. Parse with hard size and count limits.
6. The web app works fully offline and fully standalone. The bridge only adds a layer.

## Commands

```bash
cargo test --manifest-path crates/dsp-core/Cargo.toml          # DSP unit tests
cargo clippy --manifest-path crates/dsp-core/Cargo.toml --all-targets -- -D warnings
wasm-pack build crates/dsp-core --target web --release           # WASM build
npm --prefix crew-bridge test                                    # bridge tests
npm --prefix web run dev | build | test | verify:e2e             # PWA
```

## Workflow

- Work from `.kiro/specs/zonked-core/tasks.md`. Do one phase at a time. Tick tasks as they pass.
- Test first for DSP and parser code. A phase is done only when its listed checks pass.
- Commits: separate branch (`feature/`, `bugfix/`), never push, no model or AI attribution in messages.
- Writing style: no emoji, no em-dashes, no section sign in any file.
- Do not edit `legacy/`. Do not add runtime dependencies to `crew-bridge/`.
- When unsure about a safety bound, choose the safer value and note it in the design doc.
