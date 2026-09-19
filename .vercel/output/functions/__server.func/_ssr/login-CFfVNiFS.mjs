import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as GROK_PROVIDERS } from "./server-BsPHj5TB.mjs";
import { t as Button } from "./button-C3Y8m_s4.mjs";
import { t as Input } from "./input-BF3jaAE4.mjs";
import { t as Label } from "./label-DRUGnxpt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CFfVNiFS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function errorMessage(error) {
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	const message = typeof error === "object" && error !== null && "message" in error ? String(error.message) : "";
	if (code === "PASSWORD_TOO_SHORT") return "Use at least 8 characters for your password.";
	if (code === "PASSWORD_TOO_LONG") return "Use a password with 128 characters or fewer.";
	if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") return "That email is already in use. Try signing in instead.";
	if (code === "INVALID_EMAIL") return "Enter a valid email address.";
	if (code === "INVALID_EMAIL_OR_PASSWORD") return "That email or password is not correct.";
	if (code === "EMAIL_PASSWORD_DISABLED") return "Email sign-in is not available right now.";
	return message || "Something went wrong. Please try again.";
}
function Login() {
	const navigate = useNavigate();
	const { user, isPending: sessionPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("sign-in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!sessionPending && user) navigate({ to: "/" });
	}, [
		navigate,
		sessionPending,
		user
	]);
	if (sessionPending || user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex min-h-dvh max-w-lg items-center justify-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-10 animate-pulse rounded-full bg-elevated" })
	});
	async function submit(event) {
		event.preventDefault();
		setError(null);
		if (mode === "sign-up" && !name.trim()) {
			setError("Tell us your name to create an account.");
			return;
		}
		if (mode === "sign-up" && password.length < 8) {
			setError("Use at least 8 characters for your password.");
			return;
		}
		setPending(true);
		try {
			const result = mode === "sign-up" ? await authClient.signUp.email({
				name: name.trim(),
				email: email.trim(),
				password
			}) : await authClient.signIn.email({
				email: email.trim(),
				password
			});
			if (result.error) {
				setError(errorMessage(result.error));
				return;
			}
			window.location.assign("/");
		} catch (caught) {
			setError(errorMessage(caught));
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted",
				children: "Vicinity Vibe"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl font-medium",
				children: mode === "sign-up" ? "Create your account" : "Sign in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-sm text-muted",
				children: mode === "sign-up" ? "A little context helps the right people find you." : "Same people. Same frequency. Pick up where you left off."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 flex flex-col gap-4",
					onSubmit: (event) => void submit(event),
					children: [
						mode === "sign-up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								name: "name",
								autoComplete: "name",
								placeholder: "What should we call you?",
								value: name,
								onChange: (event) => setName(event.target.value),
								disabled: pending,
								required: true
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								name: "email",
								type: "email",
								autoComplete: "email",
								placeholder: "you@example.com",
								value: email,
								onChange: (event) => setEmail(event.target.value),
								disabled: pending,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								name: "password",
								type: "password",
								autoComplete: mode === "sign-up" ? "new-password" : "current-password",
								placeholder: "At least 8 characters",
								value: password,
								onChange: (event) => setPassword(event.target.value),
								disabled: pending,
								required: true
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger",
							role: "alert",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							className: "w-full",
							disabled: pending,
							children: pending ? "One moment…" : mode === "sign-up" ? "Create account" : "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 text-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
					onClick: () => {
						setMode(mode === "sign-up" ? "sign-in" : "sign-up");
						setError(null);
					},
					children: mode === "sign-up" ? "Already have an account? Sign in" : "New here? Create an account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex flex-col gap-3 border-t border-border pt-6",
					children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "lg",
						variant: "outline",
						className: "w-full",
						onClick: () => void signIn(provider.providerId, { callbackURL: "/" }),
						disabled: pending,
						children: ["Continue with ", provider.label]
					}, provider.providerId))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-8 text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
				children: "Back"
			})
		]
	});
}
//#endregion
export { Login as component };
