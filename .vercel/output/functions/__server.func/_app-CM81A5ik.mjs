import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, d as useRouterState, m as Outlet, v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as useCurrentUserState } from "./_ssr/use-current-user-DG6UNzh9.mjs";
import { t as RedirectToSignIn } from "./_ssr/gates-C87p6P1Q.mjs";
import { s as getMyProfile } from "./_ssr/aura-api-Df_-ZHFk.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { a as MessageCircle, c as Compass, i as Orbit, n as User, o as Map } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-CM81A5ik.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/discover",
		label: "Discover",
		icon: Compass
	},
	{
		to: "/map",
		label: "Nearby",
		icon: Map
	},
	{
		to: "/universes",
		label: "Rooms",
		icon: Orbit
	},
	{
		to: "/matches",
		label: "Matches",
		icon: MessageCircle
	},
	{
		to: "/me",
		label: "Me",
		icon: User
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 pb-20",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "fixed inset-x-0 bottom-0 z-20 mx-auto max-w-lg border-t border-border bg-bg/92 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-5 px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
				children: NAV.map((item) => {
					const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] tracking-wide", active ? "text-fg" : "text-subtle"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							strokeWidth: active ? 1.9 : 1.6
						}), item.label]
					}) }, item.to);
				})
			})
		})]
	});
}
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [gate, setGate] = (0, import_react.useState)("load");
	(0, import_react.useEffect)(() => {
		if (isPending) return;
		if (!user) {
			setGate("load");
			return;
		}
		let cancelled = false;
		getMyProfile().then((profile) => {
			if (cancelled) return;
			if (!profile) {
				setGate("onboard");
				navigate({ to: "/onboard" });
				return;
			}
			setGate("ok");
		}).catch(() => {
			if (!cancelled) {
				setGate("onboard");
				navigate({ to: "/onboard" });
			}
		});
		return () => {
			cancelled = true;
		};
	}, [
		isPending,
		user,
		navigate
	]);
	if (isPending || user && gate === "load") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex min-h-dvh max-w-lg items-center justify-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-10 animate-pulse rounded-full bg-elevated" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (gate !== "ok") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-dvh bg-bg" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AppLayout as component };
