import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ListFilter as Filter, Grid3x2 as Grid3X3, List, Star, Calendar, Clock } from 'lucide-react';

const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];

const mockMovies = [
  { id: 1, title: 'Dune: Part Two', year: 2024, rating: 8.8, runtime: '2h 46m', genres: ['Sci-Fi', 'Adventure'], image: 'https://images.pexels.com/photos/3915398/pexels-photo-3915398.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, title: 'Oppenheimer', year: 2023, rating: 8.9, runtime: '3h', genres: ['Drama', 'Biography'], image: 'https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, title: 'The Batman', year: 2022, rating: 7.8, runtime: '2h 56m', genres: ['Action', 'Crime'], image: 'https://images.pexels.com/photos/1667580/pexels-photo-1667580.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, title: 'Inception', year: 2010, rating: 8.8, runtime: '2h 28m', genres: ['Sci-Fi', 'Thriller'], image: 'https://images.pexels.com/photos/2799110/pexels-photo-2799110.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 5, title: 'Interstellar', year: 2014, rating: 8.6, runtime: '2h 49m', genres: ['Sci-Fi', 'Drama'], image: 'https://images.pexels.com/photos/3014847/pexels-photo-3014847.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 6, title: 'Avatar', year: 2009, rating: 7.9, runtime: '2h 42m', genres: ['Sci-Fi', 'Action'], image: 'https://images.pexels.com/photos/33297/totoro-toy-figurines-toy-animation.jpg?auto=compress&cs=tinysrgb&w=400' },
  { id: 7, title: 'Blade Runner 2049', year: 2017, rating: 8.0, runtime: '2h 44m', genres: ['Sci-Fi', 'Drama'], image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 8, title: 'The Matrix', year: 1999, rating: 8.7, runtime: '2h 16m', genres: ['Sci-Fi', 'Action'], image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export default function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-surface-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Movies</h1>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-surface-500" />
            <span className="text-sm text-surface-400">Genres</span>
          </div>
          <div className="flex flex-wrap gap-2">
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

          <div className="flex items-center gap-3 ml-auto">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 bg-surface-900/50 border border-surface-800 rounded-lg text-surface-300 text-sm"
            >
              <option value="rating">IMDb Rating</option>
              <option value="year">Year</option>
              <option value="new">Newest</option>
            </select>

            <div className="flex bg-surface-900/50 rounded-lg p-1 border border-surface-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-surface-700 text-white' : 'text-surface-500'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-surface-700 text-white' : 'text-surface-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 text-sm text-surface-500">
          Showing {mockMovies.length} movies
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockMovies.map((item, index) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-surface-950/80 text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    {item.rating}
                  </div>
                </Link>
                <h3 className="text-sm font-medium text-surface-300 mt-2 truncate">{item.title}</h3>
                <p className="text-xs text-surface-500">{item.year} • {item.runtime}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {mockMovies.map((item, index) => (
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
                  <img src={item.image} alt={item.title} className="w-20 h-28 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-accent-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-surface-500 mt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.year}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.runtime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm mt-2">
                      <Star className="w-4 h-4 fill-current" />
                      {item.rating}
                    </div>
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
