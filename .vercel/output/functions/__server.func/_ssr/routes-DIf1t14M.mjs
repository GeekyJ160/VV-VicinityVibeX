import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn } from "./client-B40BzJxt.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as GROK_PROVIDERS } from "./server-BsPHj5TB.mjs";
import { s as getMyProfile } from "./aura-api-Df_-ZHFk.mjs";
import { t as Button } from "./button-C3Y8m_s4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DIf1t14M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		let cancelled = false;
		getMyProfile().then((profile) => {
			if (cancelled) return;
			navigate({ to: profile ? "/discover" : "/onboard" });
		}).catch(() => {
			if (!cancelled) navigate({ to: "/onboard" });
		});
		return () => {
			cancelled = true;
		};
	}, [
		isPending,
		user,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative mx-auto flex min-h-dvh max-w-lg flex-col overflow-hidden px-6 pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-[12%] left-[-10%] size-64 rounded-full bg-[hsl(18_40%_48%/0.22)] blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-[18%] right-[-16%] size-72 rounded-full bg-[hsl(208_28%_46%/0.2)] blur-3xl" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative pt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.22em] text-muted",
						children: "Dallas–Fort Worth · nearby"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 font-display text-6xl font-medium tracking-tight",
						children: "Vicinity Vibe"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-[16ch] font-display text-2xl leading-snug text-fg/85",
						children: "Match the frequency."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-sm text-sm leading-relaxed text-muted",
						children: "A culture-first way to find your people. Your Vibe DNA is a living color — built from the rooms you keep, the work you make, and how you want to be met. Visible only to people already near you. Never a pin. Never a trail."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-auto flex flex-col gap-3 pt-16",
				children: [
					isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 animate-pulse rounded-lg bg-elevated" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Taking you in…"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						variant: p.providerId === "grok-google" ? "primary" : "outline",
						className: "w-full",
						onClick: () => void signIn(p.providerId, { callbackURL: "/" }),
						children: ["Continue with ", p.label]
					}, p.providerId)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "mt-1 text-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
						children: "Continue with email"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pt-2 text-center text-xs leading-relaxed text-subtle",
						children: "Location stays neighborhood-level. You choose who can find you. Ages 18+."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "pt-3 text-center text-xs text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "underline-offset-4 hover:underline",
								children: "Privacy"
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/terms",
								className: "underline-offset-4 hover:underline",
								children: "Terms"
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { Landing as component };
