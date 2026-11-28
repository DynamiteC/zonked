import type { JSX } from 'react';
import { Eye, EYES } from './eyes';
import type { MascotMood } from './types';

/** Canvas of the whole drawing. The head uses the 2018 logo coordinates (circle r200 at 256,256) under HEAD_T, which fills the box. */
export const VB_FULL = '0 0 512 512';
export const HEAD_T = 'translate(46.1 56.1) scale(.82)';

interface IdProps {
  readonly id: string;
}

type Row = readonly [number, number, number, number];
interface MouthShape { readonly dy: Row; readonly len: number; readonly rot?: Row }

const MOUTH_X: Row = [190, 226, 286, 322];
/** Four vertical slits, as in the original. Mood bends the row like a smile or a frown. */
const MOUTH: Readonly<Record<MascotMood, MouthShape>> = {
  idle: { dy: [-14, 4, 4, -14], len: 0.3 },
  listening: { dy: [-14, 4, 4, -14], len: 0.3 },
  happy: { dy: [-18, 6, 6, -18], len: 0.4 },
  sleepy: { dy: [0, 0, 0, 0], len: 0.45 },
  breathing: { dy: [-14, 4, 4, -14], len: 0.3 },
  focus: { dy: [0, 0, 0, 0], len: 0.7 },
  steering: { dy: [0, 0, 0, 0], len: 1 },
  tired: { dy: [7, -2, -2, 7], len: 0.7, rot: [10, 3, -3, -10] },
  done: { dy: [-5, 2, 2, -5], len: 0.85 },
  offline: { dy: [4, -2, 3, -3], len: 0.8 },
  error: { dy: [4, -2, 3, -3], len: 0.8 },
  loading: { dy: [0, 0, 0, 0], len: 0.6 },
};

/** A soft round shadow under the head. It shrinks a little when the head lifts on inhale. */
export function ShadowLayer(): JSX.Element {
  return (
    <svg className="cm-layer cm-shadow" viewBox={VB_FULL} aria-hidden="true" focusable="false">
      <ellipse className="cm-gshadow" cx="256" cy="452" rx="112" ry="13" fill="#4A3A40" opacity="0.2" />
    </svg>
  );
}

/** The gold head: hand-drawn ink outline, watercolor shade, rim light, ring eyes, soft rounded mask and slit mouth. */
export function HeadLayer({ id, mood, plain }: IdProps & { readonly mood: MascotMood; readonly plain: boolean }): JSX.Element {
  const m = MOUTH[mood];
  const [eyeL, eyeR] = EYES[mood];
  return (
    <svg className="cm-layer cm-face" viewBox={VB_FULL} aria-hidden="true" focusable="false">
      <g transform={HEAD_T}>
        <g className="cm-pod cm-podl">
          <rect className="cm-f-cup cm-s-ink" x="8" y="196" width="68" height="120" rx="30" fill={`url(#${id}-cup)`} strokeWidth="6" />
          <rect className="cm-f-mask cm-s-ink" x="22" y="212" width="40" height="88" rx="16" fill="#2E2433" strokeWidth="4" />
          <rect className="cm-slit" x="35" y="234" width="14" height="10" rx="3" />
          <rect className="cm-slit" x="35" y="268" width="14" height="10" rx="3" />
          <path className="cm-bevel" d="M20 232V226Q20 212 34 207" />
        </g>
        <g className="cm-pod cm-podr">
          <rect className="cm-f-cup cm-s-ink" x="436" y="196" width="68" height="120" rx="30" fill={`url(#${id}-cup)`} strokeWidth="6" />
          <rect className="cm-f-mask cm-s-ink" x="450" y="212" width="40" height="88" rx="16" fill="#2E2433" strokeWidth="4" />
          <rect className="cm-slit" x="463" y="234" width="14" height="10" rx="3" />
          <rect className="cm-slit" x="463" y="268" width="14" height="10" rx="3" />
          <path className="cm-bevel" d="M440 232V226Q440 212 454 207" />
        </g>
        <circle className="cm-f-gold" cx="256" cy="256" r="200" fill={`url(#${id}-gold)`} />
        {!plain && <circle className="cm-grain" cx="256" cy="256" r="200" fill="#FBD84A" filter={`url(#${id}-grain)`} />}
        {!plain && <circle className="cm-key" cx="256" cy="256" r="200" fill={`url(#${id}-key)`} />}
        {!plain && <circle className="cm-cel" cx="256" cy="256" r="170" fill="none" stroke="#B8741C" strokeOpacity="0.26" strokeWidth="60" strokeDasharray="330 1100" transform="rotate(5 256 256)" />}
        {!plain && <circle className="cm-cool" cx="256" cy="256" r="191" fill="none" stroke="#CFE8F4" strokeOpacity="0.28" strokeWidth="4" strokeDasharray="200 1200" strokeLinecap="round" transform="rotate(30 256 256)" />}
        {!plain && <circle className="cm-rim" cx="256" cy="256" r="186" fill="none" stroke="#FFF3B0" strokeOpacity="0.7" strokeWidth="12" strokeDasharray="330 1500" strokeLinecap="round" transform="rotate(200 256 256)" />}
        <circle className="cm-s-ink" cx="256" cy="256" r="200" fill="none" stroke="#3A2A2E" strokeWidth="8" />
        <circle className="cm-s-ink" cx="256" cy="256" r="200" fill="none" stroke="#3A2A2E" strokeWidth="6" strokeDasharray="420 1500" strokeLinecap="round" transform="rotate(100 256 256)" />
        <rect className="cm-f-mask" x="218" y="146" width="76" height="8" rx="4" fill="#241F2B" />
        <path className="cm-f-mask cm-s-ink" d="M104 250Q98 238 112 242L230 272Q241 275 241 288V338Q241 349 231 352L178 368Q166 371 158 363L128 330Q110 312 106 288Q102 268 104 250Z" fill={`url(#${id}-mask)`} strokeWidth="11" strokeLinejoin="round" />
        <path className="cm-f-mask cm-s-ink" d="M408 250Q414 238 400 242L282 272Q271 275 271 288V338Q271 349 281 352L334 368Q346 371 354 363L384 330Q402 312 406 288Q410 268 408 250Z" fill={`url(#${id}-mask)`} strokeWidth="11" strokeLinejoin="round" />
        <path className="cm-bevel cm-bevel-m" d="M112 252L232 282M400 252L280 282" />
        <ellipse className="cm-gem" cx="256" cy="316" rx="13" ry="16" fill="#00E5A8" fillOpacity="0.35" stroke="#00E5A8" strokeWidth="5" />
        <Eye cx={178} kind={eyeL} side={-1} />
        <Eye cx={334} kind={eyeR} side={1} />
        <g className="cm-mouth" style={{ ['--ml' as string]: m.len }}>
          {MOUTH_X.map((x, i) => {
            const dy = m.dy[i] ?? 0;
            const rot = m.rot?.[i] ?? 0;
            const y = 409 + dy;
            return (
              <g key={x} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
                <path className="cm-bar cm-s-ink" d={`M${x} ${y - 17 * m.len}V${y + 17 * m.len}`} stroke="#3A2A2E" strokeWidth="9" strokeLinecap="round" fill="none" />
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}

/** Floating dust motes, drawn above everything. */
export function MotesLayer(): JSX.Element {
  const motes: ReadonlyArray<readonly [number, number, number]> = [
    [70, 110, 4], [440, 90, 3], [400, 430, 4], [90, 410, 3], [256, 30, 3], [470, 300, 2],
  ];
  return (
    <svg className="cm-layer cm-motes" viewBox={VB_FULL} aria-hidden="true" focusable="false">
      {motes.map(([x, y, r], i) => (
        <circle key={`${x}-${y}`} className="cm-mote" style={{ animationDelay: `${i * -1.3}s` }} cx={x} cy={y} r={r} fill="#FFF3C9" />
      ))}
    </svg>
  );
}

/** Shared paint: warm matte gradients, a key light, and one grain filter (only when `lite` is false). Ids are per instance. */
export function Defs({ id, lite }: IdProps & { readonly lite: boolean }): JSX.Element {
  return (
    <svg className="cm-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-gold`} x1="0.2" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#FBD84A" />
          <stop offset="1" stopColor="#E8A128" />
        </linearGradient>
        <linearGradient id={`${id}-mask`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7A5878" />
          <stop offset="1" stopColor="#4B3652" />
        </linearGradient>
        <linearGradient id={`${id}-cup`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CC7F5E" />
          <stop offset="1" stopColor="#9C4F3A" />
        </linearGradient>
        <radialGradient id={`${id}-key`} cx="0.3" cy="0.25" r="0.7">
          <stop offset="0" stopColor="#FFF4B8" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFF4B8" stopOpacity="0" />
        </radialGradient>
        {!lite && (
          <filter id={`${id}-grain`} x="0" y="0" width="1" height="1">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.24" numOctaves="2" seed="4" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.24  0 0 0 0 0  0.6 0 0 0 -0.14" result="m" />
            <feComposite in="m" in2="SourceAlpha" operator="in" />
          </filter>
        )}
      </defs>
    </svg>
  );
}
