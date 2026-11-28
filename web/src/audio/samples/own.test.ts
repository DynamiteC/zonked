import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { MAX_OWN_BYTES, TARGET_PEAK, crossfadeLoop, mixToMono, prepareOwn } from './own';
import {
  MAX_OWN_SOUNDS, MAX_OWN_TOTAL_BYTES, addOwn, cleanName, getOwnBytes, isOwnId, listOwn, removeAllOwn, removeOwn, validateOwn,
} from '../../ui/calm/nature/ownStore';

const sine = (n: number, amp = 1): Float32Array => Float32Array.from({ length: n }, (_, i) => amp * Math.sin(i / 10));

describe('own sound preparation', () => {
  it('mixes channels to mono and treats NaN and infinity as silence', () => {
    const mono = mixToMono([Float32Array.of(1, Number.NaN, 0.5), Float32Array.of(-1, Number.POSITIVE_INFINITY, 0.5)]);
    expect(Array.from(mono)).toEqual([0, 0, 0.5]);
  });

  it('normalises the peak to the shipped loop level', () => {
    const r = prepareOwn([sine(8000, 1)], 8000);
    expect(r.ok && Math.max(...r.data.map(Math.abs))).toBeCloseTo(TARGET_PEAK, 3);
    const quiet = prepareOwn([sine(8000, 0.001)], 8000);
    expect(quiet.ok && Math.max(...quiet.data.map(Math.abs))).toBeCloseTo(TARGET_PEAK, 3);
  });

  it('plays once under 20 s and loops with a 2 s crossfade from 20 s', () => {
    const short = prepareOwn([sine(19 * 100, 1)], 100);
    expect(short.ok && short.loop).toBe(false);
    const long = prepareOwn([sine(30 * 100, 1)], 100);
    expect(long.ok && long.loop).toBe(true);
    expect(long.ok && long.data.length).toBe(30 * 100 - 2 * 100);
  });

  it('rejects silence, over 10 minutes and bad input without throwing', () => {
    expect(prepareOwn([new Float32Array(1000)], 100).ok).toBe(false);
    expect(prepareOwn([sine(601 * 10)], 10).ok).toBe(false);
    expect(prepareOwn([], 44100).ok).toBe(false);
    expect(prepareOwn([sine(100)], Number.NaN).ok).toBe(false);
  });

  it('the loop seam is continuous: the last sample leads into the first', () => {
    const src = sine(1000, 0.4);
    const out = crossfadeLoop(src, 100);
    expect(Math.abs((out[0] ?? 0) - (src[900] ?? 0))).toBeLessThan(0.02);
  });
});

describe('own sound store', () => {
  const fresh = (): IDBFactory => new IDBFactory();
  const bytes = (n: number): ArrayBuffer => new Uint8Array(n).fill(7).buffer;

  it('stores name and bytes, lists, reads back and removes', async () => {
    const idb = fresh();
    const a = await addOwn('  Rain\u0000 on roof ', bytes(100), idb);
    expect(a.ok && a.value.name).toBe('Rain on roof');
    const list = await listOwn(idb);
    expect(list.ok && list.value.length).toBe(1);
    if (!a.ok) throw new Error('add failed');
    const got = await getOwnBytes(a.value.id, idb);
    expect(got.ok && got.value.byteLength).toBe(100);
    expect((await removeOwn(a.value.id, idb)).ok).toBe(true);
    expect((await listOwn(idb)).ok && (await listOwn(idb)).ok).toBe(true);
  });

  it('caps the count at 5 and the total at 20 MB with plain messages', async () => {
    const idb = fresh();
    for (let i = 0; i < MAX_OWN_SOUNDS; i++) expect((await addOwn(`s${i}`, bytes(10), idb)).ok).toBe(true);
    const sixth = await addOwn('six', bytes(10), idb);
    expect(!sixth.ok && sixth.error).toMatch(/5 sounds/);
    const idb2 = fresh();
    for (let i = 0; i < 2; i++) await addOwn(`b${i}`, bytes(MAX_OWN_BYTES), idb2);
    const over = await addOwn('c', bytes(MAX_OWN_BYTES), idb2);
    expect(MAX_OWN_BYTES * 3).toBeGreaterThan(MAX_OWN_TOTAL_BYTES);
    expect(!over.ok && over.error).toMatch(/20 MB/);
  });

  it('refuses a file over 8 MB and removes everything on Remove all', async () => {
    const idb = fresh();
    const big = await addOwn('big', bytes(MAX_OWN_BYTES + 1), idb);
    expect(!big.ok && big.error).toMatch(/8 MB/);
    await addOwn('a', bytes(5), idb);
    await addOwn('b', bytes(5), idb);
    expect((await removeAllOwn(idb)).ok).toBe(true);
    const l = await listOwn(idb);
    expect(l.ok && l.value.length).toBe(0);
  });

  it('returns a message, never a throw, when storage is missing', async () => {
    const r = await addOwn('x', bytes(5), null);
    expect(!r.ok && r.error).toMatch(/cannot keep sounds/);
    expect(isOwnId('own:abc123')).toBe(true);
    expect(isOwnId('../x')).toBe(false);
    expect(cleanName('\u0001\u0002')).toBe('My sound');
  });

  it('validates by decoding and reports decode failure and long files', async () => {
    const bad = await validateOwn(bytes(10), async () => { throw new Error('no'); });
    expect(!bad.ok && bad.error).toMatch(/not a sound/);
    const long = await validateOwn(bytes(10), async () => ({ channels: [sine(601 * 10)], sampleRate: 10 }));
    expect(!long.ok && long.error).toMatch(/10 minutes/);
    const good = await validateOwn(bytes(10), async () => ({ channels: [sine(1000)], sampleRate: 100 }));
    expect(good.ok).toBe(true);
  });
});
