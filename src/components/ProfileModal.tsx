import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  User,
  Shield,
  Settings,
  Info,
  Check,
  Save,
  Trash2,
  Sparkles,
  Volume2,
  VolumeX,
  Languages,
  Sliders,
  Cpu,
  Heart,
  Upload,
} from 'lucide-react';
import { UserProfile, LanguageFilter } from '../types.ts';
import { compressImageFile } from '../utils/storage.ts';
import { soundFx } from '../utils/audio.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenLanguageSelector?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenLanguageSelector,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'about'>('profile');
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [settings, setSettings] = useState(profile.settings);
  const [savedToast, setSavedToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    try {
      soundFx.playClick();
      const compressedDataUrl = await compressImageFile(file, 280);
      setAvatarUrl(compressedDataUrl);
      setErrorMsg('');
    } catch (err) {
      console.error('Error reading image:', err);
      setErrorMsg('Failed to process image. Try a smaller file.');
    }
  };

  const handleRemovePhoto = () => {
    soundFx.playClick();
    setAvatarUrl('');
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }
    if (!username.trim()) {
      setErrorMsg('Username cannot be empty.');
      return;
    }

    soundFx.playSend();

    const updatedProfile: UserProfile = {
      ...profile,
      name: name.trim(),
      username: username.trim().replace(/^@/, ''),
      bio: bio.trim(),
      avatarUrl,
      settings,
      updatedAt: new Date().toISOString(),
    };

    onUpdateProfile(updatedProfile);
    soundFx.setEnabled(settings.soundEffects);

    setSavedToast(true);
    setErrorMsg('');
    setTimeout(() => {
      setSavedToast(false);
    }, 2200);
  };

  const handleClose = () => {
    soundFx.playPanel();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#090E1A] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/50 overflow-hidden flex flex-col text-slate-100 cyber-grid relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Futuristic glowing corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

        {/* Header with JARVIS HUD styling */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-[#0D1527]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
              <User className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-wider text-white">USER PROFILE</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 uppercase">
                  JARVIS CORE
                </span>
              </div>
              <p className="text-[11px] font-mono text-cyan-300/70">
                LOCAL ID: {profile.id.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-cyan-500/20 bg-[#080D18] px-4 pt-2 gap-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('profile');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-[#0E172B] text-cyan-400 border-t-2 border-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Profile Card
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('settings');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-[#0E172B] text-cyan-400 border-t-2 border-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            HUD Settings
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('about');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'about'
                ? 'bg-[#0E172B] text-cyan-400 border-t-2 border-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            About Core
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[68vh] text-slate-200">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              {errorMsg}
            </div>
          )}

          {savedToast && (
            <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-400/60 text-cyan-300 text-xs flex items-center justify-between shadow-lg shadow-cyan-950">
              <span className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-cyan-400" />
                Profile & Settings saved successfully to local device!
              </span>
              <span className="text-[10px] font-mono uppercase text-cyan-400/70">PERSISTED</span>
            </div>
          )}

          {/* TAB 1: PROFILE EDIT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar Upload & Status Badge */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-2xl bg-[#0D1528]/80 border border-cyan-500/30 shadow-inner">
                {/* Avatar with Futuristic Glowing Rings */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-blue-500 to-sky-400 shadow-lg shadow-cyan-500/25">
                    <div className="w-full h-full rounded-full bg-[#070B14] overflow-hidden flex items-center justify-center">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-700 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold tracking-wider font-mono">
                          {name.slice(0, 2).toUpperCase() || 'GU'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload overlay button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-cyan-300 text-[11px] font-medium cursor-pointer"
                    title="Upload profile photo"
                  >
                    <Camera className="w-5 h-5 mb-1 text-cyan-400" />
                    Change
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Account Type and Avatar controls */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-semibold shadow-sm">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      {profile.accountType}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800/80 text-[11px] font-mono text-slate-400 border border-slate-700/60">
                      SECURE OFFLINE VAULT
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Your profile data is stored permanently in your browser's local sandbox with zero external trackers.
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-medium border border-cyan-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Photo
                    </button>
                    {avatarUrl && (
                      <button
                        onClick={handleRemovePhoto}
                        className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-950/50 text-slate-400 hover:text-red-300 text-xs font-medium border border-slate-700 hover:border-red-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields: Name, Username, Bio */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080D18] border border-cyan-500/30 focus:border-cyan-400 text-sm text-white focus:outline-none transition-colors shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                    Username / Handle
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-cyan-400 font-mono text-sm">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#080D18] border border-cyan-500/30 focus:border-cyan-400 text-sm text-white focus:outline-none transition-colors shadow-inner font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    Unique local identifier for session logs and transcripts.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                    Personal AI Directive / Bio
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell HINDUSTAN AI how you prefer to be addressed or your interests..."
                    className="w-full px-4 py-2 rounded-xl bg-[#080D18] border border-cyan-500/30 focus:border-cyan-400 text-xs text-white focus:outline-none transition-colors resize-none shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              {/* Preferred Language Setting */}
              <div className="p-4 rounded-2xl bg-[#0D1528]/80 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Target Response Language
                    </span>
                  </div>
                  {onOpenLanguageSelector && (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onOpenLanguageSelector();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      Browse 7,000+ Languages
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'auto', label: '🌐 Auto-Detect' },
                    { id: 'hi', label: '🇮🇳 हिन्दी (Hindi)' },
                    { id: 'gu', label: '🇮🇳 ગુજરાતી (Gujarati)' },
                    { id: 'sa', label: '🕉️ संस्कृतम् (Sanskrit)' },
                    { id: 'en', label: '🇬🇧 English' },
                    { id: 'ar', label: '🇸🇦 العربية (Arabic)' },
                    { id: 'es', label: '🇪🇸 Español (Spanish)' },
                    { id: 'fr', label: '🇫🇷 Français (French)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundFx.playClick();
                        setSettings((prev) => ({
                          ...prev,
                          preferredLanguage: item.id,
                        }));
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        settings.preferredLanguage === item.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20'
                          : 'bg-[#080D18] text-slate-400 border-slate-700/60 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Effects & Voice Settings */}
              <div className="p-4 rounded-2xl bg-[#0D1528]/80 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      JARVIS Audio Feedback FX
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Synthesized sound effects on sends, clicks, and system alerts.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const next = !settings.soundEffects;
                      soundFx.setEnabled(next);
                      if (next) soundFx.playSend();
                      setSettings((prev) => ({ ...prev, soundEffects: next }));
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.soundEffects ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        settings.soundEffects ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Voice Auto-Read Response (TTS)
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Automatically recite AI responses using native Indic/English speech synthesis.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSettings((prev) => ({ ...prev, voiceAutoPlay: !prev.voiceAutoPlay }));
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.voiceAutoPlay ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        settings.voiceAutoPlay ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* AI Response Style */}
              <div className="p-4 rounded-2xl bg-[#0D1528]/80 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    AI Response Style Mode
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'balanced', label: 'Balanced' },
                    { id: 'creative', label: 'Creative' },
                    { id: 'precise', label: 'Precise / Code' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        soundFx.playClick();
                        setSettings((prev) => ({
                          ...prev,
                          responseStyle: style.id as any,
                        }));
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        settings.responseStyle === style.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                          : 'bg-[#080D18] text-slate-400 border-slate-700/60 hover:text-slate-200'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT HINDUSTAN AI */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1c36] to-[#070d1a] border border-cyan-500/40 text-center relative overflow-hidden">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-2 border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold tracking-wider text-white">HINDUSTAN AI</h3>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">VERSION 1.0.0 • SYSTEM ACTIVE</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-xs font-semibold text-blue-200">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Developed by Zala Virendra Sinh
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0D1528] border border-slate-800">
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Gemini 3.8 Flash Neural Engine</p>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      Powered by the latest @google/genai framework with streaming response pipeline and contextual reasoning.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0D1528] border border-slate-800">
                  <Languages className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Trilingual Intelligence</p>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      Engineered for India with native high-accuracy comprehension of Hindi, Gujarati, and English (including Hinglish and Gujlish).
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center text-[11px] text-slate-500 font-mono">
                Engineered with pride by <span className="text-cyan-400">Zala Virendra Sinh</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#080D18] border-t border-cyan-500/20 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/30 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
