// "My sounds": audio files a person picked on their own device. They live only in IndexedDB
// under zonked.mysounds.v1. Nothing here touches the network. Every function returns a plain
// result and never throws.
import { MAX_OWN_BYTES, MAX_OWN_SECONDS, prepareOwn } from '../../../audio/samples/own';

export const MYSOUNDS_DB = 'zonked.mysounds.v1';
export const MAX_OWN_SOUNDS = 5;
export const MAX_OWN_TOTAL_BYTES = 20 * 1024 * 1024;
const STORE = 'sounds';
const NAME_MAX = 60;

export interface OwnSoundMeta {
  readonly id: string;
  readonly name: string;
  readonly size: number;
}

interface OwnRecord extends OwnSoundMeta {
  readonly bytes: ArrayBuffer;
}

export type OwnResult<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: string };

const fail = <T>(error: string): OwnResult<T> => ({ ok: false, error });
const STORAGE_ERROR = 'Your device could not store this sound. Remove one and try again.';

export const isOwnId = (id: string): boolean => /^own:[a-z0-9]{6,40}$/.test(id);

/** Plain text, no control characters, short. The name is only ever shown as text. */
export function cleanName(raw: string): string {
  // eslint-disable-next-line no-control-regex
  const t = raw.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX);
  return t === '' ? 'My sound' : t;
}

function open(idb: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = idb.open(MYSOUNDS_DB, 1);
    req.onupgradeneeded = (): void => void req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = (): void => resolve(req.result);
    req.onerror = (): void => reject(req.error ?? new Error('open failed'));
    req.onblocked = (): void => reject(new Error('blocked'));
  });
}

function wrap<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = (): void => resolve(req.result);
    req.onerror = (): void => reject(req.error ?? new Error('request failed'));
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = (): void => resolve();
    tx.onerror = (): void => reject(tx.error ?? new Error('write failed'));
    tx.onabort = (): void => reject(tx.error ?? new Error('write aborted'));
  });
}

const defaultIdb = (): IDBFactory | null => (typeof indexedDB === 'undefined' ? null : indexedDB);

async function withDb<T>(idb: IDBFactory | null, fn: (db: IDBDatabase) => Promise<T>, message: string): Promise<OwnResult<T>> {
  if (idb === null) return fail('This browser cannot keep sounds on your device.');
  let db: IDBDatabase | null = null;
  try {
    db = await open(idb);
    return { ok: true, value: await fn(db) };
  } catch (e) {
    if (e instanceof RangeError) return fail(e.message === 'count' ? 'You can keep 5 sounds. Remove one first.' : 'Your sounds would use more than 20 MB. Remove one first.');
    const quota = e instanceof DOMException && e.name === 'QuotaExceededError';
    return fail(quota ? STORAGE_ERROR : message);
  } finally {
    db?.close();
  }
}

export async function listOwn(idb: IDBFactory | null = defaultIdb()): Promise<OwnResult<readonly OwnSoundMeta[]>> {
  return withDb(idb, async (db) => {
    const all = (await wrap(db.transaction(STORE).objectStore(STORE).getAll())) as OwnRecord[];
    return all.map((r) => ({ id: r.id, name: r.name, size: r.size }));
  }, 'Your sounds could not be read.');
}

export async function getOwnBytes(id: string, idb: IDBFactory | null = defaultIdb()): Promise<OwnResult<ArrayBuffer>> {
  if (!isOwnId(id)) return fail('Unknown sound.');
  const r = await withDb(idb, async (db) => (await wrap(db.transaction(STORE).objectStore(STORE).get(id))) as OwnRecord | undefined, 'Your sound could not be read.');
  if (!r.ok) return r;
  return r.value === undefined ? fail('That sound is gone.') : { ok: true, value: r.value.bytes };
}

/** Adds one sound. Checks count and total size first, so a full store never throws. */
export async function addOwn(name: string, bytes: ArrayBuffer, idb: IDBFactory | null = defaultIdb()): Promise<OwnResult<OwnSoundMeta>> {
  if (bytes.byteLength > MAX_OWN_BYTES) return fail('This file is bigger than 8 MB.');
  const id = `own:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const rec: OwnRecord = { id, name: cleanName(name), size: bytes.byteLength, bytes };
  return withDb(idb, async (db) => {
    const have = (await wrap(db.transaction(STORE).objectStore(STORE).getAll())) as OwnRecord[];
    if (have.length >= MAX_OWN_SOUNDS) throw new RangeError('count');
    if (have.reduce((n, r) => n + r.size, 0) + rec.size > MAX_OWN_TOTAL_BYTES) throw new RangeError('total');
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(rec);
    await done(tx);
    return { id: rec.id, name: rec.name, size: rec.size };
  }, 'Your sound could not be saved.');
}

export async function removeOwn(id: string, idb: IDBFactory | null = defaultIdb()): Promise<OwnResult<true>> {
  return withDb(idb, async (db) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    await done(tx);
    return true as const;
  }, 'That sound could not be removed.');
}

export async function removeAllOwn(idb: IDBFactory | null = defaultIdb()): Promise<OwnResult<true>> {
  return withDb(idb, async (db) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).clear();
    await done(tx);
    return true as const;
  }, 'Your sounds could not be removed.');
}

export interface Decoded {
  readonly channels: readonly Float32Array[];
  readonly sampleRate: number;
}
export type Decode = (bytes: ArrayBuffer) => Promise<Decoded>;

/** Browser decode on an offline context: no sound device is opened and nothing plays. */
export const browserDecode: Decode = async (bytes) => {
  const Ctx = typeof OfflineAudioContext === 'undefined' ? undefined : OfflineAudioContext;
  if (Ctx === undefined) throw new Error('no decoder');
  const buf = await new Ctx(1, 1, 44100).decodeAudioData(bytes.slice(0));
  return { channels: Array.from({ length: buf.numberOfChannels }, (_, c) => buf.getChannelData(c)), sampleRate: buf.sampleRate };
};

/** A browser that never answers a decode must not leave the screen silent. */
const DECODE_TIMEOUT_MS = 10_000;
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('decode timeout')), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e: unknown) => { clearTimeout(t); reject(e instanceof Error ? e : new Error('decode failed')); },
    );
  });
}

/** Checks a picked file by decoding it. Returns a plain message on any failure. */
export async function validateOwn(bytes: ArrayBuffer, decode: Decode = browserDecode): Promise<OwnResult<true>> {
  if (bytes.byteLength > MAX_OWN_BYTES) return fail('This file is bigger than 8 MB.');
  if (bytes.byteLength === 0) return fail('This file is empty.');
  let d: Decoded;
  try {
    d = await withTimeout(decode(bytes), DECODE_TIMEOUT_MS);
  } catch {
    return fail('This file is not a sound this browser can read.');
  }
  const seconds = (d.channels[0]?.length ?? 0) / d.sampleRate;
  if (seconds > MAX_OWN_SECONDS) return fail('This file is longer than 10 minutes.');
  const prep = prepareOwn(d.channels, d.sampleRate);
  return prep.ok ? { ok: true, value: true } : fail(prep.error);
}
