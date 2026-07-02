import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Menu, X, User, Film, Tv, Home, Compass,
  Bookmark, ChevronDown, Crown, Settings, LogIn,
  Bell, Clock, TrendingUp, Star
} from 'lucide-react';

const trendingSearches = ['The Golden Cage', 'Night Watch', 'Shahrazad', 'Asghar Farhadi', 'Desert Wind'];
const recentSearches = ['The Capital', 'Leila Hatami', 'Iranian Drama'];
const searchCategories = ['Movies', 'Series', 'Actors'];

const mockNotifications = [
  { id: 1, text: 'Night Watch is now available in 4K', time: '2h ago', unread: true },
  { id: 2, text: 'New episode of The Capital added', time: '1d ago', unread: true },
  { id: 3, text: 'Your watchlist item "Desert Wind" is trending', time: '2d ago', unread: false },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('Movies');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsSearchOpen(false); setShowNotifications(false); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsSearchOpen(true); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchCategory.toLowerCase()}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleTrendingClick = (term: string) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setIsSearchOpen(false);
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/search')) return location.pathname === '/search';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/movies', label: 'Movies', icon: Film },
    { path: '/series', label: 'Series', icon: Tv },
    { path: '/explore', label: 'Explore', icon: Compass, highlight: true },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-dark-900/95 backdrop-blur-xl shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-dark-900/80 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-4 md:gap-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/30"
                >
                  <span className="text-white font-display text-lg">F</span>
                </motion.div>
                <span className="hidden sm:block text-xl font-bold text-white group-hover:text-accent-400 transition-colors">
                  Fynex Movies
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  const isExplore = item.highlight;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? isExplore
                            ? 'text-white bg-accent-600'
                            : 'text-white bg-dark-800/70'
                          : isExplore
                            ? 'text-accent-400 hover:text-white hover:bg-accent-600/30'
                            : 'text-gray-400 hover:text-white hover:bg-dark-800/30'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      {isExplore && !active && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Subscription Badge */}
              <Link
                to="/subscription"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:from-amber-500/30 hover:to-orange-500/30 transition-all"
              >
                <Crown className="w-3.5 h-3.5" />
                Premium
              </Link>

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-lg bg-dark-800/50 hover:bg-dark-700/50 text-gray-400 hover:text-white transition-all"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Notification Bell */}
              <div ref={notifRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(v => !v)}
                  className="relative p-2.5 rounded-lg bg-dark-800/50 hover:bg-dark-700/50 text-gray-400 hover:text-white transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-accent-600 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                      {unreadCount}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl shadow-xl overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700">
                        <span className="text-sm font-semibold text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-accent-400 hover:text-accent-300 transition-colors">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="divide-y divide-dark-800">
                        {notifications.map(n => (
                          <div key={n.id} className={`px-4 py-3 flex items-start gap-3 ${n.unread ? 'bg-accent-600/5' : ''}`}>
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-accent-500' : 'bg-dark-600'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-300 leading-snug">{n.text}</p>
                              <p className="text-xs text-gray-600 mt-0.5">{n.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {notifications.length === 0 && (
                        <div className="py-8 text-center text-gray-500 text-sm">No notifications</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-lg bg-dark-800/50 hover:bg-dark-700/50 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </motion.button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                  <div className="glass rounded-xl py-2 min-w-[200px] shadow-xl">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Profile</span>
                    </Link>
                    <Link to="/watchlist" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors">
                      <Bookmark className="w-4 h-4" />
                      <span className="text-sm">Watchlist</span>
                    </Link>
                    <Link to="/support" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Support</span>
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </Link>
                    <Link to="/subscription" className="flex items-center gap-3 px-4 py-2.5 text-amber-400 hover:text-amber-300 hover:bg-dark-700/50 transition-colors">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm">Upgrade to Premium</span>
                    </Link>
                    <div className="h-px bg-dark-700 my-2" />
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-accent-400 hover:text-accent-300 hover:bg-dark-700/50 transition-colors">
                      <Film className="w-4 h-4" />
                      <span className="text-sm">Admin Panel</span>
                    </Link>
                    <div className="h-px bg-dark-700 my-2" />
                    <Link to="/auth" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors">
                      <LogIn className="w-4 h-4" />
                      <span className="text-sm">Sign In / Register</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-lg bg-dark-800/50 text-gray-400 hover:text-white transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Premium Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark-900/98 backdrop-blur-xl"
          >
            <div className="max-w-3xl mx-auto px-4 pt-16 md:pt-24">
              {/* Close button */}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.05 }}
              >
                {/* Category tabs */}
                <div className="flex items-center gap-2 mb-4">
                  {searchCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSearchCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        searchCategory === cat
                          ? 'bg-accent-600 text-white'
                          : 'glass text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search input */}
                <form onSubmit={handleSearch} className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${searchCategory.toLowerCase()}...`}
                    autoFocus
                    className="w-full bg-dark-800 border border-dark-700 rounded-2xl py-4 pl-14 pr-14 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </form>

                {/* Instant suggestions when typing */}
                {searchQuery.length > 1 && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl mb-6 overflow-hidden">
                    {['The Last Stand', 'The Capital', 'The Golden Cage'].filter(t => t.toLowerCase().includes(searchQuery.toLowerCase())).map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => handleTrendingClick(suggestion)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors text-sm text-left"
                      >
                        <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}

                {!searchQuery && (
                  <div className="space-y-6">
                    {/* Trending */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-accent-400" />
                        <span className="text-sm font-semibold text-white">Trending Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map(term => (
                          <button
                            key={term}
                            onClick={() => handleTrendingClick(term)}
                            className="px-4 py-2 rounded-full glass text-sm text-gray-300 hover:text-white hover:border-accent-500/30 transition-all"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-white">Recent Searches</span>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map(term => (
                          <button
                            key={term}
                            onClick={() => handleTrendingClick(term)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-800 transition-all text-sm text-left"
                          >
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-center text-gray-600 text-xs mt-6">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700 text-gray-400 text-xs">Enter</kbd> to search · <kbd className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700 text-gray-400 text-xs">Esc</kbd> to close
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-dark-900/95 backdrop-blur-xl border-t border-dark-800"
          >
            <nav className="py-4 px-4 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const isExplore = item.highlight;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? 'text-white bg-accent-600/20 border border-accent-500/20'
                        : isExplore
                          ? 'text-accent-400 hover:bg-accent-600/20'
                          : 'text-gray-400 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isExplore && !active && (
                      <span className="ml-auto px-2 py-0.5 rounded-full bg-accent-600/30 text-accent-400 text-xs">New</span>
                    )}
                  </Link>
                );
              })}
              <div className="h-px bg-dark-800 my-2" />
              <Link to="/subscription" className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-400 hover:bg-amber-500/10 transition-all">
                <Crown className="w-5 h-5" />
                <span className="font-medium">Premium Plans</span>
              </Link>
              <Link to="/support" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800 transition-all">
                <Bell className="w-5 h-5" />
                <span className="font-medium">Support</span>
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800 transition-all">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
              <Link to="/auth" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800 transition-all">
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Sign In / Register</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
