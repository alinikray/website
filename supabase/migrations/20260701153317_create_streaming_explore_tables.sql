/*
# Fynex Movies — Streaming, Downloads, Subtitles & Explore

## Overview
Creates tables for streaming sources, download sources, subtitles, explore clips, and their relationships to movies.

## New Tables

1. **movie_streams** — Streaming sources for movies
   - id, movie_id (FK), quality (1080p/720p/480p), language, subtitle_available, stream_url

2. **movie_downloads** — Download sources for movies
   - id, movie_id (FK), quality, file_size, language, subtitle_available, download_url

3. **subtitles** — Subtitle files for movies
   - id, movie_id (FK), language (en/fa), subtitle_url

4. **episode_streams** — Streaming sources for episodes
   - id, episode_id (FK), quality, language, stream_url

5. **episode_subtitles** — Subtitle files for episodes
   - id, episode_id (FK), language, subtitle_url

6. **explore_clips** — TikTok-style discovery clips linked to movies
   - id, movie_id (FK), title, hook_text, video_url, thumbnail_url
   - views, likes_count, comments_count, shares_count, saves_count
   - trending_score, status, created_at

## Security
- RLS enabled on all tables
- All tables: public read (anon + authenticated), write for authenticated
*/

-- ============ MOVIE STREAMS ============
CREATE TABLE IF NOT EXISTS movie_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  quality text NOT NULL CHECK (quality IN ('1080p', '720p', '480p', '4K')),
  language text NOT NULL DEFAULT 'en',
  subtitle_available boolean DEFAULT true,
  stream_url text NOT NULL,
  created_at timestamptz DEFAULT now()
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

-- ============ MOVIE DOWNLOADS ============
CREATE TABLE IF NOT EXISTS movie_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  quality text NOT NULL CHECK (quality IN ('1080p', '720p', '480p', '4K')),
  file_size text,
  language text NOT NULL DEFAULT 'en',
  subtitle_available boolean DEFAULT true,
  download_url text NOT NULL,
  created_at timestamptz DEFAULT now()
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

-- ============ SUBTITLES ============
CREATE TABLE IF NOT EXISTS subtitles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  language text NOT NULL CHECK (language IN ('en', 'fa')),
  subtitle_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subtitles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subtitles_select_all" ON subtitles;
CREATE POLICY "subtitles_select_all" ON subtitles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "subtitles_insert_auth" ON subtitles;
CREATE POLICY "subtitles_insert_auth" ON subtitles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "subtitles_update_auth" ON subtitles;
CREATE POLICY "subtitles_update_auth" ON subtitles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "subtitles_delete_auth" ON subtitles;
CREATE POLICY "subtitles_delete_auth" ON subtitles FOR DELETE
  TO authenticated USING (true);

-- ============ EPISODE STREAMS ============
CREATE TABLE IF NOT EXISTS episode_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  quality text NOT NULL CHECK (quality IN ('1080p', '720p', '480p', '4K')),
  language text NOT NULL DEFAULT 'en',
  stream_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE episode_streams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "episode_streams_select_all" ON episode_streams;
CREATE POLICY "episode_streams_select_all" ON episode_streams FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "episode_streams_insert_auth" ON episode_streams;
CREATE POLICY "episode_streams_insert_auth" ON episode_streams FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "episode_streams_update_auth" ON episode_streams;
CREATE POLICY "episode_streams_update_auth" ON episode_streams FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "episode_streams_delete_auth" ON episode_streams;
CREATE POLICY "episode_streams_delete_auth" ON episode_streams FOR DELETE
  TO authenticated USING (true);

-- ============ EPISODE SUBTITLES ============
CREATE TABLE IF NOT EXISTS episode_subtitles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  language text NOT NULL CHECK (language IN ('en', 'fa')),
  subtitle_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE episode_subtitles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "episode_subtitles_select_all" ON episode_subtitles;
CREATE POLICY "episode_subtitles_select_all" ON episode_subtitles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "episode_subtitles_insert_auth" ON episode_subtitles;
CREATE POLICY "episode_subtitles_insert_auth" ON episode_subtitles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "episode_subtitles_delete_auth" ON episode_subtitles;
CREATE POLICY "episode_subtitles_delete_auth" ON episode_subtitles FOR DELETE
  TO authenticated USING (true);

-- ============ EXPLORE CLIPS ============
CREATE TABLE IF NOT EXISTS explore_clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  title text NOT NULL,
  hook_text text,
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  views bigint NOT NULL DEFAULT 0,
  likes_count bigint NOT NULL DEFAULT 0,
  comments_count bigint NOT NULL DEFAULT 0,
  shares_count bigint NOT NULL DEFAULT 0,
  saves_count bigint NOT NULL DEFAULT 0,
  trending_score numeric(10,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE explore_clips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "explore_clips_select_all" ON explore_clips;
CREATE POLICY "explore_clips_select_all" ON explore_clips FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "explore_clips_insert_auth" ON explore_clips;
CREATE POLICY "explore_clips_insert_auth" ON explore_clips FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "explore_clips_update_auth" ON explore_clips;
CREATE POLICY "explore_clips_update_auth" ON explore_clips FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "explore_clips_delete_auth" ON explore_clips;
CREATE POLICY "explore_clips_delete_auth" ON explore_clips FOR DELETE
  TO authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_movie_streams_movie_id ON movie_streams(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_downloads_movie_id ON movie_downloads(movie_id);
CREATE INDEX IF NOT EXISTS idx_subtitles_movie_id ON subtitles(movie_id);
CREATE INDEX IF NOT EXISTS idx_explore_clips_movie_id ON explore_clips(movie_id);
CREATE INDEX IF NOT EXISTS idx_explore_clips_status ON explore_clips(status);
CREATE INDEX IF NOT EXISTS idx_explore_clips_trending ON explore_clips(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_explore_clips_created ON explore_clips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_episode_streams_ep_id ON episode_streams(episode_id);
CREATE INDEX IF NOT EXISTS idx_episode_subtitles_ep_id ON episode_subtitles(episode_id);
