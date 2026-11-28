// Content version of every recorded loop: the first 10 hex digits of the file's SHA-256.
// The loader adds it to the URL (?v=...), so a replaced file is a new URL and a stale copy is never served.
// versions.test.ts fails when a row here and the file in public/samples disagree. Update both together.
export const SAMPLE_REV: Readonly<Record<string, string>> = {
  birds: '7cd810d7c0',
  breeze: '797acb5125',
  chimes: 'd3ac12fa32',
  creek: '3bd4e857e3',
  fire: 'c2e4c618ff',
  forest: '9570e37c21',
  fountain: 'c5960e3b80',
  gong: '0babde6508',
  hum: '71ef723ff8',
  koshi: 'e65f2c8122',
  lightrain: '153a3358c6',
  pebbles: 'fb2922a75e',
  rain: 'ada559df5c',
  storm: '3b1045c974',
  stream: '43b64bead6',
  thunder: '0c1d0c574e',
  trickle: '6749b033d6',
  veranda: 'e9075b8bf5',
  waves: '9cd1141003',
  window: '1fdb9aa77e',
};
