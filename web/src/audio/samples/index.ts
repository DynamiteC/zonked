// Lazy nature sample layer. Import this module on first use only.
// Samples loop through their own gain into the engine bus, and the beat path ducks as they rise.
import { getSampleBus } from './bus';
import { createSampleLayer } from './layer';
import type { SampleResult } from './layer';
import type { SampleInfo } from './catalog';

export type { SampleResult, SampleInfo };
export { MAX_SAMPLE_LEVEL, duckGain } from './math';

async function fetchBytes(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`status ${res.status}`);
  return res.arrayBuffer();
}

const layer = createSampleLayer({
  getBus: getSampleBus,
  fetchBytes,
  baseUrl: import.meta.env.BASE_URL,
  origin: typeof location === 'undefined' ? '' : location.href,
});

export const listSamples = (): readonly SampleInfo[] => layer.list();
export const startSample = (id: string, level: number): Promise<SampleResult> => layer.start(id, level);
export const setSampleLevel = (level: number): void => layer.setLevel(level);
export const stopSample = (): void => layer.stop();
export const setBlend = (blend: number): void => layer.setBlend(blend);
export const playingSample = (): string | null => layer.playing();
