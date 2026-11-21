import { useState } from 'react';
import { MAX_REMINDER, MILESTONES } from '../../app/milestones';
import { SX } from './copy';
import type { SanctuaryData } from './useSanctuaryData';

function dateText(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function MilestonesPanel({ data }: { data: SanctuaryData }): React.JSX.Element {
  const c = SX.milestones;
  const [confirm, setConfirm] = useState(false);
  const [text, setText] = useState(data.milestones.reminder.text);
  const s = data.stats;
  const hidden = data.milestones.hidden;
  const rows: readonly [string, number][] = [
    [c.stats.sessions, s.sessions],
    [c.stats.minutes, s.totalMinutes],
    [c.stats.days, s.activeDays],
    [c.stats.streak, s.streak],
    [c.stats.longest, s.longestMinutes],
  ];
  return (
    <div className="sx-stack" data-testid="sanctuary-milestones">
      <p className="sx-muted">{c.help}</p>
      <div className="sx-row">
        <button type="button" className="btn" data-testid="sanctuary-ms-hide" aria-pressed={hidden} onClick={() => void data.setHidden(!hidden)}>
          {hidden ? c.show : c.hide}
        </button>
        {confirm ? (
          <>
            <button type="button" className="btn" data-testid="sanctuary-ms-reset-yes" onClick={() => void data.resetMilestones().then(() => setConfirm(false))}>{c.confirmReset}</button>
            <button type="button" className="btn" onClick={() => setConfirm(false)}>{SX.data.cancel}</button>
          </>
        ) : (
          <button type="button" className="btn" data-testid="sanctuary-ms-reset" onClick={() => setConfirm(true)}>{c.reset}</button>
        )}
      </div>
      {hidden ? (
        <p data-testid="sanctuary-ms-hidden">{c.hidden}</p>
      ) : (
        <>
          <dl className="sx-stats" data-testid="sanctuary-stats">
            {rows.map(([k, v]) => (
              <div key={k} className="sx-stat">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="sx-rows" data-testid="sanctuary-ms-list">
            {MILESTONES.map((m) => {
              const at = data.milestones.earned[m.id];
              const copy = c.items[m.id];
              return (
                <li key={m.id} className="sx-row" data-testid={`sanctuary-ms-${m.id}`} data-earned={at !== undefined}>
                  <span className="sx-grow">
                    <strong>{copy.name}</strong>
                    <span className="sx-muted sx-block">{copy.note}</span>
                  </span>
                  <span className={at !== undefined ? 'sx-badge sx-on' : 'sx-badge'}>{at !== undefined ? `${c.earned} ${dateText(at)}` : c.waiting}</span>
                </li>
              );
            })}
          </ul>
          <ul className="sx-list sx-muted" data-testid="sanctuary-ms-how">
            {c.how.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </>
      )}
      <form
        className="sx-card"
        onSubmit={(e) => {
          e.preventDefault();
          void data.setReminder(data.milestones.reminder.on, text);
        }}
      >
        <h4 className="sx-h4">{c.reminderHeading}</h4>
        <p className="sx-muted">{c.reminderHelp}</p>
        <label className="sx-check">
          <input type="checkbox" data-testid="sanctuary-reminder-on" checked={data.milestones.reminder.on} onChange={(e) => void data.setReminder(e.target.checked, text)} />
          {c.reminderOn}
        </label>
        <label className="sx-label" htmlFor="sx-rem-text">{c.reminderLabel}</label>
        <input id="sx-rem-text" data-testid="sanctuary-reminder-text" className="sx-input" maxLength={MAX_REMINDER} value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className="btn">{c.reminderSave}</button>
      </form>
    </div>
  );
}
