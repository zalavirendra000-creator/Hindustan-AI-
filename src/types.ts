export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string; // ISO string for reliable JSON serialization
  isStreaming?: boolean;
  error?: boolean;
}

export interface HistoryTurn {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export type LanguageFilter = 'all' | 'hi' | 'gu' | 'en';

export interface PromptSuggestion {
  id: string;
  lang: 'hi' | 'gu' | 'en';
  label: string;
  prompt: string;
  category: string;
}

export interface UserSettings {
  preferredLanguage: string;
  voiceAutoPlay: boolean;
  soundEffects: boolean;
  responseStyle: 'balanced' | 'creative' | 'precise';
  glowTheme: 'cyan' | 'blue' | 'azure';
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  accountType: 'Guest User';
  bio: string;
  createdAt: string;
  updatedAt: string;
  settings: UserSettings;
}

export interface ConversationThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  historyTurns: HistoryTurn[];
  pinned?: boolean;
}
