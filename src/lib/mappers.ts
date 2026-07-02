import type { Movie, Series, CastMember, Clip } from '../types';
import type {
  Movie as DbMovie,
  Series as DbSeries,
  Genre,
  ExploreClip,
  Actor,
} from './database.types';

const TMDB_IMG = 'https://image.tmdb.org/t/p';

export function tmdbPoster(url: string | null, size = 'w342'): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${TMDB_IMG}/${size}${url}`;
}

export function tmdbBackdrop(url: string | null, size = 'w1280'): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${TMDB_IMG}/${size}${url}`;
}

export function tmdbProfile(url: string | null, size = 'w185'): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${TMDB_IMG}/${size}${url}`;
}

export function mapDbMovieToMovie(
  m: DbMovie,
  genres: Genre[] = [],
  cast: CastMember[] = [],
  clips: Clip[] = []
): Movie {
  const releaseYear = m.release_date ? parseInt(m.release_date.substring(0, 4)) : 0;
  return {
    id: m.id,
    title: m.title,
    titlePersian: m.title_fa || '',
    year: releaseYear,
    rating: m.imdb_rating || m.tmdb_rating || 0,
    duration: m.runtime || 0,
    genres: genres.map(g => g.name),
    description: m.overview || '',
    poster: tmdbPoster(m.poster_url),
    backdrop: tmdbBackdrop(m.backdrop_url),
    trailer: m.trailer_url || '',
    cast,
    director: '',
    country: m.country || '',
    language: m.language || 'en',
    isFeatured: m.is_featured || (m.imdb_rating || 0) >= 7.5,
    isTrending: (m.imdb_rating || 0) >= 7.0,
    isNewRelease: releaseYear >= 2023,
    clips,
  };
}

export function mapDbSeriesToSeries(
  s: DbSeries,
  genres: Genre[] = [],
  cast: CastMember[] = []
): Series {
  const status: 'ongoing' | 'completed' =
    s.status === 'ended' || s.status === 'completed' || s.status === 'archived'
      ? 'completed'
      : 'ongoing';
  return {
    id: s.id,
    title: s.title,
    titlePersian: s.title_fa || '',
    year: s.release_date ? parseInt(s.release_date.substring(0, 4)) : 0,
    rating: s.imdb_rating || s.tmdb_rating || 0,
    genres: genres.map(g => g.name),
    description: s.overview || '',
    poster: tmdbPoster(s.poster_url),
    backdrop: tmdbBackdrop(s.backdrop_url),
    trailer: s.trailer_url || '',
    cast,
    creator: '',
    seasons: [],
    status,
    country: s.country || '',
    language: s.language || 'en',
    isPopular: s.is_featured || (s.imdb_rating || 0) >= 7.5,
  };
}

export function mapDbActorToCastMember(a: Actor, characterName?: string | null): CastMember {
  return {
    id: a.id,
    name: a.name,
    namePersian: a.name_fa || '',
    role: characterName || '',
    photo: tmdbProfile(a.profile_image),
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
    saves: 0,
    shares: Number(c.shares_count),
  };
}
