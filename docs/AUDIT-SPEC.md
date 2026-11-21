# Spec compliance audit

Date: 2026-11-21. Scope: .kiro/specs/zonked-core/requirements.md R1..R6 plus the final brief.

## Test suites (run live)

| Suite | Command | Result |
|---|---|---|
| dsp-core | `cd crates/dsp-core && cargo test` | 19 passed (2 unit, 17 integration), 0 failed |
| web | `cd web && npx vitest run` | 93 passed, 7 files, 0 failed |
| web scripts | `cd web && npm run test:scripts` | 9 passed, 0 failed |
| crew-bridge | `cd crew-bridge && npm test` | 42 passed, 0 failed |
| docs | `cd docs && npm run build:deck` | "built 8 slides", exit 0 (note: this rewrote docs/Zonked-Kiroween-Deck.pptx, now shown as modified in git) |

## Warnings

- README.md does not exist at the repo root. R5.6 is missing. Only crates/dsp-core/README.md, crew-bridge/README.md and media/README.md exist.
- `wasm-pack build ../crates/dsp-core --target web --release` fails with cargo 1.81: "Ensure that you have wasm-bindgen as a dependency in your Cargo.toml". wasm-pack 0.x is present in web/node_modules/.bin, but the crate is a plain C-ABI cdylib with no wasm-bindgen. The cargo compile step itself succeeded. web/scripts/build-wasm.mjs falls back to `cargo build --target wasm32-unknown-unknown`, so the shipped build works, but R1.15 as literally worded ("with wasm-pack --target web") is not met.
- tasks.md has only 2 of 43 boxes ticked (`[x]` lines 6 and 7); 41 are `[ ]` although the work is largely done.
- Last preset is named "Classic 1998 SBaGen Demo" (web/src/sbg/presets/index.ts:88). The later brief says "Resurrected 2018 Preset". No occurrence of "Resurrected" in web/src or docs.
- Logo: the four grill bars have no ids (one path, web/public/logo.svg, `M190 392V426M226 392V426M286 392V426M322 392V426`).

## Requirement table

| Id | Status | Evidence | Fix |
|---|---|---|---|
| R1.1 | met | crates/dsp-core/src/lib.rs:7 `#![no_std]`; cargo test passes | none |
| R1.2 to R1.14 | met (tested) | 17 integration tests plus 2 unit tests pass; web worklet render test "finite, bounded, non-zero" passes | none |
| R1.15 | partial | wasm-pack fails (no wasm-bindgen dep); fallback cargo wasm32 build in web/scripts/build-wasm.mjs:30-41; web/src/wasm/dsp_core.wasm shipped | Either add wasm-bindgen (breaks pure C-ABI) or reword R1.15 to "wasm32-unknown-unknown, wasm-pack optional". Check cargo/wasm-pack versions if brief demands wasm-pack |
| R2.1 to R2.3 | partial | agents dir exists at .kiro/crew/agents; not runtime-verified here | Confirm each agent file writes the named JSON |
| R2.4 to R2.9 | met (tested) | crew-bridge npm test 42 passed | none |
| R2.10 to R2.12 | met (tested) | vitest app.test.tsx 9 passed | none |
| R3.1 to R3.6 | met (tested) | vitest 93 passed incl. sbg parser | none |
| R3.7 to R3.10 | met (tested) | vitest worklet/audio tests; assets/worklet-*.js in precache | none |
| R3.11 | partial | web/src/sbg/presets/index.ts:57,63,69,75,82,88: six names present. Names are "Deep Focus", "Flow State", "AI Burnout Reset", "Breathwork Sync", "Deep Rest", "Classic 1998 SBaGen Demo". Frequencies in comments: 40 Hz, 18 Hz, 10 to 6 Hz, 5.5 Hz, 2.5 Hz | Rename sixth to "Resurrected 2018 Preset" if the later brief governs; align spec |
| R3.12 | met | smoothing tests pass | none |
| R4.1 | met | web/public/logo.svg: viewBox 0 0 512 512, width/height 512, ids eye-left, eye-right, phase-diamond, plate-left/right, ear-left/right; colors #0A0B0F, #FFE600 to #FFB800 gradient, #00E5A8 diamond | Optionally add ids to the four grill bars |
| R4.2, R4.3 | met | Mascot.tsx, Pacer.tsx handle reduced motion; app.test.tsx | none |
| R4.4 | partial | oscilloscope present; 60 fps not measured in this audit | Add or cite a frame-rate check |
| R4.5, R4.6 | met | Pacer.tsx; app.test.tsx | none |
| R4.7 | met | web/dist/sw.js precacheAndRoute includes assets/dsp_core-zHdoO2xY.wasm, assets/worklet-rUuA16AZ.js, index html, css, js; vite.config.ts globPatterns includes wasm | none |
| R4.8 | met | web/src/storage/db.ts (IndexedDB); fake-indexeddb tests | none |
| R4.9, R4.10 | met (tested) | app.test.tsx | none |
| Media Session | met | web/src/app/mediaSession.ts | none |
| Icons | met | web/public: pwa-192x192.png, pwa-512x512.png, maskable-512x512.png, apple-touch-icon.png, favicon.svg; manifest in vite.config.ts:25-45 | none |
| R5.1 | met | web/public/_headers CSP is byte-identical to standards.md line 38 string; also COOP, COEP, CORP, nosniff, Referrer-Policy no-referrer, X-Frame-Options, Permissions-Policy. audit-security tests pass | none |
| R5.2 | met | audit:security tests "html: inline script and handlers" pass | none |
| R5.3 | met | the host config file in web/: name = "zonked", compatibility_date = "2026-11-01", [assets] directory = "./dist", not_found_handling = "single-page-application" | none |
| R5.4 | met | _headers `/assets/*` Cache-Control public, max-age=31536000, immutable | none |
| R5.5 | partial | script web/scripts/verify-e2e.mjs and `verify:e2e` exist; not executed in this audit (needs browser) | Run `npm run verify:e2e` and record result |
| R5.6 | missing | No README.md at the repo root | Create root README: Crew workflow, Bridge, PWA, build |
| R6.1 | met | R4.7 plus R2.10 | none |
| R6.2, R6.3 | partial | limiter and clamps tested; style rules (no emoji, no em-dash) not scanned here | Run a grep for em-dashes and emoji over repo |

## Brief items

| Item | Status | Evidence |
|---|---|---|
| wasm-pack target web build | partial | Fails, see warnings |
| Six presets exact names | partial | Sixth name differs from later brief |
| logo.svg structure | met | See R4.1 |
| Icons | met | See Icons |
| PWA precache wasm and worklet | met | dist/sw.js |
| IndexedDB, Media Session | met | db.ts, mediaSession.ts |
| Headers vs project CSP | met | exact match |
| host config fields | met | exact |
| Docs: HLD, LLD, pptx 8 slides, deck.html | met | docs/HLD.md, LLD.md, pptx has 8 slide parts, deck.html has 8 `class="slide` matches |
| Media under 3 min | met | media/zonked-demo.mp4 duration 120.0 s |
| Root README | missing | none |
| tasks.md tick state | partial | 2 ticked, 41 unticked |
