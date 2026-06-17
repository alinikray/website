import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-surface-950 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-surface-400 max-w-2xl mx-auto">
            Have questions, feedback, or want to collaborate? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: Mail, label: 'Email', value: 'hello@fynexmovies.com' },
            { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
            { icon: MapPin, label: 'Headquarters', value: 'San Francisco, CA' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-900/50 rounded-xl p-6 border border-surface-800/50 text-center"
            >
              <item.icon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <p className="text-sm text-surface-500">{item.label}</p>
              <p className="text-white font-medium mt-1">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-surface-900/50 rounded-2xl p-8 border border-surface-800/50">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                <p className="text-surface-400">We'll get back to you within 24-48 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg text-white transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-surface-400 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-400 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-surface-400 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm text-surface-400 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 rounded-lg text-white font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
