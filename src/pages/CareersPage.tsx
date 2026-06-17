import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const jobs = [
  {
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Data Scientist',
    department: 'Data',
    location: 'San Francisco, CA',
    type: 'Full-time',
  },
  {
    title: 'Customer Support Lead',
    department: 'Support',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-900/40 to-surface-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Team</h1>
            <p className="text-surface-300 max-w-2xl">
              Help us shape the future of entertainment. We're looking for passionate people to join our mission.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Why Fynex Movies?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Innovative Culture', desc: 'Work on cutting-edge streaming technology' },
              { title: 'Great Benefits', desc: 'Competitive salary, equity, and health coverage' },
              { title: 'Global Impact', desc: 'Reach millions of users worldwide' },
            ].map((item, i) => (
              <div key={i} className="bg-surface-900/50 rounded-xl p-6 border border-surface-800/50">
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-surface-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  to={`/careers/${job.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block bg-surface-900/50 rounded-xl p-6 border border-surface-800/50 hover:border-accent-500/50 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-accent-400 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-surface-500 mt-1">{job.department}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-surface-500 group-hover:text-accent-400 transition-colors" />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-surface-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      Full Stack
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
