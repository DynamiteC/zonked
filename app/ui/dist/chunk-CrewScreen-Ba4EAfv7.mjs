import { jsxs as r, jsx as t } from "react/jsx-runtime";
import { useState as f, useEffect as y, useRef as x } from "react";
import { C as e, Y as S, Z as M, _ as k, R as C } from "./chunk-crewLink-uOIAoAgB.mjs";
const D = ["Fresh", "Warming up", e.crewBreak];
function v(c) {
  return c === null || !Number.isFinite(c) || c < 40 ? 0 : c < 60 ? 1 : 2;
}
function A(c) {
  const [s, n] = f(() => Date.now());
  return y(() => {
    if (!c) return;
    n(Date.now());
    const d = window.setInterval(() => n(Date.now()), 1e3);
    return () => window.clearInterval(d);
  }, [c]), s;
}
const g = (c) => new Date(c).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
function E(c, s) {
  var n;
  if (c.source === "demo" && c.demoNextAtMs !== null) {
    const d = Math.max(0, Math.ceil((c.demoNextAtMs - s) / 1e3));
    return ((n = c.state) == null ? void 0 : n.burnout.level) === "decompress" ? e.crewNextDemoLast(d) : e.crewNextDemo(d);
  }
  return c.changedAtMs === 0 ? e.crewNextWait : e.crewNextReal(g(Math.max(s, c.changedAtMs + k)));
}
function F({ view: c, overridden: s, onNotNow: n, onResume: d, onFollow: w, onStopDemo: N }) {
  const h = A(c.state !== null), l = c.state;
  if (l === null) return null;
  const a = c.source === "demo", i = !a && h < c.snoozeUntilMs, m = a ? e.crewDemoBadge : i ? e.crewPaused(g(c.snoozeUntilMs)) : e.crewFollowing, o = v(l.burnout.score), u = !a && s && !i;
  return /* @__PURE__ */ r("div", { "data-testid": "crew-panel", children: [
    /* @__PURE__ */ t("p", { className: "c-status", role: "status", "data-testid": "crew-status", children: m }),
    /* @__PURE__ */ r("dl", { className: "c-stats", children: [
      /* @__PURE__ */ r("div", { children: [
        /* @__PURE__ */ t("dt", { children: e.crewScore }),
        /* @__PURE__ */ t("dd", { "data-testid": "crew-score", children: Math.round(l.burnout.score) })
      ] }),
      /* @__PURE__ */ r("div", { children: [
        /* @__PURE__ */ t("dt", { children: e.crewBeat }),
        /* @__PURE__ */ t("dd", { "data-testid": "crew-beat", children: `${S(l.target.beatHz)} Hz` })
      ] })
    ] }),
    /* @__PURE__ */ t("p", { className: "c-muted", "data-testid": "crew-beat-hint", children: e.crewBeatHint }),
    /* @__PURE__ */ r("section", { "aria-labelledby": "c-why-h", className: "c-why", children: [
      /* @__PURE__ */ t("h2", { id: "c-why-h", className: "c-h3", children: e.crewWhyTitle }),
      /* @__PURE__ */ t("p", { "data-testid": "crew-why", children: M(l) })
    ] }),
    /* @__PURE__ */ t("ol", { className: "c-meter", "aria-label": "Session load", children: D.map((p, b) => /* @__PURE__ */ t("li", { className: b === o ? "c-seg c-on" : "c-seg", "aria-current": b === o ? "step" : void 0, children: p }, p)) }),
    /* @__PURE__ */ r("p", { className: "c-next", "data-testid": "crew-next", children: [
      /* @__PURE__ */ t("b", { children: `${e.crewNext}: ` }),
      E(c, h)
    ] }),
    /* @__PURE__ */ r("div", { className: "c-actions c-row", children: [
      a ? /* @__PURE__ */ t("button", { type: "button", className: "c-btn", "data-testid": "crew-demo-stop", onClick: N, children: e.crewDemoStop }) : i ? /* @__PURE__ */ t("button", { type: "button", className: "c-btn", "data-testid": "crew-resume", onClick: d, children: e.crewFollowAgain }) : /* @__PURE__ */ t("button", { type: "button", className: "c-btn", "data-testid": "crew-not-now", onClick: n, children: e.crewNotNow }),
      u && /* @__PURE__ */ t("button", { type: "button", className: "c-btn c-link", "data-testid": "crew-follow", onClick: w, children: e.crewFollowNow })
    ] }),
    u && /* @__PURE__ */ t("p", { className: "c-muted", children: e.crewOverridden }),
    /* @__PURE__ */ t("p", { className: "c-muted", "data-testid": "crew-reads", children: e.crewReads })
  ] });
}
function H({ crew: c, overridden: s, onDemo: n, onStopDemo: d, onNotNow: w, onResume: N, onFollow: h }) {
  const l = c.view.state !== null, a = c.view.source === "demo", [i, m] = f(!1), o = x(!1);
  return y(() => {
    o.current && !a && m(!0), a && m(!1), o.current = a;
  }, [a]), /* @__PURE__ */ r("div", { children: [
    /* @__PURE__ */ t("h1", { className: "c-h1", children: e.crewTitle }),
    /* @__PURE__ */ t("p", { className: "c-lead", children: e.crewIntro }),
    /* @__PURE__ */ r("label", { className: "c-switch", children: [
      /* @__PURE__ */ t("input", { type: "checkbox", role: "switch", "data-testid": "calm-crew-toggle", checked: c.enabled || a, disabled: a, "aria-describedby": a ? "c-crew-demo-note" : void 0, onChange: (u) => C(u.currentTarget.checked) }),
      /* @__PURE__ */ t("span", { className: "c-track", "aria-hidden": "true" }),
      /* @__PURE__ */ t("span", { children: a ? e.demoSteering : e.crewSwitch })
    ] }),
    a && /* @__PURE__ */ t("p", { id: "c-crew-demo-note", className: "c-muted", "data-testid": "crew-demo-note", children: e.demoSteeringHint }),
    l ? /* @__PURE__ */ t(F, { view: c.view, overridden: s, onNotNow: w, onResume: N, onFollow: h, onStopDemo: d }) : /* @__PURE__ */ r("div", { "data-testid": "crew-why-off", children: [
      /* @__PURE__ */ t("p", { className: "c-status", role: "status", "data-testid": "crew-status", children: i ? e.crewDemoEnd : e.crewOff }),
      /* @__PURE__ */ t("p", { className: "c-why-off", children: c.enabled ? e.crewDisabled : e.crewWhyOff }),
      /* @__PURE__ */ r("ol", { className: "c-steps", children: [
        /* @__PURE__ */ t("li", { children: e.crewStep1 }),
        /* @__PURE__ */ t("li", { children: e.crewStep2 })
      ] }),
      /* @__PURE__ */ t("p", { className: "c-note", children: e.crewOptional })
    ] }),
    !a && /* @__PURE__ */ r("div", { className: "c-demo", children: [
      /* @__PURE__ */ t("button", { type: "button", className: l ? "c-btn" : "c-btn c-primary", "data-testid": "crew-demo", onClick: n, children: e.crewDemo }),
      /* @__PURE__ */ t("p", { className: "c-muted", children: e.crewDemoHint })
    ] }),
    /* @__PURE__ */ t("p", { className: "c-muted", children: e.crewPrivacy })
  ] });
}
export {
  H as CrewScreen,
  v as meterStep
};
