/**
 * Geetha GPT - Chapters Page Component
 * Renders complete 18 Chapters grid with live search & multi-category filtering.
 */

import { CHAPTERS_DATA } from '../data/chaptersData.js';
import { renderChapterCard } from '../components/ChapterCard.js';
import { soundSynthesizer } from '../utils/soundUtil.js';

export function renderChaptersPage(options = {}) {
  const { lang = 'en', onNavigate = null } = options;

  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-8 pb-16 page-fade-in max-w-6xl mx-auto px-4 sm:px-6';

  let currentCategory = 'All Chapters';
  let searchQuery = '';

  const categories = [
    'All Chapters',
    'Knowledge',
    'Action',
    'Meditation',
    'Devotion',
    'Self-Realization'
  ];

  page.innerHTML = `
    <!-- Header Section -->
    <div class="flex flex-col gap-2 mt-2">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-semibold w-max">
        <span>📖</span>
        <span class="font-cinzel">18 Chapters • 700 Verses</span>
      </div>
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-stone-100 font-cinzel">
        Explore the Bhagavad Gita
      </h1>
      <p class="text-stone-600 dark:text-stone-300 text-sm sm:text-base">
        18 Chapters • 700 Verses
      </p>
    </div>

    <!-- Search & Filter Controls -->
    <div class="flex flex-col gap-4">
      <!-- Search Input Bar -->
      <div class="relative w-full max-w-xl">
        <input 
          type="text" 
          id="chapters-search-input" 
          placeholder="Search chapters..." 
          class="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm font-medium shadow-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition" 
        />
        <svg class="w-5 h-5 text-amber-600 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap items-center gap-2" id="filter-buttons-container">
        ${categories
          .map(cat => {
            const isActive = cat === currentCategory;
            return `
            <button 
              data-cat="${cat}" 
              class="cat-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isActive
                  ? 'bg-amber-600 text-white shadow-amber-600/20'
                  : 'bg-white dark:bg-[#1A1816] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/40'
              }"
            >
              ${cat}
            </button>
          `;
          })
          .join('')}
      </div>
    </div>

    <!-- Active Filter Counter Summary -->
    <div class="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 border-b border-stone-200/80 dark:border-stone-800 pb-2">
      <span id="chapters-count-text">Showing 18 of 18 Chapters</span>
    </div>

    <!-- Chapters Responsive Grid: 3 Desktop, 2 Tablet, 1 Mobile -->
    <div id="chapters-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
  `;

  const gridMount = page.querySelector('#chapters-grid');
  const searchInput = page.querySelector('#chapters-search-input');
  const countText = page.querySelector('#chapters-count-text');
  const filterBtns = page.querySelectorAll('.cat-filter-btn');

  function renderGrid() {
    gridMount.innerHTML = '';

    const cleanQuery = searchQuery.trim().toLowerCase();

    const filtered = CHAPTERS_DATA.filter(ch => {
      // Category Match
      const matchesCategory =
        currentCategory === 'All Chapters' ||
        (ch.categories && ch.categories.includes(currentCategory)) ||
        ch.category === currentCategory;

      // Search Match
      const matchesSearch =
        !cleanQuery ||
        ch.number.toString() === cleanQuery ||
        ch.formattedNumber.toString() === cleanQuery ||
        ch.sanskritName.toLowerCase().includes(cleanQuery) ||
        ch.sanskritTranslit.toLowerCase().includes(cleanQuery) ||
        ch.englishTitle.toLowerCase().includes(cleanQuery) ||
        ch.englishSummary.toLowerCase().includes(cleanQuery) ||
        (ch.keyThemes && ch.keyThemes.some(th => th.toLowerCase().includes(cleanQuery)));

      return matchesCategory && matchesSearch;
    });

    countText.textContent = `Showing ${filtered.length} of 18 Chapters`;

    if (filtered.length === 0) {
      gridMount.innerHTML = `
        <div class="col-span-full py-16 px-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 text-center flex flex-col items-center gap-3">
          <span class="text-3xl">🔍</span>
          <h3 class="text-lg font-bold font-cinzel text-stone-800 dark:text-stone-200">No chapters match your search</h3>
          <p class="text-xs text-stone-500">Try searching for "Bhakti", "Meditation", "Knowledge", or numbers 1-18.</p>
          <button id="reset-search-btn" class="mt-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-900 dark:text-amber-200 text-xs font-bold">Clear Filters</button>
        </div>
      `;
      gridMount.querySelector('#reset-search-btn').onclick = () => {
        searchQuery = '';
        currentCategory = 'All Chapters';
        searchInput.value = '';
        updateActiveButton();
        renderGrid();
      };
      return;
    }

    filtered.forEach(chapter => {
      const card = renderChapterCard(chapter, {
        lang,
        onExplore: (num) => {
          if (onNavigate) onNavigate('chapterDetail', { chapterNumber: num });
        }
      });
      gridMount.appendChild(card);
    });
  }

  function updateActiveButton() {
    filterBtns.forEach(btn => {
      const cat = btn.dataset.cat;
      const isActive = cat === currentCategory;
      btn.className = `cat-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
        isActive
          ? 'bg-amber-600 text-white shadow-amber-600/20'
          : 'bg-white dark:bg-[#1A1816] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/40'
      }`;
    });
  }

  filterBtns.forEach(btn => {
    btn.onclick = () => {
      currentCategory = btn.dataset.cat;
      soundSynthesizer.playChime();
      updateActiveButton();
      renderGrid();
    };
  });

  searchInput.oninput = (e) => {
    searchQuery = e.target.value;
    renderGrid();
  };

  renderGrid();
  return page;
}
