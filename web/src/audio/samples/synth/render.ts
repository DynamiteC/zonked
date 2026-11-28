// Looping noise beds made in code: soft wind and waterfall.
// The layer plays two loops of different length at once, so the mix never repeats exactly.
import {
  bandpass, clampFinite, highpass, loopSeam, lowpass, makeRng, pinkNoise, runBiquad, safeRate,
  trimAndScale, whiteNoise,
} from './dsp';

/** Peak of one rendered loop. Two loops sum, then the layer gain applies: stays under -6 dBFS. */
export const BED_PEAK = 0.25;
/** Seam blend length in seconds. */
const SEAM_SEC = 0.25;

/** Pick `count` frequencies k/T inside [lo, hi] Hz so a sine fits a whole number of times in T seconds. */
export function loopFreqs(seconds: number, lo: number, hi: number, count: number, rng: () => number): number[] {
  const kMin = Math.max(1, Math.ceil(lo * seconds));
  const kMax = Math.max(kMin, Math.floor(hi * seconds));
  return Array.from({ length: count }, () => (kMin + Math.floor(rng() * (kMax - kMin + 1))) / seconds);
}

/** Smooth positive curve built from slow sines. Output in [floor, 1]. */
export function slowCurve(n: number, sr: number, freqs: number[], rng: () => number, floor: number): Float32Array {
  const phases = freqs.map(() => rng() * 2 * Math.PI);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < freqs.length; j++) s += Math.sin(2 * Math.PI * (freqs[j] ?? 0) * (i / sr) + (phases[j] ?? 0));
    out[i] = floor + ((1 - floor) * (0.5 + (0.5 * s) / freqs.length));
  }
  return out;
}

export type BedKind = 'wind' | 'waterfall';

/** Soft wind: noise through a 200 to 900 Hz band, with gusts that swell at 0.05 to 0.2 Hz. */
function windBed(sr: number, total: number, seconds: number, rng: () => number): Float32Array {
  const x = whiteNoise(total, rng);
  runBiquad(x, bandpass(sr, Math.sqrt(200 * 900), Math.sqrt(200 * 900) / 700));
  const gust = slowCurve(total, sr, loopFreqs(seconds, 0.05, 0.2, 3, rng), rng, 0.12);
  for (let i = 0; i < total; i++) x[i] = (x[i] ?? 0) * (gust[i] ?? 0);
  return x;
}

/** Waterfall: pink noise rolled off above 6 kHz, plus a mid layer with a slow texture. */
function waterfallBed(sr: number, total: number, seconds: number, rng: () => number): Float32Array {
  const body = pinkNoise(total, rng);
  runBiquad(body, lowpass(sr, 6000));
  runBiquad(body, lowpass(sr, 6000));
  const mid = whiteNoise(total, rng);
  runBiquad(mid, lowpass(sr, 2500));
  const tex = slowCurve(total, sr, loopFreqs(seconds, 0.1, 0.3, 2, rng), rng, 0.6);
  for (let i = 0; i < total; i++) body[i] = (body[i] ?? 0) * 0.7 + (mid[i] ?? 0) * 0.5 * (tex[i] ?? 0);
  runBiquad(body, highpass(sr, 40));
  return body;
}

/**
 * Render one seamless loop of `seconds` seconds. Same inputs give the same samples.
 * Seconds is kept between 5 and 60. Peak equals BED_PEAK and the mean is zero.
 */
export function renderBed(kind: BedKind, sampleRate: number, seed: number, seconds: number): Float32Array {
  const sr = safeRate(sampleRate);
  const secs = clampFinite(seconds, 5, 60, 20);
  const n = Math.round(secs * sr);
  const total = n + Math.round(SEAM_SEC * sr);
  const rng = makeRng(seed);
  const raw = kind === 'wind' ? windBed(sr, total, secs, rng) : waterfallBed(sr, total, secs, rng);
  const out = loopSeam(raw, n);
  trimAndScale(out, BED_PEAK);
  return out;
}

/** Loop lengths in seconds. Two different lengths give a long combined period. */
export const BED_SECONDS: readonly [number, number] = [20, 14];
