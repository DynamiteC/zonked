import { useEffect, useRef, useState } from 'react';
import { setCrewEnabled } from '../bridgeClient';
import { CALM } from './copy';
import { FormFoot } from './FormFrame';
import { CrewPanel } from './CrewPanel';
import type { CrewInfo } from './useCrewBridge';

export { meterStep } from './CrewPanel';

interface Props {
  readonly crew: CrewInfo;
  /** True when the person picked a sound themselves, so the Crew does not steer it. */
  readonly overridden: boolean;
  readonly onDemo: () => void;
  readonly onStopDemo: () => void;
  readonly onNotNow: () => void;
  readonly onResume: () => void;
  readonly onFollow: () => void;
}

export function CrewScreen({ crew, overridden, onDemo, onStopDemo, onNotNow, onResume, onFollow }: Props): React.JSX.Element {
  const live = crew.view.state !== null;
  const demo = crew.view.source === 'demo';
  const [ended, setEnded] = useState(false);
  const was = useRef(false);
  useEffect(() => {
    if (was.current && !demo) setEnded(true);
    if (demo) setEnded(false);
    was.current = demo;
  }, [demo]);
  return (
    <div>
      <h1 className="c-h1">{CALM.crewTitle}</h1>
      <p className="c-lead">{CALM.crewIntro}</p>
      <label className="c-switch">
        <input type="checkbox" role="switch" data-testid="calm-crew-toggle" checked={crew.enabled || demo} disabled={demo} aria-describedby={demo ? 'c-crew-demo-note' : undefined} onChange={(e) => setCrewEnabled(e.currentTarget.checked)} />
        <span className="c-track" aria-hidden="true" />
        <span>{demo ? CALM.demoSteering : CALM.crewSwitch}</span>
      </label>
      {demo && <p id="c-crew-demo-note" className="c-muted" data-testid="crew-demo-note">{CALM.demoSteeringHint}</p>}
      {live ? (
        <CrewPanel view={crew.view} overridden={overridden} onNotNow={onNotNow} onResume={onResume} onFollow={onFollow} onStopDemo={onStopDemo} />
      ) : (
        <div data-testid="crew-why-off">
          <p className="c-status" role="status" data-testid="crew-status">{ended ? CALM.crewDemoEnd : CALM.crewOff}</p>
          <p className="c-why-off">{crew.enabled ? CALM.crewDisabled : CALM.crewWhyOff}</p>
          <ol className="c-steps">
            <li>{CALM.crewStep1}</li>
            <li>{CALM.crewStep2}</li>
          </ol>
          <p className="c-note">{CALM.crewOptional}</p>
        </div>
      )}
      {!demo && (
        <div className="c-demo">
          <p className="c-muted">{CALM.crewDemoHint}</p>
          <FormFoot left={null} next={{ label: CALM.crewDemo, onClick: onDemo, testid: 'crew-demo' }} />
        </div>
      )}
      <p className="c-muted">{CALM.crewPrivacy}</p>
    </div>
  );
}
