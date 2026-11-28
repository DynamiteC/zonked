import { afterEach, describe, expect, it, vi } from 'vitest';
import { CARD_SIZE, calmLine, cardText, drawCalmCard, makeCalmCard } from './calmCard';

function fakeCtx(): { ctx: CanvasRenderingContext2D; texts: string[]; calls: string[] } {
  const texts: string[] = [];
  const calls: string[] = [];
  const grad = { addColorStop: () => undefined };
  const ctx = new Proxy({} as Record<string, unknown>, {
    get: (t, k: string) => {
      if (k === 'measureText') return (s: string) => ({ width: s.length * 20 });
      if (k === 'createLinearGradient') return () => grad;
      if (k === 'fillText') return (s: string) => void texts.push(s);
      if (k in t) return t[k];
      return (...a: unknown[]) => void calls.push(`${k}:${a.length}`);
    },
    set: (t, k: string, v) => {
      t[k] = v;
      return true;
    },
  });
  return { ctx: ctx as unknown as CanvasRenderingContext2D, texts, calls };
}

afterEach(() => vi.restoreAllMocks());

describe('calm card', () => {
  it('text holds the sound, the minutes and a calm line, and nothing personal', () => {
    const t = cardText({ name: 'Rain\u0000 and thunder', minutes: 12.4 });
    expect(t).toMatchObject({ name: 'Rain  and thunder', time: '12 minutes' });
    expect(calmLine('Rain')).toBe(calmLine('Rain'));
    expect(cardText({ name: '', minutes: 0.2 })).toMatchObject({ name: 'Zonked', time: 'under a minute' });
    expect(cardText({ name: 'x', minutes: 1 }).time).toBe('1 minute');
    expect(cardText({ name: 'x'.repeat(200), minutes: Number.NaN }).name).toHaveLength(40);
  });

  it('draws the mascot and the three text lines without any network call', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const open = vi.fn();
    vi.stubGlobal('XMLHttpRequest', open);
    const { ctx, texts, calls } = fakeCtx();
    drawCalmCard(ctx, { name: 'Rain', minutes: 5 });
    expect(texts).toEqual(expect.arrayContaining(['Rain', '5 minutes', 'Zonked']));
    expect(texts).toHaveLength(4);
    expect(calls.some((c) => c.startsWith('arc'))).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('makes a PNG blob through toBlob and rejects when the browser cannot', async () => {
    const { ctx } = fakeCtx();
    const png = new Blob(['x'], { type: 'image/png' });
    const canvas = { width: 0, height: 0, getContext: () => ctx, toBlob: (cb: (b: Blob | null) => void, type: string) => cb(type === 'image/png' ? png : null) };
    const doc = { createElement: () => canvas } as unknown as Document;
    await expect(makeCalmCard({ name: 'Rain', minutes: 3 }, doc)).resolves.toBe(png);
    expect(canvas.width).toBe(CARD_SIZE);
    const noCtx = { createElement: () => ({ getContext: () => null }) } as unknown as Document;
    await expect(makeCalmCard({ name: 'Rain', minutes: 3 }, noCtx)).rejects.toThrow();
    const noPng = { createElement: () => ({ ...canvas, toBlob: (cb: (b: Blob | null) => void) => cb(null) }) } as unknown as Document;
    await expect(makeCalmCard({ name: 'Rain', minutes: 3 }, noPng)).rejects.toThrow();
  });
});
