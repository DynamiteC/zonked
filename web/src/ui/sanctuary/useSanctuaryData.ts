import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { exportBackup, parseBackup, planImport } from '../../app/backup';
import type { ImportError } from '../../app/backup';
import { NO_FAVORITES, parseFavorites, removeKind, toggleFavorite } from '../../app/favorites';
import type { Favorites, FavoriteKind } from '../../app/favorites';
import {
  NEW_STATE, cleanReminderText, computeStats, dueReminder, evaluate, parseMilestoneState, resetMilestones,
} from '../../app/milestones';
import type { MilestoneState, Stats } from '../../app/milestones';
import { MAX_MIXES, makeMix, renameMix, uniqueName } from '../../app/mixes';
import type { Mix, MixDraft } from '../../app/mixes';
import type { Store } from '../../storage/db';
import { SX } from './copy';

/** shortcut: stats read the newest 5000 sessions, upgrade to a running total if anyone listens that much. */
const LOG_LIMIT = 5000;

export interface SanctuaryData {
  readonly ready: boolean;
  readonly persistent: boolean;
  readonly mixes: readonly Mix[];
  readonly favorites: Favorites;
  readonly milestones: MilestoneState;
  readonly stats: Stats;
  /** Text of the daily in-app reminder when it is due now. */
  readonly reminder: string | null;
  readonly notice: string | null;
  readonly saveMix: (draft: MixDraft | null, name: string) => Promise<boolean>;
  readonly renameMix: (id: string, name: string) => Promise<boolean>;
  readonly deleteMix: (id: string) => Promise<boolean>;
  readonly toggleFavorite: (kind: FavoriteKind, id: string) => Promise<boolean>;
  readonly setHidden: (hidden: boolean) => Promise<boolean>;
  readonly resetMilestones: () => Promise<void>;
  readonly setReminder: (on: boolean, text: string) => Promise<void>;
  readonly exportText: () => string;
  readonly importText: (text: string, mode: 'merge' | 'replace') => Promise<ImportError | null>;
  readonly resetAll: () => Promise<boolean>;
}

const EMPTY_STATS = computeStats([], 0, 0);

export function useSanctuaryData(store: Store, now: () => number): SanctuaryData {
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState(true);
  const [mixes, setMixes] = useState<readonly Mix[]>([]);
  const [favorites, setFavorites] = useState<Favorites>(NO_FAVORITES);
  const [milestones, setMilestonesState] = useState<MilestoneState>(NEW_STATE);
  // Latest milestone state, updated synchronously, so quick clicks (show then reset) never patch a stale copy.
  const msRef = useRef<MilestoneState>(NEW_STATE);
  const setMilestones = useCallback((next: MilestoneState) => {
    msRef.current = next;
    setMilestonesState(next);
  }, []);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [reminder, setReminderLine] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const live = useRef(true);
  const tz = (): number => new Date(now()).getTimezoneOffset();

  const guard = useCallback(async (fn: () => Promise<void>): Promise<boolean> => {
    try {
      await fn();
      return true;
    } catch {
      if (live.current) setNotice(SX.mixes.failed);
      return false;
    }
  }, []);

  const saveRecord = useCallback((key: 'favorites' | 'milestones', value: unknown) => store.setRecord(key, value), [store]);

  useEffect(() => {
    live.current = true;
    const load = async (): Promise<void> => {
      const t = now();
      const [m, f, ms, logs, ok] = await Promise.all([
        store.listMixes(), store.getRecord('favorites'), store.getRecord('milestones'), store.listLogs(LOG_LIMIT), store.persistent(),
      ]);
      const st = computeStats(logs, t, tz());
      const ev = evaluate(parseMilestoneState(ms, t), st, t);
      const due = dueReminder(ev.state, t, tz());
      if (ev.added.length > 0 || due.show) await store.setRecord('milestones', due.state);
      if (!live.current) return;
      setMixes(m);
      setFavorites(parseFavorites(f, t));
      setMilestones(due.state);
      setStats(st);
      setReminderLine(due.show ? due.state.reminder.text : null);
      setPersistent(ok);
      setReady(true);
    };
    load().catch(() => {
      if (live.current) {
        setNotice(SX.common.saveFailed);
        setReady(true);
      }
    });
    return () => {
      live.current = false;
    };
    // The store and clock are fixed for the life of the panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  const saveMix = useCallback(
    async (draft: MixDraft | null, name: string): Promise<boolean> => {
      if (draft === null) return false;
      if (mixes.length >= MAX_MIXES) {
        setNotice(SX.mixes.full);
        return false;
      }
      return guard(async () => {
        const mix = makeMix(draft, uniqueName(name.trim() || 'My mix', mixes.map((x) => x.name)), now());
        await store.putMix(mix);
        setMixes((cur) => [mix, ...cur]);
        setNotice(SX.mixes.saved);
      });
    },
    [guard, mixes, now, store],
  );

  const rename = useCallback(
    (id: string, name: string) =>
      guard(async () => {
        const cur = mixes.find((m) => m.id === id);
        if (cur === undefined) return;
        const next = renameMix(cur, uniqueName(name, mixes.filter((m) => m.id !== id).map((m) => m.name)), now());
        await store.putMix(next);
        setMixes((all) => all.map((m) => (m.id === id ? next : m)));
        setNotice(SX.mixes.renamed);
      }),
    [guard, mixes, now, store],
  );

  const toggleFav = useCallback(
    (kind: FavoriteKind, id: string) =>
      guard(async () => {
        const next = toggleFavorite(favorites, kind, id, now());
        await saveRecord('favorites', next);
        setFavorites(next);
      }),
    [favorites, guard, now, saveRecord],
  );

  const removeMix = useCallback(
    (id: string) =>
      guard(async () => {
        await store.deleteMix(id);
        const nextFav = removeKind(favorites, 'mix', id);
        if (nextFav !== favorites) {
          await saveRecord('favorites', nextFav);
          setFavorites(nextFav);
        }
        setMixes((all) => all.filter((m) => m.id !== id));
        setNotice(SX.mixes.deleted);
      }),
    [favorites, guard, saveRecord, store],
  );

  const patchMilestones = useCallback(
    (update: (cur: MilestoneState) => MilestoneState) =>
      guard(async () => {
        const next = update(msRef.current);
        setMilestones(next);
        await saveRecord('milestones', next);
      }),
    [guard, saveRecord, setMilestones],
  );

  const importText = useCallback(
    async (text: string, mode: 'merge' | 'replace'): Promise<ImportError | null> => {
      const t = now();
      const res = parseBackup(text, t);
      if (!res.ok) return res.error;
      const ok = await guard(async () => {
        const fresh = planImport(mixes, res.mixes, mode, t);
        if (mode === 'replace') for (const m of mixes) await store.deleteMix(m.id);
        for (const m of fresh) await store.putMix(m);
        const kept = mode === 'replace' ? [] : mixes;
        const favItems = [...res.favorites.items, ...favorites.items.filter((i) => mode === 'merge' || i.kind === 'template')];
        const fav = parseFavorites({ v: 1, items: favItems }, t);
        await saveRecord('favorites', fav);
        setFavorites(fav);
        setMixes([...fresh, ...kept].sort((a, b) => b.updatedAt - a.updatedAt));
        setNotice(res.skipped > 0 ? `${SX.data.imported} ${SX.data.skipped}` : SX.data.imported);
      });
      return ok ? null : 'read-failed';
    },
    [favorites, guard, mixes, now, saveRecord, store],
  );

  const actions = useMemo(
    () => ({
      renameMix: rename,
      deleteMix: removeMix,
      toggleFavorite: toggleFav,
      setHidden: (hidden: boolean) => patchMilestones((cur) => ({ ...cur, hidden })),
      resetMilestones: async () => {
        await patchMilestones(resetMilestones);
        setNotice(SX.milestones.resetDone);
      },
      setReminder: async (on: boolean, text: string) => {
        await patchMilestones((cur) => ({ ...cur, reminder: { ...cur.reminder, on, text: cleanReminderText(text) } }));
        setNotice(SX.milestones.reminderSaved);
      },
      exportText: () => exportBackup(mixes, favorites, milestones, now()),
      resetAll: () =>
        guard(async () => {
          await store.clearSanctuary();
          setMixes([]);
          setFavorites(NO_FAVORITES);
          setMilestones(NEW_STATE);
          setStats(EMPTY_STATS);
          setReminderLine(null);
          setNotice(SX.data.resetDone);
        }),
    }),
    [favorites, guard, milestones, mixes, now, patchMilestones, removeMix, rename, setMilestones, store, toggleFav],
  );

  return { ready, persistent, mixes, favorites, milestones, stats, reminder, notice, saveMix, importText, ...actions };
}
