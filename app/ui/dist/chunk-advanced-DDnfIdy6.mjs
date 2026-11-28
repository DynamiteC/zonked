import { useEffect as e, useMemo as t, useRef as n, useState as r } from "react";
import { H as i, U as a, et as o, nt as s, rt as c, tt as l } from "./chunk-crewLink-CH1NzHoN.mjs";
import { n as u, r as d } from "./chunk-soundMenu-C52iaQfx.mjs";
import { jsx as f, jsxs as p } from "react/jsx-runtime";
import { t as m } from "./chunk-recContext-DRk3qs8m.mjs";
// ../../web/src/app/neuro.ts
function h(e) {
	return {
		l: e.carrierHz - e.beatHz / 2,
		r: e.carrierHz + e.beatHz / 2
	};
}
// ../../web/src/catalog/bands.ts
var g = {
	garcia: "S1",
	chaieb: "S2",
	lane: "S4",
	zhou: "S8",
	ingendoh: "S12",
	goodin: "S7",
	padma: "S6",
	mallik: "S11"
}, _ = "Not a medical device. Results vary and may not happen for you.", v = [
	{
		name: "Delta",
		minHz: .5,
		maxHz: 4,
		mayHelp: "rest and sleep",
		evidence: "limited",
		note: `Little direct research on beats at this range. Steady noise has some sleep studies. ${_}`,
		sources: [g.zhou, g.ingendoh]
	},
	{
		name: "Theta",
		minHz: 4,
		maxHz: 8,
		mayHelp: "meditation and drowsy calm",
		evidence: "preliminary",
		note: `Small studies only. ${_}`,
		sources: [g.chaieb, g.ingendoh]
	},
	{
		name: "Alpha",
		minHz: 8,
		maxHz: 13,
		mayHelp: "stress relief and relaxed focus",
		evidence: "mixed",
		note: `Some trials show lower anxiety, others show no effect. ${_}`,
		sources: [
			g.garcia,
			g.padma,
			g.mallik
		]
	},
	{
		name: "Beta",
		minHz: 13,
		maxHz: 30,
		mayHelp: "alert focus",
		evidence: "mixed",
		note: `One small study saw better vigilance, another saw no change. ${_}`,
		sources: [
			g.lane,
			g.goodin,
			g.garcia
		]
	},
	{
		name: "Gamma",
		minHz: 30,
		maxHz: 40,
		mayHelp: "alert attention (experimental)",
		evidence: "limited",
		note: `Very little evidence. Keep sessions short and volume low. ${_}`,
		sources: [g.chaieb, g.ingendoh]
	}
];
function y(e) {
	let t = Number.isFinite(e) ? e : 0;
	return v.find((e) => t >= e.minHz && t < e.maxHz) ?? (t >= 40 ? v[4] : v[0]);
}
// ../../web/src/ui/dialBands.ts
var b = {
	Delta: "deep rest",
	Theta: "dreamy",
	Alpha: "relaxed",
	Beta: "alert",
	Gamma: "sharp"
}, x = .01;
function S(e) {
	let t = [];
	for (let e = 0; e <= 100; e += 1) {
		let n = e * x, r = y(u(n)).name, i = t[t.length - 1];
		i && i.name === r ? i.to = n : t.push({
			name: r,
			from: n,
			to: n
		});
	}
	return t.map((n, r) => ({
		from: n.from,
		to: r === t.length - 1 ? 1 : t[r + 1].from,
		label: n.name,
		active: n.name === e
	}));
}
function ee(e) {
	let t = y(e);
	return `${t.name}: ${b[t.name]}. About ${Math.round(e)} pulses a second.`;
}
function C(e) {
	let t = u(e), n = y(t);
	return `${Math.round(t)} hertz, ${n.name}, ${b[n.name]}`;
}
// ../../web/src/ui/shared/RangeField.tsx
function w(e, t, n) {
	return !Number.isFinite(e) || n <= t ? 0 : Math.min(1, Math.max(0, (e - t) / (n - t)));
}
function T(e = 1) {
	return [...[
		{
			value: 0,
			label: "Off"
		},
		{
			value: .25,
			label: "25"
		},
		{
			value: .5,
			label: "50"
		},
		{
			value: .75,
			label: "75"
		}
	].filter((t) => t.value < e - .01), {
		value: e,
		label: "Max"
	}];
}
var E = (e) => ({ "--f": e });
function D(e) {
	let [t, n] = r(!1), [i, a] = r(!1), o = w(e.value, e.min, e.max), s = t || i;
	return /* @__PURE__ */ p("div", {
		className: "rf",
		style: E(o),
		"data-testid": e.testId ? `${e.testId}-field` : void 0,
		children: [
			/* @__PURE__ */ f("div", {
				className: "rf-top",
				children: s && /* @__PURE__ */ f("span", {
					className: "rf-bubble",
					"aria-hidden": "true",
					"data-testid": "rf-bubble",
					children: e.bubbleText ?? String(e.value)
				})
			}),
			/* @__PURE__ */ f("input", {
				id: e.id,
				"data-testid": e.testId,
				className: "rf-input",
				type: "range",
				min: e.min,
				max: e.max,
				step: e.step,
				value: e.value,
				disabled: e.disabled,
				"aria-valuetext": e.valueText,
				onChange: (t) => e.onChange(Number(t.target.value)),
				onFocus: () => n(!0),
				onBlur: () => {
					n(!1), a(!1);
				},
				onPointerDown: () => a(!0),
				onPointerUp: () => a(!1),
				onPointerCancel: () => a(!1)
			}),
			e.bands && e.bands.length > 0 && /* @__PURE__ */ f("div", {
				className: "rf-bands",
				"aria-hidden": "true",
				children: e.bands.map((t) => /* @__PURE__ */ f("span", {
					className: "rf-band",
					"data-active": t.active ? "true" : "false",
					"data-testid": "rf-band",
					style: {
						left: `${w(t.from, e.min, e.max) * 100}%`,
						width: `${(w(t.to, e.min, e.max) - w(t.from, e.min, e.max)) * 100}%`
					},
					children: t.label
				}, `${t.label}-${t.from}`))
			}),
			e.ticks && e.ticks.length > 0 && /* @__PURE__ */ f("div", {
				className: "rf-ticks",
				"aria-hidden": "true",
				children: e.ticks.map((t) => /* @__PURE__ */ p("span", {
					className: "rf-tick",
					"data-testid": "rf-tick",
					style: E(w(t.value, e.min, e.max)),
					children: [/* @__PURE__ */ f("i", {}), /* @__PURE__ */ f("b", { children: t.label })]
				}, `${t.value}-${t.label}`))
			})
		]
	});
}
// ../../web/src/ui/advanced/CalmAlertPanel.tsx
var O = 25, k = .3;
function A({ snap: e, player: t }) {
	let [n, i] = r(k), [a, o] = r(!1), s = h(e.voice), l = Math.abs(s.r - s.l), m = a ? y(u(n)).name : y(l).name, g = e.voice.layers ?? c;
	return /* @__PURE__ */ p("div", {
		className: "adv-panel",
		"data-testid": "adv-dial",
		children: [
			/* @__PURE__ */ p("div", {
				className: "adv-ends",
				children: [/* @__PURE__ */ f("span", { children: "Calm" }), /* @__PURE__ */ f("span", { children: "Alert" })]
			}),
			/* @__PURE__ */ f(D, {
				id: "adv-dial",
				testId: "adv-dial-input",
				min: 0,
				max: 1,
				step: .01,
				value: n,
				valueText: C(n),
				bubbleText: `${u(n)} Hz`,
				bands: S(m),
				onChange: (e) => {
					i(e), o(!0), t.setBeatOverride(u(e)), t.setLayerOverride(d(e, g));
				}
			}),
			/* @__PURE__ */ p("p", {
				className: "adv-line",
				"data-testid": "adv-dial-readout",
				children: [
					"Pulse speed now: ",
					l.toFixed(1),
					" Hz (",
					y(l).name,
					")"
				]
			}),
			/* @__PURE__ */ f("p", {
				className: "adv-note",
				"data-testid": "adv-dial-meaning",
				children: ee(l)
			}),
			l > O && /* @__PURE__ */ f("p", {
				className: "adv-note",
				"data-testid": "adv-hearing-note",
				children: "Keep it quiet. Pulses above 25 Hz can feel tiring."
			}),
			/* @__PURE__ */ f("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-dial-reset",
				onClick: () => {
					o(!1), t.setBeatOverride(null);
				},
				children: "Back to the sound's own pulse"
			})
		]
	});
}
// ../../web/src/ui/advanced/EditorPanel.tsx
var j = 50;
function M({ text: e, onText: n, onPlay: r }) {
	let i = t(() => l(e), [e]);
	return /* @__PURE__ */ p("div", {
		className: "adv-panel",
		"data-testid": "adv-editor",
		children: [
			/* @__PURE__ */ f("label", {
				htmlFor: "adv-sbg-text",
				children: ".sbg script"
			}),
			/* @__PURE__ */ f("textarea", {
				id: "adv-sbg-text",
				className: "adv-text",
				"data-testid": "adv-editor-text",
				spellCheck: !1,
				value: e,
				onChange: (e) => n(e.target.value),
				"aria-describedby": "adv-sbg-diag"
			}),
			/* @__PURE__ */ f("div", {
				id: "adv-sbg-diag",
				role: "status",
				"aria-live": "polite",
				"data-testid": "adv-diagnostics",
				children: i.diagnostics.length === 0 ? /* @__PURE__ */ f("p", {
					className: "adv-note",
					children: "No problems."
				}) : /* @__PURE__ */ f("ul", {
					className: "adv-diag",
					children: i.diagnostics.slice(0, j).map((e, t) => /* @__PURE__ */ p("li", {
						"data-severity": e.severity,
						children: [
							"Line ",
							e.line,
							": ",
							e.severity,
							": ",
							e.message
						]
					}, `${e.line}-${t}`))
				})
			}),
			/* @__PURE__ */ f("button", {
				type: "button",
				className: "adv-btn adv-primary",
				"data-testid": "adv-editor-play",
				disabled: !i.ok,
				onClick: () => r(e),
				children: "Play this script"
			})
		]
	});
}
// ../../web/src/ui/advanced/ImportExportPanel.tsx
var N = 80, P = (e) => e.replace(/[^\w.-]+/g, "_") || "script";
function F({ text: e, name: t, onImport: n }) {
	let [i, a] = r("");
	return /* @__PURE__ */ p("div", {
		className: "adv-panel",
		"data-testid": "adv-io",
		children: [/* @__PURE__ */ p("div", {
			className: "adv-actions",
			children: [/* @__PURE__ */ p("label", {
				className: "adv-btn adv-file",
				children: ["Import .sbg", /* @__PURE__ */ f("input", {
					type: "file",
					accept: ".sbg,.txt,text/plain",
					"data-testid": "adv-import-input",
					onChange: (e) => {
						let t = e.target.files?.[0];
						e.target.value = "", t !== void 0 && (t.size > s.maxBytes ? a(`That file is ${t.size} bytes. The limit is ${s.maxBytes} bytes.`) : t.text().then((e) => {
							n(e, t.name.replace(/\.[^.]*$/, "").slice(0, N) || "Imported"), a(`Imported ${t.name}.`);
						}, () => a("Could not read that file.")));
					}
				})]
			}), /* @__PURE__ */ f("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-export",
				onClick: () => {
					let n = URL.createObjectURL(new Blob([e], { type: "text/plain" })), r = document.createElement("a");
					r.href = n, r.download = `${P(t)}.sbg`, r.click(), URL.revokeObjectURL(n), a(`Saved ${P(t)}.sbg.`);
				},
				children: "Export .sbg"
			})]
		}), /* @__PURE__ */ f("p", {
			className: "adv-note",
			role: "status",
			"aria-live": "polite",
			"data-testid": "adv-io-note",
			children: i
		})]
	});
}
// ../../web/src/ui/advanced/MixPanel.tsx
var I = [
	[
		"lofi",
		"lofiLevel",
		"Warm hum"
	],
	[
		"inst",
		"instLevel",
		"Soft notes"
	],
	[
		"pad",
		"padLevel",
		"Pad"
	],
	[
		"chimes",
		"chimeLevel",
		"Chimes"
	],
	[
		"perc",
		"percLevel",
		"Gentle rhythm"
	],
	[
		"crackle",
		"crackle",
		"Vinyl crackle"
	],
	[
		"breath",
		"breathDepth",
		"Breathing swell"
	],
	[
		"width",
		"stereoWidth",
		"Stereo width"
	],
	[
		"pan",
		"panDepth",
		"Slow pan"
	]
], L = .6, R = (e) => Math.round(e * 100);
function z({ snap: e, player: t }) {
	let n = e.voice.layers ?? c, r = e.voice.noise, i = r === "violet" ? L : 1, a = Math.min(i, e.voice.noiseLevel);
	return /* @__PURE__ */ p("div", {
		className: "adv-panel",
		"data-testid": "adv-mix",
		children: [
			I.map(([e, r, i]) => /* @__PURE__ */ p("div", {
				className: "adv-row",
				children: [/* @__PURE__ */ f("label", {
					htmlFor: `adv-mix-${e}`,
					children: i
				}), /* @__PURE__ */ f(D, {
					id: `adv-mix-${e}`,
					testId: `adv-mix-${e}`,
					min: 0,
					max: 1,
					step: .05,
					value: n[r],
					valueText: `${R(n[r])} percent`,
					bubbleText: `${R(n[r])}`,
					ticks: T(),
					onChange: (e) => t.setLayerOverride({ [r]: e })
				})]
			}, e)),
			r !== "off" && /* @__PURE__ */ p("div", {
				className: "adv-row",
				children: [/* @__PURE__ */ f("label", {
					htmlFor: "adv-mix-noise",
					children: "Background noise"
				}), /* @__PURE__ */ f(D, {
					id: "adv-mix-noise",
					testId: "adv-mix-noise",
					min: 0,
					max: i,
					step: .05,
					value: a,
					valueText: `${R(a)} percent`,
					bubbleText: `${R(a)}`,
					ticks: T(i),
					onChange: (e) => t.setNoiseOverride({ noiseLevel: Math.min(i, e) })
				})]
			}),
			r === "violet" && /* @__PURE__ */ f("p", {
				className: "adv-note",
				"data-testid": "adv-violet-note",
				children: "Violet is bright. Start very quiet."
			}),
			/* @__PURE__ */ f("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-mix-reset",
				onClick: () => t.clearLayerOverrides(),
				children: "Reset to the sound"
			})
		]
	});
}
// ../../web/src/ui/useFrame.ts
function B(t, r) {
	let i = n(t);
	e(() => {
		i.current = t;
	}), e(() => {
		if (!r) return;
		let e = 0, t = 0, n = (r) => {
			let a = t === 0 ? 0 : Math.min(.25, (r - t) / 1e3);
			t = r, i.current(a), e = requestAnimationFrame(n);
		}, a = () => {
			document.hidden ? (e !== 0 && cancelAnimationFrame(e), e = 0) : e === 0 && (t = 0, e = requestAnimationFrame(n));
		};
		return document.addEventListener("visibilitychange", a), a(), () => {
			document.removeEventListener("visibilitychange", a), e !== 0 && cancelAnimationFrame(e);
		};
	}, [r]);
}
// ../../web/src/ui/Scope.tsx
var V = 1e3, H = 300, U = 512, W = 660, G = 700, K = 300, q = "#FFE600", J = "#00E5A8";
function Y(e, t, n) {
	if (e.clearRect(0, 0, V, H), e.lineWidth = 1, e.strokeStyle = "rgba(255,255,255,0.12)", e.beginPath(), e.moveTo(0, H / 2), e.lineTo(W, H / 2), e.rect(G, 0, K, K), e.moveTo(850, 0), e.lineTo(850, K), e.moveTo(G, K / 2), e.lineTo(1e3, K / 2), e.stroke(), n < 2) return;
	let r = H * .45, i = W / (n - 1);
	e.lineWidth = 2, e.strokeStyle = q, e.beginPath();
	for (let a = 0; a < n; a++) {
		let n = H / 2 - (t[a * 2] ?? 0) * r;
		a === 0 ? e.moveTo(0, n) : e.lineTo(a * i, n);
	}
	e.stroke(), e.strokeStyle = J, e.beginPath();
	for (let a = 0; a < n; a++) {
		let n = H / 2 - (t[a * 2 + 1] ?? 0) * r;
		a === 0 ? e.moveTo(0, n) : e.lineTo(a * i, n);
	}
	e.stroke(), e.lineWidth = 1, e.strokeStyle = "rgba(255,184,0,0.8)", e.beginPath();
	let a = K / 2;
	for (let r = 0; r < n; r++) {
		let n = 850 + (t[r * 2] ?? 0) * a * .9, i = a - (t[r * 2 + 1] ?? 0) * a * .9;
		r === 0 ? e.moveTo(n, i) : e.lineTo(n, i);
	}
	e.stroke();
}
function X(e, t) {
	if (t <= 0) return 0;
	let n = 0;
	for (let r = 0; r < t * 2; r++) n += (e[r] ?? 0) ** 2;
	return Math.sqrt(n / (t * 2));
}
function Z({ telemetry: e, onLevel: t }) {
	let r = n(null), i = n(new Float32Array(U * 2));
	return B(() => {
		let n = r.current?.getContext("2d"), a = e.read(i.current);
		t?.(X(i.current, a)), n != null && Y(n, i.current, a);
	}, !0), /* @__PURE__ */ f("canvas", {
		ref: r,
		className: "scope",
		"data-testid": "scope-canvas",
		width: V,
		height: H,
		role: "img",
		"aria-label": "Left and right channel oscilloscope and stereo Lissajous plot"
	});
}
// ../../web/src/ui/advanced/ScopePanel.tsx
function Q({ telemetry: e }) {
	return /* @__PURE__ */ f("div", {
		className: "adv-panel adv-scope",
		"data-testid": "adv-scope",
		children: /* @__PURE__ */ f(Z, { telemetry: e })
	});
}
// ../../web/src/ui/advanced/TimersPanel.tsx
var te = (e, t, n) => Number.isFinite(e) ? Math.min(n, Math.max(t, Math.round(e))) : t;
function $(e) {
	return /* @__PURE__ */ p("div", {
		className: "adv-field",
		children: [/* @__PURE__ */ f("label", {
			htmlFor: e.id,
			children: e.label
		}), /* @__PURE__ */ f("input", {
			id: e.id,
			"data-testid": e.id,
			className: "adv-num",
			type: "number",
			inputMode: "numeric",
			min: e.min,
			max: e.max,
			value: e.value,
			onChange: (t) => e.onChange(te(Number(t.target.value), e.min, e.max))
		})]
	});
}
function ne({ timer: e, player: t }) {
	let [n, i] = r(30), [a, o] = r(30), [s, c] = r(25), [l, u] = r(5), d = e.kind !== "none";
	return /* @__PURE__ */ p("div", {
		className: "adv-panel",
		"data-testid": "adv-timers",
		children: [
			/* @__PURE__ */ f("p", {
				className: "adv-line",
				"data-testid": "adv-timer-status",
				children: d ? `${e.kind}${e.phase === void 0 ? "" : `, ${e.phase}`}: ${m(e.remainingSec)} left` : "No timer is running."
			}),
			/* @__PURE__ */ p("div", {
				className: "adv-actions",
				children: [/* @__PURE__ */ f($, {
					id: "adv-timer-cd",
					label: "Countdown minutes",
					value: n,
					min: 1,
					max: 720,
					onChange: i
				}), /* @__PURE__ */ f("button", {
					type: "button",
					className: "adv-btn",
					"data-testid": "adv-timer-countdown",
					onClick: () => t.startTimer({
						kind: "countdown",
						minutes: n
					}),
					children: "Start countdown"
				})]
			}),
			/* @__PURE__ */ p("div", {
				className: "adv-actions",
				children: [/* @__PURE__ */ f($, {
					id: "adv-timer-sl",
					label: "Sleep fade minutes",
					value: a,
					min: 1,
					max: 720,
					onChange: o
				}), /* @__PURE__ */ f("button", {
					type: "button",
					className: "adv-btn",
					"data-testid": "adv-timer-sleep",
					onClick: () => t.startTimer({
						kind: "sleep-fade",
						minutes: a
					}),
					children: "Start sleep fade"
				})]
			}),
			/* @__PURE__ */ p("div", {
				className: "adv-actions",
				children: [
					/* @__PURE__ */ f($, {
						id: "adv-timer-focus",
						label: "Focus minutes",
						value: s,
						min: 1,
						max: 180,
						onChange: c
					}),
					/* @__PURE__ */ f($, {
						id: "adv-timer-break",
						label: "Break minutes",
						value: l,
						min: 1,
						max: 60,
						onChange: u
					}),
					/* @__PURE__ */ f("button", {
						type: "button",
						className: "adv-btn",
						"data-testid": "adv-timer-pomodoro",
						onClick: () => t.startTimer({
							kind: "pomodoro",
							focusMin: s,
							breakMin: l,
							longBreakMin: Math.max(l, 15),
							longEvery: 4
						}),
						children: "Start focus and break"
					})
				]
			}),
			/* @__PURE__ */ f("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-timer-stop",
				disabled: !d,
				onClick: () => t.stopTimer(),
				children: "Stop timer"
			})
		]
	});
}
// ../../web/src/ui/advanced/usePlayerSnapshot.ts
function re(t) {
	let [n, i] = r(() => t.snapshot());
	return e(() => t.subscribe(i), [t]), n;
}
// ../../web/src/ui/advanced/AdvancedPanels.tsx
var ie = [
	"Mix",
	"Calm to Alert",
	"Editor",
	"Import and export",
	"Timers",
	"Scope"
];
function ae({ engine: n, player: s, onClose: c }) {
	let l = t(() => s ?? new i(n, a, () => void 0), [s, n]);
	e(() => {
		if (s === void 0) return () => void l.stop();
	}, [s, l]);
	let u = re(l), [d, m] = r(o[0]?.sbg ?? ""), [h, g] = r("script"), _ = {
		Mix: /* @__PURE__ */ f(z, {
			snap: u,
			player: l
		}),
		"Calm to Alert": /* @__PURE__ */ f(A, {
			snap: u,
			player: l
		}),
		Editor: /* @__PURE__ */ f(M, {
			text: d,
			onText: m,
			onPlay: (e) => void l.playCustom(e)
		}),
		"Import and export": /* @__PURE__ */ f(F, {
			text: d,
			name: h,
			onImport: (e, t) => {
				m(e), g(t);
			}
		}),
		Timers: /* @__PURE__ */ f(ne, {
			timer: u.timer,
			player: l
		}),
		Scope: /* @__PURE__ */ f(Q, { telemetry: n.telemetry })
	};
	return /* @__PURE__ */ p("div", {
		className: "adv-panels",
		"data-testid": "advanced-panels",
		children: [ie.map((e, t) => /* @__PURE__ */ p("details", {
			className: "adv-section",
			open: t === 0,
			"data-testid": `adv-section-${e.toLowerCase().replace(/ /g, "-")}`,
			children: [/* @__PURE__ */ f("summary", { children: e }), _[e]]
		}, e)), c !== void 0 && /* @__PURE__ */ f("button", {
			type: "button",
			className: "adv-btn",
			"data-testid": "adv-close",
			onClick: c,
			children: "Close"
		})]
	});
}
export { ae as AdvancedPanels };
