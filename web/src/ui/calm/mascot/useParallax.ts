import { useEffect, useRef, type RefObject } from 'react';

const MAX_DEG = 8;
const MIN_GAP_MS = 40;

const clamp = (v: number): number => (Number.isFinite(v) ? Math.max(-1, Math.min(1, v)) : 0);

/** Turns the head a few degrees toward the pointer. No tilt: the site header denies the accelerometer. No-op when disabled. */
export function useParallax(ref: RefObject<HTMLElement | null>, enabled: boolean): void {
  const last = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return undefined;
    const apply = (x: number, y: number): void => {
      const t = Date.now();
      if (t - last.current < MIN_GAP_MS) return;
      last.current = t;
      el.style.setProperty('--ry', `${(clamp(x) * MAX_DEG).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-clamp(y) * MAX_DEG).toFixed(2)}deg`);
    };
    const onPointer = (e: PointerEvent): void => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      apply((e.clientX / w) * 2 - 1, (e.clientY / h) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointer);
    };
  }, [ref, enabled]);
}
