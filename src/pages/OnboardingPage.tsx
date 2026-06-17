import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Play } from 'lucide-react';

const genreOptions = [
  { id: 'action', label: 'Action', emoji: '💥', color: 'from-red-600 to-orange-500' },
  { id: 'drama', label: 'Drama', emoji: '🎭', color: 'from-blue-600 to-indigo-600' },
  { id: 'comedy', label: 'Comedy', emoji: '😂', color: 'from-yellow-500 to-amber-500' },
  { id: 'thriller', label: 'Thriller', emoji: '🔪', color: 'from-slate-600 to-gray-700' },
  { id: 'romance', label: 'Romance', emoji: '❤️', color: 'from-pink-500 to-rose-500' },
  { id: 'scifi', label: 'Sci-Fi', emoji: '🚀', color: 'from-cyan-500 to-blue-600' },
  { id: 'horror', label: 'Horror', emoji: '👻', color: 'from-red-800 to-rose-900' },
  { id: 'documentary', label: 'Documentary', emoji: '📹', color: 'from-emerald-600 to-teal-700' },
  { id: 'animation', label: 'Animation', emoji: '🎨', color: 'from-purple-500 to-fuchsia-600' },
  { id: 'crime', label: 'Crime', emoji: '🔫', color: 'from-gray-700 to-neutral-800' },
  { id: 'adventure', label: 'Adventure', emoji: '🗺️', color: 'from-orange-500 to-red-500' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧', color: 'from-green-500 to-emerald-600' },
];

const moodOptions = [
  { id: 'binge', label: 'Binge-watch series', emoji: '📺' },
  { id: 'discover', label: 'Discover hidden gems', emoji: '💎' },
  { id: 'latest', label: 'Stay up to date', emoji: '🔥' },
  { id: 'classics', label: 'Revisit classics', emoji: '🏆' },
  { id: 'explore', label: 'Explore via clips', emoji: '✨' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleGenre = (id: string) => {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const toggleMood = (id: string) => {
    setSelectedMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const steps = [
    {
      title: 'What do you love to watch?',
      subtitle: 'Pick up to 5 genres. We\'ll personalize your feed.',
      content: (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {genreOptions.map(g => {
            const selected = selectedGenres.includes(g.id);
            return (
              <motion.button
                key={g.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleGenre(g.id)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  selected
                    ? `bg-gradient-to-br ${g.color} shadow-lg`
                    : 'bg-dark-800/60 hover:bg-dark-700/60 border border-dark-700'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-dark-900" />
                  </motion.div>
                )}
                <span className="text-2xl">{g.emoji}</span>
                <span className="text-xs font-medium text-white">{g.label}</span>
              </motion.button>
            );
          })}
        </div>
      ),
      canProceed: selectedGenres.length >= 1,
    },
    {
      title: 'How do you watch?',
      subtitle: 'Tell us your viewing style.',
      content: (
        <div className="space-y-3">
          {moodOptions.map(m => {
            const selected = selectedMoods.includes(m.id);
            return (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleMood(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                  selected
                    ? 'bg-accent-600/20 border border-accent-500/50'
                    : 'bg-dark-800/60 border border-dark-700 hover:border-dark-600'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="font-medium text-white">{m.label}</span>
                {selected && <Check className="w-5 h-5 text-accent-400 ml-auto" />}
              </motion.button>
            );
          })}
        </div>
      ),
      canProceed: true,
    },
    {
      title: 'You\'re all set!',
      subtitle: 'Your personalized streaming experience is ready.',
      content: (
        <div className="text-center space-y-8 py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center mx-auto shadow-glow-lg"
          >
            <Play className="w-10 h-10 text-white fill-current ml-1" />
          </motion.div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to discover</h3>
            <p className="text-gray-400">
              We've personalized {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} for you.
              Your feed is waiting.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {[
              { label: 'Movies', value: '10K+' },
              { label: 'Series', value: '500+' },
              { label: 'Clips', value: '50K+' },
            ].map(stat => (
              <div key={stat.label} className="bg-dark-800/60 rounded-xl p-3 text-center">
                <p className="text-accent-400 font-bold text-lg">{stat.value}</p>
                <p className="text-gray-500 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      ),
      canProceed: true,
    },
  ];

  const currentStep = steps[step];
  const totalSteps = steps.length;

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-lg font-bold text-white">Fynex Movies</span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-1 rounded-full overflow-hidden bg-dark-700"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i < step ? '100%' : i === step ? '50%' : '0%' }}
                className="h-full bg-accent-500 rounded-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {currentStep.title}
              </h1>
              <p className="text-gray-400">{currentStep.subtitle}</p>
              {step === 0 && selectedGenres.length > 0 && (
                <p className="text-accent-400 text-sm mt-1">{selectedGenres.length}/5 selected</p>
              )}
            </div>

            <div className="mb-8">{currentStep.content}</div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              Skip
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!currentStep.canProceed}
            onClick={() => {
              if (step < totalSteps - 1) {
                setStep(s => s + 1);
              } else {
                navigate('/');
              }
            }}
            className="flex items-center gap-2 bg-accent-600 hover:bg-accent-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
          >
            {step === totalSteps - 1 ? 'Start Watching' : 'Continue'}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
