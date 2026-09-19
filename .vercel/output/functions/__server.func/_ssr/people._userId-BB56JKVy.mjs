import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as getPerson, p as reportUser, t as blockUser, y as swipe } from "./aura-api-Df_-ZHFk.mjs";
import { c as REPORT_REASONS } from "./aura-DBGkNbkG.mjs";
import { r as Route$3 } from "./router-Cq8WFhNK.mjs";
import { t as Button } from "./button-C3Y8m_s4.mjs";
import { t as ProfileView } from "./profile-view-BD9BW1Qr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people._userId-BB56JKVy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PersonPage() {
	const { userId } = Route$3.useParams();
	const navigate = useNavigate();
	const [person, setPerson] = (0, import_react.useState)(void 0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [safety, setSafety] = (0, import_react.useState)("idle");
	const [note, setNote] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getPerson({ data: userId }).then(setPerson).catch(() => setPerson(null));
	}, [userId]);
	if (person === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-5 h-96 animate-pulse rounded-xl bg-elevated" });
	if (!person) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "This person is ghosting the room"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/discover",
			className: "mt-4 inline-block text-sm text-muted underline",
			children: "Discover"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mb-3 text-xs uppercase tracking-[0.16em] text-muted",
				onClick: () => window.history.back(),
				children: "Back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileView, { person }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1",
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							const result = await swipe({ data: {
								toUserId: person.userId,
								action: "spark"
							} });
							if (result.matched) await navigate({
								to: "/chat/$chatId",
								params: { chatId: result.chatId }
							});
							else setNote("Spark sent. If they spark back, they land in Matches.");
						} finally {
							setBusy(false);
						}
					},
					children: "Spark"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setSafety(safety === "idle" ? "menu" : "idle"),
					children: "Safety"
				})]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: note
			}) : null,
			safety === "menu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-20 z-30 mx-auto max-w-lg px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface px-4 py-4 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Block hides them from you. Report also hides them and logs a reason."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: async () => {
									await blockUser({ data: person.userId });
									await navigate({ to: "/discover" });
								},
								children: "Block"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => setSafety("report"),
								children: "Report and block"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setSafety("idle"),
								children: "Cancel"
							})
						]
					})]
				})
			}) : null,
			safety === "report" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-20 z-30 mx-auto max-w-lg px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface px-4 py-4 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: "Why are you reporting?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-col gap-2",
						children: [REPORT_REASONS.map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: async () => {
								await reportUser({ data: {
									userId: person.userId,
									reason: reason.id
								} });
								await navigate({ to: "/discover" });
							},
							children: reason.label
						}, reason.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setSafety("idle"),
							children: "Cancel"
						})]
					})]
				})
			}) : null
		]
	});
}
//#endregion
export { PersonPage as component };
