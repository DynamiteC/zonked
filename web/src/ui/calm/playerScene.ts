import { useEffect, useState } from 'react';
import { getTemplates } from '../../catalog';
import type { Situation } from '../../catalog/types';
import type { AudioEngine } from '../../audio/types';
import type { SceneSituation } from './visuals';

const SLEEP: readonly Situation[] = ['cant-sleep', 'lucid-dream'];
const FOCUS: readonly Situation[] = ['adhd-focus', 'deep-work', 'ai-burnout'];

/** Scene for a template: sleep, focus or calm. Nature wins while a nature layer plays. */
export function sceneFor(templateId: string | null, natureOn: boolean): SceneSituation {
  if (natureOn) return 'nature';
  const t = templateId === null ? undefined : getTemplates().find((x) => x.id === templateId);
  const list = t?.situations ?? [];
  if (list.some((s) => SLEEP.includes(s))) return 'sleep';
  if (list.some((s) => FOCUS.includes(s))) return 'focus';
  return 'calm';
}

const POLL_MS = 400;

/** Smoothed output level 0..1 from engine stats. Zero when not playing. Never throws. */
export function useLevel(engine: AudioEngine, playing: boolean): number {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    if (!playing) {
      setLevel(0);
      return undefined;
    }
    let live = true;
    const id = window.setInterval(() => {
      engine
        .getStats()
        .then((s) => {
          const v = Number.isFinite(s.rms) ? Math.min(1, Math.max(0, s.rms * 4)) : 0;
          if (live) setLevel((p) => p * 0.6 + v * 0.4);
        })
        .catch(() => undefined);
    }, POLL_MS);
    return () => {
      live = false;
      window.clearInterval(id);
    };
  }, [engine, playing]);
  return level;
}
