# Satisfaction walk

A fresh-eyes walk of five people through the app at commit fadb2ad. No source was changed. The app was built with Vite in a throwaway worktree and driven in Chromium with Playwright. Scripts, raw results and screenshots are in `.work/walk/` (`walk.mjs`, `results.json`, `shots/`).

## Warnings

- Sound pleasantness is owner-pending. Nobody listened. It keeps the placeholder 2.
- Not run: axe-core (it is not in node_modules and there is no network), a real screen reader, a real phone, Firefox, Safari, offline replay, audio by ear.
- Times are script times with no reading pause. A person adds about 1 second per 4 words read.
- No 90-second reset exists at this commit. The audit mentioned it as a cherry. It is not built.

## Result

| | Baseline (audit) | Now |
|---|---|---|
| Average, all 10 rows | 3.3 | 3.8 |
| Average, 9 rows without sound | n/a | 4.0 |

Lowest row: sound pleasantness at 2 (owner-pending). Every other row is 4. The 4s with the most known flaws are accessibility, calm of visuals and first impression.

## Persona walks

All taps count mandatory plus chosen taps. Words are the sum of words on every screen shown before sound.

| # | Persona | Taps to sound | Script seconds | Words read | Screens |
|---|---|---|---|---|---|
| 1a | Stressed dev, guided (Calm down, Evening, Headphones) | 8 (5 if the default answers are kept) | 2.7 | 242 | `p1-1-goal`, `p1-4-safety`, `p1-5-starter`, `p1-6-player` |
| 1b | Stressed dev, Skip | 2 | 1.7 | 127 | `p1skip-1-goal`, `p1skip-4-safety`, `p1skip-6-player` |
| 2 | 1 am, 360x740 phone, Sleep and Night | 8 | 2.4 | 247 | `p2-1-goal` to `p2-6-player`, `p2-today` |
| 3 | Judge, 1280x720, Skip then Crew demo | 2, then 1 more for the demo | 1.7 | 126 | `p3-6-player`, `p3-crew-idle`, `p3-demo-*` |
| 4 | Day 3 return (clock moved two days) | 1 (Start on Today) | 1.3 | 281 on Today | `p4-day3-today`, `p4-day3-playing` |
| 5 | Keyboard only | 27 key presses, including Tab searches | 4.2 | 5 screens | `p5-kb-player` |

Facts from the runs:

- Zero errors in the console. Zero requests left the origin (persona 1 and 3).
- Skip is the strong path. Two taps reach sound, and a starter is chosen for the person.
- The guided path asks 3 questions, a safety screen and a starter pick. The starter pick is a fifth step the person did not ask for.
- The 1 am night person gets a dark screen. Mean luminance is 0.165 of white on the player and 0.18 on Today. The day look is an opt-in switch in You.

### Persona 1: stressed developer after a failed build

Wants calm now. Skip gets there in 1.7 s. The guided path is 8 taps and a person who is tense will not read 242 words.

Confusion:
- The first screen has "Just curious" already selected. A tense person may think the answer is already decided and tap Next. This is fine, but the "Selected" label sits on the right and the goal text is yellow, so it looks like a warning, not a default.
- The starter step shows 3 Preview buttons and one Start. Preview does not say it plays sound.

### Persona 2: cannot sleep at 1 am on a phone

- Sleep gives Lulled Pillow with a 45 minute timer. The timer text reads 44:59.
- No timer chip looks selected (`p2-6-player`). The person cannot tell that "Sleep fade" is the active choice.
- At 360x740 the nature button sits under the tab bar and needs a scroll.
- The player shows "Breathe in" text that changes. It is a live status. A person with a screen reader in bed may hear it repeat. Not verified with a reader.
- There is no dim mode. The moon scene is soft, but no setting lowers the screen for sleep.
- Today at 1 am says "Hello, night owl." It is friendly and has no pressure.

### Persona 3: hackathon judge, 3 minutes, no install

- Time to sound: Skip, I understand. 1.7 s. Good.
- Crew tab, then "Watch the crew work". The demo runs 60 s with a "Simulated session" badge. Stages: load 22 and 40 Hz, load 48 and 18 Hz, load 70 and 10 Hz, load 88 and 6 Hz. Each stage has a Why sentence (`p3-demo-25s`).
- It explains itself in one pass: score, beat, stage chip and a Why line. This is the best moment of the app.
- Flaws: the stage chips (Fresh, Warming up, Time for a break) look like buttons but do nothing. The Crew switch shows off while the demo runs. At 1280x720 the Why sentence sits under the mini player and is cut at "18 H" until the page is scrolled. After 60 s the screen returns to "Not connected" with 128 words and no summary of what was shown.

### Persona 4: returning user, day 3

- Today opens with one yellow Start button. One tap resumes sound. Good.
- The page has 281 words and 12 cards below Start. It is long for a person who wants the same session.
- The week dots show Mon to Wed as dashed rest days. "Rest days count too." is kind. No streak, no guilt.
- Copy mismatch: "Twenty minutes ..." sits next to "21 min". Several cards repeat the same sentence (Crisp Rooftop and Dusty Cassette; Neon Skyline and Sleepy Playlist).

### Persona 5: keyboard and screen reader

Checked by script and accessibility tree, since axe is not available offline.

- Keyboard reaches Next, Skip, I understand, Start and plays. Focus rings are present on the first controls (computed outline or shadow).
- No unnamed controls on the player or Crew screens. One h1 on each main screen. Landmarks: header, main, nav "Main". Language is set. Two live regions (status).
- Onboarding has no h1 and repeats the question twice (a heading and a group name).
- Each choice is read twice: the radio name and then the same text as a separate node.
- Radio name includes the word "Selected" for the chosen row ("Just curious Selected").
- Tiny targets: only the Skip link (129x42).
- Contrast: all text passes in night and day looks. One failure: the decorative "z" at 2.60, hidden from the tree.
- Not checked: tab order after a screen change, focus return after the mini player, a real screen reader.

## Copy review

- No streaks, no guilt, no pressure to return. "Rest days count too." and "Zonked is not a medical device." are good.
- Soft health lines remain in starter descriptions: "to ease sleep onset" and "to quiet racing thoughts" (`web/src/catalog/seeds.ts`). They read as outcome claims. Reword to describe the sound, not the effect.
- "What the research says" is a button on the player. It is fine and opt-in.
- Crew text is honest: "Nothing leaves your computer" and "Simulated".

## Flashes per second

All infinite animations were listed from the live page. The shortest period is 1.1 s (the happy mascot bounce, about 0.9 per second, a body move and not a full-screen change). Others run 1.5 s to 10 s. Highest full-screen luminance change: none. Result: 3 per second or fewer, pass. Reduced-motion rules exist in `calm.css` and `mascot.css`.

## Re-scored scorecard

| # | Row | Before | After | Evidence |
|---|---|---|---|---|
| 1 | First impression | 4 | 4 | `p1-1-goal`: one yellow button, 36 words, friendly mascot. Default answer styling is unclear. |
| 2 | Time to first sound | 3 | 4 | Skip: 2 taps, 1.7 s (`p1skip-6-player`). Guided path is 8 taps. Target met by Skip only. |
| 3 | Clarity of safety | 4 | 4 | `p1-4-safety`: six plain lines. Numeric limits are still not shown. |
| 4 | Sound pleasantness | 2 | 2 | Owner-pending. Nobody listened. Placeholder only. |
| 5 | Calm of visuals | 3 | 4 | Dark by default, mean luminance 0.17, slowest and fastest animation within limits. No sleep dim and no selected timer chip. |
| 6 | Ease of return | 4 | 4 | `p4-day3-today`: 1 tap. Page is long (281 words). |
| 7 | Trust and privacy | 3 | 4 | 0 off-origin requests, 0 console errors. Crew screen says what it reads. |
| 8 | Accessibility | 3 | 4 | No unnamed controls, contrast passes, keyboard completes. Doubled labels, no onboarding h1, no axe or reader run. |
| 9 | Offline | 4 | 4 | Not re-run. 68 precache entries in the build. Held at 4. |
| 10 | Delight | 3 | 4 | `p3-demo-25s`: the crew demo shows cause and effect. Mascot scene with moon. |

Average: 38 of 50 is 3.8 (baseline 3.3). Without the sound row: 36 of 45 is 4.0.

## Top 10 fixes, by gain per effort

| # | Fix | Rows helped | Effort | Files |
|---|---|---|---|---|
| 1 | Show a selected state on the active timer chip (and Sleep fade by default for Sleep) | 5, 8, 10 | S | `web/src/ui/calm/TimerChips.tsx`, `web/src/ui/calm/calm.css` |
| 2 | In the Crew demo, put the Why line above the stage chips, make chips look like labels, and turn the Crew switch on or hide it during the demo | 10, 1 | S | `web/src/ui/calm/CrewPanel.tsx`, `web/src/ui/calm/CrewScreen.tsx`, `web/src/ui/calm/calm-screens.css` |
| 3 | Show a short end line after the demo ("That was pretend. Real mode reads git counts only.") instead of a bare "Not connected" | 10, 7 | S | `web/src/ui/calm/CrewScreen.tsx`, `web/src/ui/calm/copy.ts` |
| 4 | Reword outcome lines in starter descriptions; fix "Twenty minutes" against "21 min"; remove repeated sentences across cards | 7, 1 | S | `web/src/catalog/seeds.ts`, `web/src/ui/calm/copy.ts` |
| 5 | Cut Today to Start, the week dots and 3 cards plus "Browse all sounds" | 6, 1 | S | `web/src/ui/calm/Today.tsx` |
| 6 | Fix doubled radio text and add an h1 to onboarding; drop "Selected" from the radio name | 8 | S | `web/src/ui/calm/ChoiceGrid.tsx`, `web/src/ui/calm/Onboarding.tsx` |
| 7 | Make the starter step optional: skip it when the guided answers already give one clear pick, and label Preview "Hear 10 s" | 2 | M | `web/src/ui/calm/StarterStep.tsx`, `web/src/ui/calm/Onboarding.tsx` |
| 8 | Sleep dim mode: when goal is Sleep or the time is late, lower screen brightness and hide the moon glow | 5 | M | `web/src/ui/calm/look.ts`, `web/src/ui/calm/calm.css` |
| 9 | Stop the "Breathe in" live status from announcing every cycle (use a polite region that changes rarely, or none) | 8 | S | `web/src/ui/calm/PlayerScreen.tsx` |
| 10 | Keep the "Recent" tab on one row and keep the mini player from covering cards (more bottom padding on Sounds) | 5, 1 | S | `web/src/ui/calm/Library.tsx`, `web/src/ui/calm/calm-screens.css` |

Not in the list: listening tests for sound pleasantness (the owner does this), a real screen reader pass, and an axe run once axe-core can be installed.
