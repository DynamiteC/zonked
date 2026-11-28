import { useEffect, useRef } from 'react';

/** Open dialogs, oldest first. Only the last one answers Escape. */
const open: symbol[] = [];

/**
 * Escape closes the topmost dialog from anywhere on the page. A key handler on the dialog alone misses it in Safari,
 * where a tapped button does not take focus, so the key goes to the page body.
 */
export function useEscape(onClose: () => void, active = true): void {
  const latest = useRef(onClose);
  latest.current = onClose;
  useEffect(() => {
    if (!active) return undefined;
    const me = Symbol('dialog');
    open.push(me);
    const on = (e: KeyboardEvent): void => {
      if (e.key !== 'Escape' || open[open.length - 1] !== me) return;
      e.stopPropagation();
      latest.current();
    };
    document.addEventListener('keydown', on);
    return () => {
      document.removeEventListener('keydown', on);
      const at = open.indexOf(me);
      if (at >= 0) open.splice(at, 1);
    };
  }, [active]);
}
