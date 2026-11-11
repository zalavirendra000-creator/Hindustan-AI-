import React, { useState } from 'react';
import {
  X,
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  CornerDownRight,
  RefreshCw,
} from 'lucide-react';
import { WORLD_LANGUAGES, LanguageInfo, getLanguageByCode } from '../data/languages.ts';
import { soundFx } from '../utils/audio.ts';

interface TranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat?: (text: string) => void;
}

export const TranslatorModal: React.FC<TranslatorModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [sourceCode, setSourceCode] = useState<string>('auto');
  const [targetCode, setTargetCode] = useState<string>('hi');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    soundFx.playSend();
    setLoading(true);
    setErrorMsg('');

    try {
      const targetLangObj = getLanguageByCode(targetCode);
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          sourceLang: sourceCode === 'auto' ? 'auto' : getLanguageByCode(sourceCode).name,
          targetLang: targetLangObj.name,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to translate.');
      }

      const data = await res.json();
      setTranslatedText(data.translatedText || '');
      soundFx.playReceive();
    } catch (err: any) {
      console.error('Translation error:', err);
      setErrorMsg(err.message || 'Error occurred while translating.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    if (sourceCode === 'auto') {
      setSourceCode('en');
      setTargetCode('hi');
      return;
    }
    soundFx.playClick();
    const temp = sourceCode;
    setSourceCode(targetCode);
    setTargetCode(temp);

    // Swap text if both exist
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!translatedText || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const targetLangObj = getLanguageByCode(targetCode);
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLangObj.bcp47 || 'hi-IN';

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (match) utterance.voice = match;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const targetLangObj = getLanguageByCode(targetCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#090F1E] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/70 overflow-hidden flex flex-col text-slate-100 cyber-grid relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-[#0C1527] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
              <Languages className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wider text-white flex items-center gap-2">
                HINDUSTAN AI TRANSLATOR
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  GEMINI 3.8 FLASH
                </span>
              </h2>
              <p className="text-[11px] font-mono text-cyan-300/70">
                Preserving cultural nuances, idioms & natural grammar
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              soundFx.playPanel();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selectors Bar */}
        <div className="p-4 bg-[#070D18] border-b border-slate-800 flex items-center justify-between gap-3">
          {/* Source Lang dropdown */}
          <div className="flex-1">
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Source Language
            </label>
            <select
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0F182E] border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
            >
              <option value="auto">🌐 Auto-Detect Language</option>
              {WORLD_LANGUAGES.filter((l) => l.code !== 'auto').map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <button
            onClick={handleSwap}
            className="p-2.5 mt-4 rounded-xl bg-[#0F182E] hover:bg-[#162544] border border-cyan-500/40 text-cyan-400 transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Swap languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* Target Lang dropdown */}
          <div className="flex-1">
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Target Language
            </label>
            <select
              value={targetCode}
              onChange={(e) => setTargetCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0F182E] border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
            >
              {WORLD_LANGUAGES.filter((l) => l.code !== 'auto').map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Translation Body: Split Textareas */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Input Text Box */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>ENTER TEXT</span>
              <span>{inputText.length} chars</span>
            </div>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste text to translate into any language..."
              className="w-full p-3.5 rounded-2xl bg-[#0A1224] border border-cyan-500/30 focus:border-cyan-400 text-sm text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Output Result Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                TRANSLATION ({targetLangObj.name.toUpperCase()})
              </span>
              {translatedText && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Copy translation"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleSpeak}
                    className={`p-1 rounded ${isSpeaking ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                    title={isSpeaking ? 'Stop voice' : 'Listen'}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 animate-pulse text-cyan-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            <div
              dir={targetLangObj.direction}
              className="w-full min-h-[90px] p-3.5 rounded-2xl bg-[#0D182E] border border-cyan-500/40 text-sm text-slate-100 select-text leading-relaxed font-sans"
            >
              {loading ? (
                <div className="flex items-center gap-2 text-cyan-400 text-xs py-4 font-mono animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Translating with Gemini 3.8 Flash...
                </div>
              ) : translatedText ? (
                <p className="whitespace-pre-wrap">{translatedText}</p>
              ) : (
                <span className="text-slate-500 italic text-xs">
                  Translation will appear here with native grammar and formatting...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#080D18] border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
          {translatedText && onSendToChat && (
            <button
              onClick={() => {
                onSendToChat(translatedText);
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white font-medium"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              Ask HINDUSTAN AI about this
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || loading}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-lg ${
                inputText.trim() && !loading
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/30 active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Translating...' : 'Translate Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
