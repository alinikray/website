import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const genres = [
  {
    name: 'Action',
    slug: 'action',
    image: 'https://images.pexels.com/photos/2799110/pexels-photo-2799110.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Comedy',
    slug: 'comedy',
    image: 'https://images.pexels.com/photos/3014847/pexels-photo-3014847.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Drama',
    slug: 'drama',
    image: 'https://images.pexels.com/photos/3915398/pexels-photo-3915398.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Horror',
    slug: 'horror',
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Sci-Fi',
    slug: 'sci-fi',
    image: 'https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Romance',
    slug: 'romance',
    image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Thriller',
    slug: 'thriller',
    image: 'https://images.pexels.com/photos/1667580/pexels-photo-1667580.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Animation',
    slug: 'animation',
    image: 'https://images.pexels.com/photos/33297/totoro-toy-figurines-toy-animation.jpg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function GenreSection() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Browse by Genre</h2>
          <Link
            to="/search"
            className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/search?genre=${genre.slug}`}
                className="relative block aspect-video rounded-xl overflow-hidden group"
              >
                <img
                  src={genre.image}
                  alt={genre.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-accent-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white">{genre.name}</h3>
                  <p className="text-xs text-surface-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore titles
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
