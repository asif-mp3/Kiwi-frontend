'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/lib/hooks';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { LogOut, User, Sparkles, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface ChatScreenProps {
  onLogout: () => void;
  username: string;
}

export function ChatScreen({ onLogout, username }: ChatScreenProps) {
  const { messages, addMessage, isInitializing } = useAppState();
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    addMessage(content, 'user');
    
    // Simulate assistant thinking
    setTimeout(() => {
      const responses = [
        "Certainly, I've updated your schedule accordingly.",
        "I've analyzed the report. The key takeaways are ready for your review.",
        "Excellent choice. I'll make sure everything is prepared for your meeting.",
        "நான் உங்கள் உதவியாளர். உங்களுக்கு இன்று எவ்வாறு உதவ முடியும்? (I am your assistant. How can I help you today?)",
        "I've synchronized your preferences across all executive channels.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'assistant');
    }, 1000);
  };

  const handleVoiceStart = () => {
    setIsRecording(true);
    // In a real app, this would start MediaRecorder
  };

  const handleVoiceStop = () => {
    setIsRecording(false);
    // Simulate voice to text
    setTimeout(() => {
      handleSendMessage("Schedule a meeting with the board for tomorrow at 10 AM.");
      toast.info("Audio processed successfully");
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Premium Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-lg shadow-zinc-200/50 dark:shadow-black/50">
            <Sparkles className="w-5 h-5 text-zinc-50 dark:text-zinc-900" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Executive AI
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
                System Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <User className="w-5 h-5" />
          </Button>
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

      {/* Message Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-2 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                <Sparkles className="w-10 h-10 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Good Morning, {username}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs mx-auto">
                  Your executive assistant is ready. How can I facilitate your operations today?
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3 w-full max-w-sm pt-4">
                {[
                  "Summarize my recent briefings",
                  "Prepare itinerary for London trip",
                  "Draft a response to the quarterly review"
                ].map((suggestion, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    onClick={() => handleSendMessage(suggestion)}
                    className="justify-start h-auto py-3 px-4 border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left text-sm"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onVoiceStart={handleVoiceStart}
        onVoiceStop={handleVoiceStop}
        isRecording={isRecording}
      />
    </div>
  );
}
