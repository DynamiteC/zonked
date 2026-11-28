# Zonked: Demo Script (2:50)

Output: `media/zonked-demo.mp4` and `media/zonked-demo.webm`, 1280x720. The picture is a 60 px caption strip on top of the app, rendered at 1280x660, so captions never cover the cards or buttons. The soundtrack is rendered from `web/src/wasm/dsp_core.wasm`. A soft lo-fi bed plays from 0:00 and under every quiet moment, so no gap is silent. The recorder `web/scripts/record-demo.mjs` follows this script. Regenerate with `npm --prefix web run record:demo`. See `media/README.md`.

| Time | Beat | On screen | Caption |
|---|---|---|---|
| 0:00 to 0:12 | 1. Lineage | The app is dimmed behind a title card. Three steps appear: 1998 SBaGen scripts, 2018 web app, research and mascot (inspired by Giorgio Regni's GPLv3 Android app), 2026 Rust and WebAssembly in your browser. Then "Free. Private. No account." | Resurrected |
| 0:12 to 0:31 | 2. First screen | Feeling cards, then 15 minutes, then the suggested sound card with its reason. Play. Safety dialog, accept. Sound fades in | Step 1, Step 2, "The suggested sound says why it fits" |
| 0:31 to 1:02 | 3. Sound picker | Lo-fi chords, Soft piano, Violet noise (always-visible quiet note), Rain, Chimes | One line per sound |
| 1:02 to 1:14 | 4. Calm to Alert dial | Dial moves through six positions. HUD beat in Hz and band read live | Calm to Alert dial: beat N Hz, band |
| 1:14 to 1:24 | 5. Inspect | Delta to Gamma rows with evidence labels | Five bands and how strong the evidence is |
| 1:24 to 1:48 | 6. Sanctuary | Save a mix, favorites, milestones, privacy card, Export | Free. Private. No account. Nothing leaves your device. |
| 1:48 to 2:26 | 7. Kiro Crew | Four panes: the three agents from `.kiro/crew/crew.yaml` with their `write_allow` and `shell_allow` lines, real `git log`, real `cargo test` summary, the bridge start line. Then the "Connect to Kiro Crew on this computer" switch in Advanced is turned on. Crew Synced. Score steps focus, flow, recovery, decompress change the sound | Demo feed: fake-crew writes the same file the sequencer agent writes |
| 2:26 to 2:38 | 8. Sleep-fade timer | 15 minute sleep fade, time-lapse to near silence | Time-lapse: 14 minutes in, the sound is almost gone |
| 2:38 to 2:45 | 9. Offline | Bridge stopped, network off, reload, Play still works | Reloaded with no network: the app, the engine and the sound still work |
| 2:45 to 2:50 | 10. Mascot and end card | Mascot tilts and spins on drag. End card | Use stereo headphones at low volume. Zonked is not a medical device. |

## Honesty note

The crew beat is a simulated crew feed (real bridge, real app). It uses `crew-bridge/scripts/fake-crew.mjs` (run with `--transition-sec 5`) against a bridge started with `--min-transition 5`. Both flags are for demos only. The three agents run only inside a Kiro Crew host. The panes show the real agent definitions and the real command output.

## Privacy rules for the recording

- The page is served from a local port in a headless browser. No address bar is ever shown.
- Terminal text is captured from the repo root with relative paths, then redacted in `web/scripts/demo-lib.mjs`.
- `git log` is printed with `--format=%h %s`. Author and email lines are never printed.
- The run aborts if the redacted text or any caption still matches an email, home path, hosting word, session id or git remote pattern.
- Output files are encoded with all metadata stripped.

## Judge path: 60 seconds, nothing to install

Works on the website and inside the Kiro Crew app. No bridge, no network, no account.

| Time | Do | Show |
|---|---|---|
| 0:00 | Open Zonked. Tap Skip, just play. Accept the headphone and volume notice. | Sound fades in over 2 seconds. |
| 0:10 | Tap Crew in the tab bar. | Idle Crew screen with one yellow button. |
| 0:15 | Tap Watch the crew work. | The badge Simulated session shows on every screen. Load score 22, beat 40 Hz. |
| 0:30 | Wait one step (15 s per step). | Score 48, beat 18 Hz. The Why line says the pretend load is building. |
| 0:45 | Wait. | Score 70, beat 10 Hz. The sound softens. |
| 1:00 | Wait. | Score 88, beat 6 Hz, quieter. Next change reads: the demo ends. |
| 1:15 | Tap Stop in the mini player. | Sound ramps down over 250 ms or more. |

Say once: this is a simulated session. The demo never reads your code or your computer. The real Crew reads only git log and git status counts, and Not now pauses it for 30 minutes.

The demo steps are 15 s apart with a 5 s floor on each transition. The real Crew keeps 30 s between changes.
