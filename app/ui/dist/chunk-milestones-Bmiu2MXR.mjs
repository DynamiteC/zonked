import { Q as e, Z as t, tt as n } from "./chunk-crewLink-B-5l2pQt.mjs";
var r = 864e5, i = [
	{
		id: "first-session",
		met: (e) => e.sessions >= 1
	},
	{
		id: "three-days",
		met: (e) => e.bestStreak >= 3
	},
	{
		id: "ten-sessions",
		met: (e) => e.sessions >= 10
	},
	{
		id: "one-hour",
		met: (e) => e.totalMinutes >= 60
	},
	{
		id: "five-hours",
		met: (e) => e.totalMinutes >= 300
	},
	{
		id: "first-sleep-fade",
		met: (e) => e.sleepFades >= 1
	},
	{
		id: "took-a-break",
		met: (e) => e.breaks >= 1
	}
];
function a(e, t) {
	return Math.floor((e - t * 6e4) / r);
}
function o(e) {
	let t = (e.endedAt - e.startedAt) / 6e4;
	return Number.isFinite(t) && t >= 1 ? Math.min(720, t) : 0;
}
function s(e) {
	let t = 0, n = 0, r = null, i = -1e400;
	for (let a of e) r === null ? t = 1 : a - r === 1 ? t += 1 : a - r === 2 && r + 1 - i > 7 ? (i = r + 1, t += 1) : t = 1, n = Math.max(n, t), r = a;
	return {
		current: t,
		best: n,
		last: r
	};
}
function c(e, t, n) {
	let r = e.filter((e) => o(e) > 0), i = [...new Set(r.map((e) => a(e.startedAt, n)))].sort((e, t) => e - t), c = s(i), l = c.last !== null && a(t, n) - c.last <= 2, u = r.map(o);
	return {
		sessions: r.length,
		totalMinutes: Math.round(u.reduce((e, t) => e + t, 0)),
		activeDays: i.length,
		streak: l ? c.current : 0,
		bestStreak: c.best,
		longestMinutes: Math.round(u.reduce((e, t) => Math.max(e, t), 0)),
		firstSessionAt: r.reduce((e, t) => e === null || t.startedAt < e ? t.startedAt : e, null),
		sleepFades: r.filter((e) => e.endKind === "sleep-fade" && o(e) >= 10).length,
		breaks: r.reduce((e, t) => e + +(typeof t.breaks == "number" && t.breaks > 0), 0)
	};
}
var l = "Take a slow breath.", u = {
	v: 1,
	hidden: !1,
	earned: {},
	reminder: {
		on: !1,
		text: l,
		shownDay: -1
	}
};
function d(e) {
	if (typeof e != "string") return l;
	let t = e.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
	return t.length > 0 ? t : l;
}
function f(a, o) {
	if (!e(a) || t(a, "v") !== 1) return u;
	let s = {}, c = t(a, "earned");
	if (e(c)) for (let e of i) {
		let i = t(c, e.id);
		typeof i == "number" && Number.isFinite(i) && (s[e.id] = n(i, 0, o + r, o));
	}
	let l = t(a, "reminder"), f = e(l) ? l : {};
	return {
		v: 1,
		hidden: t(a, "hidden") === !0,
		earned: s,
		reminder: {
			on: t(f, "on") === !0,
			text: d(t(f, "text")),
			shownDay: Math.round(n(t(f, "shownDay"), -1, 1e6, -1))
		}
	};
}
function p(e, t, n) {
	let r = i.filter((n) => e.earned[n.id] === void 0 && n.met(t)).map((e) => e.id);
	if (r.length === 0) return {
		state: e,
		added: r
	};
	let a = { ...e.earned };
	for (let e of r) a[e] = n;
	return {
		state: {
			...e,
			earned: a
		},
		added: r
	};
}
function m(e) {
	return {
		...e,
		earned: {}
	};
}
function h(e, t, n) {
	let r = a(t, n);
	return !e.reminder.on || e.reminder.shownDay === r ? {
		show: !1,
		state: e
	} : {
		show: !0,
		state: {
			...e,
			reminder: {
				...e.reminder,
				shownDay: r
			}
		}
	};
}
export { p as a, o as c, h as i, d as n, f as o, c as r, m as s, u as t };
