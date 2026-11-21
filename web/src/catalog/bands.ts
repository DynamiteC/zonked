/** Sources are short ids S1.. (docs/RESEARCH.md maps each id to its citation and URL; shipped code holds no URLs).
 *  Brainwave band guide. Honest framing: "may support", never a cure. Not a medical device. */

export interface BandInfo {
  readonly name: 'Delta' | 'Theta' | 'Alpha' | 'Beta' | 'Gamma';
  readonly minHz: number;
  readonly maxHz: number;
  readonly mayHelp: string;
  readonly evidence: 'strong' | 'mixed' | 'preliminary' | 'limited';
  readonly note: string;
  readonly sources: readonly string[];
}

const S = {
  garcia: 'S1',
  chaieb: 'S2',
  lane: 'S4',
  zhou: 'S8',
  ingendoh: 'S12',
  goodin: 'S7',
  padma: 'S6',
  mallik: 'S11',
} as const;

const CAVEAT = 'Not a medical device. Results vary and may not happen for you.';

export const BAND_GUIDE: readonly BandInfo[] = [
  { name: 'Delta', minHz: 0.5, maxHz: 4, mayHelp: 'rest and sleep', evidence: 'limited', note: `Little direct research on beats at this range. Steady noise has some sleep studies. ${CAVEAT}`, sources: [S.zhou, S.ingendoh] },
  { name: 'Theta', minHz: 4, maxHz: 8, mayHelp: 'meditation and drowsy calm', evidence: 'preliminary', note: `Small studies only. ${CAVEAT}`, sources: [S.chaieb, S.ingendoh] },
  { name: 'Alpha', minHz: 8, maxHz: 13, mayHelp: 'stress relief and relaxed focus', evidence: 'mixed', note: `Some trials show lower anxiety, others show no effect. ${CAVEAT}`, sources: [S.garcia, S.padma, S.mallik] },
  { name: 'Beta', minHz: 13, maxHz: 30, mayHelp: 'alert focus', evidence: 'mixed', note: `One small study saw better vigilance, another saw no change. ${CAVEAT}`, sources: [S.lane, S.goodin, S.garcia] },
  { name: 'Gamma', minHz: 30, maxHz: 40, mayHelp: 'alert attention (experimental)', evidence: 'limited', note: `Very little evidence. Keep sessions short and volume low. ${CAVEAT}`, sources: [S.chaieb, S.ingendoh] },
];

/** Band for a beat frequency. Out of range and NaN clamp to the nearest band. */
export function bandForHz(hz: number): BandInfo {
  const h = Number.isFinite(hz) ? hz : 0;
  const hit = BAND_GUIDE.find((b) => h >= b.minHz && h < b.maxHz);
  return hit ?? ((h >= 40 ? BAND_GUIDE[4] : BAND_GUIDE[0]) as BandInfo);
}
