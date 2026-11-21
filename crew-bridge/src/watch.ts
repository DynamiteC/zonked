import { constants as fsConstants, watch, type FSWatcher } from "node:fs";
import { open, stat } from "node:fs/promises";
import { basename, dirname } from "node:path";

export const DEBOUNCE_MS = 100;
export const POLL_MS = 2000;

export type ReadResult = { kind: "missing" } | { kind: "symlink" } | { kind: "toolarge"; size: number } | { kind: "data"; bytes: Buffer };

/** Read at most `cap` bytes; report files larger than the cap without loading them. */
export async function readCapped(path: string, cap: number): Promise<ReadResult> {
  let handle;
  try {
    handle = await open(path, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW | fsConstants.O_NONBLOCK);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { kind: "missing" };
    if (code === "ELOOP") return { kind: "symlink" };
    throw err;
  }
  try {
    const info = await handle.stat();
    if (!info.isFile()) return { kind: "missing" };
    if (info.size > cap) return { kind: "toolarge", size: info.size };
    const buf = Buffer.alloc(Math.min(info.size, cap) + 1);
    const { bytesRead } = await handle.read(buf, 0, buf.length, 0);
    if (bytesRead > cap) return { kind: "toolarge", size: bytesRead };
    return { kind: "data", bytes: buf.subarray(0, bytesRead) };
  } finally {
    await handle.close();
  }
}

export interface FileWatcherOptions {
  path: string;
  cap: number;
  debounceMs?: number;
  pollMs?: number;
  /** Called with a changed, readable file. Not called for unchanged content. */
  onData: (bytes: Buffer) => void;
  /** Called for missing, oversized or unreadable files. */
  onProblem: (message: string) => void;
}

/**
 * Watches one file through its parent directory (editors and agents replace files
 * by rename). A slow stat poll covers platforms where fs.watch drops events.
 * Strictly read-only.
 */
export class FileWatcher {
  private watcher: FSWatcher | null = null;
  private timer: NodeJS.Timeout | null = null;
  private poller: NodeJS.Timeout | null = null;
  private lastSig = "";
  private lastContent: string | null = null;
  private lastProblem: string | null = null;
  private running = false;
  private reading = false;
  private again = false;

  constructor(private readonly opts: FileWatcherOptions) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    const dir = dirname(this.opts.path);
    const name = basename(this.opts.path);
    try {
      this.watcher = watch(dir, { persistent: true }, (_event, file) => {
        if (file === null || file === undefined || file.toString() === name) this.schedule();
      });
      this.watcher.on("error", () => this.closeWatcher());
    } catch {
      this.watcher = null;
    }
    this.poller = setInterval(() => void this.pollTick(), this.opts.pollMs ?? POLL_MS);
    this.poller.unref();
    this.schedule();
  }

  stop(): void {
    this.running = false;
    this.closeWatcher();
    if (this.timer) clearTimeout(this.timer);
    if (this.poller) clearInterval(this.poller);
    this.timer = null;
    this.poller = null;
  }

  private closeWatcher(): void {
    this.watcher?.close();
    this.watcher = null;
  }

  private schedule(): void {
    if (!this.running) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.read(), this.opts.debounceMs ?? DEBOUNCE_MS);
  }

  private async pollTick(): Promise<void> {
    if (!this.running) return;
    let sig: string;
    try {
      const s = await stat(this.opts.path);
      sig = `${s.ino}:${s.size}:${s.mtimeMs}`;
    } catch {
      sig = "missing";
    }
    if (sig !== this.lastSig) this.schedule();
  }

  private async read(): Promise<void> {
    if (!this.running) return;
    if (this.reading) {
      this.again = true;
      return;
    }
    this.reading = true;
    try {
      try {
        const s = await stat(this.opts.path);
        this.lastSig = `${s.ino}:${s.size}:${s.mtimeMs}`;
      } catch {
        this.lastSig = "missing";
      }
      const result = await readCapped(this.opts.path, this.opts.cap);
      this.deliver(result);
    } catch (err) {
      this.problem(`cannot read file: ${(err as NodeJS.ErrnoException).code ?? "error"}`);
    } finally {
      this.reading = false;
      if (this.again) {
        this.again = false;
        this.schedule();
      }
    }
  }

  private deliver(result: ReadResult): void {
    if (result.kind === "missing") return this.problem("file not found");
    if (result.kind === "symlink") return this.problem("symlinks are not followed");
    if (result.kind === "toolarge") return this.problem(`file larger than ${this.opts.cap} bytes`);
    const text = result.bytes.toString("latin1");
    if (text === this.lastContent) return;
    this.lastContent = text;
    this.lastProblem = null;
    this.opts.onData(result.bytes);
  }

  private problem(message: string): void {
    this.lastContent = null;
    if (message === this.lastProblem) return;
    this.lastProblem = message;
    this.opts.onProblem(message);
  }
}
