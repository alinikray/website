/*
# Add streaming sources, downloads, subtitles, genre associations, and explore clips for all seeded content
*/

-- ============ STREAMING SOURCES FOR ALL MOVIES ============
INSERT INTO movie_streams (movie_id, quality, language, subtitle_available, stream_url)
SELECT id, '1080p', 'en', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
FROM movies WHERE tmdb_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO movie_streams (movie_id, quality, language, subtitle_available, stream_url)
SELECT id, '720p', 'en', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
FROM movies WHERE tmdb_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO movie_streams (movie_id, quality, language, subtitle_available, stream_url)
SELECT id, '480p', 'en', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
FROM movies WHERE tmdb_id IS NULL
ON CONFLICT DO NOTHING;

-- ============ DOWNLOAD SOURCES FOR ALL MOVIES ============
INSERT INTO movie_downloads (movie_id, quality, file_size, language, subtitle_available, download_url)
SELECT id, '1080p', '2.3 GB', 'en', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
FROM movies WHERE tmdb_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO movie_downloads (movie_id, quality, file_size, language, subtitle_available, download_url)
SELECT id, '720p', '1.1 GB', 'en', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
FROM movies WHERE tmdb_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO movie_downloads (movie_id, quality, file_size, language, subtitle_available, download_url)
SELECT id, '480p', '520 MB', 'en', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
FROM movies WHERE tmdb_id IS NULL
ON CONFLICT DO NOTHING;

-- ============ SUBTITLES FOR ALL MOVIES ============
INSERT INTO subtitles (movie_id, language, subtitle_url)
SELECT id, 'en', 'https://example.com/subtitles/en/movie.vtt'
FROM movies WHERE tmdb_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO subtitles (movie_id, language, subtitle_url)
SELECT id, 'fa', 'https://example.com/subtitles/fa/movie.vtt'
FROM movies WHERE tmdb_id IS NULL
ON CONFLICT DO NOTHING;

-- ============ GENRE ASSOCIATIONS ============
-- Action
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('dune-part-two', 'the-batman', 'mad-max-fury-road', 'blade-runner-2049', 'the-lord-of-the-rings', 'avengers-endgame', 'gladiator') AND g.slug = 'action'
ON CONFLICT DO NOTHING;

-- Sci-Fi
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('dune-part-two', 'interstellar', 'the-matrix', 'blade-runner-2049', 'tenet', 'avengers-endgame') AND g.slug = 'sci-fi'
ON CONFLICT DO NOTHING;

-- Drama
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('the-shawshank-redemption', 'the-godfather', 'forrest-gump', 'a-separation', 'the-salesman', 'about-elly', 'the-color-of-paradise', 'children-of-heaven', 'the-past', 'the-departed', 'goodfellas', 'casino', 'the-wolf-of-wall-street', 'parasite', 'there-will-be-blood', 'taxi-driver', 'whiplash') AND g.slug = 'drama'
ON CONFLICT DO NOTHING;

-- Crime
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('pulp-fiction', 'goodfellas', 'the-departed', 'scarface', 'casino', 'the-wolf-of-wall-street', 'no-country-for-old-men', 'se7en', 'the-silence-of-the-lambs', 'zodiac', 'prisoners', 'nightcrawler', 'drive', 'the-godfather') AND g.slug = 'crime'
ON CONFLICT DO NOTHING;

-- Mystery
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('se7en', 'the-silence-of-the-lambs', 'zodiac', 'prisoners', 'shutter-island', 'gone-girl', 'hereditary', 'get-out', 'memento', 'the-prestige') AND g.slug = 'mystery'
ON CONFLICT DO NOTHING;

-- Thriller
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('the-batman', 'shutter-island', 'gone-girl', 'se7en', 'the-silence-of-the-lambs', 'zodiac', 'prisoners', 'nightcrawler', 'drive', 'no-country-for-old-men', 'taxi-driver', 'memento', 'joker', 'inception') AND g.slug = 'thriller'
ON CONFLICT DO NOTHING;

-- Horror
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('hereditary', 'get-out') AND g.slug = 'horror'
ON CONFLICT DO NOTHING;

-- Family
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('the-lord-of-the-rings', 'the-color-of-paradise', 'children-of-heaven') AND g.slug = 'family'
ON CONFLICT DO NOTHING;

-- Adventure
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('the-lord-of-the-rings', 'gladiator', 'dune-part-two', 'avengers-endgame') AND g.slug = 'adventure'
ON CONFLICT DO NOTHING;

-- Comedy
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('whiplash', 'the-grand-budapest-hotel', 'the-wolf-of-wall-street') AND g.slug = 'comedy'
ON CONFLICT DO NOTHING;

-- Romance
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.slug IN ('the-color-of-paradise', 'children-of-heaven', 'the-past', 'about-elly') AND g.slug = 'romance'
ON CONFLICT DO NOTHING;

-- ============ SERIES GENRE ASSOCIATIONS ============
INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id FROM series s, genres g
WHERE s.slug IN ('breaking-bad', 'better-call-saul', 'the-sopranos', 'ozark', 'fargo') AND g.slug = 'crime'
ON CONFLICT DO NOTHING;

INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id FROM series s, genres g
WHERE s.slug IN ('breaking-bad', 'better-call-saul', 'the-sopranos', 'ozark', 'fargo', 'succession') AND g.slug = 'drama'
ON CONFLICT DO NOTHING;

INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id FROM series s, genres g
WHERE s.slug IN ('game-of-thrones', 'house-of-the-dragon', 'the-witcher', 'the-lord-of-the-rings') AND g.slug = 'fantasy'
ON CONFLICT DO NOTHING;

INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id FROM series s, genres g
WHERE s.slug IN ('game-of-thrones', 'house-of-the-dragon', 'the-witcher', 'stranger-things', 'dark') AND g.slug = 'mystery'
ON CONFLICT DO NOTHING;

INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id FROM series s, genres g
WHERE s.slug IN ('stranger-things', 'dark', 'the-last-of-us') AND g.slug = 'horror'
ON CONFLICT DO NOTHING;

INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id FROM series s, genres g
WHERE s.slug IN ('the-mandalorian', 'westworld', 'stranger-things', 'dark') AND g.slug = 'sci-fi'
ON CONFLICT DO NOTHING;

INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id FROM series s, genres g
WHERE s.slug IN ('true-detective', 'mindhunter', 'chernobyl') AND g.slug = 'thriller'
ON CONFLICT DO NOTHING;

INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id FROM series s, genres g
WHERE s.slug IN ('the-capital-series', 'shahrazad-series') AND g.slug = 'drama'
ON CONFLICT DO NOTHING;

INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id FROM series s, genres g
WHERE s.slug IN ('the-capital-series') AND g.slug = 'comedy'
ON CONFLICT DO NOTHING;

INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id FROM series s, genres g
WHERE s.slug IN ('shahrazad-series') AND g.slug = 'romance'
ON CONFLICT DO NOTHING;

-- ============ EXPLORE CLIPS FOR TOP MOVIES ============
INSERT INTO explore_clips (movie_id, title, hook_text, video_url, thumbnail_url, views, likes_count, comments_count, shares_count, saves_count, trending_score, status)
SELECT id, title_en || ' - Official Trailer', 'The moment everyone is talking about',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  backdrop_url,
  floor(random() * 2000000) + 100000,
  floor(random() * 80000) + 5000,
  floor(random() * 3000) + 100,
  floor(random() * 15000) + 500,
  floor(random() * 30000) + 1000,
  imdb_rating * 10,
  'active'
FROM movies
WHERE slug IN ('dune-part-two', 'oppenheimer', 'the-batman', 'interstellar', 'the-dark-knight', 'parasite', 'inception', 'joker', 'the-wolf-of-wall-street', 'gone-girl', 'se7en', 'drive', 'nightcrawler', 'prisoners', 'get-out', 'hereditary', 'avengers-endgame', 'fight-club', 'the-matrix', 'the-shawshank-redemption')
ON CONFLICT DO NOTHING;
