import { describe, expect, it, vi } from 'vitest';
import { WAKE_LOCK_PREF_KEY, WakeLockController } from './wakeLock';
import type { WakeLockNav } from './wakeLock';
import { memoryStorage } from './fakeClock.testutil';

function fakeNav(reject = false) {
  const sentinels: { release: ReturnType<typeof vi.fn> }[] = [];
  const request = vi.fn(async () => {
    if (reject) throw new Error('denied');
    const s = { release: vi.fn(async () => undefined) };
    sentinels.push(s);
    return s;
  });
  return { nav: { wakeLock: { request } } as WakeLockNav, request, sentinels };
}

describe('WakeLockController', () => {
  it('holds only when enabled, playing and visible; releases on stop', async () => {
    const { nav, request, sentinels } = fakeNav();
    const store = memoryStorage();
    const w = new WakeLockController(nav, store);
    await w.setPlaying(true);
    expect(request).not.toHaveBeenCalled();
    await w.setEnabled(true);
    expect(store.data.get(WAKE_LOCK_PREF_KEY)).toBe('1');
    expect(w.held).toBe(true);
    await w.setPlaying(false);
    expect(w.held).toBe(false);
    expect(sentinels[0]?.release).toHaveBeenCalled();
  });
  it('releases when hidden and re-acquires when visible', async () => {
    const { nav, request } = fakeNav();
    const w = new WakeLockController(nav, memoryStorage());
    await w.setEnabled(true);
    await w.setPlaying(true);
    await w.setHidden(true);
    expect(w.held).toBe(false);
    await w.setHidden(false);
    expect(w.held).toBe(true);
    expect(request).toHaveBeenCalledTimes(2);
  });
  it('restores the saved preference', () => {
    const store = memoryStorage();
    store.setItem(WAKE_LOCK_PREF_KEY, '1');
    expect(new WakeLockController(fakeNav().nav, store).isEnabled).toBe(true);
    expect(new WakeLockController(fakeNav().nav, memoryStorage()).isEnabled).toBe(false);
  });
  it('is safe when unsupported or rejected', async () => {
    const w = new WakeLockController({}, memoryStorage());
    expect(w.supported).toBe(false);
    await w.setEnabled(true);
    await w.setPlaying(true);
    expect(w.held).toBe(false);
    const r = new WakeLockController(fakeNav(true).nav, memoryStorage());
    await r.setEnabled(true);
    await expect(r.setPlaying(true)).resolves.toBeUndefined();
    expect(r.held).toBe(false);
  });
  it('drops the sentinel when the browser releases it', async () => {
    const listeners: (() => void)[] = [];
    const nav: WakeLockNav = {
      wakeLock: { request: async () => ({ release: async () => undefined, addEventListener: (_t, fn) => void listeners.push(fn) }) },
    };
    const w = new WakeLockController(nav, memoryStorage());
    await w.setEnabled(true);
    await w.setPlaying(true);
    expect(w.held).toBe(true);
    listeners[0]?.();
    expect(w.held).toBe(false);
  });
});
