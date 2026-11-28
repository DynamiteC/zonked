import { useEffect as e, useRef as t, useState as n } from "react";
import { F as r, Y as i, c as a, it as o, nt as s } from "./chunk-crewLink-DfIjAvPP.mjs";
import { n as c } from "./chunk-FormFrame-DeBPfgdj.mjs";
import { jsx as l, jsxs as u } from "react/jsx-runtime";
// ../../web/src/ui/calm/CrewPanel.tsx
var d = [
	"Fresh",
	"Warming up",
	i.crewBreak
];
function f(e) {
	return e === null || !Number.isFinite(e) || e < 40 ? 0 : e < 60 ? 1 : 2;
}
function p(t) {
	let [r, i] = n(() => Date.now());
	return e(() => {
		if (!t) return;
		i(Date.now());
		let e = window.setInterval(() => i(Date.now()), 1e3);
		return () => window.clearInterval(e);
	}, [t]), r;
}
var m = (e) => new Date(e).toLocaleTimeString([], {
	hour: "2-digit",
	minute: "2-digit"
});
function h(e, t) {
	if (e.source === "demo" && e.demoNextAtMs !== null) {
		let n = Math.max(0, Math.ceil((e.demoNextAtMs - t) / 1e3));
		return e.state?.burnout.level === "decompress" ? i.crewNextDemoLast(n) : i.crewNextDemo(n);
	}
	return e.changedAtMs === 0 ? i.crewNextWait : i.crewNextReal(m(Math.max(t, e.changedAtMs + r)));
}
function g({ view: e, overridden: t, onNotNow: n, onResume: r, onFollow: a, onStopDemo: c }) {
	let g = p(e.state !== null), _ = e.state;
	if (_ === null) return null;
	let v = e.source === "demo", y = !v && g < e.snoozeUntilMs, b = v ? i.crewDemoBadge : y ? i.crewPaused(m(e.snoozeUntilMs)) : i.crewFollowing, x = f(_.burnout.score), S = !v && t && !y;
	return /* @__PURE__ */ u("div", {
		"data-testid": "crew-panel",
		children: [
			/* @__PURE__ */ l("p", {
				className: "c-status",
				role: "status",
				"data-testid": "crew-status",
				children: b
			}),
			/* @__PURE__ */ u("dl", {
				className: "c-stats",
				children: [/* @__PURE__ */ u("div", { children: [/* @__PURE__ */ l("dt", { children: i.crewScore }), /* @__PURE__ */ l("dd", {
					"data-testid": "crew-score",
					children: Math.round(_.burnout.score)
				})] }), /* @__PURE__ */ u("div", { children: [/* @__PURE__ */ l("dt", { children: i.crewBeat }), /* @__PURE__ */ l("dd", {
					"data-testid": "crew-beat",
					children: `${o(_.target.beatHz)} Hz`
				})] })]
			}),
			/* @__PURE__ */ l("p", {
				className: "c-muted",
				"data-testid": "crew-beat-hint",
				children: i.crewBeatHint
			}),
			/* @__PURE__ */ u("section", {
				"aria-labelledby": "c-why-h",
				className: "c-why",
				children: [/* @__PURE__ */ l("h2", {
					id: "c-why-h",
					className: "c-h3",
					children: i.crewWhyTitle
				}), /* @__PURE__ */ l("p", {
					"data-testid": "crew-why",
					children: s(_)
				})]
			}),
			/* @__PURE__ */ l("ol", {
				className: "c-meter",
				"aria-label": "Session load",
				children: d.map((e, t) => /* @__PURE__ */ l("li", {
					className: t === x ? "c-seg c-on" : "c-seg",
					"aria-current": t === x ? "step" : void 0,
					children: e
				}, e))
			}),
			/* @__PURE__ */ u("p", {
				className: "c-next",
				"data-testid": "crew-next",
				children: [/* @__PURE__ */ l("b", { children: `${i.crewNext}: ` }), h(e, g)]
			}),
			/* @__PURE__ */ u("div", {
				className: "c-actions c-row",
				children: [v ? /* @__PURE__ */ l("button", {
					type: "button",
					className: "c-btn",
					"data-testid": "crew-demo-stop",
					onClick: c,
					children: i.crewDemoStop
				}) : y ? /* @__PURE__ */ l("button", {
					type: "button",
					className: "c-btn",
					"data-testid": "crew-resume",
					onClick: r,
					children: i.crewFollowAgain
				}) : /* @__PURE__ */ l("button", {
					type: "button",
					className: "c-btn",
					"data-testid": "crew-not-now",
					onClick: n,
					children: i.crewNotNow
				}), S && /* @__PURE__ */ l("button", {
					type: "button",
					className: "c-btn c-link",
					"data-testid": "crew-follow",
					onClick: a,
					children: i.crewFollowNow
				})]
			}),
			S && /* @__PURE__ */ l("p", {
				className: "c-muted",
				children: i.crewOverridden
			}),
			/* @__PURE__ */ l("p", {
				className: "c-muted",
				"data-testid": "crew-reads",
				children: i.crewReads
			})
		]
	});
}
// ../../web/src/ui/calm/CrewScreen.tsx
function _({ crew: r, overridden: o, onDemo: s, onStopDemo: d, onNotNow: f, onResume: p, onFollow: m }) {
	let h = r.view.state !== null, _ = r.view.source === "demo", [v, y] = n(!1), b = t(!1);
	return e(() => {
		b.current && !_ && y(!0), _ && y(!1), b.current = _;
	}, [_]), /* @__PURE__ */ u("div", { children: [
		/* @__PURE__ */ l("h1", {
			className: "c-h1",
			children: i.crewTitle
		}),
		/* @__PURE__ */ l("p", {
			className: "c-lead",
			children: i.crewIntro
		}),
		/* @__PURE__ */ u("label", {
			className: "c-switch",
			children: [
				/* @__PURE__ */ l("input", {
					type: "checkbox",
					role: "switch",
					"data-testid": "calm-crew-toggle",
					checked: r.enabled || _,
					disabled: _,
					"aria-describedby": _ ? "c-crew-demo-note" : void 0,
					onChange: (e) => a(e.currentTarget.checked)
				}),
				/* @__PURE__ */ l("span", {
					className: "c-track",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ l("span", { children: _ ? i.demoSteering : i.crewSwitch })
			]
		}),
		_ && /* @__PURE__ */ l("p", {
			id: "c-crew-demo-note",
			className: "c-muted",
			"data-testid": "crew-demo-note",
			children: i.demoSteeringHint
		}),
		h ? /* @__PURE__ */ l(g, {
			view: r.view,
			overridden: o,
			onNotNow: f,
			onResume: p,
			onFollow: m,
			onStopDemo: d
		}) : /* @__PURE__ */ u("div", {
			"data-testid": "crew-why-off",
			children: [
				/* @__PURE__ */ l("p", {
					className: "c-status",
					role: "status",
					"data-testid": "crew-status",
					children: v ? i.crewDemoEnd : i.crewOff
				}),
				/* @__PURE__ */ l("p", {
					className: "c-why-off",
					children: r.enabled ? i.crewDisabled : i.crewWhyOff
				}),
				/* @__PURE__ */ u("ol", {
					className: "c-steps",
					children: [/* @__PURE__ */ l("li", { children: i.crewStep1 }), /* @__PURE__ */ l("li", { children: i.crewStep2 })]
				}),
				/* @__PURE__ */ l("p", {
					className: "c-note",
					children: i.crewOptional
				})
			]
		}),
		!_ && /* @__PURE__ */ u("div", {
			className: "c-demo",
			children: [/* @__PURE__ */ l("p", {
				className: "c-muted",
				children: i.crewDemoHint
			}), /* @__PURE__ */ l(c, {
				left: null,
				next: {
					label: i.crewDemo,
					onClick: s,
					testid: "crew-demo"
				}
			})]
		}),
		/* @__PURE__ */ l("p", {
			className: "c-muted",
			children: i.crewPrivacy
		})
	] });
}
export { _ as CrewScreen };
