import { useEffect, useId, useState, type JSX } from 'react';
import './visuals.css';
import { CalmScene, FocusScene, NatureScene, SleepScene, VIEW } from './scenes';

export type SceneSituation = 'focus' | 'calm' | 'sleep' | 'nature';

export interface SceneLoopProps {
  readonly situation: SceneSituation;
  /** Renders one still frame. Default: follows prefers-reduced-motion. */
  readonly reducedMotion?: boolean;
  /** Forces a palette. Default: follows the app theme (c-app data-theme) or the system. */
  readonly theme?: 'light' | 'dark';
}

const prefersReduced = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True while the tab is hidden. CSS animations are paused then. */
function useHidden(): boolean {
  const [hidden, setHidden] = useState(typeof document !== 'undefined' && document.hidden);
  useEffect(() => {
    const on = (): void => setHidden(document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => {
      document.removeEventListener('visibilitychange', on);
    };
  }, []);
  return hidden;
}

/** A 3 second seamless loop for one situation. Fills its parent. Decorative: hidden from screen readers. */
export function SceneLoop({ situation, reducedMotion, theme }: SceneLoopProps): JSX.Element {
  const id = `sl${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const hidden = useHidden();
  const still = reducedMotion ?? prefersReduced();
  const cls = `vl vl-${situation}${still ? ' vl-still' : ''}${hidden ? ' vl-paused' : ''}`;
  return (
    <svg className={cls} data-vl={theme} data-situation={situation} viewBox={VIEW} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {situation === 'focus' && <FocusScene id={id} />}
      {situation === 'calm' && <CalmScene id={id} />}
      {situation === 'sleep' && <SleepScene id={id} />}
      {situation === 'nature' && <NatureScene />}
    </svg>
  );
}
