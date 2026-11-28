// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioEngine, EngineStatus } from '../../audio/types';
import { createStore } from '../../storage/db';
import { defaultTimer } from './CalmApp';
import { CALM } from './copy';
import { DEFAULT_PROFILE } from './data';
import type { Profile } from './data';
import { ModeRoot } from './ModeRoot';
import { CLEAR_MARGIN, clearPick, pickStarters } from './StarterStep';

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

const click = (name: RegExp | string): void => void fireEvent.click(screen.getByRole('button', { name }));
const CLEAR: Profile = { ...DEFAULT_PROFILE, goal: 'focus', timeOfDay: 'morning', device: 'speakers' };

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(() => cleanup());

describe('clear pick', () => {
  it('is null when the first two families are close, and the first pick when it leads by the margin', () => {
    expect(clearPick({ ...DEFAULT_PROFILE, goal: 'curious' }, new Date(2026, 0, 5, 9))).toBeNull();
    const pick = clearPick(CLEAR, new Date(2026, 0, 5, 9));
    const [a, b] = pickStarters(CLEAR, new Date(2026, 0, 5, 9));
    expect(pick?.template.id).toBe(a?.template.id);
    expect((a?.score ?? 0) - (b?.score ?? 0)).toBeGreaterThanOrEqual(CLEAR_MARGIN);
  });
});

describe('default timer', () => {
  it('uses Sleep fade for the Sleep goal, over the sound length, and a countdown otherwise', () => {
    expect(defaultTimer('sleep', 45)).toEqual({ kind: 'sleep-fade', minutes: 45 });
    expect(defaultTimer('sleep', 5)).toEqual({ kind: 'sleep-fade', minutes: 20 });
    expect(defaultTimer('focus', 25)).toEqual({ kind: 'countdown', minutes: 25 });
    expect(defaultTimer('sleep', null)).toBeNull();
  });
});

describe('starter step', () => {
  it('labels the preview Hear 10 s', () => {
    expect(CALM.preview).toBe('Hear 10 s');
  });

  it('skips the starter screen on a clear pick but keeps the safety notice first', async () => {
    const eng = engine();
    render(<ModeRoot engine={eng} store={createStore(undefined)} />);
    await screen.findByText(CALM.goalTitle, { selector: 'h1' });
    fireEvent.click(screen.getByLabelText(/^Focus/));
    click(CALM.next);
    fireEvent.click(screen.getByLabelText(/^Morning/));
    click(CALM.next);
    fireEvent.click(screen.getByLabelText(/^Speakers/));
    click(CALM.next);
    expect(screen.getByText(CALM.safetyTitle)).toBeTruthy();
    expect(eng.start).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByTestId('calm-safety-accept')));
    expect(screen.queryByText(CALM.starterTitle)).toBeNull();
    await screen.findByTestId('player-toggle');
    expect(eng.start).toHaveBeenCalledTimes(1);
  });
});
