import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { C as t, J as y, K as x, L as g, A as M } from "./chunk-crewLink-BQ1FLTqp.mjs";
import { useState as S, useEffect as k } from "react";
const C = ["Fresh", "Warming up", t.crewBreak];
function D(c) {
  return c === null || !Number.isFinite(c) || c < 40 ? 0 : c < 60 ? 1 : 2;
}
function v(c) {
  const [n, r] = S(() => Date.now());
  return k(() => {
    if (!c) return;
    r(Date.now());
    const s = window.setInterval(() => r(Date.now()), 1e3);
    return () => window.clearInterval(s);
  }, [c]), n;
}
const b = (c) => new Date(c).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
function A(c, n) {
  var r;
  if (c.source === "demo" && c.demoNextAtMs !== null) {
    const s = Math.max(0, Math.ceil((c.demoNextAtMs - n) / 1e3));
    return ((r = c.state) == null ? void 0 : r.burnout.level) === "decompress" ? t.crewNextDemoLast(s) : t.crewNextDemo(s);
  }
  return c.changedAtMs === 0 ? t.crewNextWait : t.crewNextReal(b(Math.max(n, c.changedAtMs + g)));
}
function F({ view: c, overridden: n, onNotNow: r, onResume: s, onFollow: i, onStopDemo: w }) {
  const h = v(c.state !== null), l = c.state;
  if (l === null) return null;
  const d = c.source === "demo", o = !d && h < c.snoozeUntilMs, f = d ? t.crewDemoBadge : o ? t.crewPaused(b(c.snoozeUntilMs)) : t.crewFollowing, u = D(l.burnout.score), m = !d && n && !o;
  return /* @__PURE__ */ a("div", { "data-testid": "crew-panel", children: [
    /* @__PURE__ */ e("p", { className: "c-status", role: "status", "data-testid": "crew-status", children: f }),
    /* @__PURE__ */ a("dl", { className: "c-stats", children: [
      /* @__PURE__ */ a("div", { children: [
        /* @__PURE__ */ e("dt", { children: t.crewScore }),
        /* @__PURE__ */ e("dd", { "data-testid": "crew-score", children: Math.round(l.burnout.score) })
      ] }),
      /* @__PURE__ */ a("div", { children: [
        /* @__PURE__ */ e("dt", { children: t.crewBeat }),
        /* @__PURE__ */ e("dd", { "data-testid": "crew-beat", children: `${y(l.target.beatHz)} Hz` })
      ] })
    ] }),
    /* @__PURE__ */ e("ol", { className: "c-meter", "aria-label": "Session load", children: C.map((N, p) => /* @__PURE__ */ e("li", { className: p === u ? "c-seg c-on" : "c-seg", "aria-current": p === u ? "step" : void 0, children: N }, N)) }),
    /* @__PURE__ */ a("p", { className: "c-next", "data-testid": "crew-next", children: [
      /* @__PURE__ */ e("b", { children: `${t.crewNext}: ` }),
      A(c, h)
    ] }),
    /* @__PURE__ */ a("section", { "aria-labelledby": "c-why-h", className: "c-why", children: [
      /* @__PURE__ */ e("h2", { id: "c-why-h", className: "c-h3", children: t.crewWhyTitle }),
      /* @__PURE__ */ e("p", { "data-testid": "crew-why", children: x(l) })
    ] }),
    /* @__PURE__ */ a("div", { className: "c-actions c-row", children: [
      d ? /* @__PURE__ */ e("button", { type: "button", className: "c-btn", "data-testid": "crew-demo-stop", onClick: w, children: t.crewDemoStop }) : o ? /* @__PURE__ */ e("button", { type: "button", className: "c-btn", "data-testid": "crew-resume", onClick: s, children: t.crewFollowAgain }) : /* @__PURE__ */ e("button", { type: "button", className: "c-btn", "data-testid": "crew-not-now", onClick: r, children: t.crewNotNow }),
      m && /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", "data-testid": "crew-follow", onClick: i, children: t.crewFollowNow })
    ] }),
    m && /* @__PURE__ */ e("p", { className: "c-muted", children: t.crewOverridden }),
    /* @__PURE__ */ e("p", { className: "c-muted", "data-testid": "crew-reads", children: t.crewReads })
  ] });
}
function L({ crew: c, overridden: n, onDemo: r, onStopDemo: s, onNotNow: i, onResume: w, onFollow: h }) {
  const l = c.view.state !== null, d = c.view.source === "demo";
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ e("h1", { className: "c-h1", children: t.crewTitle }),
    /* @__PURE__ */ e("p", { className: "c-lead", children: t.crewIntro }),
    /* @__PURE__ */ a("label", { className: "c-switch", children: [
      /* @__PURE__ */ e("input", { type: "checkbox", role: "switch", "data-testid": "calm-crew-toggle", checked: c.enabled, onChange: (o) => M(o.currentTarget.checked) }),
      /* @__PURE__ */ e("span", { className: "c-track", "aria-hidden": "true" }),
      /* @__PURE__ */ e("span", { children: t.crewSwitch })
    ] }),
    l ? /* @__PURE__ */ e(F, { view: c.view, overridden: n, onNotNow: i, onResume: w, onFollow: h, onStopDemo: s }) : /* @__PURE__ */ a("div", { "data-testid": "crew-why-off", children: [
      /* @__PURE__ */ e("p", { className: "c-status", role: "status", "data-testid": "crew-status", children: t.crewOff }),
      /* @__PURE__ */ e("p", { className: "c-why-off", children: c.enabled ? t.crewDisabled : t.crewWhyOff }),
      /* @__PURE__ */ a("ol", { className: "c-steps", children: [
        /* @__PURE__ */ e("li", { children: t.crewStep1 }),
        /* @__PURE__ */ e("li", { children: t.crewStep2 })
      ] }),
      /* @__PURE__ */ e("p", { className: "c-note", children: t.crewOptional })
    ] }),
    !d && /* @__PURE__ */ a("div", { className: "c-demo", children: [
      /* @__PURE__ */ e("button", { type: "button", className: l ? "c-btn" : "c-btn c-primary", "data-testid": "crew-demo", onClick: r, children: t.crewDemo }),
      /* @__PURE__ */ e("p", { className: "c-muted", children: t.crewDemoHint })
    ] }),
    /* @__PURE__ */ e("p", { className: "c-muted", children: t.crewPrivacy })
  ] });
}
export {
  L as CrewScreen,
  D as meterStep
};
