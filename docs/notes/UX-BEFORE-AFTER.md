# Zonked UX: before and after, and a redesign brief

Status: report only. No source file was changed. Shots were taken from throwaway builds of commit 96d55ca (original) and HEAD of feature/zonked-app (Calm web, Calm in the Kiro Crew app), built with Vite only (wasm file as committed). Viewports: 1280x800 (suffix d) and 375x812 (suffix m). All shots are in `docs/ux-shots/` with the prefix `before-`.

Shot names used below: `before-orig-first-d|m`, `before-calm-first-d|m`, `before-calm-step2-d`, `before-calm-step3-d`, `before-calm-safety-d|m`, `before-calm-starter-d|m`, `before-calm-today-d|m`, `before-calm-player-d|m`, `before-calm-library-d|m`, `before-calm-journeys-d|m`, `before-calm-crew-d|m`, `before-calm-settings-d|m`, `before-calm-studio-d|m`, `before-app-first-d|m`, `before-app-gate-d|m`, `before-app-calm-playing-d|m`.

Shots I opened and read: orig-first d and m, calm-first d and m, calm-today-d, calm-player-d, calm-safety-m, calm-library-d, calm-studio-d, app-first-d, app-calm-playing-m, calm-journeys-m. The other shots were captured with the same script and not read one by one.

Measured at HEAD: first load is 79.9 KB gzip (JS 74.9 KB, CSS 5.0 KB), under the 110 KB budget.

## 1. First-impression test (5 seconds)

| Surface | What is it? | What do I do? | Feels safe? | Score |
|---|---|---|---|---|
| Original Studio (`before-orig-first-d`) | Unclear. A dark robot face, a tagline, 4 header buttons, many small "?" boxes. | Press the yellow Play, or pick one of 6 "Play this" cards. Both start sound at once. | Weak. No headphone or volume note on screen. Violet noise warns in yellow text, which is good, but the rest is silent about risk. | 2 |
| Calm web (`before-calm-first-m`) | Clear. A friendly mascot, "Free. Private. No account.", "What brings you here?". It does not yet say "sound app". | Pick one of 6 answers, tap Next. On desktop the Next button sits below the fold at 800 px high (`before-calm-first-d`). | Strong. Safety notice comes before any sound (`before-calm-safety-m`). Plain list, one big button, Back link. | 4 |
| Calm in the Kiro Crew app (`before-app-first-d`) | Same onboarding card, but a second block under it says "Open Zonked once to read the headphone note" with a greyed Play. Two products in one frame. | Same as Calm web, plus a confusing grey Play that does nothing yet. | Good message, but the plain grey panel looks unfinished next to the warm page. | 3 |

Evidence notes:

- Original: the Play button is the loudest object, and nothing asks about the user first. The word "Zonked" gives no hint of what the sound does.
- Calm web: the single-column question reads in about 4 seconds. The cost is the 5-step path (see section 6).
- Calm in app: in the phone shot (`before-app-calm-playing-m`) the page shows its own bottom tab bar and, below it, the panel with a second Stop button. Two Stop buttons on one screen is the clearest flaw.

## 2. What happened to the UI

Improved:

- Entry. The original asks nothing and starts sound on one tap. Calm asks one question, then shows the safety notice, then offers a starter sound. Safety moved from a footnote to a gate.
- Tone. "Hello, night owl", "Rest days count too" and "Volume is capped for your safety" replace labels such as "Keep awake" and "Help me choose".
- Layout. One column, big targets (44 to 56 px), pill buttons, one primary button per screen (`before-calm-today-d`).
- Player. A large mascot, one Stop, timer chips (15, 30, 60, until I stop, sleep fade). Few controls (`before-calm-player-d`).

Regressed or still plain:

- Desktop frame. The left rail is a wide empty strip with five text links and nothing else. The brand "Zonked" sits at the left of the main area (x=216) while the content column starts at x=330, so the two do not align (`before-calm-today-d`, `before-calm-library-d`).
- Library on desktop shows 8 flat tiles and then 60 percent empty space (`before-calm-library-d`). The tiles carry a name only: no count, no icon, no sound preview.
- Mini player on Today covers the first row of cards at 800 px high (`before-calm-today-d`). On phone it sits just above the tab bar and hides the fourth Journey card (`before-calm-journeys-m`).
- Mascot is large on onboarding and the player, small on Today, and absent on Library, Journeys and Settings. It is a face that comes and goes, not a guide.
- Studio is unchanged from the original (`before-calm-studio-d` equals `before-orig-first-d`). It keeps the "?" boxes, yellow-on-black style and square corners. It is related to Calm only by the mascot and the words.
- The Studio mode pill is top right on every Calm screen with the same weight as a primary action. A new user does not need it.
- App page. The panel under the page is built with inline styles and native grey buttons (`app/ui/src/Panel.tsx`), so it looks like another product.

## 3. Consistency audit

Shared tokens already exist for Calm and the app: the app stylesheet carries the same `--c-*` variables as `web/src/ui/calm/calm.css`. Studio uses a separate set (`--bg`, `--panel`, `--gold`, `--mint`, `--s1` to `--s4`) in `web/src/styles/base.css`.

| # | Inconsistency | Where | One-line fix |
|---|---|---|---|
| 1 | App panel uses inline styles and native grey buttons, not `c-btn` | `app/ui/src/Panel.tsx` (CARD, BTN consts) | Give the panel the `c-btn` and `c-card` classes from the shared stylesheet. |
| 2 | Two Stop buttons on one screen in the app (page and panel) | `app/ui/src/Panel.tsx`, `app/ui/src/App.tsx` | Hide the panel Stop while the page is visible, or make the panel a one-line status. |
| 3 | Brand text and content column do not share a left edge on desktop | `web/src/ui/calm/calm.css` (`.c-topbar` vs `.c-main`) | Put the brand in the rail, above Today, and leave the top bar for the mode pill. |
| 4 | Desktop rail has no icon, logo or progress, so it looks empty | `web/src/ui/calm/CalmChrome.tsx` | Add the small mascot head and a one-line "Today: 10 min" under the links, or narrow the rail to 160 px. |
| 5 | Border radius has 7 values: 8, 14, 18, 20, 22, 24, 999 px, and 0 in Studio | `web/src/ui/calm/calm.css` | Use 3 steps: 12 (inputs, notes), 20 (cards), 999 (pills). |
| 6 | Type sizes are ad hoc: .8125, .875, .9375, 1, 1.125, 1.375, 1.75, 2.125 rem | `web/src/ui/calm/calm.css` | Keep 6 steps: 0.875, 1, 1.125, 1.375, 1.75, 2.125 rem (table below). |
| 7 | Studio uses a mono accent type and 0 radius, Calm uses system sans and pills; shared words but not shared marks | `web/src/styles/base.css` | Keep Studio sharp (by design), but share the mascot, the type family for body text and the gold accent value. |
| 8 | Button styles: Calm pill with 1px line, Studio square yellow, panel native | `calm.css`, `base.css`, `Panel.tsx` | One primary (filled accent) and one secondary (white, line) in Calm and app. Studio keeps its own. |
| 9 | Copy tone: Calm says "Quick Mind Bridge", "Not this one"; Studio says "Keep awake", "Breathe", "Reduce motion"; app says "Let the Crew steer my sound" | `web/src/ui/calm/copy.ts`, `app/ui/src/Panel.tsx` | Keep all user copy in `copy.ts` and import it in the app. |
| 10 | Icons: none in Calm nav (text only), "?" boxes in Studio, none in the app | `CalmChrome.tsx`, Studio panels | Add 5 simple line icons to the nav (inline SVG, about 1 KB total). Leave Studio "?" boxes as is. |
| 11 | Motion: Calm has fade-in 240 ms, 60 s background drift, reduced-motion respected; Studio has a pulsing eye with its own reduced-motion toggle | `calm.css` lines for `c-drift`, `c-enter`; `mascot.css` | Keep both. Make one shared "motion off" flag read by both. |
| 12 | Input and choice borders use `--c-line` (#E4D9C9) at 1.3 to 1 contrast on the page | `calm.css` (`.c-choice span`, `.c-btn`) | Use a border colour of at least 3 to 1 (token `--c-edge`, table below) on controls. Decorative cards may keep the soft line. |
| 13 | Small teal text on the pink end of the gradient is 4.36 to 1 (eyebrow, links) | `calm.css` (`.c-eyebrow`, links) | Darken teal to #1A645F or put text on `--c-surface`. |
| 14 | Mascot size differs per screen and is missing on 3 screens | `web/src/ui/calm/mascot/` | One size scale: 120 (hero), 72 (inline), 40 (nav rail). |

## 4. Growth.design check

| Principle | Delivered now? | Evidence |
|---|---|---|
| Hick (fewer choices) | Mostly on onboarding: 6 answers on one screen. Library shows 8 tiles then 5 tabs; Settings is long. Studio shows about 12 choices at first load. | `before-calm-first-d`, `before-calm-library-d`, `before-orig-first-d` |
| Default effect | Yes. Today pre-selects "Your session for today" with one Start. The starter step pre-picks a sound. "Just curious" is pre-selected. | `before-calm-today-d`, `before-calm-starter-d` |
| Endowed progress | Partly. "Step 1 of 5" and the week dots exist. The first dot is empty, so the user starts at zero, not at one. | `before-calm-today-d` |
| Peak-end | Partly. The end card exists in code (`EndCard.tsx`) but no shot shows it, and the player has no calm closing screen on stop in the captured flow. | `before-calm-player-d` |
| Exit points | Yes. "Skip, just play", Back on the safety step, Stop always visible, "Not this one". | `before-calm-safety-m`, `before-calm-player-d` |
| Reciprocity | Yes in words: "Free. Private. No account." in the first screen. Nothing given before asking: the first sound comes only after 5 steps. | `before-calm-first-m` |

## 5. Redesign brief

Ranked by first-impression gain per unit of effort. Effort: S under half a day, M about 1 day, L several days.

Hearing safety rule for all 8: none may change a limit, a ramp or a clamp. All sound still starts only after the safety notice. Offline rule: no new network calls, no remote fonts or images. Bundle rule: add under 3 KB gzip in total across the 8 (limit is 110 KB, now 79.9 KB).

| Rank | Change | Before | After | Effort | Safety / size / offline |
|---|---|---|---|---|---|
| 1 | Show the first sound in 2 taps | 5 steps before sound. | After question 1, show "Start Quick Mind Bridge (10 min)" with the safety text in the same card. Steps 2 and 3 move to later, optional. | M | Safety text and accept stay before sound (check C1 must still pass). Size neutral. Offline yes. |
| 2 | Put the primary button above the fold on desktop | Next sits below 800 px. | Tighten the mascot (120 px) and tile heights so Next shows at 800 px. | S | None. |
| 3 | Fix the desktop frame | Empty rail, brand misaligned, mini player over content. | Brand moves into the rail with the mascot head. Mini player docks to the rail bottom on desktop. Content column gains a right info card (today's session, week dots). | M | None. About 0.5 KB. |
| 4 | Make the app panel match | Grey native panel under the page, two Stop buttons. | One slim status row with the shared `c-btn` look. Panel Stop hidden when the page is open. | S | The panel must still stop sound from any state. Test with the CSP harness. |
| 5 | Richer Library tiles | 8 text tiles, 60 percent empty. | Tiles show count ("12 sounds"), a one-line mood and a small icon; a "Popular now" row under them. | M | Icons are inline SVG. About 1 KB. |
| 6 | Calm nav icons and clear current tab | Text only, current tab marked by underline. | Icon plus label, filled pill on current tab. | S | About 1 KB. |
| 7 | Endowed progress | Week dots all empty on day 1. | First dot pre-filled with "You joined today". Journeys show "Day 0 of 7, you are ready". | S | Wording must not use streak or loss words (check C5). |
| 8 | Quieter Studio switch | A white pill the same size as the main action, on every screen. | A small text link in Settings plus a keyboard shortcut. Studio keeps its look but gets the Calm mascot and body font. | S | None. |

Wireframes (ASCII).

Change 1, first screen, phone:

```
Before                       After
+-----------------+          +-----------------+
| Zonked   [Studio]|         | Zonked          |
| Step 1 of 5     |          |   (mascot)      |
|   (mascot)      |          | What do you need|
| What brings you |          | right now?      |
| here?           |          | [Focus]  [Calm] |
| [Focus]         |          | [Sleep]  [More] |
| [Calm down]     |          +-----------------+
| [Sleep] ...     |          Tap one: a card shows
| [Next]          |          "10 min, headphones,
+-----------------+          volume low" + [Start]
```

Change 3, desktop:

```
Before                         After
+------+--------------+        +------+--------------+--------+
| nav  | Zonked [Stu] |        |(m)   |              |Today   |
|      |  mascot      |        |Today |   content    |10 min  |
|      |  content     |        |Journ |              |M T W...|
|      |              |        |Libr  |              |        |
| mini player over    |        |[mini]|              |        |
+------+--------------+        +------+--------------+--------+
```

### Shared design tokens (Calm light, Calm dark, app)

Contrast ratios are text on the stated background (WCAG relative luminance).

| Token | Light | Dark | Use | Contrast |
|---|---|---|---|---|
| `--c-bg` | #FBF6EF | #14121A | page | n/a |
| `--c-surface` | #FFFFFF | #1E1B27 | cards | n/a |
| `--c-text` | #2A2433 | #F2EDF7 | body | 13.96 / 16.12 |
| `--c-soft` | #5E5668 | #B9B0C6 | secondary text | 6.50 / 8.92 |
| `--c-accent` (button fill) | #B4531A | #FFB26B | primary button | white on it 5.01; dark text on dark accent 9.73 |
| `--c-teal` | #1A645F (was #1F6F6B) | #6FD6CF | links, current | 5.51 for old value on page, 4.36 on the pink end; the new value is meant to clear 4.5 there (check when built) |
| `--c-caution` | #8A5A00 | #FFCB6B | warnings | 5.51 |
| `--c-edge` (new) | #8F8575 | #6B6480 | control borders | at least 3 to 1 target (check when built) |
| `--c-line` | #E4D9C9 | #383247 | decorative lines only | 1.3 (not for controls) |
| Radius | 12 / 20 / 999 px | same | inputs, cards, pills | n/a |
| Spacing | 4, 8, 12, 16, 24, 32 px | same | all gaps | n/a |
| Type | 0.875, 1, 1.125, 1.375, 1.75, 2.125 rem | same | small, body, lead, h2, h1, greeting | n/a |
| Touch target | 44 px minimum, 48 px buttons, 56 px choices | same | all taps | n/a |

Values marked "check when built" are proposals, not measured results.

### Keeping Studio distinct but related

1. Studio stays dark, square-cornered (radius 0), with gold and mint accents. Calm never uses square corners or neon gold.
2. Both share: the mascot (Studio may use the line version), the body font family, the word list in `copy.ts` for plain terms, the 44 px target size, the focus ring style and the reduced-motion flag.
3. Studio may show technical terms (carrier, beat). Calm may not.
4. Safety text, limits and notices are identical in both. Studio gets no way around the gate.
5. Switching keeps the playing sound. The switch lives in Settings in Calm and in the header in Studio.

## 6. After-state metrics to measure later

| Metric | Now (from code and shots) | Target | How |
|---|---|---|---|
| Taps to first sound (new user) | Calm: Next x3, accept, Start = 5 taps. Skip path: "Skip, just play" then accept = 2 taps. Original: 1 tap (no gate). | 3 taps with the gate kept | Count in an e2e flow. |
| Reading words before first sound | Not counted yet. Safety list alone is 6 lines. | Under 80 words | Extract visible text per step in e2e, sum words. |
| Time to first sound | Not measured. | Under 20 s for a new user, from page load to audible ramp | Playwright timestamps from load to the player toggle. |
| Contrast failures | 1.3 to 1 on control borders; 4.36 to 1 for teal on the pink end. Two known. | 0 | Run an automated contrast check on every shot state, light and dark. |
| Extra: first load size | 79.9 KB gzip | Under 110 KB | `npm --prefix web run check:bundle`. |
| Extra: two Stop buttons in the app | 1 case | 0 | App harness text check. |

## Limits of this report

- No by-ear check and no screen reader pass were done.
- Dark theme, 200 percent text and reduced motion were not captured here.
- Shots are headless Chromium, not Chrome. The app page was shown through the CSP harness, not the real dashboard.
- Contrast numbers were computed from token values, not sampled from pixels.

## After: what was built

Shots: `docs/ux-shots/after-*` with the same names as the before set (suffix d for 1280x800, m for 375x812), plus `after-calm-nature` and `after-calm-mysounds`. Made with `web/scripts/take-ux-shots.mjs`. I opened 12 of them: first-d, first-m, today-d (twice), today-m, library-d, library-m, nature-d, nature-m, mysounds-d, player-d, settings-d. The rest were captured by the same script and not read one by one. The app-page shots (`after-app-*`) were not retaken; the harness checks the panel by text instead.

### Re-scored first impression

| Surface | Before | After | Why |
|---|---|---|---|
| Calm web, desktop | 4 | 5 | Next and Skip sit at y 517 and 569 of 800 (answers in two columns, mascot 120). Rail has brand and mascot, mini player docked in the rail, right card shows today's session and the week. |
| Calm web, phone | 4 | 4 | Same single column. Nav now has icons and a filled current tab. |
| Calm in the Kiro Crew app | 3 | 4 | The panel uses `c-card`, `c-btn` and the shared copy. One Stop only (see below). Not seen in the real dashboard. |

Scores are my own reading of the shots, not a user test.

### Changes 2 to 8 and the 14 inconsistencies

| Item | Result |
|---|---|
| 2 Next above the fold at 1280x800 | Done. Two answer columns from 900 px wide. |
| 3 Desktop frame | Done. Brand and 40 px mascot in the rail, mini player at rail bottom, right info card from 1180 px wide. |
| 4 App panel | Done. Shared classes. Stop shows only when no page is mounted (`stopButtonsWhilePageOpen: 0` in the CSP harness, Stop returns after unmount). |
| 5 Library tiles | Done. Inline SVG icon, mood line, sound count. No "Popular now" row (skipped: no usage data on this device to rank by). |
| 6 Nav icons | Done. Filled pill on the current tab. |
| 7 Endowed progress | Done. First dot filled, "You joined today", no streak words (checks C3 and unit test). Journeys say "Day 0 of N, you are ready". |
| 8 Quieter Studio switch | Done. Text link in Settings, Alt+Shift+S, stated in the first-run note on Today. The top bar chip is gone. |
| Inconsistencies 1 to 14 | 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13, 14 done. 7 done in part: Studio gets the mascot and the system body font in a thin bar, its sharp look is unchanged. 11 skipped: one shared motion flag across Calm and Studio was not built. |

Token values as built: radius 12, 20, 999. Type 0.875, 1, 1.125, 1.375, 1.75, 2.125 rem. `--c-edge` is #857B6B on light and #7C7596 on dark, measured 4.16 on white and 3.9 on the dark surface. Teal is #1A645F, 5.1 on the pink end of the gradient.

### Added: Nature and My sounds

Nature screen from Library, one tap from the player, Blend slider "More nature, softer beats", level capped at 0.85, choice kept under `zonked.nature.v1`. Credits come from `credits.json` made from the licence table by `web/scripts/make-credits.mjs`. Synth sounds show a "made in code" line. My sounds: file input only, decode check on an offline context, 8 MB, 10 minutes, mono, 2 s crossfade loop or play once under 20 s, peak set to 0.45 like the shipped loops, IndexedDB `zonked.mysounds.v1`, 5 sounds and 20 MB, Remove and Remove all, included in Forget my data.

### Metrics

| Metric | Before | After |
|---|---|---|
| Taps to first sound, Skip path | 2 | 2 |
| Taps to first sound, full path | 5 | 5 |
| Words before first sound | not counted | not counted |
| First load, gzip | 79.9 KB | 79.45 KB |
| Lazy chunks added (gzip) | n/a | Nature 1.25 KB, My sounds 1.09 KB, Credits 0.71 KB |
| Two Stop buttons in the app | 1 | 0 |

Skipped: the 2-tap start (brief change 1) was not in this item. Words before first sound were not measured.

## After R1: the design ruling applied

The ruling is in `docs/DESIGN-DECISION.md`. Shots are `docs/ux-shots/after-r1-<screen>-<look>-<size>.png`. Look is dark, light or hc (high contrast). Size is d (1280x800) or m (375x812). Made by `web/scripts/take-r1-shots.mjs` with reduced motion on. Two more come from the Kiro Crew app harness: `after-r1-app-playing-dark-d.png` and `after-r1-app-gate-dark-d.png`.

I opened 14 of the final R1 shots: onboarding m, safety d, today m (dark), player focus d, player calm light d, player nature m, sounds m, crew d, settings hc d, studio d and the app playing shot, plus earlier versions of today d, today m (light) and player sleep d. The rest came from the same script and were not read one by one.

### What changed, screen by screen

| Screen | Before | After R1 |
|---|---|---|
| All Calm screens | Pastel gradient cards, drifting gradient page, shadows, pills | Flat night blue page, hairline rows, 8 px corners, one yellow accent |
| Navigation | Left rail on desktop, 5 bottom tabs, a second info column | Top nav on desktop, 4 bottom tabs on phone: Today, Sounds, Crew, You. Info column removed |
| Today | Three cards, two scrolling carousels, a gradient link card | One yellow Start, "Play again" as an outline button, plain rows for picks and journeys |
| Week dots | Letters inside dots | Day names (Mon to Sun) under each dot, a check in a filled dot, text "N of 7 days" |
| Player | Ring around the mascot | Scene loop for the session (sleep, focus, calm, nature) behind the mascot, breath text "Breathe in" and "Breathe out", cup glow follows the audio level |
| Sounds | Gradient tiles | Outlined tiles and play-mark rows. The text "Sounds" replaces "Library" |
| Crew | One line and a note | Plain reason it is off, two numbered steps, a different line when the switch is on but no feed answers |
| Settings | Two switches | Adds the day look and High contrast switches, saved on this device |
| Studio | Sharp, mono accents | PC-98 lean: hard offset shadows, dotted heading rules, yellow top bar, same tokens |
| Mascot | Floating head, side ear pieces, flat moon | Torso with shoulders and collar that fades at the bottom, ink headphone cups that glow with level, painted moon with a soft glow |

### Re-scored first impression

| Surface | Before R1 | After R1 | Why |
|---|---|---|---|
| Calm web, desktop | 5 | 5 | Calmer, but the content was already above the fold. One accent, no boxes. |
| Calm web, phone | 4 | 5 | Single column, answer rows, Next and Skip both in view at 812 px high. |
| Calm in the Kiro Crew app | 4 | 4 | Same screens, same font, top nav. Seen only through the harness. |

These scores are my own reading, not a user test.

### Scorecard rows I could measure

| Metric | Before | After R1 | How |
|---|---|---|---|
| Taps to first sound, Skip path | 2 | 2 | e2e check, unchanged |
| First load JS plus CSS, gzip | 79.45 KB | 80.04 KB | `check:bundle`, budget 110 KB |
| Font files, bytes | 0 | 24,828 (12,096 + 12,732) | `web/public/fonts`, separate from the budget. Only the 400 file is preloaded |
| Control contrast below 3 to 1 | 1.3 to 1 on old borders | 0 in the token table | Computed from hex. Lowest control border is 3.26 on light surface |
| Text below 4.5 to 1 | 4.36 (teal on pink) | 0 in the token table | Lowest text is 5.88 (ink on surface, light) |
| Two Stop buttons in the app | 0 | 0 | CSP harness |
| Gradient and shadow cards on Today | 4 | 0 | Code and shots |
| Scroll-clipped rows on phone | 2 carousels | 0 | Code and shots |

### Unverified

- Slashed zero: the Latin file draws a slashed zero by default and none of `zero`, `ss01` to `ss05` removed it in a test render. "10:00" shows a slash. The font-feature rule is kept but has no effect.
- Contrast is computed from hex values, not sampled from pixels. High contrast was not checked with a screen reader.
- Reduced motion shows still frames in the shots. Live breathing was not captured.
- The Kiro Crew app was seen through the CSP harness, not the real dashboard.
- `nature.test` "has a credit row for every shipped sample" fails because another worker added samples. It is outside this item.
