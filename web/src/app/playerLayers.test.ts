import { describe, expect, it, vi } from 'vitest';
import type { Voice } from '../sbg';
import { NO_LAYERS } from '../sbg/layers';
import { fakeClock } from './fakeClock.testutil';
import { MAX_GAIN, Player, clampLayerValue } from './player';

function setup() {
  const calls: Voice[] = [];
  const engine = {
    start: vi.fn(async (_v: Voice) => undefined),
    stop: vi.fn(async () => undefined),
    setVoice: vi.fn((v: Voice) => void calls.push(v)),
  };
  const player = new Player(engine, fakeClock(), undefined, { storage: null });
  return { player, engine, calls };
}

describe('layer overrides', () => {
  it('applies clamped overrides to the effective voice and snapshot', async () => {
    const { player, calls } = setup();
    await player.play();
    player.setLayerOverride({ lofiLevel: 5, padLevel: -2, percBpm: 9999, instKind: 1.6 });
    const l = player.snapshot().voice.layers;
    expect(l?.lofiLevel).toBe(1);
    expect(l?.padLevel).toBe(0);
    expect(l?.percBpm).toBe(180);
    expect(l?.instKind).toBe(2);
    expect(calls.at(-1)?.layers?.lofiLevel).toBe(1);
    expect(player.snapshot().layerOverrides.lofiLevel).toBe(1);
  });

  it('ignores unknown keys and non-finite values, and clear restores', () => {
    const { player } = setup();
    player.setLayerOverride({ chimeLevel: Number.NaN, bogus: 1 } as never);
    expect(player.snapshot().voice.layers?.chimeLevel).toBe(NO_LAYERS.chimeLevel);
    expect(player.snapshot().layerOverrides).not.toHaveProperty('bogus');
    player.setLayerOverride({ crackle: 0.4 });
    expect(player.snapshot().voice.layers?.crackle).toBe(0.4);
    player.clearLayerOverrides();
    expect(player.snapshot().voice.layers?.crackle ?? 0).toBe(0);
    expect(player.snapshot().layerOverrides).toEqual({});
  });

  it('never lets master gain exceed the cap while layers are overridden', async () => {
    const { player } = setup();
    await player.play();
    player.nudgeGain(5);
    player.setLayerOverride({ lofiLevel: 1 });
    expect(player.snapshot().voice.gain).toBeLessThanOrEqual(MAX_GAIN);
  });

  it('clampLayerValue bounds roots', () => {
    expect(clampLayerValue('instRootHz', 1)).toBe(55);
    expect(clampLayerValue('padRootHz', 9000)).toBe(440);
    expect(clampLayerValue('chimeRatePerMin', 0)).toBe(1);
  });
});
