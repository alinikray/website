import { tmdbProxy } from './api';
import type { Movie } from '../types';

const TMDB_GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'War', 37: 'Western',
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
