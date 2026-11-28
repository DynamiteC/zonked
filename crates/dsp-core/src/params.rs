//! Safety bounds and input sanitizing.

pub const CARRIER_MIN: f32 = 20.0;
pub const CARRIER_MAX: f32 = 1500.0;
pub const BEAT_MIN: f32 = 0.5;
pub const BEAT_MAX: f32 = 40.0;
pub const GAIN_MAX: f32 = 0.85;
pub const RAMP_MIN: f32 = 0.05;
pub const RAMP_MAX: f32 = 30.0;
/// Minimum gain time constant while the gain target is above the gain
/// (start ramp: 5 tau = 2 s to reach 99 percent).
pub const GAIN_TAU_UP_MIN: f32 = 0.4;
/// Minimum gain time constant while the gain target is below the gain
/// (stop ramp: about 4.4 tau = 440 ms to fall 99 percent).
pub const GAIN_TAU_DOWN_MIN: f32 = 0.1;
/// Time constant of the mode crossfade weights.
pub const MODE_TAU: f32 = 0.03;
pub const OUT_LIMIT: f32 = 0.95;
/// Time constant of the beat voice level (slot 7): 1 to 0 takes about 90 ms, steps at most 1e-3 per sample at 48 kHz.
pub const BEAT_LEVEL_TAU: f32 = 0.02;
pub const MAX_FRAMES: usize = 128;

/// Clamp without ever panicking (bounds are constants, `lo <= hi`).
#[inline]
pub fn clamp(x: f32, lo: f32, hi: f32) -> f32 {
    x.max(lo).min(hi)
}

/// Return `new` clamped to `[lo, hi]` when finite, otherwise `prev`.
#[inline]
pub fn sanitize(new: f32, prev: f32, lo: f32, hi: f32) -> f32 {
    if new.is_finite() {
        clamp(new, lo, hi)
    } else {
        prev
    }
}

/// Sanitize a small enumeration value sent as a float (rounded, clamped).
#[inline]
pub fn sanitize_enum(new: f32, prev: u8, max: u8) -> u8 {
    if new.is_finite() {
        (clamp(new, 0.0, max as f32) + 0.5) as u8
    } else {
        prev
    }
}

/// Clamp the requested frame count to `1..=128`.
#[inline]
pub fn clamp_frames(frames: u32) -> usize {
    (frames as usize).clamp(1, MAX_FRAMES)
}
