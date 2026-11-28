# Satisfaction walk 2

Same method as `docs/SATISFACTION-WALK.md`: five personas, ten scorecard rows from `docs/FEATURE-AUDIT-RICE.md` Step 6. Build: HEAD 61351bc, Vite build in a throwaway worktree under /tmp (removed after). Chromium via Playwright for all personas. One phone-width pass in WebKit. No source changed, nothing committed. Scripts, results.json and 60 screenshots are in `.work/walk2/` (`walk.mjs`, `f.mjs` to `n.mjs`, `shots/`, `app/`).

## Warnings

- Sound pleasantness stays owner-pending at 2. Nobody listened. There are now 22 loops and 10 made-in-code sounds. None were heard.
- Firefox was not run. Playwright Firefox crashes at `newPage` here, even on a blank `setContent` page (`ff.mjs`). It is the sandbox, not the app. Nothing is known about Firefox.
- WebKit ran on the Skip path only: plays, no console errors, same layout as Chromium (`shots/k-webkit-2.png`). Not run in WebKit: guided path, Crew demo, nature, own sounds.
- Not run: axe-core, a real screen reader, a real phone, audio by ear, offline replay (precache is still 68 entries, 2040 KiB).
- The contrast script reads computed colours. It cannot see the dim-screen filter. The dim player (Stop button turns dull gold, `p1skip-6-player.png`) was judged by eye only.
- Own-sound upload was not driven with a file. Only the screen and its limits text were read.
- Times are script times with no reading pause. Add about 1 second per 4 words.

## Result

| | Walk 1 | Now |
|---|---|---|
| Average, all 10 rows | 3.8 | 3.9 |
| Average, 9 rows without sound | 4.0 | 4.1 |

Only one row is below 4: sound pleasantness (owner-pending). Trust and privacy rose to 5. Nothing fell.

## Persona walks

| # | Persona | Taps to sound | Script s | Words before sound | Walk 1 (taps, s, words) |
|---|---|---|---|---|---|
| 1a | Stressed dev, guided (Calm down, Evening, Headphones) | 8 | 2.7 | 252 | 8, 2.7, 242 |
| 1b | Stressed dev, Skip | 2 | 1.7 | 131 | 2, 1.7, 127 |
| 2 | 1 am, 360x740, Sleep, Night | 8 | 2.5 | 246 | 8, 2.4, 247 |
| 3 | Judge, 1280x720, Skip then Crew demo | 2, plus 1 for demo | 1.7 | 130 | 2, 1.7, 126 |
| 4 | Day 3 return (clock moved two days) | 1 | 1.2 | 151 on Today | 1, 1.3, 281 |
| 5 | Keyboard only | 27 key presses | 4.3 | 5 screens | 27, 4.2 |

Facts:
- Console errors: 0 on every run. Requests off the origin: 0 (persona 1, 3, and the nature screen run).
- Skip is still the fast path. A starter is picked for the person and no starter screen shows.
- The guided path still ends in a starter step (3 cards, "Hear 10 s" buttons). The label now says it plays 10 s. Better than "Preview".
- Skip plays "Quick Mind Bridge" with a 10 minute timer (09:58 shown).
- Today fell from 281 to 151 words for persona 4.

### Persona 1: stressed developer

- First screen (`p1-1-goal`, `x1.png`): one yellow Next button, "Just curious" preselected with a yellow bar and a check "Selected". Reads as a default now, not as a warning. Good.
- At 390x844 the Skip link sits below the fold. Only Next shows. The fastest path is hidden until a scroll. This is the main first-impression flaw.
- Safety screen: six plain lines, button "I understand, start". No numbers for limits (same as walk 1).
- Starter step (`j-starter.png`): "Easing Spring: Slides from beta down to alpha over 15 minutes." Band words (beta, alpha) are jargon for a tense person. "Wakeful alpha for a 10 minute seated sit." appears on several cards.
- No guilt, no streak, no pressure found.

### Persona 2: cannot sleep at 1 am, 360x740

- Sleep gives Lulled Pillow, 45 min, timer 44:59.
- Dim screen is on by default from 19:00 to 07:00 (`dim-switch` true). It is in You, with a switch. That closes the walk 1 gap.
- Timer chips still show no selected state. `aria-pressed` is null and `aria-checked` is false on all six chips, so a screen reader cannot tell either. Not fixed from walk 1.
- At 360x740 the "Add nature sound: rain" button sits at y 703, under the tab bar (top at 660). It needs a scroll. Not fixed from walk 1 (`m-360-player.png`).
- Mascot scene at night: moon, clouds, soft face (`p2-6-player.png`). Calm.
- "Hello, night owl." Friendly. No pressure.

### Persona 3: hackathon judge, 3 minutes

- Skip: sound at 1.7 s.
- Crew demo (`p3-demo-25s.png`): "Simulated session" badge, switch now reads "Demo is steering the sound" with a note that it waits. This fixes the switch showing off. The Why line now comes before the stage chips in the text order.
- At 1280x720 the Why box starts at the fold and the mini player bar covers it. The sentence is not readable without a scroll. Same place as walk 1, smaller cut.
- After 60 s: "That was pretend. Real mode reads git counts only." replaces the bare "Not connected". Fixed from walk 1.
- Crew page has 130 words idle. Dense, but one idea per block.

### Persona 4: day 3

- Today (`p4-day3-today.png`): "Hello, night owl.", one yellow Start, "Not this one", Focus sprint card, "A short pause, 90 seconds" card, week dots. Mon to Wed are dashed rest days. "Rest days count too." No streak, no guilt.
- 1 tap to sound. 151 words total on the page.
- Copy flaw left: "21 min. 21 minutes that drift back and forth between 10 and 6 Hz." says 21 twice. Two cards share "Wakeful alpha for a 10 minute seated sit." (Open Cushion, Patient Breath).

### Persona 5: keyboard and screen reader

- Keyboard reaches Next, Next, Next, I understand, Start, then plays. 27 presses. Pass.
- Onboarding now has an h1 (`heading "What brings you here?" [level=1]`). Fixed. The word "Selected" is gone from the radio name. Fixed.
- Each choice is still read twice: the radio name, then the same text as a separate node. Not fixed.
- No unnamed controls. Landmarks: header, main, nav "Main". Language set. Live regions: the status, and a polite one for the breath phase that speaks only when the phase changes (`announce-switch` on by default, off-able in You).
- Tiny target: only the Skip to content link (129x42).
- Contrast: all text passes in light, high contrast (with and without dim), and the dark look. One fail: decorative "z" at 2.60 (28 px, needs 3). It is hidden from the tree.
- Not checked: tab order after screen change, a real reader.

## New features, one check each

| Feature | Result | Evidence |
|---|---|---|
| Ruled minimalist design | One yellow button per screen on onboarding, Today, Starter. Two primary-looking buttons on the end card (Play again yellow, Close outline). That is one primary. Pass. | `x1.png`, `h-endcard.png` |
| Atkinson font | Renders, 10 and 6 read clearly, zero looks different from O. | `p4-day3-today.png` |
| Mascot, breath, 3 s scenes | Moon scene, face changes (open mouth on breathe). Shortest loop 3000 ms. | `i-sprint.png`, `j-breathe-run.png` |
| Nature picker and blend | 32 flat cards (22 recordings, 10 made-in-code). The blend slider "More nature, softer beats" and the volume slider are at the very bottom, after 32 cards and 32 Credits links. Slider is not near the cards. | `h-nature-picker.png` |
| Own sounds | Section "My sounds" under the picker: "Stays on this device", "never uploaded", 5 sounds, 8 MB each, 20 MB total, 10 minutes. File input exists (`mine-file`). | `h-nature-picker.png` |
| Crew why panel and 60 s demo | Works. See persona 3. | `p3-demo-*.png` |
| 90 s pause | Screen: "Ninety seconds of slow breathing with a soft sound. Stop any time." Button "Begin". Not run to the end. | `g-pause.png` |
| Theme, high contrast, dim | System, Light, Dark, High contrast radios. Contrast passes in all. | `m-*-today.png` |
| Screen reader breath | Polite region, speaks on phase change. Visible "Breathe in" also appears twice in page text (visual plus hidden copy). | `j.mjs` output |
| Feel check | After 66 s of sound and Stop: "Done for now. ... Go at your own pace. How was that? Calmer / Same / Not for me." No guilt. Sessions under 60 s show no card. | `h-endcard.png` |
| Focus sprint | Timer chip "Focus sprint" starts "Focus 24:59". Today card shows only for goal Focus. | `i-sprint.png` |
| Breathe 5 min | Shows on Today only for goal Calm down, and in Sounds. "Many people find slow breathing calming." Runs, "4:56 left", true beat off per commit. | `j-breathe-run.png` |
| Starter skip | Skip, just play: 2 taps. | `p1skip-6-player.png` |
| Honest copy lint | "Zonked is not a medical device." Nature note: "makes no health claims". "Calmer" in the feel check is an outcome word but the person is the one who says it. Starter text "to ease sleep onset" is gone. | `g-sounds.png` |
| Browser fallbacks | WebKit phone Skip path plays. Firefox not run. | `k-webkit-2.png` |

## Kiro Crew app build

`node app/ui/scripts/csp-harness.mjs --shots .work/walk2/app` (dashboard CSP, same allow-list).

- `ok: true`. Peak 0.40 playing, 0.48 after unmount. Sound survives unmount. Panel Stop works. Crew default "Crew is off." Crew steering and off both work. No Stop buttons while the page is open (0).
- Look matches the web build: same header, mascot, yellow Stop, chips, toggle (`app/calm-playing.png`). First impression and consistency are good.
- Harness log shows 404 for `pwa-192x192.png` twice (the harness host page asks for an icon the app folder does not serve) and a 403 on `assets/dsp_core.wasm` (probe: direct wasm fetch is blocked by design, the module is inlined). The blocked data: wasm lines are the blob and data probes. Not user faults.
- The harness page opens mid-scroll in the shot, so the top of the player is cut. This is a harness frame (640 px box), not the app.

## Flashes per second

Infinite animations on the player: `vl-wglow` 1, `vl-drift` 8, `cm-sway` 1, `cm-rip` 6, `cm-blink` 2, `cm-drift` 6. Shortest period 3000 ms (0.33 per second). Full-screen luminance sampling (40 JPEG frames in 4 s): size range 15177 to 15363 bytes, no flash. Result: under 3 per second. Pass.

## Copy review

- No streaks, no guilt, no "come back" pressure. Week dots use "rest day".
- No medical wording found. Nature note and safety lines say it is not a medical device.
- Left: "21 min. 21 minutes ..." and the repeated "Wakeful alpha for a 10 minute seated sit." (`web/src/catalog/seeds.ts`, `web/src/ui/calm/copy.ts`).
- "Free to use, public domain" and a "Credits: X" link repeat on 22 cards.

## Re-scored scorecard

| # | Row | Walk 1 | Now | Evidence |
|---|---|---|---|---|
| 1 | First impression | 4 | 4 | `x1.png`: mascot, one yellow button, 36 words, default clearly marked. Skip is below the fold at 390x844. |
| 2 | Time to first sound | 4 | 4 | Skip: 2 taps, 1.7 s (`p1skip-6-player.png`). Guided: 8 taps, 252 words. |
| 3 | Clarity of safety | 4 | 4 | Six plain lines, then "I understand, start". No numeric limits shown. |
| 4 | Sound pleasantness | 2 | 2 | Owner-pending. 32 sounds now, none heard. |
| 5 | Calm of visuals | 4 | 4 | Dim by default at night, shortest loop 3 s, no flash. No selected timer chip, nature button under tab bar at 360x740, 32 flat cards. |
| 6 | Ease of return | 4 | 4 | `p4-day3-today.png`: 1 tap, 151 words (was 281). |
| 7 | Trust and privacy | 4 | 5 | 0 off-origin requests, 0 errors. Demo ends with "That was pretend. Real mode reads git counts only." Own sounds stay on device with a limit text. |
| 8 | Accessibility | 4 | 4 | h1 and "Selected" fixed, high contrast and announce switch exist, contrast passes. Timer chips expose no state, doubled radio text, 2.60 "z", nature button hidden under nav at 360 px. |
| 9 | Offline | 4 | 4 | Precache 68 entries, not replayed. Held. |
| 10 | Delight | 4 | 4 | Mascot scenes, breath, end card, demo with end line. Why box still cut at 1280x720. |

Average: 39 of 50 is 3.9 (walk 1: 3.8). Without sound: 37 of 45 is 4.1.

## Rows below 4

Only row 4, sound pleasantness (2). It is the owner's to lift.

Exact steps to reach 4:

| # | Fix | Effort | Files |
|---|---|---|---|
| 1 | Owner listens to the 10 starters and the 10 made-in-code sounds with headphones for 10 minutes each. Rate each 1 to 5. Cut or fix any under 3. | M (owner) | `web/src/catalog/seeds.ts`, `web/public/samples/`, `docs/SAMPLES-LICENSES.md` |
| 2 | Put the 3 best sounds first in the picker and in the Skip path, so the first 10 seconds are the best 10 seconds. | S | `web/src/ui/calm/nature/`, `web/src/ui/calm/data/` |
| 3 | Check loop seams and clipping by ear on each loop. Fix any click at the loop point. | M | `web/public/samples/` |

## Fixes to move rows 5 to 10 up to 5, by gain per effort

| # | Fix | Rows | Effort | Files |
|---|---|---|---|---|
| 1 | Show the active timer chip: add `aria-pressed` and a filled style. Default to Sleep fade for Sleep. | 5, 8, 10 | S | `web/src/ui/calm/TimerChips.tsx`, `web/src/ui/calm/calm.css` |
| 2 | Move the Skip link above the fold at 390x844 (reduce the mascot height on onboarding or put Skip above the list). | 1, 2 | S | `web/src/ui/calm/Onboarding.tsx`, `web/src/ui/calm/calm.css` |
| 3 | Nature picker: put the blend and volume sliders at the top (sticky), group the cards (Water, Wind, Birds, Made in code), and drop the repeated "Credits" link into one footer list. | 5, 10 | M | `web/src/ui/calm/nature/NaturePicker.tsx`, `web/src/ui/calm/calm-screens.css` |
| 4 | At 360x740 give the player bottom padding so "Add nature sound" clears the tab bar. | 5, 8 | S | `web/src/ui/calm/PlayerScreen.tsx`, `web/src/ui/calm/calm.css` |
| 5 | Crew demo at 1280x720: hide or shrink the mini player on the Crew screen so the Why box is readable without a scroll. | 10, 1 | S | `web/src/ui/calm/CrewScreen.tsx`, `web/src/ui/calm/calm-screens.css` |
| 6 | Copy: "21 min. 21 minutes ..." becomes one number; make the two 10 minute seated cards differ; replace "beta down to alpha" with plain words. | 1, 6 | S | `web/src/catalog/seeds.ts`, `web/src/ui/calm/copy.ts` |
| 7 | Doubled radio text: remove the duplicate text node after each radio. Raise the "z" mark to 3:1 or add `aria-hidden` plus a decorative role check. | 8 | S | `web/src/ui/calm/ChoiceGrid.tsx`, `web/src/ui/calm/calm.css` |
| 8 | Show the numeric limits (20 Hz to 1500 Hz carrier, 40 Hz beat cap) as one line under "Before you start". | 3 | S | `web/src/ui/calm/copy.ts` |
| 9 | Guided path: skip the starter step when one clear pick exists. | 2 | M | `web/src/ui/calm/Onboarding.tsx` |
| 10 | Run Firefox and axe-core on a machine where they work, and run offline replay again. | 8, 9 | S | `web/scripts/verify-e2e.mjs` |

## Regressions

None found. Items from walk 1 still open (not regressions): timer chip state, nature button under tab bar at 360 px, Why box cut at 1280x720, repeated starter sentences, doubled radio text.

Skipped or not checked: Firefox (crashes in this sandbox), real screen reader, axe, listening, own-sound upload with a file, guided and demo paths in WebKit. Risk: the 3.9 average rests on Chromium script runs and one WebKit page, and the dim look was judged by eye.
