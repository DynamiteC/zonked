import { useEffect, useState } from 'react';
import type { PlayerSnapshot } from '@zonked-web/app/player';
import { getSession, isSafetyAccepted } from './engine/session';
import { getCrewLinkStatus, onCrewLinkStatus, useCrewLink } from './engine/crewLink';
import type { CrewLinkStatus } from './engine/crewLink';
import { isCrewEnabled, setCrewEnabled } from '@zonked-web/ui/bridgeClient';

export { engineState, engineStats } from './engine/session';

const CARD = {
  display: 'flex', flexDirection: 'column', gap: 10, padding: 16, fontFamily: 'system-ui, sans-serif',
  fontSize: 14, lineHeight: 1.4,
} as const;
const BTN = { alignSelf: 'flex-start', minHeight: 44, minWidth: 96, padding: '0 16px', font: 'inherit', cursor: 'pointer', borderRadius: 10 } as const;

/** Whole minutes left on a countdown, or null when there is none. */
function minutesLeft(s: PlayerSnapshot): number | null {
  const t = s.timer;
  if (t.kind !== 'countdown' || !t.running) return null;
  return Math.ceil(t.remainingSec / 60);
}

/** Side-panel tab: a small Now Playing card. Shares the page's singleton, so it sees the same sound. */
export default function ZonkedPanel(): React.JSX.Element {
  useCrewLink();
  const { player } = getSession();
  const [crewOn, setCrewOn] = useState(isCrewEnabled);
  const [link, setLink] = useState<CrewLinkStatus>(getCrewLinkStatus);
  useEffect(() => onCrewLinkStatus(setLink), []);
  const [snap, setSnap] = useState<PlayerSnapshot>(() => player.snapshot());
  useEffect(() => {
    setSnap(player.snapshot());
    return player.subscribe(setSnap);
  }, [player]);

  const canPlay = isSafetyAccepted() && snap.templateId !== null;
  const left = minutesLeft(snap);
  let hint = 'Stopped.';
  if (snap.playing) hint = left === null ? 'Playing.' : `Playing. About ${String(left)} min left.`;
  else if (!isSafetyAccepted()) hint = 'Open Zonked once to read the headphone note.';
  else if (snap.templateId === null) hint = 'Open Zonked and pick a sound first.';

  return (
    <div style={CARD} data-testid="zonked-panel">
      <strong data-testid="panel-title">{snap.templateName ?? 'Zonked'}</strong>
      <span data-testid="panel-hint" role="status">{hint}</span>
      {snap.playing ? (
        <button type="button" style={BTN} data-testid="panel-stop" onClick={() => void player.stop()}>Stop</button>
      ) : (
        <button type="button" style={BTN} data-testid="panel-play" disabled={!canPlay} onClick={() => void player.play()}>Play</button>
      )}
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="checkbox" data-testid="panel-crew" checked={crewOn}
          onChange={(e) => { setCrewOn(e.target.checked); setCrewEnabled(e.target.checked); }}
        />
        Let the Crew steer my sound
      </label>
      <span data-testid="panel-crew-status" role="status">
        {!crewOn ? 'Crew is off.' : link === 'connected' ? 'Crew is steering.' : 'Crew backend not reachable. Playing on your own.'}
      </span>
    </div>
  );
}
