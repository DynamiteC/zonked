import { describe, expect, it } from 'vitest';
import { listSamples } from '../../../audio/samples';
import { MAX_NATURE_LEVEL } from './prefs';
import { MIX_CODE_MAX, formatMixCode, parseMixCode } from './mixCode';

const KNOWN = ['rain', 'fire'];

describe('mix code', () => {
  it('round trips a mix', () => {
    const code = formatMixCode({ id: 'rain', blend: 0.6, level: 0.3 });
    expect(code).toBe('ZK1-rain-60-30');
    expect(parseMixCode(code, KNOWN)).toEqual({ ok: true, mix: { id: 'rain', blend: 0.6, level: 0.3 } });
  });

  it('every shipped sound id fits the schema', () => {
    const ids = listSamples().map((s) => s.id);
    expect(ids.length).toBeGreaterThan(5);
    for (const id of ids) expect(parseMixCode(formatMixCode({ id, blend: 0.5, level: 0.4 }), ids).ok).toBe(true);
  });

  it('clamps format input and the level cap', () => {
    expect(formatMixCode({ id: 'rain', blend: Number.NaN, level: 9 })).toBe('ZK1-rain-0-85');
    expect(formatMixCode({ id: 'rain', blend: 5, level: -1 })).toBe('ZK1-rain-100-0');
    const hi = parseMixCode('ZK1-rain-50-100', KNOWN);
    expect(hi.ok && hi.mix.level).toBe(MAX_NATURE_LEVEL);
  });

  it('rejects unknown versions, unknown sounds and out of range values', () => {
    for (const bad of ['ZK2-rain-60-30', 'ZK0-rain-60-30', 'ZK1-rain-101-30', 'ZK1-rain-60-101', 'ZK1-nope-60-30', 'ZK1-rain--5-30', 'ZK1-rain-6.5-30']) {
      expect(parseMixCode(bad, KNOWN).ok).toBe(false);
    }
  });

  it('rejects bad shape, odd text and long input', () => {
    const long = `ZK1-rain-60-30${'0'.repeat(MIX_CODE_MAX)}`;
    const bad = ['', '   ', 'rain', 'zk1-rain-60-30', 'ZK1-rain-60', 'ZK1-rain-60-30-1', 'ZK1-ra in-60-30', 'ZK1-<b>-60-30', 'ZK1-own:abc-60-30', "ZK1-rain-60-30'; drop", '__proto__', 'ZK1-rain-1e2-30', long, 'ZK1-rain-60-30\u0000'];
    for (const b of bad) expect(parseMixCode(b, KNOWN).ok).toBe(false);
  });

  it('accepts surrounding white space only', () => {
    expect(parseMixCode('  ZK1-fire-0-0\n', KNOWN).ok).toBe(true);
  });

  it('fuzz: random text never throws and never yields out of range values', () => {
    let seed = 7;
    const rnd = (): number => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    const alphabet = 'ZK1-rainfire0123456789 .:;<>\u0000\u202e%';
    for (let i = 0; i < 3000; i++) {
      const len = Math.floor(rnd() * 80);
      let s = rnd() < 0.5 ? 'ZK1-' : '';
      for (let j = 0; j < len; j++) s += alphabet.charAt(Math.floor(rnd() * alphabet.length));
      const r = parseMixCode(s, KNOWN);
      if (r.ok) {
        expect(KNOWN).toContain(r.mix.id);
        expect(r.mix.blend).toBeGreaterThanOrEqual(0);
        expect(r.mix.blend).toBeLessThanOrEqual(1);
        expect(r.mix.level).toBeLessThanOrEqual(MAX_NATURE_LEVEL);
      }
    }
  });
});
