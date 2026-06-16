import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play, Plus, Check, Star, Clock, Calendar, Globe,
  ChevronDown
} from 'lucide-react';
import { getSeriesById, getRelatedSeries } from '../data/mockData';
import { Episode } from '../types';

export default function SeriesDetailPage() {
  const { id } = useParams();
  const series = getSeriesById(id || '');
  const relatedSeries = series ? getRelatedSeries(series.id) : [];

  const [isSaved, setIsSaved] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!series) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Series not found</h1>
          <Link to="/" className="text-accent-400 hover:text-accent-300 mt-4 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const currentSeason = series.seasons[selectedSeason];

  return (
    <div className="min-h-screen -mt-20 md:-mt-24">
      {/* Hero Backdrop */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${series.backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-dark-900/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 via-transparent to-dark-900/60" />
      </div>

      {/* Content */}
      <div className="relative -mt-[40vh] md:-mt-[50vh] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0 mx-auto lg:mx-0"
            >
              <div className="w-[200px] md:w-[280px] rounded-xl overflow-hidden shadow-2xl shadow-black/40">
                <img
                  src={series.poster}
                  alt={series.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 text-center lg:text-left"
            >
              {/* Title Section */}
              <div className="mb-4">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                  <span className="px-3 py-1 rounded-lg bg-accent-600 text-white text-xs font-semibold">
                    SERIES
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    series.status === 'ongoing'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {series.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-2">
                  {series.title}
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-300 mb-3">
                  {series.titlePersian}
                </h2>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{series.rating}</span>
                  </div>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {series.year}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {series.seasons.length} Seasons
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    {series.country}
                  </span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                {series.genres.map((genre) => (
                  <Link
                    key={genre}
                    to={`/search?genre=${encodeURIComponent(genre)}`}
                    className="px-4 py-2 rounded-full glass text-sm text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                  >
                    {genre}
                  </Link>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                {series.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 btn-primary px-8 py-4 text-lg"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Watch S1 E1
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                    isSaved
                      ? 'bg-accent-600/30 text-accent-400 border border-accent-500/50'
                      : 'btn-secondary'
                  }`}
                >
                  {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isSaved ? 'Saved' : 'My List'}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Seasons & Episodes */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Episodes</h2>

              {/* Season Selector */}
              {series.seasons.length > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-white"
                  >
                    <span>Season {selectedSeason + 1}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full right-0 mt-2 glass rounded-lg overflow-hidden z-20 min-w-[150px]"
                    >
                      {series.seasons.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedSeason(index);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-right px-4 py-3 text-sm hover:bg-dark-700 transition-colors ${
                            selectedSeason === index ? 'text-accent-400' : 'text-gray-300'
                          }`}
                        >
                          Season {index + 1}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Episode List */}
            <div className="space-y-3">
              {currentSeason.episodes.map((episode, index) => (
                <EpisodeCard
                  key={episode.number}
                  episode={episode}
                  seasonNumber={selectedSeason + 1}
                  index={index}
                />
              ))}
            </div>
          </motion.section>

          {/* Cast Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {series.cast.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex-shrink-0 w-[140px] md:w-[160px] text-center"
                >
                  <div className="w-[140px] md:w-[160px] h-[140px] md:h-[160px] rounded-full overflow-hidden mb-3 mx-auto ring-2 ring-dark-700 ring-offset-2 ring-offset-dark-900">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${member.name}&background=7C3AED&color=fff&size=160`;
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{member.namePersian}</p>
                  <p className="text-xs text-accent-400 mt-1">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Related Series */}
          {relatedSeries.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                Related Series
                <span className="text-sm text-gray-500 font-normal mr-2">سریال‌های مرتبط</span>
              </h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {relatedSeries.map((relatedShow, index) => (
                  <Link
                    key={relatedShow.id}
                    to={`/series/${relatedShow.id}`}
                    className="flex-shrink-0 w-[200px] group"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative aspect-[2/3] rounded-xl overflow-hidden"
                    >
                      <img
                        src={relatedShow.poster}
                        alt={relatedShow.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-60" />
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded glass text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {relatedShow.rating}
                      </div>
                    </motion.div>
                    <h3 className="text-sm font-semibold text-white mt-2 line-clamp-1 group-hover:text-accent-400 transition-colors">
                      {relatedShow.title}
                    </h3>
                    <p className="text-xs text-gray-500">{relatedShow.seasons.length} Seasons</p>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}

interface EpisodeCardProps {
  episode: Episode;
  seasonNumber: number;
  index: number;
}

function EpisodeCard({ episode, index }: EpisodeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="flex gap-4 p-3 rounded-xl glass hover:bg-dark-700/50 transition-colors cursor-pointer">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-[160px] md:w-[200px]">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={episode.thumbnail}
              alt={episode.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-dark-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-full bg-accent-600 flex items-center justify-center"
              >
                <Play className="w-5 h-5 text-white fill-current" />
              </motion.button>
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded glass text-white text-xs">
              {Math.floor(episode.duration / 60)}h {episode.duration % 60}m
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-accent-400 text-sm font-semibold">
              E{episode.number}
            </span>
          </div>
          <h3 className="text-white font-semibold mb-1">{episode.title}</h3>
          <p className="text-gray-500 text-sm mb-2">{episode.titlePersian}</p>
          <p className="text-gray-400 text-sm line-clamp-2">{episode.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
