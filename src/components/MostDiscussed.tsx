import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, TrendingUp, Flame, Star, Users } from 'lucide-react';
import { movies, series } from '../data/mockData';

const discussedContent = [
  { ...movies[4], comments: 2341, trend: '+890 today', hot: true },
  { ...movies[0], comments: 1876, trend: '+540 today', hot: true },
  { ...movies[1], comments: 1234, trend: '+320 today', hot: false },
  { ...series[0], comments: 3102, trend: '+1.2K today', hot: true },
  { ...movies[7], comments: 987, trend: '+210 today', hot: false },
  { ...series[1], comments: 876, trend: '+180 today', hot: false },
];

export default function MostDiscussed() {
  return (
    <section className="px-4 sm:px-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <MessageSquare className="w-5 h-5 text-accent-400" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Most Discussed</h2>
          </div>
          <p className="text-sm text-gray-500">پربحث‌ترین‌ها</p>
        </div>
        <Link to="/search?sort=discussed" className="flex items-center gap-1 text-sm text-accent-400 hover:text-accent-300 transition-colors">
          See All
          <TrendingUp className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {discussedContent.map((item, index) => {
          const isMovie = 'duration' in item;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <Link to={`/${isMovie ? 'movie' : 'series'}/${item.id}`}>
                <div className="glass rounded-2xl overflow-hidden group hover:border-accent-500/30 transition-all">
                  {/* Backdrop */}
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={item.backdrop}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                    {item.hot && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/90 text-white text-xs font-bold">
                        <Flame className="w-3 h-3" />
                        Hot
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 -mt-4 relative">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-12 h-16 rounded-lg object-cover flex-shrink-0 shadow-lg -mt-8 ring-2 ring-dark-900"
                      />
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-accent-400 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />{item.rating}
                          </span>
                          <span>{item.year}</span>
                        </div>
                      </div>
                    </div>

                    {/* Discussion stats */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-700/50">
                      <div className="flex items-center gap-1.5 text-sm">
                        <MessageSquare className="w-4 h-4 text-accent-400" />
                        <span className="text-white font-semibold">{item.comments.toLocaleString()}</span>
                        <span className="text-gray-500 text-xs">comments</span>
                      </div>
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {item.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
