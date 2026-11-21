import { useEffect, useRef } from 'react';
import { COPY } from './copy';

export interface MoreItem {
  id: string;
  label: string;
  testId: string;
  onPick: () => void;
}

interface Props {
  open: boolean;
  items: readonly MoreItem[];
  onToggle: () => void;
  onClose: () => void;
}

/** Small disclosure menu. Not modal. Escape and outside click close it. */
export function MoreMenu({ open, items, onToggle, onClose }: Props): React.JSX.Element {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    const onDown = (e: Event): void => {
      if (!root.current?.contains(e.target as Node | null)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown, true);
    };
  }, [open, onClose]);
  return (
    <div className="more" ref={root}>
      <button type="button" className="btn" data-testid="more-toggle" aria-expanded={open} aria-controls="more-menu" onClick={onToggle}>
        {COPY.toolbar.more}
      </button>
      {open && (
        <ul id="more-menu" className="more-menu" data-testid="more-menu">
          {items.map((it) => (
            <li key={it.id}>
              <button type="button" className="more-item" data-testid={it.testId} onClick={() => { onClose(); it.onPick(); }}>
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
