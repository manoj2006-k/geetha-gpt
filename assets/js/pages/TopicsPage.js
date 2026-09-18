/**
 * Geetha GPT - Topics Grid Page
 */

import { I18N } from '../data/i18n.js';
import { TOPICS_DATA } from '../data/topicsData.js';
import { renderTopicCard } from '../components/TopicCard.js';
import { soundSynthesizer } from '../utils/soundUtil.js';

export function renderTopicsPage(options = {}) {
  const { lang = 'en', onNavigate = null } = options;
  const t = I18N[lang] || I18N.en;

  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-8 pb-16 page-fade-in max-w-6xl mx-auto px-4 sm:px-6';

  let searchQuery = '';

  page.innerHTML = `
    <!-- Header -->
    <div class="flex flex-col gap-3 text-center sm:text-left mt-2">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-semibold w-max self-center sm:self-start">
        <span>🧭</span>
        <span class="${lang === 'te' ? 'font-telugu' : 'font-cinzel'}">${lang === 'te' ? '16 జీవిత అంశాలు' : '16 Life Areas & Emotions'}</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 font-cinzel">
        ${t.topics.title}
      </h1>
      <p class="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-3xl ${lang === 'te' ? 'font-telugu' : ''}">
        ${t.topics.subtitle}
      </p>
    </div>

    <!-- Search Input -->
    <div class="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-5">
      <div class="relative w-full max-w-md">
        <input 
          type="text" 
          id="topics-search-input" 
          placeholder="${t.topics.searchPlaceholder}" 
          class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1816] border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 placeholder-stone-400 text-sm font-medium focus:outline-none focus:border-amber-500 shadow-sm" 
        />
        <svg class="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
    </div>

    <!-- Topics 4-column Grid -->
    <div id="topics-grid-mount" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"></div>
  `;

  const gridMount = page.querySelector('#topics-grid-mount');
  const searchInput = page.querySelector('#topics-search-input');

  function renderFilteredTopics() {
    gridMount.innerHTML = '';
    const q = searchQuery.toLowerCase().trim();

    const list = TOPICS_DATA.filter(top =>
      !q ||
      top.name.toLowerCase().includes(q) ||
      top.teluguName.includes(q) ||
      top.sanskritName.toLowerCase().includes(q) ||
      top.tagline.toLowerCase().includes(q)
    );

    if (list.length === 0) {
      gridMount.innerHTML = `
        <div class="col-span-full py-16 text-center text-stone-500 dark:text-stone-400">
          <p class="text-base font-semibold">No topics found matching "${searchQuery}"</p>
        </div>
      `;
      return;
    }

    list.forEach(topic => {
      const card = renderTopicCard(topic, {
        lang,
        onSelect: (top) => {
          soundSynthesizer.playChime();
          if (onNavigate) onNavigate('topicDetail', { topicId: top.id });
        }
      });
      gridMount.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  searchInput.oninput = (e) => {
    searchQuery = e.target.value;
    renderFilteredTopics();
  };

  renderFilteredTopics();
  return page;
}

