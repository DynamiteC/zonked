import { jsx as b } from "react/jsx-runtime";
import { useState as M, useEffect as A } from "react";
const B = 0.5, E = 1.25, c = (t, e) => Number.isFinite(t) ? t : e, i = (t, e, o) => Math.max(e, Math.min(o, t)), f = (t) => (1 - Math.cos(Math.PI * i(t, 0, 1))) / 2;
function S(t, e = 4, o = 4) {
  const n = i(c(e, 4), 0.5, 30), a = i(c(o, 4), 0.5, 30), s = n + a, r = (c(t, 0) % s + s) % s;
  if (r < n) return f(r / n);
  const u = Math.min(B, a / 4), m = i((r - n) / (a - u), 0, 1);
  return 1 - f(1 - Math.pow(1 - m, E));
}
function F(t, e = 4, o = 4) {
  const n = i(c(e, 4), 0.5, 30), a = n + i(c(o, 4), 0.5, 30);
  return (c(t, 0) % a + a) % a < n ? "Breathe in" : "Breathe out";
}
const p = { phase: 0, label: "Breathe in" }, I = 4e-3;
function L(t) {
  const [e, o] = M(p);
  return A(() => {
    if (!t || typeof requestAnimationFrame != "function") {
      o(p);
      return;
    }
    let n = 0;
    const a = performance.now(), s = (l) => {
      const r = (l - a) / 1e3, u = S(r), m = F(r);
      o((h) => m === h.label && Math.abs(u - h.phase) < I ? h : { phase: u, label: m }), n = requestAnimationFrame(s);
    };
    return n = requestAnimationFrame(s), () => {
      cancelAnimationFrame(n);
    };
  }, [t]), e;
}
function N({ label: t, className: e }) {
  return /* @__PURE__ */ b("p", { className: e ?? "cm-cue", "aria-live": "polite", role: "status", children: t });
}
export {
  N as B,
  F as a,
  S as b,
  L as u
};
