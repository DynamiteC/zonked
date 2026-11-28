// @vitest-environment jsdom
import { act, cleanup, configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioEngine, EngineStatus } from '../../audio/types';
import { SAFETY_KEY } from '../../storage/prefs';
import { createStore } from '../../storage/db';
import { createLocalStorage, saveProfile } from './data';
import type { Profile } from './data';
import { CALM } from './copy';
import { GUIDE_KEY } from './Guide';
import { ModeRoot } from './ModeRoot';

function engine(): AudioEngine {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  return {
    status,
    telemetry: { read: () => 0 },
    start: vi.fn(async () => void (status.state = 'running')),
    stop: vi.fn(async () => void (status.state = 'stopped')),
    setVoice: vi.fn(),
    getStats: vi.fn(async () => ({ peak: 0, rms: 0, frames: 0, nonZero: 0 })),
    onStatus: () => () => undefined,
  } as unknown as AudioEngine;
}

const PROFILE: Profile = { goal: 'sleep', timeOfDay: 'night', device: 'wired', extraGentle: false, createdAt: 1_700_000_000_000 };

configure({ asyncUtilTimeout: 15000 });
vi.setConfig({ testTimeout: 30000 });

beforeEach(() => {
  localStorage.clear();
  saveProfile(createLocalStorage(), PROFILE);
  localStorage.setItem(SAFETY_KEY, '1');
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(() => cleanup());

async function openPlayer(): Promise<void> {
  render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
  const play = await screen.findByTestId('today-play');
  await act(async () => fireEvent.click(play));
  await screen.findByTestId('player-toggle');
}

describe('player: options only when needed', () => {
  it('shows name, time, one Stop and an Options button, and nothing else', async () => {
    await openPlayer();
    expect(screen.getByTestId('player-options')).toBeTruthy();
    expect(screen.queryByText(CALM.volumeCapped)).toBeNull();
    expect(screen.queryByText(CALM.favorite)).toBeNull();
    expect(screen.queryByText('Sleep fade')).toBeNull();
    expect(screen.queryByTestId('options-sheet')).toBeNull();
    expect(document.querySelectorAll('.c-player .c-primary')).toHaveLength(1);
  });

  it('opens a sheet with Timer, Nature sound and More, and keeps the volume note there', async () => {
    await openPlayer();
    fireEvent.click(screen.getByTestId('player-options'));
    const sheet = await screen.findByTestId('options-sheet');
    for (const h of [CALM.optTimer, CALM.optNature, CALM.optMore]) expect(sheet.textContent).toContain(h);
    expect(sheet.textContent).toContain(CALM.volumeCapped);
    expect(screen.getByRole('button', { name: 'Sleep fade' })).toBeTruthy();
    expect(screen.getByLabelText(CALM.natureBlend)).toBeTruthy();
    expect(screen.queryByLabelText(CALM.natureLevel)).toBeNull();
    const labels = Array.from(sheet.querySelectorAll('[data-testid="rf-tick"]')).map((n) => n.textContent);
    expect(labels).toEqual(['More beats', 'Even', 'More nature']);
    const chip = screen.getByRole('button', { name: 'Sleep fade' });
    fireEvent.click(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
  });

  it('closes on Escape and returns focus to Options', async () => {
    await openPlayer();
    const opener = screen.getByTestId('player-options');
    fireEvent.click(opener);
    fireEvent.keyDown(await screen.findByTestId('options-sheet'), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByTestId('options-sheet')).toBeNull());
    expect(document.activeElement).toBe(opener);
  });
});

describe('help guide', () => {
  it('opens from Today, has Skip and Done on every card, and is never shown again once done', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    fireEvent.click(await screen.findByTestId('today-guide'));
    for (let n = 0; n < 3; n += 1) {
      const g = await screen.findByTestId('guide');
      expect(g.textContent).toContain(CALM.guideCards[n]?.title ?? '');
      expect(screen.getByTestId('guide-skip')).toBeTruthy();
      expect(screen.getAllByRole('button', { name: CALM.guideDone }).length).toBeGreaterThan(0);
      if (n < 2) fireEvent.click(screen.getByTestId('guide-next'));
    }
    fireEvent.click(screen.getByTestId('guide-next'));
    expect(screen.queryByTestId('guide')).toBeNull();
    expect(localStorage.getItem(GUIDE_KEY)).toBe('1');
    fireEvent.click(screen.getByTestId('today-guide'));
    expect(await screen.findByTestId('guide')).toBeTruthy();
  });

  it('closes on Escape and counts as done, with motion off too', async () => {
    localStorage.setItem('zonked.motion', 'off');
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    fireEvent.click(await screen.findByTestId('today-guide'));
    fireEvent.keyDown(await screen.findByTestId('guide'), { key: 'Escape' });
    expect(screen.queryByTestId('guide')).toBeNull();
    expect(localStorage.getItem(GUIDE_KEY)).toBe('1');
  });

  it('uses no pressure words', () => {
    const text = JSON.stringify(CALM.guideCards);
    expect(text).not.toMatch(/\b(hurry|now|must|don't miss|last chance|urgent)\b/i);
  });
});

describe('Advanced section', () => {
  it('is closed by default and loads its panels only when opened', async () => {
    await openPlayer();
    fireEvent.click(screen.getByTestId('player-options'));
    const btn = await screen.findByTestId('options-advanced');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByTestId('advanced-panels')).toBeNull();
    fireEvent.click(btn);
    expect(await screen.findByTestId('advanced-panels')).toBeTruthy();
  });

  it('Alt+Shift+S opens the Player with Options showing Advanced', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('today-play');
    fireEvent.keyDown(window, { altKey: true, shiftKey: true, code: 'KeyS' });
    expect(await screen.findByTestId('options-sheet')).toBeTruthy();
    expect((await screen.findByTestId('options-advanced')).getAttribute('aria-expanded')).toBe('true');
    expect(await screen.findByTestId('advanced-panels')).toBeTruthy();
  });
});
