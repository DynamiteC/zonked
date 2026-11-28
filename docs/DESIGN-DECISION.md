# Design decision (R1)

Status: decided by the conductor after three proposals (A, B, C). Applied in round R1.

## Why

The first screenshot review found four problems: pastel gradient cards clashed with the dark page, rows were cut off on the right with no hint, two words were glued together, and too many boxes competed on each screen. The decision removes boxes and colour, keeps one focal point per screen, and keeps one accent.

## Style

| Surface | Style | Reason |
|---|---|---|
| Calm app (web and Kiro Crew app) | Minimalism | One focal point, few boxes, hairline rows. Fixes the box count. |
| Player scenes only | Lo-fi Art | Warm lamp and night colours fit the mascot. Kept inside the scene, not in controls. |
| Studio | PC-98 lean | Sharp corners, pixel-ish accents, same token family. One switch away. |

## Layout (from proposal A)

- One column, one focal point per screen.
- Hairline rows with a play icon or a chevron. No pastel gradient cards. No clipped carousels.
- Desktop: top nav (Today, Sounds, Crew, You). Phone: bottom tabs. No second sidebar in the Kiro Crew app.
- Corners 4 to 16 px. Short fades only.

## Colour

One accent: mascot yellow `#FFC93C`, used as a button fill with dark text `#1B1405`.

| Token | Dark (night blue) | Light (warm beige) | High contrast dark | High contrast light |
|---|---|---|---|---|
| bg | #14151F | #FAF6EF | #000000 | #FFFFFF |
| surface | #1E2030 | #F2EBDF | #0A0A0F | #FFFFFF |
| text | #F4EFE6 | #2A2420 | #FFFFFF | #000000 |
| muted | #B6B4C8 | #5C5249 | #E0DEEA | #33303C |
| accent fill | #FFC93C | #FFC93C | #FFE04D | #FFD400 |
| on accent | #1B1405 | #1B1405 | #000000 | #000000 |
| ink (links, active text) | #FFC93C | #8F4420 | #FFE04D | #5C3B00 |
| focus ring | #8EE3DA | #1F6F6A | #6FFFF0 | #0019D6 |
| control border | #7E81A0 | #8C8070 | #FFFFFF | #000000 |
| hairline | #2C3045 | #DDD3C3 | #FFFFFF | #000000 |

Rules:

- Yellow on the light page is 1.43 to 1, so a yellow fill always carries a 2 px dark border and dark text.
- On light, links and active text use the ink colour, never yellow.
- Player dim mode: the accent drops 15 percent in linear luminance (`#FFC93C` to `#EDBB37`), and the scene and mascot dim by 10 percent.
- High contrast is a Settings toggle. Borders become 2 px and the hairline equals the border.
- State is never colour alone: every state has a word or a mark.

### Computed ratios (WCAG 2.x, from hex values)

| Pair | Dark | Light | Needed |
|---|---|---|---|
| text on bg | 15.85 | 14.21 | 4.5 |
| text on surface | 14.06 | 12.92 | 4.5 |
| muted on bg | 8.95 | 7.07 | 4.5 |
| muted on surface | 7.94 | 6.43 | 4.5 |
| on-accent on accent | 11.90 | 11.90 | 4.5 |
| accent as text on bg | 11.82 | n/a | 4.5 |
| ink on bg | n/a | 6.46 | 4.5 |
| ink on surface | n/a | 5.88 | 4.5 |
| focus ring on bg | 12.23 | 5.51 | 3 |
| focus ring on surface | 10.85 | 5.01 | 3 |
| control border on bg | 4.78 | 3.59 | 3 |
| control border on surface | 4.24 | 3.26 | 3 |
| dimmed accent on bg (Player) | 10.17 | n/a | 3 |
| on-accent on dimmed accent | 10.24 | n/a | 4.5 |

## Font

Atkinson Hyperlegible Next, SIL OFL 1.1. Latin subset woff2 in `web/public/fonts/`, licence text beside it. `font-display: swap`. Only the Latin file is preloaded. Slashed zero is off where the font supports it. Timers use tabular numbers. The system stack is the fallback. No font loads from a remote host.

## Week dots

Seven dots with day names and the text "N of 7 days". No chain or streak words.

## Mascot

Real rounded body and shoulders under the head. Old side ear pieces under the headphones removed. Moon painted with a soft glow. The 3D tilt and the props stay.

## Kept

Every hearing limit. No sound before the safety notice on every path. CSP. No inline scripts. No innerHTML. First load JS and CSS under 110 KB gzip. Offline works. Two-tap skip path.

## Not checked

Colours were computed, not sampled from pixels. No screen reader run. No user test.

## Revised ruling D2: painted calm

The owner found the first Calm look flat: a dark settings form with a glossy mascot, and onboarding steps that did not match each other. The owner is right. The new direction is a warm, hand-painted, animated-film calm, with original art. Minimalism now means few elements and one task per screen, not a bare form.

Reasons and changes:

1. Painted canvas on every screen: a sky wash that follows the hour (dawn, day, dusk, night), three soft hills, three slow clouds, paper grain and a light glow. Dark theme adds a veil. Only slow drift moves, and reduced motion shows a still frame. Text never sits on the scene. It sits on one translucent card (16 px radius, soft shadow, 560 px wide).
2. Mascot redrawn by hand: ink outline with varied weight, flat watercolor fills, warm rim light, cheek blush, no gloss. It has a small seated body on a grass mound, and the headphones are part of the character. All five moods, the props and the subtle 3D tilt are kept.
3. One form template (`FormFrame.tsx`): the same header row (72 px mascot, step text, 3-segment bar), the same title size, one helper line, option rows with a radio circle in regular weight, and a footer on a fixed grid. Back (or Skip, just play on step 1) sits left. Next sits right at one width (12 rem, 10 rem on phones). The card keeps a fixed height, so Next stays at the same screen position on every step (measured: y 646 to 647 at 1280 wide, 684 on phone).
4. The same card and footer pattern is used by Safety, Starter, Today and Crew.
5. One yellow, `#FFC93C`, with dark text. The second dimmed yellow in the Player is removed. The word Selected is gone: the picked row has a yellow radio, a faint yellow wash and medium weight, and the radio input keeps its accessible name. Type: bold for titles only.
6. Player shows only the scene, the session name, the time left and one yellow Stop. An Options button opens a bottom sheet: Timer, Nature sound (picker row, one Nature or beats slider, nature volume only when a nature sound is on), More (Favorite, What the research says, volume note) and a closed Advanced section that loads the pro panels only when opened. Sliders have a round yellow thumb.
7. A 3-card help guide (How it works): shown once after the first sound ends, or from Today and You. Skip and Done on every card, stored under `zonked.guide.v1`, can be reopened. Studio mode and Alt+Shift+S now open the Player with Options showing Advanced.

Contrast on the card (computed, worst case backdrop): dark card text 10.6 to 14.6, soft text 6.0 to 8.2; light card text 11.9 to 14.1, soft text 5.9 to 7.0; dark on yellow 11.9. In the light theme the yellow fill is 1.2 to 1.4 against the card, so every yellow control carries a dark 2 px edge (14.2).

Before and after (first screen, desktop): before, a flat dark page with a mascot, a tagline, an underline and a Skip link above a bold list with a word Selected on one row, and step 2 with none of those. After, `docs/ux-shots/after-d2-onboarding1-dark-d.png` and `after-d2-onboarding2-dark-d.png` show the same header, title, helper, rows and footer on a painted scene. Compare with `after-r1-onboarding-dark-d.png`.

Not checked: screen reader run, user test, motion on a low-power device.
