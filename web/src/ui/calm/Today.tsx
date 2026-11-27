import { Suspense, lazy, useMemo, useState } from 'react';
import { recommendTemplates } from '../../catalog';
import type { Template } from '../../catalog/types';
import { CALM, GOAL_LABEL, greeting } from './copy';
import { JOURNEYS, profileToRecommendation } from './data';
import type { Profile, ProgressMap, WeekStats } from './data';
import { WeekDots } from './WeekDots';

const CalmMascot = lazy(() => import('./mascot').then((m) => ({ default: m.CalmMascot })));

const realNow = (): Date => new Date();

interface Props {
  readonly profile: Profile;
  readonly week: WeekStats;
  readonly progress: ProgressMap;
  readonly reduced: boolean;
  readonly crewConnected: boolean;
  readonly now?: () => Date;
  readonly onPlay: (t: Template) => void;
  readonly onOpenJourney: (id: string) => void;
  readonly onGo: (view: 'journeys' | 'library') => void;
}

function dayLine(progress: ProgressMap, id: string, total: number): string {
  const done = progress[id]?.doneDays.length ?? 0;
  return done === 0 ? 'Not started' : `Day ${Math.min(total, done + 1)} of ${total}`;
}

export function Today({ profile, week, progress, reduced, crewConnected, now = realNow, onPlay, onOpenJourney, onGo }: Props): React.JSX.Element {
  const [skip, setSkip] = useState(0);
  const recs = useMemo(() => recommendTemplates(profileToRecommendation(profile, now()), 5), [profile, now]);
  const pick = recs[skip % Math.max(1, recs.length)];
  return (
    <div className="c-today">
      <div className="c-hero c-hero-sm">
        <Suspense fallback={null}>
          <CalmMascot mood="idle" size={96} reducedMotion={reduced} />
        </Suspense>
      </div>
      <h1 className="c-greet" data-testid="greeting">
        {greeting(now().getHours())}
      </h1>
      {pick !== undefined && (
        <section className="c-card c-daily" aria-labelledby="c-daily-h">
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
      <section className="c-card" aria-labelledby="c-goal-h">
        <h2 id="c-goal-h" className="c-h3">{`Your goal: ${GOAL_LABEL[profile.goal]}`}</h2>
        <WeekDots week={week} />
      </section>
      <section aria-labelledby="c-for-h">
        <h2 id="c-for-h" className="c-h3">
          {CALM.forYou}
        </h2>
        <ul className="c-hscroll">
          {recs.map((r, i) => (
            <li key={r.template.id}>
              <button type="button" className={`c-mini-card c-g${(i % 6) + 1}`} onClick={() => onPlay(r.template)}>
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
        <ul className="c-hscroll">
          {JOURNEYS.map((j, i) => (
            <li key={j.id}>
              <button type="button" className={`c-journey-card c-j${(i % 6) + 1}`} onClick={() => onOpenJourney(j.id)}>
                <b>{j.title}</b>
                <small>{j.blurb}</small>
                <em>{dayLine(progress, j.id, j.days.length)}</em>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <button type="button" className="c-card c-link-card" onClick={() => onGo('library')}>
        <b>Browse all sounds</b>
        <span className="c-muted">{CALM.libraryTitle}</span>
      </button>
      {crewConnected && (
        <p className="c-card c-crew-chip" role="status">
          Crew connected: easing the sound
        </p>
      )}
    </div>
  );
}
