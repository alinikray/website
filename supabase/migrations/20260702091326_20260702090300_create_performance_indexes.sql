/*
# Fynex Movies — Performance Indexes

## Overview
Creates indexes to optimize the most common query patterns:
- TMDb ID lookups (sync dedup and external linking)
- Foreign-key joins from junction and child tables
- User-scoped queries (watchlist, ratings, history, comments)
- Recency ordering (created_at) for feeds, explore clips, comments

## Indexes Created

### tmdb_id (unique already, but explicit for clarity — skipped, UNIQUE constraint covers it)
- movies.tmdb_id, series.tmdb_id, actors.tmdb_id already have UNIQUE indexes
  from their column constraints. No duplicate index needed.

### movie_id / series_id (FK join columns)
- idx_movie_genres_genre_id — reverse lookup genre -> movies
- idx_series_genres_genre_id — reverse lookup genre -> series
- idx_movie_actors_actor_id — reverse lookup actor -> movies
- idx_series_actors_actor_id — reverse lookup actor -> series
- idx_explore_clips_movie_id — clips by movie
- idx_explore_clips_series_id — clips by series
- idx_watchlists_movie_id, idx_watchlists_series_id
- idx_ratings_movie_id, idx_ratings_series_id
- idx_comments_movie_id, idx_comments_series_id, idx_comments_explore_clip_id
- idx_comments_parent_comment_id — nested reply traversal
- idx_viewing_history_movie_id, idx_viewing_history_series_id
- idx_movie_streams_movie_id
- idx_movie_downloads_movie_id

### user_id (owner-scoped queries)
- idx_watchlists_user_id
- idx_ratings_user_id
- idx_comments_user_id
- idx_viewing_history_user_id

### created_at (recency feeds)
- idx_explore_clips_created_at
- idx_comments_created_at
- idx_movies_created_at
- idx_series_created_at

### Composite (user + content) — covered by UNIQUE constraints, no duplicate

## Notes
- All indexes use IF NOT EXISTS for idempotency.
- Junction tables use composite PKs which already index (movie_id, genre_id);
  we add the reverse index on the second column for the opposite join direction.
*/

-- Reverse-lookup indexes on junction tables (second column of composite PK)
CREATE INDEX IF NOT EXISTS idx_movie_genres_genre_id ON movie_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_series_genres_genre_id ON series_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_movie_actors_actor_id ON movie_actors(actor_id);
CREATE INDEX IF NOT EXISTS idx_series_actors_actor_id ON series_actors(actor_id);

-- explore_clips
CREATE INDEX IF NOT EXISTS idx_explore_clips_movie_id ON explore_clips(movie_id);
CREATE INDEX IF NOT EXISTS idx_explore_clips_series_id ON explore_clips(series_id);
CREATE INDEX IF NOT EXISTS idx_explore_clips_created_at ON explore_clips(created_at DESC);

-- watchlists
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_movie_id ON watchlists(movie_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_series_id ON watchlists(series_id);

-- ratings
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_movie_id ON ratings(movie_id);
CREATE INDEX IF NOT EXISTS idx_ratings_series_id ON ratings(series_id);

-- comments
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_movie_id ON comments(movie_id);
CREATE INDEX IF NOT EXISTS idx_comments_series_id ON comments(series_id);
CREATE INDEX IF NOT EXISTS idx_comments_explore_clip_id ON comments(explore_clip_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- viewing_history
CREATE INDEX IF NOT EXISTS idx_viewing_history_user_id ON viewing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_viewing_history_movie_id ON viewing_history(movie_id);
CREATE INDEX IF NOT EXISTS idx_viewing_history_series_id ON viewing_history(series_id);

-- movie_streams / movie_downloads
CREATE INDEX IF NOT EXISTS idx_movie_streams_movie_id ON movie_streams(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_downloads_movie_id ON movie_downloads(movie_id);

-- catalog recency
CREATE INDEX IF NOT EXISTS idx_movies_created_at ON movies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_series_created_at ON series(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movies_is_featured ON movies(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_series_is_featured ON series(is_featured) WHERE is_featured = true;
