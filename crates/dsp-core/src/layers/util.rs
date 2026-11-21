//! Shared helpers for the layer synthesizers: tables, PRNG wrapper, filters.

use crate::noise::Xoshiro256;
use crate::smooth::coefficient;

/// `2^(i/12)` for `i` in `0..=24` (fixed table, no libm).
#[allow(clippy::excessive_precision, clippy::approx_constant)]
const SEMI: [f32; 25] = [
    1.0, 1.0594631, 1.122462, 1.1892071, 1.25992105, 1.33483985,
    1.41421356, 1.4983071, 1.587401, 1.6817928, 1.7817974, 1.8877486,
    2.0, 2.1189262, 2.244924, 2.3784142, 2.5198421, 2.6696797,
    2.828427, 2.9966142, 3.174802, 3.3635857, 3.5635949, 3.7754973,
    4.0,
];

/// Frequency ratio for a semitone offset, clamped to 0..=24.
#[inline]
pub fn semi_ratio(semis: u8) -> f32 {
    SEMI.get(semis as usize).copied().unwrap_or(4.0)
}

/// Bounds-checked read that never panics.
#[inline]
pub fn at<const N: usize>(a: &[f32; N], i: usize) -> f32 {
    a.get(i).copied().unwrap_or(0.0)
}

/// Seeded deterministic random stream.
pub struct Rng(Xoshiro256);

impl Rng {
    pub fn new(seed: u64) -> Self {
        Self(Xoshiro256::new(seed))
    }
    /// Uniform in `[0, 1)`.
    #[inline]
    pub fn unit(&mut self) -> f32 {
        ((self.0.next_u64() >> 40) as f32) * (1.0 / 16_777_216.0)
    }
    #[inline]
    pub fn bipolar(&mut self) -> f32 {
        self.0.next_bipolar()
    }
    /// Uniform index in `0..8`.
    #[inline]
    pub fn index8(&mut self) -> usize {
        (self.0.next_u64() >> 61) as usize
    }
}

/// Per-sample decay multiplier for a time constant `tau` at rate `rate`.
#[inline]
pub fn decay(tau: f32, rate: f32) -> f32 {
    1.0 - coefficient(tau, rate)
}

/// One-pole low-pass coefficient for cutoff `fc` Hz.
#[inline]
pub fn lp_coef(fc: f32, sr: f32) -> f32 {
    let x = (core::f32::consts::TAU * fc / sr).clamp(1e-5, 2.0);
    x / (1.0 + x)
}

/// Flush tiny values to exact zero (no subnormals in decaying states).
#[inline]
pub fn flush(x: f32) -> f32 {
    if x < 1e-20 && x > -1e-20 {
        0.0
    } else {
        x
    }
}

/// Absolute value without std.
#[inline]
pub fn abs(x: f32) -> f32 {
    f32::from_bits(x.to_bits() & 0x7FFF_FFFF)
}

/// Soft tape curve, bounded to +-1.
#[inline]
pub fn tape(x: f32) -> f32 {
    let c = x.clamp(-1.0, 1.0);
    c * (1.5 - 0.5 * c * c)
}

/// Convert radians to u64 phase units (2^64 per turn). `rad` must be within +-3.1.
#[inline]
pub fn rad_units(rad: f32) -> u64 {
    (rad as f64 * 2.936_497_209_342_6e18) as i64 as u64
}

/// Exponential envelope with a soft (few ms) attack.
#[derive(Clone, Copy)]
pub struct Env {
    pub v: f32,
    attacking: bool,
}

impl Env {
    pub const fn new() -> Self {
        Self { v: 0.0, attacking: false }
    }
    pub fn trigger(&mut self) {
        self.attacking = true;
    }
    /// Silence the envelope immediately.
    pub fn kill(&mut self) {
        self.v = 0.0;
        self.attacking = false;
    }
    /// Advance one sample. `a_att` is the attack coefficient, `d` the decay multiplier.
    #[inline]
    pub fn tick(&mut self, a_att: f32, d: f32) -> f32 {
        if self.attacking {
            self.v += a_att * (1.0 - self.v);
            if self.v > 0.98 {
                self.attacking = false;
            }
        } else {
            self.v = flush(self.v * d);
        }
        self.v
    }
}

impl Default for Env {
    fn default() -> Self {
        Self::new()
    }
}

/// Countdown scheduler in samples (f64 so tempo drift is negligible).
pub struct Clock {
    left: f64,
}

impl Clock {
    pub const fn new() -> Self {
        Self { left: 1.0 }
    }
    /// Returns true on the sample an event fires; `next_len` is the new interval in samples.
    #[inline]
    pub fn tick(&mut self, next_len: f64) -> bool {
        self.tick_max(next_len, next_len)
    }
    /// Like `tick`, for jittered intervals: the pending wait is clamped to `max_len`
    /// (the longest interval the current settings allow), so a faster setting
    /// takes effect at once without biasing the jitter distribution.
    #[inline]
    pub fn tick_max(&mut self, next_len: f64, max_len: f64) -> bool {
        if self.left > max_len {
            self.left = max_len;
        }
        self.left -= 1.0;
        if self.left <= 0.0 {
            self.left += next_len;
            true
        } else {
            false
        }
    }
}

impl Default for Clock {
    fn default() -> Self {
        Self::new()
    }
}
