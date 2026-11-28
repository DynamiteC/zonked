import { W as e } from "./chunk-crewLink-CH1NzHoN.mjs";
import { t } from "./chunk-look-C_f0p27a.mjs";
import { n } from "./chunk-MascotView-CeVF4lFc.mjs";
import { jsx as r, jsxs as i } from "react/jsx-runtime";
// ../../web/src/ui/calm/SettingsScreen.tsx
function a({ label: e, hint: t, checked: n, onChange: a, testId: o }) {
	return /* @__PURE__ */ i("label", {
		className: "c-switch",
		children: [
			/* @__PURE__ */ r("input", {
				type: "checkbox",
				role: "switch",
				"data-testid": o,
				checked: n,
				onChange: (e) => a(e.currentTarget.checked)
			}),
			/* @__PURE__ */ r("span", {
				className: "c-track",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ i("span", { children: [e, t !== void 0 && /* @__PURE__ */ r("small", {
				className: "c-muted",
				children: t
			})] })
		]
	});
}
var o = [
	"system",
	"light",
	"dark",
	"contrast"
];
function s({ value: t, onChange: n }) {
	return /* @__PURE__ */ i("fieldset", {
		className: "c-themes",
		"data-testid": "theme-picker",
		children: [/* @__PURE__ */ r("legend", { children: e.themeTitle }), o.map((a) => /* @__PURE__ */ i("label", {
			className: "c-theme-opt",
			children: [/* @__PURE__ */ r("input", {
				type: "radio",
				name: "c-theme",
				value: a,
				"data-testid": `theme-${a}`,
				checked: t === a,
				onChange: () => n(a)
			}), /* @__PURE__ */ r("span", { children: e.themeChoices[a] })]
		}, a))]
	});
}
function c({ gentle: o, reduceMotion: c, reduced: l = !1, onGentle: u, onReduceMotion: d, onStudio: f, onForget: p, prefs: m, onPrefs: h, onGuide: g }) {
	return /* @__PURE__ */ i("div", { children: [
		/* @__PURE__ */ r(n, {
			title: e.settingsTitle,
			reduced: l
		}),
		/* @__PURE__ */ r(a, {
			label: e.gentle,
			hint: e.gentleHint,
			checked: o,
			onChange: u,
			testId: "gentle-switch"
		}),
		/* @__PURE__ */ r(a, {
			label: e.reduceMotion,
			checked: c,
			onChange: d,
			testId: "motion-switch"
		}),
		/* @__PURE__ */ r(s, {
			value: m.choice,
			onChange: (e) => h({
				...m,
				choice: e
			})
		}),
		/* @__PURE__ */ r(a, {
			label: e.dimLabel,
			hint: e.dimHint,
			checked: t(m),
			onChange: (e) => h({
				...m,
				dim: e
			}),
			testId: "dim-switch"
		}),
		/* @__PURE__ */ r(a, {
			label: e.announceLabel,
			hint: e.announceHint,
			checked: m.announce,
			onChange: (e) => h({
				...m,
				announce: e
			}),
			testId: "announce-switch"
		}),
		/* @__PURE__ */ i("div", {
			className: "c-actions",
			children: [
				g !== void 0 && /* @__PURE__ */ r("button", {
					type: "button",
					className: "c-btn c-link",
					"data-testid": "settings-guide",
					onClick: g,
					children: e.guideLink
				}),
				/* @__PURE__ */ r("button", {
					type: "button",
					className: "c-btn c-link",
					"data-testid": "studio-switch",
					onClick: f,
					children: e.studioLink
				}),
				/* @__PURE__ */ r("p", {
					className: "c-muted",
					children: e.studioHint
				}),
				/* @__PURE__ */ r("button", {
					type: "button",
					className: "c-btn c-link",
					onClick: p,
					children: e.forget
				}),
				/* @__PURE__ */ r("p", {
					className: "c-muted",
					children: e.forgetHint
				})
			]
		}),
		/* @__PURE__ */ r("p", {
			className: "c-muted",
			children: e.offline
		})
	] });
}
export { c as SettingsScreen };
