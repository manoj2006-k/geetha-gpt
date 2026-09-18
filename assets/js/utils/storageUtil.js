/**
 * Geetha GPT - LocalStorage State Persistence Manager
 * Manages Saved Verses, Viewed Verses (Progress Tracking), Chat History, and App Preferences
 */

const STORAGE_KEYS = {
  SAVED_VERSES: 'geetha_gpt_saved_verses',
  VIEWED_VERSES: 'geetha_gpt_viewed_verses',
  CHAT_HISTORY: 'geetha_gpt_chat_history',
  SETTINGS: 'geetha_gpt_settings'
};

const DEFAULT_SETTINGS = {
  language: 'en', // 'en' | 'te'
  theme: 'light', // 'light' | 'dark'
  sanskritDisplay: 'devanagari', // 'devanagari' | 'translit' | 'telugu'
  fontSize: 'medium', // 'small' | 'medium' | 'large'
  soundEnabled: true,
  notificationsEnabled: true
};

const DEFAULT_SAVED_VERSES = [
  { verseId: "2-47", savedAt: Date.now() - 86400000 * 2, note: "Focus on duty and preparation rather than being paralyzed by results." },
  { verseId: "6-5", savedAt: Date.now() - 86400000 * 1, note: "The mind is our best friend when disciplined, our greatest enemy when untrained." },
  { verseId: "18-66", savedAt: Date.now() - 3600000 * 5, note: "Surrender all anxieties to the divine and act with courageous peace." }
];

const DEFAULT_CHAT_HISTORY = [];

class StorageManager {
  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn("Error saving settings:", e);
    }
  }

  getLanguage() {
    return this.getSettings().language || 'en';
  }

  setLanguage(lang) {
    const settings = this.getSettings();
    settings.language = lang;
    this.saveSettings(settings);
  }

  // Saved Verses (Bookmarks)
  getSavedVerses() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_VERSES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_SAVED_VERSES;
    } catch {
      return DEFAULT_SAVED_VERSES;
    }
  }

  saveVerse(verseId, note = "") {
    try {
      const list = this.getSavedVerses();
      const existingIdx = list.findIndex(item => item.verseId === verseId);
      if (existingIdx >= 0) {
        list[existingIdx].savedAt = Date.now();
        if (note) list[existingIdx].note = note;
      } else {
        list.unshift({ verseId, savedAt: Date.now(), note });
      }
      localStorage.setItem(STORAGE_KEYS.SAVED_VERSES, JSON.stringify(list));
      return true;
    } catch (e) {
      console.warn("Error saving verse:", e);
      return false;
    }
  }

  removeVerse(verseId) {
    try {
      const list = this.getSavedVerses().filter(item => item.verseId !== verseId);
      localStorage.setItem(STORAGE_KEYS.SAVED_VERSES, JSON.stringify(list));
      return true;
    } catch (e) {
      console.warn("Error removing verse:", e);
      return false;
    }
  }

  isVerseSaved(verseId) {
    const list = this.getSavedVerses();
    return list.some(item => item.verseId === verseId);
  }

  updateVerseNote(verseId, note) {
    try {
      const list = this.getSavedVerses();
      const item = list.find(it => it.verseId === verseId);
      if (item) {
        item.note = note;
        localStorage.setItem(STORAGE_KEYS.SAVED_VERSES, JSON.stringify(list));
        return true;
      }
    } catch (e) {
      console.warn("Error updating note:", e);
    }
    return false;
  }

  // Viewed Verses & Reading Progress Tracking
  getViewedVerses() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIEWED_VERSES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      return ["1-1", "2-47", "18-78"];
    } catch {
      return ["1-1", "2-47", "18-78"];
    }
  }

  markVerseViewed(verseId) {
    try {
      const viewed = this.getViewedVerses();
      if (!viewed.includes(verseId)) {
        viewed.push(verseId);
        localStorage.setItem(STORAGE_KEYS.VIEWED_VERSES, JSON.stringify(viewed));
      }
      return true;
    } catch (e) {
      console.warn("Error marking verse viewed:", e);
      return false;
    }
  }

  isVerseViewed(verseId) {
    const viewed = this.getViewedVerses();
    return viewed.includes(verseId);
  }

  getChapterProgress(chapterNumber, totalCount = 0) {
    const viewed = this.getViewedVerses();
    const prefix = `${chapterNumber}-`;
    const viewedInChapter = viewed.filter(id => id.startsWith(prefix)).length;
    const total = totalCount || 1;
    const percent = Math.min(100, Math.round((viewedInChapter / total) * 100));
    const isCompleted = viewedInChapter >= total;
    return {
      viewedCount: viewedInChapter,
      totalCount: total,
      percentage: percent,
      isCompleted: isCompleted
    };
  }

  // Chat History
  getChatHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  }

  getChatConversation(id) {
    try {
      const list = this.getChatHistory();
      return list.find(item => item.id === id) || null;
    } catch {
      return null;
    }
  }

  saveChatConversation(conv) {
    try {
      if (!conv || !conv.messages || conv.messages.length === 0) return null;
      const list = this.getChatHistory();
      const existingIdx = list.findIndex(item => item.id === conv.id);

      const firstUserMsg = conv.messages.find(m => m.role === 'user');
      const title = conv.title || (firstUserMsg ? firstUserMsg.text : 'Gita Consultation');

      const entry = {
        id: conv.id || ('chat-' + Date.now()),
        title: title,
        createdAt: conv.createdAt || Date.now(),
        timestamp: conv.createdAt || Date.now(),
        messageCount: conv.messages.length,
        messages: conv.messages,
        topic: conv.topic || 'Wisdom',
        chapterRef: conv.chapterRef || ''
      };

      if (existingIdx >= 0) {
        list[existingIdx] = entry;
      } else {
        list.unshift(entry);
      }

      const trimmed = list.slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(trimmed));
      return entry;
    } catch (e) {
      console.warn("Error saving conversation:", e);
      return null;
    }
  }

  addChatHistoryEntry(entry) {
    return this.saveChatConversation({
      id: entry.id || ('chat-' + Date.now()),
      title: entry.query || entry.title,
      messages: entry.messages || [{ role: 'user', text: entry.query }],
      topic: entry.topic || 'Wisdom',
      chapterRef: entry.chapterRef || ''
    });
  }

  deleteChatHistoryEntry(id) {
    try {
      const list = this.getChatHistory().filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.warn("Error deleting chat history entry:", e);
      return false;
    }
  }

  clearChatHistory() {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify([]));
      return true;
    } catch (e) {
      return false;
    }
  }

  resetAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SAVED_VERSES);
      localStorage.removeItem(STORAGE_KEYS.VIEWED_VERSES);
      localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      return true;
    } catch {
      return false;
    }
  }
}

export const storageManager = new StorageManager();
