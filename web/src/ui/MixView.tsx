import { useState } from 'react';
import { channelHz } from '../app/neuro';
import type { PlayerSnapshot } from '../app/player';
import { alertToBeat, alertToLayers } from '../catalog/soundMenu';
import { bandForHz } from '../catalog/bands';
import { NO_LAYERS } from '../sbg/layers';
import type { NoiseKind } from '../sbg/types';
import type { Layers } from '../sbg/layers';
import { COPY } from './copy';
import { Tip } from './Tip';

/** Pulses faster than this can feel tiring. The note shows only above it. */
const FAST_BEAT_HZ = 25;

/** Phones start collapsed to keep the page short. The content stays rendered either way. */
const startsOpen = (): boolean => typeof window.matchMedia !== 'function' || window.matchMedia('(min-width: 641px)').matches;

export interface MixPort {
  setLayerOverride(p: Partial<Layers>): void;
  setBeatOverride(hz: number | null): void;
  setNoiseOverride(o: { noise?: NoiseKind; noiseLevel?: number } | null): void;
}

interface Props {
  snap: PlayerSnapshot;
  player: MixPort;
}

const ROWS = [
  ['lofi', 'lofiLevel', COPY.mix.lofi],
  ['piano', 'instLevel', COPY.mix.piano],
  ['chimes', 'chimeLevel', COPY.mix.chimes],
] as const;

export function MixView({ snap, player }: Props): React.JSX.Element {
  const layers = snap.voice.layers ?? NO_LAYERS;
  const [alert, setAlert] = useState(0.3);
  const [open, setOpen] = useState(startsOpen);
  const hz = channelHz(snap.voice);
  const beat = Math.abs(hz.r - hz.l);
  const band = bandForHz(beat);
  const noise = snap.voice.noise;
  const noiseLabel = noise === 'violet' ? COPY.mix.noiseViolet : noise === 'pink' ? COPY.mix.noiseRain : noise === 'brown' ? COPY.mix.noiseDeep : COPY.mix.noiseOther;
  /** Violet is bright, so its slider stops sooner. */
  const noiseMax = noise === 'violet' ? 0.6 : 1;
  return (
    <section className="mix" aria-labelledby="mix-title" data-testid="mix-view">
      <div className="mix-head">
        <h2 id="mix-title" className="picker-title">
          {COPY.mix.title}
        </h2>
        <button type="button" className="btn mix-toggle" data-testid="mix-toggle" aria-expanded={open} aria-controls="mix-body" onClick={() => setOpen((v) => !v)}>
          {open ? COPY.mix.hide : COPY.mix.show}
        </button>
      </div>
      <div id="mix-body" className={open ? 'mix-body' : 'mix-body sr-only'} data-open={open} inert={!open}>
      <p className="meta">{COPY.mix.intro}</p>
      {!snap.playing && <p className="meta">{COPY.mix.none}</p>}
      {ROWS.map(([id, key, label]) => (
        <div className="slider-row" key={id}>
          <label htmlFor={`mix-${id}`}>{label}</label>
          <input
            id={`mix-${id}`}
            data-testid={`mix-slider-${id}`}
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={layers[key]}
            aria-valuetext={`${Math.round(layers[key] * 100)} percent`}
            onChange={(e) => player.setLayerOverride({ [key]: Number(e.target.value) })}
          />
          <output htmlFor={`mix-${id}`}>{Math.round(layers[key] * 100)}</output>
        </div>
      ))}
      {noise !== 'off' && (
        <div className="slider-row">
          <label htmlFor="mix-noise">{noiseLabel}</label>
          <input
            id="mix-noise"
            data-testid="mix-slider-noise"
            type="range"
            min={0}
            max={noiseMax}
            step={0.05}
            value={Math.min(noiseMax, snap.voice.noiseLevel)}
            aria-valuetext={`${Math.round(snap.voice.noiseLevel * 100)} percent`}
            onChange={(e) => player.setNoiseOverride({ noiseLevel: Math.min(noiseMax, Number(e.target.value)) })}
          />
          <output htmlFor="mix-noise">{Math.round(snap.voice.noiseLevel * 100)}</output>
        </div>
      )}
      <div className="dial" data-testid="calm-dial-wrap">
        <span className="tip-field">
          <label htmlFor="calm-dial">{COPY.mix.dialTitle}</label>
          <Tip label={COPY.mix.dialTitle} text={COPY.mix.dialHint} />
        </span>
        <div className="dial-row">
          <span className="meta">{COPY.mix.dialCalm}</span>
          <input
            id="calm-dial"
            data-testid="calm-dial"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={alert}
            aria-valuetext={`${Math.round(alert * 100)} percent toward alert, pulse about ${alertToBeat(alert)} Hz`}
            onChange={(e) => {
              const v = Number(e.target.value);
              setAlert(v);
              player.setBeatOverride(alertToBeat(v));
              player.setLayerOverride(alertToLayers(v, layers));
            }}
          />
          <span className="meta">{COPY.mix.dialAlert}</span>
        </div>
        <p className="meta" data-testid="dial-readout">
          {COPY.mix.beatNow}: {beat.toFixed(1)} Hz ({band.name})
        </p>
        {beat > FAST_BEAT_HZ && (
          <p className="meta notice" data-testid="hearing-note">
            {COPY.mix.hearing}
          </p>
        )}
      </div>
      </div>
    </section>
  );
}
