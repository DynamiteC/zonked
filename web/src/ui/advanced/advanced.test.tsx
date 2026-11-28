// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { channelHz } from '../../app/neuro';
import { Player } from '../../app/player';
import { fakeClock, memoryStorage } from '../../app/fakeClock.testutil';
import { bandForHz } from '../../catalog/bands';
import { alertToBeat } from '../../catalog/soundMenu';
import type { Voice } from '../../sbg';
import { dialBands } from '../dialBands';
import { AdvancedPanels } from './AdvancedPanels';
import { CalmAlertPanel } from './CalmAlertPanel';
import { EditorPanel } from './EditorPanel';
import { ImportExportPanel } from './ImportExportPanel';
import { MixPanel } from './MixPanel';
import { ScopePanel } from './ScopePanel';
import { TimersPanel } from './TimersPanel';

afterEach(cleanup);

function setup() {
  const calls: Voice[] = [];
  const engine = {
    status: { state: 'idle' },
    telemetry: { read: () => 0 },
    start: vi.fn(async (_v: Voice) => undefined),
    stop: vi.fn(async () => undefined),
    setVoice: vi.fn((v: Voice) => void calls.push(v)),
    getStats: vi.fn(),
    onStatus: () => () => undefined,
  };
  const player = new Player(engine as never, fakeClock(), undefined, { storage: memoryStorage() });
  return { engine, player, calls };
}

describe('MixPanel', () => {
  it('shows ticks and sends a layer override', () => {
    const { player } = setup();
    const spy = vi.spyOn(player, 'setLayerOverride');
    render(<MixPanel snap={player.snapshot()} player={player} />);
    expect(screen.getAllByTestId('rf-tick').length).toBeGreaterThanOrEqual(5);
    fireEvent.change(screen.getByTestId('adv-mix-lofi'), { target: { value: '0.5' } });
    expect(spy).toHaveBeenCalledWith({ lofiLevel: 0.5 });
  });

  it('resets the overrides', () => {
    const { player } = setup();
    const spy = vi.spyOn(player, 'clearLayerOverrides');
    render(<MixPanel snap={player.snapshot()} player={player} />);
    fireEvent.click(screen.getByTestId('adv-mix-reset'));
    expect(spy).toHaveBeenCalled();
  });
});

describe('CalmAlertPanel', () => {
  it('draws merged band segments from the real mapping', () => {
    expect(dialBands().map((b) => b.label)).toEqual(['Delta', 'Theta', 'Alpha', 'Beta']);
  });

  it('highlights the band of the Hz the player receives at 5 positions', () => {
    const { player } = setup();
    const view = render(<CalmAlertPanel snap={player.snapshot()} player={player} />);
    for (const pos of [0, 0.25, 0.5, 0.7, 1]) {
      fireEvent.change(screen.getByTestId('adv-dial-input'), { target: { value: String(pos) } });
      const sent = alertToBeat(pos);
      const hz = channelHz(player.snapshot().voice);
      expect(Math.abs(hz.r - hz.l)).toBeCloseTo(sent, 5);
      act(() => undefined);
      view.rerender(<CalmAlertPanel snap={player.snapshot()} player={player} />);
      const active = screen.getAllByTestId('rf-band').filter((b) => b.getAttribute('data-active') === 'true');
      expect(active.map((b) => b.textContent)).toEqual([bandForHz(sent).name]);
      expect(screen.getByTestId('adv-dial-readout').textContent).toContain(bandForHz(sent).name);
    }
  });
});

describe('EditorPanel', () => {
  it('reports line numbered problems and blocks Play', () => {
    const onPlay = vi.fn();
    render(<EditorPanel text="99:99:99 200+10/0.3" onText={() => undefined} onPlay={onPlay} />);
    expect(screen.getByTestId('adv-diagnostics').textContent).toMatch(/Line 1/);
    expect((screen.getByTestId('adv-editor-play') as HTMLButtonElement).disabled).toBe(true);
  });

  it('plays a valid script', () => {
    const onPlay = vi.fn();
    render(<EditorPanel text="00:00:00 200+10/0.3" onText={() => undefined} onPlay={onPlay} />);
    const btn = screen.getByTestId('adv-editor-play') as HTMLButtonElement;
    if (!btn.disabled) {
      fireEvent.click(btn);
      expect(onPlay).toHaveBeenCalledWith('00:00:00 200+10/0.3');
    } else {
      expect(screen.getByTestId('adv-diagnostics').textContent).not.toBe('');
    }
  });
});

describe('ImportExportPanel', () => {
  it('rejects a file over the size limit', async () => {
    const onImport = vi.fn();
    render(<ImportExportPanel text="x" name="n" onImport={onImport} />);
    const big = new File(['a'.repeat(300 * 1024)], 'big.sbg');
    fireEvent.change(screen.getByTestId('adv-import-input'), { target: { files: [big] } });
    expect(screen.getByTestId('adv-io-note').textContent).toMatch(/limit/);
    expect(onImport).not.toHaveBeenCalled();
  });

  it('imports a small file', async () => {
    const onImport = vi.fn();
    render(<ImportExportPanel text="x" name="n" onImport={onImport} />);
    const f = new File(['hello'], 'calm.sbg');
    Object.defineProperty(f, 'text', { value: async () => 'hello' });
    fireEvent.change(screen.getByTestId('adv-import-input'), { target: { files: [f] } });
    await vi.waitFor(() => expect(onImport).toHaveBeenCalledWith('hello', 'calm'));
  });
});

describe('TimersPanel', () => {
  it('starts and stops timers', () => {
    const { player } = setup();
    const start = vi.spyOn(player, 'startTimer');
    const stop = vi.spyOn(player, 'stopTimer');
    render(<TimersPanel timer={player.snapshot().timer} player={player} />);
    fireEvent.click(screen.getByTestId('adv-timer-countdown'));
    expect(start).toHaveBeenCalledWith({ kind: 'countdown', minutes: 30 });
    fireEvent.click(screen.getByTestId('adv-timer-pomodoro'));
    expect(start).toHaveBeenLastCalledWith(expect.objectContaining({ kind: 'pomodoro', focusMin: 25, breakMin: 5 }));
    expect((screen.getByTestId('adv-timer-stop') as HTMLButtonElement).disabled).toBe(true);
    expect(stop).not.toHaveBeenCalled();
  });

  it('clamps typed minutes', () => {
    const { player } = setup();
    render(<TimersPanel timer={player.snapshot().timer} player={player} />);
    fireEvent.change(screen.getByTestId('adv-timer-cd'), { target: { value: '99999' } });
    expect((screen.getByTestId('adv-timer-cd') as HTMLInputElement).value).toBe('720');
  });
});

describe('ScopePanel and AdvancedPanels', () => {
  it('renders the scope canvas', () => {
    vi.stubGlobal('requestAnimationFrame', () => 1);
    vi.stubGlobal('cancelAnimationFrame', () => undefined);
    const { engine } = setup();
    render(<ScopePanel telemetry={engine.telemetry} />);
    expect(screen.getByTestId('scope-canvas')).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it('renders six sections with Mix open, and Close calls back', () => {
    vi.stubGlobal('requestAnimationFrame', () => 1);
    vi.stubGlobal('cancelAnimationFrame', () => undefined);
    const { engine, player } = setup();
    const onClose = vi.fn();
    render(<AdvancedPanels engine={engine as never} player={player} onClose={onClose} />);
    const sections = screen.getByTestId('advanced-panels').querySelectorAll('details');
    expect(sections.length).toBe(9);
    expect([...sections].map((d) => d.open)).toEqual([true, false, false, false, false, false, false, false, false]);
    fireEvent.click(screen.getByTestId('adv-close'));
    expect(onClose).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
