import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/audio';
import { Lock, User, ArrowRight } from 'lucide-react';

interface Props {
  onLogin: (username: string) => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    playSound('hover');

    setTimeout(() => {
      if ((username === 'chanel29' && password === 'chanel29') || (username === 'guest' && password === 'guest100')) {
        playSound('success');
        onLogin(username);
      } else {
        playSound('error');
        setError(true);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0c] flex items-center justify-center p-4 relative overflow-hidden text-gray-900 dark:text-gray-100">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 dark:bg-[#141417]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 p-8 z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl">
             <Lock size={32} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Secure Access</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Please authenticate to access your portfolio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/5 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 outline-none focus:border-teal-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/5 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 pr-11 outline-none focus:border-teal-500 transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm text-center font-medium m-0"
              >
                Access denied. Invalid credentials.
              </motion.p>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
