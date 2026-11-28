import { MAX_GAIN } from '../app/player';
import type { PlayerSnapshot } from '../app/player';
import { NO_LAYERS } from '../sbg/layers';
import type { Layers } from '../sbg/layers';
import { COPY } from './copy';
import { Drawer } from './Drawer';
import { Tip } from './Tip';
import { RangeField, levelTicks } from './shared/RangeField';

export interface MixerPort {
  setLayerOverride(p: Partial<Layers>): void;
  clearLayerOverrides(): void;
  toggleMute(): void;
}

interface Props {
  snap: PlayerSnapshot;
  player: MixerPort;
  onClose: () => void;
}

type LevelKey = 'lofiLevel' | 'instLevel' | 'padLevel' | 'chimeLevel' | 'percLevel' | 'crackle';

export const MIXER_ROWS: readonly { id: string; key: LevelKey; label: string; tip: string }[] = [
  { id: 'layer-lofi', key: 'lofiLevel', label: 'Warm tape hum', tip: COPY.tips.layerLofi },
  { id: 'layer-instrument', key: 'instLevel', label: 'Soft notes', tip: COPY.tips.layerInstrument },
  { id: 'layer-pad', key: 'padLevel', label: 'Pad', tip: COPY.tips.layerPad },
  { id: 'layer-chimes', key: 'chimeLevel', label: 'Chimes', tip: COPY.tips.layerChimes },
  { id: 'layer-perc', key: 'percLevel', label: 'Gentle rhythm', tip: COPY.tips.layerPerc },
  { id: 'layer-crackle', key: 'crackle', label: 'Vinyl crackle', tip: COPY.tips.layerCrackle },
];

export function Mixer({ snap, player, onClose }: Props): React.JSX.Element {
  const layers = snap.voice.layers ?? NO_LAYERS;
  const gain = Math.min(MAX_GAIN, snap.voice.gain);
  return (
    <Drawer id="mixer-panel" title="Sound mix" help={COPY.tips.mixer} testId="mixer-panel" onClose={onClose}>
      <p className="meta">{COPY.helper.mixer}</p>
      {MIXER_ROWS.map((r) => (
        <div className="slider-row" key={r.id}>
          <span className="tip-field">
            <Tip text={r.tip} controlId={r.id}><label htmlFor={r.id}>{r.label}</label></Tip>
          </span>
          <RangeField
            id={r.id}
            testId={r.id}
            min={0}
            max={1}
            step={0.05}
            value={layers[r.key]}
            valueText={`${Math.round(layers[r.key] * 100)} percent`}
            bubbleText={`${Math.round(layers[r.key] * 100)}`}
            ticks={levelTicks()}
            onChange={(v) => player.setLayerOverride({ [r.key]: v })}
          />
          <output htmlFor={r.id}>{Math.round(layers[r.key] * 100)}</output>
        </div>
      ))}
      <div className="tip-field">
        <p className="master" data-testid="master-gain">
          <Tip text={COPY.tips.volume}>{`Master gain ${snap.muted ? 0 : gain.toFixed(2)} (maximum ${MAX_GAIN})`}</Tip>
        </p>
      </div>
      <div className="drawer-actions">
        <Tip text={COPY.tips.mute}>
        <button
          type="button"
          className="btn"
          data-testid="mixer-mute"
          aria-pressed={snap.muted}
          onClick={() => player.toggleMute()}
        >
          {snap.muted ? 'Unmute' : 'Mute'}
        </button>
        </Tip>
        <button type="button" className="btn" data-testid="mixer-reset" onClick={() => player.clearLayerOverrides()}>
          Reset to template
        </button>
      </div>
    </Drawer>
  );
}
