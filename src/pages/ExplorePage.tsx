import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronUp } from 'lucide-react';

const exploreContent = [
  {
    id: 1,
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    video: 'https://images.pexels.com/photos/3915398/pexels-photo-3915398.jpeg?auto=compress&cs=tinysrgb&w=800',
    poster: 'https://images.pexels.com/photos/3915398/pexels-photo-3915398.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 8.8,
  },
  {
    id: 2,
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    video: 'https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compress&cs=tinysrgb&w=800',
    poster: 'https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 8.9,
  },
  {
    id: 3,
    title: 'Stranger Things',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces.',
    video: 'https://images.pexels.com/photos/33297/totoro-toy-figurines-toy-animation.jpg?auto=compress&cs=tinysrgb&w=800',
    poster: 'https://images.pexels.com/photos/33297/totoro-toy-figurines-toy-animation.jpg?auto=compress&cs=tinysrgb&w=800',
    rating: 8.7,
  },
  {
    id: 4,
    title: 'The Batman',
    description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.',
    video: 'https://images.pexels.com/photos/1667580/pexels-photo-1667580.jpeg?auto=compress&cs=tinysrgb&w=800',
    poster: 'https://images.pexels.com/photos/1667580/pexels-photo-1667580.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 7.8,
  },
];

export default function ExplorePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showSpeaker, setShowSpeaker] = useState(true);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (showSpeaker) {
      const timer = setTimeout(() => setShowSpeaker(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSpeaker]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 10) {
      setShowSwipeHint(false);
      if (currentIndex < exploreContent.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    } else if (e.deltaY < -10) {
      setShowSwipeHint(false);
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      setShowSwipeHint(false);
      if (diff > 0 && currentIndex < exploreContent.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
    setTouchStart(null);
  };

  const currentItem = exploreContent[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-surface-950 overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${currentItem.poster})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-950/40 via-surface-950/60 to-surface-950" />

          <div className="absolute bottom-0 left-0 right-0 p-6 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded bg-accent-500/20 text-accent-400 text-xs font-medium">
                  IMDb {currentItem.rating}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{currentItem.title}</h2>
              <p className="text-surface-300 max-w-md line-clamp-2">{currentItem.description}</p>
              <div className="flex items-center gap-3 mt-4">
                <button className="px-6 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg text-white font-medium transition-colors">
                  Watch Now
                </button>
                <button className="px-6 py-2 bg-surface-800/80 hover:bg-surface-800 rounded-lg text-white font-medium transition-colors">
                  More Info
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Sound toggle */}
      {showSpeaker && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setMuted(!muted);
            setShowSpeaker(true);
          }}
          className="absolute top-4 right-4 p-3 bg-surface-800/60 backdrop-blur-sm rounded-full z-20"
        >
          {muted ? (
            <VolumeX className="w-5 h-5 text-surface-300" />
          ) : (
            <Volume2 className="w-5 h-5 text-surface-300" />
          )}
        </motion.button>
      )}

      {/* Navigation dots */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
        {exploreContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-accent-400 h-6' : 'bg-surface-600'
            }`}
          />
        ))}
      </div>

      {/* Swipe hint */}
      <AnimatePresence>
        {showSwipeHint && currentIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-surface-400 z-20"
          >
            <ChevronUp className="w-5 h-5 animate-bounce" />
            <span className="text-sm">Swipe Up</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
