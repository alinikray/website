import { forwardRef, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Play, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie, Series } from '../types';

interface ContentRowProps {
  title: string;
  titlePersian?: string;
  items: (Movie | Series)[];
  type: 'movie' | 'series' | 'mixed';
  showBadge?: boolean;
}

const ContentRow = forwardRef<HTMLDivElement, ContentRowProps>(
  ({ title, titlePersian, items, type, showBadge }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction: 'left' | 'right') => {
      if (!scrollRef.current) return;
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    };

    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    return (
      <div ref={ref} className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 px-4 sm:px-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
            {titlePersian && (
              <p className="text-sm text-gray-500 mt-0.5">{titlePersian}</p>
            )}
          </div>
          <Link
            to={`/${type === 'series' ? 'search?type=series' : 'search'}`}
            className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
          >
            See All
          </Link>
        </div>

        {/* Content Slider */}
        <div className="relative group">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 md:p-4 rounded-full glass shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-dark-700"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 md:p-4 rounded-full glass shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-dark-700"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          )}

          {/* Items */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-4"
          >
            {items.map((item, index) => (
              <ContentCard
                key={item.id}
                item={item}
                type={type}
                index={index}
                showBadge={showBadge}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ContentRow.displayName = 'ContentRow';

export default ContentRow;

interface ContentCardProps {
  item: Movie | Series;
  type: string;
  index: number;
  showBadge?: boolean;
}

function ContentCard({ item, index, showBadge }: ContentCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const isMovie = 'duration' in item;
  const linkPath = isMovie ? `/movie/${item.id}` : `/series/${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="flex-shrink-0 w-[160px] md:w-[190px] group/card"
    >
      <Link to={linkPath}>
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-800">
          <img
            src={item.poster}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <div className="w-12 h-12 rounded-full bg-accent-600 flex items-center justify-center shadow-glow">
                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
              </div>
            </motion.div>
          </div>

          {/* NEW badge */}
          {showBadge && (item as Movie).isNewRelease && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent-600 text-white text-xs font-bold">
              NEW
            </div>
          )}

          {/* Rating */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-yellow-400 text-xs font-bold">
            <Star className="w-3 h-3 fill-current" />
            {item.rating}
          </div>

          {/* Save button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(s => !s);
            }}
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover/card:opacity-100 ${
              isSaved ? 'bg-accent-600 text-white' : 'bg-black/60 backdrop-blur-sm text-gray-300'
            }`}
          >
            <Plus className={`w-4 h-4 transition-transform ${isSaved ? 'rotate-45' : ''}`} />
          </motion.button>
        </div>
      </Link>

      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover/card:text-accent-400 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
          <span>{item.year}</span>
          {isMovie && 'duration' in item && (
            <>
              <span>·</span>
              <span>{Math.floor((item as Movie).duration / 60)}h{(item as Movie).duration % 60}m</span>
            </>
          )}
          {!isMovie && 'seasons' in item && (
            <>
              <span>·</span>
              <span>{(item as Series).seasons.length}S</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
