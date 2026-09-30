/**
 * Geetha GPT - Top Navbar Component
 */

import { I18N, t } from '../data/i18n.js';
import { getLanguage, getScriptFontClass } from '../data/languages.js';
import { languageModal } from './LanguageModal.js';
import { openSpotlightSearchModal } from './SearchBarModal.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { voiceAssistantModal } from './VoiceAssistantModal.js';

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

  const dict = I18N[lang] || I18N.en;
  const navText = dict.nav || {};

  const navbar = document.createElement('header');
  navbar.className = 'sticky top-0 z-20 w-full bg-white/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors duration-300';

  const searchPlaceholder = t('home.searchInputPlaceholder', lang) || 'Ask Geetha GPT…';

  navbar.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
      <!-- Left: Mobile Hamburger, Mobile Brand (lg:hidden), and Search Field -->
      <div class="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
        <!-- Mobile Drawer Hamburger Menu Button -->
        <button id="mobile-menu-btn" class="lg:hidden p-2 -ml-1 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex-shrink-0" aria-label="Open Navigation Menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>

        <!-- Mobile Brand Logo (Visible only on mobile/tablet screens when desktop sidebar is hidden) -->
        <div class="flex items-center gap-2 cursor-pointer lg:hidden flex-shrink-0" id="nav-mobile-logo" title="Geetha GPT">
          <div class="relative w-8 h-8 rounded-xl overflow-hidden shadow-md border border-amber-500/40 flex-shrink-0 bg-stone-900">
            <img src="./assets/images/krishna_arjuna_logo.jpg" alt="Gitopadesh" class="w-full h-full object-cover" />
          </div>
          <span class="font-cinzel font-bold text-sm text-stone-900 dark:text-stone-100 tracking-tight">Geetha GPT</span>
        </div>

        <!-- Global Search / Ask Geetha Search Field -->
        <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden sm:block">
          <button id="global-search-btn" class="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-stone-100/80 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 text-stone-400 text-xs sm:text-sm hover:border-amber-500/50 hover:bg-white dark:hover:bg-stone-800 transition shadow-sm group" aria-label="Search all Gita verses">
            <div class="flex items-center gap-2 min-w-0">
              <svg class="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span class="${getScriptFontClass(lang)} truncate text-left font-medium text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">${searchPlaceholder}</span>
            </div>
            <kbd class="px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-500 flex-shrink-0 shadow-xs">Ctrl K</kbd>
          </button>
        </div>
      </div>

      <!-- Right: Utilities & Action Buttons Only (No Duplicate Nav Links) -->
      <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <!-- Search icon for small mobile screens (< sm) -->
        <button id="mobile-search-btn" class="sm:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition" aria-label="Search Gita">
          <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>

        <!-- Language Selector Button (23 Languages) -->
        <button id="lang-toggle-btn" class="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 bg-stone-50/70 dark:bg-stone-800/60 text-xs font-bold text-stone-700 dark:text-stone-200 transition shadow-sm hover:shadow" title="Select Language / भाषा चुनें / భాషను ఎంచుకోండి">
          <span class="text-amber-600 dark:text-amber-400 text-sm">🌐</span>
          <span class="${getScriptFontClass(lang)} font-semibold text-xs sm:text-sm">${getLanguage(lang).nativeName}</span>
          <span class="hidden xl:inline text-[10px] text-stone-400 font-mono font-normal uppercase">(${lang})</span>
        </button>

        <!-- Theme Toggle (Light / Dark) -->
        <button id="theme-toggle-btn" class="p-2 sm:p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 bg-stone-50/70 dark:bg-stone-800/60 text-stone-600 dark:text-amber-300 hover:text-amber-600 transition shadow-sm" title="Toggle Theme" aria-label="Toggle visual theme">
          ${
            theme === 'dark'
              ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`
              : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`
          }
        </button>

        <!-- Settings Quick Button -->
        <button id="nav-settings-btn" class="p-2 sm:p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 bg-stone-50/70 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 hover:text-amber-600 transition shadow-sm" title="${navText.settings || 'Settings'}" aria-label="Open Settings">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>

        <!-- Multi-Language Voice Assistant Trigger Button -->
        <button id="nav-voice-btn" class="flex items-center gap-1.5 p-2 xl:px-2.5 xl:py-2 rounded-xl border border-amber-500/30 hover:border-amber-500 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 text-xs font-bold transition shadow-sm" title="Multi-Language Voice Assistant">
          <span class="animate-pulse">🎙️</span>
          <span class="hidden 2xl:inline font-cinzel">Voice AI</span>
        </button>
      </div>
    </div>
  `;

  // Attach Event Handlers
  const mobileMenuBtn = navbar.querySelector('#mobile-menu-btn');
  const navMobileLogo = navbar.querySelector('#nav-mobile-logo');
  const globalSearchBtn = navbar.querySelector('#global-search-btn');
  const mobileSearchBtn = navbar.querySelector('#mobile-search-btn');
  const langToggleBtn = navbar.querySelector('#lang-toggle-btn');
  const themeToggleBtn = navbar.querySelector('#theme-toggle-btn');
  const navSettingsBtn = navbar.querySelector('#nav-settings-btn');
  const navVoiceBtn = navbar.querySelector('#nav-voice-btn');

  if (mobileMenuBtn) {
    mobileMenuBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onToggleMobileMenu) onToggleMobileMenu();
    };
  }

  if (navMobileLogo) {
    navMobileLogo.onclick = () => {
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

  if (navSettingsBtn) {
    navSettingsBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('settings');
    };
  }

  if (navVoiceBtn) {
    navVoiceBtn.onclick = () => {
      soundSynthesizer.playChime();
      voiceAssistantModal.open({
        lang,
        onNavigate: (route, params) => {
          if (onNavigate) onNavigate(route, params);
        }
      });
    };
  }

  return navbar;
}
