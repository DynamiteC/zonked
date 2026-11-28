import { useEffect, useState } from 'react';
import { CALM } from './copy';

export type Phase = 'Breathe in' | 'Breathe out';

export interface Counter {
  readonly label: Phase;
  /** Whole seconds left in this phase: 4, 3, 2, 1. */
  readonly count: number;
}

const START: Counter = { label: 'Breathe in', count: 4 };

/** A once-a-second counter for reduced motion: 4 in, 4 out. It drives text only, never an animation. */
export function useBreathCounter(running: boolean): Counter {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!running) return undefined;
    const id = window.setInterval(() => setN((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  if (!running) return START;
  const step = n % 8;
  return { label: step < 4 ? 'Breathe in' : 'Breathe out', count: 4 - (step % 4) };
}

/** Visible counter text such as "Breathe in, 3". Hidden from screen readers: the live region speaks the phase. */
export const counterText = (c: Counter): string => (c.label === 'Breathe in' ? CALM.counterIn(c.count) : CALM.counterOut(c.count));

interface Props {
  readonly label: Phase;
  readonly on: boolean;
  /** Speak only when a person asked for it in Settings. */
  readonly announce: boolean;
}

/** Polite live region. Its text changes only when the phase changes, so it speaks once per phase. */
export function BreathLive({ label, on, announce }: Props): React.JSX.Element {
  return (
    <p className="c-sr" role="status" aria-live="polite" data-testid="breath-live">
      {on && announce ? label : ''}
    </p>
  );
}
