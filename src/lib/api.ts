import { supabase, isSupabaseConfigured } from './supabase';
import type {
  Movie, MovieStream, MovieDownload,
  ExploreClip, ExploreClipWithMovie, ContinueWatchingItem,
  Genre, Comment, Profile, Series,
} from './database.types';

// ─── Movies ───────────────────────────────────────────────────────────────────

export async function getMovieById(id: string): Promise<Movie | null> {
  const { data } = await supabase.from('movies').select('*').eq('id', id).maybeSingle();
  return (data as Movie) ?? null;
}

export async function getMovies(limit = 20, offset = 0): Promise<Movie[]> {
  const { data } = await supabase
    .from('movies')
    .select('*')
    .eq('status', 'published')
    .order('imdb_rating', { ascending: false })
    .range(offset, offset + limit - 1);
  return (data as Movie[]) ?? [];
}

export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  const { data } = await supabase
    .from('movies')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return (data as Movie) ?? null;
}

export async function searchMovies(query: string, limit = 20): Promise<Movie[]> {
  const { data } = await supabase
    .from('movies')
    .select('*')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,title_fa.ilike.%${query}%,original_title.ilike.%${query}%`)
    .limit(limit);
  return (data as Movie[]) ?? [];
}

export async function getSimilarMovies(movieId: string, limit = 10): Promise<Movie[]> {
  const { data: genreLinks } = await supabase
    .from('movie_genres').select('genre_id').eq('movie_id', movieId);
  if (!genreLinks?.length) return [];
  const genreIds = genreLinks.map(g => g.genre_id);
  const { data: movieLinks } = await supabase
    .from('movie_genres').select('movie_id').in('genre_id', genreIds).neq('movie_id', movieId).limit(limit * 2);
  if (!movieLinks?.length) return [];
  const ids = [...new Set(movieLinks.map(m => m.movie_id))].slice(0, limit);
  const { data } = await supabase.from('movies').select('*').in('id', ids).eq('status', 'published');
  return (data as Movie[]) ?? [];
}

// ─── Genres ───────────────────────────────────────────────────────────────────

export async function getGenres(): Promise<Genre[]> {
  const { data } = await supabase.from('genres').select('*').order('name');
  return (data as Genre[]) ?? [];
}

export async function getMovieGenres(movieId: string): Promise<Genre[]> {
  const { data: links } = await supabase.from('movie_genres').select('genre_id').eq('movie_id', movieId);
  if (!links?.length) return [];
  const { data } = await supabase.from('genres').select('*').in('id', links.map(l => l.genre_id));
  return (data as Genre[]) ?? [];
}

export async function getSeriesGenres(seriesId: string): Promise<Genre[]> {
  const { data: links } = await supabase.from('series_genres').select('genre_id').eq('series_id', seriesId);
  if (!links?.length) return [];
  const { data } = await supabase.from('genres').select('*').in('id', links.map(l => l.genre_id));
  return (data as Genre[]) ?? [];
}

// ─── Streams & Downloads ──────────────────────────────────────────────────────

export async function getMovieStreams(movieId: string): Promise<MovieStream[]> {
  const { data } = await supabase.from('movie_streams').select('*').eq('movie_id', movieId);
  return (data as MovieStream[]) ?? [];
}

export async function getMovieDownloads(movieId: string): Promise<MovieDownload[]> {
  const { data } = await supabase.from('movie_downloads').select('*').eq('movie_id', movieId);
  return (data as MovieDownload[]) ?? [];
}

// ─── Series ───────────────────────────────────────────────────────────────────

export async function getSeries(limit = 20, offset = 0): Promise<Series[]> {
  const { data } = await supabase
    .from('series')
    .select('*')
    .order('imdb_rating', { ascending: false })
    .range(offset, offset + limit - 1);
  return (data as Series[]) ?? [];
}

export async function getSeriesById(id: string): Promise<Series | null> {
  const { data } = await supabase.from('series').select('*').eq('id', id).maybeSingle();
  return (data as Series) ?? null;
}

export async function getSeriesBySlug(slug: string): Promise<Series | null> {
  const { data } = await supabase.from('series').select('*').eq('slug', slug).maybeSingle();
  return (data as Series) ?? null;
}

export async function searchSeries(query: string, limit = 20): Promise<Series[]> {
  const { data } = await supabase
    .from('series')
    .select('*')
    .or(`title.ilike.%${query}%,title_fa.ilike.%${query}%,original_title.ilike.%${query}%`)
    .limit(limit);
  return (data as Series[]) ?? [];
}

export async function getSimilarSeries(seriesId: string, limit = 10): Promise<Series[]> {
  const { data: genreLinks } = await supabase
    .from('series_genres').select('genre_id').eq('series_id', seriesId);
  if (!genreLinks?.length) return [];
  const genreIds = genreLinks.map(g => g.genre_id);
  const { data: seriesLinks } = await supabase
    .from('series_genres').select('series_id').in('genre_id', genreIds).neq('series_id', seriesId).limit(limit * 2);
  if (!seriesLinks?.length) return [];
  const ids = [...new Set(seriesLinks.map(s => s.series_id))].slice(0, limit);
  const { data } = await supabase.from('series').select('*').in('id', ids);
  return (data as Series[]) ?? [];
}

// ─── Explore Clips ────────────────────────────────────────────────────────────

export async function getExploreClips(limit = 20, offset = 0): Promise<ExploreClipWithMovie[]> {
  const { data } = await supabase
    .from('explore_clips')
    .select('*, movie:movies(*)')
    .order('likes_count', { ascending: false })
    .range(offset, offset + limit - 1);
  return (data as ExploreClipWithMovie[]) ?? [];
}

export async function getClipsByMovie(movieId: string): Promise<ExploreClip[]> {
  const { data } = await supabase
    .from('explore_clips').select('*').eq('movie_id', movieId);
  return (data as ExploreClip[]) ?? [];
}

// ─── Continue Watching ────────────────────────────────────────────────────────

export async function getContinueWatching(userId: string): Promise<ContinueWatchingItem[]> {
  const { data } = await supabase
    .from('continue_watching')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(20);
  return (data as ContinueWatchingItem[]) ?? [];
}

export async function getContinueWatchingForMovie(userId: string, movieId: string): Promise<ContinueWatchingItem | null> {
  const { data } = await supabase
    .from('continue_watching')
    .select('*').eq('user_id', userId).eq('movie_id', movieId).maybeSingle();
  return (data as ContinueWatchingItem) ?? null;
}

export async function saveWatchProgress(userId: string, movieId: string, progressSeconds: number, totalDuration: number): Promise<void> {
  const existing = await getContinueWatchingForMovie(userId, movieId);
  if (existing) {
    await supabase.from('continue_watching').update({ progress_seconds: progressSeconds, total_duration: totalDuration }).eq('id', existing.id);
  } else {
    await supabase.from('continue_watching').insert({ user_id: userId, movie_id: movieId, progress_seconds: progressSeconds, total_duration: totalDuration });
  }
}

export async function recordViewingHistory(userId: string, movieId: string, watchedDuration: number, totalDuration: number): Promise<void> {
  await supabase.from('viewing_history').insert({ user_id: userId, movie_id: movieId, watched_duration: watchedDuration, total_duration: totalDuration });
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export async function getMovieComments(movieId: string): Promise<(Comment & { profile: Profile | null })[]> {
  const { data } = await supabase
    .from('comments')
    .select('*, profile:profiles!comments_user_id_fkey(id, username, avatar_url)')
    .eq('movie_id', movieId)
    .is('parent_id', null)
    .order('created_at', { ascending: false });
  return (data as (Comment & { profile: Profile | null })[]) ?? [];
}

export async function addComment(userId: string, movieId: string, content: string): Promise<void> {
  await supabase.from('comments').insert({ user_id: userId, movie_id: movieId, content });
}

// ─── Watchlist ────────────────────────────────────────────────────────────────

export async function getWatchlist(userId: string) {
  const { data } = await supabase
    .from('watchlists')
    .select('*, movie:movies(*), series:series(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function addToWatchlist(userId: string, movieId?: string, seriesId?: string): Promise<void> {
  await supabase.from('watchlists').insert({ user_id: userId, movie_id: movieId ?? null, series_id: seriesId ?? null });
}

export async function removeFromWatchlist(userId: string, movieId?: string, seriesId?: string): Promise<void> {
  let q = supabase.from('watchlists').delete().eq('user_id', userId);
  if (movieId) q = q.eq('movie_id', movieId);
  if (seriesId) q = q.eq('series_id', seriesId);
  await q;
}

export async function isInWatchlist(userId: string, contentId: string): Promise<boolean> {
  const { data } = await supabase
    .from('watchlists')
    .select('id')
    .eq('user_id', userId)
    .or(`movie_id.eq.${contentId},series_id.eq.${contentId}`)
    .maybeSingle();
  return !!data;
}

// ─── Ratings ──────────────────────────────────────────────────────────────────

export async function getUserRating(userId: string, movieId: string): Promise<number | null> {
  const { data } = await supabase
    .from('ratings').select('rating').eq('user_id', userId).eq('movie_id', movieId).maybeSingle();
  return data?.rating ?? null;
}

export async function rateMovie(userId: string, movieId: string, rating: number): Promise<void> {
  const { data: existing } = await supabase
    .from('ratings').select('id').eq('user_id', userId).eq('movie_id', movieId).maybeSingle();
  if (existing) {
    await supabase.from('ratings').update({ rating }).eq('id', existing.id);
  } else {
    await supabase.from('ratings').insert({ user_id: userId, movie_id: movieId, rating });
  }
}

// ─── Subscription Plans ───────────────────────────────────────────────────────

export async function getSubscriptionPlans() {
  const { data } = await supabase
    .from('subscription_plans').select('*').eq('is_active', true).order('sort_order');
  return data ?? [];
}

// ─── TMDb Sync trigger ────────────────────────────────────────────────────────

export async function triggerTmdbSync(action = 'sync_all', pages?: number): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const params = new URLSearchParams({ action });
    if (pages) params.set('pages', String(pages));
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-sync?${params}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${await res.text()}` };
    return { ok: true, data: await res.json() };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

// ─── TMDb Proxy (secure client-side TMDb access) ──────────────────────────────

export async function tmdbProxy(path: string, params: Record<string, string> = {}): Promise<any> {
  // Without Supabase configured there is no proxy endpoint to hit. Bail out
  // early so we don't fire failing requests — callers fall back to mock/empty data.
  if (!isSupabaseConfigured) {
    throw new Error('tmdb-proxy unavailable: Supabase is not configured.');
  }
  const qs = new URLSearchParams({ path, ...params });
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-proxy?${qs}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`tmdb-proxy ${res.status}: ${await res.text()}`);
  return res.json();
}
