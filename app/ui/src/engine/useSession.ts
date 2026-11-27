import { useCallback, useEffect, useRef, useState } from 'react';
import type { Template } from '@zonked-web/catalog/types';
import type { PlayerSnapshot } from '@zonked-web/app/player';
import { useReducedMotion } from '@zonked-web/app/useReducedMotion';
import { SAFETY_KEY, writeFlag } from '@zonked-web/storage/prefs';
import type { CalmSession } from '@zonked-web/ui/calm/useCalmSession';
import { getSession, isSafetyAccepted } from './session';

/**
 * Replaces web/src/ui/calm/useCalmSession.ts in the app build (see vite.config.ts).
 * Same return shape, but the player, store and plumbing live in the module singleton,
 * so unmounting the page never stops the sound. Only React state is created here.
 */
export function useCalmSession(): CalmSession {
  const { player, store, engine } = getSession();
  const [snap, setSnap] = useState<PlayerSnapshot>(() => player.snapshot());
  const [accepted, setAccepted] = useState(isSafetyAccepted);
  const [gate, setGate] = useState(false);
  const [reduced, setReduced, userReduced] = useReducedMotion();
  const pending = useRef<(() => void) | null>(null);
  /** Set the moment the notice is accepted, so a play in the same tick passes the gate. */
  const acceptedNow = useRef(accepted);

  useEffect(() => {
    setSnap(player.snapshot());
    return player.subscribe(setSnap);
  }, [player]);

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
    (t: Template, minutes: number | null) =>
      guarded(() => {
        player.setQueue([t]);
        void player.playTemplate(t).then((ok) => {
          if (ok && minutes !== null) player.startTimer({ kind: 'countdown', minutes });
        });
      }),
    [player, guarded],
  );
  const toggle = useCallback(() => {
    if (player.snapshot().playing) void player.stop();
    else guarded(() => void player.play());
  }, [player, guarded]);

  return { engine, player, store, snap, accepted, gate, reduced, setReduced, userReduced, guarded, accept, cancelGate, playTemplate, toggle };
}
