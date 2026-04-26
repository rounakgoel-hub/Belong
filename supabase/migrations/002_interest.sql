-- Interest registrations: one row per anonymous user per edition
CREATE TABLE interest (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id uuid        NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  anon_id    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (edition_id, anon_id)
);

ALTER TABLE interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert interest"
  ON interest FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read interest"
  ON interest FOR SELECT USING (true);

-- Expose to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE interest;
