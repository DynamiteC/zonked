import { jsxs as b, jsx as c } from "react/jsx-runtime";
import { useRef as B, useEffect as T, useMemo as W, useState as S, useCallback as N, lazy as R, Suspense as he } from "react";
import { g as fe, i as ze, u as Ee, w as Ce, S as Oe, a as De, o as He, B as Pe, b as oe, f as H, c as ye, n as Ie, d as je } from "./chunk-crewLink-CNIjqEIV.mjs";
function Fe(e) {
  const t = Math.max(0, Math.ceil(e)), n = Math.floor(t / 60), s = Math.floor(n / 60), i = (a) => String(a).padStart(2, "0");
  return s > 0 ? `${s}:${i(n % 60)}:${i(t % 60)}` : `${i(n)}:${i(t % 60)}`;
}
const m = {
  brand: "Zonked",
  promise: "Free. Private. No account.",
  skip: "Skip, just play",
  back: "Back",
  next: "Next",
  start: "Start",
  stop: "Stop",
  play: "Play",
  done: "Done",
  notThisOne: "Not this one",
  goalTitle: "What brings you here?",
  whenTitle: "When do you need it most?",
  listenTitle: "How do you listen?",
  listenNote: "Headphones work best for two-tone beats. Speakers are fine for gentle pulses and noise. We will pick sounds that suit what you choose.",
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
  dailyEyebrow: "Your session for today",
  suggested: "Suggested for you",
  forYou: "For you",
  journeysTitle: "Journeys",
  journeysEmpty: "Pick a journey to begin. Go at your own pace.",
  restDay: "Rest day",
  restart: "Restart journey",
  startJourney: "Start this journey",
  libraryTitle: "Library",
  searchLabel: "Search sounds",
  searchEmpty: "Nothing matched. Try fewer words.",
  tabs: ["Feeling", "Sound", "Favorites", "My mixes", "Recent"],
  emptyFavorites: "Tap the heart on any sound to keep it here.",
  emptyMixes: "Make a mix in the player, then save it here.",
  emptyRecent: "Your recent sessions show up here.",
  welcomeBack: "Welcome back. Pick up where you like.",
  firstWeek: "Your week starts here. Rest days count too.",
  restCount: "Rest days count too.",
  timerChips: ["15 min", "30 min", "60 min", "Until I stop", "Sleep fade"],
  breathe: "Breathe in, breathe out",
  whyTitle: "What the research says",
  whyBody: "Some small studies suggest slow beats may help people relax. Results vary and may not happen for you. Zonked is not a medical device.",
  volumeCapped: "Volume is capped for your safety.",
  favorite: "Favorite",
  saved: "Saved",
  studio: "Studio mode",
  studioHint: "For advanced controls.",
  crewTitle: "Crew",
  crewIntro: "Your coding session can watch itself and ease the sound. When you have been working hard, Zonked slowly moves toward calmer sound. You stay in control.",
  crewSwitch: "Let Crew ease the sound",
  crewOff: "Not connected",
  crewOn: "Connected",
  crewBreak: "Time for a break",
  crewPrivacy: "Nothing leaves your computer.",
  crewOptional: "Crew is optional. Zonked works fully without it.",
  settingsTitle: "Settings",
  gentle: "Keep sounds extra gentle",
  gentleHint: "Picks softer sounds and keeps the screen still.",
  reduceMotion: "Reduce motion",
  forget: "Forget my answers",
  offline: "Zonked works offline. Nothing to do.",
  loading: "Loading",
  nav: ["Today", "Journeys", "Library", "Crew", "Settings"]
}, xe = {
  focus: "Focus",
  calm: "Calm down",
  sleep: "Sleep",
  study: "Study",
  recover: "Recover after work",
  curious: "Just curious"
}, Vn = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
  anytime: "Anytime"
}, Un = {
  headphones: "Headphones",
  speakers: "Speakers",
  bluetooth: "Bluetooth",
  unsure: "Not sure"
}, Zn = [
  { id: "deep-work", label: "Focus" },
  { id: "adhd-focus", label: "Steady attention" },
  { id: "ai-burnout", label: "Recover" },
  { id: "heal-stress", label: "Calm down" },
  { id: "cant-sleep", label: "Sleep" },
  { id: "lucid-dream", label: "Dream" },
  { id: "meditate", label: "Meditate" },
  { id: "quick-reset", label: "Quick reset" }
], Qn = {
  strong: "Several studies exist.",
  mixed: "Studies disagree.",
  preliminary: "Early, small studies.",
  limited: "Very little research.",
  preference: "People simply like it."
};
function Be(e) {
  return e >= 5 && e < 12 ? "Good morning." : e >= 12 && e < 17 ? "Good afternoon." : e >= 17 && e < 21 ? "Good evening." : "Hello, night owl.";
}
const _e = [
  { view: "today", label: m.nav[0] },
  { view: "journeys", label: m.nav[1] },
  { view: "library", label: m.nav[2] },
  { view: "crew", label: m.nav[3] },
  { view: "settings", label: m.nav[4] }
];
function Ge({ view: e, onGo: t }) {
  const n = e === "journey" ? "journeys" : e;
  return /* @__PURE__ */ c("nav", { className: "c-tabbar", "aria-label": "Main", children: _e.map((s) => /* @__PURE__ */ c("button", { type: "button", className: "c-nav", "aria-current": n === s.view ? "page" : void 0, onClick: () => t(s.view), children: s.label }, s.view)) });
}
function $e({ snap: e, onOpen: t, onStop: n }) {
  if (!e.playing) return null;
  const s = e.timer.kind !== "none" && e.timer.running ? ` ${Fe(e.timer.remainingSec)}` : "";
  return /* @__PURE__ */ b("div", { className: "c-mini", role: "group", "aria-label": "Now playing", children: [
    /* @__PURE__ */ c("button", { type: "button", className: "c-btn c-link c-mini-open", onClick: t, children: `${e.templateName ?? m.brand}${s}` }),
    /* @__PURE__ */ c("button", { type: "button", className: "c-btn c-small", "data-testid": "mini-stop", onClick: n, children: m.stop })
  ] });
}
const qe = ["focus", "calm", "sleep", "study", "recover", "curious"], We = ["morning", "afternoon", "evening", "night", "anytime"], Ke = ["headphones", "speakers", "bluetooth", "unsure"], Ye = {
  "sleep-onset-delta": 6,
  "sleep-drift-theta": 5,
  "sleep-deep-delta": 5,
  "recovery-lofi-unwind": 5,
  "recovery-post-sprint": 4,
  "recovery-micro-break": 4,
  "focus-alpha-beta": 5,
  "focus-sprint-pulse": 4,
  "focus-deep-beta": 5,
  "adhd-smr-steady": 5,
  "adhd-beta-anchor": 5,
  "vibe-warm-glow": 4,
  "healing-soothe-glide": 4,
  "meditation-alpha-sit": 5,
  "meditation-breath-pacer": 4
}, Je = Object.freeze({ kind: "rest", family: "", variants: Object.freeze([]) });
function Ve(e) {
  const t = Ye[e] ?? 0, n = [];
  for (let s = 1; s <= t; s += 1) n.push(`${e}-${String(s).padStart(2, "0")}`);
  return Object.freeze(n);
}
function Ue(e) {
  return Object.freeze({ kind: "session", family: e, variants: Ve(e) });
}
function E(...e) {
  return Object.freeze(e.map((t) => t === "rest" ? Je : Ue(t)));
}
const _ = (e, t) => Array.from({ length: t }, () => e), C = (e) => Object.freeze(e), Q = Object.freeze([
  C({
    id: "calm-evenings",
    title: "7 Calm Evenings",
    blurb: "7 short evenings of slow sound. About 20 minutes each.",
    situation: "heal-stress",
    vibe: "calm",
    minutes: 20,
    days: E(
      "healing-soothe-glide",
      "meditation-breath-pacer",
      "vibe-warm-glow",
      "rest",
      "meditation-alpha-sit",
      "recovery-lofi-unwind",
      "healing-soothe-glide"
    )
  }),
  C({
    id: "focus-mornings",
    title: "5 Focus Mornings",
    blurb: "5 mornings of steady sound to start work. About 30 minutes each.",
    situation: "deep-work",
    vibe: "bright",
    minutes: 30,
    days: E("focus-alpha-beta", "focus-alpha-beta", "focus-sprint-pulse", "rest", "focus-deep-beta")
  }),
  C({
    id: "easier-sleep",
    title: "14 Nights of Wind-Down Sound",
    blurb: "14 nights of slow sound for winding down. Rest nights included.",
    situation: "cant-sleep",
    vibe: "dreamy",
    minutes: 45,
    days: E(
      ..._("sleep-drift-theta", 4),
      "rest",
      ..._("sleep-onset-delta", 4),
      "rest",
      ..._("sleep-deep-delta", 3),
      "sleep-onset-delta"
    )
  }),
  C({
    id: "study-sprint",
    title: "Study Sprint Week",
    blurb: "A week of short study blocks with breaks. About 25 minutes each.",
    situation: "deep-work",
    vibe: "minimal",
    minutes: 25,
    days: E(
      "focus-sprint-pulse",
      "focus-alpha-beta",
      "recovery-micro-break",
      "focus-sprint-pulse",
      "rest",
      "focus-alpha-beta",
      "meditation-alpha-sit"
    )
  }),
  C({
    id: "after-work-reset",
    title: "After-Work Reset",
    blurb: "5 evenings to step out of work mode. About 20 minutes each.",
    situation: "ai-burnout",
    vibe: "warm",
    minutes: 20,
    days: E("recovery-post-sprint", "recovery-lofi-unwind", "recovery-micro-break", "rest", "recovery-lofi-unwind")
  }),
  C({
    id: "gentle-routine",
    title: "Gentle Routine",
    blurb: "Gentle routine for steady attention. About 25 minutes each.",
    situation: "adhd-focus",
    vibe: "grounded",
    minutes: 25,
    days: E(
      "adhd-smr-steady",
      "recovery-micro-break",
      "adhd-smr-steady",
      "rest",
      "adhd-beta-anchor",
      "recovery-micro-break",
      "adhd-smr-steady"
    )
  })
]);
function Xn(e) {
  return Q.find((t) => t.id === e);
}
function u(e) {
  return {
    modes: ["binaural"],
    noises: [["off", 0]],
    layers: [[]],
    intensity: 2,
    gain: 0.45,
    jitter: 0.3,
    tags: [],
    ...e
  };
}
const d = (e, t) => e[(t % e.length + e.length) % e.length], Ze = [98, 110, 123.5, 87.3, 103.8, 130.8], Qe = [196, 220, 247, 175, 165, 262], Xe = {
  calm: [4, 3],
  warm: [6, 2],
  dreamy: [4, 3],
  bright: [2, 5],
  deep: [7, 5],
  energized: [2, 3],
  grounded: [6, 1],
  ethereal: [4, 3],
  lofi: [1, 2, 5],
  minimal: [7, 4]
}, et = (e) => [...e].reduce((t, n) => (t * 31 + n.charCodeAt(0)) % 9973, 7);
function tt(e, t, n) {
  const s = et(e) + n;
  return { prog: d(Xe[t], s), key: d(Ze, s), pianoRoot: d(Qe, s >> 1) };
}
function nt(e, t, n) {
  const s = e === "dreamy" || e === "ethereal" || e === "calm";
  return {
    breathDepth: d([0.45, 0.4, 0.3, 0.2, 0.1], t - 1),
    breathRateHz: 0.06 + 0.02 * (n % 5),
    stereoWidth: 0.3 + 0.1 * (n % 4),
    panDepth: s ? 0.15 : 0,
    panRateHz: 0.03 + 0.01 * (n % 4)
  };
}
const st = {
  lofi: (e, t) => ({
    lofiLevel: 0.45,
    lofiWarmth: d([0.5, 0.6, 0.7], e),
    lofiProgression: t.prog,
    tapeWow: d([0.25, 0.35, 0.45], e),
    padRootHz: t.key
  }),
  piano: (e, t) => ({
    instLevel: 0.35,
    instKind: 3,
    instRootHz: t.pianoRoot,
    instScale: d([2, 0, 1, 4, 3], e),
    instBpm: d([40, 46, 52], e),
    pianoPedal: d([0.4, 0.55, 0.7], e)
  }),
  crackle: () => ({ crackle: 0.12 }),
  drone: (e) => ({ instLevel: 0.35, instKind: 1, instRootHz: d([55, 62, 73, 82], e), instScale: 7, instBpm: 40 }),
  pluck: (e) => ({
    instLevel: 0.3,
    instKind: 0,
    instRootHz: d([196, 220, 247, 262], e),
    instScale: d([0, 2, 4, 1], e),
    instBpm: d([48, 56, 64, 72], e)
  }),
  bell: (e) => ({
    instLevel: 0.28,
    instKind: 2,
    instRootHz: d([262, 294, 330, 349], e),
    instScale: 4,
    instBpm: 40
  }),
  pad: (e, t) => ({ padLevel: 0.4, padChord: d([0, 2, 4, 6], e), padRootHz: t.key }),
  chimes: (e) => ({ chimeLevel: 0.25, chimeRatePerMin: d([3, 4, 6, 8], e) }),
  perc: (e) => ({
    percLevel: 0.2,
    percBpm: d([64, 72, 80, 92], e),
    percPattern: d([0, 3, 4, 7], e)
  })
};
function at(e, t, n = { prog: 0, key: 110, pianoRoot: 220 }) {
  return e.reduce((s, i) => ({ ...s, ...st[i](t, n) }), {});
}
const re = (e) => Math.round(e * 1e3) / 1e3, G = (e) => Math.min(40, Math.max(0.5, e));
function it(e, t, n, s, i) {
  const a = Math.min(5, Math.max(1, t * 0.15));
  if (e === "plateau") {
    const l = [{ t: 0, beat: n, ramp: !0 }, { t: a, beat: s, ramp: i !== void 0 }];
    return i !== void 0 && l.push({ t: t - a, beat: s, ramp: !0 }, { t, beat: i, ramp: !1 }), l;
  }
  if (e === "ramp-down" || e === "ramp-up")
    return [{ t: 0, beat: n, ramp: !0 }, { t: t * 0.7, beat: s, ramp: !1 }];
  if (e === "wave")
    return Array.from({ length: 7 }, (l, r) => ({ t: t * r / 6, beat: r % 2 === 0 ? n : s, ramp: r < 6 }));
  const o = t / 4;
  return Array.from({ length: 4 }, (l, r) => {
    const y = n + (s - n) * r / 3;
    return r < 3 ? [{ t: r * o, beat: y, ramp: !1 }, { t: r * o + o * 0.75, beat: y, ramp: !0 }] : [{ t: r * o, beat: y, ramp: !1 }];
  }).flat();
}
function ot(e, t, n, s, i) {
  const a = (t % 3 - 1) * e.jitter, o = G(e.to + a), l = d(e.noises, t >> 1), r = d(e.layers, t * 2 + (t >> 1)), y = d(e.vibes, t), L = at(r, t, tt(e.slug, y, t)), A = Object.keys(L).length > 0, g = A ? { ...L, ...nt(y, e.intensity, t) } : L;
  return it(e.shape, n, G(e.from), o, e.ret).map((v) => ({
    atMin: re(v.t),
    beatHz: re(G(v.beat)),
    carrierHz: s,
    gain: e.gain,
    mode: i,
    noise: l[0],
    noiseLevel: l[1],
    ...A ? { layers: g } : {},
    ramp: v.ramp
  }));
}
function X(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    t.add(n.mode);
    const s = n.layers;
    n.noise !== "off" && n.noiseLevel > 0 && t.add("noise"), s !== void 0 && (((s.lofiLevel ?? 0) > 0 || (s.crackle ?? 0) > 0) && t.add("lofi"), (s.instLevel ?? 0) > 0 && t.add("instrument"), (s.padLevel ?? 0) > 0 && t.add("pad"), (s.chimeLevel ?? 0) > 0 && t.add("chimes"), (s.percLevel ?? 0) > 0 && t.add("percussion"));
  }
  return [...t];
}
function ee(e, t) {
  if (t > 3) return !1;
  const n = e.every((a, o) => {
    var l;
    return o === 0 || Math.abs(a.beatHz - (((l = e[o - 1]) == null ? void 0 : l.beatHz) ?? a.beatHz)) <= 4;
  }), s = e.every((a) => a.mode === "isochronic" || a.beatHz >= 12 && a.beatHz <= 20), i = e.every((a) => {
    var o, l;
    return (((o = a.layers) == null ? void 0 : o.crackle) ?? 0) === 0 && (((l = a.layers) == null ? void 0 : l.percBpm) ?? 0) <= 100;
  });
  return n && s && i;
}
function rt(e, t) {
  const n = e.adjectives.length, s = t * 7 % (n * e.nouns.length);
  return `${d(e.adjectives, s)} ${d(e.nouns, Math.floor(s / n))}`;
}
const lt = (e) => String(e).padStart(2, "0");
function ct(e, t, n, s) {
  const i = d(t.mins, n), a = d(t.carriers, n * 3 + 1), o = d(t.modes, n + (n >> 2)), l = ot(t, n, i, a, o), r = t.to < 4 ? "delta" : t.to < 8 ? "theta" : t.to < 12 ? "alpha" : t.to < 30 ? "beta" : "gamma";
  return {
    id: `${e.prefix}-${t.slug}-${lt(n + 1)}`,
    name: rt(e, s),
    category: e.category,
    vibe: d(t.vibes, n),
    tags: [t.slug, r, o, ...t.tags],
    layerTags: X(l),
    situations: t.situations,
    recommendedMinutes: i,
    intensity: t.intensity,
    adhdFriendly: ee(l, t.intensity),
    stages: l,
    reasonTemplate: t.reason,
    source: "original",
    ...t.breath !== void 0 ? { breath: t.breath } : {}
  };
}
function ut(e) {
  let t = 0;
  return e.archs.flatMap((n) => Array.from({ length: n.count }, (s, i) => ct(e, n, i, t++)));
}
const dt = {
  category: "adhd-control",
  prefix: "adhd",
  adjectives: ["Steady", "Anchored", "Level", "Even", "Tidy", "Calm", "Focused", "Plain", "Settled", "Patient", "Smooth", "Constant"],
  nouns: ["Anchor", "Rail", "Tracks", "Rhythm", "Metronome", "Lane", "Thread", "Pulse", "Desk", "Checklist", "Runway", "Keel"],
  archs: [
    u({
      slug: "smr-steady",
      shape: "plateau",
      from: 12,
      to: 13.5,
      mins: [20, 30, 45],
      carriers: [200, 220, 240],
      modes: ["isochronic", "isochronic", "monaural"],
      noises: [["pink", 0.18], ["brown", 0.2]],
      layers: [[], ["lofi"]],
      vibes: ["minimal", "grounded"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      jitter: 0.4,
      reason: "Steady SMR-range pulse with no changes to track, for {minutes} minutes of low-surprise focus."
    }),
    u({
      slug: "beta-anchor",
      shape: "plateau",
      from: 14,
      to: 16,
      mins: [25, 30, 45, 50],
      carriers: [210, 230, 250],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.15], ["off", 0]],
      layers: [[], ["lofi"]],
      vibes: ["grounded", "bright", "minimal"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 3,
      gain: 0.42,
      count: 5,
      jitter: 0.5,
      reason: "A constant low-beta pulse to anchor attention."
    }),
    u({
      slug: "cadence-pulse",
      shape: "plateau",
      from: 14,
      to: 15,
      mins: [20, 25, 30],
      carriers: [200, 220],
      modes: ["isochronic"],
      noises: [["pink", 0.12]],
      layers: [["perc"], ["perc", "lofi"]],
      vibes: ["energized", "grounded"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 3,
      gain: 0.4,
      count: 4,
      reason: "Gentle soft percussion at a fixed 60 to 100 bpm cadence keeps tempo without surprises."
    }),
    u({
      slug: "quiet-bed",
      shape: "plateau",
      from: 13,
      to: 13,
      mins: [30, 45, 60],
      carriers: [190, 210],
      modes: ["isochronic", "monaural"],
      noises: [["brown", 0.3], ["pink", 0.25]],
      layers: [["lofi"], ["lofi", "piano"]],
      vibes: ["lofi", "minimal", "warm"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      jitter: 0,
      reason: "A fixed warm bed with nothing that changes, so it fades into the background."
    }),
    u({
      slug: "start-ramp",
      shape: "ramp-up",
      from: 11,
      to: 15,
      mins: [15, 20, 25],
      carriers: [200, 220],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.15]],
      layers: [[], ["pluck"]],
      vibes: ["bright", "energized"],
      situations: ["adhd-focus", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      jitter: 0.2,
      reason: "A slow 4 Hz climb to help you get started without a jolt."
    }),
    u({
      slug: "sprint-steps",
      shape: "ladder",
      from: 13,
      to: 16,
      mins: [20, 25, 30],
      carriers: [210, 230],
      modes: ["isochronic"],
      noises: [["off", 0], ["pink", 0.12]],
      layers: [["perc"], []],
      vibes: ["energized", "grounded"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 3,
      gain: 0.4,
      count: 4,
      jitter: 0.2,
      reason: "Four small, announced steps through the beta band for a structured work block."
    })
  ]
}, mt = {
  category: "focus",
  prefix: "focus",
  adjectives: ["Sharp", "Deep", "Clear", "Lucid", "Bright", "Keen", "Locked", "Precise", "Crisp", "Direct", "Tuned", "Honed"],
  nouns: ["Beam", "Signal", "Compass", "Engine", "Vector", "Prism", "Forge", "Spire", "Circuit", "Current", "Summit", "Scope"],
  archs: [
    u({
      slug: "alpha-beta",
      shape: "plateau",
      from: 11,
      to: 14,
      mins: [25, 45, 60],
      carriers: [200, 220, 240],
      modes: ["binaural", "isochronic", "monaural"],
      noises: [["pink", 0.15]],
      layers: [[], ["lofi"], ["pluck"]],
      vibes: ["bright", "minimal", "grounded"],
      situations: ["deep-work", "adhd-focus"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Relaxed focus on the alpha-beta border for {minutes} minutes."
    }),
    u({
      slug: "deep-beta",
      shape: "plateau",
      from: 15,
      to: 18,
      mins: [30, 45, 60, 90],
      carriers: [220, 240, 260],
      modes: ["binaural", "isochronic"],
      noises: [["pink", 0.15], ["off", 0]],
      layers: [[], ["perc"]],
      vibes: ["energized", "bright"],
      situations: ["deep-work"],
      intensity: 3,
      gain: 0.42,
      count: 5,
      reason: "Beta band for sustained analytical work."
    }),
    u({
      slug: "gamma-edge",
      shape: "ramp-up",
      from: 18,
      to: 35,
      mins: [10, 15, 20],
      carriers: [240, 260, 280],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [[]],
      vibes: ["energized", "bright"],
      situations: ["deep-work"],
      intensity: 4,
      gain: 0.4,
      count: 4,
      reason: "A short climb to a high-beta and low-gamma edge for a quick push."
    }),
    u({
      slug: "flow-ramp",
      shape: "ramp-up",
      from: 10,
      to: 16,
      mins: [30, 45, 60],
      carriers: [210, 230],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.12]],
      layers: [["pluck"], ["lofi", "pluck"]],
      vibes: ["warm", "bright", "lofi"],
      situations: ["deep-work", "adhd-focus"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "Eases from alpha into beta so you drift into flow."
    }),
    u({
      slug: "reading-calm",
      shape: "plateau",
      from: 10,
      to: 12,
      mins: [30, 45, 60],
      carriers: [190, 210],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["piano"], []],
      vibes: ["calm", "deep", "warm"],
      situations: ["deep-work", "meditate"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      reason: "Gentle alpha for reading and study."
    }),
    u({
      slug: "sprint-pulse",
      shape: "ladder",
      from: 12,
      to: 20,
      mins: [20, 25, 30],
      carriers: [220, 240],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [["perc"], ["perc", "pluck"]],
      vibes: ["energized", "bright"],
      situations: ["deep-work", "adhd-focus"],
      intensity: 3,
      gain: 0.4,
      count: 4,
      reason: "Four rising steps with soft percussion for a focused sprint."
    })
  ]
}, pt = {
  category: "healing",
  prefix: "healing",
  adjectives: ["Mending", "Tender", "Restoring", "Kind", "Balmy", "Soothing", "Renewing", "Warming", "Settled", "Easing", "Gentle", "Whole"],
  nouns: ["Balm", "Spring", "Embrace", "Garden", "Shelter", "Glow", "Rain", "Hearth", "Sunrise", "Quilt", "Oasis", "Haven"],
  archs: [
    u({
      slug: "tension-release",
      shape: "ramp-down",
      from: 14,
      to: 8,
      mins: [15, 20, 30],
      carriers: [180, 200, 220],
      modes: ["binaural", "isochronic", "monaural"],
      noises: [["pink", 0.2]],
      layers: [["piano", "pad"], ["pluck"], ["pad", "chimes"]],
      vibes: ["warm", "calm"],
      situations: ["heal-stress", "ai-burnout", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Eases beta tension down to alpha over {minutes} minutes."
    }),
    u({
      slug: "restore-theta",
      shape: "plateau",
      from: 9,
      to: 6,
      mins: [20, 30, 45],
      carriers: [160, 180],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["drone"], ["pad"], ["bell"]],
      vibes: ["deep", "warm", "ethereal"],
      situations: ["heal-stress", "meditate"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Steady theta with a soft drone for emotional recovery."
    }),
    u({
      slug: "heart-calm",
      shape: "plateau",
      from: 10,
      to: 7.5,
      ret: 10,
      mins: [10, 15, 20],
      carriers: [190, 210],
      modes: ["binaural", "isochronic"],
      noises: [["off", 0], ["pink", 0.15]],
      layers: [["pad", "pluck"], ["pad"]],
      vibes: ["warm", "grounded"],
      situations: ["heal-stress", "quick-reset", "ai-burnout"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      breath: { inSec: 5, outSec: 5 },
      reason: "A slow 6 breaths per minute rhythm to settle heart and mind."
    }),
    u({
      slug: "ache-ease",
      shape: "wave",
      from: 10,
      to: 7,
      mins: [30, 45, 60],
      carriers: [150, 170],
      modes: ["monaural", "binaural"],
      noises: [["brown", 0.3]],
      layers: [["pad"], []],
      vibes: ["calm", "warm"],
      situations: ["heal-stress"],
      intensity: 1,
      gain: 0.38,
      count: 4,
      reason: "Slow alpha-theta swells that feel like a rocking tide."
    }),
    u({
      slug: "soothe-glide",
      shape: "ramp-down",
      from: 12,
      to: 6,
      mins: [20, 30],
      carriers: [170, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.25]],
      layers: [["pad", "chimes"], ["bell"]],
      vibes: ["ethereal", "calm"],
      situations: ["heal-stress", "meditate"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "A soft pad and a gliding beat for gentle emotional unwinding."
    }),
    u({
      slug: "sunrise-lift",
      shape: "ramp-up",
      from: 7,
      to: 11,
      mins: [15, 20, 30],
      carriers: [190, 210, 230],
      modes: ["binaural", "isochronic"],
      noises: [["off", 0]],
      layers: [["pluck", "pad"], ["bell"]],
      vibes: ["bright", "warm"],
      situations: ["heal-stress", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "A brightening ramp that lifts mood without pushing alertness."
    })
  ]
}, ht = {
  category: "lucid-dreams",
  prefix: "lucid",
  adjectives: ["Waking", "Silver", "Nebula", "Astral", "Twilight", "Aware", "Hollow", "Starlit", "Liminal", "Vivid", "Opal", "Drifting"],
  nouns: ["Gate", "Compass", "Mirror", "Skyway", "Threshold", "Door", "Voyage", "Lens", "Bridge", "Beacon", "Garden", "Orbit"],
  archs: [
    u({
      slug: "wbtb-theta",
      shape: "plateau",
      from: 9,
      to: 5,
      ret: 8,
      mins: [90, 120, 180],
      carriers: [160, 180, 200],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["piano", "pad"], ["pad", "chimes"]],
      vibes: ["dreamy", "ethereal", "deep"],
      situations: ["lucid-dream", "cant-sleep"],
      intensity: 2,
      gain: 0.4,
      count: 6,
      reason: "Theta plateau with a light return, built for wake-back-to-bed lucid practice."
    }),
    u({
      slug: "rem-ladder",
      shape: "ladder",
      from: 8,
      to: 4,
      mins: [60, 90, 120],
      carriers: [150, 170],
      modes: ["binaural", "isochronic"],
      noises: [["brown", 0.2]],
      layers: [["pad"], ["drone"]],
      vibes: ["deep", "dreamy"],
      situations: ["lucid-dream"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Steps down through theta in four stages to meet REM gently."
    }),
    u({
      slug: "aware-wave",
      shape: "wave",
      from: 5,
      to: 8,
      mins: [60, 90],
      carriers: [160, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["pad", "chimes"], ["bell"]],
      vibes: ["ethereal", "dreamy"],
      situations: ["lucid-dream"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Slow swings between theta and alpha keep a thread of awareness while the body sleeps."
    }),
    u({
      slug: "dream-drift",
      shape: "ramp-down",
      from: 10,
      to: 4.5,
      mins: [30, 45, 60],
      carriers: [140, 160, 180],
      modes: ["binaural", "isochronic", "monaural"],
      noises: [["brown", 0.2], ["pink", 0.2]],
      layers: [["pad"], []],
      vibes: ["dreamy", "calm", "ethereal"],
      situations: ["lucid-dream", "cant-sleep"],
      intensity: 1,
      gain: 0.4,
      count: 5,
      reason: "A slow descent into dream sleep over {minutes} minutes."
    }),
    u({
      slug: "astral-calm",
      shape: "plateau",
      from: 10,
      to: 6,
      mins: [30, 45, 60],
      carriers: [170, 200],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.2]],
      layers: [["drone"], ["bell"]],
      vibes: ["ethereal", "deep"],
      situations: ["lucid-dream", "meditate"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Relaxed theta with a slow instrument drone, a calm body-aware launch pad."
    })
  ]
}, ft = {
  category: "meditation",
  prefix: "meditation",
  adjectives: ["Open", "Rooted", "Sacred", "Luminous", "Patient", "Clear", "Boundless", "Inner", "Mindful", "Sunlit", "Hallowed", "Silent"],
  nouns: ["Cushion", "Temple", "Breath", "Mountain", "Lotus", "Stillpoint", "Horizon", "Sanctuary", "River", "Candle", "Grove", "Bowl"],
  archs: [
    u({
      slug: "alpha-sit",
      shape: "plateau",
      from: 12,
      to: 9.5,
      ret: 11,
      mins: [10, 15, 20, 30],
      carriers: [180, 200, 220],
      modes: ["binaural", "monaural", "isochronic"],
      noises: [["pink", 0.15], ["off", 0]],
      layers: [["chimes"], ["bell"], []],
      vibes: ["calm", "grounded", "warm"],
      situations: ["meditate", "quick-reset", "heal-stress"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Wakeful alpha for a {minutes} minute seated sit."
    }),
    u({
      slug: "theta-descent",
      shape: "ramp-down",
      from: 10,
      to: 5,
      mins: [20, 30, 45],
      carriers: [160, 180],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["drone"], ["drone", "chimes"]],
      vibes: ["deep", "ethereal"],
      situations: ["meditate"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Glides from alpha to theta for deeper inward attention."
    }),
    u({
      slug: "schumann-hold",
      shape: "plateau",
      from: 12,
      to: 7.83,
      ret: 12,
      mins: [20, 30],
      carriers: [180, 200],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["piano"], ["bell"]],
      vibes: ["grounded", "deep"],
      situations: ["meditate", "heal-stress"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      jitter: 0,
      reason: "Rests on the 7.83 Hz Schumann resonance, then returns to wakefulness."
    }),
    u({
      slug: "breath-pacer",
      shape: "plateau",
      from: 9,
      to: 6.5,
      mins: [10, 15, 20],
      carriers: [170, 190],
      modes: ["isochronic", "monaural"],
      noises: [["off", 0]],
      layers: [["chimes"], ["pad"]],
      vibes: ["calm", "minimal"],
      situations: ["meditate", "quick-reset"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      breath: { inSec: 5.45, outSec: 5.45 },
      reason: "Pair the 5.5 breaths per minute pacer with a slow theta pulse."
    }),
    u({
      slug: "bell-silence",
      shape: "plateau",
      from: 10,
      to: 8,
      mins: [15, 20, 30],
      carriers: [190, 210],
      modes: ["binaural", "monaural"],
      noises: [["off", 0]],
      layers: [["chimes"], ["bell"], ["pluck", "chimes"]],
      vibes: ["ethereal", "bright", "calm"],
      situations: ["meditate", "heal-stress"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      reason: "Sparse chimes over a quiet alpha-theta border."
    }),
    u({
      slug: "delta-glide",
      shape: "ramp-down",
      from: 6,
      to: 3,
      mins: [30, 45, 60],
      carriers: [130, 150],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.25]],
      layers: [["drone"]],
      vibes: ["deep", "minimal"],
      situations: ["meditate", "heal-stress"],
      intensity: 2,
      gain: 0.38,
      count: 4,
      reason: "A long fall into delta for dissolving, open awareness."
    })
  ]
}, yt = {
  category: "sleep",
  prefix: "sleep",
  adjectives: ["Quiet", "Slow", "Velvet", "Hushed", "Moonlit", "Soft", "Drowsy", "Still", "Dim", "Gentle", "Fading", "Lulled"],
  nouns: ["Harbor", "Tide", "Pillow", "Lantern", "Blanket", "Meadow", "Lullaby", "Cabin", "Drift", "Hearth", "Cove", "Evening"],
  archs: [
    u({
      slug: "onset-delta",
      shape: "ramp-down",
      from: 9,
      to: 2.5,
      mins: [30, 45, 60, 90],
      carriers: [120, 140, 150, 160, 180],
      modes: ["binaural", "monaural", "binaural", "isochronic"],
      noises: [["brown", 0.25], ["pink", 0.2]],
      layers: [[], ["pad"], ["drone"]],
      vibes: ["calm", "deep", "dreamy"],
      situations: ["cant-sleep", "heal-stress"],
      intensity: 1,
      gain: 0.4,
      count: 6,
      reason: "Glides from alpha to delta over {minutes} minutes to ease sleep onset."
    }),
    u({
      slug: "drift-theta",
      shape: "ramp-down",
      from: 8,
      to: 4.5,
      mins: [20, 30, 45],
      carriers: [130, 150, 170],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.2], ["brown", 0.3]],
      layers: [["piano", "pad"], ["pad", "chimes"], []],
      vibes: ["dreamy", "calm", "ethereal"],
      situations: ["cant-sleep", "lucid-dream"],
      intensity: 1,
      gain: 0.4,
      count: 5,
      reason: "A slow theta drift with a soft pad to quiet racing thoughts."
    }),
    u({
      slug: "deep-delta",
      shape: "plateau",
      from: 6,
      to: 2.5,
      mins: [60, 90, 120],
      carriers: [110, 130, 150],
      modes: ["monaural", "binaural", "isochronic"],
      noises: [["brown", 0.3]],
      layers: [["drone"], []],
      vibes: ["deep", "calm"],
      situations: ["cant-sleep"],
      intensity: 1,
      gain: 0.38,
      count: 5,
      jitter: 0.2,
      reason: "Holds steady delta for deep, unbroken rest."
    }),
    u({
      slug: "nap-reset",
      shape: "plateau",
      from: 10,
      to: 5,
      ret: 12,
      mins: [15, 20, 25],
      carriers: [150, 170],
      modes: ["binaural", "isochronic"],
      noises: [["pink", 0.2]],
      layers: [["pad"]],
      vibes: ["warm", "calm"],
      situations: ["cant-sleep", "quick-reset", "ai-burnout"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "A short nap that sinks to theta and wakes you gently after {minutes} minutes."
    }),
    u({
      slug: "breath-down",
      shape: "ramp-down",
      from: 7,
      to: 3,
      mins: [20, 30],
      carriers: [140, 160],
      modes: ["isochronic", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["pad", "chimes"]],
      vibes: ["calm", "dreamy"],
      situations: ["cant-sleep", "heal-stress"],
      intensity: 1,
      gain: 0.4,
      count: 3,
      breath: { inSec: 4, outSec: 6 },
      reason: "Pair slow 4-in, 6-out breathing with a falling beat."
    }),
    u({
      slug: "rain-bed",
      shape: "plateau",
      from: 5,
      to: 3,
      mins: [45, 60, 90],
      carriers: [120, 140],
      modes: ["isochronic", "binaural"],
      noises: [["brown", 0.5], ["pink", 0.45]],
      layers: [["lofi"], []],
      vibes: ["lofi", "warm", "calm"],
      situations: ["cant-sleep", "heal-stress"],
      intensity: 1,
      gain: 0.35,
      count: 3,
      reason: "A soft noise bed with a faint low-end hum, easy to sleep under."
    })
  ]
}, gt = {
  category: "vibes",
  prefix: "vibe",
  adjectives: ["Neon", "Cozy", "Mellow", "Golden", "Hazy", "Crisp", "Cloudy", "Dusty", "Amber", "Breezy", "Sleepy", "Plush"],
  nouns: ["Cafe", "Rooftop", "Cassette", "Window", "Terrace", "Playlist", "Sunday", "Skyline", "Studio", "Porch", "Alley", "Lounge"],
  archs: [
    u({
      slug: "lofi-study",
      shape: "plateau",
      from: 12,
      to: 10,
      mins: [25, 45, 60],
      carriers: [180, 200, 220],
      modes: ["isochronic", "monaural", "binaural"],
      noises: [["pink", 0.1]],
      layers: [["lofi", "crackle", "pluck"], ["lofi", "pluck"], ["lofi", "pad"]],
      vibes: ["lofi", "warm"],
      situations: ["deep-work", "ai-burnout", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 6,
      reason: "Warm lo-fi bed with a soft pluck for easy, steady company."
    }),
    u({
      slug: "warm-glow",
      shape: "plateau",
      from: 11,
      to: 9,
      mins: [20, 30, 45],
      carriers: [170, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.12], ["off", 0]],
      layers: [["pad", "lofi"], ["pad"]],
      vibes: ["warm", "calm"],
      situations: ["quick-reset", "ai-burnout"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      reason: "A warm pad and a gentle alpha pulse for a soft landing."
    }),
    u({
      slug: "bright-air",
      shape: "plateau",
      from: 13,
      to: 12,
      mins: [20, 30],
      carriers: [210, 240],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [["chimes", "pluck"], ["bell"]],
      vibes: ["bright", "energized"],
      situations: ["deep-work", "quick-reset"],
      intensity: 3,
      gain: 0.42,
      count: 4,
      reason: "Airy bells over a light alpha-beta border."
    }),
    u({
      slug: "ether-float",
      shape: "wave",
      from: 10,
      to: 6,
      mins: [20, 30, 45],
      carriers: [160, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["pad", "chimes"], ["bell", "pad"]],
      vibes: ["ethereal", "dreamy", "deep"],
      situations: ["quick-reset", "heal-stress"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "Slow swells with chimes for a floating, spacious mood."
    }),
    u({
      slug: "minimal-hum",
      shape: "plateau",
      from: 10,
      to: 10,
      mins: [15, 30, 60],
      carriers: [200, 220],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.3], ["brown", 0.3]],
      layers: [[]],
      vibes: ["minimal", "grounded"],
      situations: ["deep-work", "ai-burnout"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      jitter: 0,
      reason: "Just a pulse and a noise bed, nothing to attend to."
    }),
    u({
      slug: "spark-groove",
      shape: "plateau",
      from: 14,
      to: 16,
      mins: [20, 25, 30],
      carriers: [220, 240, 260],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [["perc", "pluck"], ["perc", "lofi"]],
      vibes: ["energized", "bright"],
      situations: ["deep-work", "quick-reset"],
      intensity: 3,
      gain: 0.42,
      count: 4,
      reason: "A light groove with soft percussion for a bright, steady lift."
    })
  ]
}, bt = {
  category: "work-recovery",
  prefix: "recovery",
  adjectives: ["Unplugged", "Offline", "Cooled", "Rested", "Idle", "Paused", "Unwound", "Mellow", "Eased", "Reset", "Spare", "Soft"],
  nouns: ["Break", "Commit", "Cooldown", "Terminal", "Standup", "Branch", "Window", "Stretch", "Merge", "Buffer", "Release", "Cache"],
  archs: [
    u({
      slug: "screen-down",
      shape: "ramp-down",
      from: 18,
      to: 8,
      mins: [10, 15, 20],
      carriers: [200, 220],
      modes: ["binaural", "monaural", "isochronic"],
      noises: [["pink", 0.2]],
      layers: [["lofi", "pad"], ["pad"], ["lofi"]],
      vibes: ["calm", "lofi", "warm"],
      situations: ["ai-burnout", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Steps your brain down from beta to alpha after a long review or generation run."
    }),
    u({
      slug: "micro-break",
      shape: "plateau",
      from: 11,
      to: 8.5,
      ret: 11,
      mins: [5, 8, 10],
      carriers: [190, 210],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0], ["pink", 0.15]],
      layers: [["chimes"], ["pad", "chimes"]],
      vibes: ["bright", "calm"],
      situations: ["quick-reset", "ai-burnout"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "A {minutes} minute reset that lowers tension and brings you back alert."
    }),
    u({
      slug: "post-sprint",
      shape: "ramp-down",
      from: 20,
      to: 6,
      mins: [15, 20, 30],
      carriers: [200, 220],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.25]],
      layers: [["pad"], ["drone", "chimes"]],
      vibes: ["deep", "grounded"],
      situations: ["ai-burnout", "heal-stress"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "A long fall from high beta to theta after an intense push."
    }),
    u({
      slug: "eye-rest",
      shape: "plateau",
      from: 10,
      to: 8,
      mins: [5, 10, 15],
      carriers: [180, 200],
      modes: ["monaural", "isochronic"],
      noises: [["pink", 0.2]],
      layers: [["pad"], ["chimes"]],
      vibes: ["calm", "minimal"],
      situations: ["ai-burnout", "quick-reset"],
      intensity: 1,
      gain: 0.38,
      count: 4,
      breath: { inSec: 4, outSec: 6 },
      reason: "Close your eyes and follow a slow 4-in, 6-out breath."
    }),
    u({
      slug: "lofi-unwind",
      shape: "plateau",
      from: 10,
      to: 9,
      mins: [15, 25, 40],
      carriers: [180, 200, 220],
      modes: ["isochronic", "binaural", "monaural"],
      noises: [["pink", 0.1]],
      layers: [["lofi", "crackle", "pluck"], ["lofi", "pad"]],
      vibes: ["lofi", "warm"],
      situations: ["ai-burnout", "heal-stress", "quick-reset"],
      intensity: 1,
      gain: 0.4,
      count: 5,
      reason: "Slow lo-fi bed to decompress while you do something light."
    }),
    u({
      slug: "commute-decompress",
      shape: "ramp-down",
      from: 14,
      to: 9,
      mins: [15, 20, 30],
      carriers: [200, 230],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["pluck"], ["lofi", "pluck"]],
      vibes: ["grounded", "warm", "minimal"],
      situations: ["ai-burnout", "quick-reset", "heal-stress"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "Closes the work day with a calm descent that works over speakers."
    })
  ]
}, j = (e) => Math.round(e * 1e3) / 1e3, F = (e) => Math.min(40, Math.max(0.5, e)), ge = (e) => e.segs.reduce((t, n) => t + n[0], 0) * (e.scale ?? 1);
function le(e, t) {
  const n = e.carrier ?? 200;
  return e.carrierEnd === void 0 ? n : Math.round(n + (e.carrierEnd - n) * t / Math.max(ge(e), 1));
}
function vt(e) {
  const t = [], [n, s] = e.noise ?? ["off", 0];
  let i = 0;
  return e.segs.forEach((a, o) => {
    const l = a[1] !== a[2], r = e.segs[o + 1];
    t.push({
      atMin: j(i / 60),
      beatHz: j(F(a[1])),
      carrierHz: le(e, i),
      gain: e.gain ?? 0.5,
      mode: e.mode ?? "binaural",
      noise: n,
      noiseLevel: s,
      ramp: l
    }), i += a[0] * (e.scale ?? 1), l && (r === void 0 || F(r[1]) !== F(a[2])) && t.push({ ...t[t.length - 1], atMin: j(i / 60), beatHz: j(F(a[2])), carrierHz: le(e, i), ramp: !1 });
  }), t;
}
function wt(e) {
  const t = vt(e);
  return {
    id: e.id,
    name: e.name,
    category: e.category,
    vibe: e.vibe,
    tags: [...e.tags, e.source],
    layerTags: X(t),
    situations: e.situations,
    recommendedMinutes: Math.max(1, Math.round(ge(e) / 60)),
    intensity: e.intensity,
    adhdFriendly: ee(t, e.intensity),
    stages: t,
    reasonTemplate: e.reason,
    source: e.source
  };
}
const x = ["white", 0.3], K = ["pink", 0.3], Y = ["brown", 0.3], ce = [
  [60, 10, 8],
  [60, 8, 8],
  [60, 8, 6],
  [60, 6, 6],
  [120, 6, 5],
  [360, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [180, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [90, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [240, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [480, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [360, 5, 5],
  [480, 5, 12]
], kt = [
  [120, 10, 8],
  [120, 8, 8],
  [120, 8, 6],
  [240, 6, 6],
  [240, 6, 5],
  [420, 5, 5],
  [20, 5, 8],
  [20, 8, 5],
  [360, 5, 5],
  [20, 5, 8],
  [20, 8, 5],
  [180, 5, 5],
  [900, 5, 5],
  [900, 5, 5],
  [360, 5, 5],
  [360, 5, 12]
], St = [
  [15, 10, 8],
  [240, 8, 8],
  [15, 8, 6],
  [240, 6, 6],
  [15, 6, 8],
  [555, 8, 8],
  [15, 8, 6],
  [75, 6, 6],
  [15, 6, 8],
  [45, 8, 8]
], At = [
  [333, 8, 8],
  [333, 8, 10],
  [333, 10, 12],
  [333, 12, 12],
  [333, 12, 10],
  [333, 10, 8],
  [333, 8, 10]
], Mt = [
  [120, 20, 40],
  ...Array.from({ length: 8 }, () => [[20, 40, 40], [10, 8, 8]]).flat(),
  [120, 40, 10]
], f = (e) => ({ ...e, source: "android", carrier: 200 }), Lt = [
  f({
    id: "android-self-hypnosis",
    name: "Mind Bridge",
    category: "meditation",
    vibe: "deep",
    situations: ["meditate", "heal-stress"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: x,
    tags: ["theta", "hypnosis"],
    reason: "Five minutes down to 4 Hz, ten minutes holding there, five minutes back up."
  }),
  f({
    id: "android-highest-mental-activity",
    name: "Spark Burst",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: [[120, 12, 40], [600, 40, 40], [120, 40, 12]],
    noise: x,
    tags: ["gamma", "boost"],
    reason: "Two minutes up to the 40 Hz ceiling, a ten minute hold, two minutes back to 12 Hz."
  }),
  f({
    id: "android-unity",
    name: "Unity Delta",
    category: "meditation",
    vibe: "ethereal",
    situations: ["meditate", "cant-sleep"],
    intensity: 1,
    segs: [[3600, 3.7, 3.7]],
    noise: Y,
    gain: 0.45,
    tags: ["delta", "long"],
    reason: "A flat 3.7 Hz hour under brown noise for a wide, quiet mind."
  }),
  f({
    id: "android-morphine",
    name: "Morphine Ease",
    category: "healing",
    vibe: "warm",
    situations: ["heal-stress"],
    intensity: 2,
    segs: [[3600, 10, 10]],
    noise: K,
    tags: ["alpha", "pain"],
    reason: "An hour at a steady 10 Hz under pink noise to loosen the body."
  }),
  f({
    id: "android-learning",
    name: "Long Study Bed",
    category: "focus",
    vibe: "bright",
    situations: ["deep-work"],
    intensity: 3,
    segs: [[120, 40, 14], [7080, 14, 14]],
    gain: 0.5,
    tags: ["beta", "study"],
    reason: "A two minute lift, then two hours at 14 Hz for long reading blocks."
  }),
  f({
    id: "android-creativity",
    name: "Creative Waves",
    category: "vibes",
    vibe: "bright",
    situations: ["quick-reset", "deep-work"],
    intensity: 2,
    segs: St,
    noise: ["white", 0.4],
    tags: ["alpha", "theta", "creative"],
    reason: "Twenty minutes that drift back and forth between 10 and 6 Hz for loose ideas."
  }),
  f({
    id: "android-wakeful-relax",
    name: "Quiet Alert",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset"],
    intensity: 1,
    segs: [[120, 12, 7.83], [780, 7.83, 7.83]],
    noise: ["white", 0.4],
    tags: ["alpha", "zen"],
    reason: "Fifteen minutes parked at 7.83 Hz with white noise, calm but awake."
  }),
  f({
    id: "android-schumann",
    name: "Earth Hum",
    category: "healing",
    vibe: "grounded",
    situations: ["heal-stress", "meditate"],
    intensity: 2,
    segs: [[300, 12, 7.83], [600, 7.83, 7.83], [300, 7.83, 12]],
    noise: ["white", 0.4],
    tags: ["alpha", "earth"],
    reason: "Ramps to 7.83 Hz, holds there ten minutes, then climbs back to 12 Hz."
  }),
  f({
    id: "android-astral-relax",
    name: "Dream Gate Relax",
    category: "lucid-dreams",
    vibe: "ethereal",
    situations: ["lucid-dream", "meditate"],
    intensity: 2,
    segs: [[600, 15, 10], [4800, 10, 10]],
    noise: ["white", 0.4],
    tags: ["alpha", "astral"],
    reason: "A ten minute slide from 15 to 10 Hz, then a long steady alpha rest."
  }),
  f({
    id: "android-interval-pulse",
    name: "Interval Pulse",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: Mt,
    tags: ["beta", "gamma", "interval"],
    reason: "Eight short high and low rounds between a warm up and a cool down."
  }),
  f({
    id: "android-hallucination",
    name: "Hazy Visions",
    category: "vibes",
    vibe: "ethereal",
    situations: ["quick-reset"],
    intensity: 3,
    segs: [[600, 15, 10]],
    noise: ["white", 0.2],
    tags: ["alpha", "trippy"],
    reason: "A single ten minute slide from 15 to 10 Hz for a soft, dreamy mood."
  }),
  f({
    id: "android-sleep-induction",
    name: "Drift Down",
    category: "sleep",
    vibe: "calm",
    situations: ["cant-sleep"],
    intensity: 1,
    segs: [[360, 9.7, 3.4], [1620, 3.4, 2.4], [1620, 2.4, 3.4]],
    noise: Y,
    gain: 0.5,
    tags: ["delta", "induction"],
    reason: "A six minute fall to delta, then a long gentle rise and dip for the rest of the hour."
  }),
  f({
    id: "android-lucid-dreams",
    name: "Lucid Dream Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream"],
    intensity: 2,
    segs: ce,
    gain: 0.5,
    tags: ["theta", "lucid"],
    reason: "A theta bed with brief alpha lifts and a soft ending."
  }),
  f({
    id: "android-shamanic-rhythm",
    name: "Ember Circle",
    category: "meditation",
    vibe: "grounded",
    situations: ["meditate", "heal-stress"],
    intensity: 2,
    segs: [[300, 9, 4.5], [3e3, 4.5, 4.5], [300, 4.5, 9]],
    noise: ["white", 0.4],
    tags: ["theta", "journey"],
    reason: "Five minutes down to 4.5 Hz, fifty minutes of hold, five minutes back up."
  }),
  f({
    id: "android-smr-sleep",
    name: "SMR Sleep Weave",
    category: "sleep",
    vibe: "minimal",
    situations: ["cant-sleep", "heal-stress"],
    intensity: 2,
    segs: At,
    tags: ["alpha", "smr"],
    reason: "Forty minutes of beats crossing between alpha and the low SMR band."
  }),
  f({
    id: "android-lucid-dreams-2",
    name: "Long Lucid Night",
    category: "lucid-dreams",
    vibe: "deep",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: [[600, 9.7, 3.4], [5400, 3.4, 2.4], ...kt],
    noise: K,
    gain: 0.5,
    tags: ["delta", "theta", "lucid"],
    reason: "A delta fall followed by a long night plan with timed theta pulses."
  }),
  f({
    id: "android-adhd-cycle",
    name: "Focus Cycle",
    category: "adhd-control",
    vibe: "energized",
    situations: ["adhd-focus", "deep-work"],
    intensity: 3,
    segs: [[300, 40, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20]],
    noise: x,
    tags: ["beta", "cycle"],
    reason: "Five minute blocks that swap between 12 and 20 Hz after a 40 Hz opener."
  }),
  // Shortened variants of existing Android programs.
  f({
    id: "android-self-hypnosis-short",
    name: "Quick Mind Bridge",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: x,
    scale: 0.5,
    tags: ["theta", "short"],
    reason: "The Mind Bridge shape squeezed into ten minutes."
  }),
  f({
    id: "android-wakeful-relax-5",
    name: "Five Minute Calm",
    category: "work-recovery",
    vibe: "calm",
    situations: ["quick-reset", "ai-burnout"],
    intensity: 1,
    segs: [[120, 12, 7.83], [780, 7.83, 7.83]],
    noise: ["white", 0.3],
    scale: 1 / 3,
    tags: ["alpha", "short"],
    reason: "A five minute Quiet Alert between tasks."
  }),
  f({
    id: "android-schumann-short",
    name: "Earth Reset",
    category: "healing",
    vibe: "grounded",
    situations: ["heal-stress", "quick-reset"],
    intensity: 2,
    segs: [[300, 12, 7.83], [600, 7.83, 7.83], [300, 7.83, 12]],
    noise: ["white", 0.3],
    scale: 0.5,
    tags: ["alpha", "short"],
    reason: "A ten minute version of the Earth Hum shape."
  }),
  f({
    id: "android-lucid-dreams-short",
    name: "Lucid Nap Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: ce.slice(0, 12),
    gain: 0.5,
    tags: ["theta", "lucid", "short"],
    reason: "The opening stretch of the Lucid Dream Cycle, sized for naps."
  })
], $ = (e) => ({ ...e, source: "gnaural" }), Nt = [
  $({
    id: "gnaural-power-nap",
    name: "Midday Nap",
    category: "sleep",
    vibe: "warm",
    situations: ["quick-reset", "cant-sleep", "ai-burnout"],
    intensity: 1,
    segs: [[13, 11, 8.8], [17, 8.8, 7], [29, 7, 5.2], [38, 5.2, 4.4], [50, 4.4, 4.2], [68, 4.2, 4], [877, 4, 4], [37, 4, 4.2], [32, 4.2, 5.1], [20, 5.1, 6.8], [15, 6.8, 9.8], [4, 9.8, 9.8]],
    carrier: 164,
    carrierEnd: 110,
    noise: K,
    gain: 0.5,
    tags: ["delta", "nap", "schedule"],
    reason: "A fast fall to 4 Hz, a long hold, then a slow climb. Twenty minutes in all."
  }),
  $({
    id: "gnaural-airplane-aid",
    name: "Long Haul Calm",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset", "heal-stress"],
    intensity: 1,
    segs: [[9, 0.5, 12], [45, 12, 8], [60, 8, 6], [120, 6, 5], [180, 5, 4.3], [180, 4.3, 4], [900, 4, 4], [900, 4, 4.2], [900, 4.2, 3.9], [900, 3.9, 3.9], [400, 3.9, 4.3]],
    carrier: 280,
    carrierEnd: 140,
    noise: Y,
    gain: 0.5,
    tags: ["theta", "travel", "schedule"],
    reason: "A falling carrier tone over theta beats, built for long seated trips."
  }),
  $({
    id: "gnaural-arrive-sharp",
    name: "Arrive Sharp",
    category: "focus",
    vibe: "bright",
    situations: ["deep-work"],
    intensity: 4,
    segs: [[236, 10.1, 10.1], [132, 12.1, 12.1], [661, 28.5, 28.5], [209, 5.4, 5.4], [73, 7.3, 7.3]],
    carrier: 200,
    gain: 0.5,
    tags: ["beta", "gamma", "schedule"],
    reason: "Five steps from alpha up to a 28.5 Hz middle, then back down, in twenty two minutes."
  })
];
function Rt() {
  return [...Lt, ...Nt].map(wt);
}
const Tt = [
  { id: "lofi", name: "Lo-fi", blurb: "Warm, slow chords with a tape and vinyl feel, like a quiet study radio.", mood: "warm", defaultLevel: 0.5, layerKeys: ["lofiLevel", "lofiProgression", "tapeWow", "crackle"], templateId: "starter-lofi", evidence: "preference" },
  { id: "piano", name: "Soft piano", blurb: "A soft piano playing gentle, slow phrases with long ringing notes.", mood: "calm", defaultLevel: 0.45, layerKeys: ["instLevel", "instKind", "pianoPedal"], templateId: "starter-piano", evidence: "preference" },
  { id: "violet", name: "Violet hiss", blurb: "A thin, bright hiss, like gentle static. Keep it quiet.", mood: "bright", defaultLevel: 0.3, layerKeys: [], templateId: "starter-violet", evidence: "limited" },
  { id: "rain", name: "Rain hush", blurb: "A steady rain-like hush, even across the pitches (pink noise).", mood: "calm", defaultLevel: 0.4, layerKeys: [], templateId: "starter-rain", evidence: "mixed" },
  { id: "deep", name: "Deep rumble", blurb: "A deep, low rumble like distant thunder or a big waterfall (brown noise).", mood: "deep", defaultLevel: 0.4, layerKeys: [], templateId: "starter-deep", evidence: "preference" },
  { id: "chimes", name: "Soft chimes", blurb: "Soft bells that ring now and then at uneven gaps.", mood: "dreamy", defaultLevel: 0.3, layerKeys: ["chimeLevel", "chimeRatePerMin"], templateId: "starter-chimes", evidence: "preference" },
  { id: "beats", name: "Beats only", blurb: "A soft pulse you hear as two slightly different tones, one per ear. Use headphones.", mood: "neutral", defaultLevel: 0, layerKeys: [], templateId: "starter-beats", evidence: "mixed" }
], zt = (e) => Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
function Et(e, t) {
  const n = zt(t);
  switch (e) {
    case "lofi":
      return { noise: "off", noiseLevel: 0, layers: { lofiLevel: n, lofiWarmth: 0.6, lofiProgression: 2, tapeWow: 0.35, crackle: 0.12, breathDepth: 0.4, breathRateHz: 0.08, stereoWidth: 0.5 } };
    case "piano":
      return { noise: "off", noiseLevel: 0, layers: { instLevel: n, instKind: 3, instRootHz: 220, instScale: 2, instBpm: 46, pianoPedal: 0.5, breathDepth: 0.3, breathRateHz: 0.07, stereoWidth: 0.4 } };
    case "violet":
      return { noise: "violet", noiseLevel: n, layers: {} };
    case "rain":
      return { noise: "pink", noiseLevel: n, layers: {} };
    case "deep":
      return { noise: "brown", noiseLevel: n, layers: {} };
    case "chimes":
      return { noise: "off", noiseLevel: 0, layers: { chimeLevel: n, chimeRatePerMin: 5, breathDepth: 0.2, breathRateHz: 0.06 } };
    default:
      return { noise: "off", noiseLevel: 0, layers: {} };
  }
}
const Ct = { warm: "warm", calm: "calm", bright: "bright", deep: "deep", dreamy: "dreamy", neutral: "minimal" };
function Ot(e) {
  const t = Et(e.id, e.defaultLevel), n = Object.keys(t.layers).length > 0, i = [{
    atMin: 0,
    beatHz: 8,
    carrierHz: 200,
    gain: 0.4,
    mode: "binaural",
    noise: t.noise,
    noiseLevel: t.noiseLevel,
    ...n ? { layers: t.layers } : {},
    ramp: !1
  }];
  return {
    id: e.templateId,
    name: e.name,
    category: "vibes",
    vibe: Ct[e.mood] ?? "calm",
    tags: ["starter", "sound-first", e.id],
    layerTags: X(i),
    situations: ["quick-reset", "heal-stress"],
    recommendedMinutes: 20,
    intensity: 1,
    adhdFriendly: ee(i, 1),
    stages: i,
    reasonTemplate: e.blurb,
    source: "original"
  };
}
function Dt() {
  return Tt.map(Ot);
}
function Ht() {
  return [
    ...Dt(),
    ...Rt(),
    ...[gt, pt, ht, ft, yt, dt, mt, bt].flatMap(ut)
  ];
}
let ue;
function P() {
  return ue ?? (ue = Ht()), ue;
}
new Proxy([], {
  get: (e, t) => Reflect.get(P(), t),
  has: (e, t) => Reflect.has(P(), t),
  ownKeys: () => Reflect.ownKeys(P()),
  getOwnPropertyDescriptor: (e, t) => {
    const n = Reflect.getOwnPropertyDescriptor(P(), t);
    return n === void 0 || t === "length" ? n : { ...n, configurable: !0 };
  }
});
function Pt(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.percLevel) ?? 0) > 0;
  });
}
function It(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.crackle) ?? 0) > 0;
  });
}
function de(e) {
  return e.stages.some((t) => t.mode === "binaural");
}
const jt = {
  focus: [1, 1, 0.5, 0.1],
  "adhd-control": [1, 1, 0.5, 0.1],
  vibes: [0.5, 0.8, 1, 0.5],
  "work-recovery": [0.5, 1, 1, 0.4],
  healing: [0.6, 0.7, 1, 0.8],
  meditation: [1, 0.6, 1, 0.6],
  sleep: [0, 0.2, 0.7, 1],
  "lucid-dreams": [0, 0.1, 0.6, 1]
}, Ft = { morning: 0, afternoon: 1, evening: 2, night: 3 }, xt = (e) => Math.round(e * 10) / 10;
function Bt(e, t, n) {
  const s = Math.max(1, t);
  if (e <= s)
    return n.push(`Fits your ${s} minutes (${e} min).`), 15 * (0.6 + 0.4 * (e / s));
  const i = (e - s) / s;
  return n.push(`Runs ${e} min, longer than your ${s}; you can stop any time.`), Math.max(0, 15 * (1 - i * 1.5)) - (i > 0.5 ? 5 : 0);
}
function _t(e, t, n) {
  return t.deviceType === "speaker" ? de(e) ? (n.push("Warning: binaural beats need headphones. A speaker will not deliver the effect; pick an isochronic or monaural template if you can."), -8) : (n.push("Isochronic or monaural beats work over speakers."), 10) : (n.push(t.deviceType === "bluetooth" ? "Good over Bluetooth headphones." : "Headphones suit every beat type."), de(e) ? 10 : 8);
}
function Gt(e, t, n) {
  const s = e.intensity > 3 || Pt(e) || It(e), i = t.sensorySensitivity;
  return i === "low" ? { pts: 10, sensitive: !1 } : i === "medium" ? { pts: e.intensity <= 3 ? s ? 7 : 10 : 4, sensitive: !1 } : s ? (n.push("Relaxed filter: this one is stronger or has percussion or crackle, shown because too few gentle matches exist."), { pts: 0, sensitive: !0 }) : (n.push("Gentle: low intensity, no percussion or crackle."), { pts: e.intensity <= 2 ? 10 : 7, sensitive: !1 });
}
function $t(e, t) {
  const n = [e.reasonTemplate.replace("{minutes}", String(e.recommendedMinutes))], s = e.situations.includes(t.situation);
  let i = 0;
  s ? (i += 40, n.push(`Made for: ${t.situation}.`)) : n.push(`Related option: not built for ${t.situation}, but close in mood.`), t.vibe === void 0 ? i += 7 : t.vibe === e.vibe && (i += 15, n.push(`Matches your ${t.vibe} vibe.`)), i += Bt(e.recommendedMinutes, t.availableMinutes, n);
  const a = (jt[e.category][Ft[t.timeOfDay]] ?? 0) * 10;
  i += a, a >= 8 && n.push(`Suits the ${t.timeOfDay}.`), e.intensity >= 4 && t.timeOfDay === "night" && (i -= 5), i += _t(e, t, n);
  const o = Gt(e, t, n);
  return i += o.pts, { template: e, score: Math.max(0, xt(i)), reasons: n, sensitive: o.sensitive, onSituation: s };
}
const qt = (e, t) => t.score - e.score || (e.template.id < t.template.id ? -1 : e.template.id > t.template.id ? 1 : 0);
function Wt(e, t = 5, n = P()) {
  const s = Math.max(1, Math.floor(t)), i = n.map((r) => $t(r, e)).sort(qt), a = [
    i.filter((r) => r.onSituation && !r.sensitive),
    i.filter((r) => !r.sensitive),
    i
  ], o = a.find((r) => r.length >= s) ?? i, l = o.slice(0, s);
  return o !== a[0] && l.forEach((r) => {
    r.onSituation || r.reasons.push("Filters relaxed: too few exact matches, so close alternatives are included.");
  }), l.map((r) => ({ template: r.template, score: r.score, reasons: r.reasons }));
}
const Kt = {
  focus: { situation: "deep-work", vibe: "bright", minutes: 25 },
  calm: { situation: "heal-stress", vibe: "calm", minutes: 15 },
  sleep: { situation: "cant-sleep", vibe: "dreamy", minutes: 45 },
  study: { situation: "deep-work", vibe: "minimal", minutes: 30 },
  recover: { situation: "ai-burnout", vibe: "warm", minutes: 15 },
  curious: { situation: "quick-reset", minutes: 10 }
}, Yt = {
  headphones: "headphones",
  bluetooth: "bluetooth",
  speakers: "speaker",
  unsure: "headphones"
};
function Jt(e) {
  return e < 12 ? "morning" : e >= 12 && e < 17 ? "afternoon" : e >= 17 && e < 21 ? "evening" : "night";
}
function Vt(e, t = /* @__PURE__ */ new Date()) {
  const n = Kt[e.goal], s = e.timeOfDay === "anytime" ? Jt(t.getHours()) : e.timeOfDay, i = {
    situation: n.situation,
    availableMinutes: n.minutes,
    timeOfDay: s,
    sensorySensitivity: e.extraGentle ? "high" : "medium",
    deviceType: Yt[e.device]
  };
  return Object.freeze(n.vibe === void 0 ? i : { ...i, vibe: n.vibe });
}
const Ut = 3, Zt = 864e5, be = 4;
function te(e) {
  if (!Number.isFinite(e)) return 0;
  const t = new Date(e).getTimezoneOffset() * 6e4;
  return Math.floor((e - t) / Zt);
}
const ve = (e) => Number.isInteger(e) && e >= 0 && e < 1e7;
function Qt(e) {
  return Number.isFinite(e) ? Math.min(7, Math.max(1, Math.floor(e))) : be;
}
function Xt(e) {
  return e - (e + 3) % 7;
}
function en(e, t, n) {
  const s = /* @__PURE__ */ new Map();
  for (const a of e) {
    if (!ve(a.day) || a.day < t || a.day > n) continue;
    const o = Number.isFinite(a.minutes) && a.minutes > 0 ? a.minutes : 0;
    s.set(a.day, (s.get(a.day) ?? 0) + o);
  }
  const i = /* @__PURE__ */ new Set();
  return s.forEach((a, o) => {
    a >= Ut && i.add(o);
  }), i;
}
function tn(e, t, n) {
  return n.has(e) ? "listened" : e === t ? "today" : e > t ? "upcoming" : "rest";
}
function nn(e, t, n = be) {
  const s = Qt(n);
  if (!ve(t)) {
    const l = Object.freeze(Array.from({ length: 7 }, () => "upcoming"));
    return Object.freeze({ daysListened: 0, goalDays: s, goalMet: !1, quietWeek: !0, dots: l });
  }
  const i = Xt(t), a = en(e, i, t), o = Object.freeze(Array.from({ length: 7 }, (l, r) => tn(i + r, t, a)));
  return Object.freeze({
    daysListened: a.size,
    goalDays: s,
    goalMet: a.size >= s,
    quietWeek: a.size === 0,
    dots: o
  });
}
const ne = "zonked.profile.v1", se = "zonked.journeys.v1", we = 32 * 1024, ke = 1, sn = 1e7, an = /^[a-z0-9-]{1,64}$/, Se = Object.freeze({
  goal: "curious",
  timeOfDay: "anytime",
  device: "unsure",
  extraGentle: !1,
  createdAt: 0
}), on = Object.freeze({}), ae = (e) => typeof e == "object" && e !== null && !Array.isArray(e), J = (e, t) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= t, q = (e, t) => e.some((n) => n === t);
function Ae(e, t) {
  try {
    const n = e.get(t);
    if (n === null || n.length > we) return;
    const s = JSON.parse(n);
    return ae(s) && s.v === ke ? s : void 0;
  } catch {
    return;
  }
}
function Me(e, t, n) {
  try {
    const s = JSON.stringify({ v: ke, ...n });
    return s.length > we ? !1 : (e.set(t, s), !0);
  } catch {
    return !1;
  }
}
function Le(e) {
  const { goal: t, timeOfDay: n, device: s, extraGentle: i, createdAt: a } = e;
  if (!(!q(qe, t) || !q(We, n) || !q(Ke, s)) && !(typeof i != "boolean" || !J(a, Number.MAX_SAFE_INTEGER)))
    return Object.freeze({ goal: t, timeOfDay: n, device: s, extraGentle: i, createdAt: a });
}
function rn(e) {
  const t = Ae(e, ne);
  return (t && Le(t)) ?? Se;
}
function ln(e, t) {
  const n = Le({ ...t });
  return n !== void 0 && Me(e, ne, { ...n });
}
function Ne(e, t) {
  const n = Q.find((r) => r.id === e);
  if (n === void 0 || !ae(t) || !J(t.startedAt, sn)) return;
  const { doneDays: s, pickedIds: i } = t;
  if (!Array.isArray(s) || !Array.isArray(i) || i.length > n.days.length) return;
  const a = s, o = i;
  if (!a.every((r) => J(r, n.days.length) && r >= 1) || !o.every((r) => typeof r == "string" && an.test(r))) return;
  const l = [...new Set(a)].sort((r, y) => r - y);
  return Object.freeze({
    startedAt: t.startedAt,
    doneDays: Object.freeze(l),
    pickedIds: Object.freeze([...o])
  });
}
function cn(e) {
  const t = Ae(e, se), n = t == null ? void 0 : t.journeys;
  if (!ae(n)) return on;
  const s = {};
  for (const [i, a] of Object.entries(n)) {
    const o = Ne(i, a);
    o !== void 0 && (s[i] = o);
  }
  return Object.freeze(s);
}
function un(e, t) {
  const n = {};
  for (const [s, i] of Object.entries(t)) {
    const a = Ne(s, i);
    a !== void 0 && (n[s] = a);
  }
  return Me(e, se, { journeys: n });
}
function dn(e) {
  for (const t of [ne, se])
    try {
      e.remove(t);
    } catch {
    }
}
function me() {
  const e = /* @__PURE__ */ new Map();
  return {
    get: (t) => e.get(t) ?? null,
    set: (t, n) => void e.set(t, n),
    remove: (t) => void e.delete(t)
  };
}
function mn(e) {
  try {
    const t = e ?? globalThis.localStorage;
    if (t === void 0) return me();
    const n = "zonked.probe";
    return t.setItem(n, "1"), t.removeItem(n), {
      get: (s) => t.getItem(s),
      set: (s, i) => t.setItem(s, i),
      remove: (s) => t.removeItem(s)
    };
  } catch {
    return me();
  }
}
function pn({ onAccept: e, onCancel: t }) {
  const n = B(null), s = B(null);
  T(() => {
    var o;
    return (o = n.current) == null ? void 0 : o.focus();
  }, []);
  const a = /* @__PURE__ */ b("div", { className: "c-safety", onKeyDown: (o) => {
    var l;
    if (t !== void 0) {
      if (o.key === "Escape")
        o.stopPropagation(), t();
      else if (o.key === "Tab") {
        const r = o.shiftKey ? s.current : n.current;
        document.activeElement === r && (o.preventDefault(), (l = o.shiftKey ? n.current : s.current) == null || l.focus());
      }
    }
  }, children: [
    /* @__PURE__ */ c("h2", { id: "c-safety-title", children: m.safetyTitle }),
    /* @__PURE__ */ c("ul", { className: "c-safe-list", children: m.safetyLines.map((o) => /* @__PURE__ */ c("li", { children: o }, o)) }),
    /* @__PURE__ */ b("div", { className: "c-actions c-row", children: [
      t !== void 0 && /* @__PURE__ */ c("button", { ref: s, type: "button", className: "c-btn", onClick: t, children: m.back }),
      /* @__PURE__ */ c("button", { ref: n, type: "button", className: "c-btn c-primary", "data-testid": "calm-safety-accept", onClick: e, children: m.safetyAccept })
    ] })
  ] });
  return t === void 0 ? a : /* @__PURE__ */ c("div", { className: "c-overlay", children: /* @__PURE__ */ c("div", { className: "c-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-safety-title", children: a }) });
}
const hn = 1, fn = 720;
function yn(e) {
  const t = (e.endedAt - e.startedAt) / 6e4;
  return Number.isFinite(t) && t >= hn ? Math.min(fn, t) : 0;
}
const gn = 200, V = (e = Date.now) => te(e());
function bn(e, t) {
  const n = W(() => mn(), []), [s, i] = S(() => rn(n)), [a, o] = S(() => cn(n)), [l, r] = S([]), [y, L] = S(0);
  T(() => {
    let h = !0;
    return e.listLogs(gn).then((M) => h && r(M)).catch(() => {
    }), () => {
      h = !1;
    };
  }, [e, y, t]);
  const A = W(() => {
    const h = l.map((M) => ({ day: te(M.startedAt), minutes: yn(M) }));
    return nn(h, V());
  }, [l]), g = N(
    (h) => {
      i(h), ln(n, h);
    },
    [n]
  ), v = N(
    (h, M) => {
      o((w) => {
        const { [h]: O, ...z } = w, I = M === null ? z : { ...z, [h]: M };
        return un(n, I), I;
      });
    },
    [n]
  ), p = N(() => L((h) => h + 1), []);
  return { storage: n, profile: s, progress: a, week: A, logs: l, setProfile: g, setJourney: v, refresh: p };
}
const vn = ["M", "T", "W", "T", "F", "S", "S"], pe = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], wn = { listened: "listened", rest: "rest day", today: "today", upcoming: "coming up" };
function kn(e, t = !0) {
  if (e.quietWeek) return t ? m.welcomeBack : m.firstWeek;
  const n = e.daysListened;
  return `${n} ${n === 1 ? "day" : "days"} this week. ${m.restCount}`;
}
function Sn({ week: e, hasHistory: t = !0 }) {
  return /* @__PURE__ */ b("div", { className: "c-week", children: [
    /* @__PURE__ */ c("ul", { className: "c-dots", "aria-label": "This week", children: e.dots.map((n, s) => /* @__PURE__ */ b("li", { className: `c-dot c-dot-${n}`, "data-state": n, children: [
      /* @__PURE__ */ c("span", { className: "c-mark", "aria-hidden": "true", children: vn[s] }),
      /* @__PURE__ */ c("span", { className: "c-sr", children: `${pe[s]}, ${wn[n]}` })
    ] }, pe[s])) }),
    /* @__PURE__ */ c("p", { className: "c-muted", "data-testid": "week-text", children: kn(e, t) })
  ] });
}
const An = R(() => import("./chunk-mascot-BtlVTBkR.mjs").then((e) => ({ default: e.CalmMascot }))), Mn = () => /* @__PURE__ */ new Date();
function Ln(e, t, n) {
  var i;
  const s = ((i = e[t]) == null ? void 0 : i.doneDays.length) ?? 0;
  return s === 0 ? "Not started" : `Day ${Math.min(n, s + 1)} of ${n}`;
}
function Nn({ profile: e, week: t, progress: n, reduced: s, crewConnected: i, hasHistory: a = !0, now: o = Mn, onPlay: l, onOpenJourney: r, onGo: y }) {
  const [L, A] = S(0), g = W(() => Wt(Vt(e, o()), 5), [e, o]), v = g[L % Math.max(1, g.length)];
  return /* @__PURE__ */ b("div", { className: "c-today", children: [
    /* @__PURE__ */ c("div", { className: "c-hero c-hero-sm", children: /* @__PURE__ */ c(he, { fallback: null, children: /* @__PURE__ */ c(An, { mood: "idle", size: 128, reducedMotion: s }) }) }),
    /* @__PURE__ */ c("h1", { className: "c-greet", "data-testid": "greeting", children: Be(o().getHours()) }),
    v !== void 0 && /* @__PURE__ */ b("section", { className: "c-card c-daily", "aria-labelledby": "c-daily-h", children: [
      /* @__PURE__ */ c("p", { className: "c-eyebrow", children: m.dailyEyebrow }),
      /* @__PURE__ */ c("h2", { id: "c-daily-h", children: v.template.name }),
      /* @__PURE__ */ c("p", { className: "c-muted", children: `${v.template.recommendedMinutes} min. ${v.reasons[0] ?? m.suggested}` }),
      /* @__PURE__ */ b("div", { className: "c-actions", children: [
        /* @__PURE__ */ c("button", { type: "button", className: "c-btn c-primary", "data-testid": "today-play", onClick: () => l(v.template), children: m.start }),
        /* @__PURE__ */ c("button", { type: "button", className: "c-btn c-link", onClick: () => A((p) => p + 1), children: m.notThisOne })
      ] })
    ] }),
    /* @__PURE__ */ b("section", { className: "c-card", "aria-labelledby": "c-goal-h", children: [
      /* @__PURE__ */ c("h2", { id: "c-goal-h", className: "c-h3", children: `Your goal: ${xe[e.goal]}` }),
      /* @__PURE__ */ c(Sn, { week: t, hasHistory: a })
    ] }),
    /* @__PURE__ */ b("section", { "aria-labelledby": "c-for-h", children: [
      /* @__PURE__ */ c("h2", { id: "c-for-h", className: "c-h3", children: m.forYou }),
      /* @__PURE__ */ c("ul", { className: "c-hscroll", children: g.map((p, h) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ b("button", { type: "button", className: `c-mini-card c-g${h % 6 + 1}`, onClick: () => l(p.template), children: [
        /* @__PURE__ */ c("b", { children: p.template.name }),
        /* @__PURE__ */ c("small", { children: p.reasons[0] ?? m.suggested }),
        /* @__PURE__ */ c("em", { children: `${p.template.recommendedMinutes} min` })
      ] }) }, p.template.id)) })
    ] }),
    /* @__PURE__ */ b("section", { "aria-labelledby": "c-jr-h", children: [
      /* @__PURE__ */ c("h2", { id: "c-jr-h", className: "c-h3", children: m.journeysTitle }),
      /* @__PURE__ */ c("ul", { className: "c-hscroll", children: Q.map((p, h) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ b("button", { type: "button", className: `c-journey-card c-j${h % 6 + 1}`, onClick: () => r(p.id), children: [
        /* @__PURE__ */ c("b", { children: p.title }),
        /* @__PURE__ */ c("small", { children: p.blurb }),
        /* @__PURE__ */ c("em", { children: Ln(n, p.id, p.days.length) })
      ] }) }, p.id)) })
    ] }),
    /* @__PURE__ */ b("button", { type: "button", className: "c-card c-link-card", onClick: () => y("library"), children: [
      /* @__PURE__ */ c("b", { children: "Browse all sounds" }),
      /* @__PURE__ */ c("span", { className: "c-muted", children: m.libraryTitle })
    ] }),
    i && /* @__PURE__ */ c("p", { className: "c-card c-crew-chip", role: "status", children: "Crew connected: easing the sound" })
  ] });
}
const Rn = R(() => import("./chunk-Journeys-BREWWmFY.mjs").then((e) => ({ default: e.JourneyList }))), Tn = R(() => import("./chunk-Journeys-BREWWmFY.mjs").then((e) => ({ default: e.JourneyDetail }))), zn = R(() => import("./chunk-Library-GSkzZhQm.mjs").then((e) => ({ default: e.Library }))), En = R(() => import("./chunk-PlayerScreen-CBPNMcOI.mjs").then((e) => ({ default: e.PlayerScreen }))), Cn = R(() => import("./chunk-CrewScreen-DHMuZIU4.mjs").then((e) => ({ default: e.CrewScreen }))), On = R(() => import("./chunk-SettingsScreen-Cyq_PgQ5.mjs").then((e) => ({ default: e.SettingsScreen })));
function Dn({ view: e, journeyId: t, s: n, data: s, crewInfo: i, still: a, fav: o, handlers: l }) {
  switch (e) {
    case "journeys":
      return /* @__PURE__ */ c(Rn, { progress: s.progress, onOpen: l.openJourney });
    case "journey":
      return /* @__PURE__ */ c(
        Tn,
        {
          id: t ?? "",
          profile: s.profile,
          progress: s.progress,
          todayDay: V(),
          onBack: () => l.go("journeys"),
          onStartJourney: s.setJourney,
          onRestart: (r) => s.setJourney(r, null),
          onPlayDay: l.playDay
        }
      );
    case "library":
      return /* @__PURE__ */ c(zn, { store: n.store, logs: s.logs, onPlay: l.play, onPlayMix: l.onMix });
    case "player":
      return /* @__PURE__ */ c(En, { player: n.player, snap: n.snap, still: a, favorite: o.on, onToggle: n.toggle, onFavorite: o.toggle });
    case "crew":
      return /* @__PURE__ */ c(Cn, { crew: i, burnout: n.snap.burnout });
    case "settings":
      return /* @__PURE__ */ c(
        On,
        {
          gentle: s.profile.extraGentle,
          reduceMotion: n.userReduced,
          onGentle: (r) => s.setProfile({ ...s.profile, extraGentle: r }),
          onReduceMotion: n.setReduced,
          onStudio: l.onStudio,
          onForget: l.forget
        }
      );
    default:
      return /* @__PURE__ */ c(
        Nn,
        {
          profile: s.profile,
          week: s.week,
          progress: s.progress,
          reduced: a,
          hasHistory: s.logs.some((r) => te(r.startedAt) < V()),
          crewConnected: i.enabled && i.status === "connected",
          onPlay: l.play,
          onOpenJourney: l.openJourney,
          onGo: l.go
        }
      );
  }
}
function Hn() {
  const { player: e, store: t } = fe(), [n, s] = S(() => e.snapshot()), [i, a] = S(ze), [o, l] = S(!1), [r, y, L] = Ee(), A = B(null);
  T(() => (s(e.snapshot()), e.subscribe(s)), [e]);
  const g = N(
    (w) => {
      i ? w() : (A.current = w, l(!0));
    },
    [i]
  ), v = N(() => {
    Ce(Oe, !0), a(!0), l(!1);
    const w = A.current;
    A.current = null, w == null || w();
  }, []), p = N(() => {
    A.current = null, l(!1);
  }, []), h = N(
    (w, O) => g(() => {
      e.setQueue([w]), e.playTemplate(w).then((z) => {
        z && O !== null && e.startTimer({ kind: "countdown", minutes: O });
      });
    }),
    [e, g]
  ), M = N(() => {
    e.snapshot().playing ? e.stop() : g(() => void e.play());
  }, [e, g]);
  return { player: e, store: t, snap: n, accepted: i, gate: o, reduced: r, setReduced: y, userReduced: L, guarded: g, accept: v, cancelGate: p, playTemplate: h, toggle: M };
}
function Pn(e, t) {
  const [n, s] = S("standalone"), [i, a] = S(() => De());
  return T(() => He(a), []), T(() => {
    const o = new Pe({
      ...t !== void 0 ? { create: t } : {},
      onStatus: (l) => {
        s(l), l === "standalone" && e.crewLost();
      },
      onState: (l) => e.applyCrew(l)
    });
    return o.start(), () => o.stop();
  }, [e, t]), { enabled: i, status: n };
}
const U = 500, Z = { v: 1, items: [] };
function In(e, t) {
  if (!oe(e) || H(e, "v") !== 1) return Z;
  const n = H(e, "items");
  if (!Array.isArray(n)) return Z;
  const s = [], i = /* @__PURE__ */ new Set();
  for (const a of n.slice(0, U * 2)) {
    if (!oe(a)) continue;
    const o = H(a, "kind"), l = ye(H(a, "id"));
    if (o !== "template" && o !== "mix" || l === null) continue;
    const r = `${o}:${l}`;
    if (!i.has(r) && (i.add(r), s.push({ kind: o, id: l, at: Ie(H(a, "at"), 0, t + 864e5, t) }), s.length >= U))
      break;
  }
  return { v: 1, items: s };
}
function Re(e, t, n) {
  return e.items.some((s) => s.kind === t && s.id === n);
}
function jn(e, t, n, s) {
  return Re(e, t, n) ? { v: 1, items: e.items.filter((i) => !(i.kind === t && i.id === n)) } : ye(n) === null || e.items.length >= U ? e : { v: 1, items: [{ kind: t, id: n, at: s }, ...e.items] };
}
function Fn(e, t) {
  const [n, s] = S(Z);
  T(() => {
    let a = !0;
    return e.getRecord("favorites").then((o) => a && s(In(o, Date.now()))).catch(() => {
    }), () => {
      a = !1;
    };
  }, [e]);
  const i = N(() => {
    if (t === null) return;
    const a = jn(n, "template", t, Date.now());
    s(a), e.setRecord("favorites", a).catch(() => {
    });
  }, [n, t, e]);
  return { on: t !== null && Re(n, "template", t), toggle: i };
}
const xn = R(() => import("./chunk-Onboarding-BxvbDVNe.mjs").then((e) => ({ default: e.Onboarding }))), Bn = (e) => Math.max(180, e * 60 * 0.8);
function _n({ engine: e, clock: t, store: n, bridgeCreate: s, onStudio: i }) {
  const a = Hn(), o = bn(a.store, a.snap.playing), l = Pn(a.player, s), [r, y] = S("today"), [L, A] = S(null), g = B(null), v = Fn(a.store, a.snap.templateId), p = o.profile.createdAt === 0, h = a.reduced || o.profile.extraGentle, M = N((k) => y(k), []), w = N(
    (k, D = k.recommendedMinutes) => {
      g.current = null, a.playTemplate(k, D), y("player");
    },
    [a]
  ), O = (k, D, ie) => {
    w(ie), g.current = { id: k, no: D, needSec: Bn(ie.recommendedMinutes) };
  };
  Gn(a.snap.playing, a.snap.elapsedSec, g, o.progress, o.setJourney);
  const z = (k, D) => {
    o.setProfile(k), w(D);
  }, I = (k) => {
    A(k), y("journey");
  }, Te = () => {
    dn(o.storage), o.setProfile(Se), y("today");
  };
  return /* @__PURE__ */ b("div", { className: "c-app", "data-theme": "auto", "data-motion": h ? "off" : "on", "data-playing": a.snap.playing ? "true" : "false", children: [
    /* @__PURE__ */ c("a", { className: "c-skip", href: "#c-main", children: "Skip to content" }),
    /* @__PURE__ */ b("header", { className: "c-topbar", children: [
      /* @__PURE__ */ c("span", { className: "c-brand", children: m.brand }),
      /* @__PURE__ */ c("button", { type: "button", className: "c-chip-btn", "data-testid": "studio-top", "aria-pressed": "false", onClick: i, children: m.studio })
    ] }),
    /* @__PURE__ */ c("main", { id: "c-main", className: "c-main", tabIndex: -1, children: /* @__PURE__ */ c(he, { fallback: /* @__PURE__ */ c("p", { className: "c-loading", role: "status", children: m.loading }), children: p ? /* @__PURE__ */ c(
      xn,
      {
        playing: a.snap.playing,
        reduced: h,
        initial: o.profile,
        onAccept: a.accept,
        onPreview: (k) => a.playTemplate(k, null),
        onStop: () => void a.player.stop(),
        onFinish: z
      }
    ) : /* @__PURE__ */ c(
      Dn,
      {
        view: r,
        journeyId: L,
        s: a,
        data: o,
        crewInfo: l,
        still: h,
        fav: v,
        handlers: { go: M, play: w, playDay: O, openJourney: I, forget: Te, onStudio: i, onMix: (k) => a.guarded(() => a.player.playMix(k)) }
      }
    ) }) }),
    !p && r !== "player" && /* @__PURE__ */ c($e, { snap: a.snap, onOpen: () => M("player"), onStop: () => void a.player.stop() }),
    !p && /* @__PURE__ */ c(Ge, { view: r, onGo: M }),
    /* @__PURE__ */ c("p", { className: "c-sr", role: "status", "data-testid": "play-status", children: a.snap.playing ? `Playing. ${m.volumeCapped}` : "Stopped." }),
    a.gate && /* @__PURE__ */ c(pn, { onAccept: a.accept, onCancel: a.cancelGate })
  ] });
}
function Gn(e, t, n, s, i) {
  T(() => {
    const a = n.current, o = a === null ? void 0 : s[a.id];
    !e || a === null || o === void 0 || t < a.needSec || (n.current = null, o.doneDays.includes(a.no) || i(a.id, { ...o, doneDays: [...o.doneDays, a.no].sort((l, r) => l - r) }));
  }, [e, t, n, s, i]);
}
const $n = "zonked.css";
function qn(e) {
  const t = new URL($n, e).href;
  if ([...document.querySelectorAll("link[data-zonked-css]")].some((i) => i.getAttribute("href") === t)) return;
  const s = document.createElement("link");
  s.rel = "stylesheet", s.href = t, s.setAttribute("data-zonked-css", "1"), document.head.appendChild(s);
}
const Wn = {
  position: "fixed",
  left: 12,
  right: 12,
  bottom: 84,
  zIndex: 70,
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(30,30,40,0.92)",
  color: "#fff",
  fontSize: 14,
  textAlign: "center"
};
function es() {
  qn(import.meta.url), je();
  const { engine: e, store: t } = fe(), [n, s] = S(!1);
  return /* @__PURE__ */ b("div", { "data-testid": "zonked-app", style: { height: "100%", minHeight: 0, overflow: "hidden", position: "relative", transform: "translateZ(0)" }, children: [
    /* @__PURE__ */ c("div", { style: { height: "100%", overflowY: "auto" }, children: /* @__PURE__ */ c(_n, { engine: e, store: t, onStudio: () => s(!0) }) }),
    n && /* @__PURE__ */ c("p", { role: "status", style: Wn, "data-testid": "studio-note", onClick: () => s(!1), children: "Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close." })
  ] });
}
export {
  m as C,
  Se as D,
  Qn as E,
  Zn as F,
  xe as G,
  Q as J,
  Z as N,
  pn as S,
  Vn as T,
  es as Z,
  qe as a,
  We as b,
  Un as c,
  Ke as d,
  P as e,
  In as f,
  Xn as g,
  Tt as h,
  Fe as i,
  Vt as p,
  Wt as r
};
