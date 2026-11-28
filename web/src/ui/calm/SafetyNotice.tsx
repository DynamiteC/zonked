import { useEffect, useRef } from 'react';
import { CALM } from './copy';
import { FormFoot } from './FormFrame';

interface Props {
  readonly onAccept: () => void;
  /** Present only in the dialog form. */
  readonly onCancel?: () => void;
  /** Inline form in onboarding: the Back button. */
  readonly onBack?: () => void;
}

/** The required notice. In dialog form it traps focus and Escape closes it without playing. */
export function SafetyNotice({ onAccept, onCancel, onBack }: Props): React.JSX.Element {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => box.current?.querySelector<HTMLButtonElement>('[data-testid="calm-safety-accept"]')?.focus(), []);

  const onKey = (e: React.KeyboardEvent): void => {
    if (onCancel === undefined) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      onCancel();
    } else if (e.key === 'Tab') {
      const all = box.current?.querySelectorAll<HTMLButtonElement>('button') ?? [];
      const first = all[0];
      const last = all[all.length - 1];
      const edge = e.shiftKey ? first : last;
      if (document.activeElement === edge) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    }
  };
  const back = onCancel ?? onBack;

  const body = (
    <div className="c-safety" ref={box} onKeyDown={onKey}>
      <h2 id="c-safety-title">{CALM.safetyTitle}</h2>
      <ul className="c-safe-list">
        {CALM.safetyLines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <p className="c-limits" data-testid="safety-limits">{CALM.safetyLimits}</p>
      <FormFoot left={back === undefined ? null : { label: CALM.back, onClick: back }} next={{ label: CALM.safetyAccept, onClick: onAccept, testid: 'calm-safety-accept' }} />
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
