import { useCallback, useEffect, useRef, useState } from 'react';
import { getTemplates } from '../../catalog';
import { CALM } from './copy';
import { Stage } from './PlayerScreen';
import { sceneFor, useLevel } from './playerScene';
import type { CalmSession } from './useCalmSession';

/** Length of the guided pause. */
export const RESET_SECONDS = 90;
/** A catalog template whose beat eases from 12 Hz to 7.83 Hz, inside the safe bands. */
export const RESET_TEMPLATE_ID = 'android-wakeful-relax-5';

export type ResetPhase = 'idle' | 'running' | 'done';

export interface ResetFlow {
  readonly phase: ResetPhase;
  readonly left: number;
  readonly begin: () => void;
  readonly stop: () => void;
}

/** Runs the 90 second pause. Sound starts only through the safety gate. Time is read from Date.now so a slow tab cannot stretch it. */
export function useReset(s: CalmSession): ResetFlow {
  const [phase, setPhase] = useState<ResetPhase>('idle');
  const [left, setLeft] = useState(RESET_SECONDS);
  const endAt = useRef(0);
  const { player, guarded, playTemplate } = s;

  const begin = useCallback(() => {
    const t = getTemplates().find((x) => x.id === RESET_TEMPLATE_ID);
    if (t === undefined) return;
    guarded(() => {
      endAt.current = Date.now() + RESET_SECONDS * 1000;
      setLeft(RESET_SECONDS);
      setPhase('running');
      playTemplate(t, null);
    });
  }, [guarded, playTemplate]);

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
}

/** The guided 90 second pause: intro, breathing scene with Stop, then a quiet end card. */
export function ResetScreen({ s, still, theme, announce, onBack }: Props): React.JSX.Element {
  const flow = useReset(s);
  const level = useLevel(s.engine, s.snap.playing);
  const situation = sceneFor(s.snap.templateId, false);
  if (flow.phase === 'done') return <ResetEnd onAgain={flow.begin} onBack={onBack} />;
  return (
    <div className="c-player c-reset" data-testid="reset-screen" data-phase={flow.phase}>
      <h1 className="c-h1">{CALM.resetTitle}</h1>
      {flow.phase === 'idle' && <p className="c-lead">{CALM.resetIntro}</p>}
      <Stage still={still} playing={flow.phase === 'running' && s.snap.playing} situation={situation} theme={theme} level={level} announce={announce} />
      {flow.phase === 'running' ? (
        <>
          <p className="c-muted c-digits" data-testid="reset-left" aria-hidden="true">{CALM.resetLeft(flow.left)}</p>
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

function ResetEnd({ onAgain, onBack }: { readonly onAgain: () => void; readonly onBack: () => void }): React.JSX.Element {
  const back = useRef<HTMLButtonElement>(null);
  useEffect(() => back.current?.focus(), []);
  return (
    <div className="c-end c-reset" data-testid="reset-end">
      <h1 className="c-h1">{CALM.endTitle}</h1>
      <p>{CALM.resetDoneLine}</p>
      <p className="c-muted">{CALM.endNote}</p>
      <div className="c-actions">
        <button ref={back} type="button" className="c-btn c-primary" data-testid="reset-back" onClick={onBack}>
          {CALM.resetBack}
        </button>
        <button type="button" className="c-btn" data-testid="reset-again" onClick={onAgain}>
          {CALM.resetAgain}
        </button>
      </div>
    </div>
  );
}
