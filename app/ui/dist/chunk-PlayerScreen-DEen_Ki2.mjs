import { jsxs as l, jsx as t, Fragment as g } from "react/jsx-runtime";
import { useState as N, useEffect as w, Suspense as v, lazy as p } from "react";
import { f as S, b as E, d as x, l as M } from "./chunk-App-ikZzyVmD.mjs";
import { C as i, E as L } from "./chunk-crewLink-Br6qeo5M.mjs";
import { u as T } from "./chunk-useBreath-g1tM8NNc.mjs";
import { NatureControls as I } from "./chunk-NatureScreen-D8F4LJsu.mjs";
const P = 20;
function F(e) {
  if (e.kind === "sleep-fade") return 4;
  if (e.kind !== "countdown") return 3;
  const n = Math.round(e.totalSec / 60);
  return n === 15 ? 0 : n === 30 ? 1 : n === 60 ? 2 : -1;
}
function B({ timer: e, player: n }) {
  const s = (c) => {
    c <= 2 ? n.startTimer({ kind: "countdown", minutes: [15, 30, 60][c] ?? 15 }) : c === 3 ? n.stopTimer() : n.startTimer({ kind: "sleep-fade", minutes: P });
  }, a = F(e);
  return /* @__PURE__ */ l("div", { children: [
    /* @__PURE__ */ t("div", { className: "c-chips", role: "radiogroup", "aria-label": "Timer", children: i.timerChips.map((c, r) => /* @__PURE__ */ t("button", { type: "button", role: "radio", "aria-checked": a === r, className: "c-tchip", onClick: () => s(r), children: c }, c)) }),
    e.kind !== "none" && e.running && /* @__PURE__ */ t("p", { className: "c-time", "data-testid": "time-left", children: S(e.remainingSec) })
  ] });
}
const O = ["cant-sleep", "lucid-dream"], _ = ["adhd-focus", "deep-work", "ai-burnout"];
function $(e, n) {
  if (n) return "nature";
  const s = e === null ? void 0 : E().find((c) => c.id === e), a = (s == null ? void 0 : s.situations) ?? [];
  return a.some((c) => O.includes(c)) ? "sleep" : a.some((c) => _.includes(c)) ? "focus" : "calm";
}
const A = 400;
function D(e, n) {
  const [s, a] = N(0);
  return w(() => {
    if (!n) {
      a(0);
      return;
    }
    let c = !0;
    const r = window.setInterval(() => {
      e.getStats().then((o) => {
        const u = Number.isFinite(o.rms) ? Math.min(1, Math.max(0, o.rms * 4)) : 0;
        c && a((d) => d * 0.6 + u * 0.4);
      }).catch(() => {
      });
    }, A);
    return () => {
      c = !1, window.clearInterval(r);
    };
  }, [e, n]), s;
}
const U = p(() => import("./chunk-mascot-BnpJf37G.mjs").then((e) => ({ default: e.CalmMascot }))), j = p(() => import("./chunk-visuals-C5gzaUuH.mjs").then((e) => ({ default: e.SceneLoop }))), z = p(() => import("./chunk-mascot-BnpJf37G.mjs").then((e) => ({ default: e.BreathCue })));
function W({ still: e, playing: n, situation: s, theme: a, level: c }) {
  const r = T(n && !e), o = n && !e;
  return /* @__PURE__ */ l(g, { children: [
    /* @__PURE__ */ t("div", { className: "c-stage", "data-testid": "breath-ring", "data-still": e ? "true" : "false", "data-situation": s, children: /* @__PURE__ */ l(v, { fallback: null, children: [
      /* @__PURE__ */ t("div", { className: "c-stage-scene", children: /* @__PURE__ */ t(j, { situation: s, reducedMotion: e, theme: a }) }),
      /* @__PURE__ */ t("div", { className: "c-stage-mascot", children: /* @__PURE__ */ t(
        U,
        {
          mood: n ? "breathing" : "idle",
          size: 190,
          reducedMotion: e,
          situation: s,
          breathPhase: o ? r.phase : void 0,
          level: n ? c : 0
        }
      ) })
    ] }) }),
    /* @__PURE__ */ t("div", { className: "c-cue", children: o ? /* @__PURE__ */ t(v, { fallback: null, children: /* @__PURE__ */ t(z, { label: r.label, className: "c-cue-text" }) }) : /* @__PURE__ */ t("p", { className: "c-cue-text", children: i.breathe }) })
  ] });
}
function R({ engine: e, theme: n, player: s, snap: a, still: c, favorite: r, onToggle: o, onFavorite: u, nature: d }) {
  const [f, k] = N(!1), C = D(e, a.playing), m = x.find((h) => h.templateId === a.templateId), b = (m == null ? void 0 : m.evidence) ?? "mixed", y = $(a.templateId, d.on !== null);
  return /* @__PURE__ */ l("div", { className: "c-player", children: [
    /* @__PURE__ */ t("h1", { className: "c-h1", children: a.templateName ?? i.brand }),
    /* @__PURE__ */ t(W, { still: c, playing: a.playing, situation: y, theme: n, level: C }),
    /* @__PURE__ */ l("div", { className: "c-controls", children: [
      /* @__PURE__ */ t("button", { type: "button", className: "c-btn c-round c-big", "data-testid": "player-toggle", onClick: o, children: a.playing ? i.stop : i.play }),
      /* @__PURE__ */ t("button", { type: "button", className: "c-btn c-round", "aria-pressed": r, onClick: u, children: r ? i.saved : i.favorite })
    ] }),
    /* @__PURE__ */ t(B, { timer: a.timer, player: s }),
    /* @__PURE__ */ t(q, { nature: d }),
    /* @__PURE__ */ t("p", { className: "c-muted", children: i.volumeCapped }),
    /* @__PURE__ */ l("section", { className: "c-why", children: [
      /* @__PURE__ */ t("button", { type: "button", className: "c-btn c-link", "aria-expanded": f, "aria-controls": "c-why-box", onClick: () => k((h) => !h), children: i.whyTitle }),
      /* @__PURE__ */ l("div", { id: "c-why-box", hidden: !f, children: [
        /* @__PURE__ */ t("p", { children: i.whyBody }),
        /* @__PURE__ */ t("p", { children: `Evidence: ${b}. ${L[b] ?? ""}` })
      ] })
    ] })
  ] });
}
function q({ nature: e }) {
  const n = e.prefs.id ?? M().id ?? "rain";
  return /* @__PURE__ */ l("section", { className: "c-card c-nature-quick", "aria-label": i.natureHead, children: [
    /* @__PURE__ */ t("button", { type: "button", className: "c-btn", "data-testid": "player-nature", "aria-pressed": e.on !== null, onClick: () => e.on === null ? e.start(n) : e.stop(), children: e.on === null ? `${i.natureAdd}: ${n.startsWith("own:") ? i.mineTitle : n}` : i.natureOff }),
    e.on !== null && /* @__PURE__ */ t(I, { nature: e }),
    /* @__PURE__ */ t("p", { className: "c-status", role: "status", children: e.message })
  ] });
}
export {
  R as PlayerScreen,
  W as Stage
};
