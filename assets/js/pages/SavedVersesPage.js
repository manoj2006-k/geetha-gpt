/**
 * Geetha GPT - Saved Verses (Bookmarks) Page
 */

import { I18N } from '../data/i18n.js';
import { VERSES_DATA } from '../data/versesData.js';
import { storageManager } from '../utils/storageUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from '../components/Toast.js';

export function renderSavedVersesPage(options = {}) {
  const {
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    onNavigate = null
  } = options;

  const t = I18N[lang] || I18N.en;
  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-8 pb-16 page-fade-in max-w-5xl mx-auto px-4 sm:px-6';

  function renderList() {
    const savedBookmarks = storageManager.getSavedVerses();
    const savedIds = savedBookmarks.map(b => b.verseId);
    const versesList = VERSES_DATA.filter(v => savedIds.includes(v.id));

    page.innerHTML = `
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div class="flex flex-col gap-1">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-semibold w-max">
            <span>🔖</span>
            <span class="${lang === 'te' ? 'font-telugu' : 'font-cinzel'}">${versesList.length} ${lang === 'te' ? 'భద్రపరిచిన శ్లోకాలు' : 'Bookmarked Verses'}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 font-cinzel">
            ${lang === 'te' ? 'భద్రపరిచిన శ్లోకాలు' : 'Saved Verses'}
          </h1>
          <p class="text-stone-600 dark:text-stone-300 text-sm sm:text-base ${lang === 'te' ? 'font-telugu' : ''}">
            ${lang === 'te' ? 'మీరు ఎంచుకున్న పవిత్ర శ్లోకాలు మరియు మార్గదర్శక సూత్రాలు.' : 'Your collection of meaningful teachings.'}
          </p>
        </div>

        <!-- Export & Clear Actions -->
        ${
          versesList.length > 0
            ? `
            <div class="flex items-center gap-2 self-start sm:self-auto">
              <button id="export-saved-btn" class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500 bg-white dark:bg-[#1A1816] text-stone-700 dark:text-stone-300 text-xs font-bold transition shadow-sm">
                <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>${t.saved.exportText}</span>
              </button>

              <button id="clear-saved-btn" class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-xs font-bold transition">
                <span>✕</span>
                <span>${t.saved.clearAll}</span>
              </button>
            </div>
            `
            : ''
        }
      </div>

      <!-- Content Container -->
      <div id="saved-verses-content" class="flex flex-col gap-6"></div>
    `;

    const contentContainer = page.querySelector('#saved-verses-content');

    if (versesList.length === 0) {
      // Empty State Design
      contentContainer.innerHTML = `
        <div class="py-20 px-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 text-center flex flex-col items-center gap-4 shadow-sm">
          <div class="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl">
            <span>🪔</span>
          </div>
          <div class="flex flex-col gap-1 max-w-md">
            <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100 font-cinzel">
              ${t.saved.emptyTitle}
            </h3>
            <p class="text-sm text-stone-500 dark:text-stone-400 leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
              ${t.saved.emptySubtitle}
            </p>
          </div>
          <button id="saved-discover-btn" class="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition hover-lift mt-2">
            <span>✨</span>
            <span>${t.saved.exploreBtn}</span>
          </button>
        </div>
      `;

      contentContainer.querySelector('#saved-discover-btn').onclick = () => {
        soundSynthesizer.playChime();
        if (onNavigate) onNavigate('chapters');
      };
      return;
    }

    // Render Saved Verse Cards
    versesList.forEach(verse => {
      const bookmark = savedBookmarks.find(b => b.verseId === verse.id);
      const translationText = lang === 'te' ? (verse.teluguTranslation || verse.englishTranslation) : verse.englishTranslation;
      const explanationText = lang === 'te' ? (verse.teluguExplanation || verse.englishExplanation) : verse.englishExplanation;

      let scriptText = verse.sanskrit;
      if (sanskritDisplay === 'translit') scriptText = verse.transliteration;
      else if (sanskritDisplay === 'telugu') scriptText = verse.teluguSanskrit || verse.sanskrit;

      const card = document.createElement('div');
      card.className = 'group relative bg-white dark:bg-[#1A1816] rounded-2xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4';

      card.innerHTML = `
        <div class="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 pb-3">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 font-cinzel font-bold text-xs">
              Bhagavad Gita ${verse.chapter}.${verse.verse}
            </span>
            <span class="text-xs text-stone-500 dark:text-stone-400 font-medium">
              ${lang === 'te' ? `అధ్యాయం ${verse.chapter}, శ్లోకం ${verse.verse}` : `Chapter ${verse.chapter}, Verse ${verse.verse}`}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button class="open-verse-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 text-xs font-bold transition">
              <span>Open</span>
              <span>→</span>
            </button>

            <button class="remove-saved-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-xs font-bold transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              <span>Remove</span>
            </button>
          </div>
        </div>

        <!-- Sanskrit -->
        <div class="p-4 rounded-xl bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border border-amber-500/15 text-center">
          <p class="font-sanskrit text-base md:text-lg text-stone-900 dark:text-amber-100 font-semibold leading-relaxed whitespace-pre-line">
            ${scriptText}
          </p>
        </div>

        <!-- Translation -->
        <div class="flex flex-col gap-1">
          <span class="text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 font-cinzel">
            ${lang === 'te' ? 'తాత్పర్యం' : 'Translation'}
          </span>
          <p class="text-stone-700 dark:text-stone-200 text-sm md:text-base leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
            ${translationText}
          </p>
        </div>

        <!-- Short Explanation -->
        <div class="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-900/40 border border-stone-100 dark:border-stone-800 text-xs md:text-sm text-stone-600 dark:text-stone-300">
          <p class="leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
            ${explanationText}
          </p>
        </div>
      `;

      card.querySelector('.open-verse-btn').onclick = () => {
        soundSynthesizer.playZenBell();
        if (onNavigate) onNavigate('chapterDetail', { chapterNumber: verse.chapter, highlightVerseId: verse.id });
      };

      card.querySelector('.remove-saved-btn').onclick = () => {
        storageManager.removeVerse(verse.id);
        soundSynthesizer.playChime();
        toastManager.show(lang === 'te' ? "శ్లోకం తొలగించబడింది" : "Verse removed from saved", "info");
        renderList();
      };

      contentContainer.appendChild(card);
    });

    // Export button
    const exportBtn = page.querySelector('#export-saved-btn');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const text = versesList
          .map(
            (v, idx) =>
              `${idx + 1}. Bhagavad Gita Chapter ${v.chapter}, Verse ${v.verse}\n\n${v.sanskrit}\n\nTranslation: ${v.englishTranslation}\n\nCommentary: ${v.englishExplanation}\n\n---\n`
          )
          .join('\n');

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'GeethaGPT_Saved_Verses.txt';
        a.click();
        soundSynthesizer.playZenBell();
        toastManager.show(lang === 'te' ? "శ్లోకాలు ఎగుమతి చేయబడ్డాయి!" : "Bookmarks exported successfully!", "success");
      };
    }

    // Clear all button
    const clearBtn = page.querySelector('#clear-saved-btn');
    if (clearBtn) {
      clearBtn.onclick = () => {
        if (confirm(lang === 'te' ? "అన్ని భద్రపరిచిన శ్లోకాలను తొలగించాలా?" : "Are you sure you want to clear all saved verses?")) {
          localStorage.setItem('geetha_gpt_saved_verses', JSON.stringify([]));
          renderList();
          toastManager.show(lang === 'te' ? "అన్ని శ్లోకాలు తొలగించబడ్డాయి" : "All bookmarks cleared", "info");
        }
      };
    }
  }

  renderList();
  return page;
}
