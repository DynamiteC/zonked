import { clickMore } from './moreTestUtil';
// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';
import { Player } from '../app/player';
import type { PlayerSnapshot } from '../app/player';
import { SHORTCUTS, shortcutHelpRows } from '../app/shortcuts';
import type { AudioEngine, EngineStatus } from '../audio/types';
import type { RecContext } from '../catalog/types';
import { createStore } from '../storage/db';
import { MOTION_KEY, SAFETY_KEY } from '../storage/prefs';
import { QUICKSTART_KEY } from './QuickStart';
import { Catalog } from './Catalog';
import { Mascot } from './Mascot';
import { Mixer } from './Mixer';
import { Recommender } from './Recommender';
import { TimerPanel } from './TimerPanel';
import { classifyDevices } from './device';
import { PAGE_SIZE } from './Catalog';
import { announceBucketSec, announceText, defaultRecContext, formatClock } from './recContext';
import { dragToSpin, initialPose, stepPose, AUDIO_DEPTH_CAP, MAX_TILT_DEG } from './mascotMotion';
import { fakeClock } from '../app/fakeClock.testutil';

function engine(): AudioEngine & { start: ReturnType<typeof vi.fn> } {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  return {
    status,
    telemetry: { read: () => 0 },
    start: vi.fn(async () => undefined),
    stop: vi.fn(async () => undefined),
    setVoice: vi.fn(),
    getStats: vi.fn(async () => ({ peak: 0, rms: 0, frames: 0, nonZero: 0 })),
    onStatus: () => () => undefined,
  } as unknown as AudioEngine & { start: ReturnType<typeof vi.fn> };
}

const ctx: RecContext = { ...defaultRecContext(new Date(2026, 0, 1, 9)), situation: 'adhd-focus' };

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(QUICKSTART_KEY, '1');
  localStorage.setItem(SAFETY_KEY, '1');
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(() => cleanup());

describe('Recommender', () => {
  it('shows at least 5 results with score, reasons and play, and plays with queue', () => {
    const onPlay = vi.fn();
    render(<Recommender ctx={ctx} onCtx={() => undefined} onPlay={onPlay} onClose={() => undefined} />);
    const items = screen.getAllByTestId('rec-item');
    expect(items.length).toBeGreaterThanOrEqual(5);
    expect(within(items[0] as HTMLElement).getByTestId('rec-score')).toBeTruthy();
    expect(within(items[0] as HTMLElement).getAllByRole('listitem').length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByTestId('rec-play')[1] as HTMLElement);
    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay.mock.calls[0]?.[0].length).toBe(items.length);
    expect(onPlay.mock.calls[0]?.[1]).toBe(1);
  });

  it('emits context changes for situation, vibe and device', () => {
    const onCtx = vi.fn();
    render(<Recommender ctx={ctx} onCtx={onCtx} onPlay={() => undefined} onClose={() => undefined} />);
    fireEvent.change(screen.getByTestId('rec-situation'), { target: { value: 'cant-sleep' } });
    expect(onCtx).toHaveBeenLastCalledWith({ ...ctx, situation: 'cant-sleep' });
    fireEvent.click(screen.getByTestId('rec-vibe-calm'));
    expect(onCtx).toHaveBeenLastCalledWith({ ...ctx, vibe: 'calm' });
  });
});

describe('Catalog', () => {
  it('pages, searches and filters, and plays with the filtered queue', () => {
    const onPlay = vi.fn();
    render(<Catalog currentId={null} onPlay={onPlay} onClose={() => undefined} />);
    expect(screen.getAllByTestId('catalog-item').length).toBe(PAGE_SIZE);
    const total = Number(/^(\d+) templates/.exec(screen.getByTestId('catalog-count').textContent ?? '')?.[1]);
    expect(total).toBeGreaterThanOrEqual(210);
    fireEvent.change(screen.getByTestId('catalog-search'), { target: { value: 'sleep' } });
    const filtered = Number(/^(\d+) templates/.exec(screen.getByTestId('catalog-count').textContent ?? '')?.[1]);
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(total);
    fireEvent.click(screen.getByTestId('catalog-adhd'));
    fireEvent.click(screen.getByTestId('catalog-tag-binaural'));
    const both = Number(/^(\d+) templates/.exec(screen.getByTestId('catalog-count').textContent ?? '')?.[1]);
    expect(both).toBeLessThanOrEqual(filtered);
    fireEvent.change(screen.getByTestId('catalog-search'), { target: { value: '' } });
    fireEvent.click(screen.getAllByTestId('catalog-item')[0] as HTMLElement);
    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay.mock.calls[0]?.[0].length).toBeGreaterThan(0);
  });
});

describe('Mixer', () => {
  function mkPlayer() {
    const eng = { start: vi.fn(async () => undefined), stop: vi.fn(async () => undefined), setVoice: vi.fn() };
    const player = new Player(eng, fakeClock(), undefined, { storage: null });
    return { player, eng };
  }
  it('drives setLayerOverride with clamped values and shows the capped master gain', () => {
    const { player } = mkPlayer();
    let snap: PlayerSnapshot = player.snapshot();
    const view = render(<Mixer snap={snap} player={player} onClose={() => undefined} />);
    fireEvent.change(screen.getByTestId('layer-lofi'), { target: { value: '3' } });
    snap = player.snapshot();
    expect(snap.voice.layers?.lofiLevel).toBe(1);
    fireEvent.change(screen.getByTestId('layer-perc'), { target: { value: '0.4' } });
    expect(player.snapshot().voice.layers?.percLevel).toBe(0.4);
    view.rerender(<Mixer snap={player.snapshot()} player={player} onClose={() => undefined} />);
    expect(screen.getByTestId('master-gain').textContent).toMatch(/maximum 0\.85/);
    for (const id of ['layer-instrument', 'layer-pad', 'layer-chimes', 'layer-crackle']) expect(screen.getByTestId(id)).toBeTruthy();
    fireEvent.click(screen.getByTestId('mixer-reset'));
    expect(player.snapshot().layerOverrides).toEqual({});
    fireEvent.click(screen.getByTestId('mixer-mute'));
    expect(player.snapshot().muted).toBe(true);
  });
});

describe('TimerPanel', () => {
  it('starts countdown, sleep and pomodoro specs and stops', () => {
    const port = { startTimer: vi.fn(), stopTimer: vi.fn(), cycleTimer: vi.fn() };
    const none = { kind: 'none', running: false, remainingSec: 0, totalSec: 0 } as const;
    render(<TimerPanel timer={none} player={port} onClose={() => undefined} />);
    fireEvent.click(screen.getByTestId('timer-cd-15'));
    fireEvent.click(screen.getByTestId('timer-countdown'));
    expect(port.startTimer).toHaveBeenLastCalledWith({ kind: 'countdown', minutes: 15 });
    fireEvent.change(screen.getByTestId('timer-cd-custom'), { target: { value: '99999' } });
    fireEvent.click(screen.getByTestId('timer-countdown'));
    expect(port.startTimer).toHaveBeenLastCalledWith({ kind: 'countdown', minutes: 720 });
    fireEvent.click(screen.getByTestId('timer-sl-90'));
    fireEvent.click(screen.getByTestId('timer-sleep'));
    expect(port.startTimer).toHaveBeenLastCalledWith({ kind: 'sleep-fade', minutes: 90 });
    fireEvent.click(screen.getByTestId('timer-pomodoro'));
    expect(port.startTimer.mock.calls.at(-1)?.[0]).toMatchObject({ kind: 'pomodoro', focusMin: 25, breakMin: 5 });
    expect((screen.getByTestId('timer-stop') as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('timer announcements', () => {
  it('buckets coarsely and formats', () => {
    expect(announceBucketSec(1790)).toBe(1800);
    expect(announceBucketSec(1750)).toBe(1800);
    expect(announceBucketSec(125)).toBe(180);
    expect(announceBucketSec(45)).toBe(60);
    expect(announceBucketSec(5)).toBe(10);
    expect(announceText('none', 0)).toBe('');
    expect(announceText('pomodoro', 300, 'break')).toMatch(/^Break/);
    expect(formatClock(3725)).toBe('1:02:05');
  });
});

describe('device detection', () => {
  it('classifies labels and never guesses without labels', () => {
    expect(classifyDevices([{ kind: 'audiooutput', label: '' }])).toBe('unknown');
    expect(classifyDevices([{ kind: 'audiooutput', label: 'Default - AirPods Pro' }])).toBe('bluetooth');
    expect(classifyDevices([{ kind: 'audiooutput', label: 'External Headphones' }])).toBe('headphones');
    expect(classifyDevices([{ kind: 'audiooutput', label: 'MacBook Pro Speakers' }])).toBe('speaker');
  });
});

describe('App wiring', () => {
  it('opens each drawer lazily and keeps one open at a time', async () => {
    render(<App engine={engine()} store={createStore(undefined)} bridgeCreate={() => null} />);
    fireEvent.click(screen.getByTestId('recommender-toggle'));
    expect(await screen.findByTestId('recommender-panel')).toBeTruthy();
    expect(screen.getAllByTestId('rec-item').length).toBeGreaterThanOrEqual(5);
    clickMore('catalog-toggle');
    expect(await screen.findByTestId('catalog-search')).toBeTruthy();
    expect(screen.queryByTestId('recommender-panel')).toBeNull();
    clickMore('mixer-toggle');
    expect(await screen.findByTestId('layer-lofi')).toBeTruthy();
    fireEvent.click(screen.getByTestId('timer-toggle'));
    expect(await screen.findByTestId('timer-countdown')).toBeTruthy();
  });

  it('plays a recommendation, updates now-playing and steps with next/prev', async () => {
    const eng = engine();
    render(<App engine={eng} store={createStore(undefined)} bridgeCreate={() => null} />);
    fireEvent.click(screen.getByTestId('recommender-toggle'));
    await screen.findByTestId('recommender-panel');
    await act(async () => void fireEvent.click(screen.getAllByTestId('rec-play')[0] as HTMLElement));
    const first = screen.getByTestId('now-playing').textContent;
    expect(eng.start).toHaveBeenCalledTimes(1);
    await act(async () => void fireEvent.click(screen.getByTestId('next-button')));
    expect(screen.getByTestId('now-playing').textContent).not.toBe(first);
    await act(async () => void fireEvent.click(screen.getByTestId('prev-button')));
    expect(screen.getByTestId('now-playing').textContent).toBe(first);
  });

  it('wires keyboard actions through the shortcut table', async () => {
    const eng = engine();
    render(<App engine={eng} store={createStore(undefined)} bridgeCreate={() => null} />);
    await act(async () => void fireEvent.keyDown(window, { key: '1' }));
    await vi.waitFor(() => expect(screen.getByTestId('now-playing').textContent).not.toMatch(/Deep Focus/i));
    expect(eng.start).toHaveBeenCalledTimes(1);
    await act(async () => void fireEvent.keyDown(window, { key: 'm' }));
    expect(screen.getByTestId('mute-button').getAttribute('aria-pressed')).toBe('true');
    await act(async () => void fireEvent.keyDown(window, { key: 't' }));
    expect(screen.getByTestId('timer-remaining').getAttribute('data-kind')).toBe('countdown');
    await act(async () => void fireEvent.keyDown(window, { key: 'r' }));
    expect(await screen.findByTestId('recommender-panel')).toBeTruthy();
    await act(async () => void fireEvent.keyDown(window, { key: 'Escape' }));
    expect(screen.queryByTestId('recommender-panel')).toBeNull();
    await act(async () => void fireEvent.keyDown(window, { key: '?' }));
    const rows = shortcutHelpRows();
    expect(screen.getAllByText(rows[0]?.label ?? '').length).toBe(1);
    expect(rows.length).toBeLessThan(SHORTCUTS.length);
  });

  it('ignores shortcuts while typing in a field', async () => {
    const eng = engine();
    render(<App engine={eng} store={createStore(undefined)} bridgeCreate={() => null} />);
    clickMore('catalog-toggle');
    const input = await screen.findByTestId('catalog-search');
    await act(async () => void fireEvent.keyDown(input, { key: ' ' }));
    expect(eng.start).not.toHaveBeenCalled();
  });
});

describe('Mascot motion', () => {
  const voice = { carrierHz: 200, beatHz: 10, noise: 'off', noiseLevel: 0, mode: 'binaural', gain: 0.3 } as const;
  it('freezes tilt and parallax under reduced motion', () => {
    render(<Mascot playing synced={false} reduced getVoice={() => voice} onToggle={() => undefined} />);
    const m = screen.getByTestId('mascot');
    fireEvent.pointerEnter(m, { clientX: 500, clientY: 500 });
    fireEvent.pointerMove(m, { clientX: 900, clientY: 900 });
    expect(m.getAttribute('data-motion')).toBe('frozen');
    expect(m.style.getPropertyValue('--rx')).toBe('0');
    expect(m.style.getPropertyValue('--ry')).toBe('0');
    expect(m.style.getPropertyValue('--px')).toBe('0');
  });

  it('is live when motion is allowed and click toggles', () => {
    const onToggle = vi.fn();
    render(<Mascot playing={false} synced={false} reduced={false} getVoice={() => voice} onToggle={onToggle} />);
    const m = screen.getByTestId('mascot');
    expect(m.getAttribute('data-motion')).toBe('live');
    fireEvent.click(m);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('App Reduce motion checkbox freezes the mascot', () => {
    localStorage.setItem(MOTION_KEY, '1');
    render(<App engine={engine()} store={createStore(undefined)} bridgeCreate={() => null} />);
    expect(screen.getByTestId('mascot').getAttribute('data-motion')).toBe('frozen');
  });

  it('pure math: tilt capped near 12 degrees, spin springs back, audio depth capped', () => {
    const p = initialPose();
    const t = { nx: 1, ny: -1, hover: true, dragging: false, dragSpin: 0, level: 5 };
    for (let i = 0; i < 200; i++) stepPose(p, t, 1 / 60);
    expect(p.ry).toBeLessThanOrEqual(MAX_TILT_DEG + 0.01);
    expect(p.ry).toBeGreaterThan(MAX_TILT_DEG - 0.5);
    expect(p.audio).toBeLessThanOrEqual(AUDIO_DEPTH_CAP + 1e-6);
    expect(dragToSpin(10000)).toBe(180);
    const d = { ...t, nx: 0, ny: 0, dragging: true, dragSpin: 120 };
    for (let i = 0; i < 60; i++) stepPose(p, d, 1 / 60);
    expect(p.spin).toBeGreaterThan(90);
    const rel = { ...d, dragging: false, dragSpin: 0 };
    for (let i = 0; i < 300; i++) stepPose(p, rel, 1 / 60);
    expect(Math.abs(p.spin)).toBeLessThan(0.5);
  });
});
