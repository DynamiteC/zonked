import { LIMITS } from './limits';

export interface LexLine {
  readonly line: number;
  readonly tokens: string[];
  readonly tooLong: boolean;
}

/** UTF-8 byte length computed without allocating. Lone surrogates count as 3 bytes. */
export function utf8Length(text: string): number {
  let n = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c < 0x80) n += 1;
    else if (c < 0x800) n += 2;
    else if (c >= 0xd800 && c <= 0xdbff && i + 1 < text.length) {
      const d = text.charCodeAt(i + 1);
      if (d >= 0xdc00 && d <= 0xdfff) {
        n += 4;
        i++;
      } else n += 3;
    } else n += 3;
  }
  return n;
}

function isSpace(c: number): boolean {
  return c === 32 || c === 9 || c === 11 || c === 12 || c === 0xa0;
}

/** Split one line into whitespace separated tokens, dropping a trailing "#" comment. */
export function tokenize(raw: string): string[] {
  const tokens: string[] = [];
  let start = -1;
  for (let i = 0; i < raw.length; i++) {
    const c = raw.charCodeAt(i);
    if (c === 35) {
      if (start >= 0) tokens.push(raw.slice(start, i));
      return tokens;
    }
    if (isSpace(c)) {
      if (start >= 0) tokens.push(raw.slice(start, i));
      start = -1;
    } else if (start < 0) start = i;
  }
  if (start >= 0) tokens.push(raw.slice(start));
  return tokens;
}

/** Split text into non-empty lexed lines. Handles CRLF, CR, LF and a leading BOM. */
export function lexLines(text: string): LexLine[] {
  const out: LexLine[] = [];
  let i = text.charCodeAt(0) === 0xfeff ? 1 : 0;
  let lineNo = 1;
  let lineStart = i;
  const flush = (end: number): void => {
    const len = end - lineStart;
    if (len > LIMITS.maxLineLength) {
      out.push({ line: lineNo, tokens: [], tooLong: true });
    } else if (len > 0) {
      const tokens = tokenize(text.slice(lineStart, end));
      if (tokens.length > 0) out.push({ line: lineNo, tokens, tooLong: false });
    }
  };
  for (; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c === 10 || c === 13) {
      flush(i);
      if (c === 13 && text.charCodeAt(i + 1) === 10) i++;
      lineNo++;
      lineStart = i + 1;
    }
  }
  flush(text.length);
  return out;
}
