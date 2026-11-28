import { ct as e, st as t } from "./chunk-crewLink-B-5l2pQt.mjs";
import { A as n, c as r, i } from "./chunk-data-DrI3L2nM.mjs";
import { useState as a } from "react";
import { a as o } from "./chunk-catalog-DQXidRzG.mjs";
import { jsx as s, jsxs as c } from "react/jsx-runtime";
import { t as l } from "./chunk-look-C_f0p27a.mjs";
import { n as u } from "./chunk-MascotView-BrlUzit0.mjs";
// ../../web/src/ui/calm/SettingsExtras.tsx
function d() {
	let [e, n] = a(!1);
	return /* @__PURE__ */ c("div", {
		className: "c-privacy",
		children: [/* @__PURE__ */ s("button", {
			type: "button",
			className: "c-btn c-link",
			"data-testid": "privacy-link",
			"aria-expanded": e,
			"aria-controls": "c-privacy-text",
			onClick: () => n(!e),
			children: r.privacyLink
		}), e && /* @__PURE__ */ c("section", {
			id: "c-privacy-text",
			"aria-labelledby": "c-privacy-h",
			"data-testid": "privacy-text",
			children: [
				/* @__PURE__ */ s("h2", {
					id: "c-privacy-h",
					className: "c-h3",
					children: r.privacyTitle
				}),
				r.privacyLines.map((e) => /* @__PURE__ */ s("p", {
					className: "c-muted",
					children: e
				}, e)),
				/* @__PURE__ */ s("p", {
					className: "c-muted",
					"data-testid": "adults-note",
					children: t.adultsNote
				}),
				/* @__PURE__ */ s("p", {
					className: "c-muted",
					"data-testid": "help-line",
					children: t.helpLine
				})
			]
		})]
	});
}
var f = (e) => o().find((t) => t.id === e)?.name ?? e;
function p({ feel: e }) {
	let t = i(e).slice(0, 5);
	return /* @__PURE__ */ c("section", {
		"aria-labelledby": "c-helped-h",
		"data-testid": "helped",
		children: [/* @__PURE__ */ s("h2", {
			id: "c-helped-h",
			className: "c-h3",
			children: r.helped.title
		}), t.length === 0 ? /* @__PURE__ */ s("p", {
			className: "c-muted",
			children: r.helped.empty
		}) : /* @__PURE__ */ s("ul", {
			className: "c-rows",
			children: t.map((e) => /* @__PURE__ */ s("li", {
				className: "c-muted",
				children: r.helped.row(f(e.id), e.calmer, e.same, e.not)
			}, e.id))
		})]
	});
}
// ../../web/src/ui/calm/SettingsScreen.tsx
function m({ label: e, hint: t, checked: n, onChange: r, testId: i }) {
	return /* @__PURE__ */ c("label", {
		className: "c-switch",
		children: [
			/* @__PURE__ */ s("input", {
				type: "checkbox",
				role: "switch",
				"data-testid": i,
				checked: n,
				onChange: (e) => r(e.currentTarget.checked)
			}),
			/* @__PURE__ */ s("span", {
				className: "c-track",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ c("span", { children: [e, t !== void 0 && /* @__PURE__ */ s("small", {
				className: "c-muted",
				children: t
			})] })
		]
	});
}
var h = [
	"system",
	"light",
	"dark",
	"contrast"
];
function g({ value: e, onChange: n }) {
	return /* @__PURE__ */ c("fieldset", {
		className: "c-themes",
		"data-testid": "theme-picker",
		children: [
			/* @__PURE__ */ s("legend", { children: t.themeTitle }),
			h.map((r) => /* @__PURE__ */ c("label", {
				className: "c-theme-opt",
				children: [/* @__PURE__ */ s("input", {
					type: "radio",
					name: "c-theme",
					value: r,
					"data-testid": `theme-${r}`,
					checked: e === r,
					onChange: () => n(r)
				}), /* @__PURE__ */ s("span", { children: t.themeChoices[r] })]
			}, r)),
			e === "contrast" && /* @__PURE__ */ s("p", {
				className: "c-muted",
				"data-testid": "contrast-hint",
				children: t.contrastHint
			})
		]
	});
}
function _({ device: r, onDevice: i, gentle: a, reduceMotion: o, reduced: f = !1, onGentle: h, onReduceMotion: _, onStudio: v, onForget: y, prefs: b, onPrefs: x, onGuide: S, feel: C = [] }) {
	return /* @__PURE__ */ c("div", { children: [
		/* @__PURE__ */ s(u, {
			title: t.settingsTitle,
			reduced: f
		}),
		r !== void 0 && i !== void 0 && /* @__PURE__ */ c("fieldset", {
			className: "c-themes",
			"data-testid": "device-picker",
			children: [
				/* @__PURE__ */ s("legend", { children: t.deviceTitle }),
				n.map((t) => /* @__PURE__ */ c("label", {
					className: "c-theme-opt",
					children: [/* @__PURE__ */ s("input", {
						type: "radio",
						name: "c-device",
						value: t,
						"data-testid": `device-${t}`,
						checked: r === t,
						onChange: () => i(t)
					}), /* @__PURE__ */ s("span", { children: e[t] })]
				}, t)),
				/* @__PURE__ */ s("small", {
					className: "c-muted",
					children: t.deviceHint
				})
			]
		}),
		/* @__PURE__ */ s(m, {
			label: t.gentle,
			hint: t.gentleHint,
			checked: a,
			onChange: h,
			testId: "gentle-switch"
		}),
		/* @__PURE__ */ s(m, {
			label: t.reduceMotion,
			checked: o,
			onChange: _,
			testId: "motion-switch"
		}),
		/* @__PURE__ */ s(g, {
			value: b.choice,
			onChange: (e) => x({
				...b,
				choice: e
			})
		}),
		/* @__PURE__ */ s(m, {
			label: t.dimLabel,
			hint: t.dimHint,
			checked: l(b),
			onChange: (e) => x({
				...b,
				dim: e
			}),
			testId: "dim-switch"
		}),
		/* @__PURE__ */ s(m, {
			label: t.announceLabel,
			hint: t.announceHint,
			checked: b.announce,
			onChange: (e) => x({
				...b,
				announce: e
			}),
			testId: "announce-switch"
		}),
		/* @__PURE__ */ c("div", {
			className: "c-actions",
			children: [
				S !== void 0 && /* @__PURE__ */ s("button", {
					type: "button",
					className: "c-btn c-link",
					"data-testid": "settings-guide",
					onClick: S,
					children: t.guideLink
				}),
				/* @__PURE__ */ s("button", {
					type: "button",
					className: "c-btn c-link",
					"data-testid": "studio-switch",
					onClick: v,
					children: t.studioLink
				}),
				/* @__PURE__ */ s("p", {
					className: "c-muted",
					children: t.studioHint
				}),
				/* @__PURE__ */ s("button", {
					type: "button",
					className: "c-btn c-link",
					onClick: y,
					children: t.forget
				}),
				/* @__PURE__ */ s("p", {
					className: "c-muted",
					children: t.forgetHint
				}),
				/* @__PURE__ */ s(d, {})
			]
		}),
		/* @__PURE__ */ s(p, { feel: C }),
		/* @__PURE__ */ s("p", {
			className: "c-muted",
			children: t.offline
		})
	] });
}
export { _ as SettingsScreen };
