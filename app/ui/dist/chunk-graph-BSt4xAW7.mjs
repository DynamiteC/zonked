function b(t) {
  let e = (Number.isFinite(t) ? Math.trunc(t) : 0) >>> 0;
  return () => {
    e = e + 1831565813 >>> 0;
    let c = e;
    return c = Math.imul(c ^ c >>> 15, c | 1), c ^= c + Math.imul(c ^ c >>> 7, c | 61), ((c ^ c >>> 14) >>> 0) / 4294967296;
  };
}
function M(t, e, c, n = e) {
  const o = Number.isFinite(n) ? n : e, a = Number.isFinite(t) ? t : o;
  return a < e ? e : a > c ? c : a;
}
const B = (t) => M(t, 8e3, 192e3, 48e3);
function g(t, e, c, n, o, a) {
  return { b0: t / n, b1: e / n, b2: c / n, a1: o / n, a2: a / n };
}
function d(t, e, c = 0.7071) {
  const n = 2 * Math.PI * M(e, 5, 0.45 * t, 1e3) / t, o = Math.sin(n) / (2 * c), a = Math.cos(n);
  return g((1 - a) / 2, 1 - a, (1 - a) / 2, 1 + o, -2 * a, 1 - o);
}
function T(t, e, c = 0.7071) {
  const n = 2 * Math.PI * M(e, 5, 0.45 * t, 40) / t, o = Math.sin(n) / (2 * c), a = Math.cos(n);
  return g((1 + a) / 2, -(1 + a), (1 + a) / 2, 1 + o, -2 * a, 1 - o);
}
function C(t, e, c) {
  const n = 2 * Math.PI * M(e, 5, 0.45 * t, 500) / t, o = Math.sin(n) / (2 * M(c, 0.1, 20, 1));
  return g(o, 0, -o, 1 + o, -2 * Math.cos(n), 1 - o);
}
function m(t, e) {
  let c = 0, n = 0, o = 0, a = 0;
  for (let s = 0; s < t.length; s++) {
    const r = t[s] ?? 0, i = e.b0 * r + e.b1 * c + e.b2 * n - e.a1 * o - e.a2 * a;
    n = c, c = r, a = o, o = i, t[s] = i;
  }
}
function A(t, e) {
  const c = new Float32Array(t);
  for (let n = 0; n < t; n++) c[n] = e() * 2 - 1;
  return c;
}
function w(t, e) {
  const c = new Float32Array(t);
  let n = 0, o = 0, a = 0;
  for (let s = 0; s < t; s++) {
    const r = e() * 2 - 1;
    n = 0.99765 * n + r * 0.099046, o = 0.963 * o + r * 0.2965164, a = 0.57 * a + r * 1.0526913, c[s] = (n + o + a + r * 0.1848) * 0.25;
  }
  return c;
}
function G(t, e) {
  const c = t.length - e, n = t.slice(0, e);
  for (let o = 0; o < c; o++) {
    const a = Math.sin((o + 0.5) / c * (Math.PI / 2)), s = Math.cos((o + 0.5) / c * (Math.PI / 2));
    n[o] = (t[o] ?? 0) * a + (t[e + o] ?? 0) * s;
  }
  return n;
}
function F(t, e) {
  let c = 0;
  for (let s = 0; s < t.length; s++) {
    const r = t[s] ?? 0;
    Number.isFinite(r) || (t[s] = 0), c += t[s] ?? 0;
  }
  const n = t.length > 0 ? c / t.length : 0;
  let o = 0;
  for (let s = 0; s < t.length; s++) {
    const r = (t[s] ?? 0) - n;
    t[s] = r, Math.abs(r) > o && (o = Math.abs(r));
  }
  const a = o > 1e-9 ? e / o : 0;
  for (let s = 0; s < t.length; s++) t[s] = (t[s] ?? 0) * a;
}
const _ = [
  220,
  261.63,
  293.66,
  349.23,
  392,
  440,
  523.25,
  587.33,
  698.46,
  784,
  880
], E = 0.4, N = 1.2, k = 3.2, H = 6, R = 0.8, D = 2.4, z = 0.14, K = 0.3, V = 0.2, q = (t) => E + t.hold + N;
function X(t, e = 1) {
  const c = b(t);
  let n = M(e, 0, 60, 1), o = Math.floor(c() * _.length), a = !0;
  return () => {
    a || (n += k + c() * (H - k)), a = !1;
    const s = c();
    return o += s < 0.3 ? -1 : s < 0.6 ? 1 : s < 0.75 ? -2 : s < 0.9 ? 2 : 0, o = Math.min(_.length - 1, Math.max(0, o)), {
      at: n,
      hz: _[o] ?? 440,
      hold: R + c() * (D - R),
      amp: z * (0.7 + 0.3 * c())
    };
  };
}
const O = 0.25, $ = 0.25;
function v(t, e, c, n, o) {
  const a = Math.max(1, Math.ceil(e * t)), s = Math.max(a, Math.floor(c * t));
  return Array.from({ length: n }, () => (a + Math.floor(o() * (s - a + 1))) / t);
}
function P(t, e, c, n, o) {
  const a = c.map(() => n() * 2 * Math.PI), s = new Float32Array(t);
  for (let r = 0; r < t; r++) {
    let i = 0;
    for (let u = 0; u < c.length; u++) i += Math.sin(2 * Math.PI * (c[u] ?? 0) * (r / e) + (a[u] ?? 0));
    s[r] = o + (1 - o) * (0.5 + 0.5 * i / c.length);
  }
  return s;
}
function j(t, e, c, n) {
  const o = A(e, n);
  m(o, C(t, Math.sqrt(200 * 900), Math.sqrt(200 * 900) / 700));
  const a = P(e, t, v(c, 0.05, 0.2, 3, n), n, 0.12);
  for (let s = 0; s < e; s++) o[s] = (o[s] ?? 0) * (a[s] ?? 0);
  return o;
}
function Q(t, e, c, n) {
  const o = w(e, n);
  m(o, d(t, 6e3)), m(o, d(t, 6e3));
  const a = A(e, n);
  m(a, d(t, 2500));
  const s = P(e, t, v(c, 0.1, 0.3, 2, n), n, 0.6);
  for (let r = 0; r < e; r++) o[r] = (o[r] ?? 0) * 0.7 + (a[r] ?? 0) * 0.5 * (s[r] ?? 0);
  return m(o, T(t, 40)), o;
}
function U(t, e, c, n) {
  const o = B(e), a = M(n, 5, 60, 20), s = Math.round(a * o), r = s + Math.round($ * o), i = b(c), u = t === "wind" ? j(o, r, a, i) : Q(o, r, a, i), f = G(u, s);
  return F(f, O), f;
}
const W = [20, 14], Y = 0.25, Z = 0.1, J = (t) => t === "crickets" ? Z : O;
function y(t, e, c, n, o) {
  const a = Math.min(t.length - e, Math.ceil(n * 6));
  for (let s = 0; s < a; s++) t[e + s] = (t[e + s] ?? 0) + c * (o() * 2 - 1) * Math.exp(-s / n);
}
function x(t, e, c) {
  const n = w(e, c);
  m(n, T(t, 400)), m(n, d(t, 7e3));
  const o = new Float32Array(e), a = Math.round(e / t * 80);
  for (let s = 0; s < a; s++) y(o, Math.floor(c() * e), 0.15 + 0.85 * c() ** 3, t * 15e-4, c);
  m(o, C(t, 3e3, 0.8));
  for (let s = 0; s < e; s++) n[s] = (n[s] ?? 0) * 0.6 + (o[s] ?? 0) * 2.5;
  return n;
}
function tt(t, e, c) {
  const n = A(e, c);
  let o = 0;
  for (let a = 0; a < e; a++)
    o = 0.998 * o + 0.05 * (n[a] ?? 0), n[a] = o;
  return m(n, T(t, 25)), m(n, d(t, 1500)), n;
}
function nt(t, e, c, n) {
  const o = w(e, n);
  m(o, d(t, 1200));
  const a = A(e, n);
  m(a, C(t, 2200, 0.7));
  const s = P(e, t, v(c, 0.08, 0.14, 2, n), n, 0.05);
  for (let r = 0; r < e; r++) {
    const i = Math.min(1, Math.max(0, ((s[r] ?? 0) - 0.3) / 0.7));
    o[r] = (o[r] ?? 0) * (0.08 + 0.92 * i * i) + (a[r] ?? 0) * 0.5 * i * i * i * i;
  }
  return o;
}
function et(t, e, c) {
  const n = w(e, c);
  m(n, d(t, 400));
  for (let a = 0; a < e; a++) n[a] = (n[a] ?? 0) * 0.25;
  const o = e / t;
  for (let a = 0; a < Math.round(o * 10); a++) y(n, Math.floor(c() * e), 0.1 + 0.3 * c(), t * (2e-3 + 6e-3 * c()), c);
  for (let a = 0; a < Math.round(o); a++) y(n, Math.floor(c() * e), 0.5 + 0.5 * c(), t * (4e-3 + 0.01 * c()), c);
  return m(n, T(t, 60)), n;
}
function ot(t, e, c, n) {
  const o = new Float32Array(e);
  for (let a = 0; a < 5; a++) {
    const s = Math.round((4e3 + n() * 1400) * c) / c, r = Math.max(1, Math.round(c / (0.9 + n() * 0.7))), i = e / r, u = n() * i, f = 0.4 + 0.6 * n();
    for (let l = 0; l < e; l++) {
      const h = (l + u) % i / t;
      if (h > 0.22) continue;
      const p = Math.sin(Math.PI * (h * 32 % 1)) ** 2;
      o[l] = (o[l] ?? 0) + f * p * Math.sin(2 * Math.PI * s * l / t);
    }
  }
  return o;
}
function ct(t, e, c, n) {
  if (t === "wind" || t === "waterfall") return U(t, e, c, n);
  const o = B(e), a = M(n, 5, 60, 20), s = Math.round(a * o), r = s + Math.round(Y * o), i = b(c);
  let u;
  if (t === "crickets") u = ot(o, s, a, i);
  else {
    const f = t === "rainroof" ? x(o, r, i) : t === "brown" ? tt(o, r, i) : t === "swell" ? nt(o, r, a, i) : et(o, r, i);
    u = G(f, s);
  }
  return F(u, J(t)), u;
}
const at = [
  { ratio: 1, amp: 0.6, tau: 5, beat: 0.4 },
  { ratio: 2.71, amp: 0.28, tau: 3, beat: 0.7 },
  { ratio: 5.15, amp: 0.12, tau: 1.8, beat: 1.1 }
], st = [
  { ratio: 1, amp: 0.75, tau: 1.6, beat: 0 },
  { ratio: 2.76, amp: 0.15, tau: 0.8, beat: 0 },
  { ratio: 5.4, amp: 0.1, tau: 0.4, beat: 0 }
], rt = {
  bowl: { scale: [196, 220, 261.63, 293.66], minGap: 8, maxGap: 14, amp: 0.2, attack: 0.05, partials: at },
  softchimes: { scale: [523.25, 587.33, 659.25, 783.99, 880, 1046.5], minGap: 3, maxGap: 9, amp: 0.18, attack: 3e-3, partials: st }
}, it = 6, ut = (t) => t.attack + it * Math.max(...t.partials.map((e) => e.tau));
function lt(t, e, c = 1.5) {
  const n = rt[t], o = b(e);
  let a = M(c, 0, 60, 1.5), s = Math.floor(o() * n.scale.length), r = !0;
  return () => (r || (a += n.minGap + o() * (n.maxGap - n.minGap)), r = !1, s = Math.min(n.scale.length - 1, Math.max(0, s + Math.floor(o() * 3) - 1)), {
    at: a,
    hz: n.scale[s] ?? 440,
    amp: n.amp * (0.7 + 0.3 * o()),
    attack: n.attack,
    partials: n.partials
  });
}
const ft = 4, ht = 1e3, mt = 500;
function I(t, e, c, n, o, a, s, r) {
  const i = t.createGain();
  i.gain.setValueAtTime(0, n), i.gain.linearRampToValueAtTime(c, n + o.attack), i.gain.setTargetAtTime(0, n + o.attack, a), i.connect(s);
  const u = t.createOscillator();
  u.frequency.value = M(e, 20, 12e3, 440), u.connect(i), u.start(n), u.stop(n + ut(o)), r.add(u), u.onended = () => {
    r.delete(u), u.disconnect(), i.disconnect();
  };
}
function Mt(t, e, c, n, o) {
  for (const a of e.partials) {
    const s = e.hz * a.ratio, r = e.amp * a.amp;
    a.beat > 0 ? (I(t, s, r / 2, c, e, a.tau, n, o), I(t, s + a.beat, r / 2, c, e, a.tau, n, o)) : I(t, s, r, c, e, a.tau, n, o);
  }
}
function pt(t, e, c) {
  const n = t.createGain(), o = t.createBufferSource();
  o.buffer = t.createBuffer(1, 2, t.sampleRate), o.loop = !0, o.start();
  const a = /* @__PURE__ */ new Set(), s = lt(e, c), r = t.currentTime;
  let i = s();
  const u = () => {
    for (; i.at < t.currentTime - r + ft; )
      Mt(t, i, r + i.at, n, a), i = s();
  };
  u();
  const f = setInterval(u, ht), l = {
    connect: (h) => n.connect(h),
    disconnect: () => n.disconnect(),
    stop: (h) => {
      clearInterval(f);
      for (const p of a)
        try {
          p.stop(h);
        } catch {
        }
      try {
        o.stop(h);
      } catch {
      }
    },
    onended: null
  };
  return o.onended = () => {
    var h;
    clearInterval(f), setTimeout(() => n.disconnect(), mt), (h = l.onended) == null || h.call(l);
  }, l;
}
const dt = 0.7, bt = 4, At = 1e3, St = 8;
function Et(t, e) {
  const c = t.createBuffer(1, e.length, t.sampleRate);
  return c.getChannelData(0).set(e), c;
}
function L(t, e) {
  const c = t.createBufferSource();
  return c.buffer = Et(t, e), c.loop = !0, c;
}
function Tt(t, e, c) {
  const n = t.createGain();
  n.gain.value = dt;
  const o = W.map((r, i) => {
    const u = L(t, ct(e, t.sampleRate, c + i * 7919, r));
    return u.connect(n), u.start(), u;
  }), a = o[0], s = {
    connect: (r) => n.connect(r),
    disconnect: () => n.disconnect(),
    stop: (r) => {
      for (const i of o)
        try {
          i.stop(r);
        } catch {
        }
    },
    onended: null
  };
  return a && (a.onended = () => {
    var r;
    (r = s.onended) == null || r.call(s);
  }), s;
}
function wt(t, e, c, n, o, a) {
  const s = c + q(e), r = t.createGain();
  r.gain.setValueAtTime(0, c), r.gain.linearRampToValueAtTime(e.amp, c + E), r.gain.setValueAtTime(e.amp, c + E + e.hold), r.gain.linearRampToValueAtTime(0, c + E + e.hold + N), r.connect(o);
  const i = [[e.hz, 1], [e.hz * 2, K]];
  for (const [l, h] of i) {
    const p = t.createOscillator(), S = t.createGain();
    p.frequency.value = M(l, 20, 2e3, 440), S.gain.value = h, p.connect(S), S.connect(r), p.start(c), p.stop(s), a.add(p), p.onended = () => {
      a.delete(p), p.disconnect(), S.disconnect();
    };
  }
  const u = t.createBiquadFilter();
  u.type = "bandpass", u.frequency.value = M(e.hz * 2, 40, 4e3, 880), u.Q.value = 2;
  const f = t.createGain();
  f.gain.value = V * St, n.connect(u), u.connect(f), f.connect(r), _t(() => {
    u.disconnect(), f.disconnect(), r.disconnect();
  }, (s - t.currentTime + 0.5) * 1e3);
}
const _t = (t, e) => {
  setTimeout(t, M(e, 0, 3e4, 5e3));
};
function It(t, e) {
  const c = t.createGain(), n = L(t, A(Math.round(t.sampleRate * 4), b(e ^ 1540483477)));
  n.start();
  const o = /* @__PURE__ */ new Set(), a = X(e), s = t.currentTime;
  let r = a();
  const i = () => {
    for (; r.at < t.currentTime - s + bt; )
      wt(t, r, s + r.at, n, c, o), r = a();
  };
  i();
  const u = setInterval(i, At), f = {
    connect: (l) => c.connect(l),
    disconnect: () => c.disconnect(),
    stop: (l) => {
      clearInterval(u);
      for (const h of o)
        try {
          h.stop(l);
        } catch {
        }
      try {
        n.stop(l);
      } catch {
      }
    },
    onended: null
  };
  return n.onended = () => {
    var l;
    clearInterval(u), (l = f.onended) == null || l.call(f);
  }, f;
}
function yt(t, e, c) {
  const n = Math.trunc(M(c, 0, 2147483648, 1));
  return e === "flute" ? It(t, n) : e === "bowl" || e === "softchimes" ? pt(t, e, n) : Tt(t, e, n);
}
export {
  yt as buildSynth
};
