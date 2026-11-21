# dsp-core

`#![no_std]`, allocation-free, panic-free DSP engine for Zonked: binaural, monaural and isochronic tones, white, pink and brown noise, and five synthesized layers (lofi, instrument, pad, chimes, percussion), behind a plain C ABI (contract C1). No wasm-bindgen.

## Build and test

```bash
cargo test --manifest-path crates/dsp-core/Cargo.toml
cargo clippy --manifest-path crates/dsp-core/Cargo.toml --all-targets -- -D warnings
cargo build --manifest-path crates/dsp-core/Cargo.toml --target wasm32-unknown-unknown --release
cp crates/dsp-core/target/wasm32-unknown-unknown/release/dsp_core.wasm web/src/wasm/dsp_core.wasm
```

`wasm-pack build --target web` refuses crates without wasm-bindgen, so the plain cargo build is the supported driver. The output has no imports.

## ABI

| Export | Meaning |
|---|---|
| `zk_init(sample_rate: f32)` | reset engine, fixed noise seed |
| `zk_param_block() -> *mut f32` | 32 f32 slots written by the host |
| `zk_param_count() -> u32` | 32 |
| `zk_apply_params()` | sanitize and apply the block |
| `zk_render(frames: u32)` | frames clamped to 1..=128 |
| `zk_out_left()`, `zk_out_right()` | 128 f32 each |
| `zk_reset_phase()` | zero all phases |

Slots: 0 carrier_hz, 1 beat_hz, 2 gain, 3 mode (0 bin, 1 mono, 2 iso), 4 noise_kind (0 off, 1 white, 2 pink, 3 brown), 5 noise_level, 6 ramp_seconds, 7 reserved.

Layer slots (contract C1, names and enum orders match `web/src/sbg/layers.ts`):

| Slot | Name | Range |
|---|---|---|
| 8 | lofi_level | 0..1 |
| 9 | lofi_warmth | 0..1 (high is darker) |
| 10 | crackle | 0..1 (up to 25 pops per second) |
| 11 | inst_level | 0..1 |
| 12 | inst_kind | 0 pluck, 1 drone, 2 fm bell-pluck |
| 13 | inst_root_hz | 55..880 |
| 14 | inst_scale | 0..7 |
| 15 | inst_bpm | 30..180, one note per beat |
| 16 | pad_level | 0..1 |
| 17 | pad_chord | 0..7 |
| 18 | pad_root_hz | 55..440 |
| 19 | chime_level | 0..1 |
| 20 | chime_rate_per_min | 1..30, mean rate with 0.6 to 1.4 interval jitter |
| 21 | perc_level | 0..1 |
| 22 | perc_bpm | 30..180, 16 steps per bar of four beats |
| 23 | perc_pattern | 0..7 |
| 24..31 | reserved | 0 |

A host that writes only slots 0 to 7 keeps working: slots 8 to 31 default to 0, so every layer is off and the output is bit-identical to the pre-layer engine (tested against recorded hashes). Non-finite values keep the previous value, out-of-range values are clamped, enums are rounded and clamped. `Engine::apply_params` accepts a slice of any length; missing slots keep their previous value.

## Layers

Module `layers/`. All layers run every sample (constant cost), mono, deterministic (fixed-seed Xoshiro256, fixed tables), no heap. Levels are smoothed per sample (tau 20 ms); instrument kinds crossfade with one-hot weights (tau 30 ms); pad chord and root glide (tau 0.3 s).

- lofi: four detuned oscillators with a second harmonic (110 Hz stack), one-pole low-pass (3.5 kHz open to 200 Hz dark), cubic tape saturation, sparse crackle from the PRNG.
- instrument: four voices, one note per beat, degree chosen from the scale table (semitone offsets within two octaves) around inst_root_hz. Kind 0 is Karplus-Strong on a fixed 4096 sample line per voice with a fractional-delay all-pass, excited in-loop (no O(N) fill). The line covers 55 Hz at 192 kHz (3490 samples); the delay is clamped to 4..4092. Notes above 0.2 of the sample rate fold down by octaves (no clamping), so 8 kHz keeps distinct pitches. Kind 1 is a three-partial drone gliding to each fourth note, one octave down. Kind 2 is two-operator FM (ratio 3.5) with decaying index.
- pad: four oscillators on the chord table with detune ratios and slow per-oscillator swells.
- chimes: six inharmonic partials (ratios 1, 2.76, 5.4, 8.93, 13.34, 18.64) with exponential decays, pitch from a pentatonic table on 392 Hz. Partials above 0.45 of the sample rate are muted and their envelopes zeroed (no frozen-phase DC tail). The strike interval jitter is drawn once per strike.
- percussion: pitched thump (sweep 142 to 52 Hz) plus band-passed noise snare with a 185 Hz body; eight fixed 16-step patterns. Envelopes have a 3 ms soft attack.

Mix budget: lofi 0.3, instrument 1.2, pad 0.5, chimes 1.0, percussion 0.8, summed and soft-limited to 0.7 (knee 0.6). The tone and noise bed is scaled by `1 - 0.6 * min(1, sum(levels) / 2)` (exactly 1.0 with layers off, so layers-off output is bit-identical to the pre-layer engine). With all layers at 1 and no noise bed the worst case before the limiter is (0.4 + 0.7) * 0.85 = 0.935, checked by test. The bound comes from the soft limit, not the budgets. Partial level combinations at gain near 0.85 can exceed 0.95 before the output limiter at coinciding peaks (up to about 1.18); the limiter keeps the output within [-0.95, 0.95]. Loudness: at gain 0.4 (tone rms 0.28) each layer at level 1 adds at least 0.033 rms (lofi 0.065, pluck 0.035, pad 0.042, chimes 0.045, percussion 0.034, drone 0.148, FM 0.125), checked by test.

Scheduling: a faster tempo or chime rate takes effect at once (`Clock` clamps the pending wait to the new interval): chimes 1 to 30 per minute within 3 s, bpm 30 to 180 within 0.5 s.

State: `Engine::event_counts()` returns scheduled instrument notes, chime strikes and percussion hits; `Engine::take_peak()` returns the pre-limiter peak, `Engine::subnormal_count()` counts subnormal values left in the pluck state (always 0). All three are for tests.

## Safety

Carrier 20-1500 Hz, beat 0.5-40 Hz, gain 0-0.85, output limited to [-0.95, 0.95]. Non-finite inputs keep the previous value. Ear frequencies are kept between 0.5 Hz and 0.45 of the sample rate.

## Smoothing

`ramp_seconds` (clamped 0.05-30) is the time constant for noise level. Carrier and beat use twice that value. Gain uses `ramp_seconds` but the core enforces minimums itself: tau of at least 0.4 s while the gain target is above the gain (about 2 s to 99 percent) and at least 0.1 s while it is below (about 440 ms to 99 percent down, never under 250 ms). The one-pole step snaps to its target within 1e-9 and outputs below 1e-30 are flushed to 0, so silence is exact zero with no subnormals.

## Mode switching

All three tones (binaural, monaural, isochronic) are computed every sample and mixed with smoothed one-hot weights (tau 30 ms), so a mode change crossfades with no click. Cost stays O(1).

## Lints and unsafe

`unsafe_code` and `clippy::arithmetic_side_effects` are denied crate-wide; only `abi.rs` allows unsafe. `extern crate std` stays on non-wasm targets because the native cdylib needs a panic handler; wasm32 is freestanding. The xoshiro seed expansion never yields the all-zero state.

## Cost

Each sample runs one fixed path (smoothing, four phase accumulators, polynomial sine, three noise colours, all five layers, limiter). A frame is O(1) in parameter values. The release wasm is about 29 KB; the engine lives in an uninitialised static so the 32 KB of delay lines stay out of the data section.
