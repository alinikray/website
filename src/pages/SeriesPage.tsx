import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Tv, Loader2 } from 'lucide-react';
import { fetchDiscoverSeries, TmdbSeries } from '../lib/tmdbService';

export default function SeriesPage() {
  const [series, setSeries] = useState<TmdbSeries[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = page < totalPages;

  // Initial load
  useEffect(() => {
    setLoading(true);
    fetchDiscoverSeries(1).then(({ results, totalPages: tp }) => {
      setSeries(results);
      setTotalPages(Math.min(tp, 500));
      setPage(1);
      setLoading(false);
    });
  }, []);

  // Load next page
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    fetchDiscoverSeries(nextPage).then(({ results }) => {
      setSeries(prev => [...prev, ...results]);
      setPage(nextPage);
      setLoadingMore(false);
    });
  }, [loadingMore, hasMore, page]);

  // Intersection observer on sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pt-4 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Tv className="w-6 h-6 text-accent-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Series</h1>
          </div>
          <p className="text-gray-500">Newest releases first · {series.length} loaded</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {series.map((show, index) => (
            <motion.div
              key={`${show.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min((index % 20) * 0.03, 0.5) }}
            >
              <Link to={`/series/${show.id}`} className="group block">
                <div className="relative rounded-xl overflow-hidden">
                  <div className="aspect-[2/3] bg-dark-800">
                    {show.poster ? (
                      <img
                        src={show.poster}
                        alt={show.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tv className="w-12 h-12 text-gray-700" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded glass text-yellow-400 text-xs">
                    <Star className="w-3 h-3 fill-current" />
                    {show.rating.toFixed(1)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-semibold text-white group-hover:text-accent-400 transition-colors line-clamp-1">
                      {show.name}
                    </h3>
                    <p className="text-xs text-gray-500">{show.year || '—'} · Series</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Sentinel + loader */}
        <div ref={sentinelRef} className="flex items-center justify-center py-10">
          {loadingMore && (
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-accent-400" />
              Loading more series...
            </div>
          )}
          {!hasMore && series.length > 0 && (
            <p className="text-gray-600 text-sm">All {series.length} series loaded</p>
          )}
        </div>
      </div>
    </div>
  );
}
