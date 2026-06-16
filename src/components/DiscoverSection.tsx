import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Zap, TrendingUp, Ghost, Heart, Eye, Gem } from 'lucide-react';
import { movies, series } from '../data/mockData';
import { Movie, Series } from '../types';

const categories = [
  { id: 'mind-blowing', label: 'Mind Blowing', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { id: 'plot-twist', label: 'Plot Twist', icon: Eye, color: 'from-purple-500 to-pink-500' },
  { id: 'action', label: 'Action', icon: TrendingUp, color: 'from-red-500 to-orange-600' },
  { id: 'horror', label: 'Horror', icon: Ghost, color: 'from-gray-700 to-red-900' },
  { id: 'emotional', label: 'Emotional', icon: Heart, color: 'from-pink-500 to-rose-600' },
  { id: 'sci-fi', label: 'Sci-Fi', icon: Star, color: 'from-cyan-500 to-blue-600' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
  { id: 'hidden-gems', label: 'Hidden Gems', icon: Gem, color: 'from-emerald-500 to-teal-600' },
];

const categoryContent: Record<string, (Movie | Series)[]> = {
  'mind-blowing': movies.filter(m => m.genres.some(g => ['Thriller', 'Sci-Fi', 'Mystery'].includes(g))),
  'plot-twist': movies.filter(m => m.genres.some(g => ['Mystery', 'Thriller', 'Crime'].includes(g))),
  'action': movies.filter(m => m.genres.includes('Action')),
  'horror': movies.filter(m => m.genres.includes('Horror')),
  'emotional': [...movies.filter(m => m.genres.includes('Drama')), ...series.filter(s => s.genres.includes('Drama'))],
  'sci-fi': movies.filter(m => m.genres.includes('Sci-Fi')),
  'trending': movies.filter(m => m.isTrending),
  'hidden-gems': movies.filter(m => m.rating > 8 && !m.isTrending && !m.isFeatured),
};

const discoveryHooks: Record<string, string> = {
  'movie-1': 'The ending shocked millions of viewers',
  'movie-2': 'If you loved Parasite, watch this next',
  'movie-3': 'A love story you\'ve never seen before',
  'movie-4': 'One of the most underrated thrillers ever',
  'movie-5': 'The movie nobody expected to be a masterpiece',
  'movie-6': 'Based on true events — even more shocking',
  'movie-7': 'Crimson Sky changes what Sci-Fi can be',
  'movie-8': 'You will not sleep after watching this',
  'movie-9': 'The most beautiful film of the decade',
  'movie-10': 'A romance that broke all records',
  'series-1': 'The series Iran can\'t stop rewatching',
  'series-2': 'This love story will wreck you',
};

export default function DiscoverSection() {
  const [activeCategory, setActiveCategory] = useState('trending');

  const displayContent = (categoryContent[activeCategory] || movies).slice(0, 8);

  return (
    <div className="px-4 sm:px-6">
      {/* Section header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Gem className="w-6 h-6 text-accent-400" />
          <h2 className="text-xl md:text-2xl font-bold text-white">Discover Your Next Favorite</h2>
        </div>
        <p className="text-gray-400 text-sm">
          Stop searching.{' '}
          <span className="text-accent-400 font-medium">Start discovering.</span>
        </p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.id
                ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Content Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {displayContent.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
              {displayContent.map((item, index) => {
                const isMovie = 'duration' in item;
                const hook = discoveryHooks[item.id];
                return (
                  <DiscoverCard
                    key={item.id}
                    item={item}
                    isMovie={isMovie}
                    hook={hook}
                    index={index}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>More content coming soon in this category</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface DiscoverCardProps {
  item: Movie | Series;
  isMovie: boolean;
  hook?: string;
  index: number;
}

function DiscoverCard({ item, isMovie, hook, index }: DiscoverCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group"
    >
      <Link to={`/${isMovie ? 'movie' : 'series'}/${item.id}`}>
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-800">
          <img
            src={item.poster}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* Rating badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-yellow-400 text-xs font-bold">
            <Star className="w-3 h-3 fill-current" />
            {item.rating}
          </div>

          {/* Hover play */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40"
              >
                <div className="w-14 h-14 rounded-full bg-accent-600 flex items-center justify-center shadow-glow">
                  <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hook text */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {hook && (
              <p className="text-white text-xs font-semibold leading-snug mb-1.5 line-clamp-2">
                "{hook}"
              </p>
            )}
            <p className="text-gray-300 text-xs truncate">{item.year}</p>
          </div>
        </div>

        <div className="mt-2 px-0.5">
          <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-accent-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.genres.slice(0, 2).join(' · ')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
