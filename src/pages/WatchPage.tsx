import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Settings, ArrowLeft, Star, Clock, Calendar, Globe,
  PictureInPicture, Loader2, Check, Subtitles,
  ChevronRight, Film, Compass,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  getMovieBySlug, getSimilarMovies, getMovieStreams, getMovieSubtitles,
  getMovieGenres, getClipsByMovie, saveWatchProgress, recordViewingHistory,
  getContinueWatchingForMovie,
} from '../lib/api';
import type { Movie, MovieStream, Subtitle, Genre, ExploreClip } from '../lib/database.types';
import CinematicLoader from '../components/CinematicLoader';

const QUALITY_ORDER: Record<string, number> = { '4K': 0, '1080p': 1, '720p': 2, '480p': 3 };

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function WatchPage() {
  const { movieSlug } = useParams<{ movieSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [streams, setStreams] = useState<MovieStream[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [clips, setClips] = useState<ExploreClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedQuality, setSelectedQuality] = useState<string>('1080p');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('off');
  const [showSettings, setShowSettings] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressSavedRef = useRef(0);
  const historyRecordedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [resumePoint, setResumePoint] = useState(0);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStream = streams.find(s => s.quality === selectedQuality) || streams[0];

  // Load movie data
  useEffect(() => {
    if (!movieSlug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      const m = await getMovieBySlug(movieSlug);
      if (cancelled) return;
      if (!m) {
        setError('Movie not found');
        setLoading(false);
        return;
      }
      setMovie(m);

      const [s, subs, g, sim, c] = await Promise.all([
        getMovieStreams(m.id),
        getMovieSubtitles(m.id),
        getMovieGenres(m.id),
        getSimilarMovies(m.id),
        getClipsByMovie(m.id),
      ]);
      if (cancelled) return;

      setStreams(s.sort((a, b) => (QUALITY_ORDER[a.quality] ?? 99) - (QUALITY_ORDER[b.quality] ?? 99)));
      setSubtitles(subs);
      setGenres(g);
      setSimilarMovies(sim);
      setClips(c);

      if (s.length > 0) {
        const best = s.sort((a, b) => (QUALITY_ORDER[a.quality] ?? 99) - (QUALITY_ORDER[b.quality] ?? 99))[0];
        setSelectedQuality(best.quality);
      }

      if (user) {
        const cw = await getContinueWatchingForMovie(user.id, m.id);
        if (cw && cw.progress_seconds > 10) {
          setResumePoint(cw.progress_seconds);
        }
      }

      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [movieSlug, user]);

  // Set up video element event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) setDuration(video.duration);

      // Save progress every 15 seconds
      const progress = Math.floor(video.currentTime);
      if (user && movie && Math.abs(progress - progressSavedRef.current) >= 15) {
        progressSavedRef.current = progress;
        saveWatchProgress(user.id, movie.id, progress, Math.floor(video.duration || 0));
      }

      // Record viewing history once at 30 seconds
      if (user && movie && !historyRecordedRef.current && progress >= 30) {
        historyRecordedRef.current = true;
        recordViewingHistory(user.id, movie.id, progress, Math.floor(video.duration || 0));
      }
    };

    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const onPlay = () => { setIsPlaying(true); setIsBuffering(false); };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      if (resumePoint > 0 && resumePoint < video.duration - 10) {
        video.currentTime = resumePoint;
      }
    };
    const onVolumeChange = () => {
      setVolume(video.volume);
      setMuted(video.muted);
    };
    const onEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('progress', onProgress);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('ended', onEnded);
    };
  }, [movie, user, resumePoint]);

  // Fullscreen detection
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Apply playback speed
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Apply subtitle track
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = tracks[i].language === selectedSubtitle ? 'showing' : 'hidden';
    }
  }, [selectedSubtitle, streams]);

  // Auto-hide controls
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  }, [isPlaying]);

  useEffect(() => {
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (user && movie && progressSavedRef.current > 0) {
        saveWatchProgress(user.id, movie.id, progressSavedRef.current, Math.floor(duration || 0));
      }
    };
  }, [user, movie, duration]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch { /* not supported */ }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const v = parseFloat(e.target.value);
    video.volume = v;
    video.muted = v === 0;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200]">
        <CinematicLoader />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{error || 'Movie not found'}</h1>
          <Link to="/" className="text-accent-400 hover:text-accent-300 mt-4 inline-block">Go back home</Link>
        </div>
      </div>
    );
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-black -mt-16 md:-mt-20">
      {/* ============ VIDEO PLAYER ============ */}
      <div
        ref={containerRef}
        className="relative w-full h-screen bg-black flex items-center justify-center group"
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'VIDEO') {
            togglePlay();
          }
        }}
      >
        {/* Video element */}
        {currentStream ? (
          <video
            ref={videoRef}
            src={currentStream.stream_url}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            crossOrigin="anonymous"
          >
            {subtitles.map(sub => (
              <track
                key={sub.id}
                kind="subtitles"
                src={sub.subtitle_url}
                srcLang={sub.language}
                label={sub.language === 'fa' ? 'فارسی' : 'English'}
              />
            ))}
          </video>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 text-lg">No streaming sources available for this movie.</p>
          </div>
        )}

        {/* Buffering spinner */}
        <AnimatePresence>
          {isBuffering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Loader2 className="w-16 h-16 text-accent-500 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resume prompt */}
        <AnimatePresence>
          {resumePoint > 0 && currentTime < 5 && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30"
            >
              <button
                onClick={() => {
                  const video = videoRef.current;
                  if (video) {
                    video.currentTime = resumePoint;
                    video.play();
                  }
                }}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-semibold shadow-lg shadow-accent-500/30 transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                Resume from {formatTime(resumePoint)}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top bar */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent pt-16 md:pt-20"
            >
              <div className="flex items-center justify-between px-4 md:px-8 pb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-white hover:text-accent-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:block">Back</span>
                </button>
                <div className="text-center">
                  <h1 className="text-white font-semibold text-lg md:text-xl line-clamp-1">{movie.title_en}</h1>
                  {movie.title_fa && <p className="text-gray-400 text-sm">{movie.title_fa}</p>}
                </div>
                <div className="w-16" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center play/pause button */}
        <AnimatePresence>
          {showControls && !isPlaying && !isBuffering && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center z-20"
            >
              <Play className="w-9 h-9 text-white fill-current ml-1" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Bottom controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent pb-4 pt-12"
            >
              {/* Progress bar */}
              <div
                ref={progressRef}
                onClick={handleSeek}
                className="group/bar relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 mx-auto max-w-[98%]"
              >
                {/* Buffered */}
                <div
                  className="absolute h-full bg-white/30 rounded-full"
                  style={{ width: `${bufferedPct}%` }}
                />
                {/* Progress */}
                <div
                  className="absolute h-full bg-accent-500 rounded-full"
                  style={{ width: `${progressPct}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-accent-400 shadow-glow opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-3 md:gap-5">
                  {/* Play/Pause */}
                  <button onClick={togglePlay} className="text-white hover:text-accent-400 transition-colors">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group/vol">
                    <button onClick={toggleMute} className="text-white hover:text-accent-400 transition-colors">
                      {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={muted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-accent-500 cursor-pointer"
                    />
                  </div>

                  {/* Time */}
                  <div className="text-gray-300 text-sm font-medium tabular-nums hidden sm:block">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-5">
                  {/* Settings */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(s => !s)}
                      className={`text-white hover:text-accent-400 transition-colors ${showSettings ? 'text-accent-400' : ''}`}
                    >
                      <Settings className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full right-0 mb-2 w-64 glass rounded-2xl shadow-xl overflow-hidden"
                        >
                          {/* Quality */}
                          <div className="p-3 border-b border-dark-700/50">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Film className="w-3 h-3" /> Quality
                            </p>
                            <div className="space-y-1">
                              {streams.map(s => (
                                <button
                                  key={s.id}
                                  onClick={() => { setSelectedQuality(s.quality); }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                    selectedQuality === s.quality
                                      ? 'bg-accent-600/30 text-accent-400'
                                      : 'text-gray-300 hover:bg-dark-700/50'
                                  }`}
                                >
                                  <span>{s.quality}</span>
                                  {selectedQuality === s.quality && <Check className="w-4 h-4" />}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Subtitles */}
                          <div className="p-3 border-b border-dark-700/50">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Subtitles className="w-3 h-3" /> Subtitles
                            </p>
                            <div className="space-y-1">
                              <button
                                onClick={() => setSelectedSubtitle('off')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                  selectedSubtitle === 'off'
                                    ? 'bg-accent-600/30 text-accent-400'
                                    : 'text-gray-300 hover:bg-dark-700/50'
                                }`}
                              >
                                <span>Off</span>
                                {selectedSubtitle === 'off' && <Check className="w-4 h-4" />}
                              </button>
                              {subtitles.map(sub => (
                                <button
                                  key={sub.id}
                                  onClick={() => setSelectedSubtitle(sub.language)}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                    selectedSubtitle === sub.language
                                      ? 'bg-accent-600/30 text-accent-400'
                                      : 'text-gray-300 hover:bg-dark-700/50'
                                  }`}
                                >
                                  <span>{sub.language === 'fa' ? 'فارسی' : 'English'}</span>
                                  {selectedSubtitle === sub.language && <Check className="w-4 h-4" />}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Playback Speed */}
                          <div className="p-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Playback Speed</p>
                            <div className="grid grid-cols-4 gap-1">
                              {[0.5, 1, 1.5, 2].map(speed => (
                                <button
                                  key={speed}
                                  onClick={() => setPlaybackSpeed(speed)}
                                  className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    playbackSpeed === speed
                                      ? 'bg-accent-600/30 text-accent-400'
                                      : 'text-gray-300 hover:bg-dark-700/50'
                                  }`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* PiP */}
                  <button onClick={togglePiP} className="text-white hover:text-accent-400 transition-colors hidden sm:block">
                    <PictureInPicture className="w-5 h-5" />
                  </button>

                  {/* Fullscreen */}
                  <button onClick={toggleFullscreen} className="text-white hover:text-accent-400 transition-colors">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ============ MOVIE INFO BELOW PLAYER ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 -mt-8 relative z-10">
        {/* Title + meta */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{movie.title_en}</h1>
            {movie.title_fa && <h2 className="text-lg text-gray-400 mb-3">{movie.title_fa}</h2>}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{movie.imdb_rating}</span>
                <span className="text-yellow-500/70 text-xs">IMDb</span>
              </div>
              {movie.release_year && (
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />{movie.release_year}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              {movie.country && (
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Globe className="w-4 h-4" />{movie.country}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map(g => (
                  <Link
                    key={g.id}
                    to={`/search?genre=${encodeURIComponent(g.slug)}`}
                    className="px-3 py-1.5 rounded-full glass text-sm text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                  >
                    {g.name_en}
                  </Link>
                ))}
              </div>
            )}

            {movie.description_en && (
              <p className="text-gray-300 leading-relaxed max-w-3xl">{movie.description_en}</p>
            )}
          </div>

          {/* Poster */}
          {movie.poster_url && (
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="w-[160px] md:w-[200px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img src={movie.poster_url} alt={movie.title_en} className="w-full aspect-[2/3] object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Related Explore Clips */}
        {clips.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-accent-400" />
                Related Clips
              </h2>
              <Link to="/explore" className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm">
                View in Explore <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {clips.map(clip => (
                <Link
                  key={clip.id}
                  to={`/movie/${movie.slug}`}
                  className="flex-shrink-0 w-[150px] md:w-[170px] group"
                >
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden">
                    <img src={clip.thumbnail_url} alt={clip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-accent-600 flex items-center justify-center shadow-glow">
                        <Play className="w-5 h-5 text-white fill-current" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium line-clamp-2">{clip.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <section className="pb-14">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Film className="w-5 h-5 text-accent-400" />
              Similar Movies
              <span className="text-sm text-gray-500 font-normal">فیلم‌های مشابه</span>
            </h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {similarMovies.map(sim => (
                <Link key={sim.id} to={`/watch/${sim.slug}`} className="flex-shrink-0 w-[150px] md:w-[170px] group">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                    {sim.poster_url && (
                      <img src={sim.poster_url} alt={sim.title_en} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded glass text-yellow-400 text-xs">
                      <Star className="w-3 h-3 fill-current" />{sim.imdb_rating}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-sm font-medium text-white line-clamp-1 group-hover:text-accent-400 transition-colors">{sim.title_en}</p>
                      <p className="text-xs text-gray-500">{sim.release_year}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
