'use client';

import { motion } from 'framer-motion';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Play, RotateCcw, Volume2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSystem) {
    return (
      <div className="flex justify-center w-full my-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black opacity-50">
          {message.content}
        </span>
      </div>
    );
  }

  // Detect Tamil text to apply specific styling if needed
  const hasTamil = /[\u0B80-\u0BFF]/.test(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex w-full mb-8",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] group relative",
          isAssistant ? "items-start" : "items-end flex flex-col"
        )}
      >
        <div
          className={cn(
            "px-6 py-4 rounded-[2rem] text-[15px] leading-relaxed shadow-sm transition-all duration-500",
            isAssistant
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800 rounded-tl-none hover:shadow-md"
              : "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-xl shadow-zinc-900/10 dark:shadow-black/20 rounded-tr-none"
          )}
        >
          <div className={cn(
            "whitespace-pre-wrap font-medium tracking-tight",
            hasTamil ? "font-sans leading-[1.8]" : ""
          )}>
            {message.content}
          </div>
          
          <div className={cn(
            "mt-1 text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-40 transition-opacity",
            isAssistant ? "text-zinc-400" : "text-zinc-500"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        {isAssistant && (
          <div className="mt-3 px-2 flex items-center gap-5">
            <button 
              onClick={() => {}} 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all active:scale-90"
            >
              <Play className="w-3.5 h-3.5" />
              Listen
            </button>
            <button 
              onClick={() => {}} 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all active:scale-90"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Replay
            </button>
            <button 
              onClick={handleCopy} 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all active:scale-90"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
