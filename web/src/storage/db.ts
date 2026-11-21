import { LIMITS } from '../sbg';
import { MAX_MIXES, parseMix } from '../app/mixes';
import type { Mix } from '../app/mixes';

export interface ScriptRecord {
  readonly id: number;
  readonly name: string;
  readonly text: string;
  readonly updatedAt: number;
}

export interface LogInput {
  readonly startedAt: number;
  readonly endedAt: number;
  readonly peakScore: number;
  readonly presetId: string;
  /** How the session ended. Absent in logs written before storage v2. */
  readonly endKind?: 'manual' | 'countdown' | 'sleep-fade';
  /** Number of Pomodoro breaks that began during the session. */
  readonly breaks?: number;
}

export interface LogRecord extends LogInput {
  readonly id: number;
}

export interface Store {
  /** False when IndexedDB is unavailable and data lives in memory only. */
  readonly persistent: () => Promise<boolean>;
  saveScript(name: string, text: string): Promise<ScriptRecord>;
  listScripts(): Promise<ScriptRecord[]>;
  deleteScript(id: number): Promise<void>;
  addLog(log: LogInput): Promise<void>;
  listLogs(limit?: number): Promise<LogRecord[]>;
  /** Saved personal mixes (storage v2). Records are validated on read. */
  listMixes(): Promise<Mix[]>;
  putMix(mix: Mix): Promise<void>;
  deleteMix(id: string): Promise<void>;
  /** Small validated-by-caller JSON records: favorites, milestones. */
  getRecord(key: RecordKey): Promise<unknown>;
  setRecord(key: RecordKey, value: unknown): Promise<void>;
  /** Deletes mixes, records and listening logs. Scripts are kept. */
  clearSanctuary(): Promise<void>;
}

export type RecordKey = 'favorites' | 'milestones';
const RECORD_KEYS: readonly RecordKey[] = ['favorites', 'milestones'];

const DB_NAME = 'zonked';
const SCRIPTS = 'scripts';
const LOGS = 'logs';
const MIXES = 'mixes';
const RECORDS = 'records';
const DB_VERSION = 2;
const MAX_NAME = 80;

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Read-side validation: IndexedDB content is untrusted, so malformed records are dropped. */
export function isValidScript(r: unknown): r is ScriptRecord {
  if (typeof r !== 'object' || r === null) return false;
  const o = r as Record<string, unknown>;
  return (
    isNum(o['id']) &&
    typeof o['name'] === 'string' && o['name'].length >= 1 && o['name'].length <= MAX_NAME &&
    typeof o['text'] === 'string' && o['text'].length <= LIMITS.maxBytes &&
    isNum(o['updatedAt'])
  );
}

export function isValidLog(r: unknown): r is LogRecord {
  if (typeof r !== 'object' || r === null) return false;
  const o = r as Record<string, unknown>;
  return (
    isNum(o['id']) && isNum(o['startedAt']) && isNum(o['endedAt']) && isNum(o['peakScore']) &&
    typeof o['presetId'] === 'string' && o['presetId'].length <= MAX_NAME
  );
}

/** Keeps only the known optional log fields that are valid; drops the rest. */
function cleanLog(r: LogRecord): LogRecord {
  const base = { id: r.id, startedAt: r.startedAt, endedAt: r.endedAt, peakScore: r.peakScore, presetId: r.presetId };
  const o = r as unknown as Record<string, unknown>;
  const k = o['endKind'];
  const b = o['breaks'];
  return {
    ...base,
    ...(k === 'manual' || k === 'countdown' || k === 'sleep-fade' ? { endKind: k } : {}),
    ...(isNum(b) && b >= 0 && b <= 1000 ? { breaks: Math.floor(b) } : {}),
  };
}

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error ?? new Error('IndexedDB request failed'));
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
  });
}

function openDb(factory: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = factory.open(DB_NAME, DB_VERSION);
    r.onupgradeneeded = () => {
      // Additive upgrade: v1 stores (scripts, logs) and their data are never touched.
      const db = r.result;
      const has = (n: string): boolean => db.objectStoreNames.contains(n);
      if (!has(SCRIPTS)) db.createObjectStore(SCRIPTS, { keyPath: 'id', autoIncrement: true });
      if (!has(LOGS)) db.createObjectStore(LOGS, { keyPath: 'id', autoIncrement: true });
      if (!has(MIXES)) db.createObjectStore(MIXES, { keyPath: 'id' });
      if (!has(RECORDS)) db.createObjectStore(RECORDS);
    };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error ?? new Error('IndexedDB open failed'));
    r.onblocked = () => reject(new Error('IndexedDB open blocked'));
  });
}

function checkScript(name: string, text: string): string {
  if (text.length > LIMITS.maxBytes) throw new RangeError('Script exceeds 256 KB');
  const n = name.trim().slice(0, MAX_NAME);
  return n.length > 0 ? n : 'Untitled';
}

function createMemoryStore(): Store {
  let nextId = 1;
  const scripts: ScriptRecord[] = [];
  const logs: LogRecord[] = [];
  const mixes = new Map<string, Mix>();
  const records = new Map<RecordKey, unknown>();
  return {
    persistent: () => Promise.resolve(false),
    saveScript(name, text) {
      const n = checkScript(name, text);
      const rec: ScriptRecord = { id: scripts.find((s) => s.name === n)?.id ?? nextId++, name: n, text, updatedAt: Date.now() };
      const i = scripts.findIndex((s) => s.id === rec.id);
      if (i >= 0) scripts[i] = rec;
      else scripts.push(rec);
      return Promise.resolve(rec);
    },
    listScripts: () => Promise.resolve([...scripts].sort((a, b) => b.updatedAt - a.updatedAt)),
    deleteScript(id) {
      const i = scripts.findIndex((s) => s.id === id);
      if (i >= 0) scripts.splice(i, 1);
      return Promise.resolve();
    },
    addLog(log) {
      logs.push({ ...log, id: nextId++ });
      return Promise.resolve();
    },
    listLogs: (limit = 50) => Promise.resolve([...logs].sort((a, b) => b.startedAt - a.startedAt).slice(0, limit)),
    listMixes: () => Promise.resolve([...mixes.values()].sort((a, b) => b.updatedAt - a.updatedAt)),
    putMix(mix) {
      if (mixes.size >= MAX_MIXES && !mixes.has(mix.id)) return Promise.reject(new RangeError('Too many mixes'));
      mixes.set(mix.id, mix);
      return Promise.resolve();
    },
    deleteMix(id) {
      mixes.delete(id);
      return Promise.resolve();
    },
    getRecord: (key) => Promise.resolve(records.get(key)),
    setRecord(key, value) {
      records.set(key, value);
      return Promise.resolve();
    },
    clearSanctuary() {
      mixes.clear();
      records.clear();
      logs.length = 0;
      return Promise.resolve();
    },
  };
}

/** IndexedDB store with an in-memory fallback when IndexedDB is missing or fails to open. */
export function createStore(factory: IDBFactory | undefined = globalThis.indexedDB): Store {
  const memory = createMemoryStore();
  if (factory === undefined) return memory;
  let dbp: Promise<IDBDatabase | null> | null = null;
  const db = (): Promise<IDBDatabase | null> => {
    dbp ??= openDb(factory).catch(() => null);
    return dbp;
  };
  return {
    persistent: async () => (await db()) !== null,
    async saveScript(name, text) {
      const d = await db();
      if (d === null) return memory.saveScript(name, text);
      const n = checkScript(name, text);
      const tx = d.transaction(SCRIPTS, 'readwrite');
      const store = tx.objectStore(SCRIPTS);
      const all = await req(store.getAll() as IDBRequest<ScriptRecord[]>);
      const existing = all.filter(isValidScript).find((s) => s.name === n);
      const base = { name: n, text, updatedAt: Date.now() };
      const key = await req(store.put(existing ? { ...base, id: existing.id } : base));
      await txDone(tx);
      return { ...base, id: Number(key) };
    },
    async listScripts() {
      const d = await db();
      if (d === null) return memory.listScripts();
      const all = await req(d.transaction(SCRIPTS).objectStore(SCRIPTS).getAll() as IDBRequest<ScriptRecord[]>);
      return all.filter(isValidScript).sort((a, b) => b.updatedAt - a.updatedAt);
    },
    async deleteScript(id) {
      const d = await db();
      if (d === null) return memory.deleteScript(id);
      const tx = d.transaction(SCRIPTS, 'readwrite');
      tx.objectStore(SCRIPTS).delete(id);
      await txDone(tx);
    },
    async addLog(log) {
      const d = await db();
      if (d === null) return memory.addLog(log);
      const tx = d.transaction(LOGS, 'readwrite');
      tx.objectStore(LOGS).add({ ...log });
      await txDone(tx);
    },
    async listLogs(limit = 50) {
      const d = await db();
      if (d === null) return memory.listLogs(limit);
      const all = await req(d.transaction(LOGS).objectStore(LOGS).getAll() as IDBRequest<LogRecord[]>);
      return all.filter(isValidLog).map(cleanLog).sort((a, b) => b.startedAt - a.startedAt).slice(0, limit);
    },
    async listMixes() {
      const d = await db();
      if (d === null) return memory.listMixes();
      const all = await req(d.transaction(MIXES).objectStore(MIXES).getAll() as IDBRequest<unknown[]>);
      const now = Date.now();
      return all.map((m) => parseMix(m, now)).filter((m): m is Mix => m !== null).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_MIXES);
    },
    async putMix(mix) {
      const d = await db();
      if (d === null) return memory.putMix(mix);
      const tx = d.transaction(MIXES, 'readwrite');
      const store = tx.objectStore(MIXES);
      const count = await req(store.count());
      const exists = (await req(store.getKey(mix.id))) !== undefined;
      if (count >= MAX_MIXES && !exists) {
        tx.abort();
        throw new RangeError('Too many mixes');
      }
      store.put(mix);
      await txDone(tx);
    },
    async deleteMix(id) {
      const d = await db();
      if (d === null) return memory.deleteMix(id);
      const tx = d.transaction(MIXES, 'readwrite');
      tx.objectStore(MIXES).delete(id);
      await txDone(tx);
    },
    async getRecord(key) {
      const d = await db();
      if (d === null || !RECORD_KEYS.includes(key)) return memory.getRecord(key);
      return (await req(d.transaction(RECORDS).objectStore(RECORDS).get(key))) as unknown;
    },
    async setRecord(key, value) {
      const d = await db();
      if (d === null) return memory.setRecord(key, value);
      const tx = d.transaction(RECORDS, 'readwrite');
      tx.objectStore(RECORDS).put(value, key);
      await txDone(tx);
    },
    async clearSanctuary() {
      const d = await db();
      if (d === null) return memory.clearSanctuary();
      const tx = d.transaction([MIXES, RECORDS, LOGS], 'readwrite');
      tx.objectStore(MIXES).clear();
      tx.objectStore(RECORDS).clear();
      tx.objectStore(LOGS).clear();
      await txDone(tx);
    },
  };
}
