'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/lib/hooks';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { VoiceVisualizer } from './VoiceVisualizer';
import { LogOut, User, Sparkles, Mic, StopCircle, MessageSquare, Volume2, ChevronUp } from 'lucide-react';
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
        "நான் உங்கள் உதவியாளர். உங்களுக்கு இன்று எவ்வாறு உதவ முடியும்?",
        "I've synchronized your preferences across all executive channels.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'assistant');
      
      // Simulate speaking
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 1000);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice to text
      setTimeout(() => {
        handleSendMessage("Schedule a meeting with the board for tomorrow at 10 AM.");
        toast.info("Command received");
      }, 500);
    } else {
      setIsRecording(true);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Premium Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-2xl border-b border-zinc-100 dark:border-zinc-800 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-lg shadow-zinc-200/50 dark:shadow-black/50">
            <Sparkles className="w-5 h-5 text-zinc-50 dark:text-zinc-900" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Executive AI
            </h2>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
                {isSpeaking ? 'Assistant Speaking' : 'System Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowText(!showText)}
            className={`rounded-full gap-2 px-4 transition-all ${showText ? 'bg-zinc-900 text-white dark:bg-white dark:text-black' : 'text-zinc-500'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-medium">{showText ? 'Hide Text' : 'Show Text'}</span>
          </Button>
          <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="rounded-full text-zinc-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Experience */}
      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        {/* Background Visual Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-200/20 dark:bg-zinc-800/10 rounded-full blur-[120px]" />
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center gap-12"
            >
              <div className="text-center space-y-4">
                <motion.h3 
                  animate={{ opacity: isRecording ? 0.5 : 1 }}
                  className="text-2xl font-medium text-zinc-900 dark:text-zinc-50 tracking-tight"
                >
                  {isRecording ? "Listening to you..." : isSpeaking ? "I'm listening..." : `Good Day, ${username}`}
                </motion.h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light leading-relaxed max-w-xs mx-auto">
                  {isRecording 
                    ? "Speak clearly. I am processing your commands in real-time." 
                    : isSpeaking 
                      ? "I am responding to your request."
                      : "Your executive interface is active. Use voice to initiate any operation."}
                </p>
              </div>

              <VoiceVisualizer isRecording={isRecording} isSpeaking={isSpeaking} />

              <div className="relative">
                {/* Voice Button Glow */}
                <AnimatePresence>
                  {isRecording && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ scale: 2, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"
                    />
                  )}
                  {isSpeaking && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ scale: 2, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute inset-0 bg-zinc-400/10 dark:bg-zinc-100/10 rounded-full blur-2xl"
                    />
                  )}
                </AnimatePresence>

                <Button
                  onClick={handleVoiceToggle}
                  className={`relative z-20 w-32 h-32 rounded-full transition-all duration-700 shadow-2xl flex flex-col items-center justify-center gap-2 ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600 ring-[12px] ring-red-500/10'
                      : 'bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:scale-105'
                  }`}
                >
                  {isRecording ? (
                    <StopCircle className="w-10 h-10" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    {isRecording ? 'Stop' : 'Ask'}
                  </span>
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="text-mode"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="absolute inset-0 z-30 flex flex-col pt-4"
            >
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-6 pb-32 space-y-4 mask-fade-top"
              >
                <div className="max-w-2xl mx-auto pt-10">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 mt-4 text-zinc-400 text-xs italic"
                    >
                      <Volume2 className="w-3 h-3 animate-pulse" />
                      Assistant speaking...
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Voice Trigger from Text View */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <Button
                  onClick={() => setShowText(false)}
                  variant="ghost"
                  className="rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-lg group"
                >
                  <ChevronUp className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
                  Back to Voice
                </Button>
                
                <Button
                  onClick={handleVoiceToggle}
                  size="icon"
                  className={`w-16 h-16 rounded-full shadow-2xl transition-all ${
                    isRecording ? 'bg-red-500 scale-110' : 'bg-zinc-900 dark:bg-zinc-100'
                  }`}
                >
                  {isRecording ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .mask-fade-top {
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </div>
  );
}
