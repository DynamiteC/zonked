import type { JSX } from 'react';
import { HEAD_T } from './layers';

const VB = '0 0 512 512';
const INK = '#3A2A2E';

/** Headband over the head. It ends in the cups drawn around the ear pods, so the pods are not repeated. */
export function BandLayer(): JSX.Element {
  return (
    <svg className="cm-layer cm-band" viewBox={VB} aria-hidden="true" focusable="false">
      <g transform={HEAD_T}>
        <path className="cm-s-ink cm-bandink" d="M42 204C20 -34 492 -34 470 204" fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" />
        <path d="M60 190C50 10 462 10 452 190" fill="none" stroke="#FFF3D0" strokeOpacity="0.22" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Soft sound ripples off both cups. Opacity follows --lv (audio level, 0..1). */
export function RippleLayer({ marked = false }: { readonly marked?: boolean }): JSX.Element {
  const ring = (cx: number, dir: 1 | -1, k: number): JSX.Element => (
    <path
      key={`${cx}-${k}`}
      className="cm-ripple"
      style={{ animationDelay: `${k * -1.6}s` }}
      d={`M${cx + dir * 12} 222Q${cx + dir * 44} 266 ${cx + dir * 12} 310`}
      fill="none"
      stroke="#8FE3D0"
      strokeWidth="5"
      strokeLinecap="round"
    />
  );
  return (
    <svg className="cm-layer cm-ripples" data-prop={marked ? 'ripples' : undefined} viewBox={VB} aria-hidden="true" focusable="false">
      {[0, 1, 2].map((k) => ring(56, -1, k))}
      {[0, 1, 2].map((k) => ring(456, 1, k))}
    </svg>
  );
}
