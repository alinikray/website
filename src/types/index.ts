export interface Movie {
  id: string;
  title: string;
  titlePersian: string;
  year: number;
  rating: number;
  duration: number;
  genres: string[];
  description: string;
  poster: string;
  backdrop: string;
  trailer: string;
  cast: CastMember[];
  director: string;
  country: string;
  language: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewRelease?: boolean;
  clips?: Clip[];
}

export interface Series {
  id: string;
  title: string;
  titlePersian: string;
  year: number;
  rating: number;
  genres: string[];
  description: string;
  poster: string;
  backdrop: string;
  trailer: string;
  cast: CastMember[];
  creator: string;
  seasons: Season[];
  status: 'ongoing' | 'completed';
  country: string;
  language: string;
  isPopular?: boolean;
}

export interface Season {
  number: number;
  episodes: Episode[];
  year: number;
}

export interface Episode {
  number: number;
  title: string;
  titlePersian: string;
  duration: number;
  description: string;
  thumbnail: string;
}

export interface Clip {
  id: string;
  movieId: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  likes: number;
  saves: number;
  shares: number;
}

export interface CastMember {
  id: string;
  name: string;
  namePersian: string;
  role: string;
  photo: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  watchlist: string[];
  watchedHistory: WatchedItem[];
  ratings: Rating[];
  favoriteGenres: string[];
}

export interface WatchedItem {
  contentId: string;
  type: 'movie' | 'series';
  progress: number;
  lastWatched: Date;
}

export interface Rating {
  contentId: string;
  type: 'movie' | 'series';
  score: number;
  date: Date;
}

export type Genre =
  | 'Action'
  | 'Drama'
  | 'Comedy'
  | 'Thriller'
  | 'Horror'
  | 'Romance'
  | 'Sci-Fi'
  | 'Animation'
  | 'Documentary'
  | 'Crime'
  | 'Adventure'
  | 'Fantasy'
  | 'Mystery'
  | 'Family';
