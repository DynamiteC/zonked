//! Beat voice level (slot 7): sanitizing, smoothing, silence at 0, identity at 1.
use dsp_core::engine::Engine;

const SR: f32 = 48_000.0;

fn block(level: f32, noise_kind: f32, noise_level: f32) -> [f32; 32] {
    let mut p = [0.0f32; 32];
    p[0] = 200.0;
    p[1] = 10.0;
    p[2] = 0.5;
    p[4] = noise_kind;
    p[5] = noise_level;
    p[6] = 0.05;
    p[7] = level;
    p
}

fn run(e: &mut Engine, n: usize) -> (Vec<f32>, Vec<f32>) {
    let (mut l, mut r) = (Vec::new(), Vec::new());
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

fn settled(p: &[f32]) -> Engine {
    let mut e = Engine::new(SR);
    e.apply_params(p);
    run(&mut e, 240_000);
    e
}

fn energy(x: &[f32]) -> f64 {
    x.iter().map(|v| f64::from(*v) * f64::from(*v)).sum()
}

#[test]
fn level_zero_gives_exactly_zero_with_no_noise() {
    let mut e = settled(&block(0.0, 0.0, 0.0));
    let (l, r) = run(&mut e, 48_000);
    assert!(l.iter().chain(&r).all(|v| *v == 0.0));
}

#[test]
fn level_zero_keeps_noise_and_drops_only_the_beat() {
    let mut a = settled(&block(0.0, 2.0, 0.5));
    let (l, _) = run(&mut a, 48_000);
    let mut noise_only = settled(&{
        let mut p = block(0.0, 2.0, 0.5);
        p[2] = 0.5;
        p
    });
    let (n, _) = run(&mut noise_only, 48_000);
    assert!(energy(&l) > 1.0, "noise must still play");
    assert_eq!(l, n, "deterministic");
    let mut with_beat = settled(&block(1.0, 2.0, 0.5));
    let (b, _) = run(&mut with_beat, 48_000);
    assert!(energy(&b) > energy(&l) * 1.5, "beat voice adds energy");
}

#[test]
fn level_one_is_default_and_matches_missing_slot() {
    let mut full = Engine::new(SR);
    full.apply_params(&block(1.0, 2.0, 0.4));
    let mut short = Engine::new(SR);
    short.apply_params(&block(1.0, 2.0, 0.4)[..7]);
    let (a, _) = run(&mut full, 20_000);
    let (b, _) = run(&mut short, 20_000);
    assert!(a.iter().zip(&b).all(|(x, y)| x.to_bits() == y.to_bits()));
}

#[test]
fn smoothing_has_no_step_in_either_direction() {
    let mut e = settled(&block(1.0, 0.0, 0.0));
    let (before, _) = run(&mut e, 480);
    e.apply_params(&block(0.0, 0.0, 0.0));
    let (down, _) = run(&mut e, 9_600);
    e.apply_params(&block(1.0, 0.0, 0.0));
    let (up, _) = run(&mut e, 9_600);
    // A 200 Hz tone at gain 0.5 moves at most ~0.013 per sample by itself.
    let step = |x: &[f32]| x.windows(2).map(|w| (w[1] - w[0]).abs()).fold(0.0f32, f32::max);
    let free = step(&before);
    assert!(step(&down) <= free + 0.002, "down {} free {free}", step(&down));
    assert!(step(&up) <= free + 0.002, "up {} free {free}", step(&up));
    assert!(down.last().is_some_and(|v| v.abs() < 1e-4), "reached silence");
}

#[test]
fn out_of_range_is_clamped_and_non_finite_keeps_last_good() {
    let mut hi = settled(&block(50.0, 0.0, 0.0));
    let mut one = settled(&block(1.0, 0.0, 0.0));
    let (a, _) = run(&mut hi, 4_800);
    let (b, _) = run(&mut one, 4_800);
    assert!(a.iter().zip(&b).all(|(x, y)| x.to_bits() == y.to_bits()), "above 1 clamps to 1");
    let mut neg = settled(&block(-3.0, 0.0, 0.0));
    let (z, _) = run(&mut neg, 4_800);
    assert!(z.iter().all(|v| *v == 0.0), "below 0 clamps to 0");
    for bad in [f32::NAN, f32::INFINITY, f32::NEG_INFINITY] {
        let mut e = settled(&block(0.0, 0.0, 0.0));
        let mut p = block(bad, 0.0, 0.0);
        p[7] = bad;
        e.apply_params(&p);
        let (o, _) = run(&mut e, 4_800);
        assert!(o.iter().all(|v| *v == 0.0), "{bad} keeps level 0");
        let mut e = settled(&block(1.0, 0.0, 0.0));
        e.apply_params(&p);
        let (o, _) = run(&mut e, 4_800);
        assert!(energy(&o) > 1.0, "{bad} keeps level 1");
    }
}

#[test]
fn safety_bounds_hold_at_every_level() {
    for level in [0.0, 0.3, 1.0] {
        let mut p = block(level, 3.0, 1.0);
        p[0] = 1500.0;
        p[1] = 40.0;
        p[2] = 0.85;
        let mut e = Engine::new(SR);
        e.apply_params(&p);
        let (l, r) = run(&mut e, 96_000);
        assert!(l.iter().chain(&r).all(|v| v.is_finite() && v.abs() <= 0.95));
    }
}
