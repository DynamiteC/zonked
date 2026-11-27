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
}

/** Order matches docs/SAMPLES-LICENSES.md. Loops have a file samples/<id>.mp3.json. Synth ids have none. */
export const SAMPLES: readonly SampleInfo[] = [
  { id: 'rain', label: 'Rain', kind: 'loop', note: 'Steady rain on leaves and ground.', moods: ['focus', 'calm', 'sleep', 'nature'] },
  { id: 'stream', label: 'Stream', kind: 'loop', note: 'Clear water running close by.', moods: ['focus', 'calm', 'nature'] },
  { id: 'ocean', label: 'Ocean waves', kind: 'loop', note: 'Slow waves on a tropical beach.', moods: ['calm', 'sleep', 'nature'] },
  { id: 'rapids', label: 'River rapids', kind: 'loop', note: 'A wide river over rocks, a steady wash.', moods: ['focus', 'nature'] },
  { id: 'forest', label: 'Forest', kind: 'loop', note: 'Quiet woods with a little air in the trees.', moods: ['focus', 'calm', 'nature'] },
  { id: 'birds', label: 'Birds', kind: 'loop', note: 'Birds singing in a garden.', moods: ['calm', 'nature'] },
  { id: 'breeze', label: 'Breeze and birds', kind: 'loop', note: 'A soft breeze with birds far off.', moods: ['calm', 'nature'] },
  { id: 'lightrain', label: 'Light rain', kind: 'loop', note: 'Fine rain with a faint rumble far away.', moods: ['focus', 'calm', 'sleep', 'nature'] },
  { id: 'thunder', label: 'Far thunder', kind: 'loop', note: 'Light rain with slow thunder in the distance.', moods: ['calm', 'sleep', 'nature'] },
  { id: 'veranda', label: 'Rain on a veranda', kind: 'loop', note: 'Rain on a covered porch.', moods: ['focus', 'calm', 'sleep', 'nature'] },
  { id: 'window', label: 'Rain on a window', kind: 'loop', note: 'Rain tapping on glass.', moods: ['focus', 'calm', 'sleep'] },
  { id: 'storm', label: 'Summer rain', kind: 'loop', note: 'A long, even summer shower.', moods: ['focus', 'sleep', 'nature'] },
  { id: 'waves', label: 'Gentle waves', kind: 'loop', note: 'Water rolling in and out on a shore.', moods: ['calm', 'sleep', 'nature'] },
  { id: 'pebbles', label: 'Waves on pebbles', kind: 'loop', note: 'Waves pulling back over small stones.', moods: ['calm', 'sleep', 'nature'] },
  { id: 'creek', label: 'Forest creek', kind: 'loop', note: 'A small creek in a quiet wood.', moods: ['focus', 'calm', 'nature'] },
  { id: 'trickle', label: 'Water trickle', kind: 'loop', note: 'Thin water dripping and running.', moods: ['focus', 'calm'] },
  { id: 'fountain', label: 'Fountain', kind: 'loop', note: 'A town fountain, a bright steady wash.', moods: ['focus', 'calm'] },
  { id: 'fire', label: 'Fire crackle', kind: 'loop', note: 'Dry grass crackling in an open fireplace.', moods: ['calm', 'sleep'] },
  { id: 'chimes', label: 'Wind chimes', kind: 'loop', note: 'Chimes in a light wind, with soft gaps.', moods: ['calm', 'nature'] },
  { id: 'koshi', label: 'Koshi chimes', kind: 'loop', note: 'Slow, airy chimes that ring out and fade.', moods: ['calm', 'sleep'] },
  { id: 'gong', label: 'Temple gong', kind: 'loop', note: 'Deep gong strikes with long, slow fades.', moods: ['calm', 'sleep'] },
  { id: 'hum', label: 'Fan hum', kind: 'loop', note: 'A smooth room hum, like a fan.', moods: ['focus', 'sleep'] },
  { id: 'wind', label: 'Soft wind (synth)', kind: 'synth', note: 'Slow gusts of warm wind, made in code.', moods: ['calm', 'sleep', 'nature'] },
  { id: 'waterfall', label: 'Waterfall (synth)', kind: 'synth', note: 'A steady, soft fall of water, made in code.', moods: ['focus', 'calm', 'nature'] },
  { id: 'flute', label: 'Soft flute (synth)', kind: 'synth', note: 'Slow, quiet notes, made in code. Not a real flute.', moods: ['calm', 'sleep'] },
  { id: 'rainroof', label: 'Rain on a roof (synth)', kind: 'synth', note: 'Soft drops on a roof, made in code.', moods: ['focus', 'calm', 'sleep'] },
  { id: 'bowl', label: 'Singing bowl (synth)', kind: 'synth', note: 'One slow strike every 8 to 14 s, made in code.', moods: ['calm', 'sleep'] },
  { id: 'softchimes', label: 'Soft chimes (synth)', kind: 'synth', note: 'A few high notes now and then, made in code.', moods: ['calm', 'sleep'] },
  { id: 'crackle', label: 'Campfire crackle (synth)', kind: 'synth', note: 'A low glow with small pops, made in code.', moods: ['calm', 'sleep'] },
  { id: 'brown', label: 'Brown noise (synth)', kind: 'synth', note: 'A deep, soft rumble that masks noise.', moods: ['focus', 'sleep'] },
  { id: 'swell', label: 'Ocean swell (synth)', kind: 'synth', note: 'Slow waves that rise and fall, made in code.', moods: ['calm', 'sleep', 'nature'] },
  { id: 'crickets', label: 'Night crickets (synth)', kind: 'synth', note: 'Quiet crickets far off, made in code.', moods: ['calm', 'sleep', 'nature'] },
];
