//! Instrument layer: 4 voices, kinds pluck (Karplus-Strong), drone, FM bell-pluck.

use super::piano::Piano;
use super::util::{abs, at, decay, flush, rad_units, semi_ratio, Clock, Env, Rng};
use crate::phase::{increment, sin_turn};
use crate::smooth::{coefficient, step};

/// Delay line length: covers 55 Hz at 192 kHz (3490 samples), power of two for masking.
pub const LINE: usize = 4096;
const VOICES: usize = 4;

/// Semitone tables per scale, 8 degrees each (within two octaves).
const SCALES: [[u8; 8]; 8] = [
    [0, 2, 4, 7, 9, 12, 14, 16],
    [0, 3, 5, 7, 10, 12, 15, 17],
    [0, 2, 3, 5, 7, 9, 10, 12],
    [0, 2, 3, 5, 7, 8, 10, 12],
    [0, 2, 4, 6, 7, 9, 11, 12],
    [0, 2, 4, 6, 8, 10, 12, 14],
    [0, 2, 3, 7, 8, 12, 14, 15],
    [0, 7, 12, 19, 7, 12, 0, 19],
];

/// Karplus-Strong string with a fixed 4096 sample line.
struct Pluck {
    line: [f32; LINE],
    w: usize,
    n: usize,
    exc: u32,
    m: f32,
    g: f32,
    c: f32,
    ap_x: f32,
    ap_y: f32,
    nlp: f32,
}

impl Pluck {
    const fn new() -> Self {
        Self { line: [0.0; LINE], w: 0, n: 100, exc: 0, m: 0.0, g: 0.99, c: 0.0, ap_x: 0.0, ap_y: 0.0, nlp: 0.0 }
    }

    fn trigger(&mut self, hz: f32, sr: f32) {
        let d = (sr / hz.max(1.0) - 0.5).clamp(4.0, (LINE - 4) as f32);
        let n = d as usize;
        let frac = d - n as f32;
        self.n = n;
        self.c = (1.0 - frac) / (1.0 + frac);
        self.g = decay(2.5, hz.max(20.0));
        self.exc = n as u32;
    }

    #[inline]
    fn tap(&self, back: usize) -> f32 {
        at_line(&self.line, self.w.wrapping_sub(back) & (LINE - 1))
    }

    fn process(&mut self, noise: f32) -> f32 {
        let avg = 0.5 * (self.tap(self.n) + self.tap(self.n.wrapping_add(1))) * self.g;
        let y = self.c * (avg - self.ap_y) + self.ap_x;
        self.ap_x = avg;
        self.ap_y = flush(y);
        self.nlp += 0.4 * (noise - self.nlp);
        let target = if self.exc > 0 { 1.0 } else { 0.0 };
        self.exc = self.exc.saturating_sub(1);
        self.m = step(self.m, target, 0.2);
        let v = flush(self.ap_y * (1.0 - self.m) + self.nlp * 0.9 * self.m);
        if let Some(s) = self.line.get_mut(self.w) {
            *s = v;
        }
        self.w = self.w.wrapping_add(1) & (LINE - 1);
        v
    }
}

/// Fold a note down by octaves until it is at or below `cap`, keeping its pitch class.
fn fold_hz(mut hz: f32, cap: f32) -> f32 {
    for _ in 0..4 {
        if hz > cap {
            hz *= 0.5;
        }
    }
    hz
}

#[inline]
fn at_line(a: &[f32; LINE], i: usize) -> f32 {
    a.get(i).copied().unwrap_or(0.0)
}

/// Two operator FM voice with decaying index.
#[derive(Clone, Copy)]
struct Bell {
    pc: u64,
    pm: u64,
    ic: u64,
    im: u64,
    amp: Env,
    idx: f32,
}

impl Bell {
    const fn new() -> Self {
        Self { pc: 0, pm: 0, ic: 0, im: 0, amp: Env::new(), idx: 0.0 }
    }
}

impl Instrument {
    /// Count of subnormal values in the pluck state (diagnostics and tests).
    pub fn subnormal_count(&self) -> usize {
        let sub = |x: f32| x != 0.0 && abs(x) < f32::MIN_POSITIVE;
        let mut n: usize = 0;
        for p in &self.plucks {
            n = n.saturating_add([p.m, p.nlp, p.ap_x, p.ap_y].iter().filter(|x| sub(**x)).count());
            n = n.saturating_add(p.line.iter().filter(|x| sub(**x)).count());
        }
        n
    }
}

pub struct Instrument {
    sr: f32,
    k: f64,
    plucks: [Pluck; VOICES],
    bells: [Bell; VOICES],
    clock: Clock,
    rng: Rng,
    next: usize,
    beats: u32,
    drone_t: f32,
    drone_f: f32,
    drone_ph: [u64; 3],
    drone_lfo: u64,
    drone_lfo_inc: u64,
    w: [f32; 4],
    piano: Piano,
    a_w: f32,
    a_att: f32,
    a_drone: f32,
    d_amp: f32,
    d_idx: f32,
    pub events: u32,
}

impl Instrument {
    pub fn new(sr: f32, k: f64) -> Self {
        Self {
            sr,
            k,
            plucks: [Pluck::new(), Pluck::new(), Pluck::new(), Pluck::new()],
            bells: [Bell::new(); VOICES],
            clock: Clock::new(),
            rng: Rng::new(0x494E_5354_0000_0001),
            next: 0,
            beats: 0,
            drone_t: 110.0,
            drone_f: 110.0,
            drone_ph: [0; 3],
            drone_lfo: 0,
            drone_lfo_inc: increment(0.1, k),
            w: [1.0, 0.0, 0.0, 0.0],
            piano: Piano::new(sr, k),
            a_w: coefficient(0.03, sr),
            a_att: coefficient(0.003, sr),
            a_drone: coefficient(0.6, sr),
            d_amp: decay(1.2, sr),
            d_idx: decay(0.35, sr),
            events: 0,
        }
    }

    fn trigger(&mut self, root: f32, scale: u8) {
        let degree = self.rng.index8();
        let row = SCALES.get(scale as usize).copied().unwrap_or([0; 8]);
        let semis = row.get(degree).copied().unwrap_or(0);
        let hz = fold_hz(root * semi_ratio(semis), self.sr * 0.2);
        let v = self.next & (VOICES - 1);
        self.next = self.next.wrapping_add(1);
        if let Some(p) = self.plucks.get_mut(v) {
            p.trigger(hz, self.sr);
        }
        if let Some(b) = self.bells.get_mut(v) {
            b.ic = increment(hz, self.k);
            b.im = increment((hz * 3.5).min(self.sr * 0.45), self.k);
            b.idx = 2.5;
            b.amp.trigger();
        }
        if self.beats & 3 == 0 {
            self.drone_t = (hz * 0.5).max(27.5);
        }
        self.beats = self.beats.wrapping_add(1);
        if let Some(d) = self.piano.next_degree() {
            let ps = row.get(d).copied().unwrap_or(0);
            self.piano.trigger(fold_hz(root * semi_ratio(ps), self.sr * 0.2));
        }
        self.events = self.events.wrapping_add(1);
    }

    /// One mono sample in `[-1, 1]`.
    pub fn process(&mut self, kind: u8, root: f32, scale: u8, bpm: f32, pedal: f32) -> f32 {
        let step_len = self.sr as f64 * 60.0 / bpm as f64;
        if self.clock.tick(step_len) {
            self.trigger(root, scale);
        }
        for (i, w) in self.w.iter_mut().enumerate() {
            let t = if usize::from(kind) == i { 1.0 } else { 0.0 };
            *w = step(*w, t, self.a_w);
        }
        let noise = self.rng.bipolar();
        let mut pl = 0.0;
        for p in self.plucks.iter_mut() {
            pl += p.process(noise);
        }
        let mut fm = 0.0;
        for b in self.bells.iter_mut() {
            b.pc = b.pc.wrapping_add(b.ic);
            b.pm = b.pm.wrapping_add(b.im);
            b.idx = flush(b.idx * self.d_idx);
            let a = b.amp.tick(self.a_att, self.d_amp);
            let modu = rad_units(b.idx * sin_turn(b.pm));
            fm += a * sin_turn(b.pc.wrapping_add(modu));
        }
        self.drone_f = step(self.drone_f, self.drone_t, self.a_drone);
        self.drone_lfo = self.drone_lfo.wrapping_add(self.drone_lfo_inc);
        let swell = 0.8 + 0.2 * sin_turn(self.drone_lfo);
        let mut dr = 0.0;
        for (i, ph) in self.drone_ph.iter_mut().enumerate() {
            let ratio = at(&[1.0, 1.5, 2.0], i);
            *ph = ph.wrapping_add(increment(self.drone_f * ratio, self.k));
            dr += sin_turn(*ph) * at(&[0.5, 0.25, 0.2], i);
        }
        let pn = self.piano.process(pedal);
        let [w0, w1, w2, w3] = self.w;
        (pl * 0.6 * w0 + dr * swell * w1 + fm * 0.5 * w2 + pn * 0.9 * w3).clamp(-1.0, 1.0)
    }
}

#[cfg(test)]
mod tests {
    use super::fold_hz;

    #[test]
    fn notes_above_the_cap_fold_down_by_octaves() {
        let cap = 1600.0;
        assert_eq!(fold_hz(1397.0, cap), 1397.0);
        assert_eq!(fold_hz(1760.0, cap), 880.0);
        assert_eq!(fold_hz(3520.0, cap), 880.0);
        assert_eq!(fold_hz(3951.0, cap), 987.75);
        assert!(fold_hz(f32::MAX, cap).is_finite());
    }
}
