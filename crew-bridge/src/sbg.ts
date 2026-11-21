// Minimal local .sbg line counter. Full parsing happens in the web app;
// the bridge only enforces the same hard limits (see contracts.md C2/C3).

export const SBG_MAX_BYTES = 4096;
export const SBG_MAX_EVENTS = 20;
export const SBG_MAX_LINE = 512;

export type SbgCheck = { ok: true; events: number } | { ok: false; reason: string };

const EVENT_LINE = /^\d{1,2}:\d{2}:\d{2}(?:\s|$)/;

export function checkSbg(text: string): SbgCheck {
  if (Buffer.byteLength(text, "utf8") > SBG_MAX_BYTES) {
    return { ok: false, reason: `sbg exceeds ${SBG_MAX_BYTES} bytes` };
  }
  // Allow tab, LF, CR and printable characters only.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
    return { ok: false, reason: "sbg contains control characters" };
  }
  let events = 0;
  for (const raw of text.split(/\r\n|\n|\r/)) {
    if (raw.length > SBG_MAX_LINE) return { ok: false, reason: `sbg line exceeds ${SBG_MAX_LINE} characters` };
    const line = raw.trim();
    if (line === "" || line.startsWith("#")) continue;
    if (EVENT_LINE.test(line)) {
      events += 1;
      if (events > SBG_MAX_EVENTS) return { ok: false, reason: `sbg has more than ${SBG_MAX_EVENTS} events` };
    }
  }
  return { ok: true, events };
}
