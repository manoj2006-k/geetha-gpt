/**
 * Geetha GPT - Chapter Detail View Page Component
 * Complete Chapter Explorer with all authentic verses,
 * in-chapter search, filter tabs (All / Sanskrit / Translation / Meaning / Saved),
 * reading progress bar, "Chapter Complete ✓" badge, and full bilingual support.
 */

import { CHAPTERS_DATA } from '../data/chaptersData.js';
import { VERSES_DATA } from '../data/versesData.js';
import { renderVerseCard } from '../components/VerseCard.js';
import { storageManager } from '../utils/storageUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { I18N, t } from '../data/i18n.js';

export function renderChapterDetailPage(options = {}) {
  const {
    chapterNumber = 2,
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    highlightVerseId = null,
    onNavigate = null
  } = options;

  const dict = I18N[lang] || I18N.en;
  const backLabel = (dict.chapters && dict.chapters.backToChapters) || (dict.common && dict.common.backToAllChapters) || 'Back to All Chapters';
  const chapterLabel = (dict.chapterDetail && dict.chapterDetail.chapterLabel) || 'Chapter';
  const versesLabel = (dict.common && dict.common.versesCount) || 'Verses';
  const previousLabel = (dict.verseDetail && dict.verseDetail.previousChapter) || 'Previous Chapter';
  const nextLabel = (dict.verseDetail && dict.verseDetail.nextChapter) || 'Next Chapter';

  const currentNum = parseInt(chapterNumber, 10) || 2;
  const chapter = CHAPTERS_DATA.find(c => c.number === currentNum) || CHAPTERS_DATA[1];
  
  // All verses in this chapter from the master 700 dataset
  const allChapterVerses = VERSES_DATA.filter(v => v.chapter === currentNum);
  const totalCount = allChapterVerses.length || chapter.verseCount || 72;

  let activeFilter = 'all'; // 'all' | 'sanskrit' | 'translation' | 'meaning' | 'saved'
  let searchQuery = '';

  const prevChapterNum = currentNum > 1 ? currentNum - 1 : null;
  const nextChapterNum = currentNum < 18 ? currentNum + 1 : null;

  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-8 pb-16 page-fade-in max-w-5xl mx-auto px-4 sm:px-6';

  const formattedNum = chapter.formattedNumber || (chapter.number < 10 ? `0${chapter.number}` : `${chapter.number}`);

  // Progress stats
  const progress = storageManager.getChapterProgress(currentNum, totalCount);

  page.innerHTML = `
    <!-- Top Breadcrumb Navigation & Back Button -->
    <div class="flex items-center justify-between mt-2">
      <button id="back-to-all-chapters-btn" class="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200/90 dark:border-stone-800 hover:border-amber-500/50 bg-white dark:bg-[#1A1816] text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-amber-600 transition shadow-sm">
        <span>←</span>
        <span>${backLabel}</span>
      </button>

      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-cinzel">
          ${chapter.category || 'Wisdom'}
        </span>
      </div>
    </div>

    <!-- Chapter Header Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/25 p-6 sm:p-10 flex flex-col gap-5 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-cinzel font-bold text-lg flex items-center justify-center shadow-md">
            ${formattedNum}
          </span>
          <div class="flex flex-col">
            <span class="font-cinzel text-xs uppercase tracking-widest font-bold text-amber-800 dark:text-amber-400">
              ${chapterLabel} ${chapter.number} / 18
            </span>
            <span class="text-xs font-semibold text-stone-500 dark:text-stone-400">
              ${totalCount} ${versesLabel}
            </span>
          </div>
        </div>

        <!-- Completion Badge if 100% -->
        <div id="chapter-completion-badge" class="${progress.isCompleted ? '' : 'hidden'} flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-cinzel animate-bounce-subtle">
          <span>✓</span>
          <span>${lang === 'te' ? 'అధ్యాయం పూర్తయింది' : 'Chapter Complete ✓'}</span>
        </div>
      </div>

      <div class="flex flex-col gap-1 mt-1">
        <h1 class="text-2xl sm:text-4xl font-extrabold font-sanskrit text-stone-900 dark:text-amber-100">
          Chapter ${chapter.number} — ${chapter.sanskritName}
        </h1>
        <h2 class="text-lg sm:text-2xl font-bold font-cinzel text-amber-700 dark:text-amber-400">
          ${chapter.sanskritTranslit} — ${lang === 'te' ? chapter.teluguTitle : chapter.englishTitle}
        </h2>
      </div>

      <!-- Description -->
      <p class="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
        ${lang === 'te' ? chapter.teluguSummary : chapter.englishSummary}
      </p>

      <!-- Reading Progress Bar -->
      <div class="flex flex-col gap-2 pt-2 border-t border-amber-500/20">
        <div class="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
          <span class="font-cinzel">
            ${lang === 'te' ? `చదివిన పురోగతి:` : `Reading Progress:`}
          </span>
          <span id="progress-text-display" class="font-bold text-amber-800 dark:text-amber-300 font-cinzel">
            ${progress.viewedCount} / ${totalCount} ${versesLabel} (${progress.percentage}%)
          </span>
        </div>
        <div class="w-full h-2.5 rounded-full bg-stone-200/80 dark:bg-stone-800 overflow-hidden">
          <div id="progress-bar-fill" class="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 rounded-full" style="width: ${progress.percentage}%"></div>
        </div>
      </div>

      <!-- Key Themes Badges -->
      <div class="flex flex-wrap items-center gap-2 pt-1">
        <span class="text-xs font-bold text-stone-500 dark:text-stone-400 font-cinzel">${(dict.chapterDetail && dict.chapterDetail.keyThemes) || 'Main Themes:'}</span>
        ${(lang === 'te' && chapter.teluguThemes ? chapter.teluguThemes : chapter.keyThemes)
          .map(
            themeItem => `<span class="px-3 py-1 rounded-lg text-xs font-semibold bg-white/80 dark:bg-stone-800/80 text-amber-900 dark:text-amber-200 border border-amber-500/20 shadow-sm">${themeItem}</span>`
          )
          .join('')}
      </div>
    </div>

    <!-- In-Chapter Search & Verse Filter Tabs -->
    <div class="flex flex-col gap-4">
      <!-- Search inside Chapter -->
      <div class="relative w-full">
        <input 
          type="text" 
          id="chapter-verse-search" 
          placeholder="${(dict.chapterDetail && dict.chapterDetail.searchVersePlaceholder) || 'Search verses in this chapter...'}" 
          class="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm font-medium shadow-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition" 
        />
        <svg class="w-5 h-5 text-amber-600 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- Filter Tabs: All, Sanskrit, Translation, Meaning, Saved -->
      <div class="flex flex-wrap items-center justify-between gap-2.5 border-b border-stone-200/80 dark:border-stone-800 pb-3">
        <div class="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-full" id="verse-filter-tabs">
          <button data-filter="all" class="verse-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold transition bg-amber-600 text-white shadow-sm flex-shrink-0">
            ${dict.common?.filterAll || 'All'}
          </button>
          <button data-filter="sanskrit" class="verse-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold transition bg-white dark:bg-[#1A1816] text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/40 flex-shrink-0">
            ${dict.common?.sanskrit || 'Sanskrit'}
          </button>
          <button data-filter="translation" class="verse-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold transition bg-white dark:bg-[#1A1816] text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/40 flex-shrink-0">
            ${dict.common?.translation || 'Translation'}
          </button>
          <button data-filter="meaning" class="verse-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold transition bg-white dark:bg-[#1A1816] text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/40 flex-shrink-0">
            ${dict.common?.explanation || 'Meaning'}
          </button>
          <button data-filter="saved" class="verse-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold transition bg-white dark:bg-[#1A1816] text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/40 flex-shrink-0">
            ⭐ ${dict.saved?.title || 'Saved'}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <span id="showing-verses-count" class="text-xs font-semibold text-stone-500 dark:text-stone-400 font-cinzel">
            ${totalCount} / ${totalCount} ${versesLabel}
          </span>
        </div>
      </div>
    </div>

    <!-- Verse Cards Mount List (All verses in this chapter) -->
    <div id="chapter-verses-mount" class="flex flex-col gap-6"></div>

    <!-- Chapter Navigation Footer: Previous & Next Buttons -->
    <div class="pt-8 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-4">
      ${
        prevChapterNum
          ? `
          <button id="prev-chapter-btn" class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 hover:border-amber-500 text-stone-800 dark:text-stone-200 font-cinzel font-bold text-xs sm:text-sm shadow-sm transition hover-lift">
            <span>←</span>
            <span>${previousLabel} ${prevChapterNum}</span>
          </button>
          `
          : `
          <button disabled class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 font-cinzel font-bold text-xs sm:text-sm opacity-50 cursor-not-allowed">
            <span>←</span>
            <span>${chapterLabel} 1</span>
          </button>
          `
      }

      <span class="font-cinzel text-xs font-bold text-stone-500 dark:text-stone-400 text-center">
        ${chapterLabel} ${currentNum} / 18
      </span>

      ${
        nextChapterNum
          ? `
          <button id="next-chapter-btn" class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-cinzel font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition hover-lift">
            <span>${nextLabel} ${nextChapterNum}</span>
            <span>→</span>
          </button>
          `
          : `
          <button disabled class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 font-cinzel font-bold text-xs sm:text-sm opacity-50 cursor-not-allowed">
            <span>${chapterLabel} 18</span>
            <span>→</span>
          </button>
          `
      }
    </div>
  `;

  // Attach navigation events
  const backBtn = page.querySelector('#back-to-all-chapters-btn');
  const prevBtn = page.querySelector('#prev-chapter-btn');
  const nextBtn = page.querySelector('#next-chapter-btn');
  const versesMount = page.querySelector('#chapter-verses-mount');
  const searchInput = page.querySelector('#chapter-verse-search');
  const filterTabBtns = page.querySelectorAll('.verse-tab-btn');
  const countDisplay = page.querySelector('#showing-verses-count');
  const progressText = page.querySelector('#progress-text-display');
  const progressBarFill = page.querySelector('#progress-bar-fill');
  const completionBadge = page.querySelector('#chapter-completion-badge');

  function updateProgress() {
    const p = storageManager.getChapterProgress(currentNum, totalCount);
    progressText.textContent = `${p.viewedCount} / ${totalCount} ${lang === 'te' ? 'శ్లోకాలు వీక్షించారు' : 'verses viewed'} (${p.percentage}%)`;
    progressBarFill.style.width = `${p.percentage}%`;
    if (p.isCompleted) {
      completionBadge.classList.remove('hidden');
    }
  }

  function renderVerses() {
    versesMount.innerHTML = '';
    const cleanSearch = searchQuery.trim().toLowerCase();

    const filtered = allChapterVerses.filter(v => {
      // Filter tab check
      if (activeFilter === 'saved' && !storageManager.isVerseSaved(v.id)) {
        return false;
      }

      if (!cleanSearch) return true;

      const verseNumStr = v.verse.toString();
      const dotFormat = `${v.chapter}.${v.verse}`;
      const hyphenFormat = `${v.chapter}-${v.verse}`;

      return (
        verseNumStr === cleanSearch ||
        dotFormat.includes(cleanSearch) ||
        hyphenFormat.includes(cleanSearch) ||
        (v.sanskrit && v.sanskrit.toLowerCase().includes(cleanSearch)) ||
        (v.transliteration && v.transliteration.toLowerCase().includes(cleanSearch)) ||
        (v.englishTranslation && v.englishTranslation.toLowerCase().includes(cleanSearch)) ||
        ((v.meaning || v.englishExplanation) && (v.meaning || v.englishExplanation).toLowerCase().includes(cleanSearch)) ||
        (v.teluguTranslation && v.teluguTranslation.toLowerCase().includes(cleanSearch)) ||
        (v.topics && v.topics.some(t => t.toLowerCase().includes(cleanSearch)))
      );
    });

    countDisplay.textContent = `${filtered.length} / ${totalCount} Verses`;

    if (filtered.length === 0) {
      versesMount.innerHTML = `
        <div class="py-16 px-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 text-center flex flex-col items-center gap-3">
          <span class="text-3xl">🔍</span>
          <h3 class="text-lg font-bold font-cinzel text-stone-800 dark:text-stone-200">
            ${lang === 'te' ? 'ఈ అధ్యాయంలో ఎలాంటి శ్లోకాలు కనుగొనబడలేదు' : 'No verses found in this chapter'}
          </h3>
          <p class="text-xs text-stone-500">
            ${lang === 'te' ? 'వేరే పదం లేదా శ్లోకం సంఖ్యతో ప్రయత్నించండి.' : 'Try searching for a different keyword or verse number.'}
          </p>
          <button id="reset-ch-search" class="mt-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-900 dark:text-amber-200 text-xs font-bold font-cinzel">
            ${lang === 'te' ? 'ఫిల్టర్లు రీసెట్ చేయండి' : 'Reset Filters'}
          </button>
        </div>
      `;
      versesMount.querySelector('#reset-ch-search').onclick = () => {
        searchQuery = '';
        activeFilter = 'all';
        searchInput.value = '';
        updateTabStyles();
        renderVerses();
      };
      return;
    }

    filtered.forEach(v => {
      const vCard = renderVerseCard(v, {
        lang,
        theme,
        sanskritDisplay,
        showTranslation: activeFilter !== 'sanskrit',
        showExplanation: activeFilter === 'all' || activeFilter === 'meaning',
        showPractical: activeFilter === 'all',
        onSaveChange: () => {
          if (activeFilter === 'saved') {
            renderVerses();
          }
        },
        onExploreVerse: (vId) => {
          storageManager.markVerseViewed(vId);
          updateProgress();
          if (onNavigate) {
            const parts = vId.split('-');
            onNavigate('verseDetail', { chapterNumber: parseInt(parts[0], 10), verseNumber: parseInt(parts[1], 10) });
          }
        }
      });

      // Highlight specific verse if navigated from search or deep link
      if (highlightVerseId && v.id === highlightVerseId) {
        vCard.classList.add('ring-2', 'ring-amber-500', 'ring-offset-2', 'dark:ring-offset-[#121110]');
      }

      versesMount.appendChild(vCard);
    });
  }

  function updateTabStyles() {
    filterTabBtns.forEach(btn => {
      const f = btn.dataset.filter;
      const isActive = f === activeFilter;
      btn.className = `verse-tab-btn px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
        isActive
          ? 'bg-amber-600 text-white shadow-amber-600/20'
          : 'bg-white dark:bg-[#1A1816] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/40'
      }`;
    });
  }

  filterTabBtns.forEach(btn => {
    btn.onclick = () => {
      activeFilter = btn.dataset.filter;
      soundSynthesizer.playChime();
      updateTabStyles();
      renderVerses();
    };
  });

  searchInput.oninput = (e) => {
    searchQuery = e.target.value;
    renderVerses();
  };

  backBtn.onclick = () => {
    soundSynthesizer.playChime();
    if (onNavigate) onNavigate('chapters');
  };

  if (prevBtn) {
    prevBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate && prevChapterNum) onNavigate('chapterDetail', { chapterNumber: prevChapterNum });
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate && nextChapterNum) onNavigate('chapterDetail', { chapterNumber: nextChapterNum });
    };
  }

  renderVerses();

  // Scroll to highlighted verse if present
  if (highlightVerseId) {
    setTimeout(() => {
      const targetCard = versesMount.querySelector(`[data-verse-id="${highlightVerseId}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  }

  return page;
}
