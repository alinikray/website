import { motion } from 'framer-motion';
import { Tv, Users, Target, ChartBar as BarChart3, Check } from 'lucide-react';

const benefits = [
  'Reach millions of engaged entertainment enthusiasts',
  'Advanced targeting by demographics, interests, and viewing habits',
  'Brand-safe premium content environment',
  'Real-time performance analytics',
  'Flexible campaign budgets and durations',
  'Dedicated account management',
];

const adFormats = [
  { name: 'Pre-Roll Ads', desc: '15-30 second video spots before content' },
  { name: 'Banner Ads', desc: 'Display placements throughout the platform' },
  { name: 'Sponsored Content', desc: 'Native placements in recommendations' },
  { name: 'Homepage Takeover', desc: 'Full homepage brand experience' },
];

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-surface-950 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm mb-6">
            <Tv className="w-4 h-4" />
            For Advertisers
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Advertise on Fynex Movies
          </h1>
          <p className="text-surface-400 max-w-2xl mx-auto text-lg">
            Connect with millions of passionate entertainment fans through targeted, engaging ad experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Users, value: '10M+', label: 'Monthly Active Users' },
            { icon: Target, value: '150+', label: 'Targeting Options' },
            { icon: BarChart3, value: '95%', label: 'Viewability Rate' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-900/50 rounded-2xl p-8 border border-surface-800/50 text-center"
            >
              <stat.icon className="w-10 h-10 text-accent-400 mx-auto mb-4" />
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-surface-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Why Advertise With Us</h2>
            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-surface-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Ad Formats</h2>
            <div className="space-y-4">
              {adFormats.map((format) => (
                <div
                  key={format.name}
                  className="bg-surface-900/50 rounded-xl p-5 border border-surface-800/50"
                >
                  <h3 className="font-semibold text-white">{format.name}</h3>
                  <p className="text-sm text-surface-400 mt-1">{format.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-accent-900/30 to-surface-900/30 rounded-2xl p-8 border border-accent-800/30 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Campaign?</h2>
          <p className="text-surface-300 mb-6 max-w-xl mx-auto">
            Contact our advertising team to discuss your campaign goals and receive a custom proposal.
          </p>
          <a
            href="mailto:advertise@fynexmovies.com"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent-500 hover:bg-accent-600 rounded-lg text-white font-medium transition-colors"
          >
            Contact Sales Team
          </a>
        </motion.div>
      </div>
    </div>
  );
}
