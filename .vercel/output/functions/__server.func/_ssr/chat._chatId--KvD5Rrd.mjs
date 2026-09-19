import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
import { f as reactToMessage, g as sendMessage, i as getChat, v as suggestOpeners, x as unmatch } from "./aura-api-Df_-ZHFk.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as VIBE_REACTIONS } from "./aura-DBGkNbkG.mjs";
import { i as Route$4 } from "./router-Cq8WFhNK.mjs";
import { t as Button } from "./button-C3Y8m_s4.mjs";
import { t as Input } from "./input-BF3jaAE4.mjs";
import { t as VibeOrb } from "./vibe-orb-O4T1NoWY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat._chatId--KvD5Rrd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChatPage() {
	const { chatId } = Route$4.useParams();
	const navigate = useNavigate();
	const me = useCurrentUser();
	const [other, setOther] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [compat, setCompat] = (0, import_react.useState)(0);
	const [shared, setShared] = (0, import_react.useState)([]);
	const [matchId, setMatchId] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [openers, setOpeners] = (0, import_react.useState)(null);
	const [asking, setAsking] = (0, import_react.useState)(false);
	const [missing, setMissing] = (0, import_react.useState)(false);
	const endRef = (0, import_react.useRef)(null);
	async function reload() {
		const data = await getChat({ data: chatId });
		if (!data) {
			setMissing(true);
			return;
		}
		setOther(data.other);
		setMessages(data.messages);
		setCompat(data.compatibility);
		setShared(data.sharedDimensions);
		setMatchId(data.matchId);
	}
	(0, import_react.useEffect)(() => {
		reload().catch(() => setMissing(true));
	}, [chatId]);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);
	if (missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "This thread closed"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/matches",
			className: "mt-4 inline-block text-sm text-muted underline",
			children: "Matches"
		})]
	});
	if (!other) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-5 h-40 animate-pulse rounded-xl bg-elevated" });
	async function send(text) {
		const next = text.trim();
		if (!next) return;
		setDraft("");
		setOpeners(null);
		await sendMessage({ data: {
			chatId,
			text: next
		} });
		await reload();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[calc(100dvh-5rem)] flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-bg/92 px-4 py-3 backdrop-blur-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/matches",
						className: "text-xs text-muted",
						children: "Back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/people/$userId",
						params: { userId: other.userId },
						className: "flex min-w-0 flex-1 items-center gap-2",
						children: [other.photos[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: other.photos[0],
							alt: "",
							crossOrigin: "anonymous",
							className: "size-9 rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/15"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VibeOrb, {
							primary: other.primary,
							secondary: other.secondary,
							saturation: other.saturation,
							brightness: other.brightness,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: other.displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs tabular-nums text-subtle",
								children: [compat, " freq"]
							})]
						})]
					}),
					matchId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-muted",
						onClick: async () => {
							await unmatch({ data: matchId });
							await navigate({ to: "/matches" });
						},
						children: "Unmatch"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-4 px-4 py-4",
				children: [
					messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface px-4 py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl",
								children: "Start specific"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [
									"You overlap on ",
									shared.length ? shared.join(", ") : "a quiet frequency",
									". Ask Vicinity Vibe for a first line, or write your own."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "mt-4",
								disabled: asking,
								onClick: async () => {
									setAsking(true);
									try {
										const res = await suggestOpeners({ data: chatId });
										setOpeners(res.openers);
									} finally {
										setAsking(false);
									}
								},
								children: asking ? "Listening…" : "Ask Vicinity Vibe"
							}),
							openers?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-2",
								children: openers.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "w-full rounded-lg border border-border px-3 py-2 text-left text-sm text-fg/90",
									onClick: () => void send(line),
									children: line
								}) }, line))
							}) : null
						]
					}) : null,
					messages.map((msg) => {
						const mine = msg.userId === me?.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex flex-col", mine ? "items-end" : "items-start"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("max-w-[82%] rounded-lg px-3.5 py-2 text-sm leading-relaxed", mine ? "bg-accent text-accent-fg" : "bg-elevated text-fg"),
								children: msg.text
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex flex-wrap gap-1",
								children: VIBE_REACTIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: cn("rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", msg.vibeReaction === r.id ? "bg-elevated text-fg" : "text-subtle hover:text-muted"),
									onClick: () => void reactToMessage({ data: {
										messageId: msg.id,
										reaction: msg.vibeReaction === r.id ? null : r.id
									} }).then(() => reload()),
									children: r.label
								}, r.id))
							})]
						}, msg.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "sticky bottom-20 flex gap-2 border-t border-border bg-bg px-4 py-3",
				onSubmit: (e) => {
					e.preventDefault();
					send(draft);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: "Say something specific"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: !draft.trim(),
					children: "Send"
				})]
			})
		]
	});
}
//#endregion
export { ChatPage as component };
