import { cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

/** True when motion is reduced (OS setting or the checkbox). The tooltip then appears without a fade. */
export const MotionContext = createContext(false);

interface Props {
  /** Short name of the thing explained. Used for the accessible name of the info button. */
  label: string;
  text: string;
  /** Show the small "?" button (the way to open the tip by tap or click). Default true. */
  info?: boolean;
  /** Optional control to describe. It receives aria-describedby while the tip is open. */
  children?: React.ReactElement<{ 'aria-describedby'?: string }>;
}

const EDGE = 8;

/** Fixed placement keeps the bubble inside the viewport and out of overflow clipping. */
function place(anchor: HTMLElement, bubble: HTMLElement): void {
  const a = anchor.getBoundingClientRect();
  const w = bubble.offsetWidth;
  const h = bubble.offsetHeight;
  const vw = document.documentElement.clientWidth || window.innerWidth;
  const vh = window.innerHeight;
  const left = Math.min(Math.max(EDGE, a.left), Math.max(EDGE, vw - w - EDGE));
  let top = a.bottom + 6;
  if (top + h > vh - EDGE && a.top - h - 6 >= EDGE) top = a.top - h - 6;
  bubble.style.left = `${Math.round(left)}px`;
  bubble.style.top = `${Math.round(top)}px`;
}

export function Tip({ label, text, info = true, children }: Props): React.JSX.Element {
  const reduced = useContext(MotionContext);
  const id = useId();
  const [open, setOpen] = useState(false);
  const pinned = useRef(false);
  const byPointer = useRef(false);
  const root = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const close = useCallback(() => {
    pinned.current = false;
    setOpen(false);
  }, []);

  useLayoutEffect(() => {
    if (open && root.current !== null && bubble.current !== null) place(root.current, bubble.current);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      close();
    };
    const onDown = (e: Event): void => {
      if (!root.current?.contains(e.target as Node | null)) close();
    };
    const onMove = (): void => {
      if (root.current !== null && bubble.current !== null) place(root.current, bubble.current);
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [open, close]);

  const described = open ? id : undefined;
  const own = isValidElement(children) ? children.props['aria-describedby'] : undefined;
  const merged = [own, described].filter((x) => x !== undefined && x !== '').join(' ') || undefined;
  const control = isValidElement(children) ? cloneElement(children, { 'aria-describedby': merged }) : null;

  const onInfo = (): void => {
    if (open && pinned.current) {
      close();
    } else {
      pinned.current = true;
      setOpen(true);
    }
  };

  return (
    <span
      ref={root}
      className="tip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (!pinned.current) setOpen(false);
      }}
      onPointerDown={() => {
        byPointer.current = true;
      }}
      onKeyDown={() => {
        byPointer.current = false;
      }}
      onFocus={() => {
        // A click also focuses the control. Only keyboard focus opens the tip, or it stays open after a click.
        if (!byPointer.current) setOpen(true);
      }}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) close();
      }}
    >
      {control}
      {(info || control !== null) && (
        <button type="button" className={info ? 'tip-btn' : 'tip-btn tip-touch'} aria-label={`About ${label}`} aria-describedby={control === null ? described : undefined} onClick={onInfo}>
          ?
        </button>
      )}
      {open && (
        <span ref={bubble} id={id} role="tooltip" className={reduced ? 'tip-bubble' : 'tip-bubble tip-anim'}>
          {text}
        </span>
      )}
    </span>
  );
}
