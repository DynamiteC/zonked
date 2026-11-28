import { useEffect, useRef, useState } from 'react';
import { CALM } from './copy';
import { FormFoot } from './FormFrame';
import { Mascot } from './MascotView';
import type { StorageLike } from './data';

export const GUIDE_KEY = 'zonked.guide.v1';

export const guideDone = (storage: StorageLike): boolean => {
  try {
    return storage.get(GUIDE_KEY) === '1';
  } catch {
    return false;
  }
};

export const markGuideDone = (storage: StorageLike): void => {
  try {
    storage.set(GUIDE_KEY, '1');
  } catch {
    // Storage may be blocked. The guide then shows again next visit, which is harmless.
  }
};

interface DueInput {
  readonly open: boolean;
  readonly seen: boolean;
  readonly onboarding: boolean;
  /** The person has closed the end card at least once. */
  readonly endClosed: boolean;
  readonly endCardShown: boolean;
  readonly playing: boolean;
}

/** The guide shows when asked for, or once after the first end card is closed. Never over the end card or the feel check. */
export const guideDue = (d: DueInput): boolean => d.open || (!d.seen && !d.onboarding && d.endClosed && !d.endCardShown && !d.playing);

interface Props {
  readonly reduced: boolean;
  /** Called for Skip, Done and Escape. The parent saves that the guide is done. */
  readonly onClose: () => void;
  readonly onCrew: () => void;
}

/** Three short cards on the painted card. Skip and Done on every card. Works without motion. */
export function Guide({ reduced, onClose, onCrew }: Props): React.JSX.Element {
  const [i, setI] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => box.current?.querySelector<HTMLElement>('h2')?.focus(), [i]);
  const card = CALM.guideCards[i] ?? CALM.guideCards[0];
  const last = i === CALM.guideCards.length - 1;
  const onKey = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    } else if (e.key === 'Tab') {
      const all = Array.from(box.current?.querySelectorAll<HTMLElement>('button') ?? []);
      const at = document.activeElement;
      if (e.shiftKey && (at === all[0] || at === box.current?.querySelector('h2'))) {
        e.preventDefault();
        all[all.length - 1]?.focus();
      } else if (!e.shiftKey && at === all[all.length - 1]) {
        e.preventDefault();
        all[0]?.focus();
      }
    }
  };
  return (
    <div className="c-overlay">
      <div ref={box} className="c-dialog c-guide" role="dialog" aria-modal="true" aria-labelledby="c-guide-title" data-testid="guide" onKeyDown={onKey}>
        <div className="c-fhead">
          <Mascot size={72} mood="happy" reduced={reduced} />
          <div className="c-fhead-text">
            <p className="c-step">{CALM.guideStep(i + 1)}</p>
            <div className="c-bar" aria-hidden="true">
              {CALM.guideCards.map((c, n) => (
                <i key={c.title} data-on={n <= i ? 'true' : 'false'} />
              ))}
            </div>
          </div>
        </div>
        <h2 id="c-guide-title" className="c-ftitle" tabIndex={-1}>{card?.title}</h2>
        <p className="c-helper">{card?.body}</p>
        {i === 2 && (
          <button type="button" className="c-btn c-ghost c-guide-crew" onClick={onCrew}>
            {CALM.guideCrewLink}
          </button>
        )}
        <FormFoot
          left={{ label: CALM.guideSkip, onClick: onClose, testid: 'guide-skip' }}
          next={{ label: last ? CALM.guideDone : CALM.next, onClick: last ? onClose : () => setI(i + 1), testid: 'guide-next' }}
        />
        {!last && (
          <p className="c-guide-done">
            <button type="button" className="c-btn c-ghost" data-testid="guide-done" onClick={onClose}>
              {CALM.guideDone}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
