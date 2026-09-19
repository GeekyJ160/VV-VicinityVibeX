import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  compatibilityScore,
  MATCH_THRESHOLD,
  rankDimensions,
  sharedDimensions,
  type ChatMessage,
  type DimensionKey,
  type DiscoverCard,
  type MapEvent,
  type MapPerson,
  type MatchRow,
  type NearbyPost,
  type Profile,
  type RoulettePick,
  type Universe,
  type UniverseEvent,
  type UniversePost,
  type Visibility,
  type VibeDimensions,
  neighborhoodPoint,
  neighborhoodFromPlace,
  universeName,
} from "@/lib/aura";

type ProfileRow = {
  user_id: string;
  display_name: string;
  emoji: string;
  bio: string;
  photos: unknown;
  voice_intro: string;
  pronouns: string;
  intentions: unknown;
  relationship_style: string;
  green_flags: unknown;
  red_flags: unknown;
  perfect_local_day: string;
  dimensions: unknown;
  vibe_primary: string;
  vibe_secondary: string;
  vibe_saturation: number;
  vibe_brightness: number;
  neighborhood: string;
  visibility: string;
  verified: boolean;
  trusted_contact: string;
  is_seed: boolean;
  created_at: unknown;
  updated_at: unknown;
};

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "object") return value as T;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

function mapProfile(row: ProfileRow, universes: string[]): Profile {
  return {
    userId: row.user_id,
    displayName: row.display_name,
    emoji: row.emoji,
    bio: row.bio,
    photos: parseJson<string[]>(row.photos, []),
    voiceIntro: row.voice_intro,
    pronouns: row.pronouns,
    intentions: parseJson<string[]>(row.intentions, []),
    relationshipStyle: row.relationship_style,
    greenFlags: parseJson<string[]>(row.green_flags, []),
    redFlags: parseJson<string[]>(row.red_flags, []),
    perfectLocalDay: row.perfect_local_day,
    dimensions: parseJson<VibeDimensions>(row.dimensions, {
      creative: 40,
      fandom: 40,
      nightlife: 40,
      cozy: 40,
      cerebral: 40,
      kinetic: 40,
      spiritual: 40,
      culinary: 40,
    }),
    primary: row.vibe_primary as DimensionKey,
    secondary: row.vibe_secondary as DimensionKey,
    saturation: Number(row.vibe_saturation),
    brightness: Number(row.vibe_brightness),
    neighborhood: row.neighborhood,
    visibility: row.visibility as Visibility,
    verified: Boolean(row.verified),
    trustedContact: row.trusted_contact,
    isSeed: Boolean(row.is_seed),
    universes,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

async function universesFor(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, string[]>();
  const sql = await getSql();
  const placeholders = userIds.map((_, i) => `$${i + 1}`).join(",");
  const rows = await sql.query<{ universe_id: string; user_id: string }>(
    `select universe_id, user_id from universe_members where user_id in (${placeholders})`,
    userIds,
  );
  const map = new Map<string, string[]>();
  for (const row of rows) {
    const list = map.get(row.user_id) ?? [];
    list.push(row.universe_id);
    map.set(row.user_id, list);
  }
  return map;
}

async function loadProfile(userId: string): Promise<Profile | null> {
  const sql = await getSql();
  const rows = await sql<ProfileRow>`
    select * from profiles where user_id = ${userId} limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  const uni = await universesFor([userId]);
  return mapProfile(row, uni.get(userId) ?? []);
}

function pairId(a: string, b: string) {
  return [a, b].sort().join("__");
}

async function isBlocked(userId: string, otherId: string) {
  const sql = await getSql();
  const rows = await sql<{ n: number }>`
    select count(*)::int as n from blocks
    where (blocker_id = ${userId} and blocked_id = ${otherId})
       or (blocker_id = ${otherId} and blocked_id = ${userId})
  `;
  return Number(rows[0]?.n ?? 0) > 0;
}

export type ProfileInput = {
  displayName: string;
  emoji: string;
  bio: string;
  voiceIntro: string;
  pronouns: string;
  intentions: string[];
  relationshipStyle: string;
  greenFlags: string[];
  redFlags: string[];
  perfectLocalDay: string;
  dimensions: VibeDimensions;
  saturation: number;
  brightness: number;
  neighborhood: string;
  visibility: Visibility;
  trustedContact: string;
  universes: string[];
  photoUrl?: string | null;
};

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadProfile(context.userId));

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: ProfileInput) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await loadProfile(context.userId);
    const ranked = rankDimensions(data.dimensions);
    const photos = existing?.photos?.length
      ? existing.photos
      : data.photoUrl
        ? [data.photoUrl]
        : [];
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
    for (const universeId of data.universes.slice(0, 4)) {
      await sql`
        insert into universe_members (universe_id, user_id)
        values (${universeId}, ${context.userId})
        on conflict do nothing
      `;
    }
    return loadProfile(context.userId);
  });

export const getDiscover = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<DiscoverCard[]> => {
    const me = await loadProfile(context.userId);
    if (!me) return [];
    const sql = await getSql();
    const rows = await sql<ProfileRow>`
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
    return rows
      .map((row) => {
        const profile = mapProfile(row, uni.get(row.user_id) ?? []);
        const sharedUni = profile.universes.filter((id) => me.universes.includes(id)).length;
        return {
          ...profile,
          compatibility: compatibilityScore(
            me.dimensions,
            profile.dimensions,
            sharedUni,
            me.neighborhood === profile.neighborhood,
          ),
          sharedDimensions: sharedDimensions(me.dimensions, profile.dimensions),
        };
      })
      .sort((a, b) => b.compatibility - a.compatibility);
  });

export const swipe = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { toUserId: string; action: "pass" | "spark" }) => input)
  .handler(async ({ context, data }) => {
    const me = await loadProfile(context.userId);
    const them = await loadProfile(data.toUserId);
    if (!me || !them) return { matched: false as const };
    const sql = await getSql();
    await sql`
      insert into swipes (from_user, to_user, action)
      values (${context.userId}, ${data.toUserId}, ${data.action})
      on conflict (from_user, to_user) do update set action = excluded.action
    `;
    if (data.action !== "spark") return { matched: false as const };

    const sharedUni = them.universes.filter((id) => me.universes.includes(id)).length;
    const score = compatibilityScore(
      me.dimensions,
      them.dimensions,
      sharedUni,
      me.neighborhood === them.neighborhood,
    );
    const dims = sharedDimensions(me.dimensions, them.dimensions);

    const theySparked = await sql<{ action: string }>`
      select action from swipes
      where from_user = ${data.toUserId} and to_user = ${context.userId} and action = 'spark'
    `;
    const seedAccepts = them.isSeed && score >= MATCH_THRESHOLD;
    if (!theySparked[0] && !seedAccepts) return { matched: false as const };

    if (seedAccepts && !theySparked[0]) {
      await sql`
        insert into swipes (from_user, to_user, action)
        values (${data.toUserId}, ${context.userId}, 'spark')
        on conflict do nothing
      `;
    }

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
      matched: true as const,
      matchId: id,
      chatId,
      compatibility: score,
      other: them,
      sharedDimensions: dims,
    };
  });

export const getMatches = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MatchRow[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      chat_id: string;
      user_a: string;
      user_b: string;
      compat_a: number;
      shared_dimensions: unknown;
      created_at: unknown;
    }>`
      select id, chat_id, user_a, user_b, compat_a, shared_dimensions, created_at
      from matches
      where status = 'active' and (user_a = ${context.userId} or user_b = ${context.userId})
      order by created_at desc
    `;
    const result: MatchRow[] = [];
    for (const row of rows) {
      const otherId = row.user_a === context.userId ? row.user_b : row.user_a;
      if (await isBlocked(context.userId, otherId)) continue;
      const other = await loadProfile(otherId);
      if (!other) continue;
      const last = await sql<{ text: string; created_at: unknown }>`
        select text, created_at from messages
        where chat_id = ${row.chat_id}
        order by created_at desc limit 1
      `;
      result.push({
        id: row.id,
        chatId: row.chat_id,
        other,
        compatibility: Number(row.compat_a),
        sharedDimensions: parseJson<DimensionKey[]>(row.shared_dimensions, []),
        lastMessage: last[0]?.text ?? null,
        lastAt: last[0] ? toIso(last[0].created_at) : null,
        createdAt: toIso(row.created_at),
      });
    }
    return result;
  });

export const getPerson = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((userId: string) => userId)
  .handler(async ({ context, data: userId }) => {
    const me = await loadProfile(context.userId);
    const them = await loadProfile(userId);
    if (!me || !them) return null;
    if (them.visibility === "ghost" && them.userId !== context.userId) return null;
    if (await isBlocked(context.userId, userId)) return null;
    const sharedUni = them.universes.filter((id) => me.universes.includes(id)).length;
    return {
      ...them,
      compatibility: compatibilityScore(
        me.dimensions,
        them.dimensions,
        sharedUni,
        me.neighborhood === them.neighborhood,
      ),
      sharedDimensions: sharedDimensions(me.dimensions, them.dimensions),
    } satisfies DiscoverCard;
  });

async function loadChat(chatId: string, userId: string) {
  const sql = await getSql();
  const match = await sql<{
    id: string;
    user_a: string;
    user_b: string;
    chat_id: string;
    compat_a: number;
    shared_dimensions: unknown;
  }>`
    select id, user_a, user_b, chat_id, compat_a, shared_dimensions
    from matches
    where chat_id = ${chatId} and status = 'active'
      and (user_a = ${userId} or user_b = ${userId})
    limit 1
  `;
  const row = match[0];
  if (!row) return null;
  const otherId = row.user_a === userId ? row.user_b : row.user_a;
  const other = await loadProfile(otherId);
  if (!other) return null;
  const msgs = await sql<{
    id: string;
    chat_id: string;
    user_id: string;
    text: string;
    vibe_reaction: string | null;
    created_at: unknown;
  }>`
    select id, chat_id, user_id, text, vibe_reaction, created_at
    from messages where chat_id = ${chatId}
    order by created_at asc
  `;
  return {
    matchId: row.id,
    chatId,
    compatibility: Number(row.compat_a),
    sharedDimensions: parseJson<DimensionKey[]>(row.shared_dimensions, []),
    other,
    messages: msgs.map(
      (m): ChatMessage => ({
        id: m.id,
        chatId: m.chat_id,
        userId: m.user_id,
        text: m.text,
        vibeReaction: m.vibe_reaction,
        createdAt: toIso(m.created_at),
      }),
    ),
  };
}

export const getChat = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((chatId: string) => chatId)
  .handler(async ({ context, data: chatId }) => loadChat(chatId, context.userId));

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { chatId: string; text: string }) => input)
  .handler(async ({ context, data }) => {
    const text = data.text.trim();
    if (!text) return null;
    const sql = await getSql();
    const allowed = await sql<{ id: string }>`
      select id from matches
      where chat_id = ${data.chatId} and status = 'active'
        and (user_a = ${context.userId} or user_b = ${context.userId})
      limit 1
    `;
    if (!allowed[0]) return null;
    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await sql`
      insert into messages (id, chat_id, user_id, text)
      values (${id}, ${data.chatId}, ${context.userId}, ${text})
    `;
    return { id };
  });

export const reactToMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { messageId: string; reaction: string | null }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
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

export const listUniverses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Universe[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      name: string;
      description: string;
      active_nearby: number;
      member_count: number;
      joined: number;
    }>`
      select
        c.id, c.name, c.description, c.active_nearby,
        (select count(*)::int from universe_members m where m.universe_id = c.id) as member_count,
        (select count(*)::int from universe_members m where m.universe_id = c.id and m.user_id = ${context.userId}) as joined
      from universe_catalog c
      order by c.name
    `;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      memberCount: Number(r.member_count),
      activeNearby: Number(r.active_nearby),
      joined: Number(r.joined) > 0,
    }));
  });

export const getUniverse = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const uni = await sql<{
      id: string;
      name: string;
      description: string;
      active_nearby: number;
    }>`select id, name, description, active_nearby from universe_catalog where id = ${id} limit 1`;
    const catalog = uni[0];
    if (!catalog) return null;
    const memberCount = await sql<{ n: number }>`
      select count(*)::int as n from universe_members where universe_id = ${id}
    `;
    const joined = await sql<{ n: number }>`
      select count(*)::int as n from universe_members
      where universe_id = ${id} and user_id = ${context.userId}
    `;
    const posts = await sql<{
      id: string;
      universe_id: string;
      user_id: string;
      body: string;
      created_at: unknown;
      display_name: string;
      emoji: string;
    }>`
      select p.id, p.universe_id, p.user_id, p.body, p.created_at,
             coalesce(pr.display_name, 'Someone') as display_name,
             coalesce(pr.emoji, '◎') as emoji
      from universe_posts p
      left join profiles pr on pr.user_id = p.user_id
      where p.universe_id = ${id}
      order by p.created_at desc
      limit 40
    `;
    const events = await sql<{
      id: string;
      universe_id: string;
      title: string;
      description: string;
      location: string;
      starts_at: unknown;
      going_count: number;
      going: number;
    }>`
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
        joined: Number(joined[0]?.n ?? 0) > 0,
      } satisfies Universe,
      posts: posts.map(
        (p): UniversePost => ({
          id: p.id,
          universeId: p.universe_id,
          userId: p.user_id,
          displayName: p.display_name,
          emoji: p.emoji,
          body: p.body,
          createdAt: toIso(p.created_at),
        }),
      ),
      events: events.map(
        (e): UniverseEvent => ({
          id: e.id,
          universeId: e.universe_id,
          title: e.title,
          description: e.description,
          location: e.location,
          startsAt: toIso(e.starts_at),
          going: Number(e.going) > 0,
          goingCount: Number(e.going_count),
        }),
      ),
    };
  });

export const toggleUniverse = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { universeId: string; join: boolean }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.join) {
      await sql`
        insert into universe_members (universe_id, user_id)
        values (${data.universeId}, ${context.userId})
        on conflict do nothing
      `;
    } else {
      await sql`
        delete from universe_members
        where universe_id = ${data.universeId} and user_id = ${context.userId}
      `;
    }
    return { ok: true };
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { universeId: string; body: string }) => input)
  .handler(async ({ context, data }) => {
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

export const rsvpEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { eventId: string; going: boolean }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.going) {
      await sql`
        insert into event_rsvps (event_id, user_id)
        values (${data.eventId}, ${context.userId})
        on conflict do nothing
      `;
    } else {
      await sql`
        delete from event_rsvps
        where event_id = ${data.eventId} and user_id = ${context.userId}
      `;
    }
    return { ok: true };
  });

export const updateSafety = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { visibility: Visibility; trustedContact: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update profiles
      set visibility = ${data.visibility},
          trusted_contact = ${data.trustedContact.trim()},
          updated_at = now()
      where user_id = ${context.userId}
    `;
    return loadProfile(context.userId);
  });

export const unmatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((matchId: string) => matchId)
  .handler(async ({ context, data: matchId }) => {
    const sql = await getSql();
    await sql`
      update matches set status = 'unmatched'
      where id = ${matchId}
        and (user_a = ${context.userId} or user_b = ${context.userId})
    `;
    return { ok: true };
  });

export const suggestOpeners = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((chatId: string) => chatId)
  .handler(async ({ context, data: chatId }) => {
    const chat = await loadChat(chatId, context.userId);
    if (!chat) return { ok: false as const, error: "Chat not found", openers: [] as string[] };
    const me = await loadProfile(context.userId);
    if (!me) return { ok: false as const, error: "No profile", openers: [] as string[] };

    const fallback = [
      `Your note about ${chat.other.perfectLocalDay.split(".")[0]?.toLowerCase() || "a local day"} landed. I want the longer version.`,
      `We share ${chat.sharedDimensions[0] ?? "a frequency"}. Start there?`,
    ];

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: true as const, openers: fallback };

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 220,
          messages: [
            {
              role: "system",
              content:
                'You write two short icebreakers for Vicinity Vibe, a culture-first matching app. Specific, adult, no pickup lines, no astrology, no "hey beautiful". Ground them in the given details. Return JSON only: {"openers":["...","..."]}',
            },
            {
              role: "user",
              content: JSON.stringify({
                me: {
                  name: me.displayName,
                  bio: me.bio,
                  day: me.perfectLocalDay,
                  universes: me.universes,
                },
                them: {
                  name: chat.other.displayName,
                  bio: chat.other.bio,
                  voice: chat.other.voiceIntro,
                  day: chat.other.perfectLocalDay,
                  universes: chat.other.universes,
                  flags: chat.other.greenFlags,
                },
                shared: chat.sharedDimensions,
              }),
            },
          ],
        }),
      });
      if (!res.ok) return { ok: true as const, openers: fallback };
      const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = body.choices?.[0]?.message?.content ?? "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim()) as { openers?: string[] };
      const openers = (parsed.openers ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 2);
      return { ok: true as const, openers: openers.length ? openers : fallback };
    } catch {
      return { ok: true as const, openers: fallback };
    }
  });

async function loadNearby(userId: string) {
  const me = await loadProfile(userId);
  if (!me) {
    return {
      me: null as Profile | null,
      people: [] as MapPerson[],
      events: [] as MapEvent[],
      posts: [] as NearbyPost[],
    };
  }
  const sql = await getSql();
  const rows = await sql<ProfileRow>`
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
  const people: MapPerson[] = rows.map((row) => {
    const profile = mapProfile(row, uni.get(row.user_id) ?? []);
    const sharedUni = profile.universes.filter((id) => me.universes.includes(id)).length;
    const point = neighborhoodPoint(profile.neighborhood, profile.userId);
    return {
      ...profile,
      compatibility: compatibilityScore(
        me.dimensions,
        profile.dimensions,
        sharedUni,
        me.neighborhood === profile.neighborhood,
      ),
      sharedDimensions: sharedDimensions(me.dimensions, profile.dimensions),
      x: point.x,
      y: point.y,
    };
  });

  const eventRows = await sql<{
    id: string;
    universe_id: string;
    title: string;
    description: string;
    location: string;
    starts_at: unknown;
    going_count: number;
    going: number;
  }>`
    select e.id, e.universe_id, e.title, e.description, e.location, e.starts_at,
      (select count(*)::int from event_rsvps r where r.event_id = e.id) as going_count,
      (select count(*)::int from event_rsvps r where r.event_id = e.id and r.user_id = ${userId}) as going
    from universe_events e
    where e.starts_at > now() - interval '4 hours'
    order by e.starts_at asc
    limit 24
  `;
  const events: MapEvent[] = eventRows.map((e) => {
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
      y: point.y,
    };
  });

  const posts = await sql<{
    id: string;
    universe_id: string;
    user_id: string;
    body: string;
    created_at: unknown;
    display_name: string;
    emoji: string;
  }>`
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
  `;

  return {
    me,
    people,
    events,
    posts: posts.map(
      (p): NearbyPost => ({
        id: p.id,
        universeId: p.universe_id,
        userId: p.user_id,
        displayName: p.display_name,
        emoji: p.emoji,
        body: p.body,
        createdAt: toIso(p.created_at),
        universeName: universeName(p.universe_id),
      }),
    ),
  };
}

export const getNearby = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadNearby(context.userId));

export const spinRoulette = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<RoulettePick | null> => {
    const nearby = await loadNearby(context.userId);
    const pool: RoulettePick[] = [];
    for (const person of nearby.people) pool.push({ kind: "person", person });
    for (const event of nearby.events) pool.push({ kind: "event", event });
    for (const post of nearby.posts.slice(0, 8)) pool.push({ kind: "post", post });
    if (pool.length === 0) return null;
    const seed = `${context.userId}:${Date.now()}`;
    let h = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return pool[(h >>> 0) % pool.length] ?? null;
  });

export const blockUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((userId: string) => userId)
  .handler(async ({ context, data: userId }) => {
    if (!userId || userId === context.userId) return { ok: false as const };
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
    return { ok: true as const };
  });

export const reportUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; reason: string; detail?: string }) => input)
  .handler(async ({ context, data }) => {
    if (!data.userId || data.userId === context.userId) return { ok: false as const };
    const sql = await getSql();
    const id = `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await sql`
      insert into reports (id, reporter_id, target_user, reason, detail)
      values (
        ${id},
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
    return { ok: true as const };
  });

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
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
    return { ok: true as const };
  });

