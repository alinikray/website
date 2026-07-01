/*
# Fynex Movies — Seed Data

## Overview
Populates initial data: subscription plans, genres, sample movies with streaming sources, download sources, subtitles, and explore clips.

## Data Inserted
1. **subscription_plans** — 3 tiers: Free, Basic, Premium
2. **genres** — 12 common movie genres (English + Persian names)
3. **movies** — 6 sample movies with bilingual titles and descriptions
4. **movie_streams** — Streaming sources (1080p, 720p, 480p) for each movie
5. **movie_downloads** — Download sources for each movie
6. **subtitles** — English + Persian subtitles for each movie
7. **explore_clips** — 6 discovery clips linked to movies
8. **movie_genres** — Genre associations for movies
*/

-- ============ SUBSCRIPTION PLANS ============
INSERT INTO subscription_plans (name, price, currency, billing_cycle, features, is_active, sort_order) VALUES
  ('Free', 0, 'USD', 'monthly', '["Watch with ads", "720p quality", "1 device"]'::jsonb, true, 1),
  ('Basic', 7.99, 'USD', 'monthly', '["No ads", "1080p quality", "2 devices", "Download available"]'::jsonb, true, 2),
  ('Premium', 14.99, 'USD', 'monthly', '["No ads", "4K quality", "4 devices", "Download available", "Early access", "Priority support"]'::jsonb, true, 3)
ON CONFLICT DO NOTHING;

-- ============ GENRES ============
INSERT INTO genres (name_en, name_fa, slug) VALUES
  ('Drama', 'درام', 'drama'),
  ('Thriller', 'هیجان‌انگیز', 'thriller'),
  ('Comedy', 'کمدی', 'comedy'),
  ('Action', 'اکشن', 'action'),
  ('Romance', 'عاشقانه', 'romance'),
  ('Crime', 'جنایی', 'crime'),
  ('Mystery', 'معمایی', 'mystery'),
  ('Sci-Fi', 'علمی-تخیلی', 'sci-fi'),
  ('Horror', 'ترسناک', 'horror'),
  ('Documentary', 'مستند', 'documentary'),
  ('Animation', 'انیمیشن', 'animation'),
  ('Adventure', 'ماجراجویی', 'adventure')
ON CONFLICT (slug) DO NOTHING;

-- ============ MOVIES ============
INSERT INTO movies (title_en, title_fa, slug, description_en, description_fa, poster_url, backdrop_url, trailer_url, imdb_rating, release_year, runtime, country, language, age_rating, status) VALUES
  (
    'The Golden Cage',
    'قفس طلایی',
    'the-golden-cage',
    'A wealthy family''s secrets unravel when a stranger arrives at their estate, revealing decades of hidden truths.',
    'اسرار یک خانواده ثروتمند زمانی که یک غریبه به عمارت آن‌ها می‌آید، فاش می‌شود و دهه‌ها حقیقت پنهان را آشکار می‌کند.',
    'https://images.pexels.com/photos/7234253/pexels-photo-7234253.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/7234253/pexels-photo-7234253.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    8.4,
    2024,
    132,
    'Iran',
    'fa',
    'PG-13',
    'published'
  ),
  (
    'Night Watch',
    'نگهبان شب',
    'night-watch',
    'A night security guard discovers that the museum he protects holds artifacts from an ancient civilization with mysterious powers.',
    'یک نگهبان شب متوجه می‌شود که موزه‌ای که از آن محافظت می‌کند، آثار تمدنی باستانی با قدرت‌های مرموز را در خود نگه می‌دارد.',
    'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    7.9,
    2023,
    118,
    'Iran',
    'fa',
    'PG-13',
    'published'
  ),
  (
    'Desert Wind',
    'باد صحرا',
    'desert-wind',
    'In the vast Iranian desert, a young woman embarks on a journey of self-discovery that will change her family forever.',
    'در صحرای وسیع ایران، یک زن جوان سفری کشف خود را آغاز می‌کند که خانواده او را برای همیشه تغییر می‌دهد.',
    'https://images.pexels.com/photos/3758956/pexels-photo-3758956.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/3758956/pexels-photo-3758956.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    8.1,
    2024,
    125,
    'Iran',
    'fa',
    'PG-13',
    'published'
  ),
  (
    'Shahrazad',
    'شهرزاد',
    'shahrazad',
    'A modern retelling of the classic tale, set in contemporary Tehran where a young storyteller captivates a powerful businessman.',
    'بازگویی مدرن داستان کلاسیک، در تهران معاصر جایی که یک قصه‌گوی جوان یک تاجر قدرتمند را مجذوب خود می‌کند.',
    'https://images.pexels.com/photos/7233899/pexels-photo-7233899.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/7233899/pexels-photo-7233899.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    8.6,
    2023,
    145,
    'Iran',
    'fa',
    'PG-13',
    'published'
  ),
  (
    'The Capital',
    'پایتخت',
    'the-capital',
    'A political thriller about a journalist who uncovers corruption at the highest levels of government.',
    'یک هیجان‌انگیز سیاسی درباره یک روزنامه‌نگار که فساد را در بالاترین سطوح دولت کشف می‌کند.',
    'https://images.pexels.com/photos/7234329/pexels-photo-7234329.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/7234329/pexels-photo-7234329.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    7.7,
    2024,
    110,
    'Iran',
    'fa',
    'PG-13',
    'published'
  ),
  (
    'The Last Stand',
    'آخرین ایستادگی',
    'the-last-stand',
    'A retired soldier must defend his village when an ancient enemy returns with a supernatural army.',
    'یک سرباز بازنشسته باید از روستای خود دفاع کند وقتی یک دشمن باستانی با ارتش ماورایی بازمی‌گردد.',
    'https://images.pexels.com/photos/7234258/pexels-photo-7234258.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/7234258/pexels-photo-7234258.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    7.5,
    2023,
    128,
    'Iran',
    'fa',
    'PG-13',
    'published'
  )
ON CONFLICT (slug) DO NOTHING;

-- ============ MOVIE GENRES ============
INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'the-golden-cage' AND g.slug = 'drama'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'the-golden-cage' AND g.slug = 'thriller'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'night-watch' AND g.slug = 'mystery'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'night-watch' AND g.slug = 'thriller'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'desert-wind' AND g.slug = 'drama'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'desert-wind' AND g.slug = 'romance'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'shahrazad' AND g.slug = 'drama'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'shahrazad' AND g.slug = 'romance'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'the-capital' AND g.slug = 'crime'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'the-capital' AND g.slug = 'thriller'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'the-last-stand' AND g.slug = 'action'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
  SELECT m.id, g.id FROM movies m, genres g
  WHERE m.slug = 'the-last-stand' AND g.slug = 'adventure'
  ON CONFLICT DO NOTHING;

-- ============ MOVIE STREAMS ============
-- Using sample video URLs for demonstration
INSERT INTO movie_streams (movie_id, quality, language, subtitle_available, stream_url)
  SELECT id, '1080p', 'fa', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  FROM movies WHERE slug = 'the-golden-cage'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_streams (movie_id, quality, language, subtitle_available, stream_url)
  SELECT id, '720p', 'fa', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  FROM movies WHERE slug = 'the-golden-cage'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_streams (movie_id, quality, language, subtitle_available, stream_url)
  SELECT id, '480p', 'fa', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  FROM movies WHERE slug = 'the-golden-cage'
  ON CONFLICT DO NOTHING;

-- For all other movies, add streams
INSERT INTO movie_streams (movie_id, quality, language, subtitle_available, stream_url)
  SELECT id, '1080p', 'fa', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  FROM movies WHERE slug != 'the-golden-cage'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_streams (movie_id, quality, language, subtitle_available, stream_url)
  SELECT id, '720p', 'fa', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  FROM movies WHERE slug != 'the-golden-cage'
  ON CONFLICT DO NOTHING;

INSERT INTO movie_streams (movie_id, quality, language, subtitle_available, stream_url)
  SELECT id, '480p', 'fa', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  FROM movies WHERE slug != 'the-golden-cage'
  ON CONFLICT DO NOTHING;

-- ============ MOVIE DOWNLOADS ============
INSERT INTO movie_downloads (movie_id, quality, file_size, language, subtitle_available, download_url)
  SELECT id, '1080p', '2.3 GB', 'fa', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  FROM movies
  ON CONFLICT DO NOTHING;

INSERT INTO movie_downloads (movie_id, quality, file_size, language, subtitle_available, download_url)
  SELECT id, '720p', '1.1 GB', 'fa', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  FROM movies
  ON CONFLICT DO NOTHING;

INSERT INTO movie_downloads (movie_id, quality, file_size, language, subtitle_available, download_url)
  SELECT id, '480p', '520 MB', 'fa', true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  FROM movies
  ON CONFLICT DO NOTHING;

-- ============ SUBTITLES ============
INSERT INTO subtitles (movie_id, language, subtitle_url)
  SELECT id, 'en', 'https://example.com/subtitles/en/the-golden-cage.vtt'
  FROM movies
  ON CONFLICT DO NOTHING;

INSERT INTO subtitles (movie_id, language, subtitle_url)
  SELECT id, 'fa', 'https://example.com/subtitles/fa/the-golden-cage.vtt'
  FROM movies
  ON CONFLICT DO NOTHING;

-- ============ EXPLORE CLIPS ============
INSERT INTO explore_clips (movie_id, title, hook_text, video_url, thumbnail_url, views, likes_count, comments_count, shares_count, saves_count, trending_score, status)
  SELECT id, 'The ending shocked millions of viewers', 'The ending shocked millions of viewers',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://images.pexels.com/photos/7234253/pexels-photo-7234253.jpeg?auto=compress&cs=tinysrgb&w=500',
    1200000, 45000, 1200, 8900, 15000, 95.5, 'active'
  FROM movies WHERE slug = 'the-golden-cage'
  ON CONFLICT DO NOTHING;

INSERT INTO explore_clips (movie_id, title, hook_text, video_url, thumbnail_url, views, likes_count, comments_count, shares_count, saves_count, trending_score, status)
  SELECT id, 'One of the most underrated thrillers ever made', 'One of the most underrated thrillers ever made',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=500',
    890000, 32000, 890, 5600, 9800, 82.3, 'active'
  FROM movies WHERE slug = 'night-watch'
  ON CONFLICT DO NOTHING;

INSERT INTO explore_clips (movie_id, title, hook_text, video_url, thumbnail_url, views, likes_count, comments_count, shares_count, saves_count, trending_score, status)
  SELECT id, 'This scene changed the entire story', 'This scene changed the entire story',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://images.pexels.com/photos/3758956/pexels-photo-3758956.jpeg?auto=compress&cs=tinysrgb&w=500',
    2100000, 78000, 2100, 12000, 25000, 98.1, 'active'
  FROM movies WHERE slug = 'desert-wind'
  ON CONFLICT DO NOTHING;

INSERT INTO explore_clips (movie_id, title, hook_text, video_url, thumbnail_url, views, likes_count, comments_count, shares_count, saves_count, trending_score, status)
  SELECT id, 'If you loved Parasite, watch this next', 'If you loved Parasite, watch this next',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://images.pexels.com/photos/7233899/pexels-photo-7233899.jpeg?auto=compress&cs=tinysrgb&w=500',
    445000, 18000, 450, 2300, 5600, 71.2, 'active'
  FROM movies WHERE slug = 'shahrazad'
  ON CONFLICT DO NOTHING;

INSERT INTO explore_clips (movie_id, title, hook_text, video_url, thumbnail_url, views, likes_count, comments_count, shares_count, saves_count, trending_score, status)
  SELECT id, 'The movie nobody expected to become a masterpiece', 'The movie nobody expected to become a masterpiece',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://images.pexels.com/photos/7234329/pexels-photo-7234329.jpeg?auto=compress&cs=tinysrgb&w=500',
    3400000, 120000, 3400, 18000, 42000, 99.5, 'active'
  FROM movies WHERE slug = 'the-capital'
  ON CONFLICT DO NOTHING;

INSERT INTO explore_clips (movie_id, title, hook_text, video_url, thumbnail_url, views, likes_count, comments_count, shares_count, saves_count, trending_score, status)
  SELECT id, 'You will cry at this scene — guaranteed', 'You will cry at this scene — guaranteed',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://images.pexels.com/photos/7234258/pexels-photo-7234258.jpeg?auto=compress&cs=tinysrgb&w=500',
    678000, 24000, 670, 3400, 7200, 78.9, 'active'
  FROM movies WHERE slug = 'the-last-stand'
  ON CONFLICT DO NOTHING;
