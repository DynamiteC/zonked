import { describe, expect, it } from 'vitest';
import { BOUNDS, LIMITS, PRESETS, eventAt, parseSbg, totalDuration, voiceAt } from './index';
import { lexLines, tokenize, utf8Length } from './lexer';
import { SILENT_VOICE } from './sequencer';
import type { SbgEvent, Voice } from './types';

const errs = (t: string) => parseSbg(t).diagnostics.filter((d) => d.severity === 'error');
const warns = (t: string) => parseSbg(t).diagnostics.filter((d) => d.severity === 'warning');

function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('lexer', () => {
  it('handles CRLF, CR, LF, BOM and comments', () => {
    const l = lexLines('\uFEFFa: 1\r\n# c\r\nb: 2\rc: 3\n\n  d: 4 # tail');
    expect(l.map((x) => [x.line, x.tokens[0]])).toEqual([
      [1, 'a:'],
      [3, 'b:'],
      [4, 'c:'],
      [6, 'd:'],
    ]);
  });
  it('flags long lines and tokenizes edge cases', () => {
    expect(lexLines('x'.repeat(513))[0]?.tooLong).toBe(true);
    expect(tokenize('a\tb\u00a0c#d')).toEqual(['a', 'b', 'c']);
    expect(tokenize('#only')).toEqual([]);
  });
  it('measures utf8', () => {
    expect(utf8Length('a\u00e9\u20ac\ud83d\ude00\ud800x')).toBe(1 + 2 + 3 + 4 + 3 + 1);
    expect(utf8Length('\ud83d')).toBe(3);
  });
});

describe('parseSbg', () => {
  const base = 'a: 200+10/0.5\nb: 300@5 pink/40\n';
  it('parses definitions and events', () => {
    const r = parseSbg(`${base}00:00:00 a ->\n00:01:30 b\n`);
    expect(r.ok).toBe(true);
    expect(r.events).toHaveLength(2);
    expect(r.events[0]).toMatchObject({ tSec: 0, ramp: true, line: 3 });
    expect(r.events[1]?.voice).toMatchObject({ carrierHz: 300, beatHz: 5, noise: 'pink', noiseLevel: 0.4 });
    expect(r.durationSec).toBe(90);
  });
  it('supports NOW, HH:MM, glued defs, name-> and modes', () => {
    const r = parseSbg('mode: iso\nx:200+8\nm: mono 250@4\nNOW x->\n00:10 m\n');
    expect(r.ok).toBe(true);
    expect(r.events[0]?.ramp).toBe(true);
    expect(r.events[0]?.voice.mode).toBe('isochronic');
    expect(r.events[1]?.voice.mode).toBe('monaural');
    expect(r.events[1]?.tSec).toBe(600);
  });
  it('maps mode aliases and noise-only sets', () => {
    const r = parseSbg('n: white\nq: brown/50 bin\nr: isochronic\ns: binaural\nt: monaural\n00:00:00 n\n00:00:01 q\n');
    expect(r.events[0]?.voice).toMatchObject({ noise: 'white', noiseLevel: 0.3, gain: 0 });
    expect(r.events[1]?.voice.noise).toBe('brown');
  });
  it('empty, whitespace-only and comment-only input', () => {
    for (const t of ['', '   \n\r\n', '# hi', '\uFEFF']) {
      const r = parseSbg(t);
      expect(r.ok).toBe(true);
      expect(r.events).toEqual([]);
      expect(r.diagnostics[0]?.severity).toBe('warning');
    }
  });
  it('rejects non-string and oversized input', () => {
    expect(parseSbg(undefined as unknown as string).ok).toBe(false);
    const big = parseSbg('#'.repeat(LIMITS.maxBytes + 1));
    expect(big.ok).toBe(false);
    expect(big.diagnostics).toHaveLength(1);
    expect(parseSbg('\u20ac'.repeat(100000)).ok).toBe(false);
    expect(parseSbg('#\n'.repeat(LIMITS.maxBytes / 2)).ok).toBe(true);
  });
  it('caps events at 500 with a line number', () => {
    let t = 'a: 200+10\n';
    for (let i = 0; i < 501; i++) t += '00:00:00 a\n';
    const r = parseSbg(t);
    expect(r.ok).toBe(false);
    expect(r.events).toHaveLength(500);
    expect(errs(t)[0]?.line).toBe(502);
    expect(errs(t + '00:00:00 a\n')).toHaveLength(1);
  });
  it('errors on long lines with line number', () => {
    const r = parseSbg(`a: 200+10\n${'x'.repeat(600)}\n00:00:00 a\n`);
    expect(r.ok).toBe(false);
    expect(r.diagnostics.find((d) => d.severity === 'error')?.line).toBe(2);
    expect(r.events).toHaveLength(1);
  });
  it('clamps out-of-range values with warnings and lines', () => {
    const r = parseSbg('a: 5+100/2 pink/500\nb: 9999@0.1\nc: -5@-3/-1 white/-10\n00:00:00 a\n00:00:01 b\n00:00:02 c\n');
    expect(r.ok).toBe(true);
    expect(r.events[0]?.voice).toMatchObject({ carrierHz: 20, beatHz: 40, gain: 0.85, noiseLevel: 1 });
    expect(r.events[1]?.voice).toMatchObject({ carrierHz: 1500, beatHz: 0.5 });
    expect(r.events[2]?.voice).toMatchObject({ carrierHz: 20, beatHz: 0.5, gain: 0, noiseLevel: 0 });
    const w = r.diagnostics.filter((d) => d.severity === 'warning');
    expect(w.length).toBeGreaterThanOrEqual(9);
    expect(w.every((d) => d.line >= 1 && d.line <= 3)).toBe(true);
  });
  it('rejects NaN, Infinity and huge numbers as unknown tokens', () => {
    const t = `a: NaN Infinity 200+Infinity ${'9'.repeat(400)} 1e999 200+10\n00:00:00 a\n`;
    const r = parseSbg(t);
    expect(r.ok).toBe(true);
    expect(r.events[0]?.voice.beatHz).toBe(10);
    expect(warns(t).filter((w) => w.message.startsWith('Unknown token')).length).toBe(5);
    for (const e of r.events) expect(Number.isFinite(e.voice.carrierHz + e.voice.beatHz + e.voice.gain)).toBe(true);
  });
  it('errors on decreasing, out-of-range and malformed times', () => {
    const d = 'a: 200+10\n';
    expect(errs(`${d}00:10:00 a\n00:05:00 a\n`)[0]?.line).toBe(3);
    expect(errs(`${d}24:00:01 a\n`)[0]?.line).toBe(2);
    expect(parseSbg(`${d}24:00:00 a\n`).ok).toBe(true);
    expect(errs(`${d}00:61:00 a\n`)).toHaveLength(1);
    expect(errs(`${d}1:2:3:4 a\n`)).toHaveLength(1);
    expect(parseSbg(`${d}00:00:00 a\n00:00:00 a\n`).ok).toBe(true);
  });
  it('warns and skips unknown tokens, names and malformed lines', () => {
    const r = parseSbg('a: 200+10 zzz\nbad name: 1\nfoo\nmode: sideways\nmode:\nempty:\n00:00:00 a extra\n00:00:01\n00:00:02 nope\n');
    expect(r.ok).toBe(true);
    expect(r.events).toHaveLength(1);
    expect(r.diagnostics.every((d) => d.line >= 1)).toBe(true);
    expect(r.diagnostics.length).toBeGreaterThanOrEqual(8);
  });
  it('handles CRLF files and unicode', () => {
    const r = parseSbg('\uFEFFa: 200+10 # \u2603\r\n00:00:00 a\r\n');
    expect(r.ok).toBe(true);
    expect(r.events[0]?.line).toBe(2);
    expect(parseSbg('\u2603: 1\n\ud83d\ude00\n').ok).toBe(true);
  });
  it('limits the diagnostics array', () => {
    const r = parseSbg('x\n'.repeat(5000));
    expect(r.diagnostics.length).toBe(BOUNDS.maxDiagnostics + 1);
  });
  it('treats __proto__ names safely', () => {
    const r = parseSbg('__proto__: 200+10\n00:00:00 __proto__\n00:00:01 constructor\n');
    expect(r.events).toHaveLength(1);
  });
});

const v = (carrierHz: number, beatHz: number, extra: Partial<Voice> = {}): Voice => ({
  carrierHz,
  beatHz,
  noise: 'off',
  noiseLevel: 0,
  mode: 'binaural',
  gain: 0.4,
  ...extra,
});
const ev = (tSec: number, voice: Voice, ramp: boolean): SbgEvent => ({ tSec, voice, ramp, line: 1 });

describe('sequencer', () => {
  const evs = [ev(10, v(200, 10), true), ev(110, v(400, 6, { gain: 0.8 }), false), ev(200, v(300, 2), false)];
  it('handles empty events', () => {
    expect(voiceAt([], 5)).toBe(SILENT_VOICE);
    expect(eventAt([], 5)).toBeUndefined();
    expect(totalDuration([])).toBe(0);
  });
  it('clamps before first and after last', () => {
    expect(voiceAt(evs, -50)).toBe(evs[0]?.voice);
    expect(voiceAt(evs, 1e9)).toBe(evs[2]?.voice);
    expect(voiceAt(evs, NaN)).toBe(evs[0]?.voice);
    expect(voiceAt(evs, Infinity)).toBe(evs[0]?.voice);
    expect(totalDuration(evs)).toBe(200);
  });
  it('interpolates ramps and holds steps', () => {
    expect(voiceAt(evs, 10)).toMatchObject({ carrierHz: 200, beatHz: 10 });
    const mid = voiceAt(evs, 60);
    expect(mid.carrierHz).toBeCloseTo(300);
    expect(mid.beatHz).toBeCloseTo(8);
    expect(mid.gain).toBeCloseTo(0.6);
    expect(voiceAt(evs, 110)).toBe(evs[1]?.voice);
    expect(voiceAt(evs, 150)).toBe(evs[1]?.voice);
  });
  it('blends noise and handles zero span', () => {
    const e = [ev(0, v(200, 10), true), ev(10, v(200, 10, { noise: 'pink', noiseLevel: 0.5 }), false)];
    const m = voiceAt(e, 5);
    expect(m.noise).toBe('pink');
    expect(m.noiseLevel).toBeCloseTo(0.25);
    const keep = [ev(0, v(200, 10, { noise: 'white', noiseLevel: 0.2 }), true), ev(10, v(200, 10), false)];
    expect(voiceAt(keep, 5).noise).toBe('white');
  });
  it('eventAt picks the active event', () => {
    expect(eventAt(evs, 0)).toBe(evs[0]);
    expect(eventAt(evs, 120)).toBe(evs[1]);
  });
});

describe('presets', () => {
  it('has exactly the six contract ids', () => {
    expect(PRESETS.map((p) => p.id)).toEqual([
      'deep-focus',
      'flow-state',
      'burnout-reset',
      'breathwork-sync',
      'deep-rest',
      'classic-1998',
    ]);
  });
  for (const p of PRESETS) {
    it(`${p.id} parses cleanly within bounds`, () => {
      const r = parseSbg(p.sbg);
      expect(r.ok).toBe(true);
      expect(r.diagnostics).toEqual([]);
      expect(r.events.length).toBeGreaterThan(0);
      for (const e of r.events) {
        expect(e.voice.carrierHz).toBeGreaterThanOrEqual(20);
        expect(e.voice.carrierHz).toBeLessThanOrEqual(1500);
        expect(e.voice.beatHz).toBeGreaterThanOrEqual(0.5);
        expect(e.voice.beatHz).toBeLessThanOrEqual(40);
        expect(e.voice.gain).toBeLessThanOrEqual(0.85);
      }
    });
  }
  it('has the specified beats, durations and breath', () => {
    const get = (id: string) => PRESETS.find((p) => p.id === id);
    const beat = (id: string) => parseSbg(get(id)?.sbg ?? '').events[0]?.voice;
    expect(beat('deep-focus')).toMatchObject({ beatHz: 40, carrierHz: 200 });
    expect(beat('flow-state')).toMatchObject({ beatHz: 18, carrierHz: 220 });
    expect(beat('deep-rest')?.beatHz).toBe(2.5);
    expect(get('breathwork-sync')?.breath).toEqual({ inSec: 5.45, outSec: 5.45 });
    expect(beat('breathwork-sync')?.beatHz).toBe(5.5);
    const br = parseSbg(get('burnout-reset')?.sbg ?? '');
    expect(br.durationSec).toBe(1200);
    expect(voiceAt(br.events, 600).beatHz).toBeCloseTo(8);
    expect(parseSbg(get('classic-1998')?.sbg ?? '').durationSec).toBeLessThanOrEqual(900);
  });
});

describe('hardening', () => {
  it('fuzz: 10k random strings never throw and stay bounded', () => {
    const rnd = mulberry(1998);
    const alphabet = 'ab:+@/->#. \t\r\n0123456789NOWpinkmode\u00e9\u2603\ud83d';
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      const len = Math.floor(rnd() * 200);
      let s = '';
      for (let j = 0; j < len; j++) s += alphabet[Math.floor(rnd() * alphabet.length)];
      const r = parseSbg(s);
      expect(r.ok).toBe(!r.diagnostics.some((d) => d.severity === 'error'));
      for (const e of r.events) expect(e.voice.gain).toBeLessThanOrEqual(0.85);
    }
    expect(performance.now() - start).toBeLessThan(10000);
  });
  it('fuzz: token soup from the grammar yields bounded voices', () => {
    const rnd = mulberry(42);
    const parts = ['a:', 'b:', '200+10', '5@99', 'pink/40', 'white/9999', '->', '00:00:00', '00:01:00', 'a', 'b', 'mode:', 'iso', '\n', '\n', ' '];
    for (let i = 0; i < 2000; i++) {
      let s = '';
      for (let j = 0; j < 40; j++) s += parts[Math.floor(rnd() * parts.length)] + ' ';
      for (const e of parseSbg(s).events) {
        expect(e.voice.carrierHz).toBeGreaterThanOrEqual(20);
        expect(e.voice.beatHz).toBeLessThanOrEqual(40);
        expect(Number.isFinite(e.tSec)).toBe(true);
      }
    }
  });
  it('ReDoS: pathological inputs parse in linear time', () => {
    const cases = [
      'a: ' + '9'.repeat(500),
      '+'.repeat(500),
      '@'.repeat(500) + '/'.repeat(10),
      '0:'.repeat(250),
      ('1'.repeat(15) + '.').repeat(30),
      ' '.repeat(500) + 'x',
      'a: ' + '200+'.repeat(120),
    ];
    const big = Array.from({ length: 2000 }, () => cases.join('\n')).join('\n');
    const start = performance.now();
    for (const c of cases) parseSbg(c);
    parseSbg(big.slice(0, LIMITS.maxBytes));
    expect(performance.now() - start).toBeLessThan(2000);
  });
  it('max-size input of valid lines is fast', () => {
    const line = 'a: 200+10 pink/10 # filler filler filler filler filler\n';
    const text = line.repeat(Math.floor(LIMITS.maxBytes / line.length));
    const start = performance.now();
    expect(parseSbg(text).ok).toBe(true);
    expect(performance.now() - start).toBeLessThan(2000);
  });
});
