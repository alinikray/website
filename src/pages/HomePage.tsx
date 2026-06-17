import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import GenreSection from '../components/GenreSection';
import MostDiscussed from '../components/MostDiscussed';

const featuredContent = [
  {
    id: 1,
    title: 'Dune: Part Two',
    tagline: 'The saga continues',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    backdrop: 'https://images.pexels.com/photos/3915398/pexels-photo-3915398.jpeg?auto=compress&cs=tinysrgb&w=1920',
    rating: 8.8,
    year: 2024,
  },
  {
    id: 2,
    title: 'Oppenheimer',
    tagline: 'The world forever changes',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    backdrop: 'https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compress&cs=tinysrgb&w=1920',
    rating: 8.9,
    year: 2023,
  },
  {
    id: 3,
    title: 'Stranger Things',
    tagline: 'The final chapter',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces.',
    backdrop: 'https://images.pexels.com/photos/33297/totoro-toy-figurines-toy-animation.jpg?auto=compress&cs=tinysrgb&w=1920',
    rating: 8.7,
    year: 2025,
  },
];

const trendingNow = [
  { id: 1, title: 'The Batman', image: 'https://images.pexels.com/photos/1667580/pexels-photo-1667580.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 7.8 },
  { id: 2, title: 'Avatar: Fire', image: 'https://images.pexels.com/photos/2799110/pexels-photo-2799110.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 8.2 },
  { id: 3, title: 'Inception', image: 'https://images.pexels.com/photos/3014847/pexels-photo-3014847.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 8.8 },
  { id: 4, title: 'Interstellar', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 8.6 },
  { id: 5, title: 'The Matrix', image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 8.7 },
  { id: 6, title: 'Blade Runner', image: 'https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 8.1 },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredContent.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        {featuredContent.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.7 }}
            className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.backdrop})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-surface-950/30" />
          </motion.div>
        ))}

        <div className="absolute inset-0 flex items-center z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-400 text-sm mb-4">
                Featured
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
                {featuredContent[currentSlide].title}
              </h1>
              <p className="text-lg text-surface-300 mb-2">{featuredContent[currentSlide].tagline}</p>
              <p className="text-surface-400 mb-6 line-clamp-2 max-w-xl">
                {featuredContent[currentSlide].description}
              </p>
              <div className="flex items-center gap-4 mb-8">
                <span className="flex items-center gap-1 text-yellow-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  {featuredContent[currentSlide].rating}
                </span>
                <span className="text-surface-500">|</span>
                <span className="text-surface-400">{featuredContent[currentSlide].year}</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to={`/movie/${featuredContent[currentSlide].id}`}
                  className="flex items-center gap-2 px-8 py-3 bg-accent-500 hover:bg-accent-600 rounded-xl text-white font-medium transition-all shadow-lg shadow-accent-500/20"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </Link>
                <Link
                  to={`/movie/${featuredContent[currentSlide].id}`}
                  className="flex items-center gap-2 px-8 py-3 bg-surface-800/80 hover:bg-surface-800 rounded-xl text-white font-medium transition-all backdrop-blur-sm"
                >
                  <Info className="w-5 h-5" />
                  More Info
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {featuredContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-accent-400 w-6' : 'bg-surface-600 hover:bg-surface-500'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-surface-800/50 hover:bg-surface-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-surface-800/50 hover:bg-surface-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          >
            {trendingNow.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-48"
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
                    <svg className="w-3 h-3 fill-current text-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    {item.rating}
                  </div>
                </Link>
                <h3 className="text-sm font-medium text-surface-300 mt-2 truncate">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GenreSection />
      <MostDiscussed />
    </div>
  );
}
