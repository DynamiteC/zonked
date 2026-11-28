import { a as e, i as t, n, r } from "./chunk-catalog-CdNrcMzw.mjs";
// ../../web/src/ui/calm/data/types.ts
var i = [
	"focus",
	"calm",
	"sleep",
	"study",
	"recover",
	"curious"
], a = [
	"morning",
	"afternoon",
	"evening",
	"night",
	"anytime"
], o = [
	"wired",
	"bluetooth",
	"speakers"
], s = {
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
}, c = Object.freeze({
	kind: "rest",
	family: "",
	variants: Object.freeze([])
});
function l(e) {
	let t = s[e] ?? 0, n = [];
	for (let r = 1; r <= t; r += 1) n.push(`${e}-${String(r).padStart(2, "0")}`);
	return Object.freeze(n);
}
function u(e) {
	return Object.freeze({
		kind: "session",
		family: e,
		variants: l(e)
	});
}
function d(...e) {
	return Object.freeze(e.map((e) => e === "rest" ? c : u(e)));
}
var f = (e, t) => Array.from({ length: t }, () => e), p = (e) => Object.freeze(e), m = Object.freeze([
	p({
		id: "calm-evenings",
		title: "7 Calm Evenings",
		blurb: "7 short evenings of slow sound. About 20 minutes each.",
		situation: "heal-stress",
		vibe: "calm",
		minutes: 20,
		days: d("healing-soothe-glide", "meditation-breath-pacer", "vibe-warm-glow", "rest", "meditation-alpha-sit", "recovery-lofi-unwind", "healing-soothe-glide")
	}),
	p({
		id: "focus-mornings",
		title: "5 Focus Mornings",
		blurb: "5 mornings of steady sound to start work. About 30 minutes each.",
		situation: "deep-work",
		vibe: "bright",
		minutes: 30,
		days: d("focus-alpha-beta", "focus-alpha-beta", "focus-sprint-pulse", "rest", "focus-deep-beta")
	}),
	p({
		id: "easier-sleep",
		title: "14 Nights of Wind-Down Sound",
		blurb: "14 nights of slow sound for winding down. Rest nights included.",
		situation: "cant-sleep",
		vibe: "dreamy",
		minutes: 45,
		days: d(...f("sleep-drift-theta", 4), "rest", ...f("sleep-onset-delta", 4), "rest", ...f("sleep-deep-delta", 3), "sleep-onset-delta")
	}),
	p({
		id: "study-sprint",
		title: "Study Sprint Week",
		blurb: "A week of short study blocks with breaks. About 25 minutes each.",
		situation: "deep-work",
		vibe: "minimal",
		minutes: 25,
		days: d("focus-sprint-pulse", "focus-alpha-beta", "recovery-micro-break", "focus-sprint-pulse", "rest", "focus-alpha-beta", "meditation-alpha-sit")
	}),
	p({
		id: "after-work-reset",
		title: "After-Work Reset",
		blurb: "5 evenings to step out of work mode. About 20 minutes each.",
		situation: "ai-burnout",
		vibe: "warm",
		minutes: 20,
		days: d("recovery-post-sprint", "recovery-lofi-unwind", "recovery-micro-break", "rest", "recovery-lofi-unwind")
	}),
	p({
		id: "gentle-routine",
		title: "Gentle Routine",
		blurb: "Gentle routine for steady attention. About 25 minutes each.",
		situation: "adhd-focus",
		vibe: "grounded",
		minutes: 25,
		days: d("adhd-smr-steady", "recovery-micro-break", "adhd-smr-steady", "rest", "adhd-beta-anchor", "recovery-micro-break", "adhd-smr-steady")
	})
]);
function h(e) {
	return m.find((t) => t.id === e);
}
// ../../web/src/ui/calm/data/recommendation.ts
var g = {
	focus: {
		situation: "deep-work",
		vibe: "bright",
		minutes: 25
	},
	calm: {
		situation: "heal-stress",
		vibe: "calm",
		minutes: 15
	},
	sleep: {
		situation: "cant-sleep",
		vibe: "dreamy",
		minutes: 45
	},
	study: {
		situation: "deep-work",
		vibe: "minimal",
		minutes: 30
	},
	recover: {
		situation: "ai-burnout",
		vibe: "warm",
		minutes: 15
	},
	curious: {
		situation: "quick-reset",
		minutes: 10
	}
}, _ = {
	wired: "headphones",
	bluetooth: "bluetooth",
	speakers: "speaker"
};
function v(e) {
	return e < 12 ? "morning" : e >= 12 && e < 17 ? "afternoon" : e >= 17 && e < 21 ? "evening" : "night";
}
function y(e, t = /* @__PURE__ */ new Date()) {
	let n = g[e.goal], r = e.timeOfDay === "anytime" ? v(t.getHours()) : e.timeOfDay, i = {
		situation: n.situation,
		availableMinutes: n.minutes,
		timeOfDay: r,
		sensorySensitivity: e.extraGentle ? "high" : "medium",
		deviceType: _[e.device]
	};
	return Object.freeze(n.vibe === void 0 ? i : {
		...i,
		vibe: n.vibe
	});
}
var ee = 6, te = 12, ne = 12, re = 3, ie = 6, ae = 24, oe = [
	"pad",
	"instrument",
	"chimes"
];
function b(e) {
	let t = Math.min(te, e.layerTags.filter((e) => oe.includes(e)).length * ee), n = e.stages.some((e) => e.noiseLevel > 0 && (e.noise === "white" || e.noise === "violet")), i = e.stages.some((e) => e.noiseLevel > 0 && e.noise === "pink");
	return t - (n ? ne : 0) - (i ? re : 0) - (r(e) ? ie : 0);
}
function se(e, i, a, o) {
	let s = n(e, a, o);
	if (i !== "bluetooth") return s;
	let c = Math.max(0, ...s.map((e) => e.template.intensity)), l = e.sensorySensitivity === "high", u = n(e, Math.max(ae, a), o).filter((e) => e.template.intensity <= c && !(l && (t(e.template) || r(e.template)))).map((e, t) => {
		let n = b(e.template), r = n > 0 ? [...e.reasons, "Clear and soft over Bluetooth."] : e.reasons;
		return {
			r: {
				...e,
				score: Math.max(0, Math.round((e.score + n) * 10) / 10),
				reasons: r
			},
			i: t
		};
	});
	u.sort((e, t) => t.r.score - e.r.score || e.i - t.i);
	let d = u.slice(0, a).map((e) => e.r);
	return d.length >= a ? d : s;
}
function ce(e, t) {
	return t === "bluetooth" ? [...e.filter((e) => e.btFriendly), ...e.filter((e) => !e.btFriendly)] : e;
}
// ../../web/src/ui/calm/data/resolve.ts
var x = 3, le = Object.freeze([]);
function ue(e, t) {
	let n = RegExp(`^${e.replace(/[^a-z0-9-]/g, "")}-\\d{2}$`);
	return t.filter((e) => n.test(e.id)).sort((e, t) => e.id < t.id ? -1 : +(e.id > t.id));
}
function de(e, t, r) {
	let i = {
		...t,
		situation: e.situation,
		vibe: e.vibe,
		availableMinutes: e.minutes
	};
	return n(i, 1, r)[0]?.template.id;
}
function fe(e, t, n) {
	let r = e.length;
	for (let i = 0; i < r; i += 1) {
		let a = e[(t + i) % r];
		if (a !== void 0 && (!n || a.intensity <= x)) return a.id;
	}
}
function pe(e, t, n, r, i) {
	return fe(ue(e.family, i), t, r.extraGentle) ?? de(n, y(r), i);
}
function me(t, n, r, i = e()) {
	let a = h(n);
	if (a === void 0) return le;
	let o = [];
	for (let e of a.days) {
		if (e.kind === "rest") continue;
		let n = pe(e, o.length, a, t, i);
		n !== void 0 && o.push(n);
	}
	return Object.freeze(o);
}
// ../../web/src/ui/calm/data/feel.ts
var S = "zonked.feel.v1", he = [
	"calmer",
	"same",
	"not"
], C = 1e7, w = /^[a-z0-9-]{1,80}$/, T = 4, E = 12, D = (e) => he.some((t) => t === e);
function O(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return;
	let { id: t, a: n, day: r } = e;
	if (typeof t == "string" && w.test(t) && D(n) && !(typeof r != "number" || !Number.isInteger(r) || r < 0 || r > C)) return {
		id: t,
		a: n,
		day: r
	};
}
function k(e) {
	if (!Array.isArray(e)) return [];
	let t = [];
	for (let n of e.slice(-500)) {
		let e = O(n);
		e !== void 0 && t.push(e);
	}
	return t;
}
function A(e) {
	try {
		let t = e.get(S);
		if (t === null || t.length > 65536) return [];
		let n = JSON.parse(t);
		if (typeof n != "object" || !n) return [];
		let r = n;
		return r.v === 1 ? k(r.entries) : [];
	} catch {
		return [];
	}
}
function j(e, t) {
	let n = k(t);
	try {
		let t = JSON.stringify({
			v: 1,
			entries: n
		});
		for (; t.length > 65536 && n.length > 0;) n = n.slice(Math.ceil(n.length / 10)), t = JSON.stringify({
			v: 1,
			entries: n
		});
		return e.set(S, t), !0;
	} catch {
		return !1;
	}
}
function M(e, t) {
	let n = O(t);
	return n === void 0 ? e : [...e, n].slice(-500);
}
function N(e) {
	try {
		e.remove(S);
	} catch {}
}
function P(e, t) {
	let n = 0;
	for (let r of e) r.id === t && (n += r.a === "calmer" ? T : r.a === "not" ? -4 : 0);
	return Math.max(-12, Math.min(E, n));
}
var F = (e) => e.reasons.some((e) => e.startsWith("Made for:")) && !e.reasons.some((e) => e.startsWith("Filters relaxed"));
function I(e, n, i) {
	if (i.length === 0) return e;
	let a = Math.max(0, ...e.map((e) => e.template.intensity)), o = e.some((e) => t(e.template)), s = e.some((e) => r(e.template)), c = new Set(e.map((e) => e.template.id)), l = n.filter((e) => c.has(e.template.id) || F(e) && e.template.intensity <= a && (o || !t(e.template)) && (s || !r(e.template))).map((e, t) => ({
		r: e,
		i: t,
		s: e.score + P(i, e.template.id)
	}));
	return l.sort((e, t) => t.s - e.s || e.i - t.i), l.slice(0, e.length).map((e) => e.r);
}
// ../../web/src/ui/calm/data/storage.ts
var L = "zonked.profile.v1", R = "zonked.journeys.v1", z = "zonked.last.v1", B = "zonked.device.v1", V = 1, ge = 1e7, _e = /^[a-z0-9-]{1,64}$/, H = Object.freeze({
	goal: "curious",
	timeOfDay: "anytime",
	device: "wired",
	extraGentle: !1,
	createdAt: 0
}), ve = Object.freeze({}), U = (e) => typeof e == "object" && !!e && !Array.isArray(e), W = (e, t) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= t, G = (e, t) => e.some((e) => e === t);
function K(e, t) {
	try {
		let n = e.get(t);
		if (n === null || n.length > 32768) return;
		let r = JSON.parse(n);
		return U(r) && r.v === V ? r : void 0;
	} catch {
		return;
	}
}
function q(e, t, n) {
	try {
		let r = JSON.stringify({
			v: V,
			...n
		});
		return r.length > 32768 ? !1 : (e.set(t, r), !0);
	} catch {
		return !1;
	}
}
function J(e) {
	return e === "headphones" || e === "unsure" ? "wired" : G(o, e) ? e : void 0;
}
function Y(e) {
	let { goal: t, timeOfDay: n, extraGentle: r, createdAt: o } = e, s = J(e.device);
	if (G(i, t) && G(a, n) && s !== void 0 && typeof r == "boolean" && W(o, 2 ** 53 - 1)) return Object.freeze({
		goal: t,
		timeOfDay: n,
		device: s,
		extraGentle: r,
		createdAt: o
	});
}
function ye(e) {
	return J(K(e, B)?.device);
}
function X(e, t) {
	return G(o, t) && q(e, "zonked.device.v1", { device: t });
}
function be(e) {
	let t = K(e, L), n = t && Y(t), r = ye(e);
	return n ? r === void 0 ? (X(e, n.device), n) : r === n.device ? n : Object.freeze({
		...n,
		device: r
	}) : r === void 0 ? H : Object.freeze({
		...H,
		device: r
	});
}
function xe(e, t) {
	let n = Y({ ...t });
	return n !== void 0 && (X(e, n.device), q(e, L, { ...n }));
}
function Z(e, t) {
	let n = m.find((t) => t.id === e);
	if (n === void 0 || !U(t) || !W(t.startedAt, ge)) return;
	let { doneDays: r, pickedIds: i } = t;
	if (!Array.isArray(r) || !Array.isArray(i) || i.length > n.days.length) return;
	let a = r, o = i;
	if (!a.every((e) => W(e, n.days.length) && e >= 1) || !o.every((e) => typeof e == "string" && _e.test(e))) return;
	let s = [...new Set(a)].sort((e, t) => e - t);
	return Object.freeze({
		startedAt: t.startedAt,
		doneDays: Object.freeze(s),
		pickedIds: Object.freeze([...o])
	});
}
function Se(e) {
	let t = K(e, R)?.journeys;
	if (!U(t)) return ve;
	let n = {};
	for (let [e, r] of Object.entries(t)) {
		let t = Z(e, r);
		t !== void 0 && (n[e] = t);
	}
	return Object.freeze(n);
}
function Ce(e, t) {
	let n = {};
	for (let [e, r] of Object.entries(t)) {
		let t = Z(e, r);
		t !== void 0 && (n[e] = t);
	}
	return q(e, R, { journeys: n });
}
function we(e) {
	for (let t of [
		L,
		R,
		z,
		S,
		B
	]) try {
		e.remove(t);
	} catch {}
}
function Q() {
	let e = /* @__PURE__ */ new Map();
	return {
		get: (t) => e.get(t) ?? null,
		set: (t, n) => void e.set(t, n),
		remove: (t) => void e.delete(t)
	};
}
function Te(e) {
	try {
		let t = e ?? globalThis.localStorage;
		if (t === void 0) return Q();
		let n = "zonked.probe";
		return t.setItem(n, "1"), t.removeItem(n), {
			get: (e) => t.getItem(e),
			set: (e, n) => t.setItem(e, n),
			remove: (e) => t.removeItem(e)
		};
	} catch {
		return Q();
	}
}
var $ = /^[a-z0-9-]{1,80}$/;
function Ee(e) {
	try {
		let t = e.get(z);
		return t !== null && $.test(t) ? t : null;
	} catch {
		return null;
	}
}
function De(e, t) {
	try {
		$.test(t) && e.set(z, t);
	} catch {}
}
export { i as C, o as S, ce as _, be as a, m as b, xe as c, N as d, A as f, me as g, j as h, Ee as i, Ce as l, k as m, we as n, Se as o, I as p, Te as r, De as s, H as t, M as u, y as v, a as w, h as x, se as y };
