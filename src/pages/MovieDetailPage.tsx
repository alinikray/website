import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play, Plus, Check, Star, Clock, Calendar, Globe,
  Heart, Share2, Download
} from 'lucide-react';
import { getMovieById, getSimilarMovies, clips } from '../data/mockData';

export default function MovieDetailPage() {
  const { id } = useParams();
  const movie = getMovieById(id || '');
  const similarMovies = movie ? getSimilarMovies(movie.id) : [];
  const movieClips = clips.filter(c => c.movieId === id);

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  return (
    <div className="min-h-screen -mt-20 md:-mt-24">
      {/* Hero Backdrop */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-dark-900/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 via-transparent to-dark-900/60" />
      </div>

      {/* Content */}
      <div className="relative -mt-[40vh] md:-mt-[50vh] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0 mx-auto lg:mx-0"
            >
              <div className="w-[200px] md:w-[280px] rounded-xl overflow-hidden shadow-2xl shadow-black/40">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 text-center lg:text-left"
            >
              {/* Title Section */}
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-2">
                  {movie.title}
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-300 mb-3">
                  {movie.titlePersian}
                </h2>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{movie.rating}</span>
                  </div>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {movie.year}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    {movie.country}
                  </span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre}
                    to={`/search?genre=${encodeURIComponent(genre)}`}
                    className="px-4 py-2 rounded-full glass text-sm text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                  >
                    {genre}
                  </Link>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                {movie.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 btn-primary px-8 py-4 text-lg"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Watch Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                    isSaved
                      ? 'bg-accent-600/30 text-accent-400 border border-accent-500/50'
                      : 'btn-secondary'
                  }`}
                >
                  {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isSaved ? 'Saved' : 'My List'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 btn-secondary"
                >
                  <Download className="w-5 h-5" />
                  Download
                </motion.button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-full transition-colors ${
                    isLiked
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-dark-800/50 text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-dark-800/50 text-gray-400 hover:text-white transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Cast Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {movie.cast.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex-shrink-0 w-[140px] md:w-[160px] text-center"
                >
                  <div className="w-[140px] md:w-[160px] h-[140px] md:h-[160px] rounded-full overflow-hidden mb-3 mx-auto ring-2 ring-dark-700 ring-offset-2 ring-offset-dark-900">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${member.name}&background=7C3AED&color=fff&size=160`;
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{member.namePersian}</p>
                  <p className="text-xs text-accent-400 mt-1">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Clips Section */}
          {movieClips.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Popular Clips
                  <span className="text-sm text-gray-500 font-normal mr-2">کلیپ‌های محبوب</span>
                </h2>
                <Link to="/explore" className="text-accent-400 hover:text-accent-300 text-sm">
                  Browse All
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {movieClips.map((clip, index) => (
                  <motion.div
                    key={clip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="relative group"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img
                        src={clip.thumbnail}
                        alt={clip.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                      <div className="absolute top-3 right-3 px-2 py-1 rounded glass text-white text-xs">
                        0:{clip.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-14 h-14 rounded-full bg-accent-600 flex items-center justify-center shadow-glow"
                        >
                          <Play className="w-6 h-6 text-white fill-current" />
                        </motion.div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-sm font-semibold text-white line-clamp-1">{clip.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                Similar Movies
                <span className="text-sm text-gray-500 font-normal mr-2">فیلم‌های مشابه</span>
              </h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {similarMovies.map((similarMovie, index) => (
                  <Link
                    key={similarMovie.id}
                    to={`/movie/${similarMovie.id}`}
                    className="flex-shrink-0 w-[200px] group"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative aspect-[2/3] rounded-xl overflow-hidden"
                    >
                      <img
                        src={similarMovie.poster}
                        alt={similarMovie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-60" />
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded glass text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {similarMovie.rating}
                      </div>
                    </motion.div>
                    <h3 className="text-sm font-semibold text-white mt-2 line-clamp-1 group-hover:text-accent-400 transition-colors">
                      {similarMovie.title}
                    </h3>
                    <p className="text-xs text-gray-500">{similarMovie.year}</p>
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
