//! Slow movement for the layer bus: breathing level envelopes, stereo width, auto-pan.
//!
//! Breathing only ever attenuates (gain in `[1 - depth, 1]`), pan gains are at most 1 and the
//! width mix is a convex blend of the bus and a delayed copy of the bus, so none of this can raise
//! the bus above what `soft()` already caps. With depth, width and pan at 0 every output equals
//! its input bit for bit.

use super::util::{at, Rng};
use crate::phase::{increment, sin_turn};
use crate::smooth::{coefficient, step};

/// Breathing channels: lofi, instrument, pad, chimes, percussion, noise bed.
pub const CHANNELS: usize = 6;
const LINE: usize = 1024;
const SPREAD: [f32; CHANNELS] = [0.7, 0.82, 0.94, 1.06, 1.18, 1.3];
/// Random-walk step and pull, tuned at 48 kHz and scaled by `48000 / sr`.
const RW_STEP: f32 = 6.0e-4;
const RW_PULL: f32 = 1.0e-6;

pub struct Motion {
    k: f64,
    scale: f32,
    ph: [u64; CHANNELS],
    master: u64,
    rw: [f32; CHANNELS],
    rng: Rng,
    depth: f32,
    width: f32,
    pan_depth: f32,
    pan_ph: u64,
    a: f32,
    line: [f32; LINE],
    w: usize,
    delay: usize,
}

impl Motion {
    pub fn new(sr: f32, k: f64) -> Self {
        let delay = ((sr * 0.006) as usize).clamp(1, LINE - 24);
        Self {
            k,
            scale: 48_000.0 / sr,
            master: 0,
            ph: [0, 1 << 61, 1 << 62, 3 << 61, 1 << 63, 5 << 61],
            rw: [0.5; CHANNELS],
            rng: Rng::new(0x4D4F_5449_0000_0001),
            depth: 0.0,
            width: 0.0,
            pan_depth: 0.0,
            pan_ph: 0,
            a: coefficient(0.5, sr),
            line: [0.0; LINE],
            w: 0,
            delay,
        }
    }

    /// Advance the breathing state one sample and write per-channel gains in `[1 - depth, 1]`.
    pub fn breath(&mut self, depth_t: f32, rate_hz: f32, out: &mut [f32; CHANNELS]) {
        self.depth = step(self.depth, depth_t, self.a);
        let pull = RW_PULL * self.scale;
        let amp = RW_STEP * self.scale;
        self.master = self.master.wrapping_add(increment(rate_hz, self.k));
        let shared = 0.5 + 0.5 * sin_turn(self.master);
        for (i, o) in out.iter_mut().enumerate() {
            if let (Some(ph), Some(rw)) = (self.ph.get_mut(i), self.rw.get_mut(i)) {
                *ph = ph.wrapping_add(increment(rate_hz * at(&SPREAD, i), self.k));
                *rw += amp * self.rng.bipolar() + pull * (0.5 - *rw);
                *rw = rw.clamp(0.0, 1.0);
                let lfo = 0.5 + 0.5 * sin_turn(*ph);
                *o = 1.0 - self.depth * (0.75 * shared + 0.25 * (0.5 * lfo + 0.5 * *rw));
            }
        }
    }

    /// Stereo bus from a mono bus: auto-pan gains then a Haas width blend on the right.
    pub fn stereo(&mut self, bus: f32, width_t: f32, pan_t: f32, pan_rate: f32) -> (f32, f32) {
        self.width = step(self.width, width_t, self.a);
        self.pan_depth = step(self.pan_depth, pan_t, self.a);
        self.pan_ph = self.pan_ph.wrapping_add(increment(pan_rate, self.k));
        if let Some(s) = self.line.get_mut(self.w) {
            *s = bus;
        }
        let back = self.w.wrapping_sub(self.delay) & (LINE - 1);
        let late = self.line.get(back).copied().unwrap_or(0.0);
        self.w = self.w.wrapping_add(1) & (LINE - 1);
        let right = bus * (1.0 - self.width) + late * self.width;
        let p = sin_turn(self.pan_ph);
        let gl = 1.0 - self.pan_depth * p.max(0.0);
        let gr = 1.0 - self.pan_depth * (-p).max(0.0);
        (bus * gl, right * gr)
    }
}
