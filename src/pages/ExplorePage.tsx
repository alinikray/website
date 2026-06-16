import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Heart, Bookmark, Share2, ChevronLeft,
  Volume2, VolumeX
} from 'lucide-react';
import { clips, movies, series } from '../data/mockData';

export default function ExplorePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const allClips = clips.length > 0 ? clips : [];

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      const delta = e.deltaY;
      if (delta > 50 && currentIndex < allClips.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (delta < -50 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('wheel', handleWheel, { passive: true });
    return () => container?.removeEventListener('wheel', handleWheel);
  }, [currentIndex, allClips.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && currentIndex < allClips.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentClip = allClips[currentIndex];
  const content = currentClip
    ? movies.find(m => m.id === currentClip.movieId) ||
      series.find(s => s.id === currentClip.movieId.replace('movie', 'series'))
    : null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="h-[calc(100vh-80px)] md:h-[calc(100vh-88px)] relative overflow-hidden bg-dark-950 focus:outline-none"
    >
      {/* Navigation Indicators */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1">
        {allClips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-4 w-1 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-accent-500 h-8'
                : 'bg-gray-700 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Clips Container */}
      <div className="relative h-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {currentClip && (
            <motion.div
              key={currentIndex}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <div className="relative h-full rounded-2xl overflow-hidden">
                {/* Video/Image */}
                <div className="absolute inset-0 bg-dark-800">
                  <img
                    src={currentClip.thumbnail}
                    alt={currentClip.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Animated shimmer effect to simulate video */}
                  <div className="absolute inset-0 shimmer pointer-events-none" />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/30" />
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg glass text-white text-sm font-medium">
                  0:{currentClip.duration}
                </div>

                {/* Mute Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute top-4 left-4 z-20 p-2.5 rounded-full glass text-white"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </motion.button>

                {/* Play/Pause Overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <motion.button
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-20 h-20 rounded-full bg-accent-600/80 backdrop-blur-sm flex items-center justify-center shadow-glow pointer-events-auto cursor-pointer"
                  >
                    <Play className="w-9 h-9 text-white fill-current" />
                  </motion.button>
                </motion.div>

                {/* Bottom Info Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  {/* Clip Title */}
                  <div className="mb-24">
                    <h2 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                      {currentClip.title}
                    </h2>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-end justify-between">
                    {/* Content Info */}
                    {content && (
                      <Link
                        to={content.id.includes('movie') ? `/movie/${content.id}` : `/series/${content.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <img
                          src={content.poster}
                          alt={content.title}
                          className="w-14 h-20 rounded-lg object-cover shadow-lg"
                        />
                        <div>
                          <h3 className="text-white font-semibold group-hover:text-accent-400 transition-colors">
                            {content.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {content.year} • {content.genres.slice(0, 2).join(', ')}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-2 px-4 py-1.5 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-500 transition-colors"
                          >
                            Watch Movie
                          </motion.button>
                        </div>
                      </Link>
                    )}

                    {/* Social Actions */}
                    <div className="flex flex-col gap-4 ml-4">
                      <ActionButton
                        icon={Heart}
                        label={formatNumber(currentClip.likes + (isLiked[currentClip.id] ? 1 : 0))}
                        isActive={isLiked[currentClip.id]}
                        onClick={() =>
                          setIsLiked(prev => ({ ...prev, [currentClip.id]: !prev[currentClip.id] }))
                        }
                        color="red"
                      />
                      <ActionButton
                        icon={Bookmark}
                        label={formatNumber(currentClip.saves + (isSaved[currentClip.id] ? 1 : 0))}
                        isActive={isSaved[currentClip.id]}
                        onClick={() =>
                          setIsSaved(prev => ({ ...prev, [currentClip.id]: !prev[currentClip.id] }))
                        }
                        color="accent"
                      />
                      <ActionButton
                        icon={Share2}
                        label={formatNumber(currentClip.shares)}
                        onClick={() => {}}
                        color="white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-40 p-3 rounded-full glass text-white hover:bg-dark-700 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 rotate-90" />
          </motion.button>
        )}
        {currentIndex < allClips.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setCurrentIndex(prev => Math.min(allClips.length - 1, prev + 1))}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 p-3 rounded-full glass text-white hover:bg-dark-700 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 -rotate-90" />
          </motion.button>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex absolute top-4 right-4 z-30 flex-col items-end gap-3">
        <div className="glass rounded-xl p-3 max-w-[200px]">
          <p className="text-xs text-gray-400 mb-1">Now Playing</p>
          <p className="text-sm text-white line-clamp-1">{currentClip?.title}</p>
        </div>
      </div>

      {/* Keyboard Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:block">
        <div className="glass rounded-lg px-3 py-2 flex items-center gap-2 text-gray-400 text-xs">
          <span className="px-1.5 py-0.5 bg-dark-700 rounded">↑</span>
          <span className="px-1.5 py-0.5 bg-dark-700 rounded">↓</span>
          <span>or scroll to navigate</span>
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  color?: 'red' | 'accent' | 'white';
}

function ActionButton({ icon: Icon, label, isActive, onClick, color = 'white' }: ActionButtonProps) {
  const colorClasses = {
    red: isActive ? 'text-red-400 bg-red-500/20' : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10',
    accent: isActive ? 'text-accent-400 bg-accent-500/20' : 'text-gray-400 hover:text-accent-400 hover:bg-accent-500/10',
    white: 'text-gray-400 hover:text-white hover:bg-white/10',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${colorClasses[color]}`}
    >
      <Icon className={`w-6 h-6 ${color === 'red' && isActive ? 'fill-current' : ''}`} />
      <span className="text-xs">{label}</span>
    </motion.button>
  );
}
