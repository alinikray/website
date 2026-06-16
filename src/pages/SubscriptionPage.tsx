import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Star, Film, Download, Monitor, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

type BillingCycle = 'monthly' | 'annual';

const plans = [
  {
    id: 'free',
    name: 'Free',
    namePersian: 'رایگان',
    icon: Film,
    monthlyPrice: 0,
    annualPrice: 0,
    color: 'from-gray-600 to-gray-700',
    accentColor: 'text-gray-400',
    borderColor: 'border-dark-700',
    features: [
      { text: 'Access to 500+ free movies', included: true },
      { text: 'SD quality (480p)', included: true },
      { text: 'Browse clips & trailers', included: true },
      { text: 'Basic recommendations', included: true },
      { text: 'HD & 4K streaming', included: false },
      { text: 'Offline downloads', included: false },
      { text: 'Multiple screens', included: false },
      { text: 'Early access content', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    namePersian: 'پریمیوم',
    icon: Crown,
    monthlyPrice: 9.99,
    annualPrice: 7.99,
    color: 'from-accent-500 to-accent-700',
    accentColor: 'text-accent-400',
    borderColor: 'border-accent-500/50',
    popular: true,
    features: [
      { text: 'Full library — 10,000+ titles', included: true },
      { text: 'HD & Full HD (1080p)', included: true },
      { text: 'Download for offline viewing', included: true },
      { text: 'AI-powered recommendations', included: true },
      { text: 'Watch on 2 screens simultaneously', included: true },
      { text: 'Ad-free experience', included: true },
      { text: '4K Ultra HD streaming', included: false },
      { text: 'Early access & exclusives', included: false },
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    namePersian: 'ویژه',
    icon: Zap,
    monthlyPrice: 19.99,
    annualPrice: 14.99,
    color: 'from-amber-500 to-orange-600',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: '4K Ultra HD & HDR', included: true },
      { text: 'Watch on 4 screens simultaneously', included: true },
      { text: 'Priority customer support', included: true },
      { text: 'Early access to new releases', included: true },
      { text: 'Exclusive VIP-only content', included: true },
      { text: 'Download up to 100 titles', included: true },
      { text: 'Family sharing (up to 5 profiles)', included: true },
    ],
  },
];

const comparisonFeatures = [
  { feature: 'Movie library', free: '500+', premium: '10,000+', vip: '10,000+' },
  { feature: 'Video quality', free: 'SD 480p', premium: 'Full HD 1080p', vip: '4K UHD + HDR' },
  { feature: 'Simultaneous screens', free: '1', premium: '2', vip: '4' },
  { feature: 'Offline downloads', free: '—', premium: '30 titles', vip: '100 titles' },
  { feature: 'Ads', free: 'Yes', premium: 'No', vip: 'No' },
  { feature: 'Profiles', free: '1', premium: '3', vip: '5' },
  { feature: 'Customer support', free: 'Email', premium: 'Priority email', vip: '24/7 live chat' },
];

export default function SubscriptionPage() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const annualSavings = Math.round(((9.99 - 7.99) / 9.99) * 100);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div className="relative py-16 md:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-900/20 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-600/20 border border-accent-500/30 text-accent-400 text-sm font-medium mb-6"
          >
            <Crown className="w-4 h-4" />
            Premium Membership
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Unlimited Entertainment,
            <br />
            <span className="gradient-text">Your Way</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg mb-8"
          >
            10,000+ movies and series in HD and 4K. Cancel anytime.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-1 p-1 rounded-xl bg-dark-800/60 border border-dark-700"
          >
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                billing === 'monthly'
                  ? 'bg-accent-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billing === 'annual'
                  ? 'bg-accent-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                -{annualSavings}%
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {plans.map((plan, i) => {
            const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice;
            const isSelected = selectedPlan === plan.id;
            const PlanIcon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                  isSelected
                    ? `${plan.borderColor} bg-dark-800/60`
                    : 'border-dark-700/50 bg-dark-900/40 hover:border-dark-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-accent-500 to-accent-700 text-white text-xs font-bold shadow-lg shadow-accent-500/30">
                    Most Popular
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <PlanIcon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-0.5">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-5">{plan.namePersian}</p>

                <div className="mb-6">
                  {price === 0 ? (
                    <div className="text-4xl font-bold text-white">Free</div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-white">${price}</span>
                      <span className="text-gray-500 text-sm mb-1">/month</span>
                    </div>
                  )}
                  {billing === 'annual' && price > 0 && (
                    <p className="text-xs text-green-400 mt-1">
                      Billed annually (${(price * 12).toFixed(2)}/year)
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className={`flex items-center gap-2.5 text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600 line-through'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        feature.included ? 'bg-green-500/20' : 'bg-dark-700'
                      }`}>
                        {feature.included
                          ? <Check className="w-2.5 h-2.5 text-green-400" />
                          : <span className="text-gray-700 text-xs">—</span>
                        }
                      </div>
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.id === 'free'
                      ? 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                      : plan.id === 'vip'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                        : 'bg-gradient-to-r from-accent-500 to-accent-700 text-white shadow-lg shadow-accent-500/25'
                  }`}
                >
                  {plan.id === 'free' ? 'Continue Free' : `Get ${plan.name}`}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Feature comparison table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">Compare Plans</h2>
          <div className="glass rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-dark-800/50 border-b border-dark-700">
              <div className="text-sm font-semibold text-gray-400">Feature</div>
              {plans.map(p => (
                <div key={p.id} className={`text-sm font-bold text-center ${p.accentColor}`}>{p.name}</div>
              ))}
            </div>
            {/* Rows */}
            {comparisonFeatures.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-4 gap-4 p-4 ${i % 2 === 0 ? 'bg-dark-900/20' : ''} border-b border-dark-700/30 last:border-0`}
              >
                <div className="text-sm text-gray-400">{row.feature}</div>
                {[row.free, row.premium, row.vip].map((val, vi) => (
                  <div key={vi} className="text-sm text-white text-center">
                    {val === '—' ? <span className="text-gray-700">—</span> : val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Trust badges */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { icon: Monitor, title: 'All Devices', desc: 'TV, phone, tablet, laptop' },
            { icon: Download, title: 'Offline Mode', desc: 'Download and watch anywhere' },
            { icon: Star, title: 'Best Content', desc: '10,000+ curated titles' },
            { icon: Users, title: 'Family Friendly', desc: 'Multiple profiles per account' },
          ].map((badge, i) => (
            <div key={i} className="glass rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center mx-auto mb-3">
                <badge.icon className="w-5 h-5 text-accent-400" />
              </div>
              <p className="text-white font-semibold text-sm">{badge.title}</p>
              <p className="text-gray-500 text-xs mt-1">{badge.desc}</p>
            </div>
          ))}
        </motion.section>

        {/* FAQ strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm">
            Questions?{' '}
            <Link to="/settings" className="text-accent-400 hover:text-accent-300 transition-colors">
              Visit your account settings
            </Link>
            {' '}or contact support.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Cancel anytime. No hidden fees. Billed in USD.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
