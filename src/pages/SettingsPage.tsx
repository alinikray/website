import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Monitor } from 'lucide-react';

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-accent-500' : 'bg-surface-700'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile Settings',
    icon: User,
    settings: [
      { id: 'publicProfile', label: 'Public Profile', desc: 'Make your profile visible to other users', enabled: true },
      { id: 'showWatchlist', label: 'Show Watchlist', desc: 'Display your watchlist on your profile', enabled: false },
      { id: 'showRatings', label: 'Show Ratings', desc: 'Show your ratings on your profile', enabled: true },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    settings: [
      { id: 'newReleases', label: 'New Releases', desc: 'Get notified about new movies and series', enabled: true },
      { id: 'recommendations', label: 'Recommendations', desc: 'Receive personalized recommendations', enabled: true },
      { id: 'watchlistUpdates', label: 'Watchlist Updates', desc: 'Notify when content on your watchlist is available', enabled: false },
      { id: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional content', enabled: false },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Shield,
    settings: [
      { id: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add extra security to your account', enabled: false },
      { id: 'loginAlerts', label: 'Login Alerts', desc: 'Get notified of new sign-ins', enabled: true },
      { id: 'dataSharing', label: 'Data Sharing', desc: 'Allow anonymous usage analytics', enabled: true },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    icon: Palette,
    settings: [
      { id: 'darkMode', label: 'Dark Mode', desc: 'Use dark theme across the platform', enabled: true },
      { id: 'autoplay', label: 'Autoplay Trailers', desc: 'Automatically play trailers when browsing', enabled: false },
      { id: 'autoplayNext', label: 'Autoplay Next Episode', desc: 'Continue watching next episode automatically', enabled: true },
    ],
  },
  {
    id: 'playback',
    title: 'Playback',
    icon: Monitor,
    settings: [
      { id: 'hdPlayback', label: 'HD Playback', desc: 'Prefer HD quality when available', enabled: true },
      { id: 'subtitles', label: 'Show Subtitles', desc: 'Display subtitles by default', enabled: false },
      { id: 'surroundSound', label: 'Surround Sound', desc: 'Enable 5.1 surround sound', enabled: true },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    settingsSections.forEach(section => {
      section.settings.forEach(setting => {
        initial[setting.id] = setting.enabled;
      });
    });
    return initial;
  });

  const toggleSetting = (id: string) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-surface-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-surface-400 mt-1">Manage your account preferences</p>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section, si) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
              className="bg-surface-900/50 rounded-xl border border-surface-800/50 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-surface-800/50 flex items-center gap-3">
                <section.icon className="w-5 h-5 text-accent-400" />
                <h2 className="font-semibold text-white">{section.title}</h2>
              </div>
              <div className="divide-y divide-surface-800/50">
                {section.settings.map(setting => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-surface-800/20 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-white font-medium">{setting.label}</p>
                      <p className="text-sm text-surface-500 truncate">{setting.desc}</p>
                    </div>
                    <Toggle
                      enabled={settings[setting.id]}
                      onToggle={() => toggleSetting(setting.id)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button className="px-6 py-2 bg-surface-800 hover:bg-surface-700 rounded-lg text-white transition-colors">
            Reset to Defaults
          </button>
          <button className="px-6 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg text-white font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
