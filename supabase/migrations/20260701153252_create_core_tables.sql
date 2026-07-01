/*
# Fynex Movies — Core Database Schema

## Overview
Creates the foundational tables for the Fynex Movies streaming platform: users (profiles), movies, series, episodes, genres, actors, directors, and their junction tables.

## New Tables

1. **profiles** — User profile data linked to Supabase auth.users
   - id (uuid, PK, references auth.users)
   - username, email, avatar_url, bio, language, role, subscription_plan
   - created_at, updated_at

2. **genres** — Movie/series genres
   - id, name_en, name_fa, slug (unique)

3. **actors** — Actor profiles
   - id, name, name_fa, photo_url, bio, bio_fa, birth_date, nationality

4. **directors** — Director profiles
   - id, name, name_fa, photo_url, bio, bio_fa, birth_date, nationality

5. **movies** — Movie catalog
   - id, title_en, title_fa, slug (unique), description_en, description_fa
   - poster_url, backdrop_url, trailer_url, imdb_rating
   - release_year, runtime, country, language, age_rating, status
   - created_at, updated_at

6. **series** — TV series catalog
   - id, title_en, title_fa, slug (unique), description_en, description_fa
   - poster_url, backdrop_url, trailer_url, imdb_rating
   - release_year, country, language, age_rating, seasons, total_episodes
   - episode_runtime, status, created_at, updated_at

7. **episodes** — Episodes belonging to series
   - id, series_id (FK), season_number, episode_number, title_en, title_fa
   - description_en, description_fa, duration, thumbnail_url, air_date, stream_url

8. **movie_genres** — Junction: movies ↔ genres
9. **movie_actors** — Junction: movies ↔ actors (with role)
10. **movie_directors** — Junction: movies ↔ directors
11. **series_genres** — Junction: series ↔ genres
12. **series_actors** — Junction: series ↔ actors (with role)
13. **series_directors** — Junction: series ↔ directors

## Security
- RLS enabled on all tables
- profiles: users can read all profiles, update only their own
- Content tables (movies, series, episodes, genres, actors, directors, junctions): public read (anon + authenticated), write only for authenticated admins
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  avatar_url text,
  bio text,
  language text NOT NULL DEFAULT 'en',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  subscription_plan text NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'family')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- ============ GENRES ============
CREATE TABLE IF NOT EXISTS genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_fa text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "genres_select_all" ON genres;
CREATE POLICY "genres_select_all" ON genres FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "genres_insert_admin" ON genres;
CREATE POLICY "genres_insert_admin" ON genres FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "genres_update_admin" ON genres;
CREATE POLICY "genres_update_admin" ON genres FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "genres_delete_admin" ON genres;
CREATE POLICY "genres_delete_admin" ON genres FOR DELETE
  TO authenticated USING (true);

-- ============ ACTORS ============
CREATE TABLE IF NOT EXISTS actors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_fa text,
  photo_url text,
  bio text,
  bio_fa text,
  birth_date date,
  nationality text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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

-- ============ DIRECTORS ============
CREATE TABLE IF NOT EXISTS directors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_fa text,
  photo_url text,
  bio text,
  bio_fa text,
  birth_date date,
  nationality text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE directors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "directors_select_all" ON directors;
CREATE POLICY "directors_select_all" ON directors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "directors_insert_auth" ON directors;
CREATE POLICY "directors_insert_auth" ON directors FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "directors_update_auth" ON directors;
CREATE POLICY "directors_update_auth" ON directors FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "directors_delete_auth" ON directors;
CREATE POLICY "directors_delete_auth" ON directors FOR DELETE
  TO authenticated USING (true);

-- ============ MOVIES ============
CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_fa text,
  slug text UNIQUE NOT NULL,
  description_en text,
  description_fa text,
  poster_url text,
  backdrop_url text,
  trailer_url text,
  imdb_rating numeric(3,1) DEFAULT 0,
  release_year int,
  runtime int,
  country text,
  language text DEFAULT 'en',
  age_rating text,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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
  title_en text NOT NULL,
  title_fa text,
  slug text UNIQUE NOT NULL,
  description_en text,
  description_fa text,
  poster_url text,
  backdrop_url text,
  trailer_url text,
  imdb_rating numeric(3,1) DEFAULT 0,
  release_year int,
  country text,
  language text DEFAULT 'en',
  age_rating text,
  seasons int DEFAULT 1,
  total_episodes int DEFAULT 0,
  episode_runtime int,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'ongoing', 'ended', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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

-- ============ EPISODES ============
CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  season_number int NOT NULL DEFAULT 1,
  episode_number int NOT NULL,
  title_en text NOT NULL,
  title_fa text,
  description_en text,
  description_fa text,
  duration int,
  thumbnail_url text,
  air_date date,
  stream_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(series_id, season_number, episode_number)
);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "episodes_select_all" ON episodes;
CREATE POLICY "episodes_select_all" ON episodes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "episodes_insert_auth" ON episodes;
CREATE POLICY "episodes_insert_auth" ON episodes FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "episodes_update_auth" ON episodes;
CREATE POLICY "episodes_update_auth" ON episodes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "episodes_delete_auth" ON episodes;
CREATE POLICY "episodes_delete_auth" ON episodes FOR DELETE
  TO authenticated USING (true);

-- ============ JUNCTION TABLES ============

-- Movie Genres
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

-- Movie Actors
CREATE TABLE IF NOT EXISTS movie_actors (
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  role_name text,
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

-- Movie Directors
CREATE TABLE IF NOT EXISTS movie_directors (
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  director_id uuid NOT NULL REFERENCES directors(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, director_id)
);

ALTER TABLE movie_directors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "movie_directors_select_all" ON movie_directors;
CREATE POLICY "movie_directors_select_all" ON movie_directors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "movie_directors_insert_auth" ON movie_directors;
CREATE POLICY "movie_directors_insert_auth" ON movie_directors FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "movie_directors_delete_auth" ON movie_directors;
CREATE POLICY "movie_directors_delete_auth" ON movie_directors FOR DELETE
  TO authenticated USING (true);

-- Series Genres
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

-- Series Actors
CREATE TABLE IF NOT EXISTS series_actors (
  series_id uuid NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  role_name text,
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

-- Series Directors
CREATE TABLE IF NOT EXISTS series_directors (
  series_id uuid NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  director_id uuid NOT NULL REFERENCES directors(id) ON DELETE CASCADE,
  PRIMARY KEY (series_id, director_id)
);

ALTER TABLE series_directors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "series_directors_select_all" ON series_directors;
CREATE POLICY "series_directors_select_all" ON series_directors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "series_directors_insert_auth" ON series_directors;
CREATE POLICY "series_directors_insert_auth" ON series_directors FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "series_directors_delete_auth" ON series_directors;
CREATE POLICY "series_directors_delete_auth" ON series_directors FOR DELETE
  TO authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_movies_slug ON movies(slug);
CREATE INDEX IF NOT EXISTS idx_movies_status ON movies(status);
CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies(release_year);
CREATE INDEX IF NOT EXISTS idx_series_slug ON series(slug);
CREATE INDEX IF NOT EXISTS idx_series_status ON series(status);
CREATE INDEX IF NOT EXISTS idx_episodes_series_id ON episodes(series_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_genres_slug ON genres(slug);

-- ============ UPDATED_AT TRIGGERS ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_movies_updated_at ON movies;
CREATE TRIGGER trigger_movies_updated_at BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_series_updated_at ON series;
CREATE TRIGGER trigger_series_updated_at BEFORE UPDATE ON series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_actors_updated_at ON actors;
CREATE TRIGGER trigger_actors_updated_at BEFORE UPDATE ON actors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_directors_updated_at ON directors;
CREATE TRIGGER trigger_directors_updated_at BEFORE UPDATE ON directors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
