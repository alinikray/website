import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, Chrome, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'register' && password !== confirm) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.includes('Invalid login') ? 'Invalid email or password' : error);
        } else {
          navigate('/');
        }
      } else if (mode === 'register') {
        const { error, needsEmailConfirmation } = await signUp(email, password, name || undefined);
        if (error) {
          setErrorMsg(error);
        } else if (needsEmailConfirmation) {
          setForgotSent(true);
        } else {
          navigate('/onboarding');
        }
      } else {
        const { error } = await resetPassword(email);
        if (error) {
          setErrorMsg(error);
        } else {
          setForgotSent(true);
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    }
    setIsLoading(false);
  };

  const modeConfig = {
    login: { title: 'Welcome back', subtitle: 'Sign in to continue watching', cta: 'Sign In' },
    register: { title: 'Create account', subtitle: 'Start your free journey today', cta: 'Create Account' },
    forgot: { title: 'Reset password', subtitle: 'We\'ll send you a recovery link', cta: 'Send Reset Link' },
  };

  const { title, subtitle, cta } = modeConfig[mode];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left panel — cinematic backdrop */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-dark-950/40" />

        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold text-white">Fynex Movies</span>
          </Link>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-accent-400 text-sm font-medium">
              <span className="w-8 h-0.5 bg-accent-500 rounded" />
              Premium Streaming Platform
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Discover movies<br />you'll love
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              Thousands of Iranian and international films. Personalized to your taste.
            </p>

            {/* Trust badges */}
            <div className="flex flex-col gap-3">
              {['10,000+ movies & series', 'Personalized recommendations', 'HD & 4K quality'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            © 2026 Fynex Movies. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-white">Fynex Movies</span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h1>
                <p className="text-gray-400">{subtitle}</p>
              </div>

              {errorMsg && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              {forgotSent ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Check your email</h3>
                  <p className="text-gray-400 text-sm">We sent a reset link to <span className="text-white">{email}</span></p>
                  <button
                    onClick={() => { setMode('login'); setForgotSent(false); }}
                    className="text-accent-400 hover:text-accent-300 text-sm transition-colors"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <>
                  {/* Google Sign In */}
                  {mode !== 'forgot' && (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-medium transition-all mb-6"
                    >
                      <Chrome className="w-5 h-5" />
                      Continue with Google
                    </motion.button>
                  )}

                  {/* Divider */}
                  {mode !== 'forgot' && (
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 h-px bg-dark-700" />
                      <span className="text-gray-500 text-sm">or continue with email</span>
                      <div className="flex-1 h-px bg-dark-700" />
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Full name"
                          required
                          className="w-full bg-dark-800/80 border border-dark-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
                        />
                      </div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full bg-dark-800/80 border border-dark-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
                      />
                    </div>

                    {mode !== 'forgot' && (
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Password"
                          required
                          className="w-full bg-dark-800/80 border border-dark-700 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(s => !s)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    )}

                    {mode === 'register' && (
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          value={confirm}
                          onChange={e => setConfirm(e.target.value)}
                          placeholder="Confirm password"
                          required
                          className="w-full bg-dark-800/80 border border-dark-700 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(s => !s)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    )}

                    {mode === 'login' && (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div
                            onClick={() => setRememberMe(r => !r)}
                            className={`w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer ${
                              rememberMe ? 'bg-accent-600' : 'bg-dark-700 border border-dark-600'
                            }`}
                          >
                            {rememberMe && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className="text-sm text-gray-400">Remember me</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-accent-400 hover:text-accent-300 text-sm transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-500 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-accent-500/25 mt-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {cta}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Switch mode */}
                  <div className="mt-6 text-center text-sm text-gray-400">
                    {mode === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button onClick={() => setMode('register')} className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
                          Sign up free
                        </button>
                      </>
                    ) : mode === 'register' ? (
                      <>
                        Already have an account?{' '}
                        <button onClick={() => setMode('login')} className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
                          Sign in
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setMode('login')} className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
                        ← Back to sign in
                      </button>
                    )}
                  </div>

                  {mode === 'register' && (
                    <p className="mt-4 text-center text-xs text-gray-600">
                      By creating an account, you agree to our{' '}
                      <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
