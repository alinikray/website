import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Heart,
  Bookmark,
  Share2,
  Star,
  Calendar,
  Clock,
  Globe,
  ChevronDown,
  ChevronUp,
  Download,
  MessageCircle,
  Award,
  Users,
  Clapperboard,
} from 'lucide-react';

const movieData = {
  id: 1,
  title: 'Dune: Part Two',
  year: 2024,
  rating: 8.8,
  runtime: '2h 46m',
  genres: ['Sci-Fi', 'Adventure', 'Drama'],
  language: 'English',
  country: 'USA',
  director: 'Denis Villeneuve',
  synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
  backdrop: 'https://images.pexels.com/photos/3915398/pexels-photo-3915398.jpeg?auto=compress&cs=tinysrgb&w=1920',
  poster: 'https://images.pexels.com/photos/3915398/pexels-photo-3915398.jpeg?auto=compress&cs=tinysrgb&w=600',
  cast: [
    { name: 'Timothée Chalamet', role: 'Paul Atreides', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Zendaya', role: 'Chani', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Rebecca Ferguson', role: 'Lady Jessica', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Austin Butler', role: 'Feyd-Rautha', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200' },
  ],
  reviews: [
    { author: 'MovieBuff42', rating: 9, content: 'A masterpiece of science fiction cinema. Villeneuve has outdone himself.', date: 'Mar 15, 2024' },
    { author: 'CinemaLover', rating: 10, content: 'Visually stunning with incredible performances. This is epic filmmaking at its finest.', date: 'Mar 10, 2024' },
  ],
  awards: ['Best Visual Effects - Academy Awards', 'Best Cinematography - BAFTA', 'Best Sound - Critics\' Choice'],
  downloads: [
    { quality: '1080p', size: '2.4 GB', subtitles: 'English, Spanish, French' },
    { quality: '720p', size: '1.2 GB', subtitles: 'English' },
    { quality: '480p', size: '600 MB', subtitles: 'English' },
  ],
};

function Accordion({ title, icon: Icon, children, defaultOpen = false }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-surface-900/50 rounded-xl border border-surface-800/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-accent-400" />
          <span className="font-semibold text-white">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-surface-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-surface-400" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MovieDetailPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const movie = movieData;

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/80 to-surface-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-surface-950/30" />

        <div className="absolute inset-0 flex items-end z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <div className="flex gap-8">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:block w-56 flex-shrink-0"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full rounded-xl shadow-2xl shadow-black/50"
                />
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 pb-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  {movie.genres.map(g => (
                    <span key={g} className="px-3 py-1 rounded-full bg-surface-800/50 text-surface-300 text-sm">
                      {g}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
                <div className="flex items-center flex-wrap gap-4 text-surface-400 mb-4">
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    {movie.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {movie.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {movie.runtime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {movie.language}
                  </span>
                </div>
                <p className="text-surface-300 max-w-2xl mb-6">{movie.synopsis}</p>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-8 py-3 bg-accent-500 hover:bg-accent-600 rounded-xl text-white font-medium transition-all shadow-lg shadow-accent-500/20">
                    <Play className="w-5 h-5 fill-current" />
                    Watch Now
                  </button>
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-3 rounded-xl border transition-all ${
                      isSaved
                        ? 'bg-accent-500 border-accent-500 text-white'
                        : 'bg-surface-800/50 border-surface-700 text-surface-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-xl border transition-all ${
                      isLiked
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-surface-800/50 border-surface-700 text-surface-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-xl bg-surface-800/50 border border-surface-700 text-surface-400 hover:text-white transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Accordion title="Story" icon={Clapperboard} defaultOpen>
              <p className="text-surface-300 leading-relaxed">{movie.synopsis}</p>
              <div className="mt-4 text-sm text-surface-500">
                <span>Directed by </span>
                <span className="text-white">{movie.director}</span>
              </div>
            </Accordion>

            <Accordion title="Cast" icon={Users}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {movie.cast.map(person => (
                  <div key={person.name} className="text-center">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                    />
                    <p className="text-sm font-medium text-white">{person.name}</p>
                    <p className="text-xs text-surface-500">{person.role}</p>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="Production" icon={Clapperboard}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-surface-500">Director</p>
                  <p className="text-white">{movie.director}</p>
                </div>
                <div>
                  <p className="text-surface-500">Language</p>
                  <p className="text-white">{movie.language}</p>
                </div>
                <div>
                  <p className="text-surface-500">Country</p>
                  <p className="text-white">{movie.country}</p>
                </div>
                <div>
                  <p className="text-surface-500">Runtime</p>
                  <p className="text-white">{movie.runtime}</p>
                </div>
              </div>
            </Accordion>

            <Accordion title="Reviews" icon={MessageCircle}>
              <div className="space-y-4">
                {movie.reviews.map((review, i) => (
                  <div key={i} className="bg-surface-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{review.author}</span>
                      <span className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        {review.rating}/10
                      </span>
                    </div>
                    <p className="text-surface-300 text-sm">{review.content}</p>
                    <p className="text-xs text-surface-500 mt-2">{review.date}</p>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="Awards" icon={Award}>
              <ul className="space-y-2">
                {movie.awards.map((award, i) => (
                  <li key={i} className="flex items-start gap-2 text-surface-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                    {award}
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion title="Download" icon={Download}>
              <div className="space-y-3">
                {movie.downloads.map((dl, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-surface-800/30 rounded-lg p-4"
                  >
                    <div>
                      <span className="font-medium text-white">{dl.quality}</span>
                      <span className="text-surface-500 mx-2">•</span>
                      <span className="text-surface-400">{dl.size}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-surface-500">{dl.subtitles}</span>
                      <button className="px-4 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg text-white text-sm transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-surface-900/50 rounded-xl border border-surface-800/50 p-6 sticky top-20">
              <h3 className="font-semibold text-white mb-4">More Like This</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Link
                    key={i}
                    to={`/movie/${i + 2}`}
                    className="flex gap-3 group"
                  >
                    <img
                      src={`https://images.pexels.com/photos/${[384555, 2799110, 1667580][i - 1]}/pexels-photo-${[384555, 2799110, 1667580][i - 1]}.jpeg?auto=compress&cs=tinysrgb&w=200`}
                      alt=""
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white group-hover:text-accent-400 transition-colors truncate">
                        {['Blade Runner 2049', 'Arrival', 'The Batman'][i - 1]}
                      </p>
                      <p className="text-xs text-surface-500 mt-0.5">{[2017, 2016, 2022][i - 1]}</p>
                      <div className="flex items-center gap-1 mt-1 text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {[8.0, 7.9, 7.8][i - 1]}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
