import { supabase } from './supabase';
import type {
  Movie, MovieWithRelations, MovieStream, MovieDownload,
  Subtitle, ExploreClip, ExploreClipWithMovie, ContinueWatchingItem,
  Genre, Comment, Profile,
} from './database.types';

// ============ MOVIES ============

export async function getMovieBySlug(slug: string): Promise<MovieWithRelations | null> {
  const { data: movie, error } = await supabase
    .from('movies')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error || !movie) return null;
  return movie as Movie;
}

export async function getMovieById(id: string): Promise<Movie | null> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Movie;
}

export async function getMovies(limit = 20, offset = 0): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error || !data) return [];
  return data as Movie[];
}

export async function getSimilarMovies(movieId: string, limit = 10): Promise<Movie[]> {
  const { data: genreLinks } = await supabase
    .from('movie_genres')
    .select('genre_id')
    .eq('movie_id', movieId);
  if (!genreLinks || genreLinks.length === 0) return [];

  const genreIds = genreLinks.map(g => g.genre_id);

  const { data: movieLinks } = await supabase
    .from('movie_genres')
    .select('movie_id')
    .in('genre_id', genreIds)
    .neq('movie_id', movieId)
    .limit(limit * 2);
  if (!movieLinks || movieLinks.length === 0) return [];

  const movieIds = [...new Set(movieLinks.map(m => m.movie_id))].slice(0, limit);

  const { data: movies } = await supabase
    .from('movies')
    .select('*')
    .in('id', movieIds)
    .eq('status', 'published');
  return (movies as Movie[]) ?? [];
}

export async function searchMovies(query: string, limit = 20): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('status', 'published')
    .or(`title_en.ilike.%${query}%,title_fa.ilike.%${query}%`)
    .limit(limit);
  if (error || !data) return [];
  return data as Movie[];
}

// ============ STREAMS & DOWNLOADS ============

export async function getMovieStreams(movieId: string): Promise<MovieStream[]> {
  const { data, error } = await supabase
    .from('movie_streams')
    .select('*')
    .eq('movie_id', movieId);
  if (error || !data) return [];
  return data as MovieStream[];
}

export async function getMovieDownloads(movieId: string): Promise<MovieDownload[]> {
  const { data, error } = await supabase
    .from('movie_downloads')
    .select('*')
    .eq('movie_id', movieId);
  if (error || !data) return [];
  return data as MovieDownload[];
}

export async function getMovieSubtitles(movieId: string): Promise<Subtitle[]> {
  const { data, error } = await supabase
    .from('subtitles')
    .select('*')
    .eq('movie_id', movieId);
  if (error || !data) return [];
  return data as Subtitle[];
}

// ============ GENRES ============

export async function getGenres(): Promise<Genre[]> {
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name_en');
  if (error || !data) return [];
  return data as Genre[];
}

export async function getMovieGenres(movieId: string): Promise<Genre[]> {
  const { data: links } = await supabase
    .from('movie_genres')
    .select('genre_id')
    .eq('movie_id', movieId);
  if (!links || links.length === 0) return [];

  const genreIds = links.map(l => l.genre_id);
  const { data: genres } = await supabase
    .from('genres')
    .select('*')
    .in('id', genreIds);
  return (genres as Genre[]) ?? [];
}

// ============ EXPLORE CLIPS ============

export async function getExploreClips(limit = 20, offset = 0): Promise<ExploreClipWithMovie[]> {
  const { data, error } = await supabase
    .from('explore_clips')
    .select(`
      *,
      movie:movies(*)
    `)
    .eq('status', 'active')
    .order('trending_score', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error || !data) return [];
  return data as ExploreClipWithMovie[];
}

export async function getClipsByMovie(movieId: string): Promise<ExploreClip[]> {
  const { data, error } = await supabase
    .from('explore_clips')
    .select('*')
    .eq('movie_id', movieId)
    .eq('status', 'active');
  if (error || !data) return [];
  return data as ExploreClip[];
}

// ============ CONTINUE WATCHING ============

export async function getContinueWatching(userId: string): Promise<ContinueWatchingItem[]> {
  const { data, error } = await supabase
    .from('continue_watching')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(20);
  if (error || !data) return [];
  return data as ContinueWatchingItem[];
}

export async function getContinueWatchingForMovie(userId: string, movieId: string): Promise<ContinueWatchingItem | null> {
  const { data, error } = await supabase
    .from('continue_watching')
    .select('*')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();
  if (error || !data) return null;
  return data as ContinueWatchingItem;
}

export async function saveWatchProgress(
  userId: string,
  movieId: string,
  progressSeconds: number,
  totalDuration: number
): Promise<void> {
  const existing = await getContinueWatchingForMovie(userId, movieId);
  if (existing) {
    await supabase
      .from('continue_watching')
      .update({ progress_seconds: progressSeconds, total_duration: totalDuration })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('continue_watching')
      .insert({ user_id: userId, movie_id: movieId, progress_seconds: progressSeconds, total_duration: totalDuration });
  }
}

export async function recordViewingHistory(
  userId: string,
  movieId: string,
  watchedDuration: number,
  totalDuration: number
): Promise<void> {
  await supabase
    .from('viewing_history')
    .insert({ user_id: userId, movie_id: movieId, watched_duration: watchedDuration, total_duration: totalDuration });
}

// ============ COMMENTS ============

export async function getMovieComments(movieId: string): Promise<(Comment & { profile: Profile | null })[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profile:profiles!comments_user_id_fkey(id, username, avatar_url)
    `)
    .eq('movie_id', movieId)
    .is('parent_id', null)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as (Comment & { profile: Profile | null })[];
}

export async function addComment(userId: string, movieId: string, content: string): Promise<void> {
  await supabase
    .from('comments')
    .insert({ user_id: userId, movie_id: movieId, content });
}

// ============ WATCHLIST ============

export async function getWatchlist(userId: string) {
  const { data, error } = await supabase
    .from('watchlists')
    .select(`
      *,
      movie:movies(*),
      series:series(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function addToWatchlist(userId: string, movieId?: string, seriesId?: string): Promise<void> {
  await supabase
    .from('watchlists')
    .insert({ user_id: userId, movie_id: movieId, series_id: seriesId });
}

export async function removeFromWatchlist(userId: string, movieId?: string, seriesId?: string): Promise<void> {
  let query = supabase.from('watchlists').delete().eq('user_id', userId);
  if (movieId) query = query.eq('movie_id', movieId);
  if (seriesId) query = query.eq('series_id', seriesId);
  await query;
}

export async function isInWatchlist(userId: string, movieId: string): Promise<boolean> {
  const { data } = await supabase
    .from('watchlists')
    .select('id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();
  return !!data;
}

// ============ RATINGS ============

export async function getUserRating(userId: string, movieId: string): Promise<number | null> {
  const { data } = await supabase
    .from('ratings')
    .select('rating')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();
  return data?.rating ?? null;
}

export async function rateMovie(userId: string, movieId: string, rating: number): Promise<void> {
  const { data: existing } = await supabase
    .from('ratings')
    .select('id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();
  if (existing) {
    await supabase.from('ratings').update({ rating }).eq('id', existing.id);
  } else {
    await supabase.from('ratings').insert({ user_id: userId, movie_id: movieId, rating });
  }
}

// ============ LIKES ============

export async function toggleMovieLike(userId: string, movieId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();
  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('likes').insert({ user_id: userId, movie_id: movieId });
    return true;
  }
}

export async function hasLikedMovie(userId: string, movieId: string): Promise<boolean> {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();
  return !!data;
}

// ============ SUBSCRIPTION PLANS ============

export async function getSubscriptionPlans() {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error || !data) return [];
  return data;
}
