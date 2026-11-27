// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioEngine, EngineStatus } from '../../audio/types';
import { templateToEvents } from '../../catalog';
import { PARAM_COUNT, SLOT, voiceToParams } from '../../audio/params';
import { TEMPLATES } from '../../catalog';
import { createStore } from '../../storage/db';
import { BREATHE_ID, BREATHE_TEMPLATE, hasBeat } from './breathe';
import { CALM } from './copy';
import { BREATHE_PLAN, ResetScreen } from './ResetScreen';
import { SafetyNotice } from './SafetyNotice';
import { useCalmSession } from './useCalmSession';

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

const store = createStore(undefined);

function Harness({ eng, still }: { eng: AudioEngine; still: boolean }): React.JSX.Element {
  const s = useCalmSession(eng, undefined, store);
  return (
    <>
      <ResetScreen s={s} still={still} theme="dark" announce onBack={() => undefined} plan={BREATHE_PLAN} />
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

describe('breathing sound', () => {
  it('has no beat voice: beat and carrier sit at the engine floor and soft noise carries the sound', () => {
    expect(hasBeat(BREATHE_TEMPLATE)).toBe(false);
    const events = templateToEvents(BREATHE_TEMPLATE);
    for (const e of events) {
      expect(e.voice.beatHz).toBe(0.5);
      expect(e.voice.carrierHz).toBe(20);
      expect(e.voice.noise).toBe('pink');
      expect(e.voice.beatLevel).toBe(0);
      expect(voiceToParams(e.voice, 1, new Float32Array(PARAM_COUNT))[SLOT.beatLevel]).toBe(0);
      expect(e.voice.gain).toBeLessThanOrEqual(0.85);
      expect(e.voice.layers?.instLevel ?? 0).toBe(0);
    }
    for (const t of TEMPLATES) for (const e of templateToEvents(t)) expect(e.voice.beatLevel).toBeUndefined();
    expect(BREATHE_TEMPLATE.tags).toContain('no-beat');
    expect(BREATHE_TEMPLATE.recommendedMinutes).toBe(5);
    expect(BREATHE_TEMPLATE.breath).toEqual({ inSec: 4, outSec: 4 });
  });
});

describe('breathing session screen', () => {
  beforeEach(() => {
    localStorage.clear();
    HTMLCanvasElement.prototype.getContext = (() => null) as never;
    vi.useFakeTimers();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('states the honest line, waits for the safety notice, plays no beat voice, and shows a text counter under reduced motion', async () => {
    const eng = engine();
    render(<Harness eng={eng} still />);
    expect(screen.getByText(CALM.breatheIntro)).toBeTruthy();
    expect(CALM.breatheIntro.startsWith('Many people find slow breathing calming.')).toBe(true);
    fireEvent.click(screen.getByTestId('reset-begin'));
    await flush(50);
    expect(eng.start).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByTestId('calm-safety-accept')));
    await flush();
    expect(eng.start).toHaveBeenCalledTimes(1);
    const voice = eng.start.mock.calls[0]?.[0] as { beatHz: number; noise: string; beatLevel?: number };
    expect(voice.beatHz).toBe(0.5);
    expect(voice.beatLevel).toBe(0);
    expect(voice.noise).toBe('pink');
    expect(screen.getByTestId('breath-counter')).toBeTruthy();
    expect(screen.getByTestId('reset-left').textContent).toBe('5:00 left');
    expect(document.querySelector('[data-kind="breathe"]')).toBeTruthy();
    expect(BREATHE_ID).toBe('calm-breathe-5');
  });

  it('ends after 5 minutes with a calm line and no pressure words', async () => {
    const eng = engine();
    render(<Harness eng={eng} still={false} />);
    fireEvent.click(screen.getByTestId('reset-begin'));
    await act(async () => fireEvent.click(screen.getByTestId('calm-safety-accept')));
    await flush();
    await flush(5 * 60_000 + 2000);
    expect(screen.getByTestId('reset-end').textContent).toContain(CALM.breatheDoneLine);
    expect(document.body.textContent).not.toMatch(/streak|tomorrow|missed/i);
  });
});
