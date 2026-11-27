import { useEffect, useMemo, useRef, useState } from 'react';
import { recommendTemplates } from '../../catalog';
import type { Template } from '../../catalog/types';
import { CALM } from './copy';
import { profileToRecommendation } from './data';
import type { Profile } from './data';

export const PREVIEW_MS = 10_000;
const familyOf = (id: string): string => id.replace(/-\d+$/, '');

export interface Starter {
  readonly template: Template;
  readonly reason: string;
}

/** Top 3 recommendations with distinct families (spec section b). */
export function pickStarters(profile: Profile, now: Date = new Date()): readonly Starter[] {
  const seen = new Set<string>();
  const out: Starter[] = [];
  for (const r of recommendTemplates(profileToRecommendation(profile, now), 12)) {
    const fam = familyOf(r.template.id);
    if (seen.has(fam)) continue;
    seen.add(fam);
    out.push({ template: r.template, reason: r.reasons[0] ?? r.template.reasonTemplate });
    if (out.length === 3) break;
  }
  return out;
}

interface Props {
  readonly profile: Profile;
  readonly playing: boolean;
  /** Plays one starter. Called only on this screen, which comes after the safety notice. */
  readonly onPreview: (t: Template) => void;
  readonly onStop: () => void;
  readonly onStart: (t: Template) => void;
}

export function StarterStep({ profile, playing, onPreview, onStop, onStart }: Props): React.JSX.Element {
  const starters = useMemo(() => pickStarters(profile), [profile]);
  const [picked, setPicked] = useState(starters[0]?.template.id ?? '');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => () => void (timer.current !== null && window.clearTimeout(timer.current)), []);

  const preview = (t: Template): void => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setPicked(t.id);
    setPreviewId(t.id);
    onPreview(t);
    timer.current = window.setTimeout(() => {
      setPreviewId(null);
      onStop();
    }, PREVIEW_MS);
  };
  const chosen = starters.find((s) => s.template.id === picked)?.template;
  return (
    <>
      <h2 className="c-h1">{CALM.starterTitle}</h2>
      <fieldset className="c-starters">
        <legend className="c-sr">{CALM.starterTitle}</legend>
        {starters.map((s) => (
          <div key={s.template.id} className="c-starter" data-picked={picked === s.template.id ? 'true' : 'false'}>
            <label className="c-starter-pick">
              <input type="radio" name="starter" checked={picked === s.template.id} onChange={() => setPicked(s.template.id)} />
              <span className="c-s-text">
                <b>{s.template.name}</b>
                <small>{s.reason}</small>
              </span>
            </label>
            <button type="button" className="c-btn c-small" onClick={() => preview(s.template)}>
              {CALM.preview}
            </button>
          </div>
        ))}
      </fieldset>
      <p className="c-status" role="status">
        {previewId !== null && playing ? CALM.previewing : ''}
      </p>
      <div className="c-actions">
        <button type="button" className="c-btn c-primary" disabled={chosen === undefined} onClick={() => {
            if (timer.current !== null) window.clearTimeout(timer.current);
            if (chosen !== undefined) onStart(chosen);
          }}>
          {CALM.start}
        </button>
      </div>
    </>
  );
}
