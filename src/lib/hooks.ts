'use client';

import { useState, useEffect } from 'react';
import { Message, AuthState } from './types';

const AUTH_KEY = 'ceo_assistant_auth';
const CHAT_KEY = 'ceo_assistant_chat';

export function useAppState() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    const savedChat = localStorage.getItem(CHAT_KEY);

    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }

    if (savedChat) {
      setMessages(JSON.parse(savedChat));
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

  const login = (username: string) => {
    setAuth({ isAuthenticated: true, username });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, username: null });
    setMessages([]);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(CHAT_KEY);
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

  return {
    auth,
    messages,
    isInitializing,
    login,
    logout,
    addMessage,
    setMessages
  };
}

type MessageRole = 'user' | 'assistant' | 'system';
