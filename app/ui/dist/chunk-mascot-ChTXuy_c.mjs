import { useEffect as e, useId as t, useRef as n } from "react";
import { Fragment as r, jsx as i, jsxs as a } from "react/jsx-runtime";
import { t as o } from "./chunk-useBreath-BZ3euK4B.mjs";
// ../../web/src/ui/calm/mascot/eyes.tsx
var s = {
	idle: ["ring", "ring"],
	listening: ["half", "half"],
	happy: ["arc", "arc"],
	sleepy: ["lid", "lid"],
	breathing: ["ring", "ring"],
	focus: ["narrow", "narrow"],
	steering: ["ring", "ring"],
	tired: ["heavy", "heavy"],
	done: ["closed", "closed"],
	offline: ["up", "up"],
	error: ["ring", "squint"],
	loading: ["dial", "dial"]
}, c = "#FFDC1A", l = "#3A2A2E", u = 40, d = 150;
function f(e, t, n) {
	let r = Math.sqrt(1600 - t * t), i = d + t;
	return n ? `M${e - r} ${i}A${u} ${u} 0 ${+(t > 0)} 1 ${e + r} ${i}Z` : `M${e + r} ${i}A${u} ${u} 0 ${+(t < 0)} 1 ${e - r} ${i}Z`;
}
function p({ cx: e, d: t, top: n = !0, tilt: r = 0 }) {
	return /* @__PURE__ */ i("path", {
		className: "cm-lid",
		d: f(e, t, n),
		fill: c,
		stroke: l,
		strokeWidth: "4",
		strokeLinejoin: "round",
		transform: r ? `rotate(${r} ${e} ${d})` : void 0
	});
}
function m({ cx: e, lift: t = 0 }) {
	return /* @__PURE__ */ a(r, { children: [
		/* @__PURE__ */ i("circle", {
			className: "cm-ring cm-s-gold",
			cx: e,
			cy: d,
			r: "24",
			fill: "none",
			stroke: "#FFD23A",
			strokeWidth: "4",
			strokeOpacity: "0.85"
		}),
		/* @__PURE__ */ i("circle", {
			className: "cm-pupil cm-f-gold",
			cx: e,
			cy: d + t,
			r: "8",
			fill: "#FFD23A"
		}),
		/* @__PURE__ */ i("circle", {
			cx: e - 9,
			cy: 140 + t,
			r: "4",
			fill: "#FFF6DC",
			opacity: "0.8"
		})
	] });
}
function h({ cx: e, kind: t, side: n }) {
	switch (t) {
		case "arc": return /* @__PURE__ */ i("path", {
			className: "cm-s-gold",
			d: `M${e - 20} 160A20 20 0 0 1 ${e + 20} 160`,
			fill: "none",
			stroke: "#FFD23A",
			strokeWidth: "8",
			strokeLinecap: "round"
		});
		case "closed": return /* @__PURE__ */ i("path", {
			className: "cm-s-gold",
			d: `M${e - 20} 142Q${e} 170 ${e + 20} 142`,
			fill: "none",
			stroke: "#FFD23A",
			strokeWidth: "8",
			strokeLinecap: "round"
		});
		case "up": return /* @__PURE__ */ i(m, {
			cx: e,
			lift: -10
		});
		case "dial": return /* @__PURE__ */ a(r, { children: [/* @__PURE__ */ a("g", {
			className: "cm-dial",
			children: [/* @__PURE__ */ i("circle", {
				className: "cm-ring cm-s-gold",
				cx: e,
				cy: d,
				r: "24",
				fill: "none",
				stroke: "#FFD23A",
				strokeWidth: "5",
				strokeDasharray: "8 10",
				strokeLinecap: "round"
			}), /* @__PURE__ */ i("path", {
				d: `M${e} 116V122M${e + 34} ${d}H${e + 28}M${e} 184V178M${e - 34} ${d}H${e - 28}`,
				stroke: "#FFD23A",
				strokeWidth: "4",
				strokeLinecap: "round"
			})]
		}), /* @__PURE__ */ i("circle", {
			className: "cm-pupil cm-f-gold",
			cx: e,
			cy: d,
			r: "5",
			fill: "#FFD23A"
		})] });
		case "lid": return /* @__PURE__ */ a(r, { children: [/* @__PURE__ */ i(m, { cx: e }), /* @__PURE__ */ i(p, {
			cx: e,
			d: 20
		})] });
		case "half": return /* @__PURE__ */ a(r, { children: [/* @__PURE__ */ i(m, { cx: e }), /* @__PURE__ */ i(p, {
			cx: e,
			d: 4
		})] });
		case "narrow": return /* @__PURE__ */ a(r, { children: [
			/* @__PURE__ */ i(m, { cx: e }),
			/* @__PURE__ */ i(p, {
				cx: e,
				d: -11
			}),
			/* @__PURE__ */ i(p, {
				cx: e,
				d: 11,
				top: !1
			})
		] });
		case "heavy": return /* @__PURE__ */ a(r, { children: [/* @__PURE__ */ i(m, { cx: e }), /* @__PURE__ */ i(p, {
			cx: e,
			d: 12,
			tilt: n * 14
		})] });
		case "squint": return /* @__PURE__ */ a(r, { children: [
			/* @__PURE__ */ i(m, { cx: e }),
			/* @__PURE__ */ i(p, {
				cx: e,
				d: -4,
				tilt: -n * 8
			}),
			/* @__PURE__ */ i(p, {
				cx: e,
				d: 13,
				top: !1
			})
		] });
		default: return /* @__PURE__ */ i(m, { cx: e });
	}
}
function g({ cx: e, kind: t, side: n }) {
	return /* @__PURE__ */ a("g", {
		className: "cm-eye",
		"data-eye": t,
		children: [/* @__PURE__ */ i("circle", {
			className: "cm-f-mask cm-s-ink",
			cx: e,
			cy: d,
			r: u,
			fill: "#241F2B",
			strokeWidth: "5"
		}), /* @__PURE__ */ i(h, {
			cx: e,
			kind: t,
			side: n
		})]
	});
}
// ../../web/src/ui/calm/mascot/layers.tsx
var _ = "0 0 512 512", v = "translate(97.3 56.3) scale(.62)", y = [
	190,
	226,
	286,
	322
], b = {
	idle: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: 1
	},
	listening: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: 1
	},
	happy: {
		dy: [
			-9,
			4,
			4,
			-9
		],
		len: .9,
		rot: [
			-16,
			-5,
			5,
			16
		]
	},
	sleepy: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .45
	},
	breathing: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .8
	},
	focus: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .7
	},
	steering: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: 1
	},
	tired: {
		dy: [
			7,
			-2,
			-2,
			7
		],
		len: .7,
		rot: [
			10,
			3,
			-3,
			-10
		]
	},
	done: {
		dy: [
			-5,
			2,
			2,
			-5
		],
		len: .85
	},
	offline: {
		dy: [
			4,
			-2,
			3,
			-3
		],
		len: .8
	},
	error: {
		dy: [
			4,
			-2,
			3,
			-3
		],
		len: .8
	},
	loading: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .6
	}
};
function x() {
	return /* @__PURE__ */ a("svg", {
		className: "cm-layer cm-shadow",
		viewBox: _,
		"aria-hidden": "true",
		focusable: "false",
		children: [
			/* @__PURE__ */ i("path", {
				className: "cm-hill-a",
				d: "M-20 512C20 462 120 440 256 440C392 440 492 462 532 512Z",
				fill: "#9DB07E"
			}),
			/* @__PURE__ */ i("path", {
				className: "cm-hill-b",
				d: "M40 512C90 474 170 458 256 458C342 458 422 474 472 512Z",
				fill: "#B3C28F",
				opacity: "0.7"
			}),
			/* @__PURE__ */ i("ellipse", {
				cx: "256",
				cy: "470",
				rx: "120",
				ry: "12",
				fill: "#4F5F3C",
				opacity: "0.28"
			})
		]
	});
}
function S({ id: e, mood: t, plain: n }) {
	let r = b[t], [o, c] = s[t];
	return /* @__PURE__ */ i("svg", {
		className: "cm-layer cm-face",
		viewBox: _,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ a("g", {
			transform: v,
			filter: n ? void 0 : `url(#${e}-paint)`,
			children: [
				/* @__PURE__ */ a("g", {
					className: "cm-pod cm-podl",
					children: [
						/* @__PURE__ */ i("rect", {
							className: "cm-f-cup cm-s-ink",
							x: "8",
							y: "196",
							width: "68",
							height: "120",
							rx: "30",
							fill: "#6B4A3C",
							strokeWidth: "6"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-f-mask cm-s-ink",
							x: "22",
							y: "212",
							width: "40",
							height: "88",
							rx: "16",
							fill: "#241F2B",
							strokeWidth: "4"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-slit",
							x: "35",
							y: "234",
							width: "14",
							height: "10",
							rx: "3"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-slit",
							x: "35",
							y: "268",
							width: "14",
							height: "10",
							rx: "3"
						})
					]
				}),
				/* @__PURE__ */ a("g", {
					className: "cm-pod cm-podr",
					children: [
						/* @__PURE__ */ i("rect", {
							className: "cm-f-cup cm-s-ink",
							x: "436",
							y: "196",
							width: "68",
							height: "120",
							rx: "30",
							fill: "#6B4A3C",
							strokeWidth: "6"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-f-mask cm-s-ink",
							x: "450",
							y: "212",
							width: "40",
							height: "88",
							rx: "16",
							fill: "#241F2B",
							strokeWidth: "4"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-slit",
							x: "463",
							y: "234",
							width: "14",
							height: "10",
							rx: "3"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-slit",
							x: "463",
							y: "268",
							width: "14",
							height: "10",
							rx: "3"
						})
					]
				}),
				/* @__PURE__ */ i("circle", {
					className: "cm-f-gold",
					cx: "256",
					cy: "256",
					r: "200",
					fill: `url(#${e}-gold)`
				}),
				/* @__PURE__ */ i("circle", {
					className: "cm-shade",
					cx: "256",
					cy: "256",
					r: "200",
					fill: `url(#${e}-shade)`
				}),
				/* @__PURE__ */ i("circle", {
					className: "cm-rim",
					cx: "256",
					cy: "256",
					r: "186",
					fill: "none",
					stroke: "#FFF3B0",
					strokeOpacity: "0.7",
					strokeWidth: "12",
					strokeDasharray: "330 1500",
					strokeLinecap: "round",
					transform: "rotate(200 256 256)"
				}),
				/* @__PURE__ */ i("circle", {
					className: "cm-s-ink",
					cx: "256",
					cy: "256",
					r: "200",
					fill: "none",
					stroke: "#3A2A2E",
					strokeWidth: "8"
				}),
				/* @__PURE__ */ i("circle", {
					className: "cm-s-ink",
					cx: "256",
					cy: "256",
					r: "200",
					fill: "none",
					stroke: "#3A2A2E",
					strokeWidth: "6",
					strokeDasharray: "420 1500",
					strokeLinecap: "round",
					transform: "rotate(100 256 256)"
				}),
				/* @__PURE__ */ i("rect", {
					className: "cm-f-mask",
					x: "218",
					y: "146",
					width: "76",
					height: "8",
					rx: "4",
					fill: "#241F2B"
				}),
				/* @__PURE__ */ i("polygon", {
					className: "cm-f-mask cm-s-ink",
					points: "96,240 240,276 240,350 168,370 120,320",
					fill: "#2F2430",
					strokeWidth: "11",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ i("polygon", {
					className: "cm-f-mask cm-s-ink",
					points: "416,240 272,276 272,350 344,370 392,320",
					fill: "#2F2430",
					strokeWidth: "11",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ i("polygon", {
					className: "cm-gem",
					points: "256,300 270,316 256,332 242,316",
					fill: "#00E5A8",
					fillOpacity: "0.35",
					stroke: "#00E5A8",
					strokeWidth: "5",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ i(g, {
					cx: 178,
					kind: o,
					side: -1
				}),
				/* @__PURE__ */ i(g, {
					cx: 334,
					kind: c,
					side: 1
				}),
				/* @__PURE__ */ i("g", {
					className: "cm-mouth",
					style: { "--ml": r.len },
					children: y.map((e, t) => {
						let n = r.dy[t] ?? 0, a = r.rot?.[t] ?? 0, o = 409 + n;
						return /* @__PURE__ */ i("g", {
							transform: a ? `rotate(${a} ${e} ${o})` : void 0,
							children: /* @__PURE__ */ i("path", {
								className: "cm-bar cm-s-ink",
								d: `M${e} ${o - 17 * r.len}V${o + 17 * r.len}`,
								stroke: "#3A2A2E",
								strokeWidth: "9",
								strokeLinecap: "round",
								fill: "none"
							})
						}, e);
					})
				})
			]
		})
	});
}
function C() {
	return /* @__PURE__ */ i("svg", {
		className: "cm-layer cm-motes",
		viewBox: _,
		"aria-hidden": "true",
		focusable: "false",
		children: [
			[
				70,
				110,
				4
			],
			[
				440,
				90,
				3
			],
			[
				400,
				430,
				4
			],
			[
				90,
				410,
				3
			],
			[
				256,
				30,
				3
			],
			[
				470,
				300,
				2
			]
		].map(([e, t, n], r) => /* @__PURE__ */ i("circle", {
			className: "cm-mote",
			style: { animationDelay: `${r * -1.3}s` },
			cx: e,
			cy: t,
			r: n,
			fill: "#FFF3C9"
		}, `${e}-${t}`))
	});
}
function w({ id: e }) {
	return /* @__PURE__ */ i("svg", {
		className: "cm-defs",
		width: "0",
		height: "0",
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ a("defs", { children: [
			/* @__PURE__ */ a("linearGradient", {
				id: `${e}-gold`,
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ i("stop", {
					offset: "0",
					stopColor: "#FFE600"
				}), /* @__PURE__ */ i("stop", {
					offset: "1",
					stopColor: "#FFB800"
				})]
			}),
			/* @__PURE__ */ a("radialGradient", {
				id: `${e}-shade`,
				cx: "0.35",
				cy: "0.3",
				r: "0.9",
				children: [/* @__PURE__ */ i("stop", {
					offset: "0.5",
					stopColor: "#C9772A",
					stopOpacity: "0"
				}), /* @__PURE__ */ i("stop", {
					offset: "1",
					stopColor: "#C9772A",
					stopOpacity: "0.35"
				})]
			}),
			/* @__PURE__ */ a("filter", {
				id: `${e}-paint`,
				x: "-5%",
				y: "-5%",
				width: "110%",
				height: "110%",
				children: [/* @__PURE__ */ i("feTurbulence", {
					type: "fractalNoise",
					baseFrequency: "0.02",
					numOctaves: "2",
					seed: "3",
					result: "t"
				}), /* @__PURE__ */ i("feDisplacementMap", {
					in: "SourceGraphic",
					in2: "t",
					scale: "9",
					xChannelSelector: "R",
					yChannelSelector: "G"
				})]
			})
		] })
	});
}
// ../../web/src/ui/calm/mascot/hoodie.tsx
var T = "0 0 512 512", E = "#3A2A2E", D = "#4E8A8C", O = "#356A6E", k = "#F2C14E";
function A({ id: e }) {
	return /* @__PURE__ */ i("svg", {
		className: "cm-layer cm-bodyl",
		viewBox: T,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ a("g", {
			filter: `url(#${e}-paint)`,
			children: [
				/* @__PURE__ */ i("ellipse", {
					cx: "222",
					cy: "462",
					rx: "36",
					ry: "15",
					fill: "#6B4A3C",
					stroke: E,
					strokeWidth: "3.5"
				}),
				/* @__PURE__ */ i("ellipse", {
					cx: "290",
					cy: "462",
					rx: "36",
					ry: "15",
					fill: "#6B4A3C",
					stroke: E,
					strokeWidth: "3.5"
				}),
				/* @__PURE__ */ a("g", {
					className: "cm-chest",
					children: [
						/* @__PURE__ */ i("path", {
							className: "cm-hood",
							d: "M166 358C146 306 178 262 256 258C334 262 366 306 346 358Z",
							fill: O,
							stroke: E,
							strokeWidth: "4",
							strokeLinejoin: "round"
						}),
						/* @__PURE__ */ i("path", {
							d: "M178 456C168 400 190 342 256 338C322 342 344 400 334 456C300 468 212 468 178 456Z",
							fill: D,
							stroke: E,
							strokeWidth: "4",
							strokeLinejoin: "round"
						}),
						/* @__PURE__ */ i("path", {
							d: "M300 352C330 380 336 420 332 452C316 458 304 460 296 460C306 420 306 384 300 352Z",
							fill: O,
							opacity: "0.4"
						}),
						/* @__PURE__ */ i("path", {
							d: "M196 360C186 392 186 424 192 452",
							fill: "none",
							stroke: "#FFE9C0",
							strokeOpacity: "0.4",
							strokeWidth: "6",
							strokeLinecap: "round"
						}),
						/* @__PURE__ */ i("path", {
							className: "cm-trim",
							d: "M180 350C206 378 306 378 332 350",
							fill: "none",
							stroke: k,
							strokeWidth: "9",
							strokeLinecap: "round"
						}),
						/* @__PURE__ */ i("path", {
							d: "M180 350C206 378 306 378 332 350",
							fill: "none",
							stroke: E,
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeOpacity: "0.6",
							transform: "translate(0 5)"
						}),
						/* @__PURE__ */ i("path", {
							className: "cm-cord",
							d: "M238 372C236 390 234 400 232 412M274 372C276 390 278 400 280 414",
							fill: "none",
							stroke: "#F4E9D2",
							strokeWidth: "4",
							strokeLinecap: "round"
						}),
						/* @__PURE__ */ i("circle", {
							cx: "232",
							cy: "416",
							r: "4.5",
							fill: k,
							stroke: E,
							strokeWidth: "2.5"
						}),
						/* @__PURE__ */ i("circle", {
							cx: "280",
							cy: "418",
							r: "4.5",
							fill: k,
							stroke: E,
							strokeWidth: "2.5"
						}),
						/* @__PURE__ */ i("path", {
							className: "cm-pocket",
							d: "M220 428Q256 420 292 428L298 452Q256 462 214 452Z",
							fill: O,
							fillOpacity: "0.55",
							stroke: E,
							strokeWidth: "3",
							strokeLinejoin: "round"
						}),
						/* @__PURE__ */ i("ellipse", {
							cx: "190",
							cy: "432",
							rx: "17",
							ry: "30",
							fill: D,
							stroke: E,
							strokeWidth: "3.5",
							transform: "rotate(8 190 432)"
						}),
						/* @__PURE__ */ i("ellipse", {
							cx: "322",
							cy: "432",
							rx: "17",
							ry: "30",
							fill: D,
							stroke: E,
							strokeWidth: "3.5",
							transform: "rotate(-8 322 432)"
						}),
						/* @__PURE__ */ i("path", {
							d: "M174 440Q192 450 209 442M303 442Q320 450 338 440",
							fill: "none",
							stroke: k,
							strokeWidth: "7",
							strokeLinecap: "round"
						}),
						/* @__PURE__ */ i("circle", {
							cx: "196",
							cy: "460",
							r: "10",
							fill: "#F7C95A",
							stroke: E,
							strokeWidth: "3"
						}),
						/* @__PURE__ */ i("circle", {
							cx: "316",
							cy: "460",
							r: "10",
							fill: "#F7C95A",
							stroke: E,
							strokeWidth: "3"
						})
					]
				})
			]
		})
	});
}
// ../../web/src/ui/calm/mascot/layersExtra.tsx
var j = "0 0 512 512", M = "#3A2A2E";
function N() {
	return /* @__PURE__ */ i("svg", {
		className: "cm-layer cm-band",
		viewBox: j,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ a("g", {
			transform: v,
			children: [/* @__PURE__ */ i("path", {
				className: "cm-s-ink cm-bandink",
				d: "M42 204C20 -34 492 -34 470 204",
				fill: "none",
				stroke: M,
				strokeWidth: "16",
				strokeLinecap: "round"
			}), /* @__PURE__ */ i("path", {
				d: "M60 190C50 10 462 10 452 190",
				fill: "none",
				stroke: "#FFF3D0",
				strokeOpacity: "0.22",
				strokeWidth: "5",
				strokeLinecap: "round"
			})]
		})
	});
}
function P({ marked: e = !1 }) {
	let t = (e, t, n) => /* @__PURE__ */ i("path", {
		className: "cm-ripple",
		style: { animationDelay: `${n * -1.6}s` },
		d: `M${e + t * 14} 170Q${e + t * 50} 215 ${e + t * 14} 260`,
		fill: "none",
		stroke: "#8FE3D0",
		strokeWidth: "5",
		strokeLinecap: "round"
	}, `${e}-${n}`);
	return /* @__PURE__ */ a("svg", {
		className: "cm-layer cm-ripples",
		"data-prop": e ? "ripples" : void 0,
		viewBox: j,
		"aria-hidden": "true",
		focusable: "false",
		children: [[
			0,
			1,
			2
		].map((e) => t(96, -1, e)), [
			0,
			1,
			2
		].map((e) => t(416, 1, e))]
	});
}
// ../../web/src/ui/calm/mascot/props.tsx
var F = "0 0 512 512", I = "#3A2A2E", L = {
	sleepy: () => /* @__PURE__ */ a("g", {
		fill: "none",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className: "cm-pk",
		children: [
			/* @__PURE__ */ i("path", {
				className: "cm-zl cm-z1",
				d: "M348 112h26l-26 26h26",
				strokeWidth: "7"
			}),
			/* @__PURE__ */ i("path", {
				className: "cm-zl cm-z2",
				d: "M382 72h19l-19 19h19",
				strokeWidth: "6"
			}),
			/* @__PURE__ */ i("path", {
				className: "cm-zl cm-z3",
				d: "M408 40h13l-13 13h13",
				strokeWidth: "5"
			})
		]
	}),
	breathing: () => /* @__PURE__ */ i("path", {
		className: "cm-wisp",
		d: "M306 336q14-12 28 0t28 0t28 0",
		fill: "none",
		stroke: "#BFE9E3",
		strokeWidth: "5",
		strokeLinecap: "round"
	}),
	focus: () => /* @__PURE__ */ i("path", {
		className: "cm-glow",
		d: "M241 252h30",
		fill: "none",
		stroke: "#9CFFE3",
		strokeWidth: "4",
		strokeLinecap: "round"
	}),
	steering: () => /* @__PURE__ */ i("path", {
		className: "cm-spark",
		d: "M404 160l5 13l13 5l-13 5l-5 13l-5-13l-13-5l13-5z",
		fill: "#00E5A8",
		stroke: I,
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}),
	tired: () => /* @__PURE__ */ i("path", {
		className: "cm-sweat",
		d: "M372 118C362 134 358 144 366 152C374 158 386 152 384 142C382 134 376 128 372 118Z",
		fill: "#8FD3F0",
		stroke: I,
		strokeWidth: "3.5",
		strokeLinejoin: "round"
	}),
	done: () => /* @__PURE__ */ a("g", {
		className: "cm-fall",
		children: [
			/* @__PURE__ */ i("path", {
				d: "M390 56c12-9 26-3 24 11c-12 6-24 0-24-11z",
				fill: "#8DBE6B",
				stroke: I,
				strokeWidth: "3",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ i("path", {
				d: "M392 62q10-2 18-3",
				fill: "none",
				stroke: I,
				strokeWidth: "2",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ i("path", {
				className: "cm-spark",
				d: "M356 70l4 10l10 4l-10 4l-4 10l-4-10l-10-4l10-4z",
				fill: "#FFF3B0",
				stroke: "#C9772A",
				strokeWidth: "2.5",
				strokeLinejoin: "round"
			})
		]
	}),
	offline: () => /* @__PURE__ */ i("path", {
		className: "cm-cloud",
		d: "M316 82a22 22 0 0 1 8-34a30 30 0 0 1 56-2a22 22 0 0 1 22 36z",
		fill: "#C9CFD9",
		stroke: "#6B7280",
		strokeWidth: "4",
		strokeLinejoin: "round"
	}),
	error: () => /* @__PURE__ */ a("g", {
		className: "cm-q",
		fill: "none",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ i("path", {
			d: "M378 76c0-16 28-16 28 0c0 12-14 12-14 26M392 116v2",
			stroke: I,
			strokeWidth: "11"
		}), /* @__PURE__ */ i("path", {
			d: "M378 76c0-16 28-16 28 0c0 12-14 12-14 26M392 116v2",
			stroke: "#FFD23A",
			strokeWidth: "6"
		})]
	})
}, R = {
	sleepy: "zzz",
	breathing: "wisp",
	focus: "glow",
	steering: "spark",
	tired: "sweat",
	done: "leaf",
	offline: "cloud",
	error: "question"
};
function z({ mood: e }) {
	let t = L[e];
	return t ? /* @__PURE__ */ i("svg", {
		className: "cm-layer cm-props",
		viewBox: F,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ i("g", {
			className: "cm-prop",
			"data-prop": R[e],
			children: t()
		})
	}) : null;
}
// ../../web/src/ui/calm/mascot/useLife.ts
var B = /* @__PURE__ */ new Set([
	"idle",
	"listening",
	"steering",
	"tired",
	"offline",
	"error"
]);
function V(e) {
	let t = e >>> 0;
	return () => {
		t = t + 0x6d2b79f5 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function H(e, t) {
	return (4e3 + e * 3e3) * (t ? 1.6 : 1);
}
function U(t, n, r) {
	e(() => {
		let e = t.current;
		if (r || !e) return;
		let i = V(n.length * 7919 + (n.codePointAt(0) ?? 1)), a = n === "tired", o, s = () => {
			o = setTimeout(() => {
				document.hidden || e.classList.add("cm-blinking"), o = setTimeout(() => {
					e.classList.remove("cm-blinking"), s();
				}, a ? 340 : 170);
			}, H(i(), a));
		}, c = () => {
			e.classList.toggle("cm-paused", document.hidden);
		};
		return c(), document.addEventListener("visibilitychange", c), B.has(n) && s(), () => {
			o !== void 0 && clearTimeout(o), document.removeEventListener("visibilitychange", c), e.classList.remove("cm-blinking", "cm-paused");
		};
	}, [
		t,
		n,
		r
	]);
}
// ../../web/src/ui/calm/mascot/useParallax.ts
var W = 8, G = 40, K = (e) => Number.isFinite(e) ? Math.max(-1, Math.min(1, e)) : 0;
function q(t, r) {
	let i = n(0);
	e(() => {
		let e = t.current;
		if (!r || !e) return;
		let n = (t, n) => {
			let r = Date.now();
			r - i.current < G || (i.current = r, e.style.setProperty("--ry", `${(K(t) * W).toFixed(2)}deg`), e.style.setProperty("--rx", `${(-K(n) * W).toFixed(2)}deg`));
		}, a = (e) => {
			let t = window.innerWidth || 1, r = window.innerHeight || 1;
			n(e.clientX / t * 2 - 1, e.clientY / r * 2 - 1);
		};
		return window.addEventListener("pointermove", a, { passive: !0 }), () => {
			window.removeEventListener("pointermove", a);
		};
	}, [t, r]);
}
// ../../web/src/ui/calm/mascot/CalmMascot.tsx
function J() {
	return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
var Y = (e) => e !== void 0 && Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 0, X = 96;
function Z({ mood: e = "idle", size: r = 220, reducedMotion: o, label: s = "Zonked mascot", breathPhase: c, level: l, situation: u }) {
	let d = `cm${t().replace(/[^a-zA-Z0-9]/g, "")}`, f = n(null), p = o ?? J(), m = Number.isFinite(r) ? Math.max(24, Math.min(640, r)) : 220, h = m <= X;
	return q(f, !p && !h), U(f, e, p), /* @__PURE__ */ a("div", {
		ref: f,
		className: `cm-stage cm-${e}${u ? ` cm-s-${u}` : ""}${p ? " cm-still" : ""}${h ? " cm-compact" : ""}${c === void 0 ? "" : " cm-driven"}`,
		style: {
			width: m,
			height: m,
			"--bp": Y(c),
			"--lv": l === void 0 && e === "listening" ? .35 : Y(l)
		},
		role: "img",
		"aria-label": s,
		"data-mood": e,
		"data-situation": u,
		children: [/* @__PURE__ */ i(w, { id: d }), /* @__PURE__ */ a("div", {
			className: "cm-body",
			children: [
				!h && /* @__PURE__ */ i(x, {}),
				!h && /* @__PURE__ */ i(A, { id: d }),
				/* @__PURE__ */ i("div", {
					className: "cm-sway",
					children: /* @__PURE__ */ a("div", {
						className: "cm-head",
						children: [
							!h && /* @__PURE__ */ i(P, { marked: e === "listening" }),
							/* @__PURE__ */ i(S, {
								id: d,
								mood: e,
								plain: h
							}),
							/* @__PURE__ */ i(N, {}),
							/* @__PURE__ */ i(z, { mood: e }),
							!h && /* @__PURE__ */ i(C, {})
						]
					})
				})
			]
		})]
	});
}
export { o as BreathCue, Z as CalmMascot };
