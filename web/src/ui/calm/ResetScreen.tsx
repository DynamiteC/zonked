import { useCallback, useEffect, useRef, useState } from 'react';
import { getTemplates } from '../../catalog';
import type { Template } from '../../catalog/types';
import { BREATHE_MINUTES, BREATHE_TEMPLATE } from './breathe';
import { CALM } from './copy';
import { Stage } from './PlayerScreen';
import { sceneFor, useLevel } from './playerScene';
import type { CalmSession } from './useCalmSession';

/** Length of the guided pause. */
export const RESET_SECONDS = 90;
/** A catalog template whose beat eases from 11 Hz to 8 Hz, inside the safe bands. */
export const RESET_TEMPLATE_ID = 'seed-pause-five';

/** One guided session: how long it lasts, what plays, and the words around it. */
export interface ResetPlan {
  readonly kind: 'reset' | 'breathe';
  readonly seconds: number;
  readonly template: () => Template | undefined;
  readonly title: string;
  readonly intro: string;
  readonly done: string;
  readonly again: string;
  readonly left: (sec: number) => string;
}

export const RESET_PLAN: ResetPlan = {
  kind: 'reset',
  seconds: RESET_SECONDS,
  template: () => getTemplates().find((x) => x.id === RESET_TEMPLATE_ID),
  title: CALM.resetTitle,
  intro: CALM.resetIntro,
  done: CALM.resetDoneLine,
  again: CALM.resetAgain,
  left: CALM.resetLeft,
};

export const BREATHE_PLAN: ResetPlan = {
  kind: 'breathe',
  seconds: BREATHE_MINUTES * 60,
  template: () => BREATHE_TEMPLATE,
  title: CALM.breatheTitle,
  intro: CALM.breatheIntro,
  done: CALM.breatheDoneLine,
  again: CALM.breatheAgain,
  left: CALM.breatheLeft,
};

export type ResetPhase = 'idle' | 'running' | 'done';

export interface ResetFlow {
  readonly phase: ResetPhase;
  readonly left: number;
  readonly begin: () => void;
  readonly stop: () => void;
}

/** Runs the 90 second pause. Sound starts only through the safety gate. Time is read from Date.now so a slow tab cannot stretch it. */
export function useReset(s: CalmSession, plan: ResetPlan = RESET_PLAN): ResetFlow {
  const [phase, setPhase] = useState<ResetPhase>('idle');
  const [left, setLeft] = useState(plan.seconds);
  const endAt = useRef(0);
  const { player, guarded, playTemplate } = s;

  const begin = useCallback(() => {
    const t = plan.template();
    if (t === undefined) return;
    guarded(() => {
      endAt.current = Date.now() + plan.seconds * 1000;
      setLeft(plan.seconds);
      setPhase('running');
      playTemplate(t, null);
    });
  }, [guarded, playTemplate, plan]);

  const stop = useCallback(() => {
    setPhase('idle');
    void player.stop();
  }, [player]);

  useEffect(() => {
    if (phase !== 'running') return undefined;
    const id = window.setInterval(() => {
      const sec = Math.ceil((endAt.current - Date.now()) / 1000);
      if (sec > 0) return setLeft(sec);
      window.clearInterval(id);
      setLeft(0);
      setPhase('done');
      void player.stop();
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, player]);

  // Sound that started and then stopped by another route (mini player, media key) ends the pause.
  const heard = useRef(false);
  const playing = s.snap.playing;
  useEffect(() => {
    if (phase !== 'running') heard.current = false;
    else if (playing) heard.current = true;
    else if (heard.current) setPhase('idle');
  }, [phase, playing]);
  // Leaving the screen ends the pause: the sound never runs on without it.
  const live = useRef(phase);
  live.current = phase;
  useEffect(() => () => void (live.current === 'running' && player.stop()), [player]);

  return { phase, left, begin, stop };
}

interface Props {
  readonly s: CalmSession;
  readonly still: boolean;
  readonly theme: 'light' | 'dark';
  readonly announce: boolean;
  readonly onBack: () => void;
  readonly plan?: ResetPlan;
}

/** The guided 90 second pause: intro, breathing scene with Stop, then a quiet end card. */
export function ResetScreen({ s, still, theme, announce, onBack, plan = RESET_PLAN }: Props): React.JSX.Element {
  const flow = useReset(s, plan);
  const level = useLevel(s.engine, s.snap.playing);
  const situation = sceneFor(s.snap.templateId, false);
  if (flow.phase === 'done') return <ResetEnd plan={plan} onAgain={flow.begin} onBack={onBack} />;
  return (
    <div className="c-player c-reset" data-testid="reset-screen" data-kind={plan.kind} data-phase={flow.phase}>
      <h1 className="c-h1">{plan.title}</h1>
      {flow.phase === 'idle' && <p className="c-lead">{plan.intro}</p>}
      <Stage still={still} playing={flow.phase === 'running' && s.snap.playing} situation={situation} theme={theme} level={level} announce={announce} />
      {flow.phase === 'running' ? (
        <>
          <p className="c-muted c-digits" data-testid="reset-left" aria-hidden="true">{plan.left(flow.left)}</p>
          <div className="c-controls">
            <button type="button" className="c-btn c-round c-big" data-testid="reset-stop" onClick={flow.stop}>
              {CALM.stop}
            </button>
          </div>
        </>
      ) : (
        <div className="c-actions">
          <button type="button" className="c-btn c-primary" data-testid="reset-begin" onClick={flow.begin}>
            {CALM.resetStart}
          </button>
          <button type="button" className="c-btn c-link" onClick={onBack}>
            {CALM.resetBack}
          </button>
        </div>
      )}
      <p className="c-muted">{CALM.volumeCapped}</p>
    </div>
  );
}

function ResetEnd({ plan, onAgain, onBack }: { readonly plan: ResetPlan; readonly onAgain: () => void; readonly onBack: () => void }): React.JSX.Element {
  const back = useRef<HTMLButtonElement>(null);
  useEffect(() => back.current?.focus(), []);
  return (
    <div className="c-end c-reset" data-testid="reset-end">
      <h1 className="c-h1">{CALM.endTitle}</h1>
      <p>{plan.done}</p>
      <p className="c-muted">{CALM.endNote}</p>
      <div className="c-actions">
        <button ref={back} type="button" className="c-btn c-primary" data-testid="reset-back" onClick={onBack}>
          {CALM.resetBack}
        </button>
        <button type="button" className="c-btn" data-testid="reset-again" onClick={onAgain}>
          {plan.again}
        </button>
      </div>
    </div>
  );
}
