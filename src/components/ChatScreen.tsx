'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/lib/hooks';
import { MessageBubble } from './MessageBubble';
import { VoiceVisualizer } from './VoiceVisualizer';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  Zap,
  User,
  Send,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChatTab } from '@/lib/types';
import { DatasetConnection } from './DatasetConnection';

interface ChatScreenProps {
  onLogout: () => void;
  username: string;
}

export function ChatScreen({ onLogout, username }: ChatScreenProps) {
  const {
    messages,
    addMessage,
    config,
    chatTabs,
    activeChatId,
    createNewChat,
    switchChat,
    deleteChat,
    getCurrentChat,
    setDatasetForChat
  } = useAppState();

  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showChatsPanel, setShowChatsPanel] = useState(false);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  /* New State for Voice Section Toggles */
  const [expandedVoiceSection, setExpandedVoiceSection] = useState<'plan' | 'data' | 'schema' | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showChat]);

  const activeChat = getCurrentChat();

  const handleSendMessage = async (content: string) => {
    if (!activeChatId) {
      createNewChat();
    }

    // Check for dataset connection
    const currentChat = activeChatId ? chatTabs.find(t => t.id === activeChatId) : null;
    if (!currentChat || currentChat.datasetStatus !== 'ready') {
      setIsDatasetModalOpen(true);
      toast.error("Dataset Required", { description: "Please connect a Google Sheet to continue." });
      return;
    }

    addMessage(content, 'user');

    // Call API with delay
    try {
      const response = await api.sendMessage(content);

      if (response.success) {
        addMessage(response.explanation, 'assistant', {
          plan: response.plan,
          data: response.data,
          schema_context: response.schema_context,
          data_refreshed: response.data_refreshed
        });

        if (isVoiceMode) { // Check if we should speak (controlled by previous logic)
          setIsSpeaking(true);
          setTimeout(() => setIsSpeaking(false), 3000);
        }
      } else {
        addMessage("Sorry, I encountered an error extracting that information.", 'assistant');
      }

    } catch (error) {
      addMessage("Network connection error. Please try again.", 'assistant');
    }
  };

  const handleVoiceToggle = async () => {
    if (!activeChat) {
      // Trigger new chat or mandatory dataset prompt
      if (!isDatasetModalOpen) setIsDatasetModalOpen(true);
      return;
    }

    if (!activeChat.datasetUrl) {
      toast.error("Please connect a dataset first", {
        description: "Kiwi needs data to answer your questions."
      });
      setIsDatasetModalOpen(true);
      return;
    }

    const newIsListening = !isListening;
    setIsListening(newIsListening);

    if (newIsListening) { // Started listening
      // Reset any open panels
      setExpandedVoiceSection(null);

      // In a real implementation: Start MediaRecorder here
      // timerRef.current = setTimeout(...) 

      // AUTOMATIC STOP SIMULATION after 5 seconds
      // This simulates the user finishing their sentence and silence detection triggering query
      setTimeout(async () => {
        setIsListening(false);

        // Create a dummy audio blob to satisfy the API contract
        // In real app, this comes from MediaRecorder.ondataavailable
        const mockBlob = new Blob(["mock_audio_data"], { type: "audio/wav" });

        try {
          // Call strict API endpoint
          const text = await api.transcribeAudio(mockBlob);

          // Then send message text
          handleSendMessage(text);
        } catch (err) {
          toast.error("Voice processing failed");
        }
      }, 5000);

    } else {
      // Manual stop - would trigger same logic as above in real app
      // For now, the timeout above handles the "flow"
    }
  };

  const handleDatasetSuccess = (url: string) => {
    setDatasetForChat(url, 'ready', {
      totalTables: 25,
      totalRecords: 1305,
      sheetCount: 5,
      sheets: ['Month', 'Profit', 'November_Detail', 'Calculation_of_Profit', 'Freshggies_Shop']
    });
    setIsDatasetModalOpen(false);
    toast.success("Dataset Connected", { description: "Kiwi is now ready to analyze your data." });
  };

  const handleNewChat = () => {
    createNewChat();
    setShowChatsPanel(false);
    toast.success("New conversation started");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
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
                      className={`group relative p-4 rounded-xl cursor-pointer transition-all ${activeChatId === tab.id
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

      {/* Chats Panel Overlay */}
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
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-green-500/8 dark:bg-green-500/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-500/5 dark:bg-teal-500/5 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowChatsPanel(true)}
              className="h-11 px-4 rounded-xl glass border border-border hover:border-green-500/30 hover:bg-accent transition-all gap-3"
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
            <Button
              variant="ghost"
              onClick={() => setIsDatasetModalOpen(true)}
              className={cn(
                "h-11 px-4 rounded-xl glass border transition-all gap-2",
                activeChat?.datasetStatus === 'ready'
                  ? "border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                  : "border-border hover:border-green-500/30 hover:bg-accent"
              )}
            >
              <Table className={cn("w-4 h-4", activeChat?.datasetStatus === 'ready' ? "text-green-400" : "text-zinc-400")} />
              <span className="text-sm font-medium hidden sm:inline">
                {activeChat?.datasetStatus === 'ready' ? 'Loaded Successfully' : ''}
              </span>
            </Button>

            <DatasetConnection
              isOpen={isDatasetModalOpen}
              onClose={() => setIsDatasetModalOpen(false)}
              onSuccess={handleDatasetSuccess}
              initialUrl={activeChat?.datasetUrl || ''}
              isLocked={activeChat?.datasetStatus === 'ready'}
            />

            <Button
              variant="ghost"
              onClick={() => setShowChat(!showChat)}
              className={`h-11 px-4 rounded-xl border transition-all gap-2 ${showChat
                ? 'bg-green-500 text-white border-green-400 hover:bg-green-400'
                : 'glass border-border hover:border-green-500/30 hover:bg-accent'
                }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Chat</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-xl glass border border-border hover:border-green-500/30 hover:bg-accent transition-all"
                >
                  <User className="w-4 h-4 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border text-card-foreground">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{username}</p>
                    <p className="text-xs leading-none text-muted-foreground">Kiwi Assistant User</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={() => setShowSettings(true)}
                  className="cursor-pointer hover:bg-accent focus:bg-accent"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-accent focus:bg-accent">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="cursor-pointer text-red-400 hover:bg-accent focus:bg-accent hover:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="bg-card border-border text-card-foreground sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'light'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-border hover:border-muted-foreground bg-muted'
                      }`}
                  >
                    <Sun className="w-5 h-5" />
                    <span className="text-xs font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'system'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-border hover:border-muted-foreground bg-muted'
                      }`}
                  >
                    <Monitor className="w-5 h-5" />
                    <span className="text-xs font-medium">System</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'dark'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-border hover:border-muted-foreground bg-muted'
                      }`}
                  >
                    <Moon className="w-5 h-5" />
                    <span className="text-xs font-medium">Dark</span>
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
                className="relative z-10 w-full max-w-2xl flex flex-col items-center justify-between h-full py-8 gap-4 px-6"
              >
                <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
                  {/* Brand Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-2"
                  >
                    <h1 className="text-4xl font-display font-bold tracking-tight">
                      {isRecording ? (
                        <span className="text-green-400">Listening<span className="animate-pulse">...</span></span>
                      ) : isSpeaking ? (
                        <span className="text-teal-400">Speaking<span className="animate-pulse">...</span></span>
                      ) : (
                        <>Hey, <span className="gradient-text">{username}</span></>
                      )}
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium max-w-md mx-auto">
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
                    className={`relative w-16 h-16 rounded-full transition-all duration-500 flex items-center justify-center ${isRecording
                      ? 'bg-green-500 shadow-[0_0_60px_rgba(34,197,94,0.5)]'
                      : 'bg-secondary border border-border hover:border-primary/50 hover:shadow-[0_0_40px_rgba(var(--primary),0.2)]'
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
                          <Square className="w-6 h-6 text-white fill-current" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="mic"
                          initial={{ scale: 0, rotate: 90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: -90 }}
                        >
                          <Mic className="w-6 h-6 text-muted-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Info Toggles */}
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setExpandedVoiceSection(expandedVoiceSection === 'plan' ? null : 'plan')}
                      className={cn("h-9 px-4 rounded-xl glass border transition-all gap-2",
                        expandedVoiceSection === 'plan' ? "bg-primary/10 border-primary/50 text-primary" : "border-border hover:border-primary/30 hover:bg-accent"
                      )}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Query Plan</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setExpandedVoiceSection(expandedVoiceSection === 'data' ? null : 'data')}
                      className={cn("h-9 px-4 rounded-xl glass border transition-all gap-2",
                        expandedVoiceSection === 'data' ? "bg-primary/10 border-primary/50 text-primary" : "border-border hover:border-primary/30 hover:bg-accent"
                      )}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Data</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setExpandedVoiceSection(expandedVoiceSection === 'schema' ? null : 'schema')}
                      className={cn("h-9 px-4 rounded-xl glass border transition-all gap-2",
                        expandedVoiceSection === 'schema' ? "bg-primary/10 border-primary/50 text-primary" : "border-border hover:border-primary/30 hover:bg-accent"
                      )}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Schema Context</span>
                    </Button>
                  </div>

                  {/* Expanded Content Area */}
                  <AnimatePresence>
                    {expandedVoiceSection && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: 20 }}
                        className="w-full bg-zinc-950 rounded-xl border border-border overflow-hidden"
                      >
                        <div className="p-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                          {expandedVoiceSection === 'plan' && (
                            <div className="font-mono text-xs">
                              <div className="flex items-center gap-2 mb-2 text-primary font-bold uppercase tracking-wider">
                                <Sparkles className="w-3 h-3" /> Query Plan
                              </div>
                              <pre className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                                {`{
  "query_type": "lookup",
  "table": "Freshggies_Shopify_Sales_on_Fulfiilments_October_by_Category",
  "select_columns": [
    "Sales by Cat",
    "Gross sales - 07/10/2025"
  ],
  "filters": [
    {
      "column": "Sales by Cat",
      "operator": "LIKE",
      "value": "%fresh fruits%"
    }
  ],
  "limit": 1,
  "metrics": [],
  "group_by": [],
  "order_by": []
}`}
                              </pre>
                            </div>
                          )}

                          {expandedVoiceSection === 'data' && (
                            <div className="text-xs">
                              <div className="flex items-center gap-2 mb-3 text-primary font-bold uppercase tracking-wider">
                                <Table className="w-3 h-3" /> Data Preview
                              </div>
                              <div className="w-full overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-white/10 text-zinc-500">
                                      <th className="py-2 px-3 font-medium">Category</th>
                                      <th className="py-2 px-3 font-medium">August Qty</th>
                                      <th className="py-2 px-3 font-medium text-right">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-zinc-300">
                                    <tr className="border-b border-white/5">
                                      <td className="py-2 px-3">Fresh Fruits</td>
                                      <td className="py-2 px-3">125</td>
                                      <td className="py-2 px-3 text-right">820</td>
                                    </tr>
                                    <tr className="border-b border-white/5 bg-white/5">
                                      <td className="py-2 px-3">Vegetables</td>
                                      <td className="py-2 px-3">98</td>
                                      <td className="py-2 px-3 text-right">450</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {expandedVoiceSection === 'schema' && (
                            <div className="text-xs font-mono text-zinc-400 space-y-3">
                              <div className="flex items-center gap-2 mb-2 text-primary font-bold uppercase tracking-wider font-sans">
                                <Settings className="w-3 h-3" /> Schema Context
                              </div>
                              <div className="p-2 bg-white/5 rounded border border-white/10">
                                <span className="text-zinc-300 font-bold">1. Table 'sales':</span> Columns: Freshggies - Shopify Sales on Fulfillments (TIMESTAMP_NS), Unnamed (VARCHAR), Unnamed_1 (BIGINT)...
                              </div>
                              <div className="p-2 bg-white/5 rounded border border-white/10">
                                <span className="text-zinc-300 font-bold">2. Table 'sales by cat':</span> Columns: Unnamed (INTEGER), Unnamed_1 (INTEGER), Freshggies - Shopify Sales on Fulfillments (VARCHAR)...
                              </div>
                              <div className="p-2 bg-white/5 rounded border border-white/10">
                                <span className="text-zinc-300 font-bold">3. Table 'Month':</span> Columns: S.no (BIGINT), Lineitem name (VARCHAR), M Category (VARCHAR), August (BIGINT)...
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

                {/* Input Box with Voice and Send */}
                <div className="absolute bottom-6 left-0 right-0 px-6 pointer-events-none">
                  <div className="max-w-3xl mx-auto pointer-events-auto">
                    <div className="flex items-center gap-2 p-2 rounded-2xl glass border border-border bg-card/80 backdrop-blur-xl">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && inputMessage.trim()) {
                            handleSendMessage(inputMessage);
                            setInputMessage('');
                          }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleVoiceToggle}
                        className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${isRecording
                          ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]'
                          : 'bg-secondary border border-border hover:border-primary/50'
                          }`}
                      >
                        {isRecording ? (
                          <Square className="w-5 h-5 text-white fill-current" />
                        ) : (
                          <Mic className="w-5 h-5 text-muted-foreground" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (inputMessage.trim()) {
                            handleSendMessage(inputMessage);
                            setInputMessage('');
                          }
                        }}
                        disabled={!inputMessage.trim()}
                        className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${inputMessage.trim()
                          ? 'bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)]'
                          : 'bg-secondary border border-border opacity-50 cursor-not-allowed'
                          }`}
                      >
                        <Send className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
