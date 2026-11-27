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

let current: SampleBus | null = null;

export function setSampleBus(bus: SampleBus | null): void {
  current = bus;
}

export function getSampleBus(): SampleBus | null {
  return current;
}
