import { getTemplates } from '../../catalog';
import type { Template } from '../../catalog/types';
import { CALM } from './copy';
import { PageHead } from './MascotView';
import { JOURNEYS, getJourney, resolveJourney } from './data';
import type { Journey, JourneyProgress, Profile, ProgressMap } from './data';

interface ListProps {
  readonly progress: ProgressMap;
  readonly onOpen: (id: string) => void;
  readonly reduced?: boolean;
}

const dayCount = (j: Journey): number => j.days.length;

export function JourneyList({ progress, onOpen, reduced = false }: ListProps): React.JSX.Element {
  return (
    <div>
      <PageHead title={CALM.journeysTitle} reduced={reduced} />
      <p className="c-lead">{CALM.journeysEmpty}</p>
      <ul className="c-list">
        {JOURNEYS.map((j, i) => {
          const done = progress[j.id]?.doneDays.length ?? 0;
          return (
            <li key={j.id}>
              <button type="button" className={`c-journey-card c-wide c-j${(i % 6) + 1}`} onClick={() => onOpen(j.id)}>
                <b>{j.title}</b>
                <small>{j.blurb}</small>
                <em>{done === 0 ? CALM.dayZero(dayCount(j)) : `${done} of ${dayCount(j)} done`}</em>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface DetailProps {
  readonly id: string;
  readonly profile: Profile;
  readonly progress: ProgressMap;
  readonly todayDay: number;
  readonly onBack: () => void;
  readonly onStartJourney: (id: string, p: JourneyProgress) => void;
  readonly onRestart: (id: string) => void;
  readonly onPlayDay: (id: string, dayNo: number, t: Template) => void;
}

interface DayRow {
  readonly no: number;
  readonly rest: boolean;
  readonly templateId: string | undefined;
}

/** Maps day numbers (1-based) to frozen picks. Rest days carry no template. */
function dayRows(j: Journey, picked: readonly string[]): readonly DayRow[] {
  let k = 0;
  return j.days.map((d, i) => {
    if (d.kind === 'rest') return { no: i + 1, rest: true, templateId: undefined };
    const templateId = picked[k];
    k += 1;
    return { no: i + 1, rest: false, templateId };
  });
}

export function JourneyDetail(p: DetailProps): React.JSX.Element {
  const j = getJourney(p.id);
  if (j === undefined) return <p className="c-empty">{CALM.journeysEmpty}</p>;
  const prog = p.progress[p.id];
  const pool = getTemplates();
  const rows = dayRows(j, prog?.pickedIds ?? []);
  const nextNo = rows.find((r) => !r.rest && !(prog?.doneDays.includes(r.no) ?? false))?.no;
  const start = (): void =>
    p.onStartJourney(p.id, { startedAt: p.todayDay, doneDays: [], pickedIds: resolveJourney(p.profile, p.id, p.todayDay) });
  return (
    <div>
      <button type="button" className="c-btn c-link c-back" onClick={p.onBack}>
        {CALM.back}
      </button>
      <h1 className="c-h1">{j.title}</h1>
      <p className="c-lead">{j.blurb}</p>
      {prog === undefined ? (
        <button type="button" className="c-btn c-primary" data-testid="journey-start" onClick={start}>
          {CALM.startJourney}
        </button>
      ) : (
        <ol className="c-days">
          {rows.map((r) => {
            const done = prog.doneDays.includes(r.no);
            const t = r.templateId === undefined ? undefined : pool.find((x) => x.id === r.templateId);
            const label = r.rest ? CALM.restDay : (t?.name ?? 'Session');
            const sub = r.rest ? '' : `${t?.recommendedMinutes ?? 0} min`;
            return (
              <li key={r.no} className={`c-day${r.rest ? ' c-rest' : ''}${done ? ' c-done' : ''}${r.no === nextNo ? ' c-now' : ''}`}>
                <span className="c-badge" aria-hidden="true">
                  {r.no}
                </span>
                <span className="c-d-text">
                  <b>{`Day ${r.no}${done ? `, ${CALM.done}` : ''}`}</b>
                  <small>{[label, sub].filter((x) => x !== '').join(', ')}</small>
                </span>
                {!r.rest && t !== undefined && (
                  <button type="button" className="c-btn c-small" aria-label={`${CALM.play} day ${r.no}, ${t.name}`} onClick={() => p.onPlayDay(p.id, r.no, t)}>
                    {done ? CALM.play : CALM.start}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      )}
      {prog !== undefined && (
        <button type="button" className="c-btn c-link" onClick={() => p.onRestart(p.id)}>
          {CALM.restart}
        </button>
      )}
    </div>
  );
}
