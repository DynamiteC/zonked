export interface SampleInfo {
  readonly id: string;
  readonly label: string;
}

/** Order matches docs/SAMPLES-LICENSES.md. Each id has a file samples/<id>.mp3.json. */
export const SAMPLES: readonly SampleInfo[] = [
  { id: 'rain', label: 'Rain' },
  { id: 'stream', label: 'Stream' },
  { id: 'ocean', label: 'Ocean waves' },
  { id: 'rapids', label: 'River rapids' },
  { id: 'forest', label: 'Forest' },
  { id: 'birds', label: 'Birds' },
  { id: 'breeze', label: 'Breeze and birds' },
];
