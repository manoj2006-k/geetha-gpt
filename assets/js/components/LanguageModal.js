/**
 * Geetha GPT - Searchable Multilingual Language Selection Modal
 * Supports all 22 Scheduled Languages of India + English (23 languages)
 * Features real-time search, native script typography, RTL badges, and voice support indicators.
 */

import { LANGUAGES, getLanguage, isRTL, getScriptFontClass } from '../data/languages.js';
import { storageManager } from '../utils/storageUtil.js';

export class LanguageModal {
  constructor() {
    this.modalEl = null;
    this.currentLang = 'en';
    this.onSelectCallback = null;
  }

  getRecentLanguages() {
    try {
      const recents = JSON.parse(localStorage.getItem('geetha_recent_languages') || '[]');
      if (Array.isArray(recents) && recents.length > 0) {
        return recents;
      }
    } catch (e) {}
    return ['en', 'te', 'hi'];
  }

  saveRecentLanguage(code) {
    try {
      const recents = this.getRecentLanguages().filter(c => c !== code);
      recents.unshift(code);
      localStorage.setItem('geetha_recent_languages', JSON.stringify(recents.slice(0, 5)));
    } catch (e) {}
  }

  open(options = {}) {
    this.currentLang = options.currentLang || (typeof storageManager.getLanguage === 'function' ? storageManager.getLanguage() : (storageManager.getSettings ? storageManager.getSettings().language : 'en')) || 'en';
    this.onSelectCallback = options.onSelect || null;
    this.render();
  }

  close() {
    if (this.modalEl && this.modalEl.parentNode) {
      this.modalEl.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        if (this.modalEl && this.modalEl.parentNode) {
          this.modalEl.parentNode.removeChild(this.modalEl);
          this.modalEl = null;
        }
      }, 200);
    }
  }

  render() {
    // Remove any existing modal
    if (this.modalEl && this.modalEl.parentNode) {
      this.modalEl.parentNode.removeChild(this.modalEl);
    }

    const currentLangObj = getLanguage(this.currentLang);
    const recentCodes = this.getRecentLanguages();

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-200';
    overlay.id = 'language-selection-modal';

    overlay.innerHTML = `
      <div class="relative w-full max-w-xl bg-white dark:bg-[#1A1816] rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
        
        <!-- Header -->
        <div class="px-6 pt-5 pb-4 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-600/20">
              <span>🌐</span>
            </div>
            <div>
              <h2 class="text-lg font-bold text-stone-900 dark:text-stone-100 font-cinzel tracking-tight flex items-center gap-2">
                <span>Select Language</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-sans font-semibold">
                  23 Languages
                </span>
              </h2>
              <p class="text-xs text-stone-500 dark:text-stone-400">
                22 Scheduled Languages of India + English
              </p>
            </div>
          </div>

          <button id="lang-modal-close-btn" class="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition" title="Close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Search Input Bar -->
        <div class="p-4 border-b border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
          <div class="relative flex items-center">
            <span class="absolute left-3.5 text-stone-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              type="text" 
              id="lang-search-input" 
              placeholder="Search language by name, script, or code (e.g. Hindi, தமிழ், te)..." 
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#201D1A] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition"
              autocomplete="off"
            />
          </div>
        </div>

        <!-- Scrollable Languages List -->
        <div id="lang-list-container" class="flex-1 overflow-y-auto p-4 space-y-4">
          
          <!-- Quick Picks / Recently Used -->
          <div id="lang-recents-section" class="space-y-1.5">
            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 font-cinzel">
              ✦ Recently Used
            </span>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="lang-recents-grid"></div>
          </div>

          <!-- All Languages List -->
          <div class="space-y-1.5 pt-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 font-cinzel">
              All 23 Supported Languages
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="lang-all-grid"></div>
          </div>

        </div>

        <!-- Footer / Current Selection Info -->
        <div class="px-6 py-3 border-t border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-[#151413] flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div class="flex items-center gap-2">
            <span>Current:</span>
            <span class="font-bold text-amber-700 dark:text-amber-400">
              ${currentLangObj.nativeName} (${currentLangObj.name})
            </span>
            ${currentLangObj.dir === 'rtl' ? '<span class="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold">RTL</span>' : ''}
          </div>
          <span class="text-[11px] text-stone-400">
            Esc to close
          </span>
        </div>

      </div>
    `;

    document.body.appendChild(overlay);
    this.modalEl = overlay;

    // Elements
    const searchInput = overlay.querySelector('#lang-search-input');
    const recentsGrid = overlay.querySelector('#lang-recents-grid');
    const allGrid = overlay.querySelector('#lang-all-grid');
    const closeBtn = overlay.querySelector('#lang-modal-close-btn');

    // Populate Recent Languages
    const renderRecents = () => {
      recentsGrid.innerHTML = '';
      recentCodes.forEach(code => {
        const langObj = getLanguage(code);
        if (!langObj) return;
        const isCurrent = langObj.code === this.currentLang;
        const btn = document.createElement('button');
        btn.dataset.langCode = langObj.code;
        btn.className = `flex items-center justify-between p-2.5 rounded-xl border transition text-left ${
          isCurrent 
            ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 font-bold shadow-sm' 
            : 'bg-stone-50 dark:bg-[#201D1A] border-stone-200/80 dark:border-stone-800 hover:border-amber-500/50 text-stone-800 dark:text-stone-200'
        }`;
        btn.innerHTML = `
          <div class="flex flex-col truncate">
            <span class="text-sm font-semibold ${langObj.fontClass}">${langObj.nativeName}</span>
            <span class="text-[11px] text-stone-500 dark:text-stone-400 truncate">${langObj.name}</span>
          </div>
          ${isCurrent ? '<span class="text-amber-600 dark:text-amber-400 font-bold text-sm">✓</span>' : ''}
        `;
        btn.onclick = () => this.selectLanguage(langObj.code);
        recentsGrid.appendChild(btn);
      });
    };

    // Populate All Languages
    const renderLanguagesList = (filterQuery = '') => {
      allGrid.innerHTML = '';
      const q = filterQuery.toLowerCase().trim();

      const filtered = LANGUAGES.filter(l => {
        if (!q) return true;
        return (
          l.name.toLowerCase().includes(q) ||
          l.nativeName.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q) ||
          l.script.toLowerCase().includes(q) ||
          l.region.toLowerCase().includes(q)
        );
      });

      if (filtered.length === 0) {
        allGrid.innerHTML = `
          <div class="col-span-full py-8 text-center text-stone-400 text-xs">
            No languages matching "${filterQuery}"
          </div>
        `;
        return;
      }

      filtered.forEach(langObj => {
        const isCurrent = langObj.code === this.currentLang;
        const btn = document.createElement('button');
        btn.dataset.langCode = langObj.code;
        btn.className = `flex items-center justify-between p-3 rounded-2xl border transition text-left group ${
          isCurrent 
            ? 'bg-amber-500/15 border-amber-500/80 text-amber-900 dark:text-amber-200 font-bold shadow-sm' 
            : 'bg-white dark:bg-[#201D1A] border-stone-200/80 dark:border-stone-800 hover:border-amber-500/50 hover:bg-amber-500/[0.04] text-stone-800 dark:text-stone-200'
        }`;

        btn.innerHTML = `
          <div class="flex items-center gap-3 truncate">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
              isCurrent ? 'bg-amber-500 text-white shadow-sm' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }">
              ${langObj.code.toUpperCase()}
            </div>
            <div class="flex flex-col truncate">
              <div class="flex items-center gap-1.5">
                <span class="text-sm sm:text-base font-semibold ${langObj.fontClass}">${langObj.nativeName}</span>
                ${langObj.dir === 'rtl' ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">RTL</span>' : ''}
              </div>
              <span class="text-[11px] text-stone-500 dark:text-stone-400 truncate">${langObj.name} • <span class="opacity-80">${langObj.script}</span></span>
            </div>
          </div>
          
          <div class="flex items-center gap-2 flex-shrink-0">
            ${langObj.hasVoiceSupport ? '<span class="text-[11px] text-amber-600/70 dark:text-amber-400/70" title="Voice Recognition Supported">🎙️</span>' : ''}
            ${isCurrent ? '<span class="text-amber-600 dark:text-amber-400 font-bold text-base">✓</span>' : '<span class="text-stone-300 dark:text-stone-600 group-hover:text-amber-600 group-hover:translate-x-0.5 transition font-bold text-xs">→</span>'}
          </div>
        `;

        btn.onclick = () => this.selectLanguage(langObj.code);
        allGrid.appendChild(btn);
      });
    };

    renderRecents();
    renderLanguagesList();

    // Event handlers
    searchInput.oninput = (e) => {
      const val = e.target.value;
      const recentsSec = overlay.querySelector('#lang-recents-section');
      if (val.trim()) {
        recentsSec.classList.add('hidden');
      } else {
        recentsSec.classList.remove('hidden');
      }
      renderLanguagesList(val);
    };

    closeBtn.onclick = () => this.close();

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        this.close();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        this.close();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
      searchInput.focus();
    }, 50);
  }

  selectLanguage(code) {
    this.saveRecentLanguage(code);
    storageManager.setLanguage(code);
    this.close();

    if (typeof this.onSelectCallback === 'function') {
      this.onSelectCallback(code);
    }
  }
}

export const languageModal = new LanguageModal();
