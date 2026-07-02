import { tmdbProxy } from './api';
import type { Movie } from '../types';

export interface TmdbSeries {
  id: string;
  name: string;
  originalName: string;
  overview: string;
  poster: string;
  backdrop: string;
  rating: number;
  firstAirDate: string;
  year: number;
  genres: string[];
  language: string;
}

const TMDB_GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'War', 37: 'Western',
};

const TV_GENRE_MAP: Record<number, string> = {
  10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 10762: 'Kids',
  9648: 'Mystery', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy',
  10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics', 37: 'Western',
};

const IMG = 'https://image.tmdb.org/t/p';

function mapRaw(m: any): Movie {
  return {
    id: String(m.id),
    title: m.title || m.name || '',
    titlePersian: '',
    year: m.release_date ? parseInt(m.release_date.substring(0, 4)) : 0,
    rating: m.vote_average || 0,
    duration: m.runtime || 0,
    genres: (m.genre_ids || (m.genres || []).map((g: any) => g.id))
      .map((id: number) => TMDB_GENRE_MAP[id])
      .filter(Boolean),
    description: m.overview || '',
    poster: m.poster_path ? `${IMG}/w342${m.poster_path}` : '',
    backdrop: m.backdrop_path ? `${IMG}/w1280${m.backdrop_path}` : '',
    trailer: '',
    cast: [],
    director: '',
    country: (m.production_countries?.[0]?.iso_3166_1) || '',
    language: m.original_language || '',
    isFeatured: (m.vote_average || 0) >= 7.5,
    isTrending: false,
  };
}

function mapRawSeries(s: any): TmdbSeries {
  return {
    id: String(s.id),
    name: s.name || s.original_name || '',
    originalName: s.original_name || '',
    overview: s.overview || '',
    poster: s.poster_path ? `${IMG}/w342${s.poster_path}` : '',
    backdrop: s.backdrop_path ? `${IMG}/w1280${s.backdrop_path}` : '',
    rating: s.vote_average || 0,
    firstAirDate: s.first_air_date || '',
    year: s.first_air_date ? parseInt(s.first_air_date.substring(0, 4)) : 0,
    genres: (s.genre_ids || []).map((id: number) => TV_GENRE_MAP[id]).filter(Boolean),
    language: s.original_language || '',
  };
}

export async function fetchPopularMovies(page = 1): Promise<Movie[]> {
  try {
    const data = await tmdbProxy('/movie/popular', { page: String(page) });
    return (data.results || []).map(mapRaw);
  } catch {
    return [];
  }
}

export async function fetchTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
  try {
    const data = await tmdbProxy(`/trending/movie/${timeWindow}`);
    return (data.results || []).map((m: any) => ({ ...mapRaw(m), isTrending: true }));
  } catch {
    return [];
  }
}

export async function fetchTopRatedMovies(page = 1): Promise<Movie[]> {
  try {
    const data = await tmdbProxy('/movie/top_rated', { page: String(page) });
    return (data.results || []).map(mapRaw);
  } catch {
    return [];
  }
}

export async function fetchDiscoverMovies(page = 1): Promise<{ results: Movie[]; totalPages: number }> {
  try {
    const data = await tmdbProxy('/discover/movie', {
      sort_by: 'primary_release_date.desc',
      include_adult: 'false',
      page: String(page),
    });
    return {
      results: (data.results || []).map(mapRaw),
      totalPages: data.total_pages || 1,
    };
  } catch {
    return { results: [], totalPages: 1 };
  }
}

export async function fetchDiscoverSeries(page = 1): Promise<{ results: TmdbSeries[]; totalPages: number }> {
  try {
    const data = await tmdbProxy('/discover/tv', {
      sort_by: 'first_air_date.desc',
      include_adult: 'false',
      page: String(page),
    });
    return {
      results: (data.results || []).map(mapRawSeries),
      totalPages: data.total_pages || 1,
    };
  } catch {
    return { results: [], totalPages: 1 };
  }
}

export async function fetchMovieDetails(tmdbId: string): Promise<Movie | null> {
  try {
    const [details, credits] = await Promise.all([
      tmdbProxy(`/movie/${tmdbId}`, { append_to_response: 'videos' }),
      tmdbProxy(`/movie/${tmdbId}/credits`),
    ]);

    const trailer = details.videos?.results?.find(
      (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
    );

    const cast = (credits.cast || []).slice(0, 12).map((a: any) => ({
      id: String(a.id),
      name: a.name || '',
      namePersian: '',
      role: a.character || '',
      photo: a.profile_path ? `${IMG}/w185${a.profile_path}` : '',
    }));

    const director = (credits.crew || []).find((c: any) => c.job === 'Director')?.name || '';
    const country = (details.production_countries?.[0]?.iso_3166_1) || '';

    const base = mapRaw(details);
    return {
      ...base,
      genres: (details.genres || []).map((g: any) => g.name),
      trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
      cast,
      director,
      country,
    };
  } catch {
    return null;
  }
}

export async function fetchSimilarMovies(tmdbId: string): Promise<Movie[]> {
  try {
    const data = await tmdbProxy(`/movie/${tmdbId}/similar`);
    return (data.results || []).slice(0, 12).map(mapRaw);
  } catch {
    return [];
  }
}

