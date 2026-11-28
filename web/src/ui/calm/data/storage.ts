import { FEEL_KEY } from './feel';
import { JOURNEYS } from './journeys';
import { DEVICES, GOALS, TIMES_OF_DAY } from './types';
import type { Device, JourneyProgress, ProgressMap, Profile, StorageLike } from './types';

export const PROFILE_KEY = 'zonked.profile.v1';
export const PROGRESS_KEY = 'zonked.journeys.v1';
export const LAST_KEY = 'zonked.last.v1';
export const DEVICE_KEY = 'zonked.device.v1';
export const MAX_PAYLOAD_BYTES = 32 * 1024;
const VERSION = 1;
const MAX_DAY = 10_000_000;
const ID_RE = /^[a-z0-9-]{1,64}$/;

export const DEFAULT_PROFILE: Profile = Object.freeze({
  goal: 'curious',
  timeOfDay: 'anytime',
  device: 'wired',
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

/** Old profiles saved 'headphones' or 'unsure'. Both mean wired now. Anything else unknown is rejected. */
export function migrateDevice(v: unknown): Device | undefined {
  if (v === 'headphones' || v === 'unsure') return 'wired';
  return oneOf(DEVICES, v) ? v : undefined;
}

function parseProfile(o: Obj): Profile | undefined {
  const { goal, timeOfDay, extraGentle, createdAt } = o;
  const device = migrateDevice(o['device']);
  if (!oneOf(GOALS, goal) || !oneOf(TIMES_OF_DAY, timeOfDay) || device === undefined) return undefined;
  if (typeof extraGentle !== 'boolean' || !isInt(createdAt, Number.MAX_SAFE_INTEGER)) return undefined;
  return Object.freeze({ goal, timeOfDay, device, extraGentle, createdAt });
}

/** The saved listening device, or undefined when none is stored or the value is unknown. */
export function loadDevice(storage: StorageLike): Device | undefined {
  return migrateDevice(readJson(storage, DEVICE_KEY)?.['device']);
}

export function saveDevice(storage: StorageLike, device: Device): boolean {
  return oneOf(DEVICES, device) && writeJson(storage, DEVICE_KEY, { device });
}

/**
 * The device key is the source of truth. A profile saved before it existed carries the old value:
 * that value is migrated once and written under zonked.device.v1.
 */
export function loadProfile(storage: StorageLike): Profile {
  const o = readJson(storage, PROFILE_KEY);
  const parsed = o && parseProfile(o);
  const stored = loadDevice(storage);
  if (!parsed) return stored === undefined ? DEFAULT_PROFILE : Object.freeze({ ...DEFAULT_PROFILE, device: stored });
  if (stored === undefined) {
    saveDevice(storage, parsed.device);
    return parsed;
  }
  return stored === parsed.device ? parsed : Object.freeze({ ...parsed, device: stored });
}

export function saveProfile(storage: StorageLike, profile: Profile): boolean {
  const checked = parseProfile({ ...profile });
  if (checked === undefined) return false;
  saveDevice(storage, checked.device);
  return writeJson(storage, PROFILE_KEY, { ...checked });
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
  for (const key of [PROFILE_KEY, PROGRESS_KEY, LAST_KEY, FEEL_KEY, DEVICE_KEY]) {
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

const LAST_RE = /^[a-z0-9-]{1,80}$/;

/** Id of the last template played, or null. The caller checks it against the catalog. */
export function loadLast(storage: StorageLike): string | null {
  try {
    const v = storage.get(LAST_KEY);
    return v !== null && LAST_RE.test(v) ? v : null;
  } catch {
    return null;
  }
}

export function saveLast(storage: StorageLike, id: string): void {
  try {
    if (LAST_RE.test(id)) storage.set(LAST_KEY, id);
  } catch {
    // Storage may be full or blocked. Play again then falls back to the Daily card.
  }
}
