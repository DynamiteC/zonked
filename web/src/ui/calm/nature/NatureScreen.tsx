import { Suspense, lazy, useState } from 'react';
import { listSamples } from '../../../audio/samples';
import { CALM } from '../copy';
import { Icon } from '../icons';
import { PageHead } from '../MascotView';
import { MAX_NATURE_LEVEL } from './prefs';
import type { Nature } from './useNature';

const ICON: Readonly<Record<string, string>> = { wind: 'breeze', waterfall: 'rapids', flute: 'wave' };
const MySounds = lazy(() => import('./MySounds').then((m) => ({ default: m.MySounds })));
const Credits = lazy(() => import('./Credits').then((m) => ({ default: m.Credits })));

/** Slider with a visible label. The value is plain text for screen readers. */
export function Slider({ id, label, value, max, onChange }: { readonly id: string; readonly label: string; readonly value: number; readonly max: number; readonly onChange: (v: number) => void }): React.JSX.Element {
  return (
    <div className="c-slider">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="range" min={0} max={max} step={0.05} value={value} aria-valuetext={`${Math.round((value / max) * 100)} percent`} onChange={(e) => onChange(Number(e.currentTarget.value))} />
    </div>
  );
}

/** Blend and level for whatever nature or own sound is playing. Shared by this screen and the player. */
export function NatureControls({ nature }: { readonly nature: Nature }): React.JSX.Element {
  return (
    <div className="c-nature-controls">
      <Slider id="c-blend" label={CALM.natureBlend} value={nature.prefs.blend} max={1} onChange={nature.setBlend} />
      <Slider id="c-nlevel" label={CALM.natureLevel} value={nature.prefs.level} max={MAX_NATURE_LEVEL} onChange={nature.setLevel} />
    </div>
  );
}

export function NatureScreen({ nature, reduced, onBack }: { readonly nature: Nature; readonly reduced: boolean; readonly onBack: () => void }): React.JSX.Element {
  const [credit, setCredit] = useState<string | null>(null);
  return (
    <div className="c-nature">
      <PageHead title={CALM.natureHead} reduced={reduced} />
      <p className="c-lead">{CALM.natureIntro}</p>
      <ul className="c-tiles c-nature-tiles">
        {listSamples().map((s, i) => (
          <li key={s.id}>
            <button type="button" className={`c-tile c-g${(i % 6) + 1}`} data-testid={`nature-${s.id}`} aria-pressed={nature.on === s.id} onClick={() => nature.start(s.id)}>
              <Icon name={ICON[s.id] ?? s.id} />
              <span className="c-tile-name">{s.label}</span>
              <span className="c-tile-mood">{s.kind === 'synth' ? (s.note ?? CALM.natureMade) : CALM.natureFree}</span>
              {nature.on === s.id && <span className="c-tile-count">{CALM.natureOn}</span>}
            </button>
            <button type="button" className="c-btn c-link c-small" aria-expanded={credit === s.id} onClick={() => setCredit(credit === s.id ? null : s.id)}>
              {`${CALM.natureCredits}: ${s.label}`}
            </button>
            {credit === s.id && (
              <Suspense fallback={null}>
                <Credits id={s.id} synth={s.kind === 'synth'} />
              </Suspense>
            )}
          </li>
        ))}
      </ul>
      <NatureControls nature={nature} />
      {nature.on !== null && (
        <button type="button" className="c-btn c-wide" data-testid="nature-stop" onClick={nature.stop}>
          {CALM.natureOff}
        </button>
      )}
      <p className="c-status" role="status" data-testid="nature-message">{nature.message}</p>
      <p className="c-note">{CALM.natureNote}</p>
      <Suspense fallback={null}>
        <MySounds nature={nature} />
      </Suspense>
      <button type="button" className="c-btn c-link c-back" onClick={onBack}>
        {CALM.natureBack}
      </button>
    </div>
  );
}
