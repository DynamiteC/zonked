//! Soft piano voice (instrument kind 3): additive partials with slight inharmonic stretch,
//! hammer noise, per-partial decay, gentle melodic motifs and a sustain pedal wash.
//!
//! Four voices, six partials each. Everything has a fixed cost per sample.

use super::util::{abs, at, decay, flush, Rng};
use crate::phase::{increment, sin_turn};
use crate::smooth::coefficient;

const VOICES: usize = 4;
const PARTIALS: usize = 6;
/// Inharmonicity coefficient B: f_n = n * f0 * (1 + B n^2 / 2).
const STRETCH: f32 = 0.0004;
const AMPS: [f32; PARTIALS] = [0.55, 0.30, 0.18, 0.10, 0.06, 0.04];
const TAUS: [f32; PARTIALS] = [3.2, 2.2, 1.5, 1.0, 0.7, 0.5];
const COMB_A: usize = 1499;
const COMB_B: usize = 1801;
const COMB_LINE: usize = 2048;

#[derive(Clone, Copy)]
struct Voice {
    ph: [u64; PARTIALS],
    inc: [u64; PARTIALS],
    e: [f32; PARTIALS],
    /// Soft attack ramp 0..1 (about 4 ms), avoids a click at the note onset.
    att: f32,
    hammer: f32,
}

impl Voice {
    const fn new() -> Self {
        Self { ph: [0; PARTIALS], inc: [0; PARTIALS], e: [0.0; PARTIALS], att: 1.0, hammer: 0.0 }
    }
}

pub struct Piano {
    sr: f32,
    k: f64,
    voices: [Voice; VOICES],
    d: [f32; PARTIALS],
    a_att: f32,
    d_hammer: f32,
    rng: Rng,
    /// Scale degree walk, 3-note motif memory.
    deg: usize,
    motif: [usize; 3],
    pos: usize,
    replay: bool,
    hlp: f32,
    comb_a: [f32; COMB_LINE],
    comb_b: [f32; COMB_LINE],
    w: usize,
    damp: f32,
    pedal_ph: u64,
    pedal_inc: u64,
}

impl Piano {
    pub fn new(sr: f32, k: f64) -> Self {
        let mut d = [0.0; PARTIALS];
        for (i, s) in d.iter_mut().enumerate() {
            *s = decay(at(&TAUS, i), sr);
        }
        Self {
            sr,
            k,
            voices: [Voice::new(); VOICES],
            d,
            a_att: coefficient(0.004, sr),
            d_hammer: decay(0.008, sr),
            rng: Rng::new(0x5049_414E_0000_0001),
            deg: 3,
            motif: [0, 2, 1],
            pos: 0,
            replay: false,
            hlp: 0.0,
            comb_a: [0.0; COMB_LINE],
            comb_b: [0.0; COMB_LINE],
            w: 0,
            damp: 0.0,
            pedal_ph: 0,
            pedal_inc: increment(0.07, k),
        }
    }

    /// Next scale degree (0..=7): rests are signalled by `None`.
    pub fn next_degree(&mut self) -> Option<usize> {
        if self.pos == 0 {
            self.replay = self.rng.unit() < 0.5;
        }
        let slot = self.pos;
        self.pos = self.pos.wrapping_add(1) % 3;
        if self.replay {
            if let Some(d) = self.motif.get(slot) {
                self.deg = *d;
                return Some(*d);
            }
        }
        let r = self.rng.unit();
        if r < 0.15 {
            return None;
        }
        let up = self.rng.unit() < 0.5;
        let mag = if r < 0.60 { 1 } else if r < 0.85 { 2 } else { 4 };
        self.deg = if up { self.deg.saturating_add(mag).min(7) } else { self.deg.saturating_sub(mag) };
        if let Some(m) = self.motif.get_mut(slot) {
            *m = self.deg;
        }
        Some(self.deg)
    }

    /// Start a note at `hz` with velocity 0.5..1. Steals the quietest voice.
    pub fn trigger(&mut self, hz: f32) {
        let vel = 0.5 + 0.5 * self.rng.unit();
        let mut idx = 0;
        let mut quiet = f32::MAX;
        for (i, v) in self.voices.iter().enumerate() {
            let level = v.e.iter().fold(0.0, |a, x| a + *x);
            if level < quiet {
                quiet = level;
                idx = i;
            }
        }
        let limit = self.sr * 0.45;
        if let Some(v) = self.voices.get_mut(idx) {
            for n in 0..PARTIALS {
                let h = (n.wrapping_add(1)) as f32;
                let f = hz * h * (1.0 + STRETCH * h * h * 0.5);
                let ok = f < limit;
                if let (Some(inc), Some(e)) = (v.inc.get_mut(n), v.e.get_mut(n)) {
                    *inc = if ok { increment(f, self.k) } else { 0 };
                    *e = if ok { vel * at(&AMPS, n) } else { 0.0 };
                }
            }
            v.att = 0.0;
            v.hammer = 0.12 * vel;
        }
    }

    /// One mono sample in `[-1, 1]`. `pedal` 0..1 is the wash amount.
    pub fn process(&mut self, pedal: f32) -> f32 {
        let noise = self.rng.bipolar();
        self.hlp += 0.35 * (noise - self.hlp);
        let mut dry = 0.0;
        for v in self.voices.iter_mut() {
            v.att += self.a_att * (1.0 - v.att);
            v.hammer = flush(v.hammer * self.d_hammer);
            let mut s = 0.0;
            for n in 0..PARTIALS {
                if let (Some(p), Some(i), Some(e)) = (v.ph.get_mut(n), v.inc.get(n), v.e.get_mut(n)) {
                    *p = p.wrapping_add(*i);
                    *e = flush(*e * at(&self.d, n));
                    s += *e * sin_turn(*p);
                }
            }
            dry += v.att * s + v.hammer * self.hlp;
        }
        // Sustain wash: two damped combs, amount follows the pedal slot, slowly swelling.
        self.pedal_ph = self.pedal_ph.wrapping_add(self.pedal_inc);
        let swell = 0.65 + 0.35 * sin_turn(self.pedal_ph);
        let wash = pedal * swell;
        let ra = self.w.wrapping_sub(COMB_A) & (COMB_LINE - 1);
        let rb = self.w.wrapping_sub(COMB_B) & (COMB_LINE - 1);
        let ya = self.comb_a.get(ra).copied().unwrap_or(0.0);
        let yb = self.comb_b.get(rb).copied().unwrap_or(0.0);
        let wet = 0.5 * (ya + yb);
        self.damp = flush(self.damp + 0.4 * (wet - self.damp));
        let fb = 0.78 * wash;
        if let Some(c) = self.comb_a.get_mut(self.w) {
            *c = flush(dry + fb * self.damp);
        }
        if let Some(c) = self.comb_b.get_mut(self.w) {
            *c = flush(dry * 0.8 + fb * self.damp);
        }
        self.w = self.w.wrapping_add(1) & (COMB_LINE - 1);
        let out = dry + 0.9 * wash * self.damp;
        if abs(out) > 1.0 {
            out.clamp(-1.0, 1.0)
        } else {
            out
        }
    }
}
