import { motion } from 'framer-motion';

export default function CinematicLoader() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-dark-950">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent-700/20 blur-3xl animate-pulse-slow" />
      </div>

      {/* Orbiting cores */}
      <div className="relative w-28 h-28 mb-8">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-accent-500/30"
        >
          <motion.div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-400 shadow-glow"
          />
        </motion.div>

        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 rounded-full border border-accent-500/50"
        >
          <motion.div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-500 shadow-glow"
          />
        </motion.div>

        {/* Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-700 shadow-glow-lg"
          />
        </div>

        {/* Particles */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <motion.div
            key={deg}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: deg / 300, ease: 'easeInOut' }}
            className="absolute w-1 h-1 rounded-full bg-accent-300"
            style={{
              top: `${50 + 46 * Math.sin((deg * Math.PI) / 180)}%`,
              left: `${50 + 46 * Math.cos((deg * Math.PI) / 180)}%`,
            }}
          />
        ))}
      </div>

      {/* Brand */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-accent-400 text-sm font-semibold tracking-widest uppercase"
      >
        Fynex Movies
      </motion.p>
    </div>
  );
}
