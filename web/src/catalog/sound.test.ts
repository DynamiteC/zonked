import { describe, expect, it } from 'vitest';
import { parseSbg as parse } from '../sbg';
import { voiceToParams, SLOT, PARAM_COUNT, clampLayers } from '../audio/params';
import { NO_LAYERS } from '../sbg/layers';
import { BAND_GUIDE, bandForHz } from './bands';
import { getTemplates } from './registry';
import { SOUND_MENU, alertToBeat, alertToLayers, soundVoice } from './soundMenu';
import { templateToEvents } from './events';

describe('sound menu', () => {
  it('has seven items whose templates exist and use the matching sound', () => {
    expect(SOUND_MENU).toHaveLength(7);
    const all = getTemplates();
    for (const item of SOUND_MENU) {
      const t = all.find((x) => x.id === item.templateId);
      expect(t, item.id).toBeDefined();
      expect(item.blurb.length).toBeGreaterThan(10);
    }
    const v = all.find((x) => x.id === 'starter-violet');
    expect(v?.stages[0]?.noise).toBe('violet');
  });
  it('soundVoice clamps and is safe for NaN', () => {
    expect(soundVoice('violet', Number.NaN).noiseLevel).toBe(0);
    expect(soundVoice('rain', 9).noiseLevel).toBe(1);
    expect(soundVoice('piano', 0.5).layers.instKind).toBe(3);
  });
  it('alertToBeat is stepwise, bounded and NaN safe', () => {
    expect(alertToBeat(0)).toBe(2.5);
    expect(alertToBeat(1)).toBe(20);
    expect(alertToBeat(Number.NaN)).toBe(2.5);
    for (const a of [-5, 0.3, 0.5, 0.99, 7]) {
      expect(alertToBeat(a)).toBeGreaterThanOrEqual(0.5);
      expect(alertToBeat(a)).toBeLessThanOrEqual(40);
    }
    const out = alertToLayers(0.5, NO_LAYERS);
    expect(out.breathRateHz).toBeGreaterThanOrEqual(0.05);
  });
});

describe('band guide', () => {
  it('covers 0.5 to 40 Hz with honest wording', () => {
    expect(BAND_GUIDE.map((b) => b.name)).toEqual(['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma']);
    expect(bandForHz(6).name).toBe('Theta');
    expect(bandForHz(40).name).toBe('Gamma');
    expect(bandForHz(Number.NaN).name).toBe('Delta');
    for (const b of BAND_GUIDE) {
      expect(b.note).toContain('Not a medical device');
      expect(b.note.toLowerCase()).not.toMatch(/cure|treat/);
      expect(b.sources.every((s) => /^S\d+$/.test(s))).toBe(true);
    }
  });
});

describe('violet and new slots', () => {
  it('parser accepts violet and params map it to 4', () => {
    const r = parse('mode: bin\nx: 200+10/0.4 violet/20\n00:00:00 x\n');
    expect(r.diagnostics.filter((d) => d.severity === 'error')).toEqual([]);
    const v = r.events[0]?.voice;
    expect(v?.noise).toBe('violet');
    const b = voiceToParams(v!, 1, new Float32Array(PARAM_COUNT));
    expect(b[SLOT.noiseKind]).toBe(4);
  });
  it('clamps the new fields', () => {
    const l = clampLayers({ ...NO_LAYERS, breathRateHz: 9, panRateHz: 0, stereoWidth: Number.NaN, instKind: 9, lofiProgression: 40 });
    expect(l.breathRateHz).toBe(0.2);
    expect(l.panRateHz).toBe(0.02);
    expect(l.stereoWidth).toBe(0);
    expect(l.instKind).toBe(3);
    expect(l.lofiProgression).toBe(7);
  });
});

describe('template moods', () => {
  it('layered templates differ in progression and key, and all stay in bounds', () => {
    const all = getTemplates();
    const progs = new Set<number>();
    const keys = new Set<number>();
    for (const t of all) {
      for (const e of templateToEvents(t)) {
        const l = e.voice.layers;
        if (l !== undefined && l.lofiLevel > 0) progs.add(l.lofiProgression);
        if (l !== undefined && l.padLevel > 0) keys.add(l.padRootHz);
        expect(l?.breathDepth ?? 0).toBeLessThanOrEqual(1);
      }
    }
    expect(progs.size).toBeGreaterThanOrEqual(3);
    expect(keys.size).toBeGreaterThanOrEqual(4);
    expect(all.some((t) => t.stages.some((s) => s.layers?.instKind === 3))).toBe(true);
  });
});
