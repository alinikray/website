import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-surface-400">Last updated: June 17, 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none space-y-8"
        >
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-surface-300 leading-relaxed">
              By accessing or using Fynex Movies, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Use License</h2>
            <p className="text-surface-300 leading-relaxed">
              Permission is granted to temporarily access the materials on Fynex Movies for personal, non-commercial use only. This is the grant of a license, not a transfer of title. You may not modify, copy, distribute, or use the materials for any commercial purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
            <p className="text-surface-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Subscription and Payments</h2>
            <p className="text-surface-300 leading-relaxed">
              Some features require a paid subscription. By subscribing, you authorize us to charge your payment method on a recurring basis. You may cancel at any time, and your subscription will remain active until the end of the current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Content</h2>
            <p className="text-surface-300 leading-relaxed">
              All content on Fynex Movies is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission from the rights holders.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Limitations</h2>
            <p className="text-surface-300 leading-relaxed">
              Fynex Movies shall not be liable for any indirect, incidental, special, consequential or punitive damages arising out of your use of the service. Some jurisdictions do not allow limitations, so these may not apply to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Governing Law</h2>
            <p className="text-surface-300 leading-relaxed">
              These terms shall be governed and construed in accordance with applicable laws, without regard to conflict of law provisions.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
