import { describe, expect, it, vi } from 'vitest';
import { createUpdateGate } from './swUpdate';

describe('update gate', () => {
  it('does not apply while playing, applies once after stop', () => {
    const apply = vi.fn();
    const g = createUpdateGate(apply);
    g.setPlaying(true);
    g.needRefresh();
    expect(apply).not.toHaveBeenCalled();
    g.setPlaying(false);
    expect(apply).toHaveBeenCalledTimes(1);
    g.setPlaying(true);
    g.setPlaying(false);
    g.needRefresh();
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('applies at once when idle', () => {
    const apply = vi.fn();
    createUpdateGate(apply).needRefresh();
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('has no dismiss: a waiting update is applied the first time playback is idle, however long it waited', () => {
    const apply = vi.fn();
    const g = createUpdateGate(apply);
    g.setPlaying(true);
    g.needRefresh();
    g.needRefresh();
    for (let i = 0; i < 50; i += 1) g.setPlaying(true);
    expect(apply).not.toHaveBeenCalled();
    g.setPlaying(false);
    expect(apply).toHaveBeenCalledTimes(1);
  });
});
