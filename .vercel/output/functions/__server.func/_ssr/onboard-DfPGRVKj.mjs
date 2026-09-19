import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as RedirectToSignIn } from "./gates-C87p6P1Q.mjs";
import { h as saveProfile, s as getMyProfile } from "./aura-api-Df_-ZHFk.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as INTENTIONS, d as VISIBILITY, l as UNIVERSES, n as EMOJI_MARKS, o as NEIGHBORHOODS, p as computeDna, r as FREQUENCY_QUESTIONS, s as RELATIONSHIP_STYLES } from "./aura-DBGkNbkG.mjs";
import { t as Button } from "./button-C3Y8m_s4.mjs";
import { t as Input } from "./input-BF3jaAE4.mjs";
import { t as VibeOrb } from "./vibe-orb-O4T1NoWY.mjs";
import { t as Label } from "./label-DRUGnxpt.mjs";
import { t as Textarea } from "./textarea-ilN_CEDY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboard-DfPGRVKj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboard() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(0);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [emoji, setEmoji] = (0, import_react.useState)("◎");
	const [pronouns, setPronouns] = (0, import_react.useState)("");
	const [neighborhood, setNeighborhood] = (0, import_react.useState)("Deep Ellum");
	const [bio, setBio] = (0, import_react.useState)("");
	const [voiceIntro, setVoiceIntro] = (0, import_react.useState)("");
	const [perfectLocalDay, setPerfectLocalDay] = (0, import_react.useState)("");
	const [intentions, setIntentions] = (0, import_react.useState)(["dating"]);
	const [relationshipStyle, setRelationshipStyle] = (0, import_react.useState)("slow-burn");
	const [greenFlags, setGreenFlags] = (0, import_react.useState)([]);
	const [redFlags, setRedFlags] = (0, import_react.useState)([]);
	const [universes, setUniverses] = (0, import_react.useState)([]);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [visibility, setVisibility] = (0, import_react.useState)("open");
	const [trustedContact, setTrustedContact] = (0, import_react.useState)("");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		setDisplayName((n) => n || user.displayName || "");
		getMyProfile().then((p) => {
			if (p) {
				setDisplayName(p.displayName);
				setEmoji(p.emoji);
				setPronouns(p.pronouns);
				setNeighborhood(p.neighborhood || "Deep Ellum");
				setBio(p.bio);
				setVoiceIntro(p.voiceIntro);
				setPerfectLocalDay(p.perfectLocalDay);
				setIntentions(p.intentions);
				setRelationshipStyle(p.relationshipStyle);
				setGreenFlags(p.greenFlags);
				setRedFlags(p.redFlags);
				setUniverses(p.universes);
				setVisibility(p.visibility);
				setTrustedContact(p.trustedContact);
			}
		}).finally(() => setReady(true));
	}, [isPending, user]);
	const dna = (0, import_react.useMemo)(() => computeDna(universes, answers), [universes, answers]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-dvh bg-bg" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-dvh bg-bg" });
	const steps = [
		"You",
		"Connect",
		"Worlds",
		"Frequency"
	];
	const canNext = step === 0 ? displayName.trim().length > 1 && pronouns.trim().length > 0 : step === 1 ? intentions.length > 0 && bio.trim().length > 8 : step === 2 ? universes.length >= 2 : Object.keys(answers).length === FREQUENCY_QUESTIONS.length;
	async function finish() {
		setSaving(true);
		setError(null);
		try {
			await saveProfile({ data: {
				displayName,
				emoji,
				bio,
				voiceIntro,
				pronouns,
				intentions,
				relationshipStyle,
				greenFlags,
				redFlags,
				perfectLocalDay,
				dimensions: dna.dimensions,
				saturation: dna.saturation,
				brightness: dna.brightness,
				neighborhood,
				visibility,
				trustedContact,
				universes,
				photoUrl: user?.profileImageUrl
			} });
			await navigate({ to: "/discover" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-10 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-muted",
					children: steps[step]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tabular-nums text-subtle",
					children: [step + 1, " / 4"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-8 h-px bg-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-px bg-accent transition-[width] duration-300 ease-out",
					style: { width: `${(step + 1) / 4 * 100}%` }
				})
			}),
			step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-medium",
						children: "Who are you here as?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: displayName,
							onChange: (e) => setDisplayName(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Pronouns",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: pronouns,
							placeholder: "she/her, they/them…",
							onChange: (e) => setPronouns(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Neighborhood",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: neighborhood,
							onChange: (e) => setNeighborhood(e.target.value),
							className: "h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/35",
							children: NEIGHBORHOODS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: n,
								children: n
							}, n))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mark" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: EMOJI_MARKS.map((mark) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEmoji(mark),
							className: cn("grid size-11 place-items-center rounded-md border text-lg", emoji === mark ? "border-border-strong bg-elevated text-fg" : "border-border text-muted"),
							children: mark
						}, mark))
					})] })
				]
			}) : null,
			step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-medium",
						children: "How do you want to be met?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "A line they hear first",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: voiceIntro,
							placeholder: "The thing I want is…",
							onChange: (e) => setVoiceIntro(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bio",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: bio,
							placeholder: "Specific. Not a resume.",
							onChange: (e) => setBio(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "A perfect local day",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: perfectLocalDay,
							placeholder: "Where you go. What you eat. When you go home.",
							onChange: (e) => setPerfectLocalDay(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Looking for" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: INTENTIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							on: intentions.includes(item.id),
							onClick: () => setIntentions((cur) => cur.includes(item.id) ? cur.filter((x) => x !== item.id) : [...cur, item.id]),
							children: item.label
						}, item.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Relationship style" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: RELATIONSHIP_STYLES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							on: relationshipStyle === item.id,
							onClick: () => setRelationshipStyle(item.id),
							children: item.label
						}, item.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagEditor, {
						label: "Green flags",
						values: greenFlags,
						onChange: setGreenFlags
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagEditor, {
						label: "Red flags",
						values: redFlags,
						onChange: setRedFlags
					})
				]
			}) : null,
			step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-medium",
						children: "Which rooms do you keep?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Pick two to four universes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-2",
						children: UNIVERSES.map((u) => {
							const on = universes.includes(u.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setUniverses((cur) => {
									if (cur.includes(u.id)) return cur.filter((x) => x !== u.id);
									if (cur.length >= 4) return cur;
									return [...cur, u.id];
								}),
								className: cn("w-full rounded-lg border px-4 py-3 text-left transition-colors duration-150", on ? "border-border-strong bg-elevated" : "border-border"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: u.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: u.description
								})]
							}) }, u.id);
						})
					})
				]
			}) : null,
			step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VibeOrb, {
							primary: dna.primary,
							secondary: dna.secondary,
							saturation: dna.saturation,
							brightness: dna.brightness,
							size: "lg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl font-medium",
							children: "Your frequency"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Four choices. Then you are in."
						})] })]
					}),
					FREQUENCY_QUESTIONS.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-sm",
						children: q.prompt
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: ["a", "b"].map((side) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAnswers((cur) => ({
								...cur,
								[q.id]: side
							})),
							className: cn("rounded-lg border px-4 py-3 text-left text-sm", answers[q.id] === side ? "border-border-strong bg-elevated" : "border-border text-muted"),
							children: q[side].label
						}, side))
					})] }, q.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Who can find you" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid gap-2",
						children: VISIBILITY.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setVisibility(v.id),
							className: cn("rounded-lg border px-4 py-3 text-left", visibility === v.id ? "border-border-strong bg-elevated" : "border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: v.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted",
								children: v.hint
							})]
						}, v.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Trusted contact (optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: trustedContact,
							placeholder: "Name and number of someone you trust",
							onChange: (e) => setTrustedContact(e.target.value)
						})
					})
				]
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex gap-3 pt-8",
				children: [step > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "flex-1",
					onClick: () => setStep((s) => s - 1),
					children: "Back"
				}) : null, step < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1",
					disabled: !canNext,
					onClick: () => setStep((s) => s + 1),
					children: "Continue"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1",
					disabled: !canNext || saving,
					onClick: () => void finish(),
					children: saving ? "Saving…" : "Enter Vicinity Vibe"
				})]
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("rounded-full border px-3 py-1.5 text-sm", on ? "border-border-strong bg-elevated text-fg" : "border-border text-muted"),
		children
	});
}
function FlagEditor({ label, values, onChange }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex flex-wrap gap-1.5",
			children: values.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "rounded-full border border-border bg-elevated px-3 py-1 text-xs text-fg",
				onClick: () => onChange(values.filter((x) => x !== v)),
				children: v
			}, v))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mt-2",
			value: draft,
			placeholder: "Type a line, then Enter",
			onChange: (e) => setDraft(e.target.value),
			onKeyDown: (e) => {
				if (e.key !== "Enter") return;
				e.preventDefault();
				const next = draft.trim();
				if (!next || values.includes(next)) return;
				onChange([...values, next]);
				setDraft("");
			}
		})
	] });
}
//#endregion
export { Onboard as component };
