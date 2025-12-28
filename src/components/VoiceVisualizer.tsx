'use client';

import { motion, AnimatePresence } from 'framer-motion';

export function VoiceVisualizer({ isRecording, isSpeaking }: { isRecording: boolean; isSpeaking: boolean }) {
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* SVG Filter for the Liquid/Gooey effect */}
      <svg className="absolute invisible">
        <defs>
          <filter id="liquid-aura">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" 
              result="liquid" 
            />
            <feComposite in="SourceGraphic" in2="liquid" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="relative w-72 h-72 flex items-center justify-center filter url(#liquid-aura)">
        {/* Deep Background Pulse */}
        <motion.div
          animate={{
            scale: isRecording ? [1, 1.4, 1] : isSpeaking ? [1, 1.2, 1] : 1,
            opacity: isRecording ? 0.6 : isSpeaking ? 0.4 : 0.1,
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          }}
          className="absolute w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl"
        />

        {/* Morphing Liquid Blobs */}
        <AnimatePresence>
          {(isRecording || isSpeaking) && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0, rotate: 0 }}
                  animate={{
                    scale: [1, 1.6 + i * 0.1, 1],
                    opacity: [0.4, 0.8, 0.4],
                    rotate: [0, 360],
                    x: [0, (i - 2) * 45 * (isRecording ? 1.5 : 1), 0],
                    y: [0, ((i % 2 === 0 ? 1 : -1) * 35) * (isRecording ? 1.5 : 1), 0],
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + i,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                  className={`absolute rounded-full blur-xl ${
                    isRecording 
                      ? 'bg-emerald-400/40 w-32 h-32' 
                      : 'bg-lime-400/30 w-28 h-28'
                  }`}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Core Interaction Sphere */}
        <motion.div
          animate={{
            scale: isRecording ? [1, 1.15, 1] : isSpeaking ? [1, 1.05, 1] : 1,
            boxShadow: isRecording 
              ? "0 0 60px 20px rgba(16, 185, 129, 0.4)" 
              : isSpeaking 
                ? "0 0 40px 10px rgba(132, 204, 22, 0.2)"
                : "0 0 20px 0px rgba(0, 0, 0, 0.1)"
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
          className="relative z-10 w-28 h-28 rounded-full bg-white/10 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/20 dark:border-zinc-800 flex items-center justify-center overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-lime-500/10" />
          
          {/* High-Fidelity Waveform */}
          <div className="flex items-end gap-[4px] h-10">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isRecording || isSpeaking 
                    ? [8, Math.random() * 32 + 8, 8] 
                    : 4,
                  opacity: isRecording || isSpeaking ? 1 : 0.3
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.4 + (i * 0.05),
                  ease: "easeInOut"
                }}
                className={`w-[3px] rounded-full transition-colors duration-500 ${
                  isRecording 
                    ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                    : isSpeaking 
                      ? 'bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.5)]'
                      : 'bg-zinc-400 dark:bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Outer Floating Particles */}
      <AnimatePresence>
        {isRecording && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`p-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: [0, (Math.random() - 0.5) * 300],
                  y: [0, (Math.random() - 0.5) * 300],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 2
                }}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400/40"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
