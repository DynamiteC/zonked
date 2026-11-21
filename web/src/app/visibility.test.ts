// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import type { AudioContextStateLike } from '../audio/types';
import { bindVisibility, recoverAudio } from './visibility';

function deps(state: AudioContextStateLike, playing: boolean) {
  const resume = vi.fn(async () => true);
  return { engine: { contextState: () => state, resume }, isPlaying: () => playing, resume };
}

describe('recoverAudio', () => {
  it('resumes a suspended or interrupted context while playing', async () => {
    for (const s of ['suspended', 'interrupted'] as const) {
      const d = deps(s, true);
      expect(await recoverAudio(d)).toBe(true);
      expect(d.resume).toHaveBeenCalledTimes(1);
    }
  });
  it('never auto-starts when stopped, running or without a context', async () => {
    expect(await recoverAudio(deps('suspended', false))).toBe(false);
    expect(await recoverAudio(deps('running', true))).toBe(false);
    expect(await recoverAudio(deps('none', true))).toBe(false);
    const d = deps('suspended', false);
    await recoverAudio(d);
    expect(d.resume).not.toHaveBeenCalled();
  });
  it('tolerates engines without resume and failing resume', async () => {
    expect(await recoverAudio({ engine: { contextState: () => 'suspended' }, isPlaying: () => true })).toBe(false);
    const bad = { engine: { contextState: () => 'suspended' as const, resume: async () => { throw new Error('x'); } }, isPlaying: () => true };
    await expect(recoverAudio(bad)).resolves.toBe(true);
  });
});

describe('bindVisibility', () => {
  it('resumes on visibilitychange and pageshow, and unbinds', async () => {
    const d = deps('suspended', true);
    const onVis = vi.fn();
    const unbind = bindVisibility({ ...d, onVisibility: onVis });
    document.dispatchEvent(new Event('visibilitychange'));
    await Promise.resolve();
    expect(d.resume).toHaveBeenCalledTimes(1);
    expect(onVis).toHaveBeenCalledWith(false);
    window.dispatchEvent(new Event('pageshow'));
    await Promise.resolve();
    expect(d.resume).toHaveBeenCalledTimes(2);
    unbind();
    window.dispatchEvent(new Event('pageshow'));
    await Promise.resolve();
    expect(d.resume).toHaveBeenCalledTimes(2);
  });
});
