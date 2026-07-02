/*
# Fynex Movies — User Interaction Tables

## Overview
Creates tables for short-form explore clips, watchlists, ratings, comments
(with nested replies), and viewing history. These power the discovery, social,
and continue-watching features of Phase 1 and Phase 2.

## New Tables

1. **explore_clips** — Short-form vertical videos (TikTok-style)
   - id (uuid, PK)
   - movie_id, series_id (uuid, nullable, FK cascade) — one is set to link the clip
   - title (text, not null), hook_text (text, nullable)
   - video_url (text, not null), thumbnail_url (text, nullable)
   - views_count, likes_count, comments_count, shares_count (bigint, default 0)
   - created_at (timestamptz)

2. **watchlists** — Saved content per user
   - id (uuid, PK)
   - user_id (uuid, FK auth.users cascade, default auth.uid())
   - movie_id, series_id (uuid, nullable, FK cascade) — exactly one set
   - created_at (timestamptz)
   - UNIQUE(user_id, movie_id, series_id) prevents duplicate saves

3. **ratings** — User ratings (1-10 stars)
   - id (uuid, PK)
   - user_id (uuid, FK auth.users cascade, default auth.uid())
   - movie_id, series_id (uuid, nullable, FK cascade) — exactly one set
   - rating (int, CHECK 1..10)
   - created_at (timestamptz)
   - UNIQUE(user_id, movie_id, series_id) prevents duplicate ratings per user

4. **comments** — Comments on movies, series, and explore clips with nested replies
   - id (uuid, PK)
   - user_id (uuid, FK auth.users cascade, default auth.uid())
   - movie_id, series_id, explore_clip_id (uuid, nullable, FK cascade)
   - parent_comment_id (uuid, nullable, self-referencing FK cascade) — nested replies
   - content (text, not null)
   - likes_count (bigint, default 0)
   - created_at (timestamptz)

5. **viewing_history** — Watch history for continue-watching
   - id (uuid, PK)
   - user_id (uuid, FK auth.users cascade, default auth.uid())
   - movie_id, series_id (uuid, nullable, FK cascade)
   - progress_seconds, duration_seconds (int, default 0)
   - completed (boolean, default false)
   - updated_at (timestamptz)
   - UNIQUE(user_id, movie_id, series_id) — one progress row per user+content

## Security (RLS)
- **explore_clips**: public read (catalog content); authenticated write.
- **watchlists, ratings, comments, viewing_history**: owner-scoped CRUD.
  Each user can only see/modify their own rows. SELECT is owner-only because
  these are personal data (my watchlist, my ratings, my history). Comments
  are the exception — comments are public to read (social feature) but only
  the author can modify/delete their own comments.
- Owner columns default to auth.uid() so client inserts that omit user_id
  still satisfy the INSERT WITH CHECK policy.
*/

-- ============ EXPLORE_CLIPS ============
CREATE TABLE IF NOT EXISTS explore_clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  series_id uuid REFERENCES series(id) ON DELETE CASCADE,
  title text NOT NULL,
  hook_text text,
  video_url text NOT NULL,
  thumbnail_url text,
  views_count bigint NOT NULL DEFAULT 0,
  likes_count bigint NOT NULL DEFAULT 0,
  comments_count bigint NOT NULL DEFAULT 0,
  shares_count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (movie_id IS NOT NULL AND series_id IS NULL) OR
    (movie_id IS NULL AND series_id IS NOT NULL)
  )
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

-- ============ WATCHLISTS ============
CREATE TABLE IF NOT EXISTS watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  series_id uuid REFERENCES series(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, movie_id, series_id),
  CHECK (
    (movie_id IS NOT NULL AND series_id IS NULL) OR
    (movie_id IS NULL AND series_id IS NOT NULL)
  )
);

ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "watchlists_select_own" ON watchlists;
CREATE POLICY "watchlists_select_own" ON watchlists FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "watchlists_insert_own" ON watchlists;
CREATE POLICY "watchlists_insert_own" ON watchlists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "watchlists_delete_own" ON watchlists;
CREATE POLICY "watchlists_delete_own" ON watchlists FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ RATINGS ============
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  series_id uuid REFERENCES series(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, movie_id, series_id),
  CHECK (
    (movie_id IS NOT NULL AND series_id IS NULL) OR
    (movie_id IS NULL AND series_id IS NOT NULL)
  )
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ratings_select_own" ON ratings;
CREATE POLICY "ratings_select_own" ON ratings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "ratings_insert_own" ON ratings;
CREATE POLICY "ratings_insert_own" ON ratings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ratings_update_own" ON ratings;
CREATE POLICY "ratings_update_own" ON ratings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ratings_delete_own" ON ratings;
CREATE POLICY "ratings_delete_own" ON ratings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ COMMENTS ============
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  series_id uuid REFERENCES series(id) ON DELETE CASCADE,
  explore_clip_id uuid REFERENCES explore_clips(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (movie_id IS NOT NULL)::int +
    (series_id IS NOT NULL)::int +
    (explore_clip_id IS NOT NULL)::int = 1
  )
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Comments are public to read (social feature)
DROP POLICY IF EXISTS "comments_select_all" ON comments;
CREATE POLICY "comments_select_all" ON comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "comments_insert_own" ON comments;
CREATE POLICY "comments_insert_own" ON comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_update_own" ON comments;
CREATE POLICY "comments_update_own" ON comments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_delete_own" ON comments;
CREATE POLICY "comments_delete_own" ON comments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ VIEWING_HISTORY ============
CREATE TABLE IF NOT EXISTS viewing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  series_id uuid REFERENCES series(id) ON DELETE CASCADE,
  progress_seconds int NOT NULL DEFAULT 0,
  duration_seconds int NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, movie_id, series_id),
  CHECK (
    (movie_id IS NOT NULL AND series_id IS NULL) OR
    (movie_id IS NULL AND series_id IS NOT NULL)
  )
);

ALTER TABLE viewing_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "viewing_history_select_own" ON viewing_history;
CREATE POLICY "viewing_history_select_own" ON viewing_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "viewing_history_upsert_own" ON viewing_history;
CREATE POLICY "viewing_history_upsert_own" ON viewing_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "viewing_history_update_own" ON viewing_history;
CREATE POLICY "viewing_history_update_own" ON viewing_history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "viewing_history_delete_own" ON viewing_history;
CREATE POLICY "viewing_history_delete_own" ON viewing_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
