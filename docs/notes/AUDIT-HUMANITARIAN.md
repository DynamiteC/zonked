# Audit: humanitarian layer (Sanctuary) and the lively release

Scope: `web/src/ui/sanctuary/**`, `web/src/app/{mixes,favorites,milestones,backup}.ts`, `web/src/storage/db.ts` (version 2), the player additions (`getMixDraft`, `playMix`, `setBeatOverride`, `setNoiseOverride`, `SessionLog.endKind`, `SessionLog.breaks`), and the integration gates for the whole branch `feature/zonked-lively-humanitarian`. Measured on 2026-11-21.

## Gate results

| Gate | Command | Result |
|---|---|---|
| DSP tests | `cargo test --manifest-path crates/dsp-core/Cargo.toml` | 4 + 22 + 23 + 10 = 59 passed, 0 failed |
| DSP lint | `cargo clippy ... --all-targets -- -D warnings` | clean |
| Bridge | `npm --prefix crew-bridge test` | tests 45, pass 45, fail 0 |
| Unit tests | `cd web && npx vitest run` | 35 files, 331 tests passed |
| Types | `npx tsc --noEmit` | 0 errors |
| Build | `npm run build` | ok, wasm 38,564 bytes, no imports, precache 36 entries (665.83 KiB) |
| Bundle | `npm run check:bundle` | JS 100.09 KB + CSS 4.88 KB = 104.96 KB gzip, budget 110 KB, PASS |
| Security audit | `npm run audit:security` | passed |
| Script tests | `npm run test:scripts` | pass 9, fail 0 |
| End to end | `npm run verify:e2e` | 73/73 checks passed (server: local dev server) |
| Coverage | `npx vitest run --coverage` | whole web: lines 91.15 percent, statements 89.42, branches 82.79, functions 83.24 |
| Text scan | python scan of 232 tracked and changed text files | 0 em-dashes, 0 section signs, 0 emoji |
| Radius scan | all css in `web/src` | 0 non-zero `border-radius` |
| Asset scan | `web/src` and `web/dist` | 0 audio files. URLs only `localhost:43210`, `www.w3.org`, and 3 library error strings (`react.dev/errors`, workbox `bit.ly`) that are never fetched |

Coverage of logic files (lines): `backup.ts` 100, `favorites.ts` 100, `milestones.ts` 100, `mixes.ts` 98.4, `sbg/*` 99.2 to 100, `audio/params.ts` 100, `audio/telemetry.ts` 100, `audio/worklet-core.ts` 100, `audio/dsp-wasm.ts` 100. `audio/engine.ts` and `audio/worklet.ts` (AudioContext and AudioWorkletProcessor glue, about 250 lines) run only in a browser and are covered by the e2e checks 2 to 7, 10, A1 to A3, not by vitest.

Rust has no coverage tool in this repo (no tarpaulin or llvm-cov installed). Test names by module are listed in `.work/integrator2.md` and in `crates/dsp-core/tests/{dsp,layers,sound}.rs`.

## Promise and how it is kept

| Promise | Mechanism | Proof |
|---|---|---|
| No account, ads or tracking | No such code; no third-party scripts | audit:security, asset scan |
| No network | No fetch, XHR, WebSocket or beacon in the Sanctuary. Export is a Blob download, import reads a local File | vitest stubs fetch; e2e H8 |
| Works offline | IndexedDB storage | e2e H7, check 7 |
| No notifications | Reminder is one in-app line, once per local day, off by default | milestones tests |
| User owns the data | Export one JSON file; Delete everything clears mixes, records and logs in one transaction | e2e H4, H10 |

## Hearing safety review

Every path that can change the sound was traced to a clamp:

- UI dial and sliders: `setBeatOverride` clamps 0.5 to 40 Hz and ignores non-finite values; `setNoiseOverride` clamps level 0 to 1 and accepts only known kinds; `setLayerOverride` uses `clampLayerValue`; `nudgeGain` keeps the final gain at most 0.85.
- Saved mixes and imported files: `cleanDraft` and `parseMix` clamp carrier 20 to 1500, beat 0.5 to 40, gain 0 to 0.85, noise 0 to 1, layers, timers and overrides. `playMix` clamps again.
- Crew messages: `crew.ts` validates and clamps. The player now also clamps a forged crew target (carrier, beat, gain, transition) and turns a non-finite gain into silence (added in this round).
- Last line: `params.ts clampVoice` and `dsp-core` clamp every slot, and the limiter holds output within plus or minus 0.95.
- Test: `web/src/app/playerSafetySweep.test.ts` pushes NaN, plus and minus Infinity, plus and minus 1e9, 5 and minus 5 through every player API, a forged crew state and an imported mix, and asserts every voice sent to the engine stays in bounds.
- Safety gate: Play, picker cards, Quick Start picks and saved mixes start through `guarded()`. e2e Q3 proves the engine waits for accept; W3 loads a saved mix through the same path.

Photosensitivity: all repeating animations last 2 s or more (drift 40 s, glow 6 s, bars 3 s, mascot breathing 5 s, blink 6 s). The tooltip fade (120 ms) runs once and is not repeated. All are off under reduced motion: e2e M4, T4, S8, H12.

## Untrusted input

- File size: 256 KB cap, checked on `File.size` before reading, and again on the text.
- Envelope: `app` must be `zonked`, `kind` `sanctuary`, `v` exactly 1. Unknown or missing versions are rejected.
- Mix count: more than 200 in a file rejects the file. The store refuses a 201st mix.
- Fields are read with `Object.hasOwn` and copied by known key into new objects. `__proto__`, `constructor` and inherited fields are ignored (tested).
- Names lose control characters and are capped at 60 characters. Ids match `[A-Za-z0-9_.:-]{1,64}`. Text is rendered by React, never as HTML.
- Imported mixes get new ids and unused names. Imports never start audio.

## Storage v2 and milestones

See `docs/LLD.md` sections 27 and 28. The v1 to v2 upgrade keeps scripts and logs (tested with a real v1 database in fake-indexeddb).

## Fixed in this round

- Stale state in `useSanctuaryData`: "Show milestones" followed quickly by "Reset" wrote the old hidden flag back. Patches now read a ref with the latest state. This was the intermittent vitest failure.
- Square radio buttons and file button inside the Sanctuary (Chromium drew them round).
- Duplicate section titles in four Sanctuary panels.
- Preset select spilling past the stage frame when a drawer is open (`web/src/styles/lively.css`).

## Not testable here

- Listening by ear: comfort, loudness balance, piano and violet quality.
- Firefox and Safari (IndexedDB eviction after about 7 days in Safari, file picker, downloads).
- Screen readers (roles, labels and live regions exist; no VoiceOver or NVDA run).
- Headers on a real production host (only the local dev server was checked).
- Real time zones and daylight saving changes (fake offsets only).
- Rust line coverage (no tool installed).
