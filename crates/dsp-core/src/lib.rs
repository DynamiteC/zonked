//! Zonked DSP core: `no_std`, allocation free, panic free.
//!
//! Cost model: rendering a frame of N samples (1..=128) performs a fixed,
//! input-independent number of operations per sample, so a frame is O(1)
//! with respect to parameter values (the only loop is bounded by the
//! constant 128).
#![no_std]
#![deny(
    unsafe_code,
    clippy::unwrap_used,
    clippy::expect_used,
    clippy::panic,
    clippy::indexing_slicing,
    clippy::arithmetic_side_effects
)]

// Host builds (tests, clippy, native cdylib) link std only to supply the
// panic runtime. The code itself uses core only; wasm32 is truly freestanding.
// Gating this to cfg(test) breaks the native cdylib build (no panic handler),
// so it stays.
#[cfg(not(target_arch = "wasm32"))]
extern crate std;

pub mod abi;
pub mod engine;
pub mod layers;
pub mod limiter;
pub mod noise;
pub mod params;
pub mod phase;
pub mod smooth;

/// Trap instead of unwinding. Never expected to run: no code path panics.
#[cfg(target_arch = "wasm32")]
#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    core::arch::wasm32::unreachable()
}
