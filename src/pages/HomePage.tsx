import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
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

type BadgeType = 'trending' | 'editors-pick' | 'most-discussed' | 'new-release' | 'featured';
interface HeroSlide { content: Movie | Series; badge?: BadgeType; }

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
          supabase.from('movies').select('*').eq('status', 'published').order('imdb_rating', { ascending: false }).limit(30),
          supabase.from('series').select('*').order('imdb_rating', { ascending: false }).limit(30),
          supabase.from('genres').select('*').order('name_en'),
        ]);

        const dbMovies = (moviesRes.data || []) as DbMovie[];
        const dbSeries = (seriesRes.data || []) as DbSeries[];
        const dbGenres = (genresRes.data || []) as Genre[];

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

        const mappedMovies = dbMovies.map(m => mapDbMovieToMovie(m, movieGenreMap[m.id] || []));
        const mappedSeries = dbSeries.map(s => mapDbSeriesToSeries(s, seriesGenreMap[s.id] || []));

        // Build hero slides: top 3 movies + top 2 series, with varied badges
        const BADGE_SEQUENCE: BadgeType[] = ['trending', 'editors-pick', 'most-discussed', 'new-release', 'featured'];
        const heroItems: HeroSlide[] = [
          ...mappedMovies.slice(0, 3),
          ...mappedSeries.slice(0, 2),
        ]
          .filter(c => c.backdrop)
          .slice(0, 5)
          .map((content, i) => ({ content, badge: BADGE_SEQUENCE[i % BADGE_SEQUENCE.length] }));

        setHeroSlides(heroItems.length > 0 ? heroItems : mappedMovies.slice(0, 1).map(c => ({ content: c, badge: 'featured' as BadgeType })));
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
      {heroSlides.length > 0 && <HeroBanner slides={heroSlides} />}

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
