/** Reports which browser features work in the hosting document. Read-only, no network. */
export async function probeCapabilities(): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  out['origin'] = location.origin;
  out['crossOriginIsolated'] = String(self.crossOriginIsolated);
  out['SharedArrayBuffer'] = typeof SharedArrayBuffer;
  out['AudioWorklet'] = typeof AudioWorkletNode === 'function' ? 'yes' : 'no';
  out['WebAssembly'] = typeof WebAssembly === 'object' ? 'yes' : 'no';
  out['localStorage'] = (() => { try { localStorage.setItem('zk-probe', '1'); localStorage.removeItem('zk-probe'); return 'ok'; } catch (e) { return `fail: ${String(e)}`; } })();
  out['indexedDB'] = await new Promise<string>((resolve) => {
    try {
      const r = indexedDB.open('zk-probe');
      r.onsuccess = (): void => { r.result.close(); indexedDB.deleteDatabase('zk-probe'); resolve('ok'); };
      r.onerror = (): void => resolve(`fail: ${String(r.error)}`);
    } catch (e) { resolve(`fail: ${String(e)}`); }
  });
  out['wakeLock API'] = 'wakeLock' in navigator ? 'present' : 'absent';
  out['mediaSession API'] = 'mediaSession' in navigator ? 'present' : 'absent';
  out['serviceWorker API'] = 'serviceWorker' in navigator ? 'present' : 'absent';
  out['visibility'] = document.visibilityState;
  return out;
}
