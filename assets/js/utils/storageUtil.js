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
  language: 'en', // 22 Scheduled Indian Languages + English
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

const DEFAULT_CHAT_HISTORY = [
  {
    id: "chat-default-1",
    title: "How to focus a restless and wandering mind?",
    createdAt: Date.now() - 3600000 * 2,
    timestamp: Date.now() - 3600000 * 2,
    section: "Today",
    topic: "Mind Control & Focus",
    chapterRef: "Chapter 6, Verse 35",
    messageCount: 2,
    messages: [
      { role: "user", text: "How to focus a restless and wandering mind?" },
      {
        role: "assistant",
        text: "The restless mind can be mastered through two divine principles: Abhyasa (consistent practice) and Vairagya (dispassion). Do not fight the mind violently; instead, gently bring it back whenever it wanders.",
        verse: { id: "6-35", chapter: 6, verse: 35, sanskrit: "असंशयं महाबाहो मनो दुर्निग्रहं चलम् ।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥", translation: "O mighty-armed son of Kunti, the mind is indeed restless and difficult to curb, but it can be mastered through persistent practice and detachment." }
      }
    ]
  },
  {
    id: "chat-default-2",
    title: "I am afraid of failing my exams.",
    createdAt: Date.now() - 86400000 * 1.5,
    timestamp: Date.now() - 86400000 * 1.5,
    section: "Yesterday",
    topic: "Overcoming Fear & Anxiety",
    chapterRef: "Chapter 2, Verse 47",
    messageCount: 2,
    messages: [
      { role: "user", text: "I am afraid of failing my exams." },
      {
        role: "assistant",
        text: "Fear of outcomes creates mental noise that degrades concentration. Your sacred right is to sincere effort and preparation, not attachment to the fruits. Release the anxiety of 'What if I fail' and pour your whole heart into understanding.",
        verse: { id: "2-47", chapter: 2, verse: 47, sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥", translation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action." }
      }
    ]
  }
];

class StorageManager {
  // Helper: Resolve isolated user key for multi-account support
  getUserKey(baseKey) {
    try {
      const userStr = localStorage.getItem('geetha_gpt_auth_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const uid = user.uid || user.id || 'guest';
        return `${baseKey}_${uid}`;
      }
    } catch (e) {}
    return baseKey;
  }

  // Helper: Retrieve item with fallback check for legacy account keys
  getStoredItem(baseKey) {
    try {
      const userKey = this.getUserKey(baseKey);
      const data = localStorage.getItem(userKey);
      if (data !== null) return data;
      if (userKey !== baseKey) {
        const fallbackData = localStorage.getItem(baseKey);
        if (fallbackData !== null) return fallbackData;
      }
      // Fallback migration check for data saved under legacy user account keys
      const legacyKey = `${baseKey}_user_account_a`;
      const legacyData = localStorage.getItem(legacyKey);
      if (legacyData !== null) {
        localStorage.setItem(baseKey, legacyData);
        return legacyData;
      }
      const guestKey = `${baseKey}_guest`;
      const guestData = localStorage.getItem(guestKey);
      if (guestData !== null) {
        localStorage.setItem(baseKey, guestData);
        return guestData;
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    return null;
  }

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
      const data = this.getStoredItem(STORAGE_KEYS.SAVED_VERSES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      if (data === null) {
        return DEFAULT_SAVED_VERSES;
      }
      return [];
    } catch {
      return [];
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

  clearAllSavedVerses() {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_VERSES, JSON.stringify([]));
      return true;
    } catch (e) {
      console.warn("Error clearing saved verses:", e);
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
      const data = this.getStoredItem(STORAGE_KEYS.VIEWED_VERSES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
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
      const data = this.getStoredItem(STORAGE_KEYS.CHAT_HISTORY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      if (data === null) {
        return DEFAULT_CHAT_HISTORY;
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
