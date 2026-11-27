import { useCallback, useMemo, useState } from 'react';
import { addFeel, clearFeel, loadFeel, saveFeel, toDayNumber } from './data';
import type { FeelAnswer, FeelEntry, StorageLike } from './data';

export interface Feel {
  readonly entries: readonly FeelEntry[];
  readonly answer: (id: string, a: FeelAnswer) => void;
  readonly clear: () => void;
}

/** The "How was that?" answers, kept on this device only. */
export function useFeel(storage: StorageLike, now: () => number = Date.now): Feel {
  const [entries, setEntries] = useState<readonly FeelEntry[]>(() => loadFeel(storage));
  const answer = useCallback(
    (id: string, a: FeelAnswer) => {
      setEntries((cur) => {
        const next = addFeel(cur, { id, a, day: toDayNumber(now()) });
        saveFeel(storage, next);
        return next;
      });
    },
    [storage, now],
  );
  const clear = useCallback(() => {
    clearFeel(storage);
    setEntries([]);
  }, [storage]);
  return useMemo(() => ({ entries, answer, clear }), [entries, answer, clear]);
}
