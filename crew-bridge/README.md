# zonked-bridge

Zero-runtime-dependency CLI that watches `.zonked-state.json` and serves it to the Zonked web app on `127.0.0.1:43210`. Node 20+. Dev dependencies: `typescript`, `@types/node`.

## Use

```bash
npm --prefix crew-bridge install      # builds dist/ through the prepare script
npx --prefix crew-bridge zonked-bridge --state .zonked-state.json
# optional
#   --signals .zonked-signals.json   summary shown on /health
#   --port 43210                     1-65535
#   --origin https://your-site.example   repeatable
#   --min-transition 5               DEMO ONLY, see below
```

The web app does not connect by default. Turn on "Connect to Kiro Crew on this computer" in the app (Advanced), or open the page once with `?crew=1`. Until then the app makes no request to this port.

Demo without agents:

```bash
node crew-bridge/scripts/fake-crew.mjs --state .zonked-state.json --step-sec 20
# fast demo: short steps need the bridge flag too
node crew-bridge/scripts/fake-crew.mjs --state .zonked-state.json --step-sec 6 --transition-sec 5
npx --prefix crew-bridge zonked-bridge --state .zonked-state.json --min-transition 5
```

`--transition-sec <n>` sets the `transitionSec` the fake writes (default 60).

It writes the state atomically, cycling score 10, 50, 70, 90 through focus (40 Hz / 200), flow (18 / 220), recovery (10 / 200) and decompress (6 / 180), matching `.kiro/crew/agents/acoustic-sequencer.md`. Extra flag: `--count <n>` stops after n writes.

## Transport: SSE, not WebSocket

Server-Sent Events fit a one-way, low-rate state feed. They need no handshake library, reconnect natively in `EventSource` (the app adds backoff), and keep the bridge on `node:http` only.

## Endpoints

| Route | Result |
|---|---|
| `GET /events` | `text/event-stream`. Replays the latest state on connect as `event: state`. Pushes each valid change to all clients (about 100 ms debounce). `event: ping` every 15 s. Max 20 clients, then 503. |
| `GET /state` | Latest validated state as JSON, or 404 before the first one. |
| `GET /health` | `{ ok, version, port, hasState, lastError, warnings[], clients }`, plus `signals` when `--signals` is set. |

## Security model

- Binds `127.0.0.1` only. Never writes to the project, never spawns processes.
- `Host` must be `localhost:<port>` or `127.0.0.1:<port>` (the bound port), otherwise 403 (DNS rebinding).
- `Origin`, when present, must be on the allow-list, otherwise 403. Defaults: `http://localhost:5173`, `http://127.0.0.1:5173`, `:4173`, `:8787` on both hosts, plus `--origin`. `Access-Control-Allow-Origin` echoes only allow-listed origins. Requests with no `Origin` (curl, same-origin) are served without CORS headers.
- `/events` accepts GET only (405 otherwise) and at most 4 concurrent streams per Origin (20 total).
- Only GET, HEAD and OPTIONS. Header and request timeouts of 10 s, 64 connection cap, 50 header cap.
- The state file is opened with `O_NOFOLLOW | O_NONBLOCK`, so symlinks are refused (reported as a problem) and FIFOs cannot block a read.
- The state file is untrusted: 64 KB cap, strict schema, fresh output object (unknown and `__proto__` keys are never copied), unknown `version` rejected.

### Trust model: unauthenticated loopback

The bridge and the web client do not authenticate each other. The web client trusts whatever process listens on `localhost:43210`, and the bridge serves any request that passes the Host and Origin gates. Any process of the same user can bind the port first, or write the state file, and steer the sound and the displayed burnout score. Impact is bounded: every value is clamped (carrier 20-1500 Hz, beat 0.5-40 Hz, gain at most 0.85), gain and frequency are smoothed in the engine, and playback needs the user's safety gate (no autoplay). Do not run the bridge on a shared machine you do not trust.

## Validation

| Field | Rule |
|---|---|
| `version` | must be 1, else rejected |
| `at` | non-negative integer, else rejected |
| `burnout.score` | rounded and clamped 0-100 |
| `burnout.level` | focus, flow, recovery, decompress, else rejected |
| `target.carrierHz` | clamped 20-1500 |
| `target.beatHz` | clamped 0.5-40 |
| `target.gain` | clamped 0-0.85, default 0.5 |
| `burnout.level` vs `score` | the score wins: level is derived (focus 0-39, flow 40-59, recovery 60-79, decompress 80-100) and a mismatch adds a warning |
| `target.transitionSec` | clamped to the minimum (30 by default) through 600, default 60 |
| `target.presetId` | slug of at most 32 characters, else dropped |
| `sbg` | string or null. At most 4096 bytes, 20 timed event lines, 512 characters per line, no control characters. Violations drop it to null with a warning. |

Wrong types or non-finite numbers reject the whole file. A rejected file never replaces the last good state; the reason shows in `/health.lastError`. Clamps and drops show in `/health.warnings`.

### Minimum transition: two layers

Policy minimum is 30 s (`safety.min_transition_seconds` in `.kiro/crew/crew.yaml`). The bridge enforces it and sends the clamped `transitionSec` in the SSE state. The web app trusts that value and keeps only a hard floor of 5 s (ceiling 600 s) for hostile direct input. `--min-transition <sec>` (5-600, default 30) lowers the bridge floor for demos and e2e runs only. It prints a DEMO MODE line at start. Do not use it in real sessions. Hearing bounds are unaffected.

On start the bridge prints one line listing the allowed browser origins.

## Watching

`fs.watch` on the parent directory (so atomic rename replacement works), 100 ms debounce, plus a 2 s stat poll fallback. Unchanged content is not re-broadcast.

## Known limit

Safari blocks `https` pages from calling `http://127.0.0.1`. Chrome and Firefox treat loopback as secure. Local dev over `http://localhost:5173` works everywhere.

## Develop

```bash
npm test         # build, then node:test on dist/test
npm run build
```
