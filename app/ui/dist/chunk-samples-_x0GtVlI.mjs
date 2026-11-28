import { A as e, B as t, C as n, D as r, E as i, F as a, M as o, N as s, O as c, R as l, S as u, T as d, j as f, k as p, w as m, z as h } from "./chunk-crewLink-B-5l2pQt.mjs";
import { n as g } from "./chunk-own-D62uDPlI.mjs";
// \0rolldown/runtime.js
var _ = Object.defineProperty, v = (e, t) => {
	let n = Object.setPrototypeOf({}, null);
	for (var r in e) _(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t & 1 || _(n, Symbol.toStringTag, { value: "Module" }), t & 2 ? n : Object.preventExtensions(n);
}, y = [
	{
		id: "rain",
		label: "Rain",
		kind: "loop",
		note: "Steady rain on leaves and ground.",
		hiss: .0851,
		trimDb: 2,
		rawLufs: -28.2,
		btFriendly: !1,
		moods: [
			"focus",
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "stream",
		label: "Stream",
		kind: "loop",
		note: "Clear water running close by.",
		hiss: .0132,
		trimDb: 12,
		rawLufs: -38.1,
		btFriendly: !0,
		moods: [
			"focus",
			"calm",
			"nature"
		]
	},
	{
		id: "forest",
		label: "Forest",
		kind: "loop",
		note: "Quiet woods with a little air in the trees.",
		hiss: .0126,
		trimDb: 2.5,
		rawLufs: -28.5,
		btFriendly: !0,
		moods: [
			"focus",
			"calm",
			"nature"
		]
	},
	{
		id: "birds",
		label: "Birds",
		kind: "loop",
		note: "Birds singing in a garden.",
		hiss: .4457,
		trimDb: 2.5,
		rawLufs: -28.4,
		more: !0,
		btFriendly: !1,
		moods: ["calm", "nature"]
	},
	{
		id: "breeze",
		label: "Breeze and birds",
		kind: "loop",
		note: "A soft breeze with birds far off.",
		hiss: 2e-4,
		trimDb: 17,
		rawLufs: -43.1,
		more: !0,
		btFriendly: !0,
		moods: ["calm", "nature"]
	},
	{
		id: "lightrain",
		label: "Light rain",
		kind: "loop",
		note: "Fine rain with a faint rumble far away.",
		hiss: .0469,
		trimDb: 5.5,
		rawLufs: -31.5,
		btFriendly: !1,
		moods: [
			"focus",
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "thunder",
		label: "Far thunder",
		kind: "loop",
		note: "Light rain with slow thunder in the distance.",
		hiss: .0343,
		trimDb: 6,
		rawLufs: -32.1,
		btFriendly: !0,
		moods: ["calm", "nature"]
	},
	{
		id: "veranda",
		label: "Rain on a veranda",
		kind: "loop",
		note: "Rain on a covered porch.",
		hiss: .072,
		trimDb: 5.5,
		rawLufs: -31.3,
		btFriendly: !1,
		moods: [
			"focus",
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "window",
		label: "Rain on a window",
		kind: "loop",
		note: "Rain tapping on glass.",
		hiss: .0047,
		trimDb: 6,
		rawLufs: -31.9,
		btFriendly: !0,
		moods: [
			"focus",
			"calm",
			"sleep"
		]
	},
	{
		id: "storm",
		label: "Summer rain",
		kind: "loop",
		note: "A long, even summer shower.",
		hiss: .1452,
		trimDb: 5,
		rawLufs: -31.1,
		btFriendly: !1,
		moods: [
			"focus",
			"sleep",
			"nature"
		]
	},
	{
		id: "waves",
		label: "Gentle waves",
		kind: "loop",
		note: "Water rolling in and out on a shore.",
		hiss: .0028,
		trimDb: 5.5,
		rawLufs: -31.6,
		btFriendly: !0,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "pebbles",
		label: "Waves on pebbles",
		kind: "loop",
		note: "Waves pulling back over small stones.",
		hiss: .0032,
		trimDb: 8.5,
		rawLufs: -34.4,
		more: !0,
		btFriendly: !0,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "creek",
		label: "Forest creek",
		kind: "loop",
		note: "A small creek in a quiet wood.",
		hiss: .043,
		trimDb: 5.5,
		rawLufs: -31.3,
		btFriendly: !1,
		moods: [
			"focus",
			"calm",
			"nature"
		]
	},
	{
		id: "trickle",
		label: "Water trickle",
		kind: "loop",
		note: "Thin water dripping and running.",
		hiss: .1378,
		trimDb: 6.5,
		rawLufs: -32.5,
		btFriendly: !1,
		moods: ["focus", "calm"]
	},
	{
		id: "fountain",
		label: "Fountain",
		kind: "loop",
		note: "A town fountain, a bright steady wash.",
		hiss: .2373,
		trimDb: 5,
		rawLufs: -31.2,
		btFriendly: !1,
		moods: ["focus", "calm"]
	},
	{
		id: "fire",
		label: "Fire crackle",
		kind: "loop",
		note: "Dry grass crackling in an open fireplace.",
		hiss: .3504,
		trimDb: 10,
		rawLufs: -36.2,
		more: !0,
		btFriendly: !1,
		moods: ["calm"]
	},
	{
		id: "chimes",
		label: "Wind chimes",
		kind: "loop",
		note: "Chimes in a light wind, with soft gaps.",
		hiss: .0019,
		trimDb: 5.5,
		rawLufs: -31.4,
		btFriendly: !0,
		moods: ["calm", "nature"]
	},
	{
		id: "koshi",
		label: "Koshi chimes",
		kind: "loop",
		note: "Slow, airy chimes that ring out and fade.",
		hiss: .0183,
		trimDb: 6,
		rawLufs: -32.1,
		btFriendly: !0,
		moods: ["calm", "sleep"]
	},
	{
		id: "gong",
		label: "Temple gong",
		kind: "loop",
		note: "Deep gong strikes with long, slow fades.",
		hiss: 0,
		trimDb: 8,
		rawLufs: -34.2,
		more: !0,
		btFriendly: !0,
		moods: ["calm"]
	},
	{
		id: "hum",
		label: "Fan hum",
		kind: "loop",
		note: "A smooth room hum, like a fan.",
		hiss: .007,
		trimDb: 5.5,
		rawLufs: -31.7,
		btFriendly: !0,
		moods: ["focus", "sleep"]
	},
	{
		id: "wind",
		label: "Soft wind (synth)",
		kind: "synth",
		note: "Slow gusts of warm wind, made in code.",
		trimDb: 5.5,
		rawLufs: -31.4,
		btFriendly: !0,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "waterfall",
		label: "Waterfall (synth)",
		kind: "synth",
		note: "A steady, soft fall of water, made in code.",
		trimDb: 3.5,
		rawLufs: -29.6,
		btFriendly: !0,
		moods: [
			"focus",
			"calm",
			"nature"
		]
	},
	{
		id: "flute",
		label: "Soft flute (synth)",
		kind: "synth",
		note: "Slow, quiet notes, made in code. Not a real flute.",
		trimDb: 1.5,
		rawLufs: -27.6,
		more: !0,
		btFriendly: !0,
		moods: ["calm", "sleep"]
	},
	{
		id: "rainroof",
		label: "Rain on a roof (synth)",
		kind: "synth",
		note: "Soft drops on a roof, made in code.",
		trimDb: 8.5,
		rawLufs: -34.5,
		btFriendly: !1,
		moods: [
			"focus",
			"calm",
			"sleep"
		]
	},
	{
		id: "bowl",
		label: "Singing bowl (synth)",
		kind: "synth",
		note: "One slow strike every 8 to 14 s, made in code.",
		trimDb: 10.5,
		rawLufs: -36.6,
		btFriendly: !0,
		moods: ["calm", "sleep"]
	},
	{
		id: "softchimes",
		label: "Soft chimes (synth)",
		kind: "synth",
		note: "A few high notes now and then, made in code.",
		trimDb: 8,
		rawLufs: -33.9,
		btFriendly: !0,
		moods: ["calm", "sleep"]
	},
	{
		id: "crackle",
		label: "Campfire crackle (synth)",
		kind: "synth",
		note: "A low glow with small pops, made in code.",
		trimDb: 14,
		rawLufs: -40.2,
		btFriendly: !1,
		moods: ["calm", "sleep"]
	},
	{
		id: "brown",
		label: "Brown noise (synth)",
		kind: "synth",
		note: "A deep, soft rumble that masks noise.",
		trimDb: 8.5,
		rawLufs: -34.6,
		btFriendly: !0,
		moods: ["focus", "sleep"]
	},
	{
		id: "swell",
		label: "Ocean swell (synth)",
		kind: "synth",
		note: "Slow waves that rise and fall, made in code.",
		trimDb: 11,
		rawLufs: -37.2,
		btFriendly: !0,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "crickets",
		label: "Night crickets (synth)",
		kind: "synth",
		note: "Quiet crickets far off, made in code.",
		trimDb: 11,
		rawLufs: -37.1,
		more: !0,
		btFriendly: !1,
		moods: ["calm", "nature"]
	}
], b = {
	birds: "7cd810d7c0",
	breeze: "797acb5125",
	chimes: "d3ac12fa32",
	creek: "3bd4e857e3",
	fire: "c2e4c618ff",
	forest: "9570e37c21",
	fountain: "c5960e3b80",
	gong: "0babde6508",
	hum: "71ef723ff8",
	koshi: "e65f2c8122",
	lightrain: "153a3358c6",
	pebbles: "fb2922a75e",
	rain: "ada559df5c",
	storm: "3b1045c974",
	stream: "43b64bead6",
	thunder: "0c1d0c574e",
	trickle: "6749b033d6",
	veranda: "e9075b8bf5",
	waves: "9cd1141003",
	window: "1fdb9aa77e"
}, x = 1.5, S = "decode timeout", C = {
	rain: "rainroof",
	lightrain: "rainroof",
	thunder: "rainroof",
	veranda: "rainroof",
	window: "rainroof",
	storm: "rainroof",
	fire: "rainroof",
	stream: "waterfall",
	waves: "waterfall",
	pebbles: "waterfall",
	creek: "waterfall",
	trickle: "waterfall",
	fountain: "waterfall",
	forest: "wind",
	birds: "wind",
	breeze: "wind",
	hum: "wind",
	chimes: "bowl",
	koshi: "bowl",
	gong: "bowl"
};
function w(e, t, n) {
	return new Promise((r, i) => {
		let a = setTimeout(() => i(/* @__PURE__ */ Error(S)), n);
		e.decodeAudioData(t).then((e) => {
			clearTimeout(a), r(e);
		}, (e) => {
			clearTimeout(a), i(e instanceof Error ? e : Error(String(e)));
		});
	});
}
function T(e) {
	if (typeof e.getChannelData != "function" || !(e.length >= 2)) return;
	let t = e.getChannelData(0);
	a(t[0] ?? 0, t[t.length - 1] ?? 0, h(t)) && l.record(Date.now(), "seam");
}
var E = (e) => ({
	ok: !1,
	error: e
}), D = 20261128, O = /^[a-z]+$/;
function k(e) {
	let t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), d = null, h = 0, g = null, _ = 0, v = 0, k = () => d === null ? 0 : g ?? r(h);
	function A(e) {
		e.duck.gain.setTargetAtTime(i(k()), e.ctx.currentTime, u);
	}
	function j(e) {
		return h * e.trim * (g === null ? 1 : o(g));
	}
	let M = (e) => s(y.find((t) => t.id === e)?.trimDb ?? 0);
	function N(e, t, n) {
		let r = t.ctx.currentTime, i = e.gain.gain, a = j(e);
		if (i.setValueAtTime(0, r), !n) {
			i.linearRampToValueAtTime(a, r + 2);
			return;
		}
		let o = f(!0);
		for (let e = 0; e < o.length; e++) o[e] = (o[e] ?? 0) * a;
		i.setValueCurveAtTime(o, r, x);
	}
	function P(t) {
		if (!O.test(t) || !y.some((e) => e.id === t)) return null;
		try {
			let n = b[t], r = new URL(`${e.baseUrl}samples/${t}.mp3.json${n === void 0 ? "" : `?v=${n}`}`, e.origin);
			return r.origin === new URL(e.origin).origin ? r.href : null;
		} catch {
			return null;
		}
	}
	async function F(n, r) {
		if (t.has(r)) return { ok: !0 };
		let i = P(r);
		if (i === null) return E("unknown sample");
		try {
			let a = await e.fetchBytes(i), o = await w(n.ctx, a, e.decodeTimeoutMs ?? 8e3);
			return t.set(r, o), T(o), { ok: !0 };
		} catch (e) {
			return l.record(Date.now(), "decode"), e instanceof Error && e.message === S ? E(S) : E("sample unavailable: check the connection or reinstall the app files");
		}
	}
	function I(e, t) {
		let n = a.get(t);
		if (n !== void 0) return n;
		let r = F(e, t).finally(() => {
			a.delete(t);
		});
		return a.set(t, r), r;
	}
	function L(e, t, r = !1) {
		let i = t.ctx.currentTime, a = e.gain.gain, o = a.value, s = r ? x : n;
		if (a.cancelScheduledValues(i), a.setValueAtTime(o, i), r) {
			let e = f(!1);
			for (let t = 0; t < e.length; t++) e[t] = (e[t] ?? 0) * o;
			a.setValueCurveAtTime(e, i, s);
		} else a.linearRampToValueAtTime(0, i + s);
		try {
			e.src.stop(i + s + .05);
		} catch {}
		e.src.onended = () => {
			e.src.disconnect(), e.gain.disconnect();
		};
	}
	function R(e, t, n, r, i) {
		let a = d !== null;
		d !== null && L(d, e, !0), h = p(r, h);
		let o = e.ctx.createBufferSource(), s = e.ctx.createGain();
		o.buffer = n, o.loop = i;
		let c = {
			id: t,
			src: o,
			gain: s,
			trim: M(t)
		};
		return N(c, e, a), o.connect(s), s.connect(e.input), i || (o.onended = () => {
			o.disconnect(), s.disconnect(), d === c && (d = null, A(e));
		}), o.start(), d = c, A(e), { ok: !0 };
	}
	async function z(t, n, r, i) {
		let a;
		try {
			a = (await import("./chunk-graph-pvSx_qiJ.mjs")).buildSynth;
		} catch {
			return E("sample unavailable: reinstall the app files");
		}
		if (i !== _) return { ok: !0 };
		let o = d !== null;
		d !== null && L(d, t, !0), h = p(r, h);
		let s = Math.trunc(e.dayNumber?.() ?? Date.now() / 864e5), c = a(t.ctx, n, D + (Number.isFinite(s) ? Math.abs(s) % 1e5 : 0) * 31 + v++), l = t.ctx.createGain(), u = {
			id: n,
			src: c,
			gain: l,
			trim: M(n)
		};
		return N(u, t, o), c.connect(l), l.connect(t.input), d = u, A(t), { ok: !0 };
	}
	return {
		list: () => y,
		async start(n, r) {
			let i = e.getBus();
			if (i === null) return E("start the sound first");
			let a = ++_;
			if (y.some((e) => e.id === n && e.kind === "synth")) return z(i, n, r, a);
			let o = await I(i, n), s = C[n];
			if (!o.ok && o.error === S && s !== void 0 && a === _) {
				let e = await z(i, s, r, a), t = (y.find((e) => e.id === s)?.label ?? s).replace(" (synth)", "").toLowerCase();
				return e.ok ? {
					ok: !0,
					note: `The recording could not load in this browser, so a made-in-code sound (${t}) plays instead.`
				} : e;
			}
			if (!o.ok) return o.error === S ? E("sample unavailable: this browser could not decode it") : o;
			let c = t.get(n);
			return c === void 0 || a !== _ ? c === void 0 ? E("sample unavailable") : { ok: !0 } : R(i, n, c, r, !0);
		},
		startBuffer(t, n, r, i) {
			let a = e.getBus();
			return a === null ? E("start the sound first") : (_++, R(a, t, n, r, i));
		},
		setLevel(t) {
			h = p(t, h);
			let n = e.getBus();
			if (n === null || d === null) return;
			let r = d.gain.gain;
			r.cancelScheduledValues(n.ctx.currentTime), r.setTargetAtTime(j(d), n.ctx.currentTime, m), A(n);
		},
		setBlend(t) {
			g = c(t, g ?? 0);
			let n = e.getBus();
			n !== null && (d !== null && d.gain.gain.setTargetAtTime(j(d), n.ctx.currentTime, m), A(n));
		},
		stop() {
			_++;
			let t = e.getBus(), n = d;
			d = null, t !== null && n !== null && (L(n, t), A(t));
		},
		playing: () => d?.id ?? null
	};
}
// ../../web/src/audio/samples/cacheName.ts
var A = ["zonked-samples"];
function j(e = typeof caches > "u" ? void 0 : caches) {
	if (e !== void 0) for (let t of A) try {
		Promise.resolve(e.delete(t)).catch(() => void 0);
	} catch {}
}
// ../../web/src/audio/samples/index.ts
var M = /* @__PURE__ */ v({
	MAX_SAMPLE_LEVEL: () => d,
	duckGain: () => e,
	listSamples: () => F,
	playingSample: () => B,
	setBlend: () => z,
	setSampleLevel: () => L,
	startOwn: () => V,
	startSample: () => I,
	stopSample: () => R
});
async function N(e) {
	let t = await fetch(e, { credentials: "same-origin" });
	if (!t.ok) throw Error(`status ${t.status}`);
	return t.arrayBuffer();
}
var P = k({
	getBus: t,
	fetchBytes: N,
	baseUrl: "./",
	origin: typeof location > "u" ? "" : location.href
});
j();
var F = () => P.list(), I = (e, t) => P.start(e, t), L = (e) => P.setLevel(e), R = () => P.stop(), z = (e) => P.setBlend(e), B = () => P.playing();
async function V(e, n, r) {
	let i = t();
	if (i === null) return {
		ok: !1,
		error: "start the sound first"
	};
	try {
		let t = await i.ctx.decodeAudioData(n.slice(0)), a = Array.from({ length: t.numberOfChannels }, (e, n) => t.getChannelData(n)), o = g(a, t.sampleRate);
		if (!o.ok) return o;
		let s = i.ctx.createBuffer(1, o.data.length, t.sampleRate);
		return s.getChannelData(0).set(o.data), P.startBuffer(e, s, r, o.loop);
	} catch {
		return {
			ok: !1,
			error: "This file could not be played."
		};
	}
}
export { M as n, v as r, F as t };
