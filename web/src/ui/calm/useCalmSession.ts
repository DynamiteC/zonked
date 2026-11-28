import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AudioEngine } from '../../audio/types';
import { Player, realClock } from '../../app/player';
import type { Clock, PlayerSnapshot } from '../../app/player';
import type { TimerSpec } from '../../app/timers';
import { installE2E } from '../../app/e2e';
import { reportPlaying } from '../../app/swUpdate';
import { useReducedMotion, safeStorage } from '../../app/useReducedMotion';
import { useSessionPlumbing } from '../../app/useSessionPlumbing';
import { resolveShortcut } from '../../app/shortcuts';
import { WakeLockController } from '../../app/wakeLock';
import { templateToEvents } from '../../catalog/events';
import type { Template } from '../../catalog/types';
import { createStore } from '../../storage/db';
import type { Store } from '../../storage/db';
import { SAFETY_KEY, readFlag, writeFlag } from '../../storage/prefs';

export interface CalmSession {
  readonly engine: AudioEngine;
  readonly player: Player;
  readonly store: Store;
  readonly snap: PlayerSnapshot;
  readonly accepted: boolean;
  /** True while the safety dialog is open for a play that waited on it. */
  readonly gate: boolean;
  readonly reduced: boolean;
  readonly setReduced: (v: boolean) => void;
  readonly userReduced: boolean;
  /** Runs fn now once the notice is accepted, else after the person accepts it. */
  readonly guarded: (fn: () => void) => void;
  readonly accept: () => void;
  readonly cancelGate: () => void;
  /** Plays one template through the safety gate. A countdown starts only after sound starts. */
  readonly playTemplate: (t: Template, timer: number | TimerSpec | null) => void;
  readonly toggle: () => void;
}

const toEvents = (t: { id: string }): ReturnType<typeof templateToEvents> => templateToEvents(t as Template);

export function useCalmSession(engine: AudioEngine, clock: Clock = realClock, storeProp?: Store): CalmSession {
  const store = useMemo(() => storeProp ?? createStore(), [storeProp]);
  const player = useMemo(
    () => new Player(engine, clock, (log) => void store.addLog(log).catch(() => undefined), { toEvents }),
    [engine, clock, store],
  );
  const wake = useMemo(() => new WakeLockController(undefined, safeStorage()), []);
  const [snap, setSnap] = useState<PlayerSnapshot>(() => player.snapshot());
  const [accepted, setAccepted] = useState(() => readFlag(SAFETY_KEY));
  const [gate, setGate] = useState(false);
  const [reduced, setReduced, userReduced] = useReducedMotion();
  const snapRef = useRef(snap);
  snapRef.current = snap;
  const pending = useRef<(() => void) | null>(null);
  /** Set the moment the notice is accepted, so a play in the same tick passes the gate. */
  const acceptedNow = useRef(accepted);

  useEffect(() => player.subscribe(setSnap), [player]);
  useEffect(() => void installE2E(window, engine, () => player.snapshot().presetId, player), [engine, player]);
  useEffect(() => reportPlaying(snap.playing), [snap.playing]);
  useEffect(() => () => void player.stop(), [player]);

  const guarded = useCallback(
    (fn: () => void) => {
      if (acceptedNow.current) fn();
      else {
        pending.current = fn;
        setGate(true);
      }
    },
    [],
  );
  const accept = useCallback(() => {
    writeFlag(SAFETY_KEY, true);
    acceptedNow.current = true;
    setAccepted(true);
    setGate(false);
    const fn = pending.current;
    pending.current = null;
    fn?.();
  }, []);
  const cancelGate = useCallback(() => {
    pending.current = null;
    setGate(false);
  }, []);

  const playTemplate = useCallback(
    (t: Template, timer: number | TimerSpec | null) =>
      guarded(() => {
        player.setQueue([t]);
        void player.playTemplate(t).then((ok) => {
          if (ok && timer !== null) player.startTimer(typeof timer === 'number' ? { kind: 'countdown', minutes: timer } : timer);
        });
      }),
    [player, guarded],
  );
  const toggle = useCallback(() => {
    if (snapRef.current.playing) void player.stop();
    else guarded(() => void player.play());
  }, [player, guarded]);

  const actions = useRef<Parameters<typeof useSessionPlumbing>[0]['actions']['current']>({});
  actions.current = { 'play-pause': toggle };
  useSessionPlumbing({ player, engine, wake, snap, snapRef, actions });
  // Space plays or pauses when nothing else has focus. A focused button or field keeps its own Space.
  useEffect(() => {
    const on = (e: KeyboardEvent): void => {
      if (e.target !== document.body || e.repeat || resolveShortcut(e) !== 'play-pause') return;
      e.preventDefault();
      actions.current['play-pause']?.();
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);

  return { engine, player, store, snap, accepted, gate, reduced, setReduced, userReduced, guarded, accept, cancelGate, playTemplate, toggle };
}
