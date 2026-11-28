// @vitest-environment jsdom
// MOCKED: the audio engine is a stub in this file. Real output is read by verify:e2e (web/scripts/e2e-core-checks.mjs).
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioEngine, EngineStatus } from '../../audio/types';
import { SAFETY_KEY } from '../../storage/prefs';
import { createStore } from '../../storage/db';
import { createLocalStorage, saveProfile } from './data';
import type { Profile } from './data';
import { CALM } from './copy';
import { ChoiceGrid } from './ChoiceGrid';
import { ModeRoot } from './ModeRoot';
import { TimerChips } from './TimerChips';
import { SafetyNotice } from './SafetyNotice';
import type { Player } from '../../app/player';
import type { TimerState } from '../../app/timers';

function engine(): AudioEngine {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  return {
    status, telemetry: { read: () => 0 },
    start: vi.fn(async () => void (status.state = 'running')),
    stop: vi.fn(async () => void (status.state = 'stopped')),
    setVoice: vi.fn(), getStats: vi.fn(async () => ({ peak: 0, rms: 0, frames: 0, nonZero: 0 })), onStatus: () => () => undefined,
  } as unknown as AudioEngine;
}
const PROFILE: Profile = { goal: 'sleep', timeOfDay: 'night', device: 'wired', extraGentle: false, createdAt: 1_700_000_000_000 };
const player = { startTimer: vi.fn(), stopTimer: vi.fn() } as unknown as Player;
const timer = (t: Partial<TimerState> & { kind: TimerState['kind'] }): TimerState => ({ running: true, remainingSec: 60, totalSec: 900, ...t }) as unknown as TimerState;

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(cleanup);

describe('walk 2 fixes', () => {
  it('timer chips expose the active chip with aria-pressed', () => {
    render(<TimerChips timer={timer({ kind: 'countdown', totalSec: 1800 })} player={player} />);
    const on = screen.getAllByRole('button').filter((b) => b.getAttribute('aria-pressed') === 'true');
    expect(on.map((b) => b.textContent)).toEqual(['30 min']);
  });

  it('timer chips mark Sleep fade when it runs', () => {
    render(<TimerChips timer={timer({ kind: 'sleep-fade' })} player={player} />);
    expect(screen.getByRole('button', { name: 'Sleep fade' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('a radio choice has one name and its visible text is hidden from the tree', () => {
    render(<ChoiceGrid legend="Pick" options={[{ value: 'a', label: 'Alpha one' }]} value="a" onChange={() => undefined} />);
    expect(screen.getByRole('radio', { name: 'Alpha one' })).toBeTruthy();
    expect(screen.getByText('Alpha one').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('the safety notice states the numeric limits and keeps every plain line', () => {
    render(<SafetyNotice onAccept={() => undefined} />);
    const t = screen.getByTestId('safety-limits').textContent ?? '';
    expect(t).toMatch(/20 to 1500 Hz/);
    expect(t).toMatch(/40 Hz/);
    expect(t).toMatch(/capped/);
    for (const l of CALM.safetyLines) expect(screen.getByText(l)).toBeTruthy();
  });

  it('Skip sits in the footer slot where Back sits on later steps', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    const skip = await screen.findByRole('button', { name: CALM.skip });
    expect(skip.parentElement?.className).toContain('c-foot');
    expect(skip.parentElement?.firstElementChild).toBe(skip);
  });

  it('the mini player is hidden on the Crew screen and shown elsewhere', async () => {
    saveProfile(createLocalStorage(), PROFILE);
    localStorage.setItem(SAFETY_KEY, '1');
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await act(async () => fireEvent.click(await screen.findByTestId('today-play')));
    const nav = screen.getByRole('navigation', { name: 'Main' });
    fireEvent.click(within(nav).getByRole('button', { name: CALM.nav[0] }));
    expect(screen.queryByRole('group', { name: 'Now playing' })).not.toBeNull();
    fireEvent.click(within(nav).getByRole('button', { name: CALM.nav[2] }));
    expect(screen.queryByRole('group', { name: 'Now playing' })).toBeNull();
  });
});
