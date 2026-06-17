import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Plus, Send, Clock, CheckCircle2, AlertCircle,
  ChevronRight, X, Tag
} from 'lucide-react';

type TicketStatus = 'open' | 'in_progress' | 'resolved';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
  messages: { from: 'user' | 'support'; text: string; time: string }[];
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Video not playing on Safari',
    category: 'Technical',
    status: 'resolved',
    createdAt: '3 days ago',
    messages: [
      { from: 'user', text: 'The video player does not load on Safari 17. I see a blank screen.', time: '3 days ago' },
      { from: 'support', text: 'Hi! Thanks for reaching out. Please try clearing your Safari cache and disabling any content blockers. This usually resolves Safari playback issues.', time: '3 days ago' },
      { from: 'user', text: 'That fixed it! Thank you so much.', time: '2 days ago' },
      { from: 'support', text: 'Great to hear! Happy watching. Marking this as resolved.', time: '2 days ago' },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Wrong subtitle language showing',
    category: 'Content',
    status: 'in_progress',
    createdAt: '1 day ago',
    messages: [
      { from: 'user', text: 'The Golden Cage is showing Arabic subtitles by default even though I set Persian in preferences.', time: '1 day ago' },
      { from: 'support', text: 'Thank you for reporting this. Our content team is investigating the subtitle configuration for this title.', time: '20 hours ago' },
    ],
  },
];

const categories = ['Technical Issue', 'Content Problem', 'Billing', 'Account Access', 'General Question'];

const statusConfig: Record<TicketStatus, { label: string; color: string; icon: React.ElementType }> = {
  open: { label: 'Open', color: 'text-blue-400 bg-blue-500/20', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-yellow-400 bg-yellow-500/20', icon: AlertCircle },
  resolved: { label: 'Resolved', color: 'text-green-400 bg-green-500/20', icon: CheckCircle2 },
};

export default function SupportPage() {
  const [view, setView] = useState<'list' | 'new' | 'ticket'>('list');
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [newForm, setNewForm] = useState({ subject: '', category: categories[0], description: '' });
  const [replyText, setReplyText] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket: Ticket = {
      id: `TKT-00${tickets.length + 1}`,
      subject: newForm.subject,
      category: newForm.category,
      status: 'open',
      createdAt: 'Just now',
      messages: [{ from: 'user', text: newForm.description, time: 'Just now' }],
    };
    setTickets(prev => [ticket, ...prev]);
    setActiveTicket(ticket);
    setView('ticket');
    setNewForm({ subject: '', category: categories[0], description: '' });
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    const msg = { from: 'user' as const, text: replyText, time: 'Just now' };
    const updated = { ...activeTicket, messages: [...activeTicket.messages, msg] };
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    setActiveTicket(updated);
    setReplyText('');
    setTimeout(() => {
      const supportMsg = { from: 'support' as const, text: 'Thank you for your message. A support agent will respond shortly.', time: 'Just now' };
      setActiveTicket(prev => prev ? { ...prev, messages: [...prev.messages, supportMsg] } : prev);
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Support Center</h1>
            <p className="text-gray-400 mt-1">Get help from our team. Usually responds within 2 hours.</p>
          </div>
          {view !== 'new' && (
            <button
              onClick={() => setView('new')}
              className="flex items-center gap-2 btn-primary"
            >
              <Plus className="w-4 h-4" />
              New Ticket
            </button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* List View */}
          {view === 'list' && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {tickets.length === 0 ? (
                <div className="text-center py-20 glass rounded-2xl">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">No tickets yet</h3>
                  <p className="text-gray-400 text-sm">Create your first support ticket</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket, i) => {
                    const cfg = statusConfig[ticket.status];
                    return (
                      <motion.button
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => { setActiveTicket(ticket); setView('ticket'); }}
                        className="w-full glass rounded-xl p-4 flex items-center gap-4 hover:border-accent-500/30 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-5 h-5 text-accent-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-white font-medium group-hover:text-accent-400 transition-colors truncate">{ticket.subject}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{ticket.category}</span>
                            <span>{ticket.createdAt}</span>
                            <span>{ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${cfg.color}`}>
                          <cfg.icon className="w-3 h-3" />
                          {cfg.label}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-accent-400 transition-colors flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* New Ticket Form */}
          {view === 'new' && (
            <motion.div key="new" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setView('list')} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-white">Create New Ticket</h2>
              </div>
              <form onSubmit={handleCreateTicket} className="glass rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewForm(f => ({ ...f, category: cat }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${newForm.category === cat ? 'bg-accent-600 text-white' : 'glass text-gray-400 hover:text-white'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Subject *</label>
                  <input
                    type="text"
                    value={newForm.subject}
                    onChange={e => setNewForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Brief description of your issue"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Description *</label>
                  <textarea
                    value={newForm.description}
                    onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    required
                    rows={5}
                    className="input-field resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setView('list')} className="flex-1 py-3 rounded-xl glass text-gray-400 hover:text-white transition-all text-sm font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 btn-primary">
                    <Send className="w-4 h-4" />
                    Submit Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Ticket Detail */}
          {view === 'ticket' && activeTicket && (
            <motion.div key="ticket" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-3 mb-5">
                <button onClick={() => setView('list')} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">{activeTicket.subject}</h2>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>{activeTicket.id}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{activeTicket.category}</span>
                  </div>
                </div>
                {(() => {
                  const cfg = statusConfig[activeTicket.status];
                  return (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                      <cfg.icon className="w-3 h-3" />
                      {cfg.label}
                    </div>
                  );
                })()}
              </div>

              {/* Messages */}
              <div className="glass rounded-2xl p-4 mb-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {activeTicket.messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      msg.from === 'user' ? 'bg-accent-600/50 text-white' : 'bg-dark-700 text-gray-300'
                    }`}>
                      {msg.from === 'user' ? 'Me' : 'S'}
                    </div>
                    <div className={`max-w-[80%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm ${
                        msg.from === 'user'
                          ? 'bg-accent-600/30 text-white rounded-tr-sm'
                          : 'bg-dark-800 text-gray-300 rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-xs text-gray-600">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply */}
              {activeTicket.status !== 'resolved' && (
                <form onSubmit={handleReply} className="flex gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 input-field"
                  />
                  <button type="submit" className="btn-primary px-4 py-3 flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
