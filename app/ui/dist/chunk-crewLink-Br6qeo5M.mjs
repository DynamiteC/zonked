var Mt = Object.defineProperty;
var kt = (n, e, t) => e in n ? Mt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var c = (n, e, t) => kt(n, typeof e != "symbol" ? e + "" : e, t);
import * as Lt from "@kirocrew/app-sdk";
import { useState as Ce, useEffect as Qe } from "react";
const Y = {
  level: { min: 0, max: 1 },
  instRootHz: { min: 55, max: 880 },
  padRootHz: { min: 55, max: 440 },
  bpm: { min: 30, max: 180 },
  chimeRatePerMin: { min: 1, max: 30 },
  breathRateHz: { min: 0.05, max: 0.2 },
  panRateHz: { min: 0.02, max: 0.2 },
  enumMax: 7,
  instKindMax: 3
}, T = Object.freeze({
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
}), A = {
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
}, Et = 200, Rt = 10, At = 0.5, Tt = 0.3, w = (n, e, t) => Number.isFinite(n) ? Math.min(t, Math.max(e, n)) : e, k = (n) => w(n, Y.level.min, Y.level.max), W = (n, e) => Math.round(w(n, 0, e));
function Ht(n) {
  const e = { ...T, ...n }, t = Y;
  return {
    lofiLevel: k(e.lofiLevel),
    lofiWarmth: k(e.lofiWarmth),
    crackle: k(e.crackle),
    instLevel: k(e.instLevel),
    instKind: W(e.instKind, t.instKindMax),
    instRootHz: w(e.instRootHz, t.instRootHz.min, t.instRootHz.max),
    instScale: W(e.instScale, t.enumMax),
    instBpm: w(e.instBpm, t.bpm.min, t.bpm.max),
    padLevel: k(e.padLevel),
    padChord: W(e.padChord, t.enumMax),
    padRootHz: w(e.padRootHz, t.padRootHz.min, t.padRootHz.max),
    chimeLevel: k(e.chimeLevel),
    chimeRatePerMin: w(e.chimeRatePerMin, t.chimeRatePerMin.min, t.chimeRatePerMin.max),
    percLevel: k(e.percLevel),
    percBpm: w(e.percBpm, t.bpm.min, t.bpm.max),
    percPattern: W(e.percPattern, t.enumMax),
    lofiProgression: W(e.lofiProgression, t.enumMax),
    tapeWow: k(e.tapeWow),
    pianoPedal: k(e.pianoPedal),
    breathDepth: k(e.breathDepth),
    breathRateHz: w(e.breathRateHz, t.breathRateHz.min, t.breathRateHz.max),
    stereoWidth: k(e.stereoWidth),
    panDepth: k(e.panDepth),
    panRateHz: w(e.panRateHz, t.panRateHz.min, t.panRateHz.max)
  };
}
function Oe(n, e, t) {
  return {
    tSec: e,
    voice: {
      carrierHz: w(n.carrierHz, l.carrierMin, l.carrierMax),
      beatHz: w(n.beatHz, l.beatMin, l.beatMax),
      noise: n.noise,
      noiseLevel: w(n.noiseLevel, l.noiseMin, l.noiseMax),
      mode: n.mode,
      gain: w(n.gain, l.gainMin, l.gainMax),
      layers: Ht(n.layers)
    },
    ramp: n.ramp,
    line: t
  };
}
function zt(n) {
  let t = 0;
  const s = n.stages.slice(0, 499).map((a, o) => {
    const u = Number.isFinite(a.atMin) ? a.atMin * 60 : 0;
    return t = w(Math.max(t, u), 0, l.maxTimeSec), Oe(a, t, o + 1);
  }), i = n.stages[Math.min(n.stages.length, 499) - 1];
  if (i === void 0) return s;
  const r = w(Math.max(t, n.recommendedMinutes * 60), 0, l.maxTimeSec);
  return s.push(Oe({ ...i, ramp: !1 }, r, s.length + 1)), s;
}
const Os = {
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
  stepOf: (n) => `${n} of 3`,
  selected: "Selected",
  playAgain: "Play again",
  close: "Close",
  endTitle: "Done for now.",
  endLine: (n, e) => `${n} played for ${e < 1 ? "under a minute" : e === 1 ? "1 minute" : `${e} minutes`}.`,
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
  dayZero: (n) => `Day 0 of ${n}, you are ready`,
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
  settingsTitle: "Settings",
  gentle: "Keep sounds extra gentle",
  gentleHint: "Picks softer sounds and keeps the screen still.",
  reduceMotion: "Reduce motion",
  themeLabel: "Off keeps the dark night look.",
  themeLight: "Use the day look",
  contrast: "High contrast",
  contrastHint: "Black and white with thicker lines.",
  weekOf: (n) => `${n} of 7 days`,
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
  sounds: (n) => `${n} ${n === 1 ? "sound" : "sounds"}`
}, Ns = {
  focus: "Focus",
  calm: "Calm down",
  sleep: "Sleep",
  study: "Study",
  recover: "Recover after work",
  curious: "Just curious"
}, Is = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
  anytime: "Anytime"
}, xs = {
  headphones: "Headphones",
  speakers: "Speakers",
  bluetooth: "Bluetooth",
  unsure: "Not sure"
}, _s = [
  { id: "deep-work", label: "Focus", mood: "Steady and quiet", icon: "target" },
  { id: "adhd-focus", label: "Steady attention", mood: "Even and plain", icon: "wave" },
  { id: "ai-burnout", label: "Recover", mood: "Slow and soft", icon: "leaf" },
  { id: "heal-stress", label: "Calm down", mood: "Warm and gentle", icon: "heart" },
  { id: "cant-sleep", label: "Sleep", mood: "Dim and slow", icon: "moon" },
  { id: "lucid-dream", label: "Dream", mood: "Drifting", icon: "cloud" },
  { id: "meditate", label: "Meditate", mood: "Open and still", icon: "lotus" },
  { id: "quick-reset", label: "Quick reset", mood: "Short and light", icon: "bolt" }
], Bs = {
  strong: "Several studies exist.",
  mixed: "Studies disagree.",
  preliminary: "Early, small studies.",
  limited: "Very little research.",
  preference: "People simply like it."
};
function Ds(n) {
  return n >= 5 && n < 12 ? "Good morning." : n >= 12 && n < 17 ? "Good afternoon." : n >= 17 && n < 21 ? "Good evening." : "Hello, night owl.";
}
function Pt(n) {
  let e = 0;
  for (let t = 0; t < n.length; t++) {
    const s = n.charCodeAt(t);
    if (s < 128) e += 1;
    else if (s < 2048) e += 2;
    else if (s >= 55296 && s <= 56319 && t + 1 < n.length) {
      const i = n.charCodeAt(t + 1);
      i >= 56320 && i <= 57343 ? (e += 4, t++) : e += 3;
    } else e += 3;
  }
  return e;
}
function Ct(n) {
  return n === 32 || n === 9 || n === 11 || n === 12 || n === 160;
}
function Ot(n) {
  const e = [];
  let t = -1;
  for (let s = 0; s < n.length; s++) {
    const i = n.charCodeAt(s);
    if (i === 35)
      return t >= 0 && e.push(n.slice(t, s)), e;
    Ct(i) ? (t >= 0 && e.push(n.slice(t, s)), t = -1) : t < 0 && (t = s);
  }
  return t >= 0 && e.push(n.slice(t)), e;
}
function Nt(n) {
  const e = [];
  let t = n.charCodeAt(0) === 65279 ? 1 : 0, s = 1, i = t;
  const r = (a) => {
    const o = a - i;
    if (o > A.maxLineLength)
      e.push({ line: s, tokens: [], tooLong: !0 });
    else if (o > 0) {
      const u = Ot(n.slice(i, a));
      u.length > 0 && e.push({ line: s, tokens: u, tooLong: !1 });
    }
  };
  for (; t < n.length; t++) {
    const a = n.charCodeAt(t);
    (a === 10 || a === 13) && (r(t), a === 13 && n.charCodeAt(t + 1) === 10 && t++, s++, i = t + 1);
  }
  return r(n.length), e;
}
const It = {
  carrierHz: 200,
  beatHz: 10,
  noise: "off",
  noiseLevel: 0,
  mode: "binaural",
  gain: 0
};
function j(n, e, t) {
  return n < e ? e : n > t ? t : n;
}
function xt(n, e) {
  const t = Number.isFinite(e) ? e : 0;
  let s = 0, i = n.length - 1, r = -1;
  for (; s <= i; ) {
    const a = s + i >> 1, o = n[a];
    o !== void 0 && o.tSec <= t ? (r = a, s = a + 1) : i = a - 1;
  }
  return r;
}
function et(n) {
  const e = n[n.length - 1];
  return e === void 0 ? 0 : e.tSec;
}
function U(n, e, t) {
  return n + (e - n) * t;
}
const _t = /* @__PURE__ */ new Set(["instKind", "instScale", "padChord", "percPattern", "lofiProgression"]);
function Bt(n, e, t) {
  if (n === void 0 && e === void 0) return;
  const s = n ?? T, i = e ?? T, r = {};
  for (const a of Object.keys(T))
    r[a] = _t.has(a) ? t >= 1 ? i[a] : s[a] : U(s[a], i[a], t);
  return r;
}
function Dt(n, e, t) {
  const s = Bt(n.layers, e.layers, t);
  return {
    carrierHz: j(U(n.carrierHz, e.carrierHz, t), l.carrierMin, l.carrierMax),
    beatHz: j(U(n.beatHz, e.beatHz, t), l.beatMin, l.beatMax),
    noise: n.noise === "off" ? e.noise : n.noise,
    noiseLevel: j(U(n.noiseLevel, e.noiseLevel, t), l.noiseMin, l.noiseMax),
    mode: n.mode,
    gain: j(U(n.gain, e.gain, t), l.gainMin, l.gainMax),
    ...s !== void 0 ? { layers: s } : {}
  };
}
function le(n, e) {
  const t = xt(n, e), s = n[Math.max(0, t)];
  if (s === void 0) return It;
  const i = n[t + 1];
  if (t < 0 || !s.ramp || i === void 0) return s.voice;
  const r = Number.isFinite(e) ? e : 0, a = i.tSec - s.tSec;
  return a > 0 ? Dt(s.voice, i.voice, j((r - s.tSec) / a, 0, 1)) : i.voice;
}
const Ft = /^[+-]?[0-9]{1,15}(?:\.[0-9]{1,15})?$/, Kt = /^[0-9]{1,2}:[0-9]{1,2}(?::[0-9]{1,2})?$/, Wt = /^[A-Za-z_][A-Za-z0-9_-]{0,31}$/, Ne = 24;
function K(n) {
  return n.length > Ne ? `${n.slice(0, Ne)}...` : n;
}
function g(n, e, t, s) {
  t === "error" && n.errors++, n.diags.length < l.maxDiagnostics ? n.diags.push({ line: e, severity: t, message: s }) : n.diags.length === l.maxDiagnostics && n.diags.push({ line: e, severity: "warning", message: "Too many diagnostics, further messages dropped" });
}
function te(n) {
  if (!Ft.test(n)) return null;
  const e = Number(n);
  return Number.isFinite(e) ? e : null;
}
function ne(n, e, t, s, i, r) {
  if (s >= i && s <= r) return s;
  const a = s < i ? i : r;
  return g(n, e, "warning", `${t} ${s} out of range, clamped to ${a}`), a;
}
function tt(n) {
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
function $t(n) {
  const e = n.toLowerCase();
  return e === "pink" || e === "white" || e === "brown" || e === "violet" ? e : null;
}
function qt(n, e, t, s) {
  const i = t.indexOf("/"), r = i < 0 ? t : t.slice(0, i);
  let a = -1;
  for (let H = 0; H < r.length && a < 0; H++) {
    const Pe = r[H];
    (Pe === "@" || Pe === "+" && H > 0) && (a = H);
  }
  const o = a < 0 ? r : r.slice(0, a), u = a < 0 ? "" : r.slice(a + 1), m = o === "" ? null : te(o), y = u === "" ? null : te(u), f = i < 0 ? null : te(t.slice(i + 1)), b = o !== "" && m === null, P = a >= 0 && y === null, F = i >= 0 && f === null;
  return b || P || F || r === "" ? !1 : (m !== null && (s.carrier = ne(n, e, "carrier", m, l.carrierMin, l.carrierMax)), y !== null && (s.beat = ne(n, e, "beat", y, l.beatMin, l.beatMax)), f !== null && (s.gain = ne(n, e, "gain", f, l.gainMin, l.gainMax)), !0);
}
function jt(n, e, t, s) {
  const i = t.indexOf("/"), r = $t(i < 0 ? t : t.slice(0, i));
  if (r === null) return !1;
  let a = Tt;
  if (i >= 0) {
    const o = te(t.slice(i + 1));
    if (o === null) return !1;
    a = ne(n, e, "noise level", o / 100, l.noiseMin, l.noiseMax);
  }
  return s.noise = r, s.noiseLevel = a, !0;
}
function Ut(n, e, t, s) {
  const i = tt(t);
  if (i !== null) s.mode = i;
  else {
    if (jt(n, e, t, s)) return;
    qt(n, e, t, s) || g(n, e, "warning", `Unknown token "${K(t)}" skipped`);
  }
}
function Vt(n, e) {
  const s = !(e.carrier !== void 0 || e.beat !== void 0 || e.gain !== void 0) && e.noise !== void 0;
  return {
    carrierHz: e.carrier ?? Et,
    beatHz: e.beat ?? Rt,
    noise: e.noise ?? "off",
    noiseLevel: e.noiseLevel ?? 0,
    mode: e.mode ?? n.mode,
    gain: s ? 0 : e.gain ?? At
  };
}
function Yt(n, e) {
  const t = e.tokens[0] ?? "", s = t.indexOf(":"), i = t.slice(0, s), r = e.tokens.slice(1);
  if (s < t.length - 1 && r.unshift(t.slice(s + 1)), i.toLowerCase() === "mode") {
    const o = r[0] === void 0 ? null : tt(r[0]);
    o === null ? g(n, e.line, "warning", "mode expects iso, mono or bin; ignored") : n.mode = o;
    return;
  }
  if (!Wt.test(i)) {
    g(n, e.line, "warning", `Invalid tone-set name "${K(i)}", line skipped`);
    return;
  }
  const a = {};
  for (const o of r) Ut(n, e.line, o, a);
  r.length === 0 && g(n, e.line, "warning", `Tone-set "${i}" has no parameters, defaults used`), n.defs.set(i, Vt(n, a));
}
function Gt(n) {
  if (n === "NOW") return 0;
  if (!Kt.test(n)) return null;
  const e = n.split(":").map(Number), [t = 0, s = 0, i = 0] = e.length === 2 ? [e[0], e[1], 0] : e;
  return s > 59 || i > 59 ? null : t * 3600 + s * 60 + i;
}
function Zt(n, e) {
  const [t = "", s, ...i] = e.tokens, r = Gt(t);
  if (r === null) return g(n, e.line, "error", `Invalid time "${K(t)}", expected HH:MM:SS`);
  if (r > l.maxTimeSec) return g(n, e.line, "error", "Time exceeds 24 hours");
  if (r < n.lastT) return g(n, e.line, "error", "Times must not decrease");
  if (s === void 0) return g(n, e.line, "warning", "Sequence line has no tone-set name, skipped");
  let a = s, o = !1;
  a.endsWith("->") && (o = !0, a = a.slice(0, -2));
  for (const m of i)
    m === "->" && !o ? o = !0 : g(n, e.line, "warning", `Unknown token "${K(m)}" skipped`);
  const u = n.defs.get(a);
  if (u === void 0) return g(n, e.line, "warning", `Unknown tone-set "${K(a)}", line skipped`);
  if (n.events.length >= A.maxEvents)
    return n.stop = !0, g(n, e.line, "error", `More than ${A.maxEvents} events, parsing stopped`);
  n.lastT = r, n.events.push({ tSec: r, voice: u, ramp: o, line: e.line });
}
function Xt(n) {
  return n === "NOW" || n.charCodeAt(0) >= 48 && n.charCodeAt(0) <= 57 && n.includes(":");
}
function Jt(n, e) {
  const t = e.tokens[0] ?? "";
  Xt(t) ? Zt(n, e) : t.includes(":") ? Yt(n, e) : g(n, e.line, "warning", `Unknown token "${K(t)}", line skipped`);
}
function ue(n) {
  return {
    events: n.events,
    durationSec: et(n.events),
    diagnostics: n.diags,
    ok: n.errors === 0
  };
}
function Qt() {
  return { diags: [], errors: 0, defs: /* @__PURE__ */ new Map(), mode: "binaural", events: [], lastT: 0, stop: !1 };
}
function Z(n) {
  const e = Qt();
  try {
    if (typeof n != "string")
      return g(e, 1, "error", "Input must be a string"), ue(e);
    if (n.length > A.maxBytes || Pt(n) > A.maxBytes)
      return g(e, 1, "error", `Input exceeds ${A.maxBytes} bytes, not parsed`), ue(e);
    for (const t of Nt(n))
      if (t.tooLong ? g(e, t.line, "error", `Line longer than ${A.maxLineLength} characters`) : Jt(e, t), e.stop) break;
    e.events.length === 0 && e.errors === 0 && g(e, 1, "warning", "No sequence events found");
  } catch (t) {
    g(e, 1, "error", `Internal parser error: ${t instanceof Error ? t.message : "unknown"}`);
  }
  return ue(e);
}
const en = `# Deep Focus: 40 Hz gamma binaural beat on a 200 Hz carrier.
mode: bin
focus: 200+40/0.4
00:00:00 focus
`, tn = `# Flow State: 18 Hz beta on a 220 Hz carrier.
mode: bin
flow: 220+18/0.4
00:00:00 flow
`, nn = `# AI Burnout Reset: 10 Hz alpha glides to 6 Hz theta over 20 minutes,
# with a soft pink noise bed. Gain stays low for tired ears.
mode: bin
alpha: 200+10/0.35 pink/15
theta: 200+6/0.35 pink/20
00:00:00 alpha ->
00:20:00 theta
`, sn = `# Breathwork Sync: 5.5 Hz theta, 5.5 breaths per minute.
mode: bin
breathe: 180+5.5/0.4
00:00:00 breathe
`, rn = `# Deep Rest: 2.5 Hz delta on a low 150 Hz carrier.
mode: bin
rest: 150+2.5/0.35 brown/10
00:00:00 rest
`, an = `# ts - SBaGen style demo sequence, 1998 vintage.
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
`, be = [
  {
    id: "deep-focus",
    name: "Deep Focus",
    description: "40 Hz gamma beat for concentrated work.",
    sbg: en
  },
  {
    id: "flow-state",
    name: "Flow State",
    description: "18 Hz beta beat for steady, engaged flow.",
    sbg: tn
  },
  {
    id: "burnout-reset",
    name: "AI Burnout Reset",
    description: "10 Hz alpha gliding to 6 Hz theta over 20 minutes with soft pink noise.",
    sbg: nn
  },
  {
    id: "breathwork-sync",
    name: "Breathwork Sync",
    description: "5.5 Hz theta with a 6-breath guided pacer at 5.5 breaths per minute.",
    sbg: sn,
    breath: { inSec: 5.45, outSec: 5.45 }
  },
  {
    id: "deep-rest",
    name: "Deep Rest",
    description: "2.5 Hz delta beat for deep rest.",
    sbg: rn
  },
  {
    id: "classic-1998",
    name: "Classic 1998 SBaGen Demo",
    description: "A 15 minute SBaGen-style demo with timed ramps.",
    sbg: an
  }
], de = "zonked.timer.v1", on = 2.5, Ie = 0.1, xe = 6, C = { countdownMin: 30, sleepMin: 30, focusMin: 25, breakMin: 5 }, cn = 1, ln = 720, un = 500, he = ["none", "countdown", "sleep-fade", "pomodoro"], dn = { kind: "none", running: !1, remainingSec: 0, totalSec: 0 }, X = (n, e) => typeof n == "number" && Number.isFinite(n) ? Math.min(ln, Math.max(cn, n)) : e;
class hn {
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
    var s;
    const e = ((s = this.spec) == null ? void 0 : s.kind) ?? "none", t = he[(he.indexOf(e) + 1) % he.length] ?? "none";
    return t === "none" ? this.stop() : t === "countdown" ? this.start({ kind: "countdown", minutes: C.countdownMin }) : t === "sleep-fade" ? this.start({ kind: "sleep-fade", minutes: C.sleepMin }) : this.start({ kind: "pomodoro" });
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
    const t = this.segmentMs(), s = Math.min(1, this.elapsedMs / t);
    if (this.elapsedMs <= t) return { gainScale: 1 - (1 - Ie) * s, beatMix: s };
    const i = Math.min(1, (this.elapsedMs - t) / (xe * 1e3));
    return { gainScale: Ie * (1 - i), beatMix: 1 };
  }
  normalize(e) {
    if (e.kind === "pomodoro") {
      const t = e.longEvery !== void 0 && Number.isFinite(e.longEvery) ? Math.max(2, Math.floor(e.longEvery)) : void 0;
      return {
        kind: "pomodoro",
        focusMin: X(e.focusMin, C.focusMin),
        breakMin: X(e.breakMin, C.breakMin),
        ...e.longBreakMin !== void 0 && t !== void 0 ? { longBreakMin: X(e.longBreakMin, 15), longEvery: t } : {}
      };
    }
    return { kind: e.kind, minutes: X(e.minutes, e.kind === "countdown" ? C.countdownMin : C.sleepMin) };
  }
  /** Length of the current segment in ms (phase length for pomodoro, N minutes otherwise). */
  segmentMs() {
    const e = this.spec;
    return e === null ? 0 : e.kind !== "pomodoro" ? e.minutes * 6e4 : this.phase === "focus" ? (e.focusMin ?? C.focusMin) * 6e4 : (e.longBreakMin !== void 0 && e.longEvery !== void 0 && this.cycle % e.longEvery === 0 ? e.longBreakMin ?? 0 : e.breakMin ?? C.breakMin) * 6e4;
  }
  run() {
    this.running = !0, this.lastMs = this.clock.now(), this.startPoll();
  }
  startPoll() {
    this.poll === null && (this.poll = this.clock.setInterval(() => void this.changed(), un));
  }
  stopPoll() {
    this.poll !== null && this.clock.clearInterval(this.poll), this.poll = null;
  }
  advance() {
    if (!this.running || this.spec === null) return;
    const e = this.clock.now(), t = Math.max(0, e - this.lastMs);
    this.lastMs = e, this.elapsedMs += t;
    const s = this.spec;
    s.kind === "pomodoro" ? this.rollPomodoro() : s.kind === "countdown" && this.elapsedMs >= this.segmentMs() ? this.finish("countdown") : s.kind === "sleep-fade" && this.elapsedMs >= this.segmentMs() + xe * 1e3 && this.finish("sleep-fade");
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
    if (e === null) return dn;
    const t = this.segmentMs() / 1e3, s = Math.max(0, Math.ceil(t - this.elapsedMs / 1e3));
    if (e.kind === "pomodoro")
      return {
        kind: "pomodoro",
        running: this.running,
        remainingSec: s,
        totalSec: t,
        phase: this.phase,
        cycle: this.cycle,
        focusMin: e.focusMin,
        breakMin: e.breakMin
      };
    const i = { kind: e.kind, running: this.running, remainingSec: s, totalSec: t };
    return e.kind === "sleep-fade" && this.elapsedMs > this.segmentMs() ? { ...i, finalFade: !0 } : i;
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
          this.storage.removeItem(de);
          return;
        }
        const e = { v: 1, spec: this.spec, elapsedMs: this.elapsedMs, phase: this.phase, cycle: this.cycle };
        this.storage.setItem(de, JSON.stringify(e));
      } catch {
      }
  }
  restore() {
    if (this.storage !== null)
      try {
        const e = this.storage.getItem(de);
        if (e === null) return;
        const t = JSON.parse(e);
        if (t.v !== 1 || t.spec === void 0 || t.spec === null || typeof t.spec != "object" || !["countdown", "sleep-fade", "pomodoro"].includes(t.spec.kind)) return;
        this.spec = this.normalize(t.spec), this.phase = t.phase === "break" ? "break" : "focus", this.cycle = typeof t.cycle == "number" && Number.isFinite(t.cycle) ? Math.max(1, Math.floor(t.cycle)) : 1;
        const s = typeof t.elapsedMs == "number" && Number.isFinite(t.elapsedMs) ? t.elapsedMs : 0;
        this.elapsedMs = Math.min(Math.max(0, s), Math.max(0, this.segmentMs() - 1)), this.running = !1;
      } catch {
        this.spec = null;
      }
  }
}
const pn = {
  now: () => Date.now(),
  setInterval: (n, e) => window.setInterval(n, e),
  clearInterval: (n) => window.clearInterval(n)
}, _e = ["off", "white", "pink", "brown", "violet"], E = 0.85, mn = 8, fn = 3;
function nt(n, e) {
  const t = Number.isFinite(e) ? e : T[n], s = Y;
  switch (n) {
    case "instRootHz":
      return h(t, s.instRootHz.min, s.instRootHz.max);
    case "padRootHz":
      return h(t, s.padRootHz.min, s.padRootHz.max);
    case "instBpm":
    case "percBpm":
      return h(t, s.bpm.min, s.bpm.max);
    case "chimeRatePerMin":
      return h(t, s.chimeRatePerMin.min, s.chimeRatePerMin.max);
    case "breathRateHz":
      return h(t, s.breathRateHz.min, s.breathRateHz.max);
    case "panRateHz":
      return h(t, s.panRateHz.min, s.panRateHz.max);
    case "instKind":
      return Math.round(h(t, 0, s.instKindMax));
    case "instScale":
    case "padChord":
    case "lofiProgression":
    case "percPattern":
      return Math.round(h(t, 0, s.enumMax));
    default:
      return h(t, s.level.min, s.level.max);
  }
}
const gn = 100, Be = 0.25, yn = 3, bn = 0.02, pe = (n, e, t) => n + (e - n) * t, h = (n, e, t) => n < e ? e : n > t ? t : n, $ = (n, e) => Number.isFinite(n) ? n : e;
function vn() {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}
function wn(n, e, t) {
  return {
    ...e,
    carrierHz: pe(n.carrierHz, e.carrierHz, t),
    beatHz: pe(n.beatHz, e.beatHz, t),
    gain: pe(n.gain, e.gain, t)
  };
}
function De(n) {
  return be.find((e) => e.id === n) ?? be[0];
}
class Sn {
  constructor(e, t, s, i = {}) {
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
    this.engine = e, this.clock = t, this.onSession = s, this.toEvents = i.toEvents, this.timers = new hn(t, i.storage === void 0 ? vn() : i.storage), this.timers.subscribe(() => {
      const u = this.timers.state().phase;
      this.playing && u === "break" && this.lastPhase !== "break" && (this.breakCount += 1), this.lastPhase = u, this.emit();
    }), this.timers.onEnd = (u) => {
      this.endKind = u, this.stop();
    };
    const r = De(((o = be[0]) == null ? void 0 : o.id) ?? "");
    this.presetId = r.id;
    const a = Z(r.sbg).events;
    this.base = le(a, 0), this.current = this.base, this.userCeiling = h(this.base.gain, 0, E), this.crewLevel = this.userCeiling, this.heardRaw = this.userCeiling, this.mode = { kind: "script", events: a, startMs: t.now() };
  }
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  snapshot() {
    var e, t, s;
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
    const t = (s = this.template) == null ? void 0 : s.id;
    this.queueIndex = t === void 0 ? -1 : this.queue.findIndex((i) => i.id === t), this.emit();
  }
  /** Plays a template through the injected toEvents. Resolves false when it cannot be played. */
  async playTemplate(e) {
    const t = this.queue.findIndex((s) => s.id === e.id);
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
    const i = ((this.queueIndex < 0 ? e === 1 ? -1 : 0 : this.queueIndex) + e + t) % t, r = this.queue[i];
    return r === void 0 ? !1 : this.playAt(r, i);
  }
  async playAt(e, t) {
    var i;
    const s = ((i = this.toEvents) == null ? void 0 : i.call(this, e)) ?? [];
    return s.length === 0 ? !1 : (this.overridden = !0, this.source = "template", this.template = e, this.queueIndex = t, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(s), this.playing || await this.play(), !0);
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
    const t = this.base.gain, s = Math.round((this.gainTrim + e) * 1e3) / 1e3, i = this.gainTrim;
    this.gainTrim = h(s, -t, Math.max(0, E - t)), this.captureUserLevel(this.gainTrim - i), this.applyNow();
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
    for (const [s, i] of Object.entries(e))
      Object.hasOwn(T, s) && typeof i == "number" && (t[s] = nt(s, i));
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
      const t = typeof e.noise == "string" && _e.includes(e.noise) ? e.noise : void 0, s = typeof e.noiseLevel == "number" && Number.isFinite(e.noiseLevel) ? h(e.noiseLevel, 0, 1) : void 0;
      if (t === void 0 && s === void 0) return;
      this.noiseOverride = { ...t !== void 0 ? { noise: t } : {}, ...s !== void 0 ? { noiseLevel: s } : {} };
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
    const e = this.base, t = this.timers.state(), s = this.source === "template" && this.template !== null ? { kind: "template", id: this.template.id } : this.source === "preset" ? { kind: "preset", id: this.presetId } : { kind: "custom", id: "custom" }, i = t.kind === "countdown" || t.kind === "sleep-fade" ? { kind: t.kind, minutes: Math.max(1, Math.round(t.totalSec / 60)) } : t.kind === "pomodoro" ? { kind: "pomodoro", focusMin: t.focusMin ?? 25, breakMin: t.breakMin ?? 5 } : { kind: "none" };
    return {
      source: s,
      voice: {
        carrierHz: e.carrierHz,
        beatHz: e.beatHz,
        mode: e.mode,
        noise: e.noise,
        noiseLevel: e.noiseLevel,
        gain: h(e.gain + this.gainTrim, 0, E)
      },
      layers: { ...e.layers ?? {}, ...this.layerOverrides },
      timer: i,
      ...this.beatOverride !== null ? { beatOverride: this.beatOverride } : {},
      ...this.noiseOverride !== null ? { noiseOverride: this.noiseOverride } : {}
    };
  }
  /** Plays a mix that was already validated by parseMix or makeMix. The caller shows the safety gate first. */
  playMix(e) {
    const t = e.voice, s = {
      carrierHz: h(t.carrierHz, 20, 1500),
      beatHz: h(t.beatHz, 0.5, 40),
      mode: t.mode,
      noise: t.noise,
      noiseLevel: h(t.noiseLevel, 0, 1),
      gain: h(t.gain, 0, E),
      layers: { ...T, ...e.layers }
    };
    this.overridden = !0, this.source = "custom", this.presetId = `mix:${e.id}`.slice(0, 80), this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.layerOverrides = {}, e.beatOverride !== void 0 && (this.beatOverride = h(e.beatOverride, 0.5, 40));
    const i = e.noiseOverride;
    if (i !== void 0) {
      const a = i.noise !== void 0 && _e.includes(i.noise) ? i.noise : void 0, o = i.noiseLevel !== void 0 && Number.isFinite(i.noiseLevel) ? h(i.noiseLevel, 0, 1) : void 0;
      this.noiseOverride = { ...a !== void 0 ? { noise: a } : {}, ...o !== void 0 ? { noiseLevel: o } : {} };
    }
    this.startScript([{ tSec: 0, voice: s, ramp: !1, line: 0 }]);
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
    const s = this.scriptDuration(t.events), i = this.playing ? (this.clock.now() - t.startMs) / 1e3 : 0;
    return { durationSec: s, positionSec: h(i, 0, s) };
  }
  /** Seeks within the active timer, or the template timeline. Clamped to its bounds. */
  seekBy(e) {
    if (Number.isFinite(e)) {
      if (this.timers.state().kind !== "none")
        this.timers.seekBy(e);
      else if (this.mode.kind === "script" && this.template !== null) {
        const t = this.mode, s = this.scriptDuration(t.events), i = h((this.clock.now() - t.startMs) / 1e3 + e, 0, s);
        this.mode = { ...t, startMs: this.clock.now() - i * 1e3 };
      }
      this.applyNow();
    }
  }
  scriptDuration(e) {
    var s;
    const t = et(e);
    return t > 0 ? t : Math.max(60, (((s = this.template) == null ? void 0 : s.recommendedMinutes) ?? 1) * 60);
  }
  /** Recomputes the effective voice and pushes it to the engine when playing. */
  applyNow() {
    this.current = this.effective(this.base), this.playing && this.engine.setVoice(this.current, Be), this.emit();
  }
  effective(e) {
    const t = this.timers.effects();
    this.gainScale = t.gainScale;
    const s = e.beatHz + (on - e.beatHz) * t.beatMix, i = Math.min(s, mn), r = h(s + (i - s) * this.breakMix, 0.5, 40), a = this.beatOverride ?? r, o = this.noiseOverride, u = h(e.gain + this.gainTrim, 0, E), m = this.source === "crew" ? Math.min(u, this.crewLevel, this.userCeiling) : u;
    this.heardRaw = m;
    const y = this.muted ? 0 : m, b = Object.keys(this.layerOverrides).length > 0 ? { ...e.layers ?? T, ...this.layerOverrides } : e.layers;
    return {
      ...e,
      beatHz: a,
      ...(o == null ? void 0 : o.noise) !== void 0 ? { noise: o.noise } : {},
      ...(o == null ? void 0 : o.noiseLevel) !== void 0 ? { noiseLevel: o.noiseLevel } : {},
      // Defense in depth: a non-finite gain (forged crew state) is silence, never NaN.
      gain: $(Math.min(E, y * t.gainScale), 0),
      ...b !== void 0 ? { layers: b } : {}
    };
  }
  slewBreak(e) {
    const t = Math.max(0, e - this.lastTickMs);
    if (this.lastTickMs = e, this.source === "crew") {
      const r = Math.min(h(this.base.gain + this.gainTrim, 0, E), this.userCeiling);
      this.crewLevel = r > this.crewLevel ? Math.min(r, this.crewLevel + bn * t / 1e3) : r;
    }
    const s = this.timers.state().phase === "break" ? 1 : 0, i = t / (fn * 1e3);
    this.breakMix = s > this.breakMix ? Math.min(s, this.breakMix + i) : Math.max(s, this.breakMix - i);
  }
  /** Manual preset choice. Overrides the crew until followCrew(). */
  selectPreset(e) {
    const t = De(e);
    this.overridden = !0, this.presetId = t.id, this.source = "preset", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(Z(t.sbg).events);
  }
  /** Parses and plays custom text. Returns diagnostics; nothing plays when it has errors. */
  async playCustom(e) {
    const t = Z(e);
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
    const t = (s = this.engine.status) == null ? void 0 : s.state;
    if (t !== void 0 && t !== "running") {
      this.emit();
      return;
    }
    this.playing = !0, this.startedAt = e, this.peak = this.burnout ?? 0, this.endKind = "manual", this.breakCount = 0, this.lastPhase = this.timers.state().phase, this.timer = this.clock.setInterval(() => this.tick(), gn), this.timers.resume(), this.emit();
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
    this.base = this.voiceNow(e), this.slewBreak(e), this.current = this.effective(this.base), this.playing && (this.engine.setVoice(this.current, Be), this.emit());
  }
  voiceNow(e) {
    const t = this.mode;
    if (t.kind === "hold") return t.voice;
    if (t.kind === "script") return le(t.events, (e - t.startMs) / 1e3);
    const s = Math.min(1, Math.max(0, (e - t.startMs) / t.durMs));
    return s >= 1 ? (this.mode = { kind: "hold", voice: t.to }, t.to) : wn(t.from, t.to, s);
  }
  restartModeClock(e) {
    const t = this.mode;
    t.kind !== "hold" && (this.mode = { ...t, startMs: e });
  }
  startScript(e) {
    this.mode = { kind: "script", events: e, startMs: this.clock.now() }, this.base = le(e, 0), this.captureFromBase(), this.current = this.effective(this.base), this.playing && this.engine.setVoice(this.current, yn), this.emit();
  }
  enterCrew(e) {
    const t = this.clock.now();
    this.source = "crew", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.crewLevel = Math.min(this.heardRaw, this.userCeiling);
    const s = e.sbg === null ? null : Z(e.sbg);
    if (s !== null && s.ok && s.events.length > 0)
      this.mode = { kind: "script", events: s.events, startMs: t };
    else {
      const i = e.target, r = {
        ...this.base,
        carrierHz: h($(i.carrierHz, this.base.carrierHz), 20, 1500),
        beatHz: h($(i.beatHz, this.base.beatHz), 0.5, 40),
        gain: h($(i.gain, 0), 0, E)
      };
      this.mode = { kind: "transition", from: this.base, to: r, startMs: t, durMs: h($(i.transitionSec, 5), 0.1, 600) * 1e3 };
    }
    this.emit();
  }
  emit() {
    const e = this.snapshot();
    for (const t of this.listeners) t(e);
  }
}
const Mn = 1, ve = 200, kn = 60, me = 240, st = ["off", "white", "pink", "brown", "violet"], Ln = ["binaural", "monaural", "isochronic"], En = ["template", "preset", "custom", "mix"], Rn = ["none", "countdown", "sleep-fade", "pomodoro"], we = (n, e, t) => n < e ? e : n > t ? t : n;
function _(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
function p(n, e) {
  return Object.hasOwn(n, e) ? n[e] : void 0;
}
function z(n, e, t, s) {
  return typeof n == "number" && Number.isFinite(n) ? we(n, e, t) : s;
}
function An(n, e) {
  if (typeof n != "string") return e;
  const t = n.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, kn);
  return t.length > 0 ? t : e;
}
function it(n) {
  return typeof n == "string" && /^[A-Za-z0-9_.:-]{1,64}$/.test(n) ? n : null;
}
function ie(n, e, t) {
  return typeof n == "string" && e.includes(n) ? n : t;
}
function Tn(n) {
  return _(n) ? {
    carrierHz: z(p(n, "carrierHz"), l.carrierMin, l.carrierMax, 200),
    beatHz: z(p(n, "beatHz"), l.beatMin, l.beatMax, 10),
    mode: ie(p(n, "mode"), Ln, "binaural"),
    noise: ie(p(n, "noise"), st, "off"),
    noiseLevel: z(p(n, "noiseLevel"), l.noiseMin, l.noiseMax, 0),
    gain: z(p(n, "gain"), l.gainMin, l.gainMax, 0.3)
  } : null;
}
function Hn(n) {
  const e = {};
  if (!_(n)) return e;
  for (const t of Object.keys(T)) {
    const s = p(n, t);
    typeof s == "number" && Number.isFinite(s) && (e[t] = nt(t, s));
  }
  return e;
}
function zn(n) {
  if (!_(n)) return { kind: "none" };
  const e = ie(p(n, "kind"), Rn, "none");
  return e === "countdown" || e === "sleep-fade" ? { kind: e, minutes: Math.round(z(p(n, "minutes"), 1, me, 30)) } : e === "pomodoro" ? {
    kind: e,
    focusMin: Math.round(z(p(n, "focusMin"), 1, me, 25)),
    breakMin: Math.round(z(p(n, "breakMin"), 1, me, 5))
  } : { kind: "none" };
}
function Pn(n) {
  return _(n) ? { kind: ie(p(n, "kind"), En, "custom"), id: it(p(n, "id")) ?? "custom" } : { kind: "custom", id: "custom" };
}
function Cn(n) {
  if (!_(n)) return null;
  const e = Tn(p(n, "voice"));
  if (e === null) return null;
  const t = p(n, "beatOverride"), s = p(n, "noiseOverride"), i = _(s) ? p(s, "noise") : void 0, r = _(s) ? p(s, "noiseLevel") : void 0, a = {
    ...typeof i == "string" && st.includes(i) ? { noise: i } : {},
    ...typeof r == "number" && Number.isFinite(r) ? { noiseLevel: we(r, l.noiseMin, l.noiseMax) } : {}
  };
  return {
    source: Pn(p(n, "source")),
    voice: e,
    layers: Hn(p(n, "layers")),
    timer: zn(p(n, "timer")),
    ...typeof t == "number" && Number.isFinite(t) ? { beatOverride: we(t, l.beatMin, l.beatMax) } : {},
    ...Object.keys(a).length > 0 ? { noiseOverride: a } : {}
  };
}
function On(n, e) {
  if (!_(n) || p(n, "v") !== Mn) return null;
  const t = it(p(n, "id")), s = Cn(n);
  if (t === null || s === null) return null;
  const i = z(p(n, "createdAt"), 0, e + 864e5, e), r = z(p(n, "updatedAt"), 0, e + 864e5, i);
  return { ...s, v: 1, id: t, name: An(p(n, "name"), "My mix"), createdAt: i, updatedAt: r };
}
const Nn = "zonked.safety.v1", Fe = "zonked.reduceMotion";
function Te(n, e = rt()) {
  try {
    return (e == null ? void 0 : e.getItem(n)) === "1";
  } catch {
    return !1;
  }
}
function He(n, e, t = rt()) {
  try {
    t == null || t.setItem(n, e ? "1" : "0");
  } catch {
  }
}
function rt() {
  try {
    return typeof localStorage > "u" ? void 0 : localStorage;
  } catch {
    return;
  }
}
function In() {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}
function Fs() {
  const [n, e] = Ce(() => Te(Fe)), [t, s] = Ce(() => {
    var r;
    return ((r = window.matchMedia) == null ? void 0 : r.call(window, "(prefers-reduced-motion: reduce)").matches) ?? !1;
  });
  return Qe(() => {
    var o;
    const r = (o = window.matchMedia) == null ? void 0 : o.call(window, "(prefers-reduced-motion: reduce)");
    if (r === void 0) return;
    const a = () => s(r.matches);
    return r.addEventListener("change", a), () => r.removeEventListener("change", a);
  }, []), [n || t, (r) => {
    He(Fe, r), e(r);
  }, n];
}
const xn = "" + new URL("assets/worklet-CT8dHE_F.js", import.meta.url).href, _n = new URL(new URL("assets/dsp_core.wasm.json", import.meta.url).href).href, M = {
  carrierHz: { min: 20, max: 1500, def: 200 },
  beatHz: { min: 0.5, max: 40, def: 10 },
  gain: { min: 0, max: 0.85 },
  noiseLevel: { min: 0, max: 1 },
  rampSec: { min: 0.05, max: 30, def: 0.05 }
}, re = 32, d = {
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
}, Bn = 4 + re * 4;
function S(n, e, t, s) {
  return typeof n != "number" || !Number.isFinite(n) ? s : n < e ? e : n > t ? t : n;
}
const at = (n, e = M.carrierHz.def) => S(n, M.carrierHz.min, M.carrierHz.max, e), ot = (n, e = M.beatHz.def) => S(n, M.beatHz.min, M.beatHz.max, e), ct = (n, e = 0) => S(n, M.gain.min, M.gain.max, e), lt = (n, e = 0) => S(n, M.noiseLevel.min, M.noiseLevel.max, e), ut = (n, e = M.rampSec.def) => S(n, M.rampSec.min, M.rampSec.max, e), v = Y, L = (n, e) => S(n, v.level.min, v.level.max, e), J = (n, e = 0) => S(typeof n == "number" ? Math.round(n) : n, 0, v.enumMax, e), Ke = (n, e) => S(n, v.bpm.min, v.bpm.max, e);
function dt(n) {
  const e = T, t = n ?? e;
  return {
    lofiLevel: L(t.lofiLevel, e.lofiLevel),
    lofiWarmth: L(t.lofiWarmth, e.lofiWarmth),
    crackle: L(t.crackle, e.crackle),
    instLevel: L(t.instLevel, e.instLevel),
    instKind: S(typeof t.instKind == "number" ? Math.round(t.instKind) : t.instKind, 0, v.instKindMax, e.instKind),
    instRootHz: S(t.instRootHz, v.instRootHz.min, v.instRootHz.max, e.instRootHz),
    instScale: J(t.instScale, e.instScale),
    instBpm: Ke(t.instBpm, e.instBpm),
    padLevel: L(t.padLevel, e.padLevel),
    padChord: J(t.padChord, e.padChord),
    padRootHz: S(t.padRootHz, v.padRootHz.min, v.padRootHz.max, e.padRootHz),
    chimeLevel: L(t.chimeLevel, e.chimeLevel),
    chimeRatePerMin: S(t.chimeRatePerMin, v.chimeRatePerMin.min, v.chimeRatePerMin.max, e.chimeRatePerMin),
    percLevel: L(t.percLevel, e.percLevel),
    percBpm: Ke(t.percBpm, e.percBpm),
    percPattern: J(t.percPattern, e.percPattern),
    lofiProgression: J(t.lofiProgression, e.lofiProgression),
    tapeWow: L(t.tapeWow, e.tapeWow),
    pianoPedal: L(t.pianoPedal, e.pianoPedal),
    breathDepth: L(t.breathDepth, e.breathDepth),
    breathRateHz: S(t.breathRateHz, v.breathRateHz.min, v.breathRateHz.max, e.breathRateHz),
    stereoWidth: L(t.stereoWidth, e.stereoWidth),
    panDepth: L(t.panDepth, e.panDepth),
    panRateHz: S(t.panRateHz, v.panRateHz.min, v.panRateHz.max, e.panRateHz)
  };
}
const ht = { binaural: 0, monaural: 1, isochronic: 2 }, pt = { off: 0, white: 1, pink: 2, brown: 3, violet: 4 };
function Dn(n, e) {
  e[d.lofiLevel] = n.lofiLevel, e[d.lofiWarmth] = n.lofiWarmth, e[d.crackle] = n.crackle, e[d.instLevel] = n.instLevel, e[d.instKind] = n.instKind, e[d.instRootHz] = n.instRootHz, e[d.instScale] = n.instScale, e[d.instBpm] = n.instBpm, e[d.padLevel] = n.padLevel, e[d.padChord] = n.padChord, e[d.padRootHz] = n.padRootHz, e[d.chimeLevel] = n.chimeLevel, e[d.chimeRatePerMin] = n.chimeRatePerMin, e[d.percLevel] = n.percLevel, e[d.percBpm] = n.percBpm, e[d.percPattern] = n.percPattern, e[d.lofiProgression] = n.lofiProgression, e[d.tapeWow] = n.tapeWow, e[d.pianoPedal] = n.pianoPedal, e[d.breathDepth] = n.breathDepth, e[d.breathRateHz] = n.breathRateHz, e[d.stereoWidth] = n.stereoWidth, e[d.panDepth] = n.panDepth, e[d.panRateHz] = n.panRateHz;
}
function Fn(n, e, t) {
  return t[d.carrierHz] = at(n.carrierHz), t[d.beatHz] = ot(n.beatHz), t[d.gain] = ct(n.gain), t[d.mode] = ht[n.mode] ?? 0, t[d.noiseKind] = pt[n.noise] ?? 0, t[d.noiseLevel] = lt(n.noiseLevel), t[d.rampSec] = ut(e), t[d.reserved] = 0, Dn(dt(n.layers), t), t;
}
function We(n, e) {
  return {
    carrierHz: at(n.carrierHz, e == null ? void 0 : e.carrierHz),
    beatHz: ot(n.beatHz, e == null ? void 0 : e.beatHz),
    noise: n.noise in pt ? n.noise : (e == null ? void 0 : e.noise) ?? "off",
    noiseLevel: lt(n.noiseLevel, e == null ? void 0 : e.noiseLevel),
    mode: n.mode in ht ? n.mode : (e == null ? void 0 : e.mode) ?? "binaural",
    gain: ct(n.gain, e == null ? void 0 : e.gain),
    ...n.layers !== void 0 ? { layers: dt(n.layers) } : {}
  };
}
class Kn {
  constructor(e) {
    c(this, "seq");
    c(this, "data");
    this.seq = new Int32Array(e, 0, 1), this.data = new Float32Array(e, 4, re);
  }
  write(e) {
    Atomics.add(this.seq, 0, 1);
    for (let t = 0; t < re; t++) this.data[t] = e[t] ?? 0;
    Atomics.add(this.seq, 0, 1);
  }
}
let mt = null;
function Wn(n) {
  mt = n;
}
function Ks() {
  return mt;
}
const Se = 0.85, Ws = 2, $s = 0.3, qs = 0.15, js = 0.4, $n = 0.6, $e = 0.95, G = (n, e, t) => n < e ? e : n > t ? t : n;
function qn(n, e = 0) {
  return Number.isFinite(n) ? G(n, 0, Se) : G(Number.isFinite(e) ? e : 0, 0, Se);
}
function jn(n, e = 0) {
  return Number.isFinite(n) ? G(n, 0, 1) : G(Number.isFinite(e) ? e : 0, 0, 1);
}
function Us(n) {
  return 1 - $n * jn(n);
}
function Vs(n) {
  return qn(n) / Se;
}
function Un(n = 2049) {
  const e = Math.max(3, n | 0), t = new Float32Array(e);
  for (let s = 0; s < e; s++) t[s] = G(s / (e - 1) * 2 - 1, -$e, $e);
  return t;
}
const V = 8192, Vn = V - 1, ft = 8, Yn = ft + V * 2 * 4;
function Gn(n) {
  return new SharedArrayBuffer(Yn);
}
class Zn {
  constructor(e) {
    c(this, "idx");
    c(this, "ring");
    this.idx = new Int32Array(e, 0, 2), this.ring = new Float32Array(e, ft, V * 2);
  }
  read(e) {
    const t = Atomics.load(this.idx, 0), s = Atomics.load(this.idx, 1);
    let i = t - s | 0;
    if (i <= 0) return 0;
    i > V && (i = V);
    const r = Math.min(i, e.length >> 1);
    let a = t - r | 0;
    for (let o = 0; o < r; o++) {
      const u = (a & Vn) * 2;
      e[o * 2] = this.ring[u] ?? 0, e[o * 2 + 1] = this.ring[u + 1] ?? 0, a = a + 1 | 0;
    }
    return Atomics.store(this.idx, 1, t), r;
  }
}
const qe = { read: () => 0 }, Q = 2, je = 0.3, Xn = 1e3;
class Jn {
  constructor() {
    c(this, "_status");
    c(this, "listeners", /* @__PURE__ */ new Set());
    c(this, "ctx", null);
    c(this, "node", null);
    c(this, "master", null);
    c(this, "writer", null);
    c(this, "tele", qe);
    c(this, "voice", null);
    c(this, "startedAt", 0);
    c(this, "statsId", 0);
    c(this, "pending", /* @__PURE__ */ new Map());
    c(this, "pendingStart", null);
    c(this, "pendingStop", null);
    c(this, "block", new Float32Array(re));
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
      this.voice = We(e), this.pushVoice(this.voice, Q), this.startedAt = t.currentTime;
      const s = this.master.gain;
      s.cancelScheduledValues(t.currentTime), s.setValueAtTime(0, t.currentTime), s.linearRampToValueAtTime(1, t.currentTime + Q), await t.resume(), this.setStatus({ state: "running" });
    } catch (t) {
      this.setStatus({ state: "error", error: t instanceof Error ? t.message : String(t) });
    }
  }
  async build() {
    const e = new AudioContext({ latencyHint: "interactive" });
    this.ctx = e, await e.audioWorklet.addModule(xn);
    const t = await fetch(_n);
    if (!t.ok) throw new Error(`wasm fetch failed: ${t.status}`);
    const s = await t.arrayBuffer(), i = typeof SharedArrayBuffer < "u" && this._status.crossOriginIsolated, r = i ? new SharedArrayBuffer(Bn) : void 0, a = i ? Gn() : void 0, o = new AudioWorkletNode(e, "zonked-dsp", { numberOfInputs: 0, outputChannelCount: [2] }), u = new Promise((b, P) => {
      o.port.onmessage = (F) => {
        const H = F.data;
        H.type === "ready" ? b() : H.type === "error" ? P(new Error(H.message ?? "worklet init failed")) : this.onWorkletMessage(F.data);
      };
    });
    o.port.postMessage({ type: "init", wasm: s, sab: r, tele: a, sampleRate: e.sampleRate }), await u, o.port.onmessage = (b) => this.onWorkletMessage(b.data);
    const m = e.createGain();
    m.gain.value = 0;
    const y = e.createGain(), f = e.createWaveShaper();
    f.curve = Un(), o.connect(y).connect(m).connect(f).connect(e.destination), Wn({ ctx: e, input: m, duck: y }), this.node = o, this.master = m, this.writer = r ? new Kn(r) : null, this.tele = a ? new Zn(a) : qe, this.setStatus({ sampleRate: e.sampleRate, usesSharedMemory: i });
  }
  onWorkletMessage(e) {
    if (e.type === "stats") {
      const t = e.id, s = this.pending.get(t);
      if (!s) return;
      clearTimeout(s.timer), this.pending.delete(t), s.resolve({
        peak: Number(e.peak),
        rms: Number(e.rms),
        frames: Number(e.frames),
        nonZero: Number(e.nonZero)
      });
    } else e.type === "error" && this.setStatus({ state: "error", error: String(e.message) });
  }
  pushVoice(e, t) {
    var s;
    Fn(e, t, this.block), this.writer !== null ? this.writer.write(this.block) : (s = this.node) == null || s.port.postMessage({ type: "params", p: new Float32Array(this.block) });
  }
  setVoice(e, t) {
    this.voice = We(e, this.voice ?? void 0);
    let s = ut(t ?? 0.05);
    this.ctx !== null && this.ctx.currentTime - this.startedAt < 2 * Q && (s = Math.max(s, Q)), this.pushVoice(this.voice, s);
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
    const t = (s = this.master) == null ? void 0 : s.gain;
    t && (t.cancelScheduledValues(e.currentTime), t.setValueAtTime(t.value, e.currentTime), t.linearRampToValueAtTime(0, e.currentTime + je)), await new Promise((i) => setTimeout(i, je * 1e3 + 50));
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
    const e = { peak: 0, rms: 0, frames: 0, nonZero: 0 }, t = this.node;
    return t === null ? Promise.resolve(e) : new Promise((s) => {
      const i = ++this.statsId, r = setTimeout(() => {
        this.pending.delete(i), s(e);
      }, Xn);
      this.pending.set(i, { resolve: s, timer: r }), t.port.postMessage({ type: "stats-request", id: i });
    });
  }
}
function Qn() {
  return new Jn();
}
const Ue = 15, oe = (n) => {
  const e = n.mediaSession;
  return e ?? void 0;
}, es = [
  { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
  { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" }
], Ve = [
  "play",
  "pause",
  "stop",
  "nexttrack",
  "previoustrack",
  "seekforward",
  "seekbackward"
];
function ts(n, e) {
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
        return (t = e.seekBy) == null ? void 0 : t.call(e, Ue);
      } : null;
    case "seekbackward":
      return e.seekBy ? () => {
        var t;
        return (t = e.seekBy) == null ? void 0 : t.call(e, -Ue);
      } : null;
    default:
      return null;
  }
}
function gt(n, e = navigator) {
  const t = oe(e);
  if (!(t === void 0 || typeof MediaMetadata > "u"))
    try {
      t.metadata = new MediaMetadata({
        title: (n == null ? void 0 : n.name) ?? "Zonked",
        artist: "Zonked",
        album: (n == null ? void 0 : n.category) ?? "Acoustic recovery",
        artwork: es
      });
    } catch {
    }
}
function Ye(n, e, t = navigator) {
  const s = oe(t);
  if (!(s === void 0 || typeof s.setPositionState != "function"))
    try {
      if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(e)) {
        s.setPositionState();
        return;
      }
      const i = Math.min(Math.max(0, e), n);
      s.setPositionState({ duration: n, position: i, playbackRate: 1 });
    } catch {
    }
}
function ns(n, e = navigator) {
  const t = oe(e);
  if (t === void 0) return () => {
  };
  gt(null, e);
  for (const s of Ve)
    try {
      t.setActionHandler(s, ts(s, n));
    } catch {
    }
  return () => {
    var s;
    for (const i of Ve)
      try {
        t.setActionHandler(i, null);
      } catch {
      }
    try {
      t.metadata = null, (s = t.setPositionState) == null || s.call(t);
    } catch {
    }
  };
}
function ss(n, e = navigator) {
  const t = oe(e);
  t !== void 0 && (t.playbackState = n ? "playing" : "paused");
}
async function Ge(n) {
  var t, s;
  if (!n.isPlaying()) return !1;
  const e = (s = (t = n.engine).contextState) == null ? void 0 : s.call(t);
  if (e !== "suspended" && e !== "interrupted" || n.engine.resume === void 0) return !1;
  try {
    await n.engine.resume();
  } catch {
  }
  return !0;
}
function is(n) {
  const e = n.doc ?? (typeof document > "u" ? void 0 : document), t = n.win ?? (typeof window > "u" ? void 0 : window), s = () => {
    var a;
    const r = (e == null ? void 0 : e.hidden) === !0;
    (a = n.onVisibility) == null || a.call(n, r), Ge(n);
  }, i = () => void Ge(n);
  return e == null || e.addEventListener("visibilitychange", s), t == null || t.addEventListener("pageshow", i), t == null || t.addEventListener("pointerdown", i), t == null || t.addEventListener("keydown", i), () => {
    e == null || e.removeEventListener("visibilitychange", s), t == null || t.removeEventListener("pageshow", i), t == null || t.removeEventListener("pointerdown", i), t == null || t.removeEventListener("keydown", i);
  };
}
const Ze = "zonked.wakeLock";
class rs {
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
      (t = this.storage) == null || t.setItem(Ze, e ? "1" : "0");
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
      return ((e = this.storage) == null ? void 0 : e.getItem(Ze)) === "1";
    } catch {
      return !1;
    }
  }
}
const as = ["favorites", "milestones"], os = "zonked", N = "scripts", I = "logs", R = "mixes", x = "records", cs = 2, ze = 80, D = (n) => typeof n == "number" && Number.isFinite(n);
function Xe(n) {
  if (typeof n != "object" || n === null) return !1;
  const e = n;
  return D(e.id) && typeof e.name == "string" && e.name.length >= 1 && e.name.length <= ze && typeof e.text == "string" && e.text.length <= A.maxBytes && D(e.updatedAt);
}
function ls(n) {
  if (typeof n != "object" || n === null) return !1;
  const e = n;
  return D(e.id) && D(e.startedAt) && D(e.endedAt) && D(e.peakScore) && typeof e.presetId == "string" && e.presetId.length <= ze;
}
function us(n) {
  const e = { id: n.id, startedAt: n.startedAt, endedAt: n.endedAt, peakScore: n.peakScore, presetId: n.presetId }, t = n, s = t.endKind, i = t.breaks;
  return {
    ...e,
    ...s === "manual" || s === "countdown" || s === "sleep-fade" ? { endKind: s } : {},
    ...D(i) && i >= 0 && i <= 1e3 ? { breaks: Math.floor(i) } : {}
  };
}
function O(n) {
  return new Promise((e, t) => {
    n.onsuccess = () => e(n.result), n.onerror = () => t(n.error ?? new Error("IndexedDB request failed"));
  });
}
function B(n) {
  return new Promise((e, t) => {
    n.oncomplete = () => e(), n.onerror = () => t(n.error ?? new Error("IndexedDB transaction failed")), n.onabort = () => t(n.error ?? new Error("IndexedDB transaction aborted"));
  });
}
function ds(n) {
  return new Promise((e, t) => {
    const s = n.open(os, cs);
    s.onupgradeneeded = () => {
      const i = s.result, r = (a) => i.objectStoreNames.contains(a);
      r(N) || i.createObjectStore(N, { keyPath: "id", autoIncrement: !0 }), r(I) || i.createObjectStore(I, { keyPath: "id", autoIncrement: !0 }), r(R) || i.createObjectStore(R, { keyPath: "id" }), r(x) || i.createObjectStore(x);
    }, s.onsuccess = () => e(s.result), s.onerror = () => t(s.error ?? new Error("IndexedDB open failed")), s.onblocked = () => t(new Error("IndexedDB open blocked"));
  });
}
function yt(n, e) {
  if (e.length > A.maxBytes) throw new RangeError("Script exceeds 256 KB");
  const t = n.trim().slice(0, ze);
  return t.length > 0 ? t : "Untitled";
}
function hs() {
  let n = 1;
  const e = [], t = [], s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  return {
    persistent: () => Promise.resolve(!1),
    saveScript(r, a) {
      var y;
      const o = yt(r, a), u = { id: ((y = e.find((f) => f.name === o)) == null ? void 0 : y.id) ?? n++, name: o, text: a, updatedAt: Date.now() }, m = e.findIndex((f) => f.id === u.id);
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
    listMixes: () => Promise.resolve([...s.values()].sort((r, a) => a.updatedAt - r.updatedAt)),
    putMix(r) {
      return s.size >= ve && !s.has(r.id) ? Promise.reject(new RangeError("Too many mixes")) : (s.set(r.id, r), Promise.resolve());
    },
    deleteMix(r) {
      return s.delete(r), Promise.resolve();
    },
    getRecord: (r) => Promise.resolve(i.get(r)),
    setRecord(r, a) {
      return i.set(r, a), Promise.resolve();
    },
    clearSanctuary() {
      return s.clear(), i.clear(), t.length = 0, Promise.resolve();
    }
  };
}
function ps(n = globalThis.indexedDB) {
  const e = hs();
  if (n === void 0) return e;
  let t = null;
  const s = () => (t ?? (t = ds(n).catch(() => null)), t);
  return {
    persistent: async () => await s() !== null,
    async saveScript(i, r) {
      const a = await s();
      if (a === null) return e.saveScript(i, r);
      const o = yt(i, r), u = a.transaction(N, "readwrite"), m = u.objectStore(N), f = (await O(m.getAll())).filter(Xe).find((F) => F.name === o), b = { name: o, text: r, updatedAt: Date.now() }, P = await O(m.put(f ? { ...b, id: f.id } : b));
      return await B(u), { ...b, id: Number(P) };
    },
    async listScripts() {
      const i = await s();
      return i === null ? e.listScripts() : (await O(i.transaction(N).objectStore(N).getAll())).filter(Xe).sort((a, o) => o.updatedAt - a.updatedAt);
    },
    async deleteScript(i) {
      const r = await s();
      if (r === null) return e.deleteScript(i);
      const a = r.transaction(N, "readwrite");
      a.objectStore(N).delete(i), await B(a);
    },
    async addLog(i) {
      const r = await s();
      if (r === null) return e.addLog(i);
      const a = r.transaction(I, "readwrite");
      a.objectStore(I).add({ ...i }), await B(a);
    },
    async listLogs(i = 50) {
      const r = await s();
      return r === null ? e.listLogs(i) : (await O(r.transaction(I).objectStore(I).getAll())).filter(ls).map(us).sort((o, u) => u.startedAt - o.startedAt).slice(0, i);
    },
    async listMixes() {
      const i = await s();
      if (i === null) return e.listMixes();
      const r = await O(i.transaction(R).objectStore(R).getAll()), a = Date.now();
      return r.map((o) => On(o, a)).filter((o) => o !== null).sort((o, u) => u.updatedAt - o.updatedAt).slice(0, ve);
    },
    async putMix(i) {
      const r = await s();
      if (r === null) return e.putMix(i);
      const a = r.transaction(R, "readwrite"), o = a.objectStore(R), u = await O(o.count()), m = await O(o.getKey(i.id)) !== void 0;
      if (u >= ve && !m)
        throw a.abort(), new RangeError("Too many mixes");
      o.put(i), await B(a);
    },
    async deleteMix(i) {
      const r = await s();
      if (r === null) return e.deleteMix(i);
      const a = r.transaction(R, "readwrite");
      a.objectStore(R).delete(i), await B(a);
    },
    async getRecord(i) {
      const r = await s();
      return r === null || !as.includes(i) ? e.getRecord(i) : await O(r.transaction(x).objectStore(x).get(i));
    },
    async setRecord(i, r) {
      const a = await s();
      if (a === null) return e.setRecord(i, r);
      const o = a.transaction(x, "readwrite");
      o.objectStore(x).put(r, i), await B(o);
    },
    async clearSanctuary() {
      const i = await s();
      if (i === null) return e.clearSanctuary();
      const r = i.transaction([R, x, I], "readwrite");
      r.objectStore(R).clear(), r.objectStore(x).clear(), r.objectStore(I).clear(), await B(r);
    }
  };
}
const ms = 5, fs = (n) => zt(n);
let ee = null;
const gs = () => Te(Nn);
function ys(n, e, t) {
  ns({
    // A lock-screen play only resumes after the notice was accepted once.
    play: () => {
      gs() && !n.snapshot().playing && n.play();
    },
    pause: () => void n.stop(),
    stop: () => void n.stop(),
    seekBy: (i) => n.seekBy(i)
  }), is({
    engine: e,
    isPlaying: () => n.snapshot().playing,
    onVisibility: (i) => void t.setHidden(i)
  });
  let s = "";
  n.subscribe((i) => {
    const r = Math.floor(i.elapsedSec / ms), a = `${String(i.playing)}|${i.templateId ?? ""}|${i.timer.kind}|${i.timer.phase}|${String(r)}`;
    if (a === s) return;
    s = a, ss(i.playing), gt(i.templateName === null ? null : { name: i.templateName, category: i.templateCategory ?? "" });
    const o = n.positionState();
    o === null ? Ye(0, 0) : Ye(o.durationSec, o.positionSec), t.setPlaying(i.playing);
  });
}
function ce() {
  if (ee !== null) return ee;
  const n = Qn(), e = ps(), t = new Sn(n, pn, (i) => void e.addLog(i).catch(() => {
  }), { toEvents: fs }), s = new rs(void 0, In());
  return ys(t, n, s), ee = { engine: n, player: t, store: e }, ee;
}
let se = 0;
const Me = /* @__PURE__ */ new Set(), Ys = () => se > 0;
function Gs(n) {
  return Me.add(n), () => void Me.delete(n);
}
function Zs(n) {
  se = Math.max(0, se + (n ? 1 : -1));
  for (const e of Me) e(se > 0);
}
const Xs = () => ce().engine.getStats(), Js = () => ce().engine.status.state, bs = 5, vs = 600;
function q(n, e, t) {
  return Math.min(t, Math.max(e, n));
}
function fe(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
function ws(n) {
  return n < 40 ? "focus" : n < 60 ? "flow" : n < 80 ? "recovery" : "decompress";
}
function bt(n) {
  if (!fe(n) || n.version !== 1) return null;
  const e = n.burnout, t = n.target;
  if (!fe(e) || !fe(t)) return null;
  const s = e.score, i = t.beatHz, r = t.carrierHz, a = t.gain, o = t.transitionSec;
  if (![s, i, r, a, o].every((P) => typeof P == "number" && Number.isFinite(P)))
    return null;
  const u = q(s, 0, 100), m = ws(u), y = t.presetId, f = n.sbg, b = n.at;
  return {
    version: 1,
    at: typeof b == "number" && Number.isFinite(b) ? Math.trunc(b) : 0,
    burnout: { score: u, level: m },
    target: {
      ...typeof y == "string" && y.length > 0 && y.length <= 64 ? { presetId: y } : {},
      beatHz: q(i, l.beatMin, l.beatMax),
      carrierHz: q(r, l.carrierMin, l.carrierMax),
      gain: q(a, l.gainMin, l.gainMax),
      transitionSec: q(o, bs, vs),
      breathe: t.breathe === !0
    },
    sbg: typeof f == "string" && f.length <= A.maxBytes ? f : null
  };
}
const Ss = "http://localhost:43210/events", Ms = 7e4, ks = 1e3, Ls = 3e4, ke = "zonked.crew.v1", Le = /* @__PURE__ */ new Set();
function vt() {
  try {
    if (typeof location < "u" && new URLSearchParams(location.search).get("crew") === "1")
      return He(ke, !0), !0;
  } catch {
  }
  return Te(ke);
}
function Qs(n) {
  He(ke, n);
  for (const e of [...Le])
    try {
      e(n);
    } catch {
    }
}
function wt(n) {
  return Le.add(n), () => {
    Le.delete(n);
  };
}
function Es(n) {
  const e = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  return Math.min(Ls, ks * 2 ** Math.min(e, 10));
}
function Rs(n) {
  return typeof EventSource > "u" ? null : new EventSource(n);
}
class ei {
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
    this.wanted || (this.wanted = !0, this.unsub = wt(() => this.sync()), this.sync());
  }
  stop() {
    var e;
    this.wanted = !1, (e = this.unsub) == null || e.call(this), this.unsub = null, this.sync();
  }
  isEnabled() {
    return this.deps.enabled ? this.deps.enabled() : this.deps.create !== void 0 || vt();
  }
  sync() {
    const e = this.wanted && this.isEnabled();
    e && this.stopped ? (this.stopped = !1, this.attempt = 0, this.connect()) : !e && !this.stopped && (this.stopped = !0, this.clearTimer(), this.closeSource(), this.setStatus("standalone"));
  }
  connect() {
    if (this.stopped) return;
    const e = this.deps.create ?? Rs;
    let t = null;
    try {
      t = e(this.deps.url ?? Ss);
    } catch {
      t = null;
    }
    if (t === null) {
      this.scheduleRetry();
      return;
    }
    this.es = t, t.addEventListener("open", () => {
      this.es === t && (this.attempt = 0, this.setStatus("connected"));
    }), t.addEventListener("state", (s) => {
      this.es === t && this.handleState(s.data);
    }), t.addEventListener("error", () => {
      this.es === t && (this.closeSource(), this.setStatus("standalone"), this.scheduleRetry());
    });
  }
  handleState(e) {
    if (typeof e != "string" || e.length > Ms) return;
    let t;
    try {
      t = JSON.parse(e);
    } catch {
      return;
    }
    const s = bt(t);
    if (s !== null)
      try {
        this.deps.onState(s);
      } catch {
      }
  }
  scheduleRetry() {
    if (this.stopped) return;
    const e = Es(this.attempt);
    this.attempt += 1;
    const t = this.deps.setTimer ?? ((s, i) => setTimeout(s, i));
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
const As = "zonked.css";
function ti(n) {
  const e = new URL(As, n).href;
  if ([...document.querySelectorAll("link[data-zonked-css]")].some((i) => i.getAttribute("href") === e)) return;
  const s = document.createElement("link");
  s.rel = "stylesheet", s.href = e, s.setAttribute("data-zonked-css", "1"), document.head.appendChild(s);
}
const Ts = "/apps/zonked/api/state", Hs = 15e3;
let Ee = null, Je = null, ae = "standalone", Re = "";
const Ae = /* @__PURE__ */ new Set(), ni = () => ae;
function si(n) {
  return Ae.add(n), () => void Ae.delete(n);
}
function St(n) {
  if (n !== ae) {
    ae = n;
    for (const e of [...Ae]) e(n);
  }
}
function ge() {
  ae === "connected" && ce().player.crewLost(), Re = "", St("standalone");
}
async function ye() {
  if (Ee === null || !vt()) return ge();
  try {
    const n = await Ee.get(Ts), e = bt(n.crew);
    if (e === null) return ge();
    St("connected");
    const t = JSON.stringify([e.burnout, e.target]);
    if (t === Re) return;
    Re = t, ce().player.applyCrew(e);
  } catch {
    ge();
  }
}
function zs(n) {
  Ee = n, Je === null && (Je = setInterval(() => void ye(), Hs), wt(() => void ye()), ye());
}
function ii() {
  const n = Lt.useAppApi, e = n === void 0 ? null : n();
  Qe(() => {
    e !== null && zs(e);
  }, [e]);
}
export {
  Vs as A,
  ei as B,
  Os as C,
  xs as D,
  Bs as E,
  _s as F,
  Ns as G,
  jn as H,
  Ks as I,
  qs as L,
  Se as M,
  Nn as S,
  Is as T,
  ce as a,
  vt as b,
  _ as c,
  it as d,
  ti as e,
  p as f,
  Ds as g,
  ii as h,
  gs as i,
  ni as j,
  Ys as k,
  si as l,
  Gs as m,
  z as n,
  wt as o,
  Qs as p,
  Js as q,
  Xs as r,
  Zs as s,
  $s as t,
  Fs as u,
  Us as v,
  He as w,
  js as x,
  qn as y,
  Ws as z
};
