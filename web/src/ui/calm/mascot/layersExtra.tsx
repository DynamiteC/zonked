import type { JSX } from 'react';

const VB = '0 0 512 512';
const INK = '#2A2433';
const CLOTH = '#6E8C9A';

interface IdProps {
  readonly id: string;
}

/** Shoulders and chest. The group rises with --bp (breath, 0..1). Drawn behind the head. */
export function BodyLayer({ id }: IdProps): JSX.Element {
  return (
    <svg className="cm-layer cm-bodyl" viewBox={VB} aria-hidden="true" focusable="false">
      <g className="cm-chest" filter={`url(#${id}-paint)`}>
        <path d="M30 520Q36 410 140 392Q256 372 372 392Q476 410 482 520Z" fill={CLOTH} stroke="#3F5662" strokeWidth="5" strokeLinejoin="round" />
        <path d="M30 520Q36 440 96 410Q70 450 78 520Z" fill="#E7B36A" opacity="0.28" />
        <path d="M482 520Q476 430 410 402Q448 450 440 520Z" fill="#2A3F4B" opacity="0.3" />
        <path d="M206 384Q256 420 306 384" fill="none" stroke="#3F5662" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Headphone band over the top of the head, joined to both cups. Always on. */
export function BandLayer(): JSX.Element {
  return (
    <svg className="cm-layer cm-band" viewBox={VB} aria-hidden="true" focusable="false">
      <path d="M40 236C34 -96 478 -96 472 236" fill="none" stroke={INK} strokeWidth="24" strokeLinecap="round" />
      <path d="M62 190C80 20 432 20 450 190" fill="none" stroke="#FFF3D0" strokeOpacity="0.16" strokeWidth="5" strokeLinecap="round" />
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
