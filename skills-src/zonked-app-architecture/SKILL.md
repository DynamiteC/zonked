---
name: zonked-app-architecture
description: "Use when starting work in the Zonked repo or splitting it across parallel workers: where code lives, how data flows standalone and inside Kiro Crew, file ownership rules, the verification gates, public-repo rules and commit rules. Read before editing."
---

# Zonked architecture map

Zonked is an acoustic recovery companion. A Rust `no_std` WASM engine runs
inside an AudioWorklet. A web app plays and controls it. An optional Kiro Crew
layer steers the sound from coding-session signals. Read `AGENTS.md` and
`.kiro/steering/zonked-standards.md` first; they are binding. If this skill
differs from them or from the code, the code and those files win.

## Layout

| Path | Job |
|---|---|
| `crates/dsp-core/` | `#![no_std]` DSP: oscillators, noise, layers, smoothing, limiter. Built to WASM. |
| `web/` | Vite + React + TypeScript PWA: `.sbg` parser (`src/sbg`), audio engine and worklet (`src/audio`), player and timers (`src/app`), catalog and recommender (`src/catalog`), storage, UI. |
| `crew-bridge/` | Zero-dependency Node CLI. Watches `.zonked-state.json`, serves it on `127.0.0.1:43210` (SSE). |
| `app/` | The Kiro Crew app: `app.json`, `agents/`, `skills/`, `ui/`. Reuses the web engine. |
| `skills-src/` | Source of truth for skills. `app/skills/` copies from here. |
| `.kiro/` | `steering/` standards, `specs/` requirements and design, `crew/` agents and `crew.yaml`, `hooks/`. |
| `docs/` | HLD, LLD, audits, research, sound notes, deck. |
| `legacy/` | Read-only third-party reference. Never edit, never import. |
| `scripts/` | Repo gates (privacy, chars, sizes, verify-all). |

## Data flow

Standalone (always works, offline):

```
user -> web UI -> player -> engine -> AudioWorklet -> dsp-core (WASM) -> speakers
```

With the Crew layer (optional):

```
session signals -> burnout-sentinel -> acoustic-sequencer -> .zonked-state.json
  -> crew-bridge (validate, clamp) -> SSE -> web client (validate again) -> player
```

Inside Kiro Crew as an app: the app page mounts the same engine and player. The
app may read or write state through its declared permissions only. Verify the
exact wiring in `docs/APP-SPIKE.md` and in `app/app.json`; it was still being
decided when this skill was written.

Every hop treats its input as untrusted: size caps, schema checks, clamps. The
bound values live in the `zonked-hearing-safety` skill.

## File ownership for parallel workers

- Each worker owns named paths and writes only there. List them in the brief.
- Never edit a file another worker owns. Ask the owner or record the need in your report.
- Shared files (`AGENTS.md`, `README.md`, `package.json`, `.kiro/steering/`) need a named owner.
- Workers do not run `git add`, `commit`, `checkout`, `stash`, `push`, `reset` or `amend`. An integrator commits.
- Report to `.work/<name>.md` with files changed, gates run and unknowns.

## Gates

| Command | Checks |
|---|---|
| `npm run verify:all` | Every stage: cargo test, clippy, WASM build, bridge tests, web tests, type check, security audit, bundle size, E2E, scripts |
| `npm --prefix web run check:privacy` | No personal info, local paths, live URLs, hosting words |
| `npm run check:chars` | No emoji, em-dash or section sign |
| `npm run check:sizes` | Source files at most 800 lines (warn at 400) |
| `cargo test --manifest-path crates/dsp-core/Cargo.toml` | DSP unit tests |
| `npm --prefix web test` | Web unit tests |

Run the narrow gate while you work, then the privacy and char checks on your
files before you report.

## Public repo rules

- No personal names, emails, account ids, local absolute paths or live URLs.
- No hosting or release-to-web steps in any file.
- No analytics, remote scripts, CDN or audio downloads.
- No emoji, em-dashes or the section sign anywhere. Use colons or commas.
- `crew-bridge/` gets no runtime dependencies. `crates/dsp-core` gets no `std`.
- Do not edit `legacy/`.

## Commit rules

- Work on a `feature/` or `bugfix/` branch. Pull and merge the base before committing.
- Never push. Commit messages carry no model name and no AI attribution, and no co-author trailer.
- Use the neutral repo identity already configured. Never edit git config.

## Where the specs are

- `.kiro/specs/zonked-core/` and `.kiro/specs/zonked-library/`: requirements, design, tasks, contracts.
- `docs/HLD.md`, `docs/LLD.md`: design as built.
- `docs/AUDIT-*.md`, `docs/RESEARCH.md`, `docs/SOUNDS.md`.

Do not widen scope without updating the spec.

## Sources

- `AGENTS.md`, `README.md`, `docs/HLD.md`, root and `web/` `package.json`, `scripts/verify-all.mjs`, `scripts/check-sizes.mjs`.
