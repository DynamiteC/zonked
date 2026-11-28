import { useMemo } from 'react';
import { SITUATIONS, VIBES, recommendTemplates } from '../catalog';
import type { DeviceType, RecContext, Recommendation, Sensitivity, Situation, TimeOfDay, Vibe } from '../catalog/types';
import { COPY } from './copy';
import { Drawer } from './Drawer';
import { Tip } from './Tip';
import { RangeField } from './shared/RangeField';
import { SITUATION_LABELS } from './recContext';

export const REC_LIMIT = 6;

interface Props {
  ctx: RecContext;
  onCtx: (c: RecContext) => void;
  onPlay: (recs: readonly Recommendation[], index: number) => void;
  onClose: () => void;
}

const TIMES: readonly TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
const SENS: readonly Sensitivity[] = ['low', 'medium', 'high'];
const DEVICES: readonly DeviceType[] = ['headphones', 'bluetooth', 'speaker'];

export function Recommender({ ctx, onCtx, onPlay, onClose }: Props): React.JSX.Element {
  const recs = useMemo(() => recommendTemplates(ctx, REC_LIMIT), [ctx]);
  const set = (p: Partial<RecContext>): void => onCtx({ ...ctx, ...p });
  return (
    <Drawer id="recommender-panel" title="Find sounds" help={COPY.tips.recommend} testId="recommender-panel" onClose={onClose}>
      <div className="form-grid">
        <span className="tip-field">
          <label htmlFor="rec-situation">What are you doing?</label>
          <Tip label="situation" text={COPY.tips.situation} />
        </span>
        <select
          id="rec-situation"
          data-testid="rec-situation"
          value={ctx.situation}
          onChange={(e) => set({ situation: e.target.value as Situation })}
        >
          {SITUATIONS.map((s) => (
            <option key={s} value={s}>
              {SITUATION_LABELS[s] ?? s}
            </option>
          ))}
        </select>
        <span className="tip-field">
          <label htmlFor="rec-minutes">Time: {ctx.availableMinutes} min</label>
          <Tip label="time" text={COPY.helper.minutes} />
        </span>
        <RangeField
          id="rec-minutes"
          testId="rec-minutes"
          min={5}
          max={120}
          step={5}
          value={ctx.availableMinutes}
          valueText={`${ctx.availableMinutes} minutes`}
          bubbleText={`${ctx.availableMinutes} min`}
          ticks={[5, 30, 60, 90, 120].map((v) => ({ value: v, label: String(v) }))}
          onChange={(v) => set({ availableMinutes: v })}
        />
        <span className="tip-field">
          <label htmlFor="rec-tod">Time of day</label>
          <Tip label="time of day" text={COPY.tips.timeOfDay} />
        </span>
        <select id="rec-tod" value={ctx.timeOfDay} onChange={(e) => set({ timeOfDay: e.target.value as TimeOfDay })}>
          {TIMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="tip-field">
          <label htmlFor="rec-sens">Sound sensitivity</label>
          <Tip label="sound sensitivity" text={COPY.tips.sensitivity} />
        </span>
        <select
          id="rec-sens"
          value={ctx.sensorySensitivity}
          onChange={(e) => set({ sensorySensitivity: e.target.value as Sensitivity })}
        >
          {SENS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="tip-field">
          <label htmlFor="rec-device">Listening on</label>
          <Tip label="listening on" text={COPY.tips.listeningOn} />
        </span>
        <select id="rec-device" value={ctx.deviceType} onChange={(e) => set({ deviceType: e.target.value as DeviceType })}>
          {DEVICES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="chips" role="group" aria-label="Vibe">
        {VIBES.map((v: Vibe) => (
          <button
            key={v}
            type="button"
            className="chip"
            aria-pressed={ctx.vibe === v}
            data-testid={`rec-vibe-${v}`}
            onClick={() => {
              const { vibe: _drop, ...rest } = ctx;
              onCtx(ctx.vibe === v ? rest : { ...rest, vibe: v });
            }}
          >
            {v}
          </button>
        ))}
      </div>
      {recs.length === 0 && <p className="meta">{COPY.empty.results}</p>}
      <ol className="results" aria-label="Recommendations">
        {recs.map((r, i) => (
          <li key={r.template.id} className="result" data-testid="rec-item">
            <div className="result-head">
              <span className="result-rank">{i + 1}</span>
              <strong>{r.template.name}</strong>
              <span className="score" data-testid="rec-score" aria-label={`Score ${Math.round(r.score)}`}>
                {Math.round(r.score)}
              </span>
            </div>
            <p className="meta">
              {r.template.category}, {r.template.recommendedMinutes} min, intensity {r.template.intensity} of 5
            </p>
            <ul className="chips tags" aria-label="Layers">
              {r.template.layerTags.map((t) => (
                <li key={t} className="tag-chip">
                  {t}
                </li>
              ))}
            </ul>
            <ul className="reasons">
              {r.reasons.slice(0, 3).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <button type="button" className="btn btn-primary" data-testid="rec-play" onClick={() => onPlay(recs, i)}>
              Play
            </button>
          </li>
        ))}
      </ol>
    </Drawer>
  );
}
