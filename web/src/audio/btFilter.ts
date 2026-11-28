// Bluetooth listening mode, Web Audio side only. The DSP core, its clamps and its gain cap are untouched.
// Lossy Bluetooth codecs (SBC, AAC) smear steady hiss. A gentle cut above 6 kHz and a low-pass near 9 kHz keep
// noise and nature sounds soft. Beat frequencies and carriers sit far below both filters and do not change.

/** The three ways to listen. Stored under zonked.device.v1. */
export type ListenDevice = 'wired' | 'bluetooth' | 'speakers';

export const BT_SHELF_HZ = 6000;
export const BT_SHELF_DB = -6;
export const BT_LOWPASS_HZ = 9000;
/** The noise layer sits 3 dB lower in Bluetooth mode. */
export const BT_NOISE_DB = -3;
export const BT_NOISE_GAIN = 10 ** (BT_NOISE_DB / 20);
/** Switching crossfades the plain path and the filtered path over this long, so nothing clicks. */
export const BT_XFADE_SEC = 0.25;

/** Noise level for the DSP param block. Never above the input, never below 0. */
export function btNoiseLevel(level: number, on: boolean): number {
  if (!Number.isFinite(level)) return 0;
  return on ? level * BT_NOISE_GAIN : level;
}

export interface BtPath {
  readonly on: () => boolean;
  setOn(on: boolean): void;
}

/**
 * Two parallel paths from `input` to `output`: a plain one and a filtered one (high shelf, then low-pass).
 * Switching ramps their gains in opposite directions. Both paths are unity at low frequencies, so the
 * level of the beat and the carrier stays the same during and after the change.
 */
export function createBtPath(ctx: BaseAudioContext, input: AudioNode, output: AudioNode): BtPath {
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const shelf = ctx.createBiquadFilter();
  const lowpass = ctx.createBiquadFilter();
  shelf.type = 'highshelf';
  shelf.frequency.value = BT_SHELF_HZ;
  shelf.gain.value = BT_SHELF_DB;
  lowpass.type = 'lowpass';
  lowpass.frequency.value = BT_LOWPASS_HZ;
  dry.gain.value = 1;
  wet.gain.value = 0;
  input.connect(dry).connect(output);
  input.connect(shelf).connect(lowpass).connect(wet).connect(output);
  let isOn = false;
  const ramp = (g: AudioParam, to: number): void => {
    const t = ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(to, t + BT_XFADE_SEC);
  };
  return {
    on: () => isOn,
    setOn(on: boolean): void {
      if (on === isOn) return;
      isOn = on;
      ramp(dry.gain, on ? 0 : 1);
      ramp(wet.gain, on ? 1 : 0);
    },
  };
}
