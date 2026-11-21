//! Lo-fi bed: four voices that glide through slow jazz chord progressions, warmth low-pass,
//! tape wow and flutter, tape saturation and vinyl crackle.
//!
//! Progression 0 keeps the original static bed (bit for bit). Progressions 1..=7 walk four
//! chords of four voices each, one chord every 12 s, voices glide over about 0.5 s.

use super::util::{at, flush, lp_coef, semi_ratio, tape, Clock, Rng};
use crate::phase::{increment, sin_turn};
use crate::smooth::{coefficient, step};

const BASE_HZ: f32 = 110.0;
const RATIOS: [f32; 4] = [1.0, 1.4983, 2.0, 2.5198];
const DETUNE: [f32; 4] = [1.0, 1.0035, 0.9965, 1.0052];
const CRACKLE_PER_SEC: f32 = 25.0;
const CHORD_SECONDS: f64 = 12.0;
const WOW_HZ: f32 = 0.4;
const FLUTTER_HZ: f32 = 6.1;
const MAX_ROOT: f32 = 165.0;

/// Semitones above the root (0..=24). Four chords per progression, four voices per chord.
const PROGS: [[[u8; 4]; 4]; 7] = [
    [[0, 15, 19, 22], [5, 12, 15, 19], [10, 14, 17, 21], [7, 14, 17, 22]], // minor-lofi
    [[0, 11, 16, 19], [5, 12, 16, 19], [2, 12, 17, 21], [7, 11, 17, 21]],  // major-jazz
    [[0, 15, 19, 22], [7, 14, 17, 22], [5, 12, 15, 21], [10, 14, 17, 22]], // dorian
    [[0, 7, 14, 16], [5, 12, 14, 19], [3, 10, 14, 19], [7, 12, 16, 19]],   // dream-sus
    [[0, 15, 19, 22], [8, 12, 15, 19], [5, 12, 15, 20], [3, 10, 14, 19]],  // rain-minor
    [[0, 12, 16, 23], [9, 12, 16, 19], [5, 12, 16, 19], [7, 11, 14, 19]],  // warm-major
    [[0, 7, 15, 22], [8, 15, 19, 24], [5, 12, 15, 19], [7, 14, 17, 22]],   // deep-minor
];

pub struct Lofi {
    sr: f32,
    k: f64,
    ph: [u64; 4],
    f: [f32; 4],
    a_glide: f32,
    chord: usize,
    chord_clock: Clock,
    chord_len: f64,
    wow_ph: u64,
    flut_ph: u64,
    wow_inc: u64,
    flut_inc: u64,
    lp: f32,
    warm: f32,
    a_warm: f32,
    pop: f32,
    pop_lp: f32,
    rng: Rng,
}

impl Lofi {
    pub fn new(sr: f32, k: f64) -> Self {
        let mut f = [0.0; 4];
        for (i, slot) in f.iter_mut().enumerate() {
            *slot = BASE_HZ * at(&RATIOS, i) * at(&DETUNE, i);
        }
        Self {
            sr,
            k,
            ph: [0, 1 << 60, 1 << 61, 3 << 60],
            f,
            a_glide: coefficient(0.5, sr),
            chord: 0,
            chord_clock: Clock::new(),
            chord_len: sr as f64 * CHORD_SECONDS,
            wow_ph: 0,
            flut_ph: 1 << 62,
            wow_inc: increment(WOW_HZ, k),
            flut_inc: increment(FLUTTER_HZ, k),
            lp: 0.0,
            warm: 0.5,
            a_warm: coefficient(0.05, sr),
            pop: 0.0,
            pop_lp: 0.0,
            rng: Rng::new(0x4C4F_4649_0000_0001),
        }
    }

    /// Target frequency of voice `i`. Progression 0 is the legacy static bed.
    fn target(&self, i: usize, prog: u8, root: f32) -> f32 {
        let row = usize::from(prog).wrapping_sub(1);
        match PROGS.get(row).and_then(|p| p.get(self.chord)).and_then(|c| c.get(i)) {
            Some(semis) => root.clamp(55.0, MAX_ROOT) * semi_ratio(*semis) * at(&DETUNE, i),
            None => BASE_HZ * at(&RATIOS, i) * at(&DETUNE, i),
        }
    }

    /// One mono sample in `[-1, 1]`. `root` is the key (pad root Hz) used by progressions.
    pub fn process(&mut self, warm_t: f32, crackle: f32, prog: u8, wow: f32, root: f32) -> f32 {
        self.warm = step(self.warm, warm_t, self.a_warm);
        let a = lp_coef(3_500.0 - 3_300.0 * self.warm, self.sr);
        if self.chord_clock.tick(self.chord_len) {
            self.chord = self.chord.wrapping_add(1) & 3;
        }
        self.wow_ph = self.wow_ph.wrapping_add(self.wow_inc);
        self.flut_ph = self.flut_ph.wrapping_add(self.flut_inc);
        let m = 1.0 + wow * (0.002 * sin_turn(self.wow_ph) + 0.0006 * sin_turn(self.flut_ph));
        let mut s = 0.0;
        for i in 0..4 {
            let t = self.target(i, prog, root);
            if let (Some(f), Some(p)) = (self.f.get_mut(i), self.ph.get_mut(i)) {
                *f = step(*f, t, self.a_glide);
                *p = p.wrapping_add(increment(*f * m, self.k));
                s += sin_turn(*p) + 0.35 * sin_turn(p.wrapping_mul(2));
            }
        }
        self.lp = flush(self.lp + a * (s * (1.0 / 4.2) - self.lp));
        let bed = tape(self.lp * 1.8);
        let hit = self.rng.unit() < crackle * CRACKLE_PER_SEC / self.sr;
        let amp = self.rng.bipolar();
        if hit {
            self.pop = amp * 0.6;
        }
        self.pop_lp = flush(self.pop_lp + 0.5 * (self.pop - self.pop_lp));
        self.pop = flush(self.pop * 0.8);
        (bed * 0.8 + self.pop_lp * 0.5).clamp(-1.0, 1.0)
    }
}
