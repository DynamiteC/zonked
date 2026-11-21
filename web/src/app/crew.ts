import { BOUNDS, LIMITS } from '../sbg';

export type CrewLevel = 'focus' | 'flow' | 'recovery' | 'decompress';

export interface CrewState {
  readonly version: 1;
  readonly at: number;
  readonly burnout: { readonly score: number; readonly level: CrewLevel };
  readonly target: {
    readonly presetId?: string;
    readonly beatHz: number;
    readonly carrierHz: number;
    readonly gain: number;
    readonly transitionSec: number;
    readonly breathe: boolean;
  };
  readonly sbg: string | null;
}

/**
 * Two-layer transition floor. The bridge enforces the real minimum (30 s, or less only when a
 * developer starts it with --min-transition). The web trusts what the bridge sends, so this
 * floor is a hard safety net for hostile direct input, not the policy.
 */
export const MIN_TRANSITION_SEC = 5;
export const MAX_TRANSITION_SEC = 600;

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function levelFromScore(score: number): CrewLevel {
  if (score < 40) return 'focus';
  if (score < 60) return 'flow';
  if (score < 80) return 'recovery';
  return 'decompress';
}

/** Validates and clamps an untrusted C3 payload. Returns null when it cannot be trusted. */
export function parseCrewState(raw: unknown): CrewState | null {
  if (!isRecord(raw) || raw['version'] !== 1) return null;
  const b = raw['burnout'];
  const t = raw['target'];
  if (!isRecord(b) || !isRecord(t)) return null;
  const score = b['score'];
  const beat = t['beatHz'];
  const carrier = t['carrierHz'];
  const gain = t['gain'];
  const trans = t['transitionSec'];
  if (![score, beat, carrier, gain, trans].every((n) => typeof n === 'number' && Number.isFinite(n))) {
    return null;
  }
  const s = clamp(score as number, 0, 100);
  // The score is the source of truth: a level that disagrees with it is replaced.
  const level = levelFromScore(s);
  const pid = t['presetId'];
  const sbg = raw['sbg'];
  const at = raw['at'];
  return {
    version: 1,
    at: typeof at === 'number' && Number.isFinite(at) ? Math.trunc(at) : 0,
    burnout: { score: s, level },
    target: {
      ...(typeof pid === 'string' && pid.length > 0 && pid.length <= 64 ? { presetId: pid } : {}),
      beatHz: clamp(beat as number, BOUNDS.beatMin, BOUNDS.beatMax),
      carrierHz: clamp(carrier as number, BOUNDS.carrierMin, BOUNDS.carrierMax),
      gain: clamp(gain as number, BOUNDS.gainMin, BOUNDS.gainMax),
      transitionSec: clamp(trans as number, MIN_TRANSITION_SEC, MAX_TRANSITION_SEC),
      breathe: t['breathe'] === true,
    },
    sbg: typeof sbg === 'string' && sbg.length <= LIMITS.maxBytes ? sbg : null,
  };
}
