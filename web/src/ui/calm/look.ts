import { useCallback, useState } from 'react';

export type Theme = 'dark' | 'light';
export interface Look {
  readonly theme: Theme;
  readonly highContrast: boolean;
}

export const LOOK_KEY = 'zonked.look.v1';
export const DEFAULT_LOOK: Look = { theme: 'dark', highContrast: false };

/** Reads the saved look. Anything unexpected falls back to the dark default. */
export function readLook(raw: string | null): Look {
  if (raw === null) return DEFAULT_LOOK;
  try {
    const o: unknown = JSON.parse(raw.slice(0, 200));
    if (typeof o !== 'object' || o === null) return DEFAULT_LOOK;
    const r = o as Record<string, unknown>;
    return { theme: r['theme'] === 'light' ? 'light' : 'dark', highContrast: r['highContrast'] === true };
  } catch {
    return DEFAULT_LOOK;
  }
}

function load(): Look {
  try {
    return readLook(window.localStorage.getItem(LOOK_KEY));
  } catch {
    return DEFAULT_LOOK;
  }
}

/** Theme and high contrast, kept on this device only. Dark is the default. */
export function useLook(): { readonly look: Look; readonly setLook: (l: Look) => void } {
  const [look, setState] = useState<Look>(load);
  const setLook = useCallback((l: Look) => {
    setState(l);
    try {
      window.localStorage.setItem(LOOK_KEY, JSON.stringify(l));
    } catch {
      // Storage may be blocked. The look still applies for this visit.
    }
  }, []);
  return { look, setLook };
}
