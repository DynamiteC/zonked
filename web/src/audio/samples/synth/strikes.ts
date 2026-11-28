// Struck sounds made in code: a singing bowl and soft pentatonic chimes.
// A planner books one strike at a time. Every strike is a few decaying partials, so the sound rings and fades.
import { clampFinite, makeRng, safeRate } from './dsp';

export type StrikeKind = 'bowl' | 'softchimes';

export interface Partial {
  readonly ratio: number;
  /** Share of the strike level. The shares of one strike add up to 1. */
  readonly amp: number;
  /** Decay time constant in seconds. */
  readonly tau: number;
  /** Frequency offset of a second voice in Hz. It makes the slow shimmer of a bowl. 0 means one voice. */
  readonly beat: number;
}

export interface Strike {
  /** Seconds from the start of the sound to the onset. */
  readonly at: number;
  readonly hz: number;
  readonly amp: number;
  readonly attack: number;
  readonly partials: readonly Partial[];
}

interface Spec {
  readonly scale: readonly number[];
  readonly minGap: number;
  readonly maxGap: number;
  readonly amp: number;
  readonly attack: number;
  readonly partials: readonly Partial[];
}

const BOWL_PARTIALS: readonly Partial[] = [
  { ratio: 1, amp: 0.6, tau: 5, beat: 0.4 },
  { ratio: 2.71, amp: 0.28, tau: 3, beat: 0.7 },
  { ratio: 5.15, amp: 0.12, tau: 1.8, beat: 1.1 },
];
const CHIME_PARTIALS: readonly Partial[] = [
  { ratio: 1, amp: 0.75, tau: 1.6, beat: 0 },
  { ratio: 2.76, amp: 0.15, tau: 0.8, beat: 0 },
  { ratio: 5.4, amp: 0.1, tau: 0.4, beat: 0 },
];

/** Bowl: G3 to D4, never more than one strike per 8 s. Chimes: C major pentatonic, C5 to C6, sparse. */
export const SPECS: Readonly<Record<StrikeKind, Spec>> = {
  bowl: { scale: [196, 220, 261.63, 293.66], minGap: 8, maxGap: 14, amp: 0.2, attack: 0.05, partials: BOWL_PARTIALS },
  softchimes: { scale: [523.25, 587.33, 659.25, 783.99, 880, 1046.5], minGap: 3, maxGap: 9, amp: 0.18, attack: 0.003, partials: CHIME_PARTIALS },
};

/** Largest tau of a kind, in seconds. */
const tauMax = (k: StrikeKind): number => Math.max(...SPECS[k].partials.map((p) => p.tau));
/** Strikes ring for this many time constants, then the voice is stopped. */
export const RING_TAUS = 6;

/** Whole life of a strike in seconds. */
export const strikeLength = (s: Strike): number => s.attack + RING_TAUS * Math.max(...s.partials.map((p) => p.tau));

/**
 * Level bound of a whole sound before the layer gain. Earlier strikes still ring when the next lands,
 * so the worst case is a geometric sum of the strike level over the minimum gap.
 */
export const peakBound = (k: StrikeKind): number => SPECS[k].amp / (1 - Math.exp(-SPECS[k].minGap / tauMax(k)));

/** Envelope in [0, 1]: linear attack, then exponential decay with constant `tau`. */
export function strikeEnv(t: number, attack: number, tau: number): number {
  const x = Number.isFinite(t) ? t : -1;
  if (x <= 0) return 0;
  if (x < attack) return x / attack;
  return Math.exp(-(x - attack) / clampFinite(tau, 0.05, 30, 1));
}

/** Endless strike plan. Same seed gives the same strikes. Steps stay small so there is no tune. */
export function makeStrikePlanner(kind: StrikeKind, seed: number, firstAt = 1.5): () => Strike {
  const spec = SPECS[kind];
  const rng = makeRng(seed);
  let at = clampFinite(firstAt, 0, 60, 1.5);
  let idx = Math.floor(rng() * spec.scale.length);
  let first = true;
  return () => {
    if (!first) at += spec.minGap + rng() * (spec.maxGap - spec.minGap);
    first = false;
    idx = Math.min(spec.scale.length - 1, Math.max(0, idx + Math.floor(rng() * 3) - 1));
    return {
      at,
      hz: spec.scale[idx] ?? 440,
      amp: spec.amp * (0.7 + 0.3 * rng()),
      attack: spec.attack,
      partials: spec.partials,
    };
  };
}

/** Offline model of the strike graph, used by tests and for level numbers. */
export function renderStrikes(kind: StrikeKind, sampleRate: number, seed: number, seconds: number): Float32Array {
  const sr = safeRate(sampleRate);
  const n = Math.round(clampFinite(seconds, 1, 600, 60) * sr);
  const out = new Float32Array(n);
  const next = makeStrikePlanner(kind, seed);
  for (let s = next(); s.at < n / sr; s = next()) {
    const start = Math.floor(s.at * sr);
    const end = Math.min(n, Math.ceil((s.at + strikeLength(s)) * sr));
    for (let i = start; i < end; i++) {
      const t = i / sr - s.at;
      let v = 0;
      for (const p of s.partials) {
        const w = 2 * Math.PI * s.hz * p.ratio * t;
        const tone = p.beat > 0 ? 0.5 * (Math.sin(w) + Math.sin(w + 2 * Math.PI * p.beat * t)) : Math.sin(w);
        v += p.amp * strikeEnv(t, s.attack, p.tau) * tone;
      }
      out[i] = (out[i] ?? 0) + s.amp * v;
    }
  }
  return out;
}
