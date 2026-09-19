import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { S as vibeColor } from "./aura-DBGkNbkG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vibe-orb-O4T1NoWY.js
var import_jsx_runtime = require_jsx_runtime();
function VibeOrb({ primary, secondary, saturation, brightness, size = "md", className }) {
	const color = vibeColor({
		primary,
		secondary,
		saturation,
		brightness
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		"aria-hidden": true,
		className: cn("relative inline-grid place-items-center", size === "sm" ? "size-9" : size === "md" ? "size-14" : size === "lg" ? "size-24" : "size-40", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute inset-[-18%] rounded-full opacity-70 blur-xl",
			style: { background: color.glow }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative block size-full rounded-full",
			style: {
				background: `radial-gradient(circle at 32% 28%, ${color.soft}, ${color.css} 58%, color-mix(in oklab, ${color.css} 55%, black) 100%)`,
				boxShadow: `inset 0 0 0 1px rgb(243 239 232 / 0.18)`
			}
		})]
	});
}
//#endregion
export { VibeOrb as t };
