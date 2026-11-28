import { useState } from 'react';
import type { Template } from '../../catalog/types';
import { ChoiceGrid } from './ChoiceGrid';
import type { ChoiceOption } from './ChoiceGrid';
import { CALM, DEVICE_LABEL, GOAL_LABEL, TIME_LABEL } from './copy';
import { DEFAULT_PROFILE, DEVICES, GOALS, TIMES_OF_DAY } from './data';
import type { Device, Goal, Profile, TimeOfDay } from './data';
import { FormBody, FormFoot, FormHead } from './FormFrame';
import { SafetyNotice } from './SafetyNotice';
import { StarterStep, clearPick, pickStarters } from './StarterStep';

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
const HELPERS: Readonly<Record<1 | 2 | 3, string>> = { 1: CALM.promise, 2: CALM.whenHelper, 3: CALM.listenNote };

interface QuestionProps {
  readonly step: 1 | 2 | 3;
  readonly answers: { readonly goal: Goal; readonly when: TimeOfDay; readonly device: Device };
  readonly set: { readonly goal: (v: Goal) => void; readonly when: (v: TimeOfDay) => void; readonly device: (v: Device) => void };
  readonly onBack: (() => void) | null;
  readonly onNext: () => void;
  readonly onSkip: () => void;
  readonly reduced: boolean;
}

/** One of the three numbered questions. Same header, title, helper, rows and footer on each. Step 1 puts Skip where Back sits. */
function Question({ step, answers: a, set, onBack, onNext, onSkip, reduced }: QuestionProps): React.JSX.Element {
  return (
    <>
      <FormHead step={step} text={CALM.stepOf(step)} mood={step === 1 ? 'happy' : 'idle'} reduced={reduced} />
      <FormBody title={TITLES[step]} helper={HELPERS[step]}>
        {step === 1 && <ChoiceGrid legend={CALM.goalTitle} options={opts(GOALS, GOAL_LABEL)} value={a.goal} onChange={set.goal} />}
        {step === 2 && <ChoiceGrid legend={CALM.whenTitle} options={opts(TIMES_OF_DAY, TIME_LABEL)} value={a.when} onChange={set.when} />}
        {step === 3 && <ChoiceGrid legend={CALM.listenTitle} options={opts(DEVICES, DEVICE_LABEL)} value={a.device} onChange={set.device} />}
      </FormBody>
      <FormFoot
        left={onBack !== null ? { label: CALM.back, onClick: onBack } : { label: CALM.skip, onClick: onSkip, testid: 'onb-skip' }}
        next={{ label: CALM.next, onClick: onNext }}
      />
    </>
  );
}

export function Onboarding({ playing, reduced, onAccept, onPreview, onStop, onFinish, initial = DEFAULT_PROFILE }: Props): React.JSX.Element {
  const [step, setStep] = useState<Step>(1);
  const [skipped, setSkipped] = useState(false);
  const [goal, setGoal] = useState<Goal>(initial.goal);
  const [when, setWhen] = useState<TimeOfDay>(initial.timeOfDay);
  const [device, setDevice] = useState<Device>(initial.device);
  const profile: Profile = { ...initial, goal, timeOfDay: when, device, createdAt: Date.now() };
  // The notice is always required first. Skip, or answers that give one clear pick, then play with no starter screen.
  const accept = (): void => {
    onAccept();
    const first = skipped ? pickStarters(profile)[0] : clearPick(profile);
    if (first !== undefined && first !== null) onFinish(profile, first.template);
    else setStep(5);
  };
  const leaveNotice = (): void => {
    setStep(skipped ? 1 : 3);
    setSkipped(false);
  };
  const q = step <= 3 ? (step as 1 | 2 | 3) : null;

  return (
    <section className="c-onb" aria-label={q !== null ? CALM.stepOf(q) : CALM.safetyTitle}>
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
          reduced={reduced}
        />
      )}
      {step === 4 && <FormHead step={3} text={CALM.lastStep} mood="idle" reduced={reduced} />}
      {step === 4 && <SafetyNotice onAccept={accept} onBack={leaveNotice} />}
      {step === 5 && <FormHead step={3} text={CALM.lastStep} mood="happy" reduced={reduced} />}
      {step === 5 && <StarterStep profile={profile} playing={playing} onPreview={onPreview} onStop={onStop} onStart={(t) => onFinish(profile, t)} onBack={() => setStep(3)} />}
    </section>
  );
}
