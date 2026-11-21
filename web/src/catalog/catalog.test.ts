import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BOUNDS } from '../sbg/limits';
import { LAYER_BOUNDS } from '../sbg/layers';
import {
  CATEGORIES, LAYER_TAGS, SITUATIONS, TEMPLATES, VIBES, buildTemplates, getTemplates, recommendTemplates, searchTemplates,
  templateToEvents, usesCrackle, usesPercussion, usesBinaural,
  type DeviceType, type RecContext, type Sensitivity, type TimeOfDay,
} from './index';

const T = getTemplates();

describe('catalog data', () => {
  it('has at least 210 templates and 15 per category', () => {
    expect(T.length).toBeGreaterThanOrEqual(210);
    for (const c of CATEGORIES) expect(T.filter((t) => t.category === c).length).toBeGreaterThanOrEqual(15);
  });
  it('has unique ids and names', () => {
    expect(new Set(T.map((t) => t.id)).size).toBe(T.length);
    expect(new Set(T.map((t) => t.name)).size).toBe(T.length);
  });
  it('counts android and gnaural seeds', () => {
    expect(T.filter((t) => t.source === 'android').length).toBe(21);
    expect(T.filter((t) => t.source === 'gnaural').length).toBe(3);
  });
  it('is deterministic', () => {
    expect(buildTemplates()).toEqual(buildTemplates());
    expect(getTemplates()).toBe(getTemplates());
  });
  it('lazy TEMPLATES behaves like the array', () => {
    expect(TEMPLATES.length).toBe(T.length);
    expect(TEMPLATES[0]).toBe(T[0]);
    expect([...TEMPLATES].length).toBe(T.length);
  });
  it('covers all vibes and situations (>= 12 each)', () => {
    for (const v of VIBES) expect(T.some((t) => t.vibe === v)).toBe(true);
    for (const s of SITUATIONS) expect(T.filter((t) => t.situations.includes(s)).length).toBeGreaterThanOrEqual(12);
  });
  it('keeps all stages within hearing-safety bounds and ordered', () => {
    for (const t of T) {
      expect(t.stages.length).toBeGreaterThan(0);
      let prev = -1;
      for (const s of t.stages) {
        expect(s.atMin).toBeGreaterThanOrEqual(prev);
        prev = s.atMin;
        expect(s.carrierHz).toBeGreaterThanOrEqual(BOUNDS.carrierMin);
        expect(s.carrierHz).toBeLessThanOrEqual(BOUNDS.carrierMax);
        expect(s.beatHz).toBeGreaterThanOrEqual(BOUNDS.beatMin);
        expect(s.beatHz).toBeLessThanOrEqual(BOUNDS.beatMax);
        expect(s.gain).toBeLessThanOrEqual(BOUNDS.gainMax);
        expect(s.noiseLevel).toBeGreaterThanOrEqual(0);
        expect(s.noiseLevel).toBeLessThanOrEqual(1);
      }
    }
  });
  it('layer tags are truthful and ADHD flags follow the rules', () => {
    for (const t of T) {
      expect(t.layerTags.includes('percussion')).toBe(usesPercussion(t));
      expect(t.layerTags.includes('binaural')).toBe(usesBinaural(t));
      expect(t.layerTags.includes('lofi')).toBe(t.stages.some((s) => (s.layers?.lofiLevel ?? 0) > 0 || (s.layers?.crackle ?? 0) > 0));
      for (const tag of t.layerTags) expect(LAYER_TAGS).toContain(tag);
      if (t.adhdFriendly) {
        expect(t.intensity).toBeLessThanOrEqual(3);
        expect(usesCrackle(t)).toBe(false);
      }
    }
    expect(T.filter((t) => t.category === 'adhd-control' && t.adhdFriendly).length).toBeGreaterThanOrEqual(15);
    const perc = T.filter((t) => t.category === 'adhd-control' && usesPercussion(t));
    for (const t of perc) for (const s of t.stages) expect(s.layers?.percBpm ?? 0).toBeLessThanOrEqual(100);
  });
});

describe('templateToEvents', () => {
  it('is safe and sorted for every template', () => {
    for (const t of T) {
      const ev = templateToEvents(t);
      expect(ev.length).toBeGreaterThan(1);
      expect(ev.length).toBeLessThanOrEqual(500);
      ev.forEach((e, i) => {
        if (i > 0) expect(e.tSec).toBeGreaterThanOrEqual(ev[i - 1]?.tSec ?? 0);
        const v = e.voice;
        expect(v.carrierHz).toBeGreaterThanOrEqual(20);
        expect(v.carrierHz).toBeLessThanOrEqual(1500);
        expect(v.beatHz).toBeGreaterThanOrEqual(0.5);
        expect(v.beatHz).toBeLessThanOrEqual(40);
        expect(v.gain).toBeLessThanOrEqual(0.85);
        const l = v.layers;
        expect(l).toBeDefined();
        if (l === undefined) return;
        for (const k of ['lofiLevel', 'crackle', 'instLevel', 'padLevel', 'chimeLevel', 'percLevel'] as const) {
          expect(l[k]).toBeGreaterThanOrEqual(0);
          expect(l[k]).toBeLessThanOrEqual(1);
        }
        for (const k of ['instScale', 'padChord', 'percPattern'] as const) {
          expect(Number.isInteger(l[k])).toBe(true);
          expect(l[k]).toBeLessThanOrEqual(LAYER_BOUNDS.enumMax);
        }
        expect(l.instRootHz).toBeGreaterThanOrEqual(55);
        expect(l.padRootHz).toBeLessThanOrEqual(440);
      });
      expect(ev[ev.length - 1]?.ramp).toBe(false);
    }
  });
  it('clamps hostile stage values', () => {
    const base = T[0];
    if (base === undefined) throw new Error('empty');
    const bad = {
      ...base, stages: [{ ...base.stages[0]!, atMin: Number.NaN, beatHz: 999, carrierHz: 1, gain: 5, noiseLevel: -2, layers: { padLevel: 9, padChord: 99, instRootHz: Infinity } }],
    };
    const e = templateToEvents(bad)[0];
    expect(e?.voice.beatHz).toBe(40);
    expect(e?.voice.carrierHz).toBe(20);
    expect(e?.voice.gain).toBe(0.85);
    expect(e?.voice.layers?.padLevel).toBe(1);
    expect(e?.voice.layers?.padChord).toBe(7);
    expect(e?.tSec).toBe(0);
  });
});

const TODS: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
const DEVICES: DeviceType[] = ['headphones', 'bluetooth', 'speaker'];
const SENS: Sensitivity[] = ['low', 'medium', 'high'];

describe('recommender', () => {
  it('returns >= 5 distinct, ranked, explained results for every context', () => {
    for (const situation of SITUATIONS) for (const deviceType of DEVICES) for (const sensorySensitivity of SENS) for (const timeOfDay of TODS) {
      const ctx: RecContext = { situation, deviceType, sensorySensitivity, timeOfDay, availableMinutes: 20 };
      const r = recommendTemplates(ctx);
      expect(r.length).toBeGreaterThanOrEqual(5);
      expect(new Set(r.map((x) => x.template.id)).size).toBe(r.length);
      r.forEach((x, i) => {
        expect(x.reasons.length).toBeGreaterThan(0);
        if (i > 0) expect(x.score).toBeLessThanOrEqual(r[i - 1]?.score ?? 0);
      });
      expect(recommendTemplates(ctx)).toEqual(r);
    }
  });
  it('honors limit and tiny or huge time budgets', () => {
    const base: RecContext = { situation: 'deep-work', deviceType: 'headphones', sensorySensitivity: 'low', timeOfDay: 'morning', availableMinutes: 1 };
    expect(recommendTemplates(base, 12)).toHaveLength(12);
    expect(recommendTemplates({ ...base, availableMinutes: 100000 }).length).toBeGreaterThanOrEqual(5);
  });
  it('prefers non-binaural on speaker and warns on binaural', () => {
    for (const situation of SITUATIONS) {
      const r = recommendTemplates({ situation, deviceType: 'speaker', sensorySensitivity: 'low', timeOfDay: 'morning', availableMinutes: 30 }, 10);
      const firstBin = r.findIndex((x) => usesBinaural(x.template));
      const lastNon = r.map((x) => !usesBinaural(x.template)).lastIndexOf(true);
      if (firstBin >= 0 && lastNon >= 0) expect(lastNon).toBeLessThan(firstBin + 10);
      for (const x of r) {
        const warned = x.reasons.some((s) => s.startsWith('Warning: binaural'));
        expect(warned).toBe(usesBinaural(x.template));
      }
      expect(r.slice(0, 5).some((x) => !usesBinaural(x.template))).toBe(true);
    }
  });
  it('excludes intense, percussive and crackly templates when sensitivity is high', () => {
    for (const situation of SITUATIONS) for (const timeOfDay of TODS) {
      const r = recommendTemplates({ situation, deviceType: 'headphones', sensorySensitivity: 'high', timeOfDay, availableMinutes: 30 }, 8);
      for (const x of r) {
        expect(x.template.intensity).toBeLessThanOrEqual(3);
        expect(usesPercussion(x.template)).toBe(false);
        expect(usesCrackle(x.template)).toBe(false);
      }
    }
  });
});

describe('search', () => {
  it('filters by category, vibe, adhd and layer tags, case-insensitively, in stable order', () => {
    expect(searchTemplates({ category: 'sleep' }).every((t) => t.category === 'sleep')).toBe(true);
    expect(searchTemplates({ vibe: 'lofi' }).length).toBeGreaterThan(0);
    expect(searchTemplates({ adhdFriendly: true }).every((t) => t.adhdFriendly)).toBe(true);
    expect(searchTemplates({ layerTags: ['percussion', 'lofi'] }).every((t) => t.layerTags.includes('percussion') && t.layerTags.includes('lofi'))).toBe(true);
    const a = searchTemplates({ text: 'DELTA' });
    expect(a.length).toBeGreaterThan(0);
    expect(searchTemplates({ text: 'delta' })).toEqual(a);
    expect(searchTemplates({}).length).toBe(T.length);
    expect(searchTemplates({ text: 'zzzzqqq' })).toEqual([]);
  });
});

describe('purity', () => {
  it('uses no Date, Math.random, performance or storage in catalog sources', () => {
    const files = [
      ...readdirSync(__dirname).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts')).map((f) => join(__dirname, f)),
      ...readdirSync(join(__dirname, 'archetypes')).map((f) => join(__dirname, 'archetypes', f)),
    ];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      expect(src, f).not.toMatch(/Math\.random|Date\.now|new Date|performance\.now|localStorage|document\.|window\./);
    }
  });
});
