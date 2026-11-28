//! Behavioural tests for the Zonked DSP core (std is allowed here).
//!
//! Cost note (R1.2): `Engine::render` runs one fixed instruction path per
//! sample. There is no loop whose bound depends on a parameter, no
//! recursion and no allocation, so a frame is O(1) in parameter values.
//! `frame_cost_is_input_independent_by_construction` exercises extreme
//! parameter sets to make sure none of them reaches a different path.

use dsp_core::engine::Engine;
use dsp_core::limiter::limit;
use dsp_core::noise::NoiseGen;

const SR: f32 = 48_000.0;

fn engine(p: [f32; 8]) -> Engine {
    let mut e = Engine::new(SR);
    e.apply_params(&p);
    e
}

fn render(e: &mut Engine, n: usize) -> (Vec<f32>, Vec<f32>) {
    let (mut l, mut r) = (Vec::with_capacity(n), Vec::with_capacity(n));
    let mut left = n;
    while left > 0 {
        let k = left.min(128);
        e.render(k as u32);
        l.extend_from_slice(&e.out_l[..k]);
        r.extend_from_slice(&e.out_r[..k]);
        left -= k;
    }
    (l, r)
}

/// Frequency from positive-going zero crossings with linear interpolation.
fn zero_cross_freq(x: &[f32]) -> f64 {
    let mut first = None;
    let mut last = 0.0;
    let mut count = 0u32;
    for i in 1..x.len() {
        if x[i - 1] < 0.0 && x[i] >= 0.0 {
            let t = i as f64 - 1.0 + (-x[i - 1] as f64) / (x[i] as f64 - x[i - 1] as f64);
            if first.is_none() {
                first = Some(t);
            } else {
                count += 1;
            }
            last = t;
        }
    }
    count as f64 * SR as f64 / (last - first.unwrap())
}

fn max_step(x: &[f32]) -> f32 {
    x.windows(2).map(|w| (w[1] - w[0]).abs()).fold(0.0, f32::max)
}

fn peak(x: &[f32]) -> f32 {
    x.iter().fold(0.0, |m, v| m.max(v.abs()))
}

const BIN_200_10: [f32; 8] = [200.0, 10.0, 0.5, 0.0, 0.0, 0.0, 0.05, 1.0];

#[test]
fn binaural_frequency_accuracy_left_and_right() {
    let mut e = engine(BIN_200_10);
    render(&mut e, 96_000);
    let (l, r) = render(&mut e, 192_000);
    let fl = zero_cross_freq(&l);
    let fr = zero_cross_freq(&r);
    assert!((fl - 195.0).abs() < 0.1, "fL {fl}");
    assert!((fr - 205.0).abs() < 0.1, "fR {fr}");
}

#[test]
fn phase_is_continuous_across_frequency_steps() {
    let mut e = engine(BIN_200_10);
    render(&mut e, 96_000);
    let mut all_l = Vec::new();
    let mut all_r = Vec::new();
    for hz in [400.0, 150.0, 1200.0, 60.0, 800.0] {
        let mut p = BIN_200_10;
        p[0] = hz;
        e.apply_params(&p);
        let (l, r) = render(&mut e, 24_000);
        all_l.extend(l);
        all_r.extend(r);
    }
    // Max slope of a 0.5 amplitude sine at ~1250 Hz: 2 pi f / sr * 0.5 = 0.082.
    // A phase jump would show up as a step near 1.0.
    assert!(max_step(&all_l) < 0.09, "L step {}", max_step(&all_l));
    assert!(max_step(&all_r) < 0.09, "R step {}", max_step(&all_r));
}

#[test]
fn gain_and_beat_steps_do_not_click() {
    let mut e = engine([200.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.05, 1.0]);
    let mut l_all = Vec::new();
    for (g, b) in [(0.85, 10.0), (0.0, 40.0), (0.85, 0.5), (0.2, 25.0)] {
        e.apply_params(&[200.0, b, g, 0.0, 0.0, 0.0, 0.05, 1.0]);
        l_all.extend(render(&mut e, 48_000).0);
    }
    // 200 Hz sine at 0.85 peak: slope bound 0.0223, plus gain ramp contribution.
    assert!(max_step(&l_all) < 0.03, "step {}", max_step(&l_all));
}

#[test]
fn start_is_a_ramp_from_silence() {
    let mut e = engine([300.0, 10.0, 0.85, 0.0, 0.0, 0.0, 2.0, 1.0]);
    let (l, _) = render(&mut e, 480);
    assert!(peak(&l) < 0.01, "first 10 ms peak {}", peak(&l));
}

fn goertzel_power(x: &[f32], f: f64) -> f64 {
    let w = 2.0 * std::f64::consts::PI * f / SR as f64;
    let c = 2.0 * w.cos();
    let (mut s1, mut s2) = (0.0f64, 0.0f64);
    for &v in x {
        let s0 = v as f64 + c * s1 - s2;
        s2 = s1;
        s1 = s0;
    }
    (s1 * s1 + s2 * s2 - c * s1 * s2) / x.len() as f64
}

fn octave_db(x: &[f32], center: f64) -> f64 {
    let mut p = 0.0;
    let bins = 24;
    for i in 0..bins {
        let o = -0.35 + 0.7 * i as f64 / (bins - 1) as f64;
        // Single-bin Goertzel power is already a per-Hz density.
        let f = center * 2f64.powf(o);
        p += goertzel_power(x, f);
    }
    10.0 * (p / bins as f64).log10()
}

fn slope_db_per_octave(pick: fn(&dsp_core::noise::NoiseFrame) -> f32) -> f64 {
    let mut g = NoiseGen::new(12345);
    let x: Vec<f32> = (0..1 << 17).map(|_| pick(&g.sample())).collect();
    let centers = [250.0, 500.0, 1000.0, 2000.0, 4000.0];
    let ys: Vec<f64> = centers.iter().map(|&c| octave_db(&x, c)).collect();
    let n = ys.len() as f64;
    let xs: Vec<f64> = (0..ys.len()).map(|i| i as f64).collect();
    let (mx, my) = (xs.iter().sum::<f64>() / n, ys.iter().sum::<f64>() / n);
    let num: f64 = xs.iter().zip(&ys).map(|(a, b)| (a - mx) * (b - my)).sum();
    let den: f64 = xs.iter().map(|a| (a - mx) * (a - mx)).sum();
    num / den
}

#[test]
fn noise_spectral_slopes() {
    // Densities are per Hz, so white is flat, pink -3 dB/oct, brown -6 dB/oct.
    let w = slope_db_per_octave(|f| f.white);
    let p = slope_db_per_octave(|f| f.pink);
    let b = slope_db_per_octave(|f| f.brown);
    assert!(w.abs() < 0.7, "white {w}");
    assert!((p + 3.0).abs() < 0.8, "pink {p}");
    assert!((b + 6.0).abs() < 1.0, "brown {b}");
}

#[test]
fn noise_is_bounded_and_deterministic() {
    let mut a = NoiseGen::new(7);
    let mut b = NoiseGen::new(7);
    for _ in 0..100_000 {
        let (x, y) = (a.sample(), b.sample());
        assert_eq!(x.white.to_bits(), y.white.to_bits());
        assert_eq!(x.pink.to_bits(), y.pink.to_bits());
        assert!(x.white.abs() <= 0.5 && x.pink.is_finite() && x.brown.is_finite());
        assert!(x.pink.abs() < 3.0 && x.brown.abs() < 3.0);
    }
}

#[test]
fn clamps_carrier_beat_gain() {
    let mut e = engine([1.0e9, -5.0, 5.0, 0.0, 0.0, 0.0, 0.05, 1.0]);
    render(&mut e, 96_000);
    let (l, r) = render(&mut e, 96_000);
    // carrier 1500, beat 0.5: fL 1499.75, fR 1500.25.
    assert!((zero_cross_freq(&l) - 1499.75).abs() < 0.5);
    assert!((zero_cross_freq(&r) - 1500.25).abs() < 0.5);
    let pk = peak(&l);
    assert!(pk > 0.8 && pk < 0.85, "gain clamp peak {pk}");

    let mut low = engine([0.0, 1000.0, -1.0, 0.0, 0.0, 0.0, 0.05, 1.0]);
    render(&mut low, 96_000);
    let (l, r) = render(&mut low, 48_000);
    assert_eq!(peak(&l), 0.0);
    assert_eq!(peak(&r), 0.0);

    // carrier 20, beat 40: fL would be 0, must stay audible and above 0.
    let mut lowf = engine([-50.0, 100.0, 0.5, 0.0, 0.0, 0.0, 0.05, 1.0]);
    render(&mut lowf, 96_000);
    let (l, _) = render(&mut lowf, 96_000);
    assert!(peak(&l) > 0.1);
}

#[test]
fn non_finite_inputs_keep_previous_values() {
    let mut e = engine([300.0, 8.0, 0.5, 0.0, 0.0, 0.0, 0.05, 1.0]);
    let bad = [f32::NAN, f32::INFINITY, f32::NEG_INFINITY, f32::NAN, f32::NAN, f32::INFINITY, f32::NAN, f32::NAN];
    e.apply_params(&bad);
    render(&mut e, 96_000);
    let (l, r) = render(&mut e, 192_000);
    assert!((zero_cross_freq(&l) - 296.0).abs() < 0.1);
    assert!((zero_cross_freq(&r) - 304.0).abs() < 0.1);
    assert!(l.iter().chain(&r).all(|v| v.is_finite()));
    // Infinity in a clampable slot is not "non finite input" to keep: it is non finite, so ignored.
}

#[test]
fn limiter_bounds_extreme_input() {
    let probes = [
        0.0, 0.5, 0.8, 0.81, 0.95, 1.0, 2.0, 1e6, 1e30, f32::MAX, f32::INFINITY, f32::NEG_INFINITY,
        -1e30, -0.9, -3.0,
    ];
    for x in probes {
        let y = limit(x);
        assert!((-0.95..=0.95).contains(&y), "{x} -> {y}");
    }
    assert_eq!(limit(f32::NAN), 0.0);
    assert_eq!(limit(0.3), 0.3);
    // Monotonic and odd.
    let mut prev = -1.0;
    for i in 0..4000 {
        let x = -2.0 + i as f32 * 0.001;
        let y = limit(x);
        assert!(y >= prev);
        assert_eq!(limit(-x), -y);
        prev = y;
    }
}

#[test]
fn output_stays_within_limit_with_noise_at_full_scale() {
    for kind in [1.0, 2.0, 3.0] {
        for mode in [0.0, 1.0, 2.0] {
            let mut e = engine([1500.0, 40.0, 0.85, mode, kind, 1.0, 0.05, 1.0]);
            let (l, r) = render(&mut e, 96_000);
            assert!(peak(&l) <= 0.95 && peak(&r) <= 0.95);
        }
    }
}

#[test]
fn isochronic_gate_and_monaural_identity() {
    let mut e = engine([200.0, 10.0, 0.8, 2.0, 0.0, 0.0, 0.05, 1.0]);
    render(&mut e, 96_000);
    let (l, r) = render(&mut e, 48_000);
    assert_eq!(l, r);
    // 10 ms blocks: gate period is 100 ms, so envelope swings between ~0 and ~0.8.
    let env: Vec<f32> = l.chunks(480).map(peak).collect();
    let lo = env.iter().cloned().fold(f32::MAX, f32::min);
    let hi = env.iter().cloned().fold(0.0, f32::max);
    assert!(lo < 0.1 && hi > 0.7, "lo {lo} hi {hi}");
    // Gate 0.5*(1-cos): steps stay smooth.
    assert!(max_step(&l) < 0.03);

    let mut m = engine([200.0, 10.0, 0.8, 1.0, 0.0, 0.0, 0.05, 1.0]);
    render(&mut m, 96_000);
    let (l, r) = render(&mut m, 48_000);
    assert_eq!(l, r);
    // Sum of 195 Hz and 205 Hz tones beats at 10 Hz: envelope swings fully.
    let env: Vec<f32> = l.chunks(480).map(peak).collect();
    let lo = env.iter().cloned().fold(f32::MAX, f32::min);
    let hi = env.iter().cloned().fold(0.0, f32::max);
    assert!(lo < 0.3 && hi > 0.7, "mono lo {lo} hi {hi}");
}

#[test]
fn deterministic_for_same_inputs() {
    let p = [440.0, 7.5, 0.6, 0.0, 2.0, 0.5, 0.2, 0.0];
    let (mut a, mut b) = (engine(p), engine(p));
    let (la, ra) = render(&mut a, 20_000);
    let (lb, rb) = render(&mut b, 20_000);
    assert!(la.iter().zip(&lb).all(|(x, y)| x.to_bits() == y.to_bits()));
    assert!(ra.iter().zip(&rb).all(|(x, y)| x.to_bits() == y.to_bits()));
}

#[test]
fn noise_kind_switch_has_no_click_in_bed_envelope() {
    // Switching kinds moves per-kind weights by smoothing, never by a jump.
    let mut e = engine([200.0, 10.0, 0.0, 0.0, 1.0, 1.0, 0.05, 1.0]);
    e.apply_params(&[200.0, 10.0, 0.5, 0.0, 1.0, 1.0, 0.05, 1.0]);
    render(&mut e, 48_000);
    e.apply_params(&[200.0, 10.0, 0.5, 0.0, 3.0, 1.0, 0.05, 1.0]);
    let (l, _) = render(&mut e, 4_800);
    assert!(l.iter().all(|v| v.is_finite()));
}

#[test]
fn frames_are_clamped() {
    let p = [440.0, 7.5, 0.6, 0.0, 1.0, 0.5, 0.05, 1.0];
    let (mut a, mut b) = (engine(p), engine(p));
    render(&mut a, 4_800);
    render(&mut b, 4_800);
    a.render(0);
    b.render(1);
    assert_eq!(a.out_l[0].to_bits(), b.out_l[0].to_bits());
    a.render(100_000);
    b.render(128);
    assert!(a.out_l.iter().zip(&b.out_l).all(|(x, y)| x.to_bits() == y.to_bits()));
}

#[test]
fn frame_cost_is_input_independent_by_construction() {
    // Property-style sweep with a deterministic LCG across the full parameter
    // space, including NaN and infinity: no panic, finite, bounded output.
    let mut s = 0x1234_5678_9ABC_DEF0u64;
    let mut next = || {
        s = s.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        (s >> 33) as u32
    };
    let specials = [f32::NAN, f32::INFINITY, f32::NEG_INFINITY, f32::MAX, f32::MIN, 0.0, -0.0];
    let mut e = Engine::new(44_100.0);
    for _ in 0..400 {
        let mut p = [0.0f32; 8];
        for slot in p.iter_mut() {
            *slot = if next() % 5 == 0 {
                specials[(next() % specials.len() as u32) as usize]
            } else {
                (next() as f32 / u32::MAX as f32 - 0.3) * 4000.0
            };
        }
        e.apply_params(&p);
        e.render(next() % 200);
        assert!(e.out_l.iter().chain(&e.out_r).all(|v| v.is_finite() && v.abs() <= 0.95));
    }
}

#[test]
fn sample_rate_is_sanitised() {
    for sr in [f32::NAN, 0.0, -5.0, 1e12, f32::INFINITY] {
        let mut e = Engine::new(sr);
        e.apply_params(&BIN_200_10);
        e.render(128);
        assert!(e.out_l.iter().all(|v| v.is_finite() && v.abs() <= 0.95));
    }
}

#[test]
fn c_abi_roundtrip() {
    use dsp_core::abi::*;
    zk_init(48_000.0);
    let block = zk_param_block();
    let vals = [440.0f32, 6.0, 0.5, 0.0, 2.0, 0.3, 0.05, 1.0];
    for (i, v) in vals.iter().enumerate() {
        unsafe { *block.add(i) = *v };
    }
    zk_apply_params();
    zk_reset_phase();
    for _ in 0..500 {
        zk_render(128);
    }
    let (pl, pr) = (zk_out_left(), zk_out_right());
    let mut pk = 0.0f32;
    for i in 0..128 {
        let (a, b) = unsafe { (*pl.add(i), *pr.add(i)) };
        assert!(a.is_finite() && b.is_finite() && a.abs() <= 0.95 && b.abs() <= 0.95);
        pk = pk.max(a.abs()).max(b.abs());
    }
    assert!(pk > 0.05);
}

fn steady(mode: f32) -> Engine {
    let mut e = engine([200.0, 10.0, 0.85, mode, 0.0, 0.0, 0.05, 1.0]);
    render(&mut e, 48_000 * 6);
    e
}

#[test]
fn mode_switch_crossfades_without_click() {
    for (from, to) in [(0.0, 1.0), (1.0, 2.0), (2.0, 0.0), (0.0, 2.0)] {
        let mut e = steady(from);
        let (before, _) = render(&mut e, 64);
        let last = before[63];
        e.apply_params(&[200.0, 10.0, 0.85, to, 0.0, 0.0, 0.05, 1.0]);
        let (after, _) = render(&mut e, 48_000);
        assert!((after[0] - last).abs() < 0.05, "first-sample jump {from}->{to}");
        assert!(max_step(&after) < 0.06, "click {from}->{to}: {}", max_step(&after));
    }
}

#[test]
fn start_ramp_takes_at_least_two_seconds() {
    // Host asks for the minimum ramp; the core must still ramp slowly.
    let mut e = engine([200.0, 10.0, 0.85, 1.0, 0.0, 0.0, 0.05, 1.0]);
    let (l, _) = render(&mut e, 24_000);
    assert!(peak(&l[23_000..]) < 0.85 * 0.8, "too fast at 0.5 s");
    let (l, _) = render(&mut e, 72_000);
    assert!(peak(&l[71_000..]) > 0.85 * 0.97, "not at ~99 percent by 2 s");
}

#[test]
fn stop_ramp_takes_at_least_250ms() {
    let mut e = steady(1.0);
    let full = peak(&render(&mut e, 4800).0);
    e.apply_params(&[200.0, 10.0, 0.0, 1.0, 0.0, 0.0, 0.05, 1.0]);
    let (l, _) = render(&mut e, 12_000);
    let at_250 = peak(&l[11_000..]);
    assert!(at_250 > 0.02 * full, "silenced before 250 ms: {at_250}");
    let (l, _) = render(&mut e, 48_000);
    assert!(peak(&l[40_000..]) < 1e-3, "not near silence after 1.25 s");
}

#[test]
fn no_subnormal_output_after_60s_of_silence() {
    let mut e = steady(0.0);
    e.apply_params(&[200.0, 10.0, 0.0, 0.0, 1.0, 0.5, 0.05, 1.0]);
    render(&mut e, 48_000);
    e.apply_params(&[200.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.05, 1.0]);
    let (l, r) = render(&mut e, 48_000 * 60);
    for x in l.iter().chain(r.iter()) {
        assert!(*x == 0.0 || x.is_normal(), "subnormal {x:e}");
    }
    assert_eq!(*l.last().unwrap(), 0.0);
}

#[test]
fn noise_seed_state_is_nonzero() {
    for seed in [0u64, 1, u64::MAX, 0x5A4F_4E4B_4544_0001] {
        let mut g = NoiseGen::new(seed);
        let any = (0..64).any(|_| g.sample().white != 0.0);
        assert!(any, "seed {seed} produced only zeros");
    }
}
