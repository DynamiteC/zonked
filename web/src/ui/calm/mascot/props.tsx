import type { JSX } from 'react';
import type { MascotMood } from './types';

const VB = '0 0 512 512';
const INK = '#3A2A2E';

/** Tiny props, one per mood, drawn in the corners and around the head so they survive the 72 px crop. */
const PROPS: Partial<Record<MascotMood, () => JSX.Element>> = {
  sleepy: () => (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" className="cm-pk">
      <path className="cm-zl cm-z1" d="M348 112h26l-26 26h26" strokeWidth="7" />
      <path className="cm-zl cm-z2" d="M382 72h19l-19 19h19" strokeWidth="6" />
      <path className="cm-zl cm-z3" d="M408 40h13l-13 13h13" strokeWidth="5" />
    </g>
  ),
  breathing: () => (
    <path className="cm-wisp" d="M326 396q12-10 24 0t24 0t24 0" fill="none" stroke="#BFE9E3" strokeWidth="5" strokeLinecap="round" />
  ),
  focus: () => <path className="cm-glow" d="M241 252h30" fill="none" stroke="#9CFFE3" strokeWidth="4" strokeLinecap="round" />,
  steering: () => (
    <path className="cm-spark" d="M404 160l5 13l13 5l-13 5l-5 13l-5-13l-13-5l13-5z" fill="#00E5A8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
  ),
  tired: () => (
    <path className="cm-sweat" d="M372 118C362 134 358 144 366 152C374 158 386 152 384 142C382 134 376 128 372 118Z" fill="#8FD3F0" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
  ),
  done: () => (
    <g className="cm-fall">
      <path d="M390 56c12-9 26-3 24 11c-12 6-24 0-24-11z" fill="#8DBE6B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M392 62q10-2 18-3" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path className="cm-spark" d="M356 70l4 10l10 4l-10 4l-4 10l-4-10l-10-4l10-4z" fill="#FFF3B0" stroke="#C9772A" strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  ),
  offline: () => (
    <path className="cm-cloud" d="M316 82a22 22 0 0 1 8-34a30 30 0 0 1 56-2a22 22 0 0 1 22 36z" fill="#C9CFD9" stroke="#6B7280" strokeWidth="4" strokeLinejoin="round" />
  ),
  error: () => (
    <g className="cm-q" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M378 76c0-16 28-16 28 0c0 12-14 12-14 26M392 116v2" stroke={INK} strokeWidth="11" />
      <path d="M378 76c0-16 28-16 28 0c0 12-14 12-14 26M392 116v2" stroke="#FFD23A" strokeWidth="6" />
    </g>
  ),
};

export const PROP_NAME: Partial<Record<MascotMood, string>> = {
  sleepy: 'zzz', breathing: 'wisp', focus: 'glow', steering: 'spark', tired: 'sweat', done: 'leaf', offline: 'cloud', error: 'question',
};

/** Renders the mood prop, or nothing. Moods without a prop cost no markup. */
export function PropLayer({ mood }: { readonly mood: MascotMood }): JSX.Element | null {
  const draw = PROPS[mood];
  if (!draw) return null;
  return (
    <svg className="cm-layer cm-props" viewBox={VB} aria-hidden="true" focusable="false">
      <g className="cm-prop" data-prop={PROP_NAME[mood]}>
        {draw()}
      </g>
    </svg>
  );
}
