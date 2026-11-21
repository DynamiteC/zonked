import { useEffect, useState } from 'react';

export type Tint = 'dawn' | 'day' | 'dusk' | 'night';

/** Time of day from the local clock only. No network. */
export function tintForHour(h: number): Tint {
  if (h >= 5 && h < 9) return 'dawn';
  if (h >= 9 && h < 17) return 'day';
  if (h >= 17 && h < 21) return 'dusk';
  return 'night';
}

/** Re-checks once a minute. */
export function useTimeTint(now: () => Date = () => new Date()): Tint {
  const [tint, setTint] = useState<Tint>(() => tintForHour(now().getHours()));
  useEffect(() => {
    const id = window.setInterval(() => setTint(tintForHour(now().getHours())), 60_000);
    return () => window.clearInterval(id);
  }, [now]);
  return tint;
}
