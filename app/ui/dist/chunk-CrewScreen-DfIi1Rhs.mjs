import { jsxs as a, jsx as t } from "react/jsx-runtime";
import { C as e, W as y, X as g, Y as x, O as S } from "./chunk-crewLink-CGwtdNl8.mjs";
import { useState as M, useEffect as k } from "react";
const C = ["Fresh", "Warming up", e.crewBreak];
function D(c) {
  return c === null || !Number.isFinite(c) || c < 40 ? 0 : c < 60 ? 1 : 2;
}
function v(c) {
  const [s, n] = M(() => Date.now());
  return k(() => {
    if (!c) return;
    n(Date.now());
    const d = window.setInterval(() => n(Date.now()), 1e3);
    return () => window.clearInterval(d);
  }, [c]), s;
}
const b = (c) => new Date(c).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
function A(c, s) {
  var n;
  if (c.source === "demo" && c.demoNextAtMs !== null) {
    const d = Math.max(0, Math.ceil((c.demoNextAtMs - s) / 1e3));
    return ((n = c.state) == null ? void 0 : n.burnout.level) === "decompress" ? e.crewNextDemoLast(d) : e.crewNextDemo(d);
  }
  return c.changedAtMs === 0 ? e.crewNextWait : e.crewNextReal(b(Math.max(s, c.changedAtMs + x)));
}
function W({ view: c, overridden: s, onNotNow: n, onResume: d, onFollow: o, onStopDemo: m }) {
  const h = v(c.state !== null), l = c.state;
  if (l === null) return null;
  const r = c.source === "demo", i = !r && h < c.snoozeUntilMs, f = r ? e.crewDemoBadge : i ? e.crewPaused(b(c.snoozeUntilMs)) : e.crewFollowing, w = D(l.burnout.score), u = !r && s && !i;
  return /* @__PURE__ */ a("div", { "data-testid": "crew-panel", children: [
    /* @__PURE__ */ t("p", { className: "c-status", role: "status", "data-testid": "crew-status", children: f }),
    /* @__PURE__ */ a("dl", { className: "c-stats", children: [
      /* @__PURE__ */ a("div", { children: [
        /* @__PURE__ */ t("dt", { children: e.crewScore }),
        /* @__PURE__ */ t("dd", { "data-testid": "crew-score", children: Math.round(l.burnout.score) })
      ] }),
      /* @__PURE__ */ a("div", { children: [
        /* @__PURE__ */ t("dt", { children: e.crewBeat }),
        /* @__PURE__ */ t("dd", { "data-testid": "crew-beat", children: `${y(l.target.beatHz)} Hz` })
      ] })
    ] }),
    /* @__PURE__ */ t("p", { className: "c-muted", "data-testid": "crew-beat-hint", children: e.crewBeatHint }),
    /* @__PURE__ */ t("ol", { className: "c-meter", "aria-label": "Session load", children: C.map((N, p) => /* @__PURE__ */ t("li", { className: p === w ? "c-seg c-on" : "c-seg", "aria-current": p === w ? "step" : void 0, children: N }, N)) }),
    /* @__PURE__ */ a("p", { className: "c-next", "data-testid": "crew-next", children: [
      /* @__PURE__ */ t("b", { children: `${e.crewNext}: ` }),
      A(c, h)
    ] }),
    /* @__PURE__ */ a("section", { "aria-labelledby": "c-why-h", className: "c-why", children: [
      /* @__PURE__ */ t("h2", { id: "c-why-h", className: "c-h3", children: e.crewWhyTitle }),
      /* @__PURE__ */ t("p", { "data-testid": "crew-why", children: g(l) })
    ] }),
    /* @__PURE__ */ a("div", { className: "c-actions c-row", children: [
      r ? /* @__PURE__ */ t("button", { type: "button", className: "c-btn", "data-testid": "crew-demo-stop", onClick: m, children: e.crewDemoStop }) : i ? /* @__PURE__ */ t("button", { type: "button", className: "c-btn", "data-testid": "crew-resume", onClick: d, children: e.crewFollowAgain }) : /* @__PURE__ */ t("button", { type: "button", className: "c-btn", "data-testid": "crew-not-now", onClick: n, children: e.crewNotNow }),
      u && /* @__PURE__ */ t("button", { type: "button", className: "c-btn c-link", "data-testid": "crew-follow", onClick: o, children: e.crewFollowNow })
    ] }),
    u && /* @__PURE__ */ t("p", { className: "c-muted", children: e.crewOverridden }),
    /* @__PURE__ */ t("p", { className: "c-muted", "data-testid": "crew-reads", children: e.crewReads })
  ] });
}
function H({ crew: c, overridden: s, onDemo: n, onStopDemo: d, onNotNow: o, onResume: m, onFollow: h }) {
  const l = c.view.state !== null, r = c.view.source === "demo";
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ t("h1", { className: "c-h1", children: e.crewTitle }),
    /* @__PURE__ */ t("p", { className: "c-lead", children: e.crewIntro }),
    /* @__PURE__ */ a("label", { className: "c-switch", children: [
      /* @__PURE__ */ t("input", { type: "checkbox", role: "switch", "data-testid": "calm-crew-toggle", checked: c.enabled || r, disabled: r, "aria-describedby": r ? "c-crew-demo-note" : void 0, onChange: (i) => S(i.currentTarget.checked) }),
      /* @__PURE__ */ t("span", { className: "c-track", "aria-hidden": "true" }),
      /* @__PURE__ */ t("span", { children: r ? e.demoSteering : e.crewSwitch })
    ] }),
    r && /* @__PURE__ */ t("p", { id: "c-crew-demo-note", className: "c-muted", "data-testid": "crew-demo-note", children: e.demoSteeringHint }),
    l ? /* @__PURE__ */ t(W, { view: c.view, overridden: s, onNotNow: o, onResume: m, onFollow: h, onStopDemo: d }) : /* @__PURE__ */ a("div", { "data-testid": "crew-why-off", children: [
      /* @__PURE__ */ t("p", { className: "c-status", role: "status", "data-testid": "crew-status", children: e.crewOff }),
      /* @__PURE__ */ t("p", { className: "c-why-off", children: c.enabled ? e.crewDisabled : e.crewWhyOff }),
      /* @__PURE__ */ a("ol", { className: "c-steps", children: [
        /* @__PURE__ */ t("li", { children: e.crewStep1 }),
        /* @__PURE__ */ t("li", { children: e.crewStep2 })
      ] }),
      /* @__PURE__ */ t("p", { className: "c-note", children: e.crewOptional })
    ] }),
    !r && /* @__PURE__ */ a("div", { className: "c-demo", children: [
      /* @__PURE__ */ t("button", { type: "button", className: l ? "c-btn" : "c-btn c-primary", "data-testid": "crew-demo", onClick: n, children: e.crewDemo }),
      /* @__PURE__ */ t("p", { className: "c-muted", children: e.crewDemoHint })
    ] }),
    /* @__PURE__ */ t("p", { className: "c-muted", children: e.crewPrivacy })
  ] });
}
export {
  H as CrewScreen,
  D as meterStep
};
