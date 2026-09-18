/**
 * Geetha GPT - Reusable Verse Card Component
 * Enhanced with 1-click exploration to full VerseDetailPage,
 * speech synthesis, bookmarks persistence, and modal sharing.
 */

import { storageManager } from '../utils/storageUtil.js';
import { speechEngine } from '../utils/speechUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from './Toast.js';
import { openShareModal } from './ShareModal.js';
import { getLanguage, getScriptFontClass } from '../data/languages.js';

export function renderVerseCard(verse, options = {}) {
  const {
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    showExplanation = true,
    showPractical = true,
    onSaveChange = null,
    onExploreVerse = null
  } = options;

  const isSaved = storageManager.isVerseSaved(verse.id);

  // Script representation
  let scriptContent = verse.sanskrit;
  if (sanskritDisplay === 'translit') {
    scriptContent = verse.transliteration || verse.iast;
  } else if (sanskritDisplay === 'telugu') {
    scriptContent = verse.teluguSanskrit || verse.sanskrit;
  }

  // Multilingual translation resolution
  const currentLangObj = getLanguage(lang);
  let translationText = '';
  let isFallback = false;

  if (lang === 'en') {
    translationText = verse.englishTranslation || verse.translation || '';
  } else if (lang === 'te') {
    translationText = (verse.translations && verse.translations.te) || verse.teluguMeaning || verse.teluguTranslation || verse.englishTranslation;
  } else if (lang === 'hi') {
    translationText = (verse.translations && verse.translations.hi) || verse.hindiMeaning || verse.englishTranslation;
  } else if (lang === 'gu' && verse.translations && verse.translations.gu) {
    translationText = verse.translations.gu;
  } else if (lang === 'sa') {
    translationText = (verse.translations && verse.translations.sa) || verse.sanskrit;
  } else if (verse.translations && verse.translations[lang]) {
    translationText = verse.translations[lang];
  } else {
    translationText = verse.englishTranslation || verse.translation || '';
    isFallback = true;
  }

  const hasTeluguMeaning = Boolean(verse.teluguMeaning || verse.teluguTranslation || (verse.translations && verse.translations.te));
  const altTranslationText = lang === 'te' 
    ? (verse.englishTranslation || verse.translation || '') 
    : ((verse.translations && verse.translations.te) || verse.teluguMeaning || verse.teluguTranslation || '');

  const explanationText = lang === 'te' ? (verse.teluguExplanation || verse.englishExplanation) : (lang === 'hi' && verse.hindiMeaning ? verse.hindiMeaning : verse.englishExplanation);
  const practicalText = lang === 'te' ? (verse.practicalApplicationTelugu || verse.practicalApplication) : verse.practicalApplication;
  const hasMultipleLangs = true;

  const card = document.createElement('div');
  card.className = 'group relative bg-white dark:bg-[#1A1816] rounded-2xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 overflow-hidden';
  card.dataset.verseId = verse.id;

  let isExplanationOpen = showExplanation;

  card.innerHTML = `
    <!-- Top Bar with Chapter Info and Actions -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800/80 pb-3">
      <button class="verse-header-title-btn flex items-center gap-2 hover:opacity-80 transition text-left">
        <span class="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 font-cinzel font-bold text-xs tracking-wide group-hover:bg-amber-500/20">
          Bhagavad Gita ${verse.chapter}.${verse.verse} ↗
        </span>
        <span class="text-xs text-stone-500 dark:text-stone-400 font-medium">
          ${lang === 'te' ? `అధ్యాయం ${verse.chapter}, శ్లోకం ${verse.verse}` : `Chapter ${verse.chapter}, Verse ${verse.verse}`}
        </span>
      </button>

      <!-- Action Buttons: Save, Explain, Share, Audio, Open Full -->
      <div class="flex items-center gap-1.5 sm:gap-2">
        <!-- Audio Play Button -->
        <button class="verse-audio-btn p-2 rounded-xl text-stone-500 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400 hover:bg-amber-500/10 transition" title="Listen to Recitation">
          <svg class="w-4 h-4 play-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
          <span class="speaking-indicator hidden flex items-center gap-0.5">
            <span class="w-1 h-3 bg-amber-600 animate-pulse"></span>
            <span class="w-1 h-4 bg-amber-600 animate-pulse delay-75"></span>
            <span class="w-1 h-2 bg-amber-600 animate-pulse delay-150"></span>
          </span>
        </button>

        <!-- Telugu/English Translate Toggle Button -->
        ${hasTeluguMeaning ? `
        <button class="verse-translate-btn flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-900/30 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-600 transition" title="Translate to Telugu">
          <span>🌐</span>
          <span class="translate-btn-label">${lang === 'te' ? 'English' : 'తెలుగు'}</span>
        </button>` : ''}

        <!-- Explain Toggle Button -->
        <button class="verse-explain-btn flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition" title="View Explanation">
          <span>✨</span>
          <span>${lang === 'te' ? 'వివరణ' : 'Explain'}</span>
        </button>

        <!-- Share Card Button -->
        <button class="verse-share-btn flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition" title="Share Card">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          <span>${lang === 'te' ? 'షేర్' : 'Share'}</span>
        </button>

        <!-- Bookmark / Save Button -->
        <button class="verse-save-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
          isSaved
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
            : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-500/40 hover:text-amber-600'
        }">
          <svg class="w-3.5 h-3.5 ${isSaved ? 'fill-current' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
          <span>${isSaved ? (lang === 'te' ? 'భద్రపరిచారు' : 'Saved') : (lang === 'te' ? 'భద్రపరుచు' : 'Save')}</span>
        </button>
      </div>
    </div>

    <!-- Sacred Sanskrit Shloka Box (Clickable to view full details) -->
    <div class="verse-body-clickable p-4 rounded-xl bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border border-amber-500/15 cursor-pointer hover:border-amber-500/30 transition">
      <p class="font-sanskrit text-base md:text-lg text-stone-900 dark:text-amber-100 font-semibold leading-relaxed whitespace-pre-line text-center">
        ${scriptContent}
      </p>
      ${
        sanskritDisplay === 'devanagari' && verse.transliteration
          ? `<p class="mt-2.5 text-xs text-stone-500 dark:text-stone-400 italic text-center font-sans">
              ${verse.transliteration}
            </p>`
          : ''
      }
    </div>

    <!-- Translation -->
    <div class="verse-translation-section flex flex-col gap-1.5">
      <div class="flex items-center justify-between">
        <span class="verse-translation-label text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 font-cinzel">
          ${lang === 'te' ? 'తాత్పర్యం' : (lang === 'hi' ? 'अनुवाद' : 'Translation')}
        </span>
        <span class="verse-lang-badge px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          isFallback 
            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300' 
            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
        }">
          ${isFallback ? 'English (Fallback)' : `${currentLangObj.nativeName} (${lang.toUpperCase()})`}
        </span>
      </div>

      ${isFallback ? `
      <div class="px-2.5 py-1 rounded-lg bg-amber-500/[0.08] border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
        <span>ℹ️</span>
        <span>Verified translation in <strong>${currentLangObj.nativeName}</strong> is pending canonical curation. Displaying English translation.</span>
      </div>` : ''}

      <p class="verse-translation-text text-stone-700 dark:text-stone-200 text-sm md:text-base leading-relaxed ${getScriptFontClass(lang)}">
        ${translationText}
      </p>
      ${hasTeluguMeaning ? `
      <p class="verse-translation-alt hidden text-stone-700 dark:text-stone-200 text-sm md:text-base leading-relaxed ${lang === 'te' ? '' : 'font-telugu'}">
        ${altTranslationText}
      </p>` : ''}
    </div>

    <!-- Explanation (Meaning) Box -->
    <div class="verse-explanation-box flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300 bg-stone-50/70 dark:bg-stone-900/40 p-3.5 rounded-xl border border-stone-100 dark:border-stone-800/80 ${isExplanationOpen ? '' : 'hidden'}">
      <span class="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
        <span>✨</span> ${lang === 'te' ? 'గీతా వివరణ' : 'Meaning & Commentary'}
      </span>
      <p class="leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
        ${explanationText}
      </p>
    </div>

    <!-- Practical Life Application -->
    ${
      showPractical && practicalText
        ? `
        <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 text-xs md:text-sm text-stone-700 dark:text-stone-200">
          <span class="text-base flex-shrink-0">🌱</span>
          <div class="flex flex-col gap-0.5">
            <span class="font-bold text-amber-800 dark:text-amber-300">
              ${lang === 'te' ? 'ఆచరణాత్మక జీవన సూత్రం' : 'Practical Life Application'}
            </span>
            <p class="leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
              ${practicalText}
            </p>
          </div>
        </div>
        `
        : ''
    }

    <!-- Bottom Action & Topics -->
    <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/60">
      <!-- Topic Pills -->
      <div class="flex flex-wrap items-center gap-1.5">
        ${
          verse.topics && verse.topics.length
            ? verse.topics
                .slice(0, 3)
                .map(
                  t => `<span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">#${t}</span>`
                )
                .join('')
            : ''
        }
      </div>

      <!-- View Full Verse Page Link Button -->
      <button class="verse-view-detail-btn text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-cinzel">
        <span>${lang === 'te' ? 'పూర్తి శ్లోక పేజీ' : 'View Full Details'}</span>
        <span>→</span>
      </button>
    </div>
  `;

  // Attach Event Handlers
  const audioBtn = card.querySelector('.verse-audio-btn');
  const translateBtn = card.querySelector('.verse-translate-btn');
  const explainBtn = card.querySelector('.verse-explain-btn');
  const shareBtn = card.querySelector('.verse-share-btn');
  const saveBtn = card.querySelector('.verse-save-btn');
  const explanationBox = card.querySelector('.verse-explanation-box');
  const titleBtn = card.querySelector('.verse-header-title-btn');
  const bodyClickable = card.querySelector('.verse-body-clickable');
  const viewDetailBtn = card.querySelector('.verse-view-detail-btn');

  const triggerExplore = () => {
    soundSynthesizer.playChime();
    storageManager.markVerseViewed(verse.id);
    if (onExploreVerse) {
      onExploreVerse(verse.id);
    }
  };

  if (titleBtn) titleBtn.onclick = triggerExplore;
  if (bodyClickable) bodyClickable.onclick = triggerExplore;
  if (viewDetailBtn) viewDetailBtn.onclick = triggerExplore;

  // Translation Toggle (English <-> Telugu)
  if (translateBtn) {
    let showingAlt = false;
    translateBtn.onclick = (e) => {
      e.stopPropagation();
      soundSynthesizer.playChime();
      showingAlt = !showingAlt;
      const mainText = card.querySelector('.verse-translation-text');
      const altText = card.querySelector('.verse-translation-alt');
      const langBadge = card.querySelector('.verse-lang-badge');
      const btnLabel = translateBtn.querySelector('.translate-btn-label');
      if (mainText && altText) {
        mainText.classList.toggle('hidden', showingAlt);
        altText.classList.toggle('hidden', !showingAlt);
      }
      if (langBadge) {
        if (showingAlt) {
          langBadge.textContent = lang === 'te' ? 'English' : 'తెలుగు';
        } else {
          langBadge.textContent = lang === 'te' ? 'తెలుగు' : 'English';
        }
      }
      if (btnLabel) {
        if (showingAlt) {
          btnLabel.textContent = lang === 'te' ? 'తెలుగు' : 'English';
        } else {
          btnLabel.textContent = lang === 'te' ? 'English' : 'తెలుగు';
        }
      }
    };
  }

  // Audio Playback
  if (audioBtn) {
    audioBtn.onclick = (e) => {
      e.stopPropagation();
      const isCurrentlySpeaking = speechEngine.isSpeaking;
      if (isCurrentlySpeaking) {
        speechEngine.stop();
        audioBtn.querySelector('.play-icon').classList.remove('hidden');
        audioBtn.querySelector('.speaking-indicator').classList.add('hidden');
      } else {
        soundSynthesizer.playZenBell();
        audioBtn.querySelector('.play-icon').classList.add('hidden');
        audioBtn.querySelector('.speaking-indicator').classList.remove('hidden');

        const recitationText = lang === 'te' 
          ? `${verse.sanskrit}. తాత్పర్యం: ${verse.teluguTranslation || verse.englishTranslation}`
          : `${verse.sanskrit}. Translation: ${verse.englishTranslation}`;

        speechEngine.speak(recitationText, lang === 'te' ? 'te' : 'sa', () => {
          audioBtn.querySelector('.play-icon').classList.remove('hidden');
          audioBtn.querySelector('.speaking-indicator').classList.add('hidden');
        });
      }
    };
  }

  // Explain toggle
  if (explainBtn) {
    explainBtn.onclick = (e) => {
      e.stopPropagation();
      isExplanationOpen = !isExplanationOpen;
      explanationBox.classList.toggle('hidden', !isExplanationOpen);
      soundSynthesizer.playChime();
    };
  }

  // Share Card Modal
  if (shareBtn) {
    shareBtn.onclick = (e) => {
      e.stopPropagation();
      soundSynthesizer.playChime();
      openShareModal(verse, lang, theme);
    };
  }

  // Save / Bookmark Toggle
  if (saveBtn) {
    saveBtn.onclick = (e) => {
      e.stopPropagation();
      const nowSaved = !storageManager.isVerseSaved(verse.id);
      if (nowSaved) {
        storageManager.saveVerse(verse.id);
        soundSynthesizer.playChime();
        if (window.confetti) {
          window.confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#D97706', '#F59E0B', '#FCD34D']
          });
        }
        toastManager.show(lang === 'te' ? "బుక్‌మార్క్‌లలో భద్రపరచబడింది!" : "Verse saved to your bookmarks!", "success");
      } else {
        storageManager.removeVerse(verse.id);
        toastManager.show(lang === 'te' ? "బుక్‌మార్క్‌ల నుండి తొలగించబడింది" : "Verse removed from bookmarks", "info");
      }

      saveBtn.className = `verse-save-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
        nowSaved
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-500/40 hover:text-amber-600'
      }`;
      saveBtn.querySelector('svg').className = `w-3.5 h-3.5 ${nowSaved ? 'fill-current' : 'fill-none'}`;
      saveBtn.querySelector('span').textContent = nowSaved ? (lang === 'te' ? 'భద్రపరిచారు' : 'Saved') : (lang === 'te' ? 'భద్రపరుచు' : 'Save');

      if (onSaveChange) onSaveChange(verse.id, nowSaved);
    };
  }

  return card;
}
