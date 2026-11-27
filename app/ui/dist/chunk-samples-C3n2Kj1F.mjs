import { L as V, t as A, v as R, x as C, y as T, z as x, A as O, H as U, I as E } from "./chunk-crewLink-Cq0htOCx.mjs";
import { M as Y } from "./chunk-crewLink-Cq0htOCx.mjs";
import { e as M } from "./chunk-App-CzOQ23by.mjs";
const w = [
  { id: "rain", label: "Rain" },
  { id: "stream", label: "Stream" },
  { id: "ocean", label: "Ocean waves" },
  { id: "rapids", label: "River rapids" },
  { id: "forest", label: "Forest" },
  { id: "birds", label: "Birds" },
  { id: "breeze", label: "Breeze and birds" },
  { id: "wind", label: "Soft wind (synth)", kind: "synth", note: "Slow gusts of warm wind, made in code." },
  { id: "waterfall", label: "Waterfall (synth)", kind: "synth", note: "A steady, soft fall of water, made in code." },
  { id: "flute", label: "Soft flute (synth)", kind: "synth", note: "Slow, quiet notes, made in code. Not a real flute." }
], p = (a) => ({ ok: !1, error: a }), F = 20261128, z = /^[a-z]+$/;
function I(a) {
  const u = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map();
  let r = null, s = 0, h = null, f = 0, y = 0;
  const b = () => r === null ? 0 : h ?? O(s);
  function d(e) {
    e.duck.gain.setTargetAtTime(R(b()), e.ctx.currentTime, C);
  }
  function L(e) {
    if (!z.test(e) || !w.some((t) => t.id === e)) return null;
    try {
      const t = new URL(`${a.baseUrl}samples/${e}.mp3.json`, a.origin);
      return t.origin === new URL(a.origin).origin ? t.href : null;
    } catch {
      return null;
    }
  }
  async function v(e, t) {
    if (u.has(t)) return { ok: !0 };
    const n = L(t);
    if (n === null) return p("unknown sample");
    try {
      const l = await a.fetchBytes(n), i = await e.ctx.decodeAudioData(l);
      return u.set(t, i), { ok: !0 };
    } catch {
      return p("sample unavailable: check the connection or reinstall the app files");
    }
  }
  function _(e, t) {
    const n = g.get(t);
    if (n !== void 0) return n;
    const l = v(e, t).finally(() => {
      g.delete(t);
    });
    return g.set(t, l), l;
  }
  function S(e, t) {
    const n = t.ctx.currentTime, l = e.gain.gain;
    l.cancelScheduledValues(n), l.setValueAtTime(l.value, n), l.linearRampToValueAtTime(0, n + A);
    try {
      e.src.stop(n + A + 0.05);
    } catch {
    }
    e.src.onended = () => {
      e.src.disconnect(), e.gain.disconnect();
    };
  }
  function k(e, t, n, l, i) {
    r !== null && S(r, e), s = T(l, s);
    const c = e.ctx.createBufferSource(), o = e.ctx.createGain();
    c.buffer = n, c.loop = i, o.gain.setValueAtTime(0, e.ctx.currentTime), o.gain.linearRampToValueAtTime(s, e.ctx.currentTime + x), c.connect(o), o.connect(e.input);
    const B = { id: t, src: c, gain: o };
    return i || (c.onended = () => {
      c.disconnect(), o.disconnect(), r === B && (r = null, d(e));
    }), c.start(), r = B, d(e), { ok: !0 };
  }
  async function D(e, t, n, l) {
    let i;
    try {
      i = (await import("./chunk-graph-PmhAJvOp.mjs")).buildSynth;
    } catch {
      return p("sample unavailable: reinstall the app files");
    }
    if (l !== f) return { ok: !0 };
    r !== null && S(r, e), s = T(n, s);
    const c = i(e.ctx, t, F + y++), o = e.ctx.createGain();
    return o.gain.setValueAtTime(0, e.ctx.currentTime), o.gain.linearRampToValueAtTime(s, e.ctx.currentTime + x), c.connect(o), o.connect(e.input), r = { id: t, src: c, gain: o }, d(e), { ok: !0 };
  }
  return {
    list: () => w,
    async start(e, t) {
      const n = a.getBus();
      if (n === null) return p("start the sound first");
      const l = ++f;
      if (w.some((o) => o.id === e && o.kind === "synth")) return D(n, e, t, l);
      const i = await _(n, e);
      if (!i.ok) return i;
      const c = u.get(e);
      return c === void 0 || l !== f ? c === void 0 ? p("sample unavailable") : { ok: !0 } : k(n, e, c, t, !0);
    },
    /** Plays a ready buffer (a person's own sound). Loops, or plays once when `loop` is false. */
    startBuffer(e, t, n, l) {
      const i = a.getBus();
      return i === null ? p("start the sound first") : (f++, k(i, e, t, n, l));
    },
    setLevel(e) {
      s = T(e, s);
      const t = a.getBus();
      if (t === null || r === null) return;
      const n = r.gain.gain;
      n.cancelScheduledValues(t.ctx.currentTime), n.setTargetAtTime(s, t.ctx.currentTime, V), d(t);
    },
    setBlend(e) {
      h = U(e, h ?? 0);
      const t = a.getBus();
      t !== null && d(t);
    },
    stop() {
      f++;
      const e = a.getBus(), t = r;
      r = null, !(e === null || t === null) && (S(t, e), d(e));
    },
    playing: () => (r == null ? void 0 : r.id) ?? null
  };
}
async function $(a) {
  const u = await fetch(a, { credentials: "same-origin" });
  if (!u.ok) throw new Error(`status ${u.status}`);
  return u.arrayBuffer();
}
const m = I({
  getBus: E,
  fetchBytes: $,
  baseUrl: "./",
  origin: typeof location > "u" ? "" : location.href
}), K = () => m.list(), P = (a, u) => m.start(a, u), j = (a) => m.setLevel(a), q = () => m.stop(), H = (a) => m.setBlend(a), W = () => m.playing();
async function X(a, u, g) {
  const r = E();
  if (r === null) return { ok: !1, error: "start the sound first" };
  try {
    const s = await r.ctx.decodeAudioData(u.slice(0)), h = Array.from({ length: s.numberOfChannels }, (b, d) => s.getChannelData(d)), f = M(h, s.sampleRate);
    if (!f.ok) return f;
    const y = r.ctx.createBuffer(1, f.data.length, s.sampleRate);
    return y.getChannelData(0).set(f.data), m.startBuffer(a, y, g, f.loop);
  } catch {
    return { ok: !1, error: "This file could not be played." };
  }
}
export {
  Y as MAX_SAMPLE_LEVEL,
  R as duckGain,
  K as listSamples,
  W as playingSample,
  H as setBlend,
  j as setSampleLevel,
  X as startOwn,
  P as startSample,
  q as stopSample
};
