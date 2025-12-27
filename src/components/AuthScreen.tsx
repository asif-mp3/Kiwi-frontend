'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, ShieldCheck, Chrome } from 'lucide-react';
import { toast } from 'sonner';

interface AuthScreenProps {
  onLogin: (username: string) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (username === 'admin' && password === 'admin123') {
      onLogin(username);
      toast.success('Access Granted', {
        description: 'Welcome back, Executive Assistant.',
      });
    } else {
      setError(true);
      toast.error('Authentication Failed', {
        description: 'Please check your credentials and try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 mb-4"
          >
            <ShieldCheck className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Secure Access
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Please sign in to your executive assistant dashboard.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-100 dark:border-zinc-800"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`h-12 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 transition-all ${
                  error ? 'ring-1 ring-red-500' : ''
                }`}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-12 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 transition-all ${
                  error ? 'ring-1 ring-red-500' : ''
                }`}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl transition-all duration-300 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <div className="relative mb-6 text-center">
              <span className="bg-white dark:bg-zinc-900 px-4 text-xs font-medium text-zinc-400 uppercase tracking-widest relative z-10">
                Or continue with
              </span>
              <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-100 dark:bg-zinc-800 -z-0"></div>
            </div>
            
            <Button
              variant="outline"
              className="w-full h-12 border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
            
            <p className="mt-6 text-center text-xs text-zinc-400">
              Don&apos;t have an account?{' '}
              <button className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline">
                Request Access
              </button>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em]">
            Premium Executive Assistant AI v1.0
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
