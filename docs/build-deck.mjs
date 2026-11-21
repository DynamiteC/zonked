// Builds docs/Zonked-Kiroween-Deck.pptx and docs/deck.html from deck-content.mjs.
// Usage: npm --prefix docs install && npm --prefix docs run build:deck
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pptxgen from 'pptxgenjs';
import { COLORS as C, SLIDES } from './deck-content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const FONT = 'Arial';
const W = 13.333;
const H = 7.5;
const BODY_PT = 24;

function bulletRuns(items) {
  return items.map((t) => ({
    text: t,
    options: { bullet: { code: '25A0' }, color: C.text, fontSize: BODY_PT, fontFace: FONT, breakLine: true, paraSpaceAfter: 8 },
  }));
}

function title(slide, text) {
  slide.addText(text, { x: 0.6, y: 0.35, w: W - 1.2, h: 0.9, fontFace: FONT, fontSize: 40, bold: true, color: C.gold, margin: 0 });
  slide.addShape('rect', { x: 0.6, y: 1.25, w: 2.4, h: 0.06, fill: { color: C.amber }, line: { color: C.amber, width: 0 } });
}

function box(slide, x, y, w, h, label, opts = {}) {
  slide.addText(label, {
    shape: 'roundRect', rectRadius: 0.08, x, y, w, h, align: 'center', valign: 'middle', fontFace: FONT,
    fontSize: opts.size ?? BODY_PT, bold: opts.bold ?? true, color: opts.color ?? C.bg,
    fill: { color: opts.fill ?? C.gold }, line: { color: opts.line ?? opts.fill ?? C.gold, width: 1 }, margin: 4,
  });
}

function arrow(slide, x1, y1, x2, y2, color = C.mint) {
  slide.addShape('line', {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipV: y2 < y1, flipH: x2 < x1, line: { color, width: 3, endArrowType: 'triangle' },
  });
}

function slideTitle(pptx, s) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  slide.addText(s.title, { x: 0.8, y: 1.5, w: 7.4, h: 1.5, fontFace: FONT, fontSize: 80, bold: true, color: C.gold, margin: 0 });
  slide.addText(s.subtitle, { x: 0.8, y: 3.1, w: 7.4, h: 1.2, fontFace: FONT, fontSize: 32, color: C.text, margin: 0, valign: 'top' });
  slide.addText(
    s.lines.map((t) => ({ text: t, options: { breakLine: true, color: C.mint, fontSize: BODY_PT, fontFace: FONT, paraSpaceAfter: 6 } })),
    { x: 0.8, y: 4.7, w: 7.6, h: 1.6, margin: 0, valign: 'top' },
  );
  slide.addImage({ path: join(here, 'assets/pwa-512x512.png'), x: 8.7, y: 1.5, w: 4, h: 4, altText: 'Zonked mascot' });
  return slide;
}

function slideBullets(pptx, s) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  title(slide, s.title);
  slide.addText(bulletRuns(s.bullets), { x: 0.7, y: 1.7, w: W - 1.4, h: 5.2, margin: 0, valign: 'top' });
  return slide;
}

function slideImageBullets(pptx, s) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  title(slide, s.title);
  slide.addImage({ path: join(here, s.image), x: 0.7, y: 1.9, w: 4.2, h: 4.2, altText: s.imageAlt });
  slide.addText(bulletRuns(s.bullets), { x: 5.4, y: 1.7, w: 7.3, h: 5.2, margin: 0, valign: 'top' });
  return slide;
}

function slideDiagram(pptx, s) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  title(slide, s.title);
  const aw = 3.9;
  const gap = 0.3;
  const x0 = (W - (3 * aw + 2 * gap)) / 2;
  const colX = (i) => x0 + i * (aw + gap);
  const cx = (i) => colX(i) + aw / 2;
  const ay = 1.5;
  const ah = 1.15;
  const fy = 3.2;
  const fh = 0.7;
  s.agents.forEach((a, i) => {
    slide.addText(
      [
        { text: a.name, options: { bold: true, color: C.bg, fontSize: BODY_PT, fontFace: FONT, breakLine: true } },
        { text: a.sub, options: { color: '3A3300', fontSize: BODY_PT, fontFace: FONT } },
      ],
      { shape: 'roundRect', rectRadius: 0.08, x: colX(i), y: ay, w: aw, h: ah, align: 'center', valign: 'middle', fill: { color: C.gold }, line: { color: C.gold, width: 1 }, margin: 2 },
    );
    box(slide, colX(i), fy, aw, fh, s.files[i], { fill: C.panel, line: C.amber, color: C.amber, bold: false });
  });
  arrow(slide, cx(0) - 0.6, ay + ah, cx(0) - 0.6, fy);
  arrow(slide, colX(0) + aw - 0.5, fy, colX(1) + 0.5, ay + ah);
  arrow(slide, cx(1), ay + ah, cx(1), fy);
  arrow(slide, cx(2), ay + ah, cx(2), fy);
  const n = s.chain.length;
  const cw = 2.7;
  const cg = (W - 1.2 - n * cw) / (n - 1);
  const cy = 4.5;
  s.chain.forEach((label, i) => {
    const x = 0.6 + i * (cw + cg);
    box(slide, x, cy, cw, 0.8, label, { fill: C.panel, line: C.mint, color: C.mint });
    slide.addText(s.chainSub[i], { x, y: cy + 0.82, w: cw, h: 0.4, align: 'center', fontFace: FONT, fontSize: BODY_PT, color: C.text, margin: 0 });
    if (i < n - 1) arrow(slide, x + cw, cy + 0.4, x + cw + cg, cy + 0.4);
  });
  arrow(slide, cx(1), fy + fh, 0.6 + cw / 2, cy);
  slide.addText(bulletRuns(s.bullets), { x: 0.7, y: 6.15, w: W - 1.4, h: 1.2, margin: 0, valign: 'top' });
  return slide;
}

function slideBeats(pptx, s) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  title(slide, s.title);
  const cw = 5.95;
  const ch = 1.9;
  s.beats.forEach((b, i) => {
    const x = 0.6 + (i % 2) * (cw + 0.23);
    const y = 1.6 + Math.floor(i / 2) * (ch + 0.25);
    slide.addShape('roundRect', { x, y, w: cw, h: ch, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.mint, width: 2 } });
    slide.addText(
      [
        { text: b.label, options: { bold: true, color: C.gold, fontSize: BODY_PT, fontFace: FONT, breakLine: true, paraSpaceAfter: 8 } },
        { text: b.text, options: { color: C.text, fontSize: BODY_PT, fontFace: FONT } },
      ],
      { x: x + 0.25, y, w: cw - 0.5, h: ch, margin: 0, valign: 'middle' },
    );
  });
  slide.addText(s.footer, { x: 0.6, y: 6.55, w: W - 1.2, h: 0.5, fontFace: FONT, fontSize: BODY_PT, color: C.amber, margin: 0 });
  return slide;
}

const BUILDERS = { title: slideTitle, bullets: slideBullets, 'image-bullets': slideImageBullets, diagram: slideDiagram, beats: slideBeats };

async function buildPptx() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = 'Zonked: Kiroween 2026 pitch';
  pptx.author = 'Zonked';
  pptx.subject = 'Resurrection and Best Kiro Crew App';
  for (const s of SLIDES) {
    const build = BUILDERS[s.kind];
    if (!build) throw new Error(`unknown slide kind ${s.kind}`);
    build(pptx, s).addNotes(s.notes);
  }
  await pptx.writeFile({ fileName: join(here, 'Zonked-Kiroween-Deck.pptx') });
}

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const list = (items) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

function htmlBody(s) {
  switch (s.kind) {
    case 'title':
      return `<div class="title-wrap"><div><h1 class="big">${esc(s.title)}</h1><p class="sub">${esc(s.subtitle)}</p>${s.lines
        .map((l) => `<p class="mint">${esc(l)}</p>`)
        .join('')}</div><img src="assets/pwa-512x512.png" alt="Zonked mascot" width="400" height="400"></div>`;
    case 'bullets':
      return `<h2>${esc(s.title)}</h2>${list(s.bullets)}`;
    case 'image-bullets':
      return `<h2>${esc(s.title)}</h2><div class="split"><img src="${esc(s.image)}" alt="${esc(s.imageAlt)}" width="420" height="420">${list(s.bullets)}</div>`;
    case 'diagram':
      return `<h2>${esc(s.title)}</h2><div class="diagram"><div class="row agents">${s.agents
        .map((a) => `<div class="node gold"><b>${esc(a.name)}</b><span>${esc(a.sub)}</span></div>`)
        .join('')}</div><div class="row files">${s.files
        .map((f) => `<div class="node file">${esc(f)}</div>`)
        .join('')}</div><div class="row chain">${s.chain
        .map((c, i) => `<div class="node mint"><b>${esc(c)}</b><span>${esc(s.chainSub[i])}</span></div>`)
        .join('<span class="arrow">&rarr;</span>')}</div></div>${list(s.bullets)}`;
    case 'beats':
      return `<h2>${esc(s.title)}</h2><div class="beats">${s.beats
        .map((b) => `<div class="beat"><b>${esc(b.label)}</b><span>${esc(b.text)}</span></div>`)
        .join('')}</div><p class="amber">${esc(s.footer)}</p>`;
    default:
      throw new Error(`unknown slide kind ${s.kind}`);
  }
}

function buildHtml() {
  const sections = SLIDES.map(
    (s, i) =>
      `<section class="slide" id="s${i + 1}" data-index="${i + 1}" aria-label="Slide ${i + 1} of ${SLIDES.length}">${htmlBody(s)}<aside class="notes" hidden>${esc(
        s.notes,
      )}</aside></section>`,
  ).join('\n');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; style-src 'self'; script-src 'self'">
<title>Zonked: Kiroween 2026 deck</title>
<link rel="stylesheet" href="deck.css">
</head>
<body>
<main class="deck" id="deck">
${sections}
</main>
<div class="hud"><span id="counter">1 / ${SLIDES.length}</span><span class="hint">Arrow keys, Home, End. N toggles notes.</span></div>
<script src="deck.js"></script>
</body>
</html>
`;
  writeFileSync(join(here, 'deck.html'), html);
}

buildHtml();
await buildPptx();
console.log(`built ${SLIDES.length} slides`);
