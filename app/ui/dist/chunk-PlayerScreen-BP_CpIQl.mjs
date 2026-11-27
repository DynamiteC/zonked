import { jsxs as a, jsx as n } from "react/jsx-runtime";
import { useState as f, useEffect as b, Suspense as N, lazy as y } from "react";
import { f as k, d as C, l as g } from "./chunk-App-CzOQ23by.mjs";
import { C as i, E as w } from "./chunk-crewLink-Cq0htOCx.mjs";
import { NatureControls as E } from "./chunk-NatureScreen-BgfpiPcA.mjs";
const v = 5.5;
function S(e) {
  const t = 60 / v / 2;
  return { inSec: t, outSec: t };
}
const T = 20;
function x(e) {
  if (e.kind === "sleep-fade") return 4;
  if (e.kind !== "countdown") return 3;
  const t = Math.round(e.totalSec / 60);
  return t === 15 ? 0 : t === 30 ? 1 : t === 60 ? 2 : -1;
}
function M({ timer: e, player: t }) {
  const r = (c) => {
    c <= 2 ? t.startTimer({ kind: "countdown", minutes: [15, 30, 60][c] ?? 15 }) : c === 3 ? t.stopTimer() : t.startTimer({ kind: "sleep-fade", minutes: T });
  }, s = x(e);
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ n("div", { className: "c-chips", role: "radiogroup", "aria-label": "Timer", children: i.timerChips.map((c, o) => /* @__PURE__ */ n("button", { type: "button", role: "radio", "aria-checked": s === o, className: "c-tchip", onClick: () => r(o), children: c }, c)) }),
    e.kind !== "none" && e.running && /* @__PURE__ */ n("p", { className: "c-time", "data-testid": "time-left", children: k(e.remainingSec) })
  ] });
}
const I = y(() => import("./chunk-mascot-gE-i7l4L.mjs").then((e) => ({ default: e.CalmMascot })));
function _({ still: e, playing: t }) {
  const { inSec: r, outSec: s } = S(), [c, o] = f("in"), d = c === "in" ? r : s;
  return b(() => {
    if (e || !t) return;
    const u = window.setTimeout(() => o((l) => l === "in" ? "out" : "in"), Math.max(1, d) * 1e3);
    return () => window.clearTimeout(u);
  }, [c, d, e, t]), /* @__PURE__ */ a("div", { className: "c-stage", "data-testid": "breath-ring", "data-still": e ? "true" : "false", children: [
    /* @__PURE__ */ n("span", { className: "c-ring", style: { transform: `scale(${e || !t ? 0.9 : c === "in" ? 1 : 0.78})`, transition: e ? "none" : `transform ${d}s ease-in-out` }, "aria-hidden": "true" }),
    /* @__PURE__ */ n(N, { fallback: null, children: /* @__PURE__ */ n(I, { mood: t ? "breathing" : "idle", size: 120, reducedMotion: e }) })
  ] });
}
function R({ player: e, snap: t, still: r, favorite: s, onToggle: c, onFavorite: o, nature: d }) {
  const [m, u] = f(!1), l = C.find((h) => h.templateId === t.templateId), p = (l == null ? void 0 : l.evidence) ?? "mixed";
  return /* @__PURE__ */ a("div", { className: "c-player", children: [
    /* @__PURE__ */ n("h1", { className: "c-h1", children: t.templateName ?? i.brand }),
    /* @__PURE__ */ n(_, { still: r, playing: t.playing }),
    r && /* @__PURE__ */ n("p", { className: "c-muted", children: i.breathe }),
    /* @__PURE__ */ a("div", { className: "c-controls", children: [
      /* @__PURE__ */ n("button", { type: "button", className: "c-btn c-round c-big", "data-testid": "player-toggle", onClick: c, children: t.playing ? i.stop : i.play }),
      /* @__PURE__ */ n("button", { type: "button", className: "c-btn c-round", "aria-pressed": s, onClick: o, children: s ? i.saved : i.favorite })
    ] }),
    /* @__PURE__ */ n(M, { timer: t.timer, player: e }),
    /* @__PURE__ */ n($, { nature: d }),
    /* @__PURE__ */ n("p", { className: "c-muted", children: i.volumeCapped }),
    /* @__PURE__ */ a("section", { className: "c-why", children: [
      /* @__PURE__ */ n("button", { type: "button", className: "c-btn c-link", "aria-expanded": m, "aria-controls": "c-why-box", onClick: () => u((h) => !h), children: i.whyTitle }),
      /* @__PURE__ */ a("div", { id: "c-why-box", hidden: !m, children: [
        /* @__PURE__ */ n("p", { children: i.whyBody }),
        /* @__PURE__ */ n("p", { children: `Evidence: ${p}. ${w[p] ?? ""}` })
      ] })
    ] })
  ] });
}
function $({ nature: e }) {
  const t = e.prefs.id ?? g().id ?? "rain";
  return /* @__PURE__ */ a("section", { className: "c-card c-nature-quick", "aria-label": i.natureHead, children: [
    /* @__PURE__ */ n("button", { type: "button", className: "c-btn", "data-testid": "player-nature", "aria-pressed": e.on !== null, onClick: () => e.on === null ? e.start(t) : e.stop(), children: e.on === null ? `${i.natureAdd}: ${t.startsWith("own:") ? i.mineTitle : t}` : i.natureOff }),
    e.on !== null && /* @__PURE__ */ n(E, { nature: e }),
    /* @__PURE__ */ n("p", { className: "c-status", role: "status", children: e.message })
  ] });
}
export {
  _ as BreathRing,
  R as PlayerScreen
};
