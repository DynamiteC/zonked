import { G as e, K as t, X as n, q as r } from "./chunk-crewLink-TXTH-ttS.mjs";
var i = {
	v: 1,
	items: []
};
function a(a, o) {
	if (!r(a) || t(a, "v") !== 1) return i;
	let s = t(a, "items");
	if (!Array.isArray(s)) return i;
	let c = [], l = /* @__PURE__ */ new Set();
	for (let i of s.slice(0, 1e3)) {
		if (!r(i)) continue;
		let a = t(i, "kind"), s = e(t(i, "id"));
		if (a !== "template" && a !== "mix" || s === null) continue;
		let u = `${a}:${s}`;
		if (!l.has(u) && (l.add(u), c.push({
			kind: a,
			id: s,
			at: n(t(i, "at"), 0, o + 864e5, o)
		}), c.length >= 500)) break;
	}
	return {
		v: 1,
		items: c
	};
}
function o(e, t, n) {
	return e.items.some((e) => e.kind === t && e.id === n);
}
function s(t, n, r, i) {
	return o(t, n, r) ? {
		v: 1,
		items: t.items.filter((e) => e.kind !== n || e.id !== r)
	} : e(r) === null || t.items.length >= 500 ? t : {
		v: 1,
		items: [{
			kind: n,
			id: r,
			at: i
		}, ...t.items]
	};
}
function c(e, t, n) {
	return o(e, t, n) ? s(e, t, n, 0) : e;
}
export { s as a, c as i, o as n, a as r, i as t };
