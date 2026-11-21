//! Percussion: pitched thump plus filtered-noise snare, 8 fixed 16-step patterns.

use super::util::{decay, flush, lp_coef, Clock, Env, Rng};
use crate::phase::{increment, sin_turn};
use crate::smooth::coefficient;

/// (thump amount, snare amount) per 16th step.
type Step = (f32, f32);
const R: Step = (0.0, 0.0);

const PATTERNS: [[Step; 16]; 8] = [
    // soft-pulse
    [(0.6, 0.0), R, R, R, (0.6, 0.0), R, R, R, (0.6, 0.0), R, R, R, (0.6, 0.0), R, R, R],
    // heartbeat
    [(0.8, 0.0), R, R, (0.5, 0.0), R, R, R, R, (0.8, 0.0), R, R, (0.5, 0.0), R, R, R, R],
    // backbeat
    [(0.8, 0.0), R, R, R, (0.0, 0.7), R, R, R, (0.8, 0.0), R, R, R, (0.0, 0.7), R, R, R],
    // brush-shuffle
    [(0.0, 0.25), R, (0.0, 0.2), R, (0.0, 0.5), R, (0.0, 0.2), R, (0.0, 0.25), R, (0.0, 0.2), R, (0.0, 0.5), R, (0.0, 0.2), R],
    // rim-click
    [(0.5, 0.0), R, R, (0.0, 0.4), R, R, R, (0.0, 0.4), R, R, R, (0.0, 0.4), R, R, R, (0.0, 0.4)],
    // sparse-snare
    [(0.6, 0.0), R, R, R, R, R, R, R, R, R, R, R, (0.0, 0.8), R, R, R],
    // double-time
    [(0.7, 0.0), R, (0.0, 0.3), R, (0.7, 0.0), R, (0.0, 0.5), R, (0.7, 0.0), R, (0.0, 0.3), R, (0.7, 0.0), R, (0.0, 0.5), R],
    // half-time
    [(0.8, 0.0), R, R, R, R, R, R, R, (0.0, 0.8), R, R, R, R, R, R, R],
];

pub struct Perc {
    sr: f32,
    k: f64,
    clock: Clock,
    rng: Rng,
    step: usize,
    kick_env: Env,
    kick_amp: f32,
    sweep: f32,
    kick_ph: u64,
    snare_env: Env,
    snare_amp: f32,
    body_ph: u64,
    lp: f32,
    hp: f32,
    a_att: f32,
    d_kick: f32,
    d_sweep: f32,
    d_snare: f32,
    a_hp: f32,
    a_lp: f32,
    pub events: u32,
}

impl Perc {
    pub fn new(sr: f32, k: f64) -> Self {
        Self {
            sr,
            k,
            clock: Clock::new(),
            rng: Rng::new(0x5045_5243_0000_0001),
            step: 0,
            kick_env: Env::new(),
            kick_amp: 0.0,
            sweep: 0.0,
            kick_ph: 0,
            snare_env: Env::new(),
            snare_amp: 0.0,
            body_ph: 0,
            lp: 0.0,
            hp: 0.0,
            a_att: coefficient(0.003, sr),
            d_kick: decay(0.12, sr),
            d_sweep: decay(0.025, sr),
            d_snare: decay(0.09, sr),
            a_hp: lp_coef(1_500.0, sr),
            a_lp: lp_coef(6_000.0, sr),
            events: 0,
        }
    }

    fn fire(&mut self, pattern: u8) {
        let row = PATTERNS.get(pattern as usize).copied().unwrap_or([R; 16]);
        let (kick, snare) = row.get(self.step & 15).copied().unwrap_or(R);
        self.step = self.step.wrapping_add(1) & 15;
        if kick > 0.0 {
            self.kick_amp = kick;
            self.sweep = 1.0;
            self.kick_env.trigger();
            self.events = self.events.wrapping_add(1);
        }
        if snare > 0.0 {
            self.snare_amp = snare;
            self.snare_env.trigger();
            self.events = self.events.wrapping_add(1);
        }
    }

    /// One mono sample in `[-1, 1]`.
    pub fn process(&mut self, bpm: f32, pattern: u8) -> f32 {
        let step_len = self.sr as f64 * 60.0 / bpm as f64 / 4.0;
        if self.clock.tick(step_len) {
            self.fire(pattern);
        }
        self.sweep = flush(self.sweep * self.d_sweep);
        self.kick_ph = self.kick_ph.wrapping_add(increment(52.0 + 90.0 * self.sweep, self.k));
        let kick = self.kick_env.tick(self.a_att, self.d_kick) * self.kick_amp * sin_turn(self.kick_ph);
        let n = self.rng.bipolar();
        self.lp += self.a_lp * (n - self.lp);
        self.hp += self.a_hp * (self.lp - self.hp);
        let band = self.lp - self.hp;
        self.body_ph = self.body_ph.wrapping_add(increment(185.0, self.k));
        let se = self.snare_env.tick(self.a_att, self.d_snare);
        let snare = se * self.snare_amp * (band * 1.6 + 0.4 * sin_turn(self.body_ph));
        (kick * 0.9 + snare * 0.8).clamp(-1.0, 1.0)
    }
}
