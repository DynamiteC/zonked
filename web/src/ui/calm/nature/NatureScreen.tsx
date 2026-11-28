import { Suspense, lazy, useState } from 'react';
import { listSamples } from '../../../audio/samples';
import { CALM } from '../copy';
import { Icon } from '../icons';
import { PageHead } from '../MascotView';
import { orderForDevice } from '../data';
import type { Device } from '../data';
import { NATURE_GROUPS, groupOf } from './groups';
import { MAX_NATURE_LEVEL } from './prefs';
import type { Nature } from './useNature';

const ICON: Readonly<Record<string, string>> = { wind: 'breeze', waterfall: 'falls', flute: 'wave' };
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

type Sample = ReturnType<typeof listSamples>[number];

function Tile({ s, i, nature }: { readonly s: Sample; readonly i: number; readonly nature: Nature }): React.JSX.Element {
  return (
    <li>
      <button type="button" className={`c-tile c-g${(i % 6) + 1}`} data-testid={`nature-${s.id}`} aria-pressed={nature.on === s.id} onClick={() => nature.start(s.id)}>
        <Icon name={ICON[s.id] ?? s.id} />
        <span className="c-tile-name">{s.label}</span>
        <span className="c-tile-mood">{s.note ?? (s.kind === 'synth' ? CALM.natureMade : CALM.natureFree)}</span>
        {nature.on === s.id && <span className="c-tile-count">{CALM.natureOn}</span>}
      </button>
    </li>
  );
}

/** One footer for every credit: pick a sound, read its author and licence. */
function CreditsFooter({ samples }: { readonly samples: readonly Sample[] }): React.JSX.Element {
  const [id, setId] = useState('');
  const pick = samples.find((s) => s.id === id);
  return (
    <section className="c-credits-foot" aria-label={CALM.natureCredits}>
      <label htmlFor="c-credit-pick">{CALM.natureCredits}</label>
      <select id="c-credit-pick" value={id} onChange={(e) => setId(e.currentTarget.value)}>
        <option value="">{CALM.natureCreditsPick}</option>
        {samples.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>
      {pick !== undefined && (
        <Suspense fallback={null}>
          <Credits id={pick.id} synth={pick.kind === 'synth'} />
        </Suspense>
      )}
    </section>
  );
}

export function NatureScreen({ nature, reduced, onBack, device = 'wired' }: { readonly nature: Nature; readonly reduced: boolean; readonly onBack: () => void; readonly device?: Device }): React.JSX.Element {
  const samples = listSamples();
  return (
    <div className="c-nature">
      <PageHead title={CALM.natureHead} reduced={reduced} />
      <p className="c-lead">{CALM.natureIntro}</p>
      <div className="c-sticky" data-testid="nature-sticky">
        <NatureControls nature={nature} />
        {nature.on !== null && (
          <button type="button" className="c-btn c-wide" data-testid="nature-stop" onClick={nature.stop}>
            {CALM.natureOff}
          </button>
        )}
      </div>
      {NATURE_GROUPS.map((g) => {
        const list = orderForDevice(samples.filter((s) => groupOf(s) === g), device);
        return list.length === 0 ? null : (
          <section key={g} aria-labelledby={`c-ng-${g.replaceAll(' ', '-')}`}>
            <h2 className="c-h3" id={`c-ng-${g.replaceAll(' ', '-')}`}>{g}</h2>
            <ul className="c-tiles c-nature-tiles">
              {list.map((s) => (
                <Tile key={s.id} s={s} i={samples.indexOf(s)} nature={nature} />
              ))}
            </ul>
          </section>
        );
      })}
      <p className="c-status" role="status" data-testid="nature-message">{nature.message}</p>
      <p className="c-note">{CALM.natureNote}</p>
      <CreditsFooter samples={samples} />
      <Suspense fallback={null}>
        <MySounds nature={nature} />
      </Suspense>
      <button type="button" className="c-btn c-link c-back" onClick={onBack}>
        {CALM.natureBack}
      </button>
    </div>
  );
}
