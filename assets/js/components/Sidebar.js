/**
 * Geetha GPT - Desktop Sidebar Navigation Component
 */

import { I18N } from '../data/i18n.js';
import { getLanguage, getScriptFontClass } from '../data/languages.js';
import { languageModal } from './LanguageModal.js';
import { storageManager } from '../utils/storageUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';

export function renderSidebar(currentRoute, options = {}) {
  const { lang = 'en', onNavigate = null, onToggleLang = null } = options;
  const t = I18N[lang] || I18N.en;
  const savedCount = storageManager.getSavedVerses().length;
  const currentLangObj = getLanguage(lang);

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar-nav hidden lg:flex flex-col w-64 bg-white/80 dark:bg-[#1A1816]/90 backdrop-blur-md border-r border-stone-200/80 dark:border-stone-800/80 fixed left-0 top-0 bottom-0 z-30 transition-colors duration-300 select-none';

  const navItems = [
    { id: 'home', icon: 'Home', label: t.nav.home },
    { id: 'askGeetha', icon: 'MessageSquareQuote', label: t.nav.askGeetha, badge: 'AI' },
    { id: 'chapters', icon: 'BookOpen', label: t.nav.chapters, count: '18' },
    { id: 'topics', icon: 'Compass', label: t.nav.topics, count: '16' },
    { id: 'dailyWisdom', icon: 'Sun', label: t.nav.dailyWisdom },
    { id: 'saved', icon: 'Bookmark', label: t.nav.savedVerses, count: savedCount > 0 ? savedCount : null },
    { id: 'history', icon: 'History', label: t.nav.history },
    { id: 'settings', icon: 'Settings', label: t.nav.settings }
  ];

  sidebar.innerHTML = `
    <!-- Top App Logo & Branding -->
    <div class="p-6 border-b border-stone-100 dark:border-stone-800/80 flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-600/25 border border-amber-400/40 relative">
        <span class="animate-flame">🪔</span>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-1.5">
          <span class="font-cinzel font-bold text-lg text-stone-900 dark:text-amber-50 tracking-tight">Geetha GPT</span>
        </div>
        <span class="text-[11px] font-medium text-amber-700 dark:text-amber-400/90 font-cinzel tracking-wider">Bhagavad Gita AI</span>
      </div>
    </div>

    <!-- Navigation Menu Items -->
    <div class="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
      <div class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 font-cinzel">
        Navigation
      </div>
      ${navItems
        .map(item => {
          const isActive = currentRoute === item.id;
          return `
          <button 
            data-nav="${item.id}" 
            class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30 font-semibold shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-stone-800/50'
            }"
          >
            <div class="flex items-center gap-3">
              <i data-lucide="${item.icon}" class="w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400'}"></i>
              <span class="${getScriptFontClass(lang)}">${item.label}</span>
            </div>
            ${
              item.badge
                ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-white shadow-sm">${item.badge}</span>`
                : ''
            }
            ${
              item.count
                ? `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">${item.count}</span>`
                : ''
            }
          </button>
        `;
        })
        .join('')}
    </div>

    <!-- Language Quick Trigger -->
    <div class="px-3 pb-2">
      <button id="sidebar-lang-btn" class="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-stone-800 dark:text-stone-200 transition group">
        <div class="flex items-center gap-2">
          <span>🌐</span>
          <span class="${getScriptFontClass(lang)}">${currentLangObj.nativeName}</span>
          <span class="text-[10px] text-stone-400">(${lang.toUpperCase()})</span>
        </div>
        <span class="text-amber-600 group-hover:translate-x-0.5 transition font-bold text-[10px]">Change ▾</span>
      </button>
    </div>

    <!-- Bottom Daily Thought / Inspiration Card -->
    <div class="p-4 m-3 mt-0 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-xs">
      <div class="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider font-cinzel text-[10px]">
        <span>✦</span>
        <span class="${getScriptFontClass(lang)}">${(t.footer && t.footer.sanatanadharma) || 'Sanatana Dharma'}</span>
      </div>
      <p class="mt-1.5 text-stone-600 dark:text-stone-300 leading-relaxed font-sanskrit text-xs italic">
        "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"
      </p>
      <span class="mt-1 block text-[10px] text-stone-400">BG 2.47 • Focus on Duty</span>
    </div>
  `;

  // Attach Navigation Click Handlers
  sidebar.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = () => {
      const target = btn.dataset.nav;
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate(target);
    };
  });

  const sidebarLangBtn = sidebar.querySelector('#sidebar-lang-btn');
  if (sidebarLangBtn) {
    sidebarLangBtn.onclick = () => {
      soundSynthesizer.playChime();
      languageModal.open({
        currentLang: lang,
        onSelect: (newLang) => {
          if (onToggleLang) onToggleLang(newLang);
        }
      });
    };
  }

  return sidebar;
}

