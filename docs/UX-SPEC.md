# Zonked consumer UX spec (Calm front door)

Status: design draft for owner review. Not tested with real people.
Clickable prototype: `docs/prototype/index.html` (static, no build, no audio).

Goal: a tired person hears calming sound within 30 seconds, and has a kind
reason to come back tomorrow. The pro tools stay, behind a switch called Studio.

Same spirit as habit and micro-learning apps (short daily minutes, a routine by
time of day, small programs, a calm home). Own text, own art, own colours.
Nothing here is copied from any product. The public pages we read held little
detail, so every rule below is our judgement and needs real tests.

Fixed rules (from the repo standards, not up for change):
free, private, no account, no analytics, no network except the optional
loopback crew bridge; hearing limits and the safety notice stay; no more than
3 flashes per second; reduced motion is honoured; not a medical device.

## a. Audience and personas

Core audience: anyone who wants calmer sound for focus, rest or sleep, not only
coders. Coders stay served through the Crew screen and Studio.

| Persona | Top goal | Top fear |
|---|---|---|
| Burned-out coder | Recover between long AI sessions | Losing flow, one more tool to manage |
| Student | Focus for a study block, calm before a test | Wasting time on setup |
| Parent | Two quiet minutes, sleep when the house is quiet | Being woken, loud sound, a long session |
| Shift worker | Sleep at odd hours | The app assuming "night" means 11 pm |
| Light sleeper | Stay asleep | Sound that changes or gets loud |
| Anxious professional | Calm down without pressure | Scores, countdowns, guilt |
| ADHD | Start with no friction | Too many choices, hidden gestures |
| Retiree | Relax with simple tools | Tiny text, jargon, being tricked |

Design consequences: one big button per screen; no clock assumptions; large
text; no scores; stable layout; every control has a visible word, not only an icon.

## b. The first 60 seconds (onboarding, 5 screens)

Principles: value first, every screen skippable, Back never loses answers,
no account, no permission prompts. Progress dots show "step 2 of 5" in words
for screen readers. Answers are saved on this device only.

| Screen | Title | Content | Skip behaviour |
|---|---|---|---|
| 1 Welcome | "Calm sound, made for you." | Mascot, one promise line "Free. Private. No account.", button "Get started", link "Skip, just play" | Skip goes to a safe default session (screen 5 notice, then "Rain hush", 15 min) |
| 2 Goal | "What brings you here?" | 6 big choices: Focus, Calm down, Sleep, Study, Recover after work, Just curious. Pick one. | "Not sure" = Just curious |
| 3 When | "When do you need it most?" | Morning, Afternoon, Evening, Night, Anytime | Anytime |
| 4 Listening | "How do you listen?" | Headphones, Speakers, Bluetooth, Not sure. Plain note under the choices. | Not sure = headphones notice shown |
| 5 Starter | "Pick a starter sound" | 3 cards with name, one-line reason, a Preview button (visual in prototype, 10 second fade-in sound in the app), "Start" | First card selected by default |

After screen 5: the safety notice (required, once per device, re-shown when
the listening choice changes to speakers), then the first session starts with
the standard 2 second or longer fade-in. The very first session is the
recommended length for the goal, with Stop always visible.

Plain safety notice copy: "Before you start. Use stereo headphones for the
best effect. Keep the volume low. Zonked fades in slowly. Zonked is not a
medical device. Stop any time." Button: "I understand, start".

Screen 4 note: "Headphones work best for two-tone beats. Speakers are fine
for gentle pulses and noise. We will pick sounds that suit what you choose."

### Answer mapping to the existing recommender

No new engine. The onboarding writes a `Profile` that builds a `RecContext`
(`web/src/catalog/types.ts`) and calls `recommendTemplates(ctx, 5)`.

| Answer | Maps to |
|---|---|
| Goal Focus | situation `deep-work`, vibe `bright`, minutes 25 |
| Goal Calm down | situation `heal-stress`, vibe `calm`, minutes 15 |
| Goal Sleep | situation `cant-sleep`, vibe `dreamy`, minutes 45 |
| Goal Study | situation `deep-work`, vibe `minimal`, minutes 30 |
| Goal Recover after work | situation `ai-burnout`, vibe `warm`, minutes 15 |
| Goal Just curious | situation `quick-reset`, vibe unset, minutes 10 |
| When morning, afternoon, evening, night | `timeOfDay` as named |
| When Anytime | `timeOfDay` from the clock at the moment of asking |
| Listening headphones, bluetooth, speakers | `deviceType` `headphones`, `bluetooth`, `speaker` |
| Listening Not sure | `deviceType` `headphones` and show the headphone notice |
| Sensitivity | not asked in onboarding. Default `medium`. A Settings switch "Keep sounds extra gentle" sets `high`. ADHD-style choices stay out of onboarding. |

Optional gentle follow-up on Today, never in onboarding: "Prefer very gentle
sound?" sets sensitivity `high`. Sleep goal with Night/Anytime keeps the
default `medium`; the recommender already penalises intensity 4 or more at night.

Starter screen: the 3 cards are the top 3 `recommendTemplates` results with
distinct families (same id prefix without the number is skipped). The reason
line is the recommender's first reason, rewritten by `COPY` rules into plain words.
The 7 `starter-*` templates are the fallback when the catalog has not loaded.

## c. Home screen "Today"

Top to bottom, one column at 390 px, two columns at 1280 px.

| Block | Content | Rule |
|---|---|---|
| Greeting | "Good morning." by clock (before 12 morning, 12-17 afternoon, 17-21 evening, else night). No name. | Never assume the user's rhythm: shift workers can pick a different "my day" in Settings |
| Daily Session card | One big card: title, minutes, reason, button "Start". Link "Not this one" swaps to the next recommendation. | One tap to sound after the notice has been accepted |
| Goal and streak | "Your goal: Sleep" and a week row of 7 dots: listened, rest day, today, upcoming. Text "4 days this week". | Forgiving: see streak rules below |
| For you | Horizontal row of 5 cards with a plain reason each | Uses `recommendTemplates(ctx, 5)` |
| Journeys | Row of journey cards with progress "Day 3 of 7" | See section d |
| Library | One card "Browse all sounds" | See section e |
| Mini player | When a session is active: name, time left, Play or Pause, Stop | On every tab, 56 px high |
| Crew chip | "Crew connected: easing the sound" | Only shown when the bridge is connected |

Streak rules (gentle):

- A day counts when 3 or more minutes of sound played.
- The display is "days this week" out of the weekly goal (default 4 of 7), not a chain.
- A missed day never shows a loss. Rest days are normal. Copy for a quiet week: "Welcome back. Pick up where you like."
- Milestones reuse `web/src/app/milestones.ts` (minutes of calm, first session). New: "first week with 4 days". No leaderboard, no sharing.

## d. Journeys

A journey is 3 to 14 daily sessions. One session per day at most. Each day card
shows: day number, title, minutes, a completion mark (check plus word "Done"),
and rest days are labelled "Rest day" with no task. Skipping is fine: a missed
day just stays available. "Restart journey" is always available.

### Deterministic template resolution

Each day names a family (an id prefix without the final `-NN`) and the day
index. Rule for builders:

1. `family` must match template ids `^<family>-\d{2}$`. List them sorted by id.
2. Day pick = `variants[(k) mod variants.length]` where `k` is the number of
   non-rest days before this one in the journey (0 based).
3. If a family has fewer than 1 variant (catalog change), fall back to
   `recommendTemplates` with the day's `situation`, `vibe`, `minutes`, taking the first result.
4. Session length is the template's `recommendedMinutes`. The user may shorten
   it with a timer chip. The journey day is "Done" at 80 percent of the length or 3 minutes, whichever is greater.
5. Sensitivity `high` replaces any template with intensity above 3 by the next
   variant, or by the fallback in step 3.

All families below exist in the 239 template catalog (checked against the
registry). Counts in brackets.

| Family | Variants | Typical minutes |
|---|---|---|
| `sleep-onset-delta` | 6 | 30-90 |
| `sleep-drift-theta` | 5 | 20-45 |
| `sleep-deep-delta` | 5 | 60-120 |
| `sleep-nap-reset` | 4 | 15-25 |
| `recovery-lofi-unwind` | 5 | 15-40 |
| `recovery-post-sprint` | 4 | 15-30 |
| `recovery-micro-break` | 4 | 5-10 |
| `focus-alpha-beta` | 5 | 25-60 |
| `focus-sprint-pulse` | 4 | 20-30 |
| `focus-deep-beta` | 5 | 30-90 |
| `adhd-smr-steady` | 5 | 20-45 |
| `adhd-beta-anchor` | 5 | 25-50 |
| `vibe-warm-glow` | 4 | 20-45 |
| `healing-soothe-glide` | 4 | 20-30 |
| `meditation-alpha-sit` | 5 | 10-30 |
| `meditation-breath-pacer` | 4 | 10-20 |

### The 6 journeys

Titles are working names. "Rest" means a rest day.

| Journey | Days | Day plan (family, in order) |
|---|---|---|
| 7 Calm Evenings | 7 | healing-soothe-glide, meditation-breath-pacer, vibe-warm-glow, Rest, meditation-alpha-sit, recovery-lofi-unwind, healing-soothe-glide |
| 5 Focus Mornings | 5 | focus-alpha-beta, focus-alpha-beta, focus-sprint-pulse, Rest, focus-deep-beta |
| 14 Nights to Easier Sleep | 14 | Days 1-4 sleep-drift-theta; day 5 Rest; days 6-9 sleep-onset-delta; day 10 Rest; days 11-13 sleep-deep-delta; day 14 sleep-onset-delta |
| Study Sprint Week | 7 | focus-sprint-pulse, focus-alpha-beta, recovery-micro-break, focus-sprint-pulse, Rest, focus-alpha-beta, meditation-alpha-sit |
| After-Work Reset | 5 | recovery-post-sprint, recovery-lofi-unwind, recovery-micro-break, Rest, recovery-lofi-unwind |
| Gentle ADHD Routine | 7 | adhd-smr-steady, recovery-micro-break, adhd-smr-steady, Rest, adhd-beta-anchor, recovery-micro-break, adhd-smr-steady |

Journey card copy rule: promise effort, not outcome. Example: "7 short
evenings of slow sound. About 20 minutes each." Never "cure", "fix" or "beat" anything.
The ADHD journey says "Gentle routine for steady attention", never a medical word, and has 3 choices at most per screen.

Local state per journey (see section n): `{id, startedAt, doneDays: number[], pickedIds: string[]}`.
`pickedIds` freezes the resolved template ids at start so a later catalog
update never changes a started journey.

## e. Library

Tabs inside Library (segmented control): Feeling, Sound, Favorites, My mixes, Recent.

| Tab | Content |
|---|---|
| Feeling | 8 tiles by situation in plain words: Focus (deep-work), Steady attention (adhd-focus), Recover (ai-burnout), Calm down (heal-stress), Sleep (cant-sleep), Dream (lucid-dream), Meditate (meditate), Quick reset (quick-reset). Then a list of that situation's templates, 10 per page. |
| Sound | The 7 sound cards from `SOUND_MENU`: Lo-fi, Soft piano, Violet hiss, Rain hush, Deep rumble, Soft chimes, Beats only. Each shows its blurb and a note; Violet shows "Start very quiet". |
| Favorites | Reuse `favorites.ts`. Empty state: "Tap the heart on any sound to keep it here." |
| My mixes | Reuse `mixes.ts`. Empty: "Make a mix in the player, then save it here." |
| Recent | Last 10 sessions from the existing log store. Empty: "Your recent sessions show up here." |

Search is one text box labelled "Search sounds" using `search.ts`. The 8 catalog categories remain available as filters inside Studio, not on the front door.

## f. Player screen

| Area | Content |
|---|---|
| Visual | Big soft gradient circle with the mascot companion and a breathing ring. Ring grows 4 s, shrinks 6 s (default, matches templates with `breath`). Under reduced motion the ring is static and a text line "Breathe in, breathe out" shows. |
| Title | Template name and a one-line reason |
| Controls | Play or Pause (72 px), Stop, heart (favorite), Mix button |
| Timer chips | 15, 30, 60, Until I stop, Sleep fade. Single choice. Sleep fade means a 20 minute fade ending in silence. Maps to `timers.ts` countdown and sleep fade. |
| Mix sheet | Bottom sheet (dialog) with plain sliders: Lo-fi, Piano, Chimes, Rain or rumble, Calm to Alert. A Reset button. A note "Volume is capped for your safety." |
| Why this works | Collapsed text block. Plain, honest: "Some small studies suggest slow beats may help people relax. Results vary and may not happen for you. Zonked is not a medical device." Evidence word from `soundMenu.evidence` or `bands.ts` shown as "Evidence: mixed" with a "What does this mean?" tip. |
| Safety | Stop and volume are one tap on this screen. Reduced motion disables ring pulse and gradient drift. |

Evidence honesty table (copy shown to the user):

| Label | Plain words |
|---|---|
| strong | "Good studies agree." (used rarely) |
| mixed | "Studies disagree." |
| preliminary | "Early, small studies." |
| limited | "Very little research." |
| preference | "People simply like it." |

## g. Studio (advanced)

One switch "Studio mode" in the top bar menu and in Settings. Off by default.
The choice is remembered (`zonked.ui.mode.v1`: `calm` or `studio`). Entering
Studio shows the existing sharp theme and every pro tool; no feature is removed.

| In Studio | Source |
|---|---|
| Hz readouts, brain-wave bands, Inspect | existing `Inspect.tsx`, `bands.ts` |
| Script editor, custom `.sbg` import and export | existing `Editor.tsx` |
| Layer controls, noise, stereo width, pan | existing `Mixer.tsx`, `MixView.tsx`, `Advanced.tsx` |
| Crew bridge settings | existing `CrewToggle.tsx` |
| All 8 categories, 10 vibes, layer tags | existing `Catalog.tsx` |
| Data backup and restore | existing `backup.ts` |

Rule: Studio is an exit door too: "Back to Calm" is the first item.

## h. Kiro Crew screen (inside the app)

Plain words: "Your coding session can watch itself and ease the sound. When
you have been working hard, Zonked slowly moves toward calmer sound. You stay
in control."

| Element | Behaviour |
|---|---|
| Connect switch | Off by default. On means: read the local crew state on this computer only. Label "Let Crew ease the sound". |
| Status | "Not connected", "Connected, session is calm", "Connected, you have been busy for a while" |
| Burnout meter | A soft 3 step bar (Fresh, Warming up, Time for a break) with words, never red, never a number of failures |
| Follow crew | Switch "Follow Crew suggestions". Off: Crew only shows a hint. |
| Privacy line | "Nothing leaves your computer." |

Visible only inside the Kiro Crew app, and in the web build only when the
loopback bridge answers. Otherwise the whole screen is replaced by "Crew is
optional. Zonked works fully without it."

## i. Tone, copy rules and copy deck

Rules: reading level about 8th grade; sentences under 15 words; active voice;
second person; no guilt (no "you missed", "streak lost"); no red anywhere (use
a warm amber for caution, never for failure); no medical claims (never
"treats", "cures", "heals", "clinically proven"; safe verbs "may help you relax",
"many people like"); no pressure words (urgent, hurry, last chance); no emoji.
Numbers are plain. Errors say what to do next.

Copy deck (first draft; final text lives in `web/src/ui/calm/copy.ts`).

| Place | Text |
|---|---|
| Promise | Free. Private. No account. |
| Welcome title | Calm sound, made for you. |
| Welcome body | A few quick questions. Then your first sound. |
| Buttons | Get started, Skip, Back, Next, Start, Stop, Pause, Play, Not this one, Done |
| Goal title | What brings you here? |
| Goals | Focus, Calm down, Sleep, Study, Recover after work, Just curious |
| When title | When do you need it most? |
| When options | Morning, Afternoon, Evening, Night, Anytime |
| Listen title | How do you listen? |
| Listen options | Headphones, Speakers, Bluetooth, Not sure |
| Starter title | Pick a starter sound |
| Starter preview | Preview, Playing a short preview |
| Safety notice | See section b |
| Today greetings | Good morning. Good afternoon. Good evening. Hello, night owl. |
| Daily card | Your session for today. Suggested for you. Not this one. |
| Streak | 4 days this week. Rest days count too. |
| Streak return | Welcome back. Pick up where you like. |
| For you title | For you |
| Journey progress | Day 3 of 7. Rest day. Done. |
| Library title | Library |
| Library tabs | Feeling, Sound, Favorites, My mixes, Recent |
| Timer chips | 15 min, 30 min, 60 min, Until I stop, Sleep fade |
| Mix sheet | Your mix. Reset. Volume is capped for your safety. |
| Why | Why this works. Evidence: mixed. |
| Studio | Studio mode. For advanced controls. Back to Calm. |
| Crew | Let Crew ease the sound. Not connected. Connected. Time for a break. |
| Reminders | Off by default. "Remind me once a day" with a time picker. Notification text: "A calm minute is ready when you are." |
| Empty favorites | Tap the heart on any sound to keep it here. |
| Empty mixes | Make a mix in the player, then save it here. |
| Empty recent | Your recent sessions show up here. |
| Empty journey | Pick a journey to begin. Go at your own pace. |
| Empty search | Nothing matched. Try fewer words. |
| Error audio | Sound could not start. Tap Play to try again. |
| Error storage | We could not save this on your device. Your session still works. |
| Offline | Zonked works offline. Nothing to do. |
| Not medical | Zonked is not a medical device. |

## j. Accessibility

| Area | Rule |
|---|---|
| Targets | 44 by 44 px minimum, 8 px between targets. Primary buttons 56 px. |
| Contrast | Text 4.5:1, large text and controls 3:1, in light and dark, and over gradients (test the worst point of the gradient). |
| Keyboard order | Skip link, top bar, main content in reading order, mini player, tab bar. Sheets trap focus, Escape closes, focus returns to the opener. |
| Names | Every control has a visible text label or `aria-label`. Every input has a `label`. Icons are `aria-hidden` when text is beside them. |
| Live regions | One polite `role=status` for play state, timer end and journey completion. |
| Reduced motion | `prefers-reduced-motion` and the in-app switch both stop gradient drift, breathing ring scale, mascot movement, card lift, and screen transitions (crossfade of 0 ms). |
| Flashes | No flash. Gradient drift runs over 40 s or more. Nothing changes luminance of the full screen faster than once per 3 s. |
| Text scale | Layout uses `rem`. At 200 percent no text is clipped, no horizontal scroll at 390 px wide, buttons grow in height. |
| Colour | State is never shown by colour alone: the completion mark has a check and a word. |
| Screen readers | Onboarding progress "Step 2 of 5". Journey day cards read "Day 3, Done" or "Day 3, 20 minutes, not started". |
| Touch | No gesture is required. Swipe is optional only. |

## k. Design tokens

Two themes. Names are CSS custom properties without a prefix change; the Calm
set is `--c-*`, Studio keeps the current `--*` tokens in `web/src/styles`.

### Calm (soft, warm)

| Token | Light | Dark |
|---|---|---|
| `--c-bg` | `#FBF6EF` | `#14121A` |
| `--c-surface` | `#FFFFFF` | `#1E1B27` |
| `--c-surface-2` | `#F3EBDF` | `#282434` |
| `--c-text` | `#2A2433` | `#F2EDF7` |
| `--c-text-soft` | `#5E5668` | `#B9B0C6` |
| `--c-line` | `#E4D9C9` | `#383247` |
| `--c-accent` (primary) | `#B4531A` | `#FFB26B` |
| `--c-on-accent` | `#FFFFFF` | `#2A1606` |
| `--c-teal` (active) | `#1F6F6B` | `#6FD6CF` |
| `--c-gold` (mascot) | `#FFC400` | `#FFD54A` |
| `--c-caution` | `#8A5A00` | `#FFCB6B` |
| Gradient morning | `#FFE9C7` to `#FFD2D8` | `#2B2236` to `#3A2A2E` |
| Gradient afternoon | `#FFF3C9` to `#CFEFE6` | `#1F2B33` to `#2C3A2F` |
| Gradient evening | `#FFD6C2` to `#D9C9F2` | `#2A1F3A` to `#3C2535` |
| Gradient night | `#C9D4F2` to `#E3D2F2` | `#12142B` to `#1E1636` |

Caution uses amber, not red. All pairs above meet AA for text on their own surface; verified for key pairs in the prototype with the script in `docs/prototype/shoot.mjs`.

| Token | Value |
|---|---|
| Radius | card 20 px, button 999 px, input 14 px, sheet 28 px top |
| Spacing | 4, 8, 12, 16, 24, 32, 48 px |
| Type | system font stack. Scale: 14, 16 (body), 18, 22, 28, 36 px. Body line height 1.5, titles 1.2 |
| Shadow | soft: `0 6px 24px rgba(40,30,60,0.12)`; lift on hover: `0 10px 30px rgba(40,30,60,0.18)` |
| Motion | press 120 ms, hover 180 ms, screen change 240 ms, sheet 280 ms, ring breath 4 s in and 6 s out, gradient drift 60 s. All 0 ms under reduced motion. |
| Focus ring | 3 px, `--c-teal`, 2 px offset |

### Studio (existing, sharp)

| Token | Value |
|---|---|
| Radius | 0 |
| Lines | 1 px hairlines |
| Colours | near-black `#0A0B0F` background, gold `#FFE600` primary, teal for active (as in the current build) |
| Type | system sans plus tabular numerals |
| Motion | none beyond what exists today |

## l. Component inventory

Files to create later. Web path `web/src/ui/calm/`, Kiro Crew app path `app/ui/src/calm/`
(the app reuses the web components through the existing `@zonked-web` alias, so the app only holds thin wrappers).

| Component | Props | States | File |
|---|---|---|---|
| `CalmShell` | `mode`, `onToggleStudio` | calm, studio | `CalmShell.tsx` |
| `Onboarding` | `onDone(profile)`, `initial?` | step 1..5, skipped | `Onboarding.tsx` |
| `ChoiceGrid` | `options`, `value`, `onChange`, `label` | idle, selected, focus | `ChoiceGrid.tsx` |
| `SafetyNotice` | `device`, `onAccept` | shown, accepted | `SafetyNotice.tsx` |
| `Today` | `profile`, `plan` | empty, normal | `Today.tsx` |
| `DailyCard` | `rec`, `onStart`, `onSwap` | idle, loading | `DailyCard.tsx` |
| `WeekDots` | `days`, `goal` | listened, rest, today, future | `WeekDots.tsx` |
| `ForYouRow` | `recs` | scroll, empty | `ForYouRow.tsx` |
| `JourneyCard` | `journey`, `progress` | new, in progress, done | `JourneyCard.tsx` |
| `JourneyDetail` | `journey`, `picked`, `onStartDay` | day done, today, locked-free (never locked) | `JourneyDetail.tsx` |
| `Library` | `tab` | 5 tabs, empty | `Library.tsx` |
| `Player` | `session` | playing, paused, stopped, error | `Player.tsx` |
| `BreathRing` | `inSec`, `outSec`, `reduced` | animating, static | `BreathRing.tsx` |
| `TimerChips` | `value`, `onChange` | 5 options | `TimerChips.tsx` |
| `MixSheet` | `open`, `mix`, `onChange` | open, closed | `MixSheet.tsx` |
| `WhyThisWorks` | `evidence`, `text` | collapsed, open | `WhyThisWorks.tsx` |
| `MiniPlayer` | `session` | hidden, playing, paused | `MiniPlayer.tsx` |
| `CrewScreen` | `status`, `follow` | off, connected, unavailable | `CrewScreen.tsx` |
| `Mascot` | `mood`, `reduced` | existing `Mascot.tsx`, reuse | existing |
| `ThemeToggle` | `value` | light, dark, system | `ThemeToggle.tsx` |
| `copy.ts` | none | single source of text | `copy.ts` |
| `calm.css` | tokens | prefix `c-` | `web/src/styles/calm.css` |

## m. Reuse and new work

| Reused unchanged | New |
|---|---|
| DSP engine and safety clamps (`crates/dsp-core`, `web/src/audio`) | Calm UI components (section l) |
| Catalog, recommender, search (`web/src/catalog`) | `profile.ts` (answers to `RecContext`) |
| Sound menu and starters | `journeys.ts` (data and resolver) |
| Player, timers, MediaSession, shortcuts (`web/src/app`) | `streak.ts` (week count) |
| Favorites, mixes, milestones, backup | Calm theme CSS and copy file |
| Sanctuary panels (move under Library and Settings) | Studio switch and `zonked.ui.mode.v1` |
| Crew bridge client (`crew.ts`) | Optional daily reminder (browser Notification, opt in) |
| Safety gate `guarded()` | Today, Library, Player shells |

The player singleton rule from `docs/notes/APP-SPIKE.md` stays: audio lives in a module-level engine that outlives page unmounts. Journeys and Today only read and write local state.

## n. Analytics and local data model

Analytics: none. No tracking, no counters sent, no remote fonts or images.
Everything below lives in `localStorage` or the existing IndexedDB store on the device and is covered by the existing backup export.

| Key or record | Shape |
|---|---|
| `zonked.profile.v1` | `{goal, when, device, sensitivity, createdAt}` |
| `zonked.ui.mode.v1` | `'calm' or 'studio'` |
| `zonked.theme.v1` | `'light', 'dark' or 'system'` |
| `zonked.goalweek.v1` | `{weeklyGoal: 4}` |
| `zonked.journeys.v1` | `{[id]: {startedAt, doneDays: number[], pickedIds: string[]}}` |
| `zonked.reminder.v1` | `{enabled: boolean, hhmm: string}` (off by default) |
| Session log | existing log records already hold date and minutes; the streak is computed from them, nothing new stored |

Import rules: every record is validated with an explicit schema; unknown versions are rejected; sizes capped; values clamped (same posture as the `.sbg` parser).
Milestones: extend `milestones.ts` with `first-week-4-days` and `first-journey-done`.

## o. Scorecard for a first-timer test

Test with 5 people per persona group when possible (minimum 5 people total). Facilitator reads no hints.

| Measure | Target |
|---|---|
| Time from open to first sound (notice included) | under 30 s, median |
| Onboarding completion (not skipped) | at least 4 of 5 |
| Taps from open to first sound | 8 or fewer |
| Person can say what "Free. Private. No account." means | 5 of 5 |
| Person finds Stop and volume without help | 5 of 5 |
| Person finds Studio when asked, and gets back | 4 of 5 |
| Person can say why a sound was suggested | 4 of 5 |
| Starts a journey day unaided | 4 of 5 |
| Reads the safety notice (self-report) and knows to use headphones | 5 of 5 |
| Words they say they did not understand | 0 to 1 per person |
| Comfort rating "felt calm, not pressured" (1-5) | median 4 or more |
| Return the next day (opt in diary, local) | learn only, no target |

## p. Risks and open questions

| Risk | Note |
|---|---|
| Binaural beat evidence is mixed | Keep honest labels. Do not promise outcomes. |
| Streak can still create pressure | Weekly goal, rest days, no loss message. Test with anxious users. |
| ADHD journey wording | Avoid diagnosis words; keep "gentle routine". Needs a review by someone with lived experience. |
| Two themes double the CSS and test load | Keep Calm tokens separate from Studio; share components only where the markup is the same. |
| Reminders need a browser permission and a live tab | Opt in only; expect them to be unreliable without a server push. |
| Gradient and motion on low-power devices | Drift is CSS only; stop it when the tab is hidden. |
| Kiro Crew app host limits | No blob workers, no data URI fetch, shared storage (prefix `zonked.`). |
| Sound previews on the starter screen | They play audio before the notice: only after the notice is accepted. The prototype shows the visual only. |

Open questions for the owner:

1. Is Calm the default for everyone, with Studio one switch away, or should existing users keep Studio by default?
2. Weekly goal default of 4 of 7: agree?
3. Is the starter preview allowed to play before the full first session, after the notice?
4. Do we ship daily reminders in the first release, or later?
5. Should the Kiro Crew app open on Today or on the Crew screen?
6. Journey names and counts: approve the 6, or change them?
7. Do we want a short name field for the greeting? Recommendation: no (privacy and simplicity).
