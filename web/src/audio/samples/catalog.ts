export interface SampleInfo {
  readonly id: string;
  readonly label: string;
  /** 'synth' sounds are made in code by Zonked. They have no file and need no licence row. */
  readonly kind?: 'loop' | 'synth';
  /** One plain line for the picker. */
  readonly note?: string;
}

/** Order matches docs/SAMPLES-LICENSES.md. Loops have a file samples/<id>.mp3.json. Synth ids have none. */
export const SAMPLES: readonly SampleInfo[] = [
  { id: 'rain', label: 'Rain' },
  { id: 'stream', label: 'Stream' },
  { id: 'ocean', label: 'Ocean waves' },
  { id: 'rapids', label: 'River rapids' },
  { id: 'forest', label: 'Forest' },
  { id: 'birds', label: 'Birds' },
  { id: 'breeze', label: 'Breeze and birds' },
  { id: 'wind', label: 'Soft wind (synth)', kind: 'synth', note: 'Slow gusts of warm wind, made in code.' },
  { id: 'waterfall', label: 'Waterfall (synth)', kind: 'synth', note: 'A steady, soft fall of water, made in code.' },
  { id: 'flute', label: 'Soft flute (synth)', kind: 'synth', note: 'Slow, quiet notes, made in code. Not a real flute.' },
];
