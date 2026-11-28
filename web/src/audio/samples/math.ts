// Pure helpers for the sample layer. No Web Audio here, so they are cheap to test.

/** Same cap as the master gain. */
export const MAX_SAMPLE_LEVEL = 0.85;
/** Fade in when a sample starts. */
export const FADE_IN_SEC = 2;
/** Fade out when a sample stops. Never below 250 ms. */
export const FADE_OUT_SEC = 0.3;
/** One-pole time constant for level changes. */
export const LEVEL_TAU_SEC = 0.15;
/** One-pole time constant for the beat duck. */
export const DUCK_TAU_SEC = 0.4;
/** How much of the beat path a full blend removes. */
export const DUCK_DEPTH = 0.6;
/** Hard ceiling at the very end of the graph. */
export const OUTPUT_CEILING = 0.95;

const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);

/** Level in [0, 0.85]. NaN and infinity fall back to the last good value. */
export function clampLevel(v: number, fallback = 0): number {
  if (!Number.isFinite(v)) return clamp(Number.isFinite(fallback) ? fallback : 0, 0, MAX_SAMPLE_LEVEL);
  return clamp(v, 0, MAX_SAMPLE_LEVEL);
}

/** Blend in [0, 1]. NaN and infinity fall back to the last good value. */
export function clampBlend(v: number, fallback = 0): number {
  if (!Number.isFinite(v)) return clamp(Number.isFinite(fallback) ? fallback : 0, 0, 1);
  return clamp(v, 0, 1);
}

/** Beat path gain for a blend: 1 at blend 0, 0.4 at blend 1. */
export function duckGain(blend: number): number {
  return 1 - DUCK_DEPTH * clampBlend(blend);
}

/** Blend that follows the sample level when the caller sets none. */
export function blendFromLevel(level: number): number {
  return clampLevel(level) / MAX_SAMPLE_LEVEL;
}

/** Clip curve for the final guard: identity inside the ceiling, flat outside. */
export function guardCurve(points = 2049): Float32Array<ArrayBuffer> {
  const n = Math.max(3, points | 0);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = clamp((i / (n - 1)) * 2 - 1, -OUTPUT_CEILING, OUTPUT_CEILING);
  return out;
}
