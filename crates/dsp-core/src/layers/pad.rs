//! Pad layer: 4 detuned oscillators on a chord, slow amplitude swell per oscillator.

use super::util::{at, semi_ratio};
use crate::phase::{increment, sin_turn};
use crate::smooth::{coefficient, step};

/// Semitone offsets per chord: maj7, min7, sus2, sus4, add9, min9, maj-open, fifths.
const CHORDS: [[u8; 4]; 8] = [
    [0, 4, 7, 11],
    [0, 3, 7, 10],
    [0, 2, 7, 12],
    [0, 5, 7, 12],
    [0, 4, 7, 14],
    [0, 3, 7, 14],
    [0, 7, 16, 19],
    [0, 7, 12, 19],
];
const DETUNE: [f32; 4] = [1.0, 1.0042, 0.9962, 1.0075];
const LFO_HZ: [f32; 4] = [0.050, 0.071, 0.093, 0.113];

pub struct Pad {
    k: f64,
    f: [f32; 4],
    ph: [u64; 4],
    lfo: [u64; 4],
    lfo_inc: [u64; 4],
    a_glide: f32,
}

impl Pad {
    pub fn new(sr: f32, k: f64) -> Self {
        let mut lfo_inc = [0u64; 4];
        for (i, s) in lfo_inc.iter_mut().enumerate() {
            *s = increment(at(&LFO_HZ, i), k);
        }
        Self {
            k,
            f: [110.0; 4],
            ph: [0; 4],
            lfo: [0, 1 << 62, 1 << 63, 3 << 62],
            lfo_inc,
            a_glide: coefficient(0.3, sr),
        }
    }

    /// One mono sample in `[-0.95, 0.95]`.
    pub fn process(&mut self, chord: u8, root: f32) -> f32 {
        let row = CHORDS.get(chord as usize).copied().unwrap_or([0; 4]);
        let mut acc = 0.0;
        for i in 0..4 {
            let semis = row.get(i).copied().unwrap_or(0);
            let target = root * semi_ratio(semis) * at(&DETUNE, i);
            if let (Some(f), Some(ph), Some(l), Some(li)) =
                (self.f.get_mut(i), self.ph.get_mut(i), self.lfo.get_mut(i), self.lfo_inc.get(i))
            {
                *f = step(*f, target, self.a_glide);
                *ph = ph.wrapping_add(increment(*f, self.k));
                *l = l.wrapping_add(*li);
                let amp = 0.65 + 0.35 * sin_turn(*l);
                acc += amp * (0.85 * sin_turn(*ph) + 0.1 * sin_turn(ph.wrapping_mul(2)));
            }
        }
        acc * 0.25
    }
}
