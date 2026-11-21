/** Screen Wake Lock wrapper. Safe when the API is missing or the request is rejected. */

export const WAKE_LOCK_PREF_KEY = 'zonked.wakeLock';

export interface WakeLockSentinelLike {
  release(): Promise<void>;
  addEventListener?(type: 'release', fn: () => void): void;
}

export interface WakeLockNav {
  wakeLock?: { request(type: 'screen'): Promise<WakeLockSentinelLike> };
}

export interface PrefStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export class WakeLockController {
  private sentinel: WakeLockSentinelLike | null = null;
  private enabled: boolean;
  private playing = false;
  private hidden = false;
  private pendingRequest = false;

  constructor(
    private readonly nav: WakeLockNav = typeof navigator === 'undefined' ? {} : (navigator as WakeLockNav),
    private readonly storage: PrefStorage | null = null,
  ) {
    this.enabled = this.readPref();
  }

  get supported(): boolean {
    return this.nav.wakeLock !== undefined && this.nav.wakeLock !== null;
  }
  get isEnabled(): boolean {
    return this.enabled;
  }
  get held(): boolean {
    return this.sentinel !== null;
  }

  /** User toggle. Persists the preference and applies it right away. */
  async setEnabled(on: boolean): Promise<void> {
    this.enabled = on;
    try {
      this.storage?.setItem(WAKE_LOCK_PREF_KEY, on ? '1' : '0');
    } catch {
      /* preference is kept in memory only */
    }
    await this.sync();
  }

  /** Call on play (true) and stop (false). */
  async setPlaying(playing: boolean): Promise<void> {
    this.playing = playing;
    await this.sync();
  }

  /** Call from visibilitychange. The browser drops the lock when hidden, so re-acquire on visible. */
  async setHidden(hidden: boolean): Promise<void> {
    this.hidden = hidden;
    await this.sync();
  }

  async dispose(): Promise<void> {
    this.playing = false;
    await this.sync();
  }

  private wanted(): boolean {
    return this.enabled && this.playing && !this.hidden && this.supported;
  }

  private async sync(): Promise<void> {
    if (!this.wanted()) {
      await this.release();
      return;
    }
    if (this.sentinel !== null || this.pendingRequest) return;
    this.pendingRequest = true;
    try {
      const s = await (this.nav.wakeLock as NonNullable<WakeLockNav['wakeLock']>).request('screen');
      if (this.wanted()) {
        this.sentinel = s;
        s.addEventListener?.('release', () => {
          if (this.sentinel === s) this.sentinel = null;
        });
      } else {
        await s.release().catch(() => undefined);
      }
    } catch {
      /* rejected (low battery, permission policy): playback is unaffected */
    } finally {
      this.pendingRequest = false;
    }
  }

  private async release(): Promise<void> {
    const s = this.sentinel;
    this.sentinel = null;
    if (s === null) return;
    try {
      await s.release();
    } catch {
      /* already released */
    }
  }

  private readPref(): boolean {
    try {
      return this.storage?.getItem(WAKE_LOCK_PREF_KEY) === '1';
    } catch {
      return false;
    }
  }
}
