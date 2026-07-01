import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Grid, List } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { mapDbMovieToMovie, mapDbSeriesToSeries } from '../lib/mappers';
import { Movie, Series } from '../types';
import type { Movie as DbMovie, Series as DbSeries, Genre } from '../lib/database.types';

type SearchMode = 'quick' | 'advanced';
type ContentType = 'all' | 'movies' | 'series';
type SortBy = 'rating' | 'year' | 'title';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || 'all';
  const genreParam = searchParams.get('genre') || '';

  const [searchMode, setSearchMode] = useState<SearchMode>('quick');
  const [contentType, setContentType] = useState<ContentType>(typeParam as ContentType);
  const [selectedGenre, setSelectedGenre] = useState(genreParam);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortBy>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [dbMovies, setDbMovies] = useState<Movie[]>([]);
  const [dbSeries, setDbSeries] = useState<Series[]>([]);
  const [dbGenres, setDbGenres] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const [moviesRes, seriesRes, genresRes] = await Promise.all([
        supabase.from('movies').select('*').eq('status', 'published').order('imdb_rating', { ascending: false }),
        supabase.from('series').select('*').order('imdb_rating', { ascending: false }),
        supabase.from('genres').select('*').order('name_en'),
      ]);

      const dbM = (moviesRes.data || []) as DbMovie[];
      const dbS = (seriesRes.data || []) as DbSeries[];
      const dbG = (genresRes.data || []) as Genre[];

      const movieGenreMap: Record<string, string[]> = {};
      if (dbM.length > 0) {
        const { data: mgLinks } = await supabase
          .from('movie_genres')
          .select('movie_id, genre_id')
          .in('movie_id', dbM.map(m => m.id));
        if (mgLinks) {
          for (const link of mgLinks) {
            if (!movieGenreMap[link.movie_id]) movieGenreMap[link.movie_id] = [];
            const g = dbG.find(gg => gg.id === link.genre_id);
            if (g) movieGenreMap[link.movie_id].push(g.name_en);
          }
        }
      }

      const seriesGenreMap: Record<string, string[]> = {};
      if (dbS.length > 0) {
        const { data: sgLinks } = await supabase
          .from('series_genres')
          .select('series_id, genre_id')
          .in('series_id', dbS.map(s => s.id));
        if (sgLinks) {
          for (const link of sgLinks) {
            if (!seriesGenreMap[link.series_id]) seriesGenreMap[link.series_id] = [];
            const g = dbG.find(gg => gg.id === link.genre_id);
            if (g) seriesGenreMap[link.series_id].push(g.name_en);
          }
        }
      }

      setDbMovies(dbM.map(m => mapDbMovieToMovie(m, dbG.filter(g => (movieGenreMap[m.id] || []).includes(g.name_en)))));
      setDbSeries(dbS.map(s => mapDbSeriesToSeries(s, dbG.filter(g => (seriesGenreMap[s.id] || []).includes(g.name_en)))));
      setDbGenres(dbG.map(g => g.name_en));
    })();
  }, []);

  const filterContent = () => {
    let result: (Movie | Series)[] = [];

    if (query) {
      const q = query.toLowerCase();
      result = [
        ...dbMovies.filter(m => m.title.toLowerCase().includes(q) || m.titlePersian.includes(query) || m.genres.some(g => g.toLowerCase().includes(q))),
        ...dbSeries.filter(s => s.title.toLowerCase().includes(q) || s.titlePersian.includes(query) || s.genres.some(g => g.toLowerCase().includes(q))),
      ];
    } else if (selectedGenre) {
      result = [
        ...dbMovies.filter(m => m.genres.includes(selectedGenre)),
        ...dbSeries.filter(s => s.genres.includes(selectedGenre)),
      ];
    } else {
      result = [...dbMovies, ...dbSeries];
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

  const filteredResults = filterContent();
  const years = [...new Set([...dbMovies, ...dbSeries].map(i => i.year))].sort((a, b) => b - a);
  const countries = [...new Set([...dbMovies, ...dbSeries].map(i => i.country))].filter(Boolean).sort();
  const languages = [...new Set([...dbMovies, ...dbSeries].map(i => i.language))].filter(Boolean).sort();

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pt-4 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {query ? `Results for "${query}"` : selectedGenre ? selectedGenre : 'Browse All'}
          </h1>
          <p className="text-gray-500">{filteredResults.length} titles found</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setSearchMode('quick')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${searchMode === 'quick' ? 'bg-accent-600 text-white' : 'glass text-gray-400'}`}
          >
            Quick Filters
          </button>
          <button
            onClick={() => setSearchMode('advanced')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${searchMode === 'advanced' ? 'bg-accent-600 text-white' : 'glass text-gray-400'}`}
          >
            Advanced
          </button>
        </div>

        {searchMode === 'quick' && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 glass rounded-lg p-1">
              {(['all', 'movies', 'series'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${contentType === type ? 'bg-accent-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {type === 'all' ? 'All' : type === 'movies' ? 'Movies' : 'Series'}
                </button>
              ))}
            </div>

            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="glass rounded-lg px-3 py-2 text-sm text-gray-300 border-none focus:outline-none">
              <option value="">All Genres</option>
              {dbGenres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className="glass rounded-lg px-3 py-2 text-sm text-gray-300 border-none focus:outline-none">
              <option value="rating">Top Rated</option>
              <option value="year">Newest</option>
              <option value="title">A-Z</option>
            </select>

            <div className="flex items-center gap-1 glass rounded-lg p-1 ml-auto">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-accent-600 text-white' : 'text-gray-400'}`}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-accent-600 text-white' : 'text-gray-400'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {searchMode === 'advanced' && (
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Content Type</label>
                <select value={contentType} onChange={(e) => setContentType(e.target.value as ContentType)} className="input-field text-sm">
                  <option value="all">All</option>
                  <option value="movies">Movies</option>
                  <option value="series">Series</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Genre</label>
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="input-field text-sm">
                  <option value="">All Genres</option>
                  {dbGenres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Year</label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="input-field text-sm">
                  <option value="">All Years</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Country</label>
                <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="input-field text-sm">
                  <option value="">All Countries</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Language</label>
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="input-field text-sm">
                  <option value="">All Languages</option>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Min Rating</label>
                <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="input-field text-sm">
                  <option value={0}>Any Rating</option>
                  <option value={5}>5+</option>
                  <option value={6}>6+</option>
                  <option value={7}>7+</option>
                  <option value={8}>8+</option>
                  <option value={9}>9+</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className="input-field text-sm">
                  <option value="rating">Top Rated</option>
                  <option value="year">Newest First</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {filteredResults.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
            : 'flex flex-col gap-3'
          }>
            {filteredResults.map((item, index) => {
              const isMovie = 'duration' in item;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.6) }}
                >
                  <Link to={`/${isMovie ? 'movie' : 'series'}/${item.id}`} className="group block">
                    <div className="relative rounded-xl overflow-hidden">
                      <div className="aspect-[2/3]">
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded glass text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />{item.rating}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-sm font-semibold text-white group-hover:text-accent-400 transition-colors line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-gray-500">{item.year} · {isMovie ? 'Movie' : 'Series'}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
