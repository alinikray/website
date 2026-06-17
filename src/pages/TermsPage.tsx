import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const sections = [
  { title: 'Acceptance of Terms', content: 'By accessing or using Fynex Movies, you agree to be bound by these Terms of Service. If you disagree with any part, please do not use our service.' },
  { title: 'Account Registration', content: 'You must be 13 years or older to create an account. You are responsible for maintaining the security of your account credentials and for all activities under your account.' },
  { title: 'Subscription & Payments', content: 'Subscriptions are billed in advance on a monthly or annual basis. Refunds are provided for unused portions of annual plans only. We reserve the right to change pricing with 30 days notice.' },
  { title: 'Content License', content: 'Fynex Movies grants you a limited, non-exclusive, non-transferable license to stream content for personal, non-commercial use. You may not reproduce, distribute, or create derivative works.' },
  { title: 'Prohibited Activities', content: 'You may not use VPNs to circumvent geographic restrictions, share account credentials with non-household members, scrape or download content without authorization, or use the service for any unlawful purpose.' },
  { title: 'Content Standards', content: 'User-submitted content (comments, reviews) must not contain hate speech, harassment, illegal material, or spam. We reserve the right to remove content that violates our community standards.' },
  { title: 'Termination', content: 'We may suspend or terminate accounts that violate these terms. Upon termination, your right to access the service ceases immediately. Paid subscriptions are non-refundable upon termination for cause.' },
  { title: 'Limitation of Liability', content: 'Fynex Movies is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-accent-600/20 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-accent-400" />
          </div>
          <h1 className="text-4xl font-display text-white mb-3">Terms of Service</h1>
          <p className="text-gray-400">Last updated: June 2026</p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
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
