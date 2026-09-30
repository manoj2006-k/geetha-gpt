/**
 * Geetha GPT - Settings Page Component
 */

import { I18N } from '../data/i18n.js';
import { storageManager } from '../utils/storageUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from '../components/Toast.js';
import { languageModal } from '../components/LanguageModal.js';
import { LANGUAGES, getLanguage } from '../data/languages.js';

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
    const currentLangObj = getLanguage(currentSettings.language) || { name: 'English', nativeName: 'English', flag: '🇮🇳' };

    const quickLanguages = [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
      { code: 'te', name: 'Telugu', native: 'తెలుగు' },
      { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
      { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
      { code: 'bn', name: 'Bengali', native: 'বাংলা' },
      { code: 'mr', name: 'Marathi', native: 'मराठी' },
      { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
      { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', native: 'മലയാളം' }
    ];

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

        <!-- 1. Language Setting (22 Scheduled Languages + English) -->
        <div class="p-6 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h3 class="font-bold text-stone-900 dark:text-stone-100 text-base font-cinzel">
                ${t.settings.languageTitle}
              </h3>
              <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 ${lang === 'te' ? 'font-telugu' : ''}">
                ${t.settings.languageSubtitle}
              </p>
            </div>

            <button id="open-all-languages-btn" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition hover-lift self-start sm:self-auto">
              <span>🌐</span>
              <span>All 22 Indian Languages + EN (${LANGUAGES.length})</span>
            </button>
          </div>

          <!-- Active Language Badge -->
          <div class="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 w-max">
            <span class="text-lg">${currentLangObj.flag || '🇮🇳'}</span>
            <div class="flex flex-col">
              <span class="text-xs font-bold text-amber-900 dark:text-amber-200 font-cinzel">${currentLangObj.name} (${currentLangObj.nativeName})</span>
              <span class="text-[10px] text-stone-500 dark:text-stone-400">${t.settings.currentLanguage}: ${currentSettings.language.toUpperCase()}</span>
            </div>
          </div>

          <!-- Quick Access Popular Language Pills -->
          <div class="flex flex-col gap-1.5 mt-1">
            <span class="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Quick Switch:</span>
            <div class="flex flex-wrap gap-2">
              ${quickLanguages
                .map(
                  ql => `
                <button class="quick-lang-btn px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  currentSettings.language === ql.code
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-500'
                }" data-lang="${ql.code}">
                  ${ql.native} (${ql.name})
                </button>
              `
                )
                .join('')}
            </div>
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

        <!-- 4. Font Size Typography Scaling -->
        <div class="p-6 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="font-bold text-stone-900 dark:text-stone-100 text-base font-cinzel">
              ${lang === 'te' ? 'అక్షరాల పరిమాణం' : 'Reading Font Size'}
            </h3>
            <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 ${lang === 'te' ? 'font-telugu' : ''}">
              ${lang === 'te' ? 'సౌకర్యవంతమైన పఠనం కోసం ఫాంట్ పరిమాణాన్ని సర్దుబాటు చేయండి' : 'Adjust text scaling for comfortable reading'}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button class="font-size-opt-btn px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              currentSettings.fontSize === 'small'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }" data-size="small">
              ${lang === 'te' ? 'చిన్నది (A-)' : 'Small (A-)'}
            </button>
            <button class="font-size-opt-btn px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              currentSettings.fontSize === 'medium' || !currentSettings.fontSize
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }" data-size="medium">
              ${lang === 'te' ? 'సాధారణం (A)' : 'Medium (A)'}
            </button>
            <button class="font-size-opt-btn px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              currentSettings.fontSize === 'large'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }" data-size="large">
              ${lang === 'te' ? 'పెద్దది (A+)' : 'Large (A+)'}
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
              ${t.settings.resetDescription || 'Clear saved bookmarks and conversation history for the current profile from this browser.'}
            </p>
          </div>

          <button id="reset-data-btn" class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition self-start sm:self-auto">
            ${t.settings.clearDataBtn}
          </button>
        </div>
      </div>
    `;

    // Event Handlers

    const allLangsBtn = page.querySelector('#open-all-languages-btn');
    if (allLangsBtn) {
      allLangsBtn.onclick = () => {
        soundSynthesizer.playChime();
        languageModal.open({
          currentLang: currentSettings.language,
          onSelect: (newLang) => {
            currentSettings.language = newLang;
            storageManager.saveSettings(currentSettings);
            soundSynthesizer.playChime();
            if (onUpdateSettings) onUpdateSettings(currentSettings);
            renderView();
          }
        });
      };
    }

    page.querySelectorAll('.quick-lang-btn').forEach(btn => {
      btn.onclick = () => {
        const newLang = btn.dataset.lang;
        currentSettings.language = newLang;
        storageManager.saveSettings(currentSettings);
        soundSynthesizer.playChime();
        if (onUpdateSettings) onUpdateSettings(currentSettings);
        renderView();
      };
    });

    page.querySelectorAll('.theme-opt-btn').forEach(btn => {
      btn.onclick = () => {
        const newTheme = btn.dataset.theme;
        currentSettings.theme = newTheme;
        storageManager.saveSettings(currentSettings);
        soundSynthesizer.playChime();
        if (onUpdateSettings) onUpdateSettings(currentSettings);
        renderView();
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

    page.querySelectorAll('.font-size-opt-btn').forEach(btn => {
      btn.onclick = () => {
        const newSize = btn.dataset.size;
        currentSettings.fontSize = newSize;
        storageManager.saveSettings(currentSettings);
        soundSynthesizer.playChime();
        if (onUpdateSettings) onUpdateSettings(currentSettings);
        renderView();
      };
    });

    const soundInput = page.querySelector('#sound-toggle-input');
    if (soundInput) {
      soundInput.onchange = () => {
        currentSettings.soundEnabled = soundInput.checked;
        soundSynthesizer.setEnabled(soundInput.checked);
        storageManager.saveSettings(currentSettings);
        if (soundInput.checked) soundSynthesizer.playZenBell();
        if (onUpdateSettings) onUpdateSettings(currentSettings);
      };
    }

    const notifInput = page.querySelector('#notif-toggle-input');
    if (notifInput) {
      notifInput.onchange = () => {
        currentSettings.notificationsEnabled = notifInput.checked;
        storageManager.saveSettings(currentSettings);
        soundSynthesizer.playChime();
        toastManager.show(currentSettings.notificationsEnabled ? "Daily reminders activated!" : "Daily reminders muted", "info");
        if (onUpdateSettings) onUpdateSettings(currentSettings);
      };
    }

    const resetBtn = page.querySelector('#reset-data-btn');
    if (resetBtn) {
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
  }

  renderView();
  return page;
}

