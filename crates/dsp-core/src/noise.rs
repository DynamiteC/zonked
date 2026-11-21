//! Xoshiro256** generator and white, pink (Kellet) and brown noise.

/// SplitMix64 step, used to seed Xoshiro.
fn splitmix64(state: &mut u64) -> u64 {
    *state = state.wrapping_add(0x9E37_79B9_7F4A_7C15);
    let mut z = *state;
    z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    z ^ (z >> 31)
}

/// Xoshiro256** with fixed-size state.
#[derive(Clone)]
pub struct Xoshiro256 {
    s: [u64; 4],
}

impl Xoshiro256 {
    pub fn new(seed: u64) -> Self {
        let mut sm = seed;
        let mut s = [
            splitmix64(&mut sm),
            splitmix64(&mut sm),
            splitmix64(&mut sm),
            splitmix64(&mut sm),
        ];
        // The all-zero state is a fixed point of xoshiro; never allow it.
        if s == [0; 4] {
            s[0] = 1;
        }
        Self { s }
    }

    #[inline]
    pub fn next_u64(&mut self) -> u64 {
        let [s0, s1, s2, s3] = self.s;
        let result = s1.wrapping_mul(5).rotate_left(7).wrapping_mul(9);
        let t = s1 << 17;
        let s2 = s2 ^ s0;
        let s3 = s3 ^ s1;
        let s1 = s1 ^ s2;
        let s0 = s0 ^ s3;
        let s2 = s2 ^ t;
        let s3 = s3.rotate_left(45);
        self.s = [s0, s1, s2, s3];
        result
    }

    /// Uniform in `[-1, 1)`.
    #[inline]
    pub fn next_bipolar(&mut self) -> f32 {
        ((self.next_u64() >> 40) as f32) * (1.0 / 8_388_608.0) - 1.0
    }
}

/// One noise channel producing white, pink and brown in lockstep.
#[derive(Clone)]
pub struct NoiseGen {
    rng: Xoshiro256,
    b0: f32,
    b1: f32,
    b2: f32,
    brown: f32,
    prev_w: f32,
    violet_lp: f32,
}

/// One sample of each colour, roughly matched in loudness.
#[derive(Clone, Copy, Default)]
pub struct NoiseFrame {
    pub white: f32,
    pub pink: f32,
    pub brown: f32,
    /// Differentiated white (+6 dB per octave), softly low-passed.
    pub violet: f32,
}

impl NoiseGen {
    pub fn new(seed: u64) -> Self {
        Self {
            rng: Xoshiro256::new(seed),
            b0: 0.0,
            b1: 0.0,
            b2: 0.0,
            brown: 0.0,
            prev_w: 0.0,
            violet_lp: 0.0,
        }
    }

    #[inline]
    pub fn sample(&mut self) -> NoiseFrame {
        let w = self.rng.next_bipolar();
        // Paul Kellet economy pinking filter (3 poles).
        self.b0 = 0.997_65 * self.b0 + w * 0.099_046_0;
        self.b1 = 0.963_00 * self.b1 + w * 0.296_516_4;
        self.b2 = 0.570_00 * self.b2 + w * 1.052_691_3;
        let pink = self.b0 + self.b1 + self.b2 + w * 0.1848;
        // Leaky integrator, 6 dB per octave above roughly 15 Hz.
        self.brown = 0.998 * self.brown + 0.02 * w;
        // Violet: first difference of white, then a gentle one-pole low-pass
        // (about 9 kHz at 48 kHz) so the top octave does not sting.
        let diff = (w - self.prev_w) * 0.6;
        self.prev_w = w;
        self.violet_lp += 0.55 * (diff - self.violet_lp);
        if self.violet_lp < 1e-20 && self.violet_lp > -1e-20 {
            self.violet_lp = 0.0;
        }
        NoiseFrame {
            violet: self.violet_lp,
            white: w * 0.5,
            pink: pink * 0.17,
            brown: self.brown * 1.6,
        }
    }
}
