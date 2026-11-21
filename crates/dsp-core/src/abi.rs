//! Plain C ABI (contract C1). Single threaded: only the AudioWorklet calls it.
#![allow(unsafe_code)]

use crate::engine::{Engine, PARAM_SLOTS};
use core::cell::UnsafeCell;
use core::mem::MaybeUninit;

/// Engine storage. Kept in its own uninitialised static so the large delay
/// lines live in zero-filled memory and add nothing to the wasm data section.
struct EngineCell(UnsafeCell<MaybeUninit<Engine>>);
struct ParamCell(UnsafeCell<[f32; PARAM_SLOTS]>);
struct ReadyCell(UnsafeCell<bool>);

// SAFETY: wasm32 audio thread access only; no concurrent callers.
unsafe impl Sync for EngineCell {}
unsafe impl Sync for ParamCell {}
unsafe impl Sync for ReadyCell {}

static ENGINE: EngineCell = EngineCell(UnsafeCell::new(MaybeUninit::uninit()));
static READY: ReadyCell = ReadyCell(UnsafeCell::new(false));
static PARAMS: ParamCell = ParamCell(UnsafeCell::new({
    let mut p = [0.0; PARAM_SLOTS];
    p[0] = 200.0;
    p[1] = 10.0;
    p[6] = 0.05;
    p
}));

/// Get the engine, creating it at 48 kHz if `zk_init` was not called.
fn engine() -> &'static mut Engine {
    // SAFETY: single-threaded, no reentrancy, no outstanding references.
    // The engine is written before `ready` is set, and never dropped.
    unsafe {
        if !*READY.0.get() {
            install(Engine::new(48_000.0));
        }
        (*ENGINE.0.get()).assume_init_mut()
    }
}

/// SAFETY: caller guarantees single-threaded access.
unsafe fn install(e: Engine) {
    (*ENGINE.0.get()).write(e);
    *READY.0.get() = true;
}

#[no_mangle]
pub extern "C" fn zk_init(sample_rate: f32) {
    // SAFETY: see `engine`.
    unsafe { install(Engine::new(sample_rate)) };
}

#[no_mangle]
pub extern "C" fn zk_param_block() -> *mut f32 {
    PARAMS.0.get().cast::<f32>()
}

/// Number of f32 slots in the parameter block.
#[no_mangle]
pub extern "C" fn zk_param_count() -> u32 {
    PARAM_SLOTS as u32
}

#[no_mangle]
pub extern "C" fn zk_apply_params() {
    // SAFETY: copy out of the block; JS is not writing during the call.
    let block = unsafe { *PARAMS.0.get() };
    engine().apply_params(&block);
}

#[no_mangle]
pub extern "C" fn zk_render(frames: u32) {
    engine().render(frames);
}

#[no_mangle]
pub extern "C" fn zk_out_left() -> *const f32 {
    engine().out_l.as_ptr()
}

#[no_mangle]
pub extern "C" fn zk_out_right() -> *const f32 {
    engine().out_r.as_ptr()
}

#[no_mangle]
pub extern "C" fn zk_reset_phase() {
    engine().reset_phase();
}
