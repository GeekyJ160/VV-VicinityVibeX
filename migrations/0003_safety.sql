create table if not exists blocks (
  blocker_id text not null,
  blocked_id text not null,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create table if not exists reports (
  id text primary key,
  reporter_id text not null,
  target_user text not null,
  reason text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists blocks_blocked_idx on blocks (blocked_id);

insert into profiles (
  user_id, display_name, emoji, bio, photos, voice_intro, pronouns,
  intentions, relationship_style, green_flags, red_flags, perfect_local_day,
  dimensions, vibe_primary, vibe_secondary, vibe_saturation, vibe_brightness,
  neighborhood, visibility, verified, is_seed
) values
(
  'seed-lina', 'Lina Ortiz', '◇',
  'I run a tiny supper club out of Magnolia. I will overfeed you and then walk you to the train like it is 1998.',
  '["/people/lina.jpg"]'::jsonb,
  'If you can stay for the last plate, we can talk about anything.',
  'she/her',
  '["friends","community","dating"]'::jsonb,
  'slow-burn',
  '["people who help clear the table","curiosity about Fort Worth","a sense of humor after 10"]'::jsonb,
  '["Dallas-only snobbery","people who treat hospitality like a tip"]'::jsonb,
  'West 7th coffee. A long cook. Magnolia after dark. Someone who will sit on the stoop.',
  '{"creative":62,"fandom":34,"nightlife":54,"cozy":76,"cerebral":48,"kinetic":40,"spiritual":58,"culinary":88}'::jsonb,
  'culinary', 'cozy', 0.5, 0.74,
  'Magnolia', 'open', true, true
),
(
  'seed-jayce', 'Jayce Miller', '△',
  'Sound tech at a Near Southside room that still has a real PA. I bike home along the Trinity when the set is done.',
  '["/people/jayce.jpg"]'::jsonb,
  'I notice when a room is actually listening. That is rare. Stay for it.',
  'he/him',
  '["friends","dating","community"]'::jsonb,
  'figuring-it-out',
  '["craft respect","people who mean the second hang","kindness to the door"]'::jsonb,
  '["people who film the whole set","treating Fort Worth like a layover"]'::jsonb,
  'Soundcheck. A perfect cue. Tacos on South Main. The river path with the lights off.',
  '{"creative":70,"fandom":38,"nightlife":84,"cozy":40,"cerebral":52,"kinetic":66,"spiritual":44,"culinary":48}'::jsonb,
  'nightlife', 'kinetic', 0.52, 0.66,
  'Near Southside', 'open', false, true
)
on conflict (user_id) do nothing;

insert into universe_members (universe_id, user_id) values
  ('food-lab', 'seed-lina'),
  ('night-shift', 'seed-lina'),
  ('black-creatives', 'seed-lina'),
  ('night-shift', 'seed-jayce'),
  ('music-makers', 'seed-jayce'),
  ('trail-club', 'seed-jayce')
on conflict do nothing;

insert into universe_posts (id, universe_id, user_id, body, created_at) values
  ('p19', 'food-lab', 'seed-lina', 'Four seats left Friday. Magnolia. No phones at the table. Bring wine if you have a story about it.', now() - interval '3 hours'),
  ('p20', 'night-shift', 'seed-jayce', 'If you are walking South Main at 1:10 and you nod, that counts. I will nod back.', now() - interval '6 hours')
on conflict (id) do nothing;

insert into universe_events (id, universe_id, title, description, location, starts_at, created_by) values
  ('e9', 'food-lab', 'Last plate', 'A small supper. You stay to dry dishes.', 'Magnolia bungalow', now() + interval '3 days', 'seed-lina'),
  ('e10', 'night-shift', 'After the load-out', 'Walk, tacos, no recap unless someone needs it.', 'Near Southside', now() + interval '2 days', 'seed-jayce')
on conflict (id) do nothing;
