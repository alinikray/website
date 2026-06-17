import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film, Tv, Users, Video, BarChart3,
  Edit2, Trash2, Plus, Search,
  Clock, Eye, Heart, Bookmark, ChevronRight, DollarSign,
  Bell, MessageSquare, Flag, Headphones, Activity,
  Star, Share2, ArrowUpRight, ArrowDownRight, Crown,
} from 'lucide-react';
import { movies, series, clips } from '../data/mockData';

type Tab = 'overview' | 'content' | 'moderation' | 'support' | 'notifications' | 'analytics';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'content', label: 'Content', icon: Film },
  { id: 'moderation', label: 'Moderation', icon: Flag },
  { id: 'support', label: 'Support', icon: Headphones },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

function StatCard({ label, value, change, icon: Icon, positive, color = 'accent' }: {
  label: string; value: string; change: string; icon: React.ElementType; positive: boolean; color?: string;
}) {
  const colorMap: Record<string, string> = {
    accent: 'bg-accent-600/20 text-accent-400',
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/20 text-amber-400',
    red: 'bg-red-500/20 text-red-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };
  return (
    <motion.div whileHover={{ y: -2 }} className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </motion.div>
  );
}

const mockComments = [
  { id: 1, user: 'Reza M.', content: 'Absolutely incredible movie!', movie: 'The Last Stand', time: '2h ago', status: 'pending' },
  { id: 2, user: 'Sara K.', content: 'This content is inappropriate', movie: 'Night Watch', time: '4h ago', status: 'flagged' },
  { id: 3, user: 'Ali H.', content: 'Best Iranian film of 2024', movie: 'The Golden Cage', time: '1d ago', status: 'approved' },
];

const mockTickets = [
  { id: 'TKT-042', user: 'Mina R.', subject: 'Video not playing on iPhone', status: 'open', priority: 'high', time: '1h ago' },
  { id: 'TKT-041', user: 'Ahmad K.', subject: 'Billing issue - double charged', status: 'in_progress', priority: 'urgent', time: '3h ago' },
  { id: 'TKT-040', user: 'Negar J.', subject: 'Cannot change subtitle language', status: 'open', priority: 'medium', time: '5h ago' },
  { id: 'TKT-039', user: 'Babak H.', subject: 'Missing episodes from series', status: 'resolved', priority: 'low', time: '1d ago' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [contentType, setContentType] = useState<'movies' | 'series' | 'clips' | 'actors'>('movies');
  const [searchQuery, setSearchQuery] = useState('');
  const [announcement, setAnnouncement] = useState('');

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1 text-sm">Fynex Movies Platform Management</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Last updated: just now</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-accent-600/20 text-accent-400 border border-accent-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <StatCard label="Total Users" value="124.3K" change="+12%" positive={true} icon={Users} color="blue" />
                      <StatCard label="Active Users" value="18.7K" change="+8%" positive={true} icon={Activity} color="green" />
                      <StatCard label="Premium Users" value="4.2K" change="+22%" positive={true} icon={Crown} color="amber" />
                      <StatCard label="Total Views" value="2.8M" change="+15%" positive={true} icon={Eye} color="accent" />
                      <StatCard label="Watch Time" value="89.4K h" change="+11%" positive={true} icon={Clock} color="purple" />
                      <StatCard label="Revenue" value="$48.2K" change="+19%" positive={true} icon={DollarSign} color="green" />
                    </div>

                    {/* Revenue chart placeholder */}
                    <div className="glass rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white font-semibold">Revenue Overview</h3>
                        <select className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-xs text-gray-400 focus:outline-none">
                          <option>Last 30 days</option>
                          <option>Last 90 days</option>
                          <option>Last year</option>
                        </select>
                      </div>
                      <div className="flex items-end gap-1 h-32">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100, 78, 88, 65, 72, 90, 82, 75, 95, 88, 79, 93, 85, 78, 92, 88, 95, 89, 98].map((h, i) => (
                          <div key={i} className="flex-1 bg-accent-600/20 hover:bg-accent-600/40 transition-colors rounded-sm" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>Jun 1</span>
                        <span>Jun 15</span>
                        <span>Jun 30</span>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Movies', value: movies.length, icon: Film, color: 'text-accent-400' },
                        { label: 'Total Series', value: series.length, icon: Tv, color: 'text-blue-400' },
                        { label: 'Total Clips', value: clips.length, icon: Video, color: 'text-green-400' },
                        { label: 'Open Tickets', value: 12, icon: Headphones, color: 'text-amber-400' },
                      ].map(item => (
                        <div key={item.label} className="glass rounded-xl p-4 flex items-center gap-3">
                          <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                          <div>
                            <p className="text-xl font-bold text-white">{item.value}</p>
                            <p className="text-xs text-gray-500">{item.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CONTENT MANAGEMENT */}
                {activeTab === 'content' && (
                  <div className="space-y-5">
                    {/* Tabs */}
                    <div className="flex items-center gap-2">
                      {(['movies', 'series', 'clips', 'actors'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setContentType(type)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                            contentType === type ? 'bg-accent-600 text-white' : 'glass text-gray-400 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                      <button className="ml-auto flex items-center gap-2 btn-primary text-sm">
                        <Plus className="w-4 h-4" />
                        Add {contentType.slice(0, -1)}
                      </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={`Search ${contentType}...`}
                        className="w-full bg-dark-800 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 transition-all"
                      />
                    </div>

                    {/* Content list */}
                    <div className="space-y-2">
                      {contentType === 'movies' && movies.filter(m => !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase())).map((movie) => (
                        <div key={movie.id} className="flex items-center gap-4 p-4 glass rounded-xl hover:border-accent-500/20 transition-all">
                          <img src={movie.poster} alt={movie.title} className="w-12 h-16 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm truncate">{movie.title}</h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3 fill-current" />{movie.rating}</span>
                              <span>{movie.year}</span>
                              <span>{movie.genres[0]}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {contentType === 'series' && series.map((s) => (
                        <div key={s.id} className="flex items-center gap-4 p-4 glass rounded-xl hover:border-accent-500/20 transition-all">
                          <img src={s.poster} alt={s.title} className="w-12 h-16 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm truncate">{s.title}</h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3 fill-current" />{s.rating}</span>
                              <span>{s.seasons.length} seasons</span>
                              <span className={s.status === 'ongoing' ? 'text-green-400' : 'text-gray-400'}>{s.status}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {contentType === 'clips' && clips.map((clip) => (
                        <div key={clip.id} className="flex items-center gap-4 p-4 glass rounded-xl hover:border-accent-500/20 transition-all">
                          <img src={clip.thumbnail} alt={clip.title} className="w-16 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm truncate">{clip.title}</h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{(clip.likes / 1000).toFixed(0)}K</span>
                              <span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{(clip.shares / 1000).toFixed(0)}K</span>
                              <span>{clip.duration}s</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {contentType === 'actors' && [
                        { name: 'Leila Hatami', films: 4, rating: 9.1 },
                        { name: 'Shahab Hosseini', films: 3, rating: 8.8 },
                        { name: 'Navid Mohammadzadeh', films: 5, rating: 8.7 },
                        { name: 'Taraneh Alidoosti', films: 3, rating: 9.0 },
                        { name: 'Parviz Parastui', films: 6, rating: 8.9 },
                      ].map((actor) => (
                        <div key={actor.name} className="flex items-center gap-4 p-4 glass rounded-xl hover:border-accent-500/20 transition-all">
                          <div className="w-12 h-12 rounded-full bg-accent-600/30 flex items-center justify-center text-accent-400 font-bold text-sm flex-shrink-0">
                            {actor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium text-sm">{actor.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{actor.films} films · ⭐ {actor.rating}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODERATION */}
                {activeTab === 'moderation' && (
                  <div className="space-y-5">
                    <h2 className="text-lg font-bold text-white">Comments & Reports</h2>
                    <div className="space-y-3">
                      {mockComments.map(comment => (
                        <div key={comment.id} className="glass rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-accent-600/30 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {comment.user[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-white">{comment.user}</span>
                                <span className="text-xs text-gray-500">on</span>
                                <span className="text-xs text-accent-400">{comment.movie}</span>
                                <span className="text-xs text-gray-600">{comment.time}</span>
                              </div>
                              <p className="text-gray-300 text-sm">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                comment.status === 'flagged' ? 'bg-red-500/20 text-red-400' :
                                comment.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>{comment.status}</span>
                              <button className="p-1.5 rounded-lg hover:bg-green-500/20 text-gray-500 hover:text-green-400 transition-colors ml-1">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="glass rounded-xl p-5">
                      <h3 className="text-white font-semibold mb-3">Reports Queue</h3>
                      <div className="flex items-center justify-between py-3 border-b border-dark-800">
                        <span className="text-sm text-gray-400">Hate speech reports</span>
                        <span className="text-sm text-white font-semibold">3</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-dark-800">
                        <span className="text-sm text-gray-400">Spam reports</span>
                        <span className="text-sm text-white font-semibold">7</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-sm text-gray-400">Copyright claims</span>
                        <span className="text-sm text-white font-semibold">2</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUPPORT */}
                {activeTab === 'support' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white">Ticket Center</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">12 open tickets</span>
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {mockTickets.map((ticket) => (
                        <div key={ticket.id} className="glass rounded-xl p-4 flex items-center gap-4 hover:border-accent-500/20 transition-all cursor-pointer group">
                          <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center flex-shrink-0">
                            <Headphones className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{ticket.id}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                                ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>{ticket.priority}</span>
                            </div>
                            <p className="text-white text-sm font-medium mt-0.5 truncate">{ticket.subject}</p>
                            <p className="text-xs text-gray-500">{ticket.user} · {ticket.time}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              ticket.status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                              ticket.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>{ticket.status.replace('_', ' ')}</span>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-accent-400 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS */}
                {activeTab === 'notifications' && (
                  <div className="space-y-5">
                    <h2 className="text-lg font-bold text-white">Send Notifications</h2>
                    <div className="glass rounded-2xl p-5">
                      <h3 className="text-white font-semibold mb-4">Announcement Broadcast</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">Title</label>
                          <input type="text" placeholder="Announcement title" className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                          <textarea
                            value={announcement}
                            onChange={e => setAnnouncement(e.target.value)}
                            placeholder="Write your announcement..."
                            rows={4}
                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 transition-all resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Target Audience</label>
                            <select className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-500 transition-all appearance-none">
                              <option>All Users</option>
                              <option>Premium Users</option>
                              <option>Free Users</option>
                              <option>New Users (last 30d)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Channel</label>
                            <select className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-500 transition-all appearance-none">
                              <option>In-App + Email</option>
                              <option>In-App Only</option>
                              <option>Email Only</option>
                              <option>Push Notification</option>
                            </select>
                          </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 btn-primary">
                          <Bell className="w-4 h-4" />
                          Send Announcement
                        </button>
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-5">
                      <h3 className="text-white font-semibold mb-4">Recent Announcements</h3>
                      <div className="space-y-3">
                        {[
                          { title: 'New content added: 15 movies this week', sent: '2 days ago', reach: '124K users' },
                          { title: 'Scheduled maintenance - Sunday 2AM', sent: '1 week ago', reach: '124K users' },
                          { title: 'Ramadan special content now available', sent: '2 weeks ago', reach: '124K users' },
                        ].map(ann => (
                          <div key={ann.title} className="flex items-start gap-3 py-3 border-b border-dark-800 last:border-0">
                            <Bell className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-white">{ann.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{ann.sent} · Reached {ann.reach}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ANALYTICS */}
                {activeTab === 'analytics' && (
                  <div className="space-y-5">
                    <h2 className="text-lg font-bold text-white">Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Most Watched */}
                      <div className="glass rounded-2xl p-5">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-accent-400" />
                          Most Watched
                        </h3>
                        <div className="space-y-3">
                          {movies.slice(0, 5).map((movie, i) => (
                            <div key={movie.id} className="flex items-center gap-3">
                              <span className="text-gray-600 text-sm w-4">{i + 1}</span>
                              <img src={movie.poster} alt={movie.title} className="w-8 h-10 rounded object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{movie.title}</p>
                                <p className="text-xs text-gray-500">{(Math.random() * 50 + 20).toFixed(0)}K views</p>
                              </div>
                              <div className="w-16 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-500 rounded-full" style={{ width: `${100 - i * 15}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Most Saved */}
                      <div className="glass rounded-2xl p-5">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-accent-400" />
                          Most Saved
                        </h3>
                        <div className="space-y-3">
                          {movies.slice(2, 7).map((movie, i) => (
                            <div key={movie.id} className="flex items-center gap-3">
                              <span className="text-gray-600 text-sm w-4">{i + 1}</span>
                              <img src={movie.poster} alt={movie.title} className="w-8 h-10 rounded object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{movie.title}</p>
                                <p className="text-xs text-gray-500">{(Math.random() * 20 + 5).toFixed(0)}K saves</p>
                              </div>
                              <div className="w-16 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${100 - i * 15}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Most Discussed */}
                      <div className="glass rounded-2xl p-5">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-accent-400" />
                          Most Discussed
                        </h3>
                        <div className="space-y-3">
                          {movies.slice(1, 6).map((movie, i) => (
                            <div key={movie.id} className="flex items-center gap-3">
                              <span className="text-gray-600 text-sm w-4">{i + 1}</span>
                              <img src={movie.poster} alt={movie.title} className="w-8 h-10 rounded object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{movie.title}</p>
                                <p className="text-xs text-gray-500">{(Math.random() * 1000 + 200).toFixed(0)} comments</p>
                              </div>
                              <div className="w-16 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${100 - i * 15}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Most Shared */}
                      <div className="glass rounded-2xl p-5">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-accent-400" />
                          Most Shared
                        </h3>
                        <div className="space-y-3">
                          {movies.slice(0, 5).reverse().map((movie, i) => (
                            <div key={movie.id} className="flex items-center gap-3">
                              <span className="text-gray-600 text-sm w-4">{i + 1}</span>
                              <img src={movie.poster} alt={movie.title} className="w-8 h-10 rounded object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{movie.title}</p>
                                <p className="text-xs text-gray-500">{(Math.random() * 8 + 1).toFixed(0)}K shares</p>
                              </div>
                              <div className="w-16 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${100 - i * 15}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
