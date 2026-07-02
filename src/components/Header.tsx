import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Menu, X, User, Film, Tv, Home, Compass,
  Bookmark, ChevronDown, Crown, Settings, LogIn,
  Bell, Clock, TrendingUp, Star, Trophy, Award,
  List, Globe, ChevronRight
} from 'lucide-react';

const trendingSearches = ['The Golden Cage', 'Night Watch', 'Shahrazad', 'Asghar Farhadi', 'Desert Wind'];
const recentSearches = ['The Capital', 'Leila Hatami', 'Iranian Drama'];
const searchCategories = ['Movies', 'Series', 'Actors'];

const mockNotifications = [
  { id: 1, text: 'Night Watch is now available in 4K', time: '2h ago', unread: true },
  { id: 2, text: 'New episode of The Capital added', time: '1d ago', unread: true },
  { id: 3, text: 'Your watchlist item "Desert Wind" is trending', time: '2d ago', unread: false },
];

// ─── Mega Menu data ───────────────────────────────────────────────────────────

const megaMenuColumns = [
  {
    heading: 'بخش‌ها',
    headingEn: 'Sections',
    items: [
      { label: 'فیلم‌ها', labelEn: 'Movies', path: '/movies', icon: Film },
      { label: 'سریال‌ها', labelEn: 'Series', path: '/series', icon: Tv },
      { label: 'باکس آفیس', labelEn: 'Box Office', path: '/movies?sort=box_office', icon: Trophy },
      { label: 'برندگان اسکار', labelEn: 'Oscar Winners', path: '/movies?sort=oscar', icon: Award },
    ],
  },
  {
    heading: 'ژانر فیلم',
    headingEn: 'Movie Genres',
    items: [
      { label: 'اکشن', labelEn: 'Action', path: '/movies?genre=Action', icon: Film },
      { label: 'درام', labelEn: 'Drama', path: '/movies?genre=Drama', icon: Film },
      { label: 'انیمیشن', labelEn: 'Animation', path: '/movies?genre=Animation', icon: Film },
      { label: 'فیلم هندی', labelEn: 'Bollywood', path: '/movies?genre=Bollywood', icon: Globe },
      { label: 'لیست کاربران', labelEn: 'User Lists', path: '/watchlist', icon: List },
    ],
  },
  {
    heading: 'ژانر سریال',
    headingEn: 'Series Genres',
    items: [
      { label: '۲۵۰ سریال برتر', labelEn: 'Top 250 Series', path: '/series?sort=top', icon: Star },
      { label: '۲۵۰ فیلم برتر', labelEn: 'Top 250 Movies', path: '/movies?sort=top', icon: Star },
      { label: 'سریال دوبله', labelEn: 'Dubbed Series', path: '/series?lang=fa', icon: Tv },
      { label: 'سریال کره‌ای', labelEn: 'Korean Series', path: '/series?country=KR', icon: Globe },
    ],
  },
];

// ─── MegaMenu component ───────────────────────────────────────────────────────

function MegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] z-50"
      style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.6))' }}
    >
      {/* Arrow indicator */}
      <div className="flex justify-center mb-[-1px] relative z-10">
        <div className="w-3 h-3 rotate-45 bg-[#0d0e16] border-t border-l border-violet-500/20" />
      </div>

      <div
        className="rounded-2xl overflow-hidden border border-violet-500/20"
        style={{ background: '#0d0e16' }}
      >
        {/* Top accent bar */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

        <div className="grid grid-cols-3 divide-x divide-white/5 p-6 gap-0">
          {megaMenuColumns.map((col, colIdx) => (
            <div
              key={col.heading}
              className={`${colIdx === 0 ? 'pr-6' : colIdx === 1 ? 'px-6' : 'pl-6'}`}
            >
              {/* Column heading */}
              <div className="mb-4">
                <p
                  className="text-[11px] font-semibold tracking-widest uppercase text-violet-400/70 mb-0.5"
                  style={{ direction: 'rtl' }}
                >
                  {col.heading}
                </p>
                <p className="text-[10px] text-gray-600 tracking-wider">{col.headingEn}</p>
              </div>

              {/* Items */}
              <ul className="space-y-0.5">
                {col.items.map((item, itemIdx) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + colIdx * 0.04 + itemIdx * 0.03, duration: 0.15 }}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className="group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-violet-500/10 hover:border-violet-500/20 border border-transparent"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-violet-500/20 flex items-center justify-center flex-shrink-0 transition-colors duration-150">
                          <item.icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-violet-400 transition-colors duration-150" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-150 leading-tight truncate"
                            style={{ direction: 'rtl' }}
                          >
                            {item.label}
                          </p>
                          <p className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors duration-150 leading-tight mt-0.5">
                            {item.labelEn}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-violet-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-x-1 group-hover:translate-x-0" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer bar */}
        <div className="border-t border-white/5 px-6 py-3 flex items-center justify-between bg-white/[0.02]">
          <p className="text-xs text-gray-600">Fynex Movies · فینکس موویز</p>
          <Link
            to="/movies"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
          >
            Browse all content
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Mobile Mega Menu (expandable) ───────────────────────────────────────────

function MobileMegaMenu({ onClose }: { onClose: () => void }) {
  const [openCol, setOpenCol] = useState<number | null>(null);

  return (
    <div className="border-t border-violet-500/10 mt-1 pt-2">
      {megaMenuColumns.map((col, colIdx) => (
        <div key={col.heading} className="mb-1">
          <button
            onClick={() => setOpenCol(openCol === colIdx ? null : colIdx)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <span
              className="text-sm font-semibold text-violet-300"
              style={{ direction: 'rtl' }}
            >
              {col.heading}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openCol === colIdx ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {openCol === colIdx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pl-4 pr-2 pb-2 space-y-0.5">
                  {col.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-violet-500/10 transition-all"
                    >
                      <item.icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span
                        className="text-sm font-medium flex-1"
                        style={{ direction: 'rtl' }}
                      >
                        {item.label}
                      </span>
                      <span className="text-[10px] text-gray-600">{item.labelEn}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('Movies');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMegaOpen, setIsMobileMegaOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaHoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setIsMegaMenuOpen(false);
    setIsMobileMegaOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setShowNotifications(false);
        setIsMegaMenuOpen(false);
      }
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
    return location.pathname.startsWith(path.split('?')[0]);
  };

  const handleMoviesMouseEnter = () => {
    if (megaHoverTimeout.current) clearTimeout(megaHoverTimeout.current);
    setIsMegaMenuOpen(true);
  };

  const handleMoviesMouseLeave = () => {
    megaHoverTimeout.current = setTimeout(() => setIsMegaMenuOpen(false), 120);
  };

  const handleMegaMenuMouseEnter = () => {
    if (megaHoverTimeout.current) clearTimeout(megaHoverTimeout.current);
  };

  const handleMegaMenuMouseLeave = () => {
    megaHoverTimeout.current = setTimeout(() => setIsMegaMenuOpen(false), 120);
  };

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
                {/* Home */}
                <Link
                  to="/"
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/') && location.pathname === '/'
                      ? 'text-white bg-dark-800/70'
                      : 'text-gray-400 hover:text-white hover:bg-dark-800/30'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>

                {/* Movies — with mega menu trigger */}
                <div
                  ref={megaMenuRef}
                  className="relative"
                  onMouseEnter={handleMoviesMouseEnter}
                  onMouseLeave={handleMoviesMouseLeave}
                >
                  <Link
                    to="/movies"
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 select-none ${
                      isActive('/movies')
                        ? 'text-white bg-dark-800/70'
                        : 'text-gray-400 hover:text-white hover:bg-dark-800/30'
                    } ${isMegaMenuOpen ? 'text-white bg-dark-800/50' : ''}`}
                  >
                    <Film className="w-4 h-4" />
                    Movies
                    <ChevronDown
                      className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-violet-400' : 'text-gray-600'}`}
                    />
                  </Link>

                  {/* Mega Menu (desktop) */}
                  <div
                    onMouseEnter={handleMegaMenuMouseEnter}
                    onMouseLeave={handleMegaMenuMouseLeave}
                  >
                    <AnimatePresence>
                      {isMegaMenuOpen && (
                        <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Series */}
                <Link
                  to="/series"
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/series')
                      ? 'text-white bg-dark-800/70'
                      : 'text-gray-400 hover:text-white hover:bg-dark-800/30'
                  }`}
                >
                  <Tv className="w-4 h-4" />
                  Series
                </Link>

                {/* Explore */}
                <Link
                  to="/explore"
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/explore')
                      ? 'text-white bg-accent-600'
                      : 'text-accent-400 hover:text-white hover:bg-accent-600/30'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Explore
                  {!isActive('/explore') && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                  )}
                </Link>
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
              {/* Home */}
              <Link
                to="/"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === '/'
                    ? 'text-white bg-accent-600/20 border border-accent-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>

              {/* Movies with mobile mega menu toggle */}
              <div>
                <button
                  onClick={() => setIsMobileMegaOpen(v => !v)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive('/movies')
                      ? 'text-white bg-accent-600/20 border border-accent-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <Film className="w-5 h-5" />
                  <span className="font-medium flex-1 text-left">Movies</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isMobileMegaOpen ? 'rotate-180 text-violet-400' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isMobileMegaOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <MobileMegaMenu onClose={() => { setIsMobileMegaOpen(false); setIsMobileMenuOpen(false); }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Series */}
              <Link
                to="/series"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive('/series')
                    ? 'text-white bg-accent-600/20 border border-accent-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                <Tv className="w-5 h-5" />
                <span className="font-medium">Series</span>
              </Link>

              {/* Explore */}
              <Link
                to="/explore"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive('/explore')
                    ? 'text-white bg-accent-600/20 border border-accent-500/20'
                    : 'text-accent-400 hover:bg-accent-600/20'
                }`}
              >
                <Compass className="w-5 h-5" />
                <span className="font-medium">Explore</span>
                {!isActive('/explore') && (
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-accent-600/30 text-accent-400 text-xs">New</span>
                )}
              </Link>

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
