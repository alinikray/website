import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, TrendingUp, Flame } from 'lucide-react';

const discussedItems = [
  {
    id: 1,
    title: 'Dune: Part Two',
    image: 'https://images.pexels.com/photos/3915398/pexels-photo-3915398.jpeg?auto=compress&cs=tinysrgb&w=400',
    comments: 2847,
    trending: +156,
    hot: true,
  },
  {
    id: 2,
    title: 'Oppenheimer',
    image: 'https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compress&cs=tinysrgb&w=400',
    comments: 2156,
    trending: +89,
    hot: true,
  },
  {
    id: 3,
    title: 'Stranger Things S5',
    image: 'https://images.pexels.com/photos/33297/totoro-toy-figurines-toy-animation.jpg?auto=compress&cs=tinysrgb&w=400',
    comments: 1834,
    trending: +234,
    hot: true,
  },
  {
    id: 4,
    title: 'The Batman 2',
    image: 'https://images.pexels.com/photos/1667580/pexels-photo-1667580.jpeg?auto=compress&cs=tinysrgb&w=400',
    comments: 1567,
    trending: +45,
    hot: false,
  },
  {
    id: 5,
    title: 'Avatar 3',
    image: 'https://images.pexels.com/photos/2799110/pexels-photo-2799110.jpeg?auto=compress&cs=tinysrgb&w=400',
    comments: 1423,
    trending: +67,
    hot: false,
  },
];

export default function MostDiscussed() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-accent-400" />
            <h2 className="text-2xl font-bold text-white">Most Discussed</h2>
          </div>
          <Link
            to="/search?sort=discussed"
            className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {discussedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/movie/${item.id}`}
                className="relative block rounded-xl overflow-hidden group aspect-[2/3]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />

                {item.hot && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/90 backdrop-blur-sm">
                    <Flame className="w-3 h-3 text-white" />
                    <span className="text-xs font-medium text-white">Hot</span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-semibold text-white text-sm line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-surface-400">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="text-xs">{item.comments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-xs">{item.trending}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
