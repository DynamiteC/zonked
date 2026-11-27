import { useEffect, useState } from 'react';
import type { Player } from '../../app/player';
import { BridgeClient, isCrewEnabled, onCrewChange } from '../bridgeClient';
import type { BridgeDeps, BridgeStatus } from '../bridgeClient';

export interface CrewInfo {
  readonly enabled: boolean;
  readonly status: BridgeStatus;
}

/** Same loopback client as Studio. Nothing connects until the existing crew switch is on. */
export function useCrewBridge(player: Player, create?: BridgeDeps['create']): CrewInfo {
  const [status, setStatus] = useState<BridgeStatus>('standalone');
  const [enabled, setEnabled] = useState(() => isCrewEnabled());
  useEffect(() => onCrewChange(setEnabled), []);
  useEffect(() => {
    const client = new BridgeClient({
      ...(create !== undefined ? { create } : {}),
      onStatus: (s) => {
        setStatus(s);
        if (s === 'standalone') player.crewLost();
      },
      onState: (state) => player.applyCrew(state),
    });
    client.start();
    return () => client.stop();
  }, [player, create]);
  return { enabled, status };
}
