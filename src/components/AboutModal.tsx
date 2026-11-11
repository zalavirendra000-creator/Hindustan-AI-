import React from 'react';
import { X, Sparkles, User, Cpu, Languages, ShieldCheck, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#101A2C] border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#142034]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide text-white">About HINDUSTAN AI</h2>
              <p className="text-[11px] text-slate-400">Official Application Information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
          {/* Main Hero Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#12243d] to-[#0c1626] border border-blue-500/20 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 text-sky-400 mb-2.5 shadow-lg shadow-sky-500/10">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold tracking-wider text-white">HINDUSTAN AI</h3>
            <p className="text-xs text-sky-400 font-medium mt-0.5">Version 1.0.0</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-xs font-semibold text-blue-200">
              <User className="w-3.5 h-3.5 text-sky-400" />
              Developed by Zala Virendra Sinh
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#162338]/60 border border-slate-800/80">
              <Cpu className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">AI Model Engine</p>
                <p className="text-slate-400 mt-0.5">gemini-3.8-flash via @google/genai SDK</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#162338]/60 border border-slate-800/80">
              <Languages className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">Multilingual Intelligence</p>
                <p className="text-slate-400 mt-0.5">
                  Deep contextual support for Hindi (हिन्दी), Gujarati (ગુજરાતી), and English.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#162338]/60 border border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">System Instruction</p>
                <p className="text-slate-400 mt-0.5 italic">
                  "You are HINDUSTAN AI, a helpful and friendly AI assistant created by Zala Virendra Sinh. Answer clearly and respectfully. Support Hindi, Gujarati and English."
                </p>
              </div>
            </div>
          </div>

          {/* Legalese matching Flutter's showAboutDialog */}
          <div className="pt-2 border-t border-slate-800 text-center text-[11px] text-slate-400 space-y-1">
            <p>Developed with passion by <span className="text-slate-200 font-medium">Zala Virendra Sinh</span></p>
            <p className="flex items-center justify-center gap-1 text-slate-400">
              Made for India <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> HINDUSTAN AI
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d1624] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
