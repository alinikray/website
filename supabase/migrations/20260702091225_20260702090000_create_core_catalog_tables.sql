/*
# Fynex Movies — Core Catalog Tables

## Overview
Creates the foundational tables for the Fynex Movies discovery platform:
user profiles, the movie/series catalog (TMDb-imported), genres, actors,
and their many-to-many junction tables.

## New Tables

1. **profiles** — User profile data linked to Supabase auth.users
   - id (uuid, PK, references auth.users ON DELETE CASCADE)
   - email (text, unique, not null)
   - username (text, unique, not null)
   - avatar_url, bio (text, nullable)
   - language (text, default 'en') — Persian/English support ('en' | 'fa')
   - subscription_plan (text, default 'free', CHECK: free|basic|premium|family)
   - created_at, updated_at (timestamptz)

2. **genres** — Movie and series genres
   - id (uuid, PK)
   - name (text, not null)
   - slug (text, unique, not null)

3. **actors** — Actors and cast
   - id (uuid, PK)
   - tmdb_id (int, unique, not null) — TMDb person ID for sync dedup
   - name (text, not null)
   - biography (text, nullable)
   - birth_date (date, nullable)
   - profile_image (text, nullable)
   - created_at (timestamptz)

4. **movies** — Movie catalog imported from TMDb
   - id (uuid, PK)
   - tmdb_id (int, unique, not null) — TMDb movie ID for sync dedup
   - title, original_title (text)
   - overview (text, nullable)
   - poster_url, backdrop_url, trailer_url (text, nullable)
   - release_date (date, nullable)
   - runtime (int, nullable) — minutes
   - imdb_rating, tmdb_rating (numeric(3,1), default 0)
   - status (text, default 'published', CHECK: draft|published|archived)
   - country, language (text)
   - is_featured (boolean, default false)
   - created_at, updated_at (timestamptz)

5. **series** — TV series catalog imported from TMDb
   - Same shape as movies (tmdb_id, title, original_title, overview, poster_url,
     backdrop_url, release_date, runtime, imdb_rating, tmdb_rating, status,
     country, language, trailer_url, is_featured, created_at, updated_at)

6. **movie_genres** — Junction: movies ↔ genres (composite PK, cascade delete)
7. **series_genres** — Junction: series ↔ genres (composite PK, cascade delete)
8. **movie_actors** — Junction: movies ↔ actors, with character_name (composite PK)
9. **series_actors** — Junction: series ↔ actors, with character_name (composite PK)

## Security (RLS)
- **profiles**: anyone can read (anon + authenticated); users insert/update only their own row.
- **Content tables** (genres, actors, movies, series, all junctions): public read
  (anon + authenticated) so the catalog renders without sign-in; writes restricted
  to authenticated users (admin gating is handled at app layer for MVP).
- All tables have RLS enabled.
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  avatar_url text,
  bio text,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'fa')),
  subscription_plan text NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'family')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ GENRES ============
CREATE TABLE IF NOT EXISTS genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "genres_select_all" ON genres;
CREATE POLICY "genres_select_all" ON genres FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "genres_insert_auth" ON genres;
CREATE POLICY "genres_insert_auth" ON genres FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "genres_update_auth" ON genres;
CREATE POLICY "genres_update_auth" ON genres FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "genres_delete_auth" ON genres;
CREATE POLICY "genres_delete_auth" ON genres FOR DELETE
  TO authenticated USING (true);

-- ============ ACTORS ============
CREATE TABLE IF NOT EXISTS actors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id int UNIQUE NOT NULL,
  name text NOT NULL,
  biography text,
  birth_date date,
  profile_image text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE actors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "actors_select_all" ON actors;
CREATE POLICY "actors_select_all" ON actors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "actors_insert_auth" ON actors;
CREATE POLICY "actors_insert_auth" ON actors FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "actors_update_auth" ON actors;
CREATE POLICY "actors_update_auth" ON actors FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "actors_delete_auth" ON actors;
CREATE POLICY "actors_delete_auth" ON actors FOR DELETE
  TO authenticated USING (true);

-- ============ MOVIES ============
CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id int UNIQUE NOT NULL,
  title text NOT NULL,
  original_title text,
  overview text,
  poster_url text,
  backdrop_url text,
  release_date date,
  runtime int,
  imdb_rating numeric(3,1) DEFAULT 0,
  tmdb_rating numeric(3,1) DEFAULT 0,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  country text,
  language text DEFAULT 'en',
  trailer_url text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "movies_select_all" ON movies;
CREATE POLICY "movies_select_all" ON movies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "movies_insert_auth" ON movies;
CREATE POLICY "movies_insert_auth" ON movies FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "movies_update_auth" ON movies;
CREATE POLICY "movies_update_auth" ON movies FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "movies_delete_auth" ON movies;
CREATE POLICY "movies_delete_auth" ON movies FOR DELETE
  TO authenticated USING (true);

-- ============ SERIES ============
CREATE TABLE IF NOT EXISTS series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id int UNIQUE NOT NULL,
  title text NOT NULL,
  original_title text,
  overview text,
  poster_url text,
  backdrop_url text,
  release_date date,
  runtime int,
  imdb_rating numeric(3,1) DEFAULT 0,
  tmdb_rating numeric(3,1) DEFAULT 0,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  country text,
  language text DEFAULT 'en',
  trailer_url text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE series ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "series_select_all" ON series;
CREATE POLICY "series_select_all" ON series FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "series_insert_auth" ON series;
CREATE POLICY "series_insert_auth" ON series FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "series_update_auth" ON series;
CREATE POLICY "series_update_auth" ON series FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "series_delete_auth" ON series;
CREATE POLICY "series_delete_auth" ON series FOR DELETE
  TO authenticated USING (true);

-- ============ JUNCTION: MOVIE_GENRES ============
CREATE TABLE IF NOT EXISTS movie_genres (
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  genre_id uuid NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

ALTER TABLE movie_genres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "movie_genres_select_all" ON movie_genres;
CREATE POLICY "movie_genres_select_all" ON movie_genres FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "movie_genres_insert_auth" ON movie_genres;
CREATE POLICY "movie_genres_insert_auth" ON movie_genres FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "movie_genres_delete_auth" ON movie_genres;
CREATE POLICY "movie_genres_delete_auth" ON movie_genres FOR DELETE
  TO authenticated USING (true);

-- ============ JUNCTION: SERIES_GENRES ============
CREATE TABLE IF NOT EXISTS series_genres (
  series_id uuid NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  genre_id uuid NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (series_id, genre_id)
);

ALTER TABLE series_genres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "series_genres_select_all" ON series_genres;
CREATE POLICY "series_genres_select_all" ON series_genres FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "series_genres_insert_auth" ON series_genres;
CREATE POLICY "series_genres_insert_auth" ON series_genres FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "series_genres_delete_auth" ON series_genres;
CREATE POLICY "series_genres_delete_auth" ON series_genres FOR DELETE
  TO authenticated USING (true);

-- ============ JUNCTION: MOVIE_ACTORS ============
CREATE TABLE IF NOT EXISTS movie_actors (
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  character_name text,
  PRIMARY KEY (movie_id, actor_id)
);

ALTER TABLE movie_actors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "movie_actors_select_all" ON movie_actors;
CREATE POLICY "movie_actors_select_all" ON movie_actors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "movie_actors_insert_auth" ON movie_actors;
CREATE POLICY "movie_actors_insert_auth" ON movie_actors FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "movie_actors_delete_auth" ON movie_actors;
CREATE POLICY "movie_actors_delete_auth" ON movie_actors FOR DELETE
  TO authenticated USING (true);

-- ============ JUNCTION: SERIES_ACTORS ============
CREATE TABLE IF NOT EXISTS series_actors (
  series_id uuid NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  character_name text,
  PRIMARY KEY (series_id, actor_id)
);

ALTER TABLE series_actors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "series_actors_select_all" ON series_actors;
CREATE POLICY "series_actors_select_all" ON series_actors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "series_actors_insert_auth" ON series_actors;
CREATE POLICY "series_actors_insert_auth" ON series_actors FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "series_actors_delete_auth" ON series_actors;
CREATE POLICY "series_actors_delete_auth" ON series_actors FOR DELETE
  TO authenticated USING (true);
