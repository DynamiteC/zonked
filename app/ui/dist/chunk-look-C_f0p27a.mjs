import { useCallback as e, useEffect as t, useState as n } from "react";
// ../../web/src/ui/calm/look.ts
var r = "zonked.look.v1", i = "zonked.theme.v2", a = {
	choice: "dark",
	dim: null,
	announce: !0
}, o = [
	"system",
	"light",
	"dark",
	"contrast"
], s = (e) => typeof e == "string" && o.includes(e);
function c(e) {
	if (e === null) return null;
	try {
		let t = JSON.parse(e.slice(0, 400));
		return typeof t == "object" && t ? t : null;
	} catch {
		return null;
	}
}
function l(e) {
	let t = c(e);
	return t === null ? a : {
		choice: s(t.choice) ? t.choice : a.choice,
		dim: typeof t.dim == "boolean" ? t.dim : null,
		announce: t.announce !== !1
	};
}
function u(e) {
	let t = c(e);
	if (t === null) return a;
	let n = t.highContrast === !0 ? "contrast" : t.theme === "light" ? "light" : "dark";
	return {
		...a,
		choice: n
	};
}
var d = (e) => e.getHours() >= 19 || e.getHours() < 7, f = (e, t = /* @__PURE__ */ new Date()) => e.dim ?? d(t), p = () => typeof window.matchMedia == "function" && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
function m(e, t) {
	return e.choice === "contrast" ? {
		theme: t,
		highContrast: !0
	} : {
		theme: e.choice === "system" ? t : e.choice,
		highContrast: !1
	};
}
function h() {
	try {
		let e = window.localStorage.getItem(i);
		return e === null ? u(window.localStorage.getItem(r)) : l(e);
	} catch {
		return a;
	}
}
function g() {
	let [r, a] = n(h), [o, s] = n(p);
	t(() => {
		if (typeof window.matchMedia != "function") return;
		let e = window.matchMedia("(prefers-color-scheme: light)"), t = () => s(e.matches ? "light" : "dark");
		return e.addEventListener?.("change", t), () => e.removeEventListener?.("change", t);
	}, []);
	let c = e((e) => {
		a(e);
		try {
			window.localStorage.setItem(i, JSON.stringify(e));
		} catch {}
	}, []);
	return {
		look: m(r, o),
		prefs: r,
		dim: f(r),
		setPrefs: c
	};
}
export { g as n, f as t };
