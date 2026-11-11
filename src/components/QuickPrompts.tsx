import React from 'react';
import { Sparkles, Globe } from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '../data/prompts.ts';
import { soundFx } from '../utils/audio.ts';

interface QuickPromptsProps {
  onSelectPrompt: (text: string) => void;
  selectedLang: string;
  onSelectLang: (lang: string) => void;
  onOpenLanguageSelector?: () => void;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({
  onSelectPrompt,
  selectedLang,
  onSelectLang,
  onOpenLanguageSelector,
}) => {
  const filteredPrompts = PROMPT_SUGGESTIONS.filter((item) => {
    if (selectedLang === 'auto' || selectedLang === 'all') return true;
    return item.lang === selectedLang;
  });

  const displayPrompts = filteredPrompts.length > 0 ? filteredPrompts : PROMPT_SUGGESTIONS.slice(0, 4);

  return (
    <div className="w-full max-w-2xl px-4 py-2 flex flex-col items-center">
      {/* Language filter pills */}
      <div className="flex items-center flex-wrap justify-center gap-1.5 p-1 rounded-2xl bg-[#0B1324] border border-cyan-500/20 mb-5 text-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectLang('auto');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            selectedLang === 'auto' || selectedLang === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🌐 Auto-Detect
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectLang('hi');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            selectedLang === 'hi'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🇮🇳 हिन्दी
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectLang('gu');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            selectedLang === 'gu'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🇮🇳 ગુજરાતી
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectLang('sa');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            selectedLang === 'sa'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🕉️ संस्कृतम्
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectLang('en');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            selectedLang === 'en'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectLang('ar');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            selectedLang === 'ar'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🇸🇦 العربية
        </button>

        {onOpenLanguageSelector && (
          <button
            onClick={() => {
              soundFx.playPanel();
              onOpenLanguageSelector();
            }}
            className="px-2.5 py-1.5 rounded-xl font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-1 ml-1 transition-all"
            title="Browse all 7,000+ languages"
          >
            <Globe className="w-3.5 h-3.5" />
            More...
          </button>
        )}
      </div>

      {/* Suggestion prompt cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {displayPrompts.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group flex flex-col items-start p-3.5 rounded-2xl bg-[#0D1629]/80 hover:bg-[#121F3A] border border-cyan-500/20 hover:border-cyan-400/50 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-950/40 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {item.label}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 uppercase tracking-wider font-mono border border-cyan-500/30">
                {item.lang}
              </span>
            </div>
            <p className="text-xs text-slate-300/85 line-clamp-2 leading-relaxed group-hover:text-white transition-colors">
              "{item.prompt}"
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
