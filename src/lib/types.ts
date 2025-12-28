export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  audioUrl?: string;
  isSpeaking?: boolean;
}

export interface ChatTab {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatSession {
  messages: Message[];
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

export interface AppConfig {
  googleSheetUrl: string | null;
}
