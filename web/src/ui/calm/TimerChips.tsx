import type { Player } from '../../app/player';
import type { TimerState } from '../../app/timers';
import { formatClock } from '../recContext';
import { CALM } from './copy';

export const SLEEP_FADE_MIN = 20;

/** Which chip matches the running timer. Index into CALM.timerChips. */
export function chipIndex(t: TimerState): number {
  if (t.kind === 'sleep-fade') return 4;
  if (t.kind === 'pomodoro') return 5;
  if (t.kind !== 'countdown') return 3;
  const min = Math.round(t.totalSec / 60);
  return min === 15 ? 0 : min === 30 ? 1 : min === 60 ? 2 : -1;
}

interface Props {
  readonly timer: TimerState;
  readonly player: Player;
  /** Starts a focus sprint on the sound that plays now. Leave out to hide the chip. */
  readonly onSprint?: () => void;
  /** Ends a running sprint without stopping the sound. */
  readonly onSprintEnd?: () => void;
}

export function TimerChips({ timer, player, onSprint, onSprintEnd }: Props): React.JSX.Element {
  const pick = (i: number): void => {
    if (i === 5) return timer.kind === 'pomodoro' ? onSprintEnd?.() : onSprint?.();
    onSprintEnd?.();
    if (i <= 2) player.startTimer({ kind: 'countdown', minutes: [15, 30, 60][i] ?? 15 });
    else if (i === 3) player.stopTimer();
    else player.startTimer({ kind: 'sleep-fade', minutes: SLEEP_FADE_MIN });
  };
  const on = chipIndex(timer);
  return (
    <div>
      <div className="c-chips" role="group" aria-label="Timer">
        {CALM.timerChips.map((name, i) => (i === 5 && onSprint === undefined ? null : (
          <button key={name} type="button" aria-pressed={on === i} className="c-tchip" onClick={() => pick(i)}>
            {name}
          </button>
        )))}
      </div>
      {timer.kind !== 'none' && timer.running && (
        <p className="c-time" data-testid="time-left">
          {timer.kind === 'pomodoro' ? `${timer.phase === 'break' ? CALM.sprintBreakLeft : CALM.sprintFocusLeft} ` : ''}
          {formatClock(timer.remainingSec)}
        </p>
      )}
    </div>
  );
}
