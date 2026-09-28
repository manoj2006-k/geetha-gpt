/**
 * Geetha GPT - Reusable Verse Card Component
 * Enhanced with 1-click exploration to full VerseDetailPage,
 * speech synthesis, bookmarks persistence, and modal sharing.
 */

import { storageManager } from '../utils/storageUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from './Toast.js';
import { openShareModal } from './ShareModal.js';
import { renderVoiceButton } from './VoiceButton.js';
import { getLanguage, getScriptFontClass } from '../data/languages.js';
import { I18N, t } from '../data/i18n.js';

export function renderVerseCard(verse, options = {}) {
  const {
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    showTranslation = false,
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

  if (verse.translations && verse.translations[lang]) {
    translationText = verse.translations[lang];
  } else if (lang === 'en') {
    translationText = verse.englishTranslation || verse.translation || '';
  } else if (lang === 'te') {
    translationText = verse.teluguTranslation || verse.teluguMeaning || (verse.translations && verse.translations.te) || verse.englishTranslation;
  } else if (lang === 'hi') {
    translationText = verse.hindiTranslation || verse.hindiMeaning || (verse.translations && verse.translations.hi) || verse.englishTranslation;
  } else if (lang === 'gu') {
    translationText = verse.gujaratiTranslation || (verse.translations && verse.translations.gu) || verse.englishTranslation;
  } else if (lang === 'sa') {
    translationText = verse.sanskrit || (verse.translations && verse.translations.sa);
  } else {
    translationText = verse.englishTranslation || verse.translation || '';
    isFallback = true;
  }

  const hasTeluguMeaning = Boolean(verse.teluguMeaning || verse.teluguTranslation || (verse.translations && verse.translations.te));
  const altTranslationText = lang === 'te' 
    ? (verse.englishTranslation || verse.translation || '') 
    : ((verse.translations && verse.translations.te) || verse.teluguMeaning || verse.teluguTranslation || '');

  // Multilingual explanation resolution
  const rawMeaning = verse.meaning || verse.englishExplanation || '';
  let explanationText = '';
  if (lang === 'te' && verse.teluguExplanation) {
    explanationText = verse.teluguExplanation;
  } else if (lang === 'hi' && (verse.hindiExplanation || (verse.explanations && verse.explanations.hi))) {
    explanationText = verse.hindiExplanation || verse.explanations.hi;
  } else if (lang === 'sa' && (verse.sanskritExplanation || (verse.explanations && verse.explanations.sa))) {
    explanationText = verse.sanskritExplanation || verse.explanations.sa;
  } else if (verse.explanations && verse.explanations[lang]) {
    explanationText = verse.explanations[lang];
  } else if (lang === 'gu' && verse.gujaratiExplanation) {
    explanationText = verse.gujaratiExplanation;
  } else {
    explanationText = rawMeaning;
  }

  // Multilingual practical life application resolution
  let practicalText = '';
  if (lang === 'te' && verse.practicalApplicationTelugu) {
    practicalText = verse.practicalApplicationTelugu;
  } else if (lang === 'hi' && verse.practicalApplicationHindi) {
    practicalText = verse.practicalApplicationHindi;
  } else if (verse.practicalApplications && verse.practicalApplications[lang]) {
    practicalText = verse.practicalApplications[lang];
  } else {
    practicalText = verse.practicalApplication || '';
  }
  const hasMultipleLangs = true;

  const card = document.createElement('div');
  card.className = 'group relative bg-white dark:bg-[#1A1816] rounded-2xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 overflow-hidden';
  card.dataset.verseId = verse.id;

  let isExplanationOpen = showExplanation;

  const dict = I18N[lang] || I18N.en;
  const chapterLabel = (dict.chapterDetail && dict.chapterDetail.chapterLabel) || 'Chapter';
  const verseLabel = (dict.common && dict.common.versesCount) || 'Verse';
  const explainLabel = (dict.verseDetail && dict.verseDetail.explanation) || (dict.common && dict.common.explanation) || 'Explain';
  const shareLabel = (dict.common && dict.common.shareText) || 'Share';
  const saveLabel = (dict.verseDetail && dict.verseDetail.save) || 'Save';
  const savedLabel = (dict.verseDetail && dict.verseDetail.saved) || 'Saved';
  const translationLabel = (dict.common && dict.common.translation) || 'Translation';
  const commentaryLabel = (dict.common && dict.common.explanation) || 'Meaning & Commentary';
  const practicalLabel = (dict.common && dict.common.practical) || 'Practical Life Application';
  const viewDetailLabel = (dict.verseDetail && dict.verseDetail.exploreVerse) || 'View Full Details';

  card.innerHTML = `
    <!-- Top Bar with Chapter Info and Actions -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800/80 pb-3">
      <button class="verse-header-title-btn flex items-center gap-2 hover:opacity-80 transition text-left">
        <span class="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 font-cinzel font-bold text-xs tracking-wide group-hover:bg-amber-500/20">
          Bhagavad Gita ${verse.chapter}.${verse.verse} ↗
        </span>
        <span class="text-xs text-stone-500 dark:text-stone-400 font-medium">
          ${chapterLabel} ${verse.chapter}, ${verseLabel} ${verse.verse}
        </span>
      </button>

      <!-- Action Buttons: Save, Explain, Share, Audio, Open Full -->
      <div class="flex items-center gap-1.5 sm:gap-2">
        <!-- Audio Voice Button Slot -->
        <div class="verse-voice-slot flex items-center"></div>

        <!-- Explain Toggle Button -->
        <button class="verse-explain-btn flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition" title="View Explanation">
          <span>✨</span>
          <span>${explainLabel}</span>
        </button>

        <!-- Share Card Button -->
        <button class="verse-share-btn flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition" title="Share Card">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          <span>${shareLabel}</span>
        </button>

        <!-- Bookmark / Save Button -->
        <button class="verse-save-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
          isSaved
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
            : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-500/40 hover:text-amber-600'
        }">
          <svg class="w-3.5 h-3.5 ${isSaved ? 'fill-current' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
          <span>${isSaved ? savedLabel : saveLabel}</span>
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

    <!-- Translation (Shown only if showTranslation option is explicitly requested) -->
    ${showTranslation ? `
    <div class="verse-translation-section flex flex-col gap-1.5">
      <div class="flex items-center justify-between">
        <span class="verse-translation-label text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 font-cinzel">
          ${translationLabel}
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
        <span>${t('common.fallbackNotice', lang) || 'Displaying English translation as standard fallback.'}</span>
      </div>` : ''}

      <p class="verse-translation-text text-stone-700 dark:text-stone-200 text-sm md:text-base leading-relaxed ${getScriptFontClass(lang)}">
        ${translationText}
      </p>
    </div>` : ''}

    <!-- Explanation (Meaning) Box -->
    <div class="verse-explanation-box flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300 bg-stone-50/70 dark:bg-stone-900/40 p-3.5 rounded-xl border border-stone-100 dark:border-stone-800/80 ${isExplanationOpen ? '' : 'hidden'}">
      <span class="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
        <span>✨</span> ${commentaryLabel}
      </span>
      <p class="leading-relaxed ${getScriptFontClass(lang)} whitespace-pre-line">
        ${explanationText || 'Spiritual commentary and reflection for this verse.'}
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
              ${practicalLabel}
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
        <span>${viewDetailLabel}</span>
        <span>→</span>
      </button>
    </div>
  `;

  // Attach Voice Button in Slot
  const voiceSlot = card.querySelector('.verse-voice-slot');
  if (voiceSlot) {
    const recitationText = `${verse.sanskrit}. ${translationText}`;
    const voiceBtn = renderVoiceButton({
      text: recitationText,
      lang: lang === 'sa' ? 'sa' : (verse.translations && verse.translations[lang] ? lang : 'en'),
      uiLang: lang,
      variant: 'icon',
      ariaLabel: t('voice.ariaListen', lang) || 'Listen to this recitation'
    });
    voiceSlot.appendChild(voiceBtn);
  }

  // Attach Event Handlers
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
        toastManager.show(t('common.savedSuccess', lang) || "Verse saved to your bookmarks!", "success");
      } else {
        storageManager.removeVerse(verse.id);
        toastManager.show(t('common.removedSuccess', lang) || "Verse removed from bookmarks", "info");
      }

      saveBtn.className = `verse-save-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
        nowSaved
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-500/40 hover:text-amber-600'
      }`;
      saveBtn.querySelector('svg').className = `w-3.5 h-3.5 ${nowSaved ? 'fill-current' : 'fill-none'}`;
      saveBtn.querySelector('span').textContent = nowSaved ? savedLabel : saveLabel;

      if (onSaveChange) onSaveChange(verse.id, nowSaved);
    };
  }

  return card;
}
