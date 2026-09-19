import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as toggleUniverse, m as rsvpEvent, n as createPost, u as getUniverse } from "./aura-api-Df_-ZHFk.mjs";
import { n as Route$1 } from "./router-Cq8WFhNK.mjs";
import { t as Button } from "./button-C3Y8m_s4.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
import { t as Textarea } from "./textarea-ilN_CEDY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/universes._universeId-CnVDLvCS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UniversePage() {
	const { universeId } = Route$1.useParams();
	const [universe, setUniverse] = (0, import_react.useState)(null);
	const [posts, setPosts] = (0, import_react.useState)([]);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [missing, setMissing] = (0, import_react.useState)(false);
	const reload = (0, import_react.useCallback)(async () => {
		const data = await getUniverse({ data: universeId });
		if (!data) {
			setMissing(true);
			return;
		}
		setUniverse(data.universe);
		setPosts(data.posts);
		setEvents(data.events);
	}, [universeId]);
	(0, import_react.useEffect)(() => {
		reload().catch(() => setMissing(true));
	}, [reload]);
	if (missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "This room closed"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/universes",
			className: "mt-4 inline-block text-sm text-muted underline",
			children: "All universes"
		})]
	});
	if (!universe) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-5 h-48 animate-pulse rounded-xl bg-elevated" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/universes",
				className: "text-xs uppercase tracking-[0.16em] text-muted",
				children: "Universes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-medium",
						children: universe.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-sm text-sm leading-relaxed text-muted",
						children: universe.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs tabular-nums text-subtle",
						children: [
							universe.memberCount,
							" members · ",
							universe.activeNearby,
							" nearby"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: universe.joined ? "outline" : "primary",
					size: "sm",
					onClick: async () => {
						await toggleUniverse({ data: {
							universeId,
							join: !universe.joined
						} });
						await reload();
					},
					children: universe.joined ? "Leave" : "Join"
				})]
			}),
			events.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs uppercase tracking-[0.16em] text-subtle",
					children: "Upcoming"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-col gap-2",
					children: events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-lg border border-border bg-surface px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: event.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted",
									children: [
										event.location,
										" ·",
										" ",
										new Date(event.startsAt).toLocaleString(void 0, {
											weekday: "short",
											month: "short",
											day: "numeric",
											hour: "numeric",
											minute: "2-digit"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: event.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs tabular-nums text-subtle",
									children: [event.goingCount, " going"]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: event.going ? "outline" : "primary",
								onClick: async () => {
									await rsvpEvent({ data: {
										eventId: event.id,
										going: !event.going
									} });
									await reload();
								},
								children: event.going ? "In" : "I will be there"
							})]
						})
					}, event.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs uppercase tracking-[0.16em] text-subtle",
						children: "The board"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3",
						onSubmit: async (e) => {
							e.preventDefault();
							if (!draft.trim()) return;
							await createPost({ data: {
								universeId,
								body: draft
							} });
							setDraft("");
							await reload();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							placeholder: "Leave something specific."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "mt-2",
							disabled: !draft.trim(),
							children: "Post"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 flex flex-col gap-4",
						children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-border pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-fg/90",
								children: post.body
							})]
						}, post.id))
					})
				]
			})
		]
	});
}
//#endregion
export { UniversePage as component };
