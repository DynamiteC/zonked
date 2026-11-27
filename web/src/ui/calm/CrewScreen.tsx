import { setCrewEnabled } from '../bridgeClient';
import { CALM } from './copy';
import type { CrewInfo } from './useCrewBridge';

const STEPS = ['Fresh', 'Warming up', CALM.crewBreak] as const;

/** Burnout score is 0 to 100. Under 40 is fresh, under 60 warming up, else time for a break. */
export function meterStep(score: number | null): 0 | 1 | 2 {
  if (score === null || !Number.isFinite(score) || score < 40) return 0;
  return score < 60 ? 1 : 2;
}

interface Props {
  readonly crew: CrewInfo;
  readonly burnout: number | null;
}

export function CrewScreen({ crew, burnout }: Props): React.JSX.Element {
  const connected = crew.enabled && crew.status === 'connected';
  const step = meterStep(burnout);
  return (
    <div>
      <h1 className="c-h1">{CALM.crewTitle}</h1>
      <p className="c-lead">{CALM.crewIntro}</p>
      <label className="c-switch">
        <input type="checkbox" role="switch" data-testid="calm-crew-toggle" checked={crew.enabled} onChange={(e) => setCrewEnabled(e.currentTarget.checked)} />
        <span className="c-track" aria-hidden="true" />
        <span>{CALM.crewSwitch}</span>
      </label>
      <p className="c-status" role="status" data-testid="crew-status">
        {connected ? CALM.crewOn : CALM.crewOff}
      </p>
      {connected ? (
        <ol className="c-meter" aria-label="Session load">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? 'c-seg c-on' : 'c-seg'} aria-current={i === step ? 'step' : undefined}>
              {s}
            </li>
          ))}
        </ol>
      ) : (
        <p className="c-note">{CALM.crewOptional}</p>
      )}
      <p className="c-muted">{CALM.crewPrivacy}</p>
    </div>
  );
}
