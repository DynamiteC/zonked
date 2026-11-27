function E(t) {
  let e = (Number.isFinite(t) ? Math.trunc(t) : 0) >>> 0;
  return () => {
    e = e + 1831565813 >>> 0;
    let n = e;
    return n = Math.imul(n ^ n >>> 15, n | 1), n ^= n + Math.imul(n ^ n >>> 7, n | 61), ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}
function h(t, e, n, c = e) {
  const o = Number.isFinite(c) ? c : e, a = Number.isFinite(t) ? t : o;
  return a < e ? e : a > n ? n : a;
}
const B = (t) => h(t, 8e3, 192e3, 48e3);
function S(t, e, n, c, o, a) {
  return { b0: t / c, b1: e / c, b2: n / c, a1: o / c, a2: a / c };
}
function b(t, e, n = 0.7071) {
  const c = 2 * Math.PI * h(e, 5, 0.45 * t, 1e3) / t, o = Math.sin(c) / (2 * n), a = Math.cos(c);
  return S((1 - a) / 2, 1 - a, (1 - a) / 2, 1 + o, -2 * a, 1 - o);
}
function N(t, e, n = 0.7071) {
  const c = 2 * Math.PI * h(e, 5, 0.45 * t, 40) / t, o = Math.sin(c) / (2 * n), a = Math.cos(c);
  return S((1 + a) / 2, -(1 + a), (1 + a) / 2, 1 + o, -2 * a, 1 - o);
}
function P(t, e, n) {
  const c = 2 * Math.PI * h(e, 5, 0.45 * t, 500) / t, o = Math.sin(c) / (2 * h(n, 0.1, 20, 1));
  return S(o, 0, -o, 1 + o, -2 * Math.cos(c), 1 - o);
}
function M(t, e) {
  let n = 0, c = 0, o = 0, a = 0;
  for (let s = 0; s < t.length; s++) {
    const r = t[s] ?? 0, u = e.b0 * r + e.b1 * n + e.b2 * c - e.a1 * o - e.a2 * a;
    c = n, n = r, a = o, o = u, t[s] = u;
  }
}
function _(t, e) {
  const n = new Float32Array(t);
  for (let c = 0; c < t; c++) n[c] = e() * 2 - 1;
  return n;
}
function F(t, e) {
  const n = new Float32Array(t);
  let c = 0, o = 0, a = 0;
  for (let s = 0; s < t; s++) {
    const r = e() * 2 - 1;
    c = 0.99765 * c + r * 0.099046, o = 0.963 * o + r * 0.2965164, a = 0.57 * a + r * 1.0526913, n[s] = (c + o + a + r * 0.1848) * 0.25;
  }
  return n;
}
function R(t, e) {
  const n = t.length - e, c = t.slice(0, e);
  for (let o = 0; o < n; o++) {
    const a = Math.sin((o + 0.5) / n * (Math.PI / 2)), s = Math.cos((o + 0.5) / n * (Math.PI / 2));
    c[o] = (t[o] ?? 0) * a + (t[e + o] ?? 0) * s;
  }
  return c;
}
function H(t, e) {
  let n = 0;
  for (let s = 0; s < t.length; s++) {
    const r = t[s] ?? 0;
    Number.isFinite(r) || (t[s] = 0), n += t[s] ?? 0;
  }
  const c = t.length > 0 ? n / t.length : 0;
  let o = 0;
  for (let s = 0; s < t.length; s++) {
    const r = (t[s] ?? 0) - c;
    t[s] = r, Math.abs(r) > o && (o = Math.abs(r));
  }
  const a = o > 1e-9 ? e / o : 0;
  for (let s = 0; s < t.length; s++) t[s] = (t[s] ?? 0) * a;
}
const A = [
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
], p = 0.4, I = 1.2, T = 3.2, O = 6, y = 0.8, D = 2.4, G = 0.14, L = 0.3, k = 0.2, z = (t) => p + t.hold + I;
function q(t, e = 1) {
  const n = E(t);
  let c = h(e, 0, 60, 1), o = Math.floor(n() * A.length), a = !0;
  return () => {
    a || (c += T + n() * (O - T)), a = !1;
    const s = n();
    return o += s < 0.3 ? -1 : s < 0.6 ? 1 : s < 0.75 ? -2 : s < 0.9 ? 2 : 0, o = Math.min(A.length - 1, Math.max(0, o)), {
      at: c,
      hz: A[o] ?? 440,
      hold: y + n() * (D - y),
      amp: G * (0.7 + 0.3 * n())
    };
  };
}
const K = 0.25, V = 0.25;
function w(t, e, n, c, o) {
  const a = Math.max(1, Math.ceil(e * t)), s = Math.max(a, Math.floor(n * t));
  return Array.from({ length: c }, () => (a + Math.floor(o() * (s - a + 1))) / t);
}
function C(t, e, n, c, o) {
  const a = n.map(() => c() * 2 * Math.PI), s = new Float32Array(t);
  for (let r = 0; r < t; r++) {
    let u = 0;
    for (let i = 0; i < n.length; i++) u += Math.sin(2 * Math.PI * (n[i] ?? 0) * (r / e) + (a[i] ?? 0));
    s[r] = o + (1 - o) * (0.5 + 0.5 * u / n.length);
  }
  return s;
}
function X(t, e, n, c) {
  const o = _(e, c);
  M(o, P(t, Math.sqrt(200 * 900), Math.sqrt(200 * 900) / 700));
  const a = C(e, t, w(n, 0.05, 0.2, 3, c), c, 0.12);
  for (let s = 0; s < e; s++) o[s] = (o[s] ?? 0) * (a[s] ?? 0);
  return o;
}
function j(t, e, n, c) {
  const o = F(e, c);
  M(o, b(t, 6e3)), M(o, b(t, 6e3));
  const a = _(e, c);
  M(a, b(t, 2500));
  const s = C(e, t, w(n, 0.1, 0.3, 2, c), c, 0.6);
  for (let r = 0; r < e; r++) o[r] = (o[r] ?? 0) * 0.7 + (a[r] ?? 0) * 0.5 * (s[r] ?? 0);
  return M(o, N(t, 40)), o;
}
function Q(t, e, n, c) {
  const o = B(e), a = h(c, 5, 60, 20), s = Math.round(a * o), r = s + Math.round(V * o), u = E(n), i = t === "wind" ? X(o, r, a, u) : j(o, r, a, u), l = R(i, s);
  return H(l, K), l;
}
const Z = [20, 14], J = 0.7, U = 4, W = 1e3, Y = 8;
function $(t, e) {
  const n = t.createBuffer(1, e.length, t.sampleRate);
  return n.getChannelData(0).set(e), n;
}
function v(t, e) {
  const n = t.createBufferSource();
  return n.buffer = $(t, e), n.loop = !0, n;
}
function x(t, e, n) {
  const c = t.createGain();
  c.gain.value = J;
  const o = Z.map((r, u) => {
    const i = v(t, Q(e, t.sampleRate, n + u * 7919, r));
    return i.connect(c), i.start(), i;
  }), a = o[0], s = {
    connect: (r) => c.connect(r),
    disconnect: () => c.disconnect(),
    stop: (r) => {
      for (const u of o)
        try {
          u.stop(r);
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
function tt(t, e, n, c, o, a) {
  const s = n + z(e), r = t.createGain();
  r.gain.setValueAtTime(0, n), r.gain.linearRampToValueAtTime(e.amp, n + p), r.gain.setValueAtTime(e.amp, n + p + e.hold), r.gain.linearRampToValueAtTime(0, n + p + e.hold + I), r.connect(o);
  const u = [[e.hz, 1], [e.hz * 2, L]];
  for (const [f, g] of u) {
    const d = t.createOscillator(), m = t.createGain();
    d.frequency.value = h(f, 20, 2e3, 440), m.gain.value = g, d.connect(m), m.connect(r), d.start(n), d.stop(s), a.add(d), d.onended = () => {
      a.delete(d), d.disconnect(), m.disconnect();
    };
  }
  const i = t.createBiquadFilter();
  i.type = "bandpass", i.frequency.value = h(e.hz * 2, 40, 4e3, 880), i.Q.value = 2;
  const l = t.createGain();
  l.gain.value = k * Y, c.connect(i), i.connect(l), l.connect(r), nt(() => {
    i.disconnect(), l.disconnect(), r.disconnect();
  }, (s - t.currentTime + 0.5) * 1e3);
}
const nt = (t, e) => {
  setTimeout(t, h(e, 0, 3e4, 5e3));
};
function et(t, e) {
  const n = t.createGain(), c = v(t, _(Math.round(t.sampleRate * 4), E(e ^ 1540483477)));
  c.start();
  const o = /* @__PURE__ */ new Set(), a = q(e), s = t.currentTime;
  let r = a();
  const u = () => {
    for (; r.at < t.currentTime - s + U; )
      tt(t, r, s + r.at, c, n, o), r = a();
  };
  u();
  const i = setInterval(u, W), l = {
    connect: (f) => n.connect(f),
    disconnect: () => n.disconnect(),
    stop: (f) => {
      clearInterval(i);
      for (const g of o)
        try {
          g.stop(f);
        } catch {
        }
      try {
        c.stop(f);
      } catch {
      }
    },
    onended: null
  };
  return c.onended = () => {
    var f;
    clearInterval(i), (f = l.onended) == null || f.call(l);
  }, l;
}
function ot(t, e, n) {
  const c = Math.trunc(h(n, 0, 2147483648, 1));
  return e === "flute" ? et(t, c) : x(t, e, c);
}
export {
  ot as buildSynth
};
