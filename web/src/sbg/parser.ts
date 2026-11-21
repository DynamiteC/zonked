import { lexLines, utf8Length, type LexLine } from './lexer';
import {
  BOUNDS,
  DEFAULT_BEAT_HZ,
  DEFAULT_CARRIER_HZ,
  DEFAULT_GAIN,
  DEFAULT_NOISE_LEVEL,
  LIMITS,
} from './limits';
import { totalDuration } from './sequencer';
import type { Diagnostic, NoiseKind, ParseResult, SbgEvent, ToneMode, Voice } from './types';

interface Ctx {
  diags: Diagnostic[];
  errors: number;
  defs: Map<string, Voice>;
  mode: ToneMode;
  events: SbgEvent[];
  lastT: number;
  stop: boolean;
}

const NUM_RE = /^[+-]?[0-9]{1,15}(?:\.[0-9]{1,15})?$/;
const TIME_RE = /^[0-9]{1,2}:[0-9]{1,2}(?::[0-9]{1,2})?$/;
const NAME_RE = /^[A-Za-z_][A-Za-z0-9_-]{0,31}$/;
const MAX_TOKEN_ECHO = 24;

function echo(tok: string): string {
  return tok.length > MAX_TOKEN_ECHO ? `${tok.slice(0, MAX_TOKEN_ECHO)}...` : tok;
}

function report(ctx: Ctx, line: number, severity: 'error' | 'warning', message: string): void {
  if (severity === 'error') ctx.errors++;
  if (ctx.diags.length < BOUNDS.maxDiagnostics) ctx.diags.push({ line, severity, message });
  else if (ctx.diags.length === BOUNDS.maxDiagnostics) {
    ctx.diags.push({ line, severity: 'warning', message: 'Too many diagnostics, further messages dropped' });
  }
}

function parseNum(tok: string): number | null {
  if (!NUM_RE.test(tok)) return null;
  const n = Number(tok);
  return Number.isFinite(n) ? n : null;
}

function clampWarn(ctx: Ctx, line: number, label: string, v: number, lo: number, hi: number): number {
  if (v >= lo && v <= hi) return v;
  const c = v < lo ? lo : hi;
  report(ctx, line, 'warning', `${label} ${v} out of range, clamped to ${c}`);
  return c;
}

function parseMode(tok: string): ToneMode | null {
  switch (tok.toLowerCase()) {
    case 'iso':
    case 'isochronic':
      return 'isochronic';
    case 'mono':
    case 'monaural':
      return 'monaural';
    case 'bin':
    case 'binaural':
      return 'binaural';
    default:
      return null;
  }
}

function parseNoiseKind(name: string): NoiseKind | null {
  const n = name.toLowerCase();
  return n === 'pink' || n === 'white' || n === 'brown' || n === 'violet' ? n : null;
}

interface Draft {
  carrier?: number;
  beat?: number;
  gain?: number;
  noise?: NoiseKind;
  noiseLevel?: number;
  mode?: ToneMode;
}

/** Tone token: "C+B", "C@B", "@B", "C", each with optional "/gain" (fraction). */
function applyTone(ctx: Ctx, line: number, tok: string, d: Draft): boolean {
  const slash = tok.indexOf('/');
  const head = slash < 0 ? tok : tok.slice(0, slash);
  let sep = -1;
  for (let i = 0; i < head.length && sep < 0; i++) {
    const c = head[i];
    if (c === '@' || (c === '+' && i > 0)) sep = i;
  }
  const carrierTxt = sep < 0 ? head : head.slice(0, sep);
  const beatTxt = sep < 0 ? '' : head.slice(sep + 1);
  const carrier = carrierTxt === '' ? null : parseNum(carrierTxt);
  const beat = beatTxt === '' ? null : parseNum(beatTxt);
  const gain = slash < 0 ? null : parseNum(tok.slice(slash + 1));
  const badCarrier = carrierTxt !== '' && carrier === null;
  const badBeat = sep >= 0 && beat === null;
  const badGain = slash >= 0 && gain === null;
  if (badCarrier || badBeat || badGain || head === '') return false;
  if (carrier !== null) d.carrier = clampWarn(ctx, line, 'carrier', carrier, BOUNDS.carrierMin, BOUNDS.carrierMax);
  if (beat !== null) d.beat = clampWarn(ctx, line, 'beat', beat, BOUNDS.beatMin, BOUNDS.beatMax);
  if (gain !== null) d.gain = clampWarn(ctx, line, 'gain', gain, BOUNDS.gainMin, BOUNDS.gainMax);
  return true;
}

/** Noise token: "pink/40" (percent), or bare "pink" for the default level. */
function applyNoise(ctx: Ctx, line: number, tok: string, d: Draft): boolean {
  const slash = tok.indexOf('/');
  const kind = parseNoiseKind(slash < 0 ? tok : tok.slice(0, slash));
  if (kind === null) return false;
  let level = DEFAULT_NOISE_LEVEL;
  if (slash >= 0) {
    const pct = parseNum(tok.slice(slash + 1));
    if (pct === null) return false;
    level = clampWarn(ctx, line, 'noise level', pct / 100, BOUNDS.noiseMin, BOUNDS.noiseMax);
  }
  d.noise = kind;
  d.noiseLevel = level;
  return true;
}

function applyToken(ctx: Ctx, line: number, tok: string, d: Draft): void {
  const mode = parseMode(tok);
  if (mode !== null) d.mode = mode;
  else if (applyNoise(ctx, line, tok, d)) return;
  else if (!applyTone(ctx, line, tok, d)) report(ctx, line, 'warning', `Unknown token "${echo(tok)}" skipped`);
}

function buildVoice(ctx: Ctx, d: Draft): Voice {
  const hasTone = d.carrier !== undefined || d.beat !== undefined || d.gain !== undefined;
  const noiseOnly = !hasTone && d.noise !== undefined;
  return {
    carrierHz: d.carrier ?? DEFAULT_CARRIER_HZ,
    beatHz: d.beat ?? DEFAULT_BEAT_HZ,
    noise: d.noise ?? 'off',
    noiseLevel: d.noiseLevel ?? 0,
    mode: d.mode ?? ctx.mode,
    gain: noiseOnly ? 0 : (d.gain ?? DEFAULT_GAIN),
  };
}

function handleDefinition(ctx: Ctx, lx: LexLine): void {
  const first = lx.tokens[0] ?? '';
  const colon = first.indexOf(':');
  const name = first.slice(0, colon);
  const rest = lx.tokens.slice(1);
  if (colon < first.length - 1) rest.unshift(first.slice(colon + 1));
  if (name.toLowerCase() === 'mode') {
    const m = rest[0] === undefined ? null : parseMode(rest[0]);
    if (m === null) report(ctx, lx.line, 'warning', 'mode expects iso, mono or bin; ignored');
    else ctx.mode = m;
    return;
  }
  if (!NAME_RE.test(name)) {
    report(ctx, lx.line, 'warning', `Invalid tone-set name "${echo(name)}", line skipped`);
    return;
  }
  const d: Draft = {};
  for (const tok of rest) applyToken(ctx, lx.line, tok, d);
  if (rest.length === 0) report(ctx, lx.line, 'warning', `Tone-set "${name}" has no parameters, defaults used`);
  ctx.defs.set(name, buildVoice(ctx, d));
}

function parseTime(tok: string): number | null {
  if (tok === 'NOW') return 0;
  if (!TIME_RE.test(tok)) return null;
  const parts = tok.split(':').map(Number);
  const [h = 0, m = 0, s = 0] = parts.length === 2 ? [parts[0], parts[1], 0] : parts;
  if (m > 59 || s > 59) return null;
  return h * 3600 + m * 60 + s;
}

function handleSequence(ctx: Ctx, lx: LexLine): void {
  const [timeTok = '', nameRaw, ...extra] = lx.tokens;
  const t = parseTime(timeTok);
  if (t === null) return report(ctx, lx.line, 'error', `Invalid time "${echo(timeTok)}", expected HH:MM:SS`);
  if (t > BOUNDS.maxTimeSec) return report(ctx, lx.line, 'error', 'Time exceeds 24 hours');
  if (t < ctx.lastT) return report(ctx, lx.line, 'error', 'Times must not decrease');
  if (nameRaw === undefined) return report(ctx, lx.line, 'warning', 'Sequence line has no tone-set name, skipped');
  let name = nameRaw;
  let ramp = false;
  if (name.endsWith('->')) {
    ramp = true;
    name = name.slice(0, -2);
  }
  for (const tok of extra) {
    if (tok === '->' && !ramp) ramp = true;
    else report(ctx, lx.line, 'warning', `Unknown token "${echo(tok)}" skipped`);
  }
  const voice = ctx.defs.get(name);
  if (voice === undefined) return report(ctx, lx.line, 'warning', `Unknown tone-set "${echo(name)}", line skipped`);
  if (ctx.events.length >= LIMITS.maxEvents) {
    ctx.stop = true;
    return report(ctx, lx.line, 'error', `More than ${LIMITS.maxEvents} events, parsing stopped`);
  }
  ctx.lastT = t;
  ctx.events.push({ tSec: t, voice, ramp, line: lx.line });
}

function isSequenceLine(first: string): boolean {
  return first === 'NOW' || (first.charCodeAt(0) >= 48 && first.charCodeAt(0) <= 57 && first.includes(':'));
}

function handleLine(ctx: Ctx, lx: LexLine): void {
  const first = lx.tokens[0] ?? '';
  if (isSequenceLine(first)) handleSequence(ctx, lx);
  else if (first.includes(':')) handleDefinition(ctx, lx);
  else report(ctx, lx.line, 'warning', `Unknown token "${echo(first)}", line skipped`);
}

function finish(ctx: Ctx): ParseResult {
  return {
    events: ctx.events,
    durationSec: totalDuration(ctx.events),
    diagnostics: ctx.diags,
    ok: ctx.errors === 0,
  };
}

function newCtx(): Ctx {
  return { diags: [], errors: 0, defs: new Map(), mode: 'binaural', events: [], lastT: 0, stop: false };
}

/** Parse SBaGen-subset text. Pure, never throws, and never executes input. */
export function parseSbg(text: string): ParseResult {
  const ctx = newCtx();
  try {
    if (typeof text !== 'string') {
      report(ctx, 1, 'error', 'Input must be a string');
      return finish(ctx);
    }
    if (text.length > LIMITS.maxBytes || utf8Length(text) > LIMITS.maxBytes) {
      report(ctx, 1, 'error', `Input exceeds ${LIMITS.maxBytes} bytes, not parsed`);
      return finish(ctx);
    }
    for (const lx of lexLines(text)) {
      if (lx.tooLong) report(ctx, lx.line, 'error', `Line longer than ${LIMITS.maxLineLength} characters`);
      else handleLine(ctx, lx);
      if (ctx.stop) break;
    }
    if (ctx.events.length === 0 && ctx.errors === 0) report(ctx, 1, 'warning', 'No sequence events found');
  } catch (e) {
    report(ctx, 1, 'error', `Internal parser error: ${e instanceof Error ? e.message : 'unknown'}`);
  }
  return finish(ctx);
}
