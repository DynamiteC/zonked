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
import { Stage } from './PlayerScreen';
import { getTemplates } from '../../catalog';
import { EndCard } from './EndCard';
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

const PROFILE: Profile = { goal: 'sleep', timeOfDay: 'night', device: 'wired', extraGentle: false, createdAt: 1_700_000_000_000 };
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
    await screen.findByText(CALM.goalTitle, { selector: 'h1' });
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

  it('skip shows the unnumbered notice, plays nothing, then starts a default session on accept', async () => {
    const eng = engine();
    render(<ModeRoot engine={eng} store={createStore(undefined)} />);
    await screen.findByText(CALM.goalTitle, { selector: 'h1' });
    expect(screen.getByText('1 of 3')).toBeTruthy();
    click(CALM.skip);
    expect(screen.getByText(CALM.safetyTitle)).toBeTruthy();
    expect(screen.queryByText(/of 3/)).toBeNull();
    expect(screen.getByText('Stop if anything feels uncomfortable.')).toBeTruthy();
    expect(localStorage.getItem(SAFETY_KEY)).toBeNull();
    await act(async () => void (await new Promise((r) => setTimeout(r, 50))));
    expect(eng.start).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByTestId('calm-safety-accept')));
    expect(eng.start).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(CALM.starterTitle)).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
    await screen.findByTestId('player-toggle');
  });

  it('checks the pre-picked goal without a Selected word and keeps the note to one sentence', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByText(CALM.goalTitle, { selector: 'h1' });
    expect(screen.queryByText(CALM.selected)).toBeNull();
    expect(screen.getAllByRole('radio').filter((r) => (r as HTMLInputElement).checked)).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: /Selected/ })).toBeNull();
    expect(CALM.listenNote.match(/[.!?]/g)).toHaveLength(1);
  });

  it('Start keeps a running preview going: one engine start, no restart', async () => {
    const eng = engine();
    render(<ModeRoot engine={eng} store={createStore(undefined)} />);
    await screen.findByText(CALM.goalTitle, { selector: 'h1' });
    click(CALM.next);
    click(CALM.next);
    click(CALM.next);
    await act(async () => fireEvent.click(screen.getByTestId('calm-safety-accept')));
    const previews = await screen.findAllByRole('button', { name: CALM.preview });
    await act(async () => fireEvent.click(previews[0] as HTMLElement));
    await act(async () => fireEvent.click(screen.getByRole('button', { name: CALM.start })));
    await screen.findByTestId('player-toggle');
    expect(eng.start).toHaveBeenCalledTimes(1);
    expect(eng.stop).not.toHaveBeenCalled();
  });

  it('Back keeps earlier answers', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByText(CALM.goalTitle, { selector: 'h1' });
    fireEvent.click(screen.getByLabelText(/^Sleep/));
    click(CALM.next);
    click(CALM.back);
    expect((screen.getByLabelText(/^Sleep/) as HTMLInputElement).checked).toBe(true);
  });
});

describe('studio switch', () => {
  beforeEach(() => void saveProfile(createLocalStorage(), PROFILE));

  it('the Studio link now opens the Player with Options showing Advanced', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    expect(readMode()).toBe('calm');
    click(CALM.nav[3]);
    fireEvent.click(await screen.findByRole('button', { name: CALM.studioLink }));
    expect((await screen.findByTestId('options-advanced')).getAttribute('aria-expanded')).toBe('true');
    expect(screen.queryByTestId('play-button')).toBeNull();
  });

  it('opens Advanced with Alt+Shift+S and not with a bare S', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    fireEvent.keyDown(window, { code: 'KeyS' });
    expect(screen.queryByTestId('options-sheet')).toBeNull();
    fireEvent.keyDown(window, { code: 'KeyS', altKey: true, shiftKey: true });
    await screen.findByTestId('options-sheet');
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

describe('play again and end card', () => {
  beforeEach(() => {
    saveProfile(createLocalStorage(), PROFILE);
    localStorage.setItem(SAFETY_KEY, '1');
  });

  it('shows no Play again before any session', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    expect(screen.queryByTestId('play-again')).toBeNull();
  });

  it('replays the last session from Today in one tap', async () => {
    const eng = engine();
    localStorage.setItem('zonked.last.v1', getTemplates()[0]?.id ?? '');
    render(<ModeRoot engine={eng} store={createStore(undefined)} />);
    await act(async () => fireEvent.click(await screen.findByTestId('play-again')));
    expect(eng.start).toHaveBeenCalledTimes(1);
  });

  it('end card has one calm line and two buttons, with no pressure words', () => {
    const onAgain = vi.fn();
    const onClose = vi.fn();
    render(<EndCard info={{ id: 'x', name: 'Soft Rain', minutes: 12 }} onAgain={onAgain} onClose={onClose} />);
    expect(screen.getByText('Soft Rain played for 12 minutes.')).toBeTruthy();
    fireEvent.click(screen.getByTestId('end-again'));
    fireEvent.click(screen.getByTestId('end-close'));
    expect(onAgain).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.body.textContent).not.toMatch(/tomorrow|streak|missed|lost|don't|do not break/i);
    expect(CALM.endLine('A', 0)).toBe('A played for under a minute.');
  });
});

describe('how was that row', () => {
  it('is optional, saves one answer once and shows no score', () => {
    const onFeel = vi.fn();
    const { rerender } = render(<EndCard info={{ id: 'x', name: 'Soft Rain', minutes: 12 }} onAgain={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByTestId('feel-row')).toBeNull();
    rerender(<EndCard info={{ id: 'x', name: 'Soft Rain', minutes: 12 }} onAgain={vi.fn()} onClose={vi.fn()} onFeel={onFeel} />);
    expect(screen.getByText(CALM.feelQuestion)).toBeTruthy();
    fireEvent.click(screen.getByTestId('feel-calmer'));
    expect(onFeel).toHaveBeenCalledWith('calmer');
    expect(screen.queryByTestId('feel-row')).toBeNull();
    expect(screen.getByTestId('feel-saved').textContent).toBe(CALM.feelSaved);
    expect(document.body.textContent).not.toMatch(/score|\d+ ?%|streak/i);
  });
});

describe('week display', () => {
  it('shows days listened out of seven, with rest days counted and no loss wording', () => {
    const day = 20_000;
    const week = weekStats([{ day: day - 1, minutes: 10 }, { day, minutes: 5 }], day);
    render(<WeekDots week={week} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(7);
    expect(screen.getByTestId('week-text').textContent).toMatch(/\d of 7 days\. Rest days count too\./);
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
    render(<Stage still playing situation="calm" theme="dark" level={0} />);
    const ring = screen.getByTestId('breath-ring');
    expect(ring.getAttribute('data-still')).toBe('true');
    expect(ring.getAttribute('data-situation')).toBe('calm');
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

describe('redesign', () => {
  it('fills the first dot with a welcome line on the day the person joined', () => {
    render(<WeekDots week={weekStats([], 20_000)} hasHistory={false} joinedToday />);
    expect(document.querySelectorAll('.c-dot-joined')).toHaveLength(1);
    expect(screen.getByTestId('week-text').textContent).toBe(CALM.joinedLine);
    expect(document.body.textContent).not.toMatch(/lost|missed|broke|streak|chain/i);
  });

  it('shows the nav with icons and marks the current tab', async () => {
    saveProfile(createLocalStorage(), PROFILE);
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav.querySelectorAll('svg.c-icon')).toHaveLength(4);
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe(CALM.nav[0]);
  });

  it('Library tiles show a sound count and a mood line', async () => {
    saveProfile(createLocalStorage(), PROFILE);
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    click(CALM.nav[1]);
    await screen.findByText('Focus', { selector: '.c-tile-name' });
    expect(document.querySelectorAll('.c-tile-count')).toHaveLength(8);
    expect(document.querySelector('.c-tile-count')?.textContent).toMatch(/^\d+ sounds?$/);
    expect(document.querySelector('.c-tile-mood')?.textContent).not.toBe('');
  });

  it('has no Studio button in the top bar', async () => {
    saveProfile(createLocalStorage(), PROFILE);
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByTestId('greeting');
    expect(screen.queryByTestId('studio-top')).toBeNull();
  });
});
