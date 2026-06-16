import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Heart, Bookmark, Share2, ChevronRight } from 'lucide-react';
import { clips } from '../data/mockData';

export default function ExplorePreview() {
  const previewClips = clips.slice(0, 3);

  return (
    <div className="px-4 sm:px-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            Explore Clips
            <span className="px-2 py-1 text-xs rounded-full bg-accent-600/20 text-accent-400 font-normal">
              NEW
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">کلیپ‌های جذاب از فیلم‌ها و سریال‌ها</p>
        </div>
        <Link
          to="/explore"
          className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Horizontal Scroll Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {previewClips.map((clip, index) => {
          const formatNumber = (num: number) => {
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
            return num.toString();
          };

          return (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative aspect-[9/16] max-h-[400px] rounded-2xl overflow-hidden bg-dark-800">
                <img
                  src={clip.thumbnail}
                  alt={clip.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md glass text-white text-xs">
                  0:{clip.duration}
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-accent-600/90 backdrop-blur-sm flex items-center justify-center shadow-glow"
                  >
                    <Play className="w-7 h-7 text-white fill-current" />
                  </motion.button>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2">
                    {clip.title}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{formatNumber(clip.likes)}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-400 hover:text-accent-400 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        <span className="text-xs">{formatNumber(clip.saves)}</span>
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Link
          to="/explore"
          className="block w-full p-6 rounded-2xl bg-gradient-to-r from-accent-600/20 to-accent-800/20 border border-accent-500/20 hover:border-accent-500/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Discover More Clips</h3>
              <p className="text-sm text-gray-400 mt-1">Swipe through endless entertainment</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent-600/30 flex items-center justify-center group-hover:bg-accent-600/50 transition-colors">
              <ChevronRight className="w-6 h-6 text-accent-400" />
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
