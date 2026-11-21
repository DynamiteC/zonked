//! `u64` phase accumulators (one full turn is 2^64) and a libm-free sine.

const C1: f32 = 1.570_791_4;
const C3: f32 = -0.645_893_1;
const C5: f32 = 0.079_431_01;
const C7: f32 = -0.004_329_256;
const INV_2_30: f32 = 1.0 / 1_073_741_824.0;
/// Quarter turn in phase units.
pub const QUARTER: u64 = 1 << 62;

/// Sine of a phase given in turns scaled to 2^64. Max error about 1e-6.
///
/// Quarter-wave symmetry from the top two bits, then an odd 7th order
/// polynomial for `sin(pi/2 * x)` on `[0, 1]`.
#[inline]
pub fn sin_turn(phase: u64) -> f32 {
    let p = (phase >> 32) as u32;
    let quadrant = p >> 30;
    let mut x = (p & 0x3FFF_FFFF) as f32 * INV_2_30;
    if quadrant & 1 == 1 {
        x = 1.0 - x;
    }
    let z = x * x;
    let s = x * (C1 + z * (C3 + z * (C5 + z * C7)));
    if quadrant & 2 == 2 {
        -s
    } else {
        s
    }
}

/// Cosine via a quarter-turn offset.
#[inline]
pub fn cos_turn(phase: u64) -> f32 {
    sin_turn(phase.wrapping_add(QUARTER))
}

/// Phase increment per sample for `hz` given `k = 2^64 / sample_rate`.
/// `as u64` saturates, so any input is safe.
#[inline]
pub fn increment(hz: f32, k: f64) -> u64 {
    (hz as f64 * k) as u64
}

#[cfg(test)]
mod tests {
    extern crate std;
    use super::*;

    #[test]
    fn sine_error_below_1e4() {
        let mut worst = 0.0f64;
        for i in 0..100_000u64 {
            let phase = i.wrapping_mul(184_467_440_737_095);
            let t = phase as f64 / 18_446_744_073_709_551_616.0;
            let r = (t * core::f64::consts::TAU).sin();
            worst = worst.max((sin_turn(phase) as f64 - r).abs());
        }
        assert!(worst < 1e-4, "worst {worst}");
    }

    #[test]
    fn cosine_matches() {
        let phase = 1u64 << 61;
        assert!((cos_turn(phase) - core::f32::consts::FRAC_1_SQRT_2).abs() < 1e-4);
    }
}
