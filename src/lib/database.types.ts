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
  name_en: string;
  name_fa: string;
  slug: string;
  created_at: string;
}

export interface Actor {
  id: string;
  name: string;
  name_fa: string | null;
  photo_url: string | null;
  bio: string | null;
  bio_fa: string | null;
  birth_date: string | null;
  nationality: string | null;
  created_at: string;
  updated_at: string;
}

export interface Director {
  id: string;
  name: string;
  name_fa: string | null;
  photo_url: string | null;
  bio: string | null;
  bio_fa: string | null;
  birth_date: string | null;
  nationality: string | null;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: string;
  title_en: string;
  title_fa: string | null;
  slug: string;
  description_en: string | null;
  description_fa: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  imdb_rating: number;
  release_year: number | null;
  runtime: number | null;
  country: string | null;
  language: string;
  age_rating: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Series {
  id: string;
  title_en: string;
  title_fa: string | null;
  slug: string;
  description_en: string | null;
  description_fa: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  imdb_rating: number;
  release_year: number | null;
  country: string | null;
  language: string;
  age_rating: string | null;
  seasons: number;
  total_episodes: number;
  episode_runtime: number | null;
  status: 'draft' | 'published' | 'ongoing' | 'ended' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: string;
  series_id: string;
  season_number: number;
  episode_number: number;
  title_en: string;
  title_fa: string | null;
  description_en: string | null;
  description_fa: string | null;
  duration: number | null;
  thumbnail_url: string | null;
  air_date: string | null;
  stream_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MovieStream {
  id: string;
  movie_id: string;
  quality: '4K' | '1080p' | '720p' | '480p';
  language: string;
  subtitle_available: boolean;
  stream_url: string;
  created_at: string;
}

export interface MovieDownload {
  id: string;
  movie_id: string;
  quality: '4K' | '1080p' | '720p' | '480p';
  file_size: string | null;
  language: string;
  subtitle_available: boolean;
  download_url: string;
  created_at: string;
}

export interface Subtitle {
  id: string;
  movie_id: string;
  language: 'en' | 'fa';
  subtitle_url: string;
  created_at: string;
}

export interface ExploreClip {
  id: string;
  movie_id: string;
  title: string;
  hook_text: string | null;
  video_url: string;
  thumbnail_url: string;
  views: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  trending_score: number;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
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
  episode_id: string | null;
  watched_duration: number;
  total_duration: number;
  watched_at: string;
}

export interface ContinueWatchingItem {
  id: string;
  user_id: string;
  movie_id: string | null;
  series_id: string | null;
  episode_id: string | null;
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
  explore_clip_id: string | null;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  movie_id: string | null;
  explore_clip_id: string | null;
  comment_id: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
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

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  started_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface MovieWithRelations extends Movie {
  genres?: Genre[];
  actors?: (Actor & { role_name: string | null })[];
  directors?: Director[];
  streams?: MovieStream[];
  downloads?: MovieDownload[];
  subtitles?: Subtitle[];
}

export interface ExploreClipWithMovie extends ExploreClip {
  movie?: Movie;
}
