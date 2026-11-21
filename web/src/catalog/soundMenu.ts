/** Plain-language sound menu. Tiny on purpose: the UI loads it lazily. Pure and clamped. */
import type { Layers } from '../sbg/layers';
import type { NoiseKind } from '../sbg/types';

export type SoundId = 'lofi' | 'piano' | 'violet' | 'rain' | 'deep' | 'chimes' | 'beats';

export interface SoundMenuItem {
  readonly id: SoundId;
  readonly name: string;
  readonly blurb: string;
  readonly mood: string;
  readonly defaultLevel: number;
  readonly layerKeys: readonly (keyof Layers)[];
  readonly templateId: string;
  readonly evidence: 'strong' | 'mixed' | 'preliminary' | 'limited' | 'preference';
}

export const SOUND_MENU: readonly SoundMenuItem[] = [
  { id: 'lofi', name: 'Lo-fi', blurb: 'Warm, slow chords with a tape and vinyl feel, like a quiet study radio.', mood: 'warm', defaultLevel: 0.5, layerKeys: ['lofiLevel', 'lofiProgression', 'tapeWow', 'crackle'], templateId: 'starter-lofi', evidence: 'preference' },
  { id: 'piano', name: 'Soft piano', blurb: 'A soft piano playing gentle, slow phrases with long ringing notes.', mood: 'calm', defaultLevel: 0.45, layerKeys: ['instLevel', 'instKind', 'pianoPedal'], templateId: 'starter-piano', evidence: 'preference' },
  { id: 'violet', name: 'Violet hiss', blurb: 'A thin, bright hiss, like gentle static. Keep it quiet.', mood: 'bright', defaultLevel: 0.3, layerKeys: [], templateId: 'starter-violet', evidence: 'limited' },
  { id: 'rain', name: 'Rain hush', blurb: 'A steady rain-like hush, even across the pitches (pink noise).', mood: 'calm', defaultLevel: 0.4, layerKeys: [], templateId: 'starter-rain', evidence: 'mixed' },
  { id: 'deep', name: 'Deep rumble', blurb: 'A deep, low rumble like distant thunder or a big waterfall (brown noise).', mood: 'deep', defaultLevel: 0.4, layerKeys: [], templateId: 'starter-deep', evidence: 'preference' },
  { id: 'chimes', name: 'Soft chimes', blurb: 'Soft bells that ring now and then at uneven gaps.', mood: 'dreamy', defaultLevel: 0.3, layerKeys: ['chimeLevel', 'chimeRatePerMin'], templateId: 'starter-chimes', evidence: 'preference' },
  { id: 'beats', name: 'Beats only', blurb: 'A soft pulse you hear as two slightly different tones, one per ear. Use headphones.', mood: 'neutral', defaultLevel: 0, layerKeys: [], templateId: 'starter-beats', evidence: 'mixed' },
];

const clamp01 = (v: number): number => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);

/** Noise colour and layer fields for one sound at a level (0..1). */
export function soundVoice(id: SoundId, level: number): { noise: NoiseKind; noiseLevel: number; layers: Partial<Layers> } {
  const l = clamp01(level);
  switch (id) {
    case 'lofi':
      return { noise: 'off', noiseLevel: 0, layers: { lofiLevel: l, lofiWarmth: 0.6, lofiProgression: 2, tapeWow: 0.35, crackle: 0.12, breathDepth: 0.4, breathRateHz: 0.08, stereoWidth: 0.5 } };
    case 'piano':
      return { noise: 'off', noiseLevel: 0, layers: { instLevel: l, instKind: 3, instRootHz: 220, instScale: 2, instBpm: 46, pianoPedal: 0.5, breathDepth: 0.3, breathRateHz: 0.07, stereoWidth: 0.4 } };
    case 'violet':
      return { noise: 'violet', noiseLevel: l, layers: {} };
    case 'rain':
      return { noise: 'pink', noiseLevel: l, layers: {} };
    case 'deep':
      return { noise: 'brown', noiseLevel: l, layers: {} };
    case 'chimes':
      return { noise: 'off', noiseLevel: 0, layers: { chimeLevel: l, chimeRatePerMin: 5, breathDepth: 0.2, breathRateHz: 0.06 } };
    default:
      return { noise: 'off', noiseLevel: 0, layers: {} };
  }
}

/** Beat steps by band: delta, theta, alpha, low beta, beta. */
const ALERT_STEPS: readonly number[] = [2.5, 6, 10, 14, 20];

/** 0 calm .. 1 alert maps to a beat in Hz, stepwise by band. NaN gives the calm end. */
export function alertToBeat(alert: number): number {
  const a = clamp01(alert);
  const i = Math.min(ALERT_STEPS.length - 1, Math.floor(a * ALERT_STEPS.length));
  return Math.min(40, Math.max(0.5, ALERT_STEPS[i] ?? 2.5));
}

/** Layer tweaks for an alert level: calm breathes slower and wider, alert is steadier and brisker. */
export function alertToLayers(alert: number, base: Layers): Partial<Layers> {
  const a = clamp01(alert);
  return {
    breathDepth: clamp01(base.breathDepth * (1 - 0.6 * a)),
    breathRateHz: Math.min(0.2, Math.max(0.05, 0.06 + 0.1 * a)),
    instBpm: Math.min(180, Math.max(30, Math.round(base.instBpm * (0.8 + 0.6 * a)))),
    lofiWarmth: clamp01(base.lofiWarmth * (1 - 0.4 * a)),
  };
}
