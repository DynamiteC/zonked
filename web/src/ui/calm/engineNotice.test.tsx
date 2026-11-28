// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioEngine, EngineStatus } from '../../audio/types';
import { AUDIO_UNSUPPORTED } from '../../audio/types';
import { createStore } from '../../storage/db';
import { CALM } from './copy';
import { createLocalStorage, saveProfile } from './data';
import { ModeRoot } from './ModeRoot';

function engine() {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  let listener: ((s: EngineStatus) => void) | null = null;
  const eng = {
    status,
    telemetry: { read: () => 0 },
    start: vi.fn(async () => undefined),
    stop: vi.fn(async () => undefined),
    setVoice: vi.fn(),
    getStats: vi.fn(async () => ({ peak: 0, rms: 0, frames: 0, nonZero: 0 })),
    onStatus: (fn: (s: EngineStatus) => void) => {
      listener = fn;
      return () => { listener = null; };
    },
  } as unknown as AudioEngine;
  return { eng, emit: (s: Partial<EngineStatus>) => listener?.({ ...status, ...s }) };
}

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
  saveProfile(createLocalStorage(), { goal: 'calm', timeOfDay: 'night', device: 'wired', extraGentle: false, createdAt: 1_700_000_000_000 });
});
afterEach(() => cleanup());

describe('engine notice', () => {
  it('says nothing while the engine is fine', async () => {
    render(<ModeRoot engine={engine().eng} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    expect(screen.queryByTestId('engine-notice')).toBeNull();
  });

  it('names an unsupported browser in plain words and keeps the app usable', async () => {
    const { eng, emit } = engine();
    render(<ModeRoot engine={eng} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    act(() => emit({ state: 'error', error: AUDIO_UNSUPPORTED }));
    expect(screen.getByTestId('engine-notice').textContent).toBe(CALM.unsupported);
    expect(CALM.unsupported).toBe('This browser cannot play Zonked sound. Try a recent Chrome, Edge, Firefox or Safari.');
    expect(screen.getByTestId('greeting')).toBeTruthy();
    act(() => emit({ state: 'idle' }));
    expect(screen.queryByTestId('engine-notice')).toBeNull();
  });

  it('shows the retry line for any other engine error', async () => {
    const { eng, emit } = engine();
    render(<ModeRoot engine={eng} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    act(() => emit({ state: 'error', error: 'wasm fetch failed: 500' }));
    expect(screen.getByTestId('engine-notice').textContent).toBe(CALM.errorAudio);
  });
});
