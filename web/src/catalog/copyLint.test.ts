import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BOUNDS } from '../sbg/limits';
import { SX } from '../ui/sanctuary/copy';
import { CALM, EVIDENCE, FEELINGS, GOAL_LABEL } from '../ui/calm/copy';
import { JOURNEYS } from '../ui/calm/data';
import { BAND_GUIDE } from './bands';
import { LEGACY_TEMPLATE_IDS } from './legacyIds';
import { getTemplates } from './registry';
import { SOUND_MENU } from './soundMenu';
import { templateToEvents } from './events';

/** Claim-like words that must not appear in shipped wording. Ids are not wording and are not scanned. */
export const BANNED_CLAIMS =
  /\b(treat\w*|cures?|cured|heal(?:s|ed|ing|er|ers)?|therap\w*|pain|adhd|morphine|opioids?|trippy|lucid|hypnos\w*|insomnia|anxiety relief|helps? with|trouble sleeping|diagnos\w*|depress\w*)\b/i;

/** Negations and stop symptoms that are safety wording, not claims. */
const SAFE_PHRASES = ['in pain', 'cannot treat or cure anything', 'does not diagnose, treat or cure', 'It does not diagnose'];
const clean = (s: string): string => SAFE_PHRASES.reduce((acc, p) => acc.replaceAll(p, ''), s);

const strings = (v: unknown): string[] => {
  if (typeof v === 'string') return [v];
  if (Array.isArray(v)) return v.flatMap(strings);
  if (v !== null && typeof v === 'object') return Object.values(v).flatMap(strings);
  return [];
};
const hits = (list: readonly string[]): string[] => list.filter((s) => BANNED_CLAIMS.test(clean(s)));

describe('copy lint: banned claim words', () => {
  it('the list catches the words it was written for', () => {
    for (const bad of ['Morphine Ease', 'for pain', 'ADHD friendly', 'Heal from stress', 'a trippy slide', 'Lucid dreaming', 'self hypnosis', 'helps with stress', 'cures it', 'a treatment']) {
      expect(bad).toMatch(BANNED_CLAIMS);
    }
    for (const ok of ['Reduce motion', 'Warm Hum', 'Stop if you feel dizzy, anxious, in pain.']) expect(clean(ok)).not.toMatch(BANNED_CLAIMS);
  });

  it('keeps names, descriptions and tags in the catalog free of claims', () => {
    const list = getTemplates().flatMap((t) => [t.name, t.reasonTemplate, ...t.tags]);
    expect(hits(list)).toEqual([]);
  });

  it('keeps Calm text, feelings, evidence lines, sound menu and journeys free of claims', () => {
    expect(hits([...strings(CALM), ...strings(EVIDENCE), ...strings(GOAL_LABEL), ...FEELINGS.flatMap((f) => [f.label, f.mood]), ...strings(JOURNEYS.map((j) => [j.title, j.blurb]))])).toEqual([]);
    expect(hits(SOUND_MENU.flatMap((s) => [s.name, s.blurb]))).toEqual([]);
  });

  it('keeps Sanctuary text and band notes free of claims', () => {
    expect(hits(strings(SX))).toEqual([]);
    expect(hits(BAND_GUIDE.flatMap((b) => [b.mayHelp, b.note]))).toEqual([]);
  });

  it('keeps agent wording free of claims', () => {
    const root = join(__dirname, '..', '..', '..');
    const files = [
      ...readdirSync(join(root, 'app', 'agents')).map((f) => join(root, 'app', 'agents', f)),
      ...readdirSync(join(root, '.kiro', 'crew', 'agents')).map((f) => join(root, '.kiro', 'crew', 'agents', f)),
    ];
    expect(files.length).toBeGreaterThanOrEqual(6);
    for (const f of files) expect(hits([readFileSync(f, 'utf8')]), f).toEqual([]);
  });

  it('shows no burnout or load words in Calm text', () => {
    expect(strings(CALM).filter((s) => /\b(burnout|load)\b/i.test(s))).toEqual([]);
  });
});

describe('safety notice content', () => {
  const all = CALM.safetyLines.join(' ');
  it('has every required point in plain words', () => {
    for (const re of [/ask a doctor first/i, /seizure disorder/i, /mental health condition/i, /tinnitus/i, /very low volume/i, /still talk easily/i,
      /driving or operating machinery/i, /Reduce motion/, /dizzy, anxious, in pain/i, /ears ring or feel full/i, /not a medical device/i]) {
      expect(all).toMatch(re);
    }
    expect(CALM.safetyLimits).not.toMatch(/\bHz\b/);
    expect(CALM.safetyLines.every((l) => l.length <= 120)).toBe(true);
  });
  it('repeats the key points in the Guide', () => {
    const guide = CALM.guideCards.map((c) => c.body).join(' ');
    expect(guide).toMatch(/still talk easily/);
    expect(guide).toMatch(/ask a doctor first/i);
  });
});

describe('original seed templates', () => {
  const seeds = getTemplates().filter((t) => t.id.startsWith('seed-'));
  it('has 24 original seeds and no android- or gnaural- ids', () => {
    expect(seeds).toHaveLength(24);
    expect(getTemplates().filter((t) => /^(android|gnaural)-/.test(t.id))).toEqual([]);
    expect(seeds.every((t) => t.source === 'original')).toBe(true);
  });
  it('maps every old id to a current template', () => {
    const ids = new Set(getTemplates().map((t) => t.id));
    expect(Object.keys(LEGACY_TEMPLATE_IDS)).toHaveLength(24);
    for (const [oldId, newId] of Object.entries(LEGACY_TEMPLATE_IDS)) {
      expect(/^(android|gnaural)-/.test(oldId)).toBe(true);
      expect(ids.has(newId), newId).toBe(true);
    }
    expect(new Set(Object.values(LEGACY_TEMPLATE_IDS)).size).toBe(24);
  });
  it('keeps every template inside the hearing limits, before and after conversion', () => {
    for (const t of getTemplates()) {
      for (const s of t.stages) {
        expect(s.carrierHz).toBeGreaterThanOrEqual(BOUNDS.carrierMin);
        expect(s.carrierHz).toBeLessThanOrEqual(BOUNDS.carrierMax);
        expect(s.beatHz).toBeGreaterThanOrEqual(BOUNDS.beatMin);
        expect(s.beatHz).toBeLessThanOrEqual(BOUNDS.beatMax);
        expect(s.gain).toBeLessThanOrEqual(BOUNDS.gainMax);
      }
      for (const e of templateToEvents(t)) {
        expect(e.voice.carrierHz).toBeGreaterThanOrEqual(20);
        expect(e.voice.carrierHz).toBeLessThanOrEqual(1500);
        expect(e.voice.beatHz).toBeGreaterThanOrEqual(0.5);
        expect(e.voice.beatHz).toBeLessThanOrEqual(40);
        expect(e.voice.gain).toBeLessThanOrEqual(0.85);
      }
    }
  });
  it('marks sessions over 60 minutes as long', () => {
    for (const t of seeds.filter((x) => x.recommendedMinutes > 60)) expect(t.reasonTemplate).toContain('long session');
  });
});
