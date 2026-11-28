// Lazy nature sample layer. Import this module on first use only.
// Samples loop through their own gain into the engine bus, and the beat path ducks as they rise.
import { getSampleBus } from './bus';
import { prepareOwn } from './own';
import { createSampleLayer } from './layer';
import type { SampleResult } from './layer';
import type { SampleInfo } from './catalog';
import { dropOldSampleCaches } from './cacheName';

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

dropOldSampleCaches();

export const listSamples = (): readonly SampleInfo[] => layer.list();
export const startSample = (id: string, level: number): Promise<SampleResult> => layer.start(id, level);
export const setSampleLevel = (level: number): void => layer.setLevel(level);
export const stopSample = (): void => layer.stop();
export const setBlend = (blend: number): void => layer.setBlend(blend);
export const playingSample = (): string | null => layer.playing();

/** Decodes and plays a person's own sound from bytes held on this device. Never throws. */
export async function startOwn(id: string, bytes: ArrayBuffer, level: number): Promise<SampleResult> {
  const bus = getSampleBus();
  if (bus === null) return { ok: false, error: 'start the sound first' };
  try {
    const decoded = await bus.ctx.decodeAudioData(bytes.slice(0));
    const channels = Array.from({ length: decoded.numberOfChannels }, (_, c) => decoded.getChannelData(c));
    const prep = prepareOwn(channels, decoded.sampleRate);
    if (!prep.ok) return prep;
    const buf = bus.ctx.createBuffer(1, prep.data.length, decoded.sampleRate);
    buf.getChannelData(0).set(prep.data);
    return layer.startBuffer(id, buf, level, prep.loop);
  } catch {
    return { ok: false, error: 'This file could not be played.' };
  }
}
