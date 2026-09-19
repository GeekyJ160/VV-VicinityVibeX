create table if not exists profiles (
  user_id text primary key,
  display_name text not null,
  emoji text not null default '◎',
  bio text not null default '',
  photos jsonb not null default '[]'::jsonb,
  voice_intro text not null default '',
  pronouns text not null default '',
  intentions jsonb not null default '[]'::jsonb,
  relationship_style text not null default 'figuring-it-out',
  green_flags jsonb not null default '[]'::jsonb,
  red_flags jsonb not null default '[]'::jsonb,
  perfect_local_day text not null default '',
  dimensions jsonb not null default '{}'::jsonb,
  vibe_primary text not null default 'creative',
  vibe_secondary text not null default 'cozy',
  vibe_saturation double precision not null default 0.4,
  vibe_brightness double precision not null default 0.7,
  neighborhood text not null default '',
  visibility text not null default 'open',
  verified boolean not null default false,
  trusted_contact text not null default '',
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists universe_catalog (
  id text primary key,
  name text not null,
  description text not null,
  active_nearby int not null default 0
);

create table if not exists universe_members (
  universe_id text not null,
  user_id text not null,
  joined_at timestamptz not null default now(),
  primary key (universe_id, user_id)
);

create table if not exists universe_posts (
  id text primary key,
  universe_id text not null,
  user_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists universe_events (
  id text primary key,
  universe_id text not null,
  title text not null,
  description text not null,
  location text not null,
  starts_at timestamptz not null,
  created_by text not null
);

create table if not exists event_rsvps (
  event_id text not null,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists swipes (
  from_user text not null,
  to_user text not null,
  action text not null,
  created_at timestamptz not null default now(),
  primary key (from_user, to_user)
);

create table if not exists matches (
  id text primary key,
  user_a text not null,
  user_b text not null,
  compat_a int not null,
  compat_b int not null,
  shared_dimensions jsonb not null default '[]'::jsonb,
  chat_id text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id text primary key,
  chat_id text not null,
  user_id text not null,
  text text not null,
  vibe_reaction text,
  created_at timestamptz not null default now()
);

create index if not exists profiles_visibility_idx on profiles (visibility);
create index if not exists universe_members_user_idx on universe_members (user_id);
create index if not exists universe_posts_uni_idx on universe_posts (universe_id, created_at desc);
create index if not exists matches_users_idx on matches (user_a, user_b);
create index if not exists messages_chat_idx on messages (chat_id, created_at);

insert into universe_catalog (id, name, description, active_nearby) values
  ('anime', 'Anime', 'Late-night arcs, opening themes, and the way a still frame can undo you.', 14),
  ('music-makers', 'Music Makers', 'People who finish the song. Bedroom producers, choir kids, warehouse DJs.', 19),
  ('black-creatives', 'Black Creatives', 'A room that already understands the reference. Work, lineage, joy.', 11),
  ('book-nook', 'Book Nook', 'Margins, rereads, and the person who asks what you are in the middle of.', 9),
  ('night-shift', 'Night Shift', 'Last call, load-out, the walk home when the city finally exhales.', 16),
  ('food-lab', 'Food Lab', 'Recipes as love letters. The long table. Butter, chile, patience.', 13),
  ('trail-club', 'Trail Club', 'Dawn loops, dirty shoes, the kind of quiet you have to earn.', 8),
  ('game-worlds', 'Game Worlds', 'Bosses, lore dumps, the couch campaign that lasted a year.', 17)
on conflict (id) do nothing;

insert into profiles (
  user_id, display_name, emoji, bio, photos, voice_intro, pronouns,
  intentions, relationship_style, green_flags, red_flags, perfect_local_day,
  dimensions, vibe_primary, vibe_secondary, vibe_saturation, vibe_brightness,
  neighborhood, visibility, verified, is_seed
) values
(
  'seed-maya', 'Maya Chen', '✶',
  'I shoot on film because I like waiting. I DJ rooms that still have a coat check. If you quote Princess Mononoke at me I will fold.',
  '["/people/maya.jpg"]'::jsonb,
  'The thing I want is someone who notices the light in a parking lot.',
  'she/her',
  '["dating","friends"]'::jsonb,
  'slow-burn',
  '["curiosity","showing up when they said they would","playlists that are actually good"]'::jsonb,
  '["performative taste","people who narrate their own kindness"]'::jsonb,
  'Breakfast tacos at Revolver. Used records on Elm. White Rock at golden hour. A film I have already seen.',
  '{"creative":86,"fandom":78,"nightlife":70,"cozy":62,"cerebral":55,"kinetic":40,"spiritual":48,"culinary":58}'::jsonb,
  'creative', 'fandom', 0.52, 0.72,
  'Deep Ellum', 'open', true, true
),
(
  'seed-jordan', 'Jordan Blake', '◎',
  'I make beats in a loft that used to be a print shop. Sunday is church with my grandmother and then the club. Both are holy.',
  '["/people/jordan.jpg"]'::jsonb,
  'Send the voice note. I would rather hear you think than watch you type.',
  'they/them',
  '["dating","community"]'::jsonb,
  'exclusive',
  '["emotional fluency","people who can be quiet","showing up for family"]'::jsonb,
  '["flakiness dressed up as mystery","jokes at someone else''s expense"]'::jsonb,
  'Coffee that takes too long. A four-hour session. Dinner with my people. A room that gets dark enough.',
  '{"creative":80,"fandom":50,"nightlife":88,"cozy":44,"cerebral":60,"kinetic":48,"spiritual":72,"culinary":40}'::jsonb,
  'nightlife', 'creative', 0.58, 0.68,
  'Deep Ellum', 'open', true, true
),
(
  'seed-sofia', 'Sofia Reyes', '◇',
  'Pastry chef. I run before service and I will talk about laminated dough until you ask me to stop. I probably will not stop.',
  '["/people/sofia.jpg"]'::jsonb,
  'If you come over I am feeding you. That is not a question.',
  'she/her',
  '["dating","something-slow"]'::jsonb,
  'slow-burn',
  '["follow-through","a sense of humor at 6am","hands that know a craft"]'::jsonb,
  '["people who skip the thank-you","diet talk at the table"]'::jsonb,
  'Dawn loop at White Rock. Service. A plate of whatever I did not sell. Bishop Arts after the rush.',
  '{"creative":68,"fandom":36,"nightlife":32,"cozy":70,"cerebral":48,"kinetic":74,"spiritual":50,"culinary":90}'::jsonb,
  'culinary', 'kinetic', 0.49, 0.74,
  'Bishop Arts', 'open', true, true
),
(
  'seed-kai', 'Kai Nakamura', '○',
  'Narrative designer. Quiet until you mention FromSoftware or Murakami, and then I will not let you leave.',
  '["/people/kai.jpg"]'::jsonb,
  'I am better in person after the first hour. Stay for the first hour.',
  'he/they',
  '["friends","dating","not-sure"]'::jsonb,
  'figuring-it-out',
  '["patience with quiet people","specific taste","kindness to service workers"]'::jsonb,
  '["loud rooms with no exit","people who say they do not play games like it is a personality"]'::jsonb,
  'A long walk with a podcast I will abandon. Ramen. Three hours of a game you have to learn. Sleep at a decent hour for once.',
  '{"creative":72,"fandom":90,"nightlife":28,"cozy":66,"cerebral":84,"kinetic":34,"spiritual":46,"culinary":52}'::jsonb,
  'fandom', 'cerebral', 0.55, 0.7,
  'Design District', 'open', false, true
),
(
  'seed-amara', 'Amara Johnson', '☽',
  'Poet and teaching artist. I host living-room salons in Oak Cliff and I believe in staying after the reading.',
  '["/people/amara.jpg"]'::jsonb,
  'Tell me what you are afraid to want. I will not make it small.',
  'she/her',
  '["dating","community"]'::jsonb,
  'exclusive',
  '["emotional range","people who keep their word","a relationship with their people"]'::jsonb,
  '["urgency that is actually anxiety","treating art like content"]'::jsonb,
  'Slow coffee. The farmers market. A long table, someone reading, someone cooking, nobody performing.',
  '{"creative":82,"fandom":44,"nightlife":30,"cozy":78,"cerebral":76,"kinetic":38,"spiritual":84,"culinary":64}'::jsonb,
  'spiritual', 'creative', 0.5, 0.76,
  'Oak Cliff', 'open', true, true
),
(
  'seed-leo', 'Leo Park', '△',
  'Trail runner and sourdough guy. Yes, both. I know. I will only mention the starter if you ask. You will ask.',
  '["/people/leo.jpg"]'::jsonb,
  'I am looking for someone who will be uncool with me at 6am.',
  'he/him',
  '["dating","friends"]'::jsonb,
  'slow-burn',
  '["early energy","honesty about capacity","a little bit of tease"]'::jsonb,
  '["chronic lateness","treating health like a moral ranking"]'::jsonb,
  'White Rock before the heat. A loaf for a neighbor. Tacos. A nap I pretend I will not take.',
  '{"creative":48,"fandom":30,"nightlife":22,"cozy":60,"cerebral":42,"kinetic":92,"spiritual":58,"culinary":76}'::jsonb,
  'kinetic', 'culinary', 0.46, 0.73,
  'White Rock', 'open', false, true
),
(
  'seed-nia', 'Nia Okonkwo', '✦',
  'Lighting designer for live shows. I am rarely home before two on a weekend and I am very good at finding the exit.',
  '["/people/nia.jpg"]'::jsonb,
  'If the room is good I will stay. If the conversation is better I will leave the room.',
  'she/they',
  '["dating","community","friends"]'::jsonb,
  'open',
  '["craft respect","people who can share a silence in a loud place","directness"]'::jsonb,
  '["jealousy dressed as care","people who need me smaller"]'::jsonb,
  'Soundcheck. A perfect cue. Street food at midnight. The long way home with the windows down.',
  '{"creative":74,"fandom":42,"nightlife":91,"cozy":34,"cerebral":58,"kinetic":62,"spiritual":40,"culinary":46}'::jsonb,
  'nightlife', 'creative', 0.6, 0.64,
  'Downtown Dallas', 'open', true, true
),
(
  'seed-eli', 'Eli Vargas', '◻',
  'Librarian who smokes brisket. I want someone who reads the acknowledgments and will sit on a patio until the fire dies.',
  '["/people/eli.jpg"]'::jsonb,
  'I talk slow. Stay with it.',
  'he/him',
  '["something-slow","dating"]'::jsonb,
  'exclusive',
  '["patience","curiosity about ordinary lives","showing up for the unglamorous parts"]'::jsonb,
  '["people who are never available on weekends","treating books as props"]'::jsonb,
  'The lake in the morning. A stack of holds. A twelve-hour smoke. Friends who know they do not have to help.',
  '{"creative":50,"fandom":48,"nightlife":24,"cozy":82,"cerebral":80,"kinetic":56,"spiritual":66,"culinary":78}'::jsonb,
  'cozy', 'cerebral', 0.44, 0.78,
  'Lakewood', 'open', true, true
),
(
  'seed-priya', 'Priya Shah', '✶',
  'Animation student. I make dumplings from my nani''s recipe and I will talk about color scripts until the tea is cold.',
  '["/people/priya.jpg"]'::jsonb,
  'Want to watch something and then talk about the backgrounds for an hour?',
  'she/her',
  '["friends","dating","not-sure"]'::jsonb,
  'figuring-it-out',
  '["playfulness","people who take craft seriously","gentleness with ambition"]'::jsonb,
  '["cynicism as a default setting","people who interrupt"]'::jsonb,
  'Studio until my eyes hurt. Dumplings. A walk. A film with no plot, on purpose.',
  '{"creative":88,"fandom":84,"nightlife":36,"cozy":70,"cerebral":68,"kinetic":32,"spiritual":44,"culinary":72}'::jsonb,
  'creative', 'fandom', 0.54, 0.74,
  'Uptown', 'open', false, true
),
(
  'seed-ren', 'Chris Delgado', '◎',
  'Everyone calls me Ren. I bartend at a wine bar that pretends it is not a wine bar. Dawn bike rides. Last call stories.',
  '["/people/ren.jpg"]'::jsonb,
  'I am off Tuesday. That is when I am a person again.',
  'he/him',
  '["dating","friends"]'::jsonb,
  'slow-burn',
  '["people who mean the second hang","a little night in them","kindness to the close"]'::jsonb,
  '["people who get ugly with staff","performative busy"]'::jsonb,
  'Close the bar. Sleep late. A long ride toward Terrell. A sandwich I did not have to make.',
  '{"creative":46,"fandom":34,"nightlife":86,"cozy":58,"cerebral":50,"kinetic":70,"spiritual":42,"culinary":64}'::jsonb,
  'nightlife', 'kinetic', 0.48, 0.7,
  'Lower Greenville', 'open', false, true
)
on conflict (user_id) do nothing;

insert into universe_members (universe_id, user_id) values
  ('anime', 'seed-maya'),
  ('music-makers', 'seed-maya'),
  ('book-nook', 'seed-maya'),
  ('music-makers', 'seed-jordan'),
  ('black-creatives', 'seed-jordan'),
  ('night-shift', 'seed-jordan'),
  ('food-lab', 'seed-sofia'),
  ('trail-club', 'seed-sofia'),
  ('black-creatives', 'seed-sofia'),
  ('anime', 'seed-kai'),
  ('game-worlds', 'seed-kai'),
  ('book-nook', 'seed-kai'),
  ('black-creatives', 'seed-amara'),
  ('book-nook', 'seed-amara'),
  ('food-lab', 'seed-amara'),
  ('trail-club', 'seed-leo'),
  ('food-lab', 'seed-leo'),
  ('music-makers', 'seed-leo'),
  ('night-shift', 'seed-nia'),
  ('music-makers', 'seed-nia'),
  ('black-creatives', 'seed-nia'),
  ('book-nook', 'seed-eli'),
  ('food-lab', 'seed-eli'),
  ('trail-club', 'seed-eli'),
  ('anime', 'seed-priya'),
  ('game-worlds', 'seed-priya'),
  ('food-lab', 'seed-priya'),
  ('night-shift', 'seed-ren'),
  ('music-makers', 'seed-ren'),
  ('trail-club', 'seed-ren')
on conflict do nothing;

insert into universe_posts (id, universe_id, user_id, body, created_at) values
  ('p1', 'anime', 'seed-maya', 'Rewatched Millennium Actress in 16mm at a microcinema last night. I am not okay. If you know, you know.', now() - interval '3 hours'),
  ('p2', 'anime', 'seed-kai', 'Looking for one person who will sit through Revolutionary Girl Utena without checking a phone. I will cook.', now() - interval '9 hours'),
  ('p3', 'anime', 'seed-priya', 'The color script in the new Yuasa short is doing something illegal. I sketched eight frames on the DART.', now() - interval '1 day'),
  ('p4', 'music-makers', 'seed-jordan', 'Open studio Thursday. Bring a stem or just come sit. No networking voice.', now() - interval '5 hours'),
  ('p5', 'music-makers', 'seed-maya', 'If you have a 45 that skips in a way you love, I want to hear it.', now() - interval '2 days'),
  ('p6', 'music-makers', 'seed-nia', 'Load-out playlist this week is only things in 3/4. It makes the cases feel lighter. It does not.', now() - interval '14 hours'),
  ('p7', 'black-creatives', 'seed-amara', 'Salon on Sunday. Theme is inheritance. Bring a page or a dish. Oak Cliff. DM for the street.', now() - interval '6 hours'),
  ('p8', 'black-creatives', 'seed-jordan', 'Finished a beat that sounds like the hallway of my grandmother''s church. Playing it for her tomorrow.', now() - interval '1 day'),
  ('p9', 'book-nook', 'seed-eli', 'Just put Morrison back on the display and watched three people pretend they were already going to check it out. Proud of them.', now() - interval '4 hours'),
  ('p10', 'book-nook', 'seed-amara', 'Rereading Citizen. If you have a line that still knocks the air out, leave it here.', now() - interval '20 hours'),
  ('p11', 'night-shift', 'seed-ren', 'Last call story: someone tipped a poem. A real one. I kept it in the tip jar until close.', now() - interval '7 hours'),
  ('p12', 'night-shift', 'seed-nia', 'If you are also walking to your car at 2:40 and you nod, that counts as community.', now() - interval '11 hours'),
  ('p13', 'food-lab', 'seed-sofia', 'Extra kouign-amann at 4 if you can get to Bishop Arts. I will not Instagram them. Come in person.', now() - interval '2 hours'),
  ('p14', 'food-lab', 'seed-priya', 'Dumpling night Friday. Folding is the hang. Eating is the afterparty.', now() - interval '1 day'),
  ('p15', 'trail-club', 'seed-leo', 'White Rock, 6:10am, out-and-back. I bring the flask of coffee. You bring your worst jokes.', now() - interval '8 hours'),
  ('p16', 'trail-club', 'seed-sofia', 'Did eight miles on a bake day. Do not recommend. Also, recommend.', now() - interval '2 days'),
  ('p17', 'game-worlds', 'seed-kai', 'Need a third for a weekend of Elden Ring who will not skip item text. I am so serious.', now() - interval '5 hours'),
  ('p18', 'game-worlds', 'seed-priya', 'I will watch you play a game I am bad at and I will take notes like it is school. This is a love language.', now() - interval '16 hours')
on conflict (id) do nothing;

insert into universe_events (id, universe_id, title, description, location, starts_at, created_by) values
  ('e1', 'anime', 'Still-frame night', 'Three films, no talking until the lights. Then talking.', 'Texas Theatre', now() + interval '3 days', 'seed-maya'),
  ('e2', 'music-makers', 'Loft session', 'Bring headphones and one unfinished idea.', 'Deep Ellum loft', now() + interval '2 days', 'seed-jordan'),
  ('e3', 'black-creatives', 'Inheritance salon', 'Readings, a pot of something, the long sit.', 'Oak Cliff living room', now() + interval '5 days', 'seed-amara'),
  ('e4', 'book-nook', 'Acknowledgments club', 'We only discuss the last three pages. Then dinner.', 'Lakewood library garden', now() + interval '6 days', 'seed-eli'),
  ('e5', 'night-shift', 'After last call', 'Walk, tacos, no recap of the night unless someone needs it.', 'Lower Greenville', now() + interval '1 day', 'seed-ren'),
  ('e6', 'food-lab', 'Folding night', 'Dumplings. Your hands will smell like ginger. That is the point.', 'Uptown apartment', now() + interval '4 days', 'seed-priya'),
  ('e7', 'trail-club', 'Before the heat', 'Easy eight. Coffee after. No Strava required.', 'White Rock Lake', now() + interval '1 day', 'seed-leo'),
  ('e8', 'game-worlds', 'Item-text weekend', 'A long session. Snacks. We read the lore.', 'Design District studio', now() + interval '7 days', 'seed-kai')
on conflict (id) do nothing;
