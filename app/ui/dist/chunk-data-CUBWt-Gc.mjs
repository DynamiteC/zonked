import { a as e, i as t, n, r } from "./chunk-catalog-DjXCbOxc.mjs";
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
	"headphones",
	"speakers",
	"bluetooth",
	"unsure"
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
	headphones: "headphones",
	bluetooth: "bluetooth",
	speakers: "speaker",
	unsure: "headphones"
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
// ../../web/src/ui/calm/data/resolve.ts
var ee = 3, b = Object.freeze([]);
function x(e, t) {
	let n = RegExp(`^${e.replace(/[^a-z0-9-]/g, "")}-\\d{2}$`);
	return t.filter((e) => n.test(e.id)).sort((e, t) => e.id < t.id ? -1 : +(e.id > t.id));
}
function te(e, t, r) {
	let i = {
		...t,
		situation: e.situation,
		vibe: e.vibe,
		availableMinutes: e.minutes
	};
	return n(i, 1, r)[0]?.template.id;
}
function S(e, t, n) {
	let r = e.length;
	for (let i = 0; i < r; i += 1) {
		let a = e[(t + i) % r];
		if (a !== void 0 && (!n || a.intensity <= ee)) return a.id;
	}
}
function C(e, t, n, r, i) {
	return S(x(e.family, i), t, r.extraGentle) ?? te(n, y(r), i);
}
function w(t, n, r, i = e()) {
	let a = h(n);
	if (a === void 0) return b;
	let o = [];
	for (let e of a.days) {
		if (e.kind === "rest") continue;
		let n = C(e, o.length, a, t, i);
		n !== void 0 && o.push(n);
	}
	return Object.freeze(o);
}
// ../../web/src/ui/calm/data/feel.ts
var T = "zonked.feel.v1", E = [
	"calmer",
	"same",
	"not"
], D = 1e7, O = /^[a-z0-9-]{1,80}$/, ne = 4, re = 12, ie = (e) => E.some((t) => t === e);
function k(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return;
	let { id: t, a: n, day: r } = e;
	if (typeof t == "string" && O.test(t) && ie(n) && !(typeof r != "number" || !Number.isInteger(r) || r < 0 || r > D)) return {
		id: t,
		a: n,
		day: r
	};
}
function A(e) {
	if (!Array.isArray(e)) return [];
	let t = [];
	for (let n of e.slice(-500)) {
		let e = k(n);
		e !== void 0 && t.push(e);
	}
	return t;
}
function j(e) {
	try {
		let t = e.get(T);
		if (t === null || t.length > 65536) return [];
		let n = JSON.parse(t);
		if (typeof n != "object" || !n) return [];
		let r = n;
		return r.v === 1 ? A(r.entries) : [];
	} catch {
		return [];
	}
}
function M(e, t) {
	let n = A(t);
	try {
		let t = JSON.stringify({
			v: 1,
			entries: n
		});
		for (; t.length > 65536 && n.length > 0;) n = n.slice(Math.ceil(n.length / 10)), t = JSON.stringify({
			v: 1,
			entries: n
		});
		return e.set(T, t), !0;
	} catch {
		return !1;
	}
}
function N(e, t) {
	let n = k(t);
	return n === void 0 ? e : [...e, n].slice(-500);
}
function P(e) {
	try {
		e.remove(T);
	} catch {}
}
function F(e, t) {
	let n = 0;
	for (let r of e) r.id === t && (n += r.a === "calmer" ? ne : r.a === "not" ? -4 : 0);
	return Math.max(-12, Math.min(re, n));
}
var I = (e) => e.reasons.some((e) => e.startsWith("Made for:")) && !e.reasons.some((e) => e.startsWith("Filters relaxed"));
function L(e, n, i) {
	if (i.length === 0) return e;
	let a = Math.max(0, ...e.map((e) => e.template.intensity)), o = e.some((e) => t(e.template)), s = e.some((e) => r(e.template)), c = new Set(e.map((e) => e.template.id)), l = n.filter((e) => c.has(e.template.id) || I(e) && e.template.intensity <= a && (o || !t(e.template)) && (s || !r(e.template))).map((e, t) => ({
		r: e,
		i: t,
		s: e.score + F(i, e.template.id)
	}));
	return l.sort((e, t) => t.s - e.s || e.i - t.i), l.slice(0, e.length).map((e) => e.r);
}
// ../../web/src/ui/calm/data/storage.ts
var R = "zonked.profile.v1", z = "zonked.journeys.v1", B = "zonked.last.v1", V = 1, H = 1e7, U = /^[a-z0-9-]{1,64}$/, W = Object.freeze({
	goal: "curious",
	timeOfDay: "anytime",
	device: "unsure",
	extraGentle: !1,
	createdAt: 0
}), ae = Object.freeze({}), G = (e) => typeof e == "object" && !!e && !Array.isArray(e), K = (e, t) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= t, q = (e, t) => e.some((e) => e === t);
function J(e, t) {
	try {
		let n = e.get(t);
		if (n === null || n.length > 32768) return;
		let r = JSON.parse(n);
		return G(r) && r.v === V ? r : void 0;
	} catch {
		return;
	}
}
function Y(e, t, n) {
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
function X(e) {
	let { goal: t, timeOfDay: n, device: r, extraGentle: s, createdAt: c } = e;
	if (q(i, t) && q(a, n) && q(o, r) && typeof s == "boolean" && K(c, 2 ** 53 - 1)) return Object.freeze({
		goal: t,
		timeOfDay: n,
		device: r,
		extraGentle: s,
		createdAt: c
	});
}
function oe(e) {
	let t = J(e, R);
	return (t && X(t)) ?? W;
}
function se(e, t) {
	let n = X({ ...t });
	return n !== void 0 && Y(e, "zonked.profile.v1", { ...n });
}
function Z(e, t) {
	let n = m.find((t) => t.id === e);
	if (n === void 0 || !G(t) || !K(t.startedAt, H)) return;
	let { doneDays: r, pickedIds: i } = t;
	if (!Array.isArray(r) || !Array.isArray(i) || i.length > n.days.length) return;
	let a = r, o = i;
	if (!a.every((e) => K(e, n.days.length) && e >= 1) || !o.every((e) => typeof e == "string" && U.test(e))) return;
	let s = [...new Set(a)].sort((e, t) => e - t);
	return Object.freeze({
		startedAt: t.startedAt,
		doneDays: Object.freeze(s),
		pickedIds: Object.freeze([...o])
	});
}
function ce(e) {
	let t = J(e, z)?.journeys;
	if (!G(t)) return ae;
	let n = {};
	for (let [e, r] of Object.entries(t)) {
		let t = Z(e, r);
		t !== void 0 && (n[e] = t);
	}
	return Object.freeze(n);
}
function le(e, t) {
	let n = {};
	for (let [e, r] of Object.entries(t)) {
		let t = Z(e, r);
		t !== void 0 && (n[e] = t);
	}
	return Y(e, z, { journeys: n });
}
function ue(e) {
	for (let t of [
		R,
		z,
		B,
		T
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
function de(e) {
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
function fe(e) {
	try {
		let t = e.get(B);
		return t !== null && $.test(t) ? t : null;
	} catch {
		return null;
	}
}
function pe(e, t) {
	try {
		$.test(t) && e.set(B, t);
	} catch {}
}
export { m as _, oe as a, i as b, se as c, P as d, j as f, y as g, w as h, fe as i, le as l, M as m, ue as n, ce as o, L as p, de as r, pe as s, W as t, N as u, h as v, a as x, o as y };
