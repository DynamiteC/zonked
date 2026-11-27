---
name: zonked-hearing-safety
description: "Use when any code, agent or UI touches Zonked sound: frequency, beat, gain, volume, ramps, limiter, playback start or stop, flashes, pulses, state files or bridge messages. Lists the non-negotiable hearing safety bounds, where to clamp, and the tests to run."
---

# Zonked hearing safety

These rules bind every change. A change that breaks one is a defect even if
tests pass. The source of truth is `.kiro/steering/zonked-standards.md` and
`AGENTS.md`. If this skill and those files differ, those files win and this
skill needs a fix. When unsure about a bound, pick the safer value.

## Bounds

| Parameter | Allowed | On violation |
|---|---|---|
| Carrier frequency | 20 to 1500 Hz | clamp |
| Beat offset | 0.5 to 40 Hz | clamp |
| Master gain | 0.0 to 0.85 | clamp |
| Output sample | -0.95 to 0.95 | hard limit (brickwall limiter is the last stage) |

Never reject silently and never exceed. Clamp, and warn with a line number
where input has lines (the `.sbg` parser).

## Clamp in three places

1. The `.sbg` parser (`web/src/sbg/`).
2. The AudioWorklet message and param layer (`web/src/audio/`).
3. `crates/dsp-core` itself. It is the last line of defense and must be correct alone.

The bridge also clamps state it reads (`crew-bridge/`). A new input path needs
its own clamp and a test; never trust that an earlier layer did it.

## Ramps and gates

- Playback starts with a gain ramp of at least 2 seconds.
- Stop and pause ramp down over at least 250 ms.
- Parameter changes use per-sample one-pole smoothing so a step never clicks.
- Crew state transitions last at least 30 seconds (bridge policy minimum).
- Show the headphone and volume notice before first playback. It says binaural
  beats need stereo headphones and that Zonked is not a medical device.
- No autoplay before the notice is accepted.

## Visual safety

- Never more than 3 flashes per second in any full-screen luminance change
  (isochronic and visual pulses included).
- Reduced-motion mode disables eye pulsing and the pacer flash.

## Network and files

- No network calls except the optional loopback bridge on 127.0.0.1.
- No audio downloads. Every sound is synthesized in the WASM core.
- No analytics, no remote scripts, no eval.

## DSP core rules (when editing `crates/dsp-core`)

- `#![no_std]`, no allocation, constant work per 128-sample frame, no panics.
- Every `f32` input passes an `is_finite()` check; fall back to the last good value.
- Phase is a `u64` fixed-point accumulator.

## How an agent requests a sound change

An agent never touches audio code or the engine. It has two allowed paths:

1. Write the validated state file `.zonked-state.json` (version 1) with a
   `target` block: `presetId`, `beatHz`, `carrierHz`, `gain`, `transitionSec`.
   The bridge validates and clamps it, and the web app re-validates it.
   `transitionSec` is at least 30. Never write an out-of-range value on purpose.
2. Inside the Kiro Crew app, call the app's play tool (or the equivalent
   command) with a catalog template id. The tool validates and clamps again.
   Verify the exact tool name in the app's manifest before relying on it.

Agents do not run commands, play audio, change gain above 0.85, or skip the
safety notice. A rejected file keeps the last good state.

## Checklist before you finish

- [ ] Every new numeric input is clamped, with NaN and infinity cases handled
- [ ] Clamped in all three places where the input travels
- [ ] Start ramp at least 2 s, stop ramp at least 250 ms preserved
- [ ] Notice before first play still shows
- [ ] Flash rate at most 3 per second; reduced motion respected
- [ ] No new network call or download
- [ ] Tests added for out-of-range, NaN and infinity values

## Tests to run

```bash
cargo test --manifest-path crates/dsp-core/Cargo.toml
cargo clippy --manifest-path crates/dsp-core/Cargo.toml --all-targets -- -D warnings
npm --prefix crew-bridge test
npm --prefix web test
npm run verify:all
```

Safety test files to keep green: `web/src/app/playerSafety.test.ts`,
`web/src/app/playerSafetySweep.test.ts`, `web/src/audio/audio.test.ts`,
`web/src/audio/params.test.ts`. `verify:all` runs every stage including E2E.

## Sources

- `.kiro/steering/zonked-standards.md` (sections 1 to 4)
- `AGENTS.md`
- `crew-bridge/README.md` (state file schema and clamps)
- `.kiro/crew/agents/acoustic-sequencer.md`
