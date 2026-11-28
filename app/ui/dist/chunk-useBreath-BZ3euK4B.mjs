import { useEffect as e, useState as t } from "react";
import { jsx as n } from "react/jsx-runtime";
// ../../web/src/ui/calm/mascot/breath.ts
var r = .5, i = 1.25, a = (e, t) => Number.isFinite(e) ? e : t, o = (e, t, n) => Math.max(t, Math.min(n, e)), s = (e) => (1 - Math.cos(Math.PI * o(e, 0, 1))) / 2;
function c(e, t = 4, n = 4) {
	let c = o(a(t, 4), .5, 30), l = o(a(n, 4), .5, 30), u = c + l, d = (a(e, 0) % u + u) % u;
	if (d < c) return s(d / c);
	let f = Math.min(r, l / 4);
	return 1 - s(1 - (1 - o((d - c) / (l - f), 0, 1)) ** i);
}
function l(e, t = 4, n = 4) {
	let r = o(a(t, 4), .5, 30), i = r + o(a(n, 4), .5, 30);
	return (a(e, 0) % i + i) % i < r ? "Breathe in" : "Breathe out";
}
// ../../web/src/ui/calm/mascot/useBreath.tsx
var u = {
	phase: 0,
	label: "Breathe in"
}, d = .004;
function f(n) {
	let [r, i] = t(u);
	return e(() => {
		if (!n || typeof requestAnimationFrame != "function") {
			i(u);
			return;
		}
		let e = 0, t = performance.now(), r = (n) => {
			let a = (n - t) / 1e3, o = c(a), s = l(a);
			i((e) => s === e.label && Math.abs(o - e.phase) < d ? e : {
				phase: o,
				label: s
			}), e = requestAnimationFrame(r);
		};
		return e = requestAnimationFrame(r), () => {
			cancelAnimationFrame(e);
		};
	}, [n]), r;
}
function p({ label: e, className: t, live: r = !0 }) {
	return /* @__PURE__ */ n("p", {
		className: t ?? "cm-cue",
		...r ? {
			"aria-live": "polite",
			role: "status"
		} : {},
		children: e
	});
}
export { l as i, f as n, c as r, p as t };
