import { jsx as a, jsxs as p } from "react/jsx-runtime";
import { useState as l, useEffect as r } from "react";
import { e as k, h as w, a as C, b as y, j as S, k as N, l as O, m as L, i as o, C as t, p as P } from "./chunk-crewLink-Cq0htOCx.mjs";
import { q as $, r as q } from "./chunk-crewLink-Cq0htOCx.mjs";
function x(e) {
  const n = e.timer;
  return n.kind !== "countdown" || !n.running ? null : Math.ceil(n.remainingSec / 60);
}
function v(e) {
  const n = x(e);
  return e.playing ? n === null ? t.panelPlaying : `${t.panelPlaying} About ${String(n)} min left.` : o() ? e.templateId === null ? t.panelPickFirst : t.panelStopped : t.panelOpenFirst;
}
function F() {
  k(import.meta.url), w();
  const { player: e } = C(), [n, d] = l(y), [u, m] = l(S), [h, f] = l(N);
  r(() => O(m), []), r(() => L(f), []);
  const [s, i] = l(() => e.snapshot());
  r(() => (i(e.snapshot()), e.subscribe(i)), [e]);
  const g = o() && s.templateId !== null, b = n ? u === "connected" ? t.panelCrewOn : t.panelCrewLost : t.panelCrewOff;
  return /* @__PURE__ */ a("div", { className: "c-app c-panel", "data-testid": "zonked-panel", "data-theme": "auto", children: /* @__PURE__ */ p("div", { className: "c-card", children: [
    /* @__PURE__ */ a("strong", { "data-testid": "panel-title", children: s.templateName ?? t.brand }),
    /* @__PURE__ */ a("p", { className: "c-muted", "data-testid": "panel-hint", role: "status", children: v(s) }),
    h ? null : s.playing ? /* @__PURE__ */ a("button", { type: "button", className: "c-btn c-small", "data-testid": "panel-stop", onClick: () => void e.stop(), children: t.stop }) : /* @__PURE__ */ a("button", { type: "button", className: "c-btn c-small", "data-testid": "panel-play", disabled: !g, onClick: () => void e.play(), children: t.play }),
    /* @__PURE__ */ p("label", { className: "c-switch", children: [
      /* @__PURE__ */ a(
        "input",
        {
          type: "checkbox",
          role: "switch",
          "data-testid": "panel-crew",
          checked: n,
          onChange: (c) => {
            d(c.target.checked), P(c.target.checked);
          }
        }
      ),
      /* @__PURE__ */ a("span", { className: "c-track", "aria-hidden": "true" }),
      /* @__PURE__ */ a("span", { children: t.panelCrewLabel })
    ] }),
    /* @__PURE__ */ a("p", { className: "c-muted", "data-testid": "panel-crew-status", role: "status", children: b })
  ] }) });
}
export {
  F as default,
  $ as engineState,
  q as engineStats
};
