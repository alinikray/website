import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film, Tv, Users, Video, BarChart3, TrendingUp,
  Play, Edit2, Trash2, Plus, Search, Download,
  Clock, Eye, Heart, Bookmark, ChevronRight
} from 'lucide-react';
import { movies, series, clips } from '../data/mockData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'series' | 'clips' | 'users'>('overview');

  const stats = [
    { label: 'Total Movies', value: movies.length, icon: Film, color: 'accent' },
    { label: 'Total Series', value: series.length, icon: Tv, color: 'blue' },
    { label: 'Total Clips', value: clips.length, icon: Video, color: 'purple' },
    { label: 'Total Users', value: '12.4K', icon: Users, color: 'green' },
  ];

  const overviewCards = [
    { label: 'Views Today', value: '45.2K', change: '+12%', icon: Eye, positive: true },
    { label: 'Watch Hours', value: '3.4K', change: '+8%', icon: Clock, positive: true },
    { label: 'New Users', value: '234', change: '+15%', icon: Users, positive: true },
    { label: 'Churn Rate', value: '2.3%', change: '-0.5%', icon: TrendingUp, positive: true },
    { label: 'Total Likes', value: '185K', change: '+20%', icon: Heart, positive: true },
    { label: 'Watchlists', value: '12.8K', change: '+18%', icon: Bookmark, positive: true },
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 pt-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your streaming platform</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Content
          </motion.button>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {(['overview', 'movies', 'series', 'clips', 'users'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-accent-600 text-white'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'overview' && <BarChart3 className="w-4 h-4" />}
              {tab === 'movies' && <Film className="w-4 h-4" />}
              {tab === 'series' && <Tv className="w-4 h-4" />}
              {tab === 'clips' && <Video className="w-4 h-4" />}
              {tab === 'users' && <Users className="w-4 h-4" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-4 md:p-6"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      stat.color === 'accent' ? 'bg-accent-600/20 text-accent-400' :
                      stat.color === 'blue' ? 'bg-blue-600/20 text-blue-400' :
                      stat.color === 'purple' ? 'bg-purple-600/20 text-purple-400' :
                      'bg-green-600/20 text-green-400'
                    }`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {overviewCards.map((card, index) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <card.icon className="w-5 h-5 text-gray-500" />
                      <span className={`text-xs font-medium ${
                        card.positive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {card.change}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-white">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity Chart Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Streaming Activity (7 Days)</h3>
                <div className="h-[200px] flex items-end gap-2">
                  {[65, 45, 80, 55, 90, 70, 85].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-accent-600 to-accent-400 rounded-t-lg"
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>Sat</span>
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                </div>
              </motion.div>

              {/* Top Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Top Movies</h3>
                  <div className="space-y-3">
                    {movies.slice(0, 4).map((movie, index) => (
                      <div key={movie.id} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-accent-600/20 text-accent-400 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <img src={movie.poster} alt={movie.title} className="w-10 h-14 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{movie.title}</p>
                          <p className="text-xs text-gray-500">{movie.rating} rating</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Top Series</h3>
                  <div className="space-y-3">
                    {series.slice(0, 4).map((show, index) => (
                      <div key={show.id} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-accent-600/20 text-accent-400 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <img src={show.poster} alt={show.title} className="w-10 h-14 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{show.title}</p>
                          <p className="text-xs text-gray-500">{show.rating} rating</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'movies' && (
            <motion.div
              key="movies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Search Bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search movies..."
                    className="w-full input-field pr-10"
                  />
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary">
                  <Download className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Table */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-dark-800/50">
                      <tr className="text-right">
                        <th className="px-4 py-3 text-gray-400 font-medium">Movie</th>
                        <th className="px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Year</th>
                        <th className="px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Rating</th>
                        <th className="px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Duration</th>
                        <th className="px-4 py-3 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                      {movies.map((movie) => (
                        <tr key={movie.id} className="hover:bg-dark-800/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={movie.poster} alt={movie.title} className="w-10 h-14 rounded object-cover" />
                              <div>
                                <p className="text-white font-medium">{movie.title}</p>
                                <p className="text-xs text-gray-500">{movie.titlePersian}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{movie.year}</td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="flex items-center gap-1 text-yellow-400">
                              <span className="w-4 h-4 fill-current">★</span>
                              {movie.rating}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{movie.duration} min</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white transition-colors">
                                <Play className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-blue-400 transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'series' && (
            <motion.div
              key="series"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* The series section would have similar tables */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" placeholder="Search series..." className="w-full input-field pr-10" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {series.map((show, index) => (
                  <motion.div
                    key={show.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-xl overflow-hidden"
                  >
                    <div className="relative aspect-video">
                      <img src={show.backdrop} alt={show.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <h3 className="text-white font-semibold">{show.title}</h3>
                        <p className="text-xs text-gray-400">{show.seasons.length} Seasons • {show.rating} ★</p>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded ${
                        show.status === 'ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {show.status}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'clips' && (
            <motion.div
              key="clips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {clips.map((clip, index) => (
                  <motion.div
                    key={clip.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-xl overflow-hidden group"
                  >
                    <div className="relative aspect-[9/16]">
                      <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                      <div className="absolute top-2 right-2 px-2 py-1 rounded glass text-white text-xs">
                        0:{clip.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-10 h-10 text-white fill-current" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-white line-clamp-2">{clip.title}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{Math.floor(clip.likes / 1000)}K likes</span>
                        <span>{Math.floor(clip.shares / 1000)}K shares</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-xl overflow-hidden flex items-center justify-center aspect-[9/16] border-2 border-dashed border-dark-700 hover:border-dark-600 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <Plus className="w-8 h-8 text-gray-600 mx-auto" />
                    <p className="text-sm text-gray-600 mt-2">Add Clip</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">User Analytics</h3>
                  <select className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Active Users', value: '8.2K' },
                    { label: 'New Signups', value: '234' },
                    { label: 'Subscriptions', value: '5.8K' },
                    { label: 'Churn Rate', value: '2.3%' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-dark-800/50 rounded-lg p-4 text-center"
                    >
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 text-center text-gray-500 text-sm">
                  <p>Full user management features coming soon...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
