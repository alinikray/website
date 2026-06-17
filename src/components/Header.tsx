import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, Menu, X, Settings, LogOut, Circle as HelpCircle, Film, Tv, TrendingUp, Clock, Flame } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/series', label: 'Series' },
];

const trendingSearches = ['Oppenheimer', 'Dune: Part Two', 'The Batman 2', 'Avatar 3'];
const recentSearches = ['Inception', 'Breaking Bad', 'Stranger Things'];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'movies' | 'series'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'New Episode Available', message: 'Stranger Things S5E3 is now streaming', time: '2 min ago', unread: true },
    { id: 2, title: 'Movie Added to Watchlist', message: 'Dune: Part Two was added successfully', time: '1 hour ago', unread: true },
    { id: 3, title: 'Weekly Recommendations', message: "Check out this week's top picks", time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${activeCategory}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/20">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-surface-300 bg-clip-text text-transparent">
                  Fynex Movies
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800/50 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-800/50 hover:bg-surface-800 border border-surface-700/50 transition-all"
              >
                <Search className="w-4 h-4 text-surface-400" />
                <span className="text-surface-400 text-sm hidden sm:inline">Search...</span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-surface-700/50 text-surface-500">
                  <span>⌘</span>K
                </kbd>
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 rounded-lg hover:bg-surface-800/50 transition-colors"
                >
                  <Bell className="w-5 h-5 text-surface-400" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent-500 text-[10px] font-medium flex items-center justify-center text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-surface-900 border border-surface-800 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-surface-800 flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        <button className="text-xs text-accent-400 hover:text-accent-300">Mark all read</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map(notif => (
                          <div
                            key={notif.id}
                            className={`p-3 hover:bg-surface-800/50 cursor-pointer border-l-2 ${
                              notif.unread ? 'border-accent-500 bg-surface-800/30' : 'border-transparent'
                            }`}
                          >
                            <p className="font-medium text-sm">{notif.title}</p>
                            <p className="text-xs text-surface-400 mt-0.5">{notif.message}</p>
                            <p className="text-xs text-surface-500 mt-1">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 border-t border-surface-800">
                        <button className="w-full text-center text-sm text-accent-400 hover:text-accent-300 py-1">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-800/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-surface-900 border border-surface-800 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-surface-800">
                        <p className="font-medium">John Doe</p>
                        <p className="text-xs text-surface-400">john@example.com</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-surface-800/50 text-surface-300"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-surface-800/50 text-surface-300"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <Link
                          to="/support"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-surface-800/50 text-surface-300"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Support</span>
                        </Link>
                      </div>
                      <div className="border-t border-surface-800 py-1">
                        <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-surface-800/50 text-red-400">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-surface-800/50"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <nav className="py-4 space-y-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-2 rounded-lg text-surface-300 hover:bg-surface-800/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-surface-950/95 backdrop-blur-xl"
            onClick={() => setIsSearchOpen(false)}
          >
            <div className="max-w-3xl mx-auto pt-20 px-4" onClick={e => e.stopPropagation()}>
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search movies, series, actors..."
                    className="w-full pl-12 pr-12 py-4 bg-surface-800/50 border border-surface-700 rounded-2xl text-lg focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-surface-700"
                  >
                    <X className="w-5 h-5 text-surface-400" />
                  </button>
                </div>

                <div className="flex gap-2 mt-4 px-1">
                  {(['all', 'movies', 'series'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeCategory === cat
                          ? 'bg-accent-500 text-white'
                          : 'bg-surface-800/50 text-surface-400 hover:bg-surface-800'
                      }`}
                    >
                      {cat === 'all' && 'All'}
                      {cat === 'movies' && (
                        <span className="flex items-center gap-1.5">
                          <Film className="w-4 h-4" /> Movies
                        </span>
                      )}
                      {cat === 'series' && (
                        <span className="flex items-center gap-1.5">
                          <Tv className="w-4 h-4" /> Series
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </form>

              {searchQuery.length === 0 && (
                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-surface-500 mb-3">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-medium">Trending</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map(term => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            navigate(`/search?q=${encodeURIComponent(term)}&category=${activeCategory}`);
                            setIsSearchOpen(false);
                          }}
                          className="px-3 py-1.5 bg-surface-800/50 hover:bg-surface-800 rounded-lg text-sm text-surface-300 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-surface-500 mb-3">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Recent Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map(term => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-1.5 bg-surface-800/50 hover:bg-surface-800 rounded-lg text-sm text-surface-300 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {searchQuery.length > 0 && (
                <div className="mt-4 bg-surface-800/30 rounded-xl border border-surface-700/50 overflow-hidden">
                  <div className="p-3 text-surface-400 text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Press Enter to search for "{searchQuery}"
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
