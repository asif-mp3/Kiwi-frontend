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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-200/50 dark:bg-zinc-800/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-200/50 dark:bg-zinc-800/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 mb-6 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 to-transparent dark:from-zinc-800 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <ShieldCheck className="w-10 h-10 text-zinc-900 dark:text-zinc-100 relative z-10" />
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-space"
          >
            Executive Login
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-zinc-500 dark:text-zinc-400 text-sm font-light tracking-wide"
          >
            Authorize your secure session to continue
          </motion.p>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-white/50 dark:border-zinc-800/50 overflow-hidden relative"
        >
          {/* Internal Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 ml-1">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`h-14 bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 rounded-2xl focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 transition-all text-base ${
                  error ? 'ring-1 ring-red-500 border-red-500' : ''
                }`}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">Password</Label>
                <button type="button" className="text-[10px] uppercase tracking-[0.1em] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Forgot?</button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-14 bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 rounded-2xl focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 transition-all text-base ${
                  error ? 'ring-1 ring-red-500 border-red-500' : ''
                }`}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:scale-[1.02] active:scale-[0.98] rounded-2xl transition-all duration-300 group shadow-xl shadow-zinc-900/10 dark:shadow-black/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-3 font-semibold tracking-wide">
                  Secure Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <div className="relative mb-8 text-center">
              <span className="bg-white/0 dark:bg-zinc-900/0 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] relative z-10">
                Authorized Channels
              </span>
              <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-100 dark:bg-zinc-800 -z-0 opacity-50"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-14 border-zinc-100 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 font-medium text-zinc-600 dark:text-zinc-400"
                disabled={isLoading}
              >
                <Chrome className="w-5 h-5 mr-3 text-zinc-400" />
                Google
              </Button>
              <Button
                variant="outline"
                className="h-14 border-zinc-100 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 font-medium text-zinc-600 dark:text-zinc-400"
                disabled={isLoading}
              >
                <ShieldCheck className="w-5 h-5 mr-3 text-zinc-400" />
                SSO
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center space-y-4"
        >
          <p className="text-xs text-zinc-400">
            Internal Access Only. <button className="text-zinc-900 dark:text-zinc-100 font-bold hover:underline transition-all">Request Credentials</button>
          </p>
          <div className="flex items-center justify-center gap-4 opacity-30 grayscale contrast-150">
            <div className="h-4 w-px bg-zinc-400" />
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-zinc-500">
              End-to-End Encrypted
            </p>
            <div className="h-4 w-px bg-zinc-400" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
