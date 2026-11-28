import { useState } from 'react';
import { channelHz } from '../../app/neuro';
import type { PlayerSnapshot } from '../../app/player';
import { bandForHz } from '../../catalog/bands';
import { alertToBeat, alertToLayers } from '../../catalog/soundMenu';
import { NO_LAYERS } from '../../sbg/layers';
import type { Layers } from '../../sbg/layers';
import { dialBands, dialMeaning, dialValueText } from '../dialBands';
import { RangeField } from '../shared/RangeField';

export interface CalmAlertPort {
  setBeatOverride(hz: number | null): void;
  setLayerOverride(p: Partial<Layers>): void;
}

/** Pulses faster than this can feel tiring. The note shows only above it. */
const FAST_BEAT_HZ = 25;
const START = 0.3;

/** Calm to Alert dial. Band segments come from the real slider to Hz mapping (alertToBeat). */
export function CalmAlertPanel({ snap, player }: { snap: PlayerSnapshot; player: CalmAlertPort }): React.JSX.Element {
  const [alert, setAlert] = useState(START);
  const [touched, setTouched] = useState(false);
  const hz = channelHz(snap.voice);
  const beat = Math.abs(hz.r - hz.l);
  const shown = touched ? bandForHz(alertToBeat(alert)).name : bandForHz(beat).name;
  const layers = snap.voice.layers ?? NO_LAYERS;
  return (
    <div className="adv-panel" data-testid="adv-dial">
      <div className="adv-ends">
        <span>Calm</span>
        <span>Alert</span>
      </div>
      <RangeField
        id="adv-dial"
        testId="adv-dial-input"
        min={0}
        max={1}
        step={0.01}
        value={alert}
        valueText={dialValueText(alert)}
        bubbleText={`${alertToBeat(alert)} Hz`}
        bands={dialBands(shown)}
        onChange={(v) => {
          setAlert(v);
          setTouched(true);
          player.setBeatOverride(alertToBeat(v));
          player.setLayerOverride(alertToLayers(v, layers));
        }}
      />
      <p className="adv-line" data-testid="adv-dial-readout">
        Pulse speed now: {beat.toFixed(1)} Hz ({bandForHz(beat).name})
      </p>
      <p className="adv-note" data-testid="adv-dial-meaning">
        {dialMeaning(beat)}
      </p>
      {beat > FAST_BEAT_HZ && (
        <p className="adv-note" data-testid="adv-hearing-note">
          Keep it quiet. Pulses above 25 Hz can feel tiring.
        </p>
      )}
      <button
        type="button"
        className="adv-btn"
        data-testid="adv-dial-reset"
        onClick={() => {
          setTouched(false);
          player.setBeatOverride(null);
        }}
      >
        Back to the sound's own pulse
      </button>
    </div>
  );
}
