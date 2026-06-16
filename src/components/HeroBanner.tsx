import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie, Series } from '../types';

interface HeroBannerProps {
  content: Movie | Series;
}

export default function HeroBanner({ content }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    content,
    {
      id: 'movie-5',
      title: 'The Golden Cage',
      titlePersian: 'قفس طلایی',
      year: 2024,
      rating: 8.9,
      backdrop: 'https://images.pexels.com/photos/1813273/pexels-photo-1813273.jpeg?auto=compress&cs=tinysrgb&w=1920',
      genres: ['Drama', 'Family'],
      description: 'A wealthy family\'s facade begins to crumble when buried secrets come to light during a birthday celebration.',
    },
    {
      id: 'series-1',
      title: 'The Capital',
      titlePersian: 'پایتخت',
      year: 2011,
      rating: 9.1,
      backdrop: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1920',
      genres: ['Comedy', 'Drama', 'Family'],
      description: 'Iran\'s most beloved comedy series follows the misadventures of Naqi and Arastoo.',
    },
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const currentContent = slides[currentSlide];

  return (
    <div
      className="relative h-[70vh] md:h-[85vh] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentContent.backdrop})` }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/50" />
          <div className="absolute inset-0 bg-gradient-to-l from-dark-900/90 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-end pb-20 md:pb-32">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl space-y-4"
        >
          {/* Badge */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-accent-600 text-white text-xs font-semibold">
              Featured
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold">{currentContent.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-white text-shadow-lg">
            {currentContent.title}
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-300">
            {currentContent.titlePersian} ({currentContent.year})
          </h2>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {currentContent.genres?.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 rounded-full glass text-gray-300 text-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-base md:text-lg line-clamp-3 max-w-xl">
            {currentContent.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to={`/movie/${currentContent.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 btn-primary px-8 py-3.5 text-lg"
              >
                <Play className="w-6 h-6 fill-current" />
                Watch Now
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 btn-secondary px-8 py-3.5 text-lg"
            >
              <Plus className="w-6 h-6" />
              My List
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 btn-secondary"
            >
              <Info className="w-5 h-5" />
              More Info
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-accent-500'
                : 'w-1.5 bg-gray-500 hover:bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass opacity-0 hover:opacity-100 transition-opacity group"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:text-accent-400 transition-colors" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass opacity-0 hover:opacity-100 transition-opacity group"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:text-accent-400 transition-colors" />
      </button>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-500 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
            className="w-1.5 h-1.5 rounded-full bg-accent-500"
          />
        </div>
      </motion.div>
    </div>
  );
}
