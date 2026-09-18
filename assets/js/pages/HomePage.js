/**
 * Geetha GPT - Home Dashboard Page
 */

import { I18N } from '../data/i18n.js';
import { VERSES_DATA } from '../data/versesData.js';
import { TOPICS_DATA } from '../data/topicsData.js';
import { CHAPTERS_DATA } from '../data/chaptersData.js';
import { CHAT_SUGGESTIONS } from '../data/chatMockData.js';
import { renderVerseCard } from '../components/VerseCard.js';
import { renderTopicCard } from '../components/TopicCard.js';
import { soundSynthesizer } from '../utils/soundUtil.js';

export function renderHomePage(options = {}) {
  const {
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    onNavigate = null
  } = options;

  const t = I18N[lang] || I18N.en;
  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-10 pb-16 page-fade-in max-w-6xl mx-auto px-4 sm:px-6';

  // Today's Wisdom Verse (BG 2.47 default)
  const todaysVerse = VERSES_DATA.find(v => v.id === '2-47') || VERSES_DATA[0];

  // 8 Highlight Topics for Home
  const featuredTopicIds = ['stress', 'fear', 'anger', 'success', 'failure', 'career', 'relationships', 'discipline'];
  const featuredTopics = TOPICS_DATA.filter(t => featuredTopicIds.includes(t.id));

  page.innerHTML = `
    <!-- Hero Section -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-6 sm:p-10 md:p-12 text-center flex flex-col items-center gap-6 mt-4 shadow-sm">
      <!-- Background Sacred Geometry Motif -->
      <div class="absolute -top-24 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Diya Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-semibold shadow-sm">
        <span class="animate-flame">🪔</span>
        <span class="${lang === 'te' ? 'font-telugu' : 'font-cinzel'}">${lang === 'te' ? 'భగవద్గీత ఆధారిత దివ్య మార్గదర్శకత్వం' : 'AI-Inspired Bhagavad Gita Wisdom Platform'}</span>
      </div>

      <!-- Title & Subtitle -->
      <div class="flex flex-col gap-3 max-w-3xl">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-900 dark:text-stone-100 font-cinzel leading-tight tracking-tight">
          ${t.home.heroTitle}
        </h1>
        <p class="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
          ${t.home.heroSubtitle}
        </p>
      </div>

      <!-- Interactive Search / Chat Bar -->
      <div class="w-full max-w-2xl relative z-10 flex flex-col gap-3">
        <div class="relative flex items-center bg-white dark:bg-[#1A1816] rounded-2xl shadow-xl shadow-amber-900/5 border border-amber-500/30 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15 transition-all p-1.5 sm:p-2">
          <span class="pl-3 pr-2 text-amber-600 dark:text-amber-400 text-lg">🪔</span>
          <input 
            type="text" 
            id="hero-search-input" 
            placeholder="${t.home.searchInputPlaceholder}" 
            class="w-full bg-transparent border-none outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm sm:text-base px-2 py-2 font-medium"
          />
          <button 
            id="hero-ask-btn" 
            class="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/25 transition hover-lift flex-shrink-0"
          >
            <span>${t.home.askBtn}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

        <!-- Quick Question Suggestions Chips -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span class="text-xs font-semibold text-stone-500 dark:text-stone-400 font-cinzel">${t.home.popularQuestions}:</span>
          ${CHAT_SUGGESTIONS.slice(0, 3)
            .map(
              sug => `
              <button class="hero-chip-btn px-3 py-1 rounded-full bg-white/80 dark:bg-stone-800/80 hover:bg-amber-500/15 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-200 border border-stone-200 dark:border-stone-700 text-xs font-medium transition shadow-sm ${lang === 'te' ? 'font-telugu' : ''}" data-prompt="${lang === 'te' ? sug.te : sug.en}">
                "${lang === 'te' ? sug.te : sug.en}"
              </button>
            `
            )
            .join('')}
        </div>
      </div>

      <!-- Hero Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button id="hero-explore-btn" class="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#1A1816] text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:border-amber-500 font-bold text-sm shadow-sm transition hover-lift">
          <i data-lucide="BookOpen" class="w-4 h-4 text-amber-600"></i>
          <span>${t.home.exploreBtn}</span>
        </button>
      </div>
    </section>

    <!-- Gita Key Stats Widget -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="p-4 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col items-center text-center">
        <span class="text-2xl sm:text-3xl font-extrabold font-cinzel text-amber-600 dark:text-amber-400">${t.home.stats.chaptersCount}</span>
        <span class="text-xs text-stone-500 dark:text-stone-400 font-semibold mt-1">${t.home.stats.chaptersLabel}</span>
      </div>
      <div class="p-4 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col items-center text-center">
        <span class="text-2xl sm:text-3xl font-extrabold font-cinzel text-amber-600 dark:text-amber-400">${t.home.stats.versesCount}</span>
        <span class="text-xs text-stone-500 dark:text-stone-400 font-semibold mt-1">${t.home.stats.versesLabel}</span>
      </div>
      <div class="p-4 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col items-center text-center">
        <span class="text-2xl sm:text-3xl font-extrabold font-cinzel text-amber-600 dark:text-amber-400">${t.home.stats.yogasCount}</span>
        <span class="text-xs text-stone-500 dark:text-stone-400 font-semibold mt-1">${t.home.stats.yogasLabel}</span>
      </div>
      <div class="p-4 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col items-center text-center">
        <span class="text-2xl sm:text-3xl font-extrabold font-cinzel text-amber-600 dark:text-amber-400">${t.home.stats.timelessCount}</span>
        <span class="text-xs text-stone-500 dark:text-stone-400 font-semibold mt-1">${t.home.stats.timelessLabel}</span>
      </div>
    </section>

    <!-- Today's Wisdom Card Section -->
    <section class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center text-base">
            <span>✨</span>
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-cinzel">
              ${t.home.todaysWisdom}
            </h2>
          </div>
        </div>

        <button id="view-daily-wisdom-btn" class="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">
          <span>${lang === 'te' ? 'పూర్తి వివరణ' : 'Daily Contemplation'}</span>
          <span>→</span>
        </button>
      </div>

      <!-- Mount Today's Verse Card -->
      <div id="home-todays-verse-mount"></div>
    </section>

    <!-- Popular Life Topics Section -->
    <section class="flex flex-col gap-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider font-cinzel text-xs">
            <span>✦</span>
            <span>${lang === 'te' ? 'మానసిక విశ్లేషణ' : 'Spiritual Psychology'}</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-cinzel">
            ${t.home.lifeTopicsTitle}
          </h2>
          <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 ${lang === 'te' ? 'font-telugu' : ''}">
            ${t.home.lifeTopicsSubtitle}
          </p>
        </div>

        <button id="view-all-topics-btn" class="flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 transition">
          <span>${t.home.allTopicsBtn}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

      <!-- Topics 4x2 Grid -->
      <div id="home-topics-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"></div>
    </section>

    <!-- 18 Chapters Spotlight Carousel / Preview -->
    <section class="flex flex-col gap-5">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-cinzel">
            ${t.home.chaptersPreviewTitle}
          </h2>
          <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5 ${lang === 'te' ? 'font-telugu' : ''}">
            ${t.home.chaptersPreviewSubtitle}
          </p>
        </div>

        <button id="view-all-chapters-btn" class="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 hover:underline">
          ${t.home.viewAllChapters} →
        </button>
      </div>

      <!-- Quick 3 Featured Chapters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${[CHAPTERS_DATA[1], CHAPTERS_DATA[2], CHAPTERS_DATA[17]]
          .map(ch => `
          <div class="quick-chapter-card bg-white dark:bg-[#1A1816] rounded-2xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:border-amber-500/50 transition cursor-pointer hover-lift flex flex-col justify-between" data-chap="${ch.number}">
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 font-cinzel font-bold text-xs flex items-center justify-center">
                  ${ch.number}
                </span>
                <span class="text-[11px] font-semibold text-stone-400">${ch.verseCount} verses</span>
              </div>
              <h4 class="font-bold text-stone-900 dark:text-stone-100 font-cinzel text-base">${lang === 'te' ? ch.teluguTitle : ch.englishTitle}</h4>
              <p class="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">${lang === 'te' ? ch.teluguSummary : ch.englishSummary}</p>
            </div>
            <span class="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3 flex items-center gap-1">
              <span>Explore Chapter</span>
              <span>→</span>
            </span>
          </div>
        `)
          .join('')}
      </div>
    </section>
  `;

  // Mount Today's Verse Card
  const verseMount = page.querySelector('#home-todays-verse-mount');
  const verseCard = renderVerseCard(todaysVerse, {
    lang,
    theme,
    sanskritDisplay,
    showExplanation: true,
    showPractical: true
  });
  verseMount.appendChild(verseCard);

  // Mount Featured Topics
  const topicsGrid = page.querySelector('#home-topics-grid');
  featuredTopics.forEach(topic => {
    const card = renderTopicCard(topic, {
      lang,
      onSelect: (top) => {
        soundSynthesizer.playChime();
        if (onNavigate) onNavigate('topicDetail', { topicId: top.id });
      }
    });
    topicsGrid.appendChild(card);
  });

  // Attach Event Handlers
  const heroSearchInput = page.querySelector('#hero-search-input');
  const heroAskBtn = page.querySelector('#hero-ask-btn');
  const heroExploreBtn = page.querySelector('#hero-explore-btn');
  const viewDailyBtn = page.querySelector('#view-daily-wisdom-btn');
  const viewAllTopicsBtn = page.querySelector('#view-all-topics-btn');
  const viewAllChaptersBtn = page.querySelector('#view-all-chapters-btn');

  const executeAsk = () => {
    const query = heroSearchInput.value.trim();
    soundSynthesizer.playZenBell();
    if (onNavigate) onNavigate('askGeetha', { query: query || undefined });
  };

  heroAskBtn.onclick = executeAsk;
  heroSearchInput.onkeydown = (e) => {
    if (e.key === 'Enter') executeAsk();
  };

  page.querySelectorAll('.hero-chip-btn').forEach(btn => {
    btn.onclick = () => {
      const prompt = btn.dataset.prompt;
      soundSynthesizer.playZenBell();
      if (onNavigate) onNavigate('askGeetha', { query: prompt });
    };
  });

  if (heroExploreBtn) {
    heroExploreBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('chapters');
    };
  }

  if (viewDailyBtn) {
    viewDailyBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('dailyWisdom');
    };
  }

  if (viewAllTopicsBtn) {
    viewAllTopicsBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('topics');
    };
  }

  if (viewAllChaptersBtn) {
    viewAllChaptersBtn.onclick = () => {
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('chapters');
    };
  }

  page.querySelectorAll('.quick-chapter-card').forEach(card => {
    card.onclick = () => {
      const chapNum = parseInt(card.dataset.chap, 10);
      soundSynthesizer.playChime();
      if (onNavigate) onNavigate('chapterDetail', { chapterNumber: chapNum });
    };
  });

  return page;
}

