import { useEffect, useState } from 'react';
import './fonts.css';
import type { PlayerSnapshot } from '@zonked-web/app/player';
import { CALM } from '@zonked-web/ui/calm/copy';
import { getSession, isPageOpen, isSafetyAccepted, onPageOpen } from './engine/session';
import { getCrewLinkStatus, onCrewLinkStatus, useCrewLink } from './engine/crewLink';
import type { CrewLinkStatus } from './engine/crewLink';
import { ensureStyles } from './engine/styles';
import { isCrewEnabled, setCrewEnabled } from '@zonked-web/ui/bridgeClient';

export { engineState, engineStats } from './engine/session';

/** Whole minutes left on a countdown, or null when there is none. */
function minutesLeft(s: PlayerSnapshot): number | null {
  const t = s.timer;
  if (t.kind !== 'countdown' || !t.running) return null;
  return Math.ceil(t.remainingSec / 60);
}

function hintFor(snap: PlayerSnapshot): string {
  const left = minutesLeft(snap);
  if (snap.playing) return left === null ? CALM.panelPlaying : `${CALM.panelPlaying} About ${String(left)} min left.`;
  if (!isSafetyAccepted()) return CALM.panelOpenFirst;
  if (snap.templateId === null) return CALM.panelPickFirst;
  return CALM.panelStopped;
}

/** Side-panel tab: a small Now Playing card with the shared Calm classes. One Stop only: the page owns it while open. */
export default function ZonkedPanel(): React.JSX.Element {
  ensureStyles(import.meta.url);
  useCrewLink();
  const { player } = getSession();
  const [crewOn, setCrewOn] = useState(isCrewEnabled);
  const [link, setLink] = useState<CrewLinkStatus>(getCrewLinkStatus);
  const [pageOpen, setPageOpen] = useState(isPageOpen);
  useEffect(() => onCrewLinkStatus(setLink), []);
  useEffect(() => onPageOpen(setPageOpen), []);
  const [snap, setSnap] = useState<PlayerSnapshot>(() => player.snapshot());
  useEffect(() => {
    setSnap(player.snapshot());
    return player.subscribe(setSnap);
  }, [player]);

  const canPlay = isSafetyAccepted() && snap.templateId !== null;
  const crewText = !crewOn ? CALM.panelCrewOff : link === 'connected' ? CALM.panelCrewOn : CALM.panelCrewLost;
  return (
    <div className="c-app c-panel" data-testid="zonked-panel" data-theme="auto">
      <div className="c-card">
        <strong data-testid="panel-title">{snap.templateName ?? CALM.brand}</strong>
        <p className="c-muted" data-testid="panel-hint" role="status">{hintFor(snap)}</p>
        {pageOpen ? null : snap.playing ? (
          <button type="button" className="c-btn c-small" data-testid="panel-stop" onClick={() => void player.stop()}>{CALM.stop}</button>
        ) : (
          <button type="button" className="c-btn c-small" data-testid="panel-play" disabled={!canPlay} onClick={() => void player.play()}>{CALM.play}</button>
        )}
        <label className="c-switch">
          <input
            type="checkbox" role="switch" data-testid="panel-crew" checked={crewOn}
            onChange={(e) => { setCrewOn(e.target.checked); setCrewEnabled(e.target.checked); }}
          />
          <span className="c-track" aria-hidden="true" />
          <span>{CALM.panelCrewLabel}</span>
        </label>
        <p className="c-muted" data-testid="panel-crew-status" role="status">{crewText}</p>
      </div>
    </div>
  );
}
