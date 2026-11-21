// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { exportBackup } from '../../app/backup';
import { NO_FAVORITES } from '../../app/favorites';
import { NEW_STATE } from '../../app/milestones';
import { makeMix } from '../../app/mixes';
import type { Mix, MixDraft } from '../../app/mixes';
import { createStore } from '../../storage/db';
import type { Store } from '../../storage/db';
import Sanctuary from './index';
import type { SanctuaryProps, SanctuarySection } from './types';

const NOW = 1_700_000_000_000;
const draft: MixDraft = {
  source: { kind: 'preset', id: 'calm' },
  voice: { carrierHz: 200, beatHz: 6, mode: 'binaural', noise: 'brown', noiseLevel: 0.2, gain: 0.3 },
  layers: {},
  timer: { kind: 'sleep-fade', minutes: 30 },
};

function setup(section: SanctuarySection, store: Store = createStore(new IDBFactory()), over: Partial<SanctuaryProps> = {}) {
  const onLoadMix = vi.fn<(m: Mix) => void>();
  const onClose = vi.fn();
  const utils = render(
    <Sanctuary
      section={section}
      store={store}
      now={() => NOW}
      nowPlaying={null}
      currentMix={() => draft}
      onLoadMix={onLoadMix}
      onPlayTemplate={vi.fn()}
      reducedMotion={false}
      onClose={onClose}
      {...over}
    />,
  );
  return { store, onLoadMix, onClose, ...utils };
}

afterEach(() => cleanup());

describe('Sanctuary', () => {
  it('shows the free and private promise and never uses the network', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    setup('mission');
    await screen.findByTestId('sanctuary-mission');
    expect(screen.getByTestId('sanctuary-privacy').textContent).toMatch(/No account/);
    expect(screen.getByTestId('sanctuary').getAttribute('role')).toBe('region');
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('guide says it is not a medical device', async () => {
    setup('guide');
    const g = await screen.findByTestId('sanctuary-guide');
    expect(g.textContent).toMatch(/not a medical device/i);
    expect(g.textContent).toMatch(/headphones/i);
  });

  it('saves, renames, favorites, plays and deletes a mix', async () => {
    const { store, onLoadMix } = setup('mixes');
    fireEvent.change(await screen.findByTestId('sanctuary-mix-name'), { target: { value: 'Evening' } });
    fireEvent.click(screen.getByTestId('sanctuary-mix-save'));
    await screen.findByTestId('sanctuary-mixes-list');
    expect((await store.listMixes())[0]?.name).toBe('Evening');
    fireEvent.click(screen.getByTestId('sanctuary-mix-play'));
    expect(onLoadMix).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByTestId('sanctuary-mix-fav'));
    await waitFor(() => expect(screen.getByTestId('sanctuary-mix-fav').getAttribute('aria-pressed')).toBe('true'));
    fireEvent.click(screen.getByTestId('sanctuary-mix-rename'));
    fireEvent.change(screen.getByTestId('sanctuary-rename-input'), { target: { value: 'Night' } });
    fireEvent.click(screen.getByTestId('sanctuary-rename-ok'));
    await waitFor(() => expect(screen.getByText('Night')).toBeTruthy());
    fireEvent.click(screen.getByTestId('sanctuary-mix-delete'));
    fireEvent.click(screen.getByTestId('sanctuary-mix-delete-yes'));
    await screen.findByTestId('sanctuary-mixes-empty');
    expect(await store.listMixes()).toEqual([]);
    expect(await store.getRecord('favorites')).toMatchObject({ items: [] });
  });

  it('disables saving when nothing is playing', async () => {
    setup('mixes', undefined, { currentMix: () => null });
    const btn = await screen.findByTestId('sanctuary-mix-save');
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('rejects a hostile import file with a clear message and changes nothing', async () => {
    const { store } = setup('data');
    const input = await screen.findByTestId('sanctuary-import');
    const bad = new File([JSON.stringify({ app: 'zonked', kind: 'sanctuary', v: 2, mixes: [] })], 'x.json', { type: 'application/json' });
    await act(async () => {
      fireEvent.change(input, { target: { files: [bad] } });
    });
    await waitFor(() => expect(screen.getByTestId('sanctuary-data-message').textContent).toMatch(/version/));
    expect(await store.listMixes()).toEqual([]);
    const big = new File(['x'.repeat(300_000)], 'big.json');
    await act(async () => {
      fireEvent.change(input, { target: { files: [big] } });
    });
    await waitFor(() => expect(screen.getByTestId('sanctuary-data-message').textContent).toMatch(/too big/));
  });

  it('imports a good file and clamps unsafe values', async () => {
    const { store } = setup('data');
    const m = makeMix(draft, 'Imported', NOW);
    const evil = { ...m, voice: { ...m.voice, gain: 9 } };
    const text = exportBackup([evil], NO_FAVORITES, NEW_STATE, NOW);
    const input = await screen.findByTestId('sanctuary-import');
    await act(async () => {
      fireEvent.change(input, { target: { files: [new File([text], 'ok.json')] } });
    });
    await waitFor(async () => expect((await store.listMixes())[0]?.voice.gain).toBe(0.85));
  });

  it('shows the first-session milestone after a real log and can hide and reset', async () => {
    const store = createStore(new IDBFactory());
    await store.addLog({ startedAt: NOW - 600_000, endedAt: NOW - 60_000, peakScore: 0, presetId: 'p' });
    setup('milestones', store);
    const row = await screen.findByTestId('sanctuary-ms-first-session');
    await waitFor(() => expect(row.getAttribute('data-earned')).toBe('true'));
    expect(screen.getByTestId('sanctuary-ms-how').textContent).toMatch(/Nothing is sent/);
    fireEvent.click(screen.getByTestId('sanctuary-ms-hide'));
    await screen.findByTestId('sanctuary-ms-hidden');
    // Regression: show then reset in the same tick. Reset once used a stale copy and hid the panel again.
    fireEvent.click(screen.getByTestId('sanctuary-ms-hide'));
    fireEvent.click(screen.getByTestId('sanctuary-ms-reset'));
    fireEvent.click(screen.getByTestId('sanctuary-ms-reset-yes'));
    await waitFor(() => expect(screen.getByTestId('sanctuary-ms-first-session').getAttribute('data-earned')).toBe('false'));
  });

  it('shows the daily reminder once and then deletes everything on request', async () => {
    const store = createStore(new IDBFactory());
    await store.setRecord('milestones', { v: 1, hidden: false, earned: {}, reminder: { on: true, text: 'Breathe', shownDay: -1 } });
    setup('data', store);
    expect((await screen.findByTestId('sanctuary-reminder')).textContent).toBe('Breathe');
    cleanup();
    setup('data', store);
    await screen.findByTestId('sanctuary-data');
    expect(screen.queryByTestId('sanctuary-reminder')).toBeNull();
    await store.putMix(makeMix(draft, 'gone', NOW));
    fireEvent.click(screen.getByTestId('sanctuary-reset'));
    fireEvent.click(screen.getByTestId('sanctuary-reset-yes'));
    await waitFor(async () => expect(await store.listMixes()).toEqual([]));
  });

  it('favorites section lists a template once favorited', async () => {
    const { store } = setup('favorites');
    fireEvent.change(await screen.findByTestId('sanctuary-fav-search'), { target: { value: 'sleep' } });
    const toggle = await waitFor(() => {
      const b = document.querySelector<HTMLButtonElement>('[data-testid^="sanctuary-fav-toggle-"]');
      if (b === null) throw new Error('no hit yet');
      return b;
    });
    fireEvent.click(toggle);
    await waitFor(() => expect(screen.getByTestId('sanctuary-favorites-list')).toBeTruthy());
    expect(((await store.getRecord('favorites')) as { items: unknown[] }).items).toHaveLength(1);
  });
});
