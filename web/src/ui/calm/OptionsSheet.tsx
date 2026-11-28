import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { Player, PlayerSnapshot } from '../../app/player';
import type { AudioEngine } from '../../audio/types';
import { listSamples } from '../../audio/samples';
import { CALM, EVIDENCE } from './copy';
import { Slider } from './nature/NatureScreen';
import { RangeField } from '../shared/RangeField';
import type { RangeTick } from '../shared/RangeField';
import { orderForDevice } from './data';
import type { Device } from './data';
import { MAX_NATURE_LEVEL } from './nature/prefs';
import type { Nature } from './nature/useNature';
import { TimerChips } from './TimerChips';
import { loadAdvanced } from './advancedLoader';

const AdvancedPanels = lazy(loadAdvanced);

const BLEND_TICKS: readonly RangeTick[] = [
  { value: 0, label: 'More beats' },
  { value: 0.5, label: 'Even' },
  { value: 1, label: 'More nature' },
];

function blendText(v: number): string {
  if (v < 0.4) return 'More beats';
  return v > 0.6 ? 'More nature' : 'Even';
}

interface Props {
  readonly player: Player;
  readonly snap: PlayerSnapshot;
  readonly nature: Nature;
  readonly favorite: boolean;
  readonly evidence: string;
  readonly onFavorite: () => void;
  readonly onClose: () => void;
  readonly engine: AudioEngine;
  /** How the person listens. Bluetooth shows a tip and lists soft sounds first. */
  readonly device?: Device;
  /** Opens with the Advanced section expanded (Studio shortcut). */
  readonly advancedOpen?: boolean;
  readonly sprint?: { readonly onSprint: () => void; readonly onSprintEnd: () => void };
}

/** Bottom sheet with every player option: Timer, Nature sound, More. Escape closes it and focus returns to Options. */
export function OptionsSheet({ player, snap, nature, favorite, evidence, onFavorite, onClose, sprint, engine, device = 'wired', advancedOpen = false }: Props): React.JSX.Element {
  const box = useRef<HTMLDivElement>(null);
  const [why, setWhy] = useState(false);
  const [adv, setAdv] = useState(advancedOpen);
  useEffect(() => box.current?.querySelector<HTMLButtonElement>('button')?.focus(), []);
  const onKey = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    } else if (e.key === 'Tab') {
      const all = Array.from(box.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input, select') ?? []);
      const first = all[0];
      const last = all[all.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  };
  const samples = orderForDevice(listSamples(), device);
  return (
    <div className="c-overlay c-sheet-wrap" onClick={onClose}>
      <div ref={box} className="c-opts" role="dialog" aria-modal="true" aria-labelledby="c-opts-title" data-testid="options-sheet" onKeyDown={onKey} onClick={(e) => e.stopPropagation()}>
        <div className="c-opts-head">
          <h2 id="c-opts-title">{CALM.optionsTitle}</h2>
          <button type="button" className="c-btn c-ghost" onClick={onClose}>
            {CALM.optionsClose}
          </button>
        </div>
        <section aria-labelledby="c-o-timer">
          <h3 id="c-o-timer" className="c-o-h">{CALM.optTimer}</h3>
          <TimerChips timer={snap.timer} player={player} {...(sprint !== undefined ? { onSprint: sprint.onSprint, onSprintEnd: sprint.onSprintEnd } : {})} />
        </section>
        <section aria-labelledby="c-o-nature">
          <h3 id="c-o-nature" className="c-o-h">{CALM.optNature}</h3>
          <div className="c-chips c-left c-nature-row" role="group" aria-label={CALM.optNature}>
            <button type="button" className="c-tchip" aria-pressed={nature.on === null} data-testid="sheet-nature-none" onClick={nature.stop}>
              {CALM.natureNone}
            </button>
            {samples.map((s) => (
              <button key={s.id} type="button" className="c-tchip" aria-pressed={nature.on === s.id} data-testid={`sheet-nature-${s.id}`} onClick={() => (nature.on === s.id ? nature.stop() : nature.start(s.id))}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="c-slider c-blend">
            <label htmlFor="c-blend">{CALM.natureBlend}</label>
            <RangeField id="c-blend" min={0} max={1} step={0.05} value={nature.prefs.blend} valueText={blendText(nature.prefs.blend)} bubbleText={blendText(nature.prefs.blend)} ticks={BLEND_TICKS} onChange={nature.setBlend} />
          </div>
          {nature.on !== null && <Slider id="c-nlevel" label={CALM.natureLevel} value={nature.prefs.level} max={MAX_NATURE_LEVEL} onChange={nature.setLevel} />}
          <p className="c-status" role="status">{nature.message}</p>
        </section>
        <section aria-labelledby="c-o-more">
          <h3 id="c-o-more" className="c-o-h">{CALM.optMore}</h3>
          <div className="c-chips c-left">
            <button type="button" className="c-tchip" aria-pressed={favorite} data-testid="sheet-favorite" onClick={onFavorite}>
              {favorite ? CALM.saved : CALM.favorite}
            </button>
            <button type="button" className="c-tchip" aria-expanded={why} aria-controls="c-why-box" onClick={() => setWhy((v) => !v)}>
              {CALM.whyTitle}
            </button>
          </div>
          <div id="c-why-box" hidden={!why}>
            <p>{CALM.whyBody}</p>
            <p>{`Evidence: ${evidence}. ${EVIDENCE[evidence] ?? ''}`}</p>
          </div>
          <p className="c-muted">{CALM.volumeCapped}</p>
          {device === 'bluetooth' && <p className="c-muted" data-testid="bt-tip">{CALM.btTip}</p>}
        </section>
        <section aria-labelledby="c-o-adv">
          <h3 id="c-o-adv" className="c-o-h">
            <button type="button" className="c-btn c-ghost c-adv-btn" data-testid="options-advanced" aria-expanded={adv} aria-controls="c-adv-box" onClick={() => setAdv((v) => !v)}>
              {CALM.optAdvanced}
            </button>
          </h3>
          <div id="c-adv-box" hidden={!adv}>
            {adv && (
              <Suspense fallback={<p className="c-muted" role="status">{CALM.loading}</p>}>
                <AdvancedPanels engine={engine} player={player} onClose={() => setAdv(false)} />
              </Suspense>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
