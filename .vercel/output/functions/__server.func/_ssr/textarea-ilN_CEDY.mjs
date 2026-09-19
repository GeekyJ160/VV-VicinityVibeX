import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/textarea-ilN_CEDY.js
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full rounded-lg border border-border bg-elevated px-3 py-2.5 text-sm text-fg placeholder:text-subtle outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-accent/35", className),
		...props
	});
}
//#endregion
export { Textarea as t };
