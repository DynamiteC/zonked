# Zonked for Kiro Crew

Zonked plays calm sound while you code or rest: binaural beats, noise and lo-fi layers, made on your device by a small Rust WASM engine. A friendly mascot guides you through a short setup, a daily pick, journeys and a library.

## Turn it on

Trust the app when you enable it. Kiro Crew asks before an app may register agents, tools or a background job. Without trust, the sound player still works, but the crew agents and tools stay off.

## Private and local

- No account, no analytics, no network at run time. The engine makes beats, noise, lo-fi and piano in your browser. 22 short CC0 or public domain nature loops (MP3, lazy loaded, precached) play only when chosen, and each is listed in `docs/SAMPLES-LICENSES.md`. Ten more sounds are made in the browser. Your own sound file never leaves your device.
- The small backend binds to the loopback address only and stores one small memory file in the app data folder.
- The crew link is optional. The app works fully without it.

## Hearing safety

- Use stereo headphones, keep the volume low, and stop if anything feels uncomfortable.
- Sound fades in over at least 2 seconds and out over at least 0.25 seconds.
- Carrier 20-1500 Hz, beat 0.5-40 Hz, master gain at most 0.85, output hard-limited to 0.95. Every value is clamped, including values from the crew agents.
- Zonked is not a medical device. It makes no health claims.

## Crew agents

The three agents run only inside a Kiro Crew host. Without one, you can run the app on its own and try the simulated crew feed (real bridge, real app) from the repo README. Three agents ship with the app: a burnout sentinel, an acoustic sequencer and a DSP verifier. The sentinel can run shell commands through the `execute_bash` tool. The App Kit docs describe no way to restrict shell commands for an app agent. A Kiro CLI `allowedCommands` setting exists, but it is an approval list, not a sandbox, so it is not used. The four allowed commands are limited by the prompt only. For that reason its scheduled check ships switched off. Turn it on only if you accept that. Even when on, an agent can only send a 0-100 score; the backend picks one of four fixed safe sound bands, one step at a time.

## Build

```bash
cd app/ui && npm install && npm run build
```

The built bundle in `app/ui/dist` is committed. `npm run check:dist` fails when it is stale.
