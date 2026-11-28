// MOCKED: the audio engine is a stub in this file. Real output is read by verify:e2e (web/scripts/e2e-core-checks.mjs).
import { describe, expect, it, vi } from 'vitest';
import { PRESETS } from '../sbg';
import type { Voice } from '../sbg';
import { fakeClock } from './fakeClock.testutil';
import { makeMix } from './mixes';
import type { MixDraft } from './mixes';
import { MAX_GAIN, Player } from './player';
import type { SessionLog } from './player';

const engine = () => ({
  start: vi.fn(async (_v: Voice) => undefined),
  stop: vi.fn(async () => undefined),
  setVoice: vi.fn((_v: Voice, _r?: number) => undefined),
});
const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 0));
const none = { storage: null } as const;

const draft: MixDraft = {
  source: { kind: 'custom', id: 'custom' },
  voice: { carrierHz: 180, beatHz: 7, mode: 'binaural', noise: 'pink', noiseLevel: 0.25, gain: 0.4 },
  layers: { padLevel: 0.5, padRootHz: 110 },
  timer: { kind: 'none' },
};

describe('player mixes and session log', () => {
  it('playMix starts the saved voice, layers and timer', async () => {
    const eng = engine();
    const p = new Player(eng, fakeClock(), undefined, none);
    p.playMix(makeMix({ ...draft, timer: { kind: 'sleep-fade', minutes: 20 } }, 'm', 5));
    await flush();
    const v = eng.start.mock.calls[0]?.[0];
    expect(v).toMatchObject({ carrierHz: 180, beatHz: 7, noise: 'pink' });
    expect(v?.layers?.padLevel).toBe(0.5);
    expect(v?.gain).toBeLessThanOrEqual(MAX_GAIN);
    expect(p.snapshot().timer.kind).toBe('sleep-fade');
    expect(p.snapshot().presetId.startsWith('mix:')).toBe(true);
  });

  it('playMix never exceeds hearing bounds even for a forged mix', async () => {
    const eng = engine();
    const p = new Player(eng, fakeClock(), undefined, none);
    const m = makeMix(draft, 'm', 5);
    p.playMix({ ...m, voice: { ...m.voice, gain: 5, carrierHz: 9, beatHz: 900 } });
    await flush();
    const v = eng.start.mock.calls[0]?.[0];
    expect(v?.gain).toBeLessThanOrEqual(0.85);
    expect(v?.carrierHz).toBe(20);
    expect(v?.beatHz).toBe(40);
  });

  it('getMixDraft reports the current sound and timer', async () => {
    const p = new Player(engine(), fakeClock(), undefined, none);
    p.playMix(makeMix({ ...draft, timer: { kind: 'pomodoro', focusMin: 20, breakMin: 4 } }, 'm', 5));
    await flush();
    p.setLayerOverride({ chimeLevel: 0.3 });
    const d = p.getMixDraft();
    expect(d?.voice).toMatchObject({ carrierHz: 180, beatHz: 7 });
    expect(d?.layers.chimeLevel).toBe(0.3);
    expect(d?.timer).toEqual({ kind: 'pomodoro', focusMin: 20, breakMin: 4 });
    const q = new Player(engine(), fakeClock(), undefined, none);
    q.selectPreset(q.snapshot().presetId);
    expect(q.getMixDraft()?.source.kind).toBe('preset');
    p.startTimer({ kind: 'countdown', minutes: 15 });
    expect(p.getMixDraft()?.timer).toEqual({ kind: 'countdown', minutes: 15 });
  });

  it('logs endKind manual and zero breaks when stopped by hand', async () => {
    const logs: SessionLog[] = [];
    const clock = fakeClock();
    const p = new Player(engine(), clock, (l) => void logs.push(l), none);
    await p.play();
    clock.advance(5000);
    await p.stop();
    expect(logs[0]).toMatchObject({ endKind: 'manual', breaks: 0 });
  });

  it('logs sleep-fade end kind when the timer finishes', async () => {
    const logs: SessionLog[] = [];
    const clock = fakeClock();
    const p = new Player(engine(), clock, (l) => void logs.push(l), none);
    p.startTimer({ kind: 'sleep-fade', minutes: 1 });
    await p.play();
    clock.advance(70_000);
    await flush();
    expect(logs[0]?.endKind).toBe('sleep-fade');
  });

  it('counts a pomodoro break', async () => {
    const logs: SessionLog[] = [];
    const clock = fakeClock();
    const p = new Player(engine(), clock, (l) => void logs.push(l), none);
    p.startTimer({ kind: 'pomodoro', focusMin: 1, breakMin: 1 });
    await p.play();
    clock.advance(65_000);
    await p.stop();
    expect(logs[0]?.breaks).toBe(1);
  });
});

const draftVoice: Voice = { carrierHz: 200, beatHz: 10, mode: 'binaural', noise: 'off', noiseLevel: 0, gain: 0.3 };

describe('beat and noise overrides', () => {
  const started = async () => {
    const eng = engine();
    const p = new Player(eng, fakeClock(), undefined, none);
    await p.play();
    return { eng, p };
  };
  const lastVoice = (eng: ReturnType<typeof engine>): Voice | undefined => eng.setVoice.mock.calls.at(-1)?.[0];

  it('forces the beat, clamps it, ignores non-finite values and clears on null', async () => {
    const { eng, p } = await started();
    p.setBeatOverride(12);
    expect(lastVoice(eng)?.beatHz).toBe(12);
    expect(p.snapshot().beatOverride).toBe(12);
    p.setBeatOverride(999);
    expect(lastVoice(eng)?.beatHz).toBe(40);
    p.setBeatOverride(0.01);
    expect(p.snapshot().beatOverride).toBe(0.5);
    p.setBeatOverride(Number.NaN);
    p.setBeatOverride(Infinity);
    expect(p.snapshot().beatOverride).toBe(0.5);
    p.setBeatOverride(null);
    expect(p.snapshot().beatOverride).toBeNull();
  });

  it('forces noise kind and level with clamps and allows violet', async () => {
    const { eng, p } = await started();
    p.setNoiseOverride({ noise: 'violet', noiseLevel: 5 });
    expect(lastVoice(eng)).toMatchObject({ noise: 'violet', noiseLevel: 1 });
    p.setNoiseOverride({ noiseLevel: -2 });
    expect(p.snapshot().noiseOverride).toEqual({ noiseLevel: 0 });
    p.setNoiseOverride({ noise: 'evil' as never, noiseLevel: Number.NaN });
    expect(p.snapshot().noiseOverride).toEqual({ noiseLevel: 0 });
    p.setNoiseOverride(null);
    expect(p.snapshot().noiseOverride).toBeNull();
  });

  it('clears on preset, custom text, crew and mix changes', async () => {
    const { p } = await started();
    p.setBeatOverride(9);
    p.setNoiseOverride({ noise: 'white' });
    p.selectPreset(p.snapshot().presetId);
    expect(p.snapshot()).toMatchObject({ beatOverride: null, noiseOverride: null });
    p.setBeatOverride(9);
    await p.playCustom(PRESETS[0]?.sbg ?? '');
    expect(p.snapshot().beatOverride).toBeNull();
    const q = new Player(engine(), fakeClock(), undefined, { ...none, toEvents: () => [{ tSec: 0, voice: draftVoice, ramp: false, line: 0 }] });
    q.setBeatOverride(9);
    await q.playTemplate({ id: 't', name: 't', recommendedMinutes: 5, category: 'c', vibe: 'v' });
    expect(q.snapshot().beatOverride).toBeNull();
    p.setBeatOverride(9);
    p.playMix(makeMix(draft, 'm', 5));
    expect(p.snapshot().beatOverride).toBeNull();
  });

  it('round trips through a saved mix', async () => {
    const { eng, p } = await started();
    p.setBeatOverride(7.5);
    p.setNoiseOverride({ noise: 'violet', noiseLevel: 0.4 });
    const d = p.getMixDraft();
    expect(d).toMatchObject({ beatOverride: 7.5, noiseOverride: { noise: 'violet', noiseLevel: 0.4 } });
    const mix = makeMix(d as MixDraft, 'saved', 5);
    expect(mix.beatOverride).toBe(7.5);
    const other = new Player(eng, fakeClock(), undefined, none);
    other.playMix(mix);
    expect(other.snapshot()).toMatchObject({ beatOverride: 7.5, noiseOverride: { noise: 'violet', noiseLevel: 0.4 } });
    expect(other.snapshot().voice).toMatchObject({ beatHz: 7.5, noise: 'violet', noiseLevel: 0.4 });
  });

  it('mix validation clamps stored overrides', () => {
    const m = makeMix({ ...draft, beatOverride: 900, noiseOverride: { noise: 'violet', noiseLevel: 9 } }, 'x', 5);
    expect(m.beatOverride).toBe(40);
    expect(m.noiseOverride).toEqual({ noise: 'violet', noiseLevel: 1 });
    const bad = makeMix({ ...draft, beatOverride: Number.NaN, noiseOverride: { noise: 'x' as never } }, 'x', 5);
    expect(bad.beatOverride).toBeUndefined();
    expect(bad.noiseOverride).toBeUndefined();
  });
});
