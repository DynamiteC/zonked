// A short text code for one nature mix: sound, blend and level. Example: ZK1-rain-60-30.
// Schema v1: "ZK1-<id>-<nature percent>-<level percent>".
//   id: 3 to 24 lowercase letters or digits, and it must be a sound this app ships (checked by the caller).
//   nature percent: whole number 0 to 100. 0 is all beats, 100 is all nature (blend 0..1).
//   level percent: whole number 0 to 100, clamped to the nature level cap.
// The code is untrusted input: it is parsed with one strict pattern and never evaluated.
import { MAX_NATURE_LEVEL } from './prefs';

export const MIX_CODE_MAX = 64;
const PATTERN = /^ZK1-([a-z0-9]{3,24})-(\d{1,3})-(\d{1,3})$/;

export interface Mix {
  readonly id: string;
  readonly blend: number;
  readonly level: number;
}

export type MixParse = { readonly ok: true; readonly mix: Mix } | { readonly ok: false; readonly error: string };

export function formatMixCode(m: Mix): string {
  const pct = (v: number, hi: number): number => Math.round(Math.min(hi, Math.max(0, Number.isFinite(v) ? v : 0)) * 100);
  return `ZK1-${m.id}-${pct(m.blend, 1)}-${pct(m.level, MAX_NATURE_LEVEL)}`;
}

/** Strict parse. Unknown versions, bad shapes and values above 100 are rejected. A level above the cap is clamped. */
export function parseMixCode(raw: string, known: readonly string[]): MixParse {
  const text = raw.trim();
  if (text.length === 0 || text.length > MIX_CODE_MAX) return { ok: false, error: 'This is not a Zonked mix code.' };
  if (/^ZK\d+-/.test(text) && !text.startsWith('ZK1-')) return { ok: false, error: 'This mix code is from a newer Zonked. Update the app to use it.' };
  const m = PATTERN.exec(text);
  if (m === null) return { ok: false, error: 'This is not a Zonked mix code.' };
  const id = m[1] ?? '';
  const blend = Number(m[2]);
  const level = Number(m[3]);
  if (!known.includes(id)) return { ok: false, error: 'This mix uses a sound that is not in this app.' };
  if (blend > 100 || level > 100) return { ok: false, error: 'This mix code has a value out of range.' };
  return { ok: true, mix: { id, blend: blend / 100, level: Math.min(MAX_NATURE_LEVEL, level / 100) } };
}
