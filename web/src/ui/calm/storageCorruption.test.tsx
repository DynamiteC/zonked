// @vitest-environment jsdom
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioEngine, EngineStatus } from '../../audio/types';
import { createStore } from '../../storage/db';
import { SAFETY_KEY, readFlag } from '../../storage/prefs';
import { ModeRoot } from './ModeRoot';

/** Every localStorage key the app reads. A new key must be added here; the first test fails when one is missing. */
const KEYS = [
  'zonked.safety.v1', 'zonked.profile.v1', 'zonked.journeys.v1', 'zonked.last.v1', 'zonked.feel.v1', 'zonked.look.v1',
  'zonked.theme.v1', 'zonked.theme.v2', 'zonked.device.v1', 'zonked.mysounds.v1', 'zonked.nature.v1', 'zonked.reduceMotion',
  'zonked.motion', 'zonked.wakeLock', 'zonked.crew.v1', 'zonked.advanced.v1', 'zonked.timer.v1', 'zonked.guide.v1',
] as const;
const JUNK = ['{', 'null', '[]', '"x"', '9'.repeat(5000), '{"v":999,"a":{"__proto__":{"x":1}}}', '{"goal":{"a":1},"device":7}', '\u0000\ud800'];

function engine(): AudioEngine {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  return {
    status, telemetry: { read: () => 0 },
    start: vi.fn(async () => void (status.state = 'running')),
    stop: vi.fn(async () => void (status.state = 'stopped')),
    setVoice: vi.fn(), getStats: vi.fn(async () => ({ peak: 0, rms: 0, frames: 0, nonZero: 0 })), onStatus: () => () => undefined,
  } as unknown as AudioEngine;
}

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(cleanup);

describe('storage corruption (mocked engine, jsdom)', () => {
  it('lists every zonked. key that the source reads', async () => {
    const { readdirSync, readFileSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');
    const found = new Set<string>();
    const walk = (d: string): void => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.tsx?$/.test(n) && !/\.test\./.test(n)) for (const m of readFileSync(p, 'utf8').matchAll(/'(zonked\.[A-Za-z0-9.]+[A-Za-z0-9])'/g)) found.add(m[1] ?? '');
      }
    };
    walk(join(process.cwd(), 'src'));
    const known = new Set<string>(KEYS);
    const missing = [...found].filter((k) => !known.has(k) && !['zonked.probe', 'zonked.nothing'].includes(k));
    expect(missing).toEqual([]);
  });

  it.each(KEYS)('a junk value in %s never crashes the app and never grants the safety notice', async (key) => {
    for (const junk of JUNK) {
      localStorage.clear();
      localStorage.setItem(key, junk);
      const eng = engine();
      const { unmount } = render(<ModeRoot engine={eng} store={createStore(undefined)} />);
      await waitFor(() => expect(document.querySelector('.c-loading')).toBeNull());
      await waitFor(() => expect((document.body.textContent ?? '').length).toBeGreaterThan(40));
      expect(eng.start).not.toHaveBeenCalled();
      if (key === SAFETY_KEY) expect(readFlag(SAFETY_KEY)).toBe(false);
      unmount();
    }
  });
});
