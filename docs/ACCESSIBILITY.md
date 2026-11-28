# Accessibility statement

Status: automated checks pass. No person has tested Zonked with a screen reader. Zonked does not claim conformance with WCAG or any other standard.

## What was tested

Run by `npm --prefix web run check:a11y` (script `web/scripts/a11y-check.mjs`, part of `npm run verify:all`):

- axe-core (through `@axe-core/playwright`, a dev dependency, not shipped) on every main screen: first onboarding step, safety notice, Player, Options sheet, Advanced panels, Today, Sounds, Coding, You, privacy note and help guide.
- Each screen in light and dark, on a phone size (390 by 844) and a desktop size (1280 by 800), in Chromium.
- Rule sets: WCAG 2.0 A and AA, 2.1 A and AA, 2.2 AA, and axe best practices. The run fails on any violation of any impact.
- A scripted keyboard pass on each screen: Tab walks the controls, every stop has a name and a visible focus ring, and the walk does not get stuck.

Other real-browser checks that touch access (in `npm --prefix web run verify:e2e`):

- Every button on the main pages has an accessible name (K13).
- Reduced motion turns calm motion off (C5), and freezes the mascot (F7).
- No sideways scroll at 375 and 390 px (C6, F8).
- Space plays and pauses when nothing has focus and is ignored while typing (F5).
- Hover, keyboard focus and long press on Play behave (F6).
- The help guide is a dialog that closes with Skip and with Escape (G1).

## What was fixed by this pass

- The safety notice on the first screen now has a level-one heading.
- The "Now playing" bar is a labelled region, so it sits inside a page landmark.

## What was not tested

- No screen reader (VoiceOver, NVDA, TalkBack) was used. Whether a screen reader says "Playing" before "Stopped" on the player is not checked by a person.
- No real phone, no switch device, no voice control, no magnifier.
- Colour contrast is checked by axe on text it can measure. Text over gradients or images is reported by axe as "needs review", and no person has reviewed those spots.
- No user with a disability has used Zonked.

## What is built in

- Native buttons, inputs and range sliders are used, so the keyboard and screen readers work as usual.
- Focus is visible and the order follows the page.
- The Reduce motion setting and the system reduced-motion setting turn off the mascot motion and the scene animation.
- Light, dark and high contrast looks.
- Breathing cues can be announced to a screen reader (Settings, "Announce breathing").
- Sound never starts before the safety notice is accepted.

## Report a problem

Open an issue in the project repository and name the screen, the device and the assistive tool. This statement is updated when a person has tested with a screen reader.
