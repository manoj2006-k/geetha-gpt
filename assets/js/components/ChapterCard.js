/**
 * Geetha GPT - Chapter Card Component
 * Renders individual chapter card with elegant layout, numbers, Sanskrit, English titles,
 * verse counts, short descriptions, and "Explore Chapter →" button.
 */

import { soundSynthesizer } from '../utils/soundUtil.js';
import { getScriptFontClass } from '../data/languages.js';

export function renderChapterCard(chapter, options = {}) {
  const { lang = 'en', onExplore = null } = options;

  const formattedNum = chapter.formattedNumber || (chapter.number < 10 ? `0${chapter.number}` : `${chapter.number}`);
  const title = lang === 'te' ? chapter.teluguTitle : (lang === 'hi' && chapter.hindiTitle ? chapter.hindiTitle : (lang === 'sa' ? chapter.sanskritName : chapter.englishTitle));
  const summary = lang === 'te' ? chapter.teluguSummary : (lang === 'hi' && chapter.hindiSummary ? chapter.hindiSummary : chapter.englishSummary);

  const card = document.createElement('div');
  card.className = 'group relative bg-white dark:bg-[#1A1816] rounded-2xl p-6 border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer';
  card.dataset.chapterNumber = chapter.number;

  card.innerHTML = `
    <div class="flex flex-col gap-3">
      <!-- Chapter Number Badge & Category Pill -->
      <div class="flex items-center justify-between">
        <span class="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-cinzel font-bold text-sm flex items-center justify-center border border-amber-500/20 shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
          ${formattedNum}
        </span>
        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-stone-700">
          ${chapter.verseCount} Verses
        </span>
      </div>

      <!-- Sanskrit & Transliteration Titles -->
      <div class="flex flex-col gap-0.5 mt-1">
        <h4 class="font-sanskrit text-stone-900 dark:text-amber-100 font-bold text-base md:text-lg">
          ${chapter.sanskritName}
        </h4>
        <h3 class="font-cinzel font-bold text-amber-700 dark:text-amber-400 text-base group-hover:text-amber-600 transition-colors">
          ${chapter.sanskritTranslit}
        </h3>
      </div>

      <!-- Subtitle -->
      <p class="text-xs font-semibold text-stone-500 dark:text-stone-400 italic ${getScriptFontClass(lang)}">
        ${title}
      </p>

      <!-- Description -->
      <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3 mt-1 ${getScriptFontClass(lang)}">
        ${summary}
      </p>
    </div>

    <!-- Bottom Action Button: Explore Chapter → -->
    <div class="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
      <button class="explore-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 hover:bg-amber-600 dark:hover:bg-amber-600 text-amber-900 dark:text-amber-200 hover:text-white dark:hover:text-white font-cinzel font-bold text-xs transition duration-200">
        <span>Explore Chapter</span>
        <span>→</span>
      </button>
    </div>
  `;

  const handleOpen = () => {
    soundSynthesizer.playChime();
    if (onExplore) onExplore(chapter.number);
  };

  card.onclick = handleOpen;

  return card;
}

