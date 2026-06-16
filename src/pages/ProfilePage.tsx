import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bookmark, Star, Clock, Settings, Edit2,
  Play, Calendar, ChevronRight
} from 'lucide-react';
import { movies, series } from '../data/mockData';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history' | 'ratings'>('watchlist');

  // Mock user data
  const user = {
    name: 'Sara Ahmadi',
    email: 'sara@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    watchlistCount: 24,
    watchedCount: 156,
    ratingsCount: 89,
    favoriteGenres: ['Drama', 'Thriller', 'Romance'],
    joinDate: 'January 2024',
  };

  // Mock data
  const watchlist = movies.slice(0, 6);
  const history = series.slice(0, 4);
  const ratings = movies.slice(2, 8);

  const tabs = [
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, count: user.watchlistCount },
    { id: 'history', label: 'Watch History', icon: Clock, count: user.watchedCount },
    { id: 'ratings', label: 'My Ratings', icon: Star, count: user.ratingsCount },
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Background */}
          <div className="absolute inset-0 -mx-4 sm:-mx-6 -mt-20 md:-mt-24 h-[200px] md:h-[300px]">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1920)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent" />
          </div>

          {/* Profile Content */}
          <div className="relative pt-8 md:pt-12">
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative mx-auto md:mx-0"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-dark-800 shadow-xl shadow-accent-500/10">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.name}&background=7C3AED&color=fff&size=150`;
                    }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-accent-600 text-white shadow-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-400 mt-1">{user.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  Member since {user.joinDate}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center md:justify-start gap-6 mt-6">
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white">{user.watchlistCount}</p>
                    <p className="text-xs text-gray-500">Watchlist</p>
                  </div>
                  <div className="w-px h-12 bg-dark-700" />
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white">{user.watchedCount}</p>
                    <p className="text-xs text-gray-500">Watched</p>
                  </div>
                  <div className="w-px h-12 bg-dark-700" />
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white">{user.ratingsCount}</p>
                    <p className="text-xs text-gray-500">Ratings</p>
                  </div>
                </div>
              </div>

              {/* Settings Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl glass text-gray-300 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
                Settings
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Favorite Genres */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-10"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Favorite Genres</h2>
          <div className="flex flex-wrap gap-2">
            {user.favoriteGenres.map((genre) => (
              <Link
                key={genre}
                to={`/search?genre=${encodeURIComponent(genre)}`}
                className="px-4 py-2 rounded-full glass text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
              >
                {genre}
              </Link>
            ))}
            <button className="px-4 py-2 rounded-full border border-dashed border-dark-600 text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors">
              + Add Genre
            </button>
          </div>
        </motion.section>

        {/* Tabs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <div className="flex items-center gap-4 border-b border-dark-700 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-dark-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'watchlist' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {watchlist.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Link to={`/movie/${movie.id}`}>
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-sm font-semibold text-white line-clamp-1">
                              {movie.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <Bookmark className="w-4 h-4 text-accent-400" />
                    </div>
                  </motion.div>
                ))}
                <Link
                  to="/watchlist"
                  className="flex items-center justify-center aspect-[2/3] rounded-xl border-2 border-dashed border-dark-700 hover:border-dark-600 transition-colors group"
                >
                  <div className="text-center">
                    <ChevronRight className="w-8 h-8 mx-auto text-gray-600 group-hover:text-gray-400" />
                    <p className="text-sm text-gray-600 group-hover:text-gray-400 mt-2">View All</p>
                  </div>
                </Link>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {history.map((show, index) => (
                  <motion.div
                    key={show.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 p-3 rounded-xl glass"
                  >
                    <img
                      src={show.poster}
                      alt={show.title}
                      className="w-[80px] h-[120px] rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white line-clamp-1">{show.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">Watched 2 days ago</p>
                      <div className="flex items-center gap-2 mt-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-600/20 text-accent-400 text-xs"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Resume
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'ratings' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ratings.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl glass"
                  >
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-[60px] md:w-[80px] rounded-lg object-cover aspect-[2/3]"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/movie/${movie.id}`}>
                        <h3 className="font-semibold text-white hover:text-accent-400 transition-colors">
                          {movie.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{movie.year}</p>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">9</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
