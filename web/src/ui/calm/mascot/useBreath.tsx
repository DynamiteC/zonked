import { useEffect, useState, type JSX } from 'react';
import { breathCurve, breathLabel, type BreathLabel } from './breath';

export interface BreathState {
  readonly phase: number;
  readonly label: BreathLabel;
}

const IDLE: BreathState = { phase: 0, label: 'Breathe in' };
const MIN_STEP = 0.004;

/** Drives a 4 s in, 4 s out breath with requestAnimationFrame. Stops and resets when running is false. */
export function useBreath(running: boolean): BreathState {
  const [state, setState] = useState<BreathState>(IDLE);
  useEffect(() => {
    if (!running || typeof requestAnimationFrame !== 'function') {
      setState(IDLE);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number): void => {
      const t = (now - t0) / 1000;
      const phase = breathCurve(t);
      const label = breathLabel(t);
      setState((p) => (label === p.label && Math.abs(phase - p.phase) < MIN_STEP ? p : { phase, label }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [running]);
  return state;
}

/** Visible text cue. Screen readers hear it only when the phase changes. */
export function BreathCue({ label, className }: { readonly label: BreathLabel; readonly className?: string }): JSX.Element {
  return (
    <p className={className ?? 'cm-cue'} aria-live="polite" role="status">
      {label}
    </p>
  );
}
