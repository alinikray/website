import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, Film, Tv, Grid3x2 as Grid3X3, List, Star, Clock, Calendar } from 'lucide-react';

const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];

const mockResults = [
  { id: 1, title: 'Inception', year: 2010, rating: 8.8, runtime: '2h 28m', genres: ['Sci-Fi', 'Action', 'Thriller'], synopsis: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.', image: 'https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compact&cs=tinysrgb&w=400' },
  { id: 2, title: 'The Dark Knight', year: 2008, rating: 9.0, runtime: '2h 32m', genres: ['Action', 'Crime', 'Drama'], synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.', image: 'https://images.pexels.com/photos/1667580/pexels-photo-1667580.jpeg?auto=compact&cs=tinysrgb&w=400' },
  { id: 3, title: 'Interstellar', year: 2014, rating: 8.6, runtime: '2h 49m', genres: ['Sci-Fi', 'Drama', 'Adventure'], synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', image: 'https://images.pexels.com/photos/3915398/pexels-photo-3915398.jpeg?auto=compact&cs=tinysrgb&w=400' },
  { id: 4, title: 'Pulp Fiction', year: 1994, rating: 8.9, runtime: '2h 34m', genres: ['Crime', 'Drama'], synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.', image: 'https://images.pexels.com/photos/3014847/pexels-photo-3014847.jpeg?auto=compact&cs=tinysrgb&w=400' },
  { id: 5, title: 'The Matrix', year: 1999, rating: 8.7, runtime: '2h 16m', genres: ['Sci-Fi', 'Action'], synopsis: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.', image: 'https://images.pexels.com/photos/2799110/pexels-photo-2799110.jpeg?auto=compact&cs=tinysrgb&w=400' },
  { id: 6, title: 'Fight Club', year: 1999, rating: 8.8, runtime: '2h 19m', genres: ['Drama', 'Thriller'], synopsis: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club.', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compact&cs=tinysrgb&w=400' },
  { id: 7, title: 'Forrest Gump', year: 1994, rating: 8.8, runtime: '2h 22m', genres: ['Drama', 'Romance'], synopsis: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.', image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compact&cs=tinysrgb&w=400' },
  { id: 8, title: 'Avatar', year: 2009, rating: 7.9, runtime: '2h 42m', genres: ['Sci-Fi', 'Adventure', 'Action'], synopsis: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world.', image: 'https://images.pexels.com/photos/33297/totoro-toy-figurines-toy-animation.jpg?auto=compact&cs=tinysrgb&w=400' },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialGenre = searchParams.get('genre') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<'all' | 'movies' | 'series'>(initialCategory as 'all' | 'movies' | 'series');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const showGenreFilter = category === 'all';

  return (
    <div className="min-h-screen bg-surface-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies, series, actors..."
              className="w-full pl-12 pr-4 py-3 bg-surface-900/50 border border-surface-800 rounded-xl text-white focus:outline-none focus:border-accent-500/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex bg-surface-900/50 rounded-lg p-1 border border-surface-800">
              {[
                { value: 'all', icon: Grid3X3, label: 'All' },
                { value: 'movies', icon: Film, label: 'Movies' },
                { value: 'series', icon: Tv, label: 'Series' },
              ].map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value as 'all' | 'movies' | 'series')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                    category === cat.value
                      ? 'bg-accent-500 text-white'
                      : 'text-surface-400 hover:text-white'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 bg-surface-900/50 border border-surface-800 rounded-lg text-surface-300 text-sm focus:outline-none focus:border-accent-500/50"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">IMDb Rating</option>
              <option value="year">Year</option>
              <option value="new">Newest First</option>
            </select>

            <div className="flex ml-auto gap-1 bg-surface-900/50 rounded-lg p-1 border border-surface-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-surface-700 text-white' : 'text-surface-500'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-surface-700 text-white' : 'text-surface-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Genre Filter */}
        {showGenreFilter && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-surface-500" />
              <span className="text-sm text-surface-400">Genres</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre('')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  !selectedGenre
                    ? 'bg-accent-500 text-white'
                    : 'bg-surface-800/50 text-surface-400 hover:bg-surface-800'
                }`}
              >
                All
              </button>
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedGenre === genre
                      ? 'bg-accent-500 text-white'
                      : 'bg-surface-800/50 text-surface-400 hover:bg-surface-800'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-4 text-sm text-surface-500">
          Found {mockResults.length} results
          {query && ` for "${query}"`}
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockResults.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/movie/${item.id}`}
                  className="relative block aspect-[2/3] rounded-xl overflow-hidden group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-surface-950 via-surface-950/95 to-transparent"
                  >
                    <div className="flex items-center gap-2 mb-1.5 text-xs text-surface-400">
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        {item.rating}
                      </span>
                      <span>{item.year}</span>
                      <span>{item.runtime}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.genres.slice(0, 2).map(g => (
                        <span key={g} className="px-1.5 py-0.5 text-[10px] bg-surface-700/50 rounded text-surface-400">
                          {g}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-surface-400 mt-2 line-clamp-2">{item.synopsis}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {mockResults.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/movie/${item.id}`}
                  className="flex gap-4 bg-surface-900/50 rounded-xl p-3 border border-surface-800/50 hover:border-surface-700 transition-colors group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white group-hover:text-accent-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm flex-shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                        {item.rating}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-surface-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.runtime}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.genres.map(g => (
                        <span key={g} className="px-2 py-0.5 text-xs bg-surface-800 rounded text-surface-400">
                          {g}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-surface-400 mt-2 line-clamp-2">{item.synopsis}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
