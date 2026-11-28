// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getTemplates } from '../../catalog';
import type { Player } from '../../app/player';
import type { TimerState } from '../../app/timers';
import { createStore } from '../../storage/db';
import { DEFAULT_PROFILE, createMemoryStorage, echoLine, feelEcho, helpedCounts, plainLine, todayPlan, useCasePlan } from './data';
import type { FeelEntry, Profile } from './data';
import { forgetEverything } from './data/forget';
import { EndCard } from './EndCard';
import { guideDue } from './Guide';
import { SettingsScreen } from './SettingsScreen';
import { TimerChips, UNTIL_STOP_MIN, chipIndex } from './TimerChips';
import { Today } from './Today';
import { UX } from './copy-ux';

afterEach(() => cleanup());

const at = (h: number): Date => new Date(2026, 5, 10, h, 0, 0);
const P = (goal: Profile['goal'], timeOfDay: Profile['timeOfDay'] = 'anytime', device: Profile['device'] = 'wired'): Profile => ({ ...DEFAULT_PROFILE, goal, timeOfDay, device, createdAt: 1 });

describe('guide placement (R14)', () => {
  const base = { open: false, seen: false, onboarding: false, endClosed: false, endCardShown: false, playing: false };
  it('never shows over the end card, and shows once after it is closed', () => {
    expect(guideDue({ ...base, endCardShown: true })).toBe(false);
    expect(guideDue({ ...base, endClosed: false })).toBe(false);
    expect(guideDue({ ...base, endClosed: true })).toBe(true);
    expect(guideDue({ ...base, endClosed: true, seen: true })).toBe(false);
    expect(guideDue({ ...base, endClosed: true, playing: true })).toBe(false);
    expect(guideDue({ ...base, open: true, seen: true, endCardShown: true })).toBe(true);
  });
});

describe('goal and time pick (R15)', () => {
  it('gives Study the 25 plus 5 sprint', () => {
    const p = todayPlan(P('study'), at(10));
    expect([p.kind, p.minutes]).toEqual(['sprint', 25]);
  });
  it('gives Sleep at night a wind down with the Sleep fade', () => {
    const p = todayPlan(P('sleep', 'night'), at(23));
    expect([p.kind, p.fade]).toEqual(['winddown', true]);
  });
  it('gives Focus by day a focus session and Focus at night a short wind down', () => {
    expect(todayPlan(P('focus', 'morning'), at(9)).kind).toBe('focus');
    expect(todayPlan(P('focus', 'anytime'), at(22))).toMatchObject({ kind: 'winddown', minutes: 15, fade: false });
  });
  it('names a plain start for Just curious', () => {
    expect(UX.planTitle[todayPlan(P('curious'), at(12)).kind]).toBe('10 minute calm start');
  });
  it('follows the device mode', () => {
    expect(todayPlan(P('focus', 'morning', 'bluetooth'), at(9)).ctx.deviceType).toBe('bluetooth');
    expect(todayPlan(P('focus', 'morning', 'speakers'), at(9)).ctx.deviceType).toBe('speaker');
  });
  it('lead uses are wind down, sleep, focus', () => {
    const k = (['winddown', 'sleep', 'focus'] as const).map((u) => useCasePlan(P('calm'), at(12), u).ctx.situation);
    expect(k).toEqual(['heal-stress', 'cant-sleep', 'deep-work']);
  });
  it('plain line has no jargon', () => {
    for (const t of getTemplates().slice(0, 60)) expect(plainLine(t)).not.toMatch(/theta|SMR|alpha|beta|delta|Hz/i);
  });
});

const baseProps = {
  week: { daysListened: 0, goalDays: 3, goalMet: false, quietWeek: true, dots: ['rest', 'rest', 'rest', 'rest', 'rest', 'rest', 'rest'] } as never,
  progress: {},
  reduced: true,
  crewConnected: false,
  onOpenJourney: () => undefined,
  onGo: () => undefined,
  onReset: () => undefined,
};

describe('Today (R15, R16, lead uses)', () => {
  it('Start plays the planned length and the Sleep fade for a sleep goal', () => {
    const onPlay = vi.fn();
    render(<Today {...baseProps} profile={P('sleep', 'night')} now={() => at(23)} onPlay={onPlay} />);
    fireEvent.click(screen.getByTestId('today-play'));
    expect(onPlay).toHaveBeenCalledWith(expect.anything(), 30, 'sleep');
    expect(screen.getByTestId('plan-eyebrow').textContent).toBe(UX.planEyebrow.winddown);
  });
  it('Study Start begins the sprint', () => {
    const onSprint = vi.fn();
    const onPlay = vi.fn();
    render(<Today {...baseProps} profile={P('study')} now={() => at(10)} onPlay={onPlay} onSprint={onSprint} />);
    fireEvent.click(screen.getByTestId('today-play'));
    expect(onSprint).toHaveBeenCalledOnce();
    expect(onPlay).not.toHaveBeenCalled();
    expect(screen.queryByTestId('today-sprint')).toBeNull();
  });
  it('shows the three lead uses first and each plays', () => {
    const onPlay = vi.fn();
    render(<Today {...baseProps} profile={P('calm')} now={() => at(12)} onPlay={onPlay} />);
    expect(['use-winddown', 'use-sleep', 'use-focus'].map((id) => screen.getByTestId(id).textContent)).toEqual(['Wind down', 'Sleep', 'Focus']);
    fireEvent.click(screen.getByTestId('use-sleep'));
    expect(onPlay).toHaveBeenCalledWith(expect.anything(), 30, 'sleep');
  });
  it('echoes yesterday calmer answer in one gentle line, and never a "not for me"', () => {
    const t = getTemplates()[0];
    if (t === undefined) throw new Error('no templates');
    const now = at(10);
    const day = Math.floor((now.getTime() - now.getTimezoneOffset() * 60_000) / 86_400_000);
    const calmer: FeelEntry[] = [{ id: t.id, a: 'calmer', day: day - 1 }];
    const onPlay = vi.fn();
    render(<Today {...baseProps} profile={P('calm')} now={() => now} feel={calmer} onPlay={onPlay} />);
    expect(screen.getByTestId('feel-echo').textContent).toContain(`Yesterday ${t.name} felt calmer. Play it again?`);
    fireEvent.click(screen.getByTestId('feel-echo-play'));
    expect(onPlay).toHaveBeenCalledWith(expect.objectContaining({ id: t.id }));
    cleanup();
    render(<Today {...baseProps} profile={P('calm')} now={() => now} feel={[{ id: t.id, a: 'not', day: day - 1 }]} onPlay={onPlay} />);
    expect(screen.queryByTestId('feel-echo')).toBeNull();
  });
  it('shows a rest note only after 2 hours of sound today', () => {
    const { rerender } = render(<Today {...baseProps} profile={P('calm')} onPlay={vi.fn()} todayMinutes={119} />);
    expect(screen.queryByTestId('rest-note')).toBeNull();
    rerender(<Today {...baseProps} profile={P('calm')} onPlay={vi.fn()} todayMinutes={121} />);
    expect(screen.getByTestId('rest-note').textContent).toContain(UX.listened.rest);
  });
});

describe('feel echo data', () => {
  it('ignores old and negative answers, words by day', () => {
    expect(feelEcho([], 10)).toBeNull();
    expect(feelEcho([{ id: 'a-1', a: 'not', day: 9 }], 10)).toBeNull();
    expect(feelEcho([{ id: 'a-1', a: 'calmer', day: 1 }], 10)).toBeNull();
    const e = feelEcho([{ id: 'a-1', a: 'same', day: 8 }], 10);
    expect(e && echoLine('Rain', e)).toBe('Last time Rain felt about the same. Play it again if you like.');
  });
  it('counts answers by sound', () => {
    const rows = helpedCounts([{ id: 'a-1', a: 'calmer', day: 1 }, { id: 'a-1', a: 'not', day: 2 }, { id: 'b-1', a: 'same', day: 2 }]);
    expect(rows[0]).toEqual({ id: 'a-1', calmer: 1, same: 0, not: 1 });
  });
});

describe('Until I stop cap (R20)', () => {
  const timer = (over: Partial<TimerState>): TimerState => ({ kind: 'none', running: false, remainingSec: 0, totalSec: 0, ...over });
  const player = (): Player => ({ startTimer: vi.fn(), stopTimer: vi.fn() }) as unknown as Player;
  it('starts a 2 hour Sleep fade and says so in the timer row', () => {
    const pl = player();
    render(<TimerChips timer={timer({})} player={pl} />);
    expect(screen.getByTestId('until-stop-hint').textContent).toBe(UX.untilStopHint);
    fireEvent.click(screen.getByText('Until I stop'));
    expect(pl.startTimer).toHaveBeenCalledWith({ kind: 'sleep-fade', minutes: UNTIL_STOP_MIN });
    expect(UNTIL_STOP_MIN).toBe(120);
  });
  it('marks the capped timer as Until I stop, and a short Sleep fade as Sleep fade', () => {
    expect(chipIndex(timer({ kind: 'sleep-fade', totalSec: UNTIL_STOP_MIN * 60 }))).toBe(3);
    expect(chipIndex(timer({ kind: 'sleep-fade', totalSec: 20 * 60 }))).toBe(4);
    expect(chipIndex(timer({}))).toBe(-1);
  });
  it('hides the chip for the Sleep goal', () => {
    render(<TimerChips timer={timer({})} player={player()} hideUntilStop />);
    expect(screen.queryByText('Until I stop')).toBeNull();
    expect(screen.queryByTestId('until-stop-hint')).toBeNull();
    expect(screen.getByText('Sleep fade')).toBeTruthy();
  });
  it('the end card says Time for a rest after a long session', () => {
    render(<EndCard info={{ id: 'a-1', name: 'Rain', minutes: 120 }} onAgain={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByTestId('rest-line').textContent).toBe(UX.restLine);
    cleanup();
    render(<EndCard info={{ id: 'a-1', name: 'Rain', minutes: 20 }} onAgain={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByTestId('rest-line')).toBeNull();
  });
});

describe('Settings privacy and what helped (R6, R50)', () => {
  const props = { gentle: false, reduceMotion: false, onGentle: vi.fn(), onReduceMotion: vi.fn(), onStudio: vi.fn(), onForget: vi.fn(), prefs: { choice: 'system', dim: null, announce: true } as never, onPrefs: vi.fn() };
  it('opens the privacy notice from Settings', () => {
    render(<SettingsScreen {...props} />);
    expect(screen.queryByTestId('privacy-text')).toBeNull();
    fireEvent.click(screen.getByTestId('privacy-link'));
    expect(screen.getByTestId('privacy-text').textContent).toContain('no account, no analytics and no tracking');
    expect(screen.getByTestId('privacy-text').textContent).toContain('not meant for children under 13');
  });
  it('lists local answers by sound with no score', () => {
    const t = getTemplates()[0];
    if (t === undefined) throw new Error('no templates');
    render(<SettingsScreen {...props} feel={[{ id: t.id, a: 'calmer', day: 1 }]} />);
    expect(screen.getByTestId('helped').textContent).toContain(`${t.name}: 1 calmer, 0 same, 0 not for me`);
  });
});

describe('Forget my data clears everything local (R6)', () => {
  it('removes zonked keys, mixes, logs and the sample cache', async () => {
    const ls = localStorage;
    ls.clear();
    ls.setItem('zonked.safety.v1', '1');
    ls.setItem('zonked.look.v1', 'x');
    ls.setItem('other.key', 'keep');
    const store = createStore(undefined);
    const clear = vi.spyOn(store, 'clearSanctuary');
    const del = vi.fn(async () => true);
    await forgetEverything(createMemoryStorage(), store, ls, { delete: del } as unknown as CacheStorage);
    expect(Object.keys(ls)).toEqual(['other.key']);
    expect(clear).toHaveBeenCalled();
    expect(del).toHaveBeenCalledWith('zonked-samples');
  });
  it('keeps going when one step fails', async () => {
    const store = createStore(undefined);
    vi.spyOn(store, 'clearSanctuary').mockRejectedValue(new Error('no'));
    const del = vi.fn(async () => true);
    await expect(forgetEverything(createMemoryStorage(), store, undefined, { delete: del } as unknown as CacheStorage)).resolves.toBeUndefined();
    expect(del).toHaveBeenCalled();
  });
});
