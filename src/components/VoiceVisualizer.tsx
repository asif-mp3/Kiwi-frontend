'use client';

import { motion } from 'framer-motion';

export function VoiceVisualizer({ isRecording, isSpeaking }: { isRecording: boolean; isSpeaking: boolean }) {
  const bars = Array.from({ length: 40 });

  return (
    <div className="flex items-center justify-center gap-[2px] h-20 w-full max-w-md mx-auto">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: isRecording || isSpeaking 
              ? [10, Math.random() * 60 + 10, 10] 
              : 4,
            opacity: isRecording || isSpeaking ? 1 : 0.3,
          }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            delay: i * 0.02,
            ease: "easeInOut",
          }}
          className={`w-[3px] rounded-full ${
            isRecording 
              ? 'bg-red-500' 
              : isSpeaking 
                ? 'bg-zinc-900 dark:bg-zinc-100' 
                : 'bg-zinc-300 dark:bg-zinc-700'
          }`}
        />
      ))}
    </div>
  );
}
