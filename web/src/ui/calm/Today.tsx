import { useMemo, useState } from 'react';
import { recommendTemplates } from '../../catalog';
import type { Template } from '../../catalog/types';
import { CALM, GOAL_LABEL, greeting } from './copy';
import { nudgeRecs, profileToRecommendation } from './data';
import type { FeelEntry, Profile, ProgressMap, WeekStats } from './data';
import { Mascot } from './MascotView';
import { WeekDots } from './WeekDots';

const realNow = (): Date => new Date();
const NO_FEEL: readonly FeelEntry[] = [];

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
  readonly now?: () => Date;
  /** Last session played on this device, if any. */
  readonly last?: Template | null;
  /** Saved "How was that?" answers. They nudge the order of For you and the daily pick. */
  readonly feel?: readonly FeelEntry[];
  readonly onPlay: (t: Template) => void;
  readonly onOpenJourney: (id: string) => void;
  readonly onGo: (view: 'journeys' | 'library') => void;
  readonly onReset: () => void;
}

export function Today({ profile, week, reduced, crewConnected, hasHistory = true, joinedToday = false, now = realNow, last = null, feel = NO_FEEL, onPlay, onGo, onReset }: Props): React.JSX.Element {
  const [skip, setSkip] = useState(0);
  const recs = useMemo(() => {
    const ctx = profileToRecommendation(profile, now());
    return nudgeRecs(recommendTemplates(ctx, 5), feel.length === 0 ? [] : recommendTemplates(ctx, 12), feel);
  }, [profile, now, feel]);
  const pick = recs[skip % Math.max(1, recs.length)];
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
      {pick !== undefined && (
        <section className="c-daily" aria-labelledby="c-daily-h">
          <p className="c-eyebrow">{CALM.dailyEyebrow}</p>
          <h2 id="c-daily-h">{pick.template.name}</h2>
          <p className="c-muted">{`${pick.template.recommendedMinutes} min. ${pick.reasons[0] ?? CALM.suggested}`}</p>
          <div className="c-actions">
            <button type="button" className="c-btn c-primary" data-testid="today-play" onClick={() => onPlay(pick.template)}>
              {CALM.start}
            </button>
            <button type="button" className="c-btn c-link" onClick={() => setSkip((s) => s + 1)}>
              {CALM.notThisOne}
            </button>
          </div>
        </section>
      )}
      <button type="button" className="c-link-card c-reset-entry" data-testid="today-reset" onClick={onReset}>
        <b>{CALM.resetEntry}</b>
        <small>{CALM.resetEntryHint}</small>
      </button>
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
                <small>{r.reasons[0] ?? CALM.suggested}</small>
                <em>{`${r.template.recommendedMinutes} min`}</em>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <button type="button" className="c-link-card" onClick={() => onGo('library')}>
        <b>{`Browse all sounds`}</b>
      </button>
      <button type="button" className="c-link-card" onClick={() => onGo('journeys')}>
        <b>{CALM.journeysTitle}</b>
      </button>
      {crewConnected && (
        <p className="c-crew-chip" role="status">
          Crew connected: easing the sound
        </p>
      )}
    </div>
  );
}
