import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DisBziKk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aura-api-Df_-ZHFk.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("469347a0099fc048d38f25cacbfbedbcb3ede5cb8baa789f1f2302fed62a256f"));
var saveProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("aef4934dde6ff05e6e3b2687caf03f5fc7eaef80e57a92619700b0dfdc67be38"));
var getDiscover = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7d1cda0ec9d531b1e6bfe9a2879ef61d1a01634bce086fc54063f2906facb0c9"));
var swipe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("eee9f235a6b4879cbec81e111bbaa4e4b542978343412dd299b552d5010fca8b"));
var getMatches = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4673b20273d3a21f578f3ca87b25d9e8526a4236dda9ef6a34299163fed476c5"));
var getPerson = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((userId) => userId).handler(createSsrRpc("bd6e3243c0bfb19d83c95ce6751083dee5b52defc438bdc93dd563a6993a1635"));
var getChat = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((chatId) => chatId).handler(createSsrRpc("4d526f646518ffd8c8f7e6fb180105120c01584bff6ff51463fc2662168d92fb"));
var sendMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("86cc591895aa55a355fb7fab31c6269b3d391cd0142d9c8287dbac3f54fa6ecc"));
var reactToMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3ee8c322d8e8ca3b5883135c2c7b2e03c0663b0d07fd37f38266cbdbd67ef303"));
var listUniverses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8451161ae25daa8c403dc8118b0debaaa20392e7b8d9c22d5dbf670bb8913ee8"));
var getUniverse = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("550264800bcd1a903f4c5793b448c9d4ffbd97a014c49b1d6c710529f9aeb989"));
var toggleUniverse = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("eb86768b1094f31c175690df058238de573d81532166caf0f19559559eca8b8a"));
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("77e4f85e767d1a463c35974fa08366e879a6c95a2b99708ee89f431398b85039"));
var rsvpEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0975af7a438f9731236dd0fd06abe7681e25efd595efed96a2ba75815d2a2b7c"));
var updateSafety = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b00c4e970f6e184e762d1809e972d98b8de292e9c1a4595f1a5ad071c8c535d7"));
var unmatch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((matchId) => matchId).handler(createSsrRpc("e4a54c3bad003dbb2e1f41f0710d69c569061d04a1037b9a699593c2bdcfde8d"));
var suggestOpeners = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((chatId) => chatId).handler(createSsrRpc("475fc89f2cccd89f391bc770125632fa3bca23eb0680f67e9ad7a624b83d2e84"));
var getNearby = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b71f5c573b2a59a9d6c72652841e1fda7850fddb04c83d47964596fcecf15d42"));
var spinRoulette = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("acaef74650a1efbb430412d7090ecc589d4bae7e39d202bf1ad7baf1c99d9d6c"));
var blockUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((userId) => userId).handler(createSsrRpc("23925bc0e7551ae2c9afa7cf1dcac005d2e9a38e74d7a05d0e3ae693f6a6ba9d"));
var reportUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a1b759a57c0d98cbd7b00cdedb181c874ea25dea8858702df0d89e3daeab1394"));
var deleteMyAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("a431ab7945516ff914656a8447c6e7bd95fce8fc477923a846e231e03166e2cc"));
//#endregion
export { updateSafety as S, spinRoulette as _, getDiscover as a, toggleUniverse as b, getNearby as c, listUniverses as d, reactToMessage as f, sendMessage as g, saveProfile as h, getChat as i, getPerson as l, rsvpEvent as m, createPost as n, getMatches as o, reportUser as p, deleteMyAccount as r, getMyProfile as s, blockUser as t, getUniverse as u, suggestOpeners as v, unmatch as x, swipe as y };
