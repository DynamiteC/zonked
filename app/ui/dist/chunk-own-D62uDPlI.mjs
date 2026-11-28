// ../../web/src/audio/samples/own.ts
var e = 8388608;
function t(e) {
	let t = e[0]?.length ?? 0, n = new Float32Array(t), r = Math.max(1, e.length);
	for (let i of e) {
		let e = Math.min(t, i.length);
		for (let t = 0; t < e; t++) {
			let e = i[t] ?? 0;
			n[t] = (n[t] ?? 0) + (Number.isFinite(e) ? e : 0) / r;
		}
	}
	return n;
}
function n(e, t) {
	let n = e.length - t, r = e.slice(0, n);
	for (let i = 0; i < t; i++) {
		let a = (i + .5) / t * (Math.PI / 2);
		r[i] = (e[i] ?? 0) * Math.sin(a) + (e[n + i] ?? 0) * Math.cos(a);
	}
	return r;
}
function r(e, r) {
	if (!Number.isFinite(r) || r <= 0 || e.length === 0) return {
		ok: !1,
		error: "This file has no sound in it."
	};
	let i = t(e), a = i.length / r;
	if (a > 600) return {
		ok: !1,
		error: "This file is longer than 10 minutes."
	};
	let o = 0;
	for (let e of i) o = Math.max(o, Math.abs(e));
	if (o < 1e-4) return {
		ok: !1,
		error: "This file is silent."
	};
	let s = .45 / o;
	for (let e = 0; e < i.length; e++) i[e] = (i[e] ?? 0) * s;
	return a < 20 ? {
		ok: !0,
		data: i,
		loop: !1
	} : {
		ok: !0,
		data: n(i, Math.min(Math.round(2 * r), Math.floor(i.length / 4))),
		loop: !0
	};
}
export { r as n, e as t };
