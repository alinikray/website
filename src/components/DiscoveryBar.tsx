import { useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const chips = [
  { label: 'Trending', emoji: '🔥', href: '/search?sort=trending' },
  { label: 'Top 250', emoji: '🏆', href: '/search?sort=top250' },
  { label: 'Box Office', emoji: '🎬', href: '/search?sort=boxoffice' },
  { label: 'Coming Soon', emoji: '🚀', href: '/search?sort=coming' },
  { label: 'Popular Series', emoji: '📈', href: '/search?type=series&sort=popular' },
  { label: 'Most Discussed', emoji: '💬', href: '/search?sort=discussed' },
  { label: 'Editor Picks', emoji: '⭐', href: '/search?sort=editor' },
];

export default function DiscoveryBar() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const activeSort = searchParams.get('sort');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-dark-900/90 backdrop-blur-xl border-b border-dark-800/60"
    >
      <div
        ref={rowRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide"
      >
        {chips.map((chip) => {
          const isActive = activeSort === chip.href.split('sort=')[1]?.split('&')[0];
          return (
            <Link
              key={chip.label}
              to={chip.href}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-accent-600 text-white shadow-glow'
                  : 'bg-dark-800/60 text-gray-400 hover:text-white hover:bg-dark-700/60 border border-dark-700/50'
              }`}
            >
              <span>{chip.emoji}</span>
              <span>{chip.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
