import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, Star, Play, Plus,
  Grid, List
} from 'lucide-react';
import { movies, series, genres, searchContent, getContentByGenre } from '../data/mockData';
import { Movie, Series } from '../types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [contentType, setContentType] = useState<'all' | 'movies' | 'series'>(searchParams.get('type') as any || 'all');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const years = Array.from({ length: 10 }, (_, i) => 2024 - i);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
    const genre = searchParams.get('genre');
    if (genre) setSelectedGenre(genre);
    const type = searchParams.get('type');
    if (type) setContentType(type as 'all' | 'movies' | 'series');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedGenre) params.set('genre', selectedGenre);
    if (selectedYear) params.set('year', selectedYear);
    setSearchParams(params);
  };

  const filterContent = () => {
    let result: (Movie | Series)[] = [];

    if (query) {
      const searchResults = searchContent(query);
      result = [...searchResults.movies, ...searchResults.series];
    } else if (selectedGenre) {
      const genreResults = getContentByGenre(selectedGenre);
      result = [...genreResults.movies, ...genreResults.series];
    } else {
      result = [...movies, ...series];
    }

    if (contentType === 'movies') {
      result = result.filter(item => 'duration' in item);
    } else if (contentType === 'series') {
      result = result.filter(item => 'seasons' in item);
    }

    if (selectedYear) {
      result = result.filter(item => item.year.toString() === selectedYear);
    }

    return result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
  };

  const results = filterContent();
  const movieCount = results.filter(r => 'duration' in r).length;
  const seriesCount = results.filter(r => 'seasons' in r).length;

  return (
    <div className="min-h-screen pb-12">
      {/* Search Header */}
      <div className="sticky top-16 md:top-20 z-30 bg-dark-900/95 backdrop-blur-xl border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, series, actors..."
                className="w-full bg-dark-800 border border-dark-700 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  showFilters || selectedGenre || selectedYear
                    ? 'bg-accent-600 text-white'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </motion.button>

              {/* View Toggle */}
              <div className="flex bg-dark-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-accent-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-accent-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  {/* Content Type */}
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'movies', 'series'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setContentType(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          contentType === type
                            ? 'bg-accent-600 text-white'
                            : 'bg-dark-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {type === 'all' ? 'All' : type === 'movies' ? 'Movies' : 'TV Series'}
                      </button>
                    ))}
                  </div>

                  {/* Genre Filter */}
                  <div>
                    <h3 className="text-sm text-gray-500 mb-2">Genre</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedGenre('')}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          !selectedGenre
                            ? 'bg-accent-600 text-white'
                            : 'bg-dark-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        All Genres
                      </button>
                      {genres.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => setSelectedGenre(genre)}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            selectedGenre === genre
                              ? 'bg-accent-600 text-white'
                              : 'bg-dark-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedYear('')}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        !selectedYear
                          ? 'bg-accent-600 text-white'
                          : 'bg-dark-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      All Years
                    </button>
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year.toString())}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          selectedYear === year.toString()
                            ? 'bg-accent-600 text-white'
                            : 'bg-dark-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-500"
                    >
                      <option value="rating">Rating</option>
                      <option value="year">Year</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              {results.length} results
            </span>
            {movieCount > 0 && (
              <span className="px-2 py-1 rounded-lg bg-dark-800 text-gray-300">
                {movieCount} Movies
              </span>
            )}
            {seriesCount > 0 && (
              <span className="px-2 py-1 rounded-lg bg-dark-800 text-gray-300">
                {seriesCount} Series
              </span>
            )}
          </div>
          {(selectedGenre || selectedYear || query) && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedGenre('');
                setSelectedYear('');
                setSearchParams({});
              }}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>

        {/* Results Grid/List */}
        {results.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
            : 'space-y-3'
          }>
            {results.map((item, index) => {
              const isMovie = 'duration' in item;
              return viewMode === 'grid' ? (
                <ContentCard key={item.id} item={item} isMovie={isMovie} index={index} />
              ) : (
                <ContentListItem key={item.id} item={item} isMovie={isMovie} index={index} />
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
            <p className="text-gray-500">Try different keywords or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface ContentCardProps {
  item: Movie | Series;
  isMovie: boolean;
  index: number;
}

function ContentCard({ item, isMovie, index }: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group"
    >
      <Link to={`/${isMovie ? 'movie' : 'series'}/${item.id}`}>
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
          <img
            src={item.poster}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-dark-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-full bg-accent-600 flex items-center justify-center"
            >
              <Play className="w-5 h-5 text-white fill-current" />
            </motion.button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded glass text-yellow-400 text-xs">
            <Star className="w-3 h-3 fill-current" />
            {item.rating}
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded glass text-white text-xs">
              {isMovie ? 'Movie' : 'Series'}
            </span>
          </div>
        </div>
      </Link>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-white line-clamp-1 group-hover:text-accent-400 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{item.year}</span>
          {isMovie && <span>{(item as Movie).duration} min</span>}
        </div>
      </div>
    </motion.div>
  );
}

interface ContentListItemProps {
  item: Movie | Series;
  isMovie: boolean;
  index: number;
}

function ContentListItem({ item, isMovie, index }: ContentListItemProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex gap-4 p-4 rounded-xl glass hover:bg-dark-700/50 transition-colors group"
    >
      {/* Poster */}
      <Link to={`/${isMovie ? 'movie' : 'series'}/${item.id}`} className="flex-shrink-0">
        <div className="relative w-[100px] md:w-[140px] rounded-lg overflow-hidden">
          <img
            src={item.poster}
            alt={item.title}
            className="w-full aspect-[2/3] object-cover"
          />
          <div className="absolute inset-0 bg-dark-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-8 h-8 text-white fill-current" />
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/${isMovie ? 'movie' : 'series'}/${item.id}`}>
            <h3 className="text-lg font-semibold text-white group-hover:text-accent-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500">{item.titlePersian}</p>
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-lg transition-colors ${
              isSaved ? 'bg-accent-600/20 text-accent-400' : 'bg-dark-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-400">
          <span className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            {item.rating}
          </span>
          <span>{item.year}</span>
          {isMovie && <span>{(item as Movie).duration} min</span>}
          {!isMovie && <span>{(item as Series).seasons.length} Seasons</span>}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {item.genres.slice(0, 3).map((genre) => (
            <span key={genre} className="px-2 py-1 rounded glass text-xs text-gray-400">
              {genre}
            </span>
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-3 line-clamp-2 hidden md:block">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
