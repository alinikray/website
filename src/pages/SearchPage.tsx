import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, Star, Play, Plus,
  Grid, List, Zap, ChevronDown
} from 'lucide-react';
import { movies, series, genres, searchContent, getContentByGenre } from '../data/mockData';
import { Movie, Series } from '../types';

type SearchMode = 'quick' | 'advanced';
type ContentType = 'all' | 'movies' | 'series';
type SortBy = 'rating' | 'year' | 'title';

const countries = ['Iran', 'USA', 'UK', 'France', 'South Korea', 'Italy'];
const languages = ['Persian', 'English', 'Arabic', 'French', 'Korean'];
const ratingRanges = [
  { label: 'Any', min: 0 },
  { label: '6+', min: 6 },
  { label: '7+', min: 7 },
  { label: '8+', min: 8 },
  { label: '9+', min: 9 },
];
const years = Array.from({ length: 15 }, (_, i) => 2024 - i);

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<SearchMode>('quick');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [contentType, setContentType] = useState<ContentType>((searchParams.get('type') as ContentType) || 'all');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortBy>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
    const genre = searchParams.get('genre');
    if (genre) { setSelectedGenre(genre); setMode('advanced'); }
    const type = searchParams.get('type');
    if (type) setContentType(type as ContentType);
    const actor = searchParams.get('actor');
    if (actor) { setQuery(actor); }
  }, [searchParams]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set('q', query);
      setSearchParams(params);
    }
  };

  const clearAll = () => {
    setQuery('');
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedCountry('');
    setSelectedLanguage('');
    setMinRating(0);
    setSearchParams({});
  };

  const filterContent = () => {
    let result: (Movie | Series)[] = [];

    if (query) {
      const r = searchContent(query);
      result = [...r.movies, ...r.series];
    } else if (selectedGenre) {
      const r = getContentByGenre(selectedGenre);
      result = [...r.movies, ...r.series];
    } else {
      result = [...movies, ...series];
    }

    if (contentType === 'movies') result = result.filter(i => 'duration' in i);
    else if (contentType === 'series') result = result.filter(i => 'seasons' in i);

    if (selectedYear) result = result.filter(i => i.year.toString() === selectedYear);
    if (selectedCountry) result = result.filter(i => i.country === selectedCountry);
    if (selectedLanguage) result = result.filter(i => i.language === selectedLanguage);
    if (minRating > 0) result = result.filter(i => i.rating >= minRating);

    return result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
  };

  const results = filterContent();
  const hasActiveFilters = query || selectedGenre || selectedYear || selectedCountry || selectedLanguage || minRating > 0;

  return (
    <div className="min-h-screen pb-12">
      {/* Search Header */}
      <div className="sticky top-16 md:top-20 z-30 bg-dark-900/95 backdrop-blur-xl border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* Mode toggle */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-dark-800/60 border border-dark-700">
              <button
                onClick={() => setMode('quick')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'quick' ? 'bg-accent-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                Quick
              </button>
              <button
                onClick={() => setMode('advanced')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'advanced' ? 'bg-accent-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Advanced
              </button>
            </div>

            {/* View toggle */}
            <div className="ml-auto flex items-center gap-1 p-1 rounded-xl bg-dark-800/60 border border-dark-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-accent-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-accent-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search input — always visible */}
          <form onSubmit={handleQuickSearch} className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={mode === 'quick' ? 'Search movies, series, actors...' : 'Search by title, actor, director...'}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Advanced filters */}
          <AnimatePresence>
            {mode === 'advanced' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-1 pb-2">
                  {/* Content type */}
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'movies', 'series'] as ContentType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setContentType(t)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                          contentType === t ? 'bg-accent-600 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {t === 'all' ? 'All Types' : t === 'movies' ? 'Movies' : 'TV Series'}
                      </button>
                    ))}
                  </div>

                  {/* Genre */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Genre</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedGenre('')}
                        className={`px-3 py-1 rounded-lg text-xs transition-all ${!selectedGenre ? 'bg-accent-600 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'}`}
                      >
                        Any
                      </button>
                      {genres.map(g => (
                        <button
                          key={g}
                          onClick={() => setSelectedGenre(selectedGenre === g ? '' : g)}
                          className={`px-3 py-1 rounded-lg text-xs transition-all ${selectedGenre === g ? 'bg-accent-600 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row: IMDb rating, Year, Country, Language */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* IMDb Rating */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Min IMDb</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ratingRanges.map(r => (
                          <button
                            key={r.min}
                            onClick={() => setMinRating(r.min)}
                            className={`px-2.5 py-1 rounded-lg text-xs transition-all ${minRating === r.min ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500/30' : 'bg-dark-800 text-gray-400 hover:text-white'}`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Year */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Year</p>
                      <div className="relative">
                        <select
                          value={selectedYear}
                          onChange={e => setSelectedYear(e.target.value)}
                          className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:border-accent-500"
                        >
                          <option value="">Any Year</option>
                          {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Country</p>
                      <div className="relative">
                        <select
                          value={selectedCountry}
                          onChange={e => setSelectedCountry(e.target.value)}
                          className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:border-accent-500"
                        >
                          <option value="">Any Country</option>
                          {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Language</p>
                      <div className="relative">
                        <select
                          value={selectedLanguage}
                          onChange={e => setSelectedLanguage(e.target.value)}
                          className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:border-accent-500"
                        >
                          <option value="">Any Language</option>
                          {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Sort:</span>
                    <div className="flex gap-1.5">
                      {([['rating', 'Rating'], ['year', 'Year'], ['title', 'Title']] as [SortBy, string][]).map(([val, label]) => (
                        <button
                          key={val}
                          onClick={() => setSortBy(val)}
                          className={`px-3 py-1 rounded-lg text-xs transition-all ${sortBy === val ? 'bg-accent-600 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Results meta */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-400 text-sm">
            {results.length} result{results.length !== 1 ? 's' : ''}
            {query && <span className="text-white"> for "{query}"</span>}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>

        {/* Quick mode: show category pills when no query and not filtering by type */}
        {mode === 'quick' && !query && !contentType.match(/^(movies|series)$/) && (
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3">Browse by genre</p>
            <div className="flex flex-wrap gap-2">
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => { setMode('advanced'); setSelectedGenre(g); }}
                  className="px-4 py-2 rounded-full glass text-sm text-gray-300 hover:text-white hover:bg-dark-700 transition-all"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${query}-${selectedGenre}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                : 'space-y-3'
              }
            >
              {results.map((item, index) => {
                const isMovie = 'duration' in item;
                return viewMode === 'grid'
                  ? <ContentCard key={item.id} item={item} isMovie={isMovie} index={index} />
                  : <ContentListItem key={item.id} item={item} isMovie={isMovie} index={index} />;
              })}
            </motion.div>
          </AnimatePresence>
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
            <p className="text-gray-500 mb-4">Try different keywords or adjust filters</p>
            {hasActiveFilters && (
              <button onClick={clearAll} className="text-accent-400 hover:text-accent-300 text-sm transition-colors">
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ContentCard({ item, isMovie, index }: { item: Movie | Series; isMovie: boolean; index: number }) {
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
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Base overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />

          {/* Hover overlay with rich info */}
          <div className="absolute inset-0 bg-dark-900/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3">
            {/* Play button */}
            <div className="flex justify-center items-center flex-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="w-12 h-12 rounded-full bg-accent-600 flex items-center justify-center shadow-glow"
              >
                <Play className="w-5 h-5 text-white fill-current" />
              </motion.div>
            </div>

            {/* Info at bottom */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="flex items-center gap-0.5 text-yellow-400 text-xs font-bold">
                  <Star className="w-3 h-3 fill-current" />{item.rating}
                </span>
                <span className="text-gray-400 text-xs">{item.year}</span>
                {isMovie && (
                  <span className="text-gray-400 text-xs">{Math.floor((item as Movie).duration / 60)}h {(item as Movie).duration % 60}m</span>
                )}
                {!isMovie && (
                  <span className="text-gray-400 text-xs">{(item as Series).seasons?.length || 1} seasons</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {item.genres.slice(0, 2).map(g => (
                  <span key={g} className="px-1.5 py-0.5 rounded bg-accent-600/40 text-accent-300 text-[10px]">{g}</span>
                ))}
              </div>
              <p className="text-gray-300 text-[10px] leading-snug line-clamp-3">{item.description}</p>
            </div>
          </div>

          {/* Always visible badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded glass text-yellow-400 text-xs group-hover:opacity-0 transition-opacity">
            <Star className="w-3 h-3 fill-current" />
            {item.rating}
          </div>
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded glass text-white text-xs group-hover:opacity-0 transition-opacity">
            {isMovie ? 'Movie' : 'Series'}
          </div>
        </div>
      </Link>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-white line-clamp-1 group-hover:text-accent-400 transition-colors">{item.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{item.year}</p>
      </div>
    </motion.div>
  );
}

function ContentListItem({ item, isMovie, index }: { item: Movie | Series; isMovie: boolean; index: number }) {
  const [isSaved, setIsSaved] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex gap-4 p-4 rounded-xl glass hover:bg-dark-700/40 transition-colors group"
    >
      <Link to={`/${isMovie ? 'movie' : 'series'}/${item.id}`} className="flex-shrink-0">
        <div className="relative w-[80px] md:w-[100px] rounded-lg overflow-hidden aspect-[2/3]">
          <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-dark-900/40">
            <Play className="w-6 h-6 text-white fill-current" />
          </div>
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/${isMovie ? 'movie' : 'series'}/${item.id}`}>
            <h3 className="font-semibold text-white group-hover:text-accent-400 transition-colors">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.titlePersian}</p>
          </Link>
          <button
            onClick={() => setIsSaved(s => !s)}
            className={`p-2 rounded-lg flex-shrink-0 transition-colors ${isSaved ? 'bg-accent-600/20 text-accent-400' : 'text-gray-500 hover:text-white'}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1 text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            {item.rating}
          </span>
          <span>{item.year}</span>
          {isMovie && <span>{(item as Movie).duration} min</span>}
          {!isMovie && <span>{(item as Series).seasons.length} seasons</span>}
          <span>{item.country}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {item.genres.slice(0, 3).map(g => (
            <span key={g} className="px-2 py-0.5 rounded glass text-xs text-gray-400">{g}</span>
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2 hidden md:block">{item.description}</p>
      </div>
    </motion.div>
  );
}
