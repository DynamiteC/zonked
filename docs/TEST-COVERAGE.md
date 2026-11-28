# Test coverage map: the old 90 browser checks and the new ones

Before the Studio shell was removed (wave E), `npm --prefix web run verify:e2e` ran 90 checks against the old front door. After the removal it ran 38. This page maps every one of the old 90 to the check that now covers the same assertion. A row marked REMOVED names a feature that no longer exists in the product, and the check that covers the nearest thing that does.

The old 90 are the rows of the last run before the removal (commit e4fcf92), including the mascot layout check M1 that ran three times at three sizes in each of two sessions. All checks run in a real browser with the real audio engine and read the real output peak (`window.__zonked.getStats`), unless the row says "unit".

How the new checks run:

- `npm --prefix web run verify:e2e`: every id below in Chromium, on the production build, served with the real headers.
- `node web/scripts/browser-matrix.mjs`: the sound, ramp, offline and fallback checks of the matrix plus every C, G, X, M and F check (not S, K or Z) in Chromium, Firefox and WebKit, at desktop, iOS phone and Android phone sizes. F13 needs Chromium CPU throttling and reports "skipped" elsewhere.
- `npm --prefix web run check:a11y`: axe-core and a keyboard pass (see `docs/ACCESSIBILITY.md`).

## Old to new

| Old check (name in the old run) | New check | Note |
|---|---|---|
| 1 headers match _headers | 1 headers match _headers | same |
| 2 crossOriginIsolated and SharedArrayBuffer | K1 | K1 asserts both before it plays |
| 3 no CSP violations or console errors | K14, K14b, Z1 | K14b proves the policy is live (an inline style is blocked) |
| 4 playback peak and nonZero | K1, K3 | peak at most 0.95 and not silent |
| 5 all six presets converge | F3 | six preset scripts played from the Advanced Editor, beat read from the dial readout |
| 6a standalone first load, zero bridge requests | S1 | same |
| 6 Crew sync, then bridge stop keeps audio | S2 | same |
| 7 offline reload plays | K15 and matrix offline-reload | same |
| 8 import oversized and malformed .sbg | K10 | line numbered |
| 9 every button has an accessible name | K13, check:a11y | |
| 10 each synthesized layer is audible, peak at most 0.95 | K4 | |
| 11 no audio file requests during the session | K14 | no audio file, no audio response, nothing off the origin |
| 12 recommender: 8 situations, 5 or more items with reasons, keys 1-5 | F4, C2 | every feeling lists 5 or more sounds. Keys 1-5 REMOVED with the Studio recommender |
| 13 catalog: 210 or more items reachable | F4 and `catalog.test.ts` | the eight feelings together list 210 or more |
| 14 timers: countdown, sleep fade, Pomodoro, restore paused | K11, C15, F2 | countdown and sleep fade (K11), focus sprint (C15), Advanced Timers panel (F2) |
| 15 shortcuts do the documented thing and are ignored while typing | F5 | Space only. The other keys REMOVED with Studio. `shortcuts.test.ts` (unit) still covers the key table |
| 16 MediaSession handlers and per-template metadata | M1, `mediaSession.test.ts` (unit) | M1 calls pause and play handlers in a real browser |
| 17 hidden then visible keeps audio, wake lock | K12, matrix fallback-no-wakelock | |
| 18 reduced motion freezes mascot tilt | C5, F7 | |
| 19 npm run check:bundle passes | K16 | |
| M1 mascot layout 390x844, 1280x720, 1600x900 (two sessions) | F7 | all three sizes, no overflow |
| M2 drag spins the mascot, engine state unchanged | F7 | a drag does not change the sound |
| M3 audio-reactive depth while playing | C16 and `CalmMascot.test.tsx` (unit) | REMOVED: the Calm mascot has no 3D depth. It follows the breath, which C16 checks |
| M4 reduced motion freezes mascot while playing | F7, C5 | no running animation in the mascot |
| U1 mobile layout 390x844 | C6, L1, F8 | |
| T1 hover on Play shows a tooltip | F6 | REMOVED: Calm has no tooltips. F6 checks hover causes no popup and no change |
| T2 keyboard focus shows it, aria-describedby | F6, K13 | focus ring and accessible name on Play |
| T3 Escape closes the tooltip | F6 | REMOVED with the tooltip. Escape on dialogs: G1, C7, C4 |
| T4 reduced motion removes the animation class | C5 | |
| T5 touch hold on Play, inside the viewport, does not start it | F6 | long press at 390 px keeps Play inside the viewport and toggles once |
| T6 long press shows the tooltip and swallows the tap | F6 | one toggle per press |
| Q1 Quick Start shows as a region, not clipped | C2, F8 | REMOVED: Quick Start. The starter step is C2, first screen fit is F8 |
| Q2 situation plus 15 minutes gives 5 or more results | F4 | |
| Q3 Play shows the safety dialog, the engine waits for accept | C1 and matrix no-audio-before-notice | no AudioContext before accept |
| Q4 Skip works, "Don't show again" persists | C2, G1 and matrix reload-keeps-state | the notice flag survives a reload. G1: the guide stays closed after a reload |
| S1 first screen shows Play without scrolling | F8 | |
| S2 six sound cards with name and one sentence | F4, K6 | |
| S3 card Play starts that sound | K5, K6 | |
| S4 mix slider changes a layer level, stays in 0 to 1 | F2, F12 | |
| S5 calm dial keeps the readout inside 0.5-40 Hz | F3, F12 | |
| S6 Inspect lists five bands | F2 | REMOVED: Inspect. The Advanced Scope panel opens and draws |
| S7 More menu lists entries, closes on Escape | C4, F2 | REMOVED: More menu. Options opens and closes |
| S8 reduced motion stops the stage and card animations | C5, F7 | |
| S9 footer shows the mission line | F9 | REMOVED: footer. The privacy note says what stays on the device |
| W1 dial moves the real beat inside 0.5-40 Hz, note above 25 Hz | F3, F12, K3 | |
| W2 violet card: note, slider changes the level | F3 | violet script plays, note shows, slider max 0.6 |
| W3 save a mix, change the sound, load it back | K8 | |
| W4 starter: feel, time, picker suggests a sound with a reason | C2, C11 | |
| A1 violet is selectable and audible, peak at most 0.95 | F3 | |
| A2 new layers audible, every new sound at max stays at most 0.95 | K3, K4, F12 | |
| A3 level moves over 20 s with breathing on | C16 | |
| A4 no audio file request | K14 | |
| H1 mission and privacy card | F9 | |
| H1b guide covers headphones and not medical | F9 | the safety notice and the guide |
| H2 save a mix, reload, still there | K8 | |
| H3 favorite a template, reload, still a favorite | K7 | |
| H4 export is a valid, local Zonked file | K8 | |
| H5 hostile import files are refused or clamped | K9 | |
| H6 first-session milestone appears kindly | C3, C14 | REMOVED: milestones were dropped on purpose in wave E. C3 checks the week wording has no pressure, C14 the feel check |
| H7 sections still work offline | K15 | |
| H8 no request leaves the app origin | K14, C9, C10, X2, matrix no-request-leaves-origin | |
| H9 390x844 layout for all six sections | F2 | nine Advanced sections at 390 px |
| H10 delete everything clears mixes and milestones | K9 | |
| H11 every Sanctuary element has sharp corners | none | REMOVED: a Studio design rule that the Calm design replaced on purpose (rounded shapes) |
| H12 reduced motion: no animations inside Sanctuary | C5 | |
| C1 to C7, L1, C8 to C16 | C1 to C7, L1, C8 to C16 | same ids. C7, C8 and C14 changed for the new guide timing and the new duck curve |

Rows marked REMOVED are decisions, not gaps: the feature is gone from the product (Studio shell, tooltip component, Quick Start, Inspect, More menu, milestones, number-key shortcuts), so no assertion about it can still be true. The owner should confirm that the milestones and the number-key shortcuts are meant to stay removed.

## New checks (no old twin)

| Id | What it proves |
|---|---|
| G1 | The help guide waits until the end card is closed, closes with Skip, and stays closed after a reload |
| X1 | Mix code: a good code applies, unknown sound, wrong version, value over 100 and markup are refused, the level never passes 0.85 |
| X2 | Calm card: made on the device, downloads a real PNG, nothing leaves the origin |
| M1 | Media key handlers pause and play the real sound |
| F1 | Bluetooth mode is kept after a reload, the call-mode tip shows, the sound stays inside the limits |
| F2 | The nine Advanced sections open at 390 px with no sideways scroll, timers start and stop, sound health reads smooth |
| F3 | Six presets reach their beat, a hostile script is clamped with a line numbered warning, violet is audible, the dial stays inside 0.5 to 40 Hz |
| F4 | Every feeling lists at least 5 sounds and together they reach 210 or more |
| F5 | Space plays and pauses, and is ignored while typing |
| F6 | Play by hover, keyboard focus and long press |
| F7 | Mascot fits at three sizes, a drag does not toggle the sound, reduced motion freezes it |
| F8 | Start is on the first screen at 390 by 844 |
| F9 | Privacy note and safety words |
| F10 | Nature level slider max is 0.85 and the peak holds |
| F11 | Soft start: the first moments are quieter than the settled level, and the stop ramp keeps frames flowing |
| F12 | Hottest settings: dial at maximum and every layer at maximum keep the peak at 0.95 or less |
| F13 | Frame time with the CPU slowed 4 times: 20 ms or less, or the low-power path switches on |
| F14 | Night dim on a phone: the Options sheet stays inside the screen and its controls can be tapped (the matrix found this bug) |

## Feature list from the owner and where each is checked

| Feature | Check |
|---|---|
| Sound before notice | C1, matrix no-audio-before-notice |
| Ramps | K1, K2, F11, matrix stop-ramps-down |
| Limits | K3, K4, K5, F3, F10, F12, X1 |
| Off-origin requests | K14, S1, C9, C10, X2, matrix no-request-leaves-origin |
| Offline | K15, matrix offline-reload |
| Theme | C13, matrix theme-switch |
| Crew demo | C10, C11, matrix crew-demo-beat-changes |
| Nature blend | C8 |
| Own sound | C9 |
| Guide dismiss | G1, C14 |
| End card | C7, C12 |
| Feel check | C14 |
| Sprint | C15 |
| Breathing | C16 |
| Reset | C12 |
| Mix code | X1 |
| Calm card | X2 |
| Bluetooth mode | F1 |
| Sound health | F2 |
| Advanced panels | F2, F3, F12 |
| Tips by hover, long press and focus | F6 |

## What this does not prove

The checks run in Playwright builds of Chromium, Firefox and WebKit, not on real phones or in real Safari. No person listened to the output. A mocked unit test proves the logic around the engine, not the sound.
