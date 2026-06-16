import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Heart, Bookmark, Share2,
  Volume2, VolumeX, Star, Clock, X,
  TrendingUp, Eye, Users, ChevronDown, ChevronUp, Info,
  MessageCircle, ThumbsUp, Send
} from 'lucide-react';
import { clips, movies } from '../data/mockData';
import { Movie, Series } from '../types';

const discoveryHooks: Record<string, string> = {
  'clip-1': 'The ending shocked millions of viewers',
  'clip-2': 'One of the most underrated thrillers ever made',
  'clip-3': 'This scene changed the entire story',
  'clip-4': 'If you loved Parasite, watch this next',
  'clip-5': 'The movie nobody expected to become a masterpiece',
  'clip-6': 'You will cry at this scene — guaranteed',
};

const socialProof: Record<string, { views: string; completion: number; trendingRank?: number }> = {
  'clip-1': { views: '1.2M', completion: 87, trendingRank: 3 },
  'clip-2': { views: '890K', completion: 79, trendingRank: 7 },
  'clip-3': { views: '2.1M', completion: 92, trendingRank: 1 },
  'clip-4': { views: '445K', completion: 74 },
  'clip-5': { views: '3.4M', completion: 95, trendingRank: 2 },
  'clip-6': { views: '678K', completion: 81, trendingRank: 5 },
};

export default function ExplorePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState<Record<string, boolean>>({});
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});
  const [isNavigating, setIsNavigating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);

  const allClips = clips;

  const navigate = useCallback((direction: 'up' | 'down') => {
    if (isNavigating) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 600) return;
    lastScrollTime.current = now;

    setIsNavigating(true);
    if (direction === 'down' && currentIndex < allClips.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    setTimeout(() => setIsNavigating(false), 600);
  }, [currentIndex, allClips.length, isNavigating]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) navigate('down');
      else if (e.deltaY < -30) navigate('up');
    };
    const container = containerRef.current;
    container?.addEventListener('wheel', handleWheel, { passive: false });
    return () => container?.removeEventListener('wheel', handleWheel);
  }, [navigate]);

  useEffect(() => {
    // Touch support
    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) navigate(diff > 0 ? 'down' : 'up');
    };
    const container = containerRef.current;
    container?.addEventListener('touchstart', handleTouchStart);
    container?.addEventListener('touchend', handleTouchEnd);
    return () => {
      container?.removeEventListener('touchstart', handleTouchStart);
      container?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') navigate('down');
    else if (e.key === 'ArrowUp') navigate('up');
    else if (e.key === 'Escape') { setShowInfoSheet(false); setShowComments(false); }
  };

  const currentClip = allClips[currentIndex];
  const content: Movie | Series | undefined = currentClip
    ? movies.find(m => m.id === currentClip.movieId)
    : undefined;

  const hook = currentClip ? discoveryHooks[currentClip.id] : '';
  const proof = currentClip ? socialProof[currentClip.id] : null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const mockComments = [
    { id: 1, name: 'Reza M.', avatar: 'RM', text: 'This clip is absolutely incredible. The cinematography is on another level!', likes: 142, time: '2h ago' },
    { id: 2, name: 'Sara K.', avatar: 'SK', text: 'I watched the full movie after seeing this. Totally worth it.', likes: 89, time: '4h ago' },
    { id: 3, name: 'Ali H.', avatar: 'AH', text: 'Best Iranian film of the decade. Pure masterpiece.', likes: 67, time: '1d ago' },
    { id: 4, name: 'Mina R.', avatar: 'MR', text: 'The acting in this scene gave me chills. Incredible work.', likes: 34, time: '2d ago' },
  ];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 top-16 md:top-20 bg-black focus:outline-none overflow-hidden flex items-center justify-center"
    >
      {/* Desktop: constrain to max 700px centered */}
      <div className="relative w-full md:max-w-[700px] h-full">
      {/* Full-screen clip feed */}
      <AnimatePresence mode="wait">
        {currentClip && (
          <motion.div
            key={currentIndex}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="absolute inset-0"
          >
            {/* Background image — full viewport fill */}
            <div className="absolute inset-0">
              <img
                src={currentClip.thumbnail}
                alt={currentClip.title}
                className="w-full h-full object-cover"
              />
              {/* Cinematic gradient layers */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
            </div>

            {/* TOP BAR */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMuted(m => !m)}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </motion.button>

              <div className="flex items-center gap-2">
                {proof?.trendingRank && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/90 text-white text-xs font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Trending #{proof.trendingRank}
                  </span>
                )}
                <span className="px-3 py-1.5 rounded-full glass text-white text-xs font-medium">
                  0:{currentClip.duration}s
                </span>
              </div>
            </div>

            {/* CENTER PLAY */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pointer-events-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl"
                >
                  <Play className="w-9 h-9 text-white fill-current ml-1" />
                </motion.button>
              </motion.div>
            </div>

            {/* BOTTOM CONTENT AREA */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6 pb-6">
              <div className="flex items-end gap-4">
                {/* Left: Hook + info */}
                <div className="flex-1 min-w-0">
                  {/* Discovery hook — primary text */}
                  {hook && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mb-3"
                    >
                      <p className="text-white text-lg md:text-xl font-bold leading-snug text-shadow-lg max-w-md">
                        "{hook}"
                      </p>
                    </motion.div>
                  )}

                  {/* Social proof row */}
                  {proof && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="flex flex-wrap items-center gap-3 mb-4"
                    >
                      <span className="flex items-center gap-1.5 text-gray-300 text-sm">
                        <Eye className="w-4 h-4 text-accent-400" />
                        <span className="font-semibold text-white">{proof.views}</span> views
                      </span>
                      <span className="text-gray-600">·</span>
                      <span className="flex items-center gap-1.5 text-gray-300 text-sm">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="font-semibold text-green-400">{proof.completion}%</span> finished
                      </span>
                    </motion.div>
                  )}

                  {/* Movie info row */}
                  {content && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={content.poster}
                        alt={content.title}
                        className="w-12 h-16 rounded-lg object-cover shadow-lg flex-shrink-0 ring-1 ring-white/20"
                      />
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                          {'duration' in content ? 'Movie' : 'Series'}
                        </p>
                        <h3 className="text-white font-semibold text-base leading-tight">{content.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-yellow-400 font-medium">{content.rating}</span>
                          <span>·</span>
                          <span>{content.year}</span>
                          {'duration' in content && (
                            <>
                              <span>·</span>
                              <Clock className="w-3 h-3" />
                              <span>{Math.floor((content as Movie).duration / 60)}h {(content as Movie).duration % 60}m</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowInfoSheet(true)}
                        className="ml-1 p-2 rounded-full glass text-gray-300 hover:text-white flex-shrink-0"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 mt-4"
                  >
                    {content && (
                      <Link
                        to={`/movie/${content.id}`}
                        className="flex items-center gap-2 bg-accent-600 hover:bg-accent-500 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-lg shadow-accent-500/30 text-sm"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Watch Full Movie
                      </Link>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsSaved(prev => ({ ...prev, [currentClip.id]: !prev[currentClip.id] }))}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        isSaved[currentClip.id]
                          ? 'bg-accent-600/30 text-accent-400 border border-accent-500/50'
                          : 'glass text-gray-300 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved[currentClip.id] ? 'fill-current' : ''}`} />
                      {isSaved[currentClip.id] ? 'Saved' : 'Watchlist'}
                    </motion.button>
                  </motion.div>
                </div>

                {/* Right: Action buttons column */}
                <div className="flex flex-col items-center gap-5 flex-shrink-0">
                  <ActionButton
                    icon={Heart}
                    label={formatNumber(currentClip.likes + (isLiked[currentClip.id] ? 1 : 0))}
                    isActive={isLiked[currentClip.id]}
                    activeColor="text-red-400"
                    activeBg="bg-red-500/20"
                    onClick={() => setIsLiked(prev => ({ ...prev, [currentClip.id]: !prev[currentClip.id] }))}
                    fillOnActive
                  />
                  <ActionButton
                    icon={MessageCircle}
                    label="Comments"
                    onClick={() => { setShowComments(true); setShowInfoSheet(false); }}
                    activeColor="text-accent-400"
                    activeBg="bg-accent-500/20"
                  />
                  <ActionButton
                    icon={Share2}
                    label={formatNumber(currentClip.shares)}
                    onClick={() => {}}
                    activeColor="text-blue-400"
                    activeBg="bg-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* PROGRESS indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
              <motion.div
                className="h-full bg-accent-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: currentClip.duration, ease: 'linear' }}
                key={currentIndex}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT — scroll position indicators */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5">
        {allClips.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-1.5 h-8 bg-accent-500' : 'w-1 h-3 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* NAV ARROWS */}
      <AnimatePresence>
        {currentIndex > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => navigate('up')}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
        {currentIndex < allClips.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => navigate('down')}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* INFO BOTTOM SHEET */}
      <AnimatePresence>
        {showInfoSheet && content && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoSheet(false)}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-dark-900 border-t border-dark-700 rounded-t-3xl overflow-hidden max-h-[80vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-dark-600" />
              </div>

              <div className="p-5 pb-8">
                {/* Header row */}
                <div className="flex gap-4 mb-5">
                  <img
                    src={content.poster}
                    alt={content.title}
                    className="w-20 rounded-xl object-cover aspect-[2/3] flex-shrink-0 shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white mb-1">{content.title}</h2>
                    <p className="text-sm text-gray-400 mb-2">{content.titlePersian}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                        <Star className="w-4 h-4 fill-current" />
                        {content.rating} IMDb
                      </span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-400">{content.year}</span>
                      {'duration' in content && (
                        <>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {Math.floor((content as Movie).duration / 60)}h {(content as Movie).duration % 60}m
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {content.genres.map(g => (
                        <span key={g} className="px-2 py-0.5 rounded-full bg-dark-700 text-gray-300 text-xs">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInfoSheet(false)}
                    className="p-2 rounded-full hover:bg-dark-800 text-gray-400 self-start flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Synopsis */}
                <p className="text-gray-300 text-sm leading-relaxed mb-5">{content.description}</p>

                {/* Cast preview */}
                <div className="mb-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Cast</p>
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                    {content.cast.map(member => (
                      <div key={member.id} className="flex-shrink-0 text-center w-16">
                        <div className="w-14 h-14 rounded-full overflow-hidden mx-auto ring-1 ring-dark-600">
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${member.name}&background=7C3AED&color=fff&size=56`;
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1 truncate">{member.name.split(' ')[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social proof in sheet */}
                {proof && (
                  <div className="flex gap-3 mb-5">
                    <div className="flex-1 bg-dark-800 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-white">{proof.views}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Total Views</p>
                    </div>
                    <div className="flex-1 bg-dark-800 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-green-400">{proof.completion}%</p>
                      <p className="text-xs text-gray-500 mt-0.5">Completion</p>
                    </div>
                    {proof.trendingRank && (
                      <div className="flex-1 bg-dark-800 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-orange-400">#{proof.trendingRank}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Trending</p>
                      </div>
                    )}
                  </div>
                )}

                {/* CTAs */}
                <div className="flex gap-3">
                  <Link
                    to={`/movie/${content.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-500 text-white font-semibold py-4 rounded-xl transition-all text-base"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Watch Now
                  </Link>
                  <button
                    onClick={() => setIsSaved(prev => ({ ...prev, [currentClip?.id || '']: true }))}
                    className="flex items-center justify-center gap-2 glass text-gray-300 hover:text-white font-medium py-4 px-5 rounded-xl transition-all"
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* COMMENTS DRAWER */}
      <AnimatePresence>
        {showComments && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComments(false)}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-dark-900 border-t border-dark-700 rounded-t-3xl"
              style={{ maxHeight: '75vh' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-dark-600" />
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-b border-dark-800">
                <h3 className="text-white font-semibold">Comments</h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="p-1.5 rounded-full hover:bg-dark-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: 'calc(75vh - 130px)' }}>
                <div className="p-4 space-y-4">
                  {mockComments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-600/50 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-white">{comment.name}</span>
                          <span className="text-xs text-gray-600">{comment.time}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.text}</p>
                        <button
                          onClick={() => setCommentLikes(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                          className={`flex items-center gap-1.5 mt-2 text-xs transition-colors ${
                            commentLikes[comment.id] ? 'text-accent-400' : 'text-gray-500 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${commentLikes[comment.id] ? 'fill-current' : ''}`} />
                          {comment.likes + (commentLikes[comment.id] ? 1 : 0)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment input */}
              <div className="px-4 pb-4 pt-3 border-t border-dark-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-600/50 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    Me
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent-500 transition-all pr-10"
                    />
                    <button
                      onClick={() => setCommentText('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-400 hover:text-accent-300 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  activeColor: string;
  activeBg: string;
  onClick: () => void;
  fillOnActive?: boolean;
}

function ActionButton({ icon: Icon, label, isActive, activeColor, activeBg, onClick, fillOnActive }: ActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        isActive ? `${activeBg} ${activeColor}` : 'bg-white/10 text-white hover:bg-white/20'
      }`}>
        <Icon className={`w-6 h-6 ${fillOnActive && isActive ? 'fill-current' : ''}`} />
      </div>
      <span className={`text-xs font-medium ${isActive ? activeColor : 'text-gray-300'}`}>{label}</span>
    </motion.button>
  );
}
