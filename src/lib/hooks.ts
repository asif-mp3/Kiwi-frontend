'use client';

import { useState, useEffect } from 'react';
import { Message, AuthState, AppConfig, MessageRole, ChatTab } from './types';

const AUTH_KEY = 'kiwi_assistant_auth';
const CHAT_KEY = 'kiwi_assistant_chat';
const CONFIG_KEY = 'kiwi_assistant_config';
const CHAT_TABS_KEY = 'kiwi_assistant_tabs';

export function useAppState() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatTabs, setChatTabs] = useState<ChatTab[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [config, setConfig] = useState<AppConfig>({
    googleSheetUrl: null,
  });
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    const savedChat = localStorage.getItem(CHAT_KEY);
    const savedConfig = localStorage.getItem(CONFIG_KEY);
    const savedTabs = localStorage.getItem(CHAT_TABS_KEY);

    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }

    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }

    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    if (savedTabs) {
      const tabs = JSON.parse(savedTabs);
      setChatTabs(tabs);
      if (tabs.length > 0) {
        setActiveChatId(tabs[0].id);
      }
    }

    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    }
  }, [auth, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    }
  }, [messages, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    }
  }, [config, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem(CHAT_TABS_KEY, JSON.stringify(chatTabs));
    }
  }, [chatTabs, isInitializing]);

  const login = (username: string) => {
    setAuth({ isAuthenticated: true, username });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, username: null });
    setMessages([]);
    setChatTabs([]);
    setActiveChatId(null);
    setConfig({ googleSheetUrl: null });
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(CHAT_KEY);
    localStorage.removeItem(CONFIG_KEY);
    localStorage.removeItem(CHAT_TABS_KEY);
  };

  const addMessage = (content: string, role: MessageRole = 'user') => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);

    if (activeChatId) {
      setChatTabs((prev) => prev.map((tab) =>
        tab.id === activeChatId
          ? { ...tab, messages: [...tab.messages, newMessage], updatedAt: Date.now() }
          : tab
      ));
    }
    return newMessage;
  };

  const createNewChat = (title?: string) => {
    const newChat: ChatTab = {
      id: Math.random().toString(36).substring(7),
      title: title || `Chat ${chatTabs.length + 1}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      datasetUrl: null,
      datasetStatus: 'unconnected',
    };
    setChatTabs((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setMessages([]);
    return newChat;
  };

  const switchChat = (chatId: string) => {
    const chat = chatTabs.find((t) => t.id === chatId);
    if (chat) {
      setActiveChatId(chatId);
      setMessages(chat.messages);
    }
  };

  const deleteChat = (chatId: string) => {
    setChatTabs((prev) => prev.filter((t) => t.id !== chatId));
    if (activeChatId === chatId) {
      const remaining = chatTabs.filter((t) => t.id !== chatId);
      if (remaining.length > 0) {
        switchChat(remaining[0].id);
      } else {
        setActiveChatId(null);
        setMessages([]);
      }
    }
  };

  const setDatasetForChat = (
    url: string | null,
    status: ChatTab['datasetStatus'] = 'unconnected',
    stats?: ChatTab['datasetStats']
  ) => {
    if (!activeChatId) return;

    setChatTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeChatId
          ? {
            ...tab,
            datasetUrl: url,
            datasetStatus: status,
            datasetStats: stats,
            updatedAt: Date.now(),
          }
          : tab
      )
    );
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
    );

    if (activeChatId) {
      setChatTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeChatId
            ? {
              ...tab,
              messages: tab.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              ),
              updatedAt: Date.now(),
            }
            : tab
        )
      );
    }
  };

  const getCurrentChat = () => {
    return chatTabs.find((tab) => tab.id === activeChatId);
  };

  const setGoogleSheetUrl = (url: string | null) => {
    setConfig((prev) => ({ ...prev, googleSheetUrl: url }));
  };

  return {
    auth,
    messages,
    config,
    chatTabs,
    activeChatId,
    isInitializing,
    login,
    logout,
    addMessage,
    setMessages,
    setGoogleSheetUrl,
    createNewChat,
    switchChat,
    deleteChat,
    setDatasetForChat,
    getCurrentChat,
    updateMessage,
  };
}
