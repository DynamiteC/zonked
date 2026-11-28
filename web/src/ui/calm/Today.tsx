import { useMemo, useState } from 'react';
import type { Template } from '../../catalog/types';
import { getTemplates } from '../../catalog';
import { CALM, GOAL_LABEL, greeting } from './copy';
import { UX } from './copy-ux';
import { USE_CASES, echoLine, feelEcho, nudgeRecs, plainLine, recommendForDevice, toDayNumber, todayPlan, useCasePlan } from './data';
import type { FeelEntry, Goal, Profile, ProgressMap, WeekStats } from './data';
import { FormFoot } from './FormFrame';
import { Mascot } from './MascotView';
import { WeekDots } from './WeekDots';

const realNow = (): Date => new Date();
const NO_FEEL: readonly FeelEntry[] = [];
const SPRINT_GOALS: readonly Goal[] = ['focus', 'study'];
const REST_NOTE_MIN = 120;
const NO_RECS: readonly never[] = [];

interface Props {
  readonly profile: Profile;
  readonly week: WeekStats;
  readonly progress: ProgressMap;
  readonly reduced: boolean;
  readonly crewConnected: boolean;
  /** True once at least one session is logged; gates the welcome-back line. */
  readonly hasHistory?: boolean;
  /** True on the day the person joined: the first dot is filled and a short note names Studio. */
  readonly joinedToday?: boolean;
  /** Minutes of sound heard today on this device. A quiet rest note shows only after 2 hours. */
  readonly todayMinutes?: number;
  readonly now?: () => Date;
  /** Last session played on this device, if any. */
  readonly last?: Template | null;
  /** Saved "How was that?" answers. They nudge the order of For you and the daily pick. */
  readonly feel?: readonly FeelEntry[];
  /** Starts a focus sprint on a sound. Shown for Focus and Study goals. */
  readonly onSprint?: (t: Template) => void;
  /** Plays a sound. `minutes` and `goal` set the session length and whether the Sleep fade runs. */
  readonly onPlay: (t: Template, minutes?: number, goal?: Goal) => void;
  readonly onOpenJourney: (id: string) => void;
  readonly onGo: (view: 'journeys' | 'library') => void;
  readonly onReset: () => void;
  /** Opens the 5 minute breathing session. Shown for the Calm goal. */
  readonly onBreathe?: () => void;
  readonly onGuide?: () => void;
}

export function Today({ profile, week, reduced, crewConnected, hasHistory = true, joinedToday = false, todayMinutes = 0, now = realNow, last = null, feel = NO_FEEL, onSprint, onPlay, onGo, onReset, onBreathe, onGuide }: Props): React.JSX.Element {
  const [skip, setSkip] = useState(0);
  const plan = useMemo(() => todayPlan(profile, now()), [profile, now]);
  const recs = useMemo(() => {
    const top = recommendForDevice(plan.ctx, profile.device, 5);
    return nudgeRecs(top, feel.length === 0 ? NO_RECS : recommendForDevice(plan.ctx, profile.device, 12), feel);
  }, [plan, profile.device, feel]);
  const pick = recs[skip % Math.max(1, recs.length)];
  const echo = useMemo(() => feelEcho(feel, toDayNumber(now().getTime())), [feel, now]);
  const echoSound = echo === null ? undefined : getTemplates().find((t) => t.id === echo.id);
  const playPlan = (t: Template): void => (plan.kind === 'sprint' && onSprint !== undefined ? onSprint(t) : onPlay(t, plan.minutes, plan.fade ? 'sleep' : profile.goal));
  const useCase = (u: (typeof USE_CASES)[number]): void => {
    const p = useCasePlan(profile, now(), u);
    const r = recommendForDevice(p.ctx, profile.device, 1)[0];
    if (r !== undefined) onPlay(r.template, p.minutes, p.fade ? 'sleep' : profile.goal);
  };
  return (
    <div className="c-today">
      <header className="c-pagehead">
        <Mascot size={72} reduced={reduced} />
        <h1 className="c-greet" data-testid="greeting">
          {greeting(now().getHours())}
        </h1>
      </header>
      {last !== null && last.id !== pick?.template.id && (
        <button type="button" className="c-btn c-wide c-again" data-testid="play-again" onClick={() => onPlay(last)}>
          {`${CALM.playAgain}: ${last.name}`}
        </button>
      )}
      {echo !== null && echoSound !== undefined && (
        <p className="c-echo" data-testid="feel-echo">
          {echoLine(echoSound.name, echo)}{' '}
          <button type="button" className="c-btn c-link" data-testid="feel-echo-play" onClick={() => onPlay(echoSound)}>
            {UX.echo.play}
          </button>
        </p>
      )}
      {pick !== undefined && (
        <section className="c-daily" aria-labelledby="c-daily-h" data-plan={plan.kind}>
          <p className="c-eyebrow" data-testid="plan-eyebrow">{UX.planEyebrow[plan.kind]}</p>
          <h2 id="c-daily-h">{`${UX.planTitle[plan.kind]}: ${pick.template.name}`}</h2>
          <p className="c-muted">{`${UX.minutes(plan.minutes)}. ${plainLine(pick.template)}`}</p>
          {plan.kind === 'winddown' && <p className="c-muted" data-testid="sleep-note">{CALM.sleepNote}</p>}
          <FormFoot left={{ label: CALM.notThisOne, onClick: () => setSkip((n) => n + 1) }} next={{ label: UX.planStart[plan.kind], onClick: () => playPlan(pick.template), testid: 'today-play' }} />
        </section>
      )}
      <section aria-labelledby="c-uses-h">
        <h2 id="c-uses-h" className="c-h3">{UX.useCasesTitle}</h2>
        <div className="c-chips">
          {USE_CASES.map((u) => (
            <button key={u} type="button" className="c-tchip" data-testid={`use-${u}`} onClick={() => useCase(u)}>
              {UX.useCases[u]}
            </button>
          ))}
        </div>
      </section>
      {onSprint !== undefined && pick !== undefined && plan.kind !== 'sprint' && SPRINT_GOALS.includes(profile.goal) && (
        <button type="button" className="c-link-card c-sprint-entry" data-testid="today-sprint" onClick={() => onSprint(pick.template)}>
          <b>{CALM.sprintTitle}</b>
          <small>{CALM.sprintLine}</small>
        </button>
      )}
      <button type="button" className="c-link-card c-reset-entry" data-testid="today-reset" onClick={onReset}>
        <b>{CALM.resetEntry}</b>
        <small>{CALM.resetEntryHint}</small>
      </button>
      {onBreathe !== undefined && profile.goal === 'calm' && (
        <button type="button" className="c-link-card c-breathe-entry" data-testid="today-breathe" onClick={onBreathe}>
          <b>{CALM.breatheEntry}</b>
          <small>{CALM.breatheEntryHint}</small>
        </button>
      )}
      <section aria-labelledby="c-goal-h">
        <h2 id="c-goal-h" className="c-h3">{`Your goal: ${GOAL_LABEL[profile.goal]}`}</h2>
        <WeekDots week={week} hasHistory={hasHistory} joinedToday={joinedToday} />
      </section>
      <section aria-labelledby="c-for-h">
        <h2 id="c-for-h" className="c-h3">
          {CALM.forYou}
        </h2>
        <ul className="c-rows">
          {recs.slice(0, 3).map((r) => (
            <li key={r.template.id}>
              <button type="button" className="c-mini-card" onClick={() => onPlay(r.template)}>
                <b>{r.template.name}</b>
                <small>{plainLine(r.template)}</small>
                <em>{`${r.template.recommendedMinutes} min`}</em>
              </button>
            </li>
          ))}
        </ul>
      </section>
      {todayMinutes >= REST_NOTE_MIN && (
        <p className="c-muted" data-testid="rest-note">{`${UX.listened.today(Math.round(todayMinutes))} ${UX.listened.rest}`}</p>
      )}
      <button type="button" className="c-link-card" onClick={() => onGo('library')}>
        <b>{`Browse all sounds`}</b>
      </button>
      <button type="button" className="c-link-card" onClick={() => onGo('journeys')}>
        <b>{CALM.journeysTitle}</b>
      </button>
      {onGuide !== undefined && (
        <button type="button" className="c-btn c-ghost c-guide-link" data-testid="today-guide" onClick={onGuide}>
          {CALM.guideLink}
        </button>
      )}
      {crewConnected && (
        <p className="c-crew-chip" role="status">
          Crew connected: easing the sound
        </p>
      )}
    </div>
  );
}
