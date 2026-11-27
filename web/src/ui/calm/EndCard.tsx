import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PlayerSnapshot } from '../../app/player';
import { CALM } from './copy';

/** A session shorter than this ends without a card, so quick toggles and previews stay quiet. */
export const END_CARD_MIN_SEC = 60;
const SETTLE_MS = 400;

export interface EndInfo {
  readonly id: string;
  readonly name: string;
  readonly minutes: number;
}

/** Returns the finished session once sound stays stopped, or null. A track change does not count. */
export function useEndCard(snap: PlayerSnapshot, enabled: boolean): { readonly card: EndInfo | null; readonly dismiss: () => void } {
  const last = useRef<EndInfo | null>(null);
  const [card, setCard] = useState<EndInfo | null>(null);
  useEffect(() => {
    if (snap.playing) {
      setCard(null);
      last.current = snap.templateId === null ? null : { id: snap.templateId, name: snap.templateName ?? CALM.brand, minutes: snap.elapsedSec / 60 };
      return undefined;
    }
    const done = last.current;
    last.current = null;
    if (!enabled || done === null || done.minutes * 60 < END_CARD_MIN_SEC) return undefined;
    const id = window.setTimeout(() => setCard({ ...done, minutes: Math.round(done.minutes) }), SETTLE_MS);
    return () => window.clearTimeout(id);
  }, [snap.playing, snap.templateId, snap.templateName, snap.elapsedSec, enabled]);
  const dismiss = useCallback(() => setCard(null), []);
  return useMemo(() => ({ card, dismiss }), [card, dismiss]);
}

interface Props {
  readonly info: EndInfo;
  readonly onAgain: () => void;
  readonly onClose: () => void;
  /** True on the day the person joined: names Studio once. */
  readonly firstRun?: boolean;
}

/** One calm line, what played, how long. No streaks and no pressure to return. */
export function EndCard({ info, onAgain, onClose, firstRun = false }: Props): React.JSX.Element {
  const again = useRef<HTMLButtonElement>(null);
  useEffect(() => again.current?.focus(), []);
  return (
    <div className="c-overlay" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="c-dialog c-end" role="dialog" aria-modal="true" aria-labelledby="c-end-title" data-testid="end-card">
        <h2 id="c-end-title" className="c-h1">
          {CALM.endTitle}
        </h2>
        <p>{CALM.endLine(info.name, info.minutes)}</p>
        <p className="c-muted">{CALM.endNote}</p>
        {firstRun && <p className="c-note" data-testid="first-run-note">{CALM.studioNote}</p>}
        <div className="c-actions">
          <button ref={again} type="button" className="c-btn c-primary" data-testid="end-again" onClick={onAgain}>
            {CALM.playAgain}
          </button>
          <button type="button" className="c-btn" data-testid="end-close" onClick={onClose}>
            {CALM.close}
          </button>
        </div>
      </div>
    </div>
  );
}
