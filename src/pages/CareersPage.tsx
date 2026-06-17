import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const openings = [
  { title: 'Senior Frontend Engineer', dept: 'Engineering', location: 'Tehran (Remote OK)', type: 'Full-time' },
  { title: 'Backend Engineer – Streaming', dept: 'Engineering', location: 'Tehran', type: 'Full-time' },
  { title: 'Product Designer', dept: 'Design', location: 'Remote', type: 'Full-time' },
  { title: 'Content Curator – Iranian Cinema', dept: 'Content', location: 'Tehran', type: 'Full-time' },
  { title: 'Marketing Manager', dept: 'Marketing', location: 'Tehran', type: 'Full-time' },
  { title: 'Data Analyst', dept: 'Analytics', location: 'Remote', type: 'Full-time' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-display text-white mb-4">Join the Fynex Team</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We're building the future of Persian streaming. Join a passionate team of builders, storytellers, and innovators.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { title: 'Remote First', desc: 'Work from anywhere in the world' },
            { title: 'Equity', desc: 'Share in the company\'s success' },
            { title: 'Great Benefits', desc: 'Health, pension, and learning budget' },
          ].map((perk, i) => (
            <motion.div key={perk.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-5 text-center">
              <h3 className="text-white font-semibold mb-1">{perk.title}</h3>
              <p className="text-gray-400 text-sm">{perk.desc}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-5">Open Positions</h2>
        <div className="space-y-3">
          {openings.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 flex items-center justify-between group hover:border-accent-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-accent-400 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="text-accent-400">{job.dept}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-accent-400 transition-colors flex-shrink-0" />
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 glass rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm">Don't see a role that fits? We're always looking for exceptional talent.</p>
          <a href="mailto:careers@fynexmovies.com" className="text-accent-400 hover:text-accent-300 text-sm transition-colors mt-1 inline-block">
            careers@fynexmovies.com
          </a>
        </motion.div>
      </div>
    </div>
  );
}
