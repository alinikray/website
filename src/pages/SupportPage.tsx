import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, ChevronLeft, Paperclip } from 'lucide-react';

const mockTickets = [
  {
    id: 'TKT-001',
    subject: 'Cannot access premium content',
    status: 'open',
    priority: 'high',
    created: 'June 15, 2026',
    lastUpdate: '2 hours ago',
    messages: [
      { sender: 'user', content: 'I have a premium subscription but cannot access premium movies. It keeps redirecting me to the subscription page.', time: 'June 15, 10:30 AM' },
      { sender: 'support', content: 'Thank you for reaching out. We\'re looking into this issue. Could you please provide your account email?', time: 'June 15, 11:00 AM' },
      { sender: 'user', content: 'Sure, it\'s john.doe@email.com', time: 'June 15, 11:15 AM' },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Subtitle sync issue',
    status: 'resolved',
    priority: 'low',
    created: 'June 10, 2026',
    lastUpdate: '3 days ago',
    messages: [
      { sender: 'user', content: 'The subtitles are out of sync in Dune: Part Two at around 45:30', time: 'June 10, 3:00 PM' },
      { sender: 'support', content: 'Thank you for reporting this. We\'ve fixed the subtitle timing. Please try again.', time: 'June 11, 9:00 AM' },
      { sender: 'user', content: 'Thanks, it\'s working now!', time: 'June 11, 10:30 AM' },
    ],
  },
];

export default function SupportPage() {
  const [view, setView] = useState<'list' | 'new' | 'ticket'>('list');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'medium' });
  const [reply, setReply] = useState('');

  const currentTicket = mockTickets.find(t => t.id === selectedTicket);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setView('list');
    setNewTicket({ subject: '', message: '', priority: 'medium' });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    setReply('');
  };

  return (
    <div className="min-h-screen bg-surface-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Support Center</h1>
            <p className="text-surface-400 mt-1">Get help with your issues</p>
          </div>
          {view === 'list' && (
            <button
              onClick={() => setView('new')}
              className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg text-white font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              New Ticket
            </button>
          )}
          {view === 'ticket' && (
            <button
              onClick={() => { setView('list'); setSelectedTicket(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-surface-800 hover:bg-surface-700 rounded-lg text-surface-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to List
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Open Tickets', value: '3', color: 'bg-blue-500/20 text-blue-400' },
                  { label: 'In Progress', value: '2', color: 'bg-yellow-500/20 text-yellow-400' },
                  { label: 'Resolved', value: '15', color: 'bg-green-500/20 text-green-400' },
                ].map(stat => (
                  <div key={stat.label} className="bg-surface-900/50 rounded-xl border border-surface-800/50 p-4 text-center">
                    <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                    <p className="text-sm text-surface-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {mockTickets.map((ticket, i) => (
                  <motion.button
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { setSelectedTicket(ticket.id); setView('ticket'); }}
                    className="w-full text-left bg-surface-900/50 rounded-xl border border-surface-800/50 p-4 hover:border-surface-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-surface-500 font-mono">{ticket.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            ticket.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-surface-700 text-surface-400'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <h3 className="font-medium text-white truncate">{ticket.subject}</h3>
                        <p className="text-xs text-surface-500 mt-1">Created {ticket.created}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                          ticket.status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                          ticket.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {ticket.status === 'open' && <AlertCircle className="w-3 h-3" />}
                          {ticket.status === 'in_progress' && <Clock className="w-3 h-3" />}
                          {ticket.status === 'resolved' && <CheckCircle className="w-3 h-3" />}
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <p className="text-xs text-surface-500 mt-1">{ticket.lastUpdate}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'new' && (
            <motion.div
              key="new"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-surface-900/50 rounded-xl border border-surface-800/50 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => setView('list')}
                    className="p-2 rounded-lg hover:bg-surface-800 text-surface-400"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-white">Create New Ticket</h2>
                </div>

                <form onSubmit={handleSubmitTicket} className="space-y-6">
                  <div>
                    <label className="block text-sm text-surface-400 mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={newTicket.subject}
                      onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-surface-400 mb-2">Priority *</label>
                    <div className="flex gap-3">
                      {['low', 'medium', 'high'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewTicket({ ...newTicket, priority: p })}
                          className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                            newTicket.priority === p
                              ? p === 'high' ? 'bg-red-500/20 border-red-500 text-red-400' :
                                p === 'medium' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' :
                                'bg-surface-700 border-surface-600 text-surface-300'
                              : 'bg-surface-800/50 border-surface-700 text-surface-400 hover:border-surface-600'
                          }`}
                        >
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-surface-400 mb-2">Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={newTicket.message}
                      onChange={e => setNewTicket({ ...newTicket, message: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors resize-none"
                      placeholder="Describe your issue in detail..."
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 text-surface-400 hover:text-white transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      Attach Files
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg text-white font-medium transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {view === 'ticket' && currentTicket && (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-surface-900/50 rounded-xl border border-surface-800/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-800/50">
                  <div className="flex items-center gap-2 text-xs text-surface-500 font-mono mb-1">
                    {currentTicket.id}
                    <span className={`px-2 py-0.5 rounded ${
                      currentTicket.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      currentTicket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-surface-700 text-surface-400'
                    }`}>
                      {currentTicket.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${
                      currentTicket.status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {currentTicket.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">{currentTicket.subject}</h2>
                </div>

                {/* Messages */}
                <div className="max-h-96 overflow-y-auto p-6 space-y-4">
                  {currentTicket.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-4 ${
                          msg.sender === 'user'
                            ? 'bg-accent-500/20 border border-accent-500/30'
                            : 'bg-surface-800/50 border border-surface-700'
                        }`}
                      >
                        <p className="text-sm text-white">{msg.content}</p>
                        <p className="text-xs text-surface-500 mt-2">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply */}
                <form onSubmit={handleSendReply} className="px-6 py-4 border-t border-surface-800/50">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 bg-surface-800/50 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg text-white transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
