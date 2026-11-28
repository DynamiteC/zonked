import { useState } from 'react';
import type { TimerSpec, TimerState } from '../../app/timers';
import { formatClock } from '../recContext';

export interface TimersPort {
  startTimer(spec: TimerSpec): unknown;
  stopTimer(): void;
}

const clampInt = (v: number, min: number, max: number): number => (Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : min);

function Num(p: { id: string; label: string; value: number; min: number; max: number; onChange: (n: number) => void }): React.JSX.Element {
  return (
    <div className="adv-field">
      <label htmlFor={p.id}>{p.label}</label>
      <input id={p.id} data-testid={p.id} className="adv-num" type="number" inputMode="numeric" min={p.min} max={p.max} value={p.value} onChange={(e) => p.onChange(clampInt(Number(e.target.value), p.min, p.max))} />
    </div>
  );
}

/** Countdown, sleep fade and focus and break timers. */
export function TimersPanel({ timer, player }: { timer: TimerState; player: TimersPort }): React.JSX.Element {
  const [cd, setCd] = useState(30);
  const [sl, setSl] = useState(30);
  const [focus, setFocus] = useState(25);
  const [brk, setBrk] = useState(5);
  const active = timer.kind !== 'none';
  return (
    <div className="adv-panel" data-testid="adv-timers">
      <p className="adv-line" data-testid="adv-timer-status">
        {active ? `${timer.kind}${timer.phase !== undefined ? `, ${timer.phase}` : ''}: ${formatClock(timer.remainingSec)} left` : 'No timer is running.'}
      </p>
      <div className="adv-actions">
        <Num id="adv-timer-cd" label="Countdown minutes" value={cd} min={1} max={720} onChange={setCd} />
        <button type="button" className="adv-btn" data-testid="adv-timer-countdown" onClick={() => player.startTimer({ kind: 'countdown', minutes: cd })}>
          Start countdown
        </button>
      </div>
      <div className="adv-actions">
        <Num id="adv-timer-sl" label="Sleep fade minutes" value={sl} min={1} max={720} onChange={setSl} />
        <button type="button" className="adv-btn" data-testid="adv-timer-sleep" onClick={() => player.startTimer({ kind: 'sleep-fade', minutes: sl })}>
          Start sleep fade
        </button>
      </div>
      <div className="adv-actions">
        <Num id="adv-timer-focus" label="Focus minutes" value={focus} min={1} max={180} onChange={setFocus} />
        <Num id="adv-timer-break" label="Break minutes" value={brk} min={1} max={60} onChange={setBrk} />
        <button
          type="button"
          className="adv-btn"
          data-testid="adv-timer-pomodoro"
          onClick={() => player.startTimer({ kind: 'pomodoro', focusMin: focus, breakMin: brk, longBreakMin: Math.max(brk, 15), longEvery: 4 })}
        >
          Start focus and break
        </button>
      </div>
      <button type="button" className="adv-btn" data-testid="adv-timer-stop" disabled={!active} onClick={() => player.stopTimer()}>
        Stop timer
      </button>
    </div>
  );
}
