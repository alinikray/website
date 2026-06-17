import { motion } from 'framer-motion';
import { Users, Heart, Globe, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '10M+', label: 'Active Users' },
  { icon: Heart, value: '50K+', label: 'Movies & Shows' },
  { icon: Globe, value: '190+', label: 'Countries' },
  { icon: Award, value: '4.9', label: 'App Rating' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-900/40 to-surface-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3915398/pexels-photo-3915398.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Fynex Movies</h1>
            <p className="text-surface-300 max-w-2xl">
              Your ultimate destination for streaming the best movies and TV series from around the world.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-900/50 rounded-2xl p-6 border border-surface-800/50 text-center"
            >
              <stat.icon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-surface-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="prose prose-invert max-w-4xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-surface-300 leading-relaxed">
              At Fynex Movies, we believe everyone deserves access to quality entertainment. Our platform brings together an extensive library of movies and TV series from every genre, era, and corner of the globe. Whether you're looking for the latest blockbusters, timeless classics, or hidden indie gems, we've got you covered.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">What Sets Us Apart</h2>
            <ul className="space-y-4 text-surface-300">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <span><strong className="text-white">Curated Experience:</strong> Our team of film enthusiasts hand-picks content and creates personalized recommendations just for you.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <span><strong className="text-white">High Quality:</strong> Stream in up to 4K HDR with Dolby Atmos sound for the ultimate cinematic experience at home.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <span><strong className="text-white">Community Driven:</strong> Join discussions, share reviews, and connect with fellow movie lovers from around the world.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <span><strong className="text-white">Cross-Platform:</strong> Watch anywhere — on your TV, phone, tablet, or computer with seamless sync across devices.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Join Our Journey</h2>
            <p className="text-surface-300 leading-relaxed">
              We're constantly expanding our library and improving our platform. Have a suggestion or want to collaborate? We'd love to hear from you. Fynex Movies is more than a streaming service — it's a community of passionate storytellers and story-lovers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
