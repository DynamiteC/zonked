# Zonked as a Kiro Crew app: phase 1 spike

Verdict: GO WITH CHANGES.

The built Zonked engine (WASM DSP, AudioWorklet, existing `web/src/audio` code) runs inside a page that has the Kiro Crew dashboard's document CSP and serves files the way the dashboard does. It was proven in headless Chromium against an emulation of the dashboard, not against the live dashboard. Installing into the live gateway was refused for an agent shell (see "Not proven").

## What was proven

| Capability | Result | Notes |
|---|---|---|
| WASM (`dsp_core`) | Works | `script-src` has `'wasm-unsafe-eval'`. The bytes are fetched and handed to the worklet. |
| AudioWorklet | Works | `addModule` accepts a same-origin file under `script-src 'self'`. |
| Engine output | Works | State `running`, peak 0.217, rms 0.103, no NaN, nonZero about 2 x frames. |
| SharedArrayBuffer | Not available | The dashboard sends no COOP or COEP header, so the page is not cross-origin isolated. |
| postMessage fallback | Works | The engine already falls back (`usesSharedMemory: false`). No code change. |
| localStorage, IndexedDB | Work | They are shared with the dashboard origin, so prefix all keys with `zonked.`. |
| Wake lock, MediaSession APIs | Present | Not exercised. Needs a visible tab and a user gesture. |
| Blob URL worklet | Blocked | `script-src` has no `blob:`. Never load worklets from blobs. |
| `fetch(data:)` | Blocked | `connect-src` has no `data:`. Never inline the wasm as a data URI. |
| Page unmount | Engine survives | A module-level singleton kept state `running` and kept producing frames after unmount and remount. |

## Facts that force changes

1. The gateway serves app files only with these extensions: `.mjs .js .css .json .svg .png .jpg .jpeg .gif .webp .woff .woff2 .ttf .map`. A `.wasm` file gets 403. Fix: the build emits `assets/dsp_core.wasm.json`. The engine reads bytes with `fetch().arrayBuffer()` and never uses streaming compile, so the JSON MIME type is harmless.
2. Vite library mode inlines every `?url` asset as a `data:` URI. The CSP blocks `fetch(data:)`. Fix: a small Vite plugin in `app/ui/vite.config.ts` emits the wasm as a real file.
3. The bundle URL base must be relative. `base: './'` makes the worklet URL resolve against `import.meta.url`, which is `/apps/zonked/ui/dist/index.mjs`.
4. Every app file response carries `Content-Security-Policy: default-src 'none'; sandbox`. This did not stop the worklet from loading in the emulation. A real-gateway run must confirm it.
5. The gateway limits one file to 8 MiB. The bundle is 17 KB, the worklet 4.5 KB, the wasm 38.5 KB.

## Code reuse choice

`app/ui/vite.config.ts` aliases `@zonked-web` to `../../web/src` and `App.tsx` imports `createEngine` from there. Reasons: no forked code, no second wasm in git, and the safety clamps in `params.ts` and the DSP core stay the only copy. Cost: the app build needs `web/` to exist. That is fine inside one repo.

## Build pipeline

```
npm --prefix web ci                 # only needed for the csp harness
cd app/ui && npm install
npm run build                       # dist/index.mjs, dist/assets/worklet-*.js, dist/assets/dsp_core.wasm.json
npm run typecheck
node scripts/csp-harness.mjs --shots <dir>   # offline proof under the dashboard CSP
```

The dashboard supplies `react`, `react-dom`, `lucide-react`, `@kirocrew/app-sdk` and `@tanstack/react-query`. They are marked external. `dist/` is ignored by git, so a release step must build before install.

## Background playback architecture

The dashboard unmounts an app page on navigation. Options:

| Option | Survives page change | Verdict |
|---|---|---|
| Module-level singleton in the ESM bundle | Yes in the emulation (same module instance, same AudioContext) | Recommended base |
| Side-panel tab (`contributes.panelTabs`) | Docs say tabs stay mounted | Good second surface for controls and a small player |
| Persistent host surface | Not found in the manifest reference | Not needed |

Recommendation: keep the engine, timers and MediaSession handler in a module-level singleton. Make both the page and a panel tab thin views over it. Open question for phase 2: the host may re-fetch the bundle (a new module instance) after an app update or dev reload. Treat that as a stop event and ramp down. Test with a hidden tab, because browsers throttle timers there. Audio output from a running AudioContext continues in a hidden tab.

## Dashboard CSP observed (live `GET /`)

| Directive | Value (summary) | Meaning for Zonked |
|---|---|---|
| `default-src` | `'self'` | Fallback is same origin only. |
| `script-src` | `'self' 'unsafe-inline' 'wasm-unsafe-eval'` plus four CDN origins | App modules and worklets from `/apps/zonked/ui/` load. Wasm compiles. No blob worklets. Do not use the CDN origins. |
| `style-src` | `'self' 'unsafe-inline'` plus CDNs | Inline styles are fine. |
| `img-src` | `'self' data: blob: https:` | Icons and canvases are fine. |
| `font-src` | `'self' data:` plus one CDN | Ship fonts as app files if needed. |
| `connect-src` | `'self'`, ws and http on localhost, 127.0.0.1, 0.0.0.0, `*.apps.localhost`, one CDN | Fetch of app files works. `data:` and `blob:` fetches fail. The loopback crew bridge on port 43210 is allowed. |
| `media-src` | `'self' blob:` | Not used by the engine. |
| `worker-src` | `'self' blob:` | Web workers could use blobs. Worklets follow `script-src`. |
| `frame-src` | self, blob, localhost forms, `*.apps.localhost` | Not used. |
| `object-src` | `'none'` | Not used. |
| `base-uri`, `form-action` | `'self'` | Not used. |
| `frame-ancestors` | `'self'` | The dashboard cannot be framed elsewhere. |
| Other headers | No COOP, no COEP, `nosniff`, `Permissions-Policy` only for clipboard | No cross-origin isolation, so no SharedArrayBuffer. |

The app does not add a network permission. `permissions` in `app.json` is empty because phase 1 uses no dashboard API or event.

## Not proven

- `kirocrew app install` and `enable` were refused: the gateway cannot verify an agent shell as the local owner. The person must run `kirocrew app install <repo>/app` in their own terminal, then trust the app (consent dialog, or Settings, Security, Third-party apps) and enable it.
- Behaviour inside the real dashboard shell: the real import map, `@kirocrew/app-sdk` providers, and the response CSP `sandbox` on worklet files.
- Hidden tab playback, wake lock, MediaSession handlers, and hearing the output.

## Risks

- The gateway extension list may change. The `.wasm.json` name is a workaround.
- The app and the dashboard share localStorage and IndexedDB. Use a `zonked.` prefix.
- Gain stays at or below 0.85 in the engine, and the proof voice uses 0.3. The safety dialog text is repeated in the spike page. Phase 2 must reuse the real `SafetyGate`, the hearing note and the reduced-motion mode.

## Next phases

1. Install in the live dashboard and run the proof page there. Record the result here.
2. Mount the real Zonked UI from `web/src` in the page, with the singleton engine and a panel tab.
3. Add MediaSession, wake lock and timers on top of the singleton, and test a hidden tab.
4. Decide on a bridge to the crew (loopback port is allowed by CSP) or a Python backend route.
