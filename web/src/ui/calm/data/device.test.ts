import { describe, expect, it } from 'vitest';
import { recommendTemplates } from '../../../catalog';
import { usesBinaural } from '../../../catalog/features';
import { SAMPLES } from '../../../audio/samples/catalog';
import {
  DEFAULT_PROFILE, DEVICE_KEY, bluetoothDelta, clearAll, createMemoryStorage, loadDevice, loadProfile,
  migrateDevice, orderForDevice, profileToRecommendation, recommendForDevice, saveDevice, saveProfile,
} from './index';
import type { Profile } from './index';

const P: Profile = { goal: 'study', timeOfDay: 'evening', device: 'wired', extraGentle: false, createdAt: 5 };
const NOW = new Date(2026, 0, 1, 19, 0);

describe('device storage and migration', () => {
  it('maps old values to wired and rejects unknown ones', () => {
    expect(migrateDevice('headphones')).toBe('wired');
    expect(migrateDevice('unsure')).toBe('wired');
    expect(migrateDevice('bluetooth')).toBe('bluetooth');
    expect(migrateDevice('speakers')).toBe('speakers');
    expect(migrateDevice('radio')).toBeUndefined();
    expect(migrateDevice(7)).toBeUndefined();
  });

  it('round trips under zonked.device.v1', () => {
    const st = createMemoryStorage();
    expect(DEVICE_KEY).toBe('zonked.device.v1');
    expect(loadDevice(st)).toBeUndefined();
    expect(saveDevice(st, 'bluetooth')).toBe(true);
    expect(loadDevice(st)).toBe('bluetooth');
    expect(loadProfile(st).device).toBe('bluetooth');
  });

  it('migrates an old profile once and writes the new key', () => {
    const st = createMemoryStorage();
    st.set('zonked.profile.v1', JSON.stringify({ v: 1, goal: 'sleep', timeOfDay: 'night', device: 'headphones', extraGentle: false, createdAt: 9 }));
    expect(loadProfile(st).device).toBe('wired');
    expect(loadDevice(st)).toBe('wired');
    st.set('zonked.profile.v1', JSON.stringify({ v: 1, goal: 'sleep', timeOfDay: 'night', device: 'unsure', extraGentle: false, createdAt: 9 }));
    expect(loadProfile(st).device).toBe('wired');
  });

  it('the device key wins, saving a profile writes it, and forget clears it', () => {
    const st = createMemoryStorage();
    saveProfile(st, { ...P, device: 'speakers' });
    expect(loadDevice(st)).toBe('speakers');
    saveDevice(st, 'bluetooth');
    expect(loadProfile(st).device).toBe('bluetooth');
    st.set(DEVICE_KEY, '{"v":1,"device":"nope"}');
    expect(loadDevice(st)).toBeUndefined();
    clearAll(st);
    expect(st.get(DEVICE_KEY)).toBeNull();
    expect(loadProfile(st)).toEqual(DEFAULT_PROFILE);
  });
});

describe('recommendation per device', () => {
  const ctxFor = (device: Profile['device'], extra = false): ReturnType<typeof profileToRecommendation> =>
    profileToRecommendation({ ...P, device, extraGentle: extra }, NOW);

  it('wired keeps exactly the picks the recommender gives', () => {
    const ctx = ctxFor('wired');
    expect(recommendForDevice(ctx, 'wired', 5).map((r) => r.template.id)).toEqual(recommendTemplates(ctx, 5).map((r) => r.template.id));
  });

  it('bluetooth scores tonal, low-hiss picks no lower than the plain list and never exceeds its intensity', () => {
    const ctx = ctxFor('bluetooth');
    const base = recommendTemplates(ctx, 5);
    const bt = recommendForDevice(ctx, 'bluetooth', 5);
    expect(bt).toHaveLength(5);
    const sum = (l: typeof bt): number => l.reduce((n, r) => n + bluetoothDelta(r.template), 0);
    expect(sum(bt)).toBeGreaterThanOrEqual(sum(base));
    const ceiling = Math.max(...base.map((r) => r.template.intensity));
    for (const r of bt) expect(r.template.intensity).toBeLessThanOrEqual(ceiling);
    const gentle = recommendForDevice(ctxFor('bluetooth', true), 'bluetooth', 5);
    for (const r of gentle) expect(r.template.intensity).toBeLessThanOrEqual(3);
  });

  it('speakers avoid binaural picks when others exist', () => {
    const picks = recommendForDevice(ctxFor('speakers'), 'speakers', 5);
    expect(picks.filter((r) => usesBinaural(r.template)).length).toBeLessThanOrEqual(1);
  });

  it('puts btFriendly sounds first for Bluetooth only', () => {
    const bt = orderForDevice(SAMPLES, 'bluetooth');
    const firstUnfriendly = bt.findIndex((s) => !s.btFriendly);
    expect(bt.slice(firstUnfriendly).every((s) => !s.btFriendly)).toBe(true);
    expect(orderForDevice(SAMPLES, 'wired')).toBe(SAMPLES);
    expect(orderForDevice(SAMPLES, 'speakers')).toBe(SAMPLES);
  });
});
