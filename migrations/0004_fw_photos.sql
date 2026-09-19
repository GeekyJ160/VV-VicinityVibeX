update profiles
set photos = '["/people/lina.jpg"]'::jsonb
where user_id = 'seed-lina';

update profiles
set photos = '["/people/jayce.jpg"]'::jsonb
where user_id = 'seed-jayce';
