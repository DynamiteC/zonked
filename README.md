# Zonked

A free, private, offline sound sanctuary for stress, AI-coding burnout, focus strain and sleep. Kiroween 2026 entry: **Resurrection** and **Best Kiro Crew App**.

License: MIT ([`LICENSE`](LICENSE), [`NOTICE`](NOTICE)). Not a medical device.

[Demo video](media/zonked-demo.mp4) (2:50)

![Zonked](media/poster.png)

> ## Try the Crew in 2 minutes
>
> ```bash
> npm run demo:crew
> ```
>
> This builds the bridge, then starts the bridge, a fake crew feed and the app preview. Open <http://localhost:4173/?crew=1>, or switch on "Connect to Kiro Crew on this computer" in Advanced. Watch the badge change to **Crew Synced** and the burnout steps move. The app follows the crew after you press **Follow crew**.
>
> The demo starts the bridge with `--min-transition 5`, which is for demos only. The default minimum transition is 30 s. For a hosted copy of the app, start the bridge with `--origin <site>` so it accepts that origin.

## Quick start (60 s)

```bash
cd web
npm install
npm run build
npm run preview        # http://localhost:4173
```

The app opens on the Calm front door: five short questions, the hearing-safety notice, then a starter sound. No sound plays before you accept the notice. Today, Journeys, Library, Player, Crew and Settings sit in a tab bar, and Settings has a switch to Studio mode, the full control panel. Your choice is kept in this browser. In Studio, click the mask or press Space and accept the safety notice once. See "Requirements" below for the toolchain.

Zonked resurrects two old things. One is SBaGen (1998), the `.sbg` brainwave sequence idea. The other is the author's own 2018 final-year web application, binaural beats research and yellow mask mascot, which were inspired by Giorgio Regni's GPLv3 Android app "Binaural Beats Therapy". That Android app is credited and kept in `legacy/` as reference only. The sequence idea and the mascot now run as a Rust `no_std` WebAssembly synth inside an `AudioWorklet`, in an offline-first PWA. A three-agent Kiro Crew watches your coding session and eases the sound from Beta/Gamma focus, to Alpha recovery, to Theta decompression. A library of 232 templates, a recommender, five synthesized sound layers, timers and lock-screen controls make it usable on its own all day.

- Demo video: `media/zonked-demo.mp4` (2:50), also `media/zonked-demo.webm`
- Pitch deck: `docs/Zonked-Kiroween-Deck.pptx` (8 slides), web backup `docs/deck.html`
- Design: [`docs/HLD.md`](docs/HLD.md), [`docs/LLD.md`](docs/LLD.md)
- Audits: `docs/AUDIT-DSP.md`, `docs/AUDIT-SECURITY.md`, `docs/AUDIT-SPEC.md`, `docs/AUDIT-HUMANITARIAN.md`
- Sounds and research: [`docs/SOUNDS.md`](docs/SOUNDS.md), [`docs/RESEARCH.md`](docs/RESEARCH.md)
- Spec: `.kiro/specs/zonked-core/` and `.kiro/specs/zonked-library/` (requirements in EARS, design, tasks, contracts)

## Free, private, for everyone

Zonked is a free sound sanctuary for people easing stress, AI and work burnout, focus strain and sleep trouble. No account, no ads, no tracking, no network. The sound is made on your device and the app works offline.

The Sanctuary panel (More menu) holds:

- Why Zonked is free and how it stays private, in plain words.
- A how-it-works guide: what the sound does, why headphones, how to listen safely, and what it cannot do. Zonked is not a medical device. For health problems, see a professional.
- Favorites: templates and your own mixes, one tap away.
- My mixes: save the current sound with its levels and timer, then play, rename, delete, export or import.
- Gentle milestones: first session, three calm days, ten sessions, total minutes, first full sleep fade, took a break. One missed day is forgiven. They can be hidden or reset. There are no notifications and no pressure.
- My data: export everything as one JSON file you keep, import a file (checked and clamped to the hearing-safety limits), or delete it all.

Everything is stored in this browser (IndexedDB). Nothing is sent anywhere. See `docs/AUDIT-HUMANITARIAN.md`.

## Sounds and what the research says

Pick a calming sound on the first screen: lo-fi chords, soft piano, violet noise, rain and rumble, chimes, or pure beats. The Mix view turns each part up or down, and a Calm to Alert dial moves the beat between 2.5 and 20 Hz. Everything is synthesized on your device.

The research is mixed. Some small studies report less anxiety or better focus with binaural beats or steady noise; others find no effect. Zonked labels each brainwave band with its evidence level (limited, preliminary or mixed) in the Inspect panel. Sources and their honest status are in `docs/RESEARCH.md`. Results vary and may not happen for you. Zonked is not a medical device.

## Hearing safety

Use stereo headphones for binaural beats. Zonked is not a medical device. The engine clamps carrier to 20-1500 Hz, beat offset to 0.5-40 Hz, master gain to 0.85, and hard-limits output to [-0.95, 0.95]. Playback fades in over at least 2 seconds.

## Layout

| Path | What |
|---|---|
| `crates/dsp-core` | `#![no_std]` DSP: u64 phase oscillators, isochronic/monaural, Xoshiro256** noise, smoothing, limiter, five synthesized layers |
| `crew-bridge` | Zero-dependency TypeScript CLI. Serves `.zonked-state.json` over SSE on `127.0.0.1:43210` |
| `app` | Kiro Crew app port: the Calm screens with one persistent audio engine and a Now Playing side-panel tab |
| `web` | React + TypeScript PWA, `.sbg` parser, AudioWorklet, template catalog, recommender, timers, static host config (host config file, `_headers`) |
| `.kiro` | Steering, hook, spec, Kiro Crew manifest and agent instructions |
| `docs`, `media` | Design docs, deck, demo video |
| `legacy` | Read-only reference: Giorgio Regni's GPLv3 Android app (third-party) and Gnaural schedules |

## Requirements

Node 20+, Rust with the `wasm32-unknown-unknown` target (`rustup target add wasm32-unknown-unknown`). `wasm-pack` is installed through `web/node_modules`.

## Run the PWA

```bash
cd web
npm install
npm run build          # builds WASM, type-checks, bundles to web/dist
npm run preview        # http://localhost:4173 (COOP/COEP set)
# or: npm run dev      # http://localhost:5173
```

Click the mask or press Space. Accept the safety notice once. Pick a preset or open the editor (`E`) to write `.sbg` text. After the first load the app works with the network off.

Presets: Deep Focus (40 Hz gamma), Flow State (18 Hz beta), AI Burnout Reset (10 Hz alpha to 6 Hz theta), Breathwork Sync (5.5 Hz theta with a breath pacer), Deep Rest (2.5 Hz delta), Classic 1998 SBaGen Demo.

## The library

Everything below is generated or synthesized in the browser. No audio file is ever loaded or fetched.

### Templates

232 templates in 8 categories: vibes, healing, lucid dreams, meditation, sleep, ADHD control, focus, work recovery. Each template is a list of stages (beat, carrier, mode, noise, layers) that plays through the same sequencer as an `.sbg` script, so every value is clamped to the hearing-safety bounds. 208 are generated by a deterministic archetype DSL (`web/src/catalog/`), 21 re-express published frequency and duration values from the Android reference app and 3 from Gnaural schedules, in original wording (marked by `source`). Open the catalog drawer to search by text, category, vibe, layer tag and ADHD friendly, 24 per page. The catalog is a lazy chunk, loaded when first needed.

### Recommender

Pick a situation (ADHD focus, can't sleep, lucid dream, meditate, heal stress, AI coding burnout, deep work, quick reset), optionally a vibe, your available minutes, and your device. The recommender scores every template (situation 40, vibe 15, duration 15, time of day 10, device 10, sensory sensitivity 10) and returns at least 5 with reasons. It is pure and deterministic. On speakers it warns about binaural templates. High sensitivity excludes intensity above 3, percussion and crackle while enough gentle matches exist. Press `R` to open it and `1` to `5` to launch a result.

### Layers

Five layers are synthesized in the WASM core and mixed under the tones: lo-fi (warm harmonic bed, tape saturation, vinyl crackle), instrument (pluck, drone, FM bell), pad (8 chords), chimes (6 inharmonic partials) and percussion (8 patterns). The Mixer drawer sets each level and shows the effective master gain. Layer levels are budgeted so total output stays under the 0.95 limiter ceiling. With all layers at 0 the output is identical to the layer-free engine.

### Timers

Countdown, sleep fade (beat glides toward 2.5 Hz and volume to 10 percent over N minutes, then a 6 second final fade and stop) and Pomodoro (25 minutes focus, 5 minutes break by default, the beat eases to 8 Hz or lower during breaks). Timer state is saved in `localStorage` (`zonked.timer.v1`) and restores paused.

### Quick Start

On first run an inline card asks how you want to feel (or what you are doing), then how many minutes you have. It lists the top 5 sounds with a reason each. Play goes through the same headphone and volume notice as the main button. Skip closes it for now. Don't show again hides it for good. Reopen it any time with Help me choose.

### Advanced mode

Technical readouts (base tone, left and right ear, beat speed, band, engine state, burnout level) and the script editor and layer mixer buttons live under Advanced. The drawer is always in the page and keeps its open state. A glossary explains terms like binaural beat and carrier in plain words.

### Tooltips

Every control has a short tip. Hover or focus shows it, tap the small ? button on touch, Escape closes it. Tips use role=tooltip and aria-describedby, stay inside the viewport and skip the fade when Reduce motion is on. All text is in `web/src/ui/copy.ts`.

### Small screens

The layout is checked at 390x844 (no sideways scroll, mascot and controls inside the screen), plus 1280x720 and 1600x900.

### Keyboard shortcuts

| Keys | Action |
|---|---|
| Space | Play or pause |
| Right or N, Left or P | Next, previous template |
| 1 to 5 | Launch recommendation 1 to 5 |
| R | Open the recommender |
| T | Cycle timer: none, countdown, sleep fade, Pomodoro |
| M | Mute or unmute |
| + or =, - or _ | Volume up, down (steps of 0.05, never above the 0.85 cap) |
| ? | Show shortcuts |
| E | Open the editor |
| B | Toggle the breathing pacer |
| Esc | Close drawers and popovers |

Shortcuts are ignored while you type in a field and when Ctrl, Cmd or Alt is held.

### Background, lock screen and Bluetooth

Audio keeps playing when the tab is hidden or the screen locks. If the browser suspends the audio context, Zonked resumes it on the next visibility change or tap, but only while it was playing. The Media Session API shows the template name and category with artwork on the lock screen and wires play, pause, stop, next, previous and 15 second seek to headset, car and Bluetooth buttons. An optional screen wake lock (stored as `zonked.wakeLock`) keeps the display on while playing; it is released when you stop or hide the page. The recommender can use the connected output device when the browser exposes its label (read only, no permission prompt).

### Mascot

The mascot tilts toward the pointer, spins when dragged, deepens on hover and reacts to loudness. With Reduce motion on it stays still.

## Run the Kiro Crew workflow

The crew talks only through files in the project root. See `.kiro/crew/crew.yaml`.

```
burnout-sentinel   -> .zonked-signals.json   (git velocity, session length, build failures, score 0-100)
acoustic-sequencer -> .zonked-state.json     (bounded target: beat, carrier, gain, transition)
dsp-verifier       -> .zonked-verify.json    (runs cargo test and clippy on dsp-core)
crew-bridge        -> http://127.0.0.1:43210 (SSE to the browser)
```

1. Register the three agents from `.kiro/crew/agents/` in Kiro Crew and schedule them as listed in `crew.yaml` (sentinel every 5 minutes, sequencer on signals change, verifier on `crates/dsp-core/**` change).
2. Start the bridge:

```bash
cd crew-bridge && npm install && npm run build
node dist/src/cli.js --state ../.zonked-state.json
```

3. Open the PWA. The badge changes from **Standalone** to **Crew Synced** and the burnout meter follows the score. Stop the bridge and the app keeps playing in standalone mode.

No agents handy? Demo the loop with the fake crew:

```bash
node crew-bridge/scripts/fake-crew.mjs --state .zonked-state.json --step-sec 20
```

Note on Safari and mixed content: a site served over https and the bridge is `http://localhost:43210`. Chrome and Firefox treat loopback as potentially trustworthy and allow the call. Safari blocks it as mixed content, so the app stays in Standalone mode there (the library, timers and layers all still work). Use Chrome or Firefox for Crew sync on an https site, or run the app locally.

The `.kiro/hooks/verify-dsp.json` hook runs `node scripts/check-no-buildrs.mjs && cargo test --manifest-path crates/dsp-core/Cargo.toml` whenever a file in `crates/dsp-core/` changes. Note that `cargo test` runs local code (tests, and `build.rs` or proc macros if present); the check script fails the hook if `crates/dsp-core` has a `build.rs` or proc-macro dependencies. Review pulled branches before editing in them.

## Test and verify

Measured on the final tree:

| Item | Result |
|---|---|
| First-load JS + CSS gzip | 100.09 KB + 4.88 KB = 104.96 KB (budget 110 KB) |
| WASM core | 38,564 bytes, no imports |
| Service worker precache | 36 entries (665.83 KiB) |
| Web tests (vitest) | 331 in 35 files |
| DSP tests (cargo) | 59 |
| Bridge tests | 50 |
| Script tests | 22 root, 9 web |
| End to end (Playwright) | 73 checks |
| Web coverage | lines 91.15 percent, branches 82.79 percent |

```bash
cargo test --manifest-path crates/dsp-core/Cargo.toml
cargo clippy --manifest-path crates/dsp-core/Cargo.toml --all-targets -- -D warnings
(cd crew-bridge && npm test)
(cd web && npm test && npm run audit:security && npm run test:scripts)
(cd web && npx vitest run --coverage)  # coverage report (v8)
(cd web && npm run build && npm run check:bundle)   # fails above 110 KB gzip
(cd web && npm run verify:e2e)      # Playwright, 73 checks
(cd web && npm run record:demo)     # regenerates media/ (needs ffmpeg)
```

Bundle budget: `npm run check:bundle` gzips what `dist/index.html` loads. Lazy chunks (editor, recommender, catalog browser, mixer, timer panel, sound picker, mix view, Inspect, Sanctuary, catalog data) are listed separately.

The end to end run (`npm run verify:e2e`, Playwright against a preview server and the bridge) covers headers, cross-origin isolation, no CSP violations, playback peaks, presets, Crew sync and bridge stop, offline reload, hostile `.sbg` input, accessible names, layers, recommender, catalog, timers, shortcuts, Media Session, reduced motion, mascot layout, tooltips, Quick Start, the sound picker and Mix view, the Sanctuary, and the loopback bridge from the served page. Check names are in `web/scripts/e2e-*.mjs`.

## Verify everything

```bash
npm run verify:all      # every gate above plus the end to end run, with a stage table
npm run check:privacy   # private terms, emails, paths and hosting words (also in verify:all)
npm run check:chars     # no emoji, long dashes or section signs in tracked files
npm run check:sizes     # file size limits
```

`.githooks/pre-push.template` is a pre-push hook that runs `verify:all`. Copy it to `.git/hooks/pre-push` yourself if you want it.

## Hosting

The app is a static site built to `web/dist` (`cd web && npm run build`). It needs a static host that applies the headers in `web/public/_headers`.

## Credits and license

Zonked brings back SBaGen (1998) and the author's 2018 final-year web application, with its research and mascot. That 2018 work was inspired by Giorgio Regni's GPLv3 Android app "Binaural Beats Therapy". The app is credited in [`NOTICE`](NOTICE) and [`legacy/NOTICE.md`](legacy/NOTICE.md), and `legacy/android` is kept as reference only.

## License

Original code, docs and templates: MIT (see [`LICENSE`](LICENSE)). Material under `legacy/android` is Giorgio Regni's GPLv3 app and is reference only; it is not part of the shipped app. See [`NOTICE`](NOTICE). Zonked is not a medical device.
