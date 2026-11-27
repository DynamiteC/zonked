import { describe, expect, it } from 'vitest';
import { CALM, FEELINGS } from '../ui/calm/copy';
import { JOURNEYS } from '../ui/calm/data';
import { getTemplates } from './registry';
import { SOUND_MENU } from './soundMenu';

/** Outcome and medical wording that Zonked never uses. Describe the sound, not an effect on the body. */
export const BANNED =
  /\b(treats?|treatment|cures?|cured|heals?|healed|therap\w*|anxiety|depress\w*|insomnia|relieves?|relief|diagnos\w*|reduc(?:e|es|ed|ing) (?:anxiety|stress|tension|pain)|improv(?:e|es|ed|ing) (?:sleep|focus|mood|memory)|(?:lowers?|eases?) (?:tension|stress|anxiety)|ease sleep|sleep onset|racing thoughts|lifts? mood|your brain)\b/i;

const resolved = (t: { reasonTemplate: string; recommendedMinutes: number }): string =>
  t.reasonTemplate.replaceAll('{minutes}', String(t.recommendedMinutes));

describe('catalog copy', () => {
  it('the word list catches the lines it was written for', () => {
    for (const bad of ['to ease sleep onset', 'quiet racing thoughts', 'it treats stress', 'reduces anxiety', 'improves sleep', 'Heals you', 'lowers tension']) expect(bad).toMatch(BANNED);
    for (const ok of ['Reduce motion', 'A soft pad with a gliding beat.', 'Zonked is not a medical device.']) expect(ok).not.toMatch(BANNED);
  });

  it('has no outcome or medical wording in any description', () => {
    const bad = getTemplates().filter((t) => BANNED.test(t.reasonTemplate)).map((t) => `${t.id}: ${t.reasonTemplate}`);
    expect(bad).toEqual([]);
    for (const s of SOUND_MENU) expect(s.blurb).not.toMatch(BANNED);
    for (const f of FEELINGS) expect(f.mood).not.toMatch(BANNED);
  });

  it('has no outcome wording in Calm text or journeys', () => {
    const values: readonly unknown[] = Object.values(CALM);
    const flat = values.flatMap((v) => (Array.isArray(v) ? (v as unknown[]) : [v])).filter((v): v is string => typeof v === 'string');
    expect(flat.filter((s) => BANNED.test(s))).toEqual([]);
    expect(JOURNEYS.flatMap((j) => [j.title, j.blurb]).filter((x) => BANNED.test(x))).toEqual([]);
  });

  it('never repeats a description across cards', () => {
    const seen = new Set<string>();
    const dup = getTemplates().map(resolved).filter((r) => (seen.has(r) ? true : (seen.add(r), false)));
    expect(dup).toEqual([]);
  });

  it('fills every length token from the data, so words never disagree with the minutes', () => {
    for (const t of getTemplates()) {
      expect(t.reasonTemplate.replace('{minutes}', '')).not.toMatch(/[{}]/);
      if (t.source !== 'original') expect(t.reasonTemplate).not.toContain('{minutes}');
    }
    const creative = getTemplates().find((t) => t.id === 'android-creativity');
    expect(creative?.reasonTemplate).toBe('Drifts back and forth between 10 and 6 Hz.');
    const smr = getTemplates().find((t) => t.id === 'android-smr-sleep');
    expect(smr?.reasonTemplate.startsWith('Beats crossing')).toBe(true);
  });

  it('never says a length twice and keeps band jargon out of plain cards', () => {
    for (const t of getTemplates()) expect(t.reasonTemplate).not.toMatch(/\{duration\}|minutes that|beta down to alpha/);
    const sits = getTemplates().filter((t) => t.id.startsWith('meditation-alpha-sit') && t.recommendedMinutes === 10).map(resolved);
    expect(new Set(sits.map((r) => r.split('.')[0])).size).toBe(sits.length);
  });
});
