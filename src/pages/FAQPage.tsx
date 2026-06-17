import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Account & Billing',
    items: [
      { q: 'How do I create an account?', a: 'Click "Sign In / Register" in the top navigation, then choose "Create Account". Fill in your details and you\'re ready to go.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, bank transfers, and popular digital wallets. All transactions are secured with SSL encryption.' },
      { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time from your Account Settings. You\'ll continue to have access until the end of your billing period.' },
      { q: 'Is there a free trial?', a: 'Yes! New users get a 7-day free trial of our Premium plan. No credit card required to start.' },
    ],
  },
  {
    category: 'Content & Streaming',
    items: [
      { q: 'How many devices can I use simultaneously?', a: 'Premium subscribers can stream on up to 4 devices simultaneously. Standard plans allow 2 devices.' },
      { q: 'Is content available offline?', a: 'Premium subscribers can download movies and series for offline viewing on mobile devices.' },
      { q: 'What video quality is available?', a: 'We offer up to 4K Ultra HD streaming for Premium subscribers. Standard HD (1080p) is available on all paid plans.' },
      { q: 'Are there subtitles and dubbing options?', a: 'Most content includes Persian, English, and Arabic subtitles. Select titles also have English dubbing.' },
    ],
  },
  {
    category: 'Technical Support',
    items: [
      { q: 'The app is not loading. What should I do?', a: 'Try refreshing the page, clearing your browser cache, or switching to a different browser. If the issue persists, contact our support team.' },
      { q: 'How do I reset my password?', a: 'On the login page, click "Forgot Password" and enter your email address. We\'ll send you a reset link within 5 minutes.' },
      { q: 'Why is my stream buffering?', a: 'Buffering is usually caused by slow internet speeds. We recommend a minimum of 10 Mbps for HD streaming and 25 Mbps for 4K.' },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-dark-800 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className={`text-sm font-medium transition-colors ${open ? 'text-accent-400' : 'text-white'}`}>{q}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 text-sm pb-4 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-accent-600/20 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7 text-accent-400" />
          </div>
          <h1 className="text-4xl font-display text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-400">Everything you need to know about Fynex Movies.</p>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((section, i) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-sm font-semibold text-accent-400 uppercase tracking-wider mb-2">{section.category}</h2>
              {section.items.map(item => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
