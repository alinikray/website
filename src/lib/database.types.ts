// Live schema — matches actual Supabase database columns.

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  language: 'en' | 'fa';
  role: 'user' | 'moderator' | 'admin';
  subscription_plan: 'free' | 'basic' | 'premium' | 'family';
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: string;
  name: string;
  name_fa: string | null;
  slug: string;
  created_at: string;
}

export interface Actor {
  id: string;
  tmdb_id: number | null;
  name: string;
  name_fa: string | null;
  biography: string | null;
  birth_date: string | null;
  profile_image: string | null;
  created_at: string;
}

export interface Movie {
  id: string;
  tmdb_id: number | null;
  title: string;
  original_title: string | null;
  title_fa: string | null;
  overview: string | null;
  overview_fa: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  release_date: string | null;
  runtime: number | null;
  imdb_rating: number;
  tmdb_rating: number;
  trailer_url: string | null;
  trailer_key: string | null;
  country: string | null;
  language: string;
  status: string;
  is_featured: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Series {
  id: string;
  tmdb_id: number | null;
  title: string;
  original_title: string | null;
  title_fa: string | null;
  overview: string | null;
  overview_fa: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  release_date: string | null;
  runtime: number | null;
  imdb_rating: number;
  tmdb_rating: number;
  trailer_url: string | null;
  trailer_key: string | null;
  country: string | null;
  language: string;
  status: string;
  is_featured: boolean;
  seasons_count: number;
  episodes_count: number;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface MovieStream {
  id: string;
  movie_id: string;
  quality: '4K' | '1080p' | '720p' | '480p';
  stream_url: string;
  is_active: boolean;
  created_at: string;
}

export interface MovieDownload {
  id: string;
  movie_id: string;
  quality: '4K' | '1080p' | '720p' | '480p';
  file_size: string | null;
  download_url: string;
  created_at: string;
}

export interface ExploreClip {
  id: string;
  movie_id: string;
  series_id: string | null;
  title: string;
  hook_text: string | null;
  video_url: string;
  thumbnail_url: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
}

export interface ExploreClipWithMovie extends ExploreClip {
  movie?: Movie | null;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  movie_id: string | null;
  series_id: string | null;
  created_at: string;
}

export interface ViewingHistoryItem {
  id: string;
  user_id: string;
  movie_id: string | null;
  series_id: string | null;
  watched_duration: number;
  total_duration: number;
  watched_at: string;
}

export interface ContinueWatchingItem {
  id: string;
  user_id: string;
  movie_id: string | null;
  series_id: string | null;
  progress_seconds: number;
  total_duration: number;
  updated_at: string;
}

export interface Rating {
  id: string;
  user_id: string;
  movie_id: string | null;
  series_id: string | null;
  rating: number;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  movie_id: string | null;
  series_id: string | null;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface MovieWithRelations extends Movie {
  genres?: Genre[];
  actors?: (Actor & { character_name: string | null })[];
  streams?: MovieStream[];
  downloads?: MovieDownload[];
}
