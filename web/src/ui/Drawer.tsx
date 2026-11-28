import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { resolveShortcut } from '../app/shortcuts';
import { Tip } from './Tip';

interface Props {
  id: string;
  title: string;
  testId: string;
  /** Plain-English helper shown as a tooltip and a calm line under the title. */
  help?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const NARROW = '(max-width: 959px)';

/** On narrow screens the drawer is a bottom sheet over the page: keep Tab inside it. */
export function useNarrowFocusTrap(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (el === null) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== 'Tab' || !(window.matchMedia?.(NARROW).matches ?? false)) return;
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (first === undefined || last === undefined) return;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === el || !el.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !el.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ref]);
}

/** Side panel shell. Escape closes it through the shared shortcut table. */
export function Drawer({ id, title, testId, help, onClose, children }: Props): React.JSX.Element {
  const head = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLElement>(null);
  useNarrowFocusTrap(root);
  useEffect(() => {
    head.current?.focus();
  }, []);
  return (
    <aside
      ref={root}
      className="drawer"
      id={id}
      aria-label={title}
      data-testid={testId}
      onKeyDown={(e) => {
        if (resolveShortcut({ key: e.key }) === 'escape') {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <div className="drawer-head">
        <h2 ref={head} tabIndex={-1}>
          {help !== undefined ? <Tip text={help}>{title}</Tip> : title}
        </h2>
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      </div>
      {children}
    </aside>
  );
}
