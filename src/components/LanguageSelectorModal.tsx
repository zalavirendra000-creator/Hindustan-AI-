import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Globe,
  Check,
  Sparkles,
  MapPin,
  ArrowRight,
  Compass,
  Layers,
} from 'lucide-react';
import {
  LanguageInfo,
  WORLD_LANGUAGES,
  REGIONS,
  searchLanguages,
  AUTO_DETECT_LANGUAGE,
} from '../data/languages.ts';
import { soundFx } from '../utils/audio.ts';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguageCode: string;
  onSelectLanguage: (lang: LanguageInfo) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedLanguageCode,
  onSelectLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<string>('All Regions');
  const [displayLimit, setDisplayLimit] = useState(42);

  const filteredLanguages = useMemo(() => {
    return searchLanguages(searchQuery, activeRegion);
  }, [searchQuery, activeRegion]);

  const displayedLanguages = useMemo(() => {
    return filteredLanguages.slice(0, displayLimit);
  }, [filteredLanguages, displayLimit]);

  if (!isOpen) return null;

  const handleSelect = (lang: LanguageInfo) => {
    soundFx.playSend();
    onSelectLanguage(lang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-[#090F1D] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/70 overflow-hidden flex flex-col max-h-[85vh] text-slate-100 cyber-grid relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Futuristic Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-[#0C1527]/95 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
              <Globe className="w-5 h-5 text-cyan-400 animate-spin [animation-duration:20s]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-wider text-white">GLOBAL MULTILINGUAL ENGINE</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 uppercase">
                  7,000+ LIVING LANGUAGES
                </span>
              </div>
              <p className="text-[11px] font-mono text-cyan-300/70">
                Organized by Country, Region & Native Writing Systems
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playPanel();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-[#070D18] border-b border-slate-800/80">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across thousands of languages (e.g. Hindi, ગુજરાતી, Sanskrit, Arabic, Japanese, Spanish...)"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0E172B] border border-cyan-500/30 focus:border-cyan-400 text-sm text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Regional filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => {
                  soundFx.playClick();
                  setActiveRegion(region);
                }}
                className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition-all ${
                  activeRegion === region
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm shadow-cyan-500/20'
                    : 'bg-[#0B1322] text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Languages Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Quick Auto-Detect Card when no filter is applied */}
          {!searchQuery && activeRegion === 'All Regions' && (
            <div
              onClick={() => handleSelect(AUTO_DETECT_LANGUAGE)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedLanguageCode === 'auto'
                  ? 'bg-[#101E36] border-cyan-400 shadow-lg shadow-cyan-950'
                  : 'bg-[#0B1426] hover:bg-[#0F1B33] border-cyan-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl">
                  🌐
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Auto-Detect Language</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/40">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    HINDUSTAN AI automatically detects whatever language you speak or write in and replies natively.
                  </p>
                </div>
              </div>

              {selectedLanguageCode === 'auto' && (
                <div className="w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>
          )}

          {/* Languages Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {displayedLanguages.map((lang: LanguageInfo) => {
              const isSelected = selectedLanguageCode.toLowerCase() === lang.code.toLowerCase();

              return (
                <div
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group flex items-start justify-between relative chat-bubble-item ${
                    isSelected
                      ? 'bg-[#102038] border-cyan-400 shadow-md shadow-cyan-950/60'
                      : 'bg-[#0A1222]/80 hover:bg-[#0E1A30] border-slate-800/80 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span className="text-2xl shrink-0 mt-0.5 select-none">{lang.flag}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {lang.name}
                        </span>
                        {lang.direction === 'rtl' && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950/80 text-amber-400 border border-amber-500/30">
                            RTL
                          </span>
                        )}
                        {lang.popular && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            POPULAR
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-sm font-semibold mt-0.5 truncate ${
                          isSelected ? 'text-cyan-300' : 'text-slate-300'
                        }`}
                        dir={lang.direction}
                      >
                        {lang.nativeName}
                      </p>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-cyan-400/80 shrink-0" />
                        <span className="truncate">{lang.country}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0 ml-2 mt-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredLanguages.length > displayLimit && (
            <div className="text-center pt-2">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 30)}
                className="px-4 py-2 rounded-xl bg-[#0E1A30] hover:bg-[#142342] text-xs font-semibold text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer"
              >
                Load more languages ({filteredLanguages.length - displayLimit} remaining)...
              </button>
            </div>
          )}

          {filteredLanguages.length === 0 && (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
                <Globe className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-300">
                Language or dialect not found
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                HINDUSTAN AI dynamically comprehends and translates rare dialects via Unicode. Select <strong>Auto-Detect</strong> to communicate naturally.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#080D18] border-t border-cyan-500/20 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            ACTIVE: <strong className="text-cyan-400">{selectedLanguageCode.toUpperCase()}</strong>
          </span>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            POWERED BY GEMINI 3.8 FLASH UNICODE ENGINE
          </span>
          <button
            onClick={() => {
              soundFx.playPanel();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
