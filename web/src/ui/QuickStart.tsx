import { useEffect, useState } from 'react';
import type { RecContext, Recommendation, Situation } from '../catalog/types';
import { readFlag, writeFlag } from '../storage/prefs';
import { loadCatalog } from './catalogLoader';
import { COPY } from './copy';

export const QUICKSTART_KEY = 'zonked.quickstart.v1';
export const QS_LIMIT = 5;

/** Shown only on a first visit, never in the e2e harness. */
export function quickStartInitiallyOpen(search: string = typeof location === 'undefined' ? '' : location.search): boolean {
  return !readFlag(QUICKSTART_KEY) && !/[?&]e2e=1\b/.test(search);
}

interface Props {
  ctx: RecContext;
  onCtx: (c: RecContext) => void;
  /** Must go through the app's guarded() path so the safety dialog appears first. */
  onPlay: (recs: readonly Recommendation[], index: number, minutes: number | null, situation: Situation) => void;
  onClose: () => void;
  /** Tells the sound picker which card to suggest. */
  onSuggest?: (situation: Situation) => void;
}

type Step = 'situation' | 'time' | 'results';

export function QuickStart({ ctx, onCtx, onPlay, onClose, onSuggest }: Props): React.JSX.Element {
  const [step, setStep] = useState<Step>('situation');
  const [situation, setSituation] = useState<Situation>(ctx.situation);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [recs, setRecs] = useState<readonly Recommendation[] | null>(null);

  useEffect(() => {
    if (step !== 'results') return undefined;
    let live = true;
    setRecs(null);
    void loadCatalog().then((c) => {
      if (live) setRecs(c.recommendTemplates({ ...ctx, situation, availableMinutes: minutes ?? ctx.availableMinutes }, QS_LIMIT));
    });
    return () => {
      live = false;
    };
  }, [step, situation, minutes]); // eslint-disable-line react-hooks/exhaustive-deps -- ctx is read once per result load

  const pickSituation = (s: Situation): void => {
    setSituation(s);
    onSuggest?.(s);
    onCtx({ ...ctx, situation: s });
    setStep('time');
  };
  const pickMinutes = (m: number | null): void => {
    setMinutes(m);
    if (m !== null) onCtx({ ...ctx, situation, availableMinutes: m });
    setStep('results');
  };
  const never = (): void => {
    writeFlag(QUICKSTART_KEY, true);
    onClose();
  };

  return (
    <section className="qs" role="region" aria-labelledby="qs-title" data-testid="quickstart">
      <h2 id="qs-title" className="qs-title">
        {COPY.quickStart.title}
      </h2>
      {step === 'situation' && (
        <>
          <p className="qs-q">{COPY.quickStart.q1}</p>
          <div className="qs-choices feel-cards" role="group" aria-label={COPY.quickStart.q1}>
            {COPY.situations.map(([id, label]) => (
              <button key={id} type="button" className="chip feel-card" data-testid={`qs-situation-${id}`} onClick={() => pickSituation(id as Situation)}>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
      {step === 'time' && (
        <>
          <p className="qs-q">{COPY.quickStart.q2}</p>
          <div className="qs-choices" role="group" aria-label={COPY.quickStart.q2}>
            {COPY.minutes.map((m) => (
              <button key={m} type="button" className="chip" data-testid={`qs-minutes-${m}`} onClick={() => pickMinutes(m)}>
                {m} minutes
              </button>
            ))}
            <button type="button" className="chip" data-testid="qs-minutes-none" onClick={() => pickMinutes(null)}>
              {COPY.quickStart.notSure}
            </button>
          </div>
          <p className="meta qs-note">{COPY.quickStart.timeHint}</p>
        </>
      )}
      {step === 'results' && (
        <>
          <p className="qs-q">{COPY.quickStart.results}</p>
          {recs === null ? (
            <p className="meta" role="status">
              {COPY.quickStart.loading}
            </p>
          ) : recs.length === 0 ? (
            <p className="meta">{COPY.empty.results}</p>
          ) : (
            <ol className="qs-results" aria-label={COPY.quickStart.results}>
              {recs.map((r, i) => (
                <li key={r.template.id} className="qs-item" data-testid="qs-item">
                  <div className="qs-item-text">
                    <strong>{r.template.name}</strong>
                    <span className="meta">{r.reasons[0] ?? r.template.category}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-testid="qs-play"
                    onClick={() => {
                      writeFlag(QUICKSTART_KEY, true);
                      onPlay(recs, i, minutes, situation);
                    }}
                  >
                    {COPY.quickStart.play}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
      <div className="qs-actions">
        {step !== 'situation' && (
          <button type="button" className="btn" data-testid="qs-back" onClick={() => setStep(step === 'results' ? 'time' : 'situation')}>
            {COPY.quickStart.back}
          </button>
        )}
        <button type="button" className="btn" data-testid="qs-skip" onClick={onClose}>
          {COPY.quickStart.skip}
        </button>
        <button type="button" className="btn" data-testid="qs-never" onClick={never}>
          {COPY.quickStart.never}
        </button>
      </div>
    </section>
  );
}
