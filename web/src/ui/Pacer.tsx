import { useEffect, useState } from 'react';

interface Props {
  inSec: number;
  outSec: number;
  reduced: boolean;
}

/** Breathe In / Breathe Out pacer. Phase flips at most every few seconds (well under 3 Hz). */
export function Pacer({ inSec, outSec, reduced }: Props): React.JSX.Element {
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const dur = phase === 'in' ? inSec : outSec;

  useEffect(() => {
    const id = setTimeout(() => setPhase((p) => (p === 'in' ? 'out' : 'in')), Math.max(1, dur) * 1000);
    return () => clearTimeout(id);
  }, [phase, dur]);

  const label = phase === 'in' ? 'Breathe In' : 'Breathe Out';
  return (
    <section className="pacer" aria-label="Breathing pacer" data-testid="pacer" data-phase={phase}>
      {!reduced && (
        <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" className="pacer-svg">
          <circle
            cx="100"
            cy="100"
            r="80"
            className="pacer-circle"
            style={{
              transform: phase === 'in' ? 'scale(1)' : 'scale(0.45)',
              transition: `transform ${dur}s ease-in-out`,
            }}
          />
        </svg>
      )}
      <p className="pacer-text" role="status" aria-live="polite" data-testid="pacer-text">
        {label}
      </p>
    </section>
  );
}
