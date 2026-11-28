import { cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

/** True when motion is reduced (OS setting or the checkbox). The tooltip then appears without a fade. */
export const MotionContext = createContext(false);

/** Hover waits this long before the tip shows. */
export const HOVER_MS = 300;
/** A touch must be held this long to show the tip. */
export const LONG_PRESS_MS = 500;
/** A finger that moves farther than this is a scroll, not a press. */
const MOVE_PX = 10;
/** A tip opened by touch closes by itself after this long. */
const TOUCH_SHOW_MS = 4000;
const EDGE = 8;
const INTERACTIVE = new Set(['button', 'select', 'input', 'textarea', 'a']);

interface Props {
  /** The explanation. Plain text only. */
  text: string;
  /** The label or control that triggers the tip. It gets aria-describedby. */
  children: React.ReactNode;
  /** Id of a form control that this label describes. Focusing that control shows the tip too. */
  controlId?: string;
}

/** Fixed placement keeps the bubble inside the viewport (360 px phones too) and out of overflow clipping. */
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

type Timer = ReturnType<typeof setTimeout> | null;

/**
 * The label or control is the trigger. Hover shows the tip after 300 ms, a 500 ms touch hold shows it
 * without firing the tap, keyboard focus shows it at once, and Escape closes it.
 * Text children get a light dotted underline so people can tell a tip is there.
 */
export function Tip({ text, children, controlId }: Props): React.JSX.Element {
  const reduced = useContext(MotionContext);
  const id = useId();
  const descId = `${id}-d`;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const hover = useRef<Timer>(null);
  const press = useRef<Timer>(null);
  const hide = useRef<Timer>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  /** Set when a long press fired, so the click that follows the release is swallowed once. */
  const swallow = useRef(false);
  const byPointer = useRef(false);

  const clear = (t: { current: Timer }): void => {
    if (t.current !== null) clearTimeout(t.current);
    t.current = null;
  };
  const close = useCallback(() => {
    clear(hover);
    clear(press);
    clear(hide);
    setOpen(false);
  }, []);
  useEffect(() => () => { clear(hover); clear(press); clear(hide); }, []);

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

  // A separate control (a select next to its label) shows this tip on keyboard focus.
  useEffect(() => {
    if (controlId === undefined) return undefined;
    const el = document.getElementById(controlId);
    if (el === null) return undefined;
    const prev = el.getAttribute('aria-describedby');
    el.setAttribute('aria-describedby', [prev, descId].filter((x) => x !== null && x !== '').join(' '));
    const onIn = (): void => { if (!byPointer.current) setOpen(true); };
    const onKey = (): void => { byPointer.current = false; };
    const onPtr = (): void => { byPointer.current = true; };
    el.addEventListener('focus', onIn);
    el.addEventListener('keydown', onKey);
    el.addEventListener('pointerdown', onPtr);
    el.addEventListener('blur', close);
    return () => {
      if (prev === null) el.removeAttribute('aria-describedby');
      else el.setAttribute('aria-describedby', prev);
      el.removeEventListener('focus', onIn);
      el.removeEventListener('keydown', onKey);
      el.removeEventListener('pointerdown', onPtr);
      el.removeEventListener('blur', close);
    };
  }, [controlId, descId, close]);

  const only = isValidElement(children) ? (children as React.ReactElement<{ 'aria-describedby'?: string }>) : null;
  const ownsControl = only !== null && typeof only.type === 'string' && INTERACTIVE.has(only.type);
  const control = ownsControl ? cloneElement(only, { 'aria-describedby': [only.props['aria-describedby'], descId].filter(Boolean).join(' ') }) : children;
  const focusable = !ownsControl && controlId === undefined;
  const dotted = !ownsControl;

  const cancelPress = (): void => {
    clear(press);
    start.current = null;
  };

  return (
    <span
      ref={root}
      className={dotted ? 'tip tip-dotted' : 'tip'}
      {...(focusable ? { tabIndex: 0, 'aria-describedby': descId } : {})}
      onMouseEnter={() => {
        clear(hover);
        hover.current = setTimeout(() => setOpen(true), HOVER_MS);
      }}
      onMouseLeave={close}
      onPointerDown={(e) => {
        byPointer.current = true;
        if (e.pointerType !== 'touch') return;
        start.current = { x: e.clientX, y: e.clientY };
        clear(press);
        press.current = setTimeout(() => {
          swallow.current = true;
          setOpen(true);
          clear(hide);
          hide.current = setTimeout(() => setOpen(false), TOUCH_SHOW_MS);
        }, LONG_PRESS_MS);
      }}
      onPointerMove={(e) => {
        const s = start.current;
        if (s !== null && Math.hypot(e.clientX - s.x, e.clientY - s.y) > MOVE_PX) cancelPress();
      }}
      onPointerUp={cancelPress}
      onPointerCancel={cancelPress}
      onContextMenu={(e) => {
        // A long press opens the browser menu on some phones. The tip replaces it.
        if (start.current !== null || swallow.current) e.preventDefault();
      }}
      onClickCapture={(e) => {
        if (!swallow.current) return;
        swallow.current = false;
        e.preventDefault();
        e.stopPropagation();
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
      <span id={descId} className="sr-only">{text}</span>
      {open && (
        <span ref={bubble} id={id} role="tooltip" className={reduced ? 'tip-bubble' : 'tip-bubble tip-anim'}>
          {text}
        </span>
      )}
    </span>
  );
}
