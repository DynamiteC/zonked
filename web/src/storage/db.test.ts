import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { makeMix } from '../app/mixes';
import { createStore } from './db';
import { readFlag, writeFlag } from './prefs';

function rawPut(f: IDBFactory, store: string, rec: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const r = f.open('zonked');
    r.onsuccess = () => {
      const tx = r.result.transaction(store, 'readwrite');
      tx.objectStore(store).put(rec);
      tx.oncomplete = () => { r.result.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    };
    r.onerror = () => reject(r.error);
  });
}

describe('IndexedDB read validation', () => {
  it('drops malformed script and log records', async () => {
    const f = new IDBFactory();
    const s = createStore(f);
    await s.saveScript('good', 'text');
    await s.addLog({ startedAt: 5, endedAt: 6, peakScore: 1, presetId: 'p' });
    await rawPut(f, 'scripts', { id: 100, name: { evil: 1 }, text: 'x', updatedAt: 1 });
    await rawPut(f, 'scripts', { id: 101, name: 'n', text: 42, updatedAt: 1 });
    await rawPut(f, 'scripts', { id: 102, name: 'n'.repeat(500), text: 'x', updatedAt: 1 });
    await rawPut(f, 'scripts', { id: 103, name: 'big', text: 'x'.repeat(262145), updatedAt: 1 });
    await rawPut(f, 'scripts', { id: 104, name: 'nan', text: 'x', updatedAt: Number.NaN });
    await rawPut(f, 'logs', { id: 100, startedAt: 'x', endedAt: 1, peakScore: 1, presetId: 'p' });
    await rawPut(f, 'logs', { id: 101, startedAt: 9, endedAt: 9, peakScore: Number.POSITIVE_INFINITY, presetId: 'p' });
    await rawPut(f, 'logs', { id: 102, startedAt: 9, endedAt: 9, peakScore: 1, presetId: { a: 1 } });
    expect((await s.listScripts()).map((r) => r.name)).toEqual(['good']);
    expect((await s.listLogs()).map((l) => l.startedAt)).toEqual([5]);
  });
});

describe('IndexedDB store', () => {
  it('saves, lists, overwrites by name and deletes scripts', async () => {
    const s = createStore(new IDBFactory());
    expect(await s.persistent()).toBe(true);
    const a = await s.saveScript('one', 'x: 200+10\n00:00:00 x\n');
    await s.saveScript('two', 'b');
    const again = await s.saveScript('one', 'changed');
    expect(again.id).toBe(a.id);
    const list = await s.listScripts();
    expect(list).toHaveLength(2);
    expect(list.find((r) => r.name === 'one')?.text).toBe('changed');
    await s.deleteScript(a.id);
    expect((await s.listScripts()).map((r) => r.name)).toEqual(['two']);
  });

  it('stores logs newest first with a limit', async () => {
    const s = createStore(new IDBFactory());
    for (let i = 1; i <= 3; i++) await s.addLog({ startedAt: i, endedAt: i + 1, peakScore: i * 10, presetId: 'deep-focus' });
    const logs = await s.listLogs(2);
    expect(logs.map((l) => l.startedAt)).toEqual([3, 2]);
    expect(logs[0]?.peakScore).toBe(30);
  });

  it('rejects oversized scripts and defaults the name', async () => {
    const s = createStore(new IDBFactory());
    await expect(s.saveScript('big', 'x'.repeat(262145))).rejects.toBeInstanceOf(RangeError);
    expect((await s.saveScript('  ', 'a')).name).toBe('Untitled');
  });

  it('falls back to memory when IndexedDB is missing', async () => {
    const s = createStore(undefined);
    expect(await s.persistent()).toBe(false);
    await s.saveScript('m', 'a');
    await s.addLog({ startedAt: 1, endedAt: 2, peakScore: 5, presetId: 'p' });
    expect(await s.listScripts()).toHaveLength(1);
    expect(await s.listLogs()).toHaveLength(1);
    await s.deleteScript(1);
    expect(await s.listScripts()).toHaveLength(0);
  });

  it('falls back to memory when open fails', async () => {
    const broken = {
      open() {
        const r: Record<string, unknown> = {};
        queueMicrotask(() => (r['onerror'] as (() => void) | undefined)?.());
        return r;
      },
    } as unknown as IDBFactory;
    const s = createStore(broken);
    await s.saveScript('m', 'a');
    expect(await s.persistent()).toBe(false);
    expect(await s.listScripts()).toHaveLength(1);
  });
});

describe('prefs', () => {
  it('reads and writes flags and tolerates throwing storage', () => {
    const mem = new Map<string, string>();
    const ls = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    expect(readFlag('k', ls)).toBe(false);
    writeFlag('k', true, ls);
    expect(readFlag('k', ls)).toBe(true);
    const bad = {
      getItem: () => {
        throw new Error('x');
      },
      setItem: () => {
        throw new Error('x');
      },
    };
    expect(readFlag('k', bad)).toBe(false);
    expect(() => writeFlag('k', true, bad)).not.toThrow();
  });
});

describe('storage v2 (mixes and records)', () => {
  const draft = {
    source: { kind: 'custom', id: 'custom' },
    voice: { carrierHz: 200, beatHz: 8, mode: 'binaural', noise: 'off', noiseLevel: 0, gain: 0.3 },
    layers: {},
    timer: { kind: 'none' },
  } as const;

  function openV1(f: IDBFactory): Promise<void> {
    return new Promise((resolve, reject) => {
      const r = f.open('zonked', 1);
      r.onupgradeneeded = () => {
        r.result.createObjectStore('scripts', { keyPath: 'id', autoIncrement: true });
        r.result.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
      };
      r.onsuccess = () => {
        const tx = r.result.transaction(['scripts', 'logs'], 'readwrite');
        tx.objectStore('scripts').put({ name: 'old', text: 'text', updatedAt: 5 });
        tx.objectStore('logs').put({ startedAt: 1, endedAt: 2, peakScore: 3, presetId: 'p' });
        tx.oncomplete = () => { r.result.close(); resolve(); };
        tx.onerror = () => reject(tx.error);
      };
      r.onerror = () => reject(r.error);
    });
  }

  it('upgrades a v1 database and keeps scripts and logs', async () => {
    const f = new IDBFactory();
    await openV1(f);
    const s = createStore(f);
    expect((await s.listScripts()).map((x) => x.name)).toEqual(['old']);
    expect(await s.listLogs()).toHaveLength(1);
    expect((await s.listLogs())[0]).not.toHaveProperty('endKind');
    expect(await s.listMixes()).toEqual([]);
    expect(await s.persistent()).toBe(true);
  });

  it('saves, lists, overwrites and deletes mixes, and survives a reopen', async () => {
    const f = new IDBFactory();
    const s = createStore(f);
    const m = makeMix(draft, 'one', 10);
    await s.putMix(m);
    await s.putMix({ ...m, name: 'renamed', updatedAt: 20 });
    expect((await createStore(f).listMixes()).map((x) => x.name)).toEqual(['renamed']);
    await s.deleteMix(m.id);
    expect(await s.listMixes()).toEqual([]);
  });

  it('drops malformed mix records and caps the count', async () => {
    const f = new IDBFactory();
    const s = createStore(f);
    await s.putMix(makeMix(draft, 'ok', 10));
    await rawPut(f, 'mixes', { id: 'bad', v: 5 });
    expect(await s.listMixes()).toHaveLength(1);
    for (let i = 0; i < 198; i += 1) await s.putMix(makeMix(draft, `n${i}`, 10 + i, () => i / 1000));
    await expect(s.putMix(makeMix(draft, 'over', 5000, () => 0.999))).rejects.toThrow(RangeError);
  });

  it('stores records and clears the sanctuary data', async () => {
    const f = new IDBFactory();
    const s = createStore(f);
    await s.setRecord('favorites', { v: 1, items: [] });
    expect(await s.getRecord('favorites')).toEqual({ v: 1, items: [] });
    expect(await s.getRecord('milestones')).toBeUndefined();
    await s.addLog({ startedAt: 1, endedAt: 99_999, peakScore: 0, presetId: 'p', endKind: 'sleep-fade', breaks: 2 });
    expect((await s.listLogs())[0]).toMatchObject({ endKind: 'sleep-fade', breaks: 2 });
    await s.saveScript('keep', 'x');
    await s.clearSanctuary();
    expect(await s.getRecord('favorites')).toBeUndefined();
    expect(await s.listLogs()).toEqual([]);
    expect(await s.listScripts()).toHaveLength(1);
  });

  it('works in memory when IndexedDB is missing', async () => {
    const s = createStore(undefined);
    await s.putMix(makeMix(draft, 'mem', 1));
    expect(await s.listMixes()).toHaveLength(1);
    await s.setRecord('milestones', { a: 1 });
    expect(await s.getRecord('milestones')).toEqual({ a: 1 });
    await s.deleteMix((await s.listMixes())[0]?.id ?? '');
    expect(await s.listMixes()).toEqual([]);
    await s.addLog({ startedAt: 1, endedAt: 2, peakScore: 0, presetId: 'p' });
    await s.clearSanctuary();
    expect(await s.listLogs()).toEqual([]);
    for (let i = 0; i < 200; i += 1) await s.putMix(makeMix(draft, `n${i}`, 10, () => i / 1000));
    await expect(s.putMix(makeMix(draft, 'over', 5000, () => 0.999))).rejects.toThrow(RangeError);
  });

  it('cleans bad optional log fields on read', async () => {
    const f = new IDBFactory();
    const s = createStore(f);
    await s.persistent();
    await rawPut(f, 'logs', { id: 7, startedAt: 1, endedAt: 2, peakScore: 0, presetId: 'p', endKind: 'evil', breaks: -4, extra: 1 });
    const l = (await s.listLogs())[0];
    expect(l).toEqual({ id: 7, startedAt: 1, endedAt: 2, peakScore: 0, presetId: 'p' });
  });
});
