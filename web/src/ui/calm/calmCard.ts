// The optional calm card: one PNG drawn on this device with canvas. No network, no personal data.
// It holds the mascot, the sound name, the minutes and one calm line. Nothing is stored or sent.
import { CALM } from './copy';

export const CARD_SIZE = 1080;
const NAME_MAX = 40;

const LINES: readonly string[] = [
  'A quiet moment, all yours.',
  'Soft sound, made on this device.',
  'Easy does it.',
  'Slow and gentle is fine.',
];

export interface CardInfo {
  readonly name: string;
  readonly minutes: number;
}

/** One calm line, picked from the sound name so the same session always gets the same words. */
export function calmLine(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return LINES[h % LINES.length] ?? LINES[0] ?? '';
}

/** The text on the card. Name is trimmed and capped, minutes are whole and non-negative. */
export function cardText(info: CardInfo): { readonly name: string; readonly time: string; readonly line: string } {
  const name = info.name.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, NAME_MAX) || CALM.brand;
  const min = Number.isFinite(info.minutes) ? Math.max(0, Math.round(info.minutes)) : 0;
  const time = min < 1 ? 'under a minute' : min === 1 ? '1 minute' : `${min} minutes`;
  return { name, time, line: calmLine(name) };
}

type Ctx = CanvasRenderingContext2D;

function fit(ctx: Ctx, text: string, px: number, weight: string, maxW: number): void {
  let size = px;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  while (size > 24 && ctx.measureText(text).width > maxW) {
    size -= 4;
    ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  }
}

function drawMascot(ctx: Ctx, cx: number, cy: number, r: number): void {
  const k = r / 200;
  const cup = (x: number): void => {
    ctx.fillStyle = '#B8624A';
    ctx.beginPath();
    ctx.ellipse(cx + x * k, cy, 34 * k, 60 * k, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  cup(-196);
  cup(196);
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r * 0.6, cy + r);
  g.addColorStop(0, '#FBD84A');
  g.addColorStop(1, '#E8A128');
  ctx.fillStyle = g;
  ctx.strokeStyle = '#3A2A2E';
  ctx.lineWidth = 8 * k;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#3F3247';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + s * 78 * k, cy + 56 * k, 70 * k, 52 * k, s * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#00E5A8';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 60 * k, 13 * k, 16 * k, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFE9A8';
  ctx.lineWidth = 9 * k;
  ctx.lineCap = 'round';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(cx + s * 78 * k, cy + 52 * k, 26 * k, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  ctx.strokeStyle = '#3A2A2E';
  ctx.lineWidth = 11 * k;
  ctx.beginPath();
  ctx.arc(cx, cy + 108 * k, 52 * k, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
}

/** Draws the card on a canvas context. Pure drawing: it reads nothing and calls nothing outside the context. */
export function drawCalmCard(ctx: Ctx, info: CardInfo, size: number = CARD_SIZE): void {
  const t = cardText(info);
  const bg = ctx.createLinearGradient(0, 0, 0, size);
  bg.addColorStop(0, '#FFF3D6');
  bg.addColorStop(1, '#F6D9E0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);
  drawMascot(ctx, size / 2, size * 0.35, size * 0.2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#2B2233';
  fit(ctx, t.name, 76, '700', size * 0.84);
  ctx.fillText(t.name, size / 2, size * 0.68);
  ctx.fillStyle = '#4C4256';
  fit(ctx, t.time, 52, '400', size * 0.84);
  ctx.fillText(t.time, size / 2, size * 0.76);
  fit(ctx, t.line, 46, '400', size * 0.84);
  ctx.fillText(t.line, size / 2, size * 0.84);
  ctx.fillStyle = '#6B6075';
  fit(ctx, CALM.brand, 40, '600', size * 0.5);
  ctx.fillText(CALM.brand, size / 2, size * 0.94);
}

/** Renders the card to a PNG blob on this device. Rejects when the browser cannot draw or encode. */
export function makeCalmCard(info: CardInfo, doc: Document = document): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = doc.createElement('canvas');
    canvas.width = CARD_SIZE;
    canvas.height = CARD_SIZE;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return reject(new Error('no canvas'));
    drawCalmCard(ctx, info);
    canvas.toBlob((b) => (b === null ? reject(new Error('no png')) : resolve(b)), 'image/png');
  });
}

export const CARD_FILE = 'zonked-calm-card.png';

/** Starts a download from an object URL, then frees it. */
export function downloadCard(blob: Blob, doc: Document = document): void {
  const url = URL.createObjectURL(blob);
  const a = doc.createElement('a');
  a.href = url;
  a.download = CARD_FILE;
  doc.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** True when this browser can share a PNG file. */
export function canShareCard(blob: Blob, nav: Navigator = navigator): boolean {
  if (typeof nav.canShare !== 'function' || typeof nav.share !== 'function') return false;
  return nav.canShare({ files: [new File([blob], CARD_FILE, { type: 'image/png' })] });
}

/** Opens the share sheet with the PNG. A person closing the sheet is not an error. */
export async function shareCard(blob: Blob, nav: Navigator = navigator): Promise<boolean> {
  try {
    await nav.share({ files: [new File([blob], CARD_FILE, { type: 'image/png' })] });
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return false;
    throw e;
  }
}
