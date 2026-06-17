import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-surface-400">Last updated: June 17, 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Information We Collect</h2>
            <p className="text-surface-300 leading-relaxed mb-4">
              We collect information you provide directly, such as your name, email address, and payment information when you create an account. We also automatically collect data about your viewing activity, device information, and interaction with our service.
            </p>
            <ul className="space-y-2 text-surface-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <span>Account information (name, email, profile)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <span>Payment and billing information</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <span>Viewing history and preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <span>Device and location data</span>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">How We Use Your Information</h2>
            <p className="text-surface-300 leading-relaxed">
              We use your information to provide, maintain, and improve our service. This includes personalizing recommendations, processing payments, providing customer support, and communicating with you about our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Information Sharing</h2>
            <p className="text-surface-300 leading-relaxed">
              We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, content providers for licensing purposes, and law enforcement when required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Your Rights</h2>
            <p className="text-surface-300 leading-relaxed">
              You have the right to access, correct, or delete your personal information. You can also opt out of promotional communications and limit data collection in your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-surface-300 leading-relaxed">
              For privacy-related inquiries, contact us at privacy@fynexmovies.com.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
