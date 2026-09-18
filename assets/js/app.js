/**
 * Geetha GPT - Main Application Entry Point & Router Coordinator
 * Full support for all 18 Chapters, 700 Verses, Verse Detail Page,
 * Search, Bookmarks, and Settings.
 * Multilingual: 22 Scheduled Languages of India + English (23 total).
 */

import { storageManager } from './utils/storageUtil.js';
import { soundSynthesizer } from './utils/soundUtil.js';
import { renderNavbar } from './components/Navbar.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderMobileBottomNav, openMobileDrawer } from './components/MobileNav.js';
import { openSpotlightSearchModal } from './components/SearchBarModal.js';
import { getLanguage, isRTL, getScriptFontClass } from './data/languages.js';

// Pages
import { renderHomePage } from './pages/HomePage.js';
import { renderAskGeethaPage } from './pages/AskGeethaPage.js';
import { renderChaptersPage } from './pages/ChaptersPage.js';
import { renderChapterDetailPage } from './pages/ChapterDetailPage.js';
import { renderVerseDetailPage } from './pages/VerseDetailPage.js';
import { renderTopicsPage } from './pages/TopicsPage.js';
import { renderTopicDetailPage } from './pages/TopicDetailPage.js';
import { renderDailyWisdomPage } from './pages/DailyWisdomPage.js';
import { renderSavedVersesPage } from './pages/SavedVersesPage.js';
import { renderHistoryPage } from './pages/HistoryPage.js';
import { renderSettingsPage } from './pages/SettingsPage.js';

class GeethaApp {
  constructor() {
    this.appMount = document.getElementById('app');
    this.currentRoute = 'home';
    this.routeParams = {};
    this.settings = storageManager.getSettings();

    this.init();
  }

  init() {
    // Apply Theme
    this.applyTheme(this.settings.theme);

    // Apply Language (RTL, lang attr, font class)
    this.applyLanguage(this.settings.language || 'en');

    // Apply Sound setting
    soundSynthesizer.setEnabled(this.settings.soundEnabled);

    // Setup Global Keybinds (Ctrl+K / Cmd+K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSpotlightSearchModal({
          lang: this.settings.language,
          onNavigate: (route, params) => this.navigate(route, params)
        });
      }
    });

    // Render Initial Frame
    this.render();
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }

  applyLanguage(lang) {
    // Set HTML lang and dir attributes for accessibility and RTL support
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';

    // Apply script-specific font class to body for proper glyph rendering
    const bodyScriptClasses = [
      'lang-en','lang-hi','lang-te','lang-ta','lang-kn','lang-ml',
      'lang-mr','lang-bn','lang-gu','lang-pa','lang-or','lang-as',
      'lang-ur','lang-sa','lang-ks','lang-kok','lang-mai','lang-mni',
      'lang-ne','lang-brx','lang-sat','lang-sd','lang-doi'
    ];
    document.body.classList.remove(...bodyScriptClasses);
    const fontClass = getScriptFontClass(lang);
    if (fontClass) document.body.classList.add(fontClass);
  }

  navigate(route, params = {}) {
    this.currentRoute = route;
    this.routeParams = params;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  render() {
    this.appMount.innerHTML = '';

    // Main App Shell Layout
    const shell = document.createElement('div');
    shell.className = 'flex-1 flex flex-col lg:flex-row min-h-screen bg-[#FAF7F2] dark:bg-[#121110] transition-colors duration-300';

    // 1. Desktop Sidebar (Fixed Left)
    const sidebar = renderSidebar(this.currentRoute, {
      lang: this.settings.language,
      onNavigate: (route, params) => this.navigate(route, params),
      onToggleLang: (newLang) => {
        const lang = (typeof newLang === 'string' && newLang) ? newLang : 'en';
        this.settings.language = lang;
        storageManager.saveSettings(this.settings);
        this.applyLanguage(lang);
        this.render();
      }
    });
    shell.appendChild(sidebar);

    // 2. Main Content Canvas Area (Shifted right on Desktop)
    const mainCanvas = document.createElement('div');
    mainCanvas.className = 'flex-1 flex flex-col lg:pl-64 min-w-0 pb-16 lg:pb-0';

    // 2a. Top Navbar
    const navbar = renderNavbar({
      lang: this.settings.language,
      theme: this.settings.theme,
      onToggleTheme: () => {
        const nextTheme = this.settings.theme === 'dark' ? 'light' : 'dark';
        this.settings.theme = nextTheme;
        storageManager.saveSettings(this.settings);
        this.applyTheme(nextTheme);
        this.render();
      },
      onToggleLang: (newLang) => {
        // Accept any of the 23 supported languages from LanguageModal
        const lang = (typeof newLang === 'string' && newLang) ? newLang : 'en';
        this.settings.language = lang;
        storageManager.saveSettings(this.settings);
        this.applyLanguage(lang);
        this.render();
      },
      onToggleMobileMenu: () => {
        openMobileDrawer(this.currentRoute, {
          lang: this.settings.language,
          onNavigate: (route, params) => this.navigate(route, params)
        });
      },
      onNavigate: (route, params) => this.navigate(route, params)
    });
    mainCanvas.appendChild(navbar);

    // 2b. Page Router Body Mount
    const pageBody = document.createElement('main');
    pageBody.className = 'flex-1 p-4 sm:p-6 lg:p-8 flex flex-col';

    const pageProps = {
      lang: this.settings.language,
      theme: this.settings.theme,
      sanskritDisplay: this.settings.sanskritDisplay,
      fontSize: this.settings.fontSize,
      soundEnabled: this.settings.soundEnabled,
      notificationsEnabled: this.settings.notificationsEnabled,
      onNavigate: (route, params) => this.navigate(route, params),
      onUpdateSettings: (newSettings) => {
        this.settings = newSettings;
        this.applyTheme(newSettings.theme);
        this.render();
      },
      ...this.routeParams
    };

    let pageComponent = null;

    switch (this.currentRoute) {
      case 'home':
        pageComponent = renderHomePage(pageProps);
        break;
      case 'askGeetha':
        pageComponent = renderAskGeethaPage({
          ...pageProps,
          initialQuery: this.routeParams.query || '',
          historyId: this.routeParams.historyId || null
        });
        break;
      case 'chapters':
        pageComponent = renderChaptersPage(pageProps);
        break;
      case 'chapterDetail':
        pageComponent = renderChapterDetailPage({
          ...pageProps,
          chapterNumber: this.routeParams.chapterNumber || 2,
          highlightVerseId: this.routeParams.highlightVerseId || null
        });
        break;
      case 'verseDetail':
        pageComponent = renderVerseDetailPage({
          ...pageProps,
          chapterNumber: this.routeParams.chapterNumber || 2,
          verseNumber: this.routeParams.verseNumber || 47,
          verseId: this.routeParams.verseId || null
        });
        break;
      case 'topics':
        pageComponent = renderTopicsPage(pageProps);
        break;
      case 'topicDetail':
        pageComponent = renderTopicDetailPage({
          ...pageProps,
          topicId: this.routeParams.topicId || 'stress'
        });
        break;
      case 'dailyWisdom':
        pageComponent = renderDailyWisdomPage(pageProps);
        break;
      case 'saved':
        pageComponent = renderSavedVersesPage(pageProps);
        break;
      case 'history':
        pageComponent = renderHistoryPage(pageProps);
        break;
      case 'settings':
        pageComponent = renderSettingsPage(pageProps);
        break;
      default:
        pageComponent = renderHomePage(pageProps);
    }

    pageBody.appendChild(pageComponent);
    mainCanvas.appendChild(pageBody);
    shell.appendChild(mainCanvas);

    // 3. Mobile Bottom Sticky Navigation Bar
    const mobileBottomNav = renderMobileBottomNav(this.currentRoute, {
      lang: this.settings.language,
      onNavigate: (route, params) => this.navigate(route, params)
    });
    shell.appendChild(mobileBottomNav);

    this.appMount.appendChild(shell);

    // Refresh Lucide icon renderings across dynamic nodes
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons();
      } catch (e) {
        console.warn('Lucide icon render:', e);
      }
    }
  }
}

// Instantiate and mount app on DOM ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GeethaApp();
  });
} else {
  new GeethaApp();
}
