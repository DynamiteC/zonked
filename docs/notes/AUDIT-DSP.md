# DSP core audit (crates/dsp-core)

Scope: `crates/dsp-core/src` against `.kiro/steering/zonked-standards.md` sections 1 and 2. Read-only audit, no code changed.

## Results

- `cargo test`: pass (2 unit, 17 integration).
- `cargo clippy --all-targets -- -D warnings`: pass.
- `cargo build --release --target wasm32-unknown-unknown`: pass.
- Stress (outside the repo, overflow-checks on, debug and release): 10,000,016 samples, random parameter sweeps (NaN, +-inf, f32::MAX/MIN, subnormals, -0.0, negatives, random bit patterns), random frame counts (0, u32::MAX, 1..300), sample rates 8k to 192k plus NaN, 0, negative, 1e9, inf, random engine re-creation and phase resets. No panic, no non-finite output, max |out| 0.9257 (bound 0.95 held).

## Findings

### Medium

M1. Abrupt mode switch causes a click. `engine.rs:134-146`, `engine.rs:96`. `mode` changes the tone expression instantly with no crossfade. Measured first-sample jump of 1.01 (full scale at gain 0.85) when switching binaural to monaural to isochronic. Violates section 1 ("a step must never produce a discontinuity audible as a click"). Fix: keep the tone for the old and new mode, crossfade with a smoothed weight (for example `mode_w: [f32; 3]` stepped with `a_gain`, targets one-hot), computing all three tones per sample (still O(1)), or at minimum duck gain to 0 through the gain smoother before applying a changed mode and restore after.

M2. Denormals in smoothing. `smooth.rs:14-16`, used for `gain` and `w[0..3]` at `engine.rs:124-127`. `y + a*(t-y)` toward target 0 decays geometrically below `f32::MIN_POSITIVE` and then stalls in the subnormal range (a is about 1e-4 to 4e-4, so it never snaps to 0). Measured: 2,350,971 subnormal output samples in 53 s of silence after stop; 9,020 in the random sweep. Subnormal math is slow on some x86 hosts and wasm engines, and it feeds subnormals to the Web Audio graph. Fix in `step`:
```rust
pub fn step(y: f32, target: f32, a: f32) -> f32 {
    let d = target - y;
    if d.abs() < 1e-9 { target } else { y + a * d }
}
```
(1e-9 is far below audibility; also guarantees gain reaches exactly 0 or 0.85.) Optionally flush the final `limit` result with `if o.abs() < 1e-30 { 0.0 }`.

M3. Core does not enforce the minimum ramps. `params.rs:8` `RAMP_MIN = 0.05`, `engine.rs:99-101`. Section 2 requires a start ramp of at least 2 s and stop ramps of at least 250 ms, and says the core must be correct alone. The core accepts a 50 ms ramp (gain time constant 50 ms; with a one-pole, 2 s is about 5 time constants only if tau is about 0.4 s). Initial gain is 0 so a fresh engine ramps from silence, but a host can request a 50 ms start. Fix: raise `RAMP_MIN` to 0.25 for stop semantics and add a separate start constraint (for example when gain target rises from 0, enforce tau >= 0.4 s), or document that these ramps are a worklet-layer duty and add a test that the worklet enforces them. Decision needed from the maintainers on where the guarantee lives.

### Low

L1. `lib.rs:17-18` `extern crate std` on non-wasm targets. Standard says no `std`. Host-only (tests, clippy, native cdylib); wasm32 build is freestanding and passes. Fix: gate with `#[cfg(test)]` and drop it for the native cdylib, or note the exception in the standards file.

L2. Lint set is incomplete. `lib.rs:8-13` does not deny `clippy::arithmetic_side_effects`, and `#![allow(unsafe_code)]` at `abi.rs:2` has no matching `#![deny(unsafe_code)]` in `lib.rs`, so the allow is a no-op and new unsafe elsewhere would not be flagged. Fix: add `unsafe_code` and `clippy::arithmetic_side_effects` to the deny list (integer arithmetic currently uses only `wrapping_*`, shifts and rotates, so it should pass; float math is not covered by that lint). Verify with clippy after adding.

L3. Phase increment computed per sample, not per parameter update. `engine.rs:130-133`. Standard says once per update. Four `f64` multiplies per sample are required because carrier and beat are smoothed per sample, so the code is correct for the smoothing rule; the standard text conflicts. Fix: amend the standard, no code change.

L4. Carrier 20 with beat above 39 loses the beat. `engine.rs:128-129` clamps `f_l` to 0.5 Hz, so at carrier 20, beat 40 the left tone is 0.5 Hz and the true beat is 39.5 Hz. Also sub-1 Hz tones are inaudible. Allowed ranges make this reachable. Fix: document, or clamp beat to `2*(carrier-0.5)` when computing `f_l`/`f_r`.

L5. Sample-rate handling. `engine.rs:45` clamps sr to 8k..192k; a 384 kHz AudioContext would play at the wrong pitch. `f_max = 0.45*sr` (`engine.rs:120`) is above 1520 Hz at all supported rates, so carrier plus beat/2 never nears Nyquist (checked at 8 kHz: max 1520 vs 3600). No action unless 384 kHz must be supported.

L6. Pointer provenance in `abi.rs:51-58`. `zk_out_left/right` return pointers derived from a temporary `&'static mut Engine`; a later `engine()` call formally invalidates them under Stacked Borrows. Harmless in practice (JS reads through wasm memory, the engine lives in a static and never moves, `zk_init` assigns in place). Fix: derive raw pointers without creating a reference, for example `addr_of_mut!` on the UnsafeCell contents, and keep `engine()` private (it is).

L7. `abi.rs:39-43` reads the param block with a non-atomic copy. If wasm memory is shared (COEP is set, so threads are possible), a concurrent JS write is a benign data race on aligned f32 (no torn values). Values are sanitized after the copy, so no safety impact.

L8. Xoshiro seed. `noise.rs:19-29`: seeds are fixed constants expanded by SplitMix64, so the all-zero state cannot occur for the two used seeds. `Xoshiro256::new(0 or other)` is also safe in practice since SplitMix64 of consecutive states is a bijection and four consecutive zeros are not possible, but there is no explicit guard. Optional fix: `if s == [0;4] { s[0] = 1; }`.

### Verified OK

- `#![no_std]` (`lib.rs:7`); no alloc, `Vec`, `Box`, `String`, no libm (own polynomial sine).
- No `unwrap`, `expect`, `panic!`, indexing: out buffers use `get_mut` (`engine.rs:151,154`); `indexing_slicing` and the panic lints are denied.
- No input-bounded loops: only `for i in 0..n` with `n <= 128` (`params.rs:41-43`, `engine.rs:121`) and a fixed 3-element zip. Cost per sample is constant. No recursion.
- Integer overflow: phase uses `wrapping_add`; `as u64` and `as u8` casts saturate; no other integer arithmetic. Stress ran with overflow-checks on in both profiles without panic.
- Clamps: carrier 20-1500, beat 0.5-40, gain 0-0.85, level 0-1, ramp 0.05-30 (`params.rs:3-10`, `engine.rs:93-100`). Limiter at 0.95 (`limiter.rs`); NaN maps to 0, +-inf clamps; output bounded even if `gain` and sum are extreme.
- NaN and inf: every f32 slot in the param block goes through `sanitize` or an `is_finite` check (`engine.rs:92-101`); non-finite keeps the previous value. Sample rate sanitized (`engine.rs:45`). Frame count is `u32` and clamped to 1..=128. Internal state cannot become non-finite because targets are finite and `a` is in (0, 0.5].
- Phase is `u64` (`engine.rs:20-23`). Phase continuity across frequency steps is by construction and tested.
- Smoothing coefficient is bounded (`smooth.rs:8`, x in [1e-9, 0.5]).
- Unsafe count: 5 sites, all in `abi.rs`: `unsafe impl Sync` (line 13), blocks at lines 23, 30, 41, plus `#[no_mangle]` exports. Each has a SAFETY comment; justified by single-threaded audio worklet use. No `static mut`; state is in `UnsafeCell` statics. The host-side tests share the global from one test only (`c_abi_roundtrip`), so no test-thread race today.
- Required tests exist: phase continuity, frequency accuracy, noise slope, clamping, NaN and inf, limiter bound.
- wasm32 release build succeeds with `panic = "abort"` and the trapping handler (`lib.rs:29-33`).

## Exact fix list (priority order)

1. `smooth.rs:14`: snap-to-target in `step` (M2).
2. `engine.rs:134`: crossfade modes or duck through the gain smoother on mode change (M1).
3. `params.rs:8` and `engine.rs:99`: decide and enforce ramp minimums in the core (M3).
4. `lib.rs:8`: add `unsafe_code` and `clippy::arithmetic_side_effects` to the deny list (L2).
5. `lib.rs:17`: restrict `extern crate std` to tests (L1).
6. Add tests: mode-switch continuity, no subnormal output after 60 s of silence, seed state non-zero.

Stress harness lived outside the repo (not committed).

## Resolution

- M1 fixed: smoothed one-hot mode weights (tau 30 ms), all three tones per sample. Test `mode_switch_crossfades_without_click` (first-sample jump < 0.05, max step < 0.06).
- M2 fixed: `step` snaps within 1e-9, outputs below 1e-30 flushed. Test `no_subnormal_output_after_60s_of_silence`.
- M3 fixed in the core: gain tau >= 0.4 s when rising, >= 0.1 s when falling. Tests `start_ramp_takes_at_least_two_seconds`, `stop_ramp_takes_at_least_250ms`.
- L1 deferred: gating `extern crate std` to tests breaks the native cdylib build (no panic handler). Kept, noted in lib.rs.
- L2 fixed: `unsafe_code` and `clippy::arithmetic_side_effects` denied, clippy clean; `abi.rs` keeps the scoped allow.
- L3, L4, L5, L7 deferred (documentation or standards amendment, no code change).
- L6 deferred: the engine lives in `Option<Engine>`, so any raw projection still needs a transient `&mut Engine`; fixing needs restructuring the static.
- L8 fixed: all-zero state replaced with a valid one. Test `noise_seed_state_is_nonzero`.
