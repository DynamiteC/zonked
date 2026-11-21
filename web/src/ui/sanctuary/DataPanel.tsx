import { useRef, useState } from 'react';
import { MAX_FILE_BYTES } from '../../app/backup';
import { SX } from './copy';
import { downloadText } from './download';
import type { SanctuaryData } from './useSanctuaryData';

type ErrKey = keyof typeof SX.data.errors;

export function DataPanel({ data, now }: { data: SanctuaryData; now: () => number }): React.JSX.Element {
  const c = SX.data;
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');
  const [message, setMessage] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File | undefined): Promise<void> => {
    if (file === undefined) return;
    // Check the size before reading so a huge file never loads into memory.
    if (file.size > MAX_FILE_BYTES) {
      setMessage(c.errors['too-big']);
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setMessage(c.errors['read-failed']);
      return;
    }
    const err = await data.importText(text, mode);
    setMessage(err === null ? c.imported : c.errors[err as ErrKey]);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="sx-stack" data-testid="sanctuary-data">
      <p className="sx-muted">{c.help}</p>
      <p data-testid="sanctuary-persist">{data.persistent ? c.where : c.notSaved}</p>
      <p className="sx-muted">{c.safariNote}</p>
      <div className="sx-card">
        <button
          type="button"
          className="btn sx-primary"
          data-testid="sanctuary-export"
          onClick={() => {
            const d = new Date(now());
            downloadText(`zonked-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.json`, data.exportText());
            setMessage(c.exported);
          }}
        >
          {c.export}
        </button>
        <p className="sx-muted">{c.exportHelp}</p>
      </div>
      <div className="sx-card">
        <label className="sx-label" htmlFor="sx-import">{c.import}</label>
        <p className="sx-muted">{c.importHelp}</p>
        <fieldset className="sx-fieldset">
          <legend className="sx-muted">{c.import}</legend>
          <label className="sx-check"><input type="radio" name="sx-import-mode" checked={mode === 'merge'} onChange={() => setMode('merge')} />{c.merge}</label>
          <label className="sx-check"><input type="radio" name="sx-import-mode" checked={mode === 'replace'} onChange={() => setMode('replace')} />{c.replace}</label>
        </fieldset>
        <input id="sx-import" ref={fileRef} data-testid="sanctuary-import" className="sx-input" type="file" accept="application/json,.json" onChange={(e) => void onFile(e.target.files?.[0])} />
      </div>
      <p role="status" data-testid="sanctuary-data-message">{message}</p>
      <div className="sx-card">
        <h4 className="sx-h4">{c.resetHeading}</h4>
        <p className="sx-muted">{c.resetHelp}</p>
        {confirm ? (
          <>
            <button type="button" className="btn" data-testid="sanctuary-reset-yes" onClick={() => void data.resetAll().then(() => setConfirm(false))}>{c.confirmReset}</button>
            <button type="button" className="btn" onClick={() => setConfirm(false)}>{c.cancel}</button>
          </>
        ) : (
          <button type="button" className="btn" data-testid="sanctuary-reset" onClick={() => setConfirm(true)}>{c.reset}</button>
        )}
      </div>
    </div>
  );
}
