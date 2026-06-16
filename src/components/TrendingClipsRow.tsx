import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Heart, TrendingUp, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { clips, movies } from '../data/mockData';

const discoveryHooks: Record<string, string> = {
  'clip-1': 'The ending shocked millions',
  'clip-2': 'Most underrated thriller ever made',
  'clip-3': 'This scene changed everything',
  'clip-4': 'If you loved Parasite, watch this',
  'clip-5': 'Nobody expected this masterpiece',
  'clip-6': 'You will cry — guaranteed',
};

const socialProof: Record<string, { views: string; trendingRank?: number }> = {
  'clip-1': { views: '1.2M', trendingRank: 3 },
  'clip-2': { views: '890K', trendingRank: 7 },
  'clip-3': { views: '2.1M', trendingRank: 1 },
  'clip-4': { views: '445K' },
  'clip-5': { views: '3.4M', trendingRank: 2 },
  'clip-6': { views: '678K', trendingRank: 5 },
};

export default function TrendingClipsRow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [likedClips, setLikedClips] = useState<Record<string, boolean>>({});

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <div className="relative">
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Trending Clips</h2>
          </div>
          <p className="text-sm text-gray-500">کلیپ‌های پرطرفدار این هفته</p>
        </div>
        <Link
          to="/explore"
          className="flex items-center gap-1.5 text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors group"
        >
          See All
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="relative group/row">
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2"
        >
          {clips.map((clip, index) => {
            const movie = movies.find(m => m.id === clip.movieId);
            const hook = discoveryHooks[clip.id];
            const proof = socialProof[clip.id];

            return (
              <motion.div
                key={clip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="flex-shrink-0 w-[200px] md:w-[220px] group/card"
              >
                {/* Card — vertical aspect ratio like Reels */}
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-dark-800">
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Trending badge */}
                  {proof?.trendingRank && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/90 text-white text-xs font-bold">
                      <TrendingUp className="w-3 h-3" />
                      #{proof.trendingRank}
                    </div>
                  )}

                  {/* Duration */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full glass text-white text-xs">
                    0:{clip.duration}s
                  </div>

                  {/* Play button hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 rounded-full bg-accent-600/90 backdrop-blur-sm flex items-center justify-center shadow-glow"
                    >
                      <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                    </motion.div>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    {hook && (
                      <p className="text-white text-xs font-semibold leading-snug mb-2 line-clamp-2">
                        "{hook}"
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Eye className="w-3 h-3 text-accent-400" />
                        <span className="text-white font-medium">{proof?.views}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                          e.preventDefault();
                          setLikedClips(prev => ({ ...prev, [clip.id]: !prev[clip.id] }));
                        }}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          likedClips[clip.id] ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedClips[clip.id] ? 'fill-current' : ''}`} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Below card */}
                {movie && (
                  <Link to={`/movie/${movie.id}`}>
                    <div className="flex items-center gap-2 mt-2.5 px-1 group/info">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-white text-xs font-medium line-clamp-1 group-hover/info:text-accent-400 transition-colors">
                          {movie.title}
                        </p>
                        <p className="text-gray-500 text-xs">{movie.year}</p>
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}

          {/* See more CTA */}
          <Link
            to="/explore"
            className="flex-shrink-0 w-[200px] md:w-[220px] aspect-[9/16] rounded-2xl bg-gradient-to-br from-accent-600/20 to-accent-900/40 border border-accent-500/20 hover:border-accent-500/50 transition-colors flex flex-col items-center justify-center gap-3 group/more"
          >
            <div className="w-14 h-14 rounded-full bg-accent-600/30 group-hover/more:bg-accent-600/50 transition-colors flex items-center justify-center">
              <ChevronRight className="w-7 h-7 text-accent-400" />
            </div>
            <div className="text-center px-4">
              <p className="text-white font-semibold text-sm">Explore All</p>
              <p className="text-gray-500 text-xs mt-1">Endless discovery</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
