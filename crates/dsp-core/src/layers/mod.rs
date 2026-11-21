//! Synthesized layers (contract C1 slots 8..23): lofi, instrument, pad, chimes, percussion.
//!
//! Every layer runs every sample (fixed cost). Levels are smoothed per sample, so
//! turning a layer on or off never clicks. Mix budget: lofi 0.3, instrument 1.2,
//! pad 0.5, chimes 1.0, percussion 0.8, soft-limited to 0.7 (knee 0.6). The tone
//! and noise bed is scaled by `1 - 0.6 * min(1, sum(levels) / 2)`, which is exactly
//! 1.0 when every level is 0, so the pre-layer output is reproduced bit for bit.
//!
//! Headroom bound (no noise bed): tone weights sum to 1, so tone <= 1 and the
//! tone term is <= 1 - 0.6 = 0.4 at full layers. `soft()` caps the bus at 0.7
//! whatever the budgets are. Worst case (0.4 + 0.7) * 0.85 gain = 0.935 <= 0.95,
//! so the limiter does not engage (tested). Budgets above 1 are safe for the same
//! reason: the bound comes from `soft()`, not from the budgets. Partial level
//! combinations (for example one loud layer plus the full tone at gain 0.85) can
//! exceed 0.95 before the output limiter at coinciding peaks, at most
//! (0.7 + 0.69) * 0.85 = 1.18; the limiter then rounds those peaks and the output
//! stays within 0.95.

mod chime;
mod instrument;
mod lofi;
mod motion;
mod pad;
mod perc;
mod piano;
pub mod util;

use crate::params::{clamp, sanitize, sanitize_enum};
use crate::smooth::{coefficient, step};

/// First layer slot in the parameter block.
pub const FIRST_SLOT: usize = 8;
const BUDGET: [f32; 5] = [0.3, 1.2, 0.5, 1.0, 0.8];
const BUS_KNEE: f32 = 0.6;
const BUS_MAX: f32 = 0.7;
/// Largest tone and bed attenuation (at layer level sum >= 2).
const DUCK: f32 = 0.6;

/// Sanitized layer targets.
#[derive(Clone, Copy)]
struct Targets {
    level: [f32; 5],
    warmth: f32,
    crackle: f32,
    kind: u8,
    inst_root: f32,
    inst_scale: u8,
    inst_bpm: f32,
    chord: u8,
    pad_root: f32,
    chime_rate: f32,
    perc_bpm: f32,
    pattern: u8,
    prog: u8,
    wow: f32,
    pedal: f32,
    breath: f32,
    breath_rate: f32,
    width: f32,
    pan: f32,
    pan_rate: f32,
}

/// One sample of layer output: stereo bus, tone and bed scaling.
#[derive(Clone, Copy)]
pub struct LayerOut {
    pub left: f32,
    pub right: f32,
    /// Scale for the tone and the noise bed.
    pub ts: f32,
    /// Extra breathing gain for the noise bed (1.0 when breathing is off).
    pub bed: f32,
}

pub struct Layers {
    t: Targets,
    lvl: [f32; 5],
    a_lvl: f32,
    lofi: lofi::Lofi,
    inst: instrument::Instrument,
    pad: pad::Pad,
    chime: chime::Chime,
    perc: perc::Perc,
    motion: motion::Motion,
}

fn slot(p: &[f32], i: usize) -> f32 {
    p.get(i.wrapping_add(FIRST_SLOT)).copied().unwrap_or(f32::NAN)
}

impl Layers {
    pub fn new(sr: f32, k: f64) -> Self {
        Self {
            t: Targets {
                level: [0.0; 5],
                warmth: 0.5,
                crackle: 0.0,
                kind: 0,
                inst_root: 220.0,
                inst_scale: 0,
                inst_bpm: 60.0,
                chord: 0,
                pad_root: 110.0,
                chime_rate: 6.0,
                perc_bpm: 70.0,
                pattern: 0,
                prog: 0,
                wow: 0.0,
                pedal: 0.0,
                breath: 0.0,
                breath_rate: 0.1,
                width: 0.0,
                pan: 0.0,
                pan_rate: 0.05,
            },
            lvl: [0.0; 5],
            a_lvl: coefficient(0.02, sr),
            lofi: lofi::Lofi::new(sr, k),
            inst: instrument::Instrument::new(sr, k),
            pad: pad::Pad::new(sr, k),
            chime: chime::Chime::new(sr, k),
            perc: perc::Perc::new(sr, k),
            motion: motion::Motion::new(sr, k),
        }
    }

    /// Read slots 8..=31 of a parameter block. Non-finite entries keep the previous value.
    pub fn apply(&mut self, p: &[f32]) {
        let t = &mut self.t;
        let lv = |i: usize, prev: f32| sanitize(slot(p, i), prev, 0.0, 1.0);
        t.level[0] = lv(0, t.level[0]);
        t.warmth = lv(1, t.warmth);
        t.crackle = lv(2, t.crackle);
        t.level[1] = lv(3, t.level[1]);
        t.kind = sanitize_enum(slot(p, 4), t.kind, 3);
        t.inst_root = sanitize(slot(p, 5), t.inst_root, 55.0, 880.0);
        t.inst_scale = sanitize_enum(slot(p, 6), t.inst_scale, 7);
        t.inst_bpm = sanitize(slot(p, 7), t.inst_bpm, 30.0, 180.0);
        t.level[2] = lv(8, t.level[2]);
        t.chord = sanitize_enum(slot(p, 9), t.chord, 7);
        t.pad_root = sanitize(slot(p, 10), t.pad_root, 55.0, 440.0);
        t.level[3] = lv(11, t.level[3]);
        t.chime_rate = sanitize(slot(p, 12), t.chime_rate, 1.0, 30.0);
        t.level[4] = lv(13, t.level[4]);
        t.perc_bpm = sanitize(slot(p, 14), t.perc_bpm, 30.0, 180.0);
        t.pattern = sanitize_enum(slot(p, 15), t.pattern, 7);
        t.prog = sanitize_enum(slot(p, 16), t.prog, 7);
        t.wow = lv(17, t.wow);
        t.pedal = lv(18, t.pedal);
        t.breath = lv(19, t.breath);
        t.breath_rate = sanitize(slot(p, 20), t.breath_rate, 0.05, 0.2);
        t.width = lv(21, t.width);
        t.pan = lv(22, t.pan);
        t.pan_rate = sanitize(slot(p, 23), t.pan_rate, 0.02, 0.2);
    }

    /// Scheduled event counts: (instrument notes, chime strikes, percussion hits).
    /// Subnormal values left in layer state (diagnostics and tests).
    pub fn subnormal_count(&self) -> usize {
        self.inst.subnormal_count()
    }

    pub fn event_counts(&self) -> [u32; 3] {
        [self.inst.events, self.chime.events, self.perc.events]
    }

    /// Next mono layer sample and the scale to apply to the tone and noise bed.
    pub fn sample(&mut self) -> LayerOut {
        let mut sum = 0.0;
        for (l, t) in self.lvl.iter_mut().zip(self.t.level) {
            *l = step(*l, t, self.a_lvl);
            sum += *l;
        }
        let tone_scale = 1.0 - DUCK * clamp(sum * 0.5, 0.0, 1.0);
        let t = self.t;
        let outs = [
            self.lofi.process(t.warmth, t.crackle, t.prog, t.wow, t.pad_root),
            self.inst.process(t.kind, t.inst_root, t.inst_scale, t.inst_bpm, t.pedal),
            self.pad.process(t.chord, t.pad_root),
            self.chime.process(t.chime_rate),
            self.perc.process(t.perc_bpm, t.pattern),
        ];
        let mut g = [1.0; motion::CHANNELS];
        self.motion.breath(t.breath, t.breath_rate, &mut g);
        let mut bus = 0.0;
        for (((o, l), b), gi) in outs.iter().zip(self.lvl).zip(BUDGET).zip(g) {
            bus += o * l * b * gi;
        }
        let (left, right) = self.motion.stereo(soft(bus), t.width, t.pan, t.pan_rate);
        let bed = g.get(5).copied().unwrap_or(1.0);
        // The tone breathes at 70 percent of the depth of the bed (attenuation only, 1.0 when off).
        let ts = tone_scale * (1.0 - 0.7 * (1.0 - bed));
        LayerOut { left, right, ts, bed }
    }
}

/// Identity below the knee, rational approach to +-0.6 above it.
#[inline]
fn soft(x: f32) -> f32 {
    let a = util::abs(x);
    if a <= BUS_KNEE {
        return x;
    }
    let w = BUS_MAX - BUS_KNEE;
    let t = (a - BUS_KNEE) / w;
    let y = BUS_KNEE + w * t / (1.0 + t);
    if x < 0.0 {
        -y
    } else {
        y
    }
}
