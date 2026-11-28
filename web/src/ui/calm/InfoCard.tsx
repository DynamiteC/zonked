import { useMemo } from 'react';
import type { Template } from '../../catalog/types';
import { CALM } from './copy';
import { profileToRecommendation, recommendForDevice } from './data';
import type { Profile, WeekStats } from './data';
import { WeekDots } from './WeekDots';

interface Props {
  readonly profile: Profile;
  readonly week: WeekStats;
  readonly joinedToday: boolean;
  readonly hasHistory: boolean;
  readonly onPlay: (t: Template) => void;
}

/** Desktop right column: today's session and the week. Hidden by css below 1180 px. */
export function InfoCard({ profile, week, joinedToday, hasHistory, onPlay }: Props): React.JSX.Element {
  const pick = useMemo(() => recommendForDevice(profileToRecommendation(profile, new Date()), profile.device, 1)[0], [profile]);
  return (
    <aside className="c-info c-card" aria-label={CALM.infoTitle}>
      <p className="c-eyebrow">{CALM.dailyEyebrow}</p>
      {pick !== undefined && (
        <>
          <b>{pick.template.name}</b>
          <span className="c-muted">{`${pick.template.recommendedMinutes} min`}</span>
          <button type="button" className="c-btn c-small" onClick={() => onPlay(pick.template)}>
            {CALM.start}
          </button>
        </>
      )}
      <WeekDots week={week} hasHistory={hasHistory} joinedToday={joinedToday} compact />
    </aside>
  );
}
