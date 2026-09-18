/**
 * Geetha GPT - Settings Page Component
 */

import { I18N } from '../data/i18n.js';
import { storageManager } from '../utils/storageUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from '../components/Toast.js';

export function renderSettingsPage(options = {}) {
  const {
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    fontSize = 'medium',
    soundEnabled = true,
    notificationsEnabled = true,
    onUpdateSettings = null,
    onNavigate = null
  } = options;

  const t = I18N[lang] || I18N.en;
  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-8 pb-16 page-fade-in max-w-4xl mx-auto px-4 sm:px-6';

  let currentSettings = storageManager.getSettings();

  function renderView() {
    page.innerHTML = `
      <!-- Header -->
      <div class="flex flex-col gap-2 mt-2">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-semibold w-max">
          <span>⚙️</span>
          <span class="${lang === 'te' ? 'font-telugu' : 'font-cinzel'}">${lang === 'te' ? 'ప్రాధాన్యతలు' : 'Preferences'}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 font-cinzel">
          ${t.settings.title}
        </h1>
        <p class="text-stone-600 dark:text-stone-300 text-sm sm:text-base ${lang === 'te' ? 'font-telugu' : ''}">
          ${t.settings.subtitle}
        </p>
      </div>

      <!-- Settings Form Groups -->
      <div class="flex flex-col gap-6">
        <!-- 1. Language Setting -->
        <div class="p-6 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="font-bold text-stone-900 dark:text-stone-100 text-base font-cinzel">
              ${t.settings.languageTitle}
            </h3>
            <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 ${lang === 'te' ? 'font-telugu' : ''}">
              ${t.settings.languageSubtitle}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button class="lang-opt-btn px-4 py-2 rounded-xl text-xs font-bold transition ${
              currentSettings.language === 'en'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }" data-lang="en">
              English
            </button>
            <button class="lang-opt-btn px-4 py-2 rounded-xl text-xs font-bold transition font-telugu ${
              currentSettings.language === 'te'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }" data-lang="te">
              తెలుగు
            </button>
          </div>
        </div>

        <!-- 2. Visual Theme -->
        <div class="p-6 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="font-bold text-stone-900 dark:text-stone-100 text-base font-cinzel">
              ${t.settings.themeTitle}
            </h3>
            <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 ${lang === 'te' ? 'font-telugu' : ''}">
              ${t.settings.themeSubtitle}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button class="theme-opt-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              currentSettings.theme === 'light'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }" data-theme="light">
              <span>☀️</span>
              <span>${t.settings.themeLight}</span>
            </button>
            <button class="theme-opt-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              currentSettings.theme === 'dark'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }" data-theme="dark">
              <span>🌙</span>
              <span>${t.settings.themeDark}</span>
            </button>
          </div>
        </div>

        <!-- 3. Sanskrit Script Display -->
        <div class="p-6 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="font-bold text-stone-900 dark:text-stone-100 text-base font-cinzel">
              ${t.settings.sanskritDisplayTitle}
            </h3>
            <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 ${lang === 'te' ? 'font-telugu' : ''}">
              ${t.settings.sanskritDisplaySubtitle}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button class="script-opt-btn px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              currentSettings.sanskritDisplay === 'devanagari'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }" data-script="devanagari">
              ${t.settings.sanskritDevanagari}
            </button>
            <button class="script-opt-btn px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              currentSettings.sanskritDisplay === 'translit'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }" data-script="translit">
              ${t.settings.sanskritTranslit}
            </button>
            <button class="script-opt-btn px-3.5 py-2 rounded-xl text-xs font-bold transition font-telugu ${
              currentSettings.sanskritDisplay === 'telugu'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }" data-script="telugu">
              ${t.settings.sanskritTelugu}
            </button>
          </div>
        </div>

        <!-- 4. Audio Effects Toggle -->
        <div class="p-6 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="font-bold text-stone-900 dark:text-stone-100 text-base font-cinzel">
              ${t.settings.audioTitle}
            </h3>
            <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 ${lang === 'te' ? 'font-telugu' : ''}">
              ${t.settings.soundEffectsLabel}
            </p>
          </div>

          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="sound-toggle-input" class="sr-only peer" ${currentSettings.soundEnabled ? 'checked' : ''}>
            <div class="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-amber-600"></div>
          </label>
        </div>

        <!-- 5. Notifications Toggle -->
        <div class="p-6 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="font-bold text-stone-900 dark:text-stone-100 text-base font-cinzel">
              ${t.settings.notificationsTitle}
            </h3>
            <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 ${lang === 'te' ? 'font-telugu' : ''}">
              ${t.settings.notificationsLabel}
            </p>
          </div>

          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="notif-toggle-input" class="sr-only peer" ${currentSettings.notificationsEnabled ? 'checked' : ''}>
            <div class="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-amber-600"></div>
          </label>
        </div>

        <!-- 6. Data Reset Box -->
        <div class="p-6 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="font-bold text-rose-900 dark:text-rose-300 text-base font-cinzel">
              ${t.settings.dataManagementTitle}
            </h3>
            <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Clear saved bookmarks and conversation history from this browser.
            </p>
          </div>

          <button id="reset-data-btn" class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition self-start sm:self-auto">
            ${t.settings.clearDataBtn}
          </button>
        </div>
      </div>
    `;

    // Event Handlers
    page.querySelectorAll('.lang-opt-btn').forEach(btn => {
      btn.onclick = () => {
        const newLang = btn.dataset.lang;
        currentSettings.language = newLang;
        storageManager.saveSettings(currentSettings);
        soundSynthesizer.playChime();
        if (onUpdateSettings) onUpdateSettings(currentSettings);
      };
    });

    page.querySelectorAll('.theme-opt-btn').forEach(btn => {
      btn.onclick = () => {
        const newTheme = btn.dataset.theme;
        currentSettings.theme = newTheme;
        storageManager.saveSettings(currentSettings);
        soundSynthesizer.playChime();
        if (onUpdateSettings) onUpdateSettings(currentSettings);
      };
    });

    page.querySelectorAll('.script-opt-btn').forEach(btn => {
      btn.onclick = () => {
        const newScript = btn.dataset.script;
        currentSettings.sanskritDisplay = newScript;
        storageManager.saveSettings(currentSettings);
        soundSynthesizer.playChime();
        if (onUpdateSettings) onUpdateSettings(currentSettings);
        renderView();
      };
    });

    const soundInput = page.querySelector('#sound-toggle-input');
    soundInput.onchange = () => {
      currentSettings.soundEnabled = soundInput.checked;
      soundSynthesizer.setEnabled(soundInput.checked);
      storageManager.saveSettings(currentSettings);
      if (soundInput.checked) soundSynthesizer.playZenBell();
      if (onUpdateSettings) onUpdateSettings(currentSettings);
    };

    const notifInput = page.querySelector('#notif-toggle-input');
    notifInput.onchange = () => {
      currentSettings.notificationsEnabled = notifInput.checked;
      storageManager.saveSettings(currentSettings);
      soundSynthesizer.playChime();
      toastManager.show(currentSettings.notificationsEnabled ? "Daily reminders activated!" : "Daily reminders muted", "info");
      if (onUpdateSettings) onUpdateSettings(currentSettings);
    };

    const resetBtn = page.querySelector('#reset-data-btn');
    resetBtn.onclick = () => {
      if (confirm(lang === 'te' ? "మీ లోకల్ డేటా (బుక్‌మార్క్‌లు & చరిత్ర) అంతా తొలగించాలా?" : "Are you sure you want to reset all local bookmarks and conversation history?")) {
        storageManager.resetAllData();
        soundSynthesizer.playZenBell();
        toastManager.show(t.settings.resetSuccess, "success");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    };
  }

  renderView();
  return page;
}

