import { useEffect, useState } from 'react';
import type { Player, PlayerSnapshot } from '../../app/player';

/** Live snapshot of a Player. Subscribes on mount, unsubscribes on unmount. */
export function usePlayerSnapshot(player: Pick<Player, 'snapshot' | 'subscribe'>): PlayerSnapshot {
  const [snap, setSnap] = useState<PlayerSnapshot>(() => player.snapshot());
  useEffect(() => player.subscribe(setSnap), [player]);
  return snap;
}
