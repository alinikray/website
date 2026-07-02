import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Tv } from 'lucide-react';
import { fetchDiscoverSeries, TmdbSeries } from '../lib/tmdbService';
import CinematicLoader from '../components/CinematicLoader';

export default function SeriesPage() {
  const [series, setSeries] = useState<TmdbSeries[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDiscoverSeries(page).then(({ results, totalPages: tp }) => {
      setSeries(results);
      setTotalPages(Math.min(tp, 500));
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [page]);

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pt-4 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Tv className="w-6 h-6 text-accent-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Series</h1>
          </div>
          <p className="text-gray-500">Newest releases first · Page {page} of {totalPages}</p>
        </div>

        {loading ? (
          <CinematicLoader />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {series.map((show, index) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.6) }}
                >
                  <Link to={`/series/${show.id}`} className="group block">
                    <div className="relative rounded-xl overflow-hidden">
                      <div className="aspect-[2/3] bg-dark-800">
                        {show.poster ? (
                          <img
                            src={show.poster}
                            alt={show.name}
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

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-gray-400 text-sm">
                Page <span className="text-white font-semibold">{page}</span> of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
