# Security Audit: Zonked

Scope: crew-bridge/src, web/src, web/public/_headers, the host config file in web/, vite/PWA config, npm dependencies, .kiro hooks and crew agents, secrets. Basis: AGENTS.md and .kiro/steering/zonked-standards.md sections 3-5. Method: manual code review plus tool runs. No code was modified.

## Tool results

| Check | Result |
|---|---|
| `npm audit --omit=dev` in web/, crew-bridge/, docs/ | 0 vulnerabilities in each |
| `npm audit` (including dev) in web/ | 4 moderate: minimatch/glob ReDoS-class advisory (GHSA-g3hv-75wg-m249) reached through vite-plugin-pwa > workbox-build. Build time only, not shipped |
| `npm run audit:security` in web/ | passed |
| `npm test` in crew-bridge/ | 42 of 42 pass |
| Secrets: tracked files, full git history, key/token patterns | none found. No .env, key or credential files ever added. `*.zip` and `.zonked-*.json` are gitignored |
| Runtime dependencies | web: react, react-dom only. crew-bridge: none (standard 4 met) |

## Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 1 |
| Medium | 4 |
| Low | 9 |

No remote-exploitable issue found. The bridge host/origin gate, size caps, schema validation, prototype-pollution handling, CSP and cross-origin isolation headers meet the standards. The one high finding is in the agent shell allow-list.

## High

### H1. `shell_allow` glob in burnout-sentinel allows command injection and file write
File: .kiro/crew/crew.yaml:33-36 (pattern `git log --since=*`).
A trailing `*` matches any suffix. `git log --since=1 --output=/path/file` writes arbitrary files. If the allow-list matcher is a plain glob on the command string, `git log --since=1; <anything>` or `$(...)` also matches. The sentinel runs every 5 minutes and processes attacker-influenced repo content (commit data, file names), so a prompt injection can steer it into one of these forms.
Fix: replace the glob with exact commands that match the agent instructions, and forbid metacharacters and extra flags:
```yaml
shell_allow:
  - "git log --since=60 minutes ago --pretty=%ct"
  - "git log --since=12 hours ago --pretty=%ct"
  - "git status --porcelain"
  - "date -u +%s"
```
Also set `cwd` to the project root, disable shell operators in the runner if supported, and add `--no-ext-diff --no-textconv` to the git commands so repo-configured drivers cannot run.

## Medium

### M1. Hook and verifier run untrusted code
Files: .kiro/hooks/verify-dsp.json:5-8, .kiro/crew/crew.yaml:55-57.
`cargo test` and `cargo clippy` execute `build.rs`, proc macros and test code from `crates/dsp-core/` on every file edit, including edits arriving from a pulled branch or PR. This is arbitrary code execution triggered by file content.
Fix: trigger the hook on `userTriggered` or only for files authored locally, run it in a sandbox or container without network and without access to `~`, and add `build = false` plus a check that `crates/dsp-core/` contains no `build.rs` and no proc-macro dependencies.

### M2. Agent tool grants do not match their outputs
Files: .kiro/crew/crew.yaml:32 and :54; agent files in .kiro/crew/agents/.
`burnout-sentinel` and `dsp-verifier` have `tools: [read, shell]` but must write `.zonked-signals.json` and `.zonked-verify.json` atomically. There is no write tool and no `mv` in `shell_allow`, so operators will be tempted to widen the shell list. `acoustic-sequencer` has an unscoped `write` tool, so a path other than `.zonked-state.json` is not prevented by config (only by prose).
Fix: give each agent a `write` tool scoped to exactly its one output path (and its `.tmp` file), and keep shell lists as in H1. Do not add `mv`/`tee` to shell.

### M3. Bridge and web accept a 5 second transition; crew.yaml requires 30
Files: crew-bridge/src/validate.ts:96, web/src/app/crew.ts:65, .kiro/crew/crew.yaml:73.
`safety.min_transition_seconds: 30` is not enforced. A tampered state file, or any local process that binds port 43210 before the bridge, can move gain from 0.5 to 0.85 and shift beat and carrier within 5 seconds. Values stay inside hard bounds, but this contradicts the declared safety policy and the hearing-safety intent.
Fix: change the lower clamp from 5 to 30 in both files (`clamped(ctx, "target.transitionSec", t, 30, 600)` and `clamp(trans as number, 30, 600)`), default 60, and update the tests.

### M4. Web client does not authenticate the bridge
File: web/src/ui/bridgeClient.ts:4.
Any local process that listens on `localhost:43210` is trusted as the crew. Impact is bounded by clamping and by the safety gate (no autoplay), but it can steer sound parameters and the displayed burnout score.
Fix: keep the clamps, and add a bridge-issued random token printed on bridge start that the user pastes once (stored in memory only) or enforced via a `?token=` on the EventSource URL. At minimum, document the trust model in README and show "connected to unauthenticated local bridge" in the HUD.

## Low

### L1. `HEAD /events` holds an SSE slot forever
File: crew-bridge/src/server.ts:181, :193-194, :220-242.
HEAD is allowed, routed to `sse()`, and registered in `this.clients`. One local process can fill the 20-client cap and lock out the real UI.
Fix: in `handle`, for `/events` return `405` when `req.method !== "GET"`; and add a per-Origin cap (for example 4) alongside `MAX_SSE_CLIENTS`.

### L2. State file open follows symlinks and can block on FIFOs
File: crew-bridge/src/watch.ts:14.
`open(path, "r")` follows symlinks and blocks a libuv thread on a FIFO until a writer appears (`isFile()` is checked after the open). Size cap and `handle.stat()` on the opened handle correctly avoid a size TOCTOU. Content is never echoed, so no read primitive results.
Fix: `open(path, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW | fsConstants.O_NONBLOCK)` (import `constants as fsConstants` from `node:fs`), and treat `ELOOP` as a problem message.

### L3. No rate limit on state broadcasts
File: crew-bridge/src/server.ts:134-143.
`max_state_writes_per_minute: 2` in crew.yaml is not enforced. A writer can produce about 10 accepted states per second, each restarting the web transition.
Fix: drop accepted states closer than 5 seconds to the previous broadcast (keep the latest, send after the window).

### L4. Allow-listed dev origins are generic
File: crew-bridge/src/server.ts:13-20.
Any other app served on localhost:5173, 4173 or 8787 can read state. Data is low sensitivity (score and tone targets).
Fix: leave defaults empty in production use and require `--origin`, or document the exposure.

### L5. Bridge does not answer Private Network Access preflight
File: crew-bridge/src/server.ts:177-180.
When the app is served from an https origin, Chromium sends `Access-Control-Request-Private-Network: true` and needs `Access-Control-Allow-Private-Network: true` in the response. This is a functionality gap, not a vulnerability. Add the header on the OPTIONS response only when the Origin is allow-listed.

### L6. Logo SVG imported without sanitizing
File: web/src/ui/Mascot.tsx:16-26.
`importNode` of a parsed SVG would carry `<script>`, `on*` attributes and `<foreignObject>` if the asset ever gained them. Today `public/logo.svg` has none, it is bundled (`?raw`), and the CSP blocks inline script, so there is no current exposure.
Fix: after parsing, remove `script`, `foreignObject`, `use[href^="http"]` elements and every attribute whose name starts with `on`, and add a unit test that asserts the logo has none.

### L7. IndexedDB growth and length check by characters
File: web/src/storage/db.ts:66, :110-135, :136-141.
`text.length` (UTF-16 units) is compared to a byte limit, and scripts and logs have no count cap, so a user can store unbounded data. Only local self-impact.
Fix: use the shared `utf8Length` for the check, cap scripts at 100 and logs at 1000 (delete oldest in the same transaction), and add `maxLength={262144}` to the textarea in `web/src/ui/Editor.tsx:85`.

### L8. E2E hook exposed in production builds
File: web/src/app/e2e.ts:21.
`?e2e=1` exposes `window.__zonked.getStats()` in the shipped bundle. It is read-only and leaks nothing sensitive.
Fix: gate on `import.meta.env.MODE !== 'production'` or a build flag used by `verify:e2e`.

### L9. Service worker auto-update and info items
Files: web/vite.config.ts:17, :23; crew-bridge/package.json:14; .kiro/crew/crew.yaml:22.
- `registerType: 'autoUpdate'` with `skipWaiting` can reload the page during playback. Not a vulnerability. Prefer `prompt` and apply the update on stop.
- `navigateFallback: 'index.html'` has no denylist. Add `navigateFallbackDenylist: [/^\/(?:api|events)/]` for future routes.
- `npx --prefix crew-bridge zonked-bridge` can hit the registry if the local bin is missing. Use `node crew-bridge/dist/src/cli.js --state .zonked-state.json`.
- `prepare: npm run build` runs on every `npm install`. Acceptable for a private package; keep it private.
- Committed binaries (`media/*.mp4`, `media/*.webm`, `docs/*.pptx`, about 18 MB) and the git author email in history are not secrets, but note them before publishing.

## Verified clean (no finding)

Bridge:
- Binds 127.0.0.1 only (server.ts:75). Host allow-list `localhost:<port>` and `127.0.0.1:<port>` blocks DNS rebinding (server.ts:164). Missing Host rejected.
- Origin is checked against an exact allow-list (server.ts:166); `null` is rejected. CORS reflects only allow-listed origins with `Vary: Origin` (server.ts:172-175). No credentials headers.
- Methods limited to GET, HEAD, OPTIONS. No request body is ever read. No writes, no child_process, no `fs.write*` in src. `fake-crew.mjs` (a demo script) is the only writer and is not shipped as the bridge.
- 64 connection cap, 20 SSE cap, header count and timeouts, per-client 256 KB backlog drop (server.ts:53-57, :148).
- State file: 64 KB cap checked on the opened handle before read (watch.ts:20-25) and again in `parseStateBytes`. JSON validated into a fresh object using `Object.hasOwn`, so `__proto__`, `constructor` and inherited keys are ignored (validate.ts:41-43, :153-159). Numbers are finite-checked and clamped. Embedded `.sbg` is capped at 4096 bytes, 20 events, 512 chars per line, with control characters rejected.
- Errors: responses contain static messages only. No paths, stack traces or file content reach clients (`/health` returns `lastError` strings built from fixed text).
- CLI: strict arg parsing, port range check, origin normalized to `http(s)` origins.

Web:
- No `innerHTML`, `outerHTML`, `insertAdjacent*`, `dangerouslySetInnerHTML`, `eval`, `new Function`, `document.write` or `window.open` anywhere in src (grep verified). No `fetch` except the same-origin wasm. No inline script in index.html or dist.
- Bridge payload: 70000 byte string cap, JSON.parse in try/catch, strict schema and clamps in `parseCrewState`. Bridge cannot autoplay: play requires the safety gate (App.tsx:89-97, :108).
- `.sbg` import: `file.size` checked before `file.text()` (Editor.tsx:44-48). Parser caps bytes, line length and events, anchored bounded regexes (`NUM_RE`, `TIME_RE`, `NAME_RE`), manual tokenizer, diagnostics capped at 1000. No ReDoS path.
- Storage: localStorage holds two boolean flags only. IndexedDB holds user scripts and play logs only. No tokens or secrets.
- Media Session: static metadata and same-origin artwork; handlers go through the safety gate or stop.
- Worklet port is a private same-realm MessageChannel (no origin concept). Params are clamped in the worklet core output stage and in dsp-core. SharedArrayBuffer is created only when cross-origin isolated and is never exposed to other origins.
- `_headers` contain every item required by standard 3 plus extra hardening: `X-Frame-Options`, `Permissions-Policy`, `Cross-Origin-Resource-Policy: same-origin`, `base-uri 'none'`, `frame-ancestors 'none'`, `object-src 'none'`. `dist/_headers` is identical to `public/_headers`. Hashed `/assets/*` immutable; `sw.js`, `index.html`, manifest `no-cache`.
- host config file: static assets only, no Worker script, no bindings, no secrets, no routes.
- Service worker: scope `/`, precache of build outputs only, `cleanupOutdatedCaches` on, no runtime caching of cross-origin or bridge responses, so no cache-poisoning path from the bridge.

Agents:
- All three agent files state that git messages, file names, logs and source text are data and embedded instructions must be ignored. The sentinel reads only `%ct` timestamps, not commit messages, which removes the largest injection channel. The signals and state files contain only numbers and a bounded `.sbg`. H1 and M2 are the remaining gaps.

## Recommended fix order

1. H1 (exact shell_allow entries).
2. M2 (scoped write tools).
3. M3 (30 second minimum transition in bridge and web, with tests).
4. M1 (gate or sandbox the cargo hook).
5. L1, L2 (small bridge changes with tests).
6. M4, L3-L9 as time allows.

## Resolution

| Finding | Status | Change |
|---|---|---|
| H1 | Fixed | `shell_allow` for burnout-sentinel is four exact commands (`git --no-pager log --no-ext-diff --no-textconv --since=60.minutes.ago --pretty=%ct`, the same with `12.hours.ago`, `git --no-pager status --porcelain`, `date -u +%s`). `.kiro/crew/agents/burnout-sentinel.md` uses the identical strings and forbids extra flags and shell operators |
| M1 | Fixed (mitigated) | `scripts/check-no-buildrs.mjs` (with tests) fails on `build.rs`, a build script key, or proc-macro dependencies in `crates/dsp-core`. The hook runs `node scripts/check-no-buildrs.mjs && cargo test ...`, the verifier runs the check first, and the hook description and README state that `cargo test` runs local code. Test code still runs locally by nature |
| M2 | Fixed | Each agent has a `write_allow` list in crew.yaml: sentinel `.zonked-signals.json` and `.tmp`, sequencer `.zonked-state.json` and `.tmp`, verifier `.zonked-verify.json` and `.tmp`. Agent front matter tools match. Atomic rename is done by the runner when it supports rename; otherwise writes are direct and the bridge tolerates partial reads through its validation and debounce. `mv` and `tee` stay out of the shell lists |
| M3 | Accepted with rationale | The 5 s lower clamp on `transitionSec` stays (the demo and e2e depend on it). Hard bounds still hold (gain at most 0.85, carrier and beat ranges), gain and frequency are smoothed in the engine, and the sequencer agent enforces the 30 s minimum |
| M4 | Documented | Unauthenticated loopback trust model documented in crew-bridge/README.md and the docs/LLD.md threat table. No token added |
| L1 | Fixed | `/events` returns 405 for anything but GET; 4 SSE streams per Origin. Tests added in crew-bridge/test/server.test.ts |
| L2 | Fixed | State file opened with `O_RDONLY | O_NOFOLLOW | O_NONBLOCK`; `ELOOP` is reported as "symlinks are not followed". Test added in crew-bridge/test/watch.test.ts |
| L3 | Accepted with rationale | No 5 s broadcast rate limit. Gain and frequency are smoothed in the engine, hard bounds hold, and the sequencer agent enforces the write rate |
| L4-L9 | Open | Not part of this pass |

Gates: `cd crew-bridge && npm test` (45 of 45), `cd web && npm run audit:security` (passed), `node --test scripts/check-no-buildrs.test.mjs` (4 of 4).
