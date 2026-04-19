-- Run this in your Supabase SQL editor to create the prints table.

CREATE TABLE prints (
  id        SERIAL PRIMARY KEY,
  name      TEXT    NOT NULL,
  link      TEXT    NOT NULL,
  submitter_name TEXT NOT NULL,
  status    TEXT    NOT NULL DEFAULT 'queued',
  position  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

-- Allow public read/write (no auth required for this app).
ALTER TABLE prints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all" ON prints
  FOR ALL
  USING (true)
  WITH CHECK (true);
