import { useEffect, useRef, type RefObject } from 'react';

const MAX_DEG = 6;
const MIN_GAP_MS = 50;

const clamp = (v: number): number => (Number.isFinite(v) ? Math.max(-1, Math.min(1, v)) : 0);

/** True only for a mouse or pen style pointer. Touch and unknown devices get no parallax. */
export function hasFinePointer(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches;
}

/** Device tilt is used only when the accelerometer permission is already granted. Never asks. */
async function tiltAllowed(): Promise<boolean> {
  try {
    const q = await navigator.permissions?.query({ name: 'accelerometer' as PermissionName });
    return q?.state === 'granted';
  } catch {
    return false;
  }
}

/**
 * Turns the head a few degrees toward the pointer. The turn is smoothed by a CSS transition and
 * throttled. Off when disabled or when the main pointer is coarse (touch). Tilt only with a
 * permission that is already granted. No prompt, ever.
 */
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
      if (e.pointerType === 'touch') return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      apply((e.clientX / w) * 2 - 1, (e.clientY / h) * 2 - 1);
    };
    const onTilt = (e: DeviceOrientationEvent): void => apply((e.gamma ?? 0) / 30, ((e.beta ?? 45) - 45) / 30);
    let tilt = false;
    if (hasFinePointer()) window.addEventListener('pointermove', onPointer, { passive: true });
    else if (typeof DeviceOrientationEvent !== 'undefined') {
      void tiltAllowed().then((ok) => {
        if (!ok || !el.isConnected) return;
        tilt = true;
        window.addEventListener('deviceorientation', onTilt, { passive: true });
      });
    }
    return () => {
      window.removeEventListener('pointermove', onPointer);
      if (tilt) window.removeEventListener('deviceorientation', onTilt);
    };
  }, [ref, enabled]);
}
