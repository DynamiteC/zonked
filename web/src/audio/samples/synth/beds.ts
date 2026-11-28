// More looping beds made in code: rain on a roof, brown noise, ocean swell, campfire crackle and night crickets.
// Same rules as render.ts: seeded, no Math.random, seamless loop, mean removed, peak set per kind.
import {
  bandpass, clampFinite, highpass, loopSeam, lowpass, makeRng, pinkNoise, runBiquad, safeRate,
  trimAndScale, whiteNoise,
} from './dsp';
import { BED_PEAK, loopFreqs, renderBed, slowCurve } from './render';
import type { BedKind } from './render';

export type ExtraBedKind = 'rainroof' | 'brown' | 'swell' | 'crackle' | 'crickets';
export type AnyBedKind = BedKind | ExtraBedKind;

const SEAM_SEC = 0.25;
/** Crickets are meant to sit far back, so their loop peaks lower than the other beds. */
export const CRICKET_PEAK = 0.1;
const peakOf = (kind: ExtraBedKind): number => (kind === 'crickets' ? CRICKET_PEAK : BED_PEAK);

/** Add a decaying noise burst (a drop or a pop) at sample `at`. Runs at most 6 time constants. */
function addBurst(x: Float32Array, at: number, amp: number, tauSamples: number, rng: () => number): void {
  const len = Math.min(x.length - at, Math.ceil(tauSamples * 6));
  for (let k = 0; k < len; k++) x[at + k] = (x[at + k] ?? 0) + amp * (rng() * 2 - 1) * Math.exp(-k / tauSamples);
}

/** Rain on a roof: a steady hiss plus many small drops (about 80 per second) in the 1.5 to 5 kHz range. */
function rainRoof(sr: number, total: number, rng: () => number): Float32Array {
  const hiss = pinkNoise(total, rng);
  runBiquad(hiss, highpass(sr, 400));
  runBiquad(hiss, lowpass(sr, 7000));
  const drops = new Float32Array(total);
  const count = Math.round((total / sr) * 80);
  for (let i = 0; i < count; i++) addBurst(drops, Math.floor(rng() * total), 0.15 + 0.85 * rng() ** 3, sr * 0.0015, rng);
  runBiquad(drops, bandpass(sr, 3000, 0.8));
  for (let i = 0; i < total; i++) hiss[i] = (hiss[i] ?? 0) * 0.6 + (drops[i] ?? 0) * 2.5;
  return hiss;
}

/** Brown noise: white noise through a leaky integrator, about -6 dB per octave. */
function brownNoise(sr: number, total: number, rng: () => number): Float32Array {
  const x = whiteNoise(total, rng);
  let y = 0;
  for (let i = 0; i < total; i++) { y = 0.998 * y + 0.05 * (x[i] ?? 0); x[i] = y; }
  runBiquad(x, highpass(sr, 25));
  runBiquad(x, lowpass(sr, 1500));
  return x;
}

/** Ocean swell: filtered noise whose level and brightness rise and fall every 7 to 12 s. */
function oceanSwell(sr: number, total: number, seconds: number, rng: () => number): Float32Array {
  const body = pinkNoise(total, rng);
  runBiquad(body, lowpass(sr, 1200));
  const foam = whiteNoise(total, rng);
  runBiquad(foam, bandpass(sr, 2200, 0.7));
  const wave = slowCurve(total, sr, loopFreqs(seconds, 0.08, 0.14, 2, rng), rng, 0.05);
  for (let i = 0; i < total; i++) {
    const w = Math.min(1, Math.max(0, ((wave[i] ?? 0) - 0.3) / 0.7));
    body[i] = (body[i] ?? 0) * (0.08 + 0.92 * w * w) + (foam[i] ?? 0) * 0.5 * w * w * w * w;
  }
  return body;
}

/** Campfire: a quiet low rumble plus pops, about 10 small and 1 larger per second. */
function crackle(sr: number, total: number, rng: () => number): Float32Array {
  const x = pinkNoise(total, rng);
  runBiquad(x, lowpass(sr, 400));
  for (let i = 0; i < total; i++) x[i] = (x[i] ?? 0) * 0.25;
  const secs = total / sr;
  for (let i = 0; i < Math.round(secs * 10); i++) addBurst(x, Math.floor(rng() * total), 0.1 + 0.3 * rng(), sr * (0.002 + 0.006 * rng()), rng);
  for (let i = 0; i < Math.round(secs); i++) addBurst(x, Math.floor(rng() * total), 0.5 + 0.5 * rng(), sr * (0.004 + 0.01 * rng()), rng);
  runBiquad(x, highpass(sr, 60));
  return x;
}

/**
 * Night crickets: five voices, each a 4 to 5.4 kHz tone chirping in bursts of seven short pulses.
 * Each voice repeats a whole number of times per loop, so the loop is seamless by construction.
 */
function crickets(sr: number, n: number, seconds: number, rng: () => number): Float32Array {
  const out = new Float32Array(n);
  for (let v = 0; v < 5; v++) {
    const hz = Math.round((4000 + rng() * 1400) * seconds) / seconds;
    const bursts = Math.max(1, Math.round(seconds / (0.9 + rng() * 0.7)));
    const period = n / bursts;
    const shift = rng() * period;
    const amp = 0.4 + 0.6 * rng();
    for (let i = 0; i < n; i++) {
      const t = (((i + shift) % period) / sr);
      if (t > 0.22) continue;
      const pulse = Math.sin(Math.PI * ((t * 32) % 1)) ** 2;
      out[i] = (out[i] ?? 0) + amp * pulse * Math.sin((2 * Math.PI * hz * i) / sr);
    }
  }
  return out;
}

/** Render one seamless loop. Wind and waterfall go to renderBed. Same inputs give the same samples. */
export function renderAnyBed(kind: AnyBedKind, sampleRate: number, seed: number, seconds: number): Float32Array {
  if (kind === 'wind' || kind === 'waterfall') return renderBed(kind, sampleRate, seed, seconds);
  const sr = safeRate(sampleRate);
  const secs = clampFinite(seconds, 5, 60, 20);
  const n = Math.round(secs * sr);
  const total = n + Math.round(SEAM_SEC * sr);
  const rng = makeRng(seed);
  let out: Float32Array;
  if (kind === 'crickets') out = crickets(sr, n, secs, rng);
  else {
    const raw = kind === 'rainroof' ? rainRoof(sr, total, rng)
      : kind === 'brown' ? brownNoise(sr, total, rng)
        : kind === 'swell' ? oceanSwell(sr, total, secs, rng) : crackle(sr, total, rng);
    out = loopSeam(raw, n);
  }
  trimAndScale(out, peakOf(kind));
  return out;
}
