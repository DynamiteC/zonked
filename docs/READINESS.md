# Release readiness

Source: five panel reviews of origin/main at af4df2b (product, marketing, medical safety, sound, devil's advocate). Every finding is de-duplicated here and put in one of three tiers. This is a working list, not legal advice.

**Ruling recorded from the conductor:** every item below is fixed in this release. Items that only a lawyer or the owner can settle are marked LAWYER or OWNER, and the "Done so far" column says what was done in the meantime.

Owning waves: **L** legal and docs, **S** sound, **C** copy, safety and catalog, **U** product UX, **E** engineering and CI, **OWNER** the project owner, **LAWYER** a qualified lawyer. Panels: P1 product, P2 marketing, P3 medical, P4 sound, P5 devil's advocate (with its own ids such as H1 or M3).

Status of every row: open (a row says "partly done" in the last column when this branch did a part).

Counts: 23 MUST FIX, 17 MUST HAVE, 14 GOOD TO HAVE (54 rows). LAWYER and OWNER rows are listed at the end.

## Tier 1: MUST FIX before public

| Id | Finding | Panel | Wave | Status | Done so far |
|---|---|---|---|---|---|
| R1 | 24 seed templates (21 Android, 3 Gnaural) copy step tables from a GPLv3 app and from Gnaural files with no licence. Replace with original schedules, rename ids that start with `android-` and `gnaural-`, update the 21 and 3 counts and test fixtures. Final word on whether the old tables are a derivative work. | P5 H1 | C, LAWYER | open | NOTICE and README now say plainly that wave C replaces these 24 and that a lawyer must give the final word. |
| R2 | Early commits show a personal name and email on the public default branch (P5 says 2 of 70, P2 says 3; recount before deciding). A merge shows a named account too. Decide before the first public push: rewrite history with a mailmap filter, or accept and say so. | P5 H2, P2 | OWNER | open | Not touched here. Rewriting changes every hash, so docs that quote commit ids need a re-check afterwards. |
| R3 | The e2e guide fix (commit d1b05f6) is not on main, so the published check counts are not reproducible. Land it, rerun, publish only real counts. | P5 H3 | E | open | README and app README now hold a placeholder line (`PLACEHOLDER-FINAL-RUN`) instead of any number. The integrator fills it. |
| R4 | Names, tags and copy read as health or treatment claims: "Morphine Ease" with a pain tag, "Hazy Visions", "Spark Burst", category "healing", "Heal from stress", "Stay steady with ADHD", the "ADHD friendly only" filter, "Lucid dreaming", "14 Nights to Easier Sleep" and "Why this works" style titles, and the Sanctuary line that says it helps with stress, burnout and sleep. Rename to plain words and drop the pain and hypnosis tags. Keep ids internal. | P5 H4, P3 M5 M6 M7 S4, P2 #5, P1 use cases | C | open | README and app README reworded ("may help some people relax", no ADHD or heal wording). In-app text is wave C. |
| R5 | Safety notice is missing items. Add: ask a doctor first (seizure disorder, serious mental health condition, tinnitus or sensitive hearing), clear volume advice (start very low, raise until you can still talk), do not use while driving or running machinery, photosensitivity and Reduce motion, stop if dizzy, anxious, in pain or ears ring or feel full, and replace the jargon limits line. Add two lines to the Guide. Wording needs a lawyer for store use. | P5 H5, P3 M1 M2 M3 M4 M8 | C, LAWYER | open | README and app README hearing safety sections carry the same points. |
| R6 | No privacy notice. Add `docs/PRIVACY.md`, link it from the README and from Settings. State the children line (not for under 13, no data collected). | P5 H6 M6, P3 | L, U | open, partly done | `docs/PRIVACY.md` written and linked from README and app README. Wave U links it from Settings next to "Forget my data". |
| R7 | Proof for the 14 public domain sample rows is thin (a template link, no saved page). Save the file pages, add a takedown route, and say what the check script does and does not prove. | P5 M1 | L | open, partly done | 14 pages fetched on 2026-11-28 and saved in `docs/legal/samples/`. All 14 show a clear author dedication. Proof and takedown sections added to `docs/SAMPLES-LICENSES.md`. No file needs removal. Whether the proof is enough for a store is LAWYER (R37). |
| R8 | Licence scope is unclear: LICENSE says nothing about legacy, samples and the font. NOTICE misses the font, samples, React and Workbox. The OFL text must travel with the font in the app build copy. | P5 M2 M3 | L, E | open, partly done | LICENSE has a scope note. NOTICE rewritten with shipped and not-shipped lists. `web/public/fonts/OFL.txt` already exists (wave E: the app build must copy it into `app/ui/dist`, which the integrator rebuilds). |
| R9 | Honesty edits: offline wording (6 of 22 loops precached, 16 after first play), "when run in Kiro Crew" for crew features, storage wording (localStorage and IndexedDB), "no internet" instead of "no network", health wording ("may help", not a medical device), test counts only from the final run. | P5 table | L, C | open, partly done | Done in README and app README. In-app and store text is wave C. |
| R10 | Library loudness is unbalanced (tone at -9 LUFS, loops at -31 to -42). Add a per-sound `trimDb`, a 40 Hz high-pass on the sample bus, lower tone gain by 6 to 9 dB, deepen the nature or beats duck to -20 dB. Re-measure, then freeze. | P4 MUST 1 2 3 | S | open | Not touched here. |
| R11 | Gong loop has a click at the loop point (9 times a normal step). Re-render or hide. Add a seam test at 2 times the 99.9th percentile step. Replace the hard clip guard with a soft knee. | P4 MUST 4 5 | S | open | Not touched here. |
| R12 | Harsh or odd sounds in sleep and Bluetooth lists: hide crickets, fire, birds, gong, thunder (sleep), and pull breeze and pebbles until re-listened. | P4 MUST 6 | S | open | Not touched here. |
| R13 | No person on the team has listened to the sounds. Listen to the three default sounds and all loops (OWNER-TEST), cut anything under 3 of 5, and hear the crickets, violet, fountain, trickle, flute, the duck slider and the gong. | P1 #1, P4 owner-pending, P5 | OWNER | open | `docs/OWNER-TEST.md` has the steps. |
| R14 | The help guide opens over the end card and hides the feel question, and tells a person who just finished to "Press Start". Show it later. | P1 #2 | U | open | Not touched here. |
| R15 | Today's first pick ignores the goal and time (nap sound for a dev, 15 minutes for a student, "Just curious" gets "Unplugged Break"). Match goal and time. Use a plain starter name and one line of what you will hear. | P1 #3, P2 #3 | U | open | Not touched here. |
| R16 | Feel check answers change nothing you can see. Show "Last time: calmer" and weight the next pick. All local. | P1 #4 | U | open | Not touched here. |
| R17 | Store screenshots and hero show a different app than the shipped build. Re-shoot from the shipped build. | P2 #1 | U | open | Not touched here. |
| R18 | The large player art mask reads as a scowl or a skull. Use the friendly Today mascot style. | P2 #2, P1 | U | open | Not touched here. |
| R19 | `app/app.json` description, tags and highlights are spec language ("no_std Rust WASM", "recovery"). Rewrite for a general user. Also the page title and meta description. Say plainly that the sentinel agent can run shell commands and ships off. | P2 #4 P2 trust | C | open | `app/README.md` already says it. Listing text is wave C. |
| R20 | "Until I stop" has no cap and is a risk for sleep. Add a 2 hour fade with a "Time for a rest" line, and hide the chip for the Sleep goal. | P3 M9 | U | open | Not touched here. |
| R21 | The live site was rolled back to the old Studio screen. Do not announce the site until the Calm build is live and re-walked, and check the live site against the store pictures before each post. | P1, P2 | OWNER | open | Not touched here. |
| R22 | Firefox and Safari were never run (a silent failure on iPhone is a one-star review). Run both. Say "tested in Chromium and WebKit" until then. | P1, P2 | E | open | README lists real Firefox and Safari as not tested. |
| R23 | Mixed claims in docs: "no health claims" and the brand mix of engineering words in the public README. Keep calm words for users, engineering words on the developer pages. | P2 | L | open, partly done | README opening and health wording changed. A calm README first screen (promise, picture, Try it) is R53. |

## Tier 2: MUST HAVE soon after

| Id | Finding | Panel | Wave | Status | Done so far |
|---|---|---|---|---|---|
| R24 | A sample takedown must reach installed users. Loop names have no hash and the runtime cache is CacheFirst, so a replaced loop stays cached. Add content-hashed names or a versioned cache name (and change the regex that blocks digits). Check that the update prompt cannot be dismissed forever. | P5 M8 | E, S | open | Takedown text in `docs/SAMPLES-LICENSES.md` says installed copies update with the app and names this plan. |
| R25 | Build reproducibility: add `rust-toolchain.toml`, a wasm hash check, a dist hash check, `npm ci` as the documented command, an install-script policy, a clean-clone build of the glob override. | P5 M12 | E | open, partly done | README quick start now uses `npm ci`. |
| R26 | Safety proof is mostly mocked. Keep one real-browser check that reads the output peak while a hot preset plays, run it on the public commit, and label mocked tests as mocked in the README. | P5 M10 | E | open, partly done | README now says some web tests stub the audio engine. |
| R27 | Name search for "Zonked" (app stores, EUIPO, USPTO, India registry, classes 9, 41, 44) and confirm who owns the 2018 mascot work (author, school or employer). | P5 M4 | LAWYER, OWNER | open | Not touched here. |
| R28 | The Kiro Crew app was never installed on a real host (install, enable, panel tab, cron). Run OWNER-TEST part B. `minKiroCrewVersion` was a guess. | P5 L6, P2 | OWNER | open | `docs/OWNER-TEST.md` has the steps. |
| R29 | Two safety gates (Studio and Calm) and two mascots. Decide: keep Studio with one shared "no sound before accept" test, or remove it. | P5 M9 | E, OWNER | open | Not touched here. |
| R30 | CSP still has `style-src 'unsafe-inline'`. Plan to move inline styles to classes and drop it. App mode CSP is only emulated. | P5 M7 | E | open | Not touched here. |
| R31 | Sound polish: equal-power crossfade on sound switch, curved start ramp, a different first minute each day (seed offset from the web layer), Bluetooth mono-fold note and stereo-independent picks, a per-group LUFS test. | P4 SHOULD 7 to 11 | S | open | Not touched here. |
| R32 | Carrier and beat choices: consider 250 to 300 Hz for focus, no binaural above 30 Hz (`android-learning`, `android-adhd-cycle` use 40 Hz). Owner ear check first. | P4 12 | S, OWNER | open | Not touched here. |
| R33 | Plain words and fit: replace jargon on starter cards and Today (theta, SMR-range), retitle the Crew tab for non-developers, fit the Options sheet at 390 wide and group nature sounds, keep the sleep path at 3 taps, add a one-tap "same as last time" and a quiet "Add to home screen" line. | P1 #5 to #9 | U | open | Not touched here. |
| R34 | Copy SHOULD list: hedge "What the sound does" (Sanctuary), change the EVIDENCE "strong" text, add in-ear and Bluetooth volume line, "Stop if you feel dizzy" on breathing intros, "If sleep trouble lasts, talk to a doctor", a distress helpline line (no numbers), an adults-only note, a long-session label above 60 minutes, "activity" instead of "load" and no "burnout" in shipped text. | P3 S1 to S10 | C | open | Not touched here. |
| R35 | Session end: a "Done for now" card with a quiet line, an optional local calm card image, a "Copy mix code" button. No tracking, no streaks, no counters. | P2 #6 #7 | U | open | Not touched here. |
| R36 | Save the Commons file pages for the 8 CC0 loops too (stream, ocean, rapids, lightrain, thunder, koshi, trickle, hum), as done for the 14 public domain ones. | P5 M1 | L | open | Listed in `docs/SAMPLES-LICENSES.md` as not yet saved. |
| R37 | Store listing wording, age rating, wellness claims and the safety notice for the markets you ship in (US, EU, India). | P5 H4 H5 H6 M6 | LAWYER | open | Not legal advice: README, PRIVACY and NOTICE say where a lawyer is needed. |
| R38 | Accessibility: a real screen reader and keyboard pass, then a short statement of what was tested. No WCAG claim until then. Check that a screen reader hears "Playing" before "Stopped" on the player. | P5 M5, P1, P2 | E, OWNER | open | No WCAG claim exists in README or app README (kept that way). |
| R39 | Kiroween contest rules: check that open source terms and the bundled demo video fit the rules. | P5 L5 | OWNER | open | Not touched here. |
| R40 | `SECURITY.md` and the MCP stdio trust line were missing. | P5 M11, GOOD list | L | open, partly done | `SECURITY.md` written. `app/README.md` carries the one-line trust model. |

## Tier 3: GOOD TO HAVE

| Id | Finding | Panel | Wave | Status | Done so far |
|---|---|---|---|---|---|
| R41 | SVG turbulence filters on the main thread may drop frames on low-end phones. Measure, add a low-power path. | P5 L1 | E | open | Not touched here. |
| R42 | Test an IndexedDB upgrade from a v1 database with junk rows. | P5 L2 | E | open | Not touched here. |
| R43 | Working papers in `docs/` read as promises (some are stale). Move them to a notes folder or delete. Generate README counts from a script. | P5 L7 L8 | L, E | open | README counts that were hard-coded were replaced by one placeholder line. |
| R44 | Add CI (build, tests, check:samples, check:privacy, audit) on the public repo. | P5 | E | open | Not touched here. |
| R45 | Check the deck binary for unlisted images or fonts. | P5 L4 | OWNER | open | Not touched here. |
| R46 | Frame-rate capture of all visuals for flash rate, real device tests with a sound level meter (wired, Bluetooth, in-ear), and a review by a clinician with real users who have tinnitus or ADHD. | P3 LATER 1 2 3 | OWNER | open | Not touched here. |
| R47 | Reduce the Studio-only sounds that reach 40 Hz, or label them "stronger". | P3 L4 | S | open | Not touched here. |
| R48 | Optional quiet "listened today" total with a rest note at 2 hours. | P3 L5 | U | open | Not touched here. |
| R49 | Store art extras: dark variants, the 25:6 banner, a "Surprise me" pick, translated listing text, a 20 second silent first-run loop. | P2 LATER, #8 | U | open | Not touched here. |
| R50 | A small local "what helped" page (counts of Calmer, Same, Not for me by sound). | P1 #10 | U | open | Not touched here. |
| R51 | Real device checks: Bluetooth headset with and without call mode, Safari MP3 loop gaps, laptop speakers for the subsonic cut. | P4 13 | OWNER | open | Not touched here. |
| R52 | Replace or label the synth flute, re-record fire and birds with a gentle top cut, refresh hiss scores after any re-encode. | P4 14 15 16 | S | open | Not touched here. |
| R53 | README first screen: promise, one picture, "Try it" first, Kiro Crew after. | P2 #8 | L | open | Not touched here. |
| R54 | Small copy points: "Hello, night owl" at 9 pm, a hint that High contrast stays bright at night, and a pass that keeps all wording free of streak or guilt words. | P1, P3 | C | open | Not touched here. |

## Items that need a lawyer

- R1: whether the Android and Gnaural step tables are a derivative work, and the final wording of NOTICE item 8.
- R5 and R37: wording of the safety notice and wellness claims for stores and for the markets you ship in.
- R7: whether the saved public domain proof is enough, and the takedown process.
- R27: name search for "Zonked" and ownership of the 2018 mascot work.
- R37: privacy notice wording and the children line if the app is listed in a store.

## Items that need the owner

- R2 identity in early commits (decide before the first public push), R13 listen to the sounds, R21 live site state, R27 mascot ownership, R28 real Kiro Crew host test, R29 Studio decision, R32 ear check on carriers, R38 screen reader pass, R39 contest rules, R45 deck check, R46 and R51 device and clinician tests.

## What this branch did

Branch `fix/readiness-legal` (wave L). Files: `docs/READINESS.md`, `docs/PRIVACY.md`, `SECURITY.md`, `NOTICE`, `LICENSE` (scope note only), `README.md`, `app/README.md`, `docs/SAMPLES-LICENSES.md` (proof and takedown sections), `docs/legal/samples/` (14 saved pages). Checks run: `check:chars`, `check:privacy`, `check:samples`.

Not checked: whether `app/ui/dist` carries the font licence text (the integrator rebuilds it), the full text of the 8 CC0 pages, and any legal point. Nothing here is legal advice.
