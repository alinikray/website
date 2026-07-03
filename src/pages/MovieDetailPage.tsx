import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Plus, Check, Star, Clock, Calendar, Globe,
  Heart, Share2, ChevronRight, Eye, Users,
  MessageSquare, ThumbsUp, ChevronDown, Download,
  HardDrive, Film, Award, Clapperboard, BookOpen,
  Info, Zap, Link2, Languages, Cpu, X, Volume2,
  FileText,
} from 'lucide-react';
import { getMovieById, getSimilarMovies, getMovieGenres, getClipsByMovie } from '../lib/api';
import { fetchMovieDetails, fetchSimilarMovies } from '../lib/tmdbService';
import { mapDbMovieToMovie, mapDbActorToCastMember } from '../lib/mappers';
import { supabase } from '../lib/supabase';
import type { Movie as DbMovie, Genre, ExploreClip, Actor } from '../lib/database.types';
import { Movie, CastMember } from '../types';
import CinematicLoader from '../components/CinematicLoader';

const mockComments = [
  { id: 1, name: 'Reza M.', avatar: 'RM', text: 'Absolutely stunning cinematography. The final act blew my mind.', likes: 142, time: '2 days ago' },
  { id: 2, name: 'Sara K.', avatar: 'SK', text: 'One of the best films I have ever seen. A masterpiece.', likes: 89, time: '3 days ago' },
  { id: 3, name: 'Ali H.', avatar: 'AH', text: 'The performances were outstanding. Highly recommended.', likes: 67, time: '1 week ago' },
];

const mockAwards = [
  { ceremony: 'Film Festival', year: 2024, award: 'Best Film', won: true },
  { ceremony: 'International Film Festival', year: 2024, award: 'Best Director', won: true },
  { ceremony: 'Screen Awards', year: 2023, award: 'Best Original Screenplay', won: false },
];

const downloadOptions = [
  { quality: '1080p', label: 'Full HD', size: '2.3 GB' },
  { quality: '720p', label: 'HD', size: '1.1 GB' },
  { quality: '480p', label: 'SD', size: '520 MB' },
];

const advancedDownloadOptions = [
  {
    quality: '4K',
    label: 'Ultra HD',
    size: '8.1 GB',
    codec: 'H.265 / HEVC',
    bitrate: '40 Mbps',
    audio: [
      { lang: 'English', format: 'Dolby Atmos 7.1' },
      { lang: 'Persian', format: 'AAC 2.0' },
    ],
    subtitles: [
      { lang: 'Persian Subtitle', code: 'fa' },
      { lang: 'English Subtitle', code: 'en' },
    ],
  },
  {
    quality: '1080p',
    label: 'Full HD',
    size: '2.3 GB',
    codec: 'H.264 / AVC',
    bitrate: '12 Mbps',
    audio: [
      { lang: 'English', format: 'DTS-HD 5.1' },
      { lang: 'Persian', format: 'AAC 2.0' },
    ],
    subtitles: [
      { lang: 'Persian Subtitle', code: 'fa' },
      { lang: 'English Subtitle', code: 'en' },
    ],
  },
  {
    quality: '720p',
    label: 'HD',
    size: '1.1 GB',
    codec: 'H.264 / AVC',
    bitrate: '6 Mbps',
    audio: [
      { lang: 'English', format: 'AAC 5.1' },
      { lang: 'Persian', format: 'AAC 2.0' },
    ],
    subtitles: [
      { lang: 'Persian Subtitle', code: 'fa' },
      { lang: 'English Subtitle', code: 'en' },
    ],
  },
  {
    quality: '480p',
    label: 'SD',
    size: '520 MB',
    codec: 'H.264 / AVC',
    bitrate: '2.5 Mbps',
    audio: [
      { lang: 'English', format: 'AAC 2.0' },
    ],
    subtitles: [
      { lang: 'Persian Subtitle', code: 'fa' },
      { lang: 'English Subtitle', code: 'en' },
    ],
  },
];

interface AdvancedDownloadPanelProps {
  onClose: () => void;
  movieTitle: string;
}

function AdvancedDownloadPanel({ onClose, movieTitle }: AdvancedDownloadPanelProps) {
  const [selectedQuality, setSelectedQuality] = useState(advancedDownloadOptions[1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22 }}
      className="mt-4 rounded-2xl border border-accent-500/25 bg-dark-800/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/60 bg-accent-600/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-600/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">دانلود پیشرفته</p>
            <p className="text-gray-500 text-xs">Advanced Download</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-dark-700/50 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Quality selector */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Film className="w-3.5 h-3.5 text-accent-400" />
            Quality Options
          </p>
          <div className="grid grid-cols-4 gap-2">
            {advancedDownloadOptions.map(opt => (
              <button
                key={opt.quality}
                onClick={() => setSelectedQuality(opt)}
                className={`px-3 py-2.5 rounded-xl text-center transition-all ${
                  selectedQuality.quality === opt.quality
                    ? 'bg-accent-600 text-white shadow-lg shadow-accent-500/25 ring-1 ring-accent-400/50'
                    : 'bg-dark-700/60 text-gray-400 hover:bg-dark-600/60 hover:text-white'
                }`}
              >
                <p className="font-bold text-sm">{opt.quality}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Audio */}
          <div className="bg-dark-700/40 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-accent-400" />
              Audio
            </p>
            <div className="space-y-2">
              {selectedQuality.audio.map((a, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm text-white">{a.lang}</span>
                  </div>
                  <span className="text-xs text-accent-300 bg-accent-600/15 px-2 py-0.5 rounded-full">{a.format}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subtitles */}
          <div className="bg-dark-700/40 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-accent-400" />
              Subtitles
            </p>
            <div className="space-y-2">
              {selectedQuality.subtitles.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-white">{s.lang}</span>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Available</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical details */}
          <div className="bg-dark-700/40 rounded-xl p-4 md:col-span-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-accent-400" />
              Technical Details
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] text-gray-500 mb-1">File Size</p>
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-white font-medium">{selectedQuality.size}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Codec</p>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-white font-medium">{selectedQuality.codec}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Bitrate</p>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-white font-medium">{selectedQuality.bitrate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download links */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-accent-400" />
            Download Links
          </p>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-accent-500/20"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Direct Download</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 glass border border-accent-500/20 hover:border-accent-500/40 text-accent-300 hover:text-white font-semibold py-3 rounded-xl transition-all"
            >
              <Link2 className="w-4 h-4" />
              <span className="text-sm">Mirror Download</span>
            </motion.button>
          </div>
          <p className="text-xs text-gray-600 mt-2.5 flex items-center gap-1.5">
            <Info className="w-3 h-3" />
            {movieTitle} · {selectedQuality.quality} · {selectedQuality.size} · Premium only
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Accordion({ title, icon: Icon, children, defaultOpen = false }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-dark-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-accent-400" />
          <span className="text-white font-semibold">{title}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-dark-700/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [clips, setClips] = useState<ExploreClip[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});
  const [showAdvancedDownload, setShowAdvancedDownload] = useState(false);
  const [showMobileAdvancedDownload, setShowMobileAdvancedDownload] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      const dbMovie = await getMovieById(id);

      if (dbMovie) {
        const [g, c, sim] = await Promise.all([
          getMovieGenres(dbMovie.id),
          getClipsByMovie(dbMovie.id),
          getSimilarMovies(dbMovie.id),
        ]);

        const { data: castLinks } = await supabase
          .from('movie_actors')
          .select('actor_id, character_name')
          .eq('movie_id', dbMovie.id)
          .limit(12);

        let cast: CastMember[] = [];
        if (castLinks?.length) {
          const { data: actors } = await supabase
            .from('actors')
            .select('*')
            .in('id', castLinks.map((l: any) => l.actor_id));
          if (actors) {
            cast = (castLinks as any[]).map((link: any) => {
              const actor = (actors as Actor[]).find(a => a.id === link.actor_id);
              return actor ? mapDbActorToCastMember(actor, link.character_name) : null;
            }).filter((c): c is CastMember => c !== null);
          }
        }

        const simGenreMap: Record<string, Genre[]> = {};
        if (sim.length > 0) {
          const { data: sgLinks } = await supabase
            .from('movie_genres')
            .select('movie_id, genre_id')
            .in('movie_id', sim.map(s => s.id));
          if (sgLinks) {
            for (const link of sgLinks as any[]) {
              if (!simGenreMap[link.movie_id]) simGenreMap[link.movie_id] = [];
              const found = g.find(gg => gg.id === link.genre_id);
              if (found) simGenreMap[link.movie_id].push(found);
            }
          }
        }

        const mappedSimilar = (sim as DbMovie[]).map(m =>
          mapDbMovieToMovie(m, simGenreMap[m.id] || [])
        );

        setMovie(mapDbMovieToMovie(dbMovie, g, cast));
        setClips(c);
        setSimilarMovies(mappedSimilar);
      } else {
        const [tmdbMovie, similar] = await Promise.all([
          fetchMovieDetails(id),
          fetchSimilarMovies(id),
        ]);
        if (tmdbMovie) setMovie(tmdbMovie);
        setSimilarMovies(similar);
      }

      setLoading(false);
    })();
  }, [id]);

  if (loading) return <CinematicLoader />;

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Movie not found</h1>
          <Link to="/" className="text-accent-400 hover:text-accent-300 mt-4 inline-block">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen -mt-14 md:-mt-20 lg:-mt-24">

      {/* ════════════ MOBILE LAYOUT (max-md) ════════════ */}
      <div className="md:hidden min-h-screen bg-dark-900">

        {/* ── Mobile Header ── */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-2.5 bg-dark-900/95 backdrop-blur-xl border-b border-white/5">
          {/* Left: hamburger + profile */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>
          </div>

          {/* Center: bell + search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center leading-none">2</span>
            </div>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
            </button>
          </div>

          {/* Right: logo */}
          <Link to="/" className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/30">
            <span className="text-white font-display font-bold text-base">F</span>
          </Link>
        </div>

        {/* ── Hero backdrop + floating poster ── */}
        <div className="relative pt-14">
          {/* Blurred backdrop */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={movie.backdrop || movie.poster}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
            />
            <div className="absolute inset-0 bg-dark-900/40" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent" />
          </div>

          {/* Floating poster — overlaps the backdrop */}
          <div className="flex flex-col items-center -mt-24 px-6 relative z-10">
            <div className="relative w-44 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10">
              <img
                src={movie.poster || movie.backdrop}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
              {/* Title overlay at top of poster */}
              <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 to-transparent pt-3 pb-6 px-3">
                <p className="text-white font-display font-black text-lg tracking-widest uppercase text-center leading-tight drop-shadow-lg">
                  {movie.title.split(' ').slice(0, 2).join(' ')}
                </p>
              </div>
            </div>

            {/* Rating row under poster */}
            <div className="mt-3 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/20">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-bold">{movie.rating.toFixed(1)}</span>
                  <span className="text-yellow-500/70 text-xs font-semibold">IMDb</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs">Rate this movie</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setUserRating(s * 2)}
                  >
                    <Star className={`w-5 h-5 transition-colors ${s * 2 <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-700'}`} />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Content card below hero ── */}
        <div className="px-4 pt-5 pb-28">

          {/* Title */}
          <h1 className="text-2xl font-display font-bold text-white text-center mb-1 leading-tight">
            {movie.title}
          </h1>
          {movie.titlePersian && (
            <p className="text-sm text-gray-400 text-center mb-3" style={{ fontFamily: "'Vazirmatn', 'Tahoma', sans-serif" }}>
              {movie.titlePersian}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {movie.country && (
              <span className="flex items-center gap-1 text-gray-400 text-xs">
                <Globe className="w-3.5 h-3.5 opacity-70" />
                {movie.country}
              </span>
            )}
            {movie.duration > 0 && (
              <span className="flex items-center gap-1 text-gray-400 text-xs">
                <Clock className="w-3.5 h-3.5 opacity-70" />
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </span>
            )}
            {movie.year > 0 && (
              <span className="flex items-center gap-1 text-gray-400 text-xs">
                <Calendar className="w-3.5 h-3.5 opacity-70" />
                {movie.year}
              </span>
            )}
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500 text-gray-900 text-xs font-bold">
              <span>IMDb</span>
              <Star className="w-3 h-3 fill-current" />
              {movie.rating.toFixed(1)}
            </span>
          </div>

          {/* Genre pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {movie.genres.slice(0, 4).map(genre => (
              <Link
                key={genre}
                to={`/search?genre=${encodeURIComponent(genre)}`}
                className="px-3 py-1.5 rounded-full bg-dark-800/80 border border-white/10 text-gray-300 text-xs font-medium hover:text-white transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>

          {/* ── Action buttons (stacked) ── */}
          <div className="flex flex-col gap-3 mb-4">
            {/* Watch Now */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = `/watch/${movie.id}`}
              className="w-full flex items-center justify-center gap-2.5 bg-accent-600 hover:bg-accent-500 text-white font-bold py-3.5 min-h-[52px] rounded-xl shadow-[0_0_24px_rgba(124,58,237,0.4)] transition-all text-base"
            >
              <Play className="w-5 h-5 fill-current shrink-0" />
              Watch Now
            </motion.button>

            {/* Add to List */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSaved(!isSaved)}
              className={`w-full flex items-center justify-center gap-2.5 font-semibold py-3.5 min-h-[52px] rounded-xl border transition-all text-base ${
                isSaved
                  ? 'bg-accent-600/20 border-accent-500/50 text-accent-300'
                  : 'bg-dark-800/60 border-white/12 text-white hover:border-white/25'
              }`}
            >
              {isSaved ? <Check className="w-5 h-5 shrink-0" /> : <Plus className="w-5 h-5 shrink-0" />}
              {isSaved ? 'Saved' : 'Add to List'}
            </motion.button>

            {/* Download */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 bg-dark-800/60 border border-white/12 text-white font-semibold py-3.5 min-h-[52px] rounded-xl transition-all text-base hover:border-white/25"
            >
              <Download className="w-5 h-5 shrink-0" />
              دانلود
            </motion.button>

            {/* Advanced Download */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMobileAdvancedDownload(v => !v)}
              className={`w-full flex items-center justify-center gap-2.5 font-semibold py-3.5 min-h-[52px] rounded-xl transition-all text-base ${
                showMobileAdvancedDownload
                  ? 'bg-accent-600 text-white shadow-lg shadow-accent-500/25'
                  : 'bg-accent-600/15 border border-accent-500/30 text-accent-300 hover:bg-accent-600/25'
              }`}
            >
              <Zap className="w-5 h-5 shrink-0" />
              دانلود پیشرفته
            </motion.button>

            {/* Advanced Download Panel */}
            <AnimatePresence>
              {showMobileAdvancedDownload && (
                <AdvancedDownloadPanel
                  onClose={() => setShowMobileAdvancedDownload(false)}
                  movieTitle={movie.title}
                />
              )}
            </AnimatePresence>
          </div>

          {/* ── Quick actions row ── */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { icon: Eye, label: 'Viewed' },
              { icon: Share2, label: 'Share' },
              { icon: Heart, label: isLiked ? 'Liked' : 'Like' },
            ].map(({ icon: Icon, label }) => (
              <motion.button
                key={label}
                whileTap={{ scale: 0.93 }}
                onClick={label === 'Liked' || label === 'Like' ? () => setIsLiked(v => !v) : undefined}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all text-xs font-medium ${
                  label === 'Liked'
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-dark-800/60 border-white/8 text-gray-400 hover:text-white hover:border-white/15'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${label === 'Liked' ? 'fill-current' : ''}`} />
                {label}
              </motion.button>
            ))}
          </div>

        </div>{/* end px-4 content card */}

        {/* Mobile clips: 2-column grid */}
        {clips.length > 0 && (
          <div className="px-3 mt-2 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Clips</h2>
              <Link to="/explore" className="flex items-center gap-1 text-accent-400 text-xs">
                See all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {clips.slice(0, 6).map((clip, index) => (
                <motion.div
                  key={clip.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="group"
                >
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-dark-800">
                    <img
                      src={clip.thumbnail_url}
                      alt={clip.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* HOT/NEW badge top-right */}
                    <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${index % 2 === 0 ? 'bg-orange-500/90 text-white' : 'bg-emerald-500/90 text-white'}`}>
                      {index % 2 === 0 ? 'HOT' : 'NEW'}
                    </div>

                    {/* Centered play icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Below card: title + views + heart */}
                  <div className="mt-1.5 px-0.5">
                    <p className="text-white text-xs font-medium line-clamp-1">{clip.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-500 text-[10px] flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" />
                        {clip.views_count > 0
                          ? clip.views_count >= 1_000_000
                            ? `${(clip.views_count / 1_000_000).toFixed(1)}M`
                            : clip.views_count >= 1_000
                              ? `${(clip.views_count / 1_000).toFixed(0)}K`
                              : clip.views_count.toString()
                          : '—'}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile accordions */}
        <div className="px-3 space-y-3 pb-28">
          {movie.description && (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-dark-700/50">
                <BookOpen className="w-5 h-5 text-accent-400" />
                <span className="text-white font-semibold">Story</span>
              </div>
              <div className="px-5 pb-5">
                <p className="text-gray-300 leading-relaxed mt-4 text-sm">{movie.description}</p>
              </div>
            </div>
          )}
          {movie.cast.length > 0 && (
            <Accordion title="Cast" icon={Users}>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mt-4">
                {movie.cast.map((member, index) => (
                  <Link key={member.id} to={`/actor/${member.id}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex-shrink-0 w-[80px] text-center"
                    >
                      <div className="w-[64px] h-[64px] rounded-2xl overflow-hidden mb-2 mx-auto ring-1 ring-white/10">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=7C3AED&color=fff&size=110`;
                          }}
                        />
                      </div>
                      <p className="text-xs font-medium text-white line-clamp-1">{member.name}</p>
                      <p className="text-[10px] text-accent-400 mt-0.5 line-clamp-1">{member.role}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </Accordion>
          )}
          <Accordion title="Similar" icon={Film}>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mt-4">
              {similarMovies.map((sim) => (
                <Link key={sim.id} to={`/movie/${sim.id}`} className="flex-shrink-0 w-[100px] group">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                    <img src={sim.poster} alt={sim.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1 py-0.5 rounded glass text-yellow-400 text-[10px]">
                      <Star className="w-2.5 h-2.5 fill-current" />{sim.rating.toFixed(1)}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-white mt-1.5 line-clamp-1 group-hover:text-accent-400 transition-colors">{sim.title}</p>
                  <p className="text-[10px] text-gray-500">{sim.year}</p>
                </Link>
              ))}
            </div>
          </Accordion>
          <Accordion title="Reviews" icon={MessageSquare}>
            <div className="space-y-3 mt-4 mb-4">
              {mockComments.map((comment) => (
                <div key={comment.id} className="bg-dark-800/40 rounded-xl p-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-accent-600/50 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-white">{comment.name}</span>
                        <span className="text-[10px] text-gray-500">{comment.time}</span>
                      </div>
                      <p className="text-gray-300 text-xs">{comment.text}</p>
                      <button
                        onClick={() => setCommentLikes(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                        className={`flex items-center gap-1 mt-2 text-xs transition-colors ${commentLikes[comment.id] ? 'text-accent-400' : 'text-gray-500'}`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${commentLikes[comment.id] ? 'fill-current' : ''}`} />
                        {comment.likes + (commentLikes[comment.id] ? 1 : 0)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      </div>

      {/* ════════════ DESKTOP LAYOUT (md+) — completely unchanged ════════════ */}
      <div className="hidden md:block">
        {/* CINEMATIC BACKDROP */}
        <div className="relative h-[80vh] overflow-hidden">
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${movie.backdrop})` }}
            />
            <div className="absolute inset-0 backdrop-blur-[1px]" />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/70 via-transparent to-dark-900/40" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent-950/30 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.location.href = `/watch/${movie.id}`}
              className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-2xl"
            >
              <Play className="w-9 h-9 text-white fill-current ml-1" />
            </motion.button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative -mt-[60vh] z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-shrink-0 mx-auto lg:mx-0"
              >
                <div className="w-[220px] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10">
                  <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">IMDb</span>
                    <div className="flex items-center gap-1 text-yellow-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {movie.rating.toFixed(1)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Rate this movie</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(star * 2)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setUserRating(star * 2)}
                      >
                        <Star className={`w-5 h-5 transition-colors ${star * 2 <= (hoverRating || userRating) ? 'text-yellow-400 fill-current' : 'text-gray-700'}`} />
                      </motion.button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-accent-400 text-center">
                      Your rating: {userRating}/10
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="flex-1 text-center lg:text-left"
              >
                <h1 className="text-3xl md:text-5xl font-display text-white mb-1 text-shadow-lg">
                  {movie.title}
                </h1>
                {movie.titlePersian && <h2 className="text-lg text-gray-400 mb-4">{movie.titlePersian}</h2>}

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{movie.rating.toFixed(1)}</span>
                    <span className="text-yellow-500/70 text-xs">IMDb</span>
                  </div>
                  {movie.year > 0 && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />{movie.year}
                    </span>
                  )}
                  {movie.duration > 0 && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />{Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                    </span>
                  )}
                  {movie.country && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-400">
                      <Globe className="w-4 h-4" />{movie.country}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                  {movie.genres.map(genre => (
                    <Link
                      key={genre}
                      to={`/search?genre=${encodeURIComponent(genre)}`}
                      className="px-3 py-1.5 rounded-full glass text-sm text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-5">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2.5 bg-accent-600 hover:bg-accent-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-accent-500/30 transition-all text-lg"
                    onClick={() => window.location.href = `/watch/${movie.id}`}
                  >
                    <Play className="w-6 h-6 fill-current" />
                    Watch Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setIsSaved(!isSaved)}
                    className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                      isSaved
                        ? 'bg-accent-600/30 text-accent-400 border border-accent-500/50'
                        : 'glass text-white hover:bg-dark-700/50'
                    }`}
                  >
                    {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isSaved ? 'Saved' : 'Add to List'}
                  </motion.button>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${isLiked ? 'bg-red-500/20 text-red-400' : 'glass text-gray-400 hover:text-red-400'}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{isLiked ? 'Liked' : 'Like'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 glass text-gray-400 hover:text-white px-4 py-2.5 rounded-lg transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 glass text-gray-400 hover:text-white px-4 py-2.5 rounded-lg transition-all"
                  >
                    <Eye className="w-5 h-5" />
                    <span className="text-sm">Viewed</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* ACCORDION SECTIONS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 space-y-3"
            >
              {movie.description && (
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 p-5 border-b border-dark-700/50">
                    <BookOpen className="w-5 h-5 text-accent-400" />
                    <span className="text-white font-semibold">Story</span>
                  </div>
                  <div className="px-5 pb-5">
                    <p className="text-gray-300 leading-relaxed mt-4">{movie.description}</p>
                  </div>
                </div>
              )}

              {movie.cast.length > 0 && (
                <Accordion title="Cast" icon={Users}>
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 mt-4">
                    {movie.cast.map((member, index) => (
                      <Link key={member.id} to={`/actor/${member.id}`}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.04 }}
                          whileHover={{ scale: 1.04 }}
                          className="flex-shrink-0 w-[130px] text-center"
                        >
                          <div className="w-[110px] h-[110px] rounded-2xl overflow-hidden mb-2.5 mx-auto ring-1 ring-white/10">
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=7C3AED&color=fff&size=110`;
                              }}
                            />
                          </div>
                          <p className="text-sm font-medium text-white line-clamp-1 hover:text-accent-400 transition-colors">{member.name}</p>
                          <p className="text-xs text-accent-400 mt-0.5 line-clamp-1">{member.role}</p>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </Accordion>
              )}

              <Accordion title="Production" icon={Clapperboard}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {[
                    { label: 'Country', value: movie.country },
                    { label: 'Language', value: movie.language },
                    { label: 'Year', value: movie.year > 0 ? movie.year.toString() : '—' },
                    { label: 'Runtime', value: movie.duration > 0 ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : '—' },
                    { label: 'Genres', value: movie.genres.join(', ') || '—' },
                  ].map(item => (
                    <div key={item.label} className="bg-dark-800/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="text-sm text-white font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Reviews" icon={MessageSquare}>
                <div className="space-y-3 mt-4 mb-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="bg-dark-800/40 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-600/50 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {comment.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm font-semibold text-white">{comment.name}</span>
                            <span className="text-xs text-gray-500">{comment.time}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{comment.text}</p>
                          <button
                            onClick={() => setCommentLikes(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                            className={`flex items-center gap-1.5 mt-2 text-xs transition-colors ${commentLikes[comment.id] ? 'text-accent-400' : 'text-gray-500 hover:text-white'}`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${commentLikes[comment.id] ? 'fill-current' : ''}`} />
                            {comment.likes + (commentLikes[comment.id] ? 1 : 0)}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-600/50 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    Me
                  </div>
                  <div className="flex-1 relative">
                    <input type="text" placeholder="Add a comment..." className="w-full input-field pr-12 text-sm" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-400 hover:text-accent-300">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Accordion>

              <Accordion title="Awards & Recognition" icon={Award}>
                <div className="space-y-3 mt-4">
                  {mockAwards.map((award, i) => (
                    <div key={i} className="flex items-center gap-4 bg-dark-800/40 rounded-xl p-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${award.won ? 'bg-yellow-500/20' : 'bg-dark-700'}`}>
                        <Award className={`w-5 h-5 ${award.won ? 'text-yellow-400' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{award.award}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{award.ceremony} · {award.year}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${award.won ? 'bg-yellow-500/20 text-yellow-400' : 'bg-dark-700 text-gray-500'}`}>
                        {award.won ? 'Won' : 'Nominated'}
                      </span>
                    </div>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Download" icon={Download}>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Info className="w-4 h-4 flex-shrink-0" />
                      Downloads available for Premium subscribers. Expires after 30 days.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowAdvancedDownload(v => !v)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ml-4 ${
                        showAdvancedDownload
                          ? 'bg-accent-600 text-white shadow-lg shadow-accent-500/25'
                          : 'bg-accent-600/15 border border-accent-500/30 text-accent-300 hover:bg-accent-600/25'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      دانلود پیشرفته
                    </motion.button>
                  </div>

                  {/* Advanced Download Panel */}
                  <AnimatePresence>
                    {showAdvancedDownload && (
                      <AdvancedDownloadPanel
                        onClose={() => setShowAdvancedDownload(false)}
                        movieTitle={movie.title}
                      />
                    )}
                  </AnimatePresence>

                  {/* Standard download options */}
                  {!showAdvancedDownload && downloadOptions.map((opt) => (
                    <div key={opt.quality} className="flex items-center justify-between bg-dark-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center">
                          <Film className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold text-sm">{opt.quality}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-dark-700 text-gray-400">{opt.label}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{opt.size}</span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </motion.button>
                    </div>
                  ))}
                </div>
              </Accordion>
            </motion.div>

            {/* EXPLORE CLIPS */}
            {clips.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Clips from this Movie</h2>
                  <Link to="/explore" className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm">
                    View in Explore <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {clips.map((clip, index) => (
                    <motion.div
                      key={clip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.08 }}
                      className="flex-shrink-0 w-[170px] group"
                    >
                      <div className="relative aspect-[9/16] rounded-xl overflow-hidden">
                        <img src={clip.thumbnail_url} alt={clip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-accent-600 flex items-center justify-center shadow-glow">
                            <Play className="w-5 h-5 text-white fill-current" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs font-medium line-clamp-2">{clip.title}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* SIMILAR MOVIES */}
            {similarMovies.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 pb-14"
              >
                <h2 className="text-xl font-bold text-white mb-5">
                  Similar Movies
                  <span className="text-sm text-gray-500 font-normal mr-2"> فیلم‌های مشابه</span>
                </h2>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {similarMovies.map((sim, index) => (
                    <Link key={sim.id} to={`/movie/${sim.id}`} className="flex-shrink-0 w-[170px] group">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        whileHover={{ scale: 1.04 }}
                        className="relative aspect-[2/3] rounded-xl overflow-hidden"
                      >
                        <img src={sim.poster} alt={sim.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded glass text-yellow-400 text-xs">
                          <Star className="w-3 h-3 fill-current" />{sim.rating.toFixed(1)}
                        </div>
                      </motion.div>
                      <p className="text-sm font-medium text-white mt-2 line-clamp-1 group-hover:text-accent-400 transition-colors">{sim.title}</p>
                      <p className="text-xs text-gray-500">{sim.year}</p>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
