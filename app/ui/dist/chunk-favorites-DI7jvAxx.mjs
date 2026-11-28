import { B as e, R as t, V as n, z as r } from "./chunk-crewLink-CH1NzHoN.mjs";
var i = {
	v: 1,
	items: []
};
function a(a, o) {
	if (!e(a) || r(a, "v") !== 1) return i;
	let s = r(a, "items");
	if (!Array.isArray(s)) return i;
	let c = [], l = /* @__PURE__ */ new Set();
	for (let i of s.slice(0, 1e3)) {
		if (!e(i)) continue;
		let a = r(i, "kind"), s = t(r(i, "id"));
		if (a !== "template" && a !== "mix" || s === null) continue;
		let u = `${a}:${s}`;
		if (!l.has(u) && (l.add(u), c.push({
			kind: a,
			id: s,
			at: n(r(i, "at"), 0, o + 864e5, o)
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
function s(e, n, r, i) {
	return o(e, n, r) ? {
		v: 1,
		items: e.items.filter((e) => e.kind !== n || e.id !== r)
	} : t(r) === null || e.items.length >= 500 ? e : {
		v: 1,
		items: [{
			kind: n,
			id: r,
			at: i
		}, ...e.items]
	};
}
export { s as i, o as n, a as r, i as t };
