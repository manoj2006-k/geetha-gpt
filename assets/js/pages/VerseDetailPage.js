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
import { speechEngine } from '../utils/speechUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from '../components/Toast.js';
import { openShareModal } from '../components/ShareModal.js';

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

  if (lang === 'en') {
    translationText = verse.englishTranslation || verse.translation || '';
  } else if (lang === 'te') {
    translationText = (verse.translations && verse.translations.te) || verse.teluguTranslation || verse.teluguMeaning || verse.englishTranslation;
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

  const explanationText = lang === 'te' ? (verse.teluguExplanation || verse.englishExplanation) : (lang === 'hi' && verse.hindiMeaning ? verse.hindiMeaning : verse.englishExplanation);
  const practicalText = lang === 'te' ? (verse.practicalApplicationTelugu || verse.practicalApplication) : verse.practicalApplication;

  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-8 pb-20 page-fade-in max-w-4xl mx-auto px-4 sm:px-6';

  page.innerHTML = `
    <!-- Top Breadcrumb & Quick Actions Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 mt-2">
      <div class="flex items-center gap-2">
        <button id="verse-back-to-chapter-btn" class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-amber-600 hover:border-amber-500/50 transition shadow-sm">
          <span>←</span>
          <span class="${getScriptFontClass(lang)}">${lang === 'te' ? `అధ్యాయం ${chNum}` : (lang === 'hi' ? `अध्याय ${chNum}` : `Chapter ${chNum}`)}</span>
        </button>
        <span class="text-stone-300 dark:text-stone-700">•</span>
        <button id="verse-all-chapters-btn" class="text-xs font-semibold text-stone-500 hover:text-amber-600 transition ${getScriptFontClass(lang)}">
          ${lang === 'te' ? 'అన్ని అధ్యాయాలు' : (lang === 'hi' ? 'सभी अध्याय' : 'All Chapters')}
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <!-- Language Selector Button (23 Languages) -->
        <button id="detail-translate-btn" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-500/20 transition shadow-sm" title="Select Language">
          <span>🌐</span>
          <span class="${getScriptFontClass(lang)}" id="detail-translate-label">${currentLangObj.nativeName}</span>
          <span class="text-[10px] text-stone-400 font-mono font-normal">(${lang.toUpperCase()})</span>
        </button>

        <!-- Audio Recitation -->
        <button id="detail-audio-btn" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 hover:border-amber-500/50 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-amber-600 transition shadow-sm" title="Read Aloud">
          <svg class="w-4 h-4 play-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
          <span class="speaking-indicator hidden flex items-center gap-0.5">
            <span class="w-1 h-3 bg-amber-600 animate-pulse"></span>
            <span class="w-1 h-4 bg-amber-600 animate-pulse delay-75"></span>
            <span class="w-1 h-2 bg-amber-600 animate-pulse delay-150"></span>
          </span>
          <span>${lang === 'te' ? 'వినండి' : 'Read Aloud'}</span>
        </button>

        <!-- Share -->
        <button id="detail-share-btn" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 hover:border-amber-500/50 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-amber-600 transition shadow-sm" title="Share Verse">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          <span>${lang === 'te' ? 'షేర్' : 'Share'}</span>
        </button>

        <!-- Save / Bookmark -->
        <button id="detail-save-btn" class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
          isSaved
            ? 'bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300'
            : 'bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500/50 hover:text-amber-600'
        }">
          <svg class="w-4 h-4 ${isSaved ? 'fill-current' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
          <span>${isSaved ? (lang === 'te' ? 'భద్రపరిచారు' : 'Saved') : (lang === 'te' ? 'భద్రపరుచు' : 'Save')}</span>
        </button>
      </div>
    </div>

    <!-- Main Verse Container Card -->
    <div class="relative bg-white dark:bg-[#1A1816] rounded-3xl p-6 sm:p-10 border border-stone-200/90 dark:border-stone-800 shadow-sm flex flex-col gap-8">
      
      <!-- Verse Header Badge -->
      <div class="flex flex-col items-center text-center gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-6">
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
        <p class="font-sanskrit text-xl sm:text-2xl md:text-3xl text-stone-900 dark:text-amber-100 font-bold leading-relaxed whitespace-pre-line">
          ${scriptContent}
        </p>
        
        <!-- Transliteration -->
        ${
          verse.transliteration
            ? `
            <div class="pt-3 border-t border-amber-500/15">
              <span class="text-[11px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500 font-cinzel block mb-1">
                ${lang === 'te' ? 'లిప్యంతరీకరణ' : 'Transliteration'}
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
              <span class="text-[11px] uppercase tracking-widest font-bold text-amber-800 dark:text-amber-400 font-cinzel block mb-1">
                ${lang === 'te' ? 'పదార్థం' : 'Word Meanings'}
              </span>
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
              ${lang === 'te' ? 'శ్లోక తాత్పర్యం & అనువాదం' : (lang === 'hi' ? 'श्लोक अनुवाद एवं भावार्थ' : 'Verse Meaning & Translation')}
            </span>
          </div>
          <div class="flex items-center gap-1.5">
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
          <span>Verified translation in <strong>${currentLangObj.nativeName}</strong> is currently pending canonical curation. Displaying English translation.</span>
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
        <div class="flex items-center gap-2">
          <span class="text-amber-600">✨</span>
          <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 font-cinzel">
            ${lang === 'te' ? 'గీతా వివరణ & భావార్థం' : 'Spiritual Commentary & Deeper Meaning'}
          </h2>
        </div>
        
        <!-- Telugu Explanation -->
        <div class="p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">
          <span class="text-[11px] font-bold text-amber-800 dark:text-amber-300 block mb-1">తెలుగు వివరణ:</span>
          <p class="text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed font-telugu">
            ${verse.teluguExplanation || verse.englishExplanation}
          </p>
        </div>

        <!-- English Commentary -->
        <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/30 border border-stone-200/50 dark:border-stone-800">
          <span class="text-[11px] font-bold text-stone-500 dark:text-stone-400 font-cinzel block mb-1">English Commentary:</span>
          <p class="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            ${verse.englishExplanation}
          </p>
        </div>
      </div>

      <!-- Practical Application Section -->
      ${
        practicalText
          ? `
          <div class="flex items-start gap-3 p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-l-4 border-amber-500 text-stone-800 dark:text-stone-200">
            <span class="text-xl flex-shrink-0">🌱</span>
            <div class="flex flex-col gap-1">
              <span class="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-300 font-cinzel">
                ${lang === 'te' ? 'ఆచరణాత్మక జీవన సూత్రం' : 'Practical Life Application'}
              </span>
              <p class="text-sm sm:text-base leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
                ${practicalText}
              </p>
            </div>
          </div>
          `
          : ''
      }

      <!-- Topics Pills -->
      ${
        verse.topics && verse.topics.length
          ? `
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
            <span class="text-xs font-semibold text-stone-400 font-cinzel">Topics:</span>
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
      <div class="pt-6 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-4">
        ${
          prevVerse
            ? `
            <button id="prev-verse-btn" class="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 hover:border-amber-500 text-stone-800 dark:text-stone-200 font-cinzel font-bold text-xs sm:text-sm shadow-sm transition hover-lift">
              <span>←</span>
              <span>${lang === 'te' ? `మునుపటి శ్లోకం (${prevVerse.chapter}.${prevVerse.verse})` : `Previous Verse (${prevVerse.chapter}.${prevVerse.verse})`}</span>
            </button>
            `
            : `
            <button disabled class="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 font-cinzel font-bold text-xs sm:text-sm opacity-50 cursor-not-allowed">
              <span>←</span>
              <span>${lang === 'te' ? 'ప్రారంభ శ్లోకం' : 'First Verse'}</span>
            </button>
            `
        }

        <span class="font-cinzel text-xs font-bold text-stone-500 dark:text-stone-400 text-center">
          ${lang === 'te' ? `శ్లోకం ${vNum} / ${totalVersesInChapter}` : `Verse ${vNum} / ${totalVersesInChapter}`}
        </span>

        ${
          nextVerse
            ? `
            <button id="next-verse-btn" class="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-cinzel font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition hover-lift">
              <span>${lang === 'te' ? `తదుపరి శ్లోకం (${nextVerse.chapter}.${nextVerse.verse})` : `Next Verse (${nextVerse.chapter}.${nextVerse.verse})`}</span>
              <span>→</span>
            </button>
            `
            : `
            <button disabled class="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 font-cinzel font-bold text-xs sm:text-sm opacity-50 cursor-not-allowed">
              <span>${lang === 'te' ? 'ముగింపు శ్లోకం' : 'Final Verse'}</span>
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
              <span>${lang === 'te' ? 'సంబంధిత శ్లోకాలు' : 'Related Verses'}</span>
            </h3>
            <span class="text-xs text-stone-500 font-cinzel">From Local Dataset</span>
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
            <span>${lang === 'te' ? `మునుపటి అధ్యాయం ${prevChapterNum}` : `Previous Chapter ${prevChapterNum}`}</span>
          </button>
          `
          : `<div></div>`
      }

      <button id="footer-all-chapters-btn" class="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline font-cinzel">
        ${lang === 'te' ? 'అధ్యాయాల జాబితా (18)' : 'View All 18 Chapters'}
      </button>

      ${
        nextChapterNum
          ? `
          <button id="footer-next-chapter-btn" class="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-amber-600 transition flex items-center gap-1 font-cinzel">
            <span>${lang === 'te' ? `తదుపరి అధ్యాయం ${nextChapterNum}` : `Next Chapter ${nextChapterNum}`}</span>
            <span>→</span>
          </button>
          `
          : `<div></div>`
      }
    </div>
  `;

  // Attach handlers
  const backToChBtn = page.querySelector('#verse-back-to-chapter-btn');
  const allChBtn = page.querySelector('#verse-all-chapters-btn');
  const footerAllChBtn = page.querySelector('#footer-all-chapters-btn');
  const prevVerseBtn = page.querySelector('#prev-verse-btn');
  const nextVerseBtn = page.querySelector('#next-verse-btn');
  const audioBtn = page.querySelector('#detail-audio-btn');
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

  // Translation Toggle & Tabs
  const translateBtn = page.querySelector('#detail-translate-btn');
  const translateLabel = page.querySelector('#detail-translate-label');
  const tabTelugu = page.querySelector('#tab-btn-telugu');
  const tabEnglish = page.querySelector('#tab-btn-english');
  const tabBoth = page.querySelector('#tab-btn-both');
  const contentTelugu = page.querySelector('#content-translation-telugu');
  const contentEnglish = page.querySelector('#content-translation-english');

  const setTranslationMode = (mode) => {
    soundSynthesizer.playChime();
    const activeClass = 'bg-amber-600 text-white shadow-sm';
    const inactiveClass = 'text-stone-600 dark:text-stone-400 hover:text-amber-600';

    [tabTelugu, tabEnglish, tabBoth].forEach(btn => {
      if (btn) btn.className = `px-3 py-1 rounded-lg text-xs font-bold transition ${inactiveClass}`;
    });

    if (mode === 'telugu') {
      if (tabTelugu) tabTelugu.className = `px-3 py-1 rounded-lg text-xs font-bold transition ${activeClass}`;
      if (contentTelugu) contentTelugu.classList.remove('hidden');
      if (contentEnglish) contentEnglish.classList.add('hidden');
      if (translateLabel) translateLabel.textContent = 'English';
    } else if (mode === 'english') {
      if (tabEnglish) tabEnglish.className = `px-3 py-1 rounded-lg text-xs font-bold transition ${activeClass}`;
      if (contentTelugu) contentTelugu.classList.add('hidden');
      if (contentEnglish) contentEnglish.classList.remove('hidden');
      if (translateLabel) translateLabel.textContent = 'తెలుగు అనువాదం';
    } else if (mode === 'both') {
      if (tabBoth) tabBoth.className = `px-3 py-1 rounded-lg text-xs font-bold transition ${activeClass}`;
      if (contentTelugu) contentTelugu.classList.remove('hidden');
      if (contentEnglish) contentEnglish.classList.remove('hidden');
      if (translateLabel) translateLabel.textContent = 'Toggle View';
    }
  };

  if (tabTelugu) tabTelugu.onclick = () => setTranslationMode('telugu');
  if (tabEnglish) tabEnglish.onclick = () => setTranslationMode('english');
  if (tabBoth) tabBoth.onclick = () => setTranslationMode('both');

  if (translateBtn) {
    let currentMode = lang === 'te' ? 'telugu' : 'english';
    translateBtn.onclick = () => {
      currentMode = currentMode === 'telugu' ? 'english' : 'telugu';
      setTranslationMode(currentMode);
    };
  }

  // Audio Playback
  if (audioBtn) {
    audioBtn.onclick = () => {
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
        toastManager.show(lang === 'te' ? "బుక్‌మార్క్‌లలో భద్రపరచబడింది!" : "Verse saved to your bookmarks!", "success");
      } else {
        storageManager.removeVerse(verse.id);
        toastManager.show(lang === 'te' ? "బుక్‌మార్క్‌ల నుండి తొలగించబడింది" : "Verse removed from bookmarks", "info");
      }

      saveBtn.className = `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
        nowSaved
          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300'
          : 'bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500/50 hover:text-amber-600'
      }`;
      saveBtn.querySelector('svg').className = `w-4 h-4 ${nowSaved ? 'fill-current' : 'fill-none'}`;
      saveBtn.querySelector('span').textContent = nowSaved ? (lang === 'te' ? 'భద్రపరిచారు' : 'Saved') : (lang === 'te' ? 'భద్రపరుచు' : 'Save');
    };
  }

  return page;
}
