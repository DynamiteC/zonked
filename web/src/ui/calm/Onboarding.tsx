import { Suspense, lazy, useState } from 'react';
import type { Template } from '../../catalog/types';
import { ChoiceGrid } from './ChoiceGrid';
import type { ChoiceOption } from './ChoiceGrid';
import { CALM, DEVICE_LABEL, GOAL_LABEL, TIME_LABEL } from './copy';
import { DEFAULT_PROFILE, DEVICES, GOALS, TIMES_OF_DAY } from './data';
import type { Device, Goal, Profile, TimeOfDay } from './data';
import { SafetyNotice } from './SafetyNotice';
import { StarterStep } from './StarterStep';

const CalmMascot = lazy(() => import('./mascot').then((m) => ({ default: m.CalmMascot })));

export type Step = 1 | 2 | 3 | 4 | 5;

interface Props {
  readonly playing: boolean;
  readonly reduced: boolean;
  readonly onAccept: () => void;
  readonly onPreview: (t: Template) => void;
  readonly onStop: () => void;
  /** Called with the answers and the chosen starter. The parent saves, plays and leaves. */
  readonly onFinish: (profile: Profile, starter: Template) => void;
  readonly initial?: Profile;
}

const opts = <T extends string>(list: readonly T[], labels: Readonly<Record<T, string>>): readonly ChoiceOption<T>[] =>
  list.map((value) => ({ value, label: labels[value] }));

const TITLES: Readonly<Record<1 | 2 | 3, string>> = { 1: CALM.goalTitle, 2: CALM.whenTitle, 3: CALM.listenTitle };

export function Onboarding({ playing, reduced, onAccept, onPreview, onStop, onFinish, initial = DEFAULT_PROFILE }: Props): React.JSX.Element {
  const [step, setStep] = useState<Step>(1);
  const [goal, setGoal] = useState<Goal>(initial.goal);
  const [when, setWhen] = useState<TimeOfDay>(initial.timeOfDay);
  const [device, setDevice] = useState<Device>(initial.device);
  const profile: Profile = { ...initial, goal, timeOfDay: when, device, createdAt: Date.now() };
  const go = (s: Step): void => setStep(s);
  const back = step > 1 ? () => go((step - 1) as Step) : null;

  return (
    <section className="c-onb" aria-label={`Step ${step} of 5`}>
      <p className="c-step">{`Step ${step} of 5`}</p>
      {step === 1 && (
        <>
          <div className="c-hero">
            <Suspense fallback={null}>
              <CalmMascot mood="happy" size={140} reducedMotion={reduced} />
            </Suspense>
          </div>
          <p className="c-promise">{CALM.promise}</p>
        </>
      )}
      {step <= 3 && (
        <>
          <h2 className="c-h1">
            {TITLES[step as 1 | 2 | 3]}
          </h2>
          {step === 1 && <ChoiceGrid legend={CALM.goalTitle} options={opts(GOALS, GOAL_LABEL)} value={goal} onChange={setGoal} />}
          {step === 2 && <ChoiceGrid legend={CALM.whenTitle} options={opts(TIMES_OF_DAY, TIME_LABEL)} value={when} onChange={setWhen} />}
          {step === 3 && (
            <>
              <ChoiceGrid legend={CALM.listenTitle} options={opts(DEVICES, DEVICE_LABEL)} value={device} onChange={setDevice} />
              <p className="c-note">{CALM.listenNote}</p>
            </>
          )}
          <div className="c-actions c-row">
            {back !== null && (
              <button type="button" className="c-btn" onClick={back}>
                {CALM.back}
              </button>
            )}
            <button type="button" className="c-btn c-primary" onClick={() => go((step + 1) as Step)}>
              {CALM.next}
            </button>
          </div>
          {step === 1 && (
            <button type="button" className="c-btn c-link" onClick={() => go(4)}>
              {CALM.skip}
            </button>
          )}
        </>
      )}
      {step === 4 && (
        <>
          <div className="c-hero">
            <Suspense fallback={null}>
              <CalmMascot mood="idle" size={120} reducedMotion={reduced} />
            </Suspense>
          </div>
          <SafetyNotice
            onAccept={() => {
              onAccept();
              go(5);
            }}
          />
          <button type="button" className="c-btn c-link" onClick={() => go(3)}>
            {CALM.back}
          </button>
        </>
      )}
      {step === 5 && (
        <>
          <StarterStep profile={profile} playing={playing} onPreview={onPreview} onStop={onStop} onStart={(t) => onFinish(profile, t)} />
          <button type="button" className="c-btn c-link" onClick={() => go(3)}>
            {CALM.back}
          </button>
        </>
      )}
    </section>
  );
}
