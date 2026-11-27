/** Remembers which front door is open. Calm is the default; a blocked store falls back to Calm. */
export const MODE_KEY = 'zonked.theme.v1';

export type UiMode = 'calm' | 'studio';

export function readMode(ls: Pick<Storage, 'getItem'> | undefined = safeLs()): UiMode {
  try {
    return ls?.getItem(MODE_KEY) === 'studio' ? 'studio' : 'calm';
  } catch {
    return 'calm';
  }
}

export function writeMode(mode: UiMode, ls: Pick<Storage, 'setItem'> | undefined = safeLs()): void {
  try {
    ls?.setItem(MODE_KEY, mode);
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
}

function safeLs(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}
