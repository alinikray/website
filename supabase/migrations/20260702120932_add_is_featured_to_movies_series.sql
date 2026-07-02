-- Add is_featured flag to movies and series for hero banner selection
ALTER TABLE movies ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE series ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- Index for fast featured lookups
CREATE INDEX IF NOT EXISTS idx_movies_is_featured ON movies(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_series_is_featured ON series(is_featured) WHERE is_featured = true;

-- Mark the top 5 highest-rated published movies as featured by default
UPDATE movies
SET is_featured = true
WHERE id IN (
  SELECT id FROM movies
  WHERE status = 'published' AND backdrop_url IS NOT NULL AND backdrop_url != ''
  ORDER BY imdb_rating DESC
  LIMIT 5
);

-- Mark the top 2 highest-rated series as featured by default
UPDATE series
SET is_featured = true
WHERE id IN (
  SELECT id FROM series
  WHERE backdrop_url IS NOT NULL AND backdrop_url != ''
  ORDER BY imdb_rating DESC
  LIMIT 2
);
