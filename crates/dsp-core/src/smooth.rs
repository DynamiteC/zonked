//! Per-sample one-pole smoothing: `y += a * (target - y)`.

/// Coefficient for time constant `tau` seconds at `sr` Hz.
///
/// `a = 1 - exp(-x)` with `x = 1 / (tau * sr)`, using a 4th order series
/// (x is clamped to 0.5, error well below 1e-3 relative).
pub fn coefficient(tau: f32, sr: f32) -> f32 {
    let x = (1.0 / (tau.max(1e-4) as f64 * sr as f64)).clamp(1e-9, 0.5);
    (x - x * x / 2.0 + x * x * x / 6.0 - x * x * x * x / 24.0) as f32
}

/// One smoothing step. Snaps to `target` within 1e-9 so decays never stall
/// in the subnormal range.
#[inline]
pub fn step(y: f32, target: f32, a: f32) -> f32 {
    let d = target - y;
    if d < 1e-9 && d > -1e-9 {
        target
    } else {
        y + a * d
    }
}
