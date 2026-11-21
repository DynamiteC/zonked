import http from "node:http";
import type { AddressInfo } from "node:net";
import type { Duplex } from "node:stream";
import { parseSignalsBytes, parseStateBytes, MAX_STATE_BYTES, type CrewState, type SignalsSummary } from "./validate.js";
import { FileWatcher } from "./watch.js";
import { readFileSync } from "node:fs";

function readVersion(): string {
  try {
    const pkg: unknown = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
    const v = (pkg as { version?: unknown }).version;
    return typeof v === "string" ? v : "unknown";
  } catch {
    return "unknown";
  }
}
const VERSION = readVersion();

export const DEFAULT_PORT = 43210;
export const MAX_SSE_CLIENTS = 20;
export const MAX_SSE_PER_ORIGIN = 4;
export const PING_MS = 15_000;
const MAX_CONNECTIONS = 64;
const MAX_CLIENT_BACKLOG = 256 * 1024;

export const DEFAULT_ORIGINS: readonly string[] = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:8787",
  "http://127.0.0.1:8787",
];

export interface BridgeOptions {
  statePath: string;
  signalsPath?: string;
  /** Use 0 to let the OS choose (tests). Host allow-list follows the bound port. */
  port?: number;
  origins?: readonly string[];
  /** Lowest accepted transitionSec. Default 30. Lower only for demos. */
  minTransitionSec?: number;
  pingMs?: number;
  debounceMs?: number;
  pollMs?: number;
  maxClients?: number;
  maxClientsPerOrigin?: number;
  log?: (line: string) => void;
}

export class Bridge {
  private readonly server: http.Server;
  private readonly clients = new Set<http.ServerResponse>();
  private readonly originCounts = new Map<string, number>();
  private readonly origins: Set<string>;
  private readonly watchers: FileWatcher[] = [];
  private hosts = new Set<string>();
  private latest: CrewState | null = null;
  private latestJson = "";
  private lastError: string | null = null;
  private warnings: string[] = [];
  private signals: SignalsSummary | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private readonly sockets = new Set<Duplex>();
  private boundPort = 0;

  constructor(private readonly opts: BridgeOptions) {
    this.origins = new Set([...DEFAULT_ORIGINS, ...(opts.origins ?? [])]);
    this.server = http.createServer((req, res) => this.handle(req, res));
    this.server.maxHeadersCount = 50;
    this.server.headersTimeout = 10_000;
    this.server.requestTimeout = 10_000;
    this.server.keepAliveTimeout = 5_000;
    this.server.maxConnections = MAX_CONNECTIONS;
    this.server.on("clientError", (_err, socket) => {
      if (socket.writable) socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
      else socket.destroy();
    });
    this.server.on("connection", (s) => {
      this.sockets.add(s);
      s.on("close", () => this.sockets.delete(s));
    });
  }

  get allowedOrigins(): string[] {
    return [...this.origins];
  }

  get port(): number {
    return this.boundPort;
  }

  async start(): Promise<number> {
    await new Promise<void>((resolve, reject) => {
      this.server.once("error", reject);
      this.server.listen(this.opts.port ?? DEFAULT_PORT, "127.0.0.1", () => {
        this.server.off("error", reject);
        resolve();
      });
    });
    this.boundPort = (this.server.address() as AddressInfo).port;
    this.hosts = new Set([`localhost:${this.boundPort}`, `127.0.0.1:${this.boundPort}`]);
    this.startWatchers();
    this.pingTimer = setInterval(() => this.broadcast("ping", JSON.stringify({ at: Math.floor(Date.now() / 1000) })), this.opts.pingMs ?? PING_MS);
    this.pingTimer.unref();
    return this.boundPort;
  }

  async stop(): Promise<void> {
    if (this.pingTimer) clearInterval(this.pingTimer);
    for (const w of this.watchers) w.stop();
    for (const res of this.clients) res.end();
    this.clients.clear();
    const closed = new Promise<void>((resolve) => this.server.close(() => resolve()));
    this.server.closeIdleConnections();
    setTimeout(() => {
      for (const s of this.sockets) s.destroy();
    }, 500).unref();
    await closed;
  }

  private startWatchers(): void {
    const common = { cap: MAX_STATE_BYTES, debounceMs: this.opts.debounceMs, pollMs: this.opts.pollMs };
    this.watchers.push(
      new FileWatcher({
        ...common,
        path: this.opts.statePath,
        onData: (b) => this.onState(b),
        onProblem: (m) => this.setError(m),
      }),
    );
    if (this.opts.signalsPath) {
      this.watchers.push(
        new FileWatcher({
          ...common,
          path: this.opts.signalsPath,
          onData: (b) => {
            const r = parseSignalsBytes(b);
            this.signals = r.ok ? r.value : null;
          },
          onProblem: () => {
            this.signals = null;
          },
        }),
      );
    }
    for (const w of this.watchers) w.start();
  }

  private setError(message: string): void {
    this.lastError = message;
    this.opts.log?.(`state ignored: ${message}`);
  }

  private onState(bytes: Buffer): void {
    const result = parseStateBytes(bytes, { minTransitionSec: this.opts.minTransitionSec });
    if (!result.ok) return this.setError(result.error);
    this.lastError = null;
    this.warnings = result.warnings;
    this.latest = result.state;
    this.latestJson = JSON.stringify(result.state);
    for (const w of result.warnings) this.opts.log?.(`state warning: ${w}`);
    this.broadcast("state", this.latestJson);
    this.opts.log?.(`state accepted: ${result.state.burnout.level} score ${result.state.burnout.score}`);
  }

  private broadcast(event: string, data: string): void {
    const frame = `event: ${event}\ndata: ${data}\n\n`;
    for (const res of this.clients) {
      if (res.writableLength > MAX_CLIENT_BACKLOG) {
        res.destroy();
        this.clients.delete(res);
        continue;
      }
      res.write(frame);
    }
  }

  private deny(res: http.ServerResponse, status: number, message: string): void {
    res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store", Connection: "close" });
    res.end(JSON.stringify({ error: message }));
  }

  private handle(req: http.IncomingMessage, res: http.ServerResponse): void {
    const host = req.headers.host;
    if (host === undefined || !this.hosts.has(host.toLowerCase())) return this.deny(res, 403, "host not allowed");
    const origin = req.headers.origin;
    if (origin !== undefined && !this.origins.has(origin)) return this.deny(res, 403, "origin not allowed");

    const cors: Record<string, string> = {
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "cross-origin",
    };
    if (origin !== undefined) {
      cors["Access-Control-Allow-Origin"] = origin;
      cors["Vary"] = "Origin";
    }

    if (req.method === "OPTIONS") {
      res.writeHead(204, { ...cors, "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS", "Access-Control-Max-Age": "600" });
      return void res.end();
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD, OPTIONS");
      return this.deny(res, 405, "method not allowed");
    }

    let path: string;
    try {
      path = new URL(req.url ?? "/", "http://localhost").pathname;
    } catch {
      return this.deny(res, 400, "bad request");
    }
    switch (path) {
      case "/events":
        if (req.method !== "GET") {
          res.setHeader("Allow", "GET");
          return this.deny(res, 405, "method not allowed");
        }
        return this.sse(req, res, cors);
      case "/state":
        return this.json(res, cors, this.latest ? 200 : 404, this.latest ? this.latestJson : '{"error":"no state yet"}');
      case "/health":
        return this.json(res, cors, 200, JSON.stringify(this.health()));
      default:
        return this.deny(res, 404, "not found");
    }
  }

  private health(): Record<string, unknown> {
    return {
      ok: true,
      version: VERSION,
      port: this.boundPort,
      hasState: this.latest !== null,
      lastError: this.lastError,
      warnings: this.warnings,
      clients: this.clients.size,
      ...(this.opts.signalsPath ? { signals: this.signals } : {}),
    };
  }

  private json(res: http.ServerResponse, cors: Record<string, string>, status: number, body: string): void {
    res.writeHead(status, { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(body);
  }

  private sse(req: http.IncomingMessage, res: http.ServerResponse, cors: Record<string, string>): void {
    if (this.clients.size >= (this.opts.maxClients ?? MAX_SSE_CLIENTS)) {
      return this.deny(res, 503, "too many clients");
    }
    const originKey = req.headers.origin ?? "";
    if ((this.originCounts.get(originKey) ?? 0) >= (this.opts.maxClientsPerOrigin ?? MAX_SSE_PER_ORIGIN)) {
      return this.deny(res, 503, "too many clients for origin");
    }
    this.originCounts.set(originKey, (this.originCounts.get(originKey) ?? 0) + 1);
    res.writeHead(200, {
      ...cors,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    req.socket.setNoDelay(true);
    req.socket.setTimeout(0);
    res.write("retry: 3000\n\n");
    if (this.latest) res.write(`event: state\ndata: ${this.latestJson}\n\n`);
    this.clients.add(res);
    let counted = true;
    const drop = (): void => {
      this.clients.delete(res);
      if (counted) {
        counted = false;
        const n = (this.originCounts.get(originKey) ?? 1) - 1;
        if (n <= 0) this.originCounts.delete(originKey);
        else this.originCounts.set(originKey, n);
      }
    };
    req.on("close", drop);
    res.on("close", drop);
    res.on("error", drop);
  }
}
