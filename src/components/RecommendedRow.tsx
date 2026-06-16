import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { movies, series } from '../data/mockData';
import { Movie, Series } from '../types';

const alsoWatchedPairs: Record<string, string> = {
  'movie-1': 'People who loved this also loved: The Capital',
  'movie-2': 'Fans of this thriller chose: Night Watch',
  'movie-5': 'People who watched this also watched: Shahrazad',
  'movie-3': 'Viewers also fell in love with: Beyond the Horizon',
};

export default function RecommendedRow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);

  const recommended: (Movie | Series)[] = [
    ...movies.filter(m => m.rating >= 8.2),
    ...series.filter(s => s.rating >= 8.5),
  ].sort(() => Math.random() - 0.5).slice(0, 10);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-accent-400" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Recommended For You</h2>
          </div>
          <p className="text-sm text-gray-500">پیشنهاد ویژه برای شما</p>
        </div>
        <Link to="/search" className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors">
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="relative group/row">
        {showLeft && (
          <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          onScroll={() => setShowLeft((scrollRef.current?.scrollLeft ?? 0) > 0)}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2"
        >
          {recommended.map((item, index) => {
            const isMovie = 'duration' in item;
            const alsoWatched = alsoWatchedPairs[item.id];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[200px] md:w-[220px] group/card"
              >
                <Link to={`/${isMovie ? 'movie' : 'series'}/${item.id}`}>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-800">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-yellow-400 text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      {item.rating}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/30">
                      <div className="w-12 h-12 rounded-full bg-accent-600 flex items-center justify-center shadow-glow">
                        <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 px-0.5">
                    <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover/card:text-accent-400 transition-colors">
                      {item.title}
                    </h3>
                    {alsoWatched ? (
                      <p className="text-xs text-accent-400/80 mt-1 line-clamp-2 leading-snug">
                        {alsoWatched}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.year} · {item.genres[0]}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
