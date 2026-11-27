// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioEngine, EngineStatus } from '../../audio/types';
import { MOTION_KEY, SAFETY_KEY } from '../../storage/prefs';
import { createStore } from '../../storage/db';
import { JOURNEYS, createLocalStorage, saveProfile, weekStats } from './data';
import type { Profile } from './data';
import { MODE_KEY, readMode } from './mode';
import { ModeRoot } from './ModeRoot';
import { BreathRing } from './PlayerScreen';
import { WeekDots, weekText } from './WeekDots';
import { CALM, greeting } from './copy';

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
const click = (name: RegExp | string): void => void fireEvent.click(screen.getByRole('button', { name }));

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(() => cleanup());

describe('onboarding order', () => {
  it('shows the safety notice before any sound and plays a preview only after it', async () => {
    const eng = engine();
    render(<ModeRoot engine={eng} store={createStore(undefined)} />);
    await screen.findByText(CALM.goalTitle, { selector: 'h2' });
    click(CALM.next);
    click(CALM.next);
    click(CALM.next);
    expect(screen.getByText(CALM.safetyTitle)).toBeTruthy();
    expect(screen.queryByText(CALM.preview)).toBeNull();
    expect(eng.start).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByTestId('calm-safety-accept')));
    expect(localStorage.getItem(SAFETY_KEY)).toBe('1');
    expect(eng.start).not.toHaveBeenCalled();
    const previews = await screen.findAllByRole('button', { name: CALM.preview });
    expect(previews.length).toBeGreaterThan(0);
    await act(async () => fireEvent.click(previews[0] as HTMLElement));
    expect(eng.start).toHaveBeenCalledTimes(1);
  });

  it('skip jumps to the safety notice and plays nothing', async () => {
    const eng = engine();
    render(<ModeRoot engine={eng} store={createStore(undefined)} />);
    await screen.findByText(CALM.goalTitle, { selector: 'h2' });
    click(CALM.skip);
    expect(screen.getByText(CALM.safetyTitle)).toBeTruthy();
    expect(eng.start).not.toHaveBeenCalled();
  });

  it('Back keeps earlier answers', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByText(CALM.goalTitle, { selector: 'h2' });
    fireEvent.click(screen.getByLabelText('Sleep'));
    click(CALM.next);
    click(CALM.back);
    expect((screen.getByLabelText('Sleep') as HTMLInputElement).checked).toBe(true);
  });
});

describe('studio switch', () => {
  beforeEach(() => void saveProfile(createLocalStorage(), PROFILE));

  it('defaults to Calm, switches to Studio, remembers it, and returns', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    expect(readMode()).toBe('calm');
    click(CALM.studio);
    await screen.findByTestId('play-button');
    expect(localStorage.getItem(MODE_KEY)).toBe('studio');
    click(CALM.backToCalm);
    await screen.findByTestId('greeting');
    expect(localStorage.getItem(MODE_KEY)).toBe('calm');
  });

  it('opens Studio at start when it was the last choice', async () => {
    localStorage.setItem(MODE_KEY, 'studio');
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('play-button');
    expect(screen.queryByTestId('greeting')).toBeNull();
  });

  it('plays from Today only after the safety dialog is accepted', async () => {
    const eng = engine();
    render(<ModeRoot engine={eng} store={createStore(undefined)} />);
    fireEvent.click(await screen.findByTestId('today-play'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(eng.start).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByTestId('calm-safety-accept')));
    expect(eng.start).toHaveBeenCalledTimes(1);
  });
});

describe('week display', () => {
  it('shows days listened out of seven, with rest days counted and no loss wording', () => {
    const day = 20_000;
    const week = weekStats([{ day: day - 1, minutes: 10 }, { day, minutes: 5 }], day);
    render(<WeekDots week={week} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(7);
    expect(screen.getByTestId('week-text').textContent).toMatch(/days this week\. Rest days count too\./);
    expect(document.body.textContent).not.toMatch(/lost|missed|broke|streak/i);
  });

  it('a quiet week says welcome back only when there is history', () => {
    expect(weekText(weekStats([], 20_000))).toBe(CALM.welcomeBack);
    expect(weekText(weekStats([], 20_000), false)).toBe(CALM.firstWeek);
    expect(CALM.firstWeek).not.toMatch(/welcome back/i);
  });

  it('safety lines tell people to stop if uncomfortable; research heading is neutral', () => {
    expect(CALM.safetyLines).toContain('Stop if anything feels uncomfortable.');
    expect(CALM.whyTitle).toBe('What the research says');
    expect(JSON.stringify(JOURNEYS)).not.toMatch(/Easier Sleep/);
  });

  it('greets by the clock without a name', () => {
    expect([greeting(8), greeting(13), greeting(19), greeting(2)]).toEqual(['Good morning.', 'Good afternoon.', 'Good evening.', 'Hello, night owl.']);
  });
});

describe('reduced motion and gentle mode', () => {
  it('keeps the breathing ring still when asked', () => {
    render(<BreathRing still playing />);
    const ring = screen.getByTestId('breath-ring');
    expect(ring.getAttribute('data-still')).toBe('true');
    expect((ring.querySelector('.c-ring') as HTMLElement).style.transition).toBe('none');
  });

  it('turns motion off app-wide when Reduce motion is saved', async () => {
    localStorage.setItem(MOTION_KEY, '1');
    saveProfile(createLocalStorage(), PROFILE);
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    expect(document.querySelector('.c-app')?.getAttribute('data-motion')).toBe('off');
  });

  it('turns motion off when gentle mode is on', async () => {
    saveProfile(createLocalStorage(), { ...PROFILE, extraGentle: true });
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    expect(document.querySelector('.c-app')?.getAttribute('data-motion')).toBe('off');
  });
});
