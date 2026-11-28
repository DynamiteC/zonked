// @vitest-environment jsdom
// MOCKED: the audio engine is a stub in this file. Real output is read by verify:e2e (web/scripts/e2e-core-checks.mjs).
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioEngine, EngineStatus } from '../../audio/types';
import { createStore } from '../../storage/db';
import { SAFETY_KEY } from '../../storage/prefs';
import { BreathLive } from './BreathLive';
import { CALM } from './copy';
import { Stage } from './PlayerScreen';
import { RESET_SECONDS, ResetScreen } from './ResetScreen';
import { SafetyNotice } from './SafetyNotice';
import { useCalmSession } from './useCalmSession';

function engine(): AudioEngine & { start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> } {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  return {
    status,
    telemetry: { read: () => 0 },
    start: vi.fn(async () => void (status.state = 'running')),
    stop: vi.fn(async () => void (status.state = 'stopped')),
    setVoice: vi.fn(),
    getStats: vi.fn(async () => ({ peak: 0, rms: 0, frames: 0, nonZero: 0 })),
    onStatus: () => () => undefined,
  } as unknown as AudioEngine & { start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> };
}

const store = createStore(undefined);

function Harness({ eng, announce = true }: { eng: AudioEngine; announce?: boolean }): React.JSX.Element {
  const s = useCalmSession(eng, undefined, store);
  return (
    <>
      <ResetScreen s={s} still={false} theme="dark" announce={announce} onBack={() => undefined} />
      {s.gate && <SafetyNotice onAccept={s.accept} onCancel={s.cancelGate} />}
    </>
  );
}

const flush = async (ms = 0): Promise<void> => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
    await Promise.resolve();
  });
};

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('guided 90 second reset', () => {
  it('plays no sound before the safety notice is accepted', async () => {
    const eng = engine();
    render(<Harness eng={eng} />);
    fireEvent.click(screen.getByTestId('reset-begin'));
    await flush(50);
    expect(eng.start).not.toHaveBeenCalled();
    expect(screen.getByTestId('reset-begin')).toBeTruthy();
    await act(async () => fireEvent.click(screen.getByTestId('calm-safety-accept')));
    await flush();
    expect(localStorage.getItem(SAFETY_KEY)).toBe('1');
    expect(eng.start).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('reset-stop')).toBeTruthy();
  });

  it('runs 90 seconds, keeps Stop visible, then shows the end card and stops the sound', async () => {
    localStorage.setItem(SAFETY_KEY, '1');
    const eng = engine();
    render(<Harness eng={eng} />);
    await act(async () => fireEvent.click(screen.getByTestId('reset-begin')));
    await flush();
    expect(eng.start).toHaveBeenCalledTimes(1);
    await flush((RESET_SECONDS - 2) * 1000);
    expect(screen.getByTestId('reset-stop')).toBeTruthy();
    expect(screen.queryByTestId('reset-end')).toBeNull();
    expect(eng.stop).not.toHaveBeenCalled();
    await flush(3000);
    expect(screen.getByTestId('reset-end')).toBeTruthy();
    expect(screen.getByText(CALM.resetDoneLine)).toBeTruthy();
    expect(eng.stop).toHaveBeenCalledTimes(1);
  });

  it('Stop ends the sound at once and returns to the start state', async () => {
    localStorage.setItem(SAFETY_KEY, '1');
    const eng = engine();
    render(<Harness eng={eng} />);
    await act(async () => fireEvent.click(screen.getByTestId('reset-begin')));
    await flush();
    await act(async () => fireEvent.click(screen.getByTestId('reset-stop')));
    await flush();
    expect(eng.stop).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('reset-begin')).toBeTruthy();
    await flush(RESET_SECONDS * 1000);
    expect(screen.queryByTestId('reset-end')).toBeNull();
  });

  it('leaving the screen mid-pause stops the sound', async () => {
    localStorage.setItem(SAFETY_KEY, '1');
    const eng = engine();
    const view = render(<Harness eng={eng} />);
    await act(async () => fireEvent.click(screen.getByTestId('reset-begin')));
    await flush();
    view.unmount();
    await flush();
    expect(eng.stop).toHaveBeenCalledTimes(1);
  });
});

describe('screen reader breath', () => {
  it('the live region keeps the same text until the phase changes', () => {
    const view = render(<BreathLive label="Breathe in" on announce />);
    expect(screen.getByTestId('breath-live').textContent).toBe('Breathe in');
    view.rerender(<BreathLive label="Breathe in" on announce />);
    expect(screen.getByTestId('breath-live').textContent).toBe('Breathe in');
    view.rerender(<BreathLive label="Breathe out" on announce />);
    expect(screen.getByTestId('breath-live').textContent).toBe('Breathe out');
  });

  it('stays silent when turned off or when not playing', () => {
    const view = render(<BreathLive label="Breathe in" on announce={false} />);
    expect(screen.getByTestId('breath-live').textContent).toBe('');
    view.rerender(<BreathLive label="Breathe in" on={false} announce />);
    expect(screen.getByTestId('breath-live').textContent).toBe('');
  });

  it('reduced motion shows a text counter and speaks only on the phase change', async () => {
    render(<Stage still playing situation="calm" theme="dark" level={0} />);
    const counter = (): string => screen.getByTestId('breath-counter').textContent ?? '';
    const spoken = (): string => screen.getByTestId('breath-live').textContent ?? '';
    expect(counter()).toBe('Breathe in, 4');
    const seen = new Set<string>();
    for (let i = 0; i < 3; i += 1) {
      await flush(1000);
      seen.add(spoken());
      expect(counter()).toBe(`Breathe in, ${3 - i}`);
    }
    expect([...seen]).toEqual(['Breathe in']);
    await flush(1000);
    expect(counter()).toBe('Breathe out, 4');
    expect(spoken()).toBe('Breathe out');
  });
});
