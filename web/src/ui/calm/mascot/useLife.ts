import { useEffect, type RefObject } from 'react';
import type { MascotMood } from './types';

/** Moods whose eyes blink. Lidded or closed eyes do not. */
const BLINKS: ReadonlySet<MascotMood> = new Set<MascotMood>(['idle', 'listening', 'steering', 'tired', 'offline', 'error']);

/** Small seeded generator (mulberry32). The same mood always blinks on the same schedule. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Blink gap in ms: 4 to 7 s, slower for a tired mascot. */
export function blinkGap(r: number, slow: boolean): number {
  return (4000 + r * 3000) * (slow ? 1.6 : 1);
}

/**
 * Runs the blink timer and pauses every animation while the tab is hidden.
 * Does nothing when motion is off. Clears its timer and listener on unmount.
 */
export function useLife(ref: RefObject<HTMLElement | null>, mood: MascotMood, off: boolean): void {
  useEffect(() => {
    const el = ref.current;
    if (off || !el) return undefined;
    const rand = seeded(mood.length * 7919 + (mood.codePointAt(0) ?? 1));
    const slow = mood === 'tired';
    let timer: ReturnType<typeof setTimeout> | undefined;
    const arm = (): void => {
      timer = setTimeout(() => {
        if (!document.hidden) el.classList.add('cm-blinking');
        timer = setTimeout(() => { el.classList.remove('cm-blinking'); arm(); }, slow ? 340 : 170);
      }, blinkGap(rand(), slow));
    };
    const onVisibility = (): void => { el.classList.toggle('cm-paused', document.hidden); };
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    if (BLINKS.has(mood)) arm();
    return () => {
      if (timer !== undefined) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      el.classList.remove('cm-blinking', 'cm-paused');
    };
  }, [ref, mood, off]);
}
