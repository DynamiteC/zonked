# Zonked feature audit and RICE ranking

Judged at commit 5914e2b on branch feature/zonked-app. Built from a throwaway worktree with Vite and driven with Playwright (Chromium, 390 by 844 phone size). The live tree was not used. Scratch scripts and screenshots are in `.work/` (`audit-walk.mjs`, `audit-crew.mjs`, `audit-shots/`).

Evidence key used below:

- B = I ran it in the browser in this audit.
- T = a test file covers it. I read the test or ran it. I did not re-run every test.
- R = I read the code only.
- N = not run, not checked.

## Warnings first

1. The docs say "no audio file is ever loaded" (README, HLD lines 15, 232, 429). Commit ed2b00a ships seven MP3 loops (about 1.4 MB, precached). That is a false claim in the submission.
2. The nature loops have no UI. `startSample` is exported from `web/src/audio/samples/index.ts`. No screen calls it. The feature is built, licensed, precached and unreachable.
3. The Crew tab in the Calm UI shows three chips (Fresh, Warming up, Time for a break) and nothing else. No score, no reason, no beat value, no countdown. A judge sees a chip move and cannot tell what the crew did to the sound.
4. The sentinel and sequencer are instruction files for a Kiro Crew runtime. Nothing in the repo runs them outside that runtime. The demo uses `fake-crew.mjs`, a script that cycles four scores. The honest label is "simulated crew feed, real bridge, real app".
5. Nobody has listened. I cannot hear audio. Sound pleasantness scores below are from code and tests only.
6. Firefox and Safari were not tested here.

## Step 1: what the submission promises

| # | Promise | Where it lives | Judge can SEE and TRY in 3 minutes? |
|---|---|---|---|
| 1 | Kiro Crew integration: three agents, a manifest, a bridge, an app port with a backend and an MCP tool | `.kiro/crew/`, `crew-bridge/`, `app/` | Partly. `npm run demo:crew` shows a chip moving. The agents themselves need the Kiro Crew runtime. Not seen without installing. |
| 2 | Steering, hooks, specs | `.kiro/steering/zonked-standards.md`, `.kiro/hooks/verify-dsp.json`, `.kiro/specs/zonked-core/` | Files are readable in a minute. Only one hook exists, and it only guards the DSP. No visible effect in the app. |
| 3 | A Rust `no_std` DSP engine in an AudioWorklet | `crates/dsp-core`, `web/src/audio` | Yes, if they press play. The engine is invisible. The Studio scope and HUD show it. A judge must find Studio mode. |
| 4 | Hearing safety: clamps, ramps, limiter, notice before sound | engine, parser, SafetyGate | Yes. The notice appears before any sound (B). The clamps are invisible but tested. |
| 5 | Free, private, offline, no account | README, PWA | Partly. Privacy is claimed in text. Offline needs a second visit with the network off. No in-app proof. |

What a judge can try in under 3 minutes: the front door, the safety notice, a starter sound, the tabs, the Library, timers. What they cannot: the crew steering the sound on their own work, the three agents, the cron, the MCP tool, the side panel.

## Step 2: feature inventory

Scale: ease and delight 1 to 5, higher is better. Safety risk: L low, M medium, H high. Verdicts: KEEP, FIX, HIDE, CUT.

### Consumer front door (Calm UI)

| # | Feature | Works? (evidence) | Ease | Delight | Safety risk | Honest label | Who uses it | Verdict and reason |
|---|---|---|---|---|---|---|---|---|
| 1 | Onboarding, 3 questions | Yes (B, T) | 4 | 3 | L | Real | New user | KEEP. Short. The Next button works with no answer chosen, which is good. |
| 2 | Skip, just play | Button present (B). Path not walked (N) | 5 | 3 | L | Real | Impatient user | KEEP. Must still pass the notice. T covers that. |
| 3 | Safety notice before sound | Yes. No AudioContext before accept (T, B screenshot) | 4 | 2 | L | Real | Everyone | KEEP. Six plain bullets. Good. |
| 4 | Starter sound picker with Preview | Yes (B) | 4 | 3 | L | Real | New user | KEEP. |
| 5 | First sound | 5 taps, about 5 s scripted (B) | 4 | 3 | L | Real | Everyone | KEEP. See counts below. |
| 6 | Today screen, "Play again", week dots | Yes (B) | 4 | 3 | L | Real | Returning user | KEEP. Rest days are forgiving, no streak shame (T checks the wording). |
| 7 | Journeys (7 Calm Evenings, 5 Focus Mornings, 14 Nights, Study Sprint) | List shows (B). Day play not walked (N) | 3 | 4 | L | Real | Sleep and study users | KEEP. Verify a day plays. |
| 8 | Library: search, filters, 232 templates | Search page shows (B), T on catalog | 3 | 3 | L | Real | Browsers | KEEP. Filters are chips with short labels. |
| 9 | Recommender (8 situations, 288 contexts) | T (catalog tests) | 4 | 3 | L | Real | Studio and Library users | KEEP. Scoring is local and fixed. |
| 10 | Player screen with pacer ring and mascot | Yes (B) | 4 | 4 | L | Real | Everyone | KEEP. The ring has no words. Add breath cue text for screen readers. |
| 11 | Timers: 15, 30, 60, until I stop, Sleep fade | Chips show (B). Fade logic T | 4 | 3 | L | Real | Sleepers | KEEP. |
| 12 | Favorite button | T | 4 | 3 | L | Real | Returning user | KEEP. |
| 13 | Done-for-now end card | T, R | 4 | 3 | L | Real | Everyone | KEEP. Not seen in a browser (N). |
| 14 | "What the research says" link | Shows (B) | 3 | 2 | L | Real | Skeptics | KEEP. Evidence labels are honest: limited, preliminary, mixed. |
| 15 | Mini bar (title, time, Stop) on every tab | Yes (B) | 5 | 3 | L | Real | Everyone | KEEP. |
| 16 | Settings: gentle mode, reduce motion, forget answers | Shows (B) | 4 | 2 | L | Real | Sensitive users | KEEP. |
| 17 | Studio mode switch | Yes (B) | 3 | 3 | L | Real | Power users | KEEP. The button sits on every screen. A first-time user may press it by accident and land in a dense panel. |
| 18 | Calm and dark theme | CSS media query only (R) | 4 | 3 | L | Real | Night users | KEEP. No manual toggle seen. |
| 19 | Reduced motion | CSS rule at calm.css line 162, T | 4 | 2 | L | Real | Photosensitive users | KEEP. |

### Sound and layers

| # | Feature | Works? | Ease | Delight | Safety | Label | Who | Verdict |
|---|---|---|---|---|---|---|---|---|
| 20 | Binaural, isochronic, monaural modes | T (Rust tests, vitest) | 3 | 3 | M | Real. Evidence for effect: mixed | Everyone | KEEP. Keep the "results vary" wording. |
| 21 | White, pink, brown, violet noise | T | 4 | 3 | L | Real | Focus users | KEEP. |
| 22 | Lo-fi chords with tape wobble | T. Not heard (N) | 4 | 4 | L | Real, unheard | Study users | KEEP, listen before the demo. |
| 23 | Piano, chimes, pad, percussion | T. Not heard (N) | 3 | 3 | L | Real, unheard | Studio users | KEEP. 34 templates use chimes, 16 use percussion (from an earlier audit, not rechecked). |
| 24 | Breathing pacer | Ring shows (B) | 3 | 4 | L | Real | Stressed users | KEEP. Make it drive the beat (see cherries). |
| 25 | Mixer sliders, Calm to Alert dial | T | 3 | 3 | L | Real | Studio users | KEEP. In Studio only. |
| 26 | Nature loops (7 MP3, ed2b00a) | Code and tests only (T). No UI (R) | n/a | n/a | L | Real, hidden | Nobody today | FIX. Wire a picker or cut the 1.4 MB precache. Fix the "no audio file" claims. |
| 27 | Beat ducking under nature loops | T | n/a | n/a | L | Real, unreachable | Nobody | FIX with 26. |
| 28 | Brickwall limiter, clamps, gain ramps | T (Rust, parser, worklet, core) | n/a | n/a | L | Real | Everyone | KEEP. The strongest part of the submission. |

### Personal data (Sanctuary)

| # | Feature | Works? | Ease | Delight | Safety | Label | Who | Verdict |
|---|---|---|---|---|---|---|---|---|
| 29 | My mixes: save, rename, export, import | T | 3 | 3 | L | Real | Returning user | KEEP. It lives in Studio More menu, so Calm users may not find it. |
| 30 | Milestones, no pressure wording | T | 3 | 3 | L | Real | Returning user | KEEP. |
| 31 | My data: export, import, delete all | T | 3 | 2 | L | Real | Privacy users | KEEP. Strong trust feature. Surface it in Calm Settings. |
| 32 | Mission and Guide panels | T | 3 | 2 | L | Real | Skeptics | KEEP. |

### Studio and developer features

| # | Feature | Works? | Ease | Delight | Safety | Label | Who | Verdict |
|---|---|---|---|---|---|---|---|---|
| 33 | `.sbg` editor, import, export | T (parser, 256 KB and 500 event caps) | 2 | 3 | L | Real | Power users | KEEP. |
| 34 | Scope and HUD | T | 2 | 4 | L | Real | Judges, curious users | KEEP. Judges love to see the wave. Move it nearer the front. |
| 35 | Inspect panel with band evidence | T | 3 | 2 | L | Real | Skeptics | KEEP. |
| 36 | Presets (6) | T | 4 | 3 | L | Real | Studio users | KEEP. |
| 37 | Keyboard shortcuts (Space, E, R, 1 to 5) | T | 3 | 2 | L | Real | Power users | KEEP. |
| 38 | MediaSession lock-screen controls | T (mediaSession.test) | 4 | 3 | L | Real | Phone users | KEEP. Not tested on a device (N). |
| 39 | Wake lock | R, T | 4 | 2 | L | Real | Sleepers | KEEP. Check that the screen may dim while sleeping. |
| 40 | PWA offline, service worker | Build shows 59 precache entries, 2.1 MB (B). Offline replay not run (N) | 5 | 3 | L | Real | Everyone | KEEP. The 2.1 MB includes the unreachable nature loops. |

### Crew and Kiro features

| # | Feature | Works? | Ease | Delight | Safety | Label | Who | Verdict |
|---|---|---|---|---|---|---|---|---|
| 41 | Crew tab with toggle, Connected state, three step chips | Yes. Ran bridge plus fake feed; state accepted every 6 s, chip moved to Warming up (B) | 3 | 2 | L | Simulated feed, real bridge | Developers | FIX. Add the reason and the numbers. |
| 42 | crew-bridge: loopback, Host and Origin checks, 64 KB cap | T (crew-bridge tests, not re-run here). Log showed states accepted (B) | n/a | n/a | L | Real | Developers | KEEP. |
| 43 | Min transition 30 s, demo flag 5 s | R, README | n/a | n/a | L | Real. Demo only flag | Judges | KEEP. |
| 44 | burnout-sentinel (agent file, score formula) | Instructions only. Not run (N) | n/a | n/a | L | Needs Kiro Crew runtime | Developers | KEEP. State this plainly. |
| 45 | acoustic-sequencer | Instructions only. Fake feed copies the mapping (R) | n/a | n/a | L | Needs runtime | Developers | KEEP. |
| 46 | dsp-verifier agent plus the verify hook | Hook file valid (R). Agent not run (N) | n/a | n/a | L | Real | Maintainers | KEEP. |
| 47 | App backend: 34 tests pass (B, node test run) | Yes | n/a | n/a | L | Real | Kiro Crew app host | KEEP. |
| 48 | MCP tools: `zonked_report_intensity`, `zonked_get_suggestion` | stdio tools/list test passes (B) | n/a | n/a | L | Real | Agents | KEEP. |
| 49 | Sentinel cron, ships disabled | Test checks it ships off (B) | n/a | n/a | L | Real | Developers | KEEP. Off by default is right. |
| 50 | Now Playing side panel (app/ui) | Dist exists. Not loaded in a Kiro Crew host (N) | n/a | n/a | L | Unverified in host | Kiro Crew users | FIX. Show a screenshot from a host, or label it unverified. |
| 51 | Studio "Follow crew" button | R (web/src/app/App.tsx line 379) | 3 | 3 | L | Real | Studio users | KEEP. The Calm toggle replaces it. Make the two consistent in wording. |
| 52 | Two-bundle layout: web/ and app/ui | Real | n/a | n/a | L | Real | Maintainers | KEEP. Duplicate logic risk. A stale-closure bug was fixed in both copies earlier. |
| 53 | Privacy and size gates (check:privacy, check:sizes, audit:security) | T | n/a | n/a | L | Real | Maintainers | KEEP. |
| 54 | Rust tests and clippy gates | Not re-run (N). Earlier reports say 59 tests | n/a | n/a | L | Reported, not checked | Maintainers | KEEP. |
| 55 | Demo video, 2:50, and 8-slide deck | Files exist | n/a | n/a | L | Real | Judges | KEEP. Re-record if the UI changed. |

### Counts for first sound (Calm front door, measured in B)

| Measure | Value | Note |
|---|---|---|
| Taps to first sound | 5 | Next, Next, Next, I understand, Start |
| Fastest path | 2 taps by design (Skip, just play, then accept) | Not walked, so N |
| Words read before sound | about 205 | Summed innerText of each step, including nav labels. Real reading is about 120 words. |
| Time to first sound | about 5.3 s scripted | Includes waits. A human needs about 25 to 40 s. |
| Errors in console | 0 | |

## Step 3: gaps, trust breaks, dull spots

A stressed developer expects:

- A fast "I need a reset now" button on the first screen of Today. Today has "Play again", not "Reset me in 90 seconds".
- Sound that follows their real work. The sentinel reads git only. It does not see failed tests unless a `.zonked-build.json` exists, and nothing writes that file.
- To know why the sound changed. Not shown.
- A quiet path in a meeting or an office: speakers warning exists, a "headphones not detected" hint is unknown on most browsers.

A person who cannot sleep expects:

- Dim screen, no bright ring. The ring is a bright teal circle on a light peach page in the default theme (B screenshot). Dark theme follows the OS only.
- A fade that ends in silence and a screen that stays dark. Sleep fade exists (T). Wake lock may keep the screen on. Check.
- Voice or text breathing guidance. Only the visual ring exists.

What breaks trust:

- The "no audio file" claim next to a 1.4 MB sample folder.
- The mp3 files carry a `.json` name so a host can serve them. It is explained in the licence doc, but it looks odd to a reviewer.
- Studio mode button next to the title on every screen. A first tap on it hides the calm path.
- The Crew screen says "Connected" and shows no data. It looks like a mock.
- "Your coding session can watch itself" with no list of what is read. The README and the manifest list git log and status. The screen should say so in one line.

What is dull:

- Visuals are one mascot and one ring. Little change over a session.
- The Crew tab, the headline feature, has the least content of any tab.
- Journeys are text cards. No preview of the sound.

Crew loop end to end:

| Link | State today | Evidence |
|---|---|---|
| Sentinel reads git, writes `.zonked-signals.json` | Instruction file only. Runs inside Kiro Crew with the shell allow-list | R. Not run. |
| Sequencer reads signals, writes `.zonked-state.json` | Same. Fake feed stands in | R. Not run. |
| Bridge validates and serves state | Works | B. State accepted in log. |
| App follows state | Works. Chip moved. Sound change not measured in Calm | B for chip. R for `applyCrew`. |
| Backend tools and cron | Tests pass. Cron ships off | B (34 pass). |

Could a judge see it in 60 seconds with no install? No. They must clone, build the bridge and run `npm run demo:crew`. The hosted copy cannot reach a loopback bridge by design. The fix is a simulated mode inside the app itself (cherry 2).

## Step 4: RICE candidates

Reach is on a 1 to 10 scale for people per quarter: 1 is about 100, 5 is about 10 000, 10 is about 1 million. It is a guess for a free, unadvertised app. Score is Reach times Impact times Confidence divided by Effort. Impact is 0.25, 0.5, 1, 2 or 3.

| Rank | Candidate | Reach | Impact | Confidence | Effort (days) | RICE | Fit (1 to 5) | Safety and privacy note |
|---|---|---|---|---|---|---|---|---|
| 1 | Crew "why" panel: plain words, score, beat, next change | 6 | 2 | 80% | 2 | 4.80 | 5 | None. Text from fields already in state. No new data. |
| 2 | Judge demo mode: one tap simulates a burnout session in the app | 8 | 2 | 80% | 3 | 4.27 | 5 | Must label "simulated" on screen. Same clamps and 30 s floor rules apply, or a clear demo timer. |
| 2 | Nature loops picker (wire ed2b00a, fix docs) | 8 | 1 | 80% | 1.5 | 4.27 | 3 | Loops are CC0 or public domain. Ducking exists. Keep level cap. |
| 4 | Guided 90-second reset on Today | 9 | 1 | 80% | 2 | 3.60 | 4 | Fixed gentle beat, 2 s ramp rule kept. No medical claim. |
| 5 | Hearing check: set a safe volume before first play | 8 | 1 | 70% | 2 | 2.80 | 5 | Plays a quiet tone at a fixed low level. Never auto-raises. |
| 6 | Kiro hook: nudge a break after N failed builds | 4 | 1 | 70% | 2 | 1.40 | 5 | Local file only. Nudge text, no sound jump. |
| 7 | Accessibility modes: pacer narration, high contrast | 5 | 1 | 70% | 3 | 1.17 | 4 | Live region text only. No new data. |
| 8 | Breath-and-beat sync: pacer rate drives the beat | 6 | 1 | 60% | 4 | 0.90 | 4 | Beat stays in 0.5 to 40 Hz. Pacer stays under 3 flashes per second. |
| 9 | Code-session heartbeat: adapt to commit and test rhythm | 5 | 2 | 50% | 6 | 0.83 | 5 | Reads git and a build file only. Must never read code content. |
| 10 | Multilingual UI: English, Hindi, Spanish, Portuguese, Japanese | 8 | 1 | 60% | 8 | 0.60 | 3 | Translation quality risk for safety text. Needs native review. RTL later. |
| 11 | Offline "calm card" image of a session | 5 | 0.5 | 70% | 3 | 0.58 | 3 | Canvas image made on device. No upload. Do not add a share server. |
| 12 | Tinnitus masking preset | 4 | 1 | 40% | 4 | 0.40 | 1 | Medical claim risk. High-gain noise risk. Reject as framed. A plain "steady noise" template already exists. |

Rejected on sight:

- Public "listen along" room: needs servers and presence data. Reject.
- Cloud sync, accounts, analytics, streaks with push notices: reject.
- Any wording that says "treats" or "cures": reject.

## Step 5: recommendation

### Top 3 cherries

#### Cherry 1: Crew "why" panel

- 30-second pitch: Every time the crew moves your sound, Zonked tells you why in one plain sentence. "You made 9 commits in an hour and 2 builds failed. Moving from 18 Hz to 10 Hz over 60 seconds. You can say no."
- User story: As a developer in a long session, I want to know why the sound changed, so that I trust the crew and keep it on.
- Reuses: bridge state (`level`, `score`, `beatHz`, `transition`), `CrewScreen` chips, the sequencer band table in `.kiro/crew/agents/acoustic-sequencer.md`.
- Build size: 2 days. Add an optional `why` string (max 160 chars, stripped and clamped) to the state schema. If absent, build text from level and score in the UI.
- Files to touch: `web/src/ui/calm/CrewScreen.tsx`, `web/src/ui/calm/copy.ts`, `web/src/ui/calm/useCrewBridge.ts`, `crew-bridge/src/` state validation, `.kiro/specs/zonked-core/contracts.md`, `.kiro/crew/agents/acoustic-sequencer.md`, `app/ui/src/Panel.tsx`, matching tests.
- Guardrails: `why` is untrusted. Render as text only. Cap length. Strip control characters. Show no file names, commit messages or paths. A "Not now" button pauses following.
- Judge in 60 seconds: open the Crew tab, watch the sentence change with each chip step, see score and beat numbers.
- Test plan: bridge test rejects an over-long or control-character `why`. vitest renders the sentence for each of four levels. Playwright run with the fake feed asserts the text changes and no network call leaves loopback.

#### Cherry 2: One-tap judge demo mode

- 30-second pitch: A "Watch the crew work" button plays a 60-second simulated burnout session inside the app. A fake clock climbs from fresh to burned out. The sound eases down, and the why panel narrates.
- User story: As a judge with no install, I want to see the crew steer the sound in one minute, so that I can score the Kiro Crew idea.
- Reuses: the four bands in `fake-crew.mjs`, `player.applyCrew`, the why panel, the scope.
- Build size: 3 days.
- Files to touch: new `web/src/ui/calm/DemoCrew.tsx` and a small `demoFeed.ts` that emits the same state objects the bridge would; `CrewScreen.tsx`; `web/src/ui/calm/copy.ts`; tests; `docs/DEMO-SCRIPT.md`.
- Guardrails: a persistent "Simulated session" badge. Uses the same state validator and the same clamps. Stays in the Calm safety flow, so the notice must be accepted first. Gain ramps unchanged. Beat steps respect a 5 s floor in demo and the 30 s floor otherwise. The demo never claims to read the viewer's code.
- Judge in 60 seconds: accept the notice, press the button, watch score, chip, beat and sentence change four times.
- Test plan: unit test that the feed emits only valid states. Playwright test that the badge shows, the beat value changes at least three times, and no request leaves the origin.

#### Cherry 3: Guided 90-second reset

- 30-second pitch: One big button on Today. Ninety seconds of slow breath ring, a soft beat that eases down, and a short end card. Made for the moment after a failed build.
- User story: As a stressed person with a minute and a half, I want one tap and no choices, so that I can calm down now.
- Reuses: pacer ring, timers, end card, the "Quick reset" template, the two-tap start.
- Build size: 2 days.
- Files to touch: `web/src/ui/calm/Today.tsx`, `useCalmSession.ts`, `EndCard.tsx`, `copy.ts`, `web/src/ui/calm/data/recommendation.ts`, tests; mirror in `app/ui/src`.
- Guardrails: needs the accepted safety flag, otherwise it routes through the notice. 2 s fade in, 250 ms or longer fade out. Pacer never above 3 flashes per second. Reduced motion shows a text counter. Wording: "A short pause", no health claims.
- Judge in 60 seconds: first screen after onboarding, one tap, see the whole loop finish at 1:30. A "Sped up 3x for judges" flag is not allowed. Judges can wait 90 seconds or see the end card via the demo.
- Test plan: fake-timer test for the 90 s run, end card, and clamps. Playwright run with reduced motion on.

### Five FIX items that must land before any cherry

1. Correct the "no audio file" claims in README, HLD and LLD, or remove the loops. Pick one. State the real size (about 1.4 MB, precached). Run `check:samples` and `check:privacy` after.
2. Wire the nature loops to a picker in the player, or delete them from precache. Today they cost 1.4 MB of offline download for nothing. Add a test that the picker exists.
3. Give the Crew tab real content: score, current beat, next change, and a plain list of what is read (git log and status only). It is the headline feature and the thinnest screen.
4. Make the Studio mode button less accidental: move it into Settings or label it "Advanced controls", and keep it off the onboarding screens. Keep the Skip path to sound at 2 taps.
5. State what is simulated. In the README and the Crew tab, mark `fake-crew` as a simulated feed. Show a real-host screenshot of the side panel, or label the panel unverified. Also walk the Skip path, Journeys day play and the end card in a browser, and fix what breaks.

Runner-up fixes: add a manual dark theme toggle, add a text breath cue for screen readers, add a "sleep mode" with a dim page, walk Firefox and Safari.

## Step 6: satisfaction scorecard

Score 1 to 5. Scores are honest at this commit. "Script" means a repeatable Playwright or node check. "Walk" means a human walkthrough with a stopwatch.

| # | Row | How measured | Now | Why this score |
|---|---|---|---|---|
| 1 | First impression | Walk: show the first screen to 3 people for 5 s, ask what the app does. Script: screenshot diff and word count | 4 | Warm, clear, one question. Mascot is friendly. 38 words on screen. |
| 2 | Time to first sound | Script: taps and seconds from load to `player-toggle`. Target 3 taps or fewer | 3 | 5 taps, about 5 s scripted. Skip path likely 2 taps but not walked. |
| 3 | Clarity of safety | Script: no AudioContext before accept. Walk: ask a person to repeat the three rules | 4 | Six plain bullets before sound. Does not show the numeric limits. Good enough. |
| 4 | Sound pleasantness | Walk: 5 listeners rate 6 templates. Script: peak, clipping and silence checks | 2 | Nobody listened. Only peak and limiter checks exist. Score is a placeholder until a human listens. |
| 5 | Calm of visuals | Walk: motion and brightness review. Script: flash rate under 3 per second, reduced-motion test | 3 | Soft palette and reduced-motion rule exist. The ring is bright at night. No sleep dim mode. |
| 6 | Ease of return | Script: second visit lands on Today with "Play again" in under 2 taps | 4 | Today has Play again and the week dots. Return path was built and tested. |
| 7 | Trust and privacy | Script: `check:privacy`, `audit:security`, zero requests off origin in Playwright | 3 | Gates are strong. The "no audio file" claim is false and the Crew tab shows no data. Drops 1 point. |
| 8 | Accessibility | Script: axe run on each tab. Walk: screen reader pass, keyboard only | 3 | Skip links, roles, live region and reduced motion exist. No axe run, no screen reader pass, ring has no text. |
| 9 | Offline | Script: load once, set offline, reload, play | 4 | PWA precache is in place (59 entries). Offline replay not run in this audit, so I hold at 4. |
| 10 | Delight | Walk: 5 users, count smiles or "oh" moments. Script: none | 3 | The mascot and the ring are nice. One feature moves the eye per session. Crew steering is not visible. |

Average: 3.3 out of 5. The target after FIX items 1 to 5 and the three cherries is 4.0.

## Method notes and limits

- Worktree at the audited commit was built with `vite build` and served by a small node static server with the isolation headers. Both were removed after the run.
- Tests re-run in this audit: app backend (34 pass). Other test counts in this document are from tests I read, not re-ran.
- Not checked: Rust build and clippy, the full vitest suite, the full E2E suite, the deck, the demo video, Firefox, Safari, a real phone, a real Kiro Crew host, any audio by ear.
- Research is cited by source name only. This audit makes no new health claim. The existing docs cite studies with mixed results, and they say so.
