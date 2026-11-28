import { useState } from 'react';
import type { TimerSpec, TimerState } from '../app/timers';
import { COPY } from './copy';
import { Drawer } from './Drawer';
import { Tip } from './Tip';
import { formatClock } from './recContext';

export interface TimerPort {
  startTimer(spec: TimerSpec): unknown;
  stopTimer(): void;
  cycleTimer(): unknown;
}

interface Props {
  timer: TimerState;
  player: TimerPort;
  onClose: () => void;
}

const COUNTDOWN = [5, 15, 30, 60] as const;
const SLEEP = [15, 30, 45, 60, 90] as const;

function MinuteChips({ name, values, value, onPick }: { name: string; values: readonly number[]; value: number; onPick: (n: number) => void }): React.JSX.Element {
  return (
    <div className="chips" role="group" aria-label={`${name} minutes`}>
      {values.map((m) => (
        <button
          key={m}
          type="button"
          className="chip"
          aria-pressed={value === m}
          data-testid={`${name}-${m}`}
          onClick={() => onPick(m)}
        >
          {m} min
        </button>
      ))}
    </div>
  );
}

function NumField({ id, label, value, min, max, onChange }: { id: string; label: string; value: number; min: number; max: number; onChange: (n: number) => void }): React.JSX.Element {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        data-testid={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Math.round(Number(e.target.value));
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
      />
    </>
  );
}

export function TimerPanel({ timer, player, onClose }: Props): React.JSX.Element {
  const [cd, setCd] = useState(30);
  const [sl, setSl] = useState(30);
  const [focus, setFocus] = useState(25);
  const [brk, setBrk] = useState(5);
  const [cycles, setCycles] = useState(4);
  const active = timer.kind !== 'none';
  return (
    <Drawer id="timer-panel" title="Timer" help={COPY.tips.timer} testId="timer-panel" onClose={onClose}>
      <p className="meta" data-testid="timer-summary">
        {active ? `${timer.kind}${timer.phase !== undefined ? `, ${timer.phase}` : ''}: ${formatClock(timer.remainingSec)} left` : COPY.empty.timer}
      </p>
      <section aria-labelledby="t-cd">
        <h3 id="t-cd"><Tip text={COPY.tips.countdown}>Countdown</Tip></h3>
        <MinuteChips name="timer-cd" values={COUNTDOWN} value={cd} onPick={setCd} />
        <NumField id="timer-cd-custom" label="Custom minutes" value={cd} min={1} max={720} onChange={setCd} />
        <button type="button" className="btn btn-primary" data-testid="timer-countdown" onClick={() => player.startTimer({ kind: 'countdown', minutes: cd })}>
          Start countdown {cd} min
        </button>
      </section>
      <section aria-labelledby="t-sl">
        <h3 id="t-sl"><Tip text={COPY.tips.sleepFade}>Sleep fade-out</Tip></h3>
        <MinuteChips name="timer-sl" values={SLEEP} value={sl} onPick={setSl} />
        <button type="button" className="btn btn-primary" data-testid="timer-sleep" onClick={() => player.startTimer({ kind: 'sleep-fade', minutes: sl })}>
          Start sleep fade {sl} min
        </button>
      </section>
      <section aria-labelledby="t-pm">
        <h3 id="t-pm"><Tip text={COPY.tips.pomodoro}>Focus and break (Pomodoro)</Tip></h3>
        <div className="form-grid">
          <NumField id="timer-focus-min" label="Focus minutes" value={focus} min={1} max={180} onChange={setFocus} />
          <NumField id="timer-break-min" label="Break minutes" value={brk} min={1} max={60} onChange={setBrk} />
          <NumField id="timer-cycles" label="Long break every (cycles)" value={cycles} min={2} max={12} onChange={setCycles} />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          data-testid="timer-pomodoro"
          onClick={() => player.startTimer({ kind: 'pomodoro', focusMin: focus, breakMin: brk, longBreakMin: Math.max(brk, 15), longEvery: cycles })}
        >
          Start Pomodoro {focus}/{brk}
        </button>
      </section>
      <div className="drawer-actions">
        <button type="button" className="btn" data-testid="timer-cycle" onClick={() => player.cycleTimer()}>
          Next timer type (T)
        </button>
        <button type="button" className="btn" data-testid="timer-stop" disabled={!active} onClick={() => player.stopTimer()}>
          Stop timer
        </button>
      </div>
    </Drawer>
  );
}
