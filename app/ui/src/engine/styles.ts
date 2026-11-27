/**
 * Vite lib mode writes the css to one file next to the entry. The host does not load it,
 * so the page adds one same-origin link element. The document CSP allows style-src 'self'.
 */
const STYLE_FILE = 'zonked.css';

export function ensureStyles(entryUrl: string): void {
  const href = new URL(STYLE_FILE, entryUrl).href;
  const known = [...document.querySelectorAll('link[data-zonked-css]')].some((l) => l.getAttribute('href') === href);
  if (known) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-zonked-css', '1');
  document.head.appendChild(link);
}
