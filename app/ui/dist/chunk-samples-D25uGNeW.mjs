import { M as D, N as T, O as C, P as F, Q as b, R as B, U as O, V, W as x } from "./chunk-crewLink-BQ1FLTqp.mjs";
import { X as Y } from "./chunk-crewLink-BQ1FLTqp.mjs";
import { e as U } from "./chunk-App-7MO50ppA.mjs";
const y = [
  { id: "rain", label: "Rain", kind: "loop", note: "Steady rain on leaves and ground.", moods: ["focus", "calm", "sleep", "nature"] },
  { id: "stream", label: "Stream", kind: "loop", note: "Clear water running close by.", moods: ["focus", "calm", "nature"] },
  { id: "ocean", label: "Ocean waves", kind: "loop", note: "Slow waves on a tropical beach.", moods: ["calm", "sleep", "nature"] },
  { id: "rapids", label: "River rapids", kind: "loop", note: "A wide river over rocks, a steady wash.", moods: ["focus", "nature"] },
  { id: "forest", label: "Forest", kind: "loop", note: "Quiet woods with a little air in the trees.", moods: ["focus", "calm", "nature"] },
  { id: "birds", label: "Birds", kind: "loop", note: "Birds singing in a garden.", moods: ["calm", "nature"] },
  { id: "breeze", label: "Breeze and birds", kind: "loop", note: "A soft breeze with birds far off.", moods: ["calm", "nature"] },
  { id: "lightrain", label: "Light rain", kind: "loop", note: "Fine rain with a faint rumble far away.", moods: ["focus", "calm", "sleep", "nature"] },
  { id: "thunder", label: "Far thunder", kind: "loop", note: "Light rain with slow thunder in the distance.", moods: ["calm", "sleep", "nature"] },
  { id: "veranda", label: "Rain on a veranda", kind: "loop", note: "Rain on a covered porch.", moods: ["focus", "calm", "sleep", "nature"] },
  { id: "window", label: "Rain on a window", kind: "loop", note: "Rain tapping on glass.", moods: ["focus", "calm", "sleep"] },
  { id: "storm", label: "Summer rain", kind: "loop", note: "A long, even summer shower.", moods: ["focus", "sleep", "nature"] },
  { id: "waves", label: "Gentle waves", kind: "loop", note: "Water rolling in and out on a shore.", moods: ["calm", "sleep", "nature"] },
  { id: "pebbles", label: "Waves on pebbles", kind: "loop", note: "Waves pulling back over small stones.", moods: ["calm", "sleep", "nature"] },
  { id: "creek", label: "Forest creek", kind: "loop", note: "A small creek in a quiet wood.", moods: ["focus", "calm", "nature"] },
  { id: "trickle", label: "Water trickle", kind: "loop", note: "Thin water dripping and running.", moods: ["focus", "calm"] },
  { id: "fountain", label: "Fountain", kind: "loop", note: "A town fountain, a bright steady wash.", moods: ["focus", "calm"] },
  { id: "fire", label: "Fire crackle", kind: "loop", note: "Dry grass crackling in an open fireplace.", moods: ["calm", "sleep"] },
  { id: "chimes", label: "Wind chimes", kind: "loop", note: "Chimes in a light wind, with soft gaps.", moods: ["calm", "nature"] },
  { id: "koshi", label: "Koshi chimes", kind: "loop", note: "Slow, airy chimes that ring out and fade.", moods: ["calm", "sleep"] },
  { id: "gong", label: "Temple gong", kind: "loop", note: "Deep gong strikes with long, slow fades.", moods: ["calm", "sleep"] },
  { id: "hum", label: "Fan hum", kind: "loop", note: "A smooth room hum, like a fan.", moods: ["focus", "sleep"] },
  { id: "wind", label: "Soft wind (synth)", kind: "synth", note: "Slow gusts of warm wind, made in code.", moods: ["calm", "sleep", "nature"] },
  { id: "waterfall", label: "Waterfall (synth)", kind: "synth", note: "A steady, soft fall of water, made in code.", moods: ["focus", "calm", "nature"] },
  { id: "flute", label: "Soft flute (synth)", kind: "synth", note: "Slow, quiet notes, made in code. Not a real flute.", moods: ["calm", "sleep"] },
  { id: "rainroof", label: "Rain on a roof (synth)", kind: "synth", note: "Soft drops on a roof, made in code.", moods: ["focus", "calm", "sleep"] },
  { id: "bowl", label: "Singing bowl (synth)", kind: "synth", note: "One slow strike every 8 to 14 s, made in code.", moods: ["calm", "sleep"] },
  { id: "softchimes", label: "Soft chimes (synth)", kind: "synth", note: "A few high notes now and then, made in code.", moods: ["calm", "sleep"] },
  { id: "crackle", label: "Campfire crackle (synth)", kind: "synth", note: "A low glow with small pops, made in code.", moods: ["calm", "sleep"] },
  { id: "brown", label: "Brown noise (synth)", kind: "synth", note: "A deep, soft rumble that masks noise.", moods: ["focus", "sleep"] },
  { id: "swell", label: "Ocean swell (synth)", kind: "synth", note: "Slow waves that rise and fall, made in code.", moods: ["calm", "sleep", "nature"] },
  { id: "crickets", label: "Night crickets (synth)", kind: "synth", note: "Quiet crickets far off, made in code.", moods: ["calm", "sleep", "nature"] }
], p = (o) => ({ ok: !1, error: o }), W = 20261128, M = /^[a-z]+$/;
function N(o) {
  const d = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
  let a = null, s = 0, g = null, u = 0, k = 0;
  const S = () => a === null ? 0 : g ?? O(s);
  function m(e) {
    e.duck.gain.setTargetAtTime(C(S()), e.ctx.currentTime, F);
  }
  function L(e) {
    if (!M.test(e) || !y.some((n) => n.id === e)) return null;
    try {
      const n = new URL(`${o.baseUrl}samples/${e}.mp3.json`, o.origin);
      return n.origin === new URL(o.origin).origin ? n.href : null;
    } catch {
      return null;
    }
  }
  async function E(e, n) {
    if (d.has(n)) return { ok: !0 };
    const t = L(n);
    if (t === null) return p("unknown sample");
    try {
      const l = await o.fetchBytes(t), c = await e.ctx.decodeAudioData(l);
      return d.set(n, c), { ok: !0 };
    } catch {
      return p("sample unavailable: check the connection or reinstall the app files");
    }
  }
  function R(e, n) {
    const t = h.get(n);
    if (t !== void 0) return t;
    const l = E(e, n).finally(() => {
      h.delete(n);
    });
    return h.set(n, l), l;
  }
  function w(e, n) {
    const t = n.ctx.currentTime, l = e.gain.gain;
    l.cancelScheduledValues(t), l.setValueAtTime(l.value, t), l.linearRampToValueAtTime(0, t + T);
    try {
      e.src.stop(t + T + 0.05);
    } catch {
    }
    e.src.onended = () => {
      e.src.disconnect(), e.gain.disconnect();
    };
  }
  function v(e, n, t, l, c) {
    a !== null && w(a, e), s = b(l, s);
    const r = e.ctx.createBufferSource(), i = e.ctx.createGain();
    r.buffer = t, r.loop = c, i.gain.setValueAtTime(0, e.ctx.currentTime), i.gain.linearRampToValueAtTime(s, e.ctx.currentTime + B), r.connect(i), i.connect(e.input);
    const A = { id: n, src: r, gain: i };
    return c || (r.onended = () => {
      r.disconnect(), i.disconnect(), a === A && (a = null, m(e));
    }), r.start(), a = A, m(e), { ok: !0 };
  }
  async function _(e, n, t, l) {
    let c;
    try {
      c = (await import("./chunk-graph-BSt4xAW7.mjs")).buildSynth;
    } catch {
      return p("sample unavailable: reinstall the app files");
    }
    if (l !== u) return { ok: !0 };
    a !== null && w(a, e), s = b(t, s);
    const r = c(e.ctx, n, W + k++), i = e.ctx.createGain();
    return i.gain.setValueAtTime(0, e.ctx.currentTime), i.gain.linearRampToValueAtTime(s, e.ctx.currentTime + B), r.connect(i), i.connect(e.input), a = { id: n, src: r, gain: i }, m(e), { ok: !0 };
  }
  return {
    list: () => y,
    async start(e, n) {
      const t = o.getBus();
      if (t === null) return p("start the sound first");
      const l = ++u;
      if (y.some((i) => i.id === e && i.kind === "synth")) return _(t, e, n, l);
      const c = await R(t, e);
      if (!c.ok) return c;
      const r = d.get(e);
      return r === void 0 || l !== u ? r === void 0 ? p("sample unavailable") : { ok: !0 } : v(t, e, r, n, !0);
    },
    /** Plays a ready buffer (a person's own sound). Loops, or plays once when `loop` is false. */
    startBuffer(e, n, t, l) {
      const c = o.getBus();
      return c === null ? p("start the sound first") : (u++, v(c, e, n, t, l));
    },
    setLevel(e) {
      s = b(e, s);
      const n = o.getBus();
      if (n === null || a === null) return;
      const t = a.gain.gain;
      t.cancelScheduledValues(n.ctx.currentTime), t.setTargetAtTime(s, n.ctx.currentTime, D), m(n);
    },
    setBlend(e) {
      g = V(e, g ?? 0);
      const n = o.getBus();
      n !== null && m(n);
    },
    stop() {
      u++;
      const e = o.getBus(), n = a;
      a = null, !(e === null || n === null) && (w(n, e), m(e));
    },
    playing: () => (a == null ? void 0 : a.id) ?? null
  };
}
async function z(o) {
  const d = await fetch(o, { credentials: "same-origin" });
  if (!d.ok) throw new Error(`status ${d.status}`);
  return d.arrayBuffer();
}
const f = N({
  getBus: x,
  fetchBytes: z,
  baseUrl: "./",
  origin: typeof location > "u" ? "" : location.href
}), I = () => f.list(), K = (o, d) => f.start(o, d), P = (o) => f.setLevel(o), Q = () => f.stop(), q = (o) => f.setBlend(o), X = () => f.playing();
async function j(o, d, h) {
  const a = x();
  if (a === null) return { ok: !1, error: "start the sound first" };
  try {
    const s = await a.ctx.decodeAudioData(d.slice(0)), g = Array.from({ length: s.numberOfChannels }, (S, m) => s.getChannelData(m)), u = U(g, s.sampleRate);
    if (!u.ok) return u;
    const k = a.ctx.createBuffer(1, u.data.length, s.sampleRate);
    return k.getChannelData(0).set(u.data), f.startBuffer(o, k, h, u.loop);
  } catch {
    return { ok: !1, error: "This file could not be played." };
  }
}
export {
  Y as MAX_SAMPLE_LEVEL,
  C as duckGain,
  I as listSamples,
  X as playingSample,
  q as setBlend,
  P as setSampleLevel,
  j as startOwn,
  K as startSample,
  Q as stopSample
};
