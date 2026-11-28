import type { PlayerSnapshot } from '../../app/player';
import { NO_LAYERS } from '../../sbg/layers';
import type { Layers } from '../../sbg/layers';
import type { NoiseKind } from '../../sbg/types';
import { RangeField, levelTicks } from '../shared/RangeField';

export interface MixPanelPort {
  setLayerOverride(p: Partial<Layers>): void;
  setNoiseOverride(o: { noise?: NoiseKind; noiseLevel?: number } | null): void;
  clearLayerOverrides(): void;
}

type LevelKey = 'lofiLevel' | 'instLevel' | 'padLevel' | 'chimeLevel' | 'percLevel' | 'crackle' | 'breathDepth' | 'stereoWidth' | 'panDepth';

const ROWS: readonly (readonly [string, LevelKey, string])[] = [
  ['lofi', 'lofiLevel', 'Warm hum'],
  ['inst', 'instLevel', 'Soft notes'],
  ['pad', 'padLevel', 'Pad'],
  ['chimes', 'chimeLevel', 'Chimes'],
  ['perc', 'percLevel', 'Gentle rhythm'],
  ['crackle', 'crackle', 'Vinyl crackle'],
  ['breath', 'breathDepth', 'Breathing swell'],
  ['width', 'stereoWidth', 'Stereo width'],
  ['pan', 'panDepth', 'Slow pan'],
];

/** Violet is bright, so its slider stops sooner. */
const VIOLET_MAX = 0.6;
const pct = (v: number): number => Math.round(v * 100);

/** Layer levels as filled sliders with ticks. Display and routing only: the player clamps every value. */
export function MixPanel({ snap, player }: { snap: PlayerSnapshot; player: MixPanelPort }): React.JSX.Element {
  const layers = snap.voice.layers ?? NO_LAYERS;
  const noise = snap.voice.noise;
  const noiseMax = noise === 'violet' ? VIOLET_MAX : 1;
  const noiseLevel = Math.min(noiseMax, snap.voice.noiseLevel);
  return (
    <div className="adv-panel" data-testid="adv-mix">
      {ROWS.map(([id, key, label]) => (
        <div className="adv-row" key={id}>
          <label htmlFor={`adv-mix-${id}`}>{label}</label>
          <RangeField
            id={`adv-mix-${id}`}
            testId={`adv-mix-${id}`}
            min={0}
            max={1}
            step={0.05}
            value={layers[key]}
            valueText={`${pct(layers[key])} percent`}
            bubbleText={`${pct(layers[key])}`}
            ticks={levelTicks()}
            onChange={(v) => player.setLayerOverride({ [key]: v })}
          />
        </div>
      ))}
      {noise !== 'off' && (
        <div className="adv-row">
          <label htmlFor="adv-mix-noise">Background noise</label>
          <RangeField
            id="adv-mix-noise"
            testId="adv-mix-noise"
            min={0}
            max={noiseMax}
            step={0.05}
            value={noiseLevel}
            valueText={`${pct(noiseLevel)} percent`}
            bubbleText={`${pct(noiseLevel)}`}
            ticks={levelTicks(noiseMax)}
            onChange={(v) => player.setNoiseOverride({ noiseLevel: Math.min(noiseMax, v) })}
          />
        </div>
      )}
      {noise === 'violet' && (
        <p className="adv-note" data-testid="adv-violet-note">
          Violet is bright. Start very quiet.
        </p>
      )}
      <button type="button" className="adv-btn" data-testid="adv-mix-reset" onClick={() => player.clearLayerOverrides()}>
        Reset to the sound
      </button>
    </div>
  );
}
