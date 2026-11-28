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
/** How far a full blend lowers the beat path, in dB. The curve is linear in dB: 0, -10 and -20 dB at blend 0, 0.5 and 1. */
export const DUCK_DEPTH_DB = -20;
/**
 * Fixed trim on the beat path (tone and DSP noise), in dB. The beat templates sat at -9 to -13 LUFS, far above
 * the nature loops. 8 dB brings beats-only to about -20 LUFS. It only ever lowers the output.
 */
export const TONE_TRIM_DB = -8;
/** Loudness every nature loop and synth is trimmed to at level 0.4 and the reference blend, in LUFS. */
export const TARGET_LUFS = -26;
/** Blend where the nature level equals the trimmed target. The Calm UI starts the blend slider here. */
export const REF_BLEND = 0.3;
/** Corner of the 2nd order high-pass on every nature and synth layer, in Hz. Removes subsonic rumble. */
export const SAMPLE_HP_HZ = 40;
/** Hard ceiling at the very end of the graph. Nothing passes it. */
export const OUTPUT_CEILING = 0.95;
/** The soft knee starts here. Below it the guard is the identity. */
export const GUARD_KNEE = 0.8;

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

const dbToGain = (db: number): number => 10 ** (db / 20);

/** Linear gain for a trim in dB. NaN and infinity give unity. */
export function trimGain(db: number): number {
  return Number.isFinite(db) ? dbToGain(db) : 1;
}

/** Beat path duck for a blend: 0 dB at blend 0, -10 dB at 0.5, -20 dB at 1. Linear in dB. */
export function duckGain(blend: number): number {
  return dbToGain(DUCK_DEPTH_DB * clampBlend(blend));
}

/** Gain the beat path settles at: the fixed tone trim plus the duck. */
export function beatGain(blend: number): number {
  return dbToGain(TONE_TRIM_DB) * duckGain(blend);
}

/**
 * Nature level scale for a blend. Equal-power rise (sine), 1 at REF_BLEND and flat above it, so the
 * slider mostly moves the beat and never lifts a loop past its trimmed level. 0 at blend 0.
 */
export function natureScale(blend: number): number {
  const b = clampBlend(blend);
  return Math.min(1, Math.sin((b * Math.PI) / 2) / Math.sin((REF_BLEND * Math.PI) / 2));
}

/** Blend that follows the sample level when the caller sets none. */
export function blendFromLevel(level: number): number {
  return clampLevel(level) / MAX_SAMPLE_LEVEL;
}

/**
 * Soft knee: identity up to GUARD_KNEE, then a tanh shoulder that approaches OUTPUT_CEILING and never reaches it.
 * NaN gives 0. Infinity gives the ceiling. The result is always inside [-0.95, 0.95].
 */
export function softKnee(x: number): number {
  if (Number.isNaN(x)) return 0;
  const a = Math.abs(x);
  const room = OUTPUT_CEILING - GUARD_KNEE;
  const y = a <= GUARD_KNEE ? a : GUARD_KNEE + room * Math.tanh((a - GUARD_KNEE) / room);
  return Math.sign(x) * Math.min(y, OUTPUT_CEILING);
}

/** Curve for the final guard: a soft knee, then the same hard ceiling as before. */
export function guardCurve(points = 2049): Float32Array<ArrayBuffer> {
  const n = Math.max(3, points | 0);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = softKnee((i / (n - 1)) * 2 - 1);
  return out;
}

/** Equal-power fade curve with `n` points. `up` rises 0 to 1, otherwise it falls 1 to 0. */
export function equalPowerCurve(up: boolean, n = 64): Float32Array<ArrayBuffer> {
  const out = new Float32Array(Math.max(2, n | 0));
  for (let i = 0; i < out.length; i++) {
    const t = i / (out.length - 1);
    out[i] = up ? Math.sin((t * Math.PI) / 2) : Math.cos((t * Math.PI) / 2);
  }
  return out;
}
