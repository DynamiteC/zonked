import { useEffect, useRef } from 'react';
import { CALM } from './copy';

interface Props {
  readonly onAccept: () => void;
  /** Present only in the dialog form. */
  readonly onCancel?: () => void;
}

/** The required notice. In dialog form it traps focus and Escape closes it without playing. */
export function SafetyNotice({ onAccept, onCancel }: Props): React.JSX.Element {
  const ok = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  useEffect(() => ok.current?.focus(), []);

  const onKey = (e: React.KeyboardEvent): void => {
    if (onCancel === undefined) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      onCancel();
    } else if (e.key === 'Tab') {
      const edge = e.shiftKey ? cancel.current : ok.current;
      if (document.activeElement === edge) {
        e.preventDefault();
        (e.shiftKey ? ok.current : cancel.current)?.focus();
      }
    }
  };

  const body = (
    <div className="c-safety" onKeyDown={onKey}>
      <h2 id="c-safety-title">{CALM.safetyTitle}</h2>
      <ul className="c-safe-list">
        {CALM.safetyLines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <p className="c-limits" data-testid="safety-limits">{CALM.safetyLimits}</p>
      <div className="c-actions c-row">
        {onCancel !== undefined && (
          <button ref={cancel} type="button" className="c-btn" onClick={onCancel}>
            {CALM.back}
          </button>
        )}
        <button ref={ok} type="button" className="c-btn c-primary" data-testid="calm-safety-accept" onClick={onAccept}>
          {CALM.safetyAccept}
        </button>
      </div>
    </div>
  );
  if (onCancel === undefined) return body;
  return (
    <div className="c-overlay">
      <div className="c-dialog" role="dialog" aria-modal="true" aria-labelledby="c-safety-title">
        {body}
      </div>
    </div>
  );
}
