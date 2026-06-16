import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play, Star, Clock, Filter,
  Bookmark, SortAsc, SortDesc
} from 'lucide-react';
import { movies, series } from '../data/mockData';
import { Movie, Series } from '../types';

type WatchlistItem = (Movie | Series) & { addedDate: Date };

export default function WatchlistPage() {
  const [sortBy, setSortBy] = useState<'added' | 'rating' | 'year'>('added');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'movies' | 'series'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock watchlist combining movies and series
  const watchlist: WatchlistItem[] = [
    ...movies.slice(0, 5).map(m => ({ ...m, addedDate: new Date('2024-01-15') })),
    ...series.slice(0, 3).map(s => ({ ...s, addedDate: new Date('2024-01-20') })),
  ];

  const filteredList = watchlist.filter(item => {
    if (filterType === 'movies') return 'duration' in item;
    if (filterType === 'series') return 'seasons' in item;
    return true;
  });

  const sortedList = filteredList.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'rating') {
      comparison = a.rating - b.rating;
    } else if (sortBy === 'year') {
      comparison = a.year - b.year;
    }
    // For 'added', we'd sort by date
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-accent-400" />
              My Watchlist
            </h1>
            <p className="text-gray-500 mt-1">{sortedList.length} titles</p>
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showFilters ? 'bg-accent-600 text-white' : 'glass text-gray-300'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </motion.button>

            <div className="flex items-center gap-2 glass rounded-lg p-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-gray-300 text-sm px-2 focus:outline-none"
              >
                <option value="added">Date Added</option>
                <option value="rating">Rating</option>
                <option value="year">Year</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 rounded text-gray-400 hover:text-white transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-2">
              {(['all', 'movies', 'series'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterType === type
                      ? 'bg-accent-600 text-white'
                      : 'bg-dark-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'movies' ? 'Movies' : 'TV Series'}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Watchlist Grid */}
        {sortedList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedList.map((item, index) => {
              const isMovie = 'duration' in item;
              return (
                <WatchlistCard
                  key={item.id}
                  item={item}
                  isMovie={isMovie}
                  index={index}
                />
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
              <Bookmark className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-gray-500 mb-6">Start adding movies and series to watch later</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Explore Content
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface WatchlistCardProps {
  item: Movie | Series;
  isMovie: boolean;
  index: number;
}

function WatchlistCard({ item, isMovie, index }: WatchlistCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <div className="relative rounded-xl overflow-hidden">
        {/* Backdrop Image */}
        <div className="relative aspect-video">
          <img
            src={item.backdrop}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded glass text-white text-xs">
            {isMovie ? 'Movie' : 'Series'}
          </div>
        </div>

        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between gap-3">
            <Link
              to={`/${isMovie ? 'movie' : 'series'}/${item.id}`}
              className="flex-1 min-w-0"
            >
              <h3 className="text-sm font-semibold text-white group-hover:text-accent-400 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  {item.rating}
                </span>
                <span>{item.year}</span>
                {isMovie && 'duration' in item && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {(item as Movie).duration} min
                    </span>
                  </>
                )}
              </div>
            </Link>

            {/* Play Button */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
              className="flex-shrink-0"
            >
              <Link to={`/${isMovie ? 'movie' : 'series'}/${item.id}`}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-accent-600 flex items-center justify-center shadow-glow"
                >
                  <Play className="w-5 h-5 text-white fill-current" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Genres */}
      <div className="flex flex-wrap gap-2 mt-2 px-1">
        {item.genres.slice(0, 2).map((genre) => (
          <Link
            key={genre}
            to={`/search?genre=${encodeURIComponent(genre)}`}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {genre}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
