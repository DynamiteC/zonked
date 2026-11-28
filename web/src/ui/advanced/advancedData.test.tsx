// @vitest-environment jsdom
// MOCKED: the audio engine is a stub in this file. Real output is read by verify:e2e (web/scripts/e2e-core-checks.mjs).
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fakeClock, memoryStorage } from '../../app/fakeClock.testutil';
import { Player } from '../../app/player';
import { createStore } from '../../storage/db';
import { SAFETY_KEY } from '../../storage/prefs';
import type { Voice } from '../../sbg';
import { AdvancedPanels } from './AdvancedPanels';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function setup() {
  const engine = {
    status: { state: 'idle' },
    telemetry: { read: () => 0 },
    start: vi.fn(async (_v: Voice) => undefined),
    stop: vi.fn(async () => undefined),
    setVoice: vi.fn(),
    getStats: vi.fn(),
    onStatus: () => () => undefined,
  };
  const player = new Player(engine as never, fakeClock(), undefined, { storage: memoryStorage() });
  return { engine, player };
}

describe('Advanced: saved mixes and your data', () => {
  it('saves a mix, lists it, and refuses to play it before the safety notice is accepted', async () => {
    const { engine, player } = setup();
    const store = createStore(undefined);
    render(<AdvancedPanels engine={engine as never} player={player} store={store} />);
    const name = await screen.findByTestId('sanctuary-mix-name');
    fireEvent.change(name, { target: { value: 'Evening' } });
    fireEvent.click(screen.getByTestId('sanctuary-mix-save'));
    await waitFor(async () => expect((await store.listMixes()).map((m) => m.name)).toEqual(['Evening']));
    const play = await screen.findByTestId('sanctuary-mix-play');
    fireEvent.click(play);
    expect(engine.start).not.toHaveBeenCalled();
    localStorage.setItem(SAFETY_KEY, '1');
    fireEvent.click(play);
    expect(engine.start).toHaveBeenCalled();
  });

  it('refuses a hostile backup file and keeps the data', async () => {
    const { engine, player } = setup();
    const store = createStore(undefined);
    await store.setRecord('favorites', { v: 1, items: [] });
    render(<AdvancedPanels engine={engine as never} player={player} store={store} />);
    const input = await screen.findByTestId('sanctuary-import');
    const bad = new File(['{"app":"nope","version":999,"mixes":"x"}'], 'bad.json', { type: 'application/json' });
    fireEvent.change(input, { target: { files: [bad] } });
    const msg = await screen.findByTestId('sanctuary-data-message');
    await waitFor(() => expect((msg.textContent ?? '').length).toBeGreaterThan(0));
    expect(await store.listMixes()).toEqual([]);
  });
});
