/*
# Fynex Movies — Streaming & Download Tables (Phase 2)

## Overview
Creates tables to support future streaming and download functionality.
These are scaffolded now so the catalog can reference playable sources
without a schema change later. MVP does not serve video from these tables,
but they are ready for Phase 2.

## New Tables

1. **movie_streams** — Streamable sources per movie, by quality
   - id (uuid, PK)
   - movie_id (uuid, FK movies cascade, not null)
   - quality (text, CHECK: 4K|1080p|720p|480p)
   - stream_url (text, not null)
   - is_active (boolean, default true)
   - created_at (timestamptz)

2. **movie_downloads** — Downloadable files per movie, by quality
   - id (uuid, PK)
   - movie_id (uuid, FK movies cascade, not null)
   - quality (text, CHECK: 4K|1080p|720p|480p)
   - download_url (text, not null)
   - file_size (bigint, nullable) — bytes
   - created_at (timestamptz)

## Security (RLS)
- Both tables: public read (anon + authenticated) so any client can resolve a
  playable URL; writes restricted to authenticated users (admin gating at app
  layer for MVP). RLS enabled on both.
*/

-- ============ MOVIE_STREAMS ============
CREATE TABLE IF NOT EXISTS movie_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  quality text NOT NULL CHECK (quality IN ('4K', '1080p', '720p', '480p')),
  stream_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE movie_streams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "movie_streams_select_all" ON movie_streams;
CREATE POLICY "movie_streams_select_all" ON movie_streams FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "movie_streams_insert_auth" ON movie_streams;
CREATE POLICY "movie_streams_insert_auth" ON movie_streams FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "movie_streams_update_auth" ON movie_streams;
CREATE POLICY "movie_streams_update_auth" ON movie_streams FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "movie_streams_delete_auth" ON movie_streams;
CREATE POLICY "movie_streams_delete_auth" ON movie_streams FOR DELETE
  TO authenticated USING (true);

-- ============ MOVIE_DOWNLOADS ============
CREATE TABLE IF NOT EXISTS movie_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  quality text NOT NULL CHECK (quality IN ('4K', '1080p', '720p', '480p')),
  download_url text NOT NULL,
  file_size bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE movie_downloads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "movie_downloads_select_all" ON movie_downloads;
CREATE POLICY "movie_downloads_select_all" ON movie_downloads FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "movie_downloads_insert_auth" ON movie_downloads;
CREATE POLICY "movie_downloads_insert_auth" ON movie_downloads FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "movie_downloads_update_auth" ON movie_downloads;
CREATE POLICY "movie_downloads_update_auth" ON movie_downloads FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "movie_downloads_delete_auth" ON movie_downloads;
CREATE POLICY "movie_downloads_delete_auth" ON movie_downloads FOR DELETE
  TO authenticated USING (true);
