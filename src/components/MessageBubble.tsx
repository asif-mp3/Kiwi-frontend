'use client';

import { motion } from 'framer-motion';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Play, RotateCcw, Copy, Check, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSystem) {
    return (
      <div className="flex justify-center w-full my-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
          {message.content}
        </span>
      </div>
    );
  }

  const hasTamil = /[\u0B80-\u0BFF]/.test(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "flex w-full group",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] relative",
          isAssistant ? "items-start" : "items-end flex flex-col"
        )}
      >
        {/* Avatar for Assistant */}
        {isAssistant && (
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-[10px] font-black text-white">
              K
            </div>
            <span className="text-xs font-semibold text-zinc-400">Kiwi</span>
          </div>
        )}

        <motion.div
          animate={{ 
            scale: isHovered ? 1.01 : 1,
            boxShadow: isHovered 
              ? isAssistant 
                ? '0 10px 40px rgba(34, 197, 94, 0.1)' 
                : '0 10px 40px rgba(0, 0, 0, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            "px-5 py-4 rounded-2xl text-[15px] leading-relaxed transition-all duration-300",
            isAssistant
              ? "bg-zinc-900/80 backdrop-blur-xl text-zinc-100 border border-zinc-800/50 rounded-tl-md"
              : "bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg rounded-tr-md"
          )}
        >
          <div className={cn(
            "whitespace-pre-wrap font-medium",
            hasTamil ? "leading-[1.9]" : "leading-relaxed"
          )}>
            {message.content}
          </div>
          
          <div className={cn(
            "mt-2 text-[10px] font-medium tracking-wide opacity-50",
            isAssistant ? "text-zinc-400" : "text-green-100"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        {isAssistant && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center gap-2"
          >
            {[
              { icon: Volume2, label: 'Play', onClick: () => {} },
              { icon: RotateCcw, label: 'Replay', onClick: () => {} },
              { icon: copied ? Check : Copy, label: copied ? 'Copied!' : 'Copy', onClick: handleCopy },
            ].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all",
                  copied && action.label === 'Copied!'
                    ? "bg-green-500/20 text-green-400"
                    : "bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                )}
              >
                <action.icon className="w-3 h-3" />
                {action.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
