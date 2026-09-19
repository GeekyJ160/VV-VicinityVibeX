import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as listUniverses } from "./aura-api-Df_-ZHFk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/universes.index-COvUXEYd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Universes() {
	const [items, setItems] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listUniverses().then(setItems).catch(() => setItems([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-muted",
				children: "Universes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl font-medium",
				children: "Rooms you can keep"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-sm text-muted",
				children: "Communities with their own posts and nights out. Join the ones that already feel like yours."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 flex flex-col gap-3",
				children: items === null ? [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: "h-28 animate-pulse rounded-xl bg-elevated" }, i)) : items.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/universes/$universeId",
					params: { universeId: u.id },
					className: "block rounded-xl border border-border bg-surface px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: u.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs tabular-nums text-subtle",
								children: [
									u.memberCount,
									" in · ",
									u.activeNearby,
									" nearby"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: u.description
						}),
						u.joined ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs uppercase tracking-[0.14em] text-fg/70",
							children: "Joined"
						}) : null
					]
				}) }, u.id))
			})
		]
	});
}
//#endregion
export { Universes as component };
