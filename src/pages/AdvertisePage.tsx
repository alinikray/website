import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe, BarChart3, Mail } from 'lucide-react';

const packages = [
  { name: 'Starter', price: '$500/mo', reach: '50K–100K', features: ['Banner ads', 'Mobile targeting', 'Basic analytics'] },
  { name: 'Growth', price: '$2,000/mo', reach: '200K–500K', features: ['Video pre-rolls', 'Advanced targeting', 'Detailed analytics', 'A/B testing'], popular: true },
  { name: 'Enterprise', price: 'Custom', reach: '1M+', features: ['Sponsored content', 'Homepage takeover', 'Custom integrations', 'Dedicated account manager'] },
];

export default function AdvertisePage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-display text-white mb-4">Advertise With Us</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Reach millions of engaged Iranian cinema fans across our platform. Precise targeting, premium placements, measurable results.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Users, label: 'Monthly Users', value: '2.4M+' },
            { icon: Globe, label: 'Countries', value: '45+' },
            { icon: TrendingUp, label: 'Avg. Session', value: '42 min' },
            { icon: BarChart3, label: 'Completion Rate', value: '87%' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-4 text-center">
              <stat.icon className="w-5 h-5 text-accent-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-5 text-center">Advertising Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass rounded-2xl p-6 relative ${pkg.popular ? 'border-accent-500/50' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent-600 text-white text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
              <p className="text-2xl font-bold text-accent-400 mb-1">{pkg.price}</p>
              <p className="text-xs text-gray-500 mb-4">Reach: {pkg.reach} users/mo</p>
              <ul className="space-y-2 mb-5">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${pkg.popular ? 'btn-primary' : 'glass text-white hover:bg-dark-700'}`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-1">Ready to reach our audience?</p>
          <p className="text-gray-400 text-sm mb-3">Contact our advertising team for custom packages and media kits.</p>
          <a href="mailto:ads@fynexmovies.com" className="flex items-center gap-2 justify-center text-accent-400 hover:text-accent-300 transition-colors text-sm">
            <Mail className="w-4 h-4" />
            ads@fynexmovies.com
          </a>
        </motion.div>
      </div>
    </div>
  );
}
