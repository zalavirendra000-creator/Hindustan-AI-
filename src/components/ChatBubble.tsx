import React, { useState } from 'react';
import { Sparkles, User, Copy, Check, Volume2, VolumeX, RotateCcw, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';

interface ChatBubbleProps {
  message: ChatMessage;
  isLastAiMessage?: boolean;
  onRegenerate?: () => void;
  speakingMessageId: string | null;
  onToggleSpeak: (id: string, text: string) => void;
  userAvatarUrl?: string;
  userName?: string;
}

export const ChatBubble = React.memo<ChatBubbleProps>(
  ({
    message,
    isLastAiMessage,
    onRegenerate,
    speakingMessageId,
    onToggleSpeak,
    userAvatarUrl,
    userName = 'User',
  }) => {
  const [copied, setCopied] = useState(false);
  const isSpeaking = speakingMessageId === message.id;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dateObj =
    typeof message.timestamp === 'string'
      ? new Date(message.timestamp)
      : message.timestamp || new Date();

  const formattedTime = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(dateObj);

  if (message.isUser) {
    return (
      <div className="flex justify-end items-start gap-2.5 mb-3.5 group">
        <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[620px] flex flex-col items-end">
          <div className="relative bg-gradient-to-r from-[#1265C8] to-[#0D52A6] text-white px-4 py-3 rounded-[18px] rounded-tr-xs shadow-md shadow-blue-950/40 text-[15px] select-text border border-blue-400/20">
            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          </div>

          <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
            <span>{formattedTime}</span>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Copy prompt"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-cyan-500 to-blue-500 shrink-0 mt-1 shadow-sm">
          <div className="w-full h-full rounded-full bg-[#080D18] overflow-hidden flex items-center justify-center">
            {userAvatarUrl ? (
              <img src={userAvatarUrl} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[11px] font-bold text-cyan-300 font-mono">
                {userName.slice(0, 2).toUpperCase() || 'U'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // AI response bubble
  return (
    <div className="flex items-start gap-2.5 mb-4 group">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 mt-1">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div className="max-w-[88%] sm:max-w-[80%] md:max-w-[680px] flex flex-col">
        <div
          className={`relative bg-[#17243A] text-slate-100 px-4 py-3.5 rounded-[18px] rounded-tl-xs border border-[#1e3252]/80 shadow-lg shadow-black/30 select-text ${
            message.error ? 'border-red-500/50 bg-red-950/30' : ''
          }`}
        >
          {message.error ? (
            <div className="flex items-start gap-2.5 text-rose-300 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-semibold text-rose-200">Error</p>
                <p className="mt-0.5 text-xs text-rose-300/90">{message.text}</p>
              </div>
            </div>
          ) : (
            <>
              <MarkdownRenderer content={message.text} />
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-sky-400 animate-pulse align-middle rounded-xs" />
              )}
            </>
          )}
        </div>

        {/* Message Footer Actions */}
        <div className="flex items-center gap-2 mt-1.5 px-1 text-[11px] text-slate-400">
          <span className="font-medium text-sky-400/80">HINDUSTAN AI</span>
          <span>•</span>
          <span>{formattedTime}</span>

          {!message.isStreaming && !message.error && (
            <div className="flex items-center gap-1 ml-1 opacity-70 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-[#1a2b45] text-slate-400 hover:text-white transition-colors"
                title="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => onToggleSpeak(message.id, message.text)}
                className={`p-1 rounded hover:bg-[#1a2b45] transition-colors ${
                  isSpeaking ? 'text-sky-400 bg-sky-950/50' : 'text-slate-400 hover:text-white'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5 animate-pulse text-sky-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>

              {isLastAiMessage && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 rounded hover:bg-[#1a2b45] text-slate-400 hover:text-white transition-colors"
                  title="Regenerate response"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
},
(prev, next) => {
  return (
    prev.message.id === next.message.id &&
    prev.message.text === next.message.text &&
    prev.message.isStreaming === next.message.isStreaming &&
    prev.message.error === next.message.error &&
    prev.isLastAiMessage === next.isLastAiMessage &&
    (prev.speakingMessageId === prev.message.id) === (next.speakingMessageId === next.message.id) &&
    prev.userAvatarUrl === next.userAvatarUrl &&
    prev.userName === next.userName
  );
});
