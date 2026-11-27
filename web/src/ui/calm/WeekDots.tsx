import { CALM } from './copy';
import { Icon } from './icons';
import type { DayState, WeekStats } from './data';

const LETTERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const WORD: Readonly<Record<DayState, string>> = { listened: 'listened', rest: 'rest day', today: 'today', upcoming: 'coming up' };

export function weekText(w: WeekStats, hasHistory = true, joinedToday = false): string {
  if (w.quietWeek && joinedToday && !hasHistory) return CALM.joinedLine;
  if (w.quietWeek) return hasHistory ? CALM.welcomeBack : CALM.firstWeek;
  return `${CALM.weekOf(w.daysListened)}. ${CALM.restCount}`;
}

interface Props {
  readonly week: WeekStats;
  readonly hasHistory?: boolean;
  /** On the day the person joined, today's dot shows filled with a welcome line. */
  readonly joinedToday?: boolean;
  readonly compact?: boolean;
}

/** Seven days, Monday first. State shows in a word for screen readers and in the dot shape. Never a chain. */
export function WeekDots({ week, hasHistory = true, joinedToday = false, compact = false }: Props): React.JSX.Element {
  const joined = joinedToday && !hasHistory && week.quietWeek;
  return (
    <div className={compact ? 'c-week c-week-compact' : 'c-week'}>
      <ul className="c-dots" aria-label="This week">
        {week.dots.map((d, i) => {
          const fill = joined && d === 'today';
          return (
            <li key={NAMES[i]} className={`c-dot c-dot-${d}${fill ? ' c-dot-joined' : ''}`} data-state={d}>
              <span className="c-mark" aria-hidden="true">
                {fill || d === 'listened' ? <Icon name="check" size={16} /> : ''}
              </span>
              <span className="c-dayname" aria-hidden="true">
                {LETTERS[i]}
              </span>
              <span className="c-sr">{`${NAMES[i]}, ${fill ? CALM.joinedToday : WORD[d]}`}</span>
            </li>
          );
        })}
      </ul>
      <p className="c-muted" data-testid={compact ? undefined : 'week-text'}>
        {weekText(week, hasHistory, joined)}
      </p>
    </div>
  );
}
