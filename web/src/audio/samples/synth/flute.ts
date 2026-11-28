// Slow generative flute: a soft phrase player in D minor pentatonic.
// It is a synthesized tone (sine, a quiet second harmonic and a little breath). It does not sound like a real flute.
import { clampFinite, makeRng, safeRate, whiteNoise } from './dsp';

/** D minor pentatonic from A3 to A5: A C D F G, over two octaves, 220 to 880 Hz. */
export const SCALE_HZ: readonly number[] = [
  220, 261.63, 293.66, 349.23, 392, 440, 523.25, 587.33, 698.46, 784, 880,
];
export const ATTACK_SEC = 0.4;
export const RELEASE_SEC = 1.2;
export const MIN_GAP_SEC = 3.2;
export const MAX_GAP_SEC = 6;
export const MIN_HOLD_SEC = 0.8;
export const MAX_HOLD_SEC = 2.4;
/** Fundamental level of one note. Harmonic 0.3 and breath 0.2 of it ride on top. */
export const NOTE_AMP = 0.14;
export const HARMONIC = 0.3;
export const BREATH = 0.2;
/** Two notes can overlap at most: worst case sum stays under 0.5 (-6 dBFS). */
export const FLUTE_PEAK_BOUND = 2 * NOTE_AMP * (1 + HARMONIC + BREATH);

export interface Note {
  /** Seconds from the start of the sound to the onset. */
  readonly at: number;
  readonly hz: number;
  readonly hold: number;
  readonly amp: number;
}

/** Whole life of one note in seconds. */
export const noteLength = (n: Pick<Note, 'hold'>): number => ATTACK_SEC + n.hold + RELEASE_SEC;

/** Note envelope in [0, 1]: linear attack, hold, linear release. */
export function envelope(t: number, hold: number): number {
  const x = Number.isFinite(t) ? t : -1;
  const h = clampFinite(hold, MIN_HOLD_SEC, MAX_HOLD_SEC, MIN_HOLD_SEC);
  if (x <= 0) return 0;
  if (x < ATTACK_SEC) return x / ATTACK_SEC;
  if (x < ATTACK_SEC + h) return 1;
  const r = (x - ATTACK_SEC - h) / RELEASE_SEC;
  return r >= 1 ? 0 : 1 - r;
}

/** Endless note plan. Same seed gives the same phrase. Steps stay small so there is no hook. */
export function makePlanner(seed: number, firstAt = 1): () => Note {
  const rng = makeRng(seed);
  let at = clampFinite(firstAt, 0, 60, 1);
  let idx = Math.floor(rng() * SCALE_HZ.length);
  let first = true;
  return () => {
    if (!first) at += MIN_GAP_SEC + rng() * (MAX_GAP_SEC - MIN_GAP_SEC);
    first = false;
    const r = rng();
    idx += r < 0.3 ? -1 : r < 0.6 ? 1 : r < 0.75 ? -2 : r < 0.9 ? 2 : 0;
    idx = Math.min(SCALE_HZ.length - 1, Math.max(0, idx));
    return {
      at,
      hz: SCALE_HZ[idx] ?? 440,
      hold: MIN_HOLD_SEC + rng() * (MAX_HOLD_SEC - MIN_HOLD_SEC),
      amp: NOTE_AMP * (0.7 + 0.3 * rng()),
    };
  };
}

/**
 * Offline model of the flute graph, used by tests and for level numbers.
 * The live graph uses the same plan and envelope; its breath filter differs a little.
 */
export function renderFlute(sampleRate: number, seed: number, seconds: number): Float32Array {
  const sr = safeRate(sampleRate);
  const n = Math.round(clampFinite(seconds, 1, 600, 60) * sr);
  const out = new Float32Array(n);
  const breath = whiteNoise(n, makeRng(seed ^ 0x9e3779b9));
  let lp = 0;
  for (let i = 0; i < n; i++) { lp += 0.2 * ((breath[i] ?? 0) - lp); breath[i] = lp * 2; }
  const next = makePlanner(seed);
  for (let note = next(); note.at < n / sr; note = next()) {
    const start = Math.floor(note.at * sr);
    const end = Math.min(n, Math.ceil((note.at + noteLength(note)) * sr));
    for (let i = start; i < end; i++) {
      const t = i / sr - note.at;
      const e = envelope(t, note.hold) * note.amp;
      const ph = 2 * Math.PI * note.hz * t;
      out[i] = (out[i] ?? 0) + e * (Math.sin(ph) + HARMONIC * Math.sin(2 * ph) + BREATH * (breath[i] ?? 0));
    }
  }
  return out;
}
