import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { movies, series } from '../data/mockData';

export default function ContinueWatching() {
  // Simulate continue watching with fake progress
  const continueWatchingItems = [
    { id: 'movie-1', type: 'movie', progress: 65 },
    { id: 'movie-3', type: 'movie', progress: 30 },
    { id: 'series-1', type: 'series', progress: 45, season: 1, episode: 2 },
  ];

  return (
    <div className="px-4 sm:px-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">Continue Watching</h2>
        <p className="text-sm text-gray-500 mt-0.5">ادامه تماشا</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {continueWatchingItems.map((item, index) => {
          const content = item.type === 'movie'
            ? movies.find(m => m.id === item.id)
            : series.find(s => s.id === item.id);

          if (!content) return null;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <Link to={`/${item.type}/${item.id}`}>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src={content.backdrop}
                    alt={content.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-full bg-accent-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-1 left-0 right-0 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{content.title}</h3>
                        {item.type === 'series' && item.season && item.episode && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            S{item.season} E{item.episode}
                          </p>
                        )}
                        {item.type === 'movie' && 'duration' in content && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {Math.floor((1 - item.progress / 100) * content.duration)} min left
                          </p>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-accent-600 flex items-center justify-center shadow-lg"
                      >
                        <Play className="w-5 h-5 text-white fill-current" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
