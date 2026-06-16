import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Menu, X, User, Film, Tv, Home, Compass,
  Bookmark, ChevronDown
} from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/?section=movies', label: 'Movies', icon: Film, isSection: true },
    { path: '/?section=series', label: 'Series', icon: Tv, isSection: true },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/watchlist', label: 'Watchlist', icon: Bookmark },
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
                  <span className="text-white font-display text-lg">S</span>
                </motion.div>
                <span className="hidden sm:block text-xl font-bold text-white group-hover:text-accent-400 transition-colors">
                  Streamira
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-white bg-dark-800/50'
                        : 'text-gray-400 hover:text-white hover:bg-dark-800/30'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-lg bg-dark-800/50 hover:bg-dark-700/50 text-gray-400 hover:text-white transition-all"
              >
                <Search className="w-5 h-5" />
              </motion.button>

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
                  <div className="glass rounded-xl py-2 min-w-[180px] shadow-xl">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Profile</span>
                    </Link>
                    <Link
                      to="/watchlist"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span className="text-sm">Watchlist</span>
                    </Link>
                    <div className="h-px bg-dark-700 my-2" />
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-accent-400 hover:text-accent-300 hover:bg-dark-700/50 transition-colors"
                    >
                      <Film className="w-4 h-4" />
                      <span className="text-sm">Admin Panel</span>
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

      {/* Full Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark-900/95 backdrop-blur-xl"
          >
            <div className="max-w-3xl mx-auto px-4 pt-20">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, series, actors..."
                    autoFocus
                    className="w-full bg-dark-800 border border-dark-700 rounded-2xl py-4 pl-6 pr-14 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
                  />
                </form>

                <div className="mt-6 text-center text-gray-400">
                  <p className="text-sm">Press Enter to search or</p>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="text-accent-400 hover:text-accent-300 text-sm mt-1"
                  >
                    Press ESC to close
                  </button>
                </div>
              </motion.div>

              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-6 left-6 p-2 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
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
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === item.path
                      ? 'text-white bg-accent-600/20'
                      : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
