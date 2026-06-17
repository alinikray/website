import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Film, Shield, MessageSquare, Bell, ChartBar as BarChart3, Users, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'content', label: 'Content', icon: Film },
  { id: 'moderation', label: 'Moderation', icon: Shield },
  { id: 'support', label: 'Support', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const stats = [
  { label: 'Total Users', value: '12,847', change: '+12%', icon: Users, positive: true },
  { label: 'New Content', value: '234', change: '+8%', icon: Film, positive: true },
  { label: 'Avg. Watch Time', value: '2.4h', change: '+5%', icon: Clock, positive: true },
  { label: 'Support Tickets', value: '47', change: '-15%', icon: MessageSquare, positive: true },
];

const pendingContent = [
  { id: 1, title: 'New Movie Upload', type: 'Movie', status: 'pending', submitted: '2 hours ago' },
  { id: 2, title: 'Series Episode Review', type: 'Series', status: 'pending', submitted: '4 hours ago' },
  { id: 3, title: 'Content Update Request', type: 'Edit', status: 'pending', submitted: '1 day ago' },
];

const recentSupport = [
  { id: 1, subject: 'Cannot access premium content', user: 'john@email.com', status: 'open', priority: 'high' },
  { id: 2, subject: 'Payment failed', user: 'sarah@email.com', status: 'in_progress', priority: 'medium' },
  { id: 3, subject: 'Subtitle sync issue', user: 'mike@email.com', status: 'resolved', priority: 'low' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-surface-400 mt-1">Manage your platform</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-surface-400">All systems operational</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-surface-900/50 rounded-xl border border-surface-800/50 p-2 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-accent-500 text-white'
                      : 'text-surface-400 hover:bg-surface-800/50 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-surface-900/50 rounded-xl border border-surface-800/50 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <stat.icon className="w-5 h-5 text-accent-400" />
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          stat.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-surface-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pending Content */}
                  <div className="bg-surface-900/50 rounded-xl border border-surface-800/50 p-4">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Film className="w-5 h-5 text-accent-400" />
                      Pending Content
                    </h3>
                    <div className="space-y-3">
                      {pendingContent.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-surface-800/30 rounded-lg"
                        >
                          <div>
                            <p className="text-sm text-white">{item.title}</p>
                            <p className="text-xs text-surface-500">{item.type} • {item.submitted}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Support Tickets */}
                  <div className="bg-surface-900/50 rounded-xl border border-surface-800/50 p-4">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-accent-400" />
                      Recent Support
                    </h3>
                    <div className="space-y-3">
                      {recentSupport.map(ticket => (
                        <div
                          key={ticket.id}
                          className="p-3 bg-surface-800/30 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-white truncate flex-1">{ticket.subject}</p>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                              ticket.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-surface-700 text-surface-400'
                            }`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-xs text-surface-500">{ticket.user}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                              ticket.status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                              ticket.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {ticket.status === 'in_progress' ? (
                                <Clock className="w-3 h-3" />
                              ) : ticket.status === 'open' ? (
                                <AlertCircle className="w-3 h-3" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab !== 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-900/50 rounded-xl border border-surface-800/50 p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const tab = tabs.find(t => t.id === activeTab);
                    const Icon = tab?.icon;
                    return Icon ? <Icon className="w-8 h-8 text-accent-400" /> : null;
                  })()}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-surface-400">
                  This section is coming soon. Manage your {activeTab} settings here.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
