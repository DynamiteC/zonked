import { afterEach, describe, expect, it, vi } from 'vitest';
import { SEEK_STEP_SEC, bindMediaSession, setMediaMetadata, setPlaybackState, setPositionState } from './mediaSession';

function fakeNav() {
  const handlers = new Map<string, (() => void) | null>();
  const ms = {
    metadata: null as unknown,
    playbackState: 'none',
    setActionHandler: vi.fn((a: string, h: (() => void) | null) => void handlers.set(a, h)),
    setPositionState: vi.fn(),
  };
  return { nav: { mediaSession: ms } as unknown as Navigator, ms, handlers };
}

class FakeMetadata {
  constructor(public init: Record<string, unknown>) { Object.assign(this, init); }
}

afterEach(() => vi.unstubAllGlobals());

describe('media session', () => {
  it('registers all seven handlers and routes them', () => {
    vi.stubGlobal('MediaMetadata', FakeMetadata);
    const { nav, handlers } = fakeNav();
    const h = { play: vi.fn(), pause: vi.fn(), stop: vi.fn(), next: vi.fn(), prev: vi.fn(), seekBy: vi.fn() };
    const unbind = bindMediaSession(h, nav);
    for (const a of ['play', 'pause', 'stop', 'nexttrack', 'previoustrack', 'seekforward', 'seekbackward']) {
      expect(handlers.get(a)).toBeTypeOf('function');
    }
    handlers.get('play')?.(); handlers.get('pause')?.(); handlers.get('stop')?.();
    handlers.get('nexttrack')?.(); handlers.get('previoustrack')?.();
    handlers.get('seekforward')?.(); handlers.get('seekbackward')?.();
    expect(h.play).toHaveBeenCalled(); expect(h.pause).toHaveBeenCalled(); expect(h.stop).toHaveBeenCalled();
    expect(h.next).toHaveBeenCalled(); expect(h.prev).toHaveBeenCalled();
    expect(h.seekBy).toHaveBeenNthCalledWith(1, SEEK_STEP_SEC);
    expect(h.seekBy).toHaveBeenNthCalledWith(2, -SEEK_STEP_SEC);
    unbind();
    for (const a of handlers.keys()) expect(handlers.get(a)).toBeNull();
  });
  it('omits handlers for actions that are not supplied (backward compatible)', () => {
    const { nav, handlers } = fakeNav();
    bindMediaSession({ play: vi.fn(), pause: vi.fn(), stop: vi.fn() }, nav);
    expect(handlers.get('nexttrack')).toBeNull();
    expect(handlers.get('seekforward')).toBeNull();
  });
  it('sets per-template metadata with artwork', () => {
    vi.stubGlobal('MediaMetadata', FakeMetadata);
    const { nav, ms } = fakeNav();
    setMediaMetadata({ name: 'Deep Rest', category: 'sleep' }, nav);
    const m = ms.metadata as FakeMetadata;
    expect(m.init).toMatchObject({ title: 'Deep Rest', artist: 'Zonked', album: 'Zonked' });
    const art = m.init['artwork'] as { src: string }[];
    expect(art.map((a) => a.src)).toEqual(['/pwa-512x512.png', '/pwa-192x192.png']);
    setMediaMetadata(null, nav);
    expect((ms.metadata as FakeMetadata).init['title']).toBe('Zonked');
  });
  it('guards position state', () => {
    const { nav, ms } = fakeNav();
    setPositionState(600, 700, nav);
    expect(ms.setPositionState).toHaveBeenLastCalledWith({ duration: 600, position: 600, playbackRate: 1 });
    setPositionState(600, -5, nav);
    expect(ms.setPositionState).toHaveBeenLastCalledWith({ duration: 600, position: 0, playbackRate: 1 });
    setPositionState(NaN, 5, nav);
    expect(ms.setPositionState).toHaveBeenLastCalledWith();
    setPositionState(0, 0, nav);
    expect(ms.setPositionState).toHaveBeenLastCalledWith();
    setPositionState(60, Infinity, nav);
    expect(ms.setPositionState).toHaveBeenLastCalledWith();
  });
  it('is safe without the API and sets playback state', () => {
    const none = {} as Navigator;
    expect(() => bindMediaSession({ play: vi.fn(), pause: vi.fn(), stop: vi.fn() }, none)()).not.toThrow();
    expect(() => setPositionState(10, 1, none)).not.toThrow();
    expect(() => setMediaMetadata(null, none)).not.toThrow();
    const { nav, ms } = fakeNav();
    setPlaybackState(true, nav);
    expect(ms.playbackState).toBe('playing');
  });
  it('survives a browser that rejects an action', () => {
    const { nav, ms } = fakeNav();
    ms.setActionHandler.mockImplementation(() => { throw new Error('unsupported'); });
    expect(() => bindMediaSession({ play: vi.fn(), pause: vi.fn(), stop: vi.fn() }, nav)()).not.toThrow();
  });
});
