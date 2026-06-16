import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Film, Calendar, MapPin, Award } from 'lucide-react';
import { movies, series } from '../data/mockData';
import { Movie, Series } from '../types';

const actorBios: Record<string, {
  bio: string;
  born: string;
  birthplace: string;
  awards: string[];
  photos: string[];
}> = {
  'cast-0': {
    bio: 'One of Iran\'s most celebrated actors, known for his powerful performances in dramatic and action films. His career spans over two decades, earning him numerous accolades and a devoted international fanbase.',
    born: 'March 12, 1978',
    birthplace: 'Tehran, Iran',
    awards: ['Best Actor - Fajr Film Festival 2022', 'Critics Choice Award 2021', 'Golden Globe Nomination 2020'],
    photos: [
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
  },
  'cast-1': {
    bio: 'A versatile actress who has brought depth and nuance to every role she has undertaken. Trained at the Tehran University of Arts, she has become a cornerstone of contemporary Iranian cinema.',
    born: 'September 5, 1985',
    birthplace: 'Isfahan, Iran',
    awards: ['Best Supporting Actress - Fajr 2023', 'Audience Choice Award 2022'],
    photos: [
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
  },
};

const defaultBio = {
  bio: 'A talented actor with a distinguished career in Iranian cinema and television. Known for captivating performances that resonate with audiences across generations.',
  born: 'January 1, 1980',
  birthplace: 'Tehran, Iran',
  awards: ['Best Actor - Fajr Film Festival', 'Outstanding Performance Award'],
  photos: [
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
};

export default function ActorProfilePage() {
  const { id } = useParams<{ id: string }>();

  // Find actor across all movie casts
  let actor = null;
  let actorMovies: Movie[] = [];
  let actorSeries: Series[] = [];

  for (const movie of movies) {
    const found = movie.cast.find(c => c.id === id);
    if (found && !actor) actor = found;
    if (movie.cast.some(c => c.id === id)) actorMovies.push(movie);
  }
  for (const s of series) {
    if (s.cast.some(c => c.id === id)) actorSeries.push(s);
  }

  const bioData = (id && actorBios[id]) ? actorBios[id] : defaultBio;

  if (!actor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Actor not found</h1>
          <Link to="/" className="text-accent-400 hover:text-accent-300">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero backdrop */}
      <div className="relative h-[40vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bioData.photos[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-dark-900/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mt-6 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row gap-6 -mt-20 relative z-10 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0"
          >
            <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-2xl overflow-hidden ring-4 ring-dark-900 shadow-2xl shadow-black/60">
              <img
                src={actor.photo}
                alt={actor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${actor!.name}&background=7C3AED&color=fff&size=180`;
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 pt-4 sm:pt-16"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{actor.name}</h1>
            <p className="text-lg text-accent-400 mb-4">{actor.namePersian}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Born {bioData.born}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {bioData.birthplace}
              </span>
              <span className="flex items-center gap-1.5">
                <Film className="w-4 h-4" />
                {actorMovies.length + actorSeries.length} credits
              </span>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Bio */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Biography</h2>
              <p className="text-gray-300 leading-relaxed">{bioData.bio}</p>
            </motion.section>

            {/* Photos */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Photos</h2>
              <div className="grid grid-cols-3 gap-3">
                {bioData.photos.map((photo, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={photo}
                      alt={`${actor.name} photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Filmography — Movies */}
            {actorMovies.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">Movies</h2>
                <div className="space-y-3">
                  {actorMovies.map((movie) => {
                    const role = movie.cast.find(c => c.id === id)?.role;
                    return (
                      <Link key={movie.id} to={`/movie/${movie.id}`}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-dark-700/40 transition-colors"
                        >
                          <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white line-clamp-1">{movie.title}</h3>
                            <p className="text-sm text-gray-500">{movie.titlePersian}</p>
                            <p className="text-xs text-accent-400 mt-1">{role}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {movie.rating}
                            </div>
                            <span className="text-xs text-gray-500">{movie.year}</span>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Filmography — Series */}
            {actorSeries.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">TV Series</h2>
                <div className="space-y-3">
                  {actorSeries.map((s) => {
                    const role = s.cast.find(c => c.id === id)?.role;
                    return (
                      <Link key={s.id} to={`/series/${s.id}`}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-dark-700/40 transition-colors"
                        >
                          <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={s.poster} alt={s.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white line-clamp-1">{s.title}</h3>
                            <p className="text-sm text-gray-500">{s.titlePersian}</p>
                            <p className="text-xs text-accent-400 mt-1">{role}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {s.rating}
                            </div>
                            <span className="text-xs text-gray-500">{s.year}</span>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* More movies with this actor CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <h3 className="text-white font-semibold mb-2">Discover More</h3>
              <p className="text-gray-400 text-sm mb-4">Find all movies and series featuring {actor.name}</p>
              <Link
                to={`/search?actor=${encodeURIComponent(actor.name)}`}
                className="inline-flex items-center gap-2 btn-primary px-6 py-2.5 text-sm"
              >
                <Film className="w-4 h-4" />
                More Movies With {actor.name.split(' ')[0]}
              </Link>
            </motion.div>
          </div>

          {/* Right sidebar — Awards */}
          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-5"
            >
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Awards & Recognition
              </h2>
              <div className="space-y-3">
                {bioData.awards.map((award, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-current" />
                    </div>
                    <p className="text-sm text-gray-300">{award}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Stats */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass rounded-2xl p-5"
            >
              <h2 className="text-lg font-bold text-white mb-4">Career Stats</h2>
              <div className="space-y-3">
                {[
                  { label: 'Movies', value: actorMovies.length },
                  { label: 'TV Series', value: actorSeries.length },
                  { label: 'Awards', value: bioData.awards.length },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{stat.label}</span>
                    <span className="text-white font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
