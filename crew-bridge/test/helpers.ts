import http from "node:http";
import { mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function tmpDir(): string {
  return mkdtempSync(join(tmpdir(), "zonked-bridge-"));
}
export function cleanup(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}
export function goodState(over: Record<string, unknown> = {}, score = 66): Record<string, unknown> {
  return {
    version: 1,
    at: 1790000000,
    burnout: { score, level: "recovery" },
    target: { presetId: "burnout-reset", beatHz: 10, carrierHz: 200, gain: 0.5, transitionSec: 60, breathe: true },
    sbg: null,
    ...over,
  };
}
export function writeAtomic(path: string, value: unknown): void {
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, typeof value === "string" ? value : JSON.stringify(value));
  renameSync(tmp, path);
}
export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
export async function until(fn: () => boolean, ms = 3000): Promise<void> {
  const end = Date.now() + ms;
  while (!fn()) {
    if (Date.now() > end) throw new Error("condition not met in time");
    await sleep(10);
  }
}

export interface Reply {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
}
export function request(
  port: number,
  path: string,
  headers: Record<string, string | undefined> = {},
  method = "GET",
): Promise<Reply> {
  const h: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) if (v !== undefined) h[k] = v;
  if (!("host" in h) && !("Host" in h)) h["Host"] = `127.0.0.1:${port}`;
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path, method, headers: h, agent: false }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c: string) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body }));
    });
    req.on("error", reject);
    req.end();
  });
}

export interface SseEvent {
  event: string;
  data: string;
  receivedAt: number;
}
export class SseClient {
  readonly events: SseEvent[] = [];
  status = 0;
  headers: http.IncomingHttpHeaders = {};
  private req: http.ClientRequest | null = null;
  private buf = "";

  static open(port: number, headers: Record<string, string> = {}): Promise<SseClient> {
    const c = new SseClient();
    return new Promise((resolve, reject) => {
      c.req = http.request(
        { host: "127.0.0.1", port, path: "/events", headers: { Host: `127.0.0.1:${port}`, ...headers }, agent: false },
        (res) => {
          c.status = res.statusCode ?? 0;
          c.headers = res.headers;
          res.setEncoding("utf8");
          res.on("data", (chunk: string) => c.feed(chunk));
          res.on("error", () => undefined);
          resolve(c);
        },
      );
      c.req.on("error", (e) => {
        if (c.status === 0) reject(e);
      });
      c.req.end();
    });
  }
  private feed(chunk: string): void {
    this.buf += chunk;
    let i: number;
    while ((i = this.buf.indexOf("\n\n")) >= 0) {
      const block = this.buf.slice(0, i);
      this.buf = this.buf.slice(i + 2);
      let event = "message";
      const data: string[] = [];
      for (const line of block.split("\n")) {
        if (line.startsWith("event: ")) event = line.slice(7);
        else if (line.startsWith("data: ")) data.push(line.slice(6));
      }
      if (data.length > 0) this.events.push({ event, data: data.join("\n"), receivedAt: Date.now() });
    }
  }
  states(): SseEvent[] {
    return this.events.filter((e) => e.event === "state");
  }
  close(): void {
    this.req?.destroy();
  }
}
