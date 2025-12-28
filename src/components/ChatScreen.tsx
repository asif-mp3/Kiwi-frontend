'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/lib/hooks';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { VoiceVisualizer } from './VoiceVisualizer';
import { LogOut, Sparkles, Mic, StopCircle, MessageSquare, Volume2, ChevronUp, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface ChatScreenProps {
  onLogout: () => void;
  username: string;
}

export function ChatScreen({ onLogout, username }: ChatScreenProps) {
  const { messages, addMessage } = useAppState();
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showText, setShowText] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showText]);

  const handleSendMessage = async (content: string) => {
    addMessage(content, 'user');
    
    // Simulate assistant thinking
    setTimeout(() => {
      const responses = [
        "Certainly, I've updated your schedule accordingly.",
        "I've analyzed the report. The key takeaways are ready for your review.",
        "Excellent choice. I'll make sure everything is prepared for your meeting.",
        "நிச்சயமாக, உங்கள் அட்டவணையை அதற்கேற்ப புதுப்பித்துள்ளேன்.",
        "I've synchronized your preferences across all executive channels.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'assistant');
      
      // Simulate speaking
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 4000);
    }, 1200);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice to text
      setTimeout(() => {
        handleSendMessage("Schedule a meeting with the board for tomorrow at 10 AM.");
        toast.success("Request captured", {
          description: "Processing your executive command...",
        });
      }, 800);
    } else {
      setIsRecording(true);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Premium Executive Header */}
      <header className="flex items-center justify-between px-8 py-6 z-50 absolute top-0 left-0 w-full pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 pointer-events-auto"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center border border-white/10">
              <Sparkles className="w-6 h-6 text-zinc-50 dark:text-zinc-900" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight font-space">
              Executive AI
            </h2>
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ scale: isSpeaking ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-blue-500' : 'bg-emerald-500'}`} 
              />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                {isSpeaking ? 'Speaking' : 'Active'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 pointer-events-auto"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowText(!showText)}
            className={`rounded-2xl h-12 gap-3 px-6 transition-all border ${
              showText 
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white' 
                : 'bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{showText ? 'Hide Log' : 'Review Log'}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </motion.div>
      </header>

      {/* Main Experience */}
      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Background Visual Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: isRecording ? 1.2 : isSpeaking ? 1.1 : 1,
              opacity: isRecording ? 0.4 : isSpeaking ? 0.3 : 0.1
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-400 dark:bg-zinc-800 rounded-full blur-[160px]" 
          />
          {isSpeaking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 transition-opacity duration-1000"
            />
          )}
        </div>

        <AnimatePresence mode="wait">
          {!showText ? (
            <motion.div
              key="voice-mode"
              initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg px-8 flex flex-col items-center gap-16"
            >
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight font-space leading-tight">
                    {isRecording ? "Listening..." : isSpeaking ? "Speaking..." : `Welcome back, ${username}`}
                  </h3>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.6 }}
                  className="text-zinc-500 dark:text-zinc-400 text-base font-light leading-relaxed max-w-xs mx-auto"
                >
                  {isRecording 
                    ? "Your command is being encrypted and processed." 
                    : isSpeaking 
                      ? "Providing secure executive response."
                      : "Ready for your next instruction."}
                </motion.p>
              </div>

              <VoiceVisualizer isRecording={isRecording} isSpeaking={isSpeaking} />

              <div className="relative">
                {/* Voice Button Glow */}
                <AnimatePresence>
                  {isRecording && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.8, opacity: 0.4 }}
                      exit={{ scale: 2.5, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-red-500 rounded-full blur-3xl"
                    />
                  )}
                  {(isSpeaking || (!isRecording && !isSpeaking)) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      className="absolute inset-[-40px] bg-zinc-400 dark:bg-zinc-100 rounded-full blur-3xl"
                    />
                  )}
                </AnimatePresence>

                <Button
                  onClick={handleVoiceToggle}
                  className={`relative z-20 w-40 h-40 rounded-[3rem] transition-all duration-700 shadow-2xl flex flex-col items-center justify-center gap-4 ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600 ring-[20px] ring-red-500/10 rotate-90 scale-110'
                      : 'bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isRecording ? (
                    <StopCircle className="w-14 h-14" />
                  ) : (
                    <Mic className="w-14 h-14" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] ml-1">
                    {isRecording ? 'Release' : 'Engage'}
                  </span>
                </Button>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-6"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Private</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Ready</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="text-mode"
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-30 flex flex-col"
            >
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-8 pb-48 pt-32 mask-fade-top scrollbar-hide"
              >
                <div className="max-w-2xl mx-auto space-y-6">
                  {messages.length === 0 ? (
                    <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                      <MoreHorizontal className="w-8 h-8" />
                      <p className="text-sm font-medium tracking-widest uppercase">No conversation history</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                    ))
                  )}
                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 mt-8 text-zinc-400 text-xs font-medium tracking-wide"
                    >
                      <div className="flex gap-1">
                        <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[2px] bg-blue-500 rounded-full" />
                        <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-[2px] bg-blue-500 rounded-full" />
                        <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-[2px] bg-blue-500 rounded-full" />
                      </div>
                      Assistant is speaking...
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Bottom Navigation for Text Mode */}
              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none flex items-center justify-center pt-10">
                <div className="flex flex-col items-center gap-6 pointer-events-auto">
                  <Button
                    onClick={() => setShowText(false)}
                    variant="ghost"
                    className="h-14 rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl px-8 group transition-all hover:scale-105"
                  >
                    <ChevronUp className="w-5 h-5 mr-3 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Return to Voice</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .mask-fade-top {
          mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
