import { useState } from 'react';
import { LIMITS } from '../../sbg';

export interface ImportExportProps {
  text: string;
  name: string;
  onImport: (text: string, name: string) => void;
}

const MAX_NAME = 80;
const safeName = (n: string): string => n.replace(/[^\w.-]+/g, '_') || 'script';

/** Import and export of .sbg files. Imports are size-capped here, then parsed like any typed script. */
export function ImportExportPanel({ text, name, onImport }: ImportExportProps): React.JSX.Element {
  const [note, setNote] = useState('');
  const pick = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file === undefined) return;
    if (file.size > LIMITS.maxBytes) {
      setNote(`That file is ${file.size} bytes. The limit is ${LIMITS.maxBytes} bytes.`);
      return;
    }
    file.text().then(
      (t) => {
        onImport(t, file.name.replace(/\.[^.]*$/, '').slice(0, MAX_NAME) || 'Imported');
        setNote(`Imported ${file.name}.`);
      },
      () => setNote('Could not read that file.'),
    );
  };
  const save = (): void => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName(name)}.sbg`;
    a.click();
    URL.revokeObjectURL(url);
    setNote(`Saved ${safeName(name)}.sbg.`);
  };
  return (
    <div className="adv-panel" data-testid="adv-io">
      <div className="adv-actions">
        <label className="adv-btn adv-file">
          Import .sbg
          <input type="file" accept=".sbg,.txt,text/plain" data-testid="adv-import-input" onChange={pick} />
        </label>
        <button type="button" className="adv-btn" data-testid="adv-export" onClick={save}>
          Export .sbg
        </button>
      </div>
      <p className="adv-note" role="status" aria-live="polite" data-testid="adv-io-note">
        {note}
      </p>
    </div>
  );
}
