import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getTemplates } from '../../catalog';
import type { Template } from '../../catalog/types';
import { SPRINT_SPEC, breakTemplate, enterBreak, nextSprint } from './sprint';
import type { SprintPhase } from './sprint';
import type { CalmSession } from './useCalmSession';

interface Run {
  readonly focus: Template;
  readonly breakId: string | null;
  readonly phase: SprintPhase;
}

export interface Sprint {
  /** True from the first tap until the break ends or the person stops. */
  readonly active: boolean;
  readonly phase: SprintPhase | null;
  /** The focus sound while a sprint runs, for the scene and the end card. */
  readonly focus: Template | null;
  /** Starts a sprint on this sound. Goes through the safety notice like every other start. */
  readonly start: (t: Template) => void;
  readonly cancel: () => void;
}

/** One focus sprint: 25 minutes, a chime, a calmer 5 minute break, then the end card. Reuses the Studio pomodoro timer. */
export function useSprint(s: CalmSession): Sprint {
  const [run, setRun] = useState<Run | null>(null);
  const heard = useRef(false);
  const { player, guarded } = s;
  const { playing, templateId, timer } = s.snap;

  const cancel = useCallback(() => {
    setRun(null);
    player.stopTimer();
  }, [player]);

  const start = useCallback(
    (t: Template) =>
      guarded(() => {
        heard.current = false;
        const begin = (): void => {
          player.startTimer(SPRINT_SPEC);
          setRun({ focus: t, breakId: null, phase: 'focus' });
        };
        if (player.snapshot().playing && player.snapshot().templateId === t.id) return begin();
        player.setQueue([t]);
        void player.playTemplate(t).then((ok) => ok && begin());
      }),
    [player, guarded],
  );

  useEffect(() => {
    if (run === null) return;
    if (playing) heard.current = true;
    else if (heard.current) return cancel();
    const step = nextSprint(run.phase, timer);
    if (step.action === 'cancel') return setRun(null);
    if (step.action === null) {
      // Another sound picked from outside the sprint ends it.
      if (playing && templateId !== run.focus.id && templateId !== run.breakId) cancel();
      return;
    }
    if (step.action === 'break') {
      const brk = breakTemplate(run.focus.id, getTemplates());
      setRun({ ...run, phase: 'break', breakId: brk?.id ?? null });
      if (brk !== undefined) void enterBreak(player, brk);
      return;
    }
    setRun(null);
    player.stopTimer();
    void player.stop();
  }, [run, playing, templateId, timer, player, cancel]);

  return useMemo(
    () => ({ active: run !== null, phase: run?.phase ?? null, focus: run?.focus ?? null, start, cancel }),
    [run, start, cancel],
  );
}
