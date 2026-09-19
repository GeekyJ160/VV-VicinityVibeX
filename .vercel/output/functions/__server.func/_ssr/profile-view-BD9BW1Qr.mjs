import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { l as BadgeCheck } from "../_libs/lucide-react.mjs";
import { S as vibeColor, b as styleLabel, m as intentionLabel, t as DIMENSIONS, x as universeName } from "./aura-DBGkNbkG.mjs";
import { t as VibeOrb } from "./vibe-orb-O4T1NoWY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-view-BD9BW1Qr.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border border-border bg-elevated px-2.5 py-1 text-xs text-muted", className),
		...props
	});
}
function ProfileView({ person, className }) {
	const photo = person.photos[0];
	const color = vibeColor(person);
	const compat = "compatibility" in person ? person.compatibility : null;
	const shared = "sharedDimensions" in person ? person.sharedDimensions : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("flex flex-col", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative overflow-hidden rounded-xl bg-elevated",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[3/4] w-full",
				children: [
					photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: photo,
						alt: "",
						crossOrigin: "anonymous",
						className: "absolute inset-0 size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0",
						style: { background: `radial-gradient(circle at 40% 30%, ${color.glow}, ${color.css} 40%, #0c0b0a 78%)` }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-bg via-bg/20 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 flex items-end gap-3 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VibeOrb, {
								primary: person.primary,
								secondary: person.secondary,
								saturation: person.saturation,
								brightness: person.brightness,
								size: "md"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "truncate font-display text-2xl font-medium tracking-tight",
										children: person.displayName
									}), person.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
										className: "size-4 shrink-0 text-ok",
										strokeWidth: 1.75
									}) : null]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-sm text-fg/80",
									children: [
										person.pronouns,
										person.pronouns && person.neighborhood ? " · " : "",
										person.neighborhood
									]
								})]
							}),
							compat != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-2xl font-medium tabular-nums leading-none",
									children: compat
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[10px] uppercase tracking-[0.14em] text-muted",
									children: "freq"
								})]
							}) : null
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-5 px-1 pt-5",
			children: [
				person.voiceIntro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg leading-snug text-fg/90",
					children: person.voiceIntro
				}) : null,
				person.bio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: person.bio
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: person.universes.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: universeName(id) }, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: styleLabel(person.relationshipStyle) }), person.intentions.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: intentionLabel(id) }, id))]
				}),
				shared.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs uppercase tracking-[0.14em] text-subtle",
					children: "Shared dimensions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: shared.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "border-border-strong text-fg",
						children: DIMENSIONS[key].label
					}, key))
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimensionList, {
					person,
					highlight: shared
				}),
				person.perfectLocalDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-xs uppercase tracking-[0.14em] text-subtle",
					children: "A perfect local day"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-fg/90",
					children: person.perfectLocalDay
				})] }) : null,
				person.greenFlags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-xs uppercase tracking-[0.14em] text-subtle",
					children: "Green flags"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 text-sm text-fg/90",
					children: person.greenFlags.map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: flag }, flag))
				})] }) : null,
				person.redFlags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-xs uppercase tracking-[0.14em] text-subtle",
					children: "Red flags"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 text-sm text-muted",
					children: person.redFlags.map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: flag }, flag))
				})] }) : null
			]
		})]
	});
}
function DimensionList({ person, highlight }) {
	const ranked = [...Object.keys(person.dimensions)].sort((a, b) => person.dimensions[b] - person.dimensions[a]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 text-xs uppercase tracking-[0.14em] text-subtle",
		children: "Vibe DNA"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: ranked.map((key) => {
			const meta = DIMENSIONS[key];
			const value = person.dimensions[key];
			const on = highlight.includes(key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex justify-between text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: on ? "text-fg" : "text-muted",
					children: meta.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-subtle",
					children: value
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1 overflow-hidden rounded-full bg-elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full",
					style: {
						width: `${value}%`,
						background: on ? vibeColor(person).css : "rgb(243 239 232 / 0.28)"
					}
				})
			})] }, key);
		})
	})] });
}
//#endregion
export { ProfileView as t };
