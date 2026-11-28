// Pure crew logic for the Zonked app backend. No network, no shell, Node built-ins only.
// Every input is untrusted. Output state matches crew-bridge/src/validate.ts (CrewState v1).

export const VERSION = 1;
export const MAX_BODY_BYTES = 4096;
export const MAX_STORE_BYTES = 64 * 1024;
export const MIN_TRANSITION_SEC = 30; // bridge-side floor. The web keeps a hard floor of 5.
export const MAX_TRANSITION_SEC = 600;
export const MIN_CHANGE_GAP_SEC = 30; // at most 2 state changes a minute
export const SAFETY = Object.freeze({ carrier: [20, 1500], beat: [0.5, 40], gainMax: 0.85 });

export const LEVELS = Object.freeze(['focus', 'flow', 'recovery', 'decompress']);

// Bands mirror .kiro/crew/crew.yaml under `states`.
const BANDS = Object.freeze({
  focus: { presetId: 'deep-focus', beatHz: 40, carrierHz: 200, breathe: false },
  flow: { presetId: 'flow-state', beatHz: 18, carrierHz: 220, breathe: false },
  recovery: { presetId: 'burnout-reset', beatHz: 10, carrierHz: 200, breathe: true },
  decompress: { presetId: 'burnout-reset', beatHz: 6, carrierHz: 180, breathe: true },
});

const SIGNAL_RANGES = Object.freeze({
  commitsPerHour: [0, 120],
  sessionMinutes: [0, 720],
  buildFailures: [0, 10],
  dirtyFiles: [0, 200],
});

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
const own = (o, k) => (Object.hasOwn(o, k) ? o[k] : undefined);

export function levelForScore(score) {
  if (score < 40) return 'focus';
  if (score < 60) return 'flow';
  if (score < 80) return 'recovery';
  return 'decompress';
}

/** Strict key check: unknown keys are an error, so a typo or a smuggled field is visible. */
function unknownKey(o, allowed) {
  return Object.keys(o).find((k) => !allowed.includes(k));
}

function readInt(o, key, lo, hi, warnings) {
  const v = own(o, key);
  if (typeof v !== 'number' || !Number.isFinite(v)) return { error: `${key} must be a finite number` };
  const r = Math.round(v);
  const c = clamp(r, lo, hi);
  if (c !== v) warnings.push(`${key} ${String(v)} clamped to ${String(c)}`);
  return { value: c };
}

function readSignals(raw, warnings) {
  if (raw === undefined) return { value: null };
  if (!isObj(raw)) return { error: 'signals must be an object' };
  const bad = unknownKey(raw, Object.keys(SIGNAL_RANGES));
  if (bad !== undefined) return { error: `signals.${bad} is not allowed` };
  const out = {};
  for (const [key, [lo, hi]] of Object.entries(SIGNAL_RANGES)) {
    if (own(raw, key) === undefined) continue;
    const r = readInt(raw, key, lo, hi, warnings);
    if (r.error !== undefined) return { error: `signals.${r.error}` };
    out[key] = r.value;
  }
  return { value: out };
}

/**
 * Validate a sentinel report: { version: 1, at, score, signals?, degraded? }.
 * Returns { ok: true, value, warnings } or { ok: false, error }.
 */
export function validateIntensity(raw) {
  if (!isObj(raw)) return { ok: false, error: 'body must be a JSON object' };
  if (own(raw, 'version') !== VERSION) return { ok: false, error: 'unsupported version' };
  const bad = unknownKey(raw, ['version', 'at', 'score', 'signals', 'degraded']);
  if (bad !== undefined) return { ok: false, error: `${bad} is not allowed` };
  const warnings = [];
  const at = own(raw, 'at');
  if (!Number.isSafeInteger(at) || at < 0) return { ok: false, error: 'at must be a non-negative integer' };
  const score = readInt(raw, 'score', 0, 100, warnings);
  if (score.error !== undefined) return { ok: false, error: score.error };
  const signals = readSignals(own(raw, 'signals'), warnings);
  if (signals.error !== undefined) return { ok: false, error: signals.error };
  const degraded = own(raw, 'degraded');
  if (degraded !== undefined && typeof degraded !== 'boolean') return { ok: false, error: 'degraded must be a boolean' };
  return { ok: true, value: { at, score: score.value, signals: signals.value, degraded: degraded === true }, warnings };
}

/** One step toward the wanted level. Never jumps a band, so focus never goes straight to decompress. */
function stepToward(from, to) {
  const i = LEVELS.indexOf(from);
  const j = LEVELS.indexOf(to);
  return LEVELS[i + Math.sign(j - i)] ?? from;
}

export function targetFor(level, transitionSec) {
  const band = BANDS[level];
  return {
    presetId: band.presetId,
    beatHz: clamp(band.beatHz, ...SAFETY.beat),
    carrierHz: clamp(band.carrierHz, ...SAFETY.carrier),
    gain: 0.5,
    transitionSec: clamp(Number.isFinite(transitionSec) ? transitionSec : MIN_TRANSITION_SEC, MIN_TRANSITION_SEC, MAX_TRANSITION_SEC),
    breathe: band.breathe,
  };
}

export const emptyMemory = () => ({ version: VERSION, level: null, pending: null, pendingCount: 0, changedAt: 0, last: null });

/**
 * Hysteresis plus pacing. A new level needs 2 readings in a row, moves one band at a time and at
 * most once every MIN_CHANGE_GAP_SEC. Pure: returns the next memory, never mutates the input.
 * `now` is the backend clock in epoch seconds. The sender's `at` is stored but never trusted for timing.
 */
export function advance(memory, intensity, now) {
  const wanted = levelForScore(intensity.score);
  const last = { at: intensity.at, score: intensity.score, signals: intensity.signals, degraded: intensity.degraded };
  if (memory.level === null) return { ...memory, level: stepToward('flow', wanted), changedAt: now, last, pending: null, pendingCount: 0, transitionSec: 60 };
  if (wanted === memory.level) return { ...memory, last, pending: null, pendingCount: 0 };
  const count = memory.pending === wanted ? memory.pendingCount + 1 : 1;
  const next = { ...memory, last, pending: wanted, pendingCount: Math.min(count, 1000) };
  if (count < 2 || now - memory.changedAt < MIN_CHANGE_GAP_SEC) return next;
  const gap = Math.abs(LEVELS.indexOf(wanted) - LEVELS.indexOf(memory.level));
  return { ...next, level: stepToward(memory.level, wanted), changedAt: now, transitionSec: gap >= 2 ? 120 : 60 };
}

export const MAX_WHY_CHARS = 160;

/** Plain sentence for the person. Built from the level and score only: no signal names, files or messages. */
export function whyFor(level, score) {
  const text = {
    focus: 'Your load looks light, so the sound holds steady.',
    flow: 'Your load is building, so the sound eases a little.',
    recovery: 'Your load is high, so the sound moves to a calmer beat.',
    decompress: 'Your load is very high, so the sound settles to help you rest.',
  }[level];
  return `${text} Score ${String(score)}.`.slice(0, MAX_WHY_CHARS);
}

/** CrewState v1 for the web client, or null before the first report. */
export function toCrewState(memory, now) {
  if (memory.level === null || memory.last === null) return null;
  return {
    version: VERSION,
    at: Math.trunc(now),
    burnout: { score: memory.last.score, level: levelForScore(memory.last.score) },
    target: targetFor(memory.level, memory.transitionSec ?? 60),
    sbg: null,
    why: whyFor(memory.level, memory.last.score),
  };
}

/** Sequencer answer: the committed target, what is pending, and why. Plain data, no side effects. */
export function toSuggestion(memory, now) {
  const state = toCrewState(memory, now);
  if (state === null) return { version: VERSION, ready: false, reason: 'No intensity report yet.' };
  const wanted = levelForScore(state.burnout.score);
  const holding = wanted !== memory.level;
  return {
    version: VERSION,
    ready: true,
    level: memory.level,
    wantedLevel: wanted,
    target: state.target,
    reason: holding
      ? `Score ${String(state.burnout.score)} wants ${wanted}. Holding ${memory.level} until ${String(Math.max(0, 2 - memory.pendingCount))} more matching report(s) and the ${String(MIN_CHANGE_GAP_SEC)} s pause pass.`
      : `Score ${String(state.burnout.score)} fits ${memory.level}.`,
  };
}

function storedReport(last) {
  const { signals, ...rest } = last;
  return { version: VERSION, ...rest, ...(signals === null || signals === undefined ? {} : { signals }) };
}

/** Parse stored bytes defensively. Anything wrong gives a fresh memory, never an exception. */
export function parseMemory(bytes) {
  if (bytes.length > MAX_STORE_BYTES) return emptyMemory();
  try {
    const raw = JSON.parse(bytes.toString('utf8'));
    if (!isObj(raw) || raw.version !== VERSION) return emptyMemory();
    const level = LEVELS.includes(raw.level) ? raw.level : null;
    const pending = LEVELS.includes(raw.pending) ? raw.pending : null;
    const last = isObj(raw.last) ? validateIntensity(storedReport(raw.last)) : null;
    const num = (v, hi) => (Number.isFinite(v) ? clamp(Math.trunc(v), 0, hi) : 0);
    if (level === null || last === null || !last.ok) return emptyMemory();
    return {
      version: VERSION, level, pending, pendingCount: num(raw.pendingCount, 1000),
      changedAt: num(raw.changedAt, Number.MAX_SAFE_INTEGER), last: last.value,
      transitionSec: clamp(num(raw.transitionSec, MAX_TRANSITION_SEC), MIN_TRANSITION_SEC, MAX_TRANSITION_SEC),
    };
  } catch {
    return emptyMemory();
  }
}
