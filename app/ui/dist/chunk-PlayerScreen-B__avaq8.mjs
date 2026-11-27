import { jsxs as d, jsx as t } from "react/jsx-runtime";
import { useState as p, useEffect as f, Suspense as b, lazy as N } from "react";
import { C as i, i as y, h as k, E as C } from "./chunk-App-DapSTSRU.mjs";
const E = 5.5;
function g(n) {
  const e = 60 / E / 2;
  return { inSec: e, outSec: e };
}
const v = 20;
function w(n) {
  if (n.kind === "sleep-fade") return 4;
  if (n.kind !== "countdown") return 3;
  const e = Math.round(n.totalSec / 60);
  return e === 15 ? 0 : e === 30 ? 1 : e === 60 ? 2 : -1;
}
function S({ timer: n, player: e }) {
  const a = (c) => {
    c <= 2 ? e.startTimer({ kind: "countdown", minutes: [15, 30, 60][c] ?? 15 }) : c === 3 ? e.stopTimer() : e.startTimer({ kind: "sleep-fade", minutes: v });
  }, r = w(n);
  return /* @__PURE__ */ d("div", { children: [
    /* @__PURE__ */ t("div", { className: "c-chips", role: "radiogroup", "aria-label": "Timer", children: i.timerChips.map((c, s) => /* @__PURE__ */ t("button", { type: "button", role: "radio", "aria-checked": r === s, className: "c-tchip", onClick: () => a(s), children: c }, c)) }),
    n.kind !== "none" && n.running && /* @__PURE__ */ t("p", { className: "c-time", "data-testid": "time-left", children: y(n.remainingSec) })
  ] });
}
const T = N(() => import("./chunk-mascot-BtlVTBkR.mjs").then((n) => ({ default: n.CalmMascot })));
function x({ still: n, playing: e }) {
  const { inSec: a, outSec: r } = g(), [c, s] = p("in"), o = c === "in" ? a : r;
  return f(() => {
    if (n || !e) return;
    const l = window.setTimeout(() => s((m) => m === "in" ? "out" : "in"), Math.max(1, o) * 1e3);
    return () => window.clearTimeout(l);
  }, [c, o, n, e]), /* @__PURE__ */ d("div", { className: "c-stage", "data-testid": "breath-ring", "data-still": n ? "true" : "false", children: [
    /* @__PURE__ */ t("span", { className: "c-ring", style: { transform: `scale(${n || !e ? 0.9 : c === "in" ? 1 : 0.78})`, transition: n ? "none" : `transform ${o}s ease-in-out` }, "aria-hidden": "true" }),
    /* @__PURE__ */ t(b, { fallback: null, children: /* @__PURE__ */ t(T, { mood: e ? "breathing" : "idle", size: 140, reducedMotion: n }) })
  ] });
}
function A({ player: n, snap: e, still: a, favorite: r, onToggle: c, onFavorite: s }) {
  const [o, h] = p(!1), l = k.find((u) => u.templateId === e.templateId), m = (l == null ? void 0 : l.evidence) ?? "mixed";
  return /* @__PURE__ */ d("div", { className: "c-player", children: [
    /* @__PURE__ */ t("h1", { className: "c-h1", children: e.templateName ?? i.brand }),
    /* @__PURE__ */ t(x, { still: a, playing: e.playing }),
    a && /* @__PURE__ */ t("p", { className: "c-muted", children: i.breathe }),
    /* @__PURE__ */ d("div", { className: "c-controls", children: [
      /* @__PURE__ */ t("button", { type: "button", className: "c-btn c-round c-big", "data-testid": "player-toggle", onClick: c, children: e.playing ? i.stop : i.play }),
      /* @__PURE__ */ t("button", { type: "button", className: "c-btn c-round", "aria-pressed": r, onClick: s, children: r ? i.saved : i.favorite })
    ] }),
    /* @__PURE__ */ t(S, { timer: e.timer, player: n }),
    /* @__PURE__ */ t("p", { className: "c-muted", children: i.volumeCapped }),
    /* @__PURE__ */ d("section", { className: "c-why", children: [
      /* @__PURE__ */ t("button", { type: "button", className: "c-btn c-link", "aria-expanded": o, "aria-controls": "c-why-box", onClick: () => h((u) => !u), children: i.whyTitle }),
      /* @__PURE__ */ d("div", { id: "c-why-box", hidden: !o, children: [
        /* @__PURE__ */ t("p", { children: i.whyBody }),
        /* @__PURE__ */ t("p", { children: `Evidence: ${m}. ${C[m] ?? ""}` })
      ] })
    ] })
  ] });
}
export {
  x as BreathRing,
  A as PlayerScreen
};
