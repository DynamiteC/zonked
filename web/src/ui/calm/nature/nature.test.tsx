// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SAMPLES } from '../../../audio/samples/catalog';
import type { AudioEngine, EngineStatus } from '../../../audio/types';
import { SAFETY_KEY } from '../../../storage/prefs';
import { createStore } from '../../../storage/db';
import { createLocalStorage, saveProfile } from '../data';
import type { Profile } from '../data';
import { CALM } from '../copy';
import { ModeRoot } from '../ModeRoot';
import credits from './credits.json';
import { NATURE_KEY } from './prefs';
import { listOwn } from './ownStore';

const m = vi.hoisted(() => ({
  startSample: vi.fn(async () => ({ ok: true as const })),
  setBlend: vi.fn(),
  setSampleLevel: vi.fn(),
  stopSample: vi.fn(),
  startOwn: vi.fn(async () => ({ ok: true as const })),
  listSamples: () => [
    { id: 'rain', label: 'Rain' },
    { id: 'stream', label: 'Stream' },
  ],
}));
vi.mock('../../../audio/samples', () => m);

function engine(): AudioEngine & { start: ReturnType<typeof vi.fn> } {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  return {
    status,
    telemetry: { read: () => 0 },
    start: vi.fn(async () => void (status.state = 'running')),
    stop: vi.fn(async () => void (status.state = 'stopped')),
    setVoice: vi.fn(),
    getStats: vi.fn(async () => ({ peak: 0, rms: 0, frames: 0, nonZero: 0 })),
    onStatus: () => () => undefined,
  } as unknown as AudioEngine & { start: ReturnType<typeof vi.fn> };
}

const PROFILE: Profile = { goal: 'sleep', timeOfDay: 'night', device: 'headphones', extraGentle: false, createdAt: 1_700_000_000_000 };

async function openNature(eng: AudioEngine): Promise<void> {
  render(<ModeRoot engine={eng} store={createStore(undefined)} />);
  await screen.findByTestId('greeting');
  fireEvent.click(screen.getByRole('button', { name: CALM.nav[2] }));
  fireEvent.click(await screen.findByTestId('open-nature'));
  await screen.findByTestId('nature-rain');
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  saveProfile(createLocalStorage(), PROFILE);
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(() => cleanup());

describe('nature sounds', () => {
  it('plays nothing before the safety notice, then starts after accept', async () => {
    const eng = engine();
    await openNature(eng);
    fireEvent.click(screen.getByTestId('nature-rain'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(eng.start).not.toHaveBeenCalled();
    expect(m.startSample).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByTestId('calm-safety-accept')));
    await waitFor(() => expect(m.startSample).toHaveBeenCalledWith('rain', 0.4));
    expect(eng.start).toHaveBeenCalledTimes(1);
    expect(m.setBlend).toHaveBeenCalledWith(0.3);
  });

  it('wires the blend slider to setBlend and caps the level at the master cap', async () => {
    localStorage.setItem(SAFETY_KEY, '1');
    await openNature(engine());
    fireEvent.click(screen.getByTestId('nature-rain'));
    await waitFor(() => expect(m.startSample).toHaveBeenCalled());
    const blend = screen.getByLabelText(CALM.natureBlend) as HTMLInputElement;
    fireEvent.change(blend, { target: { value: '0.8' } });
    await waitFor(() => expect(m.setBlend).toHaveBeenLastCalledWith(0.8));
    const level = screen.getByLabelText(CALM.natureLevel) as HTMLInputElement;
    expect(Number(level.max)).toBe(0.85);
    fireEvent.change(level, { target: { value: '0.85' } });
    await waitFor(() => expect(m.setSampleLevel).toHaveBeenLastCalledWith(0.85));
  });

  it('remembers the choice on this device under the zonked prefix', async () => {
    localStorage.setItem(SAFETY_KEY, '1');
    await openNature(engine());
    fireEvent.click(screen.getByTestId('nature-rain'));
    await waitFor(() => expect(localStorage.getItem(NATURE_KEY)).toContain('"id":"rain"'));
    expect(NATURE_KEY.startsWith('zonked.')).toBe(true);
  });

  it('shows author and licence from shipped data, with no link', async () => {
    localStorage.setItem(SAFETY_KEY, '1');
    await openNature(engine());
    fireEvent.click(screen.getByRole('button', { name: `${CALM.natureCredits}: Rain` }));
    const box = await screen.findByTestId('credit-rain');
    expect(box.textContent).toMatch(/ezwa/);
    expect(box.textContent).toMatch(/Public domain/);
    expect(box.querySelector('a')).toBeNull();
    expect(screen.getAllByText(CALM.natureFree).length).toBeGreaterThan(1);
  });

  it('keeps honest copy: no medical claims', async () => {
    await openNature(engine());
    expect(document.body.textContent).toMatch(/not a medical device/);
    expect(document.body.textContent).not.toMatch(/\b(cure|treat|heal|therapy)\b/i);
  });

  it('adds nature from the player in one tap', async () => {
    localStorage.setItem(SAFETY_KEY, '1');
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    fireEvent.click(await screen.findByTestId('today-play'));
    fireEvent.click(await screen.findByTestId('player-nature'));
    await waitFor(() => expect(m.startSample).toHaveBeenCalledWith('rain', 0.4));
  });

  it('has a credit row for every shipped sample', () => {
    for (const s of SAMPLES.filter((x) => x.kind !== 'synth')) expect(credits.some((c) => c.id === s.id), s.id).toBe(true);
  });
});

describe('my sounds screen', () => {
  it('states that files stay on the device and must be owned', async () => {
    await openNature(engine());
    expect((await screen.findByTestId('mine-stays')).textContent).toBe(CALM.mineStays);
    expect(screen.getByTestId('my-sounds').textContent).toMatch(/own or have the right to use/);
  });

  it('shows a plain message for a file that cannot be decoded, and stores nothing', async () => {
    await openNature(engine());
    const input = (await screen.findByTestId('mine-file')) as HTMLInputElement;
    const file = new File([new Uint8Array(64)], 'not-audio.mp3', { type: 'audio/mpeg' });
    await act(async () => fireEvent.change(input, { target: { files: [file] } }));
    await waitFor(() => expect(screen.getByTestId('mine-status').textContent).toMatch(/not a sound this browser can read/));
    const list = await listOwn();
    expect(list.ok && list.value.length).toBe(0);
  });

  it('rejects a file over 8 MB before reading it', async () => {
    await openNature(engine());
    const input = (await screen.findByTestId('mine-file')) as HTMLInputElement;
    const big = new File([new Uint8Array(8 * 1024 * 1024 + 1)], 'big.wav', { type: 'audio/wav' });
    await act(async () => fireEvent.change(input, { target: { files: [big] } }));
    await waitFor(() => expect(screen.getByTestId('mine-status').textContent).toMatch(/bigger than 8 MB/));
  });
});
