// Pure maths for the made-by-Zonked nature sounds. No Web Audio, no Math.random.
// Everything here is deterministic for a given seed, so tests are stable.

/** Seeded generator (mulberry32). Returns floats in [0, 1). */
export function makeRng(seed: number): () => number {
  let s = (Number.isFinite(seed) ? Math.trunc(seed) : 0) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Finite number in [lo, hi]. NaN and infinity fall back to `fallback`, which is clamped too. */
export function clampFinite(v: number, lo: number, hi: number, fallback = lo): number {
  const f = Number.isFinite(fallback) ? fallback : lo;
  const x = Number.isFinite(v) ? v : f;
  return x < lo ? lo : x > hi ? hi : x;
}

/** Sample rate guard: 8 kHz to 192 kHz. */
export const safeRate = (sr: number): number => clampFinite(sr, 8000, 192000, 48000);

export interface Biquad { b0: number; b1: number; b2: number; a1: number; a2: number }

function norm(b0: number, b1: number, b2: number, a0: number, a1: number, a2: number): Biquad {
  return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0 };
}

/** RBJ low-pass. Cutoff is kept under 0.45 of the sample rate. */
export function lowpass(sr: number, hz: number, q = 0.7071): Biquad {
  const w = (2 * Math.PI * clampFinite(hz, 5, 0.45 * sr, 1000)) / sr;
  const al = Math.sin(w) / (2 * q);
  const c = Math.cos(w);
  return norm((1 - c) / 2, 1 - c, (1 - c) / 2, 1 + al, -2 * c, 1 - al);
}

/** RBJ high-pass. */
export function highpass(sr: number, hz: number, q = 0.7071): Biquad {
  const w = (2 * Math.PI * clampFinite(hz, 5, 0.45 * sr, 40)) / sr;
  const al = Math.sin(w) / (2 * q);
  const c = Math.cos(w);
  return norm((1 + c) / 2, -(1 + c), (1 + c) / 2, 1 + al, -2 * c, 1 - al);
}

/** RBJ band-pass (constant 0 dB peak gain). */
export function bandpass(sr: number, hz: number, q: number): Biquad {
  const w = (2 * Math.PI * clampFinite(hz, 5, 0.45 * sr, 500)) / sr;
  const al = Math.sin(w) / (2 * clampFinite(q, 0.1, 20, 1));
  return norm(al, 0, -al, 1 + al, -2 * Math.cos(w), 1 - al);
}

/** Run a biquad over a buffer in place (direct form 1). */
export function runBiquad(x: Float32Array, f: Biquad): void {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i] ?? 0;
    const y = f.b0 * v + f.b1 * x1 + f.b2 * x2 - f.a1 * y1 - f.a2 * y2;
    x2 = x1; x1 = v; y2 = y1; y1 = y;
    x[i] = y;
  }
}

/** White noise in [-1, 1). */
export function whiteNoise(n: number, rng: () => number): Float32Array {
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = rng() * 2 - 1;
  return out;
}

/** Pink-ish noise, Paul Kellet's economy filter. About -3 dB per octave. */
export function pinkNoise(n: number, rng: () => number): Float32Array {
  const out = new Float32Array(n);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < n; i++) {
    const w = rng() * 2 - 1;
    b0 = 0.99765 * b0 + w * 0.099046;
    b1 = 0.963 * b1 + w * 0.2965164;
    b2 = 0.57 * b2 + w * 1.0526913;
    out[i] = (b0 + b1 + b2 + w * 0.1848) * 0.25;
  }
  return out;
}

/**
 * Make a buffer loop with no click: blend the last `fade` samples of a longer render
 * into the first ones (equal power). `x` must hold n + fade samples.
 */
export function loopSeam(x: Float32Array, n: number): Float32Array {
  const fade = x.length - n;
  const out = x.slice(0, n);
  for (let i = 0; i < fade; i++) {
    const a = Math.sin(((i + 0.5) / fade) * (Math.PI / 2));
    const b = Math.cos(((i + 0.5) / fade) * (Math.PI / 2));
    out[i] = (x[i] ?? 0) * a + (x[n + i] ?? 0) * b;
  }
  return out;
}

/** Remove the mean, then scale so the largest magnitude equals `peak`. Non-finite values become 0. */
export function trimAndScale(x: Float32Array, peak: number): void {
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i] ?? 0;
    if (!Number.isFinite(v)) x[i] = 0;
    sum += x[i] ?? 0;
  }
  const mean = x.length > 0 ? sum / x.length : 0;
  let max = 0;
  for (let i = 0; i < x.length; i++) {
    const v = (x[i] ?? 0) - mean;
    x[i] = v;
    if (Math.abs(v) > max) max = Math.abs(v);
  }
  const g = max > 1e-9 ? peak / max : 0;
  for (let i = 0; i < x.length; i++) x[i] = (x[i] ?? 0) * g;
}
