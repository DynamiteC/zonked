/**
 * Export and import of the user's own data as a file they control. Import is untrusted input:
 * size cap, strict envelope, unknown versions rejected, every record re-validated and clamped.
 */
import { NO_FAVORITES, parseFavorites } from './favorites';
import type { Favorites } from './favorites';
import { parseMilestoneState } from './milestones';
import type { MilestoneState } from './milestones';
import { MAX_MIXES, field, isRecord, newMixId, parseMix, uniqueName } from './mixes';
import type { Mix } from './mixes';

export const MAX_FILE_BYTES = 262_144;
export const FILE_APP = 'zonked';
export const FILE_KIND = 'sanctuary';

export type ImportResult =
  | { readonly ok: true; readonly mixes: Mix[]; readonly favorites: Favorites; readonly milestones: MilestoneState | null; readonly skipped: number }
  | { readonly ok: false; readonly error: ImportError };

export type ImportError = 'too-big' | 'not-json' | 'not-zonked' | 'unknown-version' | 'too-many' | 'read-failed';

export function exportBackup(mixes: readonly Mix[], favorites: Favorites, milestones: MilestoneState, now: number): string {
  return JSON.stringify(
    { app: FILE_APP, kind: FILE_KIND, v: 1, exportedAt: now, mixes, favorites, milestones: { v: 1, hidden: milestones.hidden, earned: milestones.earned, reminder: milestones.reminder } },
    null,
    2,
  );
}

/** Mix ids are renewed on import, so only template favorites travel in a file. */
function templateFavorites(x: unknown, now: number): Favorites {
  if (x === undefined) return NO_FAVORITES;
  return { v: 1, items: parseFavorites(x, now).items.filter((i) => i.kind === 'template') };
}

export function parseBackup(text: string, now: number): ImportResult {
  if (text.length > MAX_FILE_BYTES) return { ok: false, error: 'too-big' };
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'not-json' };
  }
  if (!isRecord(raw) || field(raw, 'app') !== FILE_APP || field(raw, 'kind') !== FILE_KIND) return { ok: false, error: 'not-zonked' };
  if (field(raw, 'v') !== 1) return { ok: false, error: 'unknown-version' };
  const list = field(raw, 'mixes');
  const items = Array.isArray(list) ? list : [];
  if (items.length > MAX_MIXES) return { ok: false, error: 'too-many' };
  const mixes: Mix[] = [];
  for (const m of items) {
    const p = parseMix(m, now);
    if (p !== null) mixes.push(p);
  }
  const ms = field(raw, 'milestones');
  return {
    ok: true,
    mixes,
    favorites: templateFavorites(field(raw, 'favorites'), now),
    milestones: ms === undefined ? null : parseMilestoneState(ms, now),
    skipped: items.length - mixes.length,
  };
}

/** Gives imported mixes new ids and unused names. Replace mode drops the current mixes; merge keeps them. */
export function planImport(existing: readonly Mix[], imported: readonly Mix[], mode: 'merge' | 'replace', now: number, rand?: () => number): Mix[] {
  const kept = mode === 'replace' ? [] : [...existing];
  const names = kept.map((m) => m.name);
  const out: Mix[] = [];
  for (const m of imported) {
    if (kept.length + out.length >= MAX_MIXES) break;
    const name = uniqueName(m.name, [...names, ...out.map((o) => o.name)]);
    out.push({ ...m, id: newMixId(now + out.length, rand), name, updatedAt: now });
  }
  return out;
}
