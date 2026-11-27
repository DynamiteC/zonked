import { useEffect, useState } from 'react';
import type { CrewView } from '../../app/crewFeed';
import { CREW_MIN_GAP_MS } from '../../app/crewFeed';
import { CALM, crewWhy, hzText } from './copy';

const STEPS = ['Fresh', 'Warming up', CALM.crewBreak] as const;

/** Burnout score is 0 to 100. Under 40 is fresh, under 60 warming up, else time for a break. */
export function meterStep(score: number | null): 0 | 1 | 2 {
  if (score === null || !Number.isFinite(score) || score < 40) return 0;
  return score < 60 ? 1 : 2;
}

/** Wall clock that ticks once a second while the panel is on screen. */
function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return undefined;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

const clock = (ms: number): string => new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** The line under Next change. Demo counts down; real crew names the earliest time and the condition. */
export function nextLine(view: CrewView, now: number): string {
  if (view.source === 'demo' && view.demoNextAtMs !== null) {
    const sec = Math.max(0, Math.ceil((view.demoNextAtMs - now) / 1000));
    const last = view.state?.burnout.level === 'decompress';
    return last ? CALM.crewNextDemoLast(sec) : CALM.crewNextDemo(sec);
  }
  if (view.changedAtMs === 0) return CALM.crewNextWait;
  return CALM.crewNextReal(clock(Math.max(now, view.changedAtMs + CREW_MIN_GAP_MS)));
}

interface Props {
  readonly view: CrewView;
  readonly overridden: boolean;
  readonly onNotNow: () => void;
  readonly onResume: () => void;
  readonly onFollow: () => void;
  readonly onStopDemo: () => void;
}

/** Status, score, beat, next change, the why sentence and the controls. Text only. */
export function CrewPanel({ view, overridden, onNotNow, onResume, onFollow, onStopDemo }: Props): React.JSX.Element | null {
  const now = useNow(view.state !== null);
  const st = view.state;
  if (st === null) return null;
  const demo = view.source === 'demo';
  const paused = !demo && now < view.snoozeUntilMs;
  const status = demo ? CALM.crewDemoBadge : paused ? CALM.crewPaused(clock(view.snoozeUntilMs)) : CALM.crewFollowing;
  const step = meterStep(st.burnout.score);
  const showFollow = !demo && overridden && !paused;
  return (
    <div data-testid="crew-panel">
      <p className="c-status" role="status" data-testid="crew-status">{status}</p>
      <dl className="c-stats">
        <div><dt>{CALM.crewScore}</dt><dd data-testid="crew-score">{Math.round(st.burnout.score)}</dd></div>
        <div><dt>{CALM.crewBeat}</dt><dd data-testid="crew-beat">{`${hzText(st.target.beatHz)} Hz`}</dd></div>
      </dl>
      <p className="c-muted" data-testid="crew-beat-hint">{CALM.crewBeatHint}</p>
      <ol className="c-meter" aria-label="Session load">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? 'c-seg c-on' : 'c-seg'} aria-current={i === step ? 'step' : undefined}>{s}</li>
        ))}
      </ol>
      <p className="c-next" data-testid="crew-next"><b>{`${CALM.crewNext}: `}</b>{nextLine(view, now)}</p>
      <section aria-labelledby="c-why-h" className="c-why">
        <h2 id="c-why-h" className="c-h3">{CALM.crewWhyTitle}</h2>
        <p data-testid="crew-why">{crewWhy(st)}</p>
      </section>
      <div className="c-actions c-row">
        {demo ? (
          <button type="button" className="c-btn" data-testid="crew-demo-stop" onClick={onStopDemo}>{CALM.crewDemoStop}</button>
        ) : paused ? (
          <button type="button" className="c-btn" data-testid="crew-resume" onClick={onResume}>{CALM.crewFollowAgain}</button>
        ) : (
          <button type="button" className="c-btn" data-testid="crew-not-now" onClick={onNotNow}>{CALM.crewNotNow}</button>
        )}
        {showFollow && <button type="button" className="c-btn c-link" data-testid="crew-follow" onClick={onFollow}>{CALM.crewFollowNow}</button>}
      </div>
      {showFollow && <p className="c-muted">{CALM.crewOverridden}</p>}
      <p className="c-muted" data-testid="crew-reads">{CALM.crewReads}</p>
    </div>
  );
}
