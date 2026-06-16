import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface GenreSectionProps {
  genres: string[];
}

const genreColors: Record<string, string> = {
  Action: 'from-red-600 to-orange-600',
  Drama: 'from-blue-600 to-indigo-600',
  Comedy: 'from-yellow-500 to-amber-600',
  Thriller: 'from-slate-600 to-gray-700',
  Horror: 'from-red-800 to-rose-900',
  Romance: 'from-pink-500 to-rose-600',
  'Sci-Fi': 'from-cyan-500 to-blue-600',
  Animation: 'from-purple-500 to-fuchsia-600',
  Documentary: 'from-emerald-600 to-teal-700',
  Crime: 'from-gray-700 to-neutral-800',
  Adventure: 'from-orange-500 to-red-600',
  Fantasy: 'from-indigo-500 to-violet-600',
  Mystery: 'from-slate-600 to-indigo-700',
  Family: 'from-green-500 to-emerald-600',
};

const genreIcons: Record<string, string> = {
  Action: '💥',
  Drama: '🎭',
  Comedy: '😂',
  Thriller: '🔪',
  Horror: '👻',
  Romance: '❤️',
  'Sci-Fi': '🚀',
  Animation: '🎨',
  Documentary: '📹',
  Crime: '🔫',
  Adventure: '🗺️',
  Fantasy: '🧙',
  Mystery: '🔍',
  Family: '👨‍👩‍👧‍👦',
};

export default function GenreSection({ genres }: GenreSectionProps) {
  return (
    <div className="px-4 sm:px-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">Browse by Genre</h2>
        <p className="text-sm text-gray-500 mt-0.5">مرور بر اساس ژانر</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        {genres.map((genre, index) => (
          <motion.div
            key={genre}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={`/search?genre=${encodeURIComponent(genre)}`}
              className="block"
            >
              <div
                className={`relative p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br ${
                  genreColors[genre] || 'from-accent-600 to-accent-800'
                } cursor-pointer overflow-hidden group`}
              >
                {/* Background Icon */}
                <div className="absolute -bottom-2 -right-2 text-6xl opacity-20 transform group-hover:scale-110 transition-transform">
                  {genreIcons[genre]}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <span className="text-2xl md:text-3xl">{genreIcons[genre]}</span>
                  <h3 className="mt-2 text-sm md:text-base font-bold text-white">{genre}</h3>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-white/0 group-hover:bg-white/10 transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
