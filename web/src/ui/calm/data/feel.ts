import { usesCrackle, usesPercussion } from '../../../catalog/features';
import type { Template } from '../../../catalog/types';
import type { StorageLike } from './types';

/** "How was that?" answers. Kept only on this device. No score is ever shown. */
export const FEEL_KEY = 'zonked.feel.v1';
export const FEEL_ANSWERS = ['calmer', 'same', 'not'] as const;
export type FeelAnswer = (typeof FEEL_ANSWERS)[number];

export interface FeelEntry {
  readonly id: string;
  readonly a: FeelAnswer;
  readonly day: number;
}

export const MAX_FEEL_ENTRIES = 500;
export const MAX_FEEL_BYTES = 64 * 1024;
const MAX_DAY = 10_000_000;
const ID_RE = /^[a-z0-9-]{1,80}$/;
/** Score weight of one answer, and the most any one sound can move in either direction. */
const STEP = 4;
const CAP = 12;

const isAnswer = (v: unknown): v is FeelAnswer => FEEL_ANSWERS.some((a) => a === v);

function parseEntry(v: unknown): FeelEntry | undefined {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return undefined;
  const { id, a, day } = v as Record<string, unknown>;
  if (typeof id !== 'string' || !ID_RE.test(id) || !isAnswer(a)) return undefined;
  if (typeof day !== 'number' || !Number.isInteger(day) || day < 0 || day > MAX_DAY) return undefined;
  return { id, a, day };
}

/** Validates untrusted data (storage or a backup file). Bad rows are dropped, the newest 500 are kept. */
export function parseFeel(raw: unknown): readonly FeelEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: FeelEntry[] = [];
  for (const row of raw.slice(-MAX_FEEL_ENTRIES)) {
    const e = parseEntry(row);
    if (e !== undefined) out.push(e);
  }
  return out;
}

/** Reads the stored answers. Any problem (missing, corrupt, too big, unknown version) gives an empty list. */
export function loadFeel(storage: StorageLike): readonly FeelEntry[] {
  try {
    const raw = storage.get(FEEL_KEY);
    if (raw === null || raw.length > MAX_FEEL_BYTES) return [];
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return [];
    const o = parsed as Record<string, unknown>;
    return o['v'] === 1 ? parseFeel(o['entries']) : [];
  } catch {
    return [];
  }
}

/** Writes the list, dropping the oldest rows first while it is over the entry or byte cap. */
export function saveFeel(storage: StorageLike, entries: readonly FeelEntry[]): boolean {
  let keep = parseFeel(entries);
  try {
    let raw = JSON.stringify({ v: 1, entries: keep });
    while (raw.length > MAX_FEEL_BYTES && keep.length > 0) {
      keep = keep.slice(Math.ceil(keep.length / 10));
      raw = JSON.stringify({ v: 1, entries: keep });
    }
    storage.set(FEEL_KEY, raw);
    return true;
  } catch {
    return false;
  }
}

/** Returns a new list with one answer added. The oldest are dropped past 500. */
export function addFeel(entries: readonly FeelEntry[], e: FeelEntry): readonly FeelEntry[] {
  const checked = parseEntry(e);
  return checked === undefined ? entries : [...entries, checked].slice(-MAX_FEEL_ENTRIES);
}

export function clearFeel(storage: StorageLike): void {
  try {
    storage.remove(FEEL_KEY);
  } catch {
    /* shortcut: a refusing store keeps its data, nothing more can be done here */
  }
}

/** Nudge in score points for one sound: Calmer adds, Not for me subtracts, Same is neutral. */
export function feelBias(entries: readonly FeelEntry[], id: string): number {
  let n = 0;
  for (const e of entries) if (e.id === id) n += e.a === 'calmer' ? STEP : e.a === 'not' ? -STEP : 0;
  return Math.max(-CAP, Math.min(CAP, n));
}

interface Ranked {
  readonly template: Template;
  readonly score: number;
  readonly reasons: readonly string[];
}

const exact = (r: Ranked): boolean => r.reasons.some((x) => x.startsWith('Made for:')) && !r.reasons.some((x) => x.startsWith('Filters relaxed'));

/**
 * Reorders the recommender's own top picks by the person's answers. A sound from the wider list joins
 * only when it matches the situation exactly and is no stronger than the top picks: no higher intensity,
 * and no percussion or crackle unless a top pick already has it. So a Calmer answer never pulls in
 * something the sensitivity setting would have filtered out.
 */
export function nudgeRecs<T extends Ranked>(top: readonly T[], wide: readonly T[], entries: readonly FeelEntry[]): readonly T[] {
  if (entries.length === 0) return top;
  const ceiling = Math.max(0, ...top.map((r) => r.template.intensity));
  const perc = top.some((r) => usesPercussion(r.template));
  const crackle = top.some((r) => usesCrackle(r.template));
  const inTop = new Set(top.map((r) => r.template.id));
  const pool = wide.filter(
    (r) => inTop.has(r.template.id) || (exact(r) && r.template.intensity <= ceiling && (perc || !usesPercussion(r.template)) && (crackle || !usesCrackle(r.template))),
  );
  const scored = pool.map((r, i) => ({ r, i, s: r.score + feelBias(entries, r.template.id) }));
  scored.sort((x, y) => y.s - x.s || x.i - y.i);
  return scored.slice(0, top.length).map((x) => x.r);
}
