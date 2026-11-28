// Link between the audio engine and the lazy sample layer.
// The engine publishes the Web Audio nodes here once its graph exists.
// This file stays tiny so the first load pays almost nothing for it.

export interface SampleBus {
  readonly ctx: BaseAudioContext;
  /** Samples connect here. It feeds the master gain and the final clip guard. */
  readonly input: AudioNode;
  /** Gain on the DSP (beat and noise) path. The blend ducks it. */
  readonly duck: GainNode;
}

/** Web Audio Q for a high-pass is in dB. -3.0103 dB is 1/sqrt(2): a flat Butterworth shape. */
const BUTTERWORTH_Q_DB = -3.0103;

/**
 * The node every nature and synth layer connects to: a 2nd order high-pass (SAMPLE_HP_HZ) feeding `dest`.
 * It cuts subsonic rumble from the loops and leaves the beat path alone.
 */
export function createSampleInput(ctx: BaseAudioContext, dest: AudioNode, cornerHz: number): BiquadFilterNode {
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = cornerHz;
  hp.Q.value = BUTTERWORTH_Q_DB;
  hp.connect(dest);
  return hp;
}

let current: SampleBus | null = null;

export function setSampleBus(bus: SampleBus | null): void {
  current = bus;
}

export function getSampleBus(): SampleBus | null {
  return current;
}
