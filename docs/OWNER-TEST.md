# Owner test

A short guide for your final test. Plain words. Do the parts in order. Fill in the tables as you go.

## Before you start

- Use stereo headphones. Turn the system volume low. You can always turn it up.
- Build once from the repo root: `npm --prefix web install` then `npm --prefix web run build`.
- Start the app: `npm --prefix web run preview`. Open the address it prints.
- Accept the safety notice when it shows. Nothing plays before that.
- Zonked is not a medical device. If anything feels wrong, press Stop.

## A. Sound test (headphones, low volume)

### A1. Ten recorded sounds

1. Open Sounds, then "Nature sounds and my sounds".
2. The blend and volume sliders stay at the top. Leave the blend in the middle.
3. Play each sound below for about 30 seconds. Let it loop at least once, so you hear the loop seam.
4. Rate each one from 1 (bad) to 5 (lovely).

| Sound | Rating 1 to 5 | Click at the loop seam? | Harsh? | Too loud or too quiet? |
|---|---|---|---|---|
| Rain | | | | |
| Stream | | | | |
| Ocean waves | | | | |
| Forest | | | | |
| Birds | | | | |
| Breeze and birds | | | | |
| Fire crackle | | | | |
| Wind chimes | | | | |
| Temple gong | | | | |
| Fan hum | | | | |

### A2. Ten made-in-code sounds

They sit under "Made in code" in the same picker. Same steps as above.

| Sound | Rating 1 to 5 | Click at the loop seam? | Harsh? | Too loud or too quiet? |
|---|---|---|---|---|
| Soft wind | | | | |
| Waterfall | | | | |
| Soft flute | | | | |
| Rain on a roof | | | | |
| Singing bowl | | | | |
| Soft chimes | | | | |
| Campfire crackle | | | | |
| Brown noise | | | | |
| Ocean swell | | | | |
| Night crickets | | | | |

### A3. The blend slider

1. Start a session from Today. Add Rain from the player.
2. Move "More nature, softer beats" all the way left, then all the way right.
3. Left should favor the beat. Right should favor the nature sound.
4. Report if the change is sudden or if you hear a click.

### A4. The 90 second pause

1. Open Today and pick "A short pause, 90 seconds". Press Begin.
2. It should run for about 90 seconds, show Stop the whole time, then show its own end card.

### A5. The 5 minute breathing

1. Open Sounds and pick "Breathe, 5 minutes".
2. It should have no beat. You should hear only a soft sound and the breathing cue.
3. If you hear a pulsing beat, report it.

### A6. Focus sprint

1. Start any sound. Press the "Focus sprint" chip.
2. The chip shows as pressed. The clock reads Focus, 25 minutes.
3. Wait 25 minutes for the break. The automated check C-series in `npm --prefix web run verify:e2e` covers it with a test clock.
4. At the break you should hear a soft chime, then a calmer sound for 5 minutes.

### A7. Sleep fade

1. Choose the Sleep goal, or start a sound and press "Sleep fade".
2. The volume should fall slowly over 20 minutes, then stop. Check after 5 and 10 minutes that it is quieter.

### A8. What to report

- Clicks or jumps at a loop seam (name the sound and the time).
- Harsh or hissy sounds.
- Too loud or too quiet at the same volume knob.
- Anything that starts without you pressing a button.
- Any sound that does not stop when you press Stop.

## B. Crew test

### B1. Standalone, simulated feed

1. From the repo root, run `npm run demo:crew`.
2. Open the address it prints, then open Crew.
3. Turn on "Let Crew ease the sound".
4. Expect the Crew screen to show the score, the current beat, the next change and a plain Why sentence, and the sound to follow. In Studio mode (You, then Studio) the badge reads Crew Synced.
5. Stop it with Ctrl+C.

### B2. The in-app demo

1. Open the app (no bridge needed). Open Crew.
2. Press "Watch the crew work". It is labelled "Simulated session".
3. Expect about 60 seconds of changes. The mini player is hidden on this screen, so the Why box reads without scrolling.
4. At the end you should see "That was pretend. Real mode reads git counts only."

### B3. The Kiro Crew app

1. `cd app/ui && npm install && npm run build`
2. `kirocrew app install <repo>/app` (use the path to this repo's `app` folder).
3. `kirocrew app enable zonked`
4. When asked, trust the app. Without trust, the agents and tools stay off.
5. Open the Zonked page from the sidebar. Expect the Calm app, the same as the web build.
6. Open the side panel tab "Zonked: Now Playing". Expect Play and Stop. Start sound on the page, then check the panel shows it. Leave the page, and the sound should keep playing.
7. Check the Schedule page. The "burnout-check" job should be listed and switched off.

### B4. Undo

1. `kirocrew app disable zonked`
2. `kirocrew app uninstall zonked` (check `kirocrew app --help` if the word differs on your version).
3. Your listening history stays in the browser until you clear site data.

## C. Phone, Firefox and Safari

1. Phone: open the app on your phone over your local network or use the installed PWA. Check onboarding fits with Skip visible, the player fits above the tab bar, and sound survives a screen lock.
2. Firefox desktop: run through A1 with three sounds. Report any sound that does not play. A made-in-code sound may play in place of a recording, with a note saying so.
3. Safari (Mac and iPhone): press play from a tap, check there is sound, then lock the screen. Report if the sound stops.
4. On every browser: press Stop and check the fade-out is smooth.

## D. Known untested

- Nobody has listened to the 22 recordings or the 10 made-in-code sounds. Ratings are yours.
- Firefox could not run in the build sandbox. Safari ran on the Skip path only, in WebKit.
- No real phone, no real screen reader, no axe scan.
- The Kiro Crew app has not been installed on a real host. The manifest rules are a hand copy of the 0.13.1 validator.
- The simulated crew feed is not a real coding session.
- Offline replay after a service worker update was not replayed in this wave.
- Own-sound upload with a real file was only tested with a generated tone.
