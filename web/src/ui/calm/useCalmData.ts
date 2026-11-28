import { useCallback, useEffect, useMemo, useState } from 'react';
import { sessionMinutes } from '../../app/milestones';
import type { LogRecord, Store } from '../../storage/db';
import { createLocalStorage, loadProfile, loadProgress, saveProfile, saveProgress, toDayNumber, weekStats } from './data';
import type { JourneyProgress, Profile, ProgressMap, SessionDay, StorageLike, WeekStats } from './data';

const LOG_LIMIT = 200;

export interface CalmData {
  readonly storage: StorageLike;
  readonly profile: Profile;
  readonly progress: ProgressMap;
  readonly week: WeekStats;
  readonly logs: readonly LogRecord[];
  readonly setProfile: (p: Profile) => void;
  readonly setJourney: (id: string, p: JourneyProgress | null) => void;
  readonly refresh: () => void;
}

/** Local day number now. Tests can pass a fixed clock. */
export const today = (now: () => number = Date.now): number => toDayNumber(now());

/** Everything Calm keeps on this device: profile, journey progress and the week from the session log. */
export function useCalmData(store: Store, playing: boolean): CalmData {
  const storage = useMemo(() => createLocalStorage(), []);
  const [profile, setProfileState] = useState<Profile>(() => loadProfile(storage));
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress(storage));
  const [logs, setLogs] = useState<readonly LogRecord[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    store
      .listLogs(LOG_LIMIT)
      .then((l) => live && setLogs(l))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [store, tick, playing]);

  const week = useMemo(() => {
    const sessions: SessionDay[] = logs.map((l) => ({ day: toDayNumber(l.startedAt), minutes: sessionMinutes(l) }));
    return weekStats(sessions, today());
  }, [logs]);

  const setProfile = useCallback(
    (p: Profile) => {
      setProfileState(p);
      saveProfile(storage, p);
    },
    [storage],
  );
  const setJourney = useCallback(
    (id: string, p: JourneyProgress | null) => {
      setProgress((cur) => {
        const { [id]: _drop, ...rest } = cur;
        const next: ProgressMap = p === null ? rest : { ...rest, [id]: p };
        saveProgress(storage, next);
        return next;
      });
    },
    [storage],
  );
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { storage, profile, progress, week, logs, setProfile, setJourney, refresh };
}
