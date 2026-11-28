// MOCKED: the audio engine is a stub in this file. Real output is read by verify:e2e (web/scripts/e2e-core-checks.mjs).
import { describe, expect, it, vi } from 'vitest';
import { fakeClock } from '../../app/fakeClock.testutil';
import { MAX_GAIN, Player } from '../../app/player';
import type { TimerState } from '../../app/timers';
import { getTemplates, templateToEvents } from '../../catalog';
import type { Template } from '../../catalog/types';
import type { Voice } from '../../sbg';
import { BREAK_GAIN_RATIO, BREAK_IDS, CHIME_LAYER, CHIME_MS, SPRINT_SPEC, breakTemplate, breakTrim, enterBreak, nextSprint } from './sprint';

const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 0));
const find = (id: string): Template => {
  const t = getTemplates().find((x) => x.id === id);
  if (t === undefined) throw new Error(`missing ${id}`);
  return t;
};
const timer = (over: Partial<TimerState>): TimerState => ({ kind: 'pomodoro', running: true, remainingSec: 10, totalSec: 60, phase: 'focus', cycle: 1, ...over });

function rig() {
  const eng = { start: vi.fn(async (_v: Voice) => undefined), stop: vi.fn(async () => undefined), setVoice: vi.fn((_v: Voice, _r?: number) => undefined) };
  const clk = fakeClock();
  const player = new Player(eng, clk, undefined, { storage: null, toEvents: (t) => templateToEvents(t as Template) });
  return { eng, clk, player };
}

describe('nextSprint', () => {
  it('goes focus, break, end, and cancels on any other timer', () => {
    expect(nextSprint('focus', timer({}))).toEqual({ phase: 'focus', action: null });
    expect(nextSprint('focus', timer({ phase: 'break' }))).toEqual({ phase: 'break', action: 'break' });
    expect(nextSprint('break', timer({ phase: 'break' }))).toEqual({ phase: 'break', action: null });
    expect(nextSprint('break', timer({ phase: 'focus', cycle: 2 }))).toEqual({ phase: 'end', action: 'finish' });
    expect(nextSprint('focus', timer({ kind: 'countdown', phase: undefined })).action).toBe('cancel');
    expect(nextSprint('focus', { kind: 'none', running: false, remainingSec: 0, totalSec: 0 }).action).toBe('cancel');
  });
});

describe('break sound', () => {
  it('is calmer and never the focus sound', () => {
    const pool = getTemplates();
    expect(breakTemplate('starter-lofi', pool)?.id).toBe(BREAK_IDS[0]);
    expect(breakTemplate(BREAK_IDS[0] ?? '', pool)?.id).toBe(BREAK_IDS[1]);
    for (const id of BREAK_IDS) expect(find(id).intensity).toBe(1);
  });
  it('trim lowers and never raises', () => {
    expect(breakTrim(0.4, 0.4)).toBeCloseTo(-0.4 * (1 - BREAK_GAIN_RATIO), 3);
    expect(breakTrim(0.4, 0.2)).toBe(0);
    expect(breakTrim(NaN, 0.4)).toBe(0);
    expect(breakTrim(0.4, Infinity)).toBe(0);
    for (const f of [0, 0.1, 0.4, 0.85]) for (const b of [0, 0.2, 0.5, 0.85]) expect(breakTrim(f, b)).toBeLessThanOrEqual(0);
  });
});

describe('a sprint on fake timers', () => {
  it('plays 25 minutes, chimes into a quieter 5 minute break, then finishes', async () => {
    const { eng, clk, player } = rig();
    const focus = find('starter-lofi');
    player.setQueue([focus]);
    expect(await player.playTemplate(focus)).toBe(true);
    player.startTimer(SPRINT_SPEC);
    await flush();
    expect(player.snapshot().timer).toMatchObject({ kind: 'pomodoro', phase: 'focus', totalSec: 25 * 60 });
    const focusGain = player.snapshot().voice.gain;
    expect(focusGain).toBeGreaterThan(0);

    clk.advance(24 * 60_000);
    expect(nextSprint('focus', player.snapshot().timer).action).toBeNull();
    clk.advance(61_000);
    const t = player.snapshot().timer;
    expect(t).toMatchObject({ phase: 'break', totalSec: 5 * 60 });
    expect(nextSprint('focus', t).action).toBe('break');

    const later = vi.fn();
    const brk = find(BREAK_IDS[0] ?? '');
    await enterBreak(player, brk, later);
    await flush();
    const snap = player.snapshot();
    expect(snap.templateId).toBe(brk.id);
    expect(snap.voice.gain).toBeLessThan(focusGain);
    expect(snap.voice.gain).toBeLessThanOrEqual(focusGain * BREAK_GAIN_RATIO + 1e-6);
    expect(snap.voice.gain).toBeLessThanOrEqual(MAX_GAIN);
    expect(snap.layerOverrides.chimeLevel).toBe(CHIME_LAYER.chimeLevel);
    expect(later).toHaveBeenCalledWith(expect.any(Function), CHIME_MS);
    (later.mock.calls[0]?.[0] as () => void)();
    expect(player.snapshot().layerOverrides).toEqual({});

    // The break never gets louder than the focus, sampled across its 5 minutes.
    for (let i = 0; i < 10; i++) {
      clk.advance(25_000);
      expect(player.snapshot().voice.gain).toBeLessThanOrEqual(focusGain);
      expect(player.snapshot().voice.beatHz).toBeLessThanOrEqual(8.0001);
    }
    clk.advance(60_000);
    const end = player.snapshot().timer;
    expect(end.phase).toBe('focus');
    expect(nextSprint('break', end).action).toBe('finish');
    for (const call of eng.setVoice.mock.calls) expect(call[0].gain).toBeLessThanOrEqual(MAX_GAIN);
  });

  it('keeps the chime inside the voice, so no layer value passes its bound', async () => {
    const { eng, player } = rig();
    const focus = find('starter-piano');
    player.setQueue([focus]);
    await player.playTemplate(focus);
    await enterBreak(player, find('starter-rain'), vi.fn());
    for (const call of eng.setVoice.mock.calls) {
      expect(call[0].layers?.chimeLevel ?? 0).toBeLessThanOrEqual(1);
      expect(call[0].gain).toBeLessThanOrEqual(MAX_GAIN);
    }
  });
});
