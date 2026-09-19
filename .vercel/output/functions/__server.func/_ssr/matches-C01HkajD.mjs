import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as getMatches } from "./aura-api-Df_-ZHFk.mjs";
import { t as VibeOrb } from "./vibe-orb-O4T1NoWY.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/matches-C01HkajD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Matches() {
	const [rows, setRows] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getMatches().then(setRows).catch(() => setRows([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-muted",
				children: "Matches"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl font-medium",
				children: "Same frequency"
			}),
			rows === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-3",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 animate-pulse rounded-xl bg-elevated" }, i))
			}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 max-w-xs text-sm text-muted",
				children: "When someone sparks you back, they land here. Start in Discover."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 flex flex-col",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/chat/$chatId",
						params: { chatId: row.chatId },
						className: "flex items-center gap-3 py-4",
						children: [row.other.photos[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: row.other.photos[0],
							alt: "",
							crossOrigin: "anonymous",
							className: "size-14 rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/15"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VibeOrb, {
							primary: row.other.primary,
							secondary: row.other.secondary,
							saturation: row.other.saturation,
							brightness: row.other.brightness,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium",
										children: row.other.displayName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-xs tabular-nums text-subtle",
										children: row.compatibility
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 truncate text-sm text-muted",
									children: row.lastMessage ?? "You are on the same frequency. Say something specific."
								}),
								row.lastAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-subtle",
									children: formatDistanceToNow(new Date(row.lastAt), { addSuffix: true })
								}) : null
							]
						})]
					})
				}, row.id))
			})
		]
	});
}
//#endregion
export { Matches as component };
