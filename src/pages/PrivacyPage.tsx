import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const sections = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide when creating an account (name, email, password), payment details for subscriptions, your viewing history and preferences, device information and IP addresses, and usage data to improve our service.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Your information is used to provide and improve our streaming service, personalize your content recommendations, process payments securely, send service-related communications, analyze usage patterns to enhance user experience, and comply with legal obligations.',
  },
  {
    title: 'Data Sharing',
    content: 'We do not sell your personal data to third parties. We may share data with trusted service providers who assist in operating our platform, such as payment processors and analytics providers, all under strict confidentiality agreements.',
  },
  {
    title: 'Data Security',
    content: 'We implement industry-standard security measures including SSL encryption, secure data storage, and regular security audits. While no system is 100% secure, we continuously work to protect your information.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to access your personal data, correct inaccuracies, request deletion of your data, opt out of marketing communications, and download a copy of your data. Contact us at privacy@fynexmovies.com to exercise these rights.',
  },
  {
    title: 'Cookies',
    content: 'We use essential cookies to operate the service, analytics cookies to understand usage, and preference cookies to remember your settings. You can manage cookie preferences in your browser settings.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We may update this Privacy Policy periodically. We\'ll notify you of significant changes via email or a prominent notice on our platform. Continued use after changes constitutes acceptance of the updated policy.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-accent-600/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-accent-400" />
          </div>
          <h1 className="text-4xl font-display text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: June 2026</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 mb-6">
          <p className="text-gray-300 leading-relaxed">
            At Fynex Movies, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our platform.
          </p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-3">{section.title}</h2>
              <p className="text-gray-400 leading-relaxed text-sm">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
