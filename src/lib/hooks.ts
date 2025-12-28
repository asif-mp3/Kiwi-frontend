'use client';

import { useState, useEffect } from 'react';
import { Message, AuthState, AppConfig, MessageRole } from './types';

const AUTH_KEY = 'kiwi_assistant_auth';
const CHAT_KEY = 'kiwi_assistant_chat';
const CONFIG_KEY = 'kiwi_assistant_config';

export function useAppState() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    googleSheetUrl: null,
  });
  const [isInitializing, setIsInitializing] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    const savedChat = localStorage.getItem(CHAT_KEY);
    const savedConfig = localStorage.getItem(CONFIG_KEY);

    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }

    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }

    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    
    setIsInitializing(false);
  }, []);

  // Persist state changes
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

  const login = (username: string) => {
    setAuth({ isAuthenticated: true, username });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, username: null });
    setMessages([]);
    setConfig({ googleSheetUrl: null });
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(CHAT_KEY);
    localStorage.removeItem(CONFIG_KEY);
  };

  const addMessage = (content: string, role: MessageRole = 'user') => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const setGoogleSheetUrl = (url: string | null) => {
    setConfig((prev) => ({ ...prev, googleSheetUrl: url }));
  };

  return {
    auth,
    messages,
    config,
    isInitializing,
    login,
    logout,
    addMessage,
    setMessages,
    setGoogleSheetUrl
  };
}
