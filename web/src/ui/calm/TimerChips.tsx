import type { Player } from '../../app/player';
import type { TimerState } from '../../app/timers';
import { formatClock } from '../recContext';
import { CALM } from './copy';

export const SLEEP_FADE_MIN = 20;

/** Which chip matches the running timer. Index into CALM.timerChips. */
export function chipIndex(t: TimerState): number {
  if (t.kind === 'sleep-fade') return 4;
  if (t.kind !== 'countdown') return 3;
  const min = Math.round(t.totalSec / 60);
  return min === 15 ? 0 : min === 30 ? 1 : min === 60 ? 2 : -1;
}

interface Props {
  readonly timer: TimerState;
  readonly player: Player;
}

export function TimerChips({ timer, player }: Props): React.JSX.Element {
  const pick = (i: number): void => {
    if (i <= 2) player.startTimer({ kind: 'countdown', minutes: [15, 30, 60][i] ?? 15 });
    else if (i === 3) player.stopTimer();
    else player.startTimer({ kind: 'sleep-fade', minutes: SLEEP_FADE_MIN });
  };
  const on = chipIndex(timer);
  return (
    <div>
      <div className="c-chips" role="radiogroup" aria-label="Timer">
        {CALM.timerChips.map((name, i) => (
          <button key={name} type="button" role="radio" aria-checked={on === i} className="c-tchip" onClick={() => pick(i)}>
            {name}
          </button>
        ))}
      </div>
      {timer.kind !== 'none' && timer.running && (
        <p className="c-time" data-testid="time-left">
          {formatClock(timer.remainingSec)}
        </p>
      )}
    </div>
  );
}
