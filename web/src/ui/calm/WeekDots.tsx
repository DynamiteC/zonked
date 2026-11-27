import { CALM } from './copy';
import type { DayState, WeekStats } from './data';

const LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const WORD: Readonly<Record<DayState, string>> = { listened: 'listened', rest: 'rest day', today: 'today', upcoming: 'coming up' };

export function weekText(w: WeekStats): string {
  if (w.quietWeek) return CALM.streakReturn;
  const n = w.daysListened;
  return `${n} ${n === 1 ? 'day' : 'days'} this week. ${CALM.restCount}`;
}

/** Seven days, Monday first. State shows in a word for screen readers and in the dot shape. Never a chain. */
export function WeekDots({ week }: { readonly week: WeekStats }): React.JSX.Element {
  return (
    <div className="c-week">
      <ul className="c-dots" aria-label="This week">
        {week.dots.map((d, i) => (
          <li key={NAMES[i]} className={`c-dot c-dot-${d}`} data-state={d}>
            <span className="c-mark" aria-hidden="true">
              {LETTERS[i]}
            </span>
            <span className="c-sr">{`${NAMES[i]}, ${WORD[d]}`}</span>
          </li>
        ))}
      </ul>
      <p className="c-muted" data-testid="week-text">
        {weekText(week)}
      </p>
    </div>
  );
}
