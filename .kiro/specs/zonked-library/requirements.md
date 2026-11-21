# Zonked Library: Requirements (EARS)

Project brief: `brief.md`. Contracts: `contracts.md`. Base spec: `../zonked-core/`.

## L1 Catalog and recommender
- L1.1 The catalog shall contain at least 210 templates with unique ids across all 8 categories, at least 15 per category.
- L1.2 Every template shall clamp to hearing-safety bounds when converted to events.
- L1.3 At least 21 templates shall derive from the Android programs and 3 from the Gnaural schedules, marked by `source`.
- L1.4 When `recommendTemplates` is called, it shall return at least 5 distinct templates for every situation, ranked by score, with at least one reason each.
- L1.5 The recommender shall be deterministic: equal inputs give equal outputs, and it shall not read the clock, randomness or storage.
- L1.6 Where device type is speaker, the recommender shall prefer isochronic or monaural templates and warn on binaural ones.
- L1.7 Where sensory sensitivity is high, the recommender shall exclude intensity above 3, percussion and crackle.

## L2 DSP layers
- L2.1 The Engine shall synthesize lo-fi, instrument, pad, chime and percussion layers with no allocation and O(1) cost per sample.
- L2.2 Where all layer levels are 0, the output shall equal the pre-layer output.
- L2.3 The Engine shall keep output within [-0.95, 0.95] for any layer combination at maximum levels.
- L2.4 When a layer level or kind changes, the Engine shall not click.
- L2.5 The Engine shall sanitize every new param slot against NaN, infinity and out-of-range values.
- L2.6 The Engine shall remain deterministic for the same parameters and seed.

## L3 Timers and playback
- L3.1 The Player shall provide countdown, sleep fade-out and Pomodoro timers on one timer state.
- L3.2 When the sleep fade completes, the Player shall stop playback after a final fade of at least 5 seconds.
- L3.3 The Player shall persist timer state and restore it paused.
- L3.4 While the page is hidden or the screen locks, audio shall keep running; if the AudioContext is suspended by the browser, the Player shall resume it on the next gesture or visibility change.
- L3.5 Where the Wake Lock API exists and the user enabled it, the app shall hold a screen wake lock during playback and release it on stop.
- L3.6 MediaSession shall expose play, pause, stop, nexttrack, previoustrack, seekforward, seekbackward, per-template metadata, artwork and position state.
- L3.7 The shortcut table shall be the only source for key handling and for the help popover.

## L4 UI
- L4.1 The recommender shall show at least 5 results with score, reasons and a Play button each.
- L4.2 The browser shall search and filter 210+ templates without jank (virtualized or paged lists).
- L4.3 The layer mixer shall control each layer level within safe bounds and show the effective master gain.
- L4.4 The mascot shall tilt in 3D toward the pointer, support drag, hover depth and audio-reactive depth, and shall be static under reduced motion.
- L4.5 Editor, Catalog and Recommender drawers shall load lazily.
- L4.6 First-load JavaScript shall stay under 120 KB gzip, checked by a budget script.

## L5 Security and release
- L5.1 The CSP, COOP, COEP, CORP and other headers shall be unchanged in effect.
- L5.2 No network request for audio files shall occur; E2E asserts none.
- L5.3 E2E shall cover audio output with layers, offline reload, timers, shortcuts, and the loopback bridge from the https page.
- L5.4 Docs, deck and demo video shall be refreshed.
