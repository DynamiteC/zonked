# Zonked for Kiro Crew

Zonked plays calm sound while you code or rest (it may help some people relax; results vary): binaural beats, noise and lo-fi layers, made on your device by a small Rust WASM engine. A friendly mascot guides you through a short setup, a daily pick, journeys and a library.

## Turn it on

Trust the app when you enable it. Kiro Crew asks before an app may register agents, tools or a background job. Without trust, the sound player still works, but the crew agents and tools stay off.

## Private and local

- No account, no analytics, no internet at run time. The engine makes beats, noise, lo-fi and piano in your browser. 22 short CC0 or public domain nature loops (MP3, lazy loaded, 6 saved at install and the rest after first play) play only when chosen, and each is listed in `docs/SAMPLES-LICENSES.md`. Ten more sounds are made in the browser. Your own sound file never leaves your device.
- The small backend binds to the loopback address only and stores one small memory file in the app data folder. What is kept on the device and how to delete it: `docs/PRIVACY.md`.
- The app's MCP stdio server has no authentication by design. It runs only as the local user that Kiro Crew starts it as, and it is not meant to be exposed on a network. See `SECURITY.md`.
- The crew link is optional. The app works fully without it.

## Hearing safety

- Use stereo headphones, start with the volume very low, and stop at once if you feel dizzy, anxious, in pain, or if your ears ring or feel full. Do not use it while driving or running machinery. Ask a doctor first if you have a seizure disorder, a serious mental health condition, tinnitus or sensitive hearing.
- Sound fades in over at least 2 seconds and out over at least 0.25 seconds.
- Carrier 20-1500 Hz, beat 0.5-40 Hz, master gain at most 0.85, output hard-limited to 0.95. Every value is clamped, including values from the crew agents.
- Zonked is not a medical device. It does not diagnose, treat or cure anything, and it claims no health result.

## Crew agents

The crew features work only when run in Kiro Crew. The three agents run only inside a Kiro Crew host. Without one, you can run the app on its own and try the simulated crew feed (real bridge, real app) from the repo README. Three agents ship with the app: a burnout sentinel, an acoustic sequencer and a DSP verifier. The sentinel can run shell commands through the `execute_bash` tool. The App Kit docs describe no way to restrict shell commands for an app agent. A Kiro CLI `allowedCommands` setting exists, but it is an approval list, not a sandbox, so it is not used. The four allowed commands are limited by the prompt only. For that reason its scheduled check ships switched off. Turn it on only if you accept that. Even when on, an agent can only send a 0-100 score; the backend picks one of four fixed safe sound bands, one step at a time.

## Licences

The MIT licence covers Zonked's original code. The nature loops (CC0 or public domain, `docs/SAMPLES-LICENSES.md`) and the font (Atkinson Hyperlegible Next, SIL Open Font License 1.1) keep their own terms, and the other third-party items are listed in `NOTICE`. The built bundle carries the font, so its licence text `web/public/fonts/OFL.txt` must travel with `app/ui/dist` (the integrator copies it into the bundle when rebuilding). Not legal advice.

## Build

```bash
cd app/ui && npm ci && npm run build
```

The built bundle in `app/ui/dist` is committed. `npm run check:dist` fails when it is stale.
