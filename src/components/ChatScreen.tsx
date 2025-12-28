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
  Square, 
  MessageCircle, 
  ChevronLeft, 
  MoreHorizontal,
  Table,
  History,
  X,
  Plus,
  Trash2,
  Sparkles,
  MessageSquarePlus,
  ChevronRight,
  Settings,
  Zap
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
import { ChatTab } from '@/lib/types';

interface ChatScreenProps {
  onLogout: () => void;
  username: string;
}

export function ChatScreen({ onLogout, username }: ChatScreenProps) {
  const { 
    messages, 
    addMessage, 
    config, 
    setGoogleSheetUrl,
    chatTabs,
    activeChatId,
    createNewChat,
    switchChat,
    deleteChat
  } = useAppState();
  
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showChatsPanel, setShowChatsPanel] = useState(false);
  const [sheetUrl, setSheetUrl] = useState(config.googleSheetUrl || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showChat]);

  const handleSendMessage = async (content: string) => {
    if (!activeChatId) {
      createNewChat();
    }
    addMessage(content, 'user');
    
    setTimeout(() => {
      const responses = [
        "I've processed the data from your sheet. Everything looks accurate.",
        "Based on the analysis, the metrics are trending positively.",
        "நிச்சயமாக, உங்கள் தரவை நான் புதுப்பித்துள்ளேன்.",
        "The RAG pipeline has been optimized for your query.",
        "Synchronization complete. Ready for your next command.",
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
        handleSendMessage("Analyze the latest entries from the connected sheet.");
        toast.success("Voice captured", {
          description: "Kiwi is processing your request...",
        });
      }, 600);
    } else {
      setIsRecording(true);
      setIsSpeaking(false);
    }
  };

  const handleSaveSheet = () => {
    setGoogleSheetUrl(sheetUrl);
    setIsModalOpen(false);
    toast.success("Sheet Connected", {
      description: "Your Google Sheet is now linked to Kiwi.",
    });
  };

  const handleNewChat = () => {
    createNewChat();
    setShowChatsPanel(false);
    toast.success("New conversation started");
  };

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans text-white">
      {/* Your Chats Sidebar */}
      <AnimatePresence>
        {showChatsPanel && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-80 z-50 glass border-r border-zinc-800/50 flex flex-col"
          >
            <div className="p-6 border-b border-zinc-800/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-display tracking-tight">Your Chats</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChatsPanel(false)}
                  className="h-9 w-9 rounded-xl hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              <Button
                onClick={handleNewChat}
                className="w-full h-12 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4 hide-scrollbar">
              {chatTabs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 opacity-40">
                  <MessageCircle className="w-10 h-10 mb-3" />
                  <p className="text-sm font-medium">No conversations yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatTabs.map((tab) => (
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative p-4 rounded-xl cursor-pointer transition-all ${
                        activeChatId === tab.id 
                          ? 'bg-green-500/10 border border-green-500/20' 
                          : 'hover:bg-zinc-800/50 border border-transparent'
                      }`}
                      onClick={() => {
                        switchChat(tab.id);
                        setShowChatsPanel(false);
                        setShowChat(true);
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{tab.title}</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {tab.messages.length} messages
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(tab.id);
                          }}
                          className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {showChatsPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowChatsPanel(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-green-500/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_70%)]" />
        </div>

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowChatsPanel(true)}
              className="h-11 px-4 rounded-xl glass border border-zinc-800/50 hover:border-green-500/30 hover:bg-zinc-800/50 transition-all gap-3"
            >
              <MessageSquarePlus className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Your Chats</span>
              {chatTabs.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-green-500/20 text-green-400 rounded-full">
                  {chatTabs.length}
                </span>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-11 w-11 rounded-xl glass border border-zinc-800/50 hover:border-green-500/30 hover:bg-zinc-800/50 transition-all"
                >
                  <Table className="w-4 h-4 text-zinc-400" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-display font-bold">Connect Google Sheet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Sheet URL</label>
                    <Input 
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className="bg-black/50 border-zinc-800 focus:border-green-500/50 h-12 rounded-xl"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveSheet}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl h-12 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Connect to Kiwi
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              onClick={() => setShowChat(!showChat)}
              className={`h-11 px-4 rounded-xl border transition-all gap-2 ${
                showChat 
                  ? 'bg-green-500 text-white border-green-400 hover:bg-green-400' 
                  : 'glass border-zinc-800/50 hover:border-green-500/30 hover:bg-zinc-800/50'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Chat</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-11 w-11 rounded-xl glass border border-zinc-800/50 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Main Experience */}
        <main className="flex-1 relative flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {!showChat ? (
              <motion.div
                key="voice"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-8 px-8"
              >
                {/* Brand Header */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center space-y-3"
                >
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-zinc-800/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Kiwi RAG Engine</span>
                  </div>
                  <h1 className="text-5xl font-display font-bold tracking-tight">
                    {isRecording ? (
                      <span className="text-green-400">Listening<span className="animate-pulse">...</span></span>
                    ) : isSpeaking ? (
                      <span className="text-teal-400">Speaking<span className="animate-pulse">...</span></span>
                    ) : (
                      <>Hey, <span className="gradient-text">{username}</span></>
                    )}
                  </h1>
                  <p className="text-zinc-500 text-base font-medium max-w-md mx-auto">
                    {isRecording 
                      ? "Your voice is being captured securely" 
                      : isSpeaking 
                        ? "Generating intelligent response"
                        : "Tap the button below to start a voice conversation"}
                  </p>
                </motion.div>

                {/* Voice Visualizer */}
                <VoiceVisualizer isRecording={isRecording} isSpeaking={isSpeaking} />

                {/* Voice Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVoiceToggle}
                  className={`relative w-20 h-20 rounded-full transition-all duration-500 flex items-center justify-center ${
                    isRecording
                      ? 'bg-green-500 shadow-[0_0_60px_rgba(34,197,94,0.5)]'
                      : 'bg-zinc-800 border border-zinc-700 hover:border-green-500/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)]'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isRecording ? (
                      <motion.div
                        key="stop"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                      >
                        <Square className="w-7 h-7 text-white fill-current" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="mic"
                        initial={{ scale: 0, rotate: 90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -90 }}
                      >
                        <Mic className="w-7 h-7 text-zinc-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Status Pills */}
                <div className="flex items-center gap-4 mt-4">
                  {[
                    { label: 'RAG Active', active: true },
                    { label: config.googleSheetUrl ? 'Sheet Linked' : 'No Sheet', active: !!config.googleSheetUrl },
                    { label: 'Voice Ready', active: true },
                  ].map((status, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        status.active 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${status.active ? 'bg-green-500' : 'bg-zinc-600'}`} />
                      {status.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 z-20 flex flex-col pt-4"
              >
                <div className="max-w-3xl mx-auto w-full flex flex-col h-full px-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold">Chat</h2>
                      <p className="text-zinc-500 text-sm">Conversation with Kiwi</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowChat(false)}
                      className="h-10 w-10 rounded-xl glass border border-zinc-800/50 hover:border-green-500/30"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  </div>

                  <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto space-y-6 pb-32 hide-scrollbar"
                  >
                    {messages.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center opacity-40">
                        <Sparkles className="w-12 h-12 mb-4 text-green-500/50" />
                        <p className="text-sm font-medium">Start a conversation with Kiwi</p>
                        <p className="text-xs text-zinc-600 mt-1">Use voice or type to begin</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                      ))
                    )}
                    {isSpeaking && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 max-w-[80%]"
                      >
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ height: [4, 16, 4] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                              className="w-1 bg-teal-400 rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-teal-400">Kiwi is typing...</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Floating Voice Button */}
                <div className="absolute bottom-8 left-0 w-full flex justify-center pointer-events-none">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVoiceToggle}
                    className={`pointer-events-auto w-16 h-16 rounded-full transition-all duration-300 flex items-center justify-center shadow-2xl ${
                      isRecording
                        ? 'bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.5)]'
                        : 'bg-zinc-800 border border-zinc-700 hover:border-green-500/50'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-6 h-6 text-white fill-current" />
                    ) : (
                      <Mic className="w-6 h-6 text-zinc-300" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-4 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">
            Powered by Kiwi-RAG
          </span>
          <div className="flex items-center gap-3">
            <Zap className="w-3 h-3 text-green-500/50" />
            <span className="text-[10px] font-medium text-zinc-600">v2.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
