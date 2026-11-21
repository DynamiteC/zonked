import { useEffect, useState } from 'react';
import { MOTION_KEY, readFlag, writeFlag } from '../storage/prefs';

export function safeStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function useReducedMotion(): [boolean, (v: boolean) => void, boolean] {
  const [user, setUser] = useState(() => readFlag(MOTION_KEY));
  const [os, setOs] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq === undefined) return undefined;
    const on = (): void => setOs(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const set = (v: boolean): void => {
    writeFlag(MOTION_KEY, v);
    setUser(v);
  };
  return [user || os, set, user];
}
