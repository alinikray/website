import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Info, Bookmark, BookmarkCheck,
  ChevronLeft, ChevronRight,
  Star, Clock, Calendar,
  Flame, Award, MessageCircle, Rocket, Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Movie, Series } from '../types';
import { useAuth } from '../lib/auth';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../lib/api';
import { supabase } from '../lib/supabase';
import { mapDbMovieToMovie, mapDbSeriesToSeries } from '../lib/mappers';
import type { Movie as DbMovie, Series as DbSeries, Genre } from '../lib/database.types';

// ─── Public types ────────────────────────────────────────────────────────────

export type HeroBadge =
  | 'trending'
  | 'editors-pick'
  | 'most-discussed'
  | 'new-release'
  | 'featured';

export interface HeroSlide {
  content: Movie | Series;
  badge?: HeroBadge;
}

interface HeroBannerProps {
  /** Optional pre-fetched slides from the parent (HomePage).
   *  When provided they are merged on top of the self-fetched data.
   *  The component always falls back to MOCK_HERO when nothing is available. */
  slides?: HeroSlide[];
}

// ─── Hardcoded fallback ──────────────────────────────────────────────────────

const MOCK_HERO: Movie = {
  id: 'mock-golden-cage',
  title: 'The Golden Cage',
  titlePersian: 'قفس طلایی',
  year: 2024,
  rating: 8.9,
  duration: 124,
  genres: ['Drama', 'Family', 'Thriller'],
  description:
    "A powerful family's carefully constructed facade begins to crumble when long-buried secrets surface during a milestone birthday celebration, forcing each member to confront the choices that have defined — and destroyed — their lives.",
  poster: 'https://images.pexels.com/photos/1562477/pexels-photo-1562477.jpeg?auto=compress&cs=tinysrgb&w=800',
  backdrop:
    'https://images.pexels.com/photos/1813273/pexels-photo-1813273.jpeg?auto=compress&cs=tinysrgb&w=1920',
  trailer: '',
  cast: [],
  director: '',
  country: 'US',
  language: 'en',
  isFeatured: true,
  isTrending: true,
  isNewRelease: true,
};

const MOCK_SLIDES: HeroSlide[] = [
  { content: MOCK_HERO, badge: 'trending' },
  {
    content: {
      ...MOCK_HERO,
      id: 'mock-capital',
      title: 'The Capital',
      titlePersian: 'پایتخت',
      year: 2011,
      rating: 9.1,
      genres: ['Comedy', 'Drama', 'Family'],
      backdrop:
        'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1920',
      description:
        "Iran's most beloved comedy-drama series follows the endearing misadventures of the Naghi family as they navigate modern city life while holding onto their roots.",
    },
    badge: 'editors-pick',
  },
  {
    content: {
      ...MOCK_HERO,
      id: 'mock-midnight',
      title: 'Midnight Chronicle',
      titlePersian: 'وقایع نیمه‌شب',
      year: 2023,
      rating: 8.4,
      genres: ['Mystery', 'Crime', 'Drama'],
      backdrop:
        'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=1920',
      description:
        'When a detective uncovers a series of unsolved disappearances in a sleepy coastal town, she realizes the answers lie closer to home than she ever imagined.',
    },
    badge: 'new-release',
  },
];

// ─── Badge config ────────────────────────────────────────────────────────────

const BADGE_CFG: Record<
  HeroBadge,
  { label: string; icon: React.ReactNode; bg: string; fg: string }
> = {
  trending: {
    label: 'Trending This Week',
    icon: <Flame className="w-3.5 h-3.5" />,
    bg: 'bg-orange-500',
    fg: 'text-white',
  },
  'editors-pick': {
    label: "Editor's Pick",
    icon: <Award className="w-3.5 h-3.5" />,
    bg: 'bg-yellow-400',
    fg: 'text-gray-900',
  },
  'most-discussed': {
    label: 'Most Discussed',
    icon: <MessageCircle className="w-3.5 h-3.5" />,
    bg: 'bg-blue-500',
    fg: 'text-white',
  },
  'new-release': {
    label: 'New Release',
    icon: <Rocket className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-500',
    fg: 'text-white',
  },
  featured: {
    label: 'Featured',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    bg: 'bg-accent-600',
    fg: 'text-white',
  },
};

const BADGE_SEQ: HeroBadge[] = [
  'trending',
  'editors-pick',
  'most-discussed',
  'new-release',
  'featured',
];

const AUTO_MS = 7000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isMovie(c: Movie | Series): c is Movie {
  return 'duration' in c;
}

function fmt(min: number): string {
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

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div
      className="relative w-full overflow-hidden bg-dark-950"
      style={{ height: 'clamp(540px, 80vh, 860px)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-dark-800/80 to-dark-950 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent" />
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end">
        <div className="pb-24 sm:pb-28 md:pb-36 w-full max-w-xl space-y-4 animate-pulse">
          <div className="flex gap-2">
            <div className="h-7 w-40 rounded-full bg-dark-700" />
            <div className="h-7 w-24 rounded-full bg-dark-700" />
          </div>
          <div className="space-y-2.5">
            <div className="h-16 w-3/4 rounded-xl bg-dark-700" />
            <div className="h-8 w-1/2 rounded-lg bg-dark-800" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-20 rounded-lg bg-dark-700" />
            <div className="h-7 w-14 rounded-lg bg-dark-700" />
            <div className="h-7 w-16 rounded-full bg-dark-700" />
            <div className="h-7 w-16 rounded-full bg-dark-700" />
          </div>
          <div className="space-y-2 pt-1">
            <div className="h-5 w-full rounded bg-dark-700" />
            <div className="h-5 w-5/6 rounded bg-dark-700" />
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-12 w-36 rounded-xl bg-accent-800/50" />
            <div className="h-12 w-32 rounded-xl bg-dark-700" />
            <div className="h-12 w-12 rounded-xl bg-dark-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function HeroBanner({ slides: propSlides }: HeroBannerProps) {
  // Starts with mock data so the hero NEVER shows blank
  const [slides, setSlides] = useState<HeroSlide[]>(MOCK_SLIDES);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Merge parent-provided slides (if any) ──────────────────────────────────
  useEffect(() => {
    if (propSlides && propSlides.length > 0) {
      setSlides(propSlides);
      setDbLoaded(true);
      setIdx(0);
    }
  }, [propSlides]);

  // ── Self-fetch featured content (only if parent hasn't already provided data) ─
  useEffect(() => {
    if (dbLoaded) return;

    (async () => {
      try {
        const [moviesRes, seriesRes, genresRes] = await Promise.all([
          supabase
            .from('movies')
            .select('*')
            .eq('status', 'published')
            .eq('is_featured', true)
            .order('imdb_rating', { ascending: false })
            .limit(4),
          supabase
            .from('series')
            .select('*')
            .eq('is_featured', true)
            .order('imdb_rating', { ascending: false })
            .limit(2),
          supabase.from('genres').select('*'),
        ]);

        const dbGenres = (genresRes.data || []) as Genre[];

        // Genre map for movies
        const movieGenreMap: Record<string, Genre[]> = {};
        const dbMovies = (moviesRes.data || []) as DbMovie[];
        if (dbMovies.length > 0) {
          const { data: links } = await supabase
            .from('movie_genres')
            .select('movie_id, genre_id')
            .in('movie_id', dbMovies.map(m => m.id));
          for (const l of links ?? []) {
            if (!movieGenreMap[l.movie_id]) movieGenreMap[l.movie_id] = [];
            const g = dbGenres.find(gg => gg.id === l.genre_id);
            if (g) movieGenreMap[l.movie_id].push(g);
          }
        }

        // Genre map for series
        const seriesGenreMap: Record<string, Genre[]> = {};
        const dbSeries = (seriesRes.data || []) as DbSeries[];
        if (dbSeries.length > 0) {
          const { data: links } = await supabase
            .from('series_genres')
            .select('series_id, genre_id')
            .in('series_id', dbSeries.map(s => s.id));
          for (const l of links ?? []) {
            if (!seriesGenreMap[l.series_id]) seriesGenreMap[l.series_id] = [];
            const g = dbGenres.find(gg => gg.id === l.genre_id);
            if (g) seriesGenreMap[l.series_id].push(g);
          }
        }

        const mappedMovies = dbMovies
          .filter(m => m.backdrop_url)
          .map(m => mapDbMovieToMovie(m, movieGenreMap[m.id] || []));

        const mappedSeries = dbSeries
          .filter(s => s.backdrop_url)
          .map(s => mapDbSeriesToSeries(s, seriesGenreMap[s.id] || []));

        // Interleave movies and series for visual variety
        const interleaved: (Movie | Series)[] = [];
        const mq = [...mappedMovies];
        const sq = [...mappedSeries];
        while (mq.length || sq.length) {
          if (mq.length) interleaved.push(mq.shift()!);
          if (sq.length) interleaved.push(sq.shift()!);
        }

        const built: HeroSlide[] = interleaved.slice(0, 5).map((content, i) => ({
          content,
          badge: BADGE_SEQ[i % BADGE_SEQ.length],
        }));

        if (built.length > 0) {
          setSlides(built);
          setIdx(0);
        }
        // If nothing came back, mock slides remain unchanged
      } catch {
        // Silently keep mock data — hero never goes blank
      } finally {
        setDbLoaded(true);
      }
    })();
  }, [dbLoaded]);

  const total = slides.length;
  const slide = slides[idx] ?? slides[0];
  const content = slide.content;
  const badge = slide.badge ?? inferBadge(content);
  const bc = BADGE_CFG[badge];
  const movie = isMovie(content) ? content : null;
  const detailPath = movie ? `/movie/${content.id}` : `/series/${content.id}`;
  const watchPath = `/watch/${content.id}`;
  const runtime = movie ? fmt(movie.duration) : '';

  const goNext = useCallback(() => setIdx(p => (p + 1) % total), [total]);
  const goPrev = useCallback(() => setIdx(p => (p - 1 + total) % total), [total]);

  // Auto-advance
  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(goNext, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, goNext, total]);

  // Watchlist state per slide
  useEffect(() => {
    if (!user || !movie) { setInWatchlist(false); return; }
    let cancelled = false;
    isInWatchlist(user.id, content.id).then(v => { if (!cancelled) setInWatchlist(v); });
    return () => { cancelled = true; };
  }, [user, content.id, movie]);

  async function handleWatchlist() {
    if (!user) { navigate('/auth'); return; }
    if (wlLoading) return;
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

  if (!content) return <Skeleton />;

  return (
    <div
      className="relative w-full overflow-hidden group"
      style={{ height: 'clamp(540px, 80vh, 860px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          {content.backdrop ? (
            <img
              src={content.backdrop}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center select-none"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-950" />
          )}

          {/* Gradient layers — bottom-left bias for perfect text readability */}
          {/* Strong left sweep */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, #080C14 0%, #080C14cc 42%, #080C1466 68%, transparent 100%)',
            }}
          />
          {/* Bottom anchor */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, #080C14 0%, #080C14aa 28%, #080C1444 55%, transparent 100%)',
            }}
          />
          {/* Top header bleed */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, #080C1488 0%, transparent 35%)',
            }}
          />
          {/* Radial vignette on right edge */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(ellipse at 80% 50%, transparent 35%, #080C14 85%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Hero Content ──────────────────────────────────────────────────── */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end">
        <div className="w-full pb-16 sm:pb-20 md:pb-28 lg:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 }}
              className="max-w-[600px]"
            >
              {/* ── Row 1: Discovery badge + IMDb badge ─────────────────── */}
              <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                {/* Discovery badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-md ${bc.bg} ${bc.fg}`}
                >
                  {bc.icon}
                  {bc.label}
                </span>

                {/* IMDb rating badge */}
                {content.rating > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/25 text-yellow-300 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {content.rating.toFixed(1)}
                    <span className="text-yellow-600/80 font-normal">IMDb</span>
                  </span>
                )}

                {/* Premium pill */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-600/20 border border-accent-500/30 text-accent-300 text-xs font-medium">
                  <Sparkles className="w-3 h-3 text-accent-400" />
                  Premium
                </span>
              </div>

              {/* ── Row 2: English title ─────────────────────────────────── */}
              <h1
                className="font-display leading-[1.04] tracking-tight text-shadow-lg mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}
              >
                {content.title}
              </h1>

              {/* ── Row 3: Persian title + year ──────────────────────────── */}
              {(content.titlePersian || content.year > 0) && (
                <p
                  className="text-gray-400 mb-5 font-light tracking-wide"
                  style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    fontFamily:
                      "'Vazirmatn', 'Yekan Bakh', 'Tahoma', 'Arial', sans-serif",
                    direction: 'rtl',
                    textAlign: 'left',
                  }}
                >
                  {content.titlePersian}
                  {content.titlePersian && content.year > 0 ? '\u00a0' : ''}
                  {content.year > 0 && `(${content.year})`}
                </p>
              )}

              {/* ── Row 4: Year · Runtime · Genres ──────────────────────── */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {content.year > 0 && (
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <Calendar className="w-3.5 h-3.5 opacity-50" />
                    <span>{content.year}</span>
                  </div>
                )}

                {runtime && (
                  <>
                    <span className="text-gray-700 select-none text-sm">·</span>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Clock className="w-3.5 h-3.5 opacity-50" />
                      <span>{runtime}</span>
                    </div>
                  </>
                )}

                {content.genres?.length > 0 && (
                  <>
                    <span className="text-gray-700 select-none text-sm">·</span>
                    <div className="flex flex-wrap gap-1.5">
                      {content.genres.slice(0, 3).map(g => (
                        <span
                          key={g}
                          className="px-2.5 py-0.5 rounded-full bg-dark-700/80 border border-dark-600/60 text-gray-300 text-xs font-medium backdrop-blur-sm"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ── Row 5: Description (2 lines max) ────────────────────── */}
              {content.description && (
                <p
                  className="text-gray-300 leading-relaxed mb-7 text-shadow line-clamp-2"
                  style={{ fontSize: 'clamp(0.875rem, 1.6vw, 1.0625rem)', maxWidth: '540px' }}
                >
                  {content.description}
                </p>
              )}

              {/* ── Row 6: CTA buttons ───────────────────────────────────── */}
              <div className="flex flex-wrap gap-3">
                {/* Watch Now — solid accent purple */}
                <Link to={watchPath}>
                  <motion.button
                    whileHover={{
                      scale: 1.04,
                      boxShadow: '0 0 32px rgba(124, 58, 237, 0.6)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 bg-accent-600 hover:bg-accent-500 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg"
                    style={{ padding: 'clamp(10px, 1.5vw, 14px) clamp(20px, 3vw, 32px)', fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                  >
                    <Play className="w-5 h-5 fill-current shrink-0" />
                    Watch Now
                  </motion.button>
                </Link>

                {/* More Info — glassmorphism */}
                <Link to={detailPath}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/30 text-white font-semibold rounded-xl transition-all duration-200"
                    style={{ padding: 'clamp(10px, 1.5vw, 14px) clamp(18px, 2.5vw, 28px)', fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                  >
                    <Info className="w-4 h-4 shrink-0" />
                    More Info
                  </motion.button>
                </Link>

                {/* Watchlist toggle */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWatchlist}
                  disabled={wlLoading}
                  title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/30 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-40"
                  style={{ padding: 'clamp(10px, 1.5vw, 14px) clamp(14px, 2vw, 20px)', fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                >
                  {inWatchlist
                    ? <BookmarkCheck className="w-4 h-4 text-accent-400 shrink-0" />
                    : <Bookmark className="w-4 h-4 shrink-0" />
                  }
                  <span className="hidden sm:inline">
                    {inWatchlist ? 'Saved' : 'Watchlist'}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Slide indicators (vertical, right) ────────────────────────────── */}
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

      {/* ── Prev / Next arrows ────────────────────────────────────────────── */}
      {total > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-dark-900/55 backdrop-blur-sm border border-white/10 hover:border-accent-500/40 text-white hover:text-accent-400 transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goNext}
            aria-label="Next"
            className="absolute right-11 sm:right-14 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-dark-900/55 backdrop-blur-sm border border-white/10 hover:border-accent-500/40 text-white hover:text-accent-400 transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </>
      )}

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      {total > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 z-20">
          {!paused && (
            <motion.div
              key={`${idx}-bar`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
              className="h-full bg-accent-500/60"
            />
          )}
        </div>
      )}

      {/* ── Scroll hint ───────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center z-20 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.2, 0.65, 0.2] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
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
