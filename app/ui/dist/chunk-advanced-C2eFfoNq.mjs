import { useCallback as e, useEffect as t, useMemo as n, useRef as r, useState as i } from "react";
import { $ as a, A as o, J as s, K as c, M as l, N as u, P as d, Q as f, Y as p, Z as m, b as h, et as g, ft as _, g as v, ht as y, mt as b, pt as x, q as ee, tt as S } from "./chunk-crewLink-TXTH-ttS.mjs";
import { a as te, i as ne, r as C, t as w } from "./chunk-favorites-BbDg4vkc.mjs";
import { f as re, h as ie, m as T, r as ae } from "./chunk-data-B5J84IqW.mjs";
import { a as oe, i as se, n as ce, o as E, r as D, s as le, t as O } from "./chunk-milestones-Dwormqum.mjs";
import { Fragment as k, jsx as A, jsxs as j } from "react/jsx-runtime";
import { c as M, s as N } from "./chunk-catalog-CdNrcMzw.mjs";
import { n as P, r as F, t as I } from "./chunk-RangeField-D77jQUlk.mjs";
var L = "zonked", R = "sanctuary";
function ue(e, t, n, r, i = []) {
	return JSON.stringify({
		app: L,
		kind: R,
		v: 1,
		exportedAt: r,
		mixes: e,
		favorites: t,
		milestones: {
			v: 1,
			hidden: n.hidden,
			earned: n.earned,
			reminder: n.reminder
		},
		...i.length > 0 ? { feel: T(i) } : {}
	}, null, 2);
}
function z(e, t) {
	return e === void 0 ? w : {
		v: 1,
		items: C(e, t).items.filter((e) => e.kind === "template")
	};
}
function de(e, t) {
	if (e.length > 262144) return {
		ok: !1,
		error: "too-big"
	};
	let n;
	try {
		n = JSON.parse(e);
	} catch {
		return {
			ok: !1,
			error: "not-json"
		};
	}
	if (!ee(n) || c(n, "app") !== "zonked" || c(n, "kind") !== "sanctuary") return {
		ok: !1,
		error: "not-zonked"
	};
	if (c(n, "v") !== 1) return {
		ok: !1,
		error: "unknown-version"
	};
	let r = c(n, "mixes"), i = Array.isArray(r) ? r : [];
	if (i.length > 200) return {
		ok: !1,
		error: "too-many"
	};
	let a = [];
	for (let e of i) {
		let n = m(e, t);
		n !== null && a.push(n);
	}
	let o = c(n, "milestones"), s = c(n, "feel");
	return {
		ok: !0,
		mixes: a,
		favorites: z(c(n, "favorites"), t),
		milestones: o === void 0 ? null : E(o, t),
		feel: s === void 0 ? null : T(s),
		skipped: i.length - a.length
	};
}
function fe(e, t, n, r, i) {
	let o = n === "replace" ? [] : [...e], s = o.map((e) => e.name), c = [];
	for (let e of t) {
		if (o.length + c.length >= 200) break;
		let t = a(e.name, [...s, ...c.map((e) => e.name)]);
		c.push({
			...e,
			id: p(r + c.length, i),
			name: t,
			updatedAt: r
		});
	}
	return c;
}
// ../../web/src/ui/sanctuary/copy.ts
var B = {
	title: "Sanctuary",
	close: "Close",
	sections: {
		mission: "Why Zonked is free",
		guide: "How it works",
		favorites: "Favorites",
		mixes: "My mixes",
		milestones: "Gentle milestones",
		data: "My data"
	},
	mission: {
		heading: "Zonked is free, for everyone",
		body: "Zonked is a quiet place to rest. It helps with stress, work and AI burnout, a tired mind and trouble sleeping. It costs nothing and it always will.",
		facts: [
			"No account. You never sign in.",
			"No ads. No payments. No upsell.",
			"No tracking. No analytics. No cookies that follow you.",
			"No network. The sound is made on your device, so it works offline.",
			"Your mixes and progress stay in this browser. You can export them as a file, or delete them in one tap."
		],
		privacyHeading: "How Zonked is free and private",
		privacyBody: "The app only talks to your own computer. If you run the optional Kiro Crew helper, it runs on this same machine (127.0.0.1) and nothing goes to the internet.",
		notMedical: "Zonked is not a medical device. It cannot treat or cure anything. If you have a health problem, ask a doctor or another qualified person."
	},
	guide: {
		heading: "How Zonked works",
		items: [
			{
				title: "What the sound does",
				body: "Zonked plays steady tones, soft noise and gentle layers such as pads, chimes and lo-fi warmth. A slow, even sound gives a busy mind something calm to follow. People often find it easier to relax or to focus. It does not work the same for everyone."
			},
			{
				title: "Why headphones",
				body: "A binaural beat is two slightly different tones, one in each ear. Your brain hears the small difference. This only works with stereo headphones. On speakers you still get the calm layers, but not the beat."
			},
			{
				title: "Listen safely",
				body: "Start with the volume low. The sound fades in slowly on its own. Keep it quiet enough to hold a conversation. Stop if you feel dizzy, uneasy or in pain. Do not listen while you drive or do anything that needs full attention. Zonked never plays louder than a fixed safe limit."
			},
			{
				title: "Flashing and motion",
				body: "Turn on Reduce motion to stop the moving mascot and any pulsing. Zonked never flashes more than 3 times a second."
			},
			{
				title: "What it cannot do",
				body: "Zonked is not a medical device. It does not diagnose, treat or cure. If you have trouble sleeping for weeks, feel very low or anxious, have seizures or ringing in the ears, or feel unsafe, please talk to a doctor or a crisis line in your country."
			}
		]
	},
	favorites: {
		heading: "Favorites",
		help: "Keep the sounds you love one tap away.",
		empty: "Nothing here yet. Search for a sound below and tap the heart button, or save what is playing.",
		searchLabel: "Find a sound to favorite",
		searchHint: "Type a name, for example calm or sleep",
		addPlaying: "Favorite what is playing",
		remove: "Remove from favorites",
		add: "Add to favorites",
		favorited: "Favorited",
		play: "Play",
		gone: "This sound is no longer in the library",
		mixMissing: "This mix was deleted",
		nothingPlaying: "Play a library sound first, then you can favorite it here."
	},
	mixes: {
		heading: "My mixes",
		help: "Save the sound you are hearing, with its levels and timer. Mixes stay on this device.",
		nameLabel: "Name your mix",
		namePlaceholder: "Evening calm",
		save: "Save current sound",
		nothing: "Start a sound first, then you can save it as a mix.",
		empty: "No mixes yet. When you find a sound you like, save it here.",
		load: "Play",
		rename: "Rename",
		renameLabel: "New name",
		confirmRename: "Save name",
		cancel: "Cancel",
		remove: "Delete",
		confirmRemove: "Yes, delete this mix",
		saved: "Saved on this device.",
		deleted: "Deleted.",
		renamed: "Renamed.",
		full: "You have 200 mixes, the most this device keeps. Delete one to save another.",
		failed: "Could not save on this device. The browser may be blocking storage. Try Export in My data.",
		timerNone: "No timer",
		timerCountdown: "Countdown",
		timerSleep: "Sleep fade",
		timerPomodoro: "Focus and break"
	},
	milestones: {
		heading: "Gentle milestones",
		help: "A small, kind look at your rest habit. There is no score, no goal and no pressure.",
		hide: "Hide milestones",
		show: "Show milestones",
		hidden: "Milestones are hidden. Nothing is counted on screen. You can show them again any time.",
		reset: "Reset milestones",
		confirmReset: "Yes, clear my milestones",
		resetDone: "Milestones cleared.",
		earned: "Reached",
		waiting: "Whenever you are ready",
		stats: {
			sessions: "Sessions",
			minutes: "Minutes listened",
			days: "Days you listened",
			streak: "Calm days in a row",
			longest: "Longest session (minutes)"
		},
		how: [
			"Sessions: each time you press play and stop, if it lasted at least 1 minute.",
			"Minutes listened: the time between play and stop, added up. One session counts at most 12 hours.",
			"Days you listened: different calendar days, in your own time zone, with at least one session.",
			"Calm days in a row: days in a row with a session. One missed day is forgiven, up to once a week. A longer pause just starts a new count, with no message.",
			"All of this is worked out on your device from your own listening log. Nothing is sent anywhere."
		],
		items: {
			"first-session": {
				name: "First session",
				note: "You gave yourself a pause."
			},
			"three-days": {
				name: "Three calm days",
				note: "Three days in a row, with room for a rest day."
			},
			"ten-sessions": {
				name: "Ten sessions",
				note: "A habit of small breaks is forming."
			},
			"one-hour": {
				name: "One hour of rest",
				note: "An hour of sound for your mind."
			},
			"five-hours": {
				name: "Five hours of rest",
				note: "Five gentle hours. Well done."
			},
			"first-sleep-fade": {
				name: "First full sleep fade",
				note: "You let the sound fade you toward sleep."
			},
			"took-a-break": {
				name: "Took a break",
				note: "You rested during a focus timer."
			}
		},
		reminderHeading: "Gentle reminder",
		reminderHelp: "A short line shown here once a day when you open Sanctuary. It stays inside the app. It never sends a notification.",
		reminderOn: "Show my reminder",
		reminderLabel: "Reminder text",
		reminderSave: "Save reminder",
		reminderSaved: "Reminder saved."
	},
	data: {
		heading: "My data",
		help: "Everything lives in this browser. You hold the file, you decide what happens to it.",
		where: "Saved on this device only.",
		notSaved: "This browser is not keeping data between visits (private mode or blocked storage). Export a file to keep your mixes.",
		safariNote: "Some browsers clear site data after a few weeks of no use. Export a file now and then to be safe.",
		export: "Export my data",
		exportHelp: "Downloads one file with your mixes, favorites and milestones.",
		exported: "File ready. Check your downloads.",
		import: "Import from a file",
		importHelp: "Choose a Zonked file. It is checked first and every value is brought into the safe range.",
		merge: "Add to what I have",
		replace: "Replace my mixes",
		imported: "Imported.",
		skipped: "Some items could not be read and were skipped.",
		errors: {
			"too-big": "That file is too big. Zonked files are under 256 KB.",
			"not-json": "That file could not be read as a Zonked file.",
			"not-zonked": "That is not a Zonked file.",
			"unknown-version": "That file comes from a version Zonked does not know, so it was not used.",
			"too-many": "That file has too many mixes (the limit is 200).",
			"read-failed": "The file could not be opened."
		},
		resetHeading: "Delete everything",
		resetHelp: "Removes your mixes, favorites, milestones and listening log from this browser. Your saved scripts stay. This cannot be undone.",
		reset: "Delete my data",
		confirmReset: "Yes, delete everything",
		resetDone: "Everything was deleted from this device.",
		cancel: "Cancel"
	},
	common: {
		loading: "Loading",
		saveFailed: "Could not save on this device."
	}
};
// ../../web/src/ui/sanctuary/download.ts
function V(e, t) {
	let n = URL.createObjectURL(new Blob([t], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, r.rel = "noopener", document.body.append(r), r.click(), r.remove(), window.setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
// ../../web/src/ui/sanctuary/DataPanel.tsx
function pe({ data: e, now: t }) {
	let n = B.data, [a, o] = i("merge"), [s, c] = i(null), [l, u] = i(!1), d = r(null), f = async (t) => {
		if (t === void 0) return;
		if (t.size > 262144) {
			c(n.errors["too-big"]);
			return;
		}
		let r;
		try {
			r = await t.text();
		} catch {
			c(n.errors["read-failed"]);
			return;
		}
		let i = await e.importText(r, a);
		c(i === null ? n.imported : n.errors[i]), d.current && (d.current.value = "");
	};
	return /* @__PURE__ */ j("div", {
		className: "sx-stack",
		"data-testid": "sanctuary-data",
		children: [
			/* @__PURE__ */ A("p", {
				className: "sx-muted",
				children: n.help
			}),
			/* @__PURE__ */ A("p", {
				"data-testid": "sanctuary-persist",
				children: e.persistent ? n.where : n.notSaved
			}),
			/* @__PURE__ */ A("p", {
				className: "sx-muted",
				children: n.safariNote
			}),
			/* @__PURE__ */ j("div", {
				className: "sx-card",
				children: [/* @__PURE__ */ A("button", {
					type: "button",
					className: "btn sx-primary",
					"data-testid": "sanctuary-export",
					onClick: () => {
						let r = new Date(t());
						V(`zonked-${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, "0")}-${String(r.getDate()).padStart(2, "0")}.json`, e.exportText()), c(n.exported);
					},
					children: n.export
				}), /* @__PURE__ */ A("p", {
					className: "sx-muted",
					children: n.exportHelp
				})]
			}),
			/* @__PURE__ */ j("div", {
				className: "sx-card",
				children: [
					/* @__PURE__ */ A("label", {
						className: "sx-label",
						htmlFor: "sx-import",
						children: n.import
					}),
					/* @__PURE__ */ A("p", {
						className: "sx-muted",
						children: n.importHelp
					}),
					/* @__PURE__ */ j("fieldset", {
						className: "sx-fieldset",
						children: [
							/* @__PURE__ */ A("legend", {
								className: "sx-muted",
								children: n.import
							}),
							/* @__PURE__ */ j("label", {
								className: "sx-check",
								children: [/* @__PURE__ */ A("input", {
									type: "radio",
									name: "sx-import-mode",
									checked: a === "merge",
									onChange: () => o("merge")
								}), n.merge]
							}),
							/* @__PURE__ */ j("label", {
								className: "sx-check",
								children: [/* @__PURE__ */ A("input", {
									type: "radio",
									name: "sx-import-mode",
									checked: a === "replace",
									onChange: () => o("replace")
								}), n.replace]
							})
						]
					}),
					/* @__PURE__ */ A("input", {
						id: "sx-import",
						ref: d,
						"data-testid": "sanctuary-import",
						className: "sx-input",
						type: "file",
						accept: "application/json,.json",
						onChange: (e) => void f(e.target.files?.[0])
					})
				]
			}),
			/* @__PURE__ */ A("p", {
				role: "status",
				"data-testid": "sanctuary-data-message",
				children: s
			}),
			/* @__PURE__ */ j("div", {
				className: "sx-card",
				children: [
					/* @__PURE__ */ A("h4", {
						className: "sx-h4",
						children: n.resetHeading
					}),
					/* @__PURE__ */ A("p", {
						className: "sx-muted",
						children: n.resetHelp
					}),
					l ? /* @__PURE__ */ j(k, { children: [/* @__PURE__ */ A("button", {
						type: "button",
						className: "btn",
						"data-testid": "sanctuary-reset-yes",
						onClick: () => void e.resetAll().then(() => u(!1)),
						children: n.confirmReset
					}), /* @__PURE__ */ A("button", {
						type: "button",
						className: "btn",
						onClick: () => u(!1),
						children: n.cancel
					})] }) : /* @__PURE__ */ A("button", {
						type: "button",
						className: "btn",
						"data-testid": "sanctuary-reset",
						onClick: () => u(!0),
						children: n.reset
					})
				]
			})
		]
	});
}
// ../../web/src/ui/sanctuary/MixesPanel.tsx
function me(e) {
	let t = e.timer, n = B.mixes, r = t.kind === "countdown" ? `${n.timerCountdown} ${t.minutes ?? 0} min` : t.kind === "sleep-fade" ? `${n.timerSleep} ${t.minutes ?? 0} min` : t.kind === "pomodoro" ? `${n.timerPomodoro} ${t.focusMin ?? 0}/${t.breakMin ?? 0} min` : n.timerNone;
	return `${e.voice.mode}, ${e.voice.beatHz.toFixed(1)} Hz, ${r}`;
}
function he({ mix: e, data: t, playing: n, onLoad: r }) {
	let [a, o] = i("view"), [s, c] = i(e.name), l = t.favorites.items.some((t) => t.kind === "mix" && t.id === e.id), u = B.mixes;
	return /* @__PURE__ */ A("li", {
		className: "sx-row sx-wrap",
		"data-testid": `sanctuary-mix-${e.id}`,
		"aria-current": n ? "true" : void 0,
		children: a === "rename" ? /* @__PURE__ */ j(k, { children: [
			/* @__PURE__ */ A("label", {
				className: "sx-label",
				htmlFor: `sx-rn-${e.id}`,
				children: u.renameLabel
			}),
			/* @__PURE__ */ A("input", {
				id: `sx-rn-${e.id}`,
				"data-testid": "sanctuary-rename-input",
				className: "sx-input",
				maxLength: 60,
				value: s,
				onChange: (e) => c(e.target.value)
			}),
			/* @__PURE__ */ A("button", {
				type: "button",
				className: "btn",
				"data-testid": "sanctuary-rename-ok",
				onClick: () => void t.renameMix(e.id, s).then(() => o("view")),
				children: u.confirmRename
			}),
			/* @__PURE__ */ A("button", {
				type: "button",
				className: "btn",
				onClick: () => o("view"),
				children: u.cancel
			})
		] }) : /* @__PURE__ */ j(k, { children: [
			/* @__PURE__ */ j("span", {
				className: "sx-grow",
				children: [/* @__PURE__ */ A("strong", { children: e.name }), /* @__PURE__ */ A("span", {
					className: "sx-muted sx-block",
					children: me(e)
				})]
			}),
			/* @__PURE__ */ A("button", {
				type: "button",
				className: "btn",
				"data-testid": "sanctuary-mix-play",
				onClick: () => r(e),
				children: u.load
			}),
			/* @__PURE__ */ A("button", {
				type: "button",
				className: "btn",
				"aria-pressed": l,
				"aria-label": `${l ? B.favorites.remove : B.favorites.add}: ${e.name}`,
				"data-testid": "sanctuary-mix-fav",
				onClick: () => void t.toggleFavorite("mix", e.id),
				children: l ? B.favorites.favorited : B.favorites.add
			}),
			/* @__PURE__ */ A("button", {
				type: "button",
				className: "btn",
				"data-testid": "sanctuary-mix-rename",
				onClick: () => {
					c(e.name), o("rename");
				},
				children: u.rename
			}),
			a === "delete" ? /* @__PURE__ */ j(k, { children: [/* @__PURE__ */ A("button", {
				type: "button",
				className: "btn",
				"data-testid": "sanctuary-mix-delete-yes",
				onClick: () => void t.deleteMix(e.id),
				children: u.confirmRemove
			}), /* @__PURE__ */ A("button", {
				type: "button",
				className: "btn",
				onClick: () => o("view"),
				children: u.cancel
			})] }) : /* @__PURE__ */ A("button", {
				type: "button",
				className: "btn",
				"data-testid": "sanctuary-mix-delete",
				onClick: () => o("delete"),
				children: u.remove
			})
		] })
	});
}
function ge({ data: e, nowPlaying: t, currentMix: n, onLoadMix: r }) {
	let [a, o] = i(""), s = n(), c = B.mixes;
	return /* @__PURE__ */ j("div", {
		className: "sx-stack",
		"data-testid": "sanctuary-mixes",
		children: [
			/* @__PURE__ */ A("p", {
				className: "sx-muted",
				children: c.help
			}),
			/* @__PURE__ */ j("form", {
				className: "sx-card",
				onSubmit: (t) => {
					t.preventDefault(), e.saveMix(n(), a).then((e) => e && o(""));
				},
				children: [
					/* @__PURE__ */ A("label", {
						className: "sx-label",
						htmlFor: "sx-mix-name",
						children: c.nameLabel
					}),
					/* @__PURE__ */ A("input", {
						id: "sx-mix-name",
						"data-testid": "sanctuary-mix-name",
						className: "sx-input",
						maxLength: 60,
						value: a,
						placeholder: c.namePlaceholder,
						onChange: (e) => o(e.target.value)
					}),
					/* @__PURE__ */ A("button", {
						type: "submit",
						className: "btn sx-primary",
						"data-testid": "sanctuary-mix-save",
						disabled: s === null,
						children: c.save
					}),
					s === null ? /* @__PURE__ */ A("p", {
						className: "sx-muted",
						children: c.nothing
					}) : null
				]
			}),
			e.mixes.length === 0 ? /* @__PURE__ */ A("p", {
				"data-testid": "sanctuary-mixes-empty",
				children: c.empty
			}) : /* @__PURE__ */ A("ul", {
				className: "sx-rows",
				"data-testid": "sanctuary-mixes-list",
				children: e.mixes.map((n) => /* @__PURE__ */ A(he, {
					mix: n,
					data: e,
					playing: t?.kind === "mix" && t.id === n.id,
					onLoad: r
				}, n.id))
			})
		]
	});
}
// ../../web/src/ui/sanctuary/useSanctuaryData.ts
var _e = 5e3, H = D([], 0, 0);
function ve(o, c) {
	let [l, u] = i(!1), [d, p] = i(!0), [m, h] = i([]), [g, _] = i(w), [v, y] = i(O), b = r(O), x = e((e) => {
		b.current = e, y(e);
	}, []), [ee, S] = i(H), [T, k] = i(null), [A, j] = i(null), M = r(!0), N = () => new Date(c()).getTimezoneOffset(), P = e(async (e) => {
		try {
			return await e(), !0;
		} catch {
			return M.current && j(B.mixes.failed), !1;
		}
	}, []), F = e((e, t) => o.setRecord(e, t), [o]);
	t(() => (M.current = !0, (async () => {
		let e = c(), [t, n, r, i, a] = await Promise.all([
			o.listMixes(),
			o.getRecord("favorites"),
			o.getRecord("milestones"),
			o.listLogs(_e),
			o.persistent()
		]), s = D(i, e, N()), l = oe(E(r, e), s, e), d = se(l.state, e, N());
		(l.added.length > 0 || d.show) && await o.setRecord("milestones", d.state), M.current && (h(t), _(C(n, e)), x(d.state), S(s), k(d.show ? d.state.reminder.text : null), p(a), u(!0));
	})().catch(() => {
		M.current && (j(B.common.saveFailed), u(!0));
	}), () => {
		M.current = !1;
	}), [o]);
	let I = e(async (e, t) => e === null ? !1 : m.length >= 200 ? (j(B.mixes.full), !1) : P(async () => {
		let n = s(e, a(t.trim() || "My mix", m.map((e) => e.name)), c());
		await o.putMix(n), h((e) => [n, ...e]), j(B.mixes.saved);
	}), [
		P,
		m,
		c,
		o
	]), L = e((e, t) => P(async () => {
		let n = m.find((t) => t.id === e);
		if (n === void 0) return;
		let r = f(n, a(t, m.filter((t) => t.id !== e).map((e) => e.name)), c());
		await o.putMix(r), h((t) => t.map((t) => t.id === e ? r : t)), j(B.mixes.renamed);
	}), [
		P,
		m,
		c,
		o
	]), R = e((e, t) => P(async () => {
		let n = te(g, e, t, c());
		await F("favorites", n), _(n);
	}), [
		g,
		P,
		c,
		F
	]), z = e((e) => P(async () => {
		await o.deleteMix(e);
		let t = ne(g, "mix", e);
		t !== g && (await F("favorites", t), _(t)), h((t) => t.filter((t) => t.id !== e)), j(B.mixes.deleted);
	}), [
		g,
		P,
		F,
		o
	]), V = e((e) => P(async () => {
		let t = e(b.current);
		x(t), await F("milestones", t);
	}), [
		P,
		F,
		x
	]);
	return {
		ready: l,
		persistent: d,
		mixes: m,
		favorites: g,
		milestones: v,
		stats: ee,
		reminder: T,
		notice: A,
		saveMix: I,
		importText: e(async (e, t) => {
			let n = c(), r = de(e, n);
			return r.ok ? await P(async () => {
				let e = fe(m, r.mixes, t, n);
				if (t === "replace") for (let e of m) await o.deleteMix(e.id);
				for (let t of e) await o.putMix(t);
				let i = t === "replace" ? [] : m, a = [...r.favorites.items, ...g.items.filter((e) => t === "merge" || e.kind === "template")], s = C({
					v: 1,
					items: a
				}, n);
				if (await F("favorites", s), r.feel !== null) {
					let e = ae();
					ie(e, t === "merge" ? [...re(e), ...r.feel] : r.feel);
				}
				_(s), h([...e, ...i].sort((e, t) => t.updatedAt - e.updatedAt)), j(r.skipped > 0 ? `${B.data.imported} ${B.data.skipped}` : B.data.imported);
			}) ? null : "read-failed" : r.error;
		}, [
			g,
			P,
			m,
			c,
			F,
			o
		]),
		...n(() => ({
			renameMix: L,
			deleteMix: z,
			toggleFavorite: R,
			setHidden: (e) => V((t) => ({
				...t,
				hidden: e
			})),
			resetMilestones: async () => {
				await V(le), j(B.milestones.resetDone);
			},
			setReminder: async (e, t) => {
				await V((n) => ({
					...n,
					reminder: {
						...n.reminder,
						on: e,
						text: ce(t)
					}
				})), j(B.milestones.reminderSaved);
			},
			exportText: () => ue(m, g, v, c(), re(ae())),
			resetAll: () => P(async () => {
				await o.clearSanctuary(), h([]), _(w), x(O), S(H), k(null), j(B.data.resetDone);
			})
		}), [
			g,
			P,
			v,
			m,
			c,
			V,
			z,
			L,
			x,
			o,
			R
		])
	};
}
// ../../web/src/app/neuro.ts
function ye(e) {
	return {
		l: e.carrierHz - e.beatHz / 2,
		r: e.carrierHz + e.beatHz / 2
	};
}
// ../../web/src/catalog/bands.ts
var U = {
	garcia: "S1",
	chaieb: "S2",
	lane: "S4",
	zhou: "S8",
	ingendoh: "S12",
	goodin: "S7",
	padma: "S6",
	mallik: "S11"
}, W = "Not a medical device. Results vary and may not happen for you.", G = [
	{
		name: "Delta",
		minHz: .5,
		maxHz: 4,
		mayHelp: "rest and sleep",
		evidence: "limited",
		note: `Little direct research on beats at this range. Steady noise has some sleep studies. ${W}`,
		sources: [U.zhou, U.ingendoh]
	},
	{
		name: "Theta",
		minHz: 4,
		maxHz: 8,
		mayHelp: "meditation and drowsy calm",
		evidence: "preliminary",
		note: `Small studies only. ${W}`,
		sources: [U.chaieb, U.ingendoh]
	},
	{
		name: "Alpha",
		minHz: 8,
		maxHz: 13,
		mayHelp: "stress relief and relaxed focus",
		evidence: "mixed",
		note: `Some trials show lower anxiety, others show no effect. ${W}`,
		sources: [
			U.garcia,
			U.padma,
			U.mallik
		]
	},
	{
		name: "Beta",
		minHz: 13,
		maxHz: 30,
		mayHelp: "alert focus",
		evidence: "mixed",
		note: `One small study saw better vigilance, another saw no change. ${W}`,
		sources: [
			U.lane,
			U.goodin,
			U.garcia
		]
	},
	{
		name: "Gamma",
		minHz: 30,
		maxHz: 40,
		mayHelp: "alert attention (experimental)",
		evidence: "limited",
		note: `Very little evidence. Keep sessions short and volume low. ${W}`,
		sources: [U.chaieb, U.ingendoh]
	}
];
function K(e) {
	let t = Number.isFinite(e) ? e : 0;
	return G.find((e) => t >= e.minHz && t < e.maxHz) ?? (t >= 40 ? G[4] : G[0]);
}
// ../../web/src/ui/dialBands.ts
var q = {
	Delta: "deep rest",
	Theta: "dreamy",
	Alpha: "relaxed",
	Beta: "alert",
	Gamma: "sharp"
}, be = .01;
function xe(e) {
	let t = [];
	for (let e = 0; e <= 100; e += 1) {
		let n = e * be, r = K(N(n)).name, i = t[t.length - 1];
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
function Se(e) {
	let t = K(e);
	return `${t.name}: ${q[t.name]}. About ${Math.round(e)} pulses a second.`;
}
function Ce(e) {
	let t = N(e), n = K(t);
	return `${Math.round(t)} hertz, ${n.name}, ${q[n.name]}`;
}
// ../../web/src/ui/advanced/CalmAlertPanel.tsx
var we = 25, Te = .3;
function Ee({ snap: e, player: t }) {
	let [n, r] = i(Te), [a, o] = i(!1), s = ye(e.voice), c = Math.abs(s.r - s.l), l = a ? K(N(n)).name : K(c).name, u = e.voice.layers ?? y;
	return /* @__PURE__ */ j("div", {
		className: "adv-panel",
		"data-testid": "adv-dial",
		children: [
			/* @__PURE__ */ j("div", {
				className: "adv-ends",
				children: [/* @__PURE__ */ A("span", { children: "Calm" }), /* @__PURE__ */ A("span", { children: "Alert" })]
			}),
			/* @__PURE__ */ A(I, {
				id: "adv-dial",
				testId: "adv-dial-input",
				min: 0,
				max: 1,
				step: .01,
				value: n,
				valueText: Ce(n),
				bubbleText: `${N(n)} Hz`,
				bands: xe(l),
				onChange: (e) => {
					r(e), o(!0), t.setBeatOverride(N(e)), t.setLayerOverride(M(e, u));
				}
			}),
			/* @__PURE__ */ j("p", {
				className: "adv-line",
				"data-testid": "adv-dial-readout",
				children: [
					"Pulse speed now: ",
					c.toFixed(1),
					" Hz (",
					K(c).name,
					")"
				]
			}),
			/* @__PURE__ */ A("p", {
				className: "adv-note",
				"data-testid": "adv-dial-meaning",
				children: Se(c)
			}),
			c > we && /* @__PURE__ */ A("p", {
				className: "adv-note",
				"data-testid": "adv-hearing-note",
				children: "Keep it quiet. Pulses above 25 Hz can feel tiring."
			}),
			/* @__PURE__ */ A("button", {
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
var De = 50;
function Oe({ text: e, onText: t, onPlay: r }) {
	let i = n(() => x(e), [e]);
	return /* @__PURE__ */ j("div", {
		className: "adv-panel",
		"data-testid": "adv-editor",
		children: [
			/* @__PURE__ */ A("label", {
				htmlFor: "adv-sbg-text",
				children: ".sbg script"
			}),
			/* @__PURE__ */ A("textarea", {
				id: "adv-sbg-text",
				className: "adv-text",
				"data-testid": "adv-editor-text",
				spellCheck: !1,
				value: e,
				onChange: (e) => t(e.target.value),
				"aria-describedby": "adv-sbg-diag"
			}),
			/* @__PURE__ */ A("div", {
				id: "adv-sbg-diag",
				role: "status",
				"aria-live": "polite",
				"data-testid": "adv-diagnostics",
				children: i.diagnostics.length === 0 ? /* @__PURE__ */ A("p", {
					className: "adv-note",
					children: "No problems."
				}) : /* @__PURE__ */ A("ul", {
					className: "adv-diag",
					children: i.diagnostics.slice(0, De).map((e, t) => /* @__PURE__ */ j("li", {
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
			/* @__PURE__ */ A("button", {
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
var ke = 80, J = (e) => e.replace(/[^\w.-]+/g, "_") || "script";
function Ae({ text: e, name: t, onImport: n }) {
	let [r, a] = i("");
	return /* @__PURE__ */ j("div", {
		className: "adv-panel",
		"data-testid": "adv-io",
		children: [/* @__PURE__ */ j("div", {
			className: "adv-actions",
			children: [/* @__PURE__ */ j("label", {
				className: "adv-btn adv-file",
				children: ["Import .sbg", /* @__PURE__ */ A("input", {
					type: "file",
					accept: ".sbg,.txt,text/plain",
					"data-testid": "adv-import-input",
					onChange: (e) => {
						let t = e.target.files?.[0];
						e.target.value = "", t !== void 0 && (t.size > b.maxBytes ? a(`That file is ${t.size} bytes. The limit is ${b.maxBytes} bytes.`) : t.text().then((e) => {
							n(e, t.name.replace(/\.[^.]*$/, "").slice(0, ke) || "Imported"), a(`Imported ${t.name}.`);
						}, () => a("Could not read that file.")));
					}
				})]
			}), /* @__PURE__ */ A("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-export",
				onClick: () => {
					let n = URL.createObjectURL(new Blob([e], { type: "text/plain" })), r = document.createElement("a");
					r.href = n, r.download = `${J(t)}.sbg`, r.click(), URL.revokeObjectURL(n), a(`Saved ${J(t)}.sbg.`);
				},
				children: "Export .sbg"
			})]
		}), /* @__PURE__ */ A("p", {
			className: "adv-note",
			role: "status",
			"aria-live": "polite",
			"data-testid": "adv-io-note",
			children: r
		})]
	});
}
// ../../web/src/ui/advanced/MixPanel.tsx
var je = [
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
], Me = .6, Y = (e) => Math.round(e * 100);
function Ne({ snap: e, player: t }) {
	let n = e.voice.layers ?? y, r = e.voice.noise, i = r === "violet" ? Me : 1, a = Math.min(i, e.voice.noiseLevel);
	return /* @__PURE__ */ j("div", {
		className: "adv-panel",
		"data-testid": "adv-mix",
		children: [
			je.map(([e, r, i]) => /* @__PURE__ */ j("div", {
				className: "adv-row",
				children: [/* @__PURE__ */ A("label", {
					htmlFor: `adv-mix-${e}`,
					children: i
				}), /* @__PURE__ */ A(I, {
					id: `adv-mix-${e}`,
					testId: `adv-mix-${e}`,
					min: 0,
					max: 1,
					step: .05,
					value: n[r],
					valueText: `${Y(n[r])} percent`,
					bubbleText: `${Y(n[r])}`,
					ticks: P(),
					onChange: (e) => t.setLayerOverride({ [r]: e })
				})]
			}, e)),
			r !== "off" && /* @__PURE__ */ j("div", {
				className: "adv-row",
				children: [/* @__PURE__ */ A("label", {
					htmlFor: "adv-mix-noise",
					children: "Background noise"
				}), /* @__PURE__ */ A(I, {
					id: "adv-mix-noise",
					testId: "adv-mix-noise",
					min: 0,
					max: i,
					step: .05,
					value: a,
					valueText: `${Y(a)} percent`,
					bubbleText: `${Y(a)}`,
					ticks: P(i),
					onChange: (e) => t.setNoiseOverride({ noiseLevel: Math.min(i, e) })
				})]
			}),
			r === "violet" && /* @__PURE__ */ A("p", {
				className: "adv-note",
				"data-testid": "adv-violet-note",
				children: "Violet is bright. Start very quiet."
			}),
			/* @__PURE__ */ A("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-mix-reset",
				onClick: () => t.clearLayerOverrides(),
				children: "Reset to the sound"
			})
		]
	});
}
// ../../web/src/ui/advanced/HealthPanel.tsx
function Pe() {
	let [e, n] = i(() => d.count(Date.now(), o));
	t(() => {
		let e = setInterval(() => n(d.count(Date.now(), o)), 2e3);
		return () => clearInterval(e);
	}, []);
	let r = l(e);
	return /* @__PURE__ */ j("div", {
		"data-testid": "sound-health",
		children: [
			/* @__PURE__ */ A("p", {
				role: "status",
				"data-testid": "sound-health-line",
				children: u(e)
			}),
			r !== "" && /* @__PURE__ */ A("p", {
				className: "meta",
				"data-testid": "sound-health-hint",
				children: r
			}),
			/* @__PURE__ */ A("p", {
				className: "meta",
				children: "Counted on this device only. Never sent anywhere."
			})
		]
	});
}
// ../../web/src/ui/useFrame.ts
function Fe(e, n) {
	let i = r(e);
	t(() => {
		i.current = e;
	}), t(() => {
		if (!n) return;
		let e = 0, t = 0, r = (n) => {
			let a = t === 0 ? 0 : Math.min(.25, (n - t) / 1e3);
			t = n, i.current(a), e = requestAnimationFrame(r);
		}, a = () => {
			document.hidden ? (e !== 0 && cancelAnimationFrame(e), e = 0) : e === 0 && (t = 0, e = requestAnimationFrame(r));
		};
		return document.addEventListener("visibilitychange", a), a(), () => {
			document.removeEventListener("visibilitychange", a), e !== 0 && cancelAnimationFrame(e);
		};
	}, [n]);
}
// ../../web/src/ui/Scope.tsx
var X = 1e3, Z = 300, Ie = 512, Le = 660, Re = 700, Q = 300, ze = "#FFE600", Be = "#00E5A8";
function Ve(e, t, n) {
	if (e.clearRect(0, 0, X, Z), e.lineWidth = 1, e.strokeStyle = "rgba(255,255,255,0.12)", e.beginPath(), e.moveTo(0, Z / 2), e.lineTo(Le, Z / 2), e.rect(Re, 0, Q, Q), e.moveTo(850, 0), e.lineTo(850, Q), e.moveTo(Re, Q / 2), e.lineTo(1e3, Q / 2), e.stroke(), n < 2) return;
	let r = Z * .45, i = Le / (n - 1);
	e.lineWidth = 2, e.strokeStyle = ze, e.beginPath();
	for (let a = 0; a < n; a++) {
		let n = Z / 2 - (t[a * 2] ?? 0) * r;
		a === 0 ? e.moveTo(0, n) : e.lineTo(a * i, n);
	}
	e.stroke(), e.strokeStyle = Be, e.beginPath();
	for (let a = 0; a < n; a++) {
		let n = Z / 2 - (t[a * 2 + 1] ?? 0) * r;
		a === 0 ? e.moveTo(0, n) : e.lineTo(a * i, n);
	}
	e.stroke(), e.lineWidth = 1, e.strokeStyle = "rgba(255,184,0,0.8)", e.beginPath();
	let a = Q / 2;
	for (let r = 0; r < n; r++) {
		let n = 850 + (t[r * 2] ?? 0) * a * .9, i = a - (t[r * 2 + 1] ?? 0) * a * .9;
		r === 0 ? e.moveTo(n, i) : e.lineTo(n, i);
	}
	e.stroke();
}
function He(e, t) {
	if (t <= 0) return 0;
	let n = 0;
	for (let r = 0; r < t * 2; r++) n += (e[r] ?? 0) ** 2;
	return Math.sqrt(n / (t * 2));
}
function Ue({ telemetry: e, onLevel: t }) {
	let n = r(null), i = r(new Float32Array(Ie * 2));
	return Fe(() => {
		let r = n.current?.getContext("2d"), a = e.read(i.current);
		t?.(He(i.current, a)), r != null && Ve(r, i.current, a);
	}, !0), /* @__PURE__ */ A("canvas", {
		ref: n,
		className: "scope",
		"data-testid": "scope-canvas",
		width: X,
		height: Z,
		role: "img",
		"aria-label": "Left and right channel oscilloscope and stereo Lissajous plot"
	});
}
// ../../web/src/ui/advanced/ScopePanel.tsx
function We({ telemetry: e }) {
	return /* @__PURE__ */ A("div", {
		className: "adv-panel adv-scope",
		"data-testid": "adv-scope",
		children: /* @__PURE__ */ A(Ue, { telemetry: e })
	});
}
// ../../web/src/ui/advanced/TimersPanel.tsx
var Ge = (e, t, n) => Number.isFinite(e) ? Math.min(n, Math.max(t, Math.round(e))) : t;
function $(e) {
	return /* @__PURE__ */ j("div", {
		className: "adv-field",
		children: [/* @__PURE__ */ A("label", {
			htmlFor: e.id,
			children: e.label
		}), /* @__PURE__ */ A("input", {
			id: e.id,
			"data-testid": e.id,
			className: "adv-num",
			type: "number",
			inputMode: "numeric",
			min: e.min,
			max: e.max,
			value: e.value,
			onChange: (t) => e.onChange(Ge(Number(t.target.value), e.min, e.max))
		})]
	});
}
function Ke({ timer: e, player: t }) {
	let [n, r] = i(30), [a, o] = i(30), [s, c] = i(25), [l, u] = i(5), d = e.kind !== "none";
	return /* @__PURE__ */ j("div", {
		className: "adv-panel",
		"data-testid": "adv-timers",
		children: [
			/* @__PURE__ */ A("p", {
				className: "adv-line",
				"data-testid": "adv-timer-status",
				children: d ? `${e.kind}${e.phase === void 0 ? "" : `, ${e.phase}`}: ${F(e.remainingSec)} left` : "No timer is running."
			}),
			/* @__PURE__ */ j("div", {
				className: "adv-actions",
				children: [/* @__PURE__ */ A($, {
					id: "adv-timer-cd",
					label: "Countdown minutes",
					value: n,
					min: 1,
					max: 720,
					onChange: r
				}), /* @__PURE__ */ A("button", {
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
			/* @__PURE__ */ j("div", {
				className: "adv-actions",
				children: [/* @__PURE__ */ A($, {
					id: "adv-timer-sl",
					label: "Sleep fade minutes",
					value: a,
					min: 1,
					max: 720,
					onChange: o
				}), /* @__PURE__ */ A("button", {
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
			/* @__PURE__ */ j("div", {
				className: "adv-actions",
				children: [
					/* @__PURE__ */ A($, {
						id: "adv-timer-focus",
						label: "Focus minutes",
						value: s,
						min: 1,
						max: 180,
						onChange: c
					}),
					/* @__PURE__ */ A($, {
						id: "adv-timer-break",
						label: "Break minutes",
						value: l,
						min: 1,
						max: 60,
						onChange: u
					}),
					/* @__PURE__ */ A("button", {
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
			/* @__PURE__ */ A("button", {
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
function qe(e) {
	let [n, r] = i(() => e.snapshot());
	return t(() => e.subscribe(r), [e]), n;
}
// ../../web/src/ui/advanced/AdvancedPanels.tsx
var Je = [
	"Mix",
	"Calm to Alert",
	"Editor",
	"Import and export",
	"Timers",
	"Scope",
	"Sound health",
	"Saved mixes",
	"Your data"
];
function Ye({ engine: e, player: r, onClose: a, store: o }) {
	let s = n(() => r ?? new g(e, S, () => void 0), [r, e]);
	t(() => {
		if (r === void 0) return () => void s.stop();
	}, [r, s]);
	let c = qe(s), l = ve(n(() => o ?? v(), [o]), Date.now), [u, d] = i(_[0]?.sbg ?? ""), [f, p] = i("script"), m = {
		Mix: /* @__PURE__ */ A(Ne, {
			snap: c,
			player: s
		}),
		"Calm to Alert": /* @__PURE__ */ A(Ee, {
			snap: c,
			player: s
		}),
		Editor: /* @__PURE__ */ A(Oe, {
			text: u,
			onText: d,
			onPlay: (e) => void s.playCustom(e)
		}),
		"Import and export": /* @__PURE__ */ A(Ae, {
			text: u,
			name: f,
			onImport: (e, t) => {
				d(e), p(t);
			}
		}),
		Timers: /* @__PURE__ */ A(Ke, {
			timer: c.timer,
			player: s
		}),
		Scope: /* @__PURE__ */ A(We, { telemetry: e.telemetry }),
		"Sound health": /* @__PURE__ */ A(Pe, {}),
		"Saved mixes": /* @__PURE__ */ A("div", {
			className: "adv-panel sx-root",
			"data-testid": "adv-mixes",
			children: l.ready ? /* @__PURE__ */ A(ge, {
				data: l,
				nowPlaying: c.templateId === null ? null : {
					kind: "template",
					id: c.templateId
				},
				currentMix: () => s.getMixDraft(),
				onLoadMix: (e) => h("zonked.safety.v1") && s.playMix(e)
			}) : null
		}),
		"Your data": /* @__PURE__ */ A("div", {
			className: "adv-panel sx-root",
			"data-testid": "adv-data",
			children: l.ready ? /* @__PURE__ */ A(pe, {
				data: l,
				now: Date.now
			}) : null
		})
	};
	return /* @__PURE__ */ j("div", {
		className: "adv-panels",
		"data-testid": "advanced-panels",
		children: [Je.map((e, t) => /* @__PURE__ */ j("details", {
			className: "adv-section",
			open: t === 0,
			"data-testid": `adv-section-${e.toLowerCase().replace(/ /g, "-")}`,
			children: [/* @__PURE__ */ A("summary", { children: e }), m[e]]
		}, e)), a !== void 0 && /* @__PURE__ */ A("button", {
			type: "button",
			className: "adv-btn",
			"data-testid": "adv-close",
			onClick: a,
			children: "Close"
		})]
	});
}
export { Ye as AdvancedPanels };
