'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, ShieldCheck, KeyRound, Lock } from 'lucide-react';
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
      toast.success('Identity Verified', {
        description: 'Welcome back to the Kiwi-RAG ecosystem.',
      });
    } else {
      setError(true);
      toast.error('Verification Failed', {
        description: 'Identity not recognized. Access denied.',
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 relative overflow-hidden selection:bg-emerald-500/30">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500 rounded-full blur-[160px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05] 
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-lime-500 rounded-full blur-[160px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-12 relative z-10"
      >
        <div className="text-center space-y-6">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-zinc-900 shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)] border border-emerald-500/20 mb-4 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
            <ShieldCheck className="w-12 h-12 text-emerald-400 relative z-10" />
          </motion.div>
          
          <div className="space-y-2">
            <motion.h1 
              variants={itemVariants}
              className="text-5xl font-black tracking-tighter text-white font-space uppercase"
            >
              Kiwi <span className="text-emerald-500">Access</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-zinc-500 text-xs font-bold tracking-[0.3em] uppercase"
            >
              Enterprise Retrieval Engine
            </motion.p>
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-zinc-900/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500 ml-2">Username</Label>
              <div className="relative group">
                <Input
                  id="username"
                  type="text"
                  placeholder="ID_EXECUTIVE"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`h-16 bg-black/40 border-zinc-800 rounded-2xl focus-visible:ring-emerald-500/50 transition-all text-emerald-50 placeholder:text-zinc-700 pl-12 ${
                    error ? 'border-red-500/50' : ''
                  }`}
                  disabled={isLoading}
                />
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Authorization Key</Label>
              </div>
              <div className="relative group">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-16 bg-black/40 border-zinc-800 rounded-2xl focus-visible:ring-emerald-500/50 transition-all text-emerald-50 placeholder:text-zinc-700 pl-12 ${
                    error ? 'border-red-500/50' : ''
                  }`}
                  disabled={isLoading}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all duration-500 group shadow-2xl shadow-emerald-500/20 active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-sm">
                  Initialize Session <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
            <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Secure Retrieval Nodes</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-14 border-zinc-800 bg-black/20 rounded-2xl hover:bg-zinc-800/50 transition-all text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30"
                disabled={isLoading}
              >
                G-SHEETS
              </Button>
              <Button
                variant="outline"
                className="h-14 border-zinc-800 bg-black/20 rounded-2xl hover:bg-zinc-800/50 transition-all text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30"
                disabled={isLoading}
              >
                KIWI-RAG
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center space-y-8"
        >
          <div className="flex items-center justify-center gap-8 opacity-20">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">RAG v2.4</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">AES-256</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">SOC2</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
