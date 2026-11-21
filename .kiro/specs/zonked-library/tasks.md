# Zonked Library: Tasks

Wave 1 (parallel, disjoint files)
- [x] DSP layers in crates/dsp-core (agent: dsp)
- [x] Catalog DSL, 210+ templates, recommender, tests (agent: catalog)
- [x] Player timers, queue, wake lock, media session, shortcuts table, layer mapping in audio/params and sequencer (agent: player)
Wave 2
- [x] UI: recommender, browser, mixer, timers, 3D mascot, lazy chunks, budget script (agent: ui)
Wave 3
- [x] E2E, mixed content check, demo video, docs, deck, audits (agents: e2e, docs, security, dsp-verifier)
- [x] Build check (`npm run build`, `npm run check:bundle`, vitest, cargo test all pass)
- [x] Merge notes: the working tree is committed as one public root commit; see README and docs/HLD.md for the final state

Later rounds (lively and humanitarian wave)
- [x] Sanctuary UI as a lazy chunk, with favorites, mixes, milestones and timers behind guarded play
- [x] Sound menu, bands and catalog sound tests
- [x] Licensing: root `LICENSE` (MIT), root `NOTICE`, `legacy/NOTICE.md`, lineage wording in README and docs
- [x] Seed template names and descriptions rewritten in original wording, checked against the reference app
- [x] Docs numbers synced to measured values (first load 104.44 KB gzip of 110, wasm 38,564 bytes, 310 web tests, 59 DSP tests)
- [ ] Integrator re-sync of numbers after the last worker edit
