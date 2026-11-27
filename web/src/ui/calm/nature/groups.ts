export const NATURE_GROUPS = ['Water', 'Rain', 'Wind and birds', 'Fire and bells', 'Made in code'] as const;
export type NatureGroup = (typeof NATURE_GROUPS)[number];

const RAIN = new Set(['rain', 'lightrain', 'thunder', 'veranda', 'window', 'storm']);
const WIND = new Set(['forest', 'birds', 'breeze', 'hum']);
const FIRE = new Set(['fire', 'chimes', 'koshi', 'gong']);

/** Which picker group a sound sits in. Made-in-code sounds are one group, whatever they imitate. */
export function groupOf(s: { readonly id: string; readonly kind?: string }): NatureGroup {
  if (s.kind === 'synth') return 'Made in code';
  if (RAIN.has(s.id)) return 'Rain';
  if (WIND.has(s.id)) return 'Wind and birds';
  if (FIRE.has(s.id)) return 'Fire and bells';
  return 'Water';
}
