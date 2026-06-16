import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Plus, Check, Star, Clock, Calendar, Globe,
  Heart, Share2, Download, ChevronRight, Eye, Users,
  MessageSquare, ThumbsUp
} from 'lucide-react';
import { getMovieById, getSimilarMovies, clips } from '../data/mockData';

const alsoWatched: Record<string, string> = {
  'movie-1': 'People who watched this also loved: The Golden Cage',
  'movie-2': 'Fans of this thriller also chose: Night Watch',
  'movie-3': 'Viewers fell in love with: Beyond the Horizon',
  'movie-5': 'People who watched this also watched: Shadows of Tehran',
};

const mockComments = [
  { id: 1, name: 'Reza M.', avatar: 'RM', text: 'Absolutely stunning cinematography. The final act blew my mind.', likes: 142, time: '2 days ago' },
  { id: 2, name: 'Sara K.', avatar: 'SK', text: 'One of the best Iranian films I have ever seen. A masterpiece.', likes: 89, time: '3 days ago' },
  { id: 3, name: 'Ali H.', avatar: 'AH', text: 'The performances were outstanding. Highly recommended.', likes: 67, time: '1 week ago' },
];

export default function MovieDetailPage() {
  const { id } = useParams();
  const movie = getMovieById(id || '');
  const similarMovies = movie ? getSimilarMovies(movie.id) : [];
  const movieClips = clips.filter(c => c.movieId === id);

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showTrailerHint, setShowTrailerHint] = useState(true);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Movie not found</h1>
          <Link to="/" className="text-accent-400 hover:text-accent-300 mt-4 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const alsoNote = alsoWatched[movie.id];

  return (
    <div className="min-h-screen -mt-20 md:-mt-24">
      {/* CINEMATIC BACKDROP */}
      <div className="relative h-[55vh] md:h-[75vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${movie.backdrop})` }}
          />
        </motion.div>

        {/* Trailer autoplay shimmer hint */}
        <AnimatePresence>
          {showTrailerHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              onClick={() => setShowTrailerHint(false)}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-2xl z-10"
              >
                <Play className="w-9 h-9 text-white fill-current ml-1" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-dark-900/50" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative -mt-[45vh] md:-mt-[55vh] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* TOP ROW: Poster + Info */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10">

            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 mx-auto lg:mx-0"
            >
              <div className="w-[170px] md:w-[240px] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
                <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex-1 text-center lg:text-left"
            >
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-1 text-shadow-lg">
                {movie.title}
              </h1>
              <h2 className="text-lg md:text-xl text-gray-400 mb-4">{movie.titlePersian}</h2>

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

              {/* Description */}
              <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0">
                {movie.description}
              </p>

              {/* ✅ WATCH NOW — above the fold, primary CTA */}
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
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 glass text-white hover:bg-dark-700/50 px-5 py-4 rounded-xl font-medium transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download
                </motion.button>
              </div>

              {/* Engagement row */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                    isLiked ? 'bg-red-500/20 text-red-400' : 'glass text-gray-400 hover:text-red-400'
                  }`}
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

          {/* ALSO WATCHED BADGE */}
          {alsoNote && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 inline-flex items-center gap-2.5 px-4 py-3 rounded-xl bg-accent-600/10 border border-accent-500/20 text-sm text-gray-300"
            >
              <Users className="w-4 h-4 text-accent-400 flex-shrink-0" />
              <span>{alsoNote}</span>
              <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </motion.div>
          )}

          {/* CAST */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-10 md:mt-14"
          >
            <h2 className="text-xl font-bold text-white mb-5">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {movie.cast.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.04 }}
                  className="flex-shrink-0 w-[120px] md:w-[140px] text-center"
                >
                  <div className="w-[100px] md:w-[120px] h-[100px] md:h-[120px] rounded-2xl overflow-hidden mb-2.5 mx-auto ring-1 ring-white/10">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${member.name}&background=7C3AED&color=fff&size=120`;
                      }}
                    />
                  </div>
                  <p className="text-sm font-medium text-white line-clamp-1">{member.name}</p>
                  <p className="text-xs text-accent-400 mt-0.5 line-clamp-1">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* USER RATING */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 md:mt-14"
          >
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Rate this movie</h2>
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setUserRating(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 md:w-8 md:h-8 transition-colors ${
                        star <= (hoverRating || userRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-700'
                      }`}
                    />
                  </motion.button>
                ))}
                {(hoverRating || userRating) > 0 && (
                  <span className="text-yellow-400 font-bold text-lg ml-2">
                    {hoverRating || userRating}/10
                  </span>
                )}
              </div>
              {userRating > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-accent-400"
                >
                  Thanks for rating! Your score: {userRating}/10
                </motion.p>
              )}
            </div>
          </motion.section>

          {/* EXPLORE CLIPS */}
          {movieClips.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-10 md:mt-14"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white">Clips from this Movie</h2>
                <Link to="/explore" className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm">
                  View in Explore <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2">
                {movieClips.map((clip, index) => (
                  <motion.div
                    key={clip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.08 }}
                    className="flex-shrink-0 w-[160px] md:w-[180px] group"
                  >
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden">
                      <img
                        src={clip.thumbnail}
                        alt={clip.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded glass text-white text-xs">
                        0:{clip.duration}s
                      </div>
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

          {/* COMMENTS */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 md:mt-14"
          >
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent-400" />
              Comments
            </h2>
            <div className="space-y-3 mb-5">
              {mockComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl p-4"
                >
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
                      <button className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 hover:text-white transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {comment.likes}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Comment input */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-600/50 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                Me
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full input-field pr-12 text-sm"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-400 hover:text-accent-300">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.section>

          {/* SIMILAR MOVIES */}
          {similarMovies.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-10 md:mt-14 pb-14"
            >
              <h2 className="text-xl font-bold text-white mb-5">
                Similar Movies
                <span className="text-sm text-gray-500 font-normal mr-2">فیلم‌های مشابه</span>
              </h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {similarMovies.map((sim, index) => (
                  <Link key={sim.id} to={`/movie/${sim.id}`} className="flex-shrink-0 w-[160px] md:w-[180px] group">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.04 }}
                      className="relative aspect-[2/3] rounded-xl overflow-hidden"
                    >
                      <img src={sim.poster} alt={sim.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded glass text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />{sim.rating}
                      </div>
                    </motion.div>
                    <p className="text-sm font-medium text-white mt-2 line-clamp-1 group-hover:text-accent-400 transition-colors">
                      {sim.title}
                    </p>
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
