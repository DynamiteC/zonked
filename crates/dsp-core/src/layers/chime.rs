//! Chimes: 6 inharmonic partials with exponential decay at random pentatonic pitches.

use super::util::{at, decay, semi_ratio, Clock, Env, Rng};
use crate::phase::{increment, sin_turn};
use crate::smooth::coefficient;

const RATIOS: [f32; 6] = [1.0, 2.76, 5.4, 8.93, 13.34, 18.64];
const AMPS: [f32; 6] = [0.40, 0.25, 0.16, 0.10, 0.07, 0.05];
const TAUS: [f32; 6] = [3.0, 2.2, 1.6, 1.1, 0.8, 0.5];
const PENTA: [u8; 10] = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const BASE_HZ: f32 = 392.0;
/// Scales the walk gap so the long-run strike rate matches the slider (tuned by test).
const GAP_NORM: f64 = 1.15;

pub struct Chime {
    sr: f32,
    k: f64,
    ph: [u64; 6],
    inc: [u64; 6],
    env: [Env; 6],
    d: [f32; 6],
    a_att: f32,
    clock: Clock,
    rng: Rng,
    /// Gap multiplier, a bounded geometric random walk (0.5..1.25 of the nominal gap).
    gap: f64,
    note: usize,
    pub events: u32,
}

impl Chime {
    pub fn new(sr: f32, k: f64) -> Self {
        let mut d = [0.0; 6];
        for (i, s) in d.iter_mut().enumerate() {
            *s = decay(at(&TAUS, i), sr);
        }
        Self {
            sr,
            k,
            ph: [0; 6],
            inc: [0; 6],
            env: [Env::new(); 6],
            d,
            a_att: coefficient(0.004, sr),
            clock: Clock::new(),
            rng: Rng::new(0x4348_494D_0000_0001),
            gap: 1.0,
            note: 4,
            events: 0,
        }
    }

    fn trigger(&mut self) {
        // Pitch walks the table by -2..=2 steps so neighbouring bells relate.
        let up = (self.rng.unit() * 5.0) as usize;
        self.note = self.note.saturating_add(up).saturating_sub(2).min(9);
        let i = self.note;
        let semis = PENTA.get(i).copied().unwrap_or(0);
        let base = BASE_HZ * semi_ratio(semis);
        let limit = self.sr * 0.45;
        for (n, (inc, env)) in self.inc.iter_mut().zip(self.env.iter_mut()).enumerate() {
            let f = base * at(&RATIOS, n);
            *inc = if f < limit { increment(f, self.k) } else { 0 };
            if f < limit {
                env.trigger();
            } else {
                env.kill();
            }
        }
        let pulled = self.gap + 0.15 * (1.0 - self.gap);
        self.gap = (pulled * (0.7 + 0.6 * self.rng.unit() as f64)).clamp(0.5, 1.25);
        self.events = self.events.wrapping_add(1);
    }

    /// One mono sample in `[-1, 1]`.
    pub fn process(&mut self, rate_per_min: f32) -> f32 {
        let mean = self.sr as f64 * 60.0 / rate_per_min as f64;
        if self.clock.tick_max(mean * self.gap * GAP_NORM, mean * 1.25 * GAP_NORM) {
            self.trigger();
        }
        let mut acc = 0.0;
        for (i, ((ph, inc), env)) in self.ph.iter_mut().zip(self.inc).zip(self.env.iter_mut()).enumerate() {
            *ph = ph.wrapping_add(inc);
            let e = env.tick(self.a_att, at(&self.d, i));
            acc += e * at(&AMPS, i) * sin_turn(*ph);
        }
        acc
    }
}

#[cfg(test)]
mod tests {
    use super::Chime;

    #[test]
    fn dropped_partials_are_silenced_not_frozen() {
        let mut c = Chime::new(8_000.0, 18_446_744_073_709_551_616.0 / 8_000.0);
        let mut seen = 0;
        for _ in 0..(8_000 * 400) {
            let before = c.events;
            c.process(30.0);
            if c.events != before {
                seen += 1;
                for (inc, env) in c.inc.iter().zip(c.env.iter()) {
                    assert!(*inc != 0 || env.v == 0.0, "frozen partial still ringing");
                }
            }
        }
        assert!(seen > 20);
    }
}
