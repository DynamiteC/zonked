var At = Object.defineProperty;
var Tt = (t, e, n) => e in t ? At(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e, n) => Tt(t, typeof e != "symbol" ? e + "" : e, n);
import * as Ht from "@kirocrew/app-sdk";
import { useState as Ie, useEffect as it } from "react";
const Z = {
  level: { min: 0, max: 1 },
  instRootHz: { min: 55, max: 880 },
  padRootHz: { min: 55, max: 440 },
  bpm: { min: 30, max: 180 },
  chimeRatePerMin: { min: 1, max: 30 },
  breathRateHz: { min: 0.05, max: 0.2 },
  panRateHz: { min: 0.02, max: 0.2 },
  enumMax: 7,
  instKindMax: 3
}, H = Object.freeze({
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
}), T = {
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
}, zt = 200, Ct = 10, Nt = 0.5, Pt = 0.3, v = (t, e, n) => Number.isFinite(t) ? Math.min(n, Math.max(e, t)) : e, L = (t) => v(t, Z.level.min, Z.level.max), U = (t, e) => Math.round(v(t, 0, e));
function Ot(t) {
  const e = { ...H, ...t }, n = Z;
  return {
    lofiLevel: L(e.lofiLevel),
    lofiWarmth: L(e.lofiWarmth),
    crackle: L(e.crackle),
    instLevel: L(e.instLevel),
    instKind: U(e.instKind, n.instKindMax),
    instRootHz: v(e.instRootHz, n.instRootHz.min, n.instRootHz.max),
    instScale: U(e.instScale, n.enumMax),
    instBpm: v(e.instBpm, n.bpm.min, n.bpm.max),
    padLevel: L(e.padLevel),
    padChord: U(e.padChord, n.enumMax),
    padRootHz: v(e.padRootHz, n.padRootHz.min, n.padRootHz.max),
    chimeLevel: L(e.chimeLevel),
    chimeRatePerMin: v(e.chimeRatePerMin, n.chimeRatePerMin.min, n.chimeRatePerMin.max),
    percLevel: L(e.percLevel),
    percBpm: v(e.percBpm, n.bpm.min, n.bpm.max),
    percPattern: U(e.percPattern, n.enumMax),
    lofiProgression: U(e.lofiProgression, n.enumMax),
    tapeWow: L(e.tapeWow),
    pianoPedal: L(e.pianoPedal),
    breathDepth: L(e.breathDepth),
    breathRateHz: v(e.breathRateHz, n.breathRateHz.min, n.breathRateHz.max),
    stereoWidth: L(e.stereoWidth),
    panDepth: L(e.panDepth),
    panRateHz: v(e.panRateHz, n.panRateHz.min, n.panRateHz.max)
  };
}
function _e(t, e, n) {
  return {
    tSec: e,
    voice: {
      carrierHz: v(t.carrierHz, l.carrierMin, l.carrierMax),
      beatHz: v(t.beatHz, l.beatMin, l.beatMax),
      noise: t.noise,
      noiseLevel: v(t.noiseLevel, l.noiseMin, l.noiseMax),
      mode: t.mode,
      gain: v(t.gain, l.gainMin, l.gainMax),
      layers: Ot(t.layers)
    },
    ramp: t.ramp,
    line: n
  };
}
function xt(t) {
  let n = 0;
  const s = t.stages.slice(0, 499).map((o, a) => {
    const u = Number.isFinite(o.atMin) ? o.atMin * 60 : 0;
    return n = v(Math.max(n, u), 0, l.maxTimeSec), _e(o, n, a + 1);
  }), i = t.stages[Math.min(t.stages.length, 499) - 1];
  if (i === void 0) return s;
  const r = v(Math.max(n, t.recommendedMinutes * 60), 0, l.maxTimeSec);
  return s.push(_e({ ...i, ramp: !1 }, r, s.length + 1)), s;
}
function It(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const s = t.charCodeAt(n);
    if (s < 128) e += 1;
    else if (s < 2048) e += 2;
    else if (s >= 55296 && s <= 56319 && n + 1 < t.length) {
      const i = t.charCodeAt(n + 1);
      i >= 56320 && i <= 57343 ? (e += 4, n++) : e += 3;
    } else e += 3;
  }
  return e;
}
function _t(t) {
  return t === 32 || t === 9 || t === 11 || t === 12 || t === 160;
}
function Bt(t) {
  const e = [];
  let n = -1;
  for (let s = 0; s < t.length; s++) {
    const i = t.charCodeAt(s);
    if (i === 35)
      return n >= 0 && e.push(t.slice(n, s)), e;
    _t(i) ? (n >= 0 && e.push(t.slice(n, s)), n = -1) : n < 0 && (n = s);
  }
  return n >= 0 && e.push(t.slice(n)), e;
}
function Dt(t) {
  const e = [];
  let n = t.charCodeAt(0) === 65279 ? 1 : 0, s = 1, i = n;
  const r = (o) => {
    const a = o - i;
    if (a > T.maxLineLength)
      e.push({ line: s, tokens: [], tooLong: !0 });
    else if (a > 0) {
      const u = Bt(t.slice(i, o));
      u.length > 0 && e.push({ line: s, tokens: u, tooLong: !1 });
    }
  };
  for (; n < t.length; n++) {
    const o = t.charCodeAt(n);
    (o === 10 || o === 13) && (r(n), o === 13 && t.charCodeAt(n + 1) === 10 && n++, s++, i = n + 1);
  }
  return r(t.length), e;
}
const Ft = {
  carrierHz: 200,
  beatHz: 10,
  noise: "off",
  noiseLevel: 0,
  mode: "binaural",
  gain: 0
};
function V(t, e, n) {
  return t < e ? e : t > n ? n : t;
}
function $t(t, e) {
  const n = Number.isFinite(e) ? e : 0;
  let s = 0, i = t.length - 1, r = -1;
  for (; s <= i; ) {
    const o = s + i >> 1, a = t[o];
    a !== void 0 && a.tSec <= n ? (r = o, s = o + 1) : i = o - 1;
  }
  return r;
}
function rt(t) {
  const e = t[t.length - 1];
  return e === void 0 ? 0 : e.tSec;
}
function Y(t, e, n) {
  return t + (e - t) * n;
}
const Wt = /* @__PURE__ */ new Set(["instKind", "instScale", "padChord", "percPattern", "lofiProgression"]);
function Kt(t, e, n) {
  if (t === void 0 && e === void 0) return;
  const s = t ?? H, i = e ?? H, r = {};
  for (const o of Object.keys(H))
    r[o] = Wt.has(o) ? n >= 1 ? i[o] : s[o] : Y(s[o], i[o], n);
  return r;
}
function Ut(t, e, n) {
  const s = Kt(t.layers, e.layers, n);
  return {
    carrierHz: V(Y(t.carrierHz, e.carrierHz, n), l.carrierMin, l.carrierMax),
    beatHz: V(Y(t.beatHz, e.beatHz, n), l.beatMin, l.beatMax),
    noise: t.noise === "off" ? e.noise : t.noise,
    noiseLevel: V(Y(t.noiseLevel, e.noiseLevel, n), l.noiseMin, l.noiseMax),
    mode: t.mode,
    gain: V(Y(t.gain, e.gain, n), l.gainMin, l.gainMax),
    ...s !== void 0 ? { layers: s } : {}
  };
}
function he(t, e) {
  const n = $t(t, e), s = t[Math.max(0, n)];
  if (s === void 0) return Ft;
  const i = t[n + 1];
  if (n < 0 || !s.ramp || i === void 0) return s.voice;
  const r = Number.isFinite(e) ? e : 0, o = i.tSec - s.tSec;
  return o > 0 ? Ut(s.voice, i.voice, V((r - s.tSec) / o, 0, 1)) : i.voice;
}
const qt = /^[+-]?[0-9]{1,15}(?:\.[0-9]{1,15})?$/, jt = /^[0-9]{1,2}:[0-9]{1,2}(?::[0-9]{1,2})?$/, Vt = /^[A-Za-z_][A-Za-z0-9_-]{0,31}$/, Be = 24;
function W(t) {
  return t.length > Be ? `${t.slice(0, Be)}...` : t;
}
function g(t, e, n, s) {
  n === "error" && t.errors++, t.diags.length < l.maxDiagnostics ? t.diags.push({ line: e, severity: n, message: s }) : t.diags.length === l.maxDiagnostics && t.diags.push({ line: e, severity: "warning", message: "Too many diagnostics, further messages dropped" });
}
function se(t) {
  if (!qt.test(t)) return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function ie(t, e, n, s, i, r) {
  if (s >= i && s <= r) return s;
  const o = s < i ? i : r;
  return g(t, e, "warning", `${n} ${s} out of range, clamped to ${o}`), o;
}
function ot(t) {
  switch (t.toLowerCase()) {
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
function Yt(t) {
  const e = t.toLowerCase();
  return e === "pink" || e === "white" || e === "brown" || e === "violet" ? e : null;
}
function Gt(t, e, n, s) {
  const i = n.indexOf("/"), r = i < 0 ? n : n.slice(0, i);
  let o = -1;
  for (let C = 0; C < r.length && o < 0; C++) {
    const xe = r[C];
    (xe === "@" || xe === "+" && C > 0) && (o = C);
  }
  const a = o < 0 ? r : r.slice(0, o), u = o < 0 ? "" : r.slice(o + 1), m = a === "" ? null : se(a), y = u === "" ? null : se(u), f = i < 0 ? null : se(n.slice(i + 1)), w = a !== "" && m === null, P = o >= 0 && y === null, z = i >= 0 && f === null;
  return w || P || z || r === "" ? !1 : (m !== null && (s.carrier = ie(t, e, "carrier", m, l.carrierMin, l.carrierMax)), y !== null && (s.beat = ie(t, e, "beat", y, l.beatMin, l.beatMax)), f !== null && (s.gain = ie(t, e, "gain", f, l.gainMin, l.gainMax)), !0);
}
function Zt(t, e, n, s) {
  const i = n.indexOf("/"), r = Yt(i < 0 ? n : n.slice(0, i));
  if (r === null) return !1;
  let o = Pt;
  if (i >= 0) {
    const a = se(n.slice(i + 1));
    if (a === null) return !1;
    o = ie(t, e, "noise level", a / 100, l.noiseMin, l.noiseMax);
  }
  return s.noise = r, s.noiseLevel = o, !0;
}
function Xt(t, e, n, s) {
  const i = ot(n);
  if (i !== null) s.mode = i;
  else {
    if (Zt(t, e, n, s)) return;
    Gt(t, e, n, s) || g(t, e, "warning", `Unknown token "${W(n)}" skipped`);
  }
}
function Jt(t, e) {
  const s = !(e.carrier !== void 0 || e.beat !== void 0 || e.gain !== void 0) && e.noise !== void 0;
  return {
    carrierHz: e.carrier ?? zt,
    beatHz: e.beat ?? Ct,
    noise: e.noise ?? "off",
    noiseLevel: e.noiseLevel ?? 0,
    mode: e.mode ?? t.mode,
    gain: s ? 0 : e.gain ?? Nt
  };
}
function Qt(t, e) {
  const n = e.tokens[0] ?? "", s = n.indexOf(":"), i = n.slice(0, s), r = e.tokens.slice(1);
  if (s < n.length - 1 && r.unshift(n.slice(s + 1)), i.toLowerCase() === "mode") {
    const a = r[0] === void 0 ? null : ot(r[0]);
    a === null ? g(t, e.line, "warning", "mode expects iso, mono or bin; ignored") : t.mode = a;
    return;
  }
  if (!Vt.test(i)) {
    g(t, e.line, "warning", `Invalid tone-set name "${W(i)}", line skipped`);
    return;
  }
  const o = {};
  for (const a of r) Xt(t, e.line, a, o);
  r.length === 0 && g(t, e.line, "warning", `Tone-set "${i}" has no parameters, defaults used`), t.defs.set(i, Jt(t, o));
}
function en(t) {
  if (t === "NOW") return 0;
  if (!jt.test(t)) return null;
  const e = t.split(":").map(Number), [n = 0, s = 0, i = 0] = e.length === 2 ? [e[0], e[1], 0] : e;
  return s > 59 || i > 59 ? null : n * 3600 + s * 60 + i;
}
function tn(t, e) {
  const [n = "", s, ...i] = e.tokens, r = en(n);
  if (r === null) return g(t, e.line, "error", `Invalid time "${W(n)}", expected HH:MM:SS`);
  if (r > l.maxTimeSec) return g(t, e.line, "error", "Time exceeds 24 hours");
  if (r < t.lastT) return g(t, e.line, "error", "Times must not decrease");
  if (s === void 0) return g(t, e.line, "warning", "Sequence line has no tone-set name, skipped");
  let o = s, a = !1;
  o.endsWith("->") && (a = !0, o = o.slice(0, -2));
  for (const m of i)
    m === "->" && !a ? a = !0 : g(t, e.line, "warning", `Unknown token "${W(m)}" skipped`);
  const u = t.defs.get(o);
  if (u === void 0) return g(t, e.line, "warning", `Unknown tone-set "${W(o)}", line skipped`);
  if (t.events.length >= T.maxEvents)
    return t.stop = !0, g(t, e.line, "error", `More than ${T.maxEvents} events, parsing stopped`);
  t.lastT = r, t.events.push({ tSec: r, voice: u, ramp: a, line: e.line });
}
function nn(t) {
  return t === "NOW" || t.charCodeAt(0) >= 48 && t.charCodeAt(0) <= 57 && t.includes(":");
}
function sn(t, e) {
  const n = e.tokens[0] ?? "";
  nn(n) ? tn(t, e) : n.includes(":") ? Qt(t, e) : g(t, e.line, "warning", `Unknown token "${W(n)}", line skipped`);
}
function pe(t) {
  return {
    events: t.events,
    durationSec: rt(t.events),
    diagnostics: t.diags,
    ok: t.errors === 0
  };
}
function rn() {
  return { diags: [], errors: 0, defs: /* @__PURE__ */ new Map(), mode: "binaural", events: [], lastT: 0, stop: !1 };
}
function J(t) {
  const e = rn();
  try {
    if (typeof t != "string")
      return g(e, 1, "error", "Input must be a string"), pe(e);
    if (t.length > T.maxBytes || It(t) > T.maxBytes)
      return g(e, 1, "error", `Input exceeds ${T.maxBytes} bytes, not parsed`), pe(e);
    for (const n of Dt(t))
      if (n.tooLong ? g(e, n.line, "error", `Line longer than ${T.maxLineLength} characters`) : sn(e, n), e.stop) break;
    e.events.length === 0 && e.errors === 0 && g(e, 1, "warning", "No sequence events found");
  } catch (n) {
    g(e, 1, "error", `Internal parser error: ${n instanceof Error ? n.message : "unknown"}`);
  }
  return pe(e);
}
const on = `# Deep Focus: 40 Hz gamma binaural beat on a 200 Hz carrier.
mode: bin
focus: 200+40/0.4
00:00:00 focus
`, an = `# Flow State: 18 Hz beta on a 220 Hz carrier.
mode: bin
flow: 220+18/0.4
00:00:00 flow
`, cn = `# AI Burnout Reset: 10 Hz alpha glides to 6 Hz theta over 20 minutes,
# with a soft pink noise bed. Gain stays low for tired ears.
mode: bin
alpha: 200+10/0.35 pink/15
theta: 200+6/0.35 pink/20
00:00:00 alpha ->
00:20:00 theta
`, ln = `# Breathwork Sync: 5.5 Hz theta, 5.5 breaths per minute.
mode: bin
breathe: 180+5.5/0.4
00:00:00 breathe
`, un = `# Deep Rest: 2.5 Hz delta on a low 150 Hz carrier.
mode: bin
rest: 150+2.5/0.35 brown/10
00:00:00 rest
`, dn = `# ts - SBaGen style demo sequence, 1998 vintage.
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
`, Se = [
  {
    id: "deep-focus",
    name: "Deep Focus",
    description: "40 Hz gamma beat for concentrated work.",
    sbg: on
  },
  {
    id: "flow-state",
    name: "Flow State",
    description: "18 Hz beta beat for steady, engaged flow.",
    sbg: an
  },
  {
    id: "burnout-reset",
    name: "AI Burnout Reset",
    description: "10 Hz alpha gliding to 6 Hz theta over 20 minutes with soft pink noise.",
    sbg: cn
  },
  {
    id: "breathwork-sync",
    name: "Breathwork Sync",
    description: "5.5 Hz theta with a 6-breath guided pacer at 5.5 breaths per minute.",
    sbg: ln,
    breath: { inSec: 5.45, outSec: 5.45 }
  },
  {
    id: "deep-rest",
    name: "Deep Rest",
    description: "2.5 Hz delta beat for deep rest.",
    sbg: un
  },
  {
    id: "classic-1998",
    name: "Classic 1998 SBaGen Demo",
    description: "A 15 minute SBaGen-style demo with timed ramps.",
    sbg: dn
  }
], Vs = {
  brand: "Zonked",
  promise: "Free. Private. No account.",
  welcomeTitle: "Calm sound, made for you.",
  welcomeBody: "A few quick questions. Then your first sound.",
  skip: "Skip, just play",
  back: "Back",
  next: "Next",
  start: "Start",
  stop: "Stop",
  pause: "Pause",
  play: "Play",
  done: "Done",
  notThisOne: "Not this one",
  goalTitle: "What brings you here?",
  whenTitle: "When do you need it most?",
  listenTitle: "How do you listen?",
  listenNote: "Headphones suit two-tone beats best, and speakers suit gentle pulses and noise.",
  stepOf: (t) => `${t} of 3`,
  selected: "Selected",
  playAgain: "Play again",
  close: "Close",
  endTitle: "Done for now.",
  endLine: (t, e) => `${t} played for ${e < 1 ? "under a minute" : e === 1 ? "1 minute" : `${e} minutes`}.`,
  endNote: "Go at your own pace.",
  starterTitle: "Pick a starter sound",
  preview: "Preview",
  previewing: "Playing a short preview",
  safetyTitle: "Before you start",
  safetyLines: [
    "Use stereo headphones for the best effect.",
    "Keep the volume low.",
    "Zonked fades in slowly.",
    "Zonked is not a medical device.",
    "Stop any time.",
    "Stop if anything feels uncomfortable."
  ],
  safetyAccept: "I understand, start",
  notMedical: "Zonked is not a medical device.",
  dailyEyebrow: "Your session for today",
  suggested: "Suggested for you",
  forYou: "For you",
  journeysTitle: "Journeys",
  journeysEmpty: "Pick a journey to begin. Go at your own pace.",
  restDay: "Rest day",
  restart: "Restart journey",
  startJourney: "Start this journey",
  libraryTitle: "Sounds",
  searchLabel: "Search sounds",
  searchEmpty: "Nothing matched. Try fewer words.",
  tabs: ["Feeling", "Sound", "Favorites", "My mixes", "Recent"],
  emptyFavorites: "Tap the heart on any sound to keep it here.",
  emptyMixes: "Make a mix in the player, then save it here.",
  emptyRecent: "Your recent sessions show up here.",
  welcomeBack: "Welcome back. Pick up where you like.",
  firstWeek: "Your week starts here. Rest days count too.",
  natureTitle: "Nature sounds and my sounds",
  natureLine: "Add rain, streams or birds under your session, or your own file.",
  joinedToday: "You joined today",
  joinedLine: "You joined today. Your week starts here. Rest days count too.",
  dayZero: (t) => `Day 0 of ${t}, you are ready`,
  infoTitle: "Today",
  panelOpenFirst: "Open Zonked once to read the headphone note.",
  panelPickFirst: "Open Zonked and pick a sound first.",
  panelCrewLabel: "Let the Crew steer my sound",
  panelCrewOff: "Crew is off.",
  panelCrewOn: "Crew is steering.",
  panelCrewLost: "Crew backend not reachable. Playing on your own.",
  panelPlaying: "Playing.",
  panelStopped: "Stopped.",
  panelOpenPage: "Zonked is open on the page. Use Stop there.",
  restCount: "Rest days count too.",
  timerChips: ["15 min", "30 min", "60 min", "Until I stop", "Sleep fade"],
  breathe: "Breathe in, breathe out",
  breatheIn: "Breathe in",
  breatheOut: "Breathe out",
  whyTitle: "What the research says",
  whyBody: "Some small studies suggest slow beats may help people relax. Results vary and may not happen for you. Zonked is not a medical device.",
  volumeCapped: "Volume is capped for your safety.",
  favorite: "Favorite",
  saved: "Saved",
  studio: "Studio mode",
  studioLink: "Open Studio mode",
  studioHint: "For advanced controls. Shortcut: Alt+Shift+S.",
  studioNote: "Advanced controls live in Settings, or press Alt+Shift+S for Studio mode.",
  backToCalm: "Back to Calm",
  crewTitle: "Crew",
  crewIntro: "Your coding session can watch itself and ease the sound. When you have been working hard, Zonked slowly moves toward calmer sound. You stay in control.",
  crewSwitch: "Let Crew ease the sound",
  crewOff: "Not connected",
  crewWhyOff: "Crew is not connected because the local feed is not running, or the Crew switch on this page is off. Zonked works fully without it.",
  crewStep1: "Start the local feed on your computer: run the crew bridge in your project folder.",
  crewStep2: "Turn on the Crew switch on this page.",
  crewDisabled: "The switch is on, but no feed answers yet. Crew stays off until step 1 is done.",
  crewOn: "Connected",
  crewBreak: "Time for a break",
  crewPrivacy: "Nothing leaves your computer.",
  crewOptional: "Crew is optional. Zonked works fully without it.",
  crewScore: "Load score",
  crewBeat: "Beat now",
  crewNext: "Next change",
  crewWhyTitle: "Why",
  crewReads: "Reads only git log and git status counts. Never file names, messages or paths.",
  crewNotNow: "Not now",
  crewFollowAgain: "Follow again",
  crewPaused: (t) => `Paused until ${t}`,
  crewFollowing: "Following the Crew",
  crewOverridden: "You picked a sound yourself, so the Crew is not steering it.",
  crewFollowNow: "Let the Crew steer",
  crewNextReal: (t) => `Not before ${t}, and only if your load moves to another band.`,
  crewNextWait: "Waiting for the first change.",
  crewNextDemo: (t) => `in ${t} s`,
  crewNextDemoLast: (t) => `none, the demo ends in ${t} s`,
  crewDemo: "Watch the crew work",
  crewDemoHint: "A 60 second pretend session. Nothing is read from your computer.",
  crewDemoStop: "Stop the demo",
  crewDemoBadge: "Simulated session",
  settingsTitle: "Settings",
  gentle: "Keep sounds extra gentle",
  gentleHint: "Picks softer sounds and keeps the screen still.",
  reduceMotion: "Reduce motion",
  themeTitle: "Look",
  themeChoices: { system: "System", light: "Light", dark: "Dark", contrast: "High contrast" },
  dimLabel: "Dim screen while playing",
  dimHint: "On by default from 19:00 to 07:00.",
  announceLabel: "Say Breathe in and Breathe out to screen readers",
  announceHint: "Speaks only when the phase changes.",
  resetEntry: "A short pause, 90 seconds",
  resetEntryHint: "Slow breathing with soft sound.",
  resetTitle: "A short pause",
  resetIntro: "Ninety seconds of slow breathing with a soft sound. Stop any time.",
  resetStart: "Begin",
  resetLeft: (t) => `${t} s left`,
  resetDoneLine: "That was 90 seconds of slow breathing.",
  resetAgain: "Pause again",
  resetBack: "Back to Today",
  counterIn: (t) => `Breathe in, ${t}`,
  counterOut: (t) => `Breathe out, ${t}`,
  demoSteering: "Demo is steering the sound",
  demoSteeringHint: "The simulated session controls the sound until you stop the demo, so this switch waits.",
  crewBeatHint: "Higher beats feel alert, lower beats feel calm.",
  weekOf: (t) => `${t} of 7 days`,
  forget: "Forget my data",
  forgetHint: "Removes your answers, nature choice and your own sounds from this device.",
  natureHead: "Nature sounds",
  natureIntro: "Add a recording of nature under your session. Pick one, then use the slider to set the mix.",
  natureFree: "Free to use, public domain",
  natureMade: "Made by Zonked in code. No recording is used.",
  natureCredits: "Credits",
  natureBlend: "More nature, softer beats",
  natureLevel: "Nature volume",
  natureAdd: "Add nature sound",
  natureOff: "Stop nature sound",
  natureOn: "Playing now",
  natureNote: "Nature sounds can feel calming for many people. Zonked makes no health claims and is not a medical device.",
  natureBack: "Back to Library",
  natureQuick: "Nature",
  mineTitle: "My sounds",
  mineStays: "Stays on this device",
  mineNote: "Pick an audio file from your own device. It stays in this browser, is never uploaded and uses no network. Only add files you own or have the right to use.",
  mineChoose: "Choose an audio file",
  mineLimits: "Up to 5 sounds, 8 MB each, 20 MB in all, 10 minutes long. Files under 20 seconds play once.",
  mineEmpty: "No sounds added yet.",
  mineRemove: "Remove",
  mineRemoveAll: "Remove all my sounds",
  mineAdded: "Added. It stays on this device.",
  offline: "Zonked works offline. Nothing to do.",
  errorAudio: "Sound could not start. Tap Play to try again.",
  errorStorage: "We could not save this on your device. Your session still works.",
  loading: "Loading",
  nav: ["Today", "Sounds", "Crew", "You"],
  sounds: (t) => `${t} ${t === 1 ? "sound" : "sounds"}`
}, Ys = {
  focus: "Focus",
  calm: "Calm down",
  sleep: "Sleep",
  study: "Study",
  recover: "Recover after work",
  curious: "Just curious"
}, Gs = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
  anytime: "Anytime"
}, Zs = {
  headphones: "Headphones",
  speakers: "Speakers",
  bluetooth: "Bluetooth",
  unsure: "Not sure"
}, Xs = [
  { id: "deep-work", label: "Focus", mood: "Steady and quiet", icon: "target" },
  { id: "adhd-focus", label: "Steady attention", mood: "Even and plain", icon: "wave" },
  { id: "ai-burnout", label: "Recover", mood: "Slow and soft", icon: "leaf" },
  { id: "heal-stress", label: "Calm down", mood: "Warm and gentle", icon: "heart" },
  { id: "cant-sleep", label: "Sleep", mood: "Dim and slow", icon: "moon" },
  { id: "lucid-dream", label: "Dream", mood: "Drifting", icon: "cloud" },
  { id: "meditate", label: "Meditate", mood: "Open and still", icon: "lotus" },
  { id: "quick-reset", label: "Quick reset", mood: "Short and light", icon: "bolt" }
], Js = {
  strong: "Several studies exist.",
  mixed: "Studies disagree.",
  preliminary: "Early, small studies.",
  limited: "Very little research.",
  preference: "People simply like it."
};
function Qs(t) {
  return t >= 5 && t < 12 ? "Good morning." : t >= 12 && t < 17 ? "Good afternoon." : t >= 17 && t < 21 ? "Good evening." : "Hello, night owl.";
}
const hn = {
  focus: "Your load looks light",
  flow: "Your load is building",
  recovery: "Your load is high",
  decompress: "Your load is very high"
}, De = (t) => Number.isInteger(t) ? String(t) : t.toFixed(1);
function ei(t) {
  if (t.why !== void 0) return t.why;
  const { level: e, score: n } = t.burnout, { beatHz: s, transitionSec: i } = t.target, r = i < 90 ? `${Math.round(i)} s` : `${Math.round(i / 60)} min`, o = e === "focus" ? `holds a steady ${De(s)} Hz beat` : `eases the beat to ${De(s)} Hz over about ${r}`;
  return `${hn[e]} (score ${Math.round(n)}), so the sound ${o}.`;
}
const me = "zonked.timer.v1", pn = 2.5, Fe = 0.1, $e = 6, O = { countdownMin: 30, sleepMin: 30, focusMin: 25, breakMin: 5 }, mn = 1, fn = 720, gn = 500, fe = ["none", "countdown", "sleep-fade", "pomodoro"], yn = { kind: "none", running: !1, remainingSec: 0, totalSec: 0 }, Q = (t, e) => typeof t == "number" && Number.isFinite(t) ? Math.min(fn, Math.max(mn, t)) : e;
class wn {
  constructor(e, n = null) {
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
    this.clock = e, this.storage = n, this.restore();
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
    var s;
    const e = ((s = this.spec) == null ? void 0 : s.kind) ?? "none", n = fe[(fe.indexOf(e) + 1) % fe.length] ?? "none";
    return n === "none" ? this.stop() : n === "countdown" ? this.start({ kind: "countdown", minutes: O.countdownMin }) : n === "sleep-fade" ? this.start({ kind: "sleep-fade", minutes: O.sleepMin }) : this.start({ kind: "pomodoro" });
  }
  /** Moves within the current segment by deltaSec (negative rewinds). Clamps to [0, total). */
  seekBy(e) {
    if (this.advance(), this.spec === null || !Number.isFinite(e)) return this.build();
    const n = this.segmentMs();
    return this.elapsedMs = Math.min(Math.max(0, this.elapsedMs + e * 1e3), Math.max(0, n - 1)), this.changed();
  }
  /** Gain scale and beat glide for the current moment. Advances the timer first. */
  effects() {
    this.advance();
    const e = this.spec;
    if (e === null || e.kind !== "sleep-fade") return { gainScale: 1, beatMix: 0 };
    const n = this.segmentMs(), s = Math.min(1, this.elapsedMs / n);
    if (this.elapsedMs <= n) return { gainScale: 1 - (1 - Fe) * s, beatMix: s };
    const i = Math.min(1, (this.elapsedMs - n) / ($e * 1e3));
    return { gainScale: Fe * (1 - i), beatMix: 1 };
  }
  normalize(e) {
    if (e.kind === "pomodoro") {
      const n = e.longEvery !== void 0 && Number.isFinite(e.longEvery) ? Math.max(2, Math.floor(e.longEvery)) : void 0;
      return {
        kind: "pomodoro",
        focusMin: Q(e.focusMin, O.focusMin),
        breakMin: Q(e.breakMin, O.breakMin),
        ...e.longBreakMin !== void 0 && n !== void 0 ? { longBreakMin: Q(e.longBreakMin, 15), longEvery: n } : {}
      };
    }
    return { kind: e.kind, minutes: Q(e.minutes, e.kind === "countdown" ? O.countdownMin : O.sleepMin) };
  }
  /** Length of the current segment in ms (phase length for pomodoro, N minutes otherwise). */
  segmentMs() {
    const e = this.spec;
    return e === null ? 0 : e.kind !== "pomodoro" ? e.minutes * 6e4 : this.phase === "focus" ? (e.focusMin ?? O.focusMin) * 6e4 : (e.longBreakMin !== void 0 && e.longEvery !== void 0 && this.cycle % e.longEvery === 0 ? e.longBreakMin ?? 0 : e.breakMin ?? O.breakMin) * 6e4;
  }
  run() {
    this.running = !0, this.lastMs = this.clock.now(), this.startPoll();
  }
  startPoll() {
    this.poll === null && (this.poll = this.clock.setInterval(() => void this.changed(), gn));
  }
  stopPoll() {
    this.poll !== null && this.clock.clearInterval(this.poll), this.poll = null;
  }
  advance() {
    if (!this.running || this.spec === null) return;
    const e = this.clock.now(), n = Math.max(0, e - this.lastMs);
    this.lastMs = e, this.elapsedMs += n;
    const s = this.spec;
    s.kind === "pomodoro" ? this.rollPomodoro() : s.kind === "countdown" && this.elapsedMs >= this.segmentMs() ? this.finish("countdown") : s.kind === "sleep-fade" && this.elapsedMs >= this.segmentMs() + $e * 1e3 && this.finish("sleep-fade");
  }
  rollPomodoro() {
    for (let e = 0; e < 1e3; e++) {
      const n = this.segmentMs();
      if (this.elapsedMs < n) return;
      this.elapsedMs -= n, this.phase === "focus" ? this.phase = "break" : (this.phase = "focus", this.cycle += 1);
    }
    this.elapsedMs = 0;
  }
  finish(e) {
    var n;
    this.spec = null, this.running = !1, this.elapsedMs = 0, this.stopPoll(), this.persist(), this.notify(this.build()), (n = this.onEnd) == null || n.call(this, e);
  }
  build() {
    const e = this.spec;
    if (e === null) return yn;
    const n = this.segmentMs() / 1e3, s = Math.max(0, Math.ceil(n - this.elapsedMs / 1e3));
    if (e.kind === "pomodoro")
      return {
        kind: "pomodoro",
        running: this.running,
        remainingSec: s,
        totalSec: n,
        phase: this.phase,
        cycle: this.cycle,
        focusMin: e.focusMin,
        breakMin: e.breakMin
      };
    const i = { kind: e.kind, running: this.running, remainingSec: s, totalSec: n };
    return e.kind === "sleep-fade" && this.elapsedMs > this.segmentMs() ? { ...i, finalFade: !0 } : i;
  }
  /** Advances, persists and notifies when the visible state changed. */
  changed() {
    this.advance();
    const e = this.build(), n = `${e.kind}|${e.running}|${e.remainingSec}|${e.phase ?? ""}|${e.cycle ?? 0}|${e.finalFade === !0}`;
    return n !== this.lastKey && (this.lastKey = n, this.persist(), this.notify(e)), e;
  }
  notify(e) {
    for (const n of this.listeners) n(e);
  }
  persist() {
    if (this.storage !== null)
      try {
        if (this.spec === null) {
          this.storage.removeItem(me);
          return;
        }
        const e = { v: 1, spec: this.spec, elapsedMs: this.elapsedMs, phase: this.phase, cycle: this.cycle };
        this.storage.setItem(me, JSON.stringify(e));
      } catch {
      }
  }
  restore() {
    if (this.storage !== null)
      try {
        const e = this.storage.getItem(me);
        if (e === null) return;
        const n = JSON.parse(e);
        if (n.v !== 1 || n.spec === void 0 || n.spec === null || typeof n.spec != "object" || !["countdown", "sleep-fade", "pomodoro"].includes(n.spec.kind)) return;
        this.spec = this.normalize(n.spec), this.phase = n.phase === "break" ? "break" : "focus", this.cycle = typeof n.cycle == "number" && Number.isFinite(n.cycle) ? Math.max(1, Math.floor(n.cycle)) : 1;
        const s = typeof n.elapsedMs == "number" && Number.isFinite(n.elapsedMs) ? n.elapsedMs : 0;
        this.elapsedMs = Math.min(Math.max(0, s), Math.max(0, this.segmentMs() - 1)), this.running = !1;
      } catch {
        this.spec = null;
      }
  }
}
const bn = {
  now: () => Date.now(),
  setInterval: (t, e) => window.setInterval(t, e),
  clearInterval: (t) => window.clearInterval(t)
}, We = ["off", "white", "pink", "brown", "violet"], R = 0.85, vn = 8, Sn = 3;
function at(t, e) {
  const n = Number.isFinite(e) ? e : H[t], s = Z;
  switch (t) {
    case "instRootHz":
      return h(n, s.instRootHz.min, s.instRootHz.max);
    case "padRootHz":
      return h(n, s.padRootHz.min, s.padRootHz.max);
    case "instBpm":
    case "percBpm":
      return h(n, s.bpm.min, s.bpm.max);
    case "chimeRatePerMin":
      return h(n, s.chimeRatePerMin.min, s.chimeRatePerMin.max);
    case "breathRateHz":
      return h(n, s.breathRateHz.min, s.breathRateHz.max);
    case "panRateHz":
      return h(n, s.panRateHz.min, s.panRateHz.max);
    case "instKind":
      return Math.round(h(n, 0, s.instKindMax));
    case "instScale":
    case "padChord":
    case "lofiProgression":
    case "percPattern":
      return Math.round(h(n, 0, s.enumMax));
    default:
      return h(n, s.level.min, s.level.max);
  }
}
const Mn = 100, Ke = 0.25, kn = 3, Ln = 0.02, ge = (t, e, n) => t + (e - t) * n, h = (t, e, n) => t < e ? e : t > n ? n : t, q = (t, e) => Number.isFinite(t) ? t : e;
function En() {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}
function Rn(t, e, n) {
  return {
    ...e,
    carrierHz: ge(t.carrierHz, e.carrierHz, n),
    beatHz: ge(t.beatHz, e.beatHz, n),
    gain: ge(t.gain, e.gain, n)
  };
}
function Ue(t) {
  return Se.find((e) => e.id === t) ?? Se[0];
}
class An {
  constructor(e, n, s, i = {}) {
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
    var a;
    this.engine = e, this.clock = n, this.onSession = s, this.toEvents = i.toEvents, this.timers = new wn(n, i.storage === void 0 ? En() : i.storage), this.timers.subscribe(() => {
      const u = this.timers.state().phase;
      this.playing && u === "break" && this.lastPhase !== "break" && (this.breakCount += 1), this.lastPhase = u, this.emit();
    }), this.timers.onEnd = (u) => {
      this.endKind = u, this.stop();
    };
    const r = Ue(((a = Se[0]) == null ? void 0 : a.id) ?? "");
    this.presetId = r.id;
    const o = J(r.sbg).events;
    this.base = he(o, 0), this.current = this.base, this.userCeiling = h(this.base.gain, 0, R), this.crewLevel = this.userCeiling, this.heardRaw = this.userCeiling, this.mode = { kind: "script", events: o, startMs: n.now() };
  }
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  snapshot() {
    var e, n, s;
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
      templateName: ((n = this.template) == null ? void 0 : n.name) ?? null,
      templateCategory: ((s = this.template) == null ? void 0 : s.category) ?? null,
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
    var s;
    this.queue = [...e];
    const n = (s = this.template) == null ? void 0 : s.id;
    this.queueIndex = n === void 0 ? -1 : this.queue.findIndex((i) => i.id === n), this.emit();
  }
  /** Plays a template through the injected toEvents. Resolves false when it cannot be played. */
  async playTemplate(e) {
    const n = this.queue.findIndex((s) => s.id === e.id);
    return this.playAt(e, n);
  }
  async nextTemplate() {
    return this.step(1);
  }
  async prevTemplate() {
    return this.step(-1);
  }
  async step(e) {
    const n = this.queue.length;
    if (n === 0) return !1;
    const i = ((this.queueIndex < 0 ? e === 1 ? -1 : 0 : this.queueIndex) + e + n) % n, r = this.queue[i];
    return r === void 0 ? !1 : this.playAt(r, i);
  }
  async playAt(e, n) {
    var i;
    const s = ((i = this.toEvents) == null ? void 0 : i.call(this, e)) ?? [];
    return s.length === 0 ? !1 : (this.overridden = !0, this.source = "template", this.template = e, this.queueIndex = n, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(s), this.playing || await this.play(), !0);
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
    const n = this.base.gain, s = Math.round((this.gainTrim + e) * 1e3) / 1e3, i = this.gainTrim;
    this.gainTrim = h(s, -n, Math.max(0, R - n)), this.captureUserLevel(this.gainTrim - i), this.applyNow();
  }
  /** Records the level the user is hearing (plus the delta they just applied) as the new crew ceiling. */
  captureUserLevel(e) {
    const n = h(this.heardRaw + e, 0, R);
    this.userCeiling = n, this.crewLevel = n;
  }
  /** Sets the ceiling from a freshly chosen script or play start (the gain the user will hear). */
  captureFromBase() {
    const e = h(this.base.gain + this.gainTrim, 0, R);
    this.userCeiling = e, this.crewLevel = e, this.heardRaw = e;
  }
  // ---- layer mixer ----
  /** Overrides layer fields (levels, tempo, etc.) over whatever the script plays. Values are clamped. */
  setLayerOverride(e) {
    const n = { ...this.layerOverrides };
    for (const [s, i] of Object.entries(e))
      Object.hasOwn(H, s) && typeof i == "number" && (n[s] = at(s, i));
    this.layerOverrides = n, this.applyNow();
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
      const n = typeof e.noise == "string" && We.includes(e.noise) ? e.noise : void 0, s = typeof e.noiseLevel == "number" && Number.isFinite(e.noiseLevel) ? h(e.noiseLevel, 0, 1) : void 0;
      if (n === void 0 && s === void 0) return;
      this.noiseOverride = { ...n !== void 0 ? { noise: n } : {}, ...s !== void 0 ? { noiseLevel: s } : {} };
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
    const e = this.base, n = this.timers.state(), s = this.source === "template" && this.template !== null ? { kind: "template", id: this.template.id } : this.source === "preset" ? { kind: "preset", id: this.presetId } : { kind: "custom", id: "custom" }, i = n.kind === "countdown" || n.kind === "sleep-fade" ? { kind: n.kind, minutes: Math.max(1, Math.round(n.totalSec / 60)) } : n.kind === "pomodoro" ? { kind: "pomodoro", focusMin: n.focusMin ?? 25, breakMin: n.breakMin ?? 5 } : { kind: "none" };
    return {
      source: s,
      voice: {
        carrierHz: e.carrierHz,
        beatHz: e.beatHz,
        mode: e.mode,
        noise: e.noise,
        noiseLevel: e.noiseLevel,
        gain: h(e.gain + this.gainTrim, 0, R)
      },
      layers: { ...e.layers ?? {}, ...this.layerOverrides },
      timer: i,
      ...this.beatOverride !== null ? { beatOverride: this.beatOverride } : {},
      ...this.noiseOverride !== null ? { noiseOverride: this.noiseOverride } : {}
    };
  }
  /** Plays a mix that was already validated by parseMix or makeMix. The caller shows the safety gate first. */
  playMix(e) {
    const n = e.voice, s = {
      carrierHz: h(n.carrierHz, 20, 1500),
      beatHz: h(n.beatHz, 0.5, 40),
      mode: n.mode,
      noise: n.noise,
      noiseLevel: h(n.noiseLevel, 0, 1),
      gain: h(n.gain, 0, R),
      layers: { ...H, ...e.layers }
    };
    this.overridden = !0, this.source = "custom", this.presetId = `mix:${e.id}`.slice(0, 80), this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.layerOverrides = {}, e.beatOverride !== void 0 && (this.beatOverride = h(e.beatOverride, 0.5, 40));
    const i = e.noiseOverride;
    if (i !== void 0) {
      const o = i.noise !== void 0 && We.includes(i.noise) ? i.noise : void 0, a = i.noiseLevel !== void 0 && Number.isFinite(i.noiseLevel) ? h(i.noiseLevel, 0, 1) : void 0;
      this.noiseOverride = { ...o !== void 0 ? { noise: o } : {}, ...a !== void 0 ? { noiseLevel: a } : {} };
    }
    this.startScript([{ tSec: 0, voice: s, ramp: !1, line: 0 }]);
    const r = e.timer;
    r.kind === "countdown" || r.kind === "sleep-fade" ? this.startTimer({ kind: r.kind, minutes: r.minutes ?? 30 }) : r.kind === "pomodoro" ? this.startTimer({ kind: "pomodoro", focusMin: r.focusMin ?? 25, breakMin: r.breakMin ?? 5 }) : this.stopTimer(), this.play();
  }
  // ---- timers ----
  startTimer(e) {
    const n = this.timers.start(e);
    return this.playing || this.timers.pause(), this.emit(), n;
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
    const n = this.mode;
    if (this.template === null || n.kind !== "script") return null;
    const s = this.scriptDuration(n.events), i = this.playing ? (this.clock.now() - n.startMs) / 1e3 : 0;
    return { durationSec: s, positionSec: h(i, 0, s) };
  }
  /** Seeks within the active timer, or the template timeline. Clamped to its bounds. */
  seekBy(e) {
    if (Number.isFinite(e)) {
      if (this.timers.state().kind !== "none")
        this.timers.seekBy(e);
      else if (this.mode.kind === "script" && this.template !== null) {
        const n = this.mode, s = this.scriptDuration(n.events), i = h((this.clock.now() - n.startMs) / 1e3 + e, 0, s);
        this.mode = { ...n, startMs: this.clock.now() - i * 1e3 };
      }
      this.applyNow();
    }
  }
  scriptDuration(e) {
    var s;
    const n = rt(e);
    return n > 0 ? n : Math.max(60, (((s = this.template) == null ? void 0 : s.recommendedMinutes) ?? 1) * 60);
  }
  /** Recomputes the effective voice and pushes it to the engine when playing. */
  applyNow() {
    this.current = this.effective(this.base), this.playing && this.engine.setVoice(this.current, Ke), this.emit();
  }
  effective(e) {
    const n = this.timers.effects();
    this.gainScale = n.gainScale;
    const s = e.beatHz + (pn - e.beatHz) * n.beatMix, i = Math.min(s, vn), r = h(s + (i - s) * this.breakMix, 0.5, 40), o = this.beatOverride ?? r, a = this.noiseOverride, u = h(e.gain + this.gainTrim, 0, R), m = this.source === "crew" ? Math.min(u, this.crewLevel, this.userCeiling) : u;
    this.heardRaw = m;
    const y = this.muted ? 0 : m, w = Object.keys(this.layerOverrides).length > 0 ? { ...e.layers ?? H, ...this.layerOverrides } : e.layers;
    return {
      ...e,
      beatHz: o,
      ...(a == null ? void 0 : a.noise) !== void 0 ? { noise: a.noise } : {},
      ...(a == null ? void 0 : a.noiseLevel) !== void 0 ? { noiseLevel: a.noiseLevel } : {},
      // Defense in depth: a non-finite gain (forged crew state) is silence, never NaN.
      gain: q(Math.min(R, y * n.gainScale), 0),
      ...w !== void 0 ? { layers: w } : {}
    };
  }
  slewBreak(e) {
    const n = Math.max(0, e - this.lastTickMs);
    if (this.lastTickMs = e, this.source === "crew") {
      const r = Math.min(h(this.base.gain + this.gainTrim, 0, R), this.userCeiling);
      this.crewLevel = r > this.crewLevel ? Math.min(r, this.crewLevel + Ln * n / 1e3) : r;
    }
    const s = this.timers.state().phase === "break" ? 1 : 0, i = n / (Sn * 1e3);
    this.breakMix = s > this.breakMix ? Math.min(s, this.breakMix + i) : Math.max(s, this.breakMix - i);
  }
  /** Manual preset choice. Overrides the crew until followCrew(). */
  selectPreset(e) {
    const n = Ue(e);
    this.overridden = !0, this.presetId = n.id, this.source = "preset", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(J(n.sbg).events);
  }
  /** Parses and plays custom text. Returns diagnostics; nothing plays when it has errors. */
  async playCustom(e) {
    const n = J(e);
    return !n.ok || n.events.length === 0 || (this.overridden = !0, this.source = "custom", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(n.events), this.playing || await this.play()), n.diagnostics;
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
    const n = this.opCount === 0 ? e() : this.opTail.then(e);
    return this.opCount += 1, this.opTail = n.then(
      () => void (this.opCount -= 1),
      () => void (this.opCount -= 1)
    ), n;
  }
  play() {
    return this.wantPlaying = !0, this.enqueue(() => this.doPlay());
  }
  stop() {
    return this.wantPlaying = !1, this.enqueue(() => this.doStop());
  }
  async doPlay() {
    var s;
    if (this.playing || !this.wantPlaying) return;
    const e = this.clock.now();
    this.restartModeClock(e), this.lastTickMs = e, this.captureFromBase(), this.current = this.effective(this.base);
    try {
      await this.engine.start(this.current);
    } catch {
      this.emit();
      return;
    }
    const n = (s = this.engine.status) == null ? void 0 : s.state;
    if (n !== void 0 && n !== "running") {
      this.emit();
      return;
    }
    this.playing = !0, this.startedAt = e, this.peak = this.burnout ?? 0, this.endKind = "manual", this.breakCount = 0, this.lastPhase = this.timers.state().phase, this.timer = this.clock.setInterval(() => this.tick(), Mn), this.timers.resume(), this.emit();
  }
  async doStop() {
    var e, n;
    if (this.playing) {
      this.playing = !1, this.timers.pause(), this.timer !== null && this.clock.clearInterval(this.timer), this.timer = null, (n = this.onSession) == null || n.call(this, {
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
    this.base = this.voiceNow(e), this.slewBreak(e), this.current = this.effective(this.base), this.playing && (this.engine.setVoice(this.current, Ke), this.emit());
  }
  voiceNow(e) {
    const n = this.mode;
    if (n.kind === "hold") return n.voice;
    if (n.kind === "script") return he(n.events, (e - n.startMs) / 1e3);
    const s = Math.min(1, Math.max(0, (e - n.startMs) / n.durMs));
    return s >= 1 ? (this.mode = { kind: "hold", voice: n.to }, n.to) : Rn(n.from, n.to, s);
  }
  restartModeClock(e) {
    const n = this.mode;
    n.kind !== "hold" && (this.mode = { ...n, startMs: e });
  }
  startScript(e) {
    this.mode = { kind: "script", events: e, startMs: this.clock.now() }, this.base = he(e, 0), this.captureFromBase(), this.current = this.effective(this.base), this.playing && this.engine.setVoice(this.current, kn), this.emit();
  }
  enterCrew(e) {
    const n = this.clock.now();
    this.source = "crew", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.crewLevel = Math.min(this.heardRaw, this.userCeiling);
    const s = e.sbg === null ? null : J(e.sbg);
    if (s !== null && s.ok && s.events.length > 0)
      this.mode = { kind: "script", events: s.events, startMs: n };
    else {
      const i = e.target, r = {
        ...this.base,
        carrierHz: h(q(i.carrierHz, this.base.carrierHz), 20, 1500),
        beatHz: h(q(i.beatHz, this.base.beatHz), 0.5, 40),
        gain: h(q(i.gain, 0), 0, R)
      };
      this.mode = { kind: "transition", from: this.base, to: r, startMs: n, durMs: h(q(i.transitionSec, 5), 0.1, 600) * 1e3 };
    }
    this.emit();
  }
  emit() {
    const e = this.snapshot();
    for (const n of this.listeners) n(e);
  }
}
const Tn = 1, Me = 200, Hn = 60, ye = 240, ct = ["off", "white", "pink", "brown", "violet"], zn = ["binaural", "monaural", "isochronic"], Cn = ["template", "preset", "custom", "mix"], Nn = ["none", "countdown", "sleep-fade", "pomodoro"], ke = (t, e, n) => t < e ? e : t > n ? n : t;
function D(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function p(t, e) {
  return Object.hasOwn(t, e) ? t[e] : void 0;
}
function N(t, e, n, s) {
  return typeof t == "number" && Number.isFinite(t) ? ke(t, e, n) : s;
}
function Pn(t, e) {
  if (typeof t != "string") return e;
  const n = t.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, Hn);
  return n.length > 0 ? n : e;
}
function lt(t) {
  return typeof t == "string" && /^[A-Za-z0-9_.:-]{1,64}$/.test(t) ? t : null;
}
function oe(t, e, n) {
  return typeof t == "string" && e.includes(t) ? t : n;
}
function On(t) {
  return D(t) ? {
    carrierHz: N(p(t, "carrierHz"), l.carrierMin, l.carrierMax, 200),
    beatHz: N(p(t, "beatHz"), l.beatMin, l.beatMax, 10),
    mode: oe(p(t, "mode"), zn, "binaural"),
    noise: oe(p(t, "noise"), ct, "off"),
    noiseLevel: N(p(t, "noiseLevel"), l.noiseMin, l.noiseMax, 0),
    gain: N(p(t, "gain"), l.gainMin, l.gainMax, 0.3)
  } : null;
}
function xn(t) {
  const e = {};
  if (!D(t)) return e;
  for (const n of Object.keys(H)) {
    const s = p(t, n);
    typeof s == "number" && Number.isFinite(s) && (e[n] = at(n, s));
  }
  return e;
}
function In(t) {
  if (!D(t)) return { kind: "none" };
  const e = oe(p(t, "kind"), Nn, "none");
  return e === "countdown" || e === "sleep-fade" ? { kind: e, minutes: Math.round(N(p(t, "minutes"), 1, ye, 30)) } : e === "pomodoro" ? {
    kind: e,
    focusMin: Math.round(N(p(t, "focusMin"), 1, ye, 25)),
    breakMin: Math.round(N(p(t, "breakMin"), 1, ye, 5))
  } : { kind: "none" };
}
function _n(t) {
  return D(t) ? { kind: oe(p(t, "kind"), Cn, "custom"), id: lt(p(t, "id")) ?? "custom" } : { kind: "custom", id: "custom" };
}
function Bn(t) {
  if (!D(t)) return null;
  const e = On(p(t, "voice"));
  if (e === null) return null;
  const n = p(t, "beatOverride"), s = p(t, "noiseOverride"), i = D(s) ? p(s, "noise") : void 0, r = D(s) ? p(s, "noiseLevel") : void 0, o = {
    ...typeof i == "string" && ct.includes(i) ? { noise: i } : {},
    ...typeof r == "number" && Number.isFinite(r) ? { noiseLevel: ke(r, l.noiseMin, l.noiseMax) } : {}
  };
  return {
    source: _n(p(t, "source")),
    voice: e,
    layers: xn(p(t, "layers")),
    timer: In(p(t, "timer")),
    ...typeof n == "number" && Number.isFinite(n) ? { beatOverride: ke(n, l.beatMin, l.beatMax) } : {},
    ...Object.keys(o).length > 0 ? { noiseOverride: o } : {}
  };
}
function Dn(t, e) {
  if (!D(t) || p(t, "v") !== Tn) return null;
  const n = lt(p(t, "id")), s = Bn(t);
  if (n === null || s === null) return null;
  const i = N(p(t, "createdAt"), 0, e + 864e5, e), r = N(p(t, "updatedAt"), 0, e + 864e5, i);
  return { ...s, v: 1, id: n, name: Pn(p(t, "name"), "My mix"), createdAt: i, updatedAt: r };
}
const ti = 3e4, Fn = 30 * 6e4, $n = { state: null, source: "none", changedAtMs: 0, snoozeUntilMs: 0, demoNextAtMs: null };
let M = $n, K = null;
const Le = /* @__PURE__ */ new Set(), ni = () => M;
function si(t) {
  return Le.add(t), () => void Le.delete(t);
}
function le(t) {
  M = t;
  for (const e of [...Le]) e();
}
const Wn = (t, e) => t !== null && t.target.beatHz === e.target.beatHz && t.target.carrierHz === e.target.carrierHz && t.target.gain === e.target.gain;
function Kn(t, e, n = Date.now()) {
  if (M.source === "demo") return;
  const s = !Wn(M.state, e);
  le({ ...M, state: e, source: "bridge", changedAtMs: s ? n : M.changedAtMs }), n >= M.snoozeUntilMs && t.applyCrew(e);
}
function Un() {
  M.source === "bridge" && le({ ...M, state: null, source: "none", changedAtMs: 0 });
}
function ii(t, e = Date.now(), n = Fn) {
  K !== null && clearTimeout(K), le({ ...M, snoozeUntilMs: e + n }), K = setTimeout(() => qn(t), n);
}
function qn(t) {
  K !== null && clearTimeout(K), K = null, le({ ...M, snoozeUntilMs: 0 }), M.source === "bridge" && M.state !== null && t.applyCrew(M.state);
}
const jn = 160;
function Vn(t) {
  if (typeof t != "string") return null;
  const e = t.slice(0, 4096).replace(/[\p{Cc}\u2028\u2029\u202A-\u202E\u2066-\u2069\u200B-\u200F\uFEFF]/gu, " ").replace(/\s+/g, " ").trim(), n = Array.from(e).slice(0, jn).join("").trim();
  return n.length > 0 ? n : null;
}
const Yn = 5, Gn = 600;
function j(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function we(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function Zn(t) {
  return t < 40 ? "focus" : t < 60 ? "flow" : t < 80 ? "recovery" : "decompress";
}
function ut(t) {
  if (!we(t) || t.version !== 1) return null;
  const e = t.burnout, n = t.target;
  if (!we(e) || !we(n)) return null;
  const s = e.score, i = n.beatHz, r = n.carrierHz, o = n.gain, a = n.transitionSec;
  if (![s, i, r, o, a].every((z) => typeof z == "number" && Number.isFinite(z)))
    return null;
  const u = j(s, 0, 100), m = Zn(u), y = n.presetId, f = t.sbg, w = t.at, P = Vn(t.why);
  return {
    version: 1,
    at: typeof w == "number" && Number.isFinite(w) ? Math.trunc(w) : 0,
    burnout: { score: u, level: m },
    target: {
      ...typeof y == "string" && y.length > 0 && y.length <= 64 ? { presetId: y } : {},
      beatHz: j(i, l.beatMin, l.beatMax),
      carrierHz: j(r, l.carrierMin, l.carrierMax),
      gain: j(o, l.gainMin, l.gainMax),
      transitionSec: j(a, Yn, Gn),
      breathe: n.breathe === !0
    },
    sbg: typeof f == "string" && f.length <= T.maxBytes ? f : null,
    ...P === null ? {} : { why: P }
  };
}
let dt = null;
function Xn(t) {
  dt = t;
}
function ri() {
  return dt;
}
const Ee = 0.85, oi = 2, ai = 0.3, ci = 0.15, li = 0.4, Jn = 0.6, qe = 0.95, X = (t, e, n) => t < e ? e : t > n ? n : t;
function Qn(t, e = 0) {
  return Number.isFinite(t) ? X(t, 0, Ee) : X(Number.isFinite(e) ? e : 0, 0, Ee);
}
function es(t, e = 0) {
  return Number.isFinite(t) ? X(t, 0, 1) : X(Number.isFinite(e) ? e : 0, 0, 1);
}
function ui(t) {
  return 1 - Jn * es(t);
}
function di(t) {
  return Qn(t) / Ee;
}
function ts(t = 2049) {
  const e = Math.max(3, t | 0), n = new Float32Array(e);
  for (let s = 0; s < e; s++) n[s] = X(s / (e - 1) * 2 - 1, -qe, qe);
  return n;
}
const ns = "zonked.safety.v1", je = "zonked.reduceMotion";
function Ne(t, e = ht()) {
  try {
    return (e == null ? void 0 : e.getItem(t)) === "1";
  } catch {
    return !1;
  }
}
function Pe(t, e, n = ht()) {
  try {
    n == null || n.setItem(t, e ? "1" : "0");
  } catch {
  }
}
function ht() {
  try {
    return typeof localStorage > "u" ? void 0 : localStorage;
  } catch {
    return;
  }
}
function ss() {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}
function hi() {
  const [t, e] = Ie(() => Ne(je)), [n, s] = Ie(() => {
    var r;
    return ((r = window.matchMedia) == null ? void 0 : r.call(window, "(prefers-reduced-motion: reduce)").matches) ?? !1;
  });
  return it(() => {
    var a;
    const r = (a = window.matchMedia) == null ? void 0 : a.call(window, "(prefers-reduced-motion: reduce)");
    if (r === void 0) return;
    const o = () => s(r.matches);
    return r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), [t || n, (r) => {
    Pe(je, r), e(r);
  }, t];
}
const is = "" + new URL("assets/worklet-CT8dHE_F.js", import.meta.url).href, rs = new URL(new URL("assets/dsp_core.wasm.json", import.meta.url).href).href, k = {
  carrierHz: { min: 20, max: 1500, def: 200 },
  beatHz: { min: 0.5, max: 40, def: 10 },
  gain: { min: 0, max: 0.85 },
  noiseLevel: { min: 0, max: 1 },
  rampSec: { min: 0.05, max: 30, def: 0.05 }
}, ae = 32, d = {
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
}, os = 4 + ae * 4;
function S(t, e, n, s) {
  return typeof t != "number" || !Number.isFinite(t) ? s : t < e ? e : t > n ? n : t;
}
const pt = (t, e = k.carrierHz.def) => S(t, k.carrierHz.min, k.carrierHz.max, e), mt = (t, e = k.beatHz.def) => S(t, k.beatHz.min, k.beatHz.max, e), ft = (t, e = 0) => S(t, k.gain.min, k.gain.max, e), gt = (t, e = 0) => S(t, k.noiseLevel.min, k.noiseLevel.max, e), yt = (t, e = k.rampSec.def) => S(t, k.rampSec.min, k.rampSec.max, e), b = Z, E = (t, e) => S(t, b.level.min, b.level.max, e), ee = (t, e = 0) => S(typeof t == "number" ? Math.round(t) : t, 0, b.enumMax, e), Ve = (t, e) => S(t, b.bpm.min, b.bpm.max, e);
function wt(t) {
  const e = H, n = t ?? e;
  return {
    lofiLevel: E(n.lofiLevel, e.lofiLevel),
    lofiWarmth: E(n.lofiWarmth, e.lofiWarmth),
    crackle: E(n.crackle, e.crackle),
    instLevel: E(n.instLevel, e.instLevel),
    instKind: S(typeof n.instKind == "number" ? Math.round(n.instKind) : n.instKind, 0, b.instKindMax, e.instKind),
    instRootHz: S(n.instRootHz, b.instRootHz.min, b.instRootHz.max, e.instRootHz),
    instScale: ee(n.instScale, e.instScale),
    instBpm: Ve(n.instBpm, e.instBpm),
    padLevel: E(n.padLevel, e.padLevel),
    padChord: ee(n.padChord, e.padChord),
    padRootHz: S(n.padRootHz, b.padRootHz.min, b.padRootHz.max, e.padRootHz),
    chimeLevel: E(n.chimeLevel, e.chimeLevel),
    chimeRatePerMin: S(n.chimeRatePerMin, b.chimeRatePerMin.min, b.chimeRatePerMin.max, e.chimeRatePerMin),
    percLevel: E(n.percLevel, e.percLevel),
    percBpm: Ve(n.percBpm, e.percBpm),
    percPattern: ee(n.percPattern, e.percPattern),
    lofiProgression: ee(n.lofiProgression, e.lofiProgression),
    tapeWow: E(n.tapeWow, e.tapeWow),
    pianoPedal: E(n.pianoPedal, e.pianoPedal),
    breathDepth: E(n.breathDepth, e.breathDepth),
    breathRateHz: S(n.breathRateHz, b.breathRateHz.min, b.breathRateHz.max, e.breathRateHz),
    stereoWidth: E(n.stereoWidth, e.stereoWidth),
    panDepth: E(n.panDepth, e.panDepth),
    panRateHz: S(n.panRateHz, b.panRateHz.min, b.panRateHz.max, e.panRateHz)
  };
}
const bt = { binaural: 0, monaural: 1, isochronic: 2 }, vt = { off: 0, white: 1, pink: 2, brown: 3, violet: 4 };
function as(t, e) {
  e[d.lofiLevel] = t.lofiLevel, e[d.lofiWarmth] = t.lofiWarmth, e[d.crackle] = t.crackle, e[d.instLevel] = t.instLevel, e[d.instKind] = t.instKind, e[d.instRootHz] = t.instRootHz, e[d.instScale] = t.instScale, e[d.instBpm] = t.instBpm, e[d.padLevel] = t.padLevel, e[d.padChord] = t.padChord, e[d.padRootHz] = t.padRootHz, e[d.chimeLevel] = t.chimeLevel, e[d.chimeRatePerMin] = t.chimeRatePerMin, e[d.percLevel] = t.percLevel, e[d.percBpm] = t.percBpm, e[d.percPattern] = t.percPattern, e[d.lofiProgression] = t.lofiProgression, e[d.tapeWow] = t.tapeWow, e[d.pianoPedal] = t.pianoPedal, e[d.breathDepth] = t.breathDepth, e[d.breathRateHz] = t.breathRateHz, e[d.stereoWidth] = t.stereoWidth, e[d.panDepth] = t.panDepth, e[d.panRateHz] = t.panRateHz;
}
function cs(t, e, n) {
  return n[d.carrierHz] = pt(t.carrierHz), n[d.beatHz] = mt(t.beatHz), n[d.gain] = ft(t.gain), n[d.mode] = bt[t.mode] ?? 0, n[d.noiseKind] = vt[t.noise] ?? 0, n[d.noiseLevel] = gt(t.noiseLevel), n[d.rampSec] = yt(e), n[d.reserved] = 0, as(wt(t.layers), n), n;
}
function Ye(t, e) {
  return {
    carrierHz: pt(t.carrierHz, e == null ? void 0 : e.carrierHz),
    beatHz: mt(t.beatHz, e == null ? void 0 : e.beatHz),
    noise: t.noise in vt ? t.noise : (e == null ? void 0 : e.noise) ?? "off",
    noiseLevel: gt(t.noiseLevel, e == null ? void 0 : e.noiseLevel),
    mode: t.mode in bt ? t.mode : (e == null ? void 0 : e.mode) ?? "binaural",
    gain: ft(t.gain, e == null ? void 0 : e.gain),
    ...t.layers !== void 0 ? { layers: wt(t.layers) } : {}
  };
}
class ls {
  constructor(e) {
    c(this, "seq");
    c(this, "data");
    this.seq = new Int32Array(e, 0, 1), this.data = new Float32Array(e, 4, ae);
  }
  write(e) {
    Atomics.add(this.seq, 0, 1);
    for (let n = 0; n < ae; n++) this.data[n] = e[n] ?? 0;
    Atomics.add(this.seq, 0, 1);
  }
}
const G = 8192, us = G - 1, St = 8, ds = St + G * 2 * 4;
function hs(t) {
  return new SharedArrayBuffer(ds);
}
class ps {
  constructor(e) {
    c(this, "idx");
    c(this, "ring");
    this.idx = new Int32Array(e, 0, 2), this.ring = new Float32Array(e, St, G * 2);
  }
  read(e) {
    const n = Atomics.load(this.idx, 0), s = Atomics.load(this.idx, 1);
    let i = n - s | 0;
    if (i <= 0) return 0;
    i > G && (i = G);
    const r = Math.min(i, e.length >> 1);
    let o = n - r | 0;
    for (let a = 0; a < r; a++) {
      const u = (o & us) * 2;
      e[a * 2] = this.ring[u] ?? 0, e[a * 2 + 1] = this.ring[u + 1] ?? 0, o = o + 1 | 0;
    }
    return Atomics.store(this.idx, 1, n), r;
  }
}
const Ge = { read: () => 0 }, te = 2, Ze = 0.3, ms = 1e3;
class fs {
  constructor() {
    c(this, "_status");
    c(this, "listeners", /* @__PURE__ */ new Set());
    c(this, "ctx", null);
    c(this, "node", null);
    c(this, "master", null);
    c(this, "writer", null);
    c(this, "tele", Ge);
    c(this, "voice", null);
    c(this, "startedAt", 0);
    c(this, "statsId", 0);
    c(this, "pending", /* @__PURE__ */ new Map());
    c(this, "pendingStart", null);
    c(this, "pendingStop", null);
    c(this, "block", new Float32Array(ae));
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
    for (const n of this.listeners) n(this._status);
  }
  async start(e) {
    if (this.pendingStop !== null && await this.pendingStop, this._status.state === "running") return;
    if (this.pendingStart !== null) return this.pendingStart;
    const n = this.doStart(e);
    return this.pendingStart = n.finally(() => {
      this.pendingStart = null;
    }), this.pendingStart;
  }
  async doStart(e) {
    this.setStatus({ state: "starting", error: void 0 });
    try {
      this.ctx === null && await this.build();
      const n = this.ctx;
      if (n === null || this.master === null) throw new Error("audio graph missing");
      this.voice = Ye(e), this.pushVoice(this.voice, te), this.startedAt = n.currentTime;
      const s = this.master.gain;
      s.cancelScheduledValues(n.currentTime), s.setValueAtTime(0, n.currentTime), s.linearRampToValueAtTime(1, n.currentTime + te), await n.resume(), this.setStatus({ state: "running" });
    } catch (n) {
      this.setStatus({ state: "error", error: n instanceof Error ? n.message : String(n) });
    }
  }
  async build() {
    const e = new AudioContext({ latencyHint: "interactive" });
    this.ctx = e, await e.audioWorklet.addModule(is);
    const n = await fetch(rs);
    if (!n.ok) throw new Error(`wasm fetch failed: ${n.status}`);
    const s = await n.arrayBuffer(), i = typeof SharedArrayBuffer < "u" && this._status.crossOriginIsolated, r = i ? new SharedArrayBuffer(os) : void 0, o = i ? hs() : void 0, a = new AudioWorkletNode(e, "zonked-dsp", { numberOfInputs: 0, outputChannelCount: [2] }), u = new Promise((w, P) => {
      a.port.onmessage = (z) => {
        const C = z.data;
        C.type === "ready" ? w() : C.type === "error" ? P(new Error(C.message ?? "worklet init failed")) : this.onWorkletMessage(z.data);
      };
    });
    a.port.postMessage({ type: "init", wasm: s, sab: r, tele: o, sampleRate: e.sampleRate }), await u, a.port.onmessage = (w) => this.onWorkletMessage(w.data);
    const m = e.createGain();
    m.gain.value = 0;
    const y = e.createGain(), f = e.createWaveShaper();
    f.curve = ts(), a.connect(y).connect(m).connect(f).connect(e.destination), Xn({ ctx: e, input: m, duck: y }), this.node = a, this.master = m, this.writer = r ? new ls(r) : null, this.tele = o ? new ps(o) : Ge, this.setStatus({ sampleRate: e.sampleRate, usesSharedMemory: i });
  }
  onWorkletMessage(e) {
    if (e.type === "stats") {
      const n = e.id, s = this.pending.get(n);
      if (!s) return;
      clearTimeout(s.timer), this.pending.delete(n), s.resolve({
        peak: Number(e.peak),
        rms: Number(e.rms),
        frames: Number(e.frames),
        nonZero: Number(e.nonZero)
      });
    } else e.type === "error" && this.setStatus({ state: "error", error: String(e.message) });
  }
  pushVoice(e, n) {
    var s;
    cs(e, n, this.block), this.writer !== null ? this.writer.write(this.block) : (s = this.node) == null || s.port.postMessage({ type: "params", p: new Float32Array(this.block) });
  }
  setVoice(e, n) {
    this.voice = Ye(e, this.voice ?? void 0);
    let s = yt(n ?? 0.05);
    this.ctx !== null && this.ctx.currentTime - this.startedAt < 2 * te && (s = Math.max(s, te)), this.pushVoice(this.voice, s);
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
    var s;
    const e = this.ctx;
    if (e === null || this._status.state !== "running") return;
    this.setStatus({ state: "stopping" }), this.voice !== null && this.pushVoice({ ...this.voice, gain: 0 }, 0.1);
    const n = (s = this.master) == null ? void 0 : s.gain;
    n && (n.cancelScheduledValues(e.currentTime), n.setValueAtTime(n.value, e.currentTime), n.linearRampToValueAtTime(0, e.currentTime + Ze)), await new Promise((i) => setTimeout(i, Ze * 1e3 + 50));
    try {
      await e.suspend(), this.setStatus({ state: "stopped" });
    } catch (i) {
      this.setStatus({ state: "error", error: i instanceof Error ? i.message : String(i) });
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
    const e = { peak: 0, rms: 0, frames: 0, nonZero: 0 }, n = this.node;
    return n === null ? Promise.resolve(e) : new Promise((s) => {
      const i = ++this.statsId, r = setTimeout(() => {
        this.pending.delete(i), s(e);
      }, ms);
      this.pending.set(i, { resolve: s, timer: r }), n.port.postMessage({ type: "stats-request", id: i });
    });
  }
}
function gs() {
  return new fs();
}
const Xe = 15, ue = (t) => {
  const e = t.mediaSession;
  return e ?? void 0;
}, ys = [
  { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
  { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" }
], Je = [
  "play",
  "pause",
  "stop",
  "nexttrack",
  "previoustrack",
  "seekforward",
  "seekbackward"
];
function ws(t, e) {
  switch (t) {
    case "play":
      return () => e.play();
    case "pause":
      return () => e.pause();
    case "stop":
      return () => e.stop();
    case "nexttrack":
      return e.next ? () => {
        var n;
        return (n = e.next) == null ? void 0 : n.call(e);
      } : null;
    case "previoustrack":
      return e.prev ? () => {
        var n;
        return (n = e.prev) == null ? void 0 : n.call(e);
      } : null;
    case "seekforward":
      return e.seekBy ? () => {
        var n;
        return (n = e.seekBy) == null ? void 0 : n.call(e, Xe);
      } : null;
    case "seekbackward":
      return e.seekBy ? () => {
        var n;
        return (n = e.seekBy) == null ? void 0 : n.call(e, -Xe);
      } : null;
    default:
      return null;
  }
}
function Mt(t, e = navigator) {
  const n = ue(e);
  if (!(n === void 0 || typeof MediaMetadata > "u"))
    try {
      n.metadata = new MediaMetadata({
        title: (t == null ? void 0 : t.name) ?? "Zonked",
        artist: "Zonked",
        album: (t == null ? void 0 : t.category) ?? "Acoustic recovery",
        artwork: ys
      });
    } catch {
    }
}
function Qe(t, e, n = navigator) {
  const s = ue(n);
  if (!(s === void 0 || typeof s.setPositionState != "function"))
    try {
      if (!Number.isFinite(t) || t <= 0 || !Number.isFinite(e)) {
        s.setPositionState();
        return;
      }
      const i = Math.min(Math.max(0, e), t);
      s.setPositionState({ duration: t, position: i, playbackRate: 1 });
    } catch {
    }
}
function bs(t, e = navigator) {
  const n = ue(e);
  if (n === void 0) return () => {
  };
  Mt(null, e);
  for (const s of Je)
    try {
      n.setActionHandler(s, ws(s, t));
    } catch {
    }
  return () => {
    var s;
    for (const i of Je)
      try {
        n.setActionHandler(i, null);
      } catch {
      }
    try {
      n.metadata = null, (s = n.setPositionState) == null || s.call(n);
    } catch {
    }
  };
}
function vs(t, e = navigator) {
  const n = ue(e);
  n !== void 0 && (n.playbackState = t ? "playing" : "paused");
}
async function et(t) {
  var n, s;
  if (!t.isPlaying()) return !1;
  const e = (s = (n = t.engine).contextState) == null ? void 0 : s.call(n);
  if (e !== "suspended" && e !== "interrupted" || t.engine.resume === void 0) return !1;
  try {
    await t.engine.resume();
  } catch {
  }
  return !0;
}
function Ss(t) {
  const e = t.doc ?? (typeof document > "u" ? void 0 : document), n = t.win ?? (typeof window > "u" ? void 0 : window), s = () => {
    var o;
    const r = (e == null ? void 0 : e.hidden) === !0;
    (o = t.onVisibility) == null || o.call(t, r), et(t);
  }, i = () => void et(t);
  return e == null || e.addEventListener("visibilitychange", s), n == null || n.addEventListener("pageshow", i), n == null || n.addEventListener("pointerdown", i), n == null || n.addEventListener("keydown", i), () => {
    e == null || e.removeEventListener("visibilitychange", s), n == null || n.removeEventListener("pageshow", i), n == null || n.removeEventListener("pointerdown", i), n == null || n.removeEventListener("keydown", i);
  };
}
const tt = "zonked.wakeLock";
class Ms {
  constructor(e = typeof navigator > "u" ? {} : navigator, n = null) {
    c(this, "sentinel", null);
    c(this, "enabled");
    c(this, "playing", !1);
    c(this, "hidden", !1);
    c(this, "pendingRequest", !1);
    this.nav = e, this.storage = n, this.enabled = this.readPref();
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
    var n;
    this.enabled = e;
    try {
      (n = this.storage) == null || n.setItem(tt, e ? "1" : "0");
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
        const n = await this.nav.wakeLock.request("screen");
        this.wanted() ? (this.sentinel = n, (e = n.addEventListener) == null || e.call(n, "release", () => {
          this.sentinel === n && (this.sentinel = null);
        })) : await n.release().catch(() => {
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
      return ((e = this.storage) == null ? void 0 : e.getItem(tt)) === "1";
    } catch {
      return !1;
    }
  }
}
const ks = ["favorites", "milestones"], Ls = "zonked", I = "scripts", _ = "logs", A = "mixes", B = "records", Es = 2, Oe = 80, $ = (t) => typeof t == "number" && Number.isFinite(t);
function nt(t) {
  if (typeof t != "object" || t === null) return !1;
  const e = t;
  return $(e.id) && typeof e.name == "string" && e.name.length >= 1 && e.name.length <= Oe && typeof e.text == "string" && e.text.length <= T.maxBytes && $(e.updatedAt);
}
function Rs(t) {
  if (typeof t != "object" || t === null) return !1;
  const e = t;
  return $(e.id) && $(e.startedAt) && $(e.endedAt) && $(e.peakScore) && typeof e.presetId == "string" && e.presetId.length <= Oe;
}
function As(t) {
  const e = { id: t.id, startedAt: t.startedAt, endedAt: t.endedAt, peakScore: t.peakScore, presetId: t.presetId }, n = t, s = n.endKind, i = n.breaks;
  return {
    ...e,
    ...s === "manual" || s === "countdown" || s === "sleep-fade" ? { endKind: s } : {},
    ...$(i) && i >= 0 && i <= 1e3 ? { breaks: Math.floor(i) } : {}
  };
}
function x(t) {
  return new Promise((e, n) => {
    t.onsuccess = () => e(t.result), t.onerror = () => n(t.error ?? new Error("IndexedDB request failed"));
  });
}
function F(t) {
  return new Promise((e, n) => {
    t.oncomplete = () => e(), t.onerror = () => n(t.error ?? new Error("IndexedDB transaction failed")), t.onabort = () => n(t.error ?? new Error("IndexedDB transaction aborted"));
  });
}
function Ts(t) {
  return new Promise((e, n) => {
    const s = t.open(Ls, Es);
    s.onupgradeneeded = () => {
      const i = s.result, r = (o) => i.objectStoreNames.contains(o);
      r(I) || i.createObjectStore(I, { keyPath: "id", autoIncrement: !0 }), r(_) || i.createObjectStore(_, { keyPath: "id", autoIncrement: !0 }), r(A) || i.createObjectStore(A, { keyPath: "id" }), r(B) || i.createObjectStore(B);
    }, s.onsuccess = () => e(s.result), s.onerror = () => n(s.error ?? new Error("IndexedDB open failed")), s.onblocked = () => n(new Error("IndexedDB open blocked"));
  });
}
function kt(t, e) {
  if (e.length > T.maxBytes) throw new RangeError("Script exceeds 256 KB");
  const n = t.trim().slice(0, Oe);
  return n.length > 0 ? n : "Untitled";
}
function Hs() {
  let t = 1;
  const e = [], n = [], s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  return {
    persistent: () => Promise.resolve(!1),
    saveScript(r, o) {
      var y;
      const a = kt(r, o), u = { id: ((y = e.find((f) => f.name === a)) == null ? void 0 : y.id) ?? t++, name: a, text: o, updatedAt: Date.now() }, m = e.findIndex((f) => f.id === u.id);
      return m >= 0 ? e[m] = u : e.push(u), Promise.resolve(u);
    },
    listScripts: () => Promise.resolve([...e].sort((r, o) => o.updatedAt - r.updatedAt)),
    deleteScript(r) {
      const o = e.findIndex((a) => a.id === r);
      return o >= 0 && e.splice(o, 1), Promise.resolve();
    },
    addLog(r) {
      return n.push({ ...r, id: t++ }), Promise.resolve();
    },
    listLogs: (r = 50) => Promise.resolve([...n].sort((o, a) => a.startedAt - o.startedAt).slice(0, r)),
    listMixes: () => Promise.resolve([...s.values()].sort((r, o) => o.updatedAt - r.updatedAt)),
    putMix(r) {
      return s.size >= Me && !s.has(r.id) ? Promise.reject(new RangeError("Too many mixes")) : (s.set(r.id, r), Promise.resolve());
    },
    deleteMix(r) {
      return s.delete(r), Promise.resolve();
    },
    getRecord: (r) => Promise.resolve(i.get(r)),
    setRecord(r, o) {
      return i.set(r, o), Promise.resolve();
    },
    clearSanctuary() {
      return s.clear(), i.clear(), n.length = 0, Promise.resolve();
    }
  };
}
function zs(t = globalThis.indexedDB) {
  const e = Hs();
  if (t === void 0) return e;
  let n = null;
  const s = () => (n ?? (n = Ts(t).catch(() => null)), n);
  return {
    persistent: async () => await s() !== null,
    async saveScript(i, r) {
      const o = await s();
      if (o === null) return e.saveScript(i, r);
      const a = kt(i, r), u = o.transaction(I, "readwrite"), m = u.objectStore(I), f = (await x(m.getAll())).filter(nt).find((z) => z.name === a), w = { name: a, text: r, updatedAt: Date.now() }, P = await x(m.put(f ? { ...w, id: f.id } : w));
      return await F(u), { ...w, id: Number(P) };
    },
    async listScripts() {
      const i = await s();
      return i === null ? e.listScripts() : (await x(i.transaction(I).objectStore(I).getAll())).filter(nt).sort((o, a) => a.updatedAt - o.updatedAt);
    },
    async deleteScript(i) {
      const r = await s();
      if (r === null) return e.deleteScript(i);
      const o = r.transaction(I, "readwrite");
      o.objectStore(I).delete(i), await F(o);
    },
    async addLog(i) {
      const r = await s();
      if (r === null) return e.addLog(i);
      const o = r.transaction(_, "readwrite");
      o.objectStore(_).add({ ...i }), await F(o);
    },
    async listLogs(i = 50) {
      const r = await s();
      return r === null ? e.listLogs(i) : (await x(r.transaction(_).objectStore(_).getAll())).filter(Rs).map(As).sort((a, u) => u.startedAt - a.startedAt).slice(0, i);
    },
    async listMixes() {
      const i = await s();
      if (i === null) return e.listMixes();
      const r = await x(i.transaction(A).objectStore(A).getAll()), o = Date.now();
      return r.map((a) => Dn(a, o)).filter((a) => a !== null).sort((a, u) => u.updatedAt - a.updatedAt).slice(0, Me);
    },
    async putMix(i) {
      const r = await s();
      if (r === null) return e.putMix(i);
      const o = r.transaction(A, "readwrite"), a = o.objectStore(A), u = await x(a.count()), m = await x(a.getKey(i.id)) !== void 0;
      if (u >= Me && !m)
        throw o.abort(), new RangeError("Too many mixes");
      a.put(i), await F(o);
    },
    async deleteMix(i) {
      const r = await s();
      if (r === null) return e.deleteMix(i);
      const o = r.transaction(A, "readwrite");
      o.objectStore(A).delete(i), await F(o);
    },
    async getRecord(i) {
      const r = await s();
      return r === null || !ks.includes(i) ? e.getRecord(i) : await x(r.transaction(B).objectStore(B).get(i));
    },
    async setRecord(i, r) {
      const o = await s();
      if (o === null) return e.setRecord(i, r);
      const a = o.transaction(B, "readwrite");
      a.objectStore(B).put(r, i), await F(a);
    },
    async clearSanctuary() {
      const i = await s();
      if (i === null) return e.clearSanctuary();
      const r = i.transaction([A, B, _], "readwrite");
      r.objectStore(A).clear(), r.objectStore(B).clear(), r.objectStore(_).clear(), await F(r);
    }
  };
}
const Cs = 5, Ns = (t) => xt(t);
let ne = null;
const Ps = () => Ne(ns);
function Os(t, e, n) {
  bs({
    // A lock-screen play only resumes after the notice was accepted once.
    play: () => {
      Ps() && !t.snapshot().playing && t.play();
    },
    pause: () => void t.stop(),
    stop: () => void t.stop(),
    seekBy: (i) => t.seekBy(i)
  }), Ss({
    engine: e,
    isPlaying: () => t.snapshot().playing,
    onVisibility: (i) => void n.setHidden(i)
  });
  let s = "";
  t.subscribe((i) => {
    const r = Math.floor(i.elapsedSec / Cs), o = `${String(i.playing)}|${i.templateId ?? ""}|${i.timer.kind}|${i.timer.phase}|${String(r)}`;
    if (o === s) return;
    s = o, vs(i.playing), Mt(i.templateName === null ? null : { name: i.templateName, category: i.templateCategory ?? "" });
    const a = t.positionState();
    a === null ? Qe(0, 0) : Qe(a.durationSec, a.positionSec), n.setPlaying(i.playing);
  });
}
function de() {
  if (ne !== null) return ne;
  const t = gs(), e = zs(), n = new An(t, bn, (i) => void e.addLog(i).catch(() => {
  }), { toEvents: Ns }), s = new Ms(void 0, ss());
  return Os(n, t, s), ne = { engine: t, player: n, store: e }, ne;
}
let re = 0;
const Re = /* @__PURE__ */ new Set(), pi = () => re > 0;
function mi(t) {
  return Re.add(t), () => void Re.delete(t);
}
function fi(t) {
  re = Math.max(0, re + (t ? 1 : -1));
  for (const e of Re) e(re > 0);
}
const gi = () => de().engine.getStats(), yi = () => de().engine.status.state, xs = "http://localhost:43210/events", Is = 7e4, _s = 1e3, Bs = 3e4, Ae = "zonked.crew.v1", Te = /* @__PURE__ */ new Set();
function Lt() {
  try {
    if (typeof location < "u" && new URLSearchParams(location.search).get("crew") === "1")
      return Pe(Ae, !0), !0;
  } catch {
  }
  return Ne(Ae);
}
function wi(t) {
  Pe(Ae, t);
  for (const e of [...Te])
    try {
      e(t);
    } catch {
    }
}
function Et(t) {
  return Te.add(t), () => {
    Te.delete(t);
  };
}
function Ds(t) {
  const e = Number.isFinite(t) ? Math.max(0, Math.floor(t)) : 0;
  return Math.min(Bs, _s * 2 ** Math.min(e, 10));
}
function Fs(t) {
  return typeof EventSource > "u" ? null : new EventSource(t);
}
class bi {
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
    this.wanted || (this.wanted = !0, this.unsub = Et(() => this.sync()), this.sync());
  }
  stop() {
    var e;
    this.wanted = !1, (e = this.unsub) == null || e.call(this), this.unsub = null, this.sync();
  }
  isEnabled() {
    return this.deps.enabled ? this.deps.enabled() : this.deps.create !== void 0 || Lt();
  }
  sync() {
    const e = this.wanted && this.isEnabled();
    e && this.stopped ? (this.stopped = !1, this.attempt = 0, this.connect()) : !e && !this.stopped && (this.stopped = !0, this.clearTimer(), this.closeSource(), this.setStatus("standalone"));
  }
  connect() {
    if (this.stopped) return;
    const e = this.deps.create ?? Fs;
    let n = null;
    try {
      n = e(this.deps.url ?? xs);
    } catch {
      n = null;
    }
    if (n === null) {
      this.scheduleRetry();
      return;
    }
    this.es = n, n.addEventListener("open", () => {
      this.es === n && (this.attempt = 0, this.setStatus("connected"));
    }), n.addEventListener("state", (s) => {
      this.es === n && this.handleState(s.data);
    }), n.addEventListener("error", () => {
      this.es === n && (this.closeSource(), this.setStatus("standalone"), this.scheduleRetry());
    });
  }
  handleState(e) {
    if (typeof e != "string" || e.length > Is) return;
    let n;
    try {
      n = JSON.parse(e);
    } catch {
      return;
    }
    const s = ut(n);
    if (s !== null)
      try {
        this.deps.onState(s);
      } catch {
      }
  }
  scheduleRetry() {
    if (this.stopped) return;
    const e = Ds(this.attempt);
    this.attempt += 1;
    const n = this.deps.setTimer ?? ((s, i) => setTimeout(s, i));
    this.timer = n(() => {
      this.timer = null, this.connect();
    }, e);
  }
  clearTimer() {
    if (this.timer === null) return;
    (this.deps.clearTimer ?? ((n) => clearTimeout(n)))(this.timer), this.timer = null;
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
const $s = "zonked.css";
function vi(t) {
  const e = new URL($s, t).href;
  if ([...document.querySelectorAll("link[data-zonked-css]")].some((i) => i.getAttribute("href") === e)) return;
  const s = document.createElement("link");
  s.rel = "stylesheet", s.href = e, s.setAttribute("data-zonked-css", "1"), document.head.appendChild(s);
}
const Ws = "/apps/zonked/api/state", Ks = 15e3;
let He = null, st = null, ce = "standalone", ze = "";
const Ce = /* @__PURE__ */ new Set(), Si = () => ce;
function Mi(t) {
  return Ce.add(t), () => void Ce.delete(t);
}
function Rt(t) {
  if (t !== ce) {
    ce = t;
    for (const e of [...Ce]) e(t);
  }
}
function be() {
  ce === "connected" && de().player.crewLost(), Un(), ze = "", Rt("standalone");
}
async function ve() {
  if (He === null || !Lt()) return be();
  try {
    const t = await He.get(Ws), e = ut(t.crew);
    if (e === null) return be();
    Rt("connected");
    const n = JSON.stringify([e.burnout, e.target, e.why ?? ""]);
    if (n === ze) return;
    ze = n, Kn(de().player, e);
  } catch {
    be();
  }
}
function Us(t) {
  He = t, st === null && (st = setInterval(() => void ve(), Ks), Et(() => void ve()), ve());
}
function ki() {
  const t = Ht.useAppApi, e = t === void 0 ? null : t();
  it(() => {
    e !== null && Us(e);
  }, [e]);
}
export {
  ki as A,
  bi as B,
  Vs as C,
  li as D,
  Js as E,
  ai as F,
  Ys as G,
  fi as H,
  Si as I,
  pi as J,
  Mi as K,
  ci as L,
  Ee as M,
  mi as N,
  wi as O,
  Se as P,
  yi as Q,
  gi as R,
  ns as S,
  Gs as T,
  Zs as U,
  Xs as V,
  De as W,
  ei as X,
  ti as Y,
  oi as a,
  di as b,
  Qn as c,
  ui as d,
  es as e,
  ri as f,
  Qs as g,
  ii as h,
  de as i,
  Ps as j,
  Lt as k,
  si as l,
  ni as m,
  Kn as n,
  Et as o,
  ut as p,
  Un as q,
  qn as r,
  le as s,
  D as t,
  hi as u,
  p as v,
  Pe as w,
  lt as x,
  N as y,
  vi as z
};
