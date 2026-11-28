import type { JSX } from 'react';
import type { MascotMood } from './types';

/** Canvas of the whole drawing. The head uses the 2018 logo coordinates (circle r200 at 256,256) under HEAD_T. */
export const VB_FULL = '0 0 512 512';
export const HEAD_T = 'translate(97.3 56.3) scale(.62)';

interface IdProps {
  readonly id: string;
}

type Row = readonly [number, number, number, number];
interface MouthShape { readonly dy: Row; readonly len: number }

const MOUTH_X: Row = [190, 226, 286, 322];
/** Four vertical slits, as in the original. Mood bends the row like a smile or a frown. */
const MOUTH: Readonly<Record<MascotMood, MouthShape>> = {
  idle: { dy: [0, 0, 0, 0], len: 1 },
  listening: { dy: [0, 0, 0, 0], len: 1 },
  happy: { dy: [-9, 4, 4, -9], len: 1 },
  sleepy: { dy: [0, 0, 0, 0], len: 0.45 },
  breathing: { dy: [0, 0, 0, 0], len: 0.8 },
  focus: { dy: [0, 0, 0, 0], len: 0.7 },
  steering: { dy: [0, 0, 0, 0], len: 1 },
  tired: { dy: [7, -2, -2, 7], len: 0.7 },
  done: { dy: [-5, 2, 2, -5], len: 0.85 },
  offline: { dy: [4, -2, 3, -3], len: 0.8 },
  error: { dy: [4, -2, 3, -3], len: 0.8 },
  loading: { dy: [0, 0, 0, 0], len: 0.6 },
};

const SMILE_EYES: ReadonlySet<MascotMood> = new Set<MascotMood>(['happy', 'done']);

/** The hill the character sits on. Soft edge, no outline. */
export function ShadowLayer(): JSX.Element {
  return (
    <svg className="cm-layer cm-shadow" viewBox={VB_FULL} aria-hidden="true" focusable="false">
      <path className="cm-hill-a" d="M-20 512C20 462 120 440 256 440C392 440 492 462 532 512Z" fill="#9DB07E" />
      <path className="cm-hill-b" d="M40 512C90 474 170 458 256 458C342 458 422 474 472 512Z" fill="#B3C28F" opacity="0.7" />
      <ellipse cx="256" cy="470" rx="120" ry="12" fill="#4F5F3C" opacity="0.28" />
    </svg>
  );
}

function Eye({ cx, smile }: { readonly cx: number; readonly smile: boolean }): JSX.Element {
  return (
    <g className="cm-eye">
      <circle className="cm-f-mask cm-s-ink" cx={cx} cy="150" r="40" fill="#241F2B" strokeWidth="5" />
      {smile ? (
        <path className="cm-s-gold" d={`M${cx - 20} 160A20 20 0 0 1 ${cx + 20} 160`} fill="none" stroke="#FFD23A" strokeWidth="8" strokeLinecap="round" />
      ) : (
        <>
          <circle className="cm-ring cm-s-gold" cx={cx} cy="150" r="24" fill="none" stroke="#FFD23A" strokeWidth="4" strokeOpacity="0.85" />
          <circle className="cm-pupil cm-f-gold" cx={cx} cy="150" r="8" fill="#FFD23A" />
          <circle cx={cx - 9} cy="140" r="4" fill="#FFF6DC" opacity="0.8" />
        </>
      )}
    </g>
  );
}

/** The gold head: hand-drawn ink outline, watercolor shade, rim light, ring eyes, angular mask and slit mouth. */
export function HeadLayer({ id, mood, plain }: IdProps & { readonly mood: MascotMood; readonly plain: boolean }): JSX.Element {
  const m = MOUTH[mood];
  const smile = SMILE_EYES.has(mood);
  return (
    <svg className="cm-layer cm-face" viewBox={VB_FULL} aria-hidden="true" focusable="false">
      <g transform={HEAD_T} filter={plain ? undefined : `url(#${id}-paint)`}>
        <g className="cm-pod cm-podl">
          <rect className="cm-f-cup cm-s-ink" x="8" y="196" width="68" height="120" rx="30" fill="#6B4A3C" strokeWidth="6" />
          <rect className="cm-f-mask cm-s-ink" x="22" y="212" width="40" height="88" rx="16" fill="#241F2B" strokeWidth="4" />
          <rect className="cm-slit" x="35" y="234" width="14" height="10" rx="3" />
          <rect className="cm-slit" x="35" y="268" width="14" height="10" rx="3" />
        </g>
        <g className="cm-pod cm-podr">
          <rect className="cm-f-cup cm-s-ink" x="436" y="196" width="68" height="120" rx="30" fill="#6B4A3C" strokeWidth="6" />
          <rect className="cm-f-mask cm-s-ink" x="450" y="212" width="40" height="88" rx="16" fill="#241F2B" strokeWidth="4" />
          <rect className="cm-slit" x="463" y="234" width="14" height="10" rx="3" />
          <rect className="cm-slit" x="463" y="268" width="14" height="10" rx="3" />
        </g>
        <circle className="cm-f-gold" cx="256" cy="256" r="200" fill={`url(#${id}-gold)`} />
        <circle className="cm-shade" cx="256" cy="256" r="200" fill={`url(#${id}-shade)`} />
        <circle className="cm-rim" cx="256" cy="256" r="186" fill="none" stroke="#FFF3B0" strokeOpacity="0.7" strokeWidth="12" strokeDasharray="330 1500" strokeLinecap="round" transform="rotate(200 256 256)" />
        <circle className="cm-s-ink" cx="256" cy="256" r="200" fill="none" stroke="#3A2A2E" strokeWidth="8" />
        <circle className="cm-s-ink" cx="256" cy="256" r="200" fill="none" stroke="#3A2A2E" strokeWidth="6" strokeDasharray="420 1500" strokeLinecap="round" transform="rotate(100 256 256)" />
        <rect className="cm-f-mask" x="218" y="146" width="76" height="8" rx="4" fill="#241F2B" />
        <polygon className="cm-f-mask cm-s-ink" points="96,240 240,276 240,350 168,370 120,320" fill="#2F2430" strokeWidth="11" strokeLinejoin="round" />
        <polygon className="cm-f-mask cm-s-ink" points="416,240 272,276 272,350 344,370 392,320" fill="#2F2430" strokeWidth="11" strokeLinejoin="round" />
        <polygon className="cm-gem" points="256,300 270,316 256,332 242,316" fill="#00E5A8" fillOpacity="0.35" stroke="#00E5A8" strokeWidth="5" strokeLinejoin="round" />
        <Eye cx={178} smile={smile} />
        <Eye cx={334} smile={smile} />
        <g className="cm-mouth" style={{ ['--ml' as string]: m.len }}>
          {MOUTH_X.map((x, i) => {
            const dy = m.dy[i] ?? 0;
            return <path key={x} className="cm-bar cm-s-ink" d={`M${x} ${409 + dy - 17 * m.len}V${409 + dy + 17 * m.len}`} stroke="#3A2A2E" strokeWidth="9" strokeLinecap="round" fill="none" />;
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

/** Shared paint: gold gradient, shade and the displacement that gives lines a hand-drawn wobble. Ids are per instance. */
export function Defs({ id }: IdProps): JSX.Element {
  return (
    <svg className="cm-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE600" />
          <stop offset="1" stopColor="#FFB800" />
        </linearGradient>
        <radialGradient id={`${id}-shade`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0.5" stopColor="#C9772A" stopOpacity="0" />
          <stop offset="1" stopColor="#C9772A" stopOpacity="0.35" />
        </radialGradient>
        <filter id={`${id}-paint`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
