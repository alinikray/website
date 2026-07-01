/*
# Add TMDb ID columns for external data sync

## Overview
Adds `tmdb_id` column to movies, series, actors, and directors tables to support importing and deduplicating data from the TMDb API. Also adds `tmdb_poster_path`, `tmdb_backdrop_path` for image URL construction.

## Changes
1. **movies** — Add `tmdb_id` (integer, unique), `tmdb_poster_path`, `tmdb_backdrop_path`
2. **series** — Add `tmdb_id` (integer, unique), `tmdb_poster_path`, `tmdb_backdrop_path`
3. **actors** — Add `tmdb_id` (integer, unique)
4. **directors** — Add `tmdb_id` (integer, unique)

## Notes
- All columns are nullable so existing rows are unaffected
- Unique indexes on tmdb_id prevent duplicate imports
*/

ALTER TABLE movies ADD COLUMN IF NOT EXISTS tmdb_id int;
ALTER TABLE movies ADD COLUMN IF NOT EXISTS tmdb_poster_path text;
ALTER TABLE movies ADD COLUMN IF NOT EXISTS tmdb_backdrop_path text;

ALTER TABLE series ADD COLUMN IF NOT EXISTS tmdb_id int;
ALTER TABLE series ADD COLUMN IF NOT EXISTS tmdb_poster_path text;
ALTER TABLE series ADD COLUMN IF NOT EXISTS tmdb_backdrop_path text;

ALTER TABLE actors ADD COLUMN IF NOT EXISTS tmdb_id int;
ALTER TABLE directors ADD COLUMN IF NOT EXISTS tmdb_id int;

CREATE UNIQUE INDEX IF NOT EXISTS idx_movies_tmdb_id ON movies(tmdb_id) WHERE tmdb_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_series_tmdb_id ON series(tmdb_id) WHERE tmdb_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_actors_tmdb_id ON actors(tmdb_id) WHERE tmdb_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_directors_tmdb_id ON directors(tmdb_id) WHERE tmdb_id IS NOT NULL;
