// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Nature } from './nature/useNature';
import { OptionsNature } from './OptionsNature';
import { CalmCardAction } from './CalmCardAction';
import { UX } from './copy-ux';

vi.mock('../../audio/samples', () => ({
  listSamples: () => [
    { id: 'rain', label: 'Rain' },
    { id: 'stream', label: 'Stream' },
    { id: 'fire', label: 'Fire' },
  ],
}));

const nature = (over: Partial<Nature> = {}): Nature => ({
  prefs: { id: null, blend: 0.6, level: 0.3 },
  on: null,
  message: '',
  start: vi.fn(),
  stop: vi.fn(),
  setBlend: vi.fn(),
  setLevel: vi.fn(),
  ...over,
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Options nature groups and mix code', () => {
  it('groups the sounds under plain headings', () => {
    render(<OptionsNature nature={nature()} device="wired" />);
    expect(screen.getByTestId('sheet-group-Rain')).toBeTruthy();
    expect(screen.getByTestId('sheet-group-Water')).toBeTruthy();
    expect(screen.getByTestId('sheet-group-Fire-and-bells')).toBeTruthy();
  });

  it('copies a code for the sound that is on', async () => {
    const writeText = vi.fn(async () => undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    render(<OptionsNature nature={nature({ on: 'rain' })} device="wired" />);
    fireEvent.click(screen.getByTestId('mix-copy'));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('ZK1-rain-60-30'));
    expect(screen.getByTestId('mix-note').textContent).toBe(UX.mix.copied);
  });

  it('asks for a sound first when none is on', () => {
    render(<OptionsNature nature={nature()} device="wired" />);
    fireEvent.click(screen.getByTestId('mix-copy'));
    expect(screen.getByTestId('mix-note').textContent).toBe(UX.mix.none);
  });

  it('applies a valid code and rejects a bad one without changing anything', () => {
    const n = nature();
    render(<OptionsNature nature={n} device="wired" />);
    const input = screen.getByTestId('mix-input');
    fireEvent.change(input, { target: { value: 'ZK2-rain-60-30' } });
    fireEvent.click(screen.getByTestId('mix-apply'));
    expect(n.start).not.toHaveBeenCalled();
    expect(screen.getByTestId('mix-note').textContent).toMatch(/newer Zonked/);
    fireEvent.change(input, { target: { value: 'ZK1-fire-40-20' } });
    fireEvent.click(screen.getByTestId('mix-apply'));
    expect(n.setBlend).toHaveBeenCalledWith(0.4);
    expect(n.setLevel).toHaveBeenCalledWith(0.2);
    expect(n.start).toHaveBeenCalledWith('fire');
  });
});

describe('Calm card action', () => {
  it('makes the card after a tap, offers download, and offers share only when the browser can', async () => {
    const png = new Blob(['x'], { type: 'image/png' });
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    HTMLCanvasElement.prototype.getContext = (() => new Proxy({}, { get: (_t, k) => (k === 'measureText' ? () => ({ width: 10 }) : k === 'createLinearGradient' ? () => ({ addColorStop: () => undefined }) : () => undefined), set: () => true })) as never;
    HTMLCanvasElement.prototype.toBlob = ((cb: (b: Blob) => void) => cb(png)) as never;
    render(<CalmCardAction info={{ name: 'Rain', minutes: 5 }} />);
    fireEvent.click(screen.getByTestId('calm-card-make'));
    await waitFor(() => expect(screen.getByTestId('calm-card-download')).toBeTruthy());
    expect(screen.queryByTestId('calm-card-share')).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
