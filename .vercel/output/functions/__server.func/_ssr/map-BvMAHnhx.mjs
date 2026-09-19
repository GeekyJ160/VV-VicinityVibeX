import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as spinRoulette, c as getNearby } from "./aura-api-Df_-ZHFk.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { s as Dices } from "../_libs/lucide-react.mjs";
import { _ as projectHood, g as neighborhoodPoint, i as HOOD_GEO } from "./aura-DBGkNbkG.mjs";
import { t as Button } from "./button-C3Y8m_s4.mjs";
import { t as VibeOrb } from "./vibe-orb-O4T1NoWY.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-BvMAHnhx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CITY_MARKS = [{
	name: "Fort Worth",
	...projectHood(32.755, -97.331)
}, {
	name: "Dallas",
	...projectHood(32.777, -96.797)
}];
function NearbyMap() {
	const navigate = useNavigate();
	const [me, setMe] = (0, import_react.useState)(null);
	const [people, setPeople] = (0, import_react.useState)(null);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [posts, setPosts] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [pick, setPick] = (0, import_react.useState)(null);
	const [spinning, setSpinning] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getNearby().then((data) => {
			setMe(data.me);
			setPeople(data.people);
			setEvents(data.events);
			setPosts(data.posts);
		}).catch(() => setPeople([]));
	}, []);
	const you = (0, import_react.useMemo)(() => {
		if (!me) return null;
		return neighborhoodPoint(me.neighborhood, me.userId);
	}, [me]);
	const grouped = (0, import_react.useMemo)(() => {
		const fw = [];
		const dal = [];
		for (const person of people ?? []) ((HOOD_GEO[person.neighborhood]?.city ?? "Dallas") === "Fort Worth" ? fw : dal).push(person);
		fw.sort((a, b) => b.compatibility - a.compatibility);
		dal.sort((a, b) => b.compatibility - a.compatibility);
		return {
			fw,
			dal
		};
	}, [people]);
	async function spin() {
		setSpinning(true);
		try {
			const next = await spinRoulette();
			setPick(next);
		} finally {
			setSpinning(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-4 pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-muted",
						children: "Nearby"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl font-medium",
							children: "The room, not the pin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => void spin(),
							disabled: spinning,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, { className: "size-4" }), spinning ? "Listening" : "Bored"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-sm text-sm text-muted",
						children: "People sit in neighborhoods, never coordinates. If they can see you with their eyes, they can see you here."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-4 mt-4 overflow-hidden rounded-xl border border-border bg-elevated",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/map-dfw.jpg",
						alt: "",
						className: "absolute inset-0 size-full object-cover opacity-70"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-linear-to-b from-bg/20 via-transparent to-bg/55" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-[420px] w-full",
						children: [
							CITY_MARKS.map((city) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute -translate-x-1/2 font-display text-lg tracking-tight text-fg/35",
								style: {
									left: `${city.x}%`,
									top: `${city.y}%`
								},
								children: city.name
							}, city.name)),
							events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "absolute z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/80 shadow-[0_0_0_6px_rgb(243_239_232/0.08)]",
								style: {
									left: `${event.x}%`,
									top: `${event.y}%`
								},
								"aria-label": event.title,
								onClick: () => setSelected(event)
							}, event.id)),
							people?.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "absolute z-20 size-11 -translate-x-1/2 -translate-y-1/2",
								style: {
									left: `${person.x}%`,
									top: `${person.y}%`
								},
								onClick: () => setSelected(person),
								"aria-label": `${person.displayName}, ${person.neighborhood}`,
								children: person.photos[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: person.photos[0],
									alt: "",
									crossOrigin: "anonymous",
									className: "size-9 rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/20"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VibeOrb, {
									primary: person.primary,
									secondary: person.secondary,
									saturation: person.saturation,
									brightness: person.brightness,
									size: "sm"
								})
							}, person.userId)),
							you ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-fg",
								style: {
									left: `${you.x}%`,
									top: `${Math.min(92, you.y + 7)}%`
								},
								children: "You"
							}) : null,
							people === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 animate-pulse bg-elevated" }) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "relative border-t border-border bg-bg/70 px-3 py-2 text-[11px] text-subtle",
						children: "Fort Worth west · Dallas east. Neighborhoods only. Never a pin."
					})
				]
			}),
			selected && "userId" in selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-4 rounded-xl border border-border bg-surface px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.14em] text-subtle",
							children: selected.neighborhood
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl",
							children: selected.displayName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: selected.voiceIntro
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl tabular-nums",
						children: selected.compatibility
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						onClick: () => void navigate({
							to: "/people/$userId",
							params: { userId: selected.userId }
						}),
						children: "Open profile"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setSelected(null),
						children: "Close"
					})]
				})]
			}) : selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-4 rounded-xl border border-border bg-surface px-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.14em] text-subtle",
						children: selected.universeName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl",
						children: selected.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							selected.location,
							" · ",
							new Date(selected.startsAt).toLocaleString(void 0, {
								weekday: "short",
								month: "short",
								day: "numeric",
								hour: "numeric"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fg/90",
						children: selected.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1",
							onClick: () => void navigate({
								to: "/universes/$universeId",
								params: { universeId: selected.universeId }
							}),
							children: "Open room"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setSelected(null),
							children: "Close"
						})]
					})
				]
			}) : null,
			pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouletteCard, {
				pick,
				onDismiss: () => setPick(null)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-4 pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityList, {
					title: "Fort Worth",
					people: grouped.fw,
					onOpen: (person) => setSelected(person)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityList, {
					title: "Dallas",
					people: grouped.dal,
					onOpen: (person) => setSelected(person)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-4 pt-2 pb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs uppercase tracking-[0.16em] text-subtle",
					children: "Live nearby"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-col",
					children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-border py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/people/$userId",
									params: { userId: post.userId },
									className: "text-sm font-medium",
									children: post.displayName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-subtle",
									children: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs uppercase tracking-[0.12em] text-subtle",
								children: post.universeName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-fg/90",
								children: post.body
							})
						]
					}, post.id))
				})]
			})
		]
	});
}
function CityList({ title, people, onOpen }) {
	if (people.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xs uppercase tracking-[0.16em] text-subtle",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 flex flex-col",
			children: people.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center gap-3 py-3 text-left",
					onClick: () => onOpen(person),
					children: [
						person.photos[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: person.photos[0],
							alt: "",
							crossOrigin: "anonymous",
							className: "size-11 rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/15"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VibeOrb, {
							primary: person.primary,
							secondary: person.secondary,
							saturation: person.saturation,
							brightness: person.brightness,
							size: "sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium",
								children: person.displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block truncate text-xs text-muted",
								children: person.neighborhood
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg tabular-nums text-fg/80",
							children: person.compatibility
						})
					]
				})
			}, person.userId))
		})]
	});
}
function RouletteCard({ pick, onDismiss }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mx-4 mt-4 rounded-xl border border-border-strong bg-surface px-4 py-4"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.16em] text-subtle",
				children: "Boredom roulette"
			}),
			pick.kind === "person" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl",
					children: pick.person.displayName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: pick.person.voiceIntro
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/people/$userId",
						params: { userId: pick.person.userId },
						children: "Meet this frequency"
					})
				})
			] }) : pick.kind === "event" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl",
					children: pick.event.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						pick.event.location,
						" · ",
						pick.event.universeName
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/universes/$universeId",
						params: { universeId: pick.event.universeId },
						children: "Open the night"
					})
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl",
					children: pick.post.displayName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: pick.post.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/universes/$universeId",
						params: { universeId: pick.post.universeId },
						children: "Join the board"
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-3 text-sm text-muted underline-offset-4 hover:underline",
				onClick: onDismiss,
				children: "Another time"
			})
		]
	});
}
//#endregion
export { NearbyMap as component };
