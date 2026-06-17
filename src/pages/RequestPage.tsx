import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CircleCheck as CheckCircle, Film, Tv } from 'lucide-react';

export default function RequestPage() {
  const [form, setForm] = useState({
    title: '',
    type: 'movie',
    year: '',
    notes: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ title: '', type: 'movie', year: '', notes: '', email: '' });
  };

  return (
    <div className="min-h-screen bg-surface-950 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Request Content</h1>
          <p className="text-surface-400">
            Can't find what you're looking for? Let us know and we'll try to add it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-900/50 rounded-2xl p-8 border border-surface-800/50"
        >
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Request Submitted!</h3>
              <p className="text-surface-400 mb-6">
                We'll review your request and notify you when it becomes available.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-surface-800 hover:bg-surface-700 rounded-lg text-white transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-surface-400 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
                  placeholder="Movie or series title"
                />
              </div>

              <div>
                <label className="block text-sm text-surface-400 mb-3">Type *</label>
                <div className="flex gap-4">
                  {[
                    { value: 'movie', icon: Film, label: 'Movie' },
                    { value: 'series', icon: Tv, label: 'TV Series' },
                  ].map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: type.value })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                        form.type === type.value
                          ? 'bg-accent-500/20 border-accent-500 text-accent-400'
                          : 'bg-surface-800/50 border-surface-700 text-surface-400 hover:border-surface-600'
                      }`}
                    >
                      <type.icon className="w-5 h-5" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-surface-400 mb-2">Year (Optional)</label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={e => setForm({ ...form, year: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
                    placeholder="e.g. 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm text-surface-400 mb-2">Your Email (Optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
                    placeholder="To get notified"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-surface-400 mb-2">Additional Notes</label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors resize-none"
                  placeholder="Any additional information that might help us locate this content..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 rounded-lg text-white font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Request
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
