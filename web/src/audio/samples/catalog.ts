export type Mood = 'focus' | 'calm' | 'sleep' | 'nature';

export interface SampleInfo {
  readonly id: string;
  readonly label: string;
  /** 'loop' sounds are recorded files under public/samples. 'synth' sounds are made in code by Zonked and need no licence row. */
  readonly kind?: 'loop' | 'synth';
  /** One plain line for the picker. */
  readonly note?: string;
  /** What the sound is good for. Every catalog entry has at least one. */
  readonly moods?: readonly Mood[];
  /** Loops only: share of energy above 6 kHz, from scripts/hiss-score.mjs. Set once, offline. */
  readonly hiss?: number;
  /** Gain trim in dB, applied on top of the level slider. Sets every sound to TARGET_LUFS at level 0.4. See math.ts. */
  readonly trimDb: number;
  /** Measured loudness (LUFS, 40 Hz high-pass in, level 0.4, no trim) the trim was computed from. Offline, set once. */
  readonly rawLufs: number;
  /** True when the sound is kept out of the default lists and shown under "More sounds". */
  readonly more?: true;
  /** True when the sound stays soft over lossy Bluetooth codecs. Loops: hiss under 0.04. Made-in-code sounds: by their filter settings. */
  readonly btFriendly: boolean;
}

/** Loops with less than this share above 6 kHz are btFriendly. Same value as scripts/hiss-score.mjs. */
export const BT_HISS_LIMIT = 0.04;

/** Sounds for the default lists. Sounds flagged `more` are left out. */
export const defaultSamples = (list: readonly SampleInfo[] = SAMPLES): readonly SampleInfo[] => list.filter((s) => s.more !== true);
/** Sounds under "More sounds": reachable, never in a headline list. */
export const moreSamples = (list: readonly SampleInfo[] = SAMPLES): readonly SampleInfo[] => list.filter((s) => s.more === true);

/** Order matches docs/SAMPLES-LICENSES.md. Loops have a file samples/<id>.mp3.json. Synth ids have none. */
export const SAMPLES: readonly SampleInfo[] = [
  { id: 'rain', label: 'Rain', kind: 'loop', note: 'Steady rain on leaves and ground.', hiss: 0.0851, trimDb: 2.0, rawLufs: -28.2, btFriendly: false, moods: ['focus', 'calm', 'sleep', 'nature'] },
  { id: 'stream', label: 'Stream', kind: 'loop', note: 'Clear water running close by.', hiss: 0.0132, trimDb: 12.0, rawLufs: -38.1, btFriendly: true, moods: ['focus', 'calm', 'nature'] },
  { id: 'ocean', label: 'Ocean waves', kind: 'loop', note: 'Slow waves on a tropical beach.', hiss: 0.0106, trimDb: 2.5, rawLufs: -28.5, btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'rapids', label: 'River rapids', kind: 'loop', note: 'A wide river over rocks, a steady wash.', hiss: 0.0121, trimDb: 2.5, rawLufs: -28.3, btFriendly: true, moods: ['focus', 'nature'] },
  { id: 'forest', label: 'Forest', kind: 'loop', note: 'Quiet woods with a little air in the trees.', hiss: 0.0126, trimDb: 2.5, rawLufs: -28.5, btFriendly: true, moods: ['focus', 'calm', 'nature'] },
  { id: 'birds', label: 'Birds', kind: 'loop', note: 'Birds singing in a garden.', hiss: 0.4457, trimDb: 2.5, rawLufs: -28.4, more: true, btFriendly: false, moods: ['calm', 'nature'] },
  { id: 'breeze', label: 'Breeze and birds', kind: 'loop', note: 'A soft breeze with birds far off.', hiss: 0.0002, trimDb: 17.0, rawLufs: -43.1, more: true, btFriendly: true, moods: ['calm', 'nature'] },
  { id: 'lightrain', label: 'Light rain', kind: 'loop', note: 'Fine rain with a faint rumble far away.', hiss: 0.0469, trimDb: 5.5, rawLufs: -31.5, btFriendly: false, moods: ['focus', 'calm', 'sleep', 'nature'] },
  { id: 'thunder', label: 'Far thunder', kind: 'loop', note: 'Light rain with slow thunder in the distance.', hiss: 0.0343, trimDb: 6.0, rawLufs: -32.1, btFriendly: true, moods: ['calm', 'nature'] },
  { id: 'veranda', label: 'Rain on a veranda', kind: 'loop', note: 'Rain on a covered porch.', hiss: 0.0720, trimDb: 5.5, rawLufs: -31.3, btFriendly: false, moods: ['focus', 'calm', 'sleep', 'nature'] },
  { id: 'window', label: 'Rain on a window', kind: 'loop', note: 'Rain tapping on glass.', hiss: 0.0047, trimDb: 6.0, rawLufs: -31.9, btFriendly: true, moods: ['focus', 'calm', 'sleep'] },
  { id: 'storm', label: 'Summer rain', kind: 'loop', note: 'A long, even summer shower.', hiss: 0.1452, trimDb: 5.0, rawLufs: -31.1, btFriendly: false, moods: ['focus', 'sleep', 'nature'] },
  { id: 'waves', label: 'Gentle waves', kind: 'loop', note: 'Water rolling in and out on a shore.', hiss: 0.0028, trimDb: 5.5, rawLufs: -31.6, btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'pebbles', label: 'Waves on pebbles', kind: 'loop', note: 'Waves pulling back over small stones.', hiss: 0.0032, trimDb: 8.5, rawLufs: -34.4, more: true, btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'creek', label: 'Forest creek', kind: 'loop', note: 'A small creek in a quiet wood.', hiss: 0.0430, trimDb: 5.5, rawLufs: -31.3, btFriendly: false, moods: ['focus', 'calm', 'nature'] },
  { id: 'trickle', label: 'Water trickle', kind: 'loop', note: 'Thin water dripping and running.', hiss: 0.1378, trimDb: 6.5, rawLufs: -32.5, btFriendly: false, moods: ['focus', 'calm'] },
  { id: 'fountain', label: 'Fountain', kind: 'loop', note: 'A town fountain, a bright steady wash.', hiss: 0.2373, trimDb: 5.0, rawLufs: -31.2, btFriendly: false, moods: ['focus', 'calm'] },
  { id: 'fire', label: 'Fire crackle', kind: 'loop', note: 'Dry grass crackling in an open fireplace.', hiss: 0.3504, trimDb: 10.0, rawLufs: -36.2, more: true, btFriendly: false, moods: ['calm'] },
  { id: 'chimes', label: 'Wind chimes', kind: 'loop', note: 'Chimes in a light wind, with soft gaps.', hiss: 0.0019, trimDb: 5.5, rawLufs: -31.4, btFriendly: true, moods: ['calm', 'nature'] },
  { id: 'koshi', label: 'Koshi chimes', kind: 'loop', note: 'Slow, airy chimes that ring out and fade.', hiss: 0.0183, trimDb: 6.0, rawLufs: -32.1, btFriendly: true, moods: ['calm', 'sleep'] },
  { id: 'gong', label: 'Temple gong', kind: 'loop', note: 'Deep gong strikes with long, slow fades.', hiss: 0.0000, trimDb: 8.0, rawLufs: -34.2, more: true, btFriendly: true, moods: ['calm'] },
  { id: 'hum', label: 'Fan hum', kind: 'loop', note: 'A smooth room hum, like a fan.', hiss: 0.0070, trimDb: 5.5, rawLufs: -31.7, btFriendly: true, moods: ['focus', 'sleep'] },
  { id: 'wind', label: 'Soft wind (synth)', kind: 'synth', note: 'Slow gusts of warm wind, made in code.', trimDb: 5.5, rawLufs: -31.4, btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'waterfall', label: 'Waterfall (synth)', kind: 'synth', note: 'A steady, soft fall of water, made in code.', trimDb: 3.5, rawLufs: -29.6, btFriendly: true, moods: ['focus', 'calm', 'nature'] },
  { id: 'flute', label: 'Soft flute (synth)', kind: 'synth', note: 'Slow, quiet notes, made in code. Not a real flute.', trimDb: 1.5, rawLufs: -27.6, more: true, btFriendly: true, moods: ['calm', 'sleep'] },
  { id: 'rainroof', label: 'Rain on a roof (synth)', kind: 'synth', note: 'Soft drops on a roof, made in code.', trimDb: 8.5, rawLufs: -34.5, btFriendly: false, moods: ['focus', 'calm', 'sleep'] },
  { id: 'bowl', label: 'Singing bowl (synth)', kind: 'synth', note: 'One slow strike every 8 to 14 s, made in code.', trimDb: 10.5, rawLufs: -36.6, btFriendly: true, moods: ['calm', 'sleep'] },
  { id: 'softchimes', label: 'Soft chimes (synth)', kind: 'synth', note: 'A few high notes now and then, made in code.', trimDb: 8.0, rawLufs: -33.9, btFriendly: true, moods: ['calm', 'sleep'] },
  { id: 'crackle', label: 'Campfire crackle (synth)', kind: 'synth', note: 'A low glow with small pops, made in code.', trimDb: 14.0, rawLufs: -40.2, btFriendly: false, moods: ['calm', 'sleep'] },
  { id: 'brown', label: 'Brown noise (synth)', kind: 'synth', note: 'A deep, soft rumble that masks noise.', trimDb: 8.5, rawLufs: -34.6, btFriendly: true, moods: ['focus', 'sleep'] },
  { id: 'swell', label: 'Ocean swell (synth)', kind: 'synth', note: 'Slow waves that rise and fall, made in code.', trimDb: 11.0, rawLufs: -37.2, btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'crickets', label: 'Night crickets (synth)', kind: 'synth', note: 'Quiet crickets far off, made in code.', trimDb: 11.0, rawLufs: -37.1, more: true, btFriendly: false, moods: ['calm', 'nature'] },
];
