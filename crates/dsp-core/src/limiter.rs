//! Brickwall limiter with a soft knee. Output is always in [-0.95, 0.95].

use crate::params::{clamp, OUT_LIMIT};

const KNEE_START: f32 = 0.8;
const KNEE_WIDTH: f32 = OUT_LIMIT - KNEE_START;

/// Identity below 0.8, rational knee towards 0.95 above, hard clamp last.
/// NaN maps to 0.
#[inline]
pub fn limit(x: f32) -> f32 {
    if x.is_nan() {
        return 0.0;
    }
    let a = clamp(f32::from_bits(x.to_bits() & 0x7FFF_FFFF), 0.0, 16.0);
    let y = if a <= KNEE_START {
        a
    } else {
        let t = (a - KNEE_START) / KNEE_WIDTH;
        KNEE_START + KNEE_WIDTH * t / (1.0 + t)
    };
    let y = clamp(y, 0.0, OUT_LIMIT);
    if x < 0.0 {
        -y
    } else {
        y
    }
}
