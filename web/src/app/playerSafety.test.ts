// MOCKED: the audio engine is a stub in this file. Real output is read by verify:e2e (web/scripts/e2e-core-checks.mjs).
import { describe, expect, it, vi } from 'vitest';
import type { Voice } from '../sbg';
import { PRESETS } from '../sbg';
import type { AudioEngine, EngineStatus } from '../audio/types';
import type { CrewState } from './crew';
import { fakeClock } from './fakeClock.testutil';
import type { FakeClock } from './fakeClock.testutil';
import { CREW_GAIN_SLEW_PER_SEC, MAX_GAIN, Player } from './player';

const crew = (gain: number, transitionSec: number, sbg: string | null = null): CrewState => ({
  version: 1,
  at: 1,
  burnout: { score: 70, level: 'recovery' },
  target: { beatHz: 6, carrierHz: 180, gain, transitionSec, breathe: false },
  sbg,
});

function setup() {
  const clock = fakeClock();
  const calls: Voice[] = [];
  const engine = {
    start: vi.fn(async (_v: Voice) => undefined),
    stop: vi.fn(async () => undefined),
    setVoice: vi.fn((v: Voice) => void calls.push(v)),
  };
  const player = new Player(engine, clock, undefined, { storage: null });
  return { player, clock, calls };
}

describe('user gain ceiling (audit M1)', () => {
  it('keeps a floor-trimmed session silent when the crew asks for 0.85', async () => {
    const { player, clock, calls } = setup();
    await player.play();
    for (let i = 0; i < 40; i++) player.nudgeGain(-0.05);
    expect(player.snapshot().voice.gain).toBe(0);
    player.applyCrew(crew(0.85, 5));
    for (let s = 0; s < 30; s++) {
      clock.advance(1000);
      expect(player.snapshot().voice.gain).toBeLessThanOrEqual(1e-9);
    }
    expect(Math.max(...calls.map((c) => c.gain))).toBeLessThanOrEqual(MAX_GAIN);
  });

  it('clamps crew gain to the level at the last user action', async () => {
    const { player, clock } = setup();
    await player.play();
    const heard = player.snapshot().voice.gain;
    player.applyCrew(crew(0.85, 1));
    clock.advance(120_000);
    expect(player.snapshot().voice.gain).toBeLessThanOrEqual(heard + 1e-9);
  });

  it('applies the clamp to crew sbg scripts too', async () => {
    const { player, clock } = setup();
    await player.play();
    for (let i = 0; i < 40; i++) player.nudgeGain(-0.05);
    player.applyCrew(crew(0.3, 1, 'mode: bin\nx: 300+8/0.85\n00:00:00 x\n'));
    clock.advance(60_000);
    expect(player.snapshot().voice.gain).toBeLessThanOrEqual(1e-9);
  });

  it('slews rises at 0.02 per second after the user raises the ceiling', async () => {
    const { player, clock } = setup();
    await player.play();
    for (let i = 0; i < 40; i++) player.nudgeGain(-0.05);
    player.applyCrew(crew(0.85, 1));
    for (let i = 0; i < 40; i++) player.nudgeGain(0.05);
    const start = player.snapshot().voice.gain;
    expect(start).toBeLessThanOrEqual(MAX_GAIN);
    let prev = start;
    for (let i = 0; i < 100; i++) {
      clock.advance(100);
      const g = player.snapshot().voice.gain;
      expect(g - prev).toBeLessThanOrEqual(CREW_GAIN_SLEW_PER_SEC * 0.1 + 1e-9);
      prev = g;
    }
  });

  it('lets an explicit user nudge raise the ceiling', async () => {
    const { player, clock } = setup();
    await player.play();
    for (let i = 0; i < 40; i++) player.nudgeGain(-0.05);
    player.applyCrew(crew(0.5, 1));
    player.nudgeGain(0.05);
    clock.advance(120_000);
    const g = player.snapshot().voice.gain;
    expect(g).toBeGreaterThan(0);
    expect(g).toBeLessThanOrEqual(0.05 + 1e-9);
  });
});

describe('trim reset and layer override keys', () => {
  it('resets gainTrim on selectPreset and enterCrew', async () => {
    const { player } = setup();
    player.nudgeGain(0.05);
    expect(player.snapshot().gainTrim).not.toBe(0);
    player.selectPreset(PRESETS[1]?.id ?? '');
    expect(player.snapshot().gainTrim).toBe(0);
    player.nudgeGain(-0.05);
    player.followCrew();
    player.applyCrew(crew(0.3, 1));
    player.followCrew();
    expect(player.snapshot().gainTrim).toBe(0);
  });

  it('resets gainTrim on playAt', async () => {
    const clock = fakeClock();
    const engine = { start: vi.fn(async () => undefined), stop: vi.fn(async () => undefined), setVoice: vi.fn() };
    const toEvents = () => [{ at: 0, voice: { carrierHz: 200, beatHz: 10, gain: 0.3, mode: 'binaural' } }] as never;
    const player = new Player(engine, clock, undefined, { storage: null, toEvents });
    player.nudgeGain(0.05);
    await player.playTemplate({ id: 't', name: 'T', recommendedMinutes: 5, category: 'c', vibe: 'v' });
    expect(player.snapshot().gainTrim).toBe(0);
  });

  it('ignores prototype-chain keys in setLayerOverride', () => {
    const { player } = setup();
    player.setLayerOverride({ constructor: 1, toString: 2 } as never);
    expect(Object.keys(player.snapshot().layerOverrides)).toEqual([]);
    expect(player.snapshot().overridden).toBe(false);
  });
});

// ---- M2: play/stop serialization against an engine with async delays ----

function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Engine whose start/stop complete only when the fake clock reaches their due time. */
function delayedEngine(clock: FakeClock, rnd: () => number) {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  let pendingStop: Promise<void> | null = null;
  const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
    const due = clock.now() + ms;
    const id = clock.setInterval(() => {
      if (clock.now() >= due) { clock.clearInterval(id); resolve(); }
    }, 10);
  });
  const eng = {
    status,
    start: async (_v: Voice): Promise<void> => {
      if (pendingStop !== null) await pendingStop;
      if (status.state === 'running') return;
      status.state = 'starting';
      await sleep(Math.floor(rnd() * 400));
      status.state = 'running';
    },
    stop: (): Promise<void> => {
      if (pendingStop !== null) return pendingStop;
      if (status.state !== 'running') return Promise.resolve();
      status.state = 'stopping';
      pendingStop = sleep(350 + Math.floor(rnd() * 100)).then(() => {
        status.state = 'stopped';
        pendingStop = null;
      });
      return pendingStop;
    },
    setVoice: (): void => undefined,
  };
  return eng as unknown as Pick<AudioEngine, 'start' | 'stop' | 'setVoice' | 'status'>;
}

describe('play/stop serialization (audit M2)', () => {
  it('converges UI state to engine state over 50 random toggle sequences', async () => {
    for (let seed = 1; seed <= 50; seed++) {
      const rnd = prng(seed);
      const clock = fakeClock();
      const engine = delayedEngine(clock, rnd);
      const player = new Player(engine, clock, undefined, { storage: null });
      const n = 3 + Math.floor(rnd() * 10);
      for (let i = 0; i < n; i++) {
        if (rnd() < 0.6) void player.play();
        else void player.stop();
        clock.advance(Math.floor(rnd() * 300));
        await Promise.resolve();
      }
      for (let i = 0; i < 40; i++) {
        clock.advance(100);
        await new Promise<void>((r) => setTimeout(r, 0));
      }
      const running = engine.status?.state === 'running';
      expect(engine.status?.state === 'starting' || engine.status?.state === 'stopping').toBe(false);
      expect(player.snapshot().playing, `seed ${seed}`).toBe(running);
    }
  });

  it('reverts to stopped when the engine fails to start', async () => {
    const clock = fakeClock();
    const status: EngineStatus = { state: 'idle', sampleRate: 0, usesSharedMemory: false, crossOriginIsolated: false };
    const engine = {
      status,
      start: async (): Promise<void> => void (status.state = 'error'),
      stop: async (): Promise<void> => undefined,
      setVoice: (): void => undefined,
    };
    const player = new Player(engine, clock, undefined, { storage: null });
    await player.play();
    expect(player.snapshot().playing).toBe(false);
  });
});
