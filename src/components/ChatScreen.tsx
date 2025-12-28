'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/lib/hooks';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { VoiceVisualizer } from './VoiceVisualizer';
import { 
  LogOut, 
  Mic, 
  StopCircle, 
  MessageSquare, 
  ChevronUp, 
  MoreHorizontal,
  Table,
  Settings,
  History,
  X,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ChatScreenProps {
  onLogout: () => void;
  username: string;
}

export function ChatScreen({ onLogout, username }: ChatScreenProps) {
  const { messages, addMessage, config, setGoogleSheetUrl } = useAppState();
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sheetUrl, setSheetUrl] = useState(config.googleSheetUrl || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showHistory]);

  const handleSendMessage = async (content: string) => {
    addMessage(content, 'user');
    
    // Simulate Kiwi thinking
    setTimeout(() => {
      const responses = [
        "I've updated the data from your sheet. Everything looks correct.",
        "Based on the latest entries, the project is progressing well.",
        "நிச்சயமாக, உங்கள் தரவை நான் புதுப்பித்துள்ளேன்.",
        "I've analyzed the RAG pipeline. Your document retrieval is optimized.",
        "The spreadsheet synchronization is complete. What's our next move?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'assistant');
      
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 1500);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => {
        handleSendMessage("Analyze the Q4 projections from the sheet.");
        toast.success("Command Received", {
          description: "Kiwi is processing your data request...",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        });
      }, 800);
    } else {
      setIsRecording(true);
      setIsSpeaking(false);
    }
  };

  const handleSaveSheet = () => {
    setGoogleSheetUrl(sheetUrl);
    setIsModalOpen(false);
    toast.success("Google Sheet Connected", {
      description: "Kiwi is now synchronized with your data source.",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden font-sans text-white selection:bg-emerald-500/30">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      </div>

      {/* Navigation Bar */}
      <header className="relative z-50 flex items-center justify-between px-8 py-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center border border-emerald-500/20 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
              <span className="text-2xl font-black text-emerald-400 font-space">K</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter font-space bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              KIWI
            </h2>
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ 
                  scale: isSpeaking ? [1, 1.5, 1] : 1, 
                  opacity: isSpeaking ? [0.5, 1, 0.5] : 0.5 
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
              />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                {isSpeaking ? 'Analyzing' : 'Ready'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="h-12 w-12 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-xl"
              >
                <Table className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-space font-bold tracking-tight">Sync Google Sheet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Sheet URL</label>
                  <Input 
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="bg-black/50 border-zinc-800 focus:border-emerald-500/50 text-emerald-50"
                  />
                </div>
                <Button 
                  onClick={handleSaveSheet}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl h-12"
                >
                  Synchronize with Kiwi
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            onClick={() => setShowHistory(!showHistory)}
            className={`h-12 px-6 rounded-2xl backdrop-blur-xl border transition-all shadow-xl gap-3 ${
              showHistory 
                ? 'bg-emerald-500 text-white border-emerald-400' 
                : 'bg-zinc-900/50 text-zinc-400 border-white/5 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">History</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-12 w-12 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 text-zinc-500 hover:text-red-400 transition-all shadow-xl"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </motion.div>
      </header>

      {/* Main Experience */}
      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.div
              key="voice"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-12 px-8"
            >
              <div className="text-center space-y-4">
                <motion.h3 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="text-5xl font-black tracking-tighter font-space leading-tight"
                >
                  {isRecording ? "Listening..." : isSpeaking ? "Speaking..." : `Hi ${username}`}
                </motion.h3>
                <p className="text-zinc-500 text-sm font-medium tracking-[0.2em] uppercase">
                  {isRecording ? "Capturing Input" : isSpeaking ? "Generating Response" : "Kiwi Assistant Active"}
                </p>
              </div>

              {/* The Liquid Aura Visualizer */}
              <VoiceVisualizer isRecording={isRecording} isSpeaking={isSpeaking} />

              {/* Main Interaction Hook */}
              <div className="relative">
                <AnimatePresence>
                  {isRecording && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 2.2, opacity: 0.2 }}
                      exit={{ scale: 3, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-emerald-500 rounded-full blur-[60px]"
                    />
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVoiceToggle}
                  className={`relative z-20 w-44 h-44 rounded-full transition-all duration-500 shadow-[0_0_80px_-20px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center gap-4 group ${
                    isRecording
                      ? 'bg-emerald-500 text-white ring-[30px] ring-emerald-500/10'
                      : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30'
                  }`}
                >
                  <div className={`transition-all duration-500 ${isRecording ? 'scale-125' : ''}`}>
                    {isRecording ? (
                      <StopCircle className="w-16 h-16 fill-current" />
                    ) : (
                      <Mic className="w-16 h-16 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] translate-x-[2px]">
                    {isRecording ? 'Stop' : 'Ask'}
                  </span>
                </motion.button>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-10 pt-8 opacity-40">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">RAG Optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Sheet Linked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Secure AES</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 100, filter: 'blur(20px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -100, filter: 'blur(20px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-30 flex flex-col pt-32 px-8"
            >
              <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-3xl font-black font-space tracking-tighter">History</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Chat Log & Data Syncs</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowHistory(false)}
                    className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto space-y-8 pb-32 scrollbar-hide mask-fade-top"
                >
                  {messages.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center opacity-20">
                      <MoreHorizontal className="w-12 h-12 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest">Silence is golden</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                    ))
                  )}
                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 max-w-[80%]"
                    >
                      <div className="flex gap-1 items-center">
                        <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[3px] bg-emerald-500 rounded-full" />
                        <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-[3px] bg-emerald-500 rounded-full" />
                        <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-[3px] bg-emerald-500 rounded-full" />
                      </div>
                      <span className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest ml-2">Kiwi is speaking...</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Floating Return Button */}
              <div className="absolute bottom-12 left-0 w-full flex justify-center pointer-events-none">
                <Button
                  onClick={() => setShowHistory(false)}
                  className="pointer-events-auto h-16 px-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-105 active:scale-95 group"
                >
                  <ChevronUp className="w-6 h-6 mr-3 group-hover:-translate-y-1 transition-transform" />
                  Back to Voice
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-50 px-8 py-6 flex items-center justify-between opacity-30">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Powered by Kiwi-RAG Engine</span>
        <div className="flex gap-4">
          <Settings className="w-3 h-3 cursor-pointer hover:text-emerald-400 transition-colors" />
          <ExternalLink className="w-3 h-3 cursor-pointer hover:text-emerald-400 transition-colors" />
        </div>
      </footer>

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
