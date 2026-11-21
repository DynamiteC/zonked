export const SAFETY_KEY = 'zonked.safety.v1';
export const MOTION_KEY = 'zonked.reduceMotion';

/** localStorage that never throws (private mode, blocked storage). */
export function readFlag(key: string, ls: Pick<Storage, 'getItem'> | undefined = safeLs()): boolean {
  try {
    return ls?.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function writeFlag(key: string, value: boolean, ls: Pick<Storage, 'setItem'> | undefined = safeLs()): void {
  try {
    ls?.setItem(key, value ? '1' : '0');
  } catch {
    /* storage blocked: the flag lasts for this page only */
  }
}

function safeLs(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}
