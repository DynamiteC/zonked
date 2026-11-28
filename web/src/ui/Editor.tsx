import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LIMITS, PRESETS, parseSbg } from '../sbg';
import type { ScriptRecord, Store } from '../storage/db';
import { COPY } from './copy';
import { useNarrowFocusTrap } from './Drawer';
import { Tip } from './Tip';

interface Props {
  store: Store;
  onPlay: (text: string) => void;
  onClose: () => void;
}

const STARTER = PRESETS[0]?.sbg ?? '';

export function Editor({ store, onPlay, onClose }: Props): React.JSX.Element {
  const root = useRef<HTMLElement>(null);
  useNarrowFocusTrap(root);
  const [text, setText] = useState(STARTER);
  const [name, setName] = useState('My script');
  const [saved, setSaved] = useState<ScriptRecord[]>([]);
  const [note, setNote] = useState('');
  const area = useRef<HTMLTextAreaElement>(null);
  const diag = useMemo(() => parseSbg(text), [text]);

  const refresh = useCallback(() => {
    store.listScripts().then(setSaved, () => setNote('Could not read saved scripts.'));
  }, [store]);

  useEffect(() => {
    area.current?.focus();
    refresh();
  }, [refresh]);

  const save = (): void => {
    store.saveScript(name, text).then(
      () => {
        setNote('Saved.');
        refresh();
      },
      (e: unknown) => setNote(e instanceof RangeError ? 'Script is too large to save.' : 'Save failed.'),
    );
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file === undefined) return;
    if (file.size > LIMITS.maxBytes) {
      setNote(`File is ${file.size} bytes; the limit is ${LIMITS.maxBytes} bytes.`);
      return;
    }
    file.text().then(
      (t) => {
        setText(t);
        setName(file.name.replace(/\.[^.]*$/, '').slice(0, 80) || 'Imported');
        setNote(`Imported ${file.name}.`);
      },
      () => setNote('Could not read the file.'),
    );
  };

  const onExport = (): void => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^\w.-]+/g, '_') || 'script'}.sbg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside
      ref={root}
      className="editor"
      aria-label="Script editor"
      data-testid="editor"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="editor-head">
        <h2><Tip text={COPY.tips.editor}>Script editor</Tip></h2>
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      </div>
      <p className="meta">{COPY.helper.editor}</p>
      <label htmlFor="sbg-name">Name</label>
      <input id="sbg-name" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="sbg-text">.sbg script</label>
      <textarea
        id="sbg-text"
        ref={area}
        data-testid="editor-text"
        spellCheck={false}
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-describedby="sbg-diag"
      />
      <div id="sbg-diag" className="diag" role="status" aria-live="polite" data-testid="diagnostics">
        {diag.diagnostics.length === 0 ? (
          <p className="diag-ok">No problems.</p>
        ) : (
          <ul>
            {diag.diagnostics.slice(0, 50).map((d, i) => (
              <li key={`${d.line}-${i}`} className={`diag-${d.severity}`}>
                Line {d.line}: {d.severity}: {d.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="editor-actions">
        <button type="button" className="btn btn-primary" disabled={!diag.ok} onClick={() => onPlay(text)}>
          Play
        </button>
        <button type="button" className="btn" onClick={save}>
          Save
        </button>
        <label className="btn file-btn">
          Import
          <input type="file" accept=".sbg,.txt,text/plain" data-testid="import-input" onChange={onImport} />
        </label>
        <button type="button" className="btn" onClick={onExport}>
          Export
        </button>
      </div>
      <p className="note" role="status" aria-live="polite">
        {note}
      </p>
      {saved.length > 0 && (
        <ul className="saved" aria-label="Saved scripts">
          {saved.map((s) => (
            <li key={s.id}>
              <button type="button" className="btn" onClick={() => (setText(s.text), setName(s.name))}>
                {s.name}
              </button>
              <button
                type="button"
                className="btn"
                aria-label={`Delete ${s.name}`}
                onClick={() => void store.deleteScript(s.id).then(refresh)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
