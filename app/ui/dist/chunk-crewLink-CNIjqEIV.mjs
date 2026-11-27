var gt = Object.defineProperty;
var bt = (n, e, t) => e in n ? gt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var c = (n, e, t) => bt(n, typeof e != "symbol" ? e + "" : e, t);
import * as vt from "@kirocrew/app-sdk";
import { useState as He, useEffect as Ye } from "react";
const U = {
  level: { min: 0, max: 1 },
  instRootHz: { min: 55, max: 880 },
  padRootHz: { min: 55, max: 440 },
  bpm: { min: 30, max: 180 },
  chimeRatePerMin: { min: 1, max: 30 },
  breathRateHz: { min: 0.05, max: 0.2 },
  panRateHz: { min: 0.02, max: 0.2 },
  enumMax: 7,
  instKindMax: 3
}, A = Object.freeze({
  lofiLevel: 0,
  lofiWarmth: 0.5,
  crackle: 0,
  instLevel: 0,
  instKind: 0,
  instRootHz: 220,
  instScale: 0,
  instBpm: 60,
  padLevel: 0,
  padChord: 0,
  padRootHz: 110,
  chimeLevel: 0,
  chimeRatePerMin: 6,
  percLevel: 0,
  percBpm: 70,
  percPattern: 0,
  lofiProgression: 0,
  tapeWow: 0,
  pianoPedal: 0,
  breathDepth: 0,
  breathRateHz: 0.1,
  stereoWidth: 0,
  panDepth: 0,
  panRateHz: 0.05
}), H = {
  maxBytes: 262144,
  maxEvents: 500,
  maxLineLength: 512
}, l = {
  carrierMin: 20,
  carrierMax: 1500,
  beatMin: 0.5,
  beatMax: 40,
  gainMin: 0,
  gainMax: 0.85,
  noiseMin: 0,
  noiseMax: 1,
  maxTimeSec: 86400,
  maxDiagnostics: 1e3
}, yt = 200, Mt = 10, wt = 0.5, St = 0.3, M = (n, e, t) => Number.isFinite(n) ? Math.min(t, Math.max(e, n)) : e, k = (n) => M(n, U.level.min, U.level.max), K = (n, e) => Math.round(M(n, 0, e));
function kt(n) {
  const e = { ...A, ...n }, t = U;
  return {
    lofiLevel: k(e.lofiLevel),
    lofiWarmth: k(e.lofiWarmth),
    crackle: k(e.crackle),
    instLevel: k(e.instLevel),
    instKind: K(e.instKind, t.instKindMax),
    instRootHz: M(e.instRootHz, t.instRootHz.min, t.instRootHz.max),
    instScale: K(e.instScale, t.enumMax),
    instBpm: M(e.instBpm, t.bpm.min, t.bpm.max),
    padLevel: k(e.padLevel),
    padChord: K(e.padChord, t.enumMax),
    padRootHz: M(e.padRootHz, t.padRootHz.min, t.padRootHz.max),
    chimeLevel: k(e.chimeLevel),
    chimeRatePerMin: M(e.chimeRatePerMin, t.chimeRatePerMin.min, t.chimeRatePerMin.max),
    percLevel: k(e.percLevel),
    percBpm: M(e.percBpm, t.bpm.min, t.bpm.max),
    percPattern: K(e.percPattern, t.enumMax),
    lofiProgression: K(e.lofiProgression, t.enumMax),
    tapeWow: k(e.tapeWow),
    pianoPedal: k(e.pianoPedal),
    breathDepth: k(e.breathDepth),
    breathRateHz: M(e.breathRateHz, t.breathRateHz.min, t.breathRateHz.max),
    stereoWidth: k(e.stereoWidth),
    panDepth: k(e.panDepth),
    panRateHz: M(e.panRateHz, t.panRateHz.min, t.panRateHz.max)
  };
}
function Ae(n, e, t) {
  return {
    tSec: e,
    voice: {
      carrierHz: M(n.carrierHz, l.carrierMin, l.carrierMax),
      beatHz: M(n.beatHz, l.beatMin, l.beatMax),
      noise: n.noise,
      noiseLevel: M(n.noiseLevel, l.noiseMin, l.noiseMax),
      mode: n.mode,
      gain: M(n.gain, l.gainMin, l.gainMax),
      layers: kt(n.layers)
    },
    ramp: n.ramp,
    line: t
  };
}
function Lt(n) {
  let t = 0;
  const i = n.stages.slice(0, 499).map((a, o) => {
    const u = Number.isFinite(a.atMin) ? a.atMin * 60 : 0;
    return t = M(Math.max(t, u), 0, l.maxTimeSec), Ae(a, t, o + 1);
  }), s = n.stages[Math.min(n.stages.length, 499) - 1];
  if (s === void 0) return i;
  const r = M(Math.max(t, n.recommendedMinutes * 60), 0, l.maxTimeSec);
  return i.push(Ae({ ...s, ramp: !1 }, r, i.length + 1)), i;
}
function Rt(n) {
  let e = 0;
  for (let t = 0; t < n.length; t++) {
    const i = n.charCodeAt(t);
    if (i < 128) e += 1;
    else if (i < 2048) e += 2;
    else if (i >= 55296 && i <= 56319 && t + 1 < n.length) {
      const s = n.charCodeAt(t + 1);
      s >= 56320 && s <= 57343 ? (e += 4, t++) : e += 3;
    } else e += 3;
  }
  return e;
}
function Et(n) {
  return n === 32 || n === 9 || n === 11 || n === 12 || n === 160;
}
function zt(n) {
  const e = [];
  let t = -1;
  for (let i = 0; i < n.length; i++) {
    const s = n.charCodeAt(i);
    if (s === 35)
      return t >= 0 && e.push(n.slice(t, i)), e;
    Et(s) ? (t >= 0 && e.push(n.slice(t, i)), t = -1) : t < 0 && (t = i);
  }
  return t >= 0 && e.push(n.slice(t)), e;
}
function Ht(n) {
  const e = [];
  let t = n.charCodeAt(0) === 65279 ? 1 : 0, i = 1, s = t;
  const r = (a) => {
    const o = a - s;
    if (o > H.maxLineLength)
      e.push({ line: i, tokens: [], tooLong: !0 });
    else if (o > 0) {
      const u = zt(n.slice(s, a));
      u.length > 0 && e.push({ line: i, tokens: u, tooLong: !1 });
    }
  };
  for (; t < n.length; t++) {
    const a = n.charCodeAt(t);
    (a === 10 || a === 13) && (r(t), a === 13 && n.charCodeAt(t + 1) === 10 && t++, i++, s = t + 1);
  }
  return r(n.length), e;
}
const At = {
  carrierHz: 200,
  beatHz: 10,
  noise: "off",
  noiseLevel: 0,
  mode: "binaural",
  gain: 0
};
function q(n, e, t) {
  return n < e ? e : n > t ? t : n;
}
function Tt(n, e) {
  const t = Number.isFinite(e) ? e : 0;
  let i = 0, s = n.length - 1, r = -1;
  for (; i <= s; ) {
    const a = i + s >> 1, o = n[a];
    o !== void 0 && o.tSec <= t ? (r = a, i = a + 1) : s = a - 1;
  }
  return r;
}
function Ge(n) {
  const e = n[n.length - 1];
  return e === void 0 ? 0 : e.tSec;
}
function j(n, e, t) {
  return n + (e - n) * t;
}
const Pt = /* @__PURE__ */ new Set(["instKind", "instScale", "padChord", "percPattern", "lofiProgression"]);
function xt(n, e, t) {
  if (n === void 0 && e === void 0) return;
  const i = n ?? A, s = e ?? A, r = {};
  for (const a of Object.keys(A))
    r[a] = Pt.has(a) ? t >= 1 ? s[a] : i[a] : j(i[a], s[a], t);
  return r;
}
function It(n, e, t) {
  const i = xt(n.layers, e.layers, t);
  return {
    carrierHz: q(j(n.carrierHz, e.carrierHz, t), l.carrierMin, l.carrierMax),
    beatHz: q(j(n.beatHz, e.beatHz, t), l.beatMin, l.beatMax),
    noise: n.noise === "off" ? e.noise : n.noise,
    noiseLevel: q(j(n.noiseLevel, e.noiseLevel, t), l.noiseMin, l.noiseMax),
    mode: n.mode,
    gain: q(j(n.gain, e.gain, t), l.gainMin, l.gainMax),
    ...i !== void 0 ? { layers: i } : {}
  };
}
function oe(n, e) {
  const t = Tt(n, e), i = n[Math.max(0, t)];
  if (i === void 0) return At;
  const s = n[t + 1];
  if (t < 0 || !i.ramp || s === void 0) return i.voice;
  const r = Number.isFinite(e) ? e : 0, a = s.tSec - i.tSec;
  return a > 0 ? It(i.voice, s.voice, q((r - i.tSec) / a, 0, 1)) : s.voice;
}
const Ot = /^[+-]?[0-9]{1,15}(?:\.[0-9]{1,15})?$/, Nt = /^[0-9]{1,2}:[0-9]{1,2}(?::[0-9]{1,2})?$/, _t = /^[A-Za-z_][A-Za-z0-9_-]{0,31}$/, Te = 24;
function D(n) {
  return n.length > Te ? `${n.slice(0, Te)}...` : n;
}
function g(n, e, t, i) {
  t === "error" && n.errors++, n.diags.length < l.maxDiagnostics ? n.diags.push({ line: e, severity: t, message: i }) : n.diags.length === l.maxDiagnostics && n.diags.push({ line: e, severity: "warning", message: "Too many diagnostics, further messages dropped" });
}
function Q(n) {
  if (!Ot.test(n)) return null;
  const e = Number(n);
  return Number.isFinite(e) ? e : null;
}
function ee(n, e, t, i, s, r) {
  if (i >= s && i <= r) return i;
  const a = i < s ? s : r;
  return g(n, e, "warning", `${t} ${i} out of range, clamped to ${a}`), a;
}
function Xe(n) {
  switch (n.toLowerCase()) {
    case "iso":
    case "isochronic":
      return "isochronic";
    case "mono":
    case "monaural":
      return "monaural";
    case "bin":
    case "binaural":
      return "binaural";
    default:
      return null;
  }
}
function Ct(n) {
  const e = n.toLowerCase();
  return e === "pink" || e === "white" || e === "brown" || e === "violet" ? e : null;
}
function Bt(n, e, t, i) {
  const s = t.indexOf("/"), r = s < 0 ? t : t.slice(0, s);
  let a = -1;
  for (let F = 0; F < r.length && a < 0; F++) {
    const ze = r[F];
    (ze === "@" || ze === "+" && F > 0) && (a = F);
  }
  const o = a < 0 ? r : r.slice(0, a), u = a < 0 ? "" : r.slice(a + 1), m = o === "" ? null : Q(o), f = u === "" ? null : Q(u), b = s < 0 ? null : Q(t.slice(s + 1)), y = o !== "" && m === null, R = a >= 0 && f === null, ae = s >= 0 && b === null;
  return y || R || ae || r === "" ? !1 : (m !== null && (i.carrier = ee(n, e, "carrier", m, l.carrierMin, l.carrierMax)), f !== null && (i.beat = ee(n, e, "beat", f, l.beatMin, l.beatMax)), b !== null && (i.gain = ee(n, e, "gain", b, l.gainMin, l.gainMax)), !0);
}
function Dt(n, e, t, i) {
  const s = t.indexOf("/"), r = Ct(s < 0 ? t : t.slice(0, s));
  if (r === null) return !1;
  let a = St;
  if (s >= 0) {
    const o = Q(t.slice(s + 1));
    if (o === null) return !1;
    a = ee(n, e, "noise level", o / 100, l.noiseMin, l.noiseMax);
  }
  return i.noise = r, i.noiseLevel = a, !0;
}
function Ft(n, e, t, i) {
  const s = Xe(t);
  if (s !== null) i.mode = s;
  else {
    if (Dt(n, e, t, i)) return;
    Bt(n, e, t, i) || g(n, e, "warning", `Unknown token "${D(t)}" skipped`);
  }
}
function Kt(n, e) {
  const i = !(e.carrier !== void 0 || e.beat !== void 0 || e.gain !== void 0) && e.noise !== void 0;
  return {
    carrierHz: e.carrier ?? yt,
    beatHz: e.beat ?? Mt,
    noise: e.noise ?? "off",
    noiseLevel: e.noiseLevel ?? 0,
    mode: e.mode ?? n.mode,
    gain: i ? 0 : e.gain ?? wt
  };
}
function Wt(n, e) {
  const t = e.tokens[0] ?? "", i = t.indexOf(":"), s = t.slice(0, i), r = e.tokens.slice(1);
  if (i < t.length - 1 && r.unshift(t.slice(i + 1)), s.toLowerCase() === "mode") {
    const o = r[0] === void 0 ? null : Xe(r[0]);
    o === null ? g(n, e.line, "warning", "mode expects iso, mono or bin; ignored") : n.mode = o;
    return;
  }
  if (!_t.test(s)) {
    g(n, e.line, "warning", `Invalid tone-set name "${D(s)}", line skipped`);
    return;
  }
  const a = {};
  for (const o of r) Ft(n, e.line, o, a);
  r.length === 0 && g(n, e.line, "warning", `Tone-set "${s}" has no parameters, defaults used`), n.defs.set(s, Kt(n, a));
}
function $t(n) {
  if (n === "NOW") return 0;
  if (!Nt.test(n)) return null;
  const e = n.split(":").map(Number), [t = 0, i = 0, s = 0] = e.length === 2 ? [e[0], e[1], 0] : e;
  return i > 59 || s > 59 ? null : t * 3600 + i * 60 + s;
}
function qt(n, e) {
  const [t = "", i, ...s] = e.tokens, r = $t(t);
  if (r === null) return g(n, e.line, "error", `Invalid time "${D(t)}", expected HH:MM:SS`);
  if (r > l.maxTimeSec) return g(n, e.line, "error", "Time exceeds 24 hours");
  if (r < n.lastT) return g(n, e.line, "error", "Times must not decrease");
  if (i === void 0) return g(n, e.line, "warning", "Sequence line has no tone-set name, skipped");
  let a = i, o = !1;
  a.endsWith("->") && (o = !0, a = a.slice(0, -2));
  for (const m of s)
    m === "->" && !o ? o = !0 : g(n, e.line, "warning", `Unknown token "${D(m)}" skipped`);
  const u = n.defs.get(a);
  if (u === void 0) return g(n, e.line, "warning", `Unknown tone-set "${D(a)}", line skipped`);
  if (n.events.length >= H.maxEvents)
    return n.stop = !0, g(n, e.line, "error", `More than ${H.maxEvents} events, parsing stopped`);
  n.lastT = r, n.events.push({ tSec: r, voice: u, ramp: o, line: e.line });
}
function jt(n) {
  return n === "NOW" || n.charCodeAt(0) >= 48 && n.charCodeAt(0) <= 57 && n.includes(":");
}
function Vt(n, e) {
  const t = e.tokens[0] ?? "";
  jt(t) ? qt(n, e) : t.includes(":") ? Wt(n, e) : g(n, e.line, "warning", `Unknown token "${D(t)}", line skipped`);
}
function ce(n) {
  return {
    events: n.events,
    durationSec: Ge(n.events),
    diagnostics: n.diags,
    ok: n.errors === 0
  };
}
function Ut() {
  return { diags: [], errors: 0, defs: /* @__PURE__ */ new Map(), mode: "binaural", events: [], lastT: 0, stop: !1 };
}
function Y(n) {
  const e = Ut();
  try {
    if (typeof n != "string")
      return g(e, 1, "error", "Input must be a string"), ce(e);
    if (n.length > H.maxBytes || Rt(n) > H.maxBytes)
      return g(e, 1, "error", `Input exceeds ${H.maxBytes} bytes, not parsed`), ce(e);
    for (const t of Ht(n))
      if (t.tooLong ? g(e, t.line, "error", `Line longer than ${H.maxLineLength} characters`) : Vt(e, t), e.stop) break;
    e.events.length === 0 && e.errors === 0 && g(e, 1, "warning", "No sequence events found");
  } catch (t) {
    g(e, 1, "error", `Internal parser error: ${t instanceof Error ? t.message : "unknown"}`);
  }
  return ce(e);
}
const Yt = `# Deep Focus: 40 Hz gamma binaural beat on a 200 Hz carrier.
mode: bin
focus: 200+40/0.4
00:00:00 focus
`, Gt = `# Flow State: 18 Hz beta on a 220 Hz carrier.
mode: bin
flow: 220+18/0.4
00:00:00 flow
`, Xt = `# AI Burnout Reset: 10 Hz alpha glides to 6 Hz theta over 20 minutes,
# with a soft pink noise bed. Gain stays low for tired ears.
mode: bin
alpha: 200+10/0.35 pink/15
theta: 200+6/0.35 pink/20
00:00:00 alpha ->
00:20:00 theta
`, Zt = `# Breathwork Sync: 5.5 Hz theta, 5.5 breaths per minute.
mode: bin
breathe: 180+5.5/0.4
00:00:00 breathe
`, Jt = `# Deep Rest: 2.5 Hz delta on a low 150 Hz carrier.
mode: bin
rest: 150+2.5/0.35 brown/10
00:00:00 rest
`, Qt = `# ts - SBaGen style demo sequence, 1998 vintage.
# Four tone-sets, ramps between them, about 15 minutes in all.
# Press play, close your eyes, and enjoy the ride.
mode: bin
base:  200+10/0.4 pink/10   # alpha entry
slide: 200+7/0.4 pink/10    # slide down to theta
deep:  200+4/0.4 pink/15    # theta/delta border
back:  200+9/0.4 pink/10    # coming back up
00:00:00 base ->
00:03:00 slide ->
00:08:00 deep ->
00:12:00 back ->
00:15:00 base
`, ge = [
  {
    id: "deep-focus",
    name: "Deep Focus",
    description: "40 Hz gamma beat for concentrated work.",
    sbg: Yt
  },
  {
    id: "flow-state",
    name: "Flow State",
    description: "18 Hz beta beat for steady, engaged flow.",
    sbg: Gt
  },
  {
    id: "burnout-reset",
    name: "AI Burnout Reset",
    description: "10 Hz alpha gliding to 6 Hz theta over 20 minutes with soft pink noise.",
    sbg: Xt
  },
  {
    id: "breathwork-sync",
    name: "Breathwork Sync",
    description: "5.5 Hz theta with a 6-breath guided pacer at 5.5 breaths per minute.",
    sbg: Zt,
    breath: { inSec: 5.45, outSec: 5.45 }
  },
  {
    id: "deep-rest",
    name: "Deep Rest",
    description: "2.5 Hz delta beat for deep rest.",
    sbg: Jt
  },
  {
    id: "classic-1998",
    name: "Classic 1998 SBaGen Demo",
    description: "A 15 minute SBaGen-style demo with timed ramps.",
    sbg: Qt
  }
], le = "zonked.timer.v1", en = 2.5, Pe = 0.1, xe = 6, P = { countdownMin: 30, sleepMin: 30, focusMin: 25, breakMin: 5 }, tn = 1, nn = 720, sn = 500, ue = ["none", "countdown", "sleep-fade", "pomodoro"], rn = { kind: "none", running: !1, remainingSec: 0, totalSec: 0 }, G = (n, e) => typeof n == "number" && Number.isFinite(n) ? Math.min(nn, Math.max(tn, n)) : e;
class an {
  constructor(e, t = null) {
    c(this, "listeners", /* @__PURE__ */ new Set());
    c(this, "spec", null);
    c(this, "running", !1);
    c(this, "elapsedMs", 0);
    c(this, "lastMs", 0);
    c(this, "phase", "focus");
    c(this, "cycle", 1);
    c(this, "poll", null);
    c(this, "lastKey", "");
    /** Called once when a countdown or sleep fade completes (state is already reset to none). */
    c(this, "onEnd", null);
    this.clock = e, this.storage = t, this.restore();
  }
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  state() {
    return this.advance(), this.build();
  }
  start(e) {
    return this.spec = this.normalize(e), this.elapsedMs = 0, this.phase = "focus", this.cycle = 1, this.run(), this.changed();
  }
  stop() {
    return this.spec = null, this.running = !1, this.elapsedMs = 0, this.stopPoll(), this.changed();
  }
  pause() {
    return this.advance(), this.spec !== null && this.running && (this.running = !1, this.stopPoll()), this.changed();
  }
  resume() {
    return this.spec !== null && !this.running && this.run(), this.changed();
  }
  /** none, countdown, sleep-fade, pomodoro, none... Starts the next kind with default minutes. */
  cycleNext() {
    var i;
    const e = ((i = this.spec) == null ? void 0 : i.kind) ?? "none", t = ue[(ue.indexOf(e) + 1) % ue.length] ?? "none";
    return t === "none" ? this.stop() : t === "countdown" ? this.start({ kind: "countdown", minutes: P.countdownMin }) : t === "sleep-fade" ? this.start({ kind: "sleep-fade", minutes: P.sleepMin }) : this.start({ kind: "pomodoro" });
  }
  /** Moves within the current segment by deltaSec (negative rewinds). Clamps to [0, total). */
  seekBy(e) {
    if (this.advance(), this.spec === null || !Number.isFinite(e)) return this.build();
    const t = this.segmentMs();
    return this.elapsedMs = Math.min(Math.max(0, this.elapsedMs + e * 1e3), Math.max(0, t - 1)), this.changed();
  }
  /** Gain scale and beat glide for the current moment. Advances the timer first. */
  effects() {
    this.advance();
    const e = this.spec;
    if (e === null || e.kind !== "sleep-fade") return { gainScale: 1, beatMix: 0 };
    const t = this.segmentMs(), i = Math.min(1, this.elapsedMs / t);
    if (this.elapsedMs <= t) return { gainScale: 1 - (1 - Pe) * i, beatMix: i };
    const s = Math.min(1, (this.elapsedMs - t) / (xe * 1e3));
    return { gainScale: Pe * (1 - s), beatMix: 1 };
  }
  normalize(e) {
    if (e.kind === "pomodoro") {
      const t = e.longEvery !== void 0 && Number.isFinite(e.longEvery) ? Math.max(2, Math.floor(e.longEvery)) : void 0;
      return {
        kind: "pomodoro",
        focusMin: G(e.focusMin, P.focusMin),
        breakMin: G(e.breakMin, P.breakMin),
        ...e.longBreakMin !== void 0 && t !== void 0 ? { longBreakMin: G(e.longBreakMin, 15), longEvery: t } : {}
      };
    }
    return { kind: e.kind, minutes: G(e.minutes, e.kind === "countdown" ? P.countdownMin : P.sleepMin) };
  }
  /** Length of the current segment in ms (phase length for pomodoro, N minutes otherwise). */
  segmentMs() {
    const e = this.spec;
    return e === null ? 0 : e.kind !== "pomodoro" ? e.minutes * 6e4 : this.phase === "focus" ? (e.focusMin ?? P.focusMin) * 6e4 : (e.longBreakMin !== void 0 && e.longEvery !== void 0 && this.cycle % e.longEvery === 0 ? e.longBreakMin ?? 0 : e.breakMin ?? P.breakMin) * 6e4;
  }
  run() {
    this.running = !0, this.lastMs = this.clock.now(), this.startPoll();
  }
  startPoll() {
    this.poll === null && (this.poll = this.clock.setInterval(() => void this.changed(), sn));
  }
  stopPoll() {
    this.poll !== null && this.clock.clearInterval(this.poll), this.poll = null;
  }
  advance() {
    if (!this.running || this.spec === null) return;
    const e = this.clock.now(), t = Math.max(0, e - this.lastMs);
    this.lastMs = e, this.elapsedMs += t;
    const i = this.spec;
    i.kind === "pomodoro" ? this.rollPomodoro() : i.kind === "countdown" && this.elapsedMs >= this.segmentMs() ? this.finish("countdown") : i.kind === "sleep-fade" && this.elapsedMs >= this.segmentMs() + xe * 1e3 && this.finish("sleep-fade");
  }
  rollPomodoro() {
    for (let e = 0; e < 1e3; e++) {
      const t = this.segmentMs();
      if (this.elapsedMs < t) return;
      this.elapsedMs -= t, this.phase === "focus" ? this.phase = "break" : (this.phase = "focus", this.cycle += 1);
    }
    this.elapsedMs = 0;
  }
  finish(e) {
    var t;
    this.spec = null, this.running = !1, this.elapsedMs = 0, this.stopPoll(), this.persist(), this.notify(this.build()), (t = this.onEnd) == null || t.call(this, e);
  }
  build() {
    const e = this.spec;
    if (e === null) return rn;
    const t = this.segmentMs() / 1e3, i = Math.max(0, Math.ceil(t - this.elapsedMs / 1e3));
    if (e.kind === "pomodoro")
      return {
        kind: "pomodoro",
        running: this.running,
        remainingSec: i,
        totalSec: t,
        phase: this.phase,
        cycle: this.cycle,
        focusMin: e.focusMin,
        breakMin: e.breakMin
      };
    const s = { kind: e.kind, running: this.running, remainingSec: i, totalSec: t };
    return e.kind === "sleep-fade" && this.elapsedMs > this.segmentMs() ? { ...s, finalFade: !0 } : s;
  }
  /** Advances, persists and notifies when the visible state changed. */
  changed() {
    this.advance();
    const e = this.build(), t = `${e.kind}|${e.running}|${e.remainingSec}|${e.phase ?? ""}|${e.cycle ?? 0}|${e.finalFade === !0}`;
    return t !== this.lastKey && (this.lastKey = t, this.persist(), this.notify(e)), e;
  }
  notify(e) {
    for (const t of this.listeners) t(e);
  }
  persist() {
    if (this.storage !== null)
      try {
        if (this.spec === null) {
          this.storage.removeItem(le);
          return;
        }
        const e = { v: 1, spec: this.spec, elapsedMs: this.elapsedMs, phase: this.phase, cycle: this.cycle };
        this.storage.setItem(le, JSON.stringify(e));
      } catch {
      }
  }
  restore() {
    if (this.storage !== null)
      try {
        const e = this.storage.getItem(le);
        if (e === null) return;
        const t = JSON.parse(e);
        if (t.v !== 1 || t.spec === void 0 || t.spec === null || typeof t.spec != "object" || !["countdown", "sleep-fade", "pomodoro"].includes(t.spec.kind)) return;
        this.spec = this.normalize(t.spec), this.phase = t.phase === "break" ? "break" : "focus", this.cycle = typeof t.cycle == "number" && Number.isFinite(t.cycle) ? Math.max(1, Math.floor(t.cycle)) : 1;
        const i = typeof t.elapsedMs == "number" && Number.isFinite(t.elapsedMs) ? t.elapsedMs : 0;
        this.elapsedMs = Math.min(Math.max(0, i), Math.max(0, this.segmentMs() - 1)), this.running = !1;
      } catch {
        this.spec = null;
      }
  }
}
const on = {
  now: () => Date.now(),
  setInterval: (n, e) => window.setInterval(n, e),
  clearInterval: (n) => window.clearInterval(n)
}, Ie = ["off", "white", "pink", "brown", "violet"], E = 0.85, cn = 8, ln = 3;
function Ze(n, e) {
  const t = Number.isFinite(e) ? e : A[n], i = U;
  switch (n) {
    case "instRootHz":
      return h(t, i.instRootHz.min, i.instRootHz.max);
    case "padRootHz":
      return h(t, i.padRootHz.min, i.padRootHz.max);
    case "instBpm":
    case "percBpm":
      return h(t, i.bpm.min, i.bpm.max);
    case "chimeRatePerMin":
      return h(t, i.chimeRatePerMin.min, i.chimeRatePerMin.max);
    case "breathRateHz":
      return h(t, i.breathRateHz.min, i.breathRateHz.max);
    case "panRateHz":
      return h(t, i.panRateHz.min, i.panRateHz.max);
    case "instKind":
      return Math.round(h(t, 0, i.instKindMax));
    case "instScale":
    case "padChord":
    case "lofiProgression":
    case "percPattern":
      return Math.round(h(t, 0, i.enumMax));
    default:
      return h(t, i.level.min, i.level.max);
  }
}
const un = 100, Oe = 0.25, dn = 3, hn = 0.02, de = (n, e, t) => n + (e - n) * t, h = (n, e, t) => n < e ? e : n > t ? t : n, W = (n, e) => Number.isFinite(n) ? n : e;
function pn() {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}
function mn(n, e, t) {
  return {
    ...e,
    carrierHz: de(n.carrierHz, e.carrierHz, t),
    beatHz: de(n.beatHz, e.beatHz, t),
    gain: de(n.gain, e.gain, t)
  };
}
function Ne(n) {
  return ge.find((e) => e.id === n) ?? ge[0];
}
class fn {
  constructor(e, t, i, s = {}) {
    c(this, "listeners", /* @__PURE__ */ new Set());
    c(this, "mode");
    c(this, "base");
    c(this, "current");
    c(this, "template", null);
    c(this, "queue", []);
    c(this, "queueIndex", -1);
    c(this, "muted", !1);
    c(this, "gainTrim", 0);
    /** Effective gain (before timer scale) at the last user action; crew-driven gain never exceeds it. */
    c(this, "userCeiling", 0);
    /** Slew-limited crew gain level (before timer scale). */
    c(this, "crewLevel", 0);
    /** Last raw gain the listener was given (before mute and timer scale). */
    c(this, "heardRaw", 0);
    c(this, "wantPlaying", !1);
    c(this, "opTail", Promise.resolve());
    c(this, "opCount", 0);
    c(this, "layerOverrides", {});
    c(this, "gainScale", 1);
    c(this, "beatOverride", null);
    c(this, "noiseOverride", null);
    c(this, "breakMix", 0);
    c(this, "lastTickMs", 0);
    c(this, "toEvents");
    c(this, "timers");
    c(this, "presetId");
    c(this, "source", "preset");
    c(this, "overridden", !1);
    c(this, "latestCrew", null);
    c(this, "burnout", null);
    c(this, "breathe", !1);
    c(this, "peak", 0);
    c(this, "endKind", "manual");
    c(this, "breakCount", 0);
    c(this, "lastPhase");
    c(this, "playing", !1);
    c(this, "startedAt", 0);
    c(this, "timer", null);
    var o;
    this.engine = e, this.clock = t, this.onSession = i, this.toEvents = s.toEvents, this.timers = new an(t, s.storage === void 0 ? pn() : s.storage), this.timers.subscribe(() => {
      const u = this.timers.state().phase;
      this.playing && u === "break" && this.lastPhase !== "break" && (this.breakCount += 1), this.lastPhase = u, this.emit();
    }), this.timers.onEnd = (u) => {
      this.endKind = u, this.stop();
    };
    const r = Ne(((o = ge[0]) == null ? void 0 : o.id) ?? "");
    this.presetId = r.id;
    const a = Y(r.sbg).events;
    this.base = oe(a, 0), this.current = this.base, this.userCeiling = h(this.base.gain, 0, E), this.crewLevel = this.userCeiling, this.heardRaw = this.userCeiling, this.mode = { kind: "script", events: a, startMs: t.now() };
  }
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  snapshot() {
    var e, t, i;
    return {
      playing: this.playing,
      source: this.source,
      presetId: this.presetId,
      overridden: this.overridden,
      voice: this.current,
      elapsedSec: this.playing ? (this.clock.now() - this.startedAt) / 1e3 : 0,
      burnout: this.burnout,
      breathe: this.breathe,
      templateId: ((e = this.template) == null ? void 0 : e.id) ?? null,
      templateName: ((t = this.template) == null ? void 0 : t.name) ?? null,
      templateCategory: ((i = this.template) == null ? void 0 : i.category) ?? null,
      queueIndex: this.queueIndex,
      queueLength: this.queue.length,
      muted: this.muted,
      gainScale: this.gainScale,
      gainTrim: this.gainTrim,
      timer: this.timers.state(),
      layerOverrides: this.layerOverrides,
      beatOverride: this.beatOverride,
      noiseOverride: this.noiseOverride
    };
  }
  // ---- queue and templates ----
  setQueue(e) {
    var i;
    this.queue = [...e];
    const t = (i = this.template) == null ? void 0 : i.id;
    this.queueIndex = t === void 0 ? -1 : this.queue.findIndex((s) => s.id === t), this.emit();
  }
  /** Plays a template through the injected toEvents. Resolves false when it cannot be played. */
  async playTemplate(e) {
    const t = this.queue.findIndex((i) => i.id === e.id);
    return this.playAt(e, t);
  }
  async nextTemplate() {
    return this.step(1);
  }
  async prevTemplate() {
    return this.step(-1);
  }
  async step(e) {
    const t = this.queue.length;
    if (t === 0) return !1;
    const s = ((this.queueIndex < 0 ? e === 1 ? -1 : 0 : this.queueIndex) + e + t) % t, r = this.queue[s];
    return r === void 0 ? !1 : this.playAt(r, s);
  }
  async playAt(e, t) {
    var s;
    const i = ((s = this.toEvents) == null ? void 0 : s.call(this, e)) ?? [];
    return i.length === 0 ? !1 : (this.overridden = !0, this.source = "template", this.template = e, this.queueIndex = t, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(i), this.playing || await this.play(), !0);
  }
  // ---- gain ----
  setMuted(e) {
    e && !this.muted && this.captureUserLevel(0), this.muted = e, this.applyNow();
  }
  toggleMute() {
    this.setMuted(!this.muted);
  }
  /** Adds delta (use +/- GAIN_STEP) to the user volume offset. Final gain never exceeds MAX_GAIN. */
  nudgeGain(e) {
    if (!Number.isFinite(e)) return;
    const t = this.base.gain, i = Math.round((this.gainTrim + e) * 1e3) / 1e3, s = this.gainTrim;
    this.gainTrim = h(i, -t, Math.max(0, E - t)), this.captureUserLevel(this.gainTrim - s), this.applyNow();
  }
  /** Records the level the user is hearing (plus the delta they just applied) as the new crew ceiling. */
  captureUserLevel(e) {
    const t = h(this.heardRaw + e, 0, E);
    this.userCeiling = t, this.crewLevel = t;
  }
  /** Sets the ceiling from a freshly chosen script or play start (the gain the user will hear). */
  captureFromBase() {
    const e = h(this.base.gain + this.gainTrim, 0, E);
    this.userCeiling = e, this.crewLevel = e, this.heardRaw = e;
  }
  // ---- layer mixer ----
  /** Overrides layer fields (levels, tempo, etc.) over whatever the script plays. Values are clamped. */
  setLayerOverride(e) {
    const t = { ...this.layerOverrides };
    for (const [i, s] of Object.entries(e))
      Object.hasOwn(A, i) && typeof s == "number" && (t[i] = Ze(i, s));
    this.layerOverrides = t, this.applyNow();
  }
  /** Forces the beat frequency (0.5 to 40 Hz). Non-finite values are ignored. null clears. */
  setBeatOverride(e) {
    if (e === null) this.beatOverride = null;
    else if (Number.isFinite(e)) this.beatOverride = h(e, 0.5, 40);
    else return;
    this.applyNow();
  }
  /** Forces the noise kind and or level. Bad fields are ignored. null clears. */
  setNoiseOverride(e) {
    if (e === null)
      this.noiseOverride = null;
    else {
      const t = typeof e.noise == "string" && Ie.includes(e.noise) ? e.noise : void 0, i = typeof e.noiseLevel == "number" && Number.isFinite(e.noiseLevel) ? h(e.noiseLevel, 0, 1) : void 0;
      if (t === void 0 && i === void 0) return;
      this.noiseOverride = { ...t !== void 0 ? { noise: t } : {}, ...i !== void 0 ? { noiseLevel: i } : {} };
    }
    this.applyNow();
  }
  clearVoiceOverrides() {
    this.beatOverride = null, this.noiseOverride = null;
  }
  clearLayerOverrides() {
    this.layerOverrides = {}, this.applyNow();
  }
  // ---- saved mixes ----
  /** What is playing now as a savable mix. Values are re-clamped by makeMix when saved. */
  getMixDraft() {
    const e = this.base, t = this.timers.state(), i = this.source === "template" && this.template !== null ? { kind: "template", id: this.template.id } : this.source === "preset" ? { kind: "preset", id: this.presetId } : { kind: "custom", id: "custom" }, s = t.kind === "countdown" || t.kind === "sleep-fade" ? { kind: t.kind, minutes: Math.max(1, Math.round(t.totalSec / 60)) } : t.kind === "pomodoro" ? { kind: "pomodoro", focusMin: t.focusMin ?? 25, breakMin: t.breakMin ?? 5 } : { kind: "none" };
    return {
      source: i,
      voice: {
        carrierHz: e.carrierHz,
        beatHz: e.beatHz,
        mode: e.mode,
        noise: e.noise,
        noiseLevel: e.noiseLevel,
        gain: h(e.gain + this.gainTrim, 0, E)
      },
      layers: { ...e.layers ?? {}, ...this.layerOverrides },
      timer: s,
      ...this.beatOverride !== null ? { beatOverride: this.beatOverride } : {},
      ...this.noiseOverride !== null ? { noiseOverride: this.noiseOverride } : {}
    };
  }
  /** Plays a mix that was already validated by parseMix or makeMix. The caller shows the safety gate first. */
  playMix(e) {
    const t = e.voice, i = {
      carrierHz: h(t.carrierHz, 20, 1500),
      beatHz: h(t.beatHz, 0.5, 40),
      mode: t.mode,
      noise: t.noise,
      noiseLevel: h(t.noiseLevel, 0, 1),
      gain: h(t.gain, 0, E),
      layers: { ...A, ...e.layers }
    };
    this.overridden = !0, this.source = "custom", this.presetId = `mix:${e.id}`.slice(0, 80), this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.layerOverrides = {}, e.beatOverride !== void 0 && (this.beatOverride = h(e.beatOverride, 0.5, 40));
    const s = e.noiseOverride;
    if (s !== void 0) {
      const a = s.noise !== void 0 && Ie.includes(s.noise) ? s.noise : void 0, o = s.noiseLevel !== void 0 && Number.isFinite(s.noiseLevel) ? h(s.noiseLevel, 0, 1) : void 0;
      this.noiseOverride = { ...a !== void 0 ? { noise: a } : {}, ...o !== void 0 ? { noiseLevel: o } : {} };
    }
    this.startScript([{ tSec: 0, voice: i, ramp: !1, line: 0 }]);
    const r = e.timer;
    r.kind === "countdown" || r.kind === "sleep-fade" ? this.startTimer({ kind: r.kind, minutes: r.minutes ?? 30 }) : r.kind === "pomodoro" ? this.startTimer({ kind: "pomodoro", focusMin: r.focusMin ?? 25, breakMin: r.breakMin ?? 5 }) : this.stopTimer(), this.play();
  }
  // ---- timers ----
  startTimer(e) {
    const t = this.timers.start(e);
    return this.playing || this.timers.pause(), this.emit(), t;
  }
  stopTimer() {
    this.timers.stop(), this.gainScale = 1, this.applyNow();
  }
  cycleTimer() {
    const e = this.timers.cycleNext();
    return this.playing || this.timers.pause(), this.applyNow(), e;
  }
  /** Timer position when a timer is active, else the template timeline. Null when neither applies. */
  positionState() {
    const e = this.timers.state();
    if (e.kind !== "none") {
      const r = e.totalSec;
      return { durationSec: r, positionSec: e.finalFade === !0 ? r : Math.max(0, r - e.remainingSec) };
    }
    const t = this.mode;
    if (this.template === null || t.kind !== "script") return null;
    const i = this.scriptDuration(t.events), s = this.playing ? (this.clock.now() - t.startMs) / 1e3 : 0;
    return { durationSec: i, positionSec: h(s, 0, i) };
  }
  /** Seeks within the active timer, or the template timeline. Clamped to its bounds. */
  seekBy(e) {
    if (Number.isFinite(e)) {
      if (this.timers.state().kind !== "none")
        this.timers.seekBy(e);
      else if (this.mode.kind === "script" && this.template !== null) {
        const t = this.mode, i = this.scriptDuration(t.events), s = h((this.clock.now() - t.startMs) / 1e3 + e, 0, i);
        this.mode = { ...t, startMs: this.clock.now() - s * 1e3 };
      }
      this.applyNow();
    }
  }
  scriptDuration(e) {
    var i;
    const t = Ge(e);
    return t > 0 ? t : Math.max(60, (((i = this.template) == null ? void 0 : i.recommendedMinutes) ?? 1) * 60);
  }
  /** Recomputes the effective voice and pushes it to the engine when playing. */
  applyNow() {
    this.current = this.effective(this.base), this.playing && this.engine.setVoice(this.current, Oe), this.emit();
  }
  effective(e) {
    const t = this.timers.effects();
    this.gainScale = t.gainScale;
    const i = e.beatHz + (en - e.beatHz) * t.beatMix, s = Math.min(i, cn), r = h(i + (s - i) * this.breakMix, 0.5, 40), a = this.beatOverride ?? r, o = this.noiseOverride, u = h(e.gain + this.gainTrim, 0, E), m = this.source === "crew" ? Math.min(u, this.crewLevel, this.userCeiling) : u;
    this.heardRaw = m;
    const f = this.muted ? 0 : m, y = Object.keys(this.layerOverrides).length > 0 ? { ...e.layers ?? A, ...this.layerOverrides } : e.layers;
    return {
      ...e,
      beatHz: a,
      ...(o == null ? void 0 : o.noise) !== void 0 ? { noise: o.noise } : {},
      ...(o == null ? void 0 : o.noiseLevel) !== void 0 ? { noiseLevel: o.noiseLevel } : {},
      // Defense in depth: a non-finite gain (forged crew state) is silence, never NaN.
      gain: W(Math.min(E, f * t.gainScale), 0),
      ...y !== void 0 ? { layers: y } : {}
    };
  }
  slewBreak(e) {
    const t = Math.max(0, e - this.lastTickMs);
    if (this.lastTickMs = e, this.source === "crew") {
      const r = Math.min(h(this.base.gain + this.gainTrim, 0, E), this.userCeiling);
      this.crewLevel = r > this.crewLevel ? Math.min(r, this.crewLevel + hn * t / 1e3) : r;
    }
    const i = this.timers.state().phase === "break" ? 1 : 0, s = t / (ln * 1e3);
    this.breakMix = i > this.breakMix ? Math.min(i, this.breakMix + s) : Math.max(i, this.breakMix - s);
  }
  /** Manual preset choice. Overrides the crew until followCrew(). */
  selectPreset(e) {
    const t = Ne(e);
    this.overridden = !0, this.presetId = t.id, this.source = "preset", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(Y(t.sbg).events);
  }
  /** Parses and plays custom text. Returns diagnostics; nothing plays when it has errors. */
  async playCustom(e) {
    const t = Y(e);
    return !t.ok || t.events.length === 0 || (this.overridden = !0, this.source = "custom", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(t.events), this.playing || await this.play()), t.diagnostics;
  }
  followCrew() {
    this.overridden = !1, this.latestCrew !== null ? this.enterCrew(this.latestCrew) : this.emit();
  }
  applyCrew(e) {
    this.latestCrew = e, this.burnout = e.burnout.score, this.breathe = e.target.breathe, this.peak = Math.max(this.peak, e.burnout.score), this.overridden ? this.emit() : this.enterCrew(e);
  }
  /** Clears the crew data after the bridge drops (the sound keeps playing). */
  crewLost() {
    this.burnout = null, this.emit();
  }
  /** Runs op after every earlier play/stop op has finished; runs synchronously when none is pending. */
  enqueue(e) {
    const t = this.opCount === 0 ? e() : this.opTail.then(e);
    return this.opCount += 1, this.opTail = t.then(
      () => void (this.opCount -= 1),
      () => void (this.opCount -= 1)
    ), t;
  }
  play() {
    return this.wantPlaying = !0, this.enqueue(() => this.doPlay());
  }
  stop() {
    return this.wantPlaying = !1, this.enqueue(() => this.doStop());
  }
  async doPlay() {
    var i;
    if (this.playing || !this.wantPlaying) return;
    const e = this.clock.now();
    this.restartModeClock(e), this.lastTickMs = e, this.captureFromBase(), this.current = this.effective(this.base);
    try {
      await this.engine.start(this.current);
    } catch {
      this.emit();
      return;
    }
    const t = (i = this.engine.status) == null ? void 0 : i.state;
    if (t !== void 0 && t !== "running") {
      this.emit();
      return;
    }
    this.playing = !0, this.startedAt = e, this.peak = this.burnout ?? 0, this.endKind = "manual", this.breakCount = 0, this.lastPhase = this.timers.state().phase, this.timer = this.clock.setInterval(() => this.tick(), un), this.timers.resume(), this.emit();
  }
  async doStop() {
    var e, t;
    if (this.playing) {
      this.playing = !1, this.timers.pause(), this.timer !== null && this.clock.clearInterval(this.timer), this.timer = null, (t = this.onSession) == null || t.call(this, {
        startedAt: this.startedAt,
        endedAt: this.clock.now(),
        peakScore: this.peak,
        presetId: this.source === "crew" ? ((e = this.latestCrew) == null ? void 0 : e.target.presetId) ?? this.presetId : this.presetId,
        endKind: this.endKind,
        breaks: this.breakCount
      }), this.emit();
      try {
        await this.engine.stop();
      } catch {
      }
    }
  }
  tick() {
    if (!this.playing) return;
    const e = this.clock.now();
    this.base = this.voiceNow(e), this.slewBreak(e), this.current = this.effective(this.base), this.playing && (this.engine.setVoice(this.current, Oe), this.emit());
  }
  voiceNow(e) {
    const t = this.mode;
    if (t.kind === "hold") return t.voice;
    if (t.kind === "script") return oe(t.events, (e - t.startMs) / 1e3);
    const i = Math.min(1, Math.max(0, (e - t.startMs) / t.durMs));
    return i >= 1 ? (this.mode = { kind: "hold", voice: t.to }, t.to) : mn(t.from, t.to, i);
  }
  restartModeClock(e) {
    const t = this.mode;
    t.kind !== "hold" && (this.mode = { ...t, startMs: e });
  }
  startScript(e) {
    this.mode = { kind: "script", events: e, startMs: this.clock.now() }, this.base = oe(e, 0), this.captureFromBase(), this.current = this.effective(this.base), this.playing && this.engine.setVoice(this.current, dn), this.emit();
  }
  enterCrew(e) {
    const t = this.clock.now();
    this.source = "crew", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.crewLevel = Math.min(this.heardRaw, this.userCeiling);
    const i = e.sbg === null ? null : Y(e.sbg);
    if (i !== null && i.ok && i.events.length > 0)
      this.mode = { kind: "script", events: i.events, startMs: t };
    else {
      const s = e.target, r = {
        ...this.base,
        carrierHz: h(W(s.carrierHz, this.base.carrierHz), 20, 1500),
        beatHz: h(W(s.beatHz, this.base.beatHz), 0.5, 40),
        gain: h(W(s.gain, 0), 0, E)
      };
      this.mode = { kind: "transition", from: this.base, to: r, startMs: t, durMs: h(W(s.transitionSec, 5), 0.1, 600) * 1e3 };
    }
    this.emit();
  }
  emit() {
    const e = this.snapshot();
    for (const t of this.listeners) t(e);
  }
}
const gn = 1, be = 200, bn = 60, he = 240, Je = ["off", "white", "pink", "brown", "violet"], vn = ["binaural", "monaural", "isochronic"], yn = ["template", "preset", "custom", "mix"], Mn = ["none", "countdown", "sleep-fade", "pomodoro"], ve = (n, e, t) => n < e ? e : n > t ? t : n;
function _(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
function p(n, e) {
  return Object.hasOwn(n, e) ? n[e] : void 0;
}
function T(n, e, t, i) {
  return typeof n == "number" && Number.isFinite(n) ? ve(n, e, t) : i;
}
function wn(n, e) {
  if (typeof n != "string") return e;
  const t = n.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, bn);
  return t.length > 0 ? t : e;
}
function Qe(n) {
  return typeof n == "string" && /^[A-Za-z0-9_.:-]{1,64}$/.test(n) ? n : null;
}
function te(n, e, t) {
  return typeof n == "string" && e.includes(n) ? n : t;
}
function Sn(n) {
  return _(n) ? {
    carrierHz: T(p(n, "carrierHz"), l.carrierMin, l.carrierMax, 200),
    beatHz: T(p(n, "beatHz"), l.beatMin, l.beatMax, 10),
    mode: te(p(n, "mode"), vn, "binaural"),
    noise: te(p(n, "noise"), Je, "off"),
    noiseLevel: T(p(n, "noiseLevel"), l.noiseMin, l.noiseMax, 0),
    gain: T(p(n, "gain"), l.gainMin, l.gainMax, 0.3)
  } : null;
}
function kn(n) {
  const e = {};
  if (!_(n)) return e;
  for (const t of Object.keys(A)) {
    const i = p(n, t);
    typeof i == "number" && Number.isFinite(i) && (e[t] = Ze(t, i));
  }
  return e;
}
function Ln(n) {
  if (!_(n)) return { kind: "none" };
  const e = te(p(n, "kind"), Mn, "none");
  return e === "countdown" || e === "sleep-fade" ? { kind: e, minutes: Math.round(T(p(n, "minutes"), 1, he, 30)) } : e === "pomodoro" ? {
    kind: e,
    focusMin: Math.round(T(p(n, "focusMin"), 1, he, 25)),
    breakMin: Math.round(T(p(n, "breakMin"), 1, he, 5))
  } : { kind: "none" };
}
function Rn(n) {
  return _(n) ? { kind: te(p(n, "kind"), yn, "custom"), id: Qe(p(n, "id")) ?? "custom" } : { kind: "custom", id: "custom" };
}
function En(n) {
  if (!_(n)) return null;
  const e = Sn(p(n, "voice"));
  if (e === null) return null;
  const t = p(n, "beatOverride"), i = p(n, "noiseOverride"), s = _(i) ? p(i, "noise") : void 0, r = _(i) ? p(i, "noiseLevel") : void 0, a = {
    ...typeof s == "string" && Je.includes(s) ? { noise: s } : {},
    ...typeof r == "number" && Number.isFinite(r) ? { noiseLevel: ve(r, l.noiseMin, l.noiseMax) } : {}
  };
  return {
    source: Rn(p(n, "source")),
    voice: e,
    layers: kn(p(n, "layers")),
    timer: Ln(p(n, "timer")),
    ...typeof t == "number" && Number.isFinite(t) ? { beatOverride: ve(t, l.beatMin, l.beatMax) } : {},
    ...Object.keys(a).length > 0 ? { noiseOverride: a } : {}
  };
}
function zn(n, e) {
  if (!_(n) || p(n, "v") !== gn) return null;
  const t = Qe(p(n, "id")), i = En(n);
  if (t === null || i === null) return null;
  const s = T(p(n, "createdAt"), 0, e + 864e5, e), r = T(p(n, "updatedAt"), 0, e + 864e5, s);
  return { ...i, v: 1, id: t, name: wn(p(n, "name"), "My mix"), createdAt: s, updatedAt: r };
}
const Hn = "zonked.safety.v1", _e = "zonked.reduceMotion";
function Le(n, e = et()) {
  try {
    return (e == null ? void 0 : e.getItem(n)) === "1";
  } catch {
    return !1;
  }
}
function Re(n, e, t = et()) {
  try {
    t == null || t.setItem(n, e ? "1" : "0");
  } catch {
  }
}
function et() {
  try {
    return typeof localStorage > "u" ? void 0 : localStorage;
  } catch {
    return;
  }
}
function An() {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}
function wi() {
  const [n, e] = He(() => Le(_e)), [t, i] = He(() => {
    var r;
    return ((r = window.matchMedia) == null ? void 0 : r.call(window, "(prefers-reduced-motion: reduce)").matches) ?? !1;
  });
  return Ye(() => {
    var o;
    const r = (o = window.matchMedia) == null ? void 0 : o.call(window, "(prefers-reduced-motion: reduce)");
    if (r === void 0) return;
    const a = () => i(r.matches);
    return r.addEventListener("change", a), () => r.removeEventListener("change", a);
  }, []), [n || t, (r) => {
    Re(_e, r), e(r);
  }, n];
}
const Tn = "" + new URL("assets/worklet-CT8dHE_F.js", import.meta.url).href, Pn = new URL(new URL("assets/dsp_core.wasm.json", import.meta.url).href).href, S = {
  carrierHz: { min: 20, max: 1500, def: 200 },
  beatHz: { min: 0.5, max: 40, def: 10 },
  gain: { min: 0, max: 0.85 },
  noiseLevel: { min: 0, max: 1 },
  rampSec: { min: 0.05, max: 30, def: 0.05 }
}, ne = 32, d = {
  carrierHz: 0,
  beatHz: 1,
  gain: 2,
  mode: 3,
  noiseKind: 4,
  noiseLevel: 5,
  rampSec: 6,
  reserved: 7,
  lofiLevel: 8,
  lofiWarmth: 9,
  crackle: 10,
  instLevel: 11,
  instKind: 12,
  instRootHz: 13,
  instScale: 14,
  instBpm: 15,
  padLevel: 16,
  padChord: 17,
  padRootHz: 18,
  chimeLevel: 19,
  chimeRatePerMin: 20,
  percLevel: 21,
  percBpm: 22,
  percPattern: 23,
  lofiProgression: 24,
  tapeWow: 25,
  pianoPedal: 26,
  breathDepth: 27,
  breathRateHz: 28,
  stereoWidth: 29,
  panDepth: 30,
  panRateHz: 31
}, xn = 4 + ne * 4;
function w(n, e, t, i) {
  return typeof n != "number" || !Number.isFinite(n) ? i : n < e ? e : n > t ? t : n;
}
const tt = (n, e = S.carrierHz.def) => w(n, S.carrierHz.min, S.carrierHz.max, e), nt = (n, e = S.beatHz.def) => w(n, S.beatHz.min, S.beatHz.max, e), it = (n, e = 0) => w(n, S.gain.min, S.gain.max, e), st = (n, e = 0) => w(n, S.noiseLevel.min, S.noiseLevel.max, e), rt = (n, e = S.rampSec.def) => w(n, S.rampSec.min, S.rampSec.max, e), v = U, L = (n, e) => w(n, v.level.min, v.level.max, e), X = (n, e = 0) => w(typeof n == "number" ? Math.round(n) : n, 0, v.enumMax, e), Ce = (n, e) => w(n, v.bpm.min, v.bpm.max, e);
function at(n) {
  const e = A, t = n ?? e;
  return {
    lofiLevel: L(t.lofiLevel, e.lofiLevel),
    lofiWarmth: L(t.lofiWarmth, e.lofiWarmth),
    crackle: L(t.crackle, e.crackle),
    instLevel: L(t.instLevel, e.instLevel),
    instKind: w(typeof t.instKind == "number" ? Math.round(t.instKind) : t.instKind, 0, v.instKindMax, e.instKind),
    instRootHz: w(t.instRootHz, v.instRootHz.min, v.instRootHz.max, e.instRootHz),
    instScale: X(t.instScale, e.instScale),
    instBpm: Ce(t.instBpm, e.instBpm),
    padLevel: L(t.padLevel, e.padLevel),
    padChord: X(t.padChord, e.padChord),
    padRootHz: w(t.padRootHz, v.padRootHz.min, v.padRootHz.max, e.padRootHz),
    chimeLevel: L(t.chimeLevel, e.chimeLevel),
    chimeRatePerMin: w(t.chimeRatePerMin, v.chimeRatePerMin.min, v.chimeRatePerMin.max, e.chimeRatePerMin),
    percLevel: L(t.percLevel, e.percLevel),
    percBpm: Ce(t.percBpm, e.percBpm),
    percPattern: X(t.percPattern, e.percPattern),
    lofiProgression: X(t.lofiProgression, e.lofiProgression),
    tapeWow: L(t.tapeWow, e.tapeWow),
    pianoPedal: L(t.pianoPedal, e.pianoPedal),
    breathDepth: L(t.breathDepth, e.breathDepth),
    breathRateHz: w(t.breathRateHz, v.breathRateHz.min, v.breathRateHz.max, e.breathRateHz),
    stereoWidth: L(t.stereoWidth, e.stereoWidth),
    panDepth: L(t.panDepth, e.panDepth),
    panRateHz: w(t.panRateHz, v.panRateHz.min, v.panRateHz.max, e.panRateHz)
  };
}
const ot = { binaural: 0, monaural: 1, isochronic: 2 }, ct = { off: 0, white: 1, pink: 2, brown: 3, violet: 4 };
function In(n, e) {
  e[d.lofiLevel] = n.lofiLevel, e[d.lofiWarmth] = n.lofiWarmth, e[d.crackle] = n.crackle, e[d.instLevel] = n.instLevel, e[d.instKind] = n.instKind, e[d.instRootHz] = n.instRootHz, e[d.instScale] = n.instScale, e[d.instBpm] = n.instBpm, e[d.padLevel] = n.padLevel, e[d.padChord] = n.padChord, e[d.padRootHz] = n.padRootHz, e[d.chimeLevel] = n.chimeLevel, e[d.chimeRatePerMin] = n.chimeRatePerMin, e[d.percLevel] = n.percLevel, e[d.percBpm] = n.percBpm, e[d.percPattern] = n.percPattern, e[d.lofiProgression] = n.lofiProgression, e[d.tapeWow] = n.tapeWow, e[d.pianoPedal] = n.pianoPedal, e[d.breathDepth] = n.breathDepth, e[d.breathRateHz] = n.breathRateHz, e[d.stereoWidth] = n.stereoWidth, e[d.panDepth] = n.panDepth, e[d.panRateHz] = n.panRateHz;
}
function On(n, e, t) {
  return t[d.carrierHz] = tt(n.carrierHz), t[d.beatHz] = nt(n.beatHz), t[d.gain] = it(n.gain), t[d.mode] = ot[n.mode] ?? 0, t[d.noiseKind] = ct[n.noise] ?? 0, t[d.noiseLevel] = st(n.noiseLevel), t[d.rampSec] = rt(e), t[d.reserved] = 0, In(at(n.layers), t), t;
}
function Be(n, e) {
  return {
    carrierHz: tt(n.carrierHz, e == null ? void 0 : e.carrierHz),
    beatHz: nt(n.beatHz, e == null ? void 0 : e.beatHz),
    noise: n.noise in ct ? n.noise : (e == null ? void 0 : e.noise) ?? "off",
    noiseLevel: st(n.noiseLevel, e == null ? void 0 : e.noiseLevel),
    mode: n.mode in ot ? n.mode : (e == null ? void 0 : e.mode) ?? "binaural",
    gain: it(n.gain, e == null ? void 0 : e.gain),
    ...n.layers !== void 0 ? { layers: at(n.layers) } : {}
  };
}
class Nn {
  constructor(e) {
    c(this, "seq");
    c(this, "data");
    this.seq = new Int32Array(e, 0, 1), this.data = new Float32Array(e, 4, ne);
  }
  write(e) {
    Atomics.add(this.seq, 0, 1);
    for (let t = 0; t < ne; t++) this.data[t] = e[t] ?? 0;
    Atomics.add(this.seq, 0, 1);
  }
}
const V = 8192, _n = V - 1, lt = 8, Cn = lt + V * 2 * 4;
function Bn(n) {
  return new SharedArrayBuffer(Cn);
}
class Dn {
  constructor(e) {
    c(this, "idx");
    c(this, "ring");
    this.idx = new Int32Array(e, 0, 2), this.ring = new Float32Array(e, lt, V * 2);
  }
  read(e) {
    const t = Atomics.load(this.idx, 0), i = Atomics.load(this.idx, 1);
    let s = t - i | 0;
    if (s <= 0) return 0;
    s > V && (s = V);
    const r = Math.min(s, e.length >> 1);
    let a = t - r | 0;
    for (let o = 0; o < r; o++) {
      const u = (a & _n) * 2;
      e[o * 2] = this.ring[u] ?? 0, e[o * 2 + 1] = this.ring[u + 1] ?? 0, a = a + 1 | 0;
    }
    return Atomics.store(this.idx, 1, t), r;
  }
}
const De = { read: () => 0 }, Z = 2, Fe = 0.3, Fn = 1e3;
class Kn {
  constructor() {
    c(this, "_status");
    c(this, "listeners", /* @__PURE__ */ new Set());
    c(this, "ctx", null);
    c(this, "node", null);
    c(this, "master", null);
    c(this, "writer", null);
    c(this, "tele", De);
    c(this, "voice", null);
    c(this, "startedAt", 0);
    c(this, "statsId", 0);
    c(this, "pending", /* @__PURE__ */ new Map());
    c(this, "pendingStart", null);
    c(this, "pendingStop", null);
    c(this, "block", new Float32Array(ne));
    this._status = {
      state: "idle",
      sampleRate: 0,
      usesSharedMemory: !1,
      crossOriginIsolated: typeof crossOriginIsolated == "boolean" && crossOriginIsolated
    };
  }
  get status() {
    return this._status;
  }
  get telemetry() {
    return this.tele;
  }
  onStatus(e) {
    return this.listeners.add(e), () => {
      this.listeners.delete(e);
    };
  }
  setStatus(e) {
    this._status = { ...this._status, ...e };
    for (const t of this.listeners) t(this._status);
  }
  async start(e) {
    if (this.pendingStop !== null && await this.pendingStop, this._status.state === "running") return;
    if (this.pendingStart !== null) return this.pendingStart;
    const t = this.doStart(e);
    return this.pendingStart = t.finally(() => {
      this.pendingStart = null;
    }), this.pendingStart;
  }
  async doStart(e) {
    this.setStatus({ state: "starting", error: void 0 });
    try {
      this.ctx === null && await this.build();
      const t = this.ctx;
      if (t === null || this.master === null) throw new Error("audio graph missing");
      this.voice = Be(e), this.pushVoice(this.voice, Z), this.startedAt = t.currentTime;
      const i = this.master.gain;
      i.cancelScheduledValues(t.currentTime), i.setValueAtTime(0, t.currentTime), i.linearRampToValueAtTime(1, t.currentTime + Z), await t.resume(), this.setStatus({ state: "running" });
    } catch (t) {
      this.setStatus({ state: "error", error: t instanceof Error ? t.message : String(t) });
    }
  }
  async build() {
    const e = new AudioContext({ latencyHint: "interactive" });
    this.ctx = e, await e.audioWorklet.addModule(Tn);
    const t = await fetch(Pn);
    if (!t.ok) throw new Error(`wasm fetch failed: ${t.status}`);
    const i = await t.arrayBuffer(), s = typeof SharedArrayBuffer < "u" && this._status.crossOriginIsolated, r = s ? new SharedArrayBuffer(xn) : void 0, a = s ? Bn() : void 0, o = new AudioWorkletNode(e, "zonked-dsp", { numberOfInputs: 0, outputChannelCount: [2] }), u = new Promise((f, b) => {
      o.port.onmessage = (y) => {
        const R = y.data;
        R.type === "ready" ? f() : R.type === "error" ? b(new Error(R.message ?? "worklet init failed")) : this.onWorkletMessage(y.data);
      };
    });
    o.port.postMessage({ type: "init", wasm: i, sab: r, tele: a, sampleRate: e.sampleRate }), await u, o.port.onmessage = (f) => this.onWorkletMessage(f.data);
    const m = e.createGain();
    m.gain.value = 0, o.connect(m).connect(e.destination), this.node = o, this.master = m, this.writer = r ? new Nn(r) : null, this.tele = a ? new Dn(a) : De, this.setStatus({ sampleRate: e.sampleRate, usesSharedMemory: s });
  }
  onWorkletMessage(e) {
    if (e.type === "stats") {
      const t = e.id, i = this.pending.get(t);
      if (!i) return;
      clearTimeout(i.timer), this.pending.delete(t), i.resolve({
        peak: Number(e.peak),
        rms: Number(e.rms),
        frames: Number(e.frames),
        nonZero: Number(e.nonZero)
      });
    } else e.type === "error" && this.setStatus({ state: "error", error: String(e.message) });
  }
  pushVoice(e, t) {
    var i;
    On(e, t, this.block), this.writer !== null ? this.writer.write(this.block) : (i = this.node) == null || i.port.postMessage({ type: "params", p: new Float32Array(this.block) });
  }
  setVoice(e, t) {
    this.voice = Be(e, this.voice ?? void 0);
    let i = rt(t ?? 0.05);
    this.ctx !== null && this.ctx.currentTime - this.startedAt < 2 * Z && (i = Math.max(i, Z)), this.pushVoice(this.voice, i);
  }
  stop() {
    if (this.pendingStop !== null) return this.pendingStop;
    if (this.pendingStart !== null) {
      const e = this.pendingStart;
      return this.pendingStop = e.then(() => this.doStop()).finally(() => {
        this.pendingStop = null;
      }), this.pendingStop;
    }
    return this.ctx === null || this._status.state !== "running" ? Promise.resolve() : (this.pendingStop = this.doStop().finally(() => {
      this.pendingStop = null;
    }), this.pendingStop);
  }
  async doStop() {
    var i;
    const e = this.ctx;
    if (e === null || this._status.state !== "running") return;
    this.setStatus({ state: "stopping" }), this.voice !== null && this.pushVoice({ ...this.voice, gain: 0 }, 0.1);
    const t = (i = this.master) == null ? void 0 : i.gain;
    t && (t.cancelScheduledValues(e.currentTime), t.setValueAtTime(t.value, e.currentTime), t.linearRampToValueAtTime(0, e.currentTime + Fe)), await new Promise((s) => setTimeout(s, Fe * 1e3 + 50));
    try {
      await e.suspend(), this.setStatus({ state: "stopped" });
    } catch (s) {
      this.setStatus({ state: "error", error: s instanceof Error ? s.message : String(s) });
    }
  }
  contextState() {
    return this.ctx === null ? "none" : this.ctx.state;
  }
  async resume() {
    const e = this.ctx;
    if (e === null || this._status.state !== "running") return !1;
    if (e.state === "running") return !0;
    try {
      await e.resume();
    } catch {
      return !1;
    }
    return e.state === "running";
  }
  getStats() {
    const e = { peak: 0, rms: 0, frames: 0, nonZero: 0 }, t = this.node;
    return t === null ? Promise.resolve(e) : new Promise((i) => {
      const s = ++this.statsId, r = setTimeout(() => {
        this.pending.delete(s), i(e);
      }, Fn);
      this.pending.set(s, { resolve: i, timer: r }), t.port.postMessage({ type: "stats-request", id: s });
    });
  }
}
function Wn() {
  return new Kn();
}
const Ke = 15, se = (n) => {
  const e = n.mediaSession;
  return e ?? void 0;
}, $n = [
  { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
  { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" }
], We = [
  "play",
  "pause",
  "stop",
  "nexttrack",
  "previoustrack",
  "seekforward",
  "seekbackward"
];
function qn(n, e) {
  switch (n) {
    case "play":
      return () => e.play();
    case "pause":
      return () => e.pause();
    case "stop":
      return () => e.stop();
    case "nexttrack":
      return e.next ? () => {
        var t;
        return (t = e.next) == null ? void 0 : t.call(e);
      } : null;
    case "previoustrack":
      return e.prev ? () => {
        var t;
        return (t = e.prev) == null ? void 0 : t.call(e);
      } : null;
    case "seekforward":
      return e.seekBy ? () => {
        var t;
        return (t = e.seekBy) == null ? void 0 : t.call(e, Ke);
      } : null;
    case "seekbackward":
      return e.seekBy ? () => {
        var t;
        return (t = e.seekBy) == null ? void 0 : t.call(e, -Ke);
      } : null;
    default:
      return null;
  }
}
function ut(n, e = navigator) {
  const t = se(e);
  if (!(t === void 0 || typeof MediaMetadata > "u"))
    try {
      t.metadata = new MediaMetadata({
        title: (n == null ? void 0 : n.name) ?? "Zonked",
        artist: "Zonked",
        album: (n == null ? void 0 : n.category) ?? "Acoustic recovery",
        artwork: $n
      });
    } catch {
    }
}
function $e(n, e, t = navigator) {
  const i = se(t);
  if (!(i === void 0 || typeof i.setPositionState != "function"))
    try {
      if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(e)) {
        i.setPositionState();
        return;
      }
      const s = Math.min(Math.max(0, e), n);
      i.setPositionState({ duration: n, position: s, playbackRate: 1 });
    } catch {
    }
}
function jn(n, e = navigator) {
  const t = se(e);
  if (t === void 0) return () => {
  };
  ut(null, e);
  for (const i of We)
    try {
      t.setActionHandler(i, qn(i, n));
    } catch {
    }
  return () => {
    var i;
    for (const s of We)
      try {
        t.setActionHandler(s, null);
      } catch {
      }
    try {
      t.metadata = null, (i = t.setPositionState) == null || i.call(t);
    } catch {
    }
  };
}
function Vn(n, e = navigator) {
  const t = se(e);
  t !== void 0 && (t.playbackState = n ? "playing" : "paused");
}
async function qe(n) {
  var t, i;
  if (!n.isPlaying()) return !1;
  const e = (i = (t = n.engine).contextState) == null ? void 0 : i.call(t);
  if (e !== "suspended" && e !== "interrupted" || n.engine.resume === void 0) return !1;
  try {
    await n.engine.resume();
  } catch {
  }
  return !0;
}
function Un(n) {
  const e = n.doc ?? (typeof document > "u" ? void 0 : document), t = n.win ?? (typeof window > "u" ? void 0 : window), i = () => {
    var a;
    const r = (e == null ? void 0 : e.hidden) === !0;
    (a = n.onVisibility) == null || a.call(n, r), qe(n);
  }, s = () => void qe(n);
  return e == null || e.addEventListener("visibilitychange", i), t == null || t.addEventListener("pageshow", s), t == null || t.addEventListener("pointerdown", s), t == null || t.addEventListener("keydown", s), () => {
    e == null || e.removeEventListener("visibilitychange", i), t == null || t.removeEventListener("pageshow", s), t == null || t.removeEventListener("pointerdown", s), t == null || t.removeEventListener("keydown", s);
  };
}
const je = "zonked.wakeLock";
class Yn {
  constructor(e = typeof navigator > "u" ? {} : navigator, t = null) {
    c(this, "sentinel", null);
    c(this, "enabled");
    c(this, "playing", !1);
    c(this, "hidden", !1);
    c(this, "pendingRequest", !1);
    this.nav = e, this.storage = t, this.enabled = this.readPref();
  }
  get supported() {
    return this.nav.wakeLock !== void 0 && this.nav.wakeLock !== null;
  }
  get isEnabled() {
    return this.enabled;
  }
  get held() {
    return this.sentinel !== null;
  }
  /** User toggle. Persists the preference and applies it right away. */
  async setEnabled(e) {
    var t;
    this.enabled = e;
    try {
      (t = this.storage) == null || t.setItem(je, e ? "1" : "0");
    } catch {
    }
    await this.sync();
  }
  /** Call on play (true) and stop (false). */
  async setPlaying(e) {
    this.playing = e, await this.sync();
  }
  /** Call from visibilitychange. The browser drops the lock when hidden, so re-acquire on visible. */
  async setHidden(e) {
    this.hidden = e, await this.sync();
  }
  async dispose() {
    this.playing = !1, await this.sync();
  }
  wanted() {
    return this.enabled && this.playing && !this.hidden && this.supported;
  }
  async sync() {
    var e;
    if (!this.wanted()) {
      await this.release();
      return;
    }
    if (!(this.sentinel !== null || this.pendingRequest)) {
      this.pendingRequest = !0;
      try {
        const t = await this.nav.wakeLock.request("screen");
        this.wanted() ? (this.sentinel = t, (e = t.addEventListener) == null || e.call(t, "release", () => {
          this.sentinel === t && (this.sentinel = null);
        })) : await t.release().catch(() => {
        });
      } catch {
      } finally {
        this.pendingRequest = !1;
      }
    }
  }
  async release() {
    const e = this.sentinel;
    if (this.sentinel = null, e !== null)
      try {
        await e.release();
      } catch {
      }
  }
  readPref() {
    var e;
    try {
      return ((e = this.storage) == null ? void 0 : e.getItem(je)) === "1";
    } catch {
      return !1;
    }
  }
}
const Gn = ["favorites", "milestones"], Xn = "zonked", I = "scripts", O = "logs", z = "mixes", N = "records", Zn = 2, Ee = 80, B = (n) => typeof n == "number" && Number.isFinite(n);
function Ve(n) {
  if (typeof n != "object" || n === null) return !1;
  const e = n;
  return B(e.id) && typeof e.name == "string" && e.name.length >= 1 && e.name.length <= Ee && typeof e.text == "string" && e.text.length <= H.maxBytes && B(e.updatedAt);
}
function Jn(n) {
  if (typeof n != "object" || n === null) return !1;
  const e = n;
  return B(e.id) && B(e.startedAt) && B(e.endedAt) && B(e.peakScore) && typeof e.presetId == "string" && e.presetId.length <= Ee;
}
function Qn(n) {
  const e = { id: n.id, startedAt: n.startedAt, endedAt: n.endedAt, peakScore: n.peakScore, presetId: n.presetId }, t = n, i = t.endKind, s = t.breaks;
  return {
    ...e,
    ...i === "manual" || i === "countdown" || i === "sleep-fade" ? { endKind: i } : {},
    ...B(s) && s >= 0 && s <= 1e3 ? { breaks: Math.floor(s) } : {}
  };
}
function x(n) {
  return new Promise((e, t) => {
    n.onsuccess = () => e(n.result), n.onerror = () => t(n.error ?? new Error("IndexedDB request failed"));
  });
}
function C(n) {
  return new Promise((e, t) => {
    n.oncomplete = () => e(), n.onerror = () => t(n.error ?? new Error("IndexedDB transaction failed")), n.onabort = () => t(n.error ?? new Error("IndexedDB transaction aborted"));
  });
}
function ei(n) {
  return new Promise((e, t) => {
    const i = n.open(Xn, Zn);
    i.onupgradeneeded = () => {
      const s = i.result, r = (a) => s.objectStoreNames.contains(a);
      r(I) || s.createObjectStore(I, { keyPath: "id", autoIncrement: !0 }), r(O) || s.createObjectStore(O, { keyPath: "id", autoIncrement: !0 }), r(z) || s.createObjectStore(z, { keyPath: "id" }), r(N) || s.createObjectStore(N);
    }, i.onsuccess = () => e(i.result), i.onerror = () => t(i.error ?? new Error("IndexedDB open failed")), i.onblocked = () => t(new Error("IndexedDB open blocked"));
  });
}
function dt(n, e) {
  if (e.length > H.maxBytes) throw new RangeError("Script exceeds 256 KB");
  const t = n.trim().slice(0, Ee);
  return t.length > 0 ? t : "Untitled";
}
function ti() {
  let n = 1;
  const e = [], t = [], i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  return {
    persistent: () => Promise.resolve(!1),
    saveScript(r, a) {
      var f;
      const o = dt(r, a), u = { id: ((f = e.find((b) => b.name === o)) == null ? void 0 : f.id) ?? n++, name: o, text: a, updatedAt: Date.now() }, m = e.findIndex((b) => b.id === u.id);
      return m >= 0 ? e[m] = u : e.push(u), Promise.resolve(u);
    },
    listScripts: () => Promise.resolve([...e].sort((r, a) => a.updatedAt - r.updatedAt)),
    deleteScript(r) {
      const a = e.findIndex((o) => o.id === r);
      return a >= 0 && e.splice(a, 1), Promise.resolve();
    },
    addLog(r) {
      return t.push({ ...r, id: n++ }), Promise.resolve();
    },
    listLogs: (r = 50) => Promise.resolve([...t].sort((a, o) => o.startedAt - a.startedAt).slice(0, r)),
    listMixes: () => Promise.resolve([...i.values()].sort((r, a) => a.updatedAt - r.updatedAt)),
    putMix(r) {
      return i.size >= be && !i.has(r.id) ? Promise.reject(new RangeError("Too many mixes")) : (i.set(r.id, r), Promise.resolve());
    },
    deleteMix(r) {
      return i.delete(r), Promise.resolve();
    },
    getRecord: (r) => Promise.resolve(s.get(r)),
    setRecord(r, a) {
      return s.set(r, a), Promise.resolve();
    },
    clearSanctuary() {
      return i.clear(), s.clear(), t.length = 0, Promise.resolve();
    }
  };
}
function ni(n = globalThis.indexedDB) {
  const e = ti();
  if (n === void 0) return e;
  let t = null;
  const i = () => (t ?? (t = ei(n).catch(() => null)), t);
  return {
    persistent: async () => await i() !== null,
    async saveScript(s, r) {
      const a = await i();
      if (a === null) return e.saveScript(s, r);
      const o = dt(s, r), u = a.transaction(I, "readwrite"), m = u.objectStore(I), b = (await x(m.getAll())).filter(Ve).find((ae) => ae.name === o), y = { name: o, text: r, updatedAt: Date.now() }, R = await x(m.put(b ? { ...y, id: b.id } : y));
      return await C(u), { ...y, id: Number(R) };
    },
    async listScripts() {
      const s = await i();
      return s === null ? e.listScripts() : (await x(s.transaction(I).objectStore(I).getAll())).filter(Ve).sort((a, o) => o.updatedAt - a.updatedAt);
    },
    async deleteScript(s) {
      const r = await i();
      if (r === null) return e.deleteScript(s);
      const a = r.transaction(I, "readwrite");
      a.objectStore(I).delete(s), await C(a);
    },
    async addLog(s) {
      const r = await i();
      if (r === null) return e.addLog(s);
      const a = r.transaction(O, "readwrite");
      a.objectStore(O).add({ ...s }), await C(a);
    },
    async listLogs(s = 50) {
      const r = await i();
      return r === null ? e.listLogs(s) : (await x(r.transaction(O).objectStore(O).getAll())).filter(Jn).map(Qn).sort((o, u) => u.startedAt - o.startedAt).slice(0, s);
    },
    async listMixes() {
      const s = await i();
      if (s === null) return e.listMixes();
      const r = await x(s.transaction(z).objectStore(z).getAll()), a = Date.now();
      return r.map((o) => zn(o, a)).filter((o) => o !== null).sort((o, u) => u.updatedAt - o.updatedAt).slice(0, be);
    },
    async putMix(s) {
      const r = await i();
      if (r === null) return e.putMix(s);
      const a = r.transaction(z, "readwrite"), o = a.objectStore(z), u = await x(o.count()), m = await x(o.getKey(s.id)) !== void 0;
      if (u >= be && !m)
        throw a.abort(), new RangeError("Too many mixes");
      o.put(s), await C(a);
    },
    async deleteMix(s) {
      const r = await i();
      if (r === null) return e.deleteMix(s);
      const a = r.transaction(z, "readwrite");
      a.objectStore(z).delete(s), await C(a);
    },
    async getRecord(s) {
      const r = await i();
      return r === null || !Gn.includes(s) ? e.getRecord(s) : await x(r.transaction(N).objectStore(N).get(s));
    },
    async setRecord(s, r) {
      const a = await i();
      if (a === null) return e.setRecord(s, r);
      const o = a.transaction(N, "readwrite");
      o.objectStore(N).put(r, s), await C(o);
    },
    async clearSanctuary() {
      const s = await i();
      if (s === null) return e.clearSanctuary();
      const r = s.transaction([z, N, O], "readwrite");
      r.objectStore(z).clear(), r.objectStore(N).clear(), r.objectStore(O).clear(), await C(r);
    }
  };
}
const ii = 5, si = (n) => Lt(n);
let J = null;
const ri = () => Le(Hn);
function ai(n, e, t) {
  jn({
    // A lock-screen play only resumes after the notice was accepted once.
    play: () => {
      ri() && !n.snapshot().playing && n.play();
    },
    pause: () => void n.stop(),
    stop: () => void n.stop(),
    seekBy: (s) => n.seekBy(s)
  }), Un({
    engine: e,
    isPlaying: () => n.snapshot().playing,
    onVisibility: (s) => void t.setHidden(s)
  });
  let i = "";
  n.subscribe((s) => {
    const r = Math.floor(s.elapsedSec / ii), a = `${String(s.playing)}|${s.templateId ?? ""}|${s.timer.kind}|${s.timer.phase}|${String(r)}`;
    if (a === i) return;
    i = a, Vn(s.playing), ut(s.templateName === null ? null : { name: s.templateName, category: s.templateCategory ?? "" });
    const o = n.positionState();
    o === null ? $e(0, 0) : $e(o.durationSec, o.positionSec), t.setPlaying(s.playing);
  });
}
function re() {
  if (J !== null) return J;
  const n = Wn(), e = ni(), t = new fn(n, on, (s) => void e.addLog(s).catch(() => {
  }), { toEvents: si }), i = new Yn(void 0, An());
  return ai(t, n, i), J = { engine: n, player: t, store: e }, J;
}
const Si = () => re().engine.getStats(), ki = () => re().engine.status.state, oi = 5, ci = 600;
function $(n, e, t) {
  return Math.min(t, Math.max(e, n));
}
function pe(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
function li(n) {
  return n < 40 ? "focus" : n < 60 ? "flow" : n < 80 ? "recovery" : "decompress";
}
function ht(n) {
  if (!pe(n) || n.version !== 1) return null;
  const e = n.burnout, t = n.target;
  if (!pe(e) || !pe(t)) return null;
  const i = e.score, s = t.beatHz, r = t.carrierHz, a = t.gain, o = t.transitionSec;
  if (![i, s, r, a, o].every((R) => typeof R == "number" && Number.isFinite(R)))
    return null;
  const u = $(i, 0, 100), m = li(u), f = t.presetId, b = n.sbg, y = n.at;
  return {
    version: 1,
    at: typeof y == "number" && Number.isFinite(y) ? Math.trunc(y) : 0,
    burnout: { score: u, level: m },
    target: {
      ...typeof f == "string" && f.length > 0 && f.length <= 64 ? { presetId: f } : {},
      beatHz: $(s, l.beatMin, l.beatMax),
      carrierHz: $(r, l.carrierMin, l.carrierMax),
      gain: $(a, l.gainMin, l.gainMax),
      transitionSec: $(o, oi, ci),
      breathe: t.breathe === !0
    },
    sbg: typeof b == "string" && b.length <= H.maxBytes ? b : null
  };
}
const ui = "http://localhost:43210/events", di = 7e4, hi = 1e3, pi = 3e4, ye = "zonked.crew.v1", Me = /* @__PURE__ */ new Set();
function pt() {
  try {
    if (typeof location < "u" && new URLSearchParams(location.search).get("crew") === "1")
      return Re(ye, !0), !0;
  } catch {
  }
  return Le(ye);
}
function Li(n) {
  Re(ye, n);
  for (const e of [...Me])
    try {
      e(n);
    } catch {
    }
}
function mt(n) {
  return Me.add(n), () => {
    Me.delete(n);
  };
}
function mi(n) {
  const e = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  return Math.min(pi, hi * 2 ** Math.min(e, 10));
}
function fi(n) {
  return typeof EventSource > "u" ? null : new EventSource(n);
}
class Ri {
  constructor(e) {
    c(this, "es", null);
    c(this, "timer", null);
    c(this, "attempt", 0);
    c(this, "stopped", !0);
    c(this, "wanted", !1);
    c(this, "unsub", null);
    c(this, "status", "standalone");
    this.deps = e;
  }
  getStatus() {
    return this.status;
  }
  /** Marks the client as running. It connects only while crew is enabled. */
  start() {
    this.wanted || (this.wanted = !0, this.unsub = mt(() => this.sync()), this.sync());
  }
  stop() {
    var e;
    this.wanted = !1, (e = this.unsub) == null || e.call(this), this.unsub = null, this.sync();
  }
  isEnabled() {
    return this.deps.enabled ? this.deps.enabled() : this.deps.create !== void 0 || pt();
  }
  sync() {
    const e = this.wanted && this.isEnabled();
    e && this.stopped ? (this.stopped = !1, this.attempt = 0, this.connect()) : !e && !this.stopped && (this.stopped = !0, this.clearTimer(), this.closeSource(), this.setStatus("standalone"));
  }
  connect() {
    if (this.stopped) return;
    const e = this.deps.create ?? fi;
    let t = null;
    try {
      t = e(this.deps.url ?? ui);
    } catch {
      t = null;
    }
    if (t === null) {
      this.scheduleRetry();
      return;
    }
    this.es = t, t.addEventListener("open", () => {
      this.es === t && (this.attempt = 0, this.setStatus("connected"));
    }), t.addEventListener("state", (i) => {
      this.es === t && this.handleState(i.data);
    }), t.addEventListener("error", () => {
      this.es === t && (this.closeSource(), this.setStatus("standalone"), this.scheduleRetry());
    });
  }
  handleState(e) {
    if (typeof e != "string" || e.length > di) return;
    let t;
    try {
      t = JSON.parse(e);
    } catch {
      return;
    }
    const i = ht(t);
    if (i !== null)
      try {
        this.deps.onState(i);
      } catch {
      }
  }
  scheduleRetry() {
    if (this.stopped) return;
    const e = mi(this.attempt);
    this.attempt += 1;
    const t = this.deps.setTimer ?? ((i, s) => setTimeout(i, s));
    this.timer = t(() => {
      this.timer = null, this.connect();
    }, e);
  }
  clearTimer() {
    if (this.timer === null) return;
    (this.deps.clearTimer ?? ((t) => clearTimeout(t)))(this.timer), this.timer = null;
  }
  closeSource() {
    const e = this.es;
    this.es = null;
    try {
      e == null || e.close();
    } catch {
    }
  }
  setStatus(e) {
    if (this.status !== e) {
      this.status = e;
      try {
        this.deps.onStatus(e);
      } catch {
      }
    }
  }
}
const gi = "/apps/zonked/api/state", bi = 15e3;
let we = null, Ue = null, ie = "standalone", Se = "";
const ke = /* @__PURE__ */ new Set(), Ei = () => ie;
function zi(n) {
  return ke.add(n), () => void ke.delete(n);
}
function ft(n) {
  if (n !== ie) {
    ie = n;
    for (const e of [...ke]) e(n);
  }
}
function me() {
  ie === "connected" && re().player.crewLost(), Se = "", ft("standalone");
}
async function fe() {
  if (we === null || !pt()) return me();
  try {
    const n = await we.get(gi), e = ht(n.crew);
    if (e === null) return me();
    ft("connected");
    const t = JSON.stringify([e.burnout, e.target]);
    if (t === Se) return;
    Se = t, re().player.applyCrew(e);
  } catch {
    me();
  }
}
function vi(n) {
  we = n, Ue === null && (Ue = setInterval(() => void fe(), bi), mt(() => void fe()), fe());
}
function Hi() {
  const n = vt.useAppApi, e = n === void 0 ? null : n();
  Ye(() => {
    e !== null && vi(e);
  }, [e]);
}
export {
  Ri as B,
  Hn as S,
  pt as a,
  _ as b,
  Qe as c,
  Hi as d,
  Ei as e,
  p as f,
  re as g,
  zi as h,
  ri as i,
  ki as j,
  Si as k,
  T as n,
  mt as o,
  Li as s,
  wi as u,
  Re as w
};
