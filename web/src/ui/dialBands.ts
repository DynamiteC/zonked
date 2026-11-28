import { alertToBeat } from '../catalog/soundMenu';
import { bandForHz, type BandInfo } from '../catalog/bands';
import type { RangeBand } from './shared/RangeField';

/** Plain feelings for each band. No health claims. */
export const BAND_FEEL: Readonly<Record<BandInfo['name'], string>> = {
  Delta: 'deep rest',
  Theta: 'dreamy',
  Alpha: 'relaxed',
  Beta: 'alert',
  Gamma: 'sharp',
};

const STEP = 0.01;

/**
 * Segments of the Calm to Alert track, read from the real mapping (alertToBeat),
 * so each segment is exactly where the pulse changes band. Display only.
 */
export function dialBands(activeName?: string): RangeBand[] {
  const out: { name: BandInfo['name']; from: number; to: number }[] = [];
  for (let i = 0; i <= 100; i += 1) {
    const pos = i * STEP;
    const name = bandForHz(alertToBeat(pos)).name;
    const last = out[out.length - 1];
    if (last && last.name === name) last.to = pos;
    else out.push({ name, from: pos, to: pos });
  }
  return out.map((b, i) => ({
    from: b.from,
    to: i === out.length - 1 ? 1 : (out[i + 1] as { from: number }).from,
    label: b.name,
    active: b.name === activeName,
  }));
}

/** One short line under the dial: band, feeling and pulse speed. */
export function dialMeaning(hz: number): string {
  const b = bandForHz(hz);
  return `${b.name}: ${BAND_FEEL[b.name]}. About ${Math.round(hz)} pulses a second.`;
}

/** Text for screen readers at a dial position. */
export function dialValueText(position: number): string {
  const hz = alertToBeat(position);
  const b = bandForHz(hz);
  return `${Math.round(hz)} hertz, ${b.name}, ${BAND_FEEL[b.name]}`;
}
