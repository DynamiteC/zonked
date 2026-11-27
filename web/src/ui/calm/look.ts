import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
export type ThemeChoice = 'system' | 'light' | 'dark' | 'contrast';

/** The look the screens use: always a concrete theme, plus the high contrast flag. */
export interface Look {
  readonly theme: Theme;
  readonly highContrast: boolean;
}

/** What the person chose. dim null means automatic: on from 19:00 to 07:00 local time. */
export interface Prefs {
  readonly choice: ThemeChoice;
  readonly dim: boolean | null;
  /** Announce Breathe in and Breathe out to screen readers. */
  readonly announce: boolean;
}

export const LOOK_KEY_V1 = 'zonked.look.v1';
export const PREFS_KEY = 'zonked.theme.v2';
export const DEFAULT_PREFS: Prefs = { choice: 'dark', dim: null, announce: true };
const CHOICES: readonly ThemeChoice[] = ['system', 'light', 'dark', 'contrast'];

const isChoice = (v: unknown): v is ThemeChoice => typeof v === 'string' && (CHOICES as readonly string[]).includes(v);

function parse(raw: string | null): Record<string, unknown> | null {
  if (raw === null) return null;
  try {
    const o: unknown = JSON.parse(raw.slice(0, 400));
    return typeof o === 'object' && o !== null ? (o as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Reads the v2 record. Unknown values fall back to the defaults. */
export function readPrefs(raw: string | null): Prefs {
  const r = parse(raw);
  if (r === null) return DEFAULT_PREFS;
  return {
    choice: isChoice(r['choice']) ? r['choice'] : DEFAULT_PREFS.choice,
    dim: typeof r['dim'] === 'boolean' ? r['dim'] : null,
    announce: r['announce'] !== false,
  };
}

/** Turns an old v1 look (theme and highContrast) into a v2 choice. */
export function migrateV1(raw: string | null): Prefs {
  const r = parse(raw);
  if (r === null) return DEFAULT_PREFS;
  const choice: ThemeChoice = r['highContrast'] === true ? 'contrast' : r['theme'] === 'light' ? 'light' : 'dark';
  return { ...DEFAULT_PREFS, choice };
}

/** True from 19:00 up to 07:00 local time. */
export const isNight = (d: Date): boolean => d.getHours() >= 19 || d.getHours() < 7;

export const dimOn = (p: Prefs, now: Date = new Date()): boolean => p.dim ?? isNight(now);

const systemTheme = (): Theme => (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

export function resolveLook(p: Prefs, system: Theme): Look {
  if (p.choice === 'contrast') return { theme: system, highContrast: true };
  return { theme: p.choice === 'system' ? system : p.choice, highContrast: false };
}

function load(): Prefs {
  try {
    const v2 = window.localStorage.getItem(PREFS_KEY);
    if (v2 !== null) return readPrefs(v2);
    return migrateV1(window.localStorage.getItem(LOOK_KEY_V1));
  } catch {
    return DEFAULT_PREFS;
  }
}

/** Theme choice, dim and breath announcements, kept on this device only. Dark is the default. */
export function useLook(): { readonly look: Look; readonly prefs: Prefs; readonly dim: boolean; readonly setPrefs: (p: Prefs) => void } {
  const [prefs, setState] = useState<Prefs>(load);
  const [system, setSystem] = useState<Theme>(systemTheme);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const on = (): void => setSystem(mq.matches ? 'light' : 'dark');
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  const setPrefs = useCallback((p: Prefs) => {
    setState(p);
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(p));
    } catch {
      // Storage may be blocked. The look still applies for this visit.
    }
  }, []);
  return { look: resolveLook(prefs, system), prefs, dim: dimOn(prefs), setPrefs };
}
