import { JOURNEYS } from './journeys';
import { DEVICES, GOALS, TIMES_OF_DAY } from './types';
import type { JourneyProgress, ProgressMap, Profile, StorageLike } from './types';

export const PROFILE_KEY = 'zonked.profile.v1';
export const PROGRESS_KEY = 'zonked.journeys.v1';
export const MAX_PAYLOAD_BYTES = 32 * 1024;
const VERSION = 1;
const MAX_DAY = 10_000_000;
const ID_RE = /^[a-z0-9-]{1,64}$/;

export const DEFAULT_PROFILE: Profile = Object.freeze({
  goal: 'curious',
  timeOfDay: 'anytime',
  device: 'unsure',
  extraGentle: false,
  createdAt: 0,
});
const EMPTY_PROGRESS: ProgressMap = Object.freeze({});

type Obj = Readonly<Record<string, unknown>>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isInt = (v: unknown, max: number): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= max;
const oneOf = <T extends string>(list: readonly T[], v: unknown): v is T => list.some((x) => x === v);

/** Reads and parses a payload. Returns undefined on any problem; never throws. */
function readJson(storage: StorageLike, key: string): Obj | undefined {
  try {
    const raw = storage.get(key);
    if (raw === null || raw.length > MAX_PAYLOAD_BYTES) return undefined;
    const parsed: unknown = JSON.parse(raw);
    return isObj(parsed) && parsed['v'] === VERSION ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** Writes a payload. Returns false when too large or when storage refuses. */
function writeJson(storage: StorageLike, key: string, data: Obj): boolean {
  try {
    const raw = JSON.stringify({ v: VERSION, ...data });
    if (raw.length > MAX_PAYLOAD_BYTES) return false;
    storage.set(key, raw);
    return true;
  } catch {
    return false;
  }
}

function parseProfile(o: Obj): Profile | undefined {
  const { goal, timeOfDay, device, extraGentle, createdAt } = o;
  if (!oneOf(GOALS, goal) || !oneOf(TIMES_OF_DAY, timeOfDay) || !oneOf(DEVICES, device)) return undefined;
  if (typeof extraGentle !== 'boolean' || !isInt(createdAt, Number.MAX_SAFE_INTEGER)) return undefined;
  return Object.freeze({ goal, timeOfDay, device, extraGentle, createdAt });
}

export function loadProfile(storage: StorageLike): Profile {
  const o = readJson(storage, PROFILE_KEY);
  return (o && parseProfile(o)) ?? DEFAULT_PROFILE;
}

export function saveProfile(storage: StorageLike, profile: Profile): boolean {
  const checked = parseProfile({ ...profile });
  return checked !== undefined && writeJson(storage, PROFILE_KEY, { ...checked });
}

function parseProgress(id: string, v: unknown): JourneyProgress | undefined {
  const journey = JOURNEYS.find((j) => j.id === id);
  if (journey === undefined || !isObj(v) || !isInt(v['startedAt'], MAX_DAY)) return undefined;
  const { doneDays, pickedIds } = v;
  if (!Array.isArray(doneDays) || !Array.isArray(pickedIds) || pickedIds.length > journey.days.length) return undefined;
  const days: unknown[] = doneDays;
  const ids: unknown[] = pickedIds;
  if (!days.every((d) => isInt(d, journey.days.length) && d >= 1)) return undefined;
  if (!ids.every((p) => typeof p === 'string' && ID_RE.test(p))) return undefined;
  const done = [...new Set(days as number[])].sort((a, b) => a - b);
  return Object.freeze({
    startedAt: v['startedAt'],
    doneDays: Object.freeze(done),
    pickedIds: Object.freeze([...(ids as string[])]),
  });
}

export function loadProgress(storage: StorageLike): ProgressMap {
  const o = readJson(storage, PROGRESS_KEY);
  const map = o?.['journeys'];
  if (!isObj(map)) return EMPTY_PROGRESS;
  const out: Record<string, JourneyProgress> = {};
  for (const [id, v] of Object.entries(map)) {
    const p = parseProgress(id, v);
    if (p !== undefined) out[id] = p;
  }
  return Object.freeze(out);
}

export function saveProgress(storage: StorageLike, progress: ProgressMap): boolean {
  const clean: Record<string, JourneyProgress> = {};
  for (const [id, v] of Object.entries(progress)) {
    const p = parseProgress(id, v);
    if (p !== undefined) clean[id] = p;
  }
  return writeJson(storage, PROGRESS_KEY, { journeys: clean });
}

/** Removes everything this folder stores. Never throws. */
export function clearAll(storage: StorageLike): void {
  for (const key of [PROFILE_KEY, PROGRESS_KEY]) {
    try {
      storage.remove(key);
    } catch {
      /* shortcut: a refusing store keeps its data, nothing more can be done here */
    }
  }
}

export function createMemoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return {
    get: (k) => m.get(k) ?? null,
    set: (k, v) => void m.set(k, v),
    remove: (k) => void m.delete(k),
  };
}

/** localStorage adapter. Falls back to memory when storage is missing or blocked. */
export function createLocalStorage(ls?: Storage): StorageLike {
  try {
    const store = ls ?? (globalThis as { localStorage?: Storage }).localStorage;
    if (store === undefined) return createMemoryStorage();
    const probe = 'zonked.probe';
    store.setItem(probe, '1');
    store.removeItem(probe);
    return {
      get: (k) => store.getItem(k),
      set: (k, v) => store.setItem(k, v),
      remove: (k) => store.removeItem(k),
    };
  } catch {
    return createMemoryStorage();
  }
}
