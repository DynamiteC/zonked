# Privacy

Short version: Zonked has no account, no analytics and no tracking. It sends nothing anywhere. What it remembers stays on your device.

This page is plain-language information, not legal advice. Wording for app stores needs a lawyer (listed in `docs/READINESS.md`).

## What Zonked does not do

- No account, no sign-in, no email, no payment.
- No analytics, no ads, no tracking, no cookies set by Zonked.
- No network calls at run time. The page may talk to one thing only: the optional crew bridge on your own computer (`127.0.0.1`, port 43210, loopback only). That is off unless you start the bridge.
- No sound is downloaded at run time. The nature loops ship inside the app.
- Your own sound files and your answers never leave your device.

## What is stored on your device

| Where | What | Keys or names |
|---|---|---|
| localStorage | Settings and small state: look and theme, motion setting, your first-run answers (goal, time of day, device), the safety notice accepted, the guide seen, favourite nature sound, last session, journey progress, feel-check answers, timer state, wake lock choice, crew link choice | keys that start with `zonked.` (for example `zonked.profile.v1`, `zonked.feel.v1`, `zonked.safety.v1`, `zonked.timer.v1`, `zonked.theme.v2`) |
| IndexedDB | Your saved mixes, favourites, milestones, session log, and up to 5 sound files you add yourself (20 MB in total) | database `zonked`, plus a store for your own sounds |
| Service worker cache | The app files, so it works offline, and nature loops you have played | cache `zonked-samples` and the app precache |

Nothing in these places is sent to anyone. Other sites cannot read them.

## How to delete it

- In the app: Settings, then "Forget my data". It removes your answers, how-it-felt notes, nature choice and your own sounds from this device.
- Studio mode, Sanctuary, "My data": export everything as one file, or delete it all.
- In the browser: clear site data for the Zonked address (this also removes the service worker cache). Or uninstall the installed app and then clear site data.

## The Kiro Crew app

When Zonked runs as a Kiro Crew app, a small local backend listens on the loopback address only. It keeps one small file, `crew-memory.json`, in the app's data folder (the folder Kiro Crew passes to it, or a `data` folder beside the backend code). The file holds the latest activity score and the sound steps the crew picked. It holds no personal text. Delete the file, or disable and remove the app in Kiro Crew, to erase it. The optional crew link reads counts from your own project (git activity and similar) and does not send them outside your computer. The agents run in Kiro Crew, which has its own privacy terms.

## Children

Zonked is made for adults and is not directed at children under 13. It collects no data about anyone, children included. A child should listen only with an adult nearby. A parent should set the device volume very low. Children's ears are more at risk from loud sound.

## Hearing and health

Zonked is not a medical device. See the safety notice in the app.

## Questions

Open an issue in the project repository and choose a title that starts with "Privacy". Please do not put personal data in an issue. If you found a security problem, use the route in `SECURITY.md` instead.

## For the team

- Wave U: link this page from Settings in the app, next to "Forget my data".
- If any release adds a network call, a new storage key or a new kind of data, update the tables above in the same release.
