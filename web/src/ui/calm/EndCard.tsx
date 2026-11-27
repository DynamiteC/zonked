import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PlayerSnapshot } from '../../app/player';
import { CALM } from './copy';
import type { FeelAnswer } from './data';

/** A session shorter than this ends without a card, so quick toggles and previews stay quiet. */
export const END_CARD_MIN_SEC = 60;
const SETTLE_MS = 400;

export interface EndInfo {
  readonly id: string;
  readonly name: string;
  readonly minutes: number;
}

/** Returns the finished session once sound stays stopped, or null. A track change does not count. */
export function useEndCard(snap: PlayerSnapshot, enabled: boolean, label: { readonly id: string; readonly name: string } | null = null): { readonly card: EndInfo | null; readonly dismiss: () => void } {
  const last = useRef<EndInfo | null>(null);
  const [card, setCard] = useState<EndInfo | null>(null);
  useEffect(() => {
    if (snap.playing) {
      setCard(null);
      last.current = snap.templateId === null ? null : { id: label?.id ?? snap.templateId, name: label?.name ?? snap.templateName ?? CALM.brand, minutes: snap.elapsedSec / 60 };
      return undefined;
    }
    const done = last.current;
    last.current = null;
    if (!enabled || done === null || done.minutes * 60 < END_CARD_MIN_SEC) return undefined;
    const id = window.setTimeout(() => setCard({ ...done, minutes: Math.round(done.minutes) }), SETTLE_MS);
    return () => window.clearTimeout(id);
  }, [snap.playing, snap.templateId, snap.templateName, snap.elapsedSec, enabled, label?.id, label?.name]);
  const dismiss = useCallback(() => setCard(null), []);
  return useMemo(() => ({ card, dismiss }), [card, dismiss]);
}

interface Props {
  readonly info: EndInfo;
  readonly onAgain: () => void;
  readonly onClose: () => void;
  /** True on the day the person joined: names Studio once. */
  readonly firstRun?: boolean;
  /** Saves one "How was that?" answer on this device. Leave out to hide the row. */
  readonly onFeel?: (a: FeelAnswer) => void;
}

const FEEL_CHOICES: readonly (readonly [FeelAnswer, string])[] = [
  ['calmer', CALM.feelCalmer],
  ['same', CALM.feelSame],
  ['not', CALM.feelNot],
];

/** One optional row. After a tap it says the answer stays on this device. No score is shown. */
function FeelRow({ onFeel }: { readonly onFeel: (a: FeelAnswer) => void }): React.JSX.Element {
  const [done, setDone] = useState(false);
  if (done) return <p className="c-muted" role="status" data-testid="feel-saved">{CALM.feelSaved}</p>;
  return (
    <div role="group" aria-labelledby="c-feel-q" className="c-feel" data-testid="feel-row">
      <p id="c-feel-q" className="c-muted">{CALM.feelQuestion}</p>
      <div className="c-chips">
        {FEEL_CHOICES.map(([a, label]) => (
          <button key={a} type="button" className="c-tchip" data-testid={`feel-${a}`} onClick={() => { onFeel(a); setDone(true); }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** One calm line, what played, how long. No streaks and no pressure to return. */
export function EndCard({ info, onAgain, onClose, firstRun = false, onFeel }: Props): React.JSX.Element {
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
        {onFeel !== undefined && <FeelRow onFeel={onFeel} />}
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
