import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Star, Clock } from 'lucide-react';
import { movies, series } from '../data/mockData';

export default function FeaturedSection() {
  const featuredMovies = movies.slice(0, 3);
  const featuredSeries = series.slice(0, 2);

  return (
    <div className="px-4 sm:px-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">Featured</h2>
        <p className="text-sm text-gray-500 mt-0.5">انتخاب سردبیر</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Large Featured Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 md:row-span-2 relative group"
        >
          <Link to={`/movie/${featuredMovies[0].id}`}>
            <div className="relative aspect-[16/10] md:aspect-auto md:h-full rounded-2xl overflow-hidden">
              <img
                src={featuredMovies[0].backdrop}
                alt={featuredMovies[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">{featuredMovies[0].rating}</span>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg glass text-gray-300 text-sm">
                    {featuredMovies[0].year}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg glass text-gray-300 text-sm flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredMovies[0].duration} min
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {featuredMovies[0].title}
                </h3>
                <p className="text-gray-400 text-sm md:text-base mb-4 line-clamp-2 max-w-lg">
                  {featuredMovies[0].description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredMovies[0].genres.map((genre) => (
                    <span key={genre} className="px-3 py-1 rounded-full bg-dark-800/50 text-gray-300 text-xs">
                      {genre}
                    </span>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 btn-primary"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </motion.button>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Smaller Featured Cards */}
        {featuredMovies.slice(1, 3).map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="relative group"
          >
            <Link to={`/movie/${movie.id}`}>
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">{movie.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{movie.year}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{movie.title}</h3>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-dark-900/50"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full bg-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30"
                  >
                    <Play className="w-6 h-6 text-white fill-current" />
                  </motion.button>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Series Featured Cards */}
        {featuredSeries.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="relative group"
          >
            <Link to={`/series/${s.id}`}>
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <img
                  src={s.backdrop}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />

                <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-accent-600 text-white text-xs font-semibold">
                  SERIES
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">{s.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{s.seasons.length} Seasons</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-dark-900/50"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full bg-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30"
                  >
                    <Play className="w-6 h-6 text-white fill-current" />
                  </motion.button>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
