/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Trash2,
  Info,
  Send,
  Mic,
  MicOff,
  Smartphone,
  Monitor,
  Download,
  Plus,
  Archive,
  User,
  Sliders,
  Shield,
  Search,
  Globe,
  Languages,
  ExternalLink,
} from 'lucide-react';
import {
  ChatMessage,
  HistoryTurn,
  UserProfile,
  ConversationThread,
} from './types.ts';
import { ChatBubble } from './components/ChatBubble.tsx';
import { QuickPrompts } from './components/QuickPrompts.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { HistorySidebar } from './components/HistorySidebar.tsx';
import { LanguageSelectorModal } from './components/LanguageSelectorModal.tsx';
import { TranslatorModal } from './components/TranslatorModal.tsx';
import { LiveFpsBadge } from './components/LiveFpsBadge.tsx';
import { FpsEngineModal, FpsMode } from './components/FpsEngineModal.tsx';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredConversations,
  saveConversation,
  deleteStoredConversation,
  renameStoredConversation,
  clearAllStoredConversations,
} from './utils/storage.ts';
import { soundFx } from './utils/audio.ts';
import {
  getLanguageByCode,
  LanguageInfo,
  AUTO_DETECT_LANGUAGE,
} from './data/languages.ts';
import { getTranslations } from './data/translations.ts';

const APP_NAME = 'HINDUSTAN AI';
const DEVELOPER_NAME = 'Zala Virendra Sinh';
const MODEL_NAME = 'gemini-3.8-flash';

export default function App() {
  // Profile state from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => getStoredProfile());
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Global Language & Translation System state
  const [selectedLang, setSelectedLang] = useState<string>(
    () => profile.settings.preferredLanguage || 'auto'
  );
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showTranslatorModal, setShowTranslatorModal] = useState(false);

  // 90 FPS Ultra Performance Engine state
  const [fpsMode, setFpsMode] = useState<FpsMode>('90fps');
  const [showFpsModal, setShowFpsModal] = useState(false);

  // Search History & Conversation Thread state
  const [conversations, setConversations] = useState<ConversationThread[]>(() =>
    getStoredConversations()
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);

  // Active Chat Messages and streaming
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Language metadata & interface translations
  const currentLangObj = useMemo(() => getLanguageByCode(selectedLang), [selectedLang]);
  const t = useMemo(() => getTranslations(selectedLang), [selectedLang]);
  const isRtl = currentLangObj.direction === 'rtl';

  // In-memory model history for Gemini multi-turn context
  const historyRef = useRef<HistoryTurn[]>([]);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize soundFx preference
  useEffect(() => {
    soundFx.setEnabled(profile.settings.soundEffects);
  }, [profile.settings.soundEffects]);

  // Keep sound effects & default language synced with profile
  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
    if (updated.settings.preferredLanguage && updated.settings.preferredLanguage !== selectedLang) {
      setSelectedLang(updated.settings.preferredLanguage);
    }
  };

  const handleSelectLanguage = (lang: LanguageInfo) => {
    setSelectedLang(lang.code);
    const updatedProfile: UserProfile = {
      ...profile,
      settings: {
        ...profile.settings,
        preferredLanguage: lang.code,
      },
      updatedAt: new Date().toISOString(),
    };
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
  };

  // High-performance instant scroll without layout thrashing
  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    } else {
      scrollEndRef.current?.scrollIntoView({ behavior });
    }
  };

  // Only scroll when message count changes or loading starts
  useEffect(() => {
    scrollToBottom('auto');
  }, [messages.length, loading]);

  // Load latest conversation on initial render if available
  useEffect(() => {
    const saved = getStoredConversations();
    setConversations(saved);
    if (saved.length > 0 && !activeConversationId && messages.length === 0) {
      const latest = saved[0];
      setActiveConversationId(latest.id);
      setMessages(latest.messages);
      historyRef.current = latest.historyTurns || [];
    }
  }, []);

  // Multilingual Speech Recognition setup (Voice-to-Text)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      // Use the active language's BCP 47 code (e.g. 'hi-IN', 'gu-IN', 'ar-SA', 'fr-FR', 'es-ES', etc.)
      recognition.lang = currentLangObj.bcp47 || 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, [currentLangObj]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(t.voiceUnsupported);
      return;
    }

    soundFx.playClick();

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  // Multilingual Text to Speech playback
  const handleToggleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Set voice language based on current language or text script
    const isDevanagari = /[\u0900-\u097F]/.test(text);
    const isGujarati = /[\u0A80-\u0AFF]/.test(text);
    const isArabic = /[\u0600-\u06FF]/.test(text);

    if (isDevanagari) {
      utterance.lang = 'hi-IN';
    } else if (isGujarati) {
      utterance.lang = 'gu-IN';
    } else if (isArabic) {
      utterance.lang = 'ar-SA';
    } else {
      utterance.lang = currentLangObj.bcp47 || 'en-US';
    }

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to persist conversation to storage
  const persistConversation = (newMessages: ChatMessage[], newHistory: HistoryTurn[]) => {
    if (newMessages.length === 0) return;

    const convId = activeConversationId || `chat-${Date.now()}`;
    if (!activeConversationId) {
      setActiveConversationId(convId);
    }

    const firstUserMsg = newMessages.find((m) => m.isUser)?.text || 'New Conversation';
    const cleanTitle = firstUserMsg.length > 40 ? firstUserMsg.slice(0, 38) + '...' : firstUserMsg;

    const existing = conversations.find((c) => c.id === convId);
    const threadToSave: ConversationThread = {
      id: convId,
      title: existing?.title || cleanTitle,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: newMessages,
      historyTurns: newHistory,
      pinned: existing?.pinned,
    };

    const updated = saveConversation(threadToSave);
    setConversations(updated);
  };

  // Send message using SSE streaming with targetLanguage directive
  const handleSendMessage = async (textToSend?: string) => {
    const question = (textToSend ?? input).trim();
    if (!question || loading || isStreaming) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    soundFx.playSend();

    window.speechSynthesis?.cancel();
    setSpeakingMessageId(null);

    const userMessageId = `user-${Date.now()}`;
    const aiMessageId = `ai-${Date.now()}`;
    const timestampStr = new Date().toISOString();

    const userMsg: ChatMessage = {
      id: userMessageId,
      text: question,
      isUser: true,
      timestamp: timestampStr,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    historyRef.current.push({
      role: 'user',
      parts: [{ text: question }],
    });

    persistConversation(updatedMessages, historyRef.current);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          history: historyRef.current.slice(0, -1),
          targetLanguage: selectedLang,
        }),
      });

      if (!response.ok) {
        let errMessage = 'Failed to connect to HINDUSTAN AI.';
        try {
          const errData = await response.json();
          errMessage = errData.error || errMessage;
        } catch {
          errMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errMessage);
      }

      setLoading(false);
      setIsStreaming(true);

      const aiMsg: ChatMessage = {
        id: aiMessageId,
        text: '',
        isUser: false,
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, aiMsg]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponseText = '';

      if (reader) {
        let buffer = '';
        let rafId: number | null = null;

        const scheduleUiUpdate = () => {
          if (rafId !== null) return;
          rafId = requestAnimationFrame(() => {
            rafId = null;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId ? { ...msg, text: fullResponseText } : msg
              )
            );
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
          });
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data: ')) {
              const dataPayload = trimmedLine.replace(/^data: /, '').trim();

              if (dataPayload === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(dataPayload);
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                if (parsed.text) {
                  fullResponseText += parsed.text;
                  scheduleUiUpdate();
                }
              } catch (e: any) {
                if (e.message && !e.message.includes('JSON.parse')) {
                  throw e;
                }
              }
            }
          }
        }

        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      }

      if (!fullResponseText.trim()) {
        fullResponseText = 'No response received from model.';
      }

      const finalMessages = updatedMessages.concat({
        id: aiMessageId,
        text: fullResponseText,
        isUser: false,
        timestamp: new Date().toISOString(),
        isStreaming: false,
      });

      setMessages(finalMessages);

      historyRef.current.push({
        role: 'model',
        parts: [{ text: fullResponseText }],
      });

      persistConversation(finalMessages, historyRef.current);
      soundFx.playReceive();

      if (profile.settings.voiceAutoPlay) {
        handleToggleSpeak(aiMessageId, fullResponseText);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg = err?.message || 'Connection error. Please try again.';

      if (historyRef.current.length > 0) {
        historyRef.current.pop();
      }

      const errorMessages = updatedMessages.concat({
        id: aiMessageId,
        text: errMsg,
        isUser: false,
        timestamp: new Date().toISOString(),
        error: true,
        isStreaming: false,
      });

      setMessages(errorMessages);
      persistConversation(errorMessages, historyRef.current);
    } finally {
      setLoading(false);
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const handleStartNewChat = () => {
    soundFx.playSend();
    window.speechSynthesis?.cancel();
    setSpeakingMessageId(null);
    setMessages([]);
    historyRef.current = [];
    setActiveConversationId(null);
    setShowClearConfirm(false);
    inputRef.current?.focus();
  };

  const handleSelectConversation = (id: string) => {
    const thread = conversations.find((c) => c.id === id);
    if (!thread) return;

    soundFx.playClick();
    window.speechSynthesis?.cancel();
    setSpeakingMessageId(null);
    setActiveConversationId(thread.id);
    setMessages(thread.messages);
    historyRef.current = thread.historyTurns || [];
  };

  const handleDeleteConversation = (id: string) => {
    const updated = deleteStoredConversation(id);
    setConversations(updated);

    if (activeConversationId === id) {
      if (updated.length > 0) {
        const next = updated[0];
        setActiveConversationId(next.id);
        setMessages(next.messages);
        historyRef.current = next.historyTurns || [];
      } else {
        handleStartNewChat();
      }
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    const updated = renameStoredConversation(id, newTitle);
    setConversations(updated);
  };

  const handleClearAllHistory = () => {
    soundFx.playClick();
    clearAllStoredConversations();
    setConversations([]);
    handleStartNewChat();
  };

  const handleRegenerate = () => {
    if (messages.length < 2 || loading || isStreaming) return;

    let lastUserMessage = '';
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].isUser) {
        lastUserMessage = messages[i].text;
        break;
      }
    }

    if (!lastUserMessage) return;

    setMessages((prev) => prev.slice(0, -1));
    if (historyRef.current.length > 0) {
      historyRef.current.pop();
    }

    handleSendMessage(lastUserMessage);
  };

  const exportChat = () => {
    if (messages.length === 0) return;
    soundFx.playClick();
    const transcript = messages
      .map(
        (m) =>
          `[${m.isUser ? profile.name : APP_NAME}] (${new Date(
            m.timestamp
          ).toLocaleTimeString()}):\n${m.text}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hindustan-ai-${activeConversationId || 'chat'}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="min-h-screen bg-[#050811] text-slate-100 flex flex-col justify-between font-sans cyber-grid selection:bg-cyan-500 selection:text-black"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Outer wrapper: Fullscreen or centered Mobile Phone Frame */}
      <div
        className={`mx-auto w-full flex-1 flex flex-col transition-all duration-300 relative ${
          isMobileFrame
            ? 'max-w-[440px] my-4 rounded-[38px] border-[6px] border-[#18263D] shadow-2xl shadow-cyan-950/60 overflow-hidden bg-[#070D18]'
            : 'max-w-5xl'
        }`}
      >
        {/* Mobile Device Status Bar */}
        {isMobileFrame && (
          <div className="bg-[#09101F] px-6 pt-2.5 pb-1 flex justify-between items-center text-[11px] text-cyan-300/70 select-none border-b border-cyan-500/20 font-mono">
            <span className="font-semibold text-white">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px]">GLOBAL AI OS</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Futuristic Top Bar / Header */}
        <header className="bg-[#0A1122]/95 border-b border-cyan-500/30 px-3.5 sm:px-5 py-3 sticky top-0 z-30 shadow-xl shadow-cyan-950/30 backdrop-blur-md flex items-center justify-between">
          {/* Left section: History Sidebar Toggle & Brand Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sidebar toggle button */}
            <button
              onClick={() => {
                soundFx.playPanel();
                setShowHistorySidebar((prev) => !prev);
              }}
              className="p-2 rounded-xl bg-[#0F192E] hover:bg-[#162442] border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-950"
              title={t.history}
              aria-label="Toggle history sidebar"
            >
              <Archive className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold hidden md:inline">{t.history.toUpperCase()}</span>
              {conversations.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono">
                  {conversations.length}
                </span>
              )}
            </button>

            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
                <Sparkles className="w-5 h-5 animate-pulse text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold tracking-wider text-white">
                    {t.appName}
                  </h1>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] bg-cyan-950/80 text-cyan-300 font-mono border border-cyan-400/40">
                    {MODEL_NAME}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-none mt-0.5">
                  {t.creatorTag}
                </p>
              </div>
            </div>
          </div>

          {/* Right section: Live 90 FPS Badge, Global Language Selector, Translator, New Chat, Device, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* LIVE 90 FPS TELEMETRY BADGE */}
            <LiveFpsBadge fpsMode={fpsMode} onClick={() => setShowFpsModal(true)} />

            {/* GLOBAL LANGUAGE SELECTOR BUTTON */}
            <button
              onClick={() => {
                soundFx.playPanel();
                setShowLanguageModal(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0E172B] hover:bg-[#142342] border border-cyan-500/40 text-cyan-300 hover:text-white transition-all shadow-sm cursor-pointer"
              title="Select Target Language (7,000+ Languages Supported)"
            >
              <span className="text-sm select-none">{currentLangObj.flag}</span>
              <span className="text-xs font-semibold max-w-[80px] sm:max-w-[110px] truncate hidden xs:inline">
                {currentLangObj.nativeName || currentLangObj.name}
              </span>
              <Globe className="w-3.5 h-3.5 text-cyan-400 ml-0.5" />
            </button>

            {/* AI TRANSLATOR TOOL BUTTON */}
            <button
              onClick={() => {
                soundFx.playPanel();
                setShowTranslatorModal(true);
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-[#111C33] border border-cyan-500/30 transition-all cursor-pointer"
              title={t.translator}
            >
              <Languages className="w-4 h-4 text-cyan-400" />
            </button>

            {/* New Chat action */}
            <button
              onClick={handleStartNewChat}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-[#111C33] border border-transparent hover:border-cyan-500/30 transition-all cursor-pointer"
              title={t.newChat}
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Device preview toggle */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsMobileFrame((prev) => !prev);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-[#111C33] border border-transparent hover:border-cyan-500/30 transition-all"
              title={isMobileFrame ? 'Expand to Desktop View' : 'Preview as Mobile Device'}
            >
              {isMobileFrame ? (
                <Monitor className="w-4 h-4 text-cyan-400" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
            </button>

            {/* Export conversation */}
            {messages.length > 0 && (
              <button
                onClick={exportChat}
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-[#111C33] border border-transparent hover:border-cyan-500/30 transition-all"
                title={t.exportChat}
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* About Modal */}
            <button
              onClick={() => {
                soundFx.playPanel();
                setShowAbout(true);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-[#111C33] border border-transparent hover:border-cyan-500/30 transition-all"
              title={t.about}
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Profile Button */}
            <button
              onClick={() => {
                soundFx.playPanel();
                setShowProfileModal(true);
              }}
              className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-full bg-[#0E172B] hover:bg-[#14213D] border border-cyan-400/50 hover:border-cyan-400 transition-all shadow-md shadow-cyan-950 cursor-pointer active:scale-95 group"
              title={t.profile}
              aria-label="User profile settings"
            >
              <div className="w-7 h-7 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-sky-400 shadow-sm shadow-cyan-500/30 shrink-0">
                <div className="w-full h-full rounded-full bg-[#070B14] overflow-hidden flex items-center justify-center">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-cyan-300 font-mono">
                      {profile.name.slice(0, 2).toUpperCase() || 'GU'}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-white leading-tight group-hover:text-cyan-300 transition-colors">
                  {profile.name}
                </p>
                <p className="text-[10px] font-mono text-cyan-400/80 leading-none">
                  {t.guestUser}
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Chat Body */}
        <main
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-5 flex flex-col justify-start smooth-scroll gpu-layer"
        >
          {messages.length === 0 ? (
            /* Futuristic Multilingual Empty State */
            <div className="my-auto flex flex-col items-center justify-center text-center py-6 px-4">
              <div className="relative mb-5 group">
                <div className="absolute inset-0 bg-cyan-500/25 blur-2xl rounded-full animate-pulse" />
                <div className="relative w-24 h-24 rounded-3xl bg-[#0A1224] border-2 border-cyan-400/60 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                  <div className="absolute -inset-1 rounded-3xl border border-cyan-400/20 animate-spin [animation-duration:12s]" />
                  <Sparkles className="w-12 h-12 text-cyan-400" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white mb-1.5 font-sans">
                {t.helloTitle}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-md mb-2">
                {t.howCanHelp}
              </p>

              <p className="text-xs text-slate-500 mb-5 font-mono">
                {t.creatorTag}
              </p>

              {/* Status Telemetry */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-[11px] font-mono text-cyan-300">
                <span className="px-3 py-1 rounded-full bg-[#0B1426] border border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {t.coreOnline}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#0B1426] border border-cyan-500/40 shadow-sm flex items-center gap-1">
                  <span>{currentLangObj.flag}</span>
                  <span>{currentLangObj.name.toUpperCase()}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#0B1426] border border-cyan-500/40 shadow-sm">
                  7,000+ LANGUAGES ACTIVE
                </span>
              </div>

              {/* Quick Prompts */}
              <QuickPrompts
                selectedLang={selectedLang}
                onSelectLang={(langCode) => setSelectedLang(langCode)}
                onOpenLanguageSelector={() => setShowLanguageModal(true)}
                onSelectPrompt={(promptText) => {
                  setInput(promptText);
                  handleSendMessage(promptText);
                }}
              />
            </div>
          ) : (
            /* Message Thread */
            <div className="w-full flex flex-col space-y-1 gpu-layer">
              {messages.map((message, index) => {
                const isLastAi = !message.isUser && index === messages.length - 1;

                return (
                  <div key={message.id} className="chat-bubble-item">
                    <ChatBubble
                      message={message}
                      isLastAiMessage={isLastAi}
                      onRegenerate={handleRegenerate}
                      speakingMessageId={speakingMessageId}
                      onToggleSpeak={handleToggleSpeak}
                      userAvatarUrl={profile.avatarUrl}
                      userName={profile.name}
                    />
                  </div>
                );
              })}

              {/* Thinking Indicator */}
              {loading && (
                <div className="flex items-center gap-3 p-3 my-2 text-cyan-200 text-sm rounded-2xl bg-[#0D182E]/80 border border-cyan-500/40 max-w-xs shadow-lg shadow-cyan-950/40 animate-in fade-in duration-200">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="text-xs sm:text-sm font-mono font-medium text-cyan-300">
                    {t.thinking}
                  </span>
                </div>
              )}

              <div ref={scrollEndRef} />
            </div>
          )}
        </main>

        {/* Input Bar */}
        <footer className="p-3 sm:px-4 sm:py-3.5 bg-[#091122]/95 border-t border-cyan-500/30 sticky bottom-0 z-30 backdrop-blur-md">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex-1 flex items-center bg-[#0E172B] rounded-2xl sm:rounded-full px-4 py-1.5 border border-cyan-500/40 focus-within:border-cyan-400 focus-within:shadow-lg focus-within:shadow-cyan-950/50 transition-all shadow-inner">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.askPlaceholder}
                rows={1}
                dir={isRtl ? 'rtl' : 'auto'}
                className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-400 text-sm focus:outline-none resize-none max-h-32 py-1.5 leading-relaxed font-sans"
                style={{
                  minHeight: '24px',
                }}
              />

              {/* Voice Dictation (Microphone) with language display */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-full transition-colors ml-1 cursor-pointer flex items-center gap-1 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/40'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                }`}
                title={isListening ? t.voiceListening : `${t.voiceInput} (${currentLangObj.bcp47 || 'auto'})`}
                aria-label="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading || isStreaming}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                input.trim() && !loading && !isStreaming
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/30 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
              title={t.send}
              aria-label={t.send}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 max-w-4xl mx-auto mt-2 px-1">
            <span>
              Target: <strong className="text-cyan-300">{currentLangObj.flag} {currentLangObj.name}</strong> • Auto-saved to History
            </span>
            <button
              onClick={() => setShowTranslatorModal(true)}
              className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[10px] cursor-pointer"
            >
              Open AI Translator
            </button>
          </div>
        </footer>
      </div>

      {/* SEARCH HISTORY SIDEBAR */}
      <HistorySidebar
        isOpen={showHistorySidebar}
        onClose={() => setShowHistorySidebar(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleStartNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onClearAllHistory={handleClearAllHistory}
      />

      {/* USER PROFILE MODAL */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenLanguageSelector={() => {
          setShowProfileModal(false);
          setShowLanguageModal(true);
        }}
      />

      {/* GLOBAL MULTILINGUAL LANGUAGE SELECTOR MODAL */}
      <LanguageSelectorModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        selectedLanguageCode={selectedLang}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* AI TRANSLATOR TOOL MODAL */}
      <TranslatorModal
        isOpen={showTranslatorModal}
        onClose={() => setShowTranslatorModal(false)}
        onSendToChat={(translatedText) => {
          setInput(translatedText);
          inputRef.current?.focus();
        }}
      />

      {/* 90 FPS PERFORMANCE ENGINE MODAL */}
      <FpsEngineModal
        isOpen={showFpsModal}
        onClose={() => setShowFpsModal(false)}
        fpsMode={fpsMode}
        onSelectFpsMode={setFpsMode}
      />

      {/* ABOUT MODAL */}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}
