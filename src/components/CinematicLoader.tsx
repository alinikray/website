import { motion } from 'framer-motion';

interface CinematicLoaderProps {
  fullScreen?: boolean;
}

export default function CinematicLoader({ fullScreen = false }: CinematicLoaderProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? 'fixed inset-0 bg-surface-950 z-50' : 'w-full h-64'
      }`}
    >
      <div className="relative w-24 h-24">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-accent-500/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.4, 0.8],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}

        <motion.div
          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg shadow-accent-500/30"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 20px rgba(167, 139, 250, 0.3)',
              '0 0 40px rgba(167, 139, 250, 0.5)',
              '0 0 20px rgba(167, 139, 250, 0.3)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-accent-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, Math.cos((i * Math.PI) / 4) * 30],
              y: [0, Math.sin((i * Math.PI) / 4) * 30],
              opacity: [1, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute mt-32 text-accent-400 text-sm font-medium tracking-widest"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        LOADING
      </motion.div>
    </div>
  );
}
