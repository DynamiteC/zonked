import { useEffect, useRef } from 'react';

/** requestAnimationFrame loop that pauses while the page is hidden. */
export function useFrame(cb: (dtSec: number) => void, active: boolean): void {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });
  useEffect(() => {
    if (!active) return undefined;
    let id = 0;
    let last = 0;
    const loop = (t: number): void => {
      const dt = last === 0 ? 0 : Math.min(0.25, (t - last) / 1000);
      last = t;
      ref.current(dt);
      id = requestAnimationFrame(loop);
    };
    const sync = (): void => {
      if (document.hidden) {
        if (id !== 0) cancelAnimationFrame(id);
        id = 0;
      } else if (id === 0) {
        last = 0;
        id = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      document.removeEventListener('visibilitychange', sync);
      if (id !== 0) cancelAnimationFrame(id);
    };
  }, [active]);
}
