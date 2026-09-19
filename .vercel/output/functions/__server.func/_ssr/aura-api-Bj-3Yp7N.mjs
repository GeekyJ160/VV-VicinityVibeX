import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-2NUZtYBT.mjs";
import { t as authMiddleware } from "./middleware-DisBziKk.mjs";
import { f as compatibilityScore, g as neighborhoodPoint, h as neighborhoodFromPlace, v as rankDimensions, x as universeName, y as sharedDimensions } from "./aura-DBGkNbkG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aura-api-Bj-3Yp7N.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function parseJson(value, fallback) {
	if (value == null) return fallback;
	if (typeof value === "object") return value;
	if (typeof value === "string") try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
	return fallback;
}
function toIso(value) {
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "string") return value;
	return (/* @__PURE__ */ new Date()).toISOString();
}
function mapProfile(row, universes) {
	return {
		userId: row.user_id,
		displayName: row.display_name,
		emoji: row.emoji,
		bio: row.bio,
		photos: parseJson(row.photos, []),
		voiceIntro: row.voice_intro,
		pronouns: row.pronouns,
		intentions: parseJson(row.intentions, []),
		relationshipStyle: row.relationship_style,
		greenFlags: parseJson(row.green_flags, []),
		redFlags: parseJson(row.red_flags, []),
		perfectLocalDay: row.perfect_local_day,
		dimensions: parseJson(row.dimensions, {
			creative: 40,
			fandom: 40,
			nightlife: 40,
			cozy: 40,
			cerebral: 40,
			kinetic: 40,
			spiritual: 40,
			culinary: 40
		}),
		primary: row.vibe_primary,
		secondary: row.vibe_secondary,
		saturation: Number(row.vibe_saturation),
		brightness: Number(row.vibe_brightness),
		neighborhood: row.neighborhood,
		visibility: row.visibility,
		verified: Boolean(row.verified),
		trustedContact: row.trusted_contact,
		isSeed: Boolean(row.is_seed),
		universes,
		createdAt: toIso(row.created_at),
		updatedAt: toIso(row.updated_at)
	};
}
async function universesFor(userIds) {
	if (userIds.length === 0) return /* @__PURE__ */ new Map();
	const sql = await getSql();
	const placeholders = userIds.map((_, i) => `$${i + 1}`).join(",");
	const rows = await sql.query(`select universe_id, user_id from universe_members where user_id in (${placeholders})`, userIds);
	const map = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const list = map.get(row.user_id) ?? [];
		list.push(row.universe_id);
		map.set(row.user_id, list);
	}
	return map;
}
async function loadProfile(userId) {
	const row = (await (await getSql())`
    select * from profiles where user_id = ${userId} limit 1
  `)[0];
	if (!row) return null;
	return mapProfile(row, (await universesFor([userId])).get(userId) ?? []);
}
function pairId(a, b) {
	return [a, b].sort().join("__");
}
async function isBlocked(userId, otherId) {
	const rows = await (await getSql())`
    select count(*)::int as n from blocks
    where (blocker_id = ${userId} and blocked_id = ${otherId})
       or (blocker_id = ${otherId} and blocked_id = ${userId})
  `;
	return Number(rows[0]?.n ?? 0) > 0;
}
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "469347a0099fc048d38f25cacbfbedbcb3ede5cb8baa789f1f2302fed62a256f",
	name: "getMyProfile",
	filename: "src/lib/aura-api.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => loadProfile(context.userId));
var saveProfile_createServerFn_handler = createServerRpc({
	id: "aef4934dde6ff05e6e3b2687caf03f5fc7eaef80e57a92619700b0dfdc67be38",
	name: "saveProfile",
	filename: "src/lib/aura-api.ts"
}, (opts) => saveProfile.__executeServer(opts));
var saveProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const existing = await loadProfile(context.userId);
	const ranked = rankDimensions(data.dimensions);
	const photos = existing?.photos?.length ? existing.photos : data.photoUrl ? [data.photoUrl] : [];
	await sql`
      insert into profiles (
        user_id, display_name, emoji, bio, photos, voice_intro, pronouns,
        intentions, relationship_style, green_flags, red_flags, perfect_local_day,
        dimensions, vibe_primary, vibe_secondary, vibe_saturation, vibe_brightness,
        neighborhood, visibility, trusted_contact, is_seed, updated_at
      ) values (
        ${context.userId},
        ${data.displayName.trim() || "New signal"},
        ${data.emoji || "◎"},
        ${data.bio.trim()},
        ${JSON.stringify(photos)}::jsonb,
        ${data.voiceIntro.trim()},
        ${data.pronouns.trim()},
        ${JSON.stringify(data.intentions)}::jsonb,
        ${data.relationshipStyle},
        ${JSON.stringify(data.greenFlags)}::jsonb,
        ${JSON.stringify(data.redFlags)}::jsonb,
        ${data.perfectLocalDay.trim()},
        ${JSON.stringify(data.dimensions)}::jsonb,
        ${ranked.primary},
        ${ranked.secondary},
        ${data.saturation},
        ${data.brightness},
        ${data.neighborhood},
        ${data.visibility},
        ${data.trustedContact.trim()},
        false,
        now()
      )
      on conflict (user_id) do update set
        display_name = excluded.display_name,
        emoji = excluded.emoji,
        bio = excluded.bio,
        voice_intro = excluded.voice_intro,
        pronouns = excluded.pronouns,
        intentions = excluded.intentions,
        relationship_style = excluded.relationship_style,
        green_flags = excluded.green_flags,
        red_flags = excluded.red_flags,
        perfect_local_day = excluded.perfect_local_day,
        dimensions = excluded.dimensions,
        vibe_primary = excluded.vibe_primary,
        vibe_secondary = excluded.vibe_secondary,
        vibe_saturation = excluded.vibe_saturation,
        vibe_brightness = excluded.vibe_brightness,
        neighborhood = excluded.neighborhood,
        visibility = excluded.visibility,
        trusted_contact = excluded.trusted_contact,
        updated_at = now()
    `;
	await sql`delete from universe_members where user_id = ${context.userId}`;
	for (const universeId of data.universes.slice(0, 4)) await sql`
        insert into universe_members (universe_id, user_id)
        values (${universeId}, ${context.userId})
        on conflict do nothing
      `;
	return loadProfile(context.userId);
});
var getDiscover_createServerFn_handler = createServerRpc({
	id: "7d1cda0ec9d531b1e6bfe9a2879ef61d1a01634bce086fc54063f2906facb0c9",
	name: "getDiscover",
	filename: "src/lib/aura-api.ts"
}, (opts) => getDiscover.__executeServer(opts));
var getDiscover = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDiscover_createServerFn_handler, async ({ context }) => {
	const me = await loadProfile(context.userId);
	if (!me) return [];
	const rows = await (await getSql())`
      select p.* from profiles p
      where p.user_id <> ${context.userId}
        and p.visibility = 'open'
        and not exists (
          select 1 from swipes s
          where s.from_user = ${context.userId} and s.to_user = p.user_id
        )
        and not exists (
          select 1 from matches m
          where m.status = 'active'
            and ((m.user_a = ${context.userId} and m.user_b = p.user_id)
              or (m.user_b = ${context.userId} and m.user_a = p.user_id))
        )
        and not exists (
          select 1 from blocks b
          where (b.blocker_id = ${context.userId} and b.blocked_id = p.user_id)
             or (b.blocker_id = p.user_id and b.blocked_id = ${context.userId})
        )
      order by p.verified desc, p.display_name
    `;
	const uni = await universesFor(rows.map((r) => r.user_id));
	return rows.map((row) => {
		const profile = mapProfile(row, uni.get(row.user_id) ?? []);
		const sharedUni = profile.universes.filter((id) => me.universes.includes(id)).length;
		return {
			...profile,
			compatibility: compatibilityScore(me.dimensions, profile.dimensions, sharedUni, me.neighborhood === profile.neighborhood),
			sharedDimensions: sharedDimensions(me.dimensions, profile.dimensions)
		};
	}).sort((a, b) => b.compatibility - a.compatibility);
});
var swipe_createServerFn_handler = createServerRpc({
	id: "eee9f235a6b4879cbec81e111bbaa4e4b542978343412dd299b552d5010fca8b",
	name: "swipe",
	filename: "src/lib/aura-api.ts"
}, (opts) => swipe.__executeServer(opts));
var swipe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(swipe_createServerFn_handler, async ({ context, data }) => {
	const me = await loadProfile(context.userId);
	const them = await loadProfile(data.toUserId);
	if (!me || !them) return { matched: false };
	const sql = await getSql();
	await sql`
      insert into swipes (from_user, to_user, action)
      values (${context.userId}, ${data.toUserId}, ${data.action})
      on conflict (from_user, to_user) do update set action = excluded.action
    `;
	if (data.action !== "spark") return { matched: false };
	const sharedUni = them.universes.filter((id) => me.universes.includes(id)).length;
	const score = compatibilityScore(me.dimensions, them.dimensions, sharedUni, me.neighborhood === them.neighborhood);
	const dims = sharedDimensions(me.dimensions, them.dimensions);
	const theySparked = await sql`
      select action from swipes
      where from_user = ${data.toUserId} and to_user = ${context.userId} and action = 'spark'
    `;
	const seedAccepts = them.isSeed && score >= 64;
	if (!theySparked[0] && !seedAccepts) return { matched: false };
	if (seedAccepts && !theySparked[0]) await sql`
        insert into swipes (from_user, to_user, action)
        values (${data.toUserId}, ${context.userId}, 'spark')
        on conflict do nothing
      `;
	const id = `m_${pairId(context.userId, data.toUserId)}`;
	const chatId = `c_${pairId(context.userId, data.toUserId)}`;
	const [userA, userB] = [context.userId, data.toUserId].sort();
	await sql`
      insert into matches (
        id, user_a, user_b, compat_a, compat_b, shared_dimensions, chat_id, status
      ) values (
        ${id}, ${userA}, ${userB}, ${score}, ${score},
        ${JSON.stringify(dims)}::jsonb, ${chatId}, 'active'
      )
      on conflict (id) do update set status = 'active'
    `;
	return {
		matched: true,
		matchId: id,
		chatId,
		compatibility: score,
		other: them,
		sharedDimensions: dims
	};
});
var getMatches_createServerFn_handler = createServerRpc({
	id: "4673b20273d3a21f578f3ca87b25d9e8526a4236dda9ef6a34299163fed476c5",
	name: "getMatches",
	filename: "src/lib/aura-api.ts"
}, (opts) => getMatches.__executeServer(opts));
var getMatches = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMatches_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const rows = await sql`
      select id, chat_id, user_a, user_b, compat_a, shared_dimensions, created_at
      from matches
      where status = 'active' and (user_a = ${context.userId} or user_b = ${context.userId})
      order by created_at desc
    `;
	const result = [];
	for (const row of rows) {
		const otherId = row.user_a === context.userId ? row.user_b : row.user_a;
		if (await isBlocked(context.userId, otherId)) continue;
		const other = await loadProfile(otherId);
		if (!other) continue;
		const last = await sql`
        select text, created_at from messages
        where chat_id = ${row.chat_id}
        order by created_at desc limit 1
      `;
		result.push({
			id: row.id,
			chatId: row.chat_id,
			other,
			compatibility: Number(row.compat_a),
			sharedDimensions: parseJson(row.shared_dimensions, []),
			lastMessage: last[0]?.text ?? null,
			lastAt: last[0] ? toIso(last[0].created_at) : null,
			createdAt: toIso(row.created_at)
		});
	}
	return result;
});
var getPerson_createServerFn_handler = createServerRpc({
	id: "bd6e3243c0bfb19d83c95ce6751083dee5b52defc438bdc93dd563a6993a1635",
	name: "getPerson",
	filename: "src/lib/aura-api.ts"
}, (opts) => getPerson.__executeServer(opts));
var getPerson = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((userId) => userId).handler(getPerson_createServerFn_handler, async ({ context, data: userId }) => {
	const me = await loadProfile(context.userId);
	const them = await loadProfile(userId);
	if (!me || !them) return null;
	if (them.visibility === "ghost" && them.userId !== context.userId) return null;
	if (await isBlocked(context.userId, userId)) return null;
	const sharedUni = them.universes.filter((id) => me.universes.includes(id)).length;
	return {
		...them,
		compatibility: compatibilityScore(me.dimensions, them.dimensions, sharedUni, me.neighborhood === them.neighborhood),
		sharedDimensions: sharedDimensions(me.dimensions, them.dimensions)
	};
});
async function loadChat(chatId, userId) {
	const sql = await getSql();
	const row = (await sql`
    select id, user_a, user_b, chat_id, compat_a, shared_dimensions
    from matches
    where chat_id = ${chatId} and status = 'active'
      and (user_a = ${userId} or user_b = ${userId})
    limit 1
  `)[0];
	if (!row) return null;
	const other = await loadProfile(row.user_a === userId ? row.user_b : row.user_a);
	if (!other) return null;
	const msgs = await sql`
    select id, chat_id, user_id, text, vibe_reaction, created_at
    from messages where chat_id = ${chatId}
    order by created_at asc
  `;
	return {
		matchId: row.id,
		chatId,
		compatibility: Number(row.compat_a),
		sharedDimensions: parseJson(row.shared_dimensions, []),
		other,
		messages: msgs.map((m) => ({
			id: m.id,
			chatId: m.chat_id,
			userId: m.user_id,
			text: m.text,
			vibeReaction: m.vibe_reaction,
			createdAt: toIso(m.created_at)
		}))
	};
}
var getChat_createServerFn_handler = createServerRpc({
	id: "4d526f646518ffd8c8f7e6fb180105120c01584bff6ff51463fc2662168d92fb",
	name: "getChat",
	filename: "src/lib/aura-api.ts"
}, (opts) => getChat.__executeServer(opts));
var getChat = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((chatId) => chatId).handler(getChat_createServerFn_handler, async ({ context, data: chatId }) => loadChat(chatId, context.userId));
var sendMessage_createServerFn_handler = createServerRpc({
	id: "86cc591895aa55a355fb7fab31c6269b3d391cd0142d9c8287dbac3f54fa6ecc",
	name: "sendMessage",
	filename: "src/lib/aura-api.ts"
}, (opts) => sendMessage.__executeServer(opts));
var sendMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendMessage_createServerFn_handler, async ({ context, data }) => {
	const text = data.text.trim();
	if (!text) return null;
	const sql = await getSql();
	if (!(await sql`
      select id from matches
      where chat_id = ${data.chatId} and status = 'active'
        and (user_a = ${context.userId} or user_b = ${context.userId})
      limit 1
    `)[0]) return null;
	const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
	await sql`
      insert into messages (id, chat_id, user_id, text)
      values (${id}, ${data.chatId}, ${context.userId}, ${text})
    `;
	return { id };
});
var reactToMessage_createServerFn_handler = createServerRpc({
	id: "3ee8c322d8e8ca3b5883135c2c7b2e03c0663b0d07fd37f38266cbdbd67ef303",
	name: "reactToMessage",
	filename: "src/lib/aura-api.ts"
}, (opts) => reactToMessage.__executeServer(opts));
var reactToMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(reactToMessage_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      update messages set vibe_reaction = ${data.reaction}
      where id = ${data.messageId}
        and exists (
          select 1 from matches m
          where m.chat_id = messages.chat_id and m.status = 'active'
            and (m.user_a = ${context.userId} or m.user_b = ${context.userId})
        )
    `;
	return { ok: true };
});
var listUniverses_createServerFn_handler = createServerRpc({
	id: "8451161ae25daa8c403dc8118b0debaaa20392e7b8d9c22d5dbf670bb8913ee8",
	name: "listUniverses",
	filename: "src/lib/aura-api.ts"
}, (opts) => listUniverses.__executeServer(opts));
var listUniverses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listUniverses_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select
        c.id, c.name, c.description, c.active_nearby,
        (select count(*)::int from universe_members m where m.universe_id = c.id) as member_count,
        (select count(*)::int from universe_members m where m.universe_id = c.id and m.user_id = ${context.userId}) as joined
      from universe_catalog c
      order by c.name
    `).map((r) => ({
		id: r.id,
		name: r.name,
		description: r.description,
		memberCount: Number(r.member_count),
		activeNearby: Number(r.active_nearby),
		joined: Number(r.joined) > 0
	}));
});
var getUniverse_createServerFn_handler = createServerRpc({
	id: "550264800bcd1a903f4c5793b448c9d4ffbd97a014c49b1d6c710529f9aeb989",
	name: "getUniverse",
	filename: "src/lib/aura-api.ts"
}, (opts) => getUniverse.__executeServer(opts));
var getUniverse = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getUniverse_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const catalog = (await sql`select id, name, description, active_nearby from universe_catalog where id = ${id} limit 1`)[0];
	if (!catalog) return null;
	const memberCount = await sql`
      select count(*)::int as n from universe_members where universe_id = ${id}
    `;
	const joined = await sql`
      select count(*)::int as n from universe_members
      where universe_id = ${id} and user_id = ${context.userId}
    `;
	const posts = await sql`
      select p.id, p.universe_id, p.user_id, p.body, p.created_at,
             coalesce(pr.display_name, 'Someone') as display_name,
             coalesce(pr.emoji, '◎') as emoji
      from universe_posts p
      left join profiles pr on pr.user_id = p.user_id
      where p.universe_id = ${id}
      order by p.created_at desc
      limit 40
    `;
	const events = await sql`
      select e.id, e.universe_id, e.title, e.description, e.location, e.starts_at,
        (select count(*)::int from event_rsvps r where r.event_id = e.id) as going_count,
        (select count(*)::int from event_rsvps r where r.event_id = e.id and r.user_id = ${context.userId}) as going
      from universe_events e
      where e.universe_id = ${id}
      order by e.starts_at asc
    `;
	return {
		universe: {
			id: catalog.id,
			name: catalog.name,
			description: catalog.description,
			memberCount: Number(memberCount[0]?.n ?? 0),
			activeNearby: Number(catalog.active_nearby),
			joined: Number(joined[0]?.n ?? 0) > 0
		},
		posts: posts.map((p) => ({
			id: p.id,
			universeId: p.universe_id,
			userId: p.user_id,
			displayName: p.display_name,
			emoji: p.emoji,
			body: p.body,
			createdAt: toIso(p.created_at)
		})),
		events: events.map((e) => ({
			id: e.id,
			universeId: e.universe_id,
			title: e.title,
			description: e.description,
			location: e.location,
			startsAt: toIso(e.starts_at),
			going: Number(e.going) > 0,
			goingCount: Number(e.going_count)
		}))
	};
});
var toggleUniverse_createServerFn_handler = createServerRpc({
	id: "eb86768b1094f31c175690df058238de573d81532166caf0f19559559eca8b8a",
	name: "toggleUniverse",
	filename: "src/lib/aura-api.ts"
}, (opts) => toggleUniverse.__executeServer(opts));
var toggleUniverse = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleUniverse_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (data.join) await sql`
        insert into universe_members (universe_id, user_id)
        values (${data.universeId}, ${context.userId})
        on conflict do nothing
      `;
	else await sql`
        delete from universe_members
        where universe_id = ${data.universeId} and user_id = ${context.userId}
      `;
	return { ok: true };
});
var createPost_createServerFn_handler = createServerRpc({
	id: "77e4f85e767d1a463c35974fa08366e879a6c95a2b99708ee89f431398b85039",
	name: "createPost",
	filename: "src/lib/aura-api.ts"
}, (opts) => createPost.__executeServer(opts));
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createPost_createServerFn_handler, async ({ context, data }) => {
	const body = data.body.trim();
	if (!body) return null;
	const sql = await getSql();
	const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
	await sql`
      insert into universe_posts (id, universe_id, user_id, body)
      values (${id}, ${data.universeId}, ${context.userId}, ${body})
    `;
	return { id };
});
var rsvpEvent_createServerFn_handler = createServerRpc({
	id: "0975af7a438f9731236dd0fd06abe7681e25efd595efed96a2ba75815d2a2b7c",
	name: "rsvpEvent",
	filename: "src/lib/aura-api.ts"
}, (opts) => rsvpEvent.__executeServer(opts));
var rsvpEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(rsvpEvent_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (data.going) await sql`
        insert into event_rsvps (event_id, user_id)
        values (${data.eventId}, ${context.userId})
        on conflict do nothing
      `;
	else await sql`
        delete from event_rsvps
        where event_id = ${data.eventId} and user_id = ${context.userId}
      `;
	return { ok: true };
});
var updateSafety_createServerFn_handler = createServerRpc({
	id: "b00c4e970f6e184e762d1809e972d98b8de292e9c1a4595f1a5ad071c8c535d7",
	name: "updateSafety",
	filename: "src/lib/aura-api.ts"
}, (opts) => updateSafety.__executeServer(opts));
var updateSafety = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateSafety_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      update profiles
      set visibility = ${data.visibility},
          trusted_contact = ${data.trustedContact.trim()},
          updated_at = now()
      where user_id = ${context.userId}
    `;
	return loadProfile(context.userId);
});
var unmatch_createServerFn_handler = createServerRpc({
	id: "e4a54c3bad003dbb2e1f41f0710d69c569061d04a1037b9a699593c2bdcfde8d",
	name: "unmatch",
	filename: "src/lib/aura-api.ts"
}, (opts) => unmatch.__executeServer(opts));
var unmatch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((matchId) => matchId).handler(unmatch_createServerFn_handler, async ({ context, data: matchId }) => {
	await (await getSql())`
      update matches set status = 'unmatched'
      where id = ${matchId}
        and (user_a = ${context.userId} or user_b = ${context.userId})
    `;
	return { ok: true };
});
var suggestOpeners_createServerFn_handler = createServerRpc({
	id: "475fc89f2cccd89f391bc770125632fa3bca23eb0680f67e9ad7a624b83d2e84",
	name: "suggestOpeners",
	filename: "src/lib/aura-api.ts"
}, (opts) => suggestOpeners.__executeServer(opts));
var suggestOpeners = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((chatId) => chatId).handler(suggestOpeners_createServerFn_handler, async ({ context, data: chatId }) => {
	const chat = await loadChat(chatId, context.userId);
	if (!chat) return {
		ok: false,
		error: "Chat not found",
		openers: []
	};
	const me = await loadProfile(context.userId);
	if (!me) return {
		ok: false,
		error: "No profile",
		openers: []
	};
	const fallback = [`Your note about ${chat.other.perfectLocalDay.split(".")[0]?.toLowerCase() || "a local day"} landed. I want the longer version.`, `We share ${chat.sharedDimensions[0] ?? "a frequency"}. Start there?`];
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		openers: fallback
	};
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 220,
				messages: [{
					role: "system",
					content: "You write two short icebreakers for Vicinity Vibe, a culture-first matching app. Specific, adult, no pickup lines, no astrology, no \"hey beautiful\". Ground them in the given details. Return JSON only: {\"openers\":[\"...\",\"...\"]}"
				}, {
					role: "user",
					content: JSON.stringify({
						me: {
							name: me.displayName,
							bio: me.bio,
							day: me.perfectLocalDay,
							universes: me.universes
						},
						them: {
							name: chat.other.displayName,
							bio: chat.other.bio,
							voice: chat.other.voiceIntro,
							day: chat.other.perfectLocalDay,
							universes: chat.other.universes,
							flags: chat.other.greenFlags
						},
						shared: chat.sharedDimensions
					})
				}]
			})
		});
		if (!res.ok) return {
			ok: true,
			openers: fallback
		};
		const text = (await res.json()).choices?.[0]?.message?.content ?? "";
		const openers = (JSON.parse(text.replace(/```json|```/g, "").trim()).openers ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 2);
		return {
			ok: true,
			openers: openers.length ? openers : fallback
		};
	} catch {
		return {
			ok: true,
			openers: fallback
		};
	}
});
async function loadNearby(userId) {
	const me = await loadProfile(userId);
	if (!me) return {
		me: null,
		people: [],
		events: [],
		posts: []
	};
	const sql = await getSql();
	const rows = await sql`
    select p.* from profiles p
    where p.user_id <> ${userId}
      and p.visibility = 'open'
      and not exists (
        select 1 from blocks b
        where (b.blocker_id = ${userId} and b.blocked_id = p.user_id)
           or (b.blocker_id = p.user_id and b.blocked_id = ${userId})
      )
    order by p.verified desc, p.display_name
  `;
	const uni = await universesFor(rows.map((r) => r.user_id));
	return {
		me,
		people: rows.map((row) => {
			const profile = mapProfile(row, uni.get(row.user_id) ?? []);
			const sharedUni = profile.universes.filter((id) => me.universes.includes(id)).length;
			const point = neighborhoodPoint(profile.neighborhood, profile.userId);
			return {
				...profile,
				compatibility: compatibilityScore(me.dimensions, profile.dimensions, sharedUni, me.neighborhood === profile.neighborhood),
				sharedDimensions: sharedDimensions(me.dimensions, profile.dimensions),
				x: point.x,
				y: point.y
			};
		}),
		events: (await sql`
    select e.id, e.universe_id, e.title, e.description, e.location, e.starts_at,
      (select count(*)::int from event_rsvps r where r.event_id = e.id) as going_count,
      (select count(*)::int from event_rsvps r where r.event_id = e.id and r.user_id = ${userId}) as going
    from universe_events e
    where e.starts_at > now() - interval '4 hours'
    order by e.starts_at asc
    limit 24
  `).map((e) => {
			const point = neighborhoodPoint(neighborhoodFromPlace(e.location), e.id);
			return {
				id: e.id,
				universeId: e.universe_id,
				title: e.title,
				description: e.description,
				location: e.location,
				startsAt: toIso(e.starts_at),
				going: Number(e.going) > 0,
				goingCount: Number(e.going_count),
				universeName: universeName(e.universe_id),
				x: point.x,
				y: point.y
			};
		}),
		posts: (await sql`
    select p.id, p.universe_id, p.user_id, p.body, p.created_at,
           coalesce(pr.display_name, 'Someone') as display_name,
           coalesce(pr.emoji, '◎') as emoji
    from universe_posts p
    left join profiles pr on pr.user_id = p.user_id
    where not exists (
      select 1 from blocks b
      where (b.blocker_id = ${userId} and b.blocked_id = p.user_id)
         or (b.blocker_id = p.user_id and b.blocked_id = ${userId})
    )
    order by p.created_at desc
    limit 18
  `).map((p) => ({
			id: p.id,
			universeId: p.universe_id,
			userId: p.user_id,
			displayName: p.display_name,
			emoji: p.emoji,
			body: p.body,
			createdAt: toIso(p.created_at),
			universeName: universeName(p.universe_id)
		}))
	};
}
var getNearby_createServerFn_handler = createServerRpc({
	id: "b71f5c573b2a59a9d6c72652841e1fda7850fddb04c83d47964596fcecf15d42",
	name: "getNearby",
	filename: "src/lib/aura-api.ts"
}, (opts) => getNearby.__executeServer(opts));
var getNearby = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getNearby_createServerFn_handler, async ({ context }) => loadNearby(context.userId));
var spinRoulette_createServerFn_handler = createServerRpc({
	id: "acaef74650a1efbb430412d7090ecc589d4bae7e39d202bf1ad7baf1c99d9d6c",
	name: "spinRoulette",
	filename: "src/lib/aura-api.ts"
}, (opts) => spinRoulette.__executeServer(opts));
var spinRoulette = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(spinRoulette_createServerFn_handler, async ({ context }) => {
	const nearby = await loadNearby(context.userId);
	const pool = [];
	for (const person of nearby.people) pool.push({
		kind: "person",
		person
	});
	for (const event of nearby.events) pool.push({
		kind: "event",
		event
	});
	for (const post of nearby.posts.slice(0, 8)) pool.push({
		kind: "post",
		post
	});
	if (pool.length === 0) return null;
	const seed = `${context.userId}:${Date.now()}`;
	let h = 2166136261;
	for (let i = 0; i < seed.length; i += 1) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return pool[(h >>> 0) % pool.length] ?? null;
});
var blockUser_createServerFn_handler = createServerRpc({
	id: "23925bc0e7551ae2c9afa7cf1dcac005d2e9a38e74d7a05d0e3ae693f6a6ba9d",
	name: "blockUser",
	filename: "src/lib/aura-api.ts"
}, (opts) => blockUser.__executeServer(opts));
var blockUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((userId) => userId).handler(blockUser_createServerFn_handler, async ({ context, data: userId }) => {
	if (!userId || userId === context.userId) return { ok: false };
	const sql = await getSql();
	await sql`
      insert into blocks (blocker_id, blocked_id)
      values (${context.userId}, ${userId})
      on conflict do nothing
    `;
	await sql`
      update matches set status = 'unmatched'
      where status = 'active'
        and ((user_a = ${context.userId} and user_b = ${userId})
          or (user_b = ${context.userId} and user_a = ${userId}))
    `;
	return { ok: true };
});
var reportUser_createServerFn_handler = createServerRpc({
	id: "a1b759a57c0d98cbd7b00cdedb181c874ea25dea8858702df0d89e3daeab1394",
	name: "reportUser",
	filename: "src/lib/aura-api.ts"
}, (opts) => reportUser.__executeServer(opts));
var reportUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(reportUser_createServerFn_handler, async ({ context, data }) => {
	if (!data.userId || data.userId === context.userId) return { ok: false };
	const sql = await getSql();
	await sql`
      insert into reports (id, reporter_id, target_user, reason, detail)
      values (
        ${`r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`},
        ${context.userId},
        ${data.userId},
        ${data.reason.slice(0, 40)},
        ${(data.detail ?? "").trim().slice(0, 400)}
      )
    `;
	await sql`
      insert into blocks (blocker_id, blocked_id)
      values (${context.userId}, ${data.userId})
      on conflict do nothing
    `;
	await sql`
      update matches set status = 'unmatched'
      where status = 'active'
        and ((user_a = ${context.userId} and user_b = ${data.userId})
          or (user_b = ${context.userId} and user_a = ${data.userId}))
    `;
	return { ok: true };
});
var deleteMyAccount_createServerFn_handler = createServerRpc({
	id: "a431ab7945516ff914656a8447c6e7bd95fce8fc477923a846e231e03166e2cc",
	name: "deleteMyAccount",
	filename: "src/lib/aura-api.ts"
}, (opts) => deleteMyAccount.__executeServer(opts));
var deleteMyAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(deleteMyAccount_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const id = context.userId;
	await sql`delete from event_rsvps where user_id = ${id}`;
	await sql`delete from universe_posts where user_id = ${id}`;
	await sql`delete from universe_members where user_id = ${id}`;
	await sql`delete from messages where user_id = ${id}`;
	await sql`delete from matches where user_a = ${id} or user_b = ${id}`;
	await sql`delete from swipes where from_user = ${id} or to_user = ${id}`;
	await sql`delete from blocks where blocker_id = ${id} or blocked_id = ${id}`;
	await sql`delete from reports where reporter_id = ${id}`;
	await sql`delete from profiles where user_id = ${id}`;
	return { ok: true };
});
//#endregion
export { blockUser_createServerFn_handler, createPost_createServerFn_handler, deleteMyAccount_createServerFn_handler, getChat_createServerFn_handler, getDiscover_createServerFn_handler, getMatches_createServerFn_handler, getMyProfile_createServerFn_handler, getNearby_createServerFn_handler, getPerson_createServerFn_handler, getUniverse_createServerFn_handler, listUniverses_createServerFn_handler, reactToMessage_createServerFn_handler, reportUser_createServerFn_handler, rsvpEvent_createServerFn_handler, saveProfile_createServerFn_handler, sendMessage_createServerFn_handler, spinRoulette_createServerFn_handler, suggestOpeners_createServerFn_handler, swipe_createServerFn_handler, toggleUniverse_createServerFn_handler, unmatch_createServerFn_handler, updateSafety_createServerFn_handler };
