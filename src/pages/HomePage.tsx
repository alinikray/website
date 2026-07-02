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
import { mapDbSeriesToSeries } from '../lib/mappers';
import { fetchPopularMovies, fetchTrendingMovies, fetchTopRatedMovies } from '../lib/tmdbService';
import { Movie, Series } from '../types';
import type { Series as DbSeries, Genre } from '../lib/database.types';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [popularSeries, setPopularSeries] = useState<Series[]>([]);
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [popular, trending, topRated, seriesRes, genresRes] = await Promise.all([
          fetchPopularMovies(),
          fetchTrendingMovies('week'),
          fetchTopRatedMovies(),
          supabase.from('series').select('*').order('imdb_rating', { ascending: false }).limit(30),
          supabase.from('genres').select('*').order('name'),
        ]);

        const dbSeries = (seriesRes.data || []) as DbSeries[];
        const dbGenres = (genresRes.data || []) as Genre[];

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

        const mappedSeries = dbSeries.map(s =>
          mapDbSeriesToSeries(s, seriesGenreMap[s.id] || [])
        );

        // Build hero slides from trending movies + series
        const heroPool: (Movie | Series)[] = [
          ...trending.filter(m => m.backdrop).slice(0, 3),
          ...mappedSeries.filter(s => s.backdrop).slice(0, 2),
        ];

        const BADGE_SEQUENCE: HeroSlide['badge'][] = [
          'trending', 'editors-pick', 'most-discussed', 'new-release', 'featured',
        ];

        const slides: HeroSlide[] = heroPool.slice(0, 5).map((content, i) => ({
          content,
          badge: BADGE_SEQUENCE[i % BADGE_SEQUENCE.length],
        }));

        setHeroSlides(slides.length > 0 ? slides : popular.slice(0, 1).map(c => ({ content: c, badge: 'featured' as const })));
        setPopularMovies(popular);
        setTrendingMovies(trending);
        setTopRatedMovies(topRated);
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
        <ContentRow title="Trending This Week" titlePersian="ترند این هفته" items={trendingMovies} type="movie" />
        <ContentRow title="Popular Series" titlePersian="سریال‌های محبوب" items={popularSeries} type="series" />
        <GenreSection genres={genres.map(g => g.name)} />
        <DiscoverSection />
        <RecommendedRow />
        <ContentRow title="Top Rated Movies" titlePersian="برترین فیلم‌ها" items={topRatedMovies} type="movie" />
        <ContentRow title="All Series" titlePersian="همه سریال‌ها" items={allSeries} type="series" />
      </div>
    </div>
  );
}
