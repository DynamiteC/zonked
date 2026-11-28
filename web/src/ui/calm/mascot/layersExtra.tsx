import type { JSX } from 'react';

const VB = '0 0 512 512';
const INK = '#3A2A2E';

interface IdProps {
  readonly id: string;
}

/** A small seated body: torso, two arms resting on knees and two feet. The torso rises with --bp (breath). */
export function BodyLayer({ id }: IdProps): JSX.Element {
  return (
    <svg className="cm-layer cm-bodyl" viewBox={VB} aria-hidden="true" focusable="false">
      <g filter={`url(#${id}-paint)`}>
        <ellipse cx="222" cy="462" rx="36" ry="15" fill="#6B4A3C" stroke={INK} strokeWidth="3.5" />
        <ellipse cx="290" cy="462" rx="36" ry="15" fill="#6B4A3C" stroke={INK} strokeWidth="3.5" />
        <g className="cm-chest">
          <path d="M178 456C168 400 190 342 256 338C322 342 344 400 334 456C300 468 212 468 178 456Z" fill="#7F9DAA" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M300 352C330 380 336 420 332 452C316 458 304 460 296 460C306 420 306 384 300 352Z" fill="#4F6D7B" opacity="0.4" />
          <path d="M196 360C186 392 186 424 192 452" fill="none" stroke="#FFD9A0" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="190" cy="432" rx="17" ry="30" fill="#7F9DAA" stroke={INK} strokeWidth="3.5" transform="rotate(8 190 432)" />
          <ellipse cx="322" cy="432" rx="17" ry="30" fill="#7F9DAA" stroke={INK} strokeWidth="3.5" transform="rotate(-8 322 432)" />
          <circle cx="196" cy="458" r="11" fill="#F7C95A" stroke={INK} strokeWidth="3" />
          <circle cx="316" cy="458" r="11" fill="#F7C95A" stroke={INK} strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}

/** Headphones drawn as part of the character: an ink band over the head and a cup on each side. Cups glow with --lv. */
export function BandLayer(): JSX.Element {
  return (
    <svg className="cm-layer cm-band" viewBox={VB} aria-hidden="true" focusable="false">
      <path d="M104 205C100 -10 412 -10 408 205" fill="none" stroke={INK} strokeWidth="15" strokeLinecap="round" />
      <path d="M118 190C120 20 392 20 394 190" fill="none" stroke="#FFF3D0" strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" />
      <g className="cm-ear-glow">
        <rect x="80" y="168" width="52" height="96" rx="24" fill="#5C4650" stroke={INK} strokeWidth="4" />
        <rect x="380" y="168" width="52" height="96" rx="24" fill="#5C4650" stroke={INK} strokeWidth="4" />
        <rect x="92" y="192" width="10" height="48" rx="5" fill="#8FE3D0" opacity="0.7" />
        <rect x="410" y="192" width="10" height="48" rx="5" fill="#8FE3D0" opacity="0.7" />
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
      d={`M${cx + dir * 14} 176Q${cx + dir * 50} 216 ${cx + dir * 14} 256`}
      fill="none"
      stroke="#8FE3D0"
      strokeWidth="5"
      strokeLinecap="round"
    />
  );
  return (
    <svg className="cm-layer cm-ripples" viewBox={VB} aria-hidden="true" focusable="false">
      {[0, 1, 2].map((k) => ring(78, -1, k))}
      {[0, 1, 2].map((k) => ring(434, 1, k))}
    </svg>
  );
}
