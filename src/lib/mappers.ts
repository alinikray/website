import type { Movie, Series, CastMember, Clip } from '../types';
import type {
  Movie as DbMovie,
  Series as DbSeries,
  Genre,
  ExploreClip,
} from './database.types';

export function mapDbMovieToMovie(
  m: DbMovie,
  genres: Genre[] = [],
  cast: CastMember[] = [],
  director = '',
  clips: Clip[] = []
): Movie {
  return {
    id: m.id,
    title: m.title_en,
    titlePersian: m.title_fa || '',
    year: m.release_year || 0,
    rating: m.imdb_rating,
    duration: m.runtime || 0,
    genres: genres.map(g => g.name_en),
    description: m.description_en || '',
    poster: m.poster_url || '',
    backdrop: m.backdrop_url || '',
    trailer: m.trailer_url || '',
    cast,
    director,
    country: m.country || '',
    language: m.language || 'en',
    isFeatured: m.imdb_rating >= 8.5,
    isTrending: m.imdb_rating >= 8.0,
    isNewRelease: (m.release_year || 0) >= 2023,
    clips,
  };
}

export function mapDbSeriesToSeries(
  s: DbSeries,
  genres: Genre[] = [],
  cast: CastMember[] = [],
  creator = ''
): Series {
  const rawStatus = s.status as string;
  const status: 'ongoing' | 'completed' =
    (rawStatus === 'ended' || rawStatus === 'completed' || rawStatus === 'archived') ? 'completed' : 'ongoing';
  return {
    id: s.id,
    title: s.title_en,
    titlePersian: s.title_fa || '',
    year: s.release_year || 0,
    rating: s.imdb_rating,
    genres: genres.map(g => g.name_en),
    description: s.description_en || '',
    poster: s.poster_url || '',
    backdrop: s.backdrop_url || '',
    trailer: s.trailer_url || '',
    cast,
    creator,
    seasons: [],
    status,
    country: s.country || '',
    language: s.language || 'en',
    isPopular: s.imdb_rating >= 8.5,
  };
}

export function mapDbClipToClip(c: ExploreClip): Clip {
  return {
    id: c.id,
    movieId: c.movie_id,
    title: c.title,
    thumbnail: c.thumbnail_url,
    videoUrl: c.video_url,
    duration: 45,
    likes: Number(c.likes_count),
    saves: Number(c.saves_count),
    shares: Number(c.shares_count),
  };
}
