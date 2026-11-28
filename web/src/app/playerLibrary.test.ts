// MOCKED: the audio engine is a stub in this file. Real output is read by verify:e2e (web/scripts/e2e-core-checks.mjs).
import { describe, expect, it, vi } from 'vitest';
import type { SbgEvent, Voice } from '../sbg';
import { fakeClock, memoryStorage } from './fakeClock.testutil';
import { BREAK_BEAT_HZ, GAIN_STEP, MAX_GAIN, Player } from './player';
import type { TemplateLike } from './player';

const voice = (over: Partial<Voice> = {}): Voice => ({
  carrierHz: 200, beatHz: 12, noise: 'off', noiseLevel: 0, mode: 'binaural', gain: 0.5, ...over,
});

function tpl(id: string, minutes = 10): TemplateLike {
  return { id, name: `Name ${id}`, recommendedMinutes: minutes, category: 'focus', vibe: 'calm' };
}

const toEvents = (t: TemplateLike): SbgEvent[] => [
  { tSec: 0, voice: voice({ beatHz: t.id === 'a' ? 12 : 6 }), ramp: false, line: 1 },
  { tSec: t.recommendedMinutes * 60, voice: voice({ beatHz: 4 }), ramp: false, line: 2 },
];

function setup(opts: { storage?: ReturnType<typeof memoryStorage> | null } = {}) {
  const clock = fakeClock();
  const calls: Voice[] = [];
  const engine = {
    start: vi.fn(async (_v: Voice) => undefined),
    stop: vi.fn(async () => undefined),
    setVoice: vi.fn((v: Voice) => void calls.push(v)),
  };
  const player = new Player(engine, clock, undefined, { toEvents, storage: opts.storage ?? null });
  return { clock, engine, player, calls };
}

describe('queue', () => {
  it('plays, steps next and prev with wraparound', async () => {
    const { player, engine } = setup();
    player.setQueue([tpl('a'), tpl('b'), tpl('c')]);
    expect(await player.nextTemplate()).toBe(true);
    expect(player.snapshot()).toMatchObject({ templateId: 'a', queueIndex: 0, playing: true, source: 'template', queueLength: 3 });
    expect(engine.start).toHaveBeenCalledTimes(1);
    await player.nextTemplate();
    expect(player.snapshot().templateId).toBe('b');
    await player.prevTemplate();
    await player.prevTemplate();
    expect(player.snapshot()).toMatchObject({ templateId: 'c', queueIndex: 2 });
    await player.nextTemplate();
    expect(player.snapshot().templateId).toBe('a');
  });
  it('is a no-op with an empty queue and without toEvents', async () => {
    const { player } = setup();
    expect(await player.nextTemplate()).toBe(false);
    const bare = new Player({ start: async () => undefined, stop: async () => undefined, setVoice: () => undefined }, fakeClock(), undefined, { storage: null });
    expect(await bare.playTemplate(tpl('a'))).toBe(false);
  });
  it('playTemplate finds its queue index and exposes metadata', async () => {
    const { player } = setup();
    player.setQueue([tpl('a'), tpl('b')]);
    await player.playTemplate(tpl('b'));
    expect(player.snapshot()).toMatchObject({ queueIndex: 1, templateName: 'Name b', templateCategory: 'focus' });
  });
  it('keeps the existing preset API working', async () => {
    const { player } = setup();
    player.selectPreset('nope');
    expect(player.snapshot()).toMatchObject({ templateId: null, queueIndex: -1, muted: false, gainScale: 1 });
  });
});

describe('gain', () => {
  it('never exceeds 0.85 with repeated nudges', async () => {
    const { player, calls } = setup();
    await player.playTemplate(tpl('a'));
    for (let i = 0; i < 40; i++) player.nudgeGain(GAIN_STEP);
    player.tick();
    for (const v of calls) expect(v.gain).toBeLessThanOrEqual(MAX_GAIN);
    expect(player.snapshot().voice.gain).toBeCloseTo(MAX_GAIN, 5);
    player.nudgeGain(-GAIN_STEP);
    expect(player.snapshot().voice.gain).toBeCloseTo(MAX_GAIN - GAIN_STEP, 5);
  });
  it('nudges down to silence and ignores NaN', async () => {
    const { player } = setup();
    await player.playTemplate(tpl('a'));
    for (let i = 0; i < 40; i++) player.nudgeGain(-GAIN_STEP);
    player.nudgeGain(NaN);
    expect(player.snapshot().voice.gain).toBe(0);
  });
  it('mutes and restores', async () => {
    const { player, calls } = setup();
    await player.playTemplate(tpl('a'));
    player.setMuted(true);
    expect(calls[calls.length - 1]?.gain).toBe(0);
    expect(player.snapshot().muted).toBe(true);
    player.toggleMute();
    expect(player.snapshot().voice.gain).toBeCloseTo(0.5);
  });
});

describe('timer integration', () => {
  it('sleep fade lowers gain, glides beat toward 2.5 Hz and stops playback', async () => {
    const { player, clock, engine, calls } = setup();
    await player.playTemplate(tpl('a', 60));
    player.startTimer({ kind: 'sleep-fade', minutes: 5 });
    let prev = 1;
    for (let s = 0; s < 5 * 60; s++) {
      clock.advance(1000);
      const g = player.snapshot().voice.gain;
      expect(g).toBeLessThanOrEqual(prev + 1e-9);
      prev = g;
    }
    expect(player.snapshot().voice.beatHz).toBeLessThan(3);
    expect(player.snapshot().playing).toBe(true);
    clock.advance(7000);
    expect(player.snapshot().playing).toBe(false);
    expect(engine.stop).toHaveBeenCalled();
    expect(player.snapshot().timer.kind).toBe('none');
    for (const v of calls) expect(v.gain).toBeLessThanOrEqual(MAX_GAIN);
  });
  it('countdown stops playback at zero', async () => {
    const { player, clock } = setup();
    await player.playTemplate(tpl('a'));
    player.startTimer({ kind: 'countdown', minutes: 1 });
    clock.advance(61_000);
    expect(player.snapshot().playing).toBe(false);
  });
  it('pomodoro break uses a calmer beat and returns at focus', async () => {
    const { player, clock } = setup();
    await player.playTemplate(tpl('a', 120));
    player.startTimer({ kind: 'pomodoro', focusMin: 1, breakMin: 1 });
    clock.advance(30_000);
    expect(player.snapshot().voice.beatHz).toBeCloseTo(12);
    clock.advance(40_000);
    expect(player.snapshot().timer.phase).toBe('break');
    clock.advance(5_000);
    expect(player.snapshot().voice.beatHz).toBeCloseTo(BREAK_BEAT_HZ, 1);
    clock.advance(30_000);
    clock.advance(30_000);
    clock.advance(5_000);
    expect(player.snapshot().timer.phase).toBe('focus');
    expect(player.snapshot().voice.beatHz).toBeCloseTo(12, 0);
  });
  it('a timer started while stopped waits for play, and stop pauses it', async () => {
    const { player, clock } = setup();
    player.startTimer({ kind: 'countdown', minutes: 2 });
    clock.advance(30_000);
    expect(player.snapshot().timer).toMatchObject({ running: false, remainingSec: 120 });
    await player.play();
    clock.advance(20_000);
    expect(player.snapshot().timer.remainingSec).toBe(100);
    await player.stop();
    clock.advance(30_000);
    expect(player.snapshot().timer).toMatchObject({ running: false, remainingSec: 100 });
    player.stopTimer();
    expect(player.snapshot().timer.kind).toBe('none');
  });
  it('cycleTimer steps kinds and persisted state restores paused', async () => {
    const storage = memoryStorage();
    const a = setup({ storage });
    await a.player.play();
    expect(a.player.cycleTimer().kind).toBe('countdown');
    a.clock.advance(10_000);
    a.player.snapshot();
    const b = setup({ storage });
    expect(b.player.snapshot().timer).toMatchObject({ kind: 'countdown', running: false });
  });
});

describe('seek and position', () => {
  it('seeks within the template timeline and clamps', async () => {
    const { player, clock } = setup();
    await player.playTemplate(tpl('a', 10));
    clock.advance(20_000);
    expect(player.positionState()).toEqual({ durationSec: 600, positionSec: 20 });
    player.seekBy(15);
    expect(player.positionState()?.positionSec).toBeCloseTo(35);
    player.seekBy(-1000);
    expect(player.positionState()?.positionSec).toBe(0);
    player.seekBy(1e6);
    expect(player.positionState()?.positionSec).toBe(600);
    player.seekBy(NaN);
    expect(player.positionState()?.positionSec).toBe(600);
  });
  it('seeks the timer when one is active', async () => {
    const { player } = setup();
    await player.playTemplate(tpl('a'));
    player.startTimer({ kind: 'countdown', minutes: 1 });
    player.seekBy(15);
    expect(player.positionState()).toEqual({ durationSec: 60, positionSec: 15 });
  });
  it('has no position without a template or timer', () => {
    expect(setup().player.positionState()).toBeNull();
  });
});
