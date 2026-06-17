import { Link } from 'react-router-dom';
import { Flame, Trophy, Clock, Star, Sparkles, Tv, Film, Heart } from 'lucide-react';

const chips = [
  { label: 'Trending', icon: Flame, href: '/search?sort=trending', color: 'text-orange-400' },
  { label: 'Top 250', icon: Trophy, href: '/search?sort=top250', color: 'text-yellow-400' },
  { label: 'New Releases', icon: Sparkles, href: '/search?sort=new', color: 'text-blue-400' },
  { label: 'Coming Soon', icon: Clock, href: '/search?sort=upcoming', color: 'text-teal-400' },
  { label: 'Top Rated', icon: Star, href: '/search?sort=rating', color: 'text-amber-400' },
  { label: 'TV Series', icon: Tv, href: '/series', color: 'text-purple-400' },
  { label: 'Movies', icon: Film, href: '/movies', color: 'text-pink-400' },
  { label: 'Fan Favorites', icon: Heart, href: '/search?sort=favorites', color: 'text-red-400' },
];

export default function DiscoveryBar() {
  return (
    <div className="bg-surface-900/50 border-b border-surface-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {chips.map(chip => (
            <Link
              key={chip.label}
              to={chip.href}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-800/50 hover:bg-surface-800 border border-surface-700/50 hover:border-surface-600 transition-all whitespace-nowrap group"
            >
              <chip.icon className={`w-4 h-4 ${chip.color} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium text-surface-300 group-hover:text-white transition-colors">
                {chip.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
