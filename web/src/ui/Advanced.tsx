import { useState } from 'react';
import type { PlayerSnapshot } from '../app/player';
import { NO_LAYERS } from '../sbg/layers';
import type { Layers } from '../sbg/layers';
import type { EngineStatus } from '../audio/types';
import { readFlag, writeFlag } from '../storage/prefs';
import type { BridgeStatus } from './bridgeClient';
import { COPY } from './copy';
import { CrewToggle } from './CrewToggle';
import { Hud } from './Hud';
import { Tip } from './Tip';
import { RangeField, levelTicks } from './shared/RangeField';

export const ADVANCED_KEY = 'zonked.advanced.v1';

interface Props {
  snap: PlayerSnapshot;
  engine: EngineStatus;
  bridge: BridgeStatus;
  onOpen: (id: 'editor' | 'mixer') => void;
  player?: { setLayerOverride(p: Partial<Layers>): void };
}

/**
 * Always rendered. Closed means visually hidden (sr-only clip) and inert, never display:none,
 * so readouts keep their text for tests and assistive checks.
 */
export function Advanced({ snap, engine, bridge, onOpen, player }: Props): React.JSX.Element {
  const [open, setOpen] = useState(() => readFlag(ADVANCED_KEY));
  const [gloss, setGloss] = useState(false);
  const toggle = (): void => {
    writeFlag(ADVANCED_KEY, !open);
    setOpen(!open);
  };
  return (
    <section className="adv" aria-label="Advanced details">
      <div className="adv-head">
        <button type="button" className="btn" data-testid="advanced-toggle" aria-expanded={open} aria-controls="adv-body" onClick={toggle}>
          {COPY.advanced.open}
        </button>
        <Tip label={COPY.advanced.open} text={COPY.tips.advanced} />
      </div>
      <div id="adv-body" className={open ? 'adv-body' : 'adv-body sr-only'} data-open={open} inert={!open}>
        <p className="meta">{COPY.advanced.hint}</p>
        <Hud snap={snap} engine={engine} bridge={bridge} />
        <CrewToggle />
        {player !== undefined && <AdvSliders snap={snap} player={player} />}
        <div className="adv-actions">
          <button type="button" className="btn" data-testid="adv-editor" onClick={() => onOpen('editor')}>
            {COPY.advanced.openEditor}
          </button>
          <button type="button" className="btn" data-testid="adv-mixer" onClick={() => onOpen('mixer')}>
            {COPY.advanced.openMixer}
          </button>
          <button type="button" className="btn" data-testid="glossary-toggle" aria-expanded={gloss} aria-controls="adv-gloss" onClick={() => setGloss((v) => !v)}>
            {COPY.glossaryTitle}
          </button>
        </div>
        {gloss && (
          <div id="adv-gloss" className="adv-gloss" role="region" aria-label={COPY.glossaryTitle} data-testid="glossary">
            <dl>
              {COPY.glossary.map(([term, def]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}

const SLIDERS = [
  ['adv-breath', 'breathDepth', COPY.advancedExtra.breath],
  ['adv-width', 'stereoWidth', COPY.advancedExtra.width],
  ['adv-pan', 'panDepth', COPY.advancedExtra.pan],
] as const;

function AdvSliders({ snap, player }: { snap: PlayerSnapshot; player: { setLayerOverride(p: Partial<Layers>): void } }): React.JSX.Element {
  const layers = snap.voice.layers ?? NO_LAYERS;
  return (
    <div className="adv-sliders">
      {SLIDERS.map(([id, key, label]) => (
        <div className="slider-row" key={id}>
          <label htmlFor={id}>{label}</label>
          <RangeField
            id={id}
            testId={id}
            min={0}
            max={1}
            step={0.05}
            value={layers[key]}
            valueText={`${Math.round(layers[key] * 100)} percent`}
            bubbleText={`${Math.round(layers[key] * 100)}`}
            ticks={levelTicks()}
            onChange={(v) => player.setLayerOverride({ [key]: v })}
          />
          <output htmlFor={id}>{Math.round(layers[key] * 100)}</output>
        </div>
      ))}
    </div>
  );
}
