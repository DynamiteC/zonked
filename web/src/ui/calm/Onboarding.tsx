import { Suspense, lazy, useState } from 'react';
import type { Template } from '../../catalog/types';
import { ChoiceGrid } from './ChoiceGrid';
import type { ChoiceOption } from './ChoiceGrid';
import { CALM, DEVICE_LABEL, GOAL_LABEL, TIME_LABEL } from './copy';
import { DEFAULT_PROFILE, DEVICES, GOALS, TIMES_OF_DAY } from './data';
import type { Device, Goal, Profile, TimeOfDay } from './data';
import { SafetyNotice } from './SafetyNotice';
import { StarterStep, pickStarters } from './StarterStep';

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

function Mascot({ mood, size, reduced }: { readonly mood: 'happy' | 'idle'; readonly size: number; readonly reduced: boolean }): React.JSX.Element {
  return (
    <div className="c-hero">
      <Suspense fallback={null}>
        <CalmMascot mood={mood} size={size} reducedMotion={reduced} />
      </Suspense>
    </div>
  );
}

interface QuestionProps {
  readonly step: 1 | 2 | 3;
  readonly answers: { readonly goal: Goal; readonly when: TimeOfDay; readonly device: Device };
  readonly set: { readonly goal: (v: Goal) => void; readonly when: (v: TimeOfDay) => void; readonly device: (v: Device) => void };
  readonly onBack: (() => void) | null;
  readonly onNext: () => void;
  readonly onSkip: () => void;
}

/** One of the three numbered questions. Skip is a full button on the first one. */
function Question({ step, answers: a, set, onBack, onNext, onSkip }: QuestionProps): React.JSX.Element {
  return (
    <>
      <h1 className="c-h1">{TITLES[step]}</h1>
      {step === 1 && <ChoiceGrid legend={CALM.goalTitle} options={opts(GOALS, GOAL_LABEL)} value={a.goal} onChange={set.goal} />}
      {step === 2 && <ChoiceGrid legend={CALM.whenTitle} options={opts(TIMES_OF_DAY, TIME_LABEL)} value={a.when} onChange={set.when} />}
      {step === 3 && <ChoiceGrid legend={CALM.listenTitle} options={opts(DEVICES, DEVICE_LABEL)} value={a.device} onChange={set.device} />}
      {step === 3 && <p className="c-note">{CALM.listenNote}</p>}
      <div className="c-actions c-row">
        {onBack !== null && (
          <button type="button" className="c-btn" onClick={onBack}>
            {CALM.back}
          </button>
        )}
        <button type="button" className="c-btn c-primary" onClick={onNext}>
          {CALM.next}
        </button>
      </div>
      {step === 1 && (
        <button type="button" className="c-btn c-wide" onClick={onSkip}>
          {CALM.skip}
        </button>
      )}
    </>
  );
}

const BackLink = ({ onClick }: { readonly onClick: () => void }): React.JSX.Element => (
  <button type="button" className="c-btn c-link" onClick={onClick}>
    {CALM.back}
  </button>
);

export function Onboarding({ playing, reduced, onAccept, onPreview, onStop, onFinish, initial = DEFAULT_PROFILE }: Props): React.JSX.Element {
  const [step, setStep] = useState<Step>(1);
  const [skipped, setSkipped] = useState(false);
  const [goal, setGoal] = useState<Goal>(initial.goal);
  const [when, setWhen] = useState<TimeOfDay>(initial.timeOfDay);
  const [device, setDevice] = useState<Device>(initial.device);
  const profile: Profile = { ...initial, goal, timeOfDay: when, device, createdAt: Date.now() };
  // Skip path: the notice is still required, then the first safe starter plays with no starter screen.
  const accept = (): void => {
    onAccept();
    const first = skipped ? pickStarters(profile)[0] : undefined;
    if (first !== undefined) onFinish(profile, first.template);
    else setStep(5);
  };
  const leaveNotice = (): void => {
    setStep(skipped ? 1 : 3);
    setSkipped(false);
  };
  const q = step <= 3 ? (step as 1 | 2 | 3) : null;

  return (
    <section className="c-onb" aria-label={q !== null ? CALM.stepOf(q) : CALM.safetyTitle}>
      {q !== null && <p className="c-step">{CALM.stepOf(q)}</p>}
      {q === 1 && <Mascot mood="happy" size={120} reduced={reduced} />}
      {q === 1 && <p className="c-promise">{CALM.promise}</p>}
      {q !== null && (
        <Question
          step={q}
          answers={{ goal, when, device }}
          set={{ goal: setGoal, when: setWhen, device: setDevice }}
          onBack={q > 1 ? () => setStep((q - 1) as Step) : null}
          onNext={() => setStep((q + 1) as Step)}
          onSkip={() => {
            setSkipped(true);
            setStep(4);
          }}
        />
      )}
      {step === 4 && <Mascot mood="idle" size={120} reduced={reduced} />}
      {step === 4 && <SafetyNotice onAccept={accept} />}
      {step === 4 && <BackLink onClick={leaveNotice} />}
      {step === 5 && <StarterStep profile={profile} playing={playing} onPreview={onPreview} onStop={onStop} onStart={(t) => onFinish(profile, t)} />}
      {step === 5 && <BackLink onClick={() => setStep(3)} />}
    </section>
  );
}
