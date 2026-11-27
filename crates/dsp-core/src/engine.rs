//! Frame renderer: oscillators, noise bed, smoothing, limiter.

use crate::layers::util::abs;
use crate::layers::Layers;
use crate::limiter::limit;
use crate::noise::NoiseGen;
use crate::params::*;
use crate::phase::{cos_turn, increment, sin_turn};
use crate::smooth::{coefficient, step};

const TWO_POW_64: f64 = 18_446_744_073_709_551_616.0;
const SEED_L: u64 = 0x5A4F_4E4B_4544_0001;
const SEED_R: u64 = 0x5A4F_4E4B_4544_0002;
const DEFAULT_SR: f32 = 48_000.0;

/// Number of f32 slots in the parameter block.
pub const PARAM_SLOTS: usize = 32;

pub struct Engine {
    sr: f32,
    k: f64,
    ph_l: u64,
    ph_r: u64,
    ph_c: u64,
    ph_b: u64,
    carrier: f32,
    beat: f32,
    gain: f32,
    w: [f32; 4],
    t_carrier: f32,
    t_beat: f32,
    t_gain: f32,
    t_level: f32,
    /// Binaural voice level (slot 7), smoothed: 1 = full beat voice, 0 = none.
    beat_level: f32,
    t_beat_level: f32,
    a_beat_level: f32,
    mode: u8,
    kind: u8,
    a_freq: f32,
    a_gain_up: f32,
    a_gain_down: f32,
    a_mode: f32,
    mode_w: [f32; 3],
    a_noise: f32,
    noise_l: NoiseGen,
    noise_r: NoiseGen,
    layers: Layers,
    /// Largest absolute pre-limiter sample since the last `take_peak`.
    peak_pre: f32,
    pub out_l: [f32; MAX_FRAMES],
    pub out_r: [f32; MAX_FRAMES],
}

impl Engine {
    pub fn new(sample_rate: f32) -> Self {
        let sr = sanitize(sample_rate, DEFAULT_SR, 8_000.0, 192_000.0);
        let mut e = Self {
            sr,
            k: TWO_POW_64 / sr as f64,
            ph_l: 0,
            ph_r: 0,
            ph_c: 0,
            ph_b: 0,
            carrier: 200.0,
            beat: 10.0,
            gain: 0.0,
            w: [0.0; 4],
            t_carrier: 200.0,
            t_beat: 10.0,
            t_gain: 0.0,
            t_level: 0.0,
            beat_level: 1.0,
            t_beat_level: 1.0,
            a_beat_level: 0.0,
            mode: 0,
            kind: 0,
            a_freq: 0.0,
            a_gain_up: 0.0,
            a_gain_down: 0.0,
            a_mode: 0.0,
            mode_w: [1.0, 0.0, 0.0],
            a_noise: 0.0,
            noise_l: NoiseGen::new(SEED_L),
            noise_r: NoiseGen::new(SEED_R),
            layers: Layers::new(sr, TWO_POW_64 / sr as f64),
            peak_pre: 0.0,
            out_l: [0.0; MAX_FRAMES],
            out_r: [0.0; MAX_FRAMES],
        };
        e.set_ramp(RAMP_MIN);
        e
    }

    /// Smoothing time constants: noise = ramp, frequency = 2 * ramp, gain =
    /// ramp but never below 0.4 s when rising or 0.1 s when falling, so the
    /// core alone guarantees a >= 2 s start and >= 250 ms stop ramp.
    fn set_ramp(&mut self, ramp: f32) {
        self.a_gain_up = coefficient(ramp.max(GAIN_TAU_UP_MIN), self.sr);
        self.a_gain_down = coefficient(ramp.max(GAIN_TAU_DOWN_MIN), self.sr);
        self.a_mode = coefficient(MODE_TAU, self.sr);
        self.a_noise = coefficient(ramp, self.sr);
        self.a_freq = coefficient(ramp * 2.0, self.sr);
        self.a_beat_level = coefficient(BEAT_LEVEL_TAU, self.sr);
    }

    pub fn reset_phase(&mut self) {
        self.ph_l = 0;
        self.ph_r = 0;
        self.ph_c = 0;
        self.ph_b = 0;
    }

    /// Read a parameter block (any length, up to 32 slots). Missing or
    /// non-finite entries keep the previous value; slot 7 is the beat voice level (default 1.0); slots 8..=31 drive the layers.
    pub fn apply_params(&mut self, p: &[f32]) {
        let g = |i: usize| p.get(i).copied().unwrap_or(f32::NAN);
        let (carrier, beat, gain, mode) = (g(0), g(1), g(2), g(3));
        let (kind, level, ramp, beat_level) = (g(4), g(5), g(6), g(7));
        self.layers.apply(p);
        self.t_carrier = sanitize(carrier, self.t_carrier, CARRIER_MIN, CARRIER_MAX);
        self.t_beat = sanitize(beat, self.t_beat, BEAT_MIN, BEAT_MAX);
        self.t_gain = sanitize(gain, self.t_gain, 0.0, GAIN_MAX);
        self.mode = sanitize_enum(mode, self.mode, 2);
        self.kind = sanitize_enum(kind, self.kind, 4);
        self.t_level = sanitize(level, self.t_level, 0.0, 1.0);
        self.t_beat_level = sanitize(beat_level, self.t_beat_level, 0.0, 1.0);
        if ramp.is_finite() {
            self.set_ramp(clamp(ramp, RAMP_MIN, RAMP_MAX));
        }
    }

    #[inline]
    fn noise_targets(&self) -> [f32; 4] {
        let l = self.t_level;
        match self.kind {
            1 => [l, 0.0, 0.0, 0.0],
            2 => [0.0, l, 0.0, 0.0],
            3 => [0.0, 0.0, l, 0.0],
            // Violet is bright: its effective level is capped at half the slider.
            4 => [0.0, 0.0, 0.0, l * 0.5],
            _ => [0.0; 4],
        }
    }

    /// Scheduled layer events so far: instrument notes, chime strikes, percussion hits.
    pub fn event_counts(&self) -> [u32; 3] {
        self.layers.event_counts()
    }

    /// Subnormal values left in layer state (diagnostics and tests).
    pub fn subnormal_count(&self) -> usize {
        self.layers.subnormal_count()
    }

    /// Return and reset the largest pre-limiter magnitude (diagnostics and tests).
    pub fn take_peak(&mut self) -> f32 {
        core::mem::replace(&mut self.peak_pre, 0.0)
    }

    /// Render `frames` samples (clamped to 1..=128) into `out_l` / `out_r`.
    /// Cost per sample is constant, independent of any parameter value.
    pub fn render(&mut self, frames: u32) {
        let n = clamp_frames(frames);
        let targets = self.noise_targets();
        let f_max = self.sr * 0.45;
        for i in 0..n {
            self.carrier = step(self.carrier, self.t_carrier, self.a_freq);
            self.beat = step(self.beat, self.t_beat, self.a_freq);
            let a_g = if self.t_gain > self.gain {
                self.a_gain_up
            } else {
                self.a_gain_down
            };
            self.gain = step(self.gain, self.t_gain, a_g);
            let one_hot = match self.mode {
                1 => [0.0, 1.0, 0.0],
                2 => [0.0, 0.0, 1.0],
                _ => [1.0, 0.0, 0.0],
            };
            for (w, t) in self.mode_w.iter_mut().zip(one_hot) {
                *w = step(*w, t, self.a_mode);
            }
            for (w, t) in self.w.iter_mut().zip(targets) {
                *w = step(*w, t, self.a_noise);
            }
            let f_l = clamp(self.carrier - self.beat * 0.5, 0.5, f_max);
            let f_r = clamp(self.carrier + self.beat * 0.5, 0.5, f_max);
            self.ph_l = self.ph_l.wrapping_add(increment(f_l, self.k));
            self.ph_r = self.ph_r.wrapping_add(increment(f_r, self.k));
            self.ph_c = self.ph_c.wrapping_add(increment(self.carrier, self.k));
            self.ph_b = self.ph_b.wrapping_add(increment(self.beat, self.k));
            // All three tones every sample, mixed by smoothed one-hot weights.
            let (sl, sr) = (sin_turn(self.ph_l), sin_turn(self.ph_r));
            let mono = 0.5 * (sl + sr);
            // Raised cosine gate: 0.5 * (1 - cos(2 pi beat t)).
            let gate = 0.5 - 0.5 * cos_turn(self.ph_b);
            let iso = sin_turn(self.ph_c) * gate;
            self.beat_level = step(self.beat_level, self.t_beat_level, self.a_beat_level);
            let [wb, wm, wi] = self.mode_w;
            let bl = self.beat_level;
            let tone_l = (sl * wb + mono * wm + iso * wi) * bl;
            let tone_r = (sr * wb + mono * wm + iso * wi) * bl;
            let nl = self.noise_l.sample();
            let nr = self.noise_r.sample();
            let bed_l = nl.white * self.w[0] + nl.pink * self.w[1] + nl.brown * self.w[2] + nl.violet * self.w[3];
            let bed_r = nr.white * self.w[0] + nr.pink * self.w[1] + nr.brown * self.w[2] + nr.violet * self.w[3];
            let o = self.layers.sample();
            let pre_l = ((tone_l + bed_l * o.bed) * o.ts + o.left) * self.gain;
            let pre_r = ((tone_r + bed_r * o.bed) * o.ts + o.right) * self.gain;
            self.peak_pre = self.peak_pre.max(abs(pre_l)).max(abs(pre_r));
            if let Some(o) = self.out_l.get_mut(i) {
                *o = flush(limit(pre_l));
            }
            if let Some(o) = self.out_r.get_mut(i) {
                *o = flush(limit(pre_r));
            }
        }
    }
}

/// Flush tiny values to zero so no subnormals reach the host.
#[inline]
fn flush(x: f32) -> f32 {
    if x < 1e-30 && x > -1e-30 {
        0.0
    } else {
        x
    }
}
