---
name: zonked-onboarding-ux
description: "Use when designing or reviewing the Zonked front door: first-run onboarding, the 2-step starter, daily card, routines, streaks, reminders, copy and tone, or any screen a new person sees. Gives personas, tone and accessibility rules, copy do and don't, and a screen checklist."
---

# Zonked onboarding and consumer UX

Goal: a tired person gets calming sound within two taps, and a reason to come
back tomorrow, without guilt, jargon or medical claims.

Same spirit, own design. The principles below come from reading how public
habit and micro-learning products describe themselves (short daily minutes,
routines by time of day, an on-demand library, a feed of small cards). We take
the general ideas only. Do not copy any product's text, brand, images or layout.
The public pages we read held little detail, so every rule here is our own
judgement. Test it with real people before you treat it as proven.

## Principles

1. Value first. Sound plays before any account, form or setup. There are no accounts.
2. Short questions. At most 2 questions before sound: "What do you need?" then "How long?".
3. Goal, then routine. Map the need (focus, unwind, sleep, calm) to a time of day
   routine (morning, work break, evening, bed). Show it as a small list, not a plan.
4. Journeys are short. A journey is 3 to 7 steps of 5 to 20 minutes. One step per day at most.
5. One daily card. A single suggested session for today, easy to swap, easy to skip.
6. Streak with forgiveness. Count days listened. A missed day never resets to
   zero: use "rest days" or a weekly goal (for example 4 of 7). Never show a lost-streak alarm.
7. Progress that feels good. Show minutes of calm and small milestones. Store all
   of it on the device (local only). No leaderboards, no comparison.
8. Gentle reminders. Opt in, off by default, one per day at most, kind words,
   easy to mute. Reminders use only what the browser allows; no server push.
9. Personalize lightly. Remember last mix, favorites and time of day. Do not
   guess health state. The person always sees why a sound was suggested.
10. Always an exit. Stop, mute and volume are one tap on every screen.

## 2-step starter rules

- Step 1: pick a need (4 to 6 big buttons, plain words).
- Step 2: pick a length (5, 15, 30 minutes or "until I stop").
- Then show the headphone and volume notice (required), then Play.
- Default is safe: low volume, 2 second fade in, nothing loud, nothing flashing.
- Any step can be skipped with one tap. Back always works. Nothing is lost on back.
- The need picks a sound from the built-in catalog. Show its name and a one-line reason.

## Personas

| Persona | Need | Design note |
|---|---|---|
| Burned-out coder | Recover between long AI sessions | Crew layer optional; break reminders; low jargon |
| Student | Focus for a block, calm before a test | Timer first; Pomodoro option |
| Parent | Two quiet minutes, sleep when the house is quiet | Very short sessions; one-handed use |
| Shift worker | Sleep at odd hours | Time of day never assumed; do not say "morning" or "night" unless chosen |
| Light sleeper | Stay asleep | Long fade out; sleep timer; dim screen |
| Anxious | Calm without pressure | Breathing pacer optional; no countdown stress; no scores |
| ADHD | Start without friction | One big button; few choices; no long text; stable layout |
| Retiree | Relax, simple tools | Larger text; clear labels; no hidden gestures |

## Tone rules

- Calm, warm, plain. Short sentences. Active voice.
- No guilt: never "you missed", "you broke your streak", "don't give up".
- No medical claims: never "treats", "cures", "heals", "clinically proven", or
  a promise about sleep, anxiety or ADHD. Safe verbs: "may help you relax", "many people like".
- Keep the notice that Zonked is not a medical device and needs stereo headphones.
- No pressure words: urgent, now, last chance, hurry.
- Free, private, offline. Say it once, plainly. No data leaves the device.

## Accessibility rules

- Reduced motion mode removes eye pulsing and the pacer flash. Respect the system setting.
- Never more than 3 flashes per second in any full-screen luminance change.
- Touch targets at least 44 by 44 px.
- Contrast at least AA (4.5:1 text, 3:1 large text and controls).
- Plain words at about 8th grade reading level. Short labels. One idea per line.
- Full keyboard use, visible focus, labels on every control, live region for state changes.
- Never rely on colour alone. Do not auto-play before the safety notice is accepted.
- Test at 200 percent zoom and at 390 px width.

## Copy do and don't

| Do | Don't |
|---|---|
| "Pick what you need." | "Optimize your cognitive state." |
| "Let's wind down." | "Binaural entrainment protocol." |
| "5 quiet minutes" | "Start your 5-minute treatment" |
| "You listened 4 days this week." | "You lost your 12 day streak!" |
| "Use stereo headphones." | "Use headphones (required)!!!" |
| "Stop" | "Terminate session" |

Use "beat" or "sound", not "carrier", "delta f", "isochronic" on the front door.
Expert terms may live in an Advanced drawer.

## Screen checklist

- [ ] First sound in 2 taps or fewer after the notice
- [ ] Safety notice shown before first play, with headphones and not-a-medical-device
- [ ] Every screen has Stop and volume reachable
- [ ] No account, no sign-in, no network call except the optional loopback bridge
- [ ] No guilt words, no medical claims, no urgency words (search the copy)
- [ ] Reduced motion works; no flash above 3 per second
- [ ] 44 px targets, AA contrast, keyboard path, visible focus
- [ ] Reading level about 8th grade; no unexplained jargon
- [ ] Streak shows forgiveness; progress is local only
- [ ] Reminders are opt in, at most one per day
- [ ] Works at 390 px and at 200 percent zoom; works offline

## Sources

- Public home pages of two habit and micro-learning products, read for structure only (short value claims, minutes a day, routines by time of day, on-demand library). Same spirit, own design: no text, brand, image or layout is reused.
- Repo rules: the standards file under `.kiro/steering/` (hearing and flash limits) and `AGENTS.md`.
