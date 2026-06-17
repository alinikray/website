import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click the "Sign Up" button in the top right corner. You can register with your email address or use your Google or Apple account for quick sign-up. The process takes less than a minute.',
      },
      {
        q: 'Is there a free trial available?',
        a: 'Yes! We offer a 7-day free trial for all new users. You can cancel anytime during the trial period without being charged.',
      },
      {
        q: 'What devices can I watch on?',
        a: 'Fynex Movies is available on iOS, Android, Web, Apple TV, Android TV, Roku, Fire TV, and most smart TVs. You can watch on up to 4 devices simultaneously with our Premium plan.',
      },
    ],
  },
  {
    category: 'Account & Billing',
    questions: [
      {
        q: 'How do I update my payment method?',
        a: 'Go to Settings > Subscription > Payment Methods. You can add, remove, or update your payment information there.',
      },
      {
        q: 'Can I change my subscription plan?',
        a: 'Absolutely! Navigate to Settings > Subscription to upgrade or downgrade your plan. Changes take effect at the start of your next billing cycle.',
      },
      {
        q: 'How do I cancel my subscription?',
        a: 'You can cancel anytime from Settings > Subscription > Cancel Subscription. Your access continues until the end of your current billing period.',
      },
    ],
  },
  {
    category: 'Watching & Streaming',
    questions: [
      {
        q: 'What video quality options are available?',
        a: 'Our Basic plan offers up to 720p HD. Standard includes up to 1080p Full HD. Premium supports up to 4K HDR with Dolby Atmos where available.',
      },
      {
        q: 'Can I download content for offline viewing?',
        a: 'Yes! Download movies and shows on our iOS and Android apps. Premium members can download up to 100 titles. Downloads expire after 30 days or 48 hours after you start watching.',
      },
      {
        q: 'Why is my video buffering?',
        a: 'Buffering is usually due to slow internet. Try lowering video quality, closing other apps, or restarting your router. You need at least 5 Mbps for HD and 25 Mbps for 4K.',
      },
    ],
  },
  {
    category: 'Content & Features',
    questions: [
      {
        q: 'How often is new content added?',
        a: 'We add new movies and shows every week. Check the "New Releases" section or enable notifications to stay updated.',
      },
      {
        q: 'Can I request a movie or show?',
        a: 'Yes! Use our Content Request page in the footer. We review all requests and prioritize based on member interest.',
      },
      {
        q: 'Do you have subtitles and audio descriptions?',
        a: 'Most content includes subtitles in multiple languages. Many titles also have audio descriptions for visually impaired users. Look for the CC or AD icons.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-surface-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-surface-400">
            Find answers to common questions about Fynex Movies.
          </p>
        </motion.div>

        <div className="space-y-8">
          {faqs.map((section, si) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-accent-500" />
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.questions.map((item, qi) => {
                  const key = `${si}-${qi}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={key}
                      className="bg-surface-900/50 rounded-xl border border-surface-800/50 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <span className="font-medium text-white">{item.q}</span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-surface-400" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="px-4 pb-4 text-surface-400 leading-relaxed">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
