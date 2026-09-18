/**
 * Geetha GPT - Mobile Drawer & Bottom Navigation Bar Component
 */

import { I18N } from '../data/i18n.js';
import { getLanguage, getScriptFontClass } from '../data/languages.js';
import { languageModal } from './LanguageModal.js';
import { storageManager } from '../utils/storageUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';

export function renderMobileBottomNav(currentRoute, options = {}) {
  const { lang = 'en', onNavigate = null, onToggleLang = null } = options;
  const t = I18N[lang] || I18N.en;
  const savedCount = storageManager.getSavedVerses().length;

  const nav = document.createElement('div');
  nav.className = 'lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-[#121110]/95 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 px-2 py-1.5 flex items-center justify-around shadow-2xl transition-colors';

  const items = [
    { id: 'home', icon: 'Home', label: t.nav.home },
    { id: 'chapters', icon: 'BookOpen', label: t.nav.chapters },
    { id: 'askGeetha', icon: 'MessageSquareQuote', label: t.nav.askGeetha, isCenter: true },
    { id: 'topics', icon: 'Compass', label: t.nav.topics },
    { id: 'saved', icon: 'Bookmark', label: t.nav.savedVerses, count: savedCount > 0 ? savedCount : null }
  ];

  nav.innerHTML = items
    .map(item => {
      const isActive = currentRoute === item.id;
      if (item.isCenter) {
        return `
          <button data-nav="${item.id}" class="mobile-nav-btn relative -top-3 flex flex-col items-center group">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-lg shadow-amber-600/30 border-2 border-white dark:border-[#121110] transform group-active:scale-95 transition">
              <span class="animate-flame text-lg">🪔</span>
            </div>
            <span class="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-0.5 ${getScriptFontClass(lang)}">${item.label}</span>
          </button>
        `;
      }

      return `
        <button data-nav="${item.id}" class="mobile-nav-btn flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
          isActive
            ? 'text-amber-700 dark:text-amber-300 font-bold'
            : 'text-stone-500 dark:text-stone-400'
        }">
          <div class="relative">
            <i data-lucide="${item.icon}" class="w-5 h-5 ${isActive ? 'text-amber-600 dark:text-amber-400' : ''}"></i>
            ${
              item.count
                ? `<span class="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">${item.count}</span>`
                : ''
            }
          </div>
          <span class="text-[10px] mt-1 ${getScriptFontClass(lang)}">${item.label}</span>
        </button>
      `;
    })
    .join('');

  nav.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.onclick = () => {
      const target = btn.dataset.nav;
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate(target);
    };
  });

  return nav;
}

export function openMobileDrawer(currentRoute, options = {}) {
  const { lang = 'en', onNavigate = null, onToggleLang = null } = options;
  const t = I18N[lang] || I18N.en;
  const currentLangObj = getLanguage(lang);

  const existing = document.getElementById('mobile-drawer-modal');
  if (existing) existing.remove();

  const drawer = document.createElement('div');
  drawer.id = 'mobile-drawer-modal';
  drawer.className = 'fixed inset-0 z-50 flex page-fade-in bg-black/60 backdrop-blur-sm lg:hidden';

  const menuList = [
    { id: 'home', icon: 'Home', label: t.nav.home },
    { id: 'askGeetha', icon: 'MessageSquareQuote', label: t.nav.askGeetha, badge: 'AI' },
    { id: 'chapters', icon: 'BookOpen', label: t.nav.chapters },
    { id: 'topics', icon: 'Compass', label: t.nav.topics },
    { id: 'dailyWisdom', icon: 'Sun', label: t.nav.dailyWisdom },
    { id: 'saved', icon: 'Bookmark', label: t.nav.savedVerses },
    { id: 'history', icon: 'History', label: t.nav.history },
    { id: 'settings', icon: 'Settings', label: t.nav.settings }
  ];

  drawer.innerHTML = `
    <div class="w-72 max-w-[80vw] bg-white dark:bg-[#1A1816] h-full flex flex-col shadow-2xl border-r border-stone-200 dark:border-stone-800 p-5 overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <span>🪔</span>
          </div>
          <div class="flex flex-col">
            <span class="font-cinzel font-bold text-base text-stone-900 dark:text-stone-100">Geetha GPT</span>
            <span class="text-[10px] text-amber-600 font-cinzel">Bhagavad Gita AI</span>
          </div>
        </div>
        <button id="close-drawer-btn" class="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Language Selector Button (23 Languages) -->
      <div class="pt-3 pb-2">
        <button id="drawer-lang-btn" class="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-stone-800 dark:text-stone-200">
          <div class="flex items-center gap-2.5">
            <span class="text-base">🌐</span>
            <div class="flex flex-col text-left">
              <span class="${getScriptFontClass(lang)} font-bold text-sm text-amber-900 dark:text-amber-200">${currentLangObj.nativeName}</span>
              <span class="text-[10px] text-stone-500 dark:text-stone-400">${currentLangObj.name} (${lang.toUpperCase()})</span>
            </div>
          </div>
          <span class="text-amber-700 dark:text-amber-400 text-xs font-bold">Change ▾</span>
        </button>
      </div>

      <!-- Links -->
      <div class="flex-1 py-2 flex flex-col gap-1.5">
        ${menuList
          .map(item => {
            const isActive = currentRoute === item.id;
            return `
            <button data-nav="${item.id}" class="drawer-link-btn flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
              isActive
                ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30 font-bold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }">
              <div class="flex items-center gap-3">
                <i data-lucide="${item.icon}" class="w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400'}"></i>
                <span class="${getScriptFontClass(lang)}">${item.label}</span>
              </div>
              ${
                item.badge
                  ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">${item.badge}</span>`
                  : ''
              }
            </button>
          `;
          })
          .join('')}
      </div>

      <!-- Footer Info -->
      <div class="pt-4 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 flex flex-col gap-1">
        <span class="font-cinzel font-bold text-amber-700 dark:text-amber-400">Timeless Guidance</span>
        <span>22 Indian Languages + English</span>
      </div>
    </div>
  `;

  document.body.appendChild(drawer);

  // Re-run Lucide on dynamic insert
  if (window.lucide) window.lucide.createIcons();

  drawer.querySelector('#close-drawer-btn').onclick = () => drawer.remove();
  drawer.onclick = (e) => {
    if (e.target === drawer) drawer.remove();
  };

  const drawerLangBtn = drawer.querySelector('#drawer-lang-btn');
  if (drawerLangBtn) {
    drawerLangBtn.onclick = () => {
      drawer.remove();
      soundSynthesizer.playChime();
      languageModal.open({
        currentLang: lang,
        onSelect: (newLang) => {
          if (onToggleLang) onToggleLang(newLang);
        }
      });
    };
  }

  drawer.querySelectorAll('.drawer-link-btn').forEach(btn => {
    btn.onclick = () => {
      const target = btn.dataset.nav;
      drawer.remove();
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate(target);
    };
  });
}

