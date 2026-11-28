// Remembers the nature choice on this device. Plain numbers and one id, validated on read.
export const NATURE_KEY = 'zonked.nature.v1';
export const DEFAULT_BLEND = 0.3;
export const DEFAULT_LEVEL = 0.4;
/** Same cap as the master gain. The sample layer clamps again. */
export const MAX_NATURE_LEVEL = 0.85;

export interface NaturePrefs {
  readonly id: string | null;
  readonly blend: number;
  readonly level: number;
}

export const DEFAULT_PREFS: NaturePrefs = { id: null, blend: DEFAULT_BLEND, level: DEFAULT_LEVEL };

const num = (v: unknown, lo: number, hi: number, fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : fallback;

export function parsePrefs(raw: string | null): NaturePrefs {
  if (raw === null || raw.length > 400) return DEFAULT_PREFS;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const id = typeof o['id'] === 'string' && /^(own:)?[a-z0-9]{3,40}$/.test(o['id']) ? o['id'] : null;
    return { id, blend: num(o['blend'], 0, 1, DEFAULT_BLEND), level: num(o['level'], 0, MAX_NATURE_LEVEL, DEFAULT_LEVEL) };
  } catch {
    return DEFAULT_PREFS;
  }
}

const ls = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

export const loadPrefs = (): NaturePrefs => parsePrefs(ls()?.getItem(NATURE_KEY) ?? null);

export function savePrefs(p: NaturePrefs): void {
  try {
    ls()?.setItem(NATURE_KEY, JSON.stringify(p));
  } catch {
    /* shortcut: a blocked store means the choice lasts for this page only */
  }
}

export function forgetPrefs(): void {
  try {
    ls()?.removeItem(NATURE_KEY);
  } catch {
    /* nothing more can be done */
  }
}
