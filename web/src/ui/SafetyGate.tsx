import { useEffect, useRef } from 'react';
import { COPY } from './copy';

interface Props {
  onAccept: () => void;
  onCancel: () => void;
}

export function SafetyGate({ onAccept, onCancel }: Props): React.JSX.Element {
  const ok = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ok.current?.focus();
  }, []);

  const onKey = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onCancel();
    } else if (e.key === 'Tab') {
      const first = cancel.current;
      const last = ok.current;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  };

  return (
    <div className="overlay">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="safety-title"
        aria-describedby="safety-body"
        onKeyDown={onKey}
      >
        <h2 id="safety-title">Before you listen</h2>
        <ul id="safety-body">
          <li>Use stereo headphones. Binaural beats do not work on speakers.</li>
          <li>Start with the volume low. Playback fades in over a few seconds.</li>
          <li>Zonked is not a medical device and makes no health claims.</li>
          <li>
            If you are sensitive to flashing light, enable Reduce motion. Visual pulses never exceed 3 per second.
          </li>
          <li>Stop if you feel dizzy or unwell.</li>
        </ul>
        <p className="meta">{COPY.headphoneNote}</p>
        <div className="dialog-actions">
          <button ref={cancel} type="button" className="btn" onClick={onCancel}>
            Not now
          </button>
          <button ref={ok} type="button" className="btn btn-primary" data-testid="safety-accept" onClick={onAccept}>
            I understand, start
          </button>
        </div>
      </div>
    </div>
  );
}
