'use client';

import { motion, AnimatePresence } from 'framer-motion';

export function VoiceVisualizer({ isRecording, isSpeaking }: { isRecording: boolean; isSpeaking: boolean }) {
  return (
    <div className="relative w-full h-40 flex items-center justify-center">
      {/* SVG Filter for the Liquid/Gooey effect */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="relative w-64 h-64 flex items-center justify-center filter url(#goo)">
        {/* Base Aura */}
        <motion.div
          animate={{
            scale: isRecording ? [1, 1.2, 1] : isSpeaking ? [1, 1.1, 1] : 1,
            opacity: isRecording || isSpeaking ? 0.6 : 0.2,
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
          className={`absolute w-32 h-32 rounded-full blur-xl ${
            isRecording ? 'bg-red-500/40' : 'bg-zinc-400/20 dark:bg-zinc-200/20'
          }`}
        />

        {/* Orbiting / Morphing Blobs */}
        <AnimatePresence>
          {(isRecording || isSpeaking) && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                    x: [0, (i - 1) * 40, 0],
                    y: [0, (i % 2 === 0 ? 1 : -1) * 30, 0],
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    repeat: Infinity,
                    duration: 2 + i,
                    ease: "easeInOut",
                    delay: i * 0.4
                  }}
                  className={`absolute w-24 h-24 rounded-full blur-lg ${
                    isRecording 
                      ? 'bg-red-400/30' 
                      : 'bg-zinc-400/20 dark:bg-zinc-200/10'
                  }`}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Inner Core */}
        <motion.div
          animate={{
            scale: isRecording ? [1, 1.1, 1] : 1,
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
          className="relative z-10 w-20 h-20 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
          
          {/* Waveform Lines */}
          <div className="flex items-center gap-[3px] h-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isRecording || isSpeaking ? [4, 20, 4] : 4,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5,
                  delay: i * 0.1,
                }}
                className={`w-[2px] rounded-full ${
                  isRecording ? 'bg-red-500' : 'bg-zinc-900 dark:bg-white'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
