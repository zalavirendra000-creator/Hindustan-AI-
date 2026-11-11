import { UserProfile, ConversationThread } from '../types.ts';

const PROFILE_STORAGE_KEY = 'hindustan_ai_user_profile_v1';
const HISTORY_STORAGE_KEY = 'hindustan_ai_conversations_v1';

export const DEFAULT_PROFILE: UserProfile = {
  id: 'guest_user_' + Math.floor(1000 + Math.random() * 9000),
  name: 'Virendra Sinh',
  username: 'virendra_sinh',
  avatarUrl: '', // Empty means use generated avatar badge with initials
  accountType: 'Guest User',
  bio: 'Exploring AI with Hindustan AI powered by Gemini 3.8 Flash.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    preferredLanguage: 'all',
    voiceAutoPlay: false,
    soundEffects: true,
    responseStyle: 'balanced',
    glowTheme: 'cyan',
  },
};

/**
 * Loads user profile from localStorage with fallback
 */
export function getStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      settings: {
        ...DEFAULT_PROFILE.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load profile from storage:', e);
    return DEFAULT_PROFILE;
  }
}

/**
 * Saves user profile to localStorage
 */
export function saveStoredProfile(profile: UserProfile): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const toSave: UserProfile = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (e) {
    console.error('Failed to save profile to storage:', e);
    return false;
  }
}

/**
 * Loads all saved conversation threads
 */
export function getStoredConversations(): ConversationThread[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('Failed to load conversations from storage:', e);
    return [];
  }
}

/**
 * Saves the full list of conversations
 */
export function saveStoredConversations(conversations: ConversationThread[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(conversations));
    return true;
  } catch (e) {
    console.error('Failed to save conversations to storage:', e);
    // If quota exceeded, slice oldest conversations
    if (conversations.length > 20) {
      try {
        const trimmed = conversations.slice(0, 20);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
        return true;
      } catch {}
    }
    return false;
  }
}

/**
 * Saves or updates a single conversation thread
 */
export function saveConversation(thread: ConversationThread): ConversationThread[] {
  const current = getStoredConversations();
  const existingIndex = current.findIndex((c) => c.id === thread.id);

  let updated: ConversationThread[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = {
      ...thread,
      updatedAt: new Date().toISOString(),
    };
  } else {
    // New thread at beginning
    updated = [
      {
        ...thread,
        updatedAt: new Date().toISOString(),
      },
      ...current,
    ];
  }

  // Sort: pinned first, then newest updated
  updated.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  saveStoredConversations(updated);
  return updated;
}

/**
 * Deletes a single conversation
 */
export function deleteStoredConversation(id: string): ConversationThread[] {
  const current = getStoredConversations();
  const filtered = current.filter((c) => c.id !== id);
  saveStoredConversations(filtered);
  return filtered;
}

/**
 * Renames a conversation thread
 */
export function renameStoredConversation(id: string, newTitle: string): ConversationThread[] {
  const current = getStoredConversations();
  const updated = current.map((c) =>
    c.id === id ? { ...c, title: newTitle.trim(), updatedAt: new Date().toISOString() } : c
  );
  saveStoredConversations(updated);
  return updated;
}

/**
 * Clears all conversation history
 */
export function clearAllStoredConversations(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Failed to clear conversations:', e);
    return false;
  }
}

/**
 * Helper to compress and convert uploaded image file to compact base64
 */
export function compressImageFile(file: File, maxDim = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
