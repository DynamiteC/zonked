import { checkSbg } from "./sbg.js";

export const MAX_STATE_BYTES = 64 * 1024;
export const LEVELS = ["focus", "flow", "recovery", "decompress"] as const;
export type Level = (typeof LEVELS)[number];

export interface CrewState {
  readonly version: 1;
  readonly at: number;
  readonly burnout: { readonly score: number; readonly level: Level };
  readonly target: {
    readonly presetId?: string;
    readonly beatHz: number;
    readonly carrierHz: number;
    readonly gain: number;
    readonly transitionSec: number;
    readonly breathe: boolean;
  };
  readonly sbg: string | null;
}

export type Validation =
  | { ok: true; state: CrewState; warnings: string[] }
  | { ok: false; error: string };

export interface SignalsSummary {
  readonly at: number;
  readonly score: number;
  readonly degraded: boolean;
}

/** Policy minimum for a state change (matches crew.yaml safety.min_transition_seconds). */
export const DEFAULT_MIN_TRANSITION_SEC = 30;
/** Hard floor, reachable only through the demo-only --min-transition flag. */
export const FLOOR_TRANSITION_SEC = 5;
export const MAX_TRANSITION_SEC = 600;
const DEFAULT_TRANSITION_SEC = 60;

export interface ValidateOptions {
  /** Lowest transitionSec accepted. Clamped to 5-600. Default 30. */
  readonly minTransitionSec?: number;
}

export function levelForScore(score: number): Level {
  if (score < 40) return "focus";
  if (score < 60) return "flow";
  if (score < 80) return "recovery";
  return "decompress";
}

const MAX_WARNINGS = 20;
const PRESET_ID = /^[a-z0-9][a-z0-9-]{0,31}$/;

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function own(o: Obj, key: string): unknown {
  return Object.hasOwn(o, key) ? o[key] : undefined;
}

class Ctx {
  readonly warnings: string[] = [];
  warn(msg: string): void {
    if (this.warnings.length < MAX_WARNINGS) this.warnings.push(msg);
  }
}

function clamped(ctx: Ctx, name: string, v: number, lo: number, hi: number): number {
  if (v < lo) {
    ctx.warn(`${name} ${v} below ${lo}, clamped`);
    return lo;
  }
  if (v > hi) {
    ctx.warn(`${name} ${v} above ${hi}, clamped`);
    return hi;
  }
  return v;
}

function readNumber(o: Obj, key: string, path: string): number | string {
  const v = own(o, key);
  if (typeof v !== "number" || !Number.isFinite(v)) return `${path}.${key} must be a finite number`;
  return v;
}

function readInt(ctx: Ctx, o: Obj, key: string, path: string, lo: number, hi: number): number | string {
  const n = readNumber(o, key, path);
  if (typeof n === "string") return n;
  const r = Math.round(n);
  if (r !== n) ctx.warn(`${path}.${key} ${n} rounded to ${r}`);
  return clamped(ctx, `${path}.${key}`, r, lo, hi);
}

function readTarget(ctx: Ctx, raw: unknown, minTransition: number): CrewState["target"] | string {
  if (!isObj(raw)) return "target must be an object";
  const beat = readNumber(raw, "beatHz", "target");
  if (typeof beat === "string") return beat;
  const carrier = readNumber(raw, "carrierHz", "target");
  if (typeof carrier === "string") return carrier;

  let gain = 0.5;
  if (own(raw, "gain") !== undefined) {
    const g = readNumber(raw, "gain", "target");
    if (typeof g === "string") return g;
    gain = clamped(ctx, "target.gain", g, 0, 0.85);
  } else ctx.warn("target.gain missing, defaulted to 0.5");

  let transitionSec = Math.max(DEFAULT_TRANSITION_SEC, minTransition);
  if (own(raw, "transitionSec") !== undefined) {
    const t = readNumber(raw, "transitionSec", "target");
    if (typeof t === "string") return t;
    transitionSec = clamped(ctx, "target.transitionSec", t, minTransition, MAX_TRANSITION_SEC);
  } else ctx.warn(`target.transitionSec missing, defaulted to ${transitionSec}`);

  const breatheRaw = own(raw, "breathe");
  if (breatheRaw !== undefined && typeof breatheRaw !== "boolean") return "target.breathe must be a boolean";

  const base = {
    beatHz: clamped(ctx, "target.beatHz", beat, 0.5, 40),
    carrierHz: clamped(ctx, "target.carrierHz", carrier, 20, 1500),
    gain,
    transitionSec,
    breathe: breatheRaw === true,
  };
  const preset = own(raw, "presetId");
  if (preset === undefined || preset === null) return base;
  if (typeof preset === "string" && PRESET_ID.test(preset)) return { presetId: preset, ...base };
  ctx.warn("target.presetId invalid, dropped");
  return base;
}

function readSbg(ctx: Ctx, raw: unknown): string | null | string[] {
  if (raw === undefined || raw === null) return null;
  if (typeof raw !== "string") return ["sbg must be a string or null"];
  const check = checkSbg(raw);
  if (!check.ok) {
    ctx.warn(`sbg dropped: ${check.reason}`);
    return null;
  }
  return raw;
}

function clampMin(v: number | undefined): number {
  if (v === undefined || !Number.isFinite(v)) return DEFAULT_MIN_TRANSITION_SEC;
  return Math.min(MAX_TRANSITION_SEC, Math.max(FLOOR_TRANSITION_SEC, v));
}

/** Validate a decoded JSON value. Builds a fresh object; never copies unknown keys. */
export function validateState(raw: unknown, opts: ValidateOptions = {}): Validation {
  const minTransition = clampMin(opts.minTransitionSec);
  if (!isObj(raw)) return { ok: false, error: "state must be a JSON object" };
  const version = own(raw, "version");
  if (version !== 1) return { ok: false, error: `unsupported version: ${typeof version === "number" ? version : "missing"}` };

  const ctx = new Ctx();
  const at = readNumber(raw, "at", "state");
  if (typeof at === "string") return { ok: false, error: at };
  if (!Number.isSafeInteger(at) || at < 0) return { ok: false, error: "state.at must be a non-negative integer" };

  const burnoutRaw = own(raw, "burnout");
  if (!isObj(burnoutRaw)) return { ok: false, error: "burnout must be an object" };
  const score = readInt(ctx, burnoutRaw, "score", "burnout", 0, 100);
  if (typeof score === "string") return { ok: false, error: score };
  const level = own(burnoutRaw, "level");
  if (typeof level !== "string" || !(LEVELS as readonly string[]).includes(level)) {
    return { ok: false, error: "burnout.level must be focus, flow, recovery or decompress" };
  }

  const target = readTarget(ctx, own(raw, "target"), minTransition);
  if (typeof target === "string") return { ok: false, error: target };

  const sbg = readSbg(ctx, own(raw, "sbg"));
  if (Array.isArray(sbg)) return { ok: false, error: sbg[0] ?? "invalid sbg" };

  // The score is the source of truth. A level that disagrees with it is replaced.
  const derived = levelForScore(score);
  if (derived !== level) ctx.warn(`burnout.level ${level} does not match score ${score}, using ${derived}`);

  const state: CrewState = {
    version: 1,
    at,
    burnout: { score, level: derived },
    target,
    sbg,
  };
  return { ok: true, state, warnings: ctx.warnings };
}

/** Parse untrusted file bytes. Enforces the size cap before decoding. */
export function parseStateBytes(bytes: Buffer, opts: ValidateOptions = {}): Validation {
  if (bytes.length > MAX_STATE_BYTES) {
    return { ok: false, error: `state file larger than ${MAX_STATE_BYTES} bytes` };
  }
  let decoded: unknown;
  try {
    decoded = JSON.parse(bytes.toString("utf8"));
  } catch {
    return { ok: false, error: "state file is not valid JSON" };
  }
  return validateState(decoded, opts);
}

/** Lenient summary of the signals file (informational only, exposed on /health). */
export function parseSignalsBytes(bytes: Buffer): { ok: true; value: SignalsSummary } | { ok: false; error: string } {
  if (bytes.length > MAX_STATE_BYTES) return { ok: false, error: "signals file too large" };
  let raw: unknown;
  try {
    raw = JSON.parse(bytes.toString("utf8"));
  } catch {
    return { ok: false, error: "signals file is not valid JSON" };
  }
  if (!isObj(raw) || own(raw, "version") !== 1) return { ok: false, error: "signals version unsupported" };
  const at = own(raw, "at");
  const score = own(raw, "score");
  if (typeof at !== "number" || !Number.isSafeInteger(at) || at < 0) return { ok: false, error: "signals.at invalid" };
  if (typeof score !== "number" || !Number.isFinite(score)) return { ok: false, error: "signals.score invalid" };
  return {
    ok: true,
    value: { at, score: Math.min(100, Math.max(0, Math.round(score))), degraded: own(raw, "degraded") === true },
  };
}
