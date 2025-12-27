'use client';

import { motion } from 'framer-motion';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Play, RotateCcw, Volume2 } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center w-full my-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex w-full mb-6",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed",
          isAssistant
            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-100 dark:border-zinc-800 rounded-bl-none"
            : "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-md rounded-br-none"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {isAssistant && (
          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              <Play className="w-3 h-3" />
              Listen
            </button>
            <button className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              <RotateCcw className="w-3 h-3" />
              Replay
            </button>
            {message.isSpeaking && (
              <div className="flex gap-0.5 ml-auto">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 10, 4] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-0.5 bg-zinc-400 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
