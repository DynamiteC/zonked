# Audit: zonked-library (branch feature/zonked-library)

Read-only audit. Scope A: DSP layers, engine, ABI. Scope B: web library security and hearing safety.
Stress harness and throwaway vitest cases lived outside the repo (session scratch). No code was edited.

## Verdict

No critical or high findings. Three medium, nine low. Hearing safety bounds hold on every path I could reach.

## Verified results

These rows are the library-wave values at audit time. The current tree measures: cargo 59 tests, vitest 310 tests in 31 files, first load 104.44 KB gzip (budget 110), wasm 38,564 bytes, precache 36 entries (663.53 KiB).

| Check | Result |
|---|---|
| `cargo test` (crates/dsp-core) | 18 passed |
| `cargo clippy --all-targets -- -D warnings` | clean |
| Web `vitest run` | 18 files, 211 tests passed |
| `tsc --noEmit` | clean |
| `npm audit --omit=dev` | 0 vulnerabilities |
| First-load budget | JS 89.20 KB + CSS 2.80 KB = 91.99 KB gzip (budget 120) |
| Wasm | 29,260 bytes (10.05 KB gzip), identical to a fresh `wasm32-unknown-unknown` release build |
| Wasm imports | none |
| Wasm exports | memory, zk_init, zk_param_block, zk_param_count, zk_apply_params, zk_render, zk_out_left, zk_out_right, zk_reset_phase, plus globals `__data_end`, `__heap_base` |
| Wasm memory | 17 pages (1.06 MiB) at instantiation |
| `_headers` | unchanged since the core release, identical to the standards CSP |
| External URLs in a fresh build | only `http://localhost:43210` and `ws://localhost:43210` (bridge), plus inert strings (w3.org namespaces, react.dev/errors, bit.ly/wb-precache comment) |
| `eval` / `new Function` / `document.write` in build | none (React's `innerHTML` setters are library internals, unused with dynamic data) |

### DSP stress harness (release build, overflow checks on)

20,000,000 samples per rate, parameter blocks rewritten every ~64 calls with random values and hostile values
(NaN, +/-inf, +/-1e38, +/-f32::MAX, subnormals, -0, negatives, 10x out of range), frame counts 0..129, layers biased to max level.

| Rate | max abs out | finite | max pre-limiter |
|---|---|---|---|
| 8000 | 0.9235 | yes | 1.499 |
| 44100 | 0.9156 | yes | 1.305 |
| 48000 | 0.9141 | yes | 1.276 |
| 96000 | 0.8851 | yes | 0.996 |
| 192000 | 0.7203 | yes | 0.720 |

Invalid rates (NaN, 0, -5, 1e9, inf) fall back or clamp to 8k..192k and stay finite and below 0.95.
Determinism: two runs with the same seed give identical output hashes at all five rates.

### Headroom bound (by reading the code)

- Layer outputs: lofi <= 1, instrument <= 1 (clamped), pad <= 0.95 (4 x 0.95 x 0.25), chime <= 1.03, percussion <= 1 (clamped).
- Bus before soft limit <= 0.25 + 0.25 + 0.2375 + 0.1545 + 0.25 = 1.142; `soft()` caps it below 0.6 (measured max 0.51 over 60 s at 5 rates).
- Tone scale is 0.5 at full levels; tone weights sum to 1, so tone <= 1 (sine polynomial peaks at 0.9999999).
- Worst case without noise: (0.5 x 1 + 0.6) x 0.85 = 0.935, below the limiter knee region end 0.95. L2.3 holds without help from the limiter.
- With a noise bed the theoretical bound is far higher (brown noise filter gain 16, pink about 9), so the limiter does engage (pre-limit up to 1.5 at 8 kHz). Output stays <= 0.95 because `limit()` clamps `|x|` to 16 then to 0.95 and maps NaN to 0. This predates the library.

### Other DSP checks

- Click test (layers only, 48 kHz, kind and level switches every 0.25 s for 30 s): max sample step equals the baseline without switching for every layer (0.098 combined, 0.095 instrument pluck onset noise, 0.021 lofi, 0.004 pad, 0.074 chimes). Switching adds no step. Turning all levels off from full: max step 0.075 (the signal itself, smoothed over 20 ms).
- Event timing, 60 s: instrument 60 notes at 60 bpm and percussion 60 hits at every rate (8k to 192k). Chime 12 to 13 strikes at 6/min at every rate. Tempo is sample-rate independent.
- Delay-line math: `tap()` uses `w.wrapping_sub(back) & (LINE - 1)` with LINE = 2048 (power of two); n <= 2044 so n + 1 <= 2045 stays in range. All indexing goes through `get()` or masks. `Pluck::trigger` clamps d to 4..2044.
- Slots 8..31: every layer slot goes through `sanitize` or `sanitize_enum`; non-finite keeps the previous value; slots 24..31 are ignored. `Engine::apply_params` uses `p.get(i)`.
- `static mut` is not used. `UnsafeCell` statics with `unsafe impl Sync` are sound under the documented single-thread contract. The `&'static mut Engine` from `engine()` never coexists with another live reference. `zk_init` overwrites without drop, which is fine because `Engine` has no `Drop`. Engine is built on the stack (about 34 KB) before the move, well within the 1 MiB wasm stack.
- No allocation, no `std` use in the core (only `extern crate std` on non-wasm hosts for the panic runtime). Standards section 1 lint set is denied in `lib.rs` and clippy passes.

## Findings

### Medium

**M1. A crew message can raise loudness while the user is listening.**
`web/src/app/player.ts:496-507` (`enterCrew`), `:361` (`effective`), `:272` (`nudgeGain`).
`gainTrim` is an additive offset to the base gain, not a ceiling. Crew target gain is clamped to 0.85 but nothing limits how far or how fast it rises relative to what the user is hearing. Reproduced with a throwaway test: user trimmed volume to the floor, crew sent gain 0.85 with transitionSec 5, effective gain reached 0.45 after 5 s. An `sbg` payload from the bridge (`state.sbg`) skips the transition entirely and plays its own gain events through the 0.25 s tick ramp (the DSP gain smoother adds about 0.4 s tau). Absolute bounds (0.85, 0.95) are never exceeded, but a local process that can reach the bridge or state file can make a quiet session loud without user input.
Fix: in `effective()` keep a per-session `userCeiling` (the effective gain at the last user action: nudge, mute, play) and clamp crew-driven gain to `min(MAX_GAIN, userCeiling)`; or slew-limit rises in `tick()` to 0.02 per second. Apply the same limit to `startScript` when the source is `crew`.

**M2. Rapid stop then play leaves the player showing "playing" while the engine is silent.**
`web/src/audio/engine.ts:51` (`start` returns early while state is `running`), `:144-146` (`stop` waits 350 ms, then `suspend()`).
During those 350 ms `start()` is a no-op, then `stop()` suspends the context. `Player.play()` still sets `playing = true`, starts the tick and timers. The UI shows Stop, the output is silent, the timer runs. Not a hearing risk but a state desync. Easy to hit because `App.tsx:226-239` ignores `e.repeat`, so holding Space toggles play/stop at key-repeat rate (also repeats `n`, `p`, `1`-`5`, restarting scripts).
Fix: (a) in `onKey` return early when `e.repeat` is true; (b) in the engine, make `stop()` set state `stopping` immediately, have `start()` await the pending stop promise (store it in a field) before building, and make `Player.play()` set `playing` only after `engine.status.state === 'running'`.

**M3. Instrument pitch is wrong below about 94 Hz at 192 kHz.**
`crates/dsp-core/src/layers/instrument.rs:42`.
The line is 2048 samples and d is clamped to 2044, so the lowest representable pitch is `sr / 2044.5`: 23.5 Hz at 48 kHz, 47 Hz at 96 kHz, 93.9 Hz at 192 kHz. Root range is 55..880 Hz, so at 192 kHz pluck notes between 55 and 93 Hz sound at about 94 Hz. 44.1, 48 and 96 kHz are correct. The drone and FM bell kinds are phase-based and unaffected.
Fix: size the line for the largest supported rate: `LINE = 4096` (memory +32 KB across 4 voices, still no alloc) and keep the mask, or run the pluck at half rate when `sr > 96000`. Add a test that measures autocorrelation pitch at 192 kHz for root 55.

### Low

**L1. Subnormal state persists in the pluck excitation mixer.**
`instrument.rs:64`. `m += 0.2 * (target - m)` decays toward 0 and sticks at `2.8e-45` (smallest subnormal; reproduced in f32 arithmetic). After the first note, four voices multiply by a subnormal every sample, forever, even with the layer off. No cost on arm64 in the measured timing (141 ns per sample before and after), but x86 wasm engines can take a microcode penalty on subnormal operands. Existing test only checks output samples.
Fix: `self.m = flush(self.m);` after the update, or use `step(self.m, target, 0.2)` which snaps within 1e-9.

**L2. Tempo and rate changes apply late.**
`layers/util.rs:139` (`Clock::tick`). The interval is sampled when an event fires, so changing chime rate from 1/min to 30/min takes up to 84 s (60 s x 1.4 jitter) to take effect; instrument or percussion 30 to 180 bpm takes up to 2 s.
Fix: clamp `left` to the new `next_len` when it is smaller: `if self.left > next_len { self.left = next_len; }` before decrementing.

**L3. Chime partials above Nyquist limit freeze phase and leave a decaying DC step.**
`layers/chime.rs:53`. When a new strike sets `inc = 0` for a partial that is still ringing from the previous strike, the sine stops at a constant value and decays as DC. Amplitude at most `0.25 x 0.15 x 0.85` (about 0.03) at 8 kHz, below 0.013 at 44.1 kHz and above. Fix: also zero the envelope (`env.v = 0`) for dropped partials, or keep advancing phase with the previous `inc`.

**L4. Instrument pitch cap at low rates.**
`instrument.rs:149` caps notes at `sr x 0.2`: 1600 Hz at 8 kHz, so roots near 880 Hz with ratios above 1.8 collapse to one pitch. Only affects 8 kHz contexts. Fix: fold the note down an octave while above the cap instead of clamping.

**L5. Prototype-chain keys accepted by `setLayerOverride`.**
`web/src/app/player.ts:282` uses `k in NO_LAYERS`, which is true for `constructor` and `toString` (confirmed: both stored as own keys). The values are numbers, `clampLayers` copies only known fields, so no effect on audio or on `Object.prototype`, but `Object.keys(layerOverrides).length > 0` flips the "overridden" branch. `__proto__` assignment of a number is ignored. Fix: `Object.hasOwn(NO_LAYERS, k)`.

**L6. `gainTrim` carries across scripts.**
`player.ts:272` and `:361`. A positive trim set on a quiet template adds to the next template's base gain (still clamped at 0.85). Fix: reset or rescale trim on `playAt`, `selectPreset` and `enterCrew`.

**L7. E2E hooks are active in production builds.**
`web/src/app/e2e.ts:34`, installed from `App.tsx:115`. Any visit with `?e2e=1` exposes `window.__zonked` (stats, `setLayers`). `setLayers` is clamped and cannot start playback, so impact is low. Fix: gate on `import.meta.env.MODE !== 'production'` or a build-time flag so the hook tree-shakes out.

**L8. IndexedDB script records are not validated on read.**
`web/src/storage/db.ts:123` (`listScripts`) and `listLogs` return stored objects as typed. Only same-origin script (or a user with devtools) can write them, so this needs prior XSS, but a malformed record (object in `name`) would crash the Editor render. Fix: filter records with `typeof name === 'string' && typeof text === 'string' && text.length <= LIMITS.maxBytes`.

**L9. Wasm export surface includes toolchain globals.**
`__data_end` and `__heap_base` are exported. Harmless, no imports. Fix (optional): link with `-C link-arg=--no-export-dynamic`/strip, or ignore.

## Scope B: areas reviewed with no finding

- Catalog (`web/src/catalog`): pure, deterministic, no `eval`, no storage, no DOM, no randomness or clock. Every stage value is clamped in `templateToEvents` (gain to 0.85, beat 0.5..40, carrier 20..1500, layers via `resolveLayers`) and again in `clampVoice`, `voiceToParams`, the worklet `copyOut` (0.95) and the wasm core.
- Timer persistence (`zonked.timer.v1`): 13 hostile payloads tested (null, array, string, missing spec, negative and 1e308 minutes, negative and 1e308 elapsed, string and null durations, `longEvery` 1e-7 and 1e308, negative cycle, `__proto__` keys, unknown kind, 0-minute sleep). All restore paused with finite, non-negative remaining time and gain scale within 0..1; `Object.prototype` stayed clean. Restored timers never start playback; `resume()` only runs inside `Player.play()`.
- Prefs: `readFlag` accepts only the string `'1'`; wake lock pref likewise.
- Wake lock: requested only when enabled, playing, visible and supported; released on stop, hide and dispose; rejection is swallowed.
- Media session: artwork is the same-origin absolute paths `/pwa-512x512.png` and `/pwa-192x192.png`; metadata strings come from the static catalog; `play` goes through the safety gate.
- Shortcuts: single table, ctrl/meta/alt ignored, `INPUT`, `SELECT`, `TEXTAREA` and contentEditable ignored, keys matched through a `Map` (no prototype lookup), disabled while the safety gate is open. Only gap is key repeat (M2). IME composition (`e.isComposing`) is not checked; add it with the repeat guard.
- Visibility recovery: `recoverAudio` returns early unless the player reports playing and the engine state is `running`; after stop, `engine.resume()` returns false. It cannot auto-start playback.
- UI injection: no `dangerouslySetInnerHTML`, no dynamic `innerHTML`, no `insertAdjacent*`. The only `DOMParser` use parses the bundled static `logo.svg` (no script or event attributes in the file). File import checks size (256 KB) before reading, renders names as React text, export file name is sanitized. Recommender reasons and template names render as React text.
- CSP and new lazy chunks: chunks and the worklet are same-origin scripts, covered by `script-src 'self'`; no new directive is needed. COOP, COEP, CORP unchanged in effect. Service worker precaches 28 entries (569 KiB).

## Hearing safety end to end

| Path | Safety gate | Gain/beat/carrier bounds |
|---|---|---|
| Play button, Space, mascot | `guarded()` | yes |
| Launch keys 1-5, next, prev | `guarded()` | yes |
| Catalog and Recommender Play | `guarded()` | yes |
| Editor Play | `guarded()` | yes, parser clamps with line warnings |
| Media session play, next, prev | goes through the same actions, `guarded()` | yes |
| Timer restore, start, cycle | cannot start playback (paused unless already playing) | sleep fade only lowers gain |
| Crew bridge state or `sbg` | cannot start playback | clamped 0.85 / 0.5..40 / 20..1500, but see M1 |
| Visibility, pageshow, pointerdown | cannot start playback | not applicable |
| `?e2e=1` hook | cannot start playback | clamped (L7) |

Gain above 0.85 is blocked in four places (`Player.effective`, `clampVoice`/`voiceToParams`, wasm `t_gain`, final limiter at 0.95). Start ramp: 2 s master ramp plus a DSP gain time constant of at least 0.4 s (tested in core). Stop ramp 0.3 s master plus 0.1 s DSP. Sleep final fade is 6 s. Beat and carrier are clamped in the sbg parser, catalog, crew parser, `clampVoice` and the core. The only residual issue is relative loudness (M1).

## Suggested order

1. M2 (repeat guard plus stop/start serialization), M1 (gain ceiling), M3 (line length) with tests.
2. L1, L2, L5, L7 (one-line fixes).
3. L3, L4, L6, L8, L9.

## Resolution (web)

Scope B findings fixed on feature/zonked-library (not committed). Gates: vitest 222 passed (19 files), tsc clean, `check:bundle` 92.72 KB gzip (budget 120), `audit:security` passed, `verify:e2e` 19/19. `npm run build` stops at its `build:wasm` step because `crates/dsp-core` currently fails to compile (`f32::abs` missing in a no_std path, Scope A); the web bundle was built with `tsc --noEmit && vite build` against the committed wasm.

| Id | Resolution |
|---|---|
| M1 | `Player` keeps `userCeiling`, the gain heard at the last user action (play, nudge, mute, script or template select). For crew sources (crew target and crew `sbg`) the effective gain is `min(0.85, userCeiling)`, and rises are slew-limited to 0.02 per second in `tick`. Tests in `web/src/app/playerSafety.test.ts` include the audit repro (trimmed to the floor, crew sends 0.85 with transitionSec 5: gain stays 0). |
| M2 | `App` ignores `e.repeat` and `e.isComposing` keydowns (also closes the IME note). `ZonkedAudioEngine.stop()` sets `stopping` at once and stores the pending promise; `start()` awaits it and joins an in-flight start. `Player.play()` and `stop()` run through one serial queue, `play()` sets `playing` only when the engine reports `running` (reverts on failure), and queued intent coalesces. A fake-engine test with async delays, a fake clock and a seeded PRNG runs 50 random toggle sequences and asserts `snapshot.playing` equals engine running. |
| L5 | `setLayerOverride` uses `Object.hasOwn`. |
| L6 | `gainTrim` resets on `playAt`, `selectPreset`, `playCustom` and `enterCrew`. |
| L7 | Accepted. The `?e2e=1` hook stays because production E2E runs against the built site. It is clamped and cannot start playback. |
| L8 | `listScripts` and `listLogs` validate records on read (string types, length bounds, finite numbers) and drop bad ones; tested with hostile raw IndexedDB writes. |

Layout: drawers no longer cover the HUD, burnout bar or scope. From 960 px wide an open drawer reserves its 440 px (`.app.has-drawer`), so the page narrows beside it (two columns from 1280 px, one below). Checked with Playwright at 1280x720, 1600x900, 1920x1080 and 390x844 for all five drawers: bounding boxes of `.hud`, `.burnout`, `.scope` and the toolbar never intersect the drawer at 960 px and up. Below 960 px the drawer is a bottom sheet with the page padded to scroll above it, a Close button, Escape, and a Tab focus trap (`useNarrowFocusTrap`). No `data-testid` changed.

## Resolution (DSP)

Scope: crates/dsp-core only, plus the refreshed web/src/wasm/dsp_core.wasm (29,605 bytes, was 29,260).

| Finding | Fix | Test |
|---|---|---|
| M3 pitch below 94 Hz at 192 kHz | `LINE = 4096`, mask math unchanged, delay clamped to 4..4092 | `pluck_pitch_is_right_at_192k_down_to_55_hz`: autocorrelation over 10 notes at 192 kHz, root 55, scale 0; every note within 3 percent of a scale pitch, at least one below 85 Hz |
| L1 subnormal pluck mixer | `m = step(m, target, 0.2)` (snaps within 1e-9) | `no_subnormal_state_remains_over_60_s_with_layers_on_then_off` via `Engine::subnormal_count()` each second for 60 s |
| L2 late tempo and rate changes | `Clock::tick_max` clamps the pending wait to the new interval; chime jitter is now drawn once per strike so the clamp does not bias it | `chime_rate_change_takes_effect_within_3_s`, `bpm_change_takes_effect_within_half_a_second` (instrument and percussion); `scheduling_tempo_is_accurate` still passes |
| L3 frozen dropped chime partials | `Env::kill()` on partials above 0.45 sr | unit test `dropped_partials_are_silenced_not_frozen` (8 kHz, 400 s) |
| L4 instrument pitch cap | `fold_hz` folds down octaves instead of clamping at 0.2 sr | unit test `notes_above_the_cap_fold_down_by_octaves` |

Loudness (E2E note: layers were quiet). Budgets are now lofi 0.3, instrument 1.2, pad 0.5, chimes 1.0, percussion 0.8; bus soft limit knee 0.6, max 0.7; tone duck `1 - 0.6 * min(1, sum / 2)`. Layers-off output is unchanged (recorded hashes pass). Added rms per layer at level 1, gain 0.4, tone rms 0.28 (output minus ducked tone): lofi 0.065 (was 0.054), pluck 0.035 (0.007), pad 0.042 (0.021), chimes 0.045 (0.007), percussion 0.034 (0.011), drone 0.148, FM 0.125. Checked by `each_layer_is_clearly_audible_next_to_the_tone` (>= 0.03).

Headroom: all layers at 1, no noise bed, gain 0.85: tone term <= 0.4, bus <= 0.7, so (0.4 + 0.7) * 0.85 = 0.935 <= 0.95 (test passes at all three tone modes). Partial combinations (one loud layer plus the tone at 0.7) can peak up to about 1.18 before the output limiter at gain 0.85; the limiter bounds the output to 0.95. This differs from the earlier bound, where every combination stayed under 0.95.

Two existing test thresholds moved because the louder instrument soft-limits its pluck onset burst: the kind spectrum test now requires mid > 5x high (was 10x, gain 0.3), and the click test absolute step ceiling is 0.35 (was 0.1) while the relative check against the unswitched baseline is unchanged.

Verification: `cargo test` 4 unit + 22 dsp + 23 layers pass; clippy `-D warnings` clean; `cd web && npx vitest run src/audio` 27 passed. Hostile stress (20,000,000 samples per rate, release, overflow checks, hostile params every 64 calls, frames 0..129): max abs out 0.880 at 8 kHz, 0.717 at 48 kHz, 0.448 at 192 kHz, all finite and <= 0.95 (max pre-limiter 0.969, 0.717, 0.448).
