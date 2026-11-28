// ../../web/src/audio/samples/synth/dsp.ts
function e(e) {
	let t = (Number.isFinite(e) ? Math.trunc(e) : 0) >>> 0;
	return () => {
		t = t + 0x6d2b79f5 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function t(e, t, n, r = t) {
	let i = Number.isFinite(r) ? r : t, a = Number.isFinite(e) ? e : i;
	return a < t ? t : a > n ? n : a;
}
var n = (e) => t(e, 8e3, 192e3, 48e3);
function r(e, t, n, r, i, a) {
	return {
		b0: e / r,
		b1: t / r,
		b2: n / r,
		a1: i / r,
		a2: a / r
	};
}
function i(e, n, i = .7071) {
	let a = 2 * Math.PI * t(n, 5, .45 * e, 1e3) / e, o = Math.sin(a) / (2 * i), s = Math.cos(a);
	return r((1 - s) / 2, 1 - s, (1 - s) / 2, 1 + o, -2 * s, 1 - o);
}
function a(e, n, i = .7071) {
	let a = 2 * Math.PI * t(n, 5, .45 * e, 40) / e, o = Math.sin(a) / (2 * i), s = Math.cos(a);
	return r((1 + s) / 2, -(1 + s), (1 + s) / 2, 1 + o, -2 * s, 1 - o);
}
function o(e, n, i) {
	let a = 2 * Math.PI * t(n, 5, .45 * e, 500) / e, o = Math.sin(a) / (2 * t(i, .1, 20, 1));
	return r(o, 0, -o, 1 + o, -2 * Math.cos(a), 1 - o);
}
function s(e, t) {
	let n = 0, r = 0, i = 0, a = 0;
	for (let o = 0; o < e.length; o++) {
		let s = e[o] ?? 0, c = t.b0 * s + t.b1 * n + t.b2 * r - t.a1 * i - t.a2 * a;
		r = n, n = s, a = i, i = c, e[o] = c;
	}
}
function c(e, t) {
	let n = new Float32Array(e);
	for (let r = 0; r < e; r++) n[r] = t() * 2 - 1;
	return n;
}
function l(e, t) {
	let n = new Float32Array(e), r = 0, i = 0, a = 0;
	for (let o = 0; o < e; o++) {
		let e = t() * 2 - 1;
		r = .99765 * r + e * .099046, i = .963 * i + e * .2965164, a = .57 * a + e * 1.0526913, n[o] = (r + i + a + e * .1848) * .25;
	}
	return n;
}
function u(e, t) {
	let n = e.length - t, r = e.slice(0, t);
	for (let i = 0; i < n; i++) {
		let a = Math.sin((i + .5) / n * (Math.PI / 2)), o = Math.cos((i + .5) / n * (Math.PI / 2));
		r[i] = (e[i] ?? 0) * a + (e[t + i] ?? 0) * o;
	}
	return r;
}
function d(e, t) {
	let n = 0;
	for (let t = 0; t < e.length; t++) {
		let r = e[t] ?? 0;
		Number.isFinite(r) || (e[t] = 0), n += e[t] ?? 0;
	}
	let r = e.length > 0 ? n / e.length : 0, i = 0;
	for (let t = 0; t < e.length; t++) {
		let n = (e[t] ?? 0) - r;
		e[t] = n, Math.abs(n) > i && (i = Math.abs(n));
	}
	let a = i > 1e-9 ? t / i : 0;
	for (let t = 0; t < e.length; t++) e[t] = (e[t] ?? 0) * a;
}
// ../../web/src/audio/samples/synth/flute.ts
var f = [
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
], p = .4, m = 1.2, h = 3.2, g = .8, _ = .14, v = .3, y = .2, b = (e) => p + e.hold + m;
function x(n, r = 1) {
	let i = e(n), a = t(r, 0, 60, 1), o = Math.floor(i() * f.length), s = !0;
	return () => {
		s || (a += h + i() * 2.8), s = !1;
		let e = i();
		return o += e < .3 ? -1 : e < .6 ? 1 : e < .75 ? -2 : e < .9 ? 2 : 0, o = Math.min(f.length - 1, Math.max(0, o)), {
			at: a,
			hz: f[o] ?? 440,
			hold: g + i() * 1.5999999999999999,
			amp: _ * (.7 + .3 * i())
		};
	};
}
// ../../web/src/audio/samples/synth/render.ts
var S = .25, C = .25;
function w(e, t, n, r, i) {
	let a = Math.max(1, Math.ceil(t * e)), o = Math.max(a, Math.floor(n * e));
	return Array.from({ length: r }, () => (a + Math.floor(i() * (o - a + 1))) / e);
}
function T(e, t, n, r, i) {
	let a = n.map(() => r() * 2 * Math.PI), o = new Float32Array(e);
	for (let r = 0; r < e; r++) {
		let e = 0;
		for (let i = 0; i < n.length; i++) e += Math.sin(2 * Math.PI * (n[i] ?? 0) * (r / t) + (a[i] ?? 0));
		o[r] = i + (1 - i) * (.5 + .5 * e / n.length);
	}
	return o;
}
function E(e, t, n, r) {
	let i = c(t, r);
	s(i, o(e, Math.sqrt(18e4), Math.sqrt(18e4) / 700));
	let a = T(t, e, w(n, .05, .2, 3, r), r, .12);
	for (let e = 0; e < t; e++) i[e] = (i[e] ?? 0) * (a[e] ?? 0);
	return i;
}
function D(e, t, n, r) {
	let o = l(t, r);
	s(o, i(e, 6e3)), s(o, i(e, 6e3));
	let u = c(t, r);
	s(u, i(e, 2500));
	let d = T(t, e, w(n, .1, .3, 2, r), r, .6);
	for (let e = 0; e < t; e++) o[e] = (o[e] ?? 0) * .7 + (u[e] ?? 0) * .5 * (d[e] ?? 0);
	return s(o, a(e, 40)), o;
}
function O(r, i, a, o) {
	let s = n(i), c = t(o, 5, 60, 20), l = Math.round(c * s), f = l + Math.round(C * s), p = e(a), m = u(r === "wind" ? E(s, f, c, p) : D(s, f, c, p), l);
	return d(m, S), m;
}
var k = [20, 14], A = .25, j = .1, M = (e) => e === "crickets" ? j : S;
function N(e, t, n, r, i) {
	let a = Math.min(e.length - t, Math.ceil(r * 6));
	for (let o = 0; o < a; o++) e[t + o] = (e[t + o] ?? 0) + n * (i() * 2 - 1) * Math.exp(-o / r);
}
function P(e, t, n) {
	let r = l(t, n);
	s(r, a(e, 400)), s(r, i(e, 7e3));
	let c = new Float32Array(t), u = Math.round(t / e * 80);
	for (let r = 0; r < u; r++) N(c, Math.floor(n() * t), .15 + .85 * n() ** 3, e * .0015, n);
	s(c, o(e, 3e3, .8));
	for (let e = 0; e < t; e++) r[e] = (r[e] ?? 0) * .6 + (c[e] ?? 0) * 2.5;
	return r;
}
function F(e, t, n) {
	let r = c(t, n), o = 0;
	for (let e = 0; e < t; e++) o = .998 * o + .05 * (r[e] ?? 0), r[e] = o;
	return s(r, a(e, 25)), s(r, i(e, 1500)), r;
}
function I(e, t, n, r) {
	let a = l(t, r);
	s(a, i(e, 1200));
	let u = c(t, r);
	s(u, o(e, 2200, .7));
	let d = T(t, e, w(n, .08, .14, 2, r), r, .05);
	for (let e = 0; e < t; e++) {
		let t = Math.min(1, Math.max(0, ((d[e] ?? 0) - .3) / .7));
		a[e] = (a[e] ?? 0) * (.08 + .92 * t * t) + (u[e] ?? 0) * .5 * t * t * t * t;
	}
	return a;
}
function L(e, t, n) {
	let r = l(t, n);
	s(r, i(e, 400));
	for (let e = 0; e < t; e++) r[e] = (r[e] ?? 0) * .25;
	let o = t / e;
	for (let i = 0; i < Math.round(o * 10); i++) N(r, Math.floor(n() * t), .1 + .3 * n(), e * (.002 + .006 * n()), n);
	for (let i = 0; i < Math.round(o); i++) N(r, Math.floor(n() * t), .5 + .5 * n(), e * (.004 + .01 * n()), n);
	return s(r, a(e, 60)), r;
}
function ee(e, t, n, r) {
	let i = new Float32Array(t);
	for (let a = 0; a < 5; a++) {
		let a = Math.round((4e3 + r() * 1400) * n) / n, o = t / Math.max(1, Math.round(n / (.9 + r() * .7))), s = r() * o, c = .4 + .6 * r();
		for (let n = 0; n < t; n++) {
			let t = (n + s) % o / e;
			if (t > .22) continue;
			let r = Math.sin(Math.PI * (t * 32 % 1)) ** 2;
			i[n] = (i[n] ?? 0) + c * r * Math.sin(2 * Math.PI * a * n / e);
		}
	}
	return i;
}
function R(r, i, a, o) {
	if (r === "wind" || r === "waterfall") return O(r, i, a, o);
	let s = n(i), c = t(o, 5, 60, 20), l = Math.round(c * s), f = l + Math.round(A * s), p = e(a), m;
	return m = r === "crickets" ? ee(s, l, c, p) : u(r === "rainroof" ? P(s, f, p) : r === "brown" ? F(s, f, p) : r === "swell" ? I(s, f, c, p) : L(s, f, p), l), d(m, M(r)), m;
}
var z = {
	bowl: {
		scale: [
			196,
			220,
			261.63,
			293.66
		],
		minGap: 8,
		maxGap: 14,
		amp: .2,
		attack: .05,
		partials: [
			{
				ratio: 1,
				amp: .6,
				tau: 5,
				beat: .4
			},
			{
				ratio: 2.71,
				amp: .28,
				tau: 3,
				beat: .7
			},
			{
				ratio: 5.15,
				amp: .12,
				tau: 1.8,
				beat: 1.1
			}
		]
	},
	softchimes: {
		scale: [
			523.25,
			587.33,
			659.25,
			783.99,
			880,
			1046.5
		],
		minGap: 3,
		maxGap: 9,
		amp: .18,
		attack: .003,
		partials: [
			{
				ratio: 1,
				amp: .75,
				tau: 1.6,
				beat: 0
			},
			{
				ratio: 2.76,
				amp: .15,
				tau: .8,
				beat: 0
			},
			{
				ratio: 5.4,
				amp: .1,
				tau: .4,
				beat: 0
			}
		]
	}
}, B = (e) => e.attack + 6 * Math.max(...e.partials.map((e) => e.tau));
function V(n, r, i = 1.5) {
	let a = z[n], o = e(r), s = t(i, 0, 60, 1.5), c = Math.floor(o() * a.scale.length), l = !0;
	return () => (l || (s += a.minGap + o() * (a.maxGap - a.minGap)), l = !1, c = Math.min(a.scale.length - 1, Math.max(0, c + Math.floor(o() * 3) - 1)), {
		at: s,
		hz: a.scale[c] ?? 440,
		amp: a.amp * (.7 + .3 * o()),
		attack: a.attack,
		partials: a.partials
	});
}
// ../../web/src/audio/samples/synth/strikes-graph.ts
var H = 4, U = 1e3, W = 500;
function G(e, n, r, i, a, o, s, c) {
	let l = e.createGain();
	l.gain.setValueAtTime(0, i), l.gain.linearRampToValueAtTime(r, i + a.attack), l.gain.setTargetAtTime(0, i + a.attack, o), l.connect(s);
	let u = e.createOscillator();
	u.frequency.value = t(n, 20, 12e3, 440), u.connect(l), u.start(i), u.stop(i + B(a)), c.add(u), u.onended = () => {
		c.delete(u), u.disconnect(), l.disconnect();
	};
}
function K(e, t, n, r, i) {
	for (let a of t.partials) {
		let o = t.hz * a.ratio, s = t.amp * a.amp;
		a.beat > 0 ? (G(e, o, s / 2, n, t, a.tau, r, i), G(e, o + a.beat, s / 2, n, t, a.tau, r, i)) : G(e, o, s, n, t, a.tau, r, i);
	}
}
function q(e, t, n) {
	let r = e.createGain(), i = e.createBufferSource();
	i.buffer = e.createBuffer(1, 2, e.sampleRate), i.loop = !0, i.start();
	let a = /* @__PURE__ */ new Set(), o = V(t, n), s = e.currentTime, c = o(), l = () => {
		for (; c.at < e.currentTime - s + H;) K(e, c, s + c.at, r, a), c = o();
	};
	l();
	let u = setInterval(l, U), d = {
		connect: (e) => r.connect(e),
		disconnect: () => r.disconnect(),
		stop: (e) => {
			clearInterval(u);
			for (let t of a) try {
				t.stop(e);
			} catch {}
			try {
				i.stop(e);
			} catch {}
		},
		onended: null
	};
	return i.onended = () => {
		clearInterval(u), setTimeout(() => r.disconnect(), W), d.onended?.();
	}, d;
}
// ../../web/src/audio/samples/synth/graph.ts
var J = .7, Y = 4, X = 1e3, Z = 8;
function Q(e, t) {
	let n = e.createBuffer(1, t.length, e.sampleRate);
	return n.getChannelData(0).set(t), n;
}
function $(e, t) {
	let n = e.createBufferSource();
	return n.buffer = Q(e, t), n.loop = !0, n;
}
function te(e, t, n) {
	let r = e.createGain();
	r.gain.value = J;
	let i = k.map((i, a) => {
		let o = $(e, R(t, e.sampleRate, n + a * 7919, i));
		return o.connect(r), o.start(), o;
	}), a = i[0], o = {
		connect: (e) => r.connect(e),
		disconnect: () => r.disconnect(),
		stop: (e) => {
			for (let t of i) try {
				t.stop(e);
			} catch {}
		},
		onended: null
	};
	return a && (a.onended = () => {
		o.onended?.();
	}), o;
}
function ne(e, n, r, i, a, o) {
	let s = r + b(n), c = e.createGain();
	c.gain.setValueAtTime(0, r), c.gain.linearRampToValueAtTime(n.amp, r + p), c.gain.setValueAtTime(n.amp, r + p + n.hold), c.gain.linearRampToValueAtTime(0, r + p + n.hold + m), c.connect(a);
	let l = [[n.hz, 1], [n.hz * 2, v]];
	for (let [n, i] of l) {
		let a = e.createOscillator(), l = e.createGain();
		a.frequency.value = t(n, 20, 2e3, 440), l.gain.value = i, a.connect(l), l.connect(c), a.start(r), a.stop(s), o.add(a), a.onended = () => {
			o.delete(a), a.disconnect(), l.disconnect();
		};
	}
	let u = e.createBiquadFilter();
	u.type = "bandpass", u.frequency.value = t(n.hz * 2, 40, 4e3, 880), u.Q.value = 2;
	let d = e.createGain();
	d.gain.value = y * Z, i.connect(u), u.connect(d), d.connect(c), re(() => {
		u.disconnect(), d.disconnect(), c.disconnect();
	}, (s - e.currentTime + .5) * 1e3);
}
var re = (e, n) => {
	setTimeout(e, t(n, 0, 3e4, 5e3));
};
function ie(t, n) {
	let r = t.createGain(), i = $(t, c(Math.round(t.sampleRate * 4), e(n ^ 0x5bd1e995)));
	i.start();
	let a = /* @__PURE__ */ new Set(), o = x(n), s = t.currentTime, l = o(), u = () => {
		for (; l.at < t.currentTime - s + Y;) ne(t, l, s + l.at, i, r, a), l = o();
	};
	u();
	let d = setInterval(u, X), f = {
		connect: (e) => r.connect(e),
		disconnect: () => r.disconnect(),
		stop: (e) => {
			clearInterval(d);
			for (let t of a) try {
				t.stop(e);
			} catch {}
			try {
				i.stop(e);
			} catch {}
		},
		onended: null
	};
	return i.onended = () => {
		clearInterval(d), f.onended?.();
	}, f;
}
function ae(e, n, r) {
	let i = Math.trunc(t(r, 0, 2 ** 31, 1));
	return n === "flute" ? ie(e, i) : n === "bowl" || n === "softchimes" ? q(e, n, i) : te(e, n, i);
}
export { ae as buildSynth };
