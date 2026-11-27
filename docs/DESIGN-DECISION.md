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
