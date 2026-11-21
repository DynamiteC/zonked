//! Layer synthesis tests (contract C1 slots 8..23). std is allowed here.

use dsp_core::abi::{zk_apply_params, zk_init, zk_out_left, zk_param_block, zk_param_count, zk_render};
use dsp_core::engine::Engine;
use std::time::Instant;

const SR: f32 = 48_000.0;

/// Block builder: slots 0..7 tone, 8..23 layers.
fn block(gain: f32) -> [f32; 32] {
    let mut p = [0.0; 32];
    p[0] = 1500.0; // carrier far from the layer bands
    p[1] = 40.0;
    p[2] = gain;
    p[6] = 0.05;
    p[9] = 0.5;
    p[13] = 220.0;
    p[15] = 90.0;
    p[17] = 0.0;
    p[18] = 110.0;
    p[20] = 12.0;
    p[22] = 120.0;
    p
}

fn render(e: &mut Engine, n: usize) -> Vec<f32> {
    let mut out = Vec::with_capacity(n);
    let mut left = n;
    while left > 0 {
        let k = left.min(128);
        e.render(k as u32);
        out.extend_from_slice(&e.out_l[..k]);
        left -= k;
    }
    out
}

fn settle(p: &[f32], secs: f32) -> (Engine, Vec<f32>) {
    let mut e = Engine::new(SR);
    e.apply_params(p);
    render(&mut e, (SR * 4.0) as usize); // gain ramp and level smoothing
    let x = render(&mut e, (SR * secs) as usize);
    (e, x)
}

fn goertzel(x: &[f32], hz: f64) -> f64 {
    let w = 2.0 * std::f64::consts::PI * hz / SR as f64;
    let c = 2.0 * w.cos();
    let (mut s1, mut s2) = (0.0f64, 0.0f64);
    for &v in x {
        let s = v as f64 + c * s1 - s2;
        s2 = s1;
        s1 = s;
    }
    (s1 * s1 + s2 * s2 - c * s1 * s2) / (x.len() as f64).powi(2)
}

fn band(x: &[f32], lo: f64, hi: f64, step: f64) -> f64 {
    let (mut sum, mut n) = (0.0, 0.0);
    let mut f = lo;
    while f <= hi {
        sum += goertzel(x, f);
        n += 1.0;
        f += step;
    }
    sum / n
}

fn peak(x: &[f32]) -> f32 {
    x.iter().fold(0.0, |m, v| m.max(v.abs()))
}

fn max_step(x: &[f32]) -> f32 {
    x.windows(2).map(|w| (w[1] - w[0]).abs()).fold(0.0, f32::max)
}

fn fnv(p: [f32; 8], pad: usize) -> u64 {
    let mut e = Engine::new(SR);
    if pad == 8 {
        e.apply_params(&p);
    } else {
        let mut b = [0.0; 32];
        b[..8].copy_from_slice(&p);
        e.apply_params(&b);
    }
    let mut h = 0xcbf2_9ce4_8422_2325u64;
    for _ in 0..400 {
        e.render(128);
        for i in 0..128 {
            for v in [e.out_l[i], e.out_r[i]] {
                h ^= u64::from(v.to_bits());
                h = h.wrapping_mul(0x0100_0000_01b3);
            }
        }
    }
    h
}

#[test]
fn layers_off_matches_pre_layer_output_bit_for_bit() {
    // Hashes captured from the engine before layers existed.
    let cases: [([f32; 8], u64); 3] = [
        ([200.0, 10.0, 0.5, 0.0, 0.0, 0.0, 0.05, 0.0], 0xd91e_3aa2_5c0e_7356),
        ([300.0, 7.0, 0.85, 1.0, 2.0, 0.6, 0.05, 0.0], 0xf8a0_4001_ba37_bf50),
        ([440.0, 4.0, 0.7, 2.0, 3.0, 1.0, 0.5, 0.0], 0x2c5e_c9d8_1eaa_921c),
    ];
    for (p, h) in cases {
        assert_eq!(fnv(p, 8), h, "8 slot block");
        assert_eq!(fnv(p, 32), h, "32 slot block, layers zero");
    }
}

#[test]
fn param_block_has_32_slots() {
    assert_eq!(zk_param_count(), 32);
    zk_init(SR);
    let p = zk_param_block();
    let b = block(0.5);
    // SAFETY: the block is 32 f32 slots owned by the static engine state.
    unsafe {
        for (i, v) in b.iter().enumerate() {
            *p.add(i) = *v;
        }
        *p.add(11) = 1.0;
    }
    zk_apply_params();
    for _ in 0..2000 {
        zk_render(128);
    }
    // SAFETY: zk_out_left points at 128 f32.
    let out = unsafe { std::slice::from_raw_parts(zk_out_left(), 128) };
    assert!(out.iter().all(|v| v.is_finite() && v.abs() <= 0.95));
}

fn only(slot: usize, level: f32) -> [f32; 32] {
    let mut p = block(0.5);
    p[slot] = level;
    p
}

#[test]
fn lofi_is_low_band_bounded_and_nonzero() {
    let mut p = only(8, 1.0);
    p[9] = 0.3;
    let (_, x) = settle(&p, 2.0);
    assert!(peak(&x) > 0.02 && peak(&x) <= 0.95);
    let low = goertzel(&x, 110.0) + goertzel(&x, 220.0);
    let high = band(&x, 6000.0, 9000.0, 500.0);
    assert!(low > high * 200.0, "low {low} high {high}");
}

#[test]
fn warmth_darkens_lofi() {
    let mut a = only(8, 1.0);
    a[9] = 0.0;
    let mut b = a;
    b[9] = 1.0;
    let (_, xa) = settle(&a, 1.0);
    let (_, xb) = settle(&b, 1.0);
    let hi = |x: &[f32]| band(x, 400.0, 600.0, 20.0);
    assert!(hi(&xa) > hi(&xb) * 2.0, "{} {}", hi(&xa), hi(&xb));
}

#[test]
fn crackle_adds_sparse_clicks() {
    let mut a = only(8, 1.0);
    a[0] = 20.0;
    a[1] = 0.5;
    a[10] = 0.0;
    let mut b = a;
    b[10] = 1.0;
    let (_, xa) = settle(&a, 2.0);
    let (_, xb) = settle(&b, 2.0);
    assert!(max_step(&xb) > max_step(&xa) * 1.5);
    assert!(peak(&xb) <= 0.95);
}

#[test]
fn instrument_kinds_produce_low_mid_energy() {
    for kind in [0.0, 1.0, 2.0] {
        let mut p = only(11, 1.0);
        p[2] = 0.3; // keep the tone plus layers below the output limiter knee
        p[12] = kind;
        p[14] = 7.0; // fifths: 220, 330, 440, 660 Hz
        p[15] = 120.0;
        let (_, x) = settle(&p, 4.0);
        assert!(peak(&x) > 0.01 && peak(&x) <= 0.95, "kind {kind}");
        let mid = band(&x, 100.0, 1400.0, 55.0);
        let high = band(&x, 9000.0, 12000.0, 500.0);
        // The louder instrument budget soft-limits the pluck onset burst, which adds a little high band.
        assert!(mid > high * 5.0, "kind {kind} mid {mid} high {high}");
    }
}

#[test]
fn pluck_rings_at_scale_notes() {
    let mut p = only(11, 1.0);
    p[14] = 7.0;
    p[15] = 60.0;
    let (_, x) = settle(&p, 8.0);
    let notes: f64 = [220.0, 330.0, 440.0, 659.0].iter().map(|f| goertzel(&x, *f)).sum();
    let off: f64 = [270.0, 390.0, 520.0, 800.0].iter().map(|f| goertzel(&x, *f)).sum();
    assert!(notes > off * 3.0, "notes {notes} off {off}");
}

#[test]
fn pad_sits_on_chord_tones() {
    let mut p = only(16, 1.0);
    p[17] = 1.0; // min7 on 110: 110, 130.8, 164.8, 196
    p[18] = 110.0;
    let (_, x) = settle(&p, 3.0);
    assert!(peak(&x) > 0.02 && peak(&x) <= 0.95);
    let tones: f64 = [110.0, 130.8, 164.8, 196.0].iter().map(|f| goertzel(&x, *f)).sum();
    let off: f64 = [90.0, 148.0, 180.0, 240.0].iter().map(|f| goertzel(&x, *f)).sum();
    assert!(tones > off * 10.0, "tones {tones} off {off}");
}

#[test]
fn chimes_ring_in_mid_band() {
    let mut p = only(19, 1.0);
    p[20] = 30.0;
    let (_, x) = settle(&p, 6.0);
    assert!(peak(&x) > 0.01 && peak(&x) <= 0.95);
    let mid = band(&x, 390.0, 1400.0, 40.0);
    let sub = band(&x, 20.0, 150.0, 10.0);
    assert!(mid > sub * 8.0, "mid {mid} sub {sub}");
}

#[test]
fn percussion_has_thump_and_noise_energy() {
    for pattern in 0..8 {
        let mut p = only(21, 1.0);
        p[23] = pattern as f32;
        p[22] = 180.0;
        let (_, x) = settle(&p, 3.0);
        assert!(peak(&x) > 0.01 && peak(&x) <= 0.95, "pattern {pattern}");
    }
    let mut p = only(21, 1.0);
    p[23] = 2.0;
    let (_, x) = settle(&p, 4.0);
    let low = band(&x, 40.0, 220.0, 20.0);
    let top = band(&x, 15_000.0, 20_000.0, 1000.0);
    assert!(low > top * 20.0, "low {low} top {top}");
}

#[test]
fn deterministic_for_same_params() {
    let mut p = block(0.6);
    for (i, v) in [(8, 0.7), (10, 0.5), (11, 0.8), (12, 2.0), (16, 0.6), (19, 0.9), (21, 0.8), (23, 5.0)] {
        p[i] = v;
    }
    let run = || {
        let mut e = Engine::new(SR);
        e.apply_params(&p);
        render(&mut e, 200_000)
    };
    let (a, b) = (run(), run());
    assert!(a.iter().zip(&b).all(|(x, y)| x.to_bits() == y.to_bits()));
    assert!(peak(&a) > 0.01);
}

struct Lcg(u64);
impl Lcg {
    fn next(&mut self) -> f32 {
        self.0 = self.0.wrapping_mul(6_364_136_223_846_793_005).wrapping_add(1_442_695_040_888_963_407);
        ((self.0 >> 40) as f32) / 16_777_216.0
    }
    fn weird(&mut self) -> f32 {
        match (self.next() * 12.0) as u32 {
            0 => f32::NAN,
            1 => f32::INFINITY,
            2 => f32::NEG_INFINITY,
            3 => 1e30,
            4 => -1e30,
            5 => f32::MIN_POSITIVE / 2.0,
            _ => (self.next() - 0.25) * 400.0,
        }
    }
}

#[test]
fn worst_case_stays_bounded_over_5m_samples_with_hostile_params() {
    let mut e = Engine::new(SR);
    let mut rng = Lcg(7);
    let mut seen = 0usize;
    let mut worst = 0.0f32;
    while seen < 5_000_000 {
        let mut p = [0.0f32; 32];
        for v in p.iter_mut() {
            *v = if rng.next() < 0.3 { rng.weird() } else { rng.next() * 1.2 * 880.0 };
        }
        p[2] = 0.85;
        if rng.next() < 0.5 {
            for i in [8usize, 11, 16, 19, 21] {
                p[i] = 1.0;
            }
        }
        e.apply_params(&p);
        for _ in 0..300 {
            e.render(128);
            seen += 128;
            for i in 0..128 {
                for v in [e.out_l[i], e.out_r[i]] {
                    assert!(v.is_finite() && v.abs() <= 0.95, "sample {v}");
                    worst = worst.max(v.abs());
                }
            }
        }
    }
    assert!(worst > 0.1);
}

#[test]
fn all_layers_max_level_stays_below_limiter_threshold_pre_limit() {
    for mode in [0.0, 1.0, 2.0] {
        for (scale, kind, chord, pattern) in [(0.0, 0.0, 0.0, 2.0), (7.0, 2.0, 6.0, 6.0), (3.0, 1.0, 3.0, 4.0)] {
            let mut p = block(0.85);
            p[0] = 200.0;
            p[1] = 10.0;
            p[3] = mode;
            for i in [8usize, 11, 16, 19, 21] {
                p[i] = 1.0;
            }
            p[9] = 0.0;
            p[10] = 1.0;
            p[12] = kind;
            p[14] = scale;
            p[15] = 180.0;
            p[17] = chord;
            p[20] = 30.0;
            p[22] = 180.0;
            p[23] = pattern;
            let mut e = Engine::new(SR);
            e.apply_params(&p);
            render(&mut e, (SR * 20.0) as usize);
            let pk = e.take_peak();
            assert!(pk < 0.95, "mode {mode} peak {pk}");
        }
    }
}

#[test]
fn no_click_when_switching_kind_or_level() {
    let mut p = only(11, 1.0);
    p[0] = 20.0;
    p[1] = 0.5;
    p[15] = 90.0;
    let mut e = Engine::new(SR);
    e.apply_params(&p);
    render(&mut e, (SR * 4.0) as usize);
    let baseline = max_step(&render(&mut e, (SR * 4.0) as usize));
    let mut worst = 0.0f32;
    for (kind, level) in [(1.0, 1.0), (2.0, 1.0), (0.0, 0.2), (2.0, 0.0), (1.0, 1.0), (0.0, 1.0)] {
        p[12] = kind;
        p[11] = level;
        e.apply_params(&p);
        worst = worst.max(max_step(&render(&mut e, (SR * 1.5) as usize)));
    }
    assert!(worst < 0.35, "worst step {worst} baseline {baseline}");
    assert!(worst < baseline.max(0.02) * 3.0, "worst step {worst} baseline {baseline}");
}

#[test]
fn no_subnormal_tail_after_layers_turn_off() {
    let mut p = block(0.5);
    for i in [8usize, 11, 16, 19, 21] {
        p[i] = 1.0;
    }
    p[10] = 0.5;
    let mut e = Engine::new(SR);
    e.apply_params(&p);
    render(&mut e, (SR * 3.0) as usize);
    for i in [2usize, 8, 11, 16, 19, 21] {
        p[i] = 0.0;
    }
    e.apply_params(&p);
    let tail = render(&mut e, (SR * 20.0) as usize);
    assert!(tail.iter().all(|v| *v == 0.0 || v.abs() >= 1e-30));
    let end = &tail[tail.len() - SR as usize..];
    assert!(end.iter().all(|v| *v == 0.0), "tail not silent");
}

#[test]
fn scheduling_tempo_is_accurate() {
    let mut p = block(0.5);
    p[11] = 1.0;
    p[15] = 90.0; // 90 notes per minute
    p[19] = 1.0;
    p[20] = 12.0;
    p[21] = 1.0;
    p[22] = 120.0;
    p[23] = 2.0; // backbeat: 4 hits per 16 steps, 2 per second at 120 bpm
    let mut e = Engine::new(SR);
    e.apply_params(&p);
    let seconds = 600usize;
    for _ in 0..(seconds * SR as usize / 128) {
        e.render(128);
    }
    let [notes, chimes, hits] = e.event_counts();
    assert!((notes as i32 - 900).abs() <= 2, "notes {notes}");
    assert!((hits as i32 - 1200).abs() <= 3, "hits {hits}");
    assert!((chimes as i32 - 120).abs() <= 8, "chimes {chimes}");
}

#[test]
fn no_panic_on_extreme_rates_frames_and_params() {
    for sr in [f32::NAN, 0.0, 8_000.0, 22_050.0, 192_000.0, 1e9] {
        let mut e = Engine::new(sr);
        let mut p = block(0.85);
        for i in [8usize, 11, 16, 19, 21] {
            p[i] = 1.0;
        }
        p[13] = 880.0;
        p[18] = 440.0;
        p[15] = 180.0;
        p[20] = 30.0;
        p[22] = 180.0;
        e.apply_params(&p);
        for frames in [0u32, 1, 127, 128, 129, u32::MAX] {
            e.render(frames);
            assert!(e.out_l.iter().all(|v| v.is_finite() && v.abs() <= 0.95));
        }
        e.apply_params(&[]);
        e.apply_params(&[f32::NAN; 40]);
        render(&mut e, 100_000);
    }
}

#[test]
fn render_cost_does_not_depend_on_parameters() {
    let time = |p: [f32; 32]| {
        let mut best = f64::MAX;
        for _ in 0..5 {
            let mut e = Engine::new(SR);
            e.apply_params(&p);
            let t = Instant::now();
            render(&mut e, 300_000);
            best = best.min(t.elapsed().as_secs_f64());
        }
        best
    };
    let off = time(block(0.5));
    let mut on = block(0.5);
    for i in [8usize, 11, 16, 19, 21] {
        on[i] = 1.0;
    }
    on[10] = 1.0;
    on[12] = 2.0;
    on[15] = 180.0;
    let a = time(on);
    on[12] = 0.0;
    on[14] = 7.0;
    on[17] = 7.0;
    on[22] = 30.0;
    let b = time(on);
    assert!(a < off * 2.5 + 0.02 && b < off * 2.5 + 0.02 && (a / b < 1.6 && b / a < 1.6), "off {off} a {a} b {b}");
}

/// Layer-only contribution: output minus the ducked tone (exact below the limiter knee).
fn layer_rms(p: &[f32; 32], slot_level: usize) -> f64 {
    let mut base = *p;
    base[slot_level] = 0.0;
    let (_, tone) = settle(&base, 20.0);
    let (_, with) = settle(p, 20.0);
    let ts = 1.0 - 0.6 * 0.5; // one layer at level 1: sum 1, duck 0.6 * min(1, sum / 2)
    let n = tone.len();
    let sum: f64 = (0..n).map(|i| (with[i] as f64 - ts * tone[i] as f64).powi(2)).sum();
    (sum / n as f64).sqrt()
}

#[test]
fn each_layer_is_clearly_audible_next_to_the_tone() {
    let mut b = block(0.4);
    b[0] = 200.0;
    b[1] = 10.0;
    b[10] = 0.1;
    b[15] = 60.0;
    b[18] = 110.0;
    b[20] = 6.0;
    b[22] = 70.0;
    let (_, tone) = settle(&b, 20.0);
    let tone_rms = (tone.iter().map(|v| (*v as f64).powi(2)).sum::<f64>() / tone.len() as f64).sqrt();
    assert!(tone_rms > 0.25 && tone_rms < 0.32, "tone rms {tone_rms}");
    let mut cases = vec![("lofi", 8usize, 0.0f32), ("pad", 16, 0.0), ("chime", 19, 0.0), ("perc", 21, 0.0)];
    for kind in [0.0, 1.0, 2.0] {
        cases.push(("inst", 11, kind));
    }
    for (name, slot, kind) in cases {
        let mut p = b;
        p[slot] = 1.0;
        p[12] = kind;
        let r = layer_rms(&p, slot);
        println!("{name} kind {kind}: layer rms {r:.4}");
        assert!(r >= 0.03, "{name} kind {kind} rms {r}");
    }
}

/// Dominant pitch of the window by normalized autocorrelation on an 8x decimated copy.
fn autocorr_hz(x: &[f32], sr: f64) -> f64 {
    let d: Vec<f64> = x.chunks_exact(8).map(|c| c.iter().map(|v| *v as f64).sum::<f64>() / 8.0).collect();
    let fs = sr / 8.0;
    let (lo, hi) = ((fs / 300.0) as usize, (fs / 50.0) as usize);
    let m = d.len() - hi - 1;
    let r: Vec<f64> = (0..=hi)
        .map(|l| {
            if l < lo {
                return 0.0;
            }
            let (mut s, mut e0, mut e1) = (0.0, 0.0, 0.0);
            for i in 0..m {
                s += d[i] * d[i + l];
                e0 += d[i] * d[i];
                e1 += d[i + l] * d[i + l];
            }
            s / (e0 * e1).sqrt().max(1e-30)
        })
        .collect();
    let rmax = r.iter().cloned().fold(0.0, f64::max);
    let mut lag = lo;
    for l in lo + 1..hi {
        if r[l] > 0.85 * rmax && r[l] >= r[l - 1] && r[l] >= r[l + 1] {
            lag = l;
            break;
        }
    }
    let (a, b, c) = (r[lag - 1], r[lag], r[lag + 1]);
    let off = 0.5 * (a - c) / (a - 2.0 * b + c).min(-1e-12);
    fs / (lag as f64 + off)
}

#[test]
fn pluck_pitch_is_right_at_192k_down_to_55_hz() {
    let sr = 192_000.0f32;
    let mut p = [0.0f32; 32];
    p[0] = 1500.0;
    p[1] = 40.0;
    p[2] = 0.5;
    p[6] = 0.05;
    p[11] = 1.0;
    p[12] = 0.0;
    p[13] = 55.0;
    p[14] = 0.0; // semitones 0 2 4 7 9 12 14 16
    p[15] = 30.0; // one note per 2 s
    let allowed: Vec<f64> = [0, 2, 4, 7, 9, 12, 14, 16].iter().map(|s| 55.0 * 2f64.powf(*s as f64 / 12.0)).collect();
    // Subtract the ducked tone (same tone, layer off) so only the plucks remain.
    let mut q = p;
    q[11] = 0.0;
    let mut e = Engine::new(sr);
    e.apply_params(&p);
    let mut tone = Engine::new(sr);
    tone.apply_params(&q);
    let two_s = (sr * 2.0) as usize;
    let mut low = 0;
    for note in 0..12 {
        let x: Vec<f32> = render(&mut e, two_s)
            .iter()
            .zip(render(&mut tone, two_s))
            .map(|(a, b)| a - 0.7 * b)
            .collect();
        if note < 2 {
            continue; // gain ramp still rising
        }
        let w = &x[(sr * 0.1) as usize..(sr * 0.1) as usize + 38_400];
        let hz = autocorr_hz(w, sr as f64);
        let near = allowed.iter().any(|a| (hz / a - 1.0).abs() < 0.03);
        assert!(near, "note {note} pitch {hz} not in scale {allowed:?}");
        if hz < 85.0 {
            low += 1;
        }
    }
    assert!(low >= 1, "no note below 85 Hz was exercised");
}

#[test]
fn no_subnormal_state_remains_over_60_s_with_layers_on_then_off() {
    let mut p = block(0.5);
    for i in [8usize, 11, 16, 19, 21] {
        p[i] = 1.0;
    }
    p[15] = 180.0;
    let mut e = Engine::new(SR);
    e.apply_params(&p);
    for second in 0..60 {
        if second == 5 {
            for i in [8usize, 11, 16, 19, 21] {
                p[i] = 0.0;
            }
            e.apply_params(&p);
        }
        render(&mut e, SR as usize);
        assert_eq!(e.subnormal_count(), 0, "second {second}");
    }
}

#[test]
fn chime_rate_change_takes_effect_within_3_s() {
    let mut p = block(0.5);
    p[19] = 1.0;
    p[20] = 1.0;
    let mut e = Engine::new(SR);
    e.apply_params(&p);
    render(&mut e, (SR * 5.0) as usize);
    p[20] = 30.0;
    e.apply_params(&p);
    let before = e.event_counts()[1];
    render(&mut e, (SR * 3.0) as usize);
    assert!(e.event_counts()[1] > before, "no strike within 3 s of raising the rate");
}

#[test]
fn bpm_change_takes_effect_within_half_a_second() {
    let mut p = block(0.5);
    p[11] = 1.0;
    p[15] = 30.0;
    p[21] = 1.0;
    p[22] = 30.0;
    p[23] = 0.0;
    let mut e = Engine::new(SR);
    e.apply_params(&p);
    render(&mut e, (SR * 0.7) as usize);
    p[15] = 180.0;
    p[22] = 180.0;
    e.apply_params(&p);
    let before = e.event_counts();
    render(&mut e, (SR * 0.5) as usize);
    let after = e.event_counts();
    assert!(after[0] > before[0], "instrument tempo change not applied");
    assert!(after[2] > before[2], "percussion tempo change not applied");
}
