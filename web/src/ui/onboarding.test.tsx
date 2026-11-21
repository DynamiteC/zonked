import { clickMore } from './moreTestUtil';
// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';
import type { AudioEngine, EngineStatus } from '../audio/types';
import { createStore } from '../storage/db';
import { SAFETY_KEY } from '../storage/prefs';
import { ADVANCED_KEY } from './Advanced';
import { COPY, allCopyStrings } from './copy';
import { QUICKSTART_KEY, quickStartInitiallyOpen } from './QuickStart';
import { MotionContext, Tip } from './Tip';

function engine(): AudioEngine & { start: ReturnType<typeof vi.fn> } {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  return {
    status,
    telemetry: { read: () => 0 },
    start: vi.fn(async () => void (status.state = 'running')),
    stop: vi.fn(async () => undefined),
    setVoice: vi.fn(),
    getStats: vi.fn(async () => ({ peak: 0, rms: 0, frames: 0, nonZero: 0 })),
    onStatus: () => () => undefined,
  } as unknown as AudioEngine & { start: ReturnType<typeof vi.fn> };
}

const app = (eng = engine()): React.JSX.Element => <App engine={eng} store={createStore(undefined)} bridgeCreate={() => null} />;

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(() => cleanup());

describe('Quick Start', () => {
  it('is a non-modal region on a first visit and never a dialog', () => {
    render(app());
    const qs = screen.getByTestId('quickstart');
    expect(qs.getAttribute('role')).toBe('region');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(document.body);
  });

  it('is hidden when the flag is set and under ?e2e=1', () => {
    expect(quickStartInitiallyOpen('')).toBe(true);
    expect(quickStartInitiallyOpen('?e2e=1')).toBe(false);
    localStorage.setItem(QUICKSTART_KEY, '1');
    expect(quickStartInitiallyOpen('')).toBe(false);
    render(app());
    expect(screen.queryByTestId('quickstart')).toBeNull();
  });

  it('walks choose, minutes, 5 results, and Play opens the safety gate without audio', async () => {
    const eng = engine();
    render(app(eng));
    expect(screen.getAllByRole('button').filter((b) => b.dataset.testid?.startsWith('qs-situation-'))).toHaveLength(8);
    fireEvent.click(screen.getByTestId('qs-situation-cant-sleep'));
    fireEvent.click(screen.getByTestId('qs-minutes-30'));
    await waitFor(() => expect(screen.getAllByTestId('qs-item')).toHaveLength(5));
    fireEvent.click(screen.getAllByTestId('qs-play')[0] as HTMLElement);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(eng.start).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByTestId('safety-accept')));
    expect(eng.start).toHaveBeenCalled();
    expect(screen.queryByTestId('quickstart')).toBeNull();
  });

  it('Skip closes without saving, Dont show again persists, toolbar reopens', () => {
    render(app());
    fireEvent.click(screen.getByTestId('qs-skip'));
    expect(screen.queryByTestId('quickstart')).toBeNull();
    expect(localStorage.getItem(QUICKSTART_KEY)).toBeNull();
    clickMore('qs-open');
    expect(screen.getByTestId('quickstart')).toBeTruthy();
    fireEvent.click(screen.getByTestId('qs-never'));
    expect(localStorage.getItem(QUICKSTART_KEY)).toBe('1');
    expect(screen.queryByTestId('quickstart')).toBeNull();
  });
});

describe('Advanced', () => {
  it('always renders readouts; closed is sr-only and inert, never display none', () => {
    localStorage.setItem(QUICKSTART_KEY, '1');
    render(app());
    const body = document.getElementById('adv-body') as HTMLElement;
    expect(screen.getByTestId('hz-left').textContent).toBe('180.00 Hz');
    expect(screen.getByTestId('engine-status').getAttribute('data-state')).toBe('idle');
    expect(body.className).toContain('sr-only');
    expect(body.hasAttribute('inert')).toBe(true);
    expect(body.style.display).not.toBe('none');
    expect(screen.getByTestId('status-plain').textContent).toBe('Stopped');
  });

  it('opens, persists, and shows the glossary', () => {
    localStorage.setItem(QUICKSTART_KEY, '1');
    render(app());
    fireEvent.click(screen.getByTestId('advanced-toggle'));
    expect(screen.getByTestId('advanced-toggle').getAttribute('aria-expanded')).toBe('true');
    expect(localStorage.getItem(ADVANCED_KEY)).toBe('1');
    expect((document.getElementById('adv-body') as HTMLElement).className).not.toContain('sr-only');
    fireEvent.click(screen.getByTestId('glossary-toggle'));
    expect(screen.getByTestId('glossary').textContent).toContain('Binaural');
  });

  it('shows Playing in plain words after play', async () => {
    localStorage.setItem(QUICKSTART_KEY, '1');
    localStorage.setItem(SAFETY_KEY, '1');
    render(app());
    await act(async () => fireEvent.click(screen.getByTestId('play-button')));
    expect(screen.getByTestId('status-plain').textContent).toBe('Playing');
  });
});

describe('Tip', () => {
  const ui = (reduced = false): React.JSX.Element => (
    <MotionContext.Provider value={reduced}>
      <div>
        <Tip label="thing" text="Explains the thing">
          <button type="button">Do it</button>
        </Tip>
        <button type="button">Elsewhere</button>
      </div>
    </MotionContext.Provider>
  );

  it('opens on hover, focus and tap, wiring aria-describedby', () => {
    render(ui());
    const btn = screen.getByRole('button', { name: 'Do it' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.mouseEnter(btn.parentElement as HTMLElement);
    const tip = screen.getByRole('tooltip');
    expect(btn.getAttribute('aria-describedby')).toBe(tip.id);
    fireEvent.mouseLeave(btn.parentElement as HTMLElement);
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.focus(btn);
    expect(screen.getByRole('tooltip')).toBeTruthy();
    fireEvent.blur(btn);
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'About thing' }));
    expect(screen.getByRole('tooltip').textContent).toBe('Explains the thing');
  });

  it('closes on Escape and on a tap elsewhere, and a second tap on ? closes it', () => {
    render(ui());
    const info = screen.getByRole('button', { name: 'About thing' });
    fireEvent.click(info);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.click(info);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.click(info);
    fireEvent.click(info);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('drops the animation class under reduced motion', () => {
    const { unmount } = render(ui(false));
    fireEvent.click(screen.getByRole('button', { name: 'About thing' }));
    expect(screen.getByRole('tooltip').className).toContain('tip-anim');
    unmount();
    render(ui(true));
    fireEvent.click(screen.getByRole('button', { name: 'About thing' }));
    expect(screen.getByRole('tooltip').className).not.toContain('tip-anim');
  });

  it('keeps tooltip inside a narrow viewport', () => {
    render(ui());
    fireEvent.click(screen.getByRole('button', { name: 'About thing' }));
    const left = parseInt((screen.getByRole('tooltip') as HTMLElement).style.left, 10);
    expect(left).toBeGreaterThanOrEqual(8);
  });
});

describe('copy', () => {
  it('has no empty strings and no banned characters', () => {
    const all = allCopyStrings();
    expect(all.length).toBeGreaterThan(80);
    const banned = /[\u2014\u00A7\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u;
    for (const s of all) {
      expect(s.trim().length).toBeGreaterThan(0);
      expect(banned.test(s)).toBe(false);
    }
    expect(COPY.situations).toHaveLength(8);
  });
});
