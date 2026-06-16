import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Shield, Monitor, Globe, Crown, Lock,
  Eye, EyeOff, ChevronRight, Check, Mail, Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Tab = 'account' | 'profile' | 'notifications' | 'content' | 'privacy' | 'appearance';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'profile', label: 'Profile', icon: Monitor },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'content', label: 'Content Prefs', icon: Globe },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Monitor },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-all ${enabled ? 'bg-accent-600' : 'bg-dark-700'}`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
      />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-dark-800 last:border-0">
      <div className="flex-1 mr-4">
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-gray-500 text-xs mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [notifs, setNotifs] = useState({
    newReleases: true,
    recommendations: true,
    newsletter: false,
    activityAlerts: true,
    sms: false,
  });
  const [content, setContent] = useState({
    autoplay: true,
    skipIntro: true,
    matureContent: false,
    showSubtitles: true,
    preferredLanguage: 'Persian',
  });
  const [privacy, setPrivacy] = useState({
    watchHistory: true,
    shareActivity: false,
    personalizedAds: false,
    dataCollection: true,
  });
  const [theme, setTheme] = useState<'dark' | 'darker'>('dark');
  const [interfaceLanguage, setInterfaceLanguage] = useState('English');

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleContent = (key: keyof typeof content) =>
    setContent(prev => ({ ...prev, [key]: !prev[key] }));
  const togglePrivacy = (key: keyof typeof privacy) =>
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar tabs */}
          <aside className="md:w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
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
              <div className="pt-2">
                <Link
                  to="/subscription"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition-all"
                >
                  <Crown className="w-4 h-4 flex-shrink-0" />
                  Upgrade Plan
                </Link>
              </div>
            </nav>
          </aside>

          {/* Content panel */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="glass rounded-2xl p-6"
              >
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">Account</h2>
                    <div className="space-y-1">
                      <SettingRow label="Email address" description="ali.mohammadi@gmail.com">
                        <button className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm transition-colors">
                          <Mail className="w-4 h-4" />
                          Change
                        </button>
                      </SettingRow>
                      <SettingRow label="Password" description="Last changed 3 months ago">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value="••••••••"
                              readOnly
                              className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-sm text-white w-32"
                            />
                            <button
                              onClick={() => setShowPassword(s => !s)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <button className="text-accent-400 hover:text-accent-300 text-sm transition-colors">
                            Update
                          </button>
                        </div>
                      </SettingRow>
                      <SettingRow label="Phone number" description="Not added">
                        <button className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm transition-colors">
                          <Smartphone className="w-4 h-4" />
                          Add
                        </button>
                      </SettingRow>
                      <SettingRow label="Two-factor authentication" description="Add an extra layer of security">
                        <button className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm transition-colors">
                          <Lock className="w-4 h-4" />
                          Enable
                        </button>
                      </SettingRow>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dark-800">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Subscription</h3>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700">
                        <div>
                          <p className="text-white font-semibold">Free Plan</p>
                          <p className="text-gray-500 text-sm">Limited access</p>
                        </div>
                        <Link
                          to="/subscription"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold shadow-lg"
                        >
                          <Crown className="w-4 h-4" />
                          Upgrade
                        </Link>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dark-800">
                      <button className="text-red-400 hover:text-red-300 text-sm transition-colors">
                        Delete account
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">Profile</h2>
                    <div className="flex items-center gap-5 mb-8 p-4 bg-dark-800/50 rounded-xl">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-bold text-xl">
                        AM
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">Ali Mohammadi</p>
                        <p className="text-gray-500 text-sm">Member since January 2024</p>
                      </div>
                      <button className="text-accent-400 hover:text-accent-300 text-sm transition-colors">
                        Change photo
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: 'Full name', value: 'Ali Mohammadi', placeholder: 'Your full name' },
                        { label: 'Display name', value: 'Ali M.', placeholder: 'How you appear' },
                        { label: 'Bio', value: '', placeholder: 'A short bio about yourself...' },
                      ].map((field) => (
                        <div key={field.label}>
                          <label className="block text-sm font-medium text-gray-400 mb-1.5">{field.label}</label>
                          <input
                            type="text"
                            defaultValue={field.value}
                            placeholder={field.placeholder}
                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all text-sm"
                          />
                        </div>
                      ))}
                      <button className="flex items-center gap-2 bg-accent-600 hover:bg-accent-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm">
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">Notifications</h2>
                    <div className="space-y-1">
                      <SettingRow label="New releases" description="Get notified when new movies and series launch">
                        <Toggle enabled={notifs.newReleases} onToggle={() => toggleNotif('newReleases')} />
                      </SettingRow>
                      <SettingRow label="Personalized recommendations" description="Weekly digest based on your taste">
                        <Toggle enabled={notifs.recommendations} onToggle={() => toggleNotif('recommendations')} />
                      </SettingRow>
                      <SettingRow label="Activity alerts" description="Watchlist updates and watch party invites">
                        <Toggle enabled={notifs.activityAlerts} onToggle={() => toggleNotif('activityAlerts')} />
                      </SettingRow>
                      <SettingRow label="Newsletter" description="Monthly picks and platform news">
                        <Toggle enabled={notifs.newsletter} onToggle={() => toggleNotif('newsletter')} />
                      </SettingRow>
                      <SettingRow label="SMS notifications" description="Critical account alerts via text">
                        <Toggle enabled={notifs.sms} onToggle={() => toggleNotif('sms')} />
                      </SettingRow>
                    </div>
                  </div>
                )}

                {/* Content Preferences Tab */}
                {activeTab === 'content' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">Content Preferences</h2>
                    <div className="space-y-1 mb-8">
                      <SettingRow label="Autoplay next episode" description="Automatically play the next episode in a series">
                        <Toggle enabled={content.autoplay} onToggle={() => toggleContent('autoplay')} />
                      </SettingRow>
                      <SettingRow label="Skip intro" description="Automatically skip opening credits">
                        <Toggle enabled={content.skipIntro} onToggle={() => toggleContent('skipIntro')} />
                      </SettingRow>
                      <SettingRow label="Show subtitles by default" description="Display subtitles automatically">
                        <Toggle enabled={content.showSubtitles} onToggle={() => toggleContent('showSubtitles')} />
                      </SettingRow>
                      <SettingRow label="Mature content" description="Show 18+ rated content in browse">
                        <Toggle enabled={content.matureContent} onToggle={() => toggleContent('matureContent')} />
                      </SettingRow>
                    </div>

                    <div className="pt-6 border-t border-dark-800">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Preferred Language</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['Persian', 'English', 'Arabic', 'Turkish', 'French', 'Other'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => setInterfaceLanguage(lang)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              interfaceLanguage === lang
                                ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30'
                                : 'bg-dark-800/50 text-gray-400 hover:text-white border border-dark-700'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-dark-800">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Favorite Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Sci-Fi', 'Horror', 'Documentary'].map(genre => (
                          <button
                            key={genre}
                            className="px-3 py-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white border border-dark-700 hover:border-accent-500/50 text-xs transition-all"
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">Privacy</h2>
                    <div className="space-y-1 mb-8">
                      <SettingRow label="Watch history" description="Save your viewing history for recommendations">
                        <Toggle enabled={privacy.watchHistory} onToggle={() => togglePrivacy('watchHistory')} />
                      </SettingRow>
                      <SettingRow label="Share activity" description="Let friends see what you're watching">
                        <Toggle enabled={privacy.shareActivity} onToggle={() => togglePrivacy('shareActivity')} />
                      </SettingRow>
                      <SettingRow label="Personalized ads" description="Use your data to show relevant ads on free plan">
                        <Toggle enabled={privacy.personalizedAds} onToggle={() => togglePrivacy('personalizedAds')} />
                      </SettingRow>
                      <SettingRow label="Usage analytics" description="Help us improve with anonymized data">
                        <Toggle enabled={privacy.dataCollection} onToggle={() => togglePrivacy('dataCollection')} />
                      </SettingRow>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700 text-gray-300 hover:text-white transition-colors text-sm">
                        Download my data
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700 text-gray-300 hover:text-white transition-colors text-sm">
                        Clear watch history
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">Appearance</h2>

                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Theme</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'dark' as const, label: 'Dark', desc: 'Classic dark mode', bg: 'bg-dark-900' },
                          { id: 'darker' as const, label: 'Pitch Black', desc: 'Maximum contrast', bg: 'bg-black' },
                        ].map(t => (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              theme === t.id ? 'border-accent-500' : 'border-dark-700'
                            }`}
                          >
                            <div className={`w-full h-12 rounded-lg ${t.bg} mb-3 border border-dark-700`} />
                            <p className="text-white font-medium text-sm">{t.label}</p>
                            <p className="text-gray-500 text-xs">{t.desc}</p>
                            {theme === t.id && (
                              <div className="mt-2 flex items-center gap-1 text-accent-400 text-xs">
                                <Check className="w-3 h-3" />
                                Active
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-dark-800">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Interface Language</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['English', 'فارسی', 'العربية', 'Türkçe'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => setInterfaceLanguage(lang)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              interfaceLanguage === lang
                                ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30'
                                : 'bg-dark-800/50 text-gray-400 hover:text-white border border-dark-700'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
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
