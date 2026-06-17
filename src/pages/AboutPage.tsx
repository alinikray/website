import { motion } from 'framer-motion';
import { Play, Film, Users, Globe, Award } from 'lucide-react';

const stats = [
  { label: 'Movies & Series', value: '10,000+', icon: Film },
  { label: 'Active Users', value: '2.4M+', icon: Users },
  { label: 'Countries', value: '45+', icon: Globe },
  { label: 'Awards Won', value: '12', icon: Award },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-900/20 via-transparent to-transparent" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Play className="w-8 h-8 text-white fill-current" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-6">About Fynex Movies</h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Fynex Movies is Iran's premier streaming platform, dedicated to bringing the best of Persian cinema and global content to audiences worldwide. We believe in the power of stories to connect people across cultures and generations.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <stat.icon className="w-6 h-6 text-accent-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            At Fynex Movies, our mission is to democratize access to Persian cinema and bring the richness of Iranian storytelling to a global audience. We curate the finest films and series, from timeless classics to groundbreaking new releases.
          </p>
          <p className="text-gray-400 leading-relaxed">
            We're building the future of streaming — a platform that combines the discovery magic of TikTok with the depth of Netflix and the credibility of IMDb, all dedicated to Persian and Iranian content.
          </p>
        </motion.div>

        {/* Team */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Founded in 2022, Fynex Movies started with a simple belief: Iranian cinema deserves a world-class platform. From award-winning films at Cannes to beloved family series, we bring it all together in one seamless experience.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Today, we serve millions of viewers across 45 countries, with a library that grows every week. Our team of film lovers, technologists, and storytellers is committed to continuously improving the Fynex Movies experience.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
