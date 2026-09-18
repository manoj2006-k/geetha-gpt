/**
 * Geetha GPT - Global Spotlight Search Modal (Ctrl+K / Search button)
 * Searches the complete 700-verse Bhagavad Gita dataset, 18 chapters, and topics.
 * Supports exact verse queries like "2.47", "18.78", "Karma", "Sthitaprajna", etc.
 */

import { CHAPTERS_DATA } from '../data/chaptersData.js';
import { VERSES_DATA } from '../data/versesData.js';
import { TOPICS_DATA } from '../data/topicsData.js';
import { CHAT_SUGGESTIONS } from '../data/chatMockData.js';
import { soundSynthesizer } from '../utils/soundUtil.js';

export function openSpotlightSearchModal(options = {}) {
  const { lang = 'en', onNavigate = null } = options;

  const existing = document.getElementById('spotlight-search-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'spotlight-search-modal';
  modal.className = 'fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-sm page-fade-in';

  modal.innerHTML = `
    <div class="relative w-full max-w-2xl bg-white dark:bg-[#1A1816] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[80vh]">
      <!-- Search Input Header -->
      <div class="flex items-center gap-3 px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-amber-500/5">
        <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input 
          type="text" 
          id="spotlight-input" 
          placeholder="${lang === 'te' ? '700 శ్లోకాలు, 18 అధ్యాయాలు లేదా ప్రశ్నను వెతకండి (ఉదా: 2.47, కర్మ, శాంతి)...' : 'Search all 700 verses, 18 chapters (e.g. 2.47, 18.78, Karma, Peace)...'}" 
          class="w-full bg-transparent border-none outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400 text-base font-medium" 
          autofocus
        />
        <kbd class="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">ESC</kbd>
      </div>

      <!-- Results Container -->
      <div id="spotlight-results" class="overflow-y-auto p-3 flex flex-col gap-1 max-h-[60vh]">
        <!-- Dynamic Results Injected Here -->
      </div>

      <!-- Footer Quick Tips -->
      <div class="flex items-center justify-between px-5 py-3 border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40 text-xs text-stone-500 dark:text-stone-400">
        <div class="flex items-center gap-2">
          <span>Search 700 Verses • 18 Chapters</span>
        </div>
        <span>Press <kbd class="px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">ESC</kbd> to close</span>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const input = modal.querySelector('#spotlight-input');
  const resultsContainer = modal.querySelector('#spotlight-results');

  function renderResults(q = '') {
    const query = q.toLowerCase().trim();
    resultsContainer.innerHTML = '';

    if (!query) {
      // Default: show quick suggested questions & popular topics
      const sectionHeader = document.createElement('div');
      sectionHeader.className = 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-400 font-cinzel';
      sectionHeader.textContent = lang === 'te' ? 'సూచించిన ప్రశ్నలు & శ్లోకాలు' : 'Suggested Questions & Quick Prompts';
      resultsContainer.appendChild(sectionHeader);

      CHAT_SUGGESTIONS.forEach(sug => {
        const item = document.createElement('button');
        item.className = 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-amber-500/10 text-left transition text-sm text-stone-700 dark:text-stone-200 group';
        item.innerHTML = `
          <span class="text-amber-600 dark:text-amber-400">💬</span>
          <span class="flex-1 font-medium group-hover:text-amber-700 dark:group-hover:text-amber-300 ${lang === 'te' ? 'font-telugu' : ''}">${lang === 'te' ? sug.te : sug.en}</span>
          <span class="text-xs text-stone-400 font-cinzel">Ask Geetha →</span>
        `;
        item.onclick = () => {
          modal.remove();
          soundSynthesizer.playChime();
          if (onNavigate) onNavigate('askGeetha', { query: lang === 'te' ? sug.te : sug.en });
        };
        resultsContainer.appendChild(item);
      });
      return;
    }

    // Check for exact verse dot notation like "2.47" or "18.78" or "2-47"
    const dotMatch = query.match(/^(\d{1,2})[\.\-\s](\d{1,2})$/);
    let exactVerse = null;
    if (dotMatch) {
      const cNum = parseInt(dotMatch[1], 10);
      const vNum = parseInt(dotMatch[2], 10);
      exactVerse = VERSES_DATA.find(v => v.chapter === cNum && v.verse === vNum);
    }

    // Match Verses from complete 700 dataset
    const matchedVerses = [];
    if (exactVerse) {
      matchedVerses.push(exactVerse);
    }

    VERSES_DATA.forEach(v => {
      if (exactVerse && v.id === exactVerse.id) return;
      if (matchedVerses.length >= 8) return;

      const dotFormat = `${v.chapter}.${v.verse}`;
      const hyphenFormat = `${v.chapter}-${v.verse}`;
      const matchId = dotFormat.includes(query) || hyphenFormat.includes(query) || v.id === query;
      const matchSanskrit = v.sanskrit && v.sanskrit.toLowerCase().includes(query);
      const matchTranslit = v.transliteration && v.transliteration.toLowerCase().includes(query);
      const matchTrans = v.englishTranslation && v.englishTranslation.toLowerCase().includes(query);
      const matchExpl = v.englishExplanation && v.englishExplanation.toLowerCase().includes(query);
      const matchTelugu = v.teluguTranslation && v.teluguTranslation.includes(query);
      const matchTopics = v.topics && v.topics.some(t => t.toLowerCase().includes(query));

      if (matchId || matchSanskrit || matchTranslit || matchTrans || matchExpl || matchTelugu || matchTopics) {
        matchedVerses.push(v);
      }
    });

    // Match Chapters
    const matchedChapters = CHAPTERS_DATA.filter(ch =>
      ch.englishTitle.toLowerCase().includes(query) ||
      ch.sanskritName.toLowerCase().includes(query) ||
      ch.sanskritTranslit.toLowerCase().includes(query) ||
      ch.teluguTitle.includes(query) ||
      String(ch.number) === query ||
      `chapter ${ch.number}`.includes(query) ||
      `ch ${ch.number}`.includes(query)
    ).slice(0, 3);

    // Match Topics
    const matchedTopics = TOPICS_DATA.filter(top =>
      top.name.toLowerCase().includes(query) ||
      top.teluguName.includes(query) ||
      top.sanskritName.toLowerCase().includes(query)
    ).slice(0, 3);

    let hasResults = false;

    if (matchedVerses.length > 0) {
      hasResults = true;
      const vHeader = document.createElement('div');
      vHeader.className = 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-cinzel mt-2 flex items-center justify-between';
      vHeader.innerHTML = `
        <span>${lang === 'te' ? 'శ్లోకాలు' : 'Verses'}</span>
        <span class="text-[10px] text-stone-400 font-sans">${matchedVerses.length} found</span>
      `;
      resultsContainer.appendChild(vHeader);

      matchedVerses.forEach(v => {
        const item = document.createElement('button');
        item.className = 'w-full flex items-start gap-3 px-3.5 py-2.5 rounded-xl hover:bg-amber-500/10 text-left transition text-sm text-stone-700 dark:text-stone-200 group';
        item.innerHTML = `
          <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-cinzel font-bold text-xs mt-0.5 whitespace-nowrap">BG ${v.chapter}.${v.verse}</span>
          <div class="flex-1 flex flex-col min-w-0">
            <span class="text-xs font-sanskrit text-stone-500 line-clamp-1">${v.sanskrit.split('\n')[0]}</span>
            <span class="font-medium text-stone-900 dark:text-stone-100 line-clamp-1 ${lang === 'te' ? 'font-telugu' : ''}">${lang === 'te' ? (v.teluguTranslation || v.englishTranslation) : v.englishTranslation}</span>
          </div>
          <span class="text-xs text-amber-600 font-cinzel font-semibold whitespace-nowrap group-hover:underline">View Verse →</span>
        `;
        item.onclick = () => {
          modal.remove();
          soundSynthesizer.playChime();
          if (onNavigate) onNavigate('verseDetail', { chapterNumber: v.chapter, verseNumber: v.verse });
        };
        resultsContainer.appendChild(item);
      });
    }

    if (matchedChapters.length > 0) {
      hasResults = true;
      const cHeader = document.createElement('div');
      cHeader.className = 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-cinzel mt-2';
      cHeader.textContent = lang === 'te' ? 'అధ్యాయాలు' : 'Chapters';
      resultsContainer.appendChild(cHeader);

      matchedChapters.forEach(ch => {
        const item = document.createElement('button');
        item.className = 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-amber-500/10 text-left transition text-sm text-stone-700 dark:text-stone-200 group';
        item.innerHTML = `
          <span class="w-6 h-6 rounded-lg bg-amber-600 text-white font-cinzel font-bold text-xs flex items-center justify-center">${ch.number}</span>
          <div class="flex-1 flex flex-col min-w-0">
            <span class="font-bold text-stone-900 dark:text-stone-100 ${lang === 'te' ? 'font-telugu' : 'font-cinzel'}">${lang === 'te' ? ch.teluguTitle : ch.englishTitle}</span>
            <span class="text-xs text-stone-400 font-sanskrit">${ch.sanskritName} • ${ch.verseCount || 72} Verses</span>
          </div>
          <span class="text-xs text-amber-600 font-semibold font-cinzel whitespace-nowrap">View Chapter →</span>
        `;
        item.onclick = () => {
          modal.remove();
          soundSynthesizer.playChime();
          if (onNavigate) onNavigate('chapterDetail', { chapterNumber: ch.number });
        };
        resultsContainer.appendChild(item);
      });
    }

    if (matchedTopics.length > 0) {
      hasResults = true;
      const tHeader = document.createElement('div');
      tHeader.className = 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-cinzel mt-2';
      tHeader.textContent = lang === 'te' ? 'జీవన అంశాలు' : 'Life Topics';
      resultsContainer.appendChild(tHeader);

      matchedTopics.forEach(top => {
        const item = document.createElement('button');
        item.className = 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-amber-500/10 text-left transition text-sm text-stone-700 dark:text-stone-200 group';
        item.innerHTML = `
          <span class="text-amber-600 text-lg">✦</span>
          <div class="flex-1 flex flex-col min-w-0">
            <span class="font-bold text-stone-900 dark:text-stone-100 ${lang === 'te' ? 'font-telugu' : 'font-cinzel'}">${lang === 'te' ? top.teluguName : top.name}</span>
            <span class="text-xs text-stone-400 font-sanskrit">${top.sanskritName}</span>
          </div>
          <span class="text-xs text-amber-600 font-semibold font-cinzel whitespace-nowrap">Explore →</span>
        `;
        item.onclick = () => {
          modal.remove();
          soundSynthesizer.playChime();
          if (onNavigate) onNavigate('topicDetail', { topicId: top.id });
        };
        resultsContainer.appendChild(item);
      });
    }

    // Direct Ask Geetha Option
    const askOption = document.createElement('button');
    askOption.className = 'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 text-left transition text-sm text-amber-900 dark:text-amber-200 font-semibold mt-3 group';
    askOption.innerHTML = `
      <span class="text-xl">🪔</span>
      <div class="flex-1">
        <span>${lang === 'te' ? `గీతా GPTని అడగండి: "${query}"` : `Ask Geetha GPT: "${query}"`}</span>
      </div>
      <span class="text-xs text-amber-700 dark:text-amber-300 font-cinzel whitespace-nowrap">Send Question →</span>
    `;
    askOption.onclick = () => {
      modal.remove();
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('askGeetha', { query: query });
    };
    resultsContainer.appendChild(askOption);

    if (!hasResults) {
      const noRes = document.createElement('div');
      noRes.className = 'p-6 text-center text-xs text-stone-500 flex flex-col items-center gap-2';
      noRes.innerHTML = `
        <span>No specific verses or chapters matched "${query}"</span>
        <span>Try searching for "Karma", "2.47", "18.78", or click above to ask Geetha GPT directly.</span>
      `;
      resultsContainer.prepend(noRes);
    }
  }

  input.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.remove();
    } else if (e.key === 'Enter') {
      const firstBtn = resultsContainer.querySelector('button');
      if (firstBtn) firstBtn.click();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  renderResults('');
}
