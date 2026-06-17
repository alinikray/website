import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface GenreSectionProps {
  genres: string[];
}

const genreImages: Record<string, string> = {
  Action: 'https://images.pexels.com/photos/1552237/pexels-photo-1552237.jpeg?auto=compress&cs=tinysrgb&w=400',
  Drama: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=400',
  Comedy: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=400',
  Thriller: 'https://images.pexels.com/photos/3617458/pexels-photo-3617458.jpeg?auto=compress&cs=tinysrgb&w=400',
  Horror: 'https://images.pexels.com/photos/3629227/pexels-photo-3629227.jpeg?auto=compress&cs=tinysrgb&w=400',
  Romance: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Sci-Fi': 'https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=400',
  Animation: 'https://images.pexels.com/photos/3593865/pexels-photo-3593865.jpeg?auto=compress&cs=tinysrgb&w=400',
  Documentary: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=400',
  Crime: 'https://images.pexels.com/photos/1000740/pexels-photo-1000740.jpeg?auto=compress&cs=tinysrgb&w=400',
  Adventure: 'https://images.pexels.com/photos/1252500/pexels-photo-1252500.jpeg?auto=compress&cs=tinysrgb&w=400',
  Fantasy: 'https://images.pexels.com/photos/3617497/pexels-photo-3617497.jpeg?auto=compress&cs=tinysrgb&w=400',
  Mystery: 'https://images.pexels.com/photos/3807571/pexels-photo-3807571.jpeg?auto=compress&cs=tinysrgb&w=400',
  Family: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
  War: 'https://images.pexels.com/photos/3851254/pexels-photo-3851254.jpeg?auto=compress&cs=tinysrgb&w=400',
  Historical: 'https://images.pexels.com/photos/161963/belvedere-vienna-palace-austria-161963.jpeg?auto=compress&cs=tinysrgb&w=400',
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
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link to={`/search?genre=${encodeURIComponent(genre)}`} className="block">
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer group">
                {/* Background image */}
                <img
                  src={genreImages[genre] || 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={genre}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-all" />
                {/* Accent glow on hover */}
                <div className="absolute inset-0 bg-accent-600/0 group-hover:bg-accent-600/15 transition-all" />

                {/* Title */}
                <div className="absolute inset-0 flex items-end p-3">
                  <h3 className="text-sm md:text-base font-bold text-white leading-tight text-shadow">{genre}</h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
