// Single source of truth for the pitch deck. Used by build-deck.mjs to emit
// both the PPTX and the self-contained HTML backup. ASCII only.

export const COLORS = {
  bg: '0A0B0F',
  gold: 'FFE600',
  amber: 'FFB800',
  mint: '00E5A8',
  text: 'F2F2F2',
  panel: '161821',
  line: '2A2D3A',
};

export const SLIDES = [
  {
    id: 'title',
    kind: 'title',
    title: 'Zonked',
    subtitle: 'Acoustic recovery for AI-assisted coding',
    lines: ['Kiroween 2026: Resurrection and Best Kiro Crew App', 'Rust no_std WASM synth, 232 templates, three Kiro Crew agents'],
    notes:
      'Zonked is an acoustic recovery companion for developers who code with AI assistants. A Rust no_std DSP engine, compiled to a 38 KB WebAssembly module, runs inside an AudioWorklet and plays binaural, monaural or isochronic tones under five synthesized layers: lo-fi, instrument, pad, chimes and percussion. A library of 232 templates, a recommender and timers make it useful on its own. A Kiro Crew workflow watches how hard the session is running and steers the sound from focus down to decompression. We are entering Resurrection, because the idea is a 1998 SBaGen script brought back to life, and Best Kiro Crew App, because the three agents are the product, not a demo.',
  },
  {
    id: 'problem',
    kind: 'bullets',
    title: 'The problem: AI coding burnout',
    bullets: [
      'AI assistants turn hours of work into minutes of attention',
      'Sessions stay in high-velocity mode with no natural pauses',
      'The signs are already in git: commit rate, session length, failed builds',
      'Break timers ignore intensity and ignore sound',
      'Zonked measures intensity, then changes what you hear',
      'Score 0 to 100: velocity 30, duration 40, failures 20, sprawl 10',
    ],
    notes:
      'When an assistant writes the boilerplate, the developer never gets the pauses that typing used to force. Fatigue builds quietly. The signals that show it are already on disk: how many commits in the last hour, how long since the last real break, how many consecutive builds failed, how many files are dirty. The burnout-sentinel agent turns those four numbers into one score from 0 to 100. The weights are 30 for velocity, 40 for duration, 20 for failures and 10 for sprawl. We make no medical claims. Zonked is a nudge, and the app says so before first playback.',
  },
  {
    id: 'resurrection',
    kind: 'image-bullets',
    title: 'Resurrection: 1998 to 2026',
    image: 'assets/pwa-512x512.png',
    imageAlt: 'Zonked mascot',
    bullets: [
      '1998 SBaGen: text scripts for binaural beats',
      '2018 final-year web app and mascot, inspired by an Android app (credited, legacy/)',
      '2026: Rust no_std DSP, 38 KB WASM',
      'Offline PWA, sbg language kept, hard limits',
      'Library: 232 templates plus a recommender',
      'Five layers made by the engine; optional licensed nature loops',
      'License: MIT. Not a medical device',
    ],
    notes:
      'This is a revival in three steps. In 1998 SBaGen showed that a plain text script is enough to drive binaural beats. In 2018 the author built a final-year web application with binaural beats research and a yellow mask mascot, after studying Giorgio Regni\'s GPLv3 Android app. That Android app is credited in NOTICE and kept in the legacy folder as reference only, never imported by shipped code. In 2026 we rebuilt the engine as a no_std Rust crate with no allocation and no panics, compiled to about 38 kilobytes of WebAssembly including five synthesized layers, hosted in an AudioWorklet and shipped as an installable PWA. Published frequency and duration values from that Android app and from Gnaural schedules are re-expressed as 24 of the 232 templates in the new library; the other 208 come from a deterministic archetype generator. The engine makes its own layers: lo-fi, plucks, pads, chimes and percussion are all computed in the WASM module, and wind, waterfall and flute are synthesized too. The only recorded audio is an optional set of seven short nature loops (about 1.4 MB of MP3, public domain or CC0), bundled with the app, loaded only when chosen, and listed with source and licence in a samples file. Sounds a person adds stay on their device. Nothing is fetched at run time. The old sbg script syntax survives as a safe subset, and the Classic 1998 demo preset is a real fifteen minute script in that style. The mascot is the author\'s own yellow mask character, redrawn so its eyes pulse at the beat.',
  },
  {
    id: 'crew',
    kind: 'diagram',
    title: 'Kiro Crew architecture',
    agents: [
      { name: 'burnout-sentinel', sub: 'cron, 5 min' },
      { name: 'acoustic-sequencer', sub: 'on signals change' },
      { name: 'dsp-verifier', sub: 'on DSP change' },
    ],
    files: ['.zonked-signals.json', '.zonked-state.json', '.zonked-verify.json'],
    chain: ['crew-bridge', 'Browser', 'WASM DSP', 'Speakers'],
    chainSub: ['127.0.0.1 SSE', 'main thread', 'AudioWorklet', 'headphones'],
    bullets: ['Agents talk only through files, no network', 'Bridge clamps every message; library works offline'],
    notes:
      'Three agents, defined in crew.yaml. The burnout-sentinel runs on a five minute cron, reads git, and writes the signals file with the score. The acoustic-sequencer wakes when that file changes, applies hysteresis of two consecutive readings, picks a band and a transition time, and writes the state file atomically, at most twice a minute. The dsp-verifier wakes when the DSP crate changes, runs cargo test and clippy, and audits the no_std and hearing-safety rules. The crew-bridge is a zero-dependency Node program that watches the state file, validates it, and serves it over server-sent events on loopback. The browser re-validates, blends from the current sound to the target, and hands parameters to the AudioWorklet through a seqlock in shared memory. If the bridge is absent the app simply stays standalone. The library does not need the crew at all: the catalog, recommender, layered synth and timers run in the browser, and the crew can steer the same engine when it is present.',
  },
  {
    id: 'demo',
    kind: 'beats',
    title: 'Demo highlights',
    beats: [
      { label: 'Beat 1: Crew running', text: 'Three agents write state files' },
      { label: 'Beat 2: Library and sound', text: 'Recommender, layers, 3D mascot' },
      { label: 'Beat 3: Burnout Reset', text: 'Score climbs, 10 Hz glides to 6 Hz' },
      { label: 'Beat 4: Airplane mode', text: 'Offline reload, sleep timer fades' },
    ],
    footer: 'Recording: media/zonked-demo.webm',
    notes:
      'Two minutes, four beats. Beat one, about thirty seconds: show the three Crew agents running and the state file changing, and the Crew Synced badge in the app. Beat two, thirty seconds: open the recommender, launch a result with a number key, add a layer in the mixer, and point out the HUD, the oscilloscope and the mascot, which tilts toward the pointer and pulses its eyes at the visible beat rate, capped at three per second. Beat three, thirty seconds: the burnout score climbs, the sequencer moves the band, and the sound glides from a 10 hertz alpha beat toward 6 hertz theta with the pink noise bed. Beat four, thirty seconds: switch on airplane mode, reload, and the app and the audio carry on, because the service worker cached everything including the catalog. Start a sleep timer and the volume and beat glide down before the sound stops. The recording is media/zonked-demo.webm.',
  },
  {
    id: 'security',
    kind: 'bullets',
    title: 'Security posture',
    bullets: [
      'Static files only: no server code to attack',
      'CSP script-src self plus wasm-unsafe-eval, COOP and COEP isolation',
      'Bridge binds 127.0.0.1, checks Host and Origin, read-only',
      'State files and sbg scripts are untrusted: 64 KB, 256 KB, 500 events',
      'Hearing safety: gain 0.85, layer bus 0.6, limiter 0.95',
      'No eval, analytics, remote audio or third-party requests; audited',
    ],
    notes:
      'The site is static files, with security headers from a headers file: a content security policy that allows only same-origin scripts and WebAssembly compilation, cross-origin opener and embedder policies that isolate the page so shared memory works, and no framing. The loopback bridge checks the Host header to defeat DNS rebinding and allow-lists the Origin, and it never writes to the project. Every external input is untrusted: the state file is capped at 64 KB and validated against a strict schema, and sbg scripts are capped at 256 KB and 500 events with line-numbered diagnostics. Hearing safety is enforced three times: in the parser, in the worklet message layer and in the DSP core, which has a limiter at 0.95 and a gain cap of 0.85. The five synthesized layers add a budgeted mix with a soft limit of 0.6 before the master gain, so layers cannot push the output past the limiter. There is no remote audio at all: the few bundled nature loops are licensed, listed and checked by a script, and no sound is downloaded at run time. A static audit script fails on eval, inline scripts, innerHTML assignment and external URLs.',
  },
  {
    id: 'kiro',
    kind: 'bullets',
    title: 'How we used Kiro',
    bullets: [
      'Specs: EARS requirements, design, tasks, shared contracts',
      'Steering: an always-on standards file binds every change',
      'Hooks: edit dsp-core and cargo test runs automatically',
      'Crew: sentinel, sequencer and verifier run beside the editor',
      'Subagents: parallel specialists built layers, catalog, UI, docs',
      'AGENTS.md maps the repo so every agent shares one contract',
    ],
    notes:
      'Kiro shaped the project at every level. Specs: requirements in EARS form, a design document, a task list and a contracts file that every agent built against. Steering: one always-included standards file that holds the DSP rules, the hearing-safety table, the web security headers and the code-quality bar, so a change that breaks a rule is a defect even when tests pass. Hooks: a file-edited hook runs the DSP unit tests whenever the Rust crate changes. Crew: the product itself is a three-agent workflow with explicit tool lists and shell allow-lists. Subagents: during the build, specialists for the DSP layers, catalog, recommender, timers, UI, E2E, audits and docs worked in parallel against a library spec and shared contracts. AGENTS.md ties it together as the map.',
  },
  {
    id: 'roadmap',
    kind: 'bullets',
    title: 'Roadmap and ask',
    bullets: [
      'Next: richer signals for the sentinel, such as review queue and CI',
      'Next: your own templates, tuned from session logs',
      'Next: a Safari path for the bridge, since https blocks loopback',
      'Next: share and import sbg scripts as plain files',
      'Ask: your vote for Resurrection and Best Kiro Crew App',
      'Try it: npm --prefix web run dev, then press Play',
    ],
    notes:
      'What comes next: give the sentinel richer signals such as review queue depth and CI results, let users save their own templates and tune the recommender from their own session logs, find a path for Safari because it blocks https pages from calling loopback, and make sbg scripts easy to share as plain files. The ask: we would like your vote for Resurrection, because a 1998 text-script idea now runs as 38 KB of Rust WebAssembly with five synthesized layers and a 232 template library, and for Best Kiro Crew App, because three agents coordinate through plain files to change what a developer hears. Thank you.',
  },
];
