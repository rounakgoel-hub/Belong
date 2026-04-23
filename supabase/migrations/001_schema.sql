-- ============================================================
-- Belong. — Edition 1: Dead Song Resurrection Project
-- ============================================================

-- Editions
create table if not exists editions (
  id           uuid primary key default gen_random_uuid(),
  title        text,
  subtitle     text,
  volume       integer,
  city         text,
  show_date    timestamptz,
  wipe_date    timestamptz,
  playlist_url text,
  status       text default 'active' -- 'active' | 'show_done' | 'wiped'
);

-- Pins (song drops)
create table if not exists pins (
  id               uuid primary key default gen_random_uuid(),
  edition_id       uuid references editions(id),
  lat              float,
  lng              float,
  song_name        text,
  artist           text,
  spotify_track_id text,
  album_art_url    text,
  preview_url      text,
  memory           text,       -- 150 char max enforced in app
  handle           text,       -- optional, anonymous by default
  anon_id          text,
  resonance_count  int default 0,
  created_at       timestamptz default now()
);

-- Resonances
create table if not exists resonances (
  id         uuid primary key default gen_random_uuid(),
  pin_id     uuid references pins(id) on delete cascade,
  anon_id    text,
  created_at timestamptz default now(),
  unique(pin_id, anon_id)
);

-- Comments
create table if not exists comments (
  id         uuid primary key default gen_random_uuid(),
  pin_id     uuid references pins(id) on delete cascade,
  anon_id    text,
  handle     text,
  body       text,             -- 200 char max enforced in app
  created_at timestamptz default now()
);

-- Waitlist
create table if not exists waitlist (
  id         uuid primary key default gen_random_uuid(),
  edition_id uuid references editions(id),
  contact    text,             -- phone or email
  anon_id    text,
  created_at timestamptz default now()
);

-- ============================================================
-- Enable realtime on pins
-- ============================================================
alter publication supabase_realtime add table pins;
alter publication supabase_realtime add table resonances;

-- ============================================================
-- Seed: Edition 1
-- ============================================================
insert into editions (id, title, subtitle, volume, city, show_date, wipe_date, status)
values (
  'ed000001-0000-0000-0000-000000000001',
  'Dead Song Resurrection Project',
  'Reviving songs we think people stopped playing.',
  1,
  'Chennai',
  '2026-05-30T19:00:00+05:30',
  '2026-06-01T00:00:00+05:30',
  'active'
);

-- ============================================================
-- Seed: 5 pins
-- ============================================================
insert into pins (edition_id, lat, lng, song_name, artist, memory, handle, anon_id, resonance_count, created_at)
values

-- Marina Beach area
(
  'ed000001-0000-0000-0000-000000000001',
  13.0500, 80.2824,
  'Woh Kaagaz Ki Kashti',
  'Jagjit Singh',
  'My father used to hum this walking home from the bus stop. I haven''t heard it since he passed.',
  'Arjun M.',
  'seed-anon-001',
  7,
  now() - interval '3 days'
),

-- T. Nagar
(
  'ed000001-0000-0000-0000-000000000001',
  13.0418, 80.2341,
  'Dil Dhoondta Hai',
  'Bhupinder Singh / Gulzar',
  'Heard this once on a radio in a barber shop in 2009. Spent 10 years trying to find its name.',
  NULL,
  'seed-anon-002',
  12,
  now() - interval '2 days'
),

-- Mylapore
(
  'ed000001-0000-0000-0000-000000000001',
  13.0338, 80.2676,
  'Chura Liya Hai Tumne',
  'R.D. Burman / Asha Bhosle',
  'My grandmother sang this while cooking every Sunday. The smell of rasam and this song are the same memory.',
  'Priya K.',
  'seed-anon-003',
  19,
  now() - interval '5 days'
),

-- Anna Nagar
(
  'ed000001-0000-0000-0000-000000000001',
  13.0850, 80.2101,
  'Tere Bina Zindagi Se',
  'Kishore Kumar / Lata Mangeshkar',
  'This song got me through a breakup in 2015. No one I know has ever heard of it. That felt lonely.',
  NULL,
  'seed-anon-004',
  5,
  now() - interval '1 day'
),

-- Adyar
(
  'ed000001-0000-0000-0000-000000000001',
  13.0067, 80.2573,
  'Ek Hasina Thi',
  'Kishore Kumar / R.D. Burman',
  'Played this on loop the night before my board exams. Don''t know why. Still don''t.',
  'Karthik S.',
  'seed-anon-005',
  9,
  now() - interval '4 days'
);
