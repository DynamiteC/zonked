import { useMemo, useState } from 'react';
import { recommendTemplates } from '../../catalog';
import type { Template } from '../../catalog/types';
import { CALM, GOAL_LABEL, greeting } from './copy';
import { JOURNEYS, profileToRecommendation } from './data';
import type { Profile, ProgressMap, WeekStats } from './data';
import { Mascot } from './MascotView';
import { WeekDots } from './WeekDots';

const realNow = (): Date => new Date();

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
  readonly onPlay: (t: Template) => void;
  readonly onOpenJourney: (id: string) => void;
  readonly onGo: (view: 'journeys' | 'library') => void;
}

function dayLine(progress: ProgressMap, id: string, total: number): string {
  const done = progress[id]?.doneDays.length ?? 0;
  return done === 0 ? CALM.dayZero(total) : `Day ${Math.min(total, done + 1)} of ${total}`;
}

export function Today({ profile, week, progress, reduced, crewConnected, hasHistory = true, joinedToday = false, now = realNow, last = null, onPlay, onOpenJourney, onGo }: Props): React.JSX.Element {
  const [skip, setSkip] = useState(0);
  const recs = useMemo(() => recommendTemplates(profileToRecommendation(profile, now()), 5), [profile, now]);
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
      <section aria-labelledby="c-goal-h">
        <h2 id="c-goal-h" className="c-h3">{`Your goal: ${GOAL_LABEL[profile.goal]}`}</h2>
        <WeekDots week={week} hasHistory={hasHistory} joinedToday={joinedToday} />
      </section>
      <section aria-labelledby="c-for-h">
        <h2 id="c-for-h" className="c-h3">
          {CALM.forYou}
        </h2>
        <ul className="c-rows">
          {recs.map((r) => (
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
      <section aria-labelledby="c-jr-h">
        <h2 id="c-jr-h" className="c-h3">
          {CALM.journeysTitle}
        </h2>
        <ul className="c-rows">
          {JOURNEYS.map((j) => (
            <li key={j.id}>
              <button type="button" className="c-journey-card" onClick={() => onOpenJourney(j.id)}>
                <b>{j.title}</b>
                <small>{j.blurb}</small>
                <em>{dayLine(progress, j.id, j.days.length)}</em>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <button type="button" className="c-link-card" onClick={() => onGo('library')}>
        <b>{`Browse all sounds`}</b>
      </button>
      {crewConnected && (
        <p className="c-crew-chip" role="status">
          Crew connected: easing the sound
        </p>
      )}
    </div>
  );
}
