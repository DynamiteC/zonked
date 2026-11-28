/** Natural breath shape: 0 = empty lungs, 1 = full. One cycle is inS + outS seconds (default 4 + 4). */

const PAUSE_S = 0.5; // short natural rest near empty, taken from the end of the out phase
const EXHALE_BIAS = 1.25; // above 1: the first part of the exhale moves a little faster

const finiteOr = (v: number, fallback: number): number => (Number.isFinite(v) ? v : fallback);
const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));
/** Sine ease: zero slope at both ends, so the start is slow, the middle full and the top gentle. */
const ease = (u: number): number => (1 - Math.cos(Math.PI * clamp(u, 0, 1))) / 2;

export function breathCurve(tSeconds: number, inS = 4, outS = 4): number {
  const tin = clamp(finiteOr(inS, 4), 0.5, 30);
  const tout = clamp(finiteOr(outS, 4), 0.5, 30);
  const total = tin + tout;
  const t = finiteOr(tSeconds, 0);
  const c = ((t % total) + total) % total;
  if (c < tin) return ease(c / tin);
  const pause = Math.min(PAUSE_S, tout / 4);
  const u = clamp((c - tin) / (tout - pause), 0, 1);
  return 1 - ease(1 - Math.pow(1 - u, EXHALE_BIAS));
}

export type BreathLabel = 'Breathe in' | 'Breathe out';

/** The cue text for a moment in the cycle. The in phase is the first inS seconds. */
export function breathLabel(tSeconds: number, inS = 4, outS = 4): BreathLabel {
  const tin = clamp(finiteOr(inS, 4), 0.5, 30);
  const total = tin + clamp(finiteOr(outS, 4), 0.5, 30);
  const t = finiteOr(tSeconds, 0);
  return ((t % total) + total) % total < tin ? 'Breathe in' : 'Breathe out';
}
