import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import type { HeroSlide } from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import GenreSection from '../components/GenreSection';
import ContinueWatching from '../components/ContinueWatching';
import TrendingClipsRow from '../components/TrendingClipsRow';
import DiscoverSection from '../components/DiscoverSection';
import RecommendedRow from '../components/RecommendedRow';
import MostDiscussed from '../components/MostDiscussed';
import CinematicLoader from '../components/CinematicLoader';
import { supabase } from '../lib/supabase';
import { mapDbMovieToMovie, mapDbSeriesToSeries } from '../lib/mappers';
import { Movie, Series } from '../types';
import type { Movie as DbMovie, Series as DbSeries, Genre } from '../lib/database.types';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [popularSeries, setPopularSeries] = useState<Series[]>([]);
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [moviesRes, seriesRes, genresRes] = await Promise.all([
          supabase
            .from('movies')
            .select('*')
            .eq('status', 'published')
            .order('imdb_rating', { ascending: false })
            .limit(30),
          supabase
            .from('series')
            .select('*')
            .order('imdb_rating', { ascending: false })
            .limit(30),
          supabase.from('genres').select('*').order('name_en'),
        ]);

        const dbMovies = (moviesRes.data || []) as DbMovie[];
        const dbSeries = (seriesRes.data || []) as DbSeries[];
        const dbGenres = (genresRes.data || []) as Genre[];

        // ── Fetch genre links ──────────────────────────────────────────
        const movieGenreMap: Record<string, Genre[]> = {};
        if (dbMovies.length > 0) {
          const { data: mgLinks } = await supabase
            .from('movie_genres')
            .select('movie_id, genre_id')
            .in('movie_id', dbMovies.map(m => m.id));
          if (mgLinks) {
            for (const link of mgLinks) {
              if (!movieGenreMap[link.movie_id]) movieGenreMap[link.movie_id] = [];
              const g = dbGenres.find(gg => gg.id === link.genre_id);
              if (g) movieGenreMap[link.movie_id].push(g);
            }
          }
        }

        const seriesGenreMap: Record<string, Genre[]> = {};
        if (dbSeries.length > 0) {
          const { data: sgLinks } = await supabase
            .from('series_genres')
            .select('series_id, genre_id')
            .in('series_id', dbSeries.map(s => s.id));
          if (sgLinks) {
            for (const link of sgLinks) {
              if (!seriesGenreMap[link.series_id]) seriesGenreMap[link.series_id] = [];
              const g = dbGenres.find(gg => gg.id === link.genre_id);
              if (g) seriesGenreMap[link.series_id].push(g);
            }
          }
        }

        const mappedMovies = dbMovies.map(m =>
          mapDbMovieToMovie(m, movieGenreMap[m.id] || [])
        );
        const mappedSeries = dbSeries.map(s =>
          mapDbSeriesToSeries(s, seriesGenreMap[s.id] || [])
        );

        // ── Build hero slides ──────────────────────────────────────────
        // Priority: is_featured=true items first, then top-rated fallback.
        // Picks up to 3 featured movies + 2 featured series, all must have backdrop.
        const featuredMovies = mappedMovies.filter(m => m.isFeatured && m.backdrop);
        const featuredSeries = mappedSeries.filter(s => s.isPopular && s.backdrop);

        // If not enough featured items, fill with top-rated content that has backdrops
        const fallbackMovies = mappedMovies.filter(m => !m.isFeatured && m.backdrop);
        const fallbackSeries = mappedSeries.filter(s => !s.isPopular && s.backdrop);

        const heroMovies = [...featuredMovies, ...fallbackMovies].slice(0, 3);
        const heroSeriesItems = [...featuredSeries, ...fallbackSeries].slice(0, 2);

        // Interleave: movie, series, movie, … for visual variety
        const interleaved: (Movie | Series)[] = [];
        const mq = [...heroMovies];
        const sq = [...heroSeriesItems];
        while (mq.length || sq.length) {
          if (mq.length) interleaved.push(mq.shift()!);
          if (sq.length) interleaved.push(sq.shift()!);
        }

        const BADGE_SEQUENCE: HeroSlide['badge'][] = [
          'trending', 'editors-pick', 'most-discussed', 'new-release', 'featured',
        ];

        const slides: HeroSlide[] = interleaved.slice(0, 5).map((content, i) => ({
          content,
          badge: BADGE_SEQUENCE[i % BADGE_SEQUENCE.length],
        }));

        setHeroSlides(
          slides.length > 0
            ? slides
            : mappedMovies.slice(0, 1).map(c => ({ content: c, badge: 'featured' as const }))
        );

        setPopularMovies(mappedMovies.slice(0, 12));
        setAllMovies(mappedMovies);
        setPopularSeries(mappedSeries.slice(0, 12));
        setAllSeries(mappedSeries);
        setGenres(dbGenres);
      } catch (err) {
        console.error('Failed to load home data:', err);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <CinematicLoader />;

  return (
    <div className="pb-16">
      {/* HeroBanner is self-contained with its own fallback; heroSlides is bonus data */}
      <HeroBanner slides={heroSlides.length > 0 ? heroSlides : undefined} />

      <div className="mt-8 md:mt-12 space-y-10 md:space-y-16">
        <TrendingClipsRow />
        <ContinueWatching />
        <MostDiscussed />

        <ContentRow title="Popular Movies" titlePersian="فیلم‌های محبوب" items={popularMovies} type="movie" />
        <ContentRow title="Popular Series" titlePersian="سریال‌های محبوب" items={popularSeries} type="series" />
        <GenreSection genres={genres.map(g => g.name_en)} />
        <DiscoverSection />
        <RecommendedRow />
        <ContentRow title="All Movies" titlePersian="همه فیلم‌ها" items={allMovies} type="movie" />
        <ContentRow title="All Series" titlePersian="همه سریال‌ها" items={allSeries} type="series" />
      </div>
    </div>
  );
}
