import type { JSX } from 'react';

const VB = '0 0 512 512';
const INK = '#2A2433';
const CLOTH = '#6E8C9A';

interface IdProps {
  readonly id: string;
}

/** Shoulders, chest and collar. The group rises with --bp (breath, 0..1). Drawn behind the head. */
export function BodyLayer({ id }: IdProps): JSX.Element {
  return (
    <svg className="cm-layer cm-bodyl" viewBox={VB} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86A5B3" />
          <stop offset="1" stopColor="#5A7886" />
        </linearGradient>
      </defs>
      <g className="cm-chest" filter={`url(#${id}-paint)`}>
        <path d="M-14 540C-14 440 34 388 128 366C186 352 220 374 256 374C292 374 326 352 384 366C478 388 526 440 526 540Z" fill={`url(#${id}-cloth)`} stroke="#3F5662" strokeWidth="5" strokeLinejoin="round" />
        <path d="M-14 540C-14 460 28 410 92 384C70 440 74 490 82 540Z" fill="#E7B36A" opacity="0.22" />
        <path d="M526 540C526 450 484 404 420 380C444 440 440 490 432 540Z" fill="#2A3F4B" opacity="0.32" />
        <path d="M188 372Q256 450 324 372" fill="#4A6573" stroke="#3F5662" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M132 470Q150 500 146 540M380 470Q362 500 366 540" fill="none" stroke="#3F5662" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      </g>
      <ellipse cx="256" cy="452" rx="176" ry="30" fill="#1F2F38" opacity="0.38" filter={`url(#${id}-paint)`} />
    </svg>
  );
}

/** Headphone band over the head, joined to a cup on each side. The cups glow with --lv (audio level). */
export function BandLayer(): JSX.Element {
  return (
    <svg className="cm-layer cm-band" viewBox={VB} aria-hidden="true" focusable="false">
      <path d="M44 236C38 -96 474 -96 468 236" fill="none" stroke={INK} strokeWidth="24" strokeLinecap="round" />
      <path d="M66 190C84 20 428 20 446 190" fill="none" stroke="#FFF3D0" strokeOpacity="0.16" strokeWidth="5" strokeLinecap="round" />
      <g className="cm-ear-glow">
        <rect x="14" y="196" width="60" height="116" rx="28" fill={INK} stroke="#8A4A12" strokeWidth="4" />
        <rect x="438" y="196" width="60" height="116" rx="28" fill={INK} stroke="#8A4A12" strokeWidth="4" />
        <rect x="26" y="222" width="12" height="64" rx="6" fill="#8FE3D0" opacity="0.55" />
        <rect x="474" y="222" width="12" height="64" rx="6" fill="#8FE3D0" opacity="0.55" />
      </g>
    </svg>
  );
}

/** Soft sound ripples off both cups. Opacity follows --lv (audio level, 0..1). */
export function RippleLayer(): JSX.Element {
  const ring = (cx: number, dir: 1 | -1, k: number): JSX.Element => (
    <path
      key={`${cx}-${k}`}
      className="cm-ripple"
      style={{ animationDelay: `${k * -1.6}s` }}
      d={`M${cx + dir * 14} 206Q${cx + dir * 54} 256 ${cx + dir * 14} 306`}
      fill="none"
      stroke="#8FE3D0"
      strokeWidth="6"
      strokeLinecap="round"
    />
  );
  return (
    <svg className="cm-layer cm-ripples" viewBox={VB} aria-hidden="true" focusable="false">
      {[0, 1, 2].map((k) => ring(14, -1, k))}
      {[0, 1, 2].map((k) => ring(498, 1, k))}
    </svg>
  );
}
