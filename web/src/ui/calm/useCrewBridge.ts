import { useEffect, useState, useSyncExternalStore } from 'react';
import { getCrewView, ingestCrew, lostCrew, subscribeCrew } from '../../app/crewFeed';
import type { CrewView } from '../../app/crewFeed';
import type { Player } from '../../app/player';
import { BridgeClient, isCrewEnabled, onCrewChange } from '../bridgeClient';
import type { BridgeDeps, BridgeStatus } from '../bridgeClient';

export interface CrewInfo {
  readonly enabled: boolean;
  readonly status: BridgeStatus;
  /** What the Crew screen shows: latest state, source, pause and demo timing. */
  readonly view: CrewView;
}

/** Same loopback client as Studio. Nothing connects until the existing crew switch is on. */
export function useCrewBridge(player: Player, create?: BridgeDeps['create']): CrewInfo {
  const [status, setStatus] = useState<BridgeStatus>('standalone');
  const [enabled, setEnabled] = useState(() => isCrewEnabled());
  useEffect(() => onCrewChange(setEnabled), []);
  useEffect(() => {
    let delivered = false;
    const client = new BridgeClient({
      ...(create !== undefined ? { create } : {}),
      onStatus: (s) => {
        setStatus(s);
        if (s === 'standalone') {
          if (getCrewView().source !== 'demo') player.crewLost();
          if (delivered) lostCrew();
          delivered = false;
        }
      },
      onState: (state) => {
        delivered = true;
        ingestCrew(player, state);
      },
    });
    client.start();
    return () => client.stop();
  }, [player, create]);
  const view = useSyncExternalStore(subscribeCrew, getCrewView, getCrewView);
  return { enabled, status, view };
}
