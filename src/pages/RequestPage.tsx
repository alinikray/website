import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Tv, Check, Send } from 'lucide-react';

export default function RequestPage() {
  const [type, setType] = useState<'movie' | 'series'>('movie');
  const [form, setForm] = useState({ title: '', year: '', director: '', notes: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-display text-white mb-3">Request a Movie or Series</h1>
          <p className="text-gray-400">Can't find what you're looking for? Let us know and we'll work to add it to our library.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          {sent ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Request Submitted!</h3>
              <p className="text-gray-400 mb-4">Thank you for your request. Our content team will review it within 3–5 business days.</p>
              <button onClick={() => { setSent(false); setForm({ title: '', year: '', director: '', notes: '' }); }} className="text-accent-400 hover:text-accent-300 text-sm transition-colors">
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Content Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setType('movie')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${type === 'movie' ? 'bg-accent-600 text-white' : 'glass text-gray-400 hover:text-white'}`}
                  >
                    <Film className="w-4 h-4" />
                    Movie
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('series')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${type === 'series' ? 'bg-accent-600 text-white' : 'glass text-gray-400 hover:text-white'}`}
                  >
                    <Tv className="w-4 h-4" />
                    Series
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={`Enter ${type} title (Persian or English)`}
                  required
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Release Year</label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                    placeholder="e.g. 2023"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Director / Creator</label>
                  <input
                    type="text"
                    value={form.director}
                    onChange={e => setForm(f => ({ ...f, director: e.target.value }))}
                    placeholder="Director name"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Additional Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Why should we add this? Any links or references?"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <button type="submit" className="flex items-center gap-2 btn-primary w-full justify-center">
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
