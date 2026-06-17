import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Plus, Check, Star, Clock, Calendar, Globe,
  Heart, Share2, ChevronRight, Eye, Users,
  MessageSquare, ThumbsUp, ChevronDown, Download,
  Subtitles, HardDrive, Film, Award, Clapperboard, BookOpen,
  Info
} from 'lucide-react';
import { getMovieById, getSimilarMovies, clips } from '../data/mockData';

const mockComments = [
  { id: 1, name: 'Reza M.', avatar: 'RM', text: 'Absolutely stunning cinematography. The final act blew my mind.', likes: 142, time: '2 days ago' },
  { id: 2, name: 'Sara K.', avatar: 'SK', text: 'One of the best Iranian films I have ever seen. A masterpiece.', likes: 89, time: '3 days ago' },
  { id: 3, name: 'Ali H.', avatar: 'AH', text: 'The performances were outstanding. Highly recommended.', likes: 67, time: '1 week ago' },
];

const mockAwards = [
  { ceremony: 'Tehran Film Festival', year: 2024, award: 'Best Film', won: true },
  { ceremony: 'Fajr International Film Festival', year: 2024, award: 'Best Director', won: true },
  { ceremony: 'Asia Pacific Screen Awards', year: 2023, award: 'Best Original Screenplay', won: false },
];

const downloadOptions = [
  { quality: '1080p', label: 'Full HD', size: '2.3 GB', icon: '🎬' },
  { quality: '720p', label: 'HD', size: '1.1 GB', icon: '📺' },
  { quality: '480p', label: 'SD', size: '520 MB', icon: '📱' },
];

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
  const { id } = useParams();
  const movie = getMovieById(id || '');
  const similarMovies = movie ? getSimilarMovies(movie.id) : [];
  const movieClips = clips.filter(c => c.movieId === id);

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});

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
    <div className="min-h-screen -mt-20 md:-mt-24">
      {/* CINEMATIC BACKDROP */}
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
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
          {/* Subtle blur */}
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/70 via-transparent to-dark-900/40" />

        {/* Purple ambient glow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent-950/30 to-transparent" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-2xl"
          >
            <Play className="w-9 h-9 text-white fill-current ml-1" />
          </motion.button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative -mt-[48vh] md:-mt-[60vh] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* TOP ROW: Poster + Info */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10">

            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0 mx-auto lg:mx-0"
            >
              <div className="w-[160px] md:w-[220px] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10">
                <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
              </div>
              {/* Rating */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">IMDb</span>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {movie.rating}
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
              <h2 className="text-lg text-gray-400 mb-4">{movie.titlePersian}</h2>

              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3 mb-5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{movie.rating}</span>
                  <span className="text-yellow-500/70 text-xs">IMDb</span>
                </div>
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />{movie.year}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />{Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Globe className="w-4 h-4" />{movie.country}
                </span>
              </div>

              {/* Genres */}
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

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-5">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2.5 bg-accent-600 hover:bg-accent-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-accent-500/30 transition-all text-lg"
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

              {/* Engagement row */}
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
            {/* Story */}
            <Accordion title="Story" icon={BookOpen}>
              <p className="text-gray-300 leading-relaxed mt-4">{movie.description}</p>
            </Accordion>

            {/* Cast */}
            <Accordion title="Cast" icon={Users}>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 mt-4">
                {movie.cast.map((member, index) => (
                  <Link key={member.id} to={`/actor/${member.id}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ scale: 1.04 }}
                      className="flex-shrink-0 w-[110px] md:w-[130px] text-center"
                    >
                      <div className="w-[90px] md:w-[110px] h-[90px] md:h-[110px] rounded-2xl overflow-hidden mb-2.5 mx-auto ring-1 ring-white/10">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${member.name}&background=7C3AED&color=fff&size=110`;
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

            {/* Production */}
            <Accordion title="Production" icon={Clapperboard}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {[
                  { label: 'Director', value: movie.director },
                  { label: 'Country', value: movie.country },
                  { label: 'Language', value: movie.language },
                  { label: 'Year', value: movie.year.toString() },
                  { label: 'Runtime', value: `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` },
                  { label: 'Genres', value: movie.genres.join(', ') },
                ].map(item => (
                  <div key={item.label} className="bg-dark-800/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="text-sm text-white font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </Accordion>

            {/* Reviews */}
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

            {/* Awards */}
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

            {/* Download */}
            <Accordion title="Download" icon={Download}>
              <div className="mt-4 space-y-3">
                <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Downloads are available for Premium subscribers. Expires after 30 days.
                </p>
                {downloadOptions.map((opt) => (
                  <div key={opt.quality} className="flex items-center justify-between bg-dark-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center text-lg">
                        {opt.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">{opt.quality}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-dark-700 text-gray-400">{opt.label}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{opt.size}</span>
                          <span className="flex items-center gap-1"><Subtitles className="w-3 h-3" />Subtitles: FA, EN</span>
                          <span className="flex items-center gap-1"><Film className="w-3 h-3" />Persian Audio</span>
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
          {movieClips.length > 0 && (
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
                {movieClips.map((clip, index) => (
                  <motion.div
                    key={clip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.08 }}
                    className="flex-shrink-0 w-[150px] md:w-[170px] group"
                  >
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden">
                      <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
                  <Link key={sim.id} to={`/movie/${sim.id}`} className="flex-shrink-0 w-[150px] md:w-[170px] group">
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
                        <Star className="w-3 h-3 fill-current" />{sim.rating}
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
  );
}
