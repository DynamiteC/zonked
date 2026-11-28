//! Sound upgrade tests: violet noise, progressions, piano, breathing, stereo, safety and identity.
use dsp_core::engine::Engine;
use dsp_core::noise::NoiseGen;

fn base() -> [f32; 32] {
    let mut b = [0.0f32; 32];
    b[0] = 150.0;
    b[1] = 6.0;
    b[2] = 0.4;
    b[6] = 0.05;
    b[7] = 1.0;
    b[28] = 0.1;
    b[31] = 0.05;
    b
}

fn render_n(e: &mut Engine, samples: usize) -> (Vec<f32>, Vec<f32>) {
    let (mut l, mut r) = (Vec::with_capacity(samples), Vec::with_capacity(samples));
    let mut left = samples;
    while left > 0 {
        let n = left.min(128);
        e.render(n as u32);
        l.extend_from_slice(&e.out_l[..n]);
        r.extend_from_slice(&e.out_r[..n]);
        left -= n;
    }
    (l, r)
}

fn fnv(e: &mut Engine, seconds: usize) -> u64 {
    let mut x: u64 = 0xcbf2_9ce4_8422_2325;
    for _ in 0..(48_000 * seconds / 128) {
        e.render(128);
        for i in 0..128 {
            for v in [e.out_l[i], e.out_r[i]] {
                x ^= u64::from(v.to_bits());
                x = x.wrapping_mul(0x0000_0100_0000_01b3);
            }
        }
    }
    x
}

fn hash_of(p: &[f32; 32]) -> u64 {
    let mut e = Engine::new(48_000.0);
    e.apply_params(p);
    fnv(&mut e, 10)
}

#[test]
fn legacy_output_is_bit_identical() {
    // Hashes recorded from the engine before the sound upgrade (10 s at 48 kHz, both channels).
    let b = base();
    let expect = [0x548c_9940_4040_e40b, 0x1524_f9c1_3d5c_7e3d, 0x3867_a3d9_4168_f964, 0x659d_e8a4_7564_6d56];
    for (k, want) in expect.iter().enumerate() {
        let mut n = b;
        n[4] = k as f32;
        n[5] = 0.3;
        let got = hash_of(&n);
        assert_eq!(got, *want, "noise kind {k}");
    }
    let mut a = b;
    for (i, v) in [(4, 3.0), (5, 0.2), (8, 0.45), (9, 0.6), (10, 0.1), (11, 0.3), (13, 220.0), (15, 60.0), (16, 0.4), (17, 2.0), (18, 110.0), (21, 0.2), (22, 72.0)] {
        a[i] = v;
    }
    assert_eq!(hash_of(&a), 0x22e8_f003_9dca_e649, "all legacy layers");
    a[12] = 1.0;
    assert_eq!(hash_of(&a), 0xfbec_5648_19fd_26cf, "drone");
    a[12] = 2.0;
    assert_eq!(hash_of(&a), 0x1ad5_b809_98c4_c12b, "bell");
}

fn goertzel_power(x: &[f32], hz: f32, sr: f32) -> f64 {
    let w = 2.0 * std::f64::consts::PI * f64::from(hz) / f64::from(sr);
    let (mut re, mut im) = (0.0f64, 0.0f64);
    for (n, v) in x.iter().enumerate() {
        let a = w * n as f64;
        re += f64::from(*v) * a.cos();
        im -= f64::from(*v) * a.sin();
    }
    re * re + im * im
}

#[test]
fn violet_rises_six_db_per_octave() {
    let mut g = NoiseGen::new(7);
    let v: Vec<f32> = (0..24_000).map(|_| g.sample().violet).collect();
    let band = |c: f32| -> f64 { (0..40).map(|i| goertzel_power(&v, c * (1.0 + 0.012 * i as f32), 48_000.0)).sum::<f64>() / 40.0 };
    let (p1, p2, p3) = (band(500.0), band(1_000.0), band(2_000.0));
    let (d1, d2) = (10.0 * (p2 / p1).log10(), 10.0 * (p3 / p2).log10());
    assert!((4.0..8.0).contains(&d1), "500 to 1000 Hz: {d1} dB");
    assert!((4.0..8.0).contains(&d2), "1000 to 2000 Hz: {d2} dB");
}

#[test]
fn violet_selectable_and_out_of_range_kind_clamps() {
    let mut p = base();
    p[2] = 0.0;
    p[4] = 4.0;
    p[5] = 1.0;
    let mut e = Engine::new(48_000.0);
    e.apply_params(&p);
    p[2] = 0.8;
    e.apply_params(&p);
    let (l, _) = render_n(&mut e, 48_000 * 6);
    let tail = &l[48_000 * 4..];
    let rms = (tail.iter().map(|x| f64::from(*x).powi(2)).sum::<f64>() / tail.len() as f64).sqrt();
    assert!(rms > 0.02, "violet audible, rms {rms}");
    p[4] = 99.0;
    let mut e2 = Engine::new(48_000.0);
    e2.apply_params(&p);
    p[4] = 4.0;
    let mut e3 = Engine::new(48_000.0);
    e3.apply_params(&p);
    assert_eq!(fnv(&mut e2, 2), fnv(&mut e3, 2), "kind 99 clamps to violet");
}

#[test]
fn nan_in_new_slots_keeps_previous_values() {
    let mut p = base();
    p[24] = 2.0;
    p[27] = 0.5;
    p[29] = 0.5;
    let mut a = Engine::new(48_000.0);
    a.apply_params(&p);
    let mut q = p;
    q[24..32].fill(f32::NAN);
    a.apply_params(&q);
    let mut b = Engine::new(48_000.0);
    b.apply_params(&p);
    assert_eq!(fnv(&mut a, 3), fnv(&mut b, 3));
}

fn lofi(prog: f32) -> [f32; 32] {
    let mut p = base();
    p[0] = 20.0; // keep the carrier below the chord band
    p[8] = 1.0;
    p[9] = 0.4;
    p[16] = 0.0;
    p[24] = prog;
    p
}

fn max_step(x: &[f32]) -> f32 {
    x.windows(2).fold(0.0, |m, w| m.max((w[1] - w[0]).abs()))
}

#[test]
fn progression_change_adds_no_click() {
    let mut e = Engine::new(48_000.0);
    e.apply_params(&lofi(2.0));
    render_n(&mut e, 48_000 * 4);
    let (steady, _) = render_n(&mut e, 48_000 * 4);
    let mut worst = 0.0f32;
    for k in 0..16 {
        e.apply_params(&lofi(if k % 2 == 0 { 5.0 } else { 3.0 }));
        let (x, _) = render_n(&mut e, 12_000);
        worst = worst.max(max_step(&x));
    }
    assert!(worst <= max_step(&steady) * 1.5 + 0.002, "step {worst} vs steady {}", max_step(&steady));
}

#[test]
fn progressions_move_the_harmony() {
    let mut e = Engine::new(48_000.0);
    e.apply_params(&lofi(1.0));
    render_n(&mut e, 48_000 * 2);
    let (a, _) = render_n(&mut e, 8_192);
    render_n(&mut e, 48_000 * 12);
    let (b, _) = render_n(&mut e, 8_192);
    let probe = |x: &[f32]| (80..400).map(|f| goertzel_power(x, f as f32, 48_000.0)).enumerate().fold((0, 0.0), |m, (i, p)| if p > m.1 { (i, p) } else { m });
    let (pa, pb) = (probe(&a), probe(&b));
    assert!(pa.0 != pb.0, "dominant bin did not change: {} vs {}", pa.0, pb.0);
}

fn rms_per_second(x: &[f32]) -> Vec<f64> {
    x.chunks(48_000).filter(|c| c.len() == 48_000).map(|c| (c.iter().map(|v| f64::from(*v).powi(2)).sum::<f64>() / 48_000.0).sqrt()).collect()
}

fn swing_db(p: &[f32; 32]) -> f64 {
    let mut e = Engine::new(48_000.0);
    e.apply_params(p);
    let (l, _) = render_n(&mut e, 48_000 * 60);
    let r = rms_per_second(&l);
    let tail = &r[8..];
    let hi = tail.iter().cloned().fold(0.0, f64::max);
    let lo = tail.iter().cloned().fold(f64::MAX, f64::min);
    20.0 * (hi / lo).log10()
}

#[test]
fn breathing_moves_the_level_by_at_least_3_db() {
    let mut p = lofi(2.0);
    p[2] = 0.5;
    p[4] = 2.0;
    p[5] = 0.3;
    p[16] = 0.4;
    p[17] = 2.0;
    let flat = swing_db(&p);
    p[27] = 0.6;
    p[28] = 0.1;
    let moving = swing_db(&p);
    assert!(flat < 1.5, "flat {flat}");
    assert!(moving >= 3.0 && moving > flat + 2.0, "breathing swing {moving} dB, flat {flat} dB");
}

fn pre_peak(p: &[f32; 32]) -> f32 {
    let mut e = Engine::new(48_000.0);
    e.apply_params(p);
    render_n(&mut e, 48_000 * 20);
    e.take_peak()
}

#[test]
fn breathing_width_and_pan_never_raise_the_peak() {
    let mut p = lofi(2.0);
    p[11] = 0.6;
    p[12] = 3.0;
    p[13] = 220.0;
    p[19] = 0.5;
    let flat = pre_peak(&p);
    p[27] = 1.0;
    p[29] = 1.0;
    p[30] = 1.0;
    assert!(pre_peak(&p) <= flat * 1.0001 + 1e-6);
}

#[test]
fn piano_is_audible_and_deterministic() {
    let mut p = base();
    p[11] = 1.0;
    p[12] = 3.0;
    p[13] = 220.0;
    p[14] = 2.0;
    p[15] = 90.0;
    p[26] = 0.6;
    let h1 = hash_of(&p);
    assert_eq!(h1, hash_of(&p), "deterministic");
    let mut e = Engine::new(48_000.0);
    e.apply_params(&p);
    let (l, _) = render_n(&mut e, 48_000 * 20);
    let r = rms_per_second(&l);
    assert!(r[10..].iter().all(|v| *v > 0.2 * 0.28), "tone only would be 0.28 rms, piano adds");
    assert_eq!(e.subnormal_count(), 0);
}

/// Hostile values for every slot, including all new ones.
fn hostile(seed: &mut u64) -> [f32; 32] {
    let pool = [f32::NAN, f32::INFINITY, f32::NEG_INFINITY, 1e38, -1e38, f32::MAX, f32::MIN_POSITIVE / 4.0, -0.0, -3.0, 10.0, 500.0, 1.0, 0.5, 0.0];
    let mut p = [0.0f32; 32];
    for v in p.iter_mut() {
        *seed = seed.wrapping_mul(6_364_136_223_846_793_005).wrapping_add(1_442_695_040_888_963_407);
        let r = (*seed >> 33) as usize;
        *v = if r % 3 == 0 { pool[r % pool.len()] } else { (r % 1000) as f32 / 999.0 * if r % 5 == 0 { 100.0 } else { 1.0 } };
    }
    p
}

#[test]
fn hostile_stress_stays_finite_and_within_limit_at_three_rates() {
    for sr in [8_000.0f32, 48_000.0, 192_000.0] {
        let mut e = Engine::new(sr);
        let mut seed = 0x1234_5678_9abc_def0u64;
        let total = 20_000_000usize;
        let mut done = 0usize;
        let mut worst = 0.0f32;
        let mut k = 0u32;
        while done < total {
            if k % 64 == 0 {
                let mut p = hostile(&mut seed);
                if k % 128 == 0 {
                    // Max out every layer and new sound.
                    p[2] = 0.85;
                    p[4] = 4.0;
                    p[5] = 1.0;
                    for i in [8usize, 11, 16, 19, 21, 25, 26, 27, 29, 30] {
                        p[i] = 1.0;
                    }
                    p[12] = 3.0;
                }
                e.apply_params(&p);
            }
            k += 1;
            let n = 1 + (k as usize % 128);
            e.render(n as u32);
            for v in e.out_l[..n].iter().chain(e.out_r[..n].iter()) {
                assert!(v.is_finite(), "non finite at {sr}");
                worst = worst.max(v.abs());
            }
            done += n;
        }
        assert!(worst <= 0.95, "peak {worst} at {sr}");
        assert_eq!(e.subnormal_count(), 0);
    }
}
