import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getDiscover, s as getMyProfile, y as swipe } from "./aura-api-Df_-ZHFk.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C3Y8m_s4.mjs";
import { t as VibeOrb } from "./vibe-orb-O4T1NoWY.mjs";
import { t as ProfileView } from "./profile-view-BD9BW1Qr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-D6CaFWPv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Discover() {
	const navigate = useNavigate();
	const [deck, setDeck] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [fly, setFly] = (0, import_react.useState)(null);
	const [match, setMatch] = (0, import_react.useState)(null);
	const [drag, setDrag] = (0, import_react.useState)({
		x: 0,
		active: false
	});
	const [ghost, setGhost] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getDiscover().then(setDeck).catch(() => setDeck([]));
		getMyProfile().then((p) => setGhost(p?.visibility === "ghost"));
	}, []);
	const current = deck?.[0];
	async function act(action) {
		if (!current || busy) return;
		setBusy(true);
		setFly(action === "spark" ? "right" : "left");
		try {
			const result = await swipe({ data: {
				toUserId: current.userId,
				action
			} });
			window.setTimeout(() => {
				setDeck((d) => d ? d.slice(1) : d);
				setFly(null);
				setDrag({
					x: 0,
					active: false
				});
				setBusy(false);
				if (result.matched) setMatch({
					other: result.other,
					chatId: result.chatId,
					compatibility: result.compatibility
				});
			}, 220);
		} catch {
			setFly(null);
			setBusy(false);
		}
	}
	function onPointerDown(e) {
		e.currentTarget.setPointerCapture(e.pointerId);
		setDrag({
			x: 0,
			active: true
		});
	}
	function onPointerMove(e) {
		if (!drag.active) return;
		setDrag((d) => ({
			...d,
			x: d.x + e.movementX
		}));
	}
	function onPointerUp() {
		if (!drag.active) return;
		if (drag.x > 88) act("spark");
		else if (drag.x < -88) act("pass");
		else setDrag({
			x: 0,
			active: false
		});
	}
	if (deck === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[70dvh] animate-pulse bg-elevated" });
	if (!current) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[70dvh] flex-col items-center justify-center px-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl",
				children: "The room is quiet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xs text-sm text-muted",
				children: "You have seen everyone nearby who is open right now. Check your matches or sit in a universe."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				onClick: () => void navigate({ to: "/universes" }),
				children: "Open rooms"
			})
		]
	});
	const shift = fly === "left" ? -140 : fly === "right" ? 140 : drag.x;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-3 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-muted",
					children: "Discover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-medium",
					children: "Nearby frequencies"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tabular-nums text-subtle",
					children: [deck.length, " open"]
				})]
			}),
			ghost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-muted",
				children: "Ghost is on. You can still look, but nearby people cannot find you."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("touch-pan-y", fly && "pointer-events-none transition-transform duration-200 ease-out"),
				style: {
					transform: `translateX(${shift}px) rotate(${shift / 28}deg)`,
					opacity: fly ? 0 : 1
				},
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onPointerCancel: onPointerUp,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileView, { person: current })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-20 z-10 mt-4 flex items-center justify-center gap-3 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						"aria-label": "Pass",
						disabled: busy,
						onClick: () => void act("pass"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "min-w-36",
						disabled: busy,
						onClick: () => void act("spark"),
						children: "Spark"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						disabled: busy,
						onClick: () => void navigate({ to: "/map" }),
						children: "Map"
					})
				]
			}),
			match ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 grid place-items-center bg-bg/80 px-6 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-xl border border-border bg-surface p-6 text-center shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VibeOrb, {
								primary: match.other.primary,
								secondary: match.other.secondary,
								saturation: match.other.saturation,
								brightness: match.other.brightness,
								size: "lg"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.18em] text-muted",
							children: "Same frequency"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl",
							children: match.other.displayName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [match.compatibility, " — you both sparked."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => void navigate({
									to: "/chat/$chatId",
									params: { chatId: match.chatId }
								}),
								children: "Open chat"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setMatch(null),
								children: "Keep looking"
							})]
						})
					]
				})
			}) : null
		]
	});
}
//#endregion
export { Discover as component };
