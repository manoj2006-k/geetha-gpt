/**
 * Geetha GPT - Top Navbar Component
 */

import { I18N } from '../data/i18n.js';
import { getLanguage, getScriptFontClass } from '../data/languages.js';
import { languageModal } from './LanguageModal.js';
import { openSpotlightSearchModal } from './SearchBarModal.js';
import { soundSynthesizer } from '../utils/soundUtil.js';

export function renderNavbar(options = {}) {
  const {
    currentRoute = 'home',
    lang = 'en',
    theme = 'light',
    onToggleTheme = null,
    onToggleLang = null,
    onToggleMobileMenu = null,
    onNavigate = null
  } = options;

  const t = I18N[lang] || I18N.en;

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'askGeetha', label: t.nav.askGeetha },
    { id: 'chapters', label: t.nav.chapters },
    { id: 'topics', label: t.nav.topics },
    { id: 'dailyWisdom', label: t.nav.dailyWisdom },
    { id: 'saved', label: t.nav.savedVerses },
    { id: 'history', label: t.nav.history }
  ];

  const navbar = document.createElement('header');
  navbar.className = 'sticky top-0 z-20 w-full bg-white/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors duration-300';

  navbar.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
      <!-- Left: Mobile Hamburger & Logo -->
      <div class="flex items-center gap-3">
        <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>

        <!-- Brand Logo -->
        <div id="nav-brand-logo" class="flex items-center gap-2.5 cursor-pointer">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-600/20">
            <span class="animate-flame">🪔</span>
          </div>
          <div class="flex flex-col">
            <span class="font-cinzel font-bold text-base sm:text-lg text-stone-900 dark:text-amber-50 tracking-tight leading-none">Geetha GPT</span>
            <span class="text-[10px] text-amber-700 dark:text-amber-400 font-cinzel tracking-wider">Bhagavad Gita AI</span>
          </div>
        </div>
      </div>

      <!-- Center: Top Navigation Links (Visible on desktop & wide screens) -->
      <nav class="hidden xl:flex items-center gap-1">
        ${navLinks
          .map(link => {
            const isActive = currentRoute === link.id;
            return `
            <button 
              data-nav="${link.id}" 
              class="top-nav-link px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30'
                  : 'text-stone-600 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
              } ${getScriptFontClass(lang)}"
            >
              ${link.label}
            </button>
          `;
          })
          .join('')}
      </nav>

      <!-- Center-Right: Global Search Bar -->
      <div class="flex-1 max-w-xs hidden md:block">
        <button id="global-search-btn" class="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 text-stone-400 text-xs hover:border-amber-500/50 hover:bg-white dark:hover:bg-stone-800 transition shadow-inner">
          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span class="${getScriptFontClass(lang)}">${t.home ? t.home.searchInputPlaceholder : 'Search Gita...'}</span>
          </div>
          <kbd class="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-500">Ctrl K</kbd>
        </button>
      </div>

      <!-- Right: Language Switcher, Theme Toggle & Ask Geetha Quick CTA -->
      <div class="flex items-center gap-2 sm:gap-2.5">
        <!-- Search icon for mobile -->
        <button id="mobile-search-btn" class="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition">
          <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>

        <!-- Language Selector Button (23 Languages) -->
        <button id="lang-toggle-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 bg-stone-50/50 dark:bg-stone-800/50 text-xs font-bold text-stone-700 dark:text-stone-200 transition shadow-sm" title="Select Language / भाषा चुनें / భాషను ఎంచుకోండి">
          <span class="text-amber-600 dark:text-amber-400 text-sm">🌐</span>
          <span class="${getScriptFontClass(lang)} font-semibold">${getLanguage(lang).nativeName}</span>
          <span class="text-[10px] text-stone-400 font-mono font-normal uppercase">(${lang})</span>
        </button>

        <!-- Theme Toggle (Light / Dark) -->
        <button id="theme-toggle-btn" class="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 bg-stone-50/50 dark:bg-stone-800/50 text-stone-600 dark:text-amber-300 hover:text-amber-600 transition shadow-sm" title="Toggle Theme">
          ${
            theme === 'dark'
              ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`
              : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`
          }
        </button>

        <!-- Quick Ask Geetha CTA -->
        <button id="nav-ask-btn" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition hover-lift">
          <span class="animate-flame">🪔</span>
          <span class="${getScriptFontClass(lang)} font-semibold">${t.chat.title}</span>
        </button>
      </div>
    </div>
  `;

  // Attach Event Handlers
  const mobileMenuBtn = navbar.querySelector('#mobile-menu-btn');
  const navBrandLogo = navbar.querySelector('#nav-brand-logo');
  const globalSearchBtn = navbar.querySelector('#global-search-btn');
  const mobileSearchBtn = navbar.querySelector('#mobile-search-btn');
  const langToggleBtn = navbar.querySelector('#lang-toggle-btn');
  const themeToggleBtn = navbar.querySelector('#theme-toggle-btn');
  const navAskBtn = navbar.querySelector('#nav-ask-btn');

  if (mobileMenuBtn) {
    mobileMenuBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onToggleMobileMenu) onToggleMobileMenu();
    };
  }

  if (navBrandLogo) {
    navBrandLogo.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('home');
    };
  }

  const triggerSearch = () => {
    soundSynthesizer.playChime();
    openSpotlightSearchModal({ lang, onNavigate });
  };

  if (globalSearchBtn) globalSearchBtn.onclick = triggerSearch;
  if (mobileSearchBtn) mobileSearchBtn.onclick = triggerSearch;

  if (langToggleBtn) {
    langToggleBtn.onclick = () => {
      soundSynthesizer.playChime();
      languageModal.open({
        currentLang: lang,
        onSelect: (newLang) => {
          if (onToggleLang) onToggleLang(newLang);
        }
      });
    };
  }

  if (themeToggleBtn) {
    themeToggleBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onToggleTheme) onToggleTheme();
    };
  }

  if (navAskBtn) {
    navAskBtn.onclick = () => {
      soundSynthesizer.playZenBell();
      if (onNavigate) onNavigate('askGeetha');
    };
  }

  navbar.querySelectorAll('.top-nav-link').forEach(btn => {
    btn.onclick = () => {
      const target = btn.dataset.nav;
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate(target);
    };
  });

  return navbar;
}
