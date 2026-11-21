import { clickMore } from './moreTestUtil';
// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioEngine, EngineStatus } from '../audio/types';
import { App } from '../app/App';
import { installE2E } from '../app/e2e';
import { createStore } from '../storage/db';
import { SAFETY_KEY } from '../storage/prefs';
import { QUICKSTART_KEY } from './QuickStart';
import type { EventSourceLike } from './bridgeClient';
import { Pacer } from './Pacer';

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

class FakeES implements EventSourceLike {
  ls = new Map<string, (e: { data?: unknown }) => void>();
  addEventListener(t: string, l: (e: { data?: unknown }) => void): void {
    this.ls.set(t, l);
  }
  close(): void {}
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(QUICKSTART_KEY, '1');
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(() => cleanup());

describe('App', () => {
  it('requires the safety gate before first playback and remembers acceptance', async () => {
    const eng = engine();
    render(<App engine={eng} store={createStore(undefined)} bridgeCreate={() => null} />);
    fireEvent.click(screen.getByTestId('play-button'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(eng.start).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByTestId('safety-accept')));
    expect(eng.start).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(SAFETY_KEY)).toBe('1');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('skips the gate once accepted and toggles with Space', async () => {
    localStorage.setItem(SAFETY_KEY, '1');
    const eng = engine();
    render(<App engine={eng} store={createStore(undefined)} bridgeCreate={() => null} />);
    await act(async () => void fireEvent.keyDown(window, { key: ' ' }));
    expect(eng.start).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('play-button').textContent).toBe('Stop');
  });

  it('shows Standalone with no bridge and Crew Synced when connected', async () => {
    const es = new FakeES();
    render(<App engine={engine()} store={createStore(undefined)} bridgeCreate={() => es} />);
    expect(screen.getByTestId('crew-badge').textContent).toBe('Standalone');
    act(() => es.ls.get('open')?.({}));
    expect(screen.getByTestId('crew-badge').textContent).toBe('Crew Synced');
    act(() =>
      es.ls.get('state')?.({
        data: JSON.stringify({
          version: 1,
          at: 1,
          burnout: { score: 77, level: 'recovery' },
          target: { beatHz: 6, carrierHz: 180, gain: 0.3, transitionSec: 10, breathe: true },
          sbg: null,
        }),
      }),
    );
    expect(screen.getByTestId('burnout-meter').getAttribute('aria-valuenow')).toBe('77');
    expect(screen.getByTestId('pacer')).toBeTruthy();
    act(() => es.ls.get('error')?.({}));
    expect(screen.getByTestId('crew-badge').textContent).toBe('Standalone');
  });

  it('changes preset and shows Hz readouts', () => {
    render(<App engine={engine()} store={createStore(undefined)} bridgeCreate={() => null} />);
    expect(screen.getByTestId('hz-left').textContent).toBe('180.00 Hz');
    fireEvent.change(screen.getByTestId('preset-select'), { target: { value: 'flow-state' } });
    expect(screen.getByTestId('hz-left').textContent).toBe('211.00 Hz');
    expect(screen.getByTestId('hz-right').textContent).toBe('229.00 Hz');
  });

  it('opens the editor with line-numbered diagnostics and toggles breathing', async () => {
    render(<App engine={engine()} store={createStore(undefined)} bridgeCreate={() => null} />);
    clickMore('editor-toggle');
    fireEvent.change(await screen.findByTestId('editor-text'), { target: { value: 'ok: 200+10\n00:00:00 ok\n@@@ bad\n' } });
    expect(screen.getByTestId('diagnostics').textContent).toMatch(/Line \d+:/);
    fireEvent.click(screen.getByTestId('breathe-toggle'));
    expect(screen.getByTestId('pacer-text').textContent).toBe('Breathe In');
  });

  it('exposes engine status text', () => {
    render(<App engine={engine()} store={createStore(undefined)} bridgeCreate={() => null} />);
    expect(screen.getByTestId('engine-status').textContent).toBe('idle');
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByRole('banner')).toBeTruthy();
  });
});

describe('Pacer', () => {
  it('alternates Breathe In and Breathe Out', () => {
    vi.useFakeTimers();
    render(<Pacer inSec={2} outSec={2} reduced={false} />);
    expect(screen.getByTestId('pacer-text').textContent).toBe('Breathe In');
    act(() => void vi.advanceTimersByTime(2100));
    expect(screen.getByTestId('pacer-text').textContent).toBe('Breathe Out');
    vi.useRealTimers();
  });
  it('shows text only under reduced motion', () => {
    const { container } = render(<Pacer inSec={2} outSec={2} reduced />);
    expect(container.querySelector('svg')).toBeNull();
    expect(screen.getByTestId('pacer-text')).toBeTruthy();
  });
});

describe('e2e hook', () => {
  it('installs only with ?e2e=1', () => {
    const eng = engine();
    const w = (search: string) => ({ location: { search } }) as unknown as Window;
    const off = w('');
    expect(installE2E(off, eng, () => 'x')).toBe(false);
    expect(off.__zonked).toBeUndefined();
    const on = w('?e2e=1');
    expect(installE2E(on, eng, () => 'deep-focus')).toBe(true);
    expect(on.__zonked?.presetId).toBe('deep-focus');
    expect(on.__zonked?.status.state).toBe('idle');
  });
});
