import type { Preset, Voice } from '../sbg';

export const MAX_VISIBLE_HZ = 3;
export const DEFAULT_BREATHS_PER_MIN = 5.5;

export function bandName(beatHz: number): string {
  if (!Number.isFinite(beatHz)) return 'unknown';
  if (beatHz < 4) return 'delta';
  if (beatHz < 8) return 'theta';
  if (beatHz < 13) return 'alpha';
  if (beatHz < 30) return 'beta';
  return 'gamma';
}

/** Maps an audio frequency to a visible flash rate of at most 3 Hz: f / ceil(f / 3). */
export function visibleHz(f: number): number {
  if (!Number.isFinite(f) || f <= 0) return 0;
  return f / Math.ceil(f / MAX_VISIBLE_HZ);
}

/** Raised-cosine pulse in 0..1 from an accumulated phase in cycles. */
export function pulseAt(phaseCycles: number): number {
  return 0.5 - 0.5 * Math.cos(2 * Math.PI * phaseCycles);
}

export function channelHz(v: Voice): { l: number; r: number } {
  return { l: v.carrierHz - v.beatHz / 2, r: v.carrierHz + v.beatHz / 2 };
}

export function formatElapsed(sec: number): string {
  const s = Math.max(0, Math.floor(Number.isFinite(sec) ? sec : 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number): string => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
}

/** Inhale and exhale seconds. Preset breath wins, else 5.5 breaths per minute. */
export function breathTimings(preset?: Preset): { inSec: number; outSec: number } {
  if (preset?.breath !== undefined) return { inSec: preset.breath.inSec, outSec: preset.breath.outSec };
  const half = 60 / DEFAULT_BREATHS_PER_MIN / 2;
  return { inSec: half, outSec: half };
}
