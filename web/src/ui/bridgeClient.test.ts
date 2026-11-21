// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import type { CrewState } from '../app/crew';
import { BridgeClient, backoffDelay, setCrewEnabled, CREW_KEY } from './bridgeClient';
import type { BridgeStatus, EventSourceLike } from './bridgeClient';

class FakeES implements EventSourceLike {
  closed = false;
  private ls = new Map<string, Array<(e: { data?: unknown }) => void>>();
  addEventListener(t: string, l: (e: { data?: unknown }) => void): void {
    this.ls.set(t, [...(this.ls.get(t) ?? []), l]);
  }
  close(): void {
    this.closed = true;
  }
  emit(t: string, data?: unknown): void {
    for (const l of this.ls.get(t) ?? []) l({ data });
  }
}

const good = JSON.stringify({
  version: 1,
  at: 1,
  burnout: { score: 42, level: 'flow' },
  target: { beatHz: 10, carrierHz: 200, gain: 0.4, transitionSec: 30, breathe: false },
  sbg: null,
});

function setup(createImpl?: () => EventSourceLike | null) {
  const sources: FakeES[] = [];
  const timers: Array<{ fn: () => void; ms: number }> = [];
  const states: CrewState[] = [];
  const statuses: BridgeStatus[] = [];
  const client = new BridgeClient({
    create: createImpl ?? (() => {
      const s = new FakeES();
      sources.push(s);
      return s;
    }),
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: () => undefined,
    onState: (s) => states.push(s),
    onStatus: (s) => statuses.push(s),
  });
  return { client, sources, timers, states, statuses };
}

describe('backoffDelay', () => {
  it('doubles from 1 s and caps at 30 s', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 50].map(backoffDelay)).toEqual([1000, 2000, 4000, 8000, 16000, 30000, 30000, 30000]);
    expect(backoffDelay(NaN)).toBe(1000);
  });
});

describe('opt-in gating', () => {
  it('makes no connection until crew is enabled, then connects and disconnects at once', () => {
    let on = false;
    const created: FakeES[] = [];
    const statuses: BridgeStatus[] = [];
    const client = new BridgeClient({
      enabled: () => on,
      create: () => {
        const s = new FakeES();
        created.push(s);
        return s;
      },
      onState: () => undefined,
      onStatus: (s) => statuses.push(s),
    });
    client.start();
    expect(created).toHaveLength(0);
    expect(client.getStatus()).toBe('standalone');
    on = true;
    setCrewEnabled(true);
    expect(created).toHaveLength(1);
    created[0]?.emit('open');
    expect(client.getStatus()).toBe('connected');
    on = false;
    setCrewEnabled(false);
    expect(created[0]?.closed).toBe(true);
    expect(client.getStatus()).toBe('standalone');
    client.stop();
    localStorage.removeItem(CREW_KEY);
  });

  it('never builds an EventSource by default with no flag', () => {
    localStorage.removeItem(CREW_KEY);
    const real = (globalThis as { EventSource?: unknown }).EventSource;
    let made = 0;
    (globalThis as { EventSource?: unknown }).EventSource = class {
      constructor() {
        made += 1;
      }
    };
    const client = new BridgeClient({ onState: () => undefined, onStatus: () => undefined });
    client.start();
    client.stop();
    (globalThis as { EventSource?: unknown }).EventSource = real;
    expect(made).toBe(0);
  });
});

describe('BridgeClient', () => {
  it('connects, validates and delivers state', () => {
    const { client, sources, states, statuses } = setup();
    client.start();
    sources[0]?.emit('open');
    sources[0]?.emit('state', good);
    expect(statuses).toEqual(['connected']);
    expect(states[0]?.burnout.score).toBe(42);
  });

  it('ignores malformed, oversized and invalid payloads without throwing', () => {
    const { client, sources, states } = setup();
    client.start();
    const es = sources[0];
    es?.emit('state', '{not json');
    es?.emit('state', 42);
    es?.emit('state', 'x'.repeat(100000));
    es?.emit('state', JSON.stringify({ version: 9 }));
    expect(states).toHaveLength(0);
  });

  it('goes standalone on error and retries with doubling backoff', () => {
    const { client, sources, timers, statuses } = setup();
    client.start();
    sources[0]?.emit('open');
    sources[0]?.emit('error');
    expect(sources[0]?.closed).toBe(true);
    expect(statuses).toEqual(['connected', 'standalone']);
    expect(timers[0]?.ms).toBe(1000);
    timers[0]?.fn();
    sources[1]?.emit('error');
    expect(timers[1]?.ms).toBe(2000);
    timers[1]?.fn();
    sources[2]?.emit('error');
    expect(timers[2]?.ms).toBe(4000);
  });

  it('resets backoff after a successful open', () => {
    const { client, sources, timers } = setup();
    client.start();
    sources[0]?.emit('error');
    timers[0]?.fn();
    sources[1]?.emit('open');
    sources[1]?.emit('error');
    expect(timers[1]?.ms).toBe(1000);
  });

  it('survives a throwing or missing EventSource', () => {
    const t = setup(() => {
      throw new Error('blocked');
    });
    expect(() => t.client.start()).not.toThrow();
    expect(t.timers).toHaveLength(1);
    const n = setup(() => null);
    n.client.start();
    expect(n.timers).toHaveLength(1);
    expect(n.client.getStatus()).toBe('standalone');
  });

  it('stop cancels reconnects and closes the source', () => {
    const { client, sources, timers } = setup();
    client.start();
    sources[0]?.emit('error');
    client.stop();
    timers[0]?.fn();
    expect(sources).toHaveLength(1);
  });

  it('a throwing consumer does not break the stream', () => {
    const es = new FakeES();
    const c = new BridgeClient({
      create: () => es,
      onState: vi.fn(() => {
        throw new Error('x');
      }),
      onStatus: () => undefined,
    });
    c.start();
    expect(() => es.emit('state', good)).not.toThrow();
  });
});
