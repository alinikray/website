import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Star, Clock, Calendar, Flame, Sparkles, MessageCircle, Rocket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Movie, Series } from '../types';
import { useAuth } from '../lib/auth';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../lib/api';

type BadgeType = 'trending' | 'editors-pick' | 'most-discussed' | 'new-release' | 'featured';

interface HeroSlide {
  content: Movie | Series;
  badge?: BadgeType;
}

interface HeroBannerProps {
  slides: HeroSlide[];
}

const BADGE_CONFIG: Record<BadgeType, { label: string; icon: React.ReactNode; className: string }> = {
  trending: {
    label: 'Trending This Week',
    icon: <Flame className="w-3.5 h-3.5" />,
    className: 'bg-orange-500/90 text-white',
  },
  'editors-pick': {
    label: "Editor's Pick",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    className: 'bg-yellow-500/90 text-dark-900',
  },
  'most-discussed': {
    label: 'Most Discussed',
    icon: <MessageCircle className="w-3.5 h-3.5" />,
    className: 'bg-blue-500/90 text-white',
  },
  'new-release': {
    label: 'New Release',
    icon: <Rocket className="w-3.5 h-3.5" />,
    className: 'bg-green-500/90 text-white',
  },
  featured: {
    label: 'Featured',
    icon: <Star className="w-3.5 h-3.5 fill-current" />,
    className: 'bg-accent-600/90 text-white',
  },
};

function isMovie(content: Movie | Series): content is Movie {
  return 'duration' in content;
}

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function inferBadge(content: Movie | Series): BadgeType {
  if (isMovie(content) && content.isNewRelease) return 'new-release';
  if ((isMovie(content) && content.isTrending) || (!isMovie(content) && content.isPopular)) return 'trending';
  if (isMovie(content) && content.isFeatured) return 'editors-pick';
  return 'featured';
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = slides.length;
  const current = slides[currentSlide];
  const content = current.content;
  const badge = current.badge ?? inferBadge(content);
  const badgeConfig = BADGE_CONFIG[badge];
  const contentIsMovie = isMovie(content);
  const detailPath = contentIsMovie ? `/movie/${content.id}` : `/series/${content.id}`;

  const goNext = useCallback(() => setCurrentSlide(prev => (prev + 1) % total), [total]);
  const goPrev = useCallback(() => setCurrentSlide(prev => (prev - 1 + total) % total), [total]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const id = setInterval(goNext, 7000);
    return () => clearInterval(id);
  }, [isPaused, goNext, total]);

  useEffect(() => {
    if (!user) { setInWatchlist(false); return; }
    if (!contentIsMovie) return;
    isInWatchlist(user.id, content.id).then(setInWatchlist);
  }, [user, content.id, contentIsMovie]);

  async function handleWatchlist() {
    if (!user) { navigate('/auth'); return; }
    if (watchlistLoading) return;
    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(user.id, contentIsMovie ? content.id : undefined, !contentIsMovie ? content.id : undefined);
        setInWatchlist(false);
      } else {
        await addToWatchlist(user.id, contentIsMovie ? content.id : undefined, !contentIsMovie ? content.id : undefined);
        setInWatchlist(true);
      }
    } finally {
      setWatchlistLoading(false);
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(520px, 85vh, 900px)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {content.backdrop ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${content.backdrop})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-dark-800" />
          )}
          {/* Cinematic gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/75 to-dark-900/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-dark-900/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Main content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end">
        <div className="w-full pb-16 sm:pb-20 md:pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
              className="max-w-2xl"
            >
              {/* Badge */}
              <div className="mb-4 flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${badgeConfig.className}`}>
                  {badgeConfig.icon}
                  {badgeConfig.label}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-white text-shadow-lg leading-tight mb-2">
                {content.title}
              </h1>

              {/* Persian title */}
              {content.titlePersian && (
                <p className="text-lg sm:text-xl text-gray-400 mb-4 font-light">
                  {content.titlePersian}
                </p>
              )}

              {/* Meta row: rating, year, runtime, genres */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <div className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-sm font-bold">{content.rating?.toFixed(1)}</span>
                  <span className="text-xs text-yellow-500/70">IMDb</span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{content.year}</span>
                </div>

                {contentIsMovie && content.duration > 0 && (
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatRuntime(content.duration)}</span>
                  </div>
                )}

                {content.genres?.slice(0, 3).map(genre => (
                  <span
                    key={genre}
                    className="px-2.5 py-0.5 rounded-full glass text-gray-300 text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-3 max-w-xl mb-6">
                {content.description}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <Link to={`/watch/${content.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 btn-primary px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Watch Now
                  </motion.button>
                </Link>

                <Link to={detailPath}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 btn-secondary px-5 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base"
                  >
                    <Info className="w-4 h-4" />
                    Watch Trailer
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleWatchlist}
                  disabled={watchlistLoading}
                  className="flex items-center gap-2 btn-secondary px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base disabled:opacity-50"
                  title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  {inWatchlist ? (
                    <BookmarkCheck className="w-4 h-4 text-accent-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{inWatchlist ? 'Saved' : 'Watchlist'}</span>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide navigation dots (vertical, right side) */}
      {total > 1 && (
        <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-400 ${
                i === currentSlide
                  ? 'h-8 w-1.5 bg-accent-500'
                  : 'h-1.5 w-1.5 bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Prev / Next arrows */}
      {total > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full glass text-white hover:text-accent-400 transition-all duration-200 z-10 opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goNext}
            aria-label="Next"
            className="absolute right-10 sm:right-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full glass text-white hover:text-accent-400 transition-all duration-200 z-10 opacity-0 hover:opacity-100 focus:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </>
      )}

      {/* Progress bar */}
      {total > 1 && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dark-700/50 z-10">
          <motion.div
            key={currentSlide}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 7, ease: 'linear' }}
            className="h-full bg-accent-500/60"
          />
        </div>
      )}

      {/* Scroll hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 z-10">
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="w-5 h-8 rounded-full border border-gray-600/50 flex items-start justify-center pt-1"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-1 h-1 rounded-full bg-accent-400/70"
          />
        </motion.div>
      </div>
    </div>
  );
}
