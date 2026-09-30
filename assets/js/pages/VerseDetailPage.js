/**
 * Geetha GPT - Verse Detail Page Component
 * Dedicated full-screen explorer for any of the 700 Bhagavad Gita verses
 * Features:
 * - Large sacred Sanskrit typography (Devanagari, Telugu Sanskrit, IAST)
 * - Complete transliteration, English translation, Telugu translation, commentary & practical life application
 * - Related verses (3 from local dataset)
 * - Previous / Next verse navigation with disabled boundaries (1.1 and 18.78)
 * - Previous / Next chapter navigation
 * - Save / Bookmark with localStorage persistence
 * - Audio recitation & Web Speech Read Aloud
 * - Full bilingual support (English & Telugu UI)
 */

import { CHAPTERS_DATA } from '../data/chaptersData.js';
import { VERSES_DATA } from '../data/versesData.js';
import { getLanguage, getScriptFontClass } from '../data/languages.js';
import { languageModal } from '../components/LanguageModal.js';
import { storageManager } from '../utils/storageUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from '../components/Toast.js';
import { openShareModal } from '../components/ShareModal.js';
import { renderVoiceButton } from '../components/VoiceButton.js';
import { I18N, t } from '../data/i18n.js';

export function renderVerseDetailPage(options = {}) {
  const {
    chapterNumber = 2,
    verseNumber = 47,
    verseId = null,
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    onNavigate = null
  } = options;

  const dict = I18N[lang] || I18N.en;
  const chapterLabel = (dict.chapterDetail && dict.chapterDetail.chapterLabel) || 'Chapter';
  const allChaptersLabel = (dict.chapters && dict.chapters.backToChapters) || (dict.common && dict.common.backToAllChapters) || 'All Chapters';
  const saveLabel = (dict.verseDetail && dict.verseDetail.save) || 'Save';
  const savedLabel = (dict.verseDetail && dict.verseDetail.saved) || 'Saved';
  const shareLabel = (dict.common && dict.common.shareText) || 'Share';
  const versesLabel = (dict.common && dict.common.versesCount) || 'Verses';
  const prevVerseLabel = (dict.verseDetail && dict.verseDetail.previousVerse) || 'Previous Verse';
  const nextVerseLabel = (dict.verseDetail && dict.verseDetail.nextVerse) || 'Next Verse';
  const prevChapterLabel = (dict.verseDetail && dict.verseDetail.previousChapter) || 'Previous Chapter';
  const nextChapterLabel = (dict.verseDetail && dict.verseDetail.nextChapter) || 'Next Chapter';
  const relatedVersesLabel = (dict.verseDetail && dict.verseDetail.relatedVersesTitle) || 'Related Verses';

  let chNum = parseInt(chapterNumber, 10);
  let vNum = parseInt(verseNumber, 10);

  if (verseId) {
    const parts = verseId.split('-');
    if (parts.length === 2) {
      chNum = parseInt(parts[0], 10);
      vNum = parseInt(parts[1], 10);
    }
  }

  // Find exact verse in complete 700 dataset
  const targetId = `${chNum}-${vNum}`;
  let verse = VERSES_DATA.find(v => v.id === targetId || (v.chapter === chNum && v.verse === vNum));

  if (!verse) {
    verse = VERSES_DATA.find(v => v.chapter === chNum) || VERSES_DATA[0];
    chNum = verse.chapter;
    vNum = verse.verse;
  }

  // Mark verse as viewed in progress tracking
  storageManager.markVerseViewed(verse.id);

  const chapter = CHAPTERS_DATA.find(c => c.number === chNum) || CHAPTERS_DATA[1];
  const totalVersesInChapter = chapter.verseCount || 72;

  // Compute navigation
  const isFirstVerseInChapter = vNum <= 1;
  const isLastVerseInChapter = vNum >= totalVersesInChapter;

  // Global prev/next verse
  const currentIndex = VERSES_DATA.findIndex(v => v.id === verse.id);
  const prevVerse = currentIndex > 0 ? VERSES_DATA[currentIndex - 1] : null;
  const nextVerse = currentIndex < VERSES_DATA.length - 1 ? VERSES_DATA[currentIndex + 1] : null;

  // Chapter navigation
  const prevChapterNum = chNum > 1 ? chNum - 1 : null;
  const nextChapterNum = chNum < 18 ? chNum + 1 : null;

  // 3 Related verses (same chapter or shared topics)
  const relatedVerses = VERSES_DATA.filter(v => v.id !== verse.id && (v.chapter === chNum || (v.topics && verse.topics && v.topics.some(t => verse.topics.includes(t))))).slice(0, 3);

  const isSaved = storageManager.isVerseSaved(verse.id);

  // Script rendering
  let scriptContent = verse.sanskrit;
  if (sanskritDisplay === 'translit') {
    scriptContent = verse.transliteration;
  } else if (sanskritDisplay === 'telugu') {
    scriptContent = verse.teluguSanskrit || verse.sanskrit;
  }

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

  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-8 pb-20 page-fade-in max-w-4xl mx-auto px-4 sm:px-6';

  page.innerHTML = `
    <!-- Top Breadcrumb & Quick Actions Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 mt-2">
      <div class="flex items-center gap-2">
        <button id="verse-back-to-chapter-btn" class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-amber-600 hover:border-amber-500/50 transition shadow-sm">
          <span>←</span>
          <span class="${getScriptFontClass(lang)}">${chapterLabel} ${chNum}</span>
        </button>
        <span class="text-stone-300 dark:text-stone-700">•</span>
        <button id="verse-all-chapters-btn" class="text-xs font-semibold text-stone-500 hover:text-amber-600 transition ${getScriptFontClass(lang)}">
          ${allChaptersLabel}
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <!-- Language Selector Button (23 Languages) -->
        <button id="detail-translate-btn" class="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-500/20 transition shadow-sm" title="Select Language">
          <span>🌐</span>
          <span class="${getScriptFontClass(lang)}" id="detail-translate-label">${currentLangObj.nativeName}</span>
          <span class="hidden sm:inline text-[10px] text-stone-400 font-mono font-normal">(${lang.toUpperCase()})</span>
        </button>

        <!-- Top Recitation Voice Button Slot -->
        <div id="detail-top-voice-slot" class="flex items-center"></div>

        <!-- Share -->
        <button id="detail-share-btn" class="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 hover:border-amber-500/50 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-amber-600 transition shadow-sm" title="${shareLabel}">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          <span class="hidden sm:inline">${shareLabel}</span>
        </button>

        <!-- Save / Bookmark -->
        <button id="detail-save-btn" class="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition shadow-sm ${
          isSaved
            ? 'bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300'
            : 'bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500/50 hover:text-amber-600'
        }">
          <svg class="w-4 h-4 ${isSaved ? 'fill-current' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
          <span class="hidden sm:inline">${isSaved ? savedLabel : saveLabel}</span>
        </button>
      </div>
    </div>

    <!-- Main Verse Container Card -->
    <div class="relative bg-white dark:bg-[#1A1816] rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-stone-200/90 dark:border-stone-800 shadow-sm flex flex-col gap-6 sm:gap-8">
      
      <!-- Verse Header Badge -->
      <div class="flex flex-col items-center text-center gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-4 sm:pb-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold font-cinzel">
          <span>🕉️</span>
          <span>${lang === 'te' ? 'శ్రీమద్భగవద్గీత' : 'Bhagavad Gita'}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold font-cinzel text-stone-900 dark:text-stone-100">
          ${lang === 'te' ? `అధ్యాయం ${chNum} • శ్లోకం ${vNum}` : `Chapter ${chNum} • Verse ${vNum}`}
        </h1>
        <p class="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 font-cinzel">
          ${chapter.sanskritTranslit} — ${chapter.englishTitle}
        </p>
      </div>

      <!-- Prominent Sanskrit Verse Box -->
      <div class="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/[0.04] to-transparent border border-amber-500/20 shadow-inner flex flex-col gap-4 text-center">
        <div class="flex items-center justify-between border-b border-amber-500/15 pb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 font-cinzel">
            ${dict.verseDetail?.sanskritVerse || 'Sanskrit Shloka'}
          </span>
          <div id="shloka-voice-slot"></div>
        </div>

        <p class="font-sanskrit text-xl sm:text-2xl md:text-3xl text-stone-900 dark:text-amber-100 font-bold leading-relaxed whitespace-pre-line">
          ${scriptContent}
        </p>
        
        <!-- Transliteration -->
        ${
          verse.transliteration
            ? `
            <div class="pt-3 border-t border-amber-500/15">
              <span class="text-[11px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500 font-cinzel block mb-1">
                ${dict.chapterDetail?.transliterationToggle || 'Transliteration'}
              </span>
              <p class="text-sm sm:text-base text-stone-600 dark:text-stone-300 italic font-sans leading-relaxed">
                ${verse.transliteration}
              </p>
            </div>
            `
            : ''
        }

        <!-- Word Meanings if available -->
        ${
          verse.wordMeanings
            ? `
            <div class="pt-3 border-t border-amber-500/15 text-left">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] uppercase tracking-widest font-bold text-amber-800 dark:text-amber-400 font-cinzel">
                  ${dict.verseDetail?.wordMeanings || 'Word Meanings'}
                </span>
                <div id="wordmeanings-voice-slot"></div>
              </div>
              <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                ${verse.wordMeanings}
              </p>
            </div>
            `
            : ''
        }
      </div>

      <!-- Translation Card Box -->
      <div class="flex flex-col gap-4 p-6 rounded-2xl bg-stone-50/80 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800">
        <!-- Translation Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">📜</span>
            <span class="font-cinzel font-bold text-sm text-stone-900 dark:text-stone-100">
              ${dict.chapterDetail?.meaning || (dict.common && dict.common.translation) || 'Verse Translation'}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <div id="translation-voice-slot"></div>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${
              isFallback
                ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
            }">
              ${isFallback ? 'English (Fallback)' : `${currentLangObj.nativeName} (${lang.toUpperCase()})`}
            </span>
          </div>
        </div>

        ${isFallback ? `
        <div class="px-3.5 py-2 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
          <span>ℹ️</span>
          <span>${dict.common?.fallbackNotice || 'Verified translation is pending canonical curation. Displaying English translation.'}</span>
        </div>` : ''}

        <!-- Active Translation Content -->
        <div class="flex flex-col gap-2">
          <p class="text-base sm:text-lg text-stone-800 dark:text-stone-100 leading-relaxed font-medium ${getScriptFontClass(lang)}">
            ${translationText}
          </p>
        </div>
      </div>

      <!-- In-Depth Explanation / Commentary Section -->
      <div class="flex flex-col gap-3 p-6 rounded-2xl bg-amber-500/[0.03] dark:bg-amber-500/[0.05] border border-amber-500/15">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-amber-600">✨</span>
            <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 font-cinzel">
              ${dict.common?.explanation || 'Spiritual Commentary & Meaning'}
            </h2>
          </div>
          <div id="commentary-voice-slot"></div>
        </div>
        
        <!-- Active Language-Specific Explanation (Telugu, Hindi, Sanskrit, Tamil, Kannada, etc.) -->
        <div class="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/10 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-cinzel">
              <span>🪔</span> ${currentLangObj.nativeName} ${dict.common?.explanation || 'Meaning & Commentary'}
            </span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold uppercase">
              ${lang.toUpperCase()}
            </span>
          </div>
          <p class="text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed ${getScriptFontClass(lang)} whitespace-pre-line">
            ${explanationText}
          </p>
        </div>

        <!-- Classical Reference Commentary (Swami Sivananda / Sanskrit Reference when non-English) -->
        ${(lang !== 'en' && rawMeaning && explanationText !== rawMeaning) ? `
        <div class="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/30 border border-stone-200/50 dark:border-stone-800 flex flex-col gap-1.5">
          <span class="text-[11px] font-bold text-stone-500 dark:text-stone-400 font-cinzel">Classical Reference Commentary (Sivananda):</span>
          <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
            ${rawMeaning}
          </p>
        </div>
        ` : ''}
      </div>

      <!-- Practical Application Section -->
      ${
        practicalText
          ? `
          <div class="flex items-start justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-l-4 border-amber-500 text-stone-800 dark:text-stone-200">
            <div class="flex items-start gap-3">
              <span class="text-xl flex-shrink-0">🌱</span>
              <div class="flex flex-col gap-1">
                <span class="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-300 font-cinzel">
                  ${dict.common?.practical || 'Practical Life Application'}
                </span>
                <p class="text-sm sm:text-base leading-relaxed ${getScriptFontClass(lang)}">
                  ${practicalText}
                </p>
              </div>
            </div>
            <div id="practical-voice-slot" class="flex-shrink-0"></div>
          </div>
          `
          : ''
      }

      <!-- Topics Pills -->
      ${
        verse.topics && verse.topics.length
          ? `
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
            <span class="text-xs font-semibold text-stone-400 font-cinzel">${dict.topics?.title || 'Topics'}:</span>
            ${verse.topics
              .map(
                t => `<span class="px-3 py-1 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/50 dark:border-stone-700/50">#${t}</span>`
              )
              .join('')}
          </div>
          `
          : ''
      }

      <!-- Verse Navigation Bar: Previous Verse & Next Verse -->
      <div class="pt-6 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-2 sm:gap-4">
        ${
          prevVerse
            ? `
            <button id="prev-verse-btn" class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 hover:border-amber-500 text-stone-800 dark:text-stone-200 font-cinzel font-bold text-xs sm:text-sm shadow-sm transition hover-lift">
              <span>←</span>
              <span class="hidden sm:inline">${prevVerseLabel}</span>
              <span>(${prevVerse.chapter}.${prevVerse.verse})</span>
            </button>
            `
            : `
            <button disabled class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 font-cinzel font-bold text-xs sm:text-sm opacity-50 cursor-not-allowed">
              <span>←</span>
              <span>${dict.verseDetail?.previousVerse || 'First'}</span>
            </button>
            `
        }

        <span class="font-cinzel text-xs font-bold text-stone-500 dark:text-stone-400 text-center whitespace-nowrap">
          ${versesLabel} ${vNum} / ${totalVersesInChapter}
        </span>

        ${
          nextVerse
            ? `
            <button id="next-verse-btn" class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-cinzel font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition hover-lift">
              <span class="hidden sm:inline">${nextVerseLabel}</span>
              <span>(${nextVerse.chapter}.${nextVerse.verse})</span>
              <span>→</span>
            </button>
            `
            : `
            <button disabled class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 font-cinzel font-bold text-xs sm:text-sm opacity-50 cursor-not-allowed">
              <span>${dict.verseDetail?.nextVerse || 'Final'}</span>
              <span>→</span>
            </button>
            `
        }
      </div>
    </div>

    <!-- Related Verses Section -->
    ${
      relatedVerses.length > 0
        ? `
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2">
            <h3 class="text-lg font-bold font-cinzel text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>🔗</span>
              <span>${relatedVersesLabel}</span>
            </h3>
            <span class="text-xs text-stone-500 font-cinzel">${dict.common?.curatedVerses || 'Curated Verses'}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            ${relatedVerses
              .map(
                rv => `
                <div data-related-id="${rv.id}" class="related-verse-card p-4 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/50 shadow-sm transition hover-lift cursor-pointer flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 font-cinzel font-bold text-[11px]">
                      Gita ${rv.chapter}.${rv.verse}
                    </span>
                  </div>
                  <p class="font-sanskrit text-xs font-semibold text-stone-900 dark:text-amber-100 line-clamp-2">
                    ${rv.sanskrit.split('\n')[0]}
                  </p>
                  <p class="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                    ${rv.englishTranslation}
                  </p>
                </div>
                `
              )
              .join('')}
          </div>
        </div>
        `
        : ''
    }

    <!-- Chapter Navigation Footer -->
    <div class="pt-4 flex items-center justify-between gap-4 border-t border-stone-200/80 dark:border-stone-800">
      ${
        prevChapterNum
          ? `
          <button id="footer-prev-chapter-btn" class="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-amber-600 transition flex items-center gap-1 font-cinzel">
            <span>←</span>
            <span>${prevChapterLabel} ${prevChapterNum}</span>
          </button>
          `
          : `<div></div>`
      }

      <button id="footer-all-chapters-btn" class="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline font-cinzel">
        ${allChaptersLabel} (18)
      </button>

      ${
        nextChapterNum
          ? `
          <button id="footer-next-chapter-btn" class="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-amber-600 transition flex items-center gap-1 font-cinzel">
            <span>${nextChapterLabel} ${nextChapterNum}</span>
            <span>→</span>
          </button>
          `
          : `<div></div>`
      }
    </div>
  `;

  // Mount Voice Buttons
  const topVoiceSlot = page.querySelector('#detail-top-voice-slot');
  if (topVoiceSlot) {
    const recitationText = `${verse.sanskrit}. ${translationText}`;
    topVoiceSlot.appendChild(renderVoiceButton({
      text: recitationText,
      lang: lang === 'sa' ? 'sa' : (verse.translations && verse.translations[lang] ? lang : 'en'),
      uiLang: lang,
      variant: 'compact',
      label: dict.voice?.listen || 'Listen Passage'
    }));
  }

  const shlokaVoiceSlot = page.querySelector('#shloka-voice-slot');
  if (shlokaVoiceSlot) {
    shlokaVoiceSlot.appendChild(renderVoiceButton({
      text: verse.sanskrit,
      lang: 'sa',
      uiLang: lang,
      variant: 'compact',
      label: dict.verseDetail?.recitation || 'Recite Shloka'
    }));
  }

  const transVoiceSlot = page.querySelector('#translation-voice-slot');
  if (transVoiceSlot && translationText) {
    transVoiceSlot.appendChild(renderVoiceButton({
      text: translationText,
      lang: lang === 'sa' ? 'sa' : (verse.translations && verse.translations[lang] ? lang : 'en'),
      uiLang: lang,
      variant: 'compact',
      label: dict.common?.translation || 'Listen Translation'
    }));
  }

  const wordMeaningsSlot = page.querySelector('#wordmeanings-voice-slot');
  if (wordMeaningsSlot && verse.wordMeanings) {
    wordMeaningsSlot.appendChild(renderVoiceButton({
      text: verse.wordMeanings,
      lang: 'sa',
      uiLang: lang,
      variant: 'compact',
      label: dict.verseDetail?.wordMeanings || 'Listen'
    }));
  }

  const commentaryVoiceSlot = page.querySelector('#commentary-voice-slot');
  if (commentaryVoiceSlot) {
    const commText = (verse.teluguExplanation && lang === 'te') ? verse.teluguExplanation : rawMeaning;
    commentaryVoiceSlot.appendChild(renderVoiceButton({
      text: commText,
      lang: lang === 'te' ? 'te' : 'en',
      uiLang: lang,
      variant: 'compact',
      label: dict.common?.explanation || 'Listen Commentary'
    }));
  }

  const practicalVoiceSlot = page.querySelector('#practical-voice-slot');
  if (practicalVoiceSlot && practicalText) {
    practicalVoiceSlot.appendChild(renderVoiceButton({
      text: practicalText,
      lang: lang === 'te' ? 'te' : 'en',
      uiLang: lang,
      variant: 'compact',
      label: dict.common?.practical || 'Listen Application'
    }));
  }

  // Attach handlers
  const backToChBtn = page.querySelector('#verse-back-to-chapter-btn');
  const allChBtn = page.querySelector('#verse-all-chapters-btn');
  const footerAllChBtn = page.querySelector('#footer-all-chapters-btn');
  const prevVerseBtn = page.querySelector('#prev-verse-btn');
  const nextVerseBtn = page.querySelector('#next-verse-btn');
  const shareBtn = page.querySelector('#detail-share-btn');
  const saveBtn = page.querySelector('#detail-save-btn');
  const footerPrevChBtn = page.querySelector('#footer-prev-chapter-btn');
  const footerNextChBtn = page.querySelector('#footer-next-chapter-btn');
  const relatedCards = page.querySelectorAll('.related-verse-card');
  const detailTranslateBtn = page.querySelector('#detail-translate-btn');

  if (detailTranslateBtn) {
    detailTranslateBtn.onclick = () => {
      soundSynthesizer.playChime();
      languageModal.open({
        currentLang: lang,
        onSelect: (newLang) => {
          if (options.onToggleLang) {
            options.onToggleLang(newLang);
          } else if (onNavigate) {
            onNavigate('verseDetail', { chapterNumber: chNum, verseNumber: vNum, lang: newLang });
          }
        }
      });
    };
  }

  if (backToChBtn) {
    backToChBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('chapterDetail', { chapterNumber: chNum, highlightVerseId: verse.id });
    };
  }

  if (allChBtn) {
    allChBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('chapters');
    };
  }

  if (footerAllChBtn) {
    footerAllChBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('chapters');
    };
  }

  if (prevVerseBtn) {
    prevVerseBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate && prevVerse) {
        onNavigate('verseDetail', { chapterNumber: prevVerse.chapter, verseNumber: prevVerse.verse });
      }
    };
  }

  if (nextVerseBtn) {
    nextVerseBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate && nextVerse) {
        onNavigate('verseDetail', { chapterNumber: nextVerse.chapter, verseNumber: nextVerse.verse });
      }
    };
  }

  if (footerPrevChBtn) {
    footerPrevChBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('chapterDetail', { chapterNumber: prevChapterNum });
    };
  }

  if (footerNextChBtn) {
    footerNextChBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('chapterDetail', { chapterNumber: nextChapterNum });
    };
  }

  // Related verse navigation
  relatedCards.forEach(card => {
    card.onclick = () => {
      const relId = card.dataset.relatedId;
      if (relId && onNavigate) {
        soundSynthesizer.playChime();
        const parts = relId.split('-');
        onNavigate('verseDetail', { chapterNumber: parseInt(parts[0], 10), verseNumber: parseInt(parts[1], 10) });
      }
    };
  });

  // Share Modal
  if (shareBtn) {
    shareBtn.onclick = () => {
      soundSynthesizer.playChime();
      openShareModal(verse, lang, theme);
    };
  }

  // Save / Bookmark Toggle
  if (saveBtn) {
    saveBtn.onclick = () => {
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
        toastManager.show(dict.common?.savedSuccess || "Verse saved to your bookmarks!", "success");
      } else {
        storageManager.removeVerse(verse.id);
        toastManager.show(dict.common?.removedSuccess || "Verse removed from bookmarks", "info");
      }

      saveBtn.className = `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
        nowSaved
          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300'
          : 'bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500/50 hover:text-amber-600'
      }`;
      const svgEl = saveBtn.querySelector('svg');
      if (svgEl) {
        svgEl.setAttribute('class', `w-4 h-4 ${nowSaved ? 'fill-current' : 'fill-none'}`);
      }
      const spanEl = saveBtn.querySelector('span');
      if (spanEl) {
        spanEl.textContent = nowSaved ? savedLabel : saveLabel;
      }
    };
  }

  return page;
}
