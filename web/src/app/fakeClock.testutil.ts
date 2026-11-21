import type { Clock } from './player';

export type FakeClock = Clock & { advance(ms: number): void };

/** Deterministic Clock for tests: advance() fires due intervals in time order. */
export function fakeClock(): FakeClock {
  let t = 1_000_000;
  let id = 0;
  const timers = new Map<number, { fn: () => void; ms: number; next: number }>();
  return {
    now: () => t,
    setInterval(fn, ms) {
      id += 1;
      timers.set(id, { fn, ms, next: t + ms });
      return id;
    },
    clearInterval: (i) => void timers.delete(i),
    advance(ms) {
      const end = t + ms;
      for (;;) {
        let due: { fn: () => void; ms: number; next: number } | undefined;
        for (const tm of timers.values()) if (tm.next <= end && (!due || tm.next < due.next)) due = tm;
        if (!due) break;
        t = due.next;
        due.next += due.ms;
        due.fn();
      }
      t = end;
    },
  };
}

export function memoryStorage(): { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void; data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}
