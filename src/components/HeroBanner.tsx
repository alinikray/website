import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Info, Bookmark, BookmarkCheck,
  ChevronLeft, ChevronRight,
  Star, Clock, Calendar,
  Flame, Sparkles, MessageCircle, Rocket, Award,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Movie, Series } from '../types';
import { useAuth } from '../lib/auth';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../lib/api';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type HeroBadge = 'trending' | 'editors-pick' | 'most-discussed' | 'new-release' | 'featured';

export interface HeroSlide {
  content: Movie | Series;
  badge?: HeroBadge;
}

interface HeroBannerProps {
  slides: HeroSlide[];
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const BADGE_CONFIG: Record<HeroBadge, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
  trending: {
    label: 'Trending This Week',
    icon: <Flame className="w-3.5 h-3.5" />,
    bg: 'bg-orange-500',
    text: 'text-white',
  },
  'editors-pick': {
    label: "Editor's Pick",
    icon: <Award className="w-3.5 h-3.5" />,
    bg: 'bg-yellow-400',
    text: 'text-gray-900',
  },
  'most-discussed': {
    label: 'Most Discussed',
    icon: <MessageCircle className="w-3.5 h-3.5" />,
    bg: 'bg-blue-500',
    text: 'text-white',
  },
  'new-release': {
    label: 'New Release',
    icon: <Rocket className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-500',
    text: 'text-white',
  },
  featured: {
    label: 'Featured',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    bg: 'bg-accent-600',
    text: 'text-white',
  },
};

const AUTO_ADVANCE_MS = 7000;

// ─── Helpers ────────────────────────────────────────────────────────────────────

function isMovie(c: Movie | Series): c is Movie {
  return 'duration' in c;
}

function formatRuntime(min: number): string {
  if (!min || min <= 0) return '';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function inferBadge(c: Movie | Series): HeroBadge {
  if (isMovie(c)) {
    if (c.isNewRelease) return 'new-release';
    if (c.isTrending) return 'trending';
    if (c.isFeatured) return 'editors-pick';
  } else {
    if (c.isPopular) return 'trending';
  }
  return 'featured';
}

// ─── Skeleton ───────────────────────────────────────────────────────────────────

function HeroSkeleton() {
  return (
    <div
      className="relative w-full overflow-hidden bg-dark-900"
      style={{ height: 'clamp(560px, 88vh, 920px)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/70 to-transparent" />
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end">
        <div className="w-full pb-20 sm:pb-24 md:pb-32 max-w-2xl space-y-5 animate-pulse">
          {/* Badge skeleton */}
          <div className="h-7 w-44 rounded-full bg-dark-700" />
          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-14 w-3/4 rounded-xl bg-dark-700" />
            <div className="h-8 w-1/2 rounded-lg bg-dark-800" />
          </div>
          {/* Meta skeleton */}
          <div className="flex gap-2">
            <div className="h-7 w-20 rounded-lg bg-dark-700" />
            <div className="h-7 w-14 rounded-lg bg-dark-700" />
            <div className="h-7 w-16 rounded-lg bg-dark-700" />
            <div className="h-7 w-16 rounded-full bg-dark-700" />
          </div>
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-full rounded bg-dark-700" />
            <div className="h-5 w-5/6 rounded bg-dark-700" />
            <div className="h-5 w-2/3 rounded bg-dark-700" />
          </div>
          {/* Buttons skeleton */}
          <div className="flex gap-3 pt-1">
            <div className="h-12 w-36 rounded-xl bg-accent-800/60" />
            <div className="h-12 w-32 rounded-xl bg-dark-700" />
            <div className="h-12 w-12 rounded-xl bg-dark-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function HeroBanner({ slides }: HeroBannerProps) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = slides.length;
  const slide = slides[idx];
  const content = slide?.content;
  const badge = slide?.badge ?? (content ? inferBadge(content) : 'featured');
  const badgeCfg = BADGE_CONFIG[badge];
  const movie = content && isMovie(content) ? content : null;
  const detailPath = content ? (movie ? `/movie/${content.id}` : `/series/${content.id}`) : '/';
  const watchPath = content ? `/watch/${content.id}` : '/';

  const goNext = useCallback(() => setIdx(p => (p + 1) % total), [total]);
  const goPrev = useCallback(() => setIdx(p => (p - 1 + total) % total), [total]);

  // Auto-advance
  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, goNext, total]);

  // Watchlist check on slide change
  useEffect(() => {
    if (!user || !content || !movie) { setInWatchlist(false); return; }
    let cancelled = false;
    isInWatchlist(user.id, content.id).then(v => { if (!cancelled) setInWatchlist(v); });
    return () => { cancelled = true; };
  }, [user, content?.id, movie]);

  async function handleWatchlist() {
    if (!user) { navigate('/auth'); return; }
    if (wlLoading || !content) return;
    setWlLoading(true);
    try {
      const mid = movie ? content.id : undefined;
      const sid = !movie ? content.id : undefined;
      if (inWatchlist) {
        await removeFromWatchlist(user.id, mid, sid);
        setInWatchlist(false);
      } else {
        await addToWatchlist(user.id, mid, sid);
        setInWatchlist(true);
      }
    } finally {
      setWlLoading(false);
    }
  }

  if (!content) return <HeroSkeleton />;

  const runtime = movie ? formatRuntime(movie.duration) : '';

  return (
    <div
      className="relative w-full overflow-hidden group"
      style={{ height: 'clamp(560px, 88vh, 920px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Backdrop ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.07 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          {content.backdrop ? (
            <img
              src={content.backdrop}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-950" />
          )}

          {/* Multi-layer cinematic gradient for depth & readability */}
          {/* Left: main text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-900/85 to-dark-900/10" />
          {/* Bottom: content anchor */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/50 to-transparent" />
          {/* Top: header bleed */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-transparent to-transparent" />
          {/* Subtle vignette */}
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: 'radial-gradient(ellipse at 70% 50%, transparent 40%, #0B0B0F 100%)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Hero Content ─────────────────────────────────────────────── */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end">
        <div className="w-full pb-16 sm:pb-20 md:pb-28 lg:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
              className="max-w-2xl"
            >
              {/* Badge + Premium pill */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-lg ${badgeCfg.bg} ${badgeCfg.text}`}
                >
                  {badgeCfg.icon}
                  {badgeCfg.label}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-600/20 border border-accent-500/30 text-accent-300 text-xs font-medium">
                  <Star className="w-3 h-3 fill-current text-accent-400" />
                  Premium
                </span>
              </div>

              {/* English title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-white text-shadow-lg leading-[1.05] mb-2 tracking-tight">
                {content.title}
              </h1>

              {/* Persian title + year */}
              {(content.titlePersian || content.year > 0) && (
                <p
                  className="text-base sm:text-lg text-gray-400 mb-5 font-light"
                  dir="rtl"
                  style={{ fontFamily: "'Vazirmatn', 'Tahoma', 'Arial', sans-serif" }}
                >
                  {content.titlePersian}
                  {content.titlePersian && content.year > 0 && ' '}
                  {content.year > 0 && `(${content.year})`}
                </p>
              )}

              {/* Meta: IMDb rating · year · runtime · genres */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {content.rating > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-yellow-500/15 border border-yellow-500/20">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-bold leading-none">
                      {content.rating.toFixed(1)}
                    </span>
                    <span className="text-yellow-600 text-xs font-medium leading-none">IMDb</span>
                  </div>
                )}

                {content.year > 0 && (
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Calendar className="w-3.5 h-3.5 opacity-60" />
                    <span>{content.year}</span>
                  </div>
                )}

                {runtime && (
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                    <span>{runtime}</span>
                  </div>
                )}

                {content.genres?.length > 0 && (
                  <>
                    <span className="text-gray-700 text-sm select-none">·</span>
                    {content.genres.slice(0, 3).map(g => (
                      <span
                        key={g}
                        className="px-2.5 py-0.5 rounded-full bg-dark-700/70 border border-dark-600/50 text-gray-300 text-xs font-medium backdrop-blur-sm"
                      >
                        {g}
                      </span>
                    ))}
                  </>
                )}
              </div>

              {/* Description */}
              {content.description && (
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-xl mb-7 text-shadow">
                  {content.description}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Watch Now */}
                <Link to={watchPath}>
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(124,58,237,0.55)' }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 bg-accent-600 hover:bg-accent-500 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-colors duration-200 shadow-lg text-sm sm:text-base"
                  >
                    <Play className="w-5 h-5 fill-current shrink-0" />
                    Watch Now
                  </motion.button>
                </Link>

                {/* More Info / Trailer */}
                <Link to={detailPath}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-dark-800/60 hover:bg-dark-700/70 backdrop-blur-md border border-white/10 hover:border-white/20 text-white font-semibold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl transition-all duration-200 text-sm sm:text-base"
                  >
                    <Info className="w-4 h-4 shrink-0" />
                    More Info
                  </motion.button>
                </Link>

                {/* Watchlist */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWatchlist}
                  disabled={wlLoading}
                  title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  className="flex items-center gap-2 bg-dark-800/60 hover:bg-dark-700/70 backdrop-blur-md border border-white/10 hover:border-white/20 text-white font-semibold px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl transition-all duration-200 text-sm sm:text-base disabled:opacity-40"
                >
                  {inWatchlist
                    ? <BookmarkCheck className="w-4 h-4 text-accent-400 shrink-0" />
                    : <Bookmark className="w-4 h-4 shrink-0" />
                  }
                  <span className="hidden sm:inline">{inWatchlist ? 'Saved' : 'Watchlist'}</span>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Slide Indicators (vertical, right) ───────────────────────── */}
      {total > 1 && (
        <div className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === idx
                  ? 'h-8 w-1.5 bg-accent-500 shadow-glow'
                  : 'h-1.5 w-1.5 bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* ── Prev / Next Arrows ───────────────────────────────────────── */}
      {total > 1 && (
        <>
          <motion.button
            initial={false}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-dark-900/50 backdrop-blur-sm border border-white/10 text-white hover:text-accent-400 hover:border-accent-500/40 transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            initial={false}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-11 sm:right-14 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-dark-900/50 backdrop-blur-sm border border-white/10 text-white hover:text-accent-400 hover:border-accent-500/40 transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </>
      )}

      {/* ── Auto-advance Progress Bar ────────────────────────────────── */}
      {total > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-dark-700/60 z-20">
          {!paused && (
            <motion.div
              key={`${idx}-progress`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
              className="h-full bg-accent-500/70"
            />
          )}
        </div>
      )}

      {/* ── Scroll hint (desktop only) ───────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center z-20 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-gray-600/40 flex items-start justify-center pt-1.5"
        >
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="w-1 h-1.5 rounded-full bg-accent-400/60"
          />
        </motion.div>
      </div>
    </div>
  );
}
