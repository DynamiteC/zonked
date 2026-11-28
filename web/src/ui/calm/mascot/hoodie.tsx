import type { JSX } from 'react';

const VB = '0 0 512 512';
const INK = '#3A2A2E';
const TEAL = '#4E8A8C';
const TEAL_DARK = '#356A6E';
const GOLD = '#F2C14E';

interface IdProps {
  readonly id: string;
}

/** A seated figure in a soft deep-teal hoodie: hood resting behind the head, gold trim, two drawstrings, a chest pocket. The chest rises with --bp. */
export function BodyLayer({ id }: IdProps): JSX.Element {
  return (
    <svg className="cm-layer cm-bodyl" viewBox={VB} aria-hidden="true" focusable="false">
      <g filter={`url(#${id}-paint)`}>
        <ellipse cx="222" cy="462" rx="36" ry="15" fill="#6B4A3C" stroke={INK} strokeWidth="3.5" />
        <ellipse cx="290" cy="462" rx="36" ry="15" fill="#6B4A3C" stroke={INK} strokeWidth="3.5" />
        <g className="cm-chest">
          <path className="cm-hood" d="M166 358C146 306 178 262 256 258C334 262 366 306 346 358Z" fill={TEAL_DARK} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M178 456C168 400 190 342 256 338C322 342 344 400 334 456C300 468 212 468 178 456Z" fill={TEAL} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M300 352C330 380 336 420 332 452C316 458 304 460 296 460C306 420 306 384 300 352Z" fill={TEAL_DARK} opacity="0.4" />
          <path d="M196 360C186 392 186 424 192 452" fill="none" stroke="#FFE9C0" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
          <path className="cm-trim" d="M180 350C206 378 306 378 332 350" fill="none" stroke={GOLD} strokeWidth="9" strokeLinecap="round" />
          <path d="M180 350C206 378 306 378 332 350" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.6" transform="translate(0 5)" />
          <path className="cm-cord" d="M238 372C236 390 234 400 232 412M274 372C276 390 278 400 280 414" fill="none" stroke="#F4E9D2" strokeWidth="4" strokeLinecap="round" />
          <circle cx="232" cy="416" r="4.5" fill={GOLD} stroke={INK} strokeWidth="2.5" />
          <circle cx="280" cy="418" r="4.5" fill={GOLD} stroke={INK} strokeWidth="2.5" />
          <path className="cm-pocket" d="M220 428Q256 420 292 428L298 452Q256 462 214 452Z" fill={TEAL_DARK} fillOpacity="0.55" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="190" cy="432" rx="17" ry="30" fill={TEAL} stroke={INK} strokeWidth="3.5" transform="rotate(8 190 432)" />
          <ellipse cx="322" cy="432" rx="17" ry="30" fill={TEAL} stroke={INK} strokeWidth="3.5" transform="rotate(-8 322 432)" />
          <path d="M174 440Q192 450 209 442M303 442Q320 450 338 440" fill="none" stroke={GOLD} strokeWidth="7" strokeLinecap="round" />
          <circle cx="196" cy="460" r="10" fill="#F7C95A" stroke={INK} strokeWidth="3" />
          <circle cx="316" cy="460" r="10" fill="#F7C95A" stroke={INK} strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}
