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
  /** True when the sound stays soft over lossy Bluetooth codecs. Loops: hiss under 0.04. Made-in-code sounds: by their filter settings. */
  readonly btFriendly: boolean;
}

/** Loops with less than this share above 6 kHz are btFriendly. Same value as scripts/hiss-score.mjs. */
export const BT_HISS_LIMIT = 0.04;

/** Order matches docs/SAMPLES-LICENSES.md. Loops have a file samples/<id>.mp3.json. Synth ids have none. */
export const SAMPLES: readonly SampleInfo[] = [
  { id: 'rain', label: 'Rain', kind: 'loop', note: 'Steady rain on leaves and ground.', hiss: 0.0851, btFriendly: false, moods: ['focus', 'calm', 'sleep', 'nature'] },
  { id: 'stream', label: 'Stream', kind: 'loop', note: 'Clear water running close by.', hiss: 0.0132, btFriendly: true, moods: ['focus', 'calm', 'nature'] },
  { id: 'ocean', label: 'Ocean waves', kind: 'loop', note: 'Slow waves on a tropical beach.', hiss: 0.0106, btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'rapids', label: 'River rapids', kind: 'loop', note: 'A wide river over rocks, a steady wash.', hiss: 0.0121, btFriendly: true, moods: ['focus', 'nature'] },
  { id: 'forest', label: 'Forest', kind: 'loop', note: 'Quiet woods with a little air in the trees.', hiss: 0.0126, btFriendly: true, moods: ['focus', 'calm', 'nature'] },
  { id: 'birds', label: 'Birds', kind: 'loop', note: 'Birds singing in a garden.', hiss: 0.4457, btFriendly: false, moods: ['calm', 'nature'] },
  { id: 'breeze', label: 'Breeze and birds', kind: 'loop', note: 'A soft breeze with birds far off.', hiss: 0.0002, btFriendly: true, moods: ['calm', 'nature'] },
  { id: 'lightrain', label: 'Light rain', kind: 'loop', note: 'Fine rain with a faint rumble far away.', hiss: 0.0469, btFriendly: false, moods: ['focus', 'calm', 'sleep', 'nature'] },
  { id: 'thunder', label: 'Far thunder', kind: 'loop', note: 'Light rain with slow thunder in the distance.', hiss: 0.0343, btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'veranda', label: 'Rain on a veranda', kind: 'loop', note: 'Rain on a covered porch.', hiss: 0.0720, btFriendly: false, moods: ['focus', 'calm', 'sleep', 'nature'] },
  { id: 'window', label: 'Rain on a window', kind: 'loop', note: 'Rain tapping on glass.', hiss: 0.0047, btFriendly: true, moods: ['focus', 'calm', 'sleep'] },
  { id: 'storm', label: 'Summer rain', kind: 'loop', note: 'A long, even summer shower.', hiss: 0.1452, btFriendly: false, moods: ['focus', 'sleep', 'nature'] },
  { id: 'waves', label: 'Gentle waves', kind: 'loop', note: 'Water rolling in and out on a shore.', hiss: 0.0028, btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'pebbles', label: 'Waves on pebbles', kind: 'loop', note: 'Waves pulling back over small stones.', hiss: 0.0032, btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'creek', label: 'Forest creek', kind: 'loop', note: 'A small creek in a quiet wood.', hiss: 0.0430, btFriendly: false, moods: ['focus', 'calm', 'nature'] },
  { id: 'trickle', label: 'Water trickle', kind: 'loop', note: 'Thin water dripping and running.', hiss: 0.1378, btFriendly: false, moods: ['focus', 'calm'] },
  { id: 'fountain', label: 'Fountain', kind: 'loop', note: 'A town fountain, a bright steady wash.', hiss: 0.2373, btFriendly: false, moods: ['focus', 'calm'] },
  { id: 'fire', label: 'Fire crackle', kind: 'loop', note: 'Dry grass crackling in an open fireplace.', hiss: 0.3504, btFriendly: false, moods: ['calm', 'sleep'] },
  { id: 'chimes', label: 'Wind chimes', kind: 'loop', note: 'Chimes in a light wind, with soft gaps.', hiss: 0.0019, btFriendly: true, moods: ['calm', 'nature'] },
  { id: 'koshi', label: 'Koshi chimes', kind: 'loop', note: 'Slow, airy chimes that ring out and fade.', hiss: 0.0183, btFriendly: true, moods: ['calm', 'sleep'] },
  { id: 'gong', label: 'Temple gong', kind: 'loop', note: 'Deep gong strikes with long, slow fades.', hiss: 0.0000, btFriendly: true, moods: ['calm', 'sleep'] },
  { id: 'hum', label: 'Fan hum', kind: 'loop', note: 'A smooth room hum, like a fan.', hiss: 0.0070, btFriendly: true, moods: ['focus', 'sleep'] },
  { id: 'wind', label: 'Soft wind (synth)', kind: 'synth', note: 'Slow gusts of warm wind, made in code.', btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'waterfall', label: 'Waterfall (synth)', kind: 'synth', note: 'A steady, soft fall of water, made in code.', btFriendly: true, moods: ['focus', 'calm', 'nature'] },
  { id: 'flute', label: 'Soft flute (synth)', kind: 'synth', note: 'Slow, quiet notes, made in code. Not a real flute.', btFriendly: true, moods: ['calm', 'sleep'] },
  { id: 'rainroof', label: 'Rain on a roof (synth)', kind: 'synth', note: 'Soft drops on a roof, made in code.', btFriendly: false, moods: ['focus', 'calm', 'sleep'] },
  { id: 'bowl', label: 'Singing bowl (synth)', kind: 'synth', note: 'One slow strike every 8 to 14 s, made in code.', btFriendly: true, moods: ['calm', 'sleep'] },
  { id: 'softchimes', label: 'Soft chimes (synth)', kind: 'synth', note: 'A few high notes now and then, made in code.', btFriendly: true, moods: ['calm', 'sleep'] },
  { id: 'crackle', label: 'Campfire crackle (synth)', kind: 'synth', note: 'A low glow with small pops, made in code.', btFriendly: false, moods: ['calm', 'sleep'] },
  { id: 'brown', label: 'Brown noise (synth)', kind: 'synth', note: 'A deep, soft rumble that masks noise.', btFriendly: true, moods: ['focus', 'sleep'] },
  { id: 'swell', label: 'Ocean swell (synth)', kind: 'synth', note: 'Slow waves that rise and fall, made in code.', btFriendly: true, moods: ['calm', 'sleep', 'nature'] },
  { id: 'crickets', label: 'Night crickets (synth)', kind: 'synth', note: 'Quiet crickets far off, made in code.', btFriendly: false, moods: ['calm', 'sleep', 'nature'] },
];
