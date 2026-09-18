/**
 * Geetha GPT - Topic Detail View Page
 */

import { I18N } from '../data/i18n.js';
import { TOPICS_DATA } from '../data/topicsData.js';
import { VERSES_DATA } from '../data/versesData.js';
import { renderVerseCard } from '../components/VerseCard.js';
import { soundSynthesizer } from '../utils/soundUtil.js';

export function renderTopicDetailPage(options = {}) {
  const {
    topicId = 'stress',
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    onNavigate = null
  } = options;

  const t = I18N[lang] || I18N.en;
  const topic = TOPICS_DATA.find(tp => tp.id === topicId) || TOPICS_DATA[0];

  // Match verses
  const matchedVerses = VERSES_DATA.filter(v => topic.keyVerses.includes(v.id));

  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-8 pb-16 page-fade-in max-w-5xl mx-auto px-4 sm:px-6';

  const title = lang === 'te' ? topic.teluguName : topic.name;
  const tagline = lang === 'te' ? topic.teluguTagline : topic.tagline;
  const description = lang === 'te' ? topic.teluguDescription : topic.description;
  const reflections = lang === 'te' ? topic.teluguReflections : topic.reflections;

  page.innerHTML = `
    <!-- Top Back Button -->
    <div class="flex items-center justify-between mt-2">
      <button id="back-to-topics-btn" class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 bg-white dark:bg-[#1A1816] text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-amber-600 transition shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        <span>Back to All Topics</span>
      </button>

      <button id="topic-ask-btn" class="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition hover-lift">
        <span>🪔</span>
        <span>Ask Geetha about ${title}</span>
      </button>
    </div>

    <!-- Topic Hero Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/25 p-6 sm:p-8 md:p-10 flex flex-col gap-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-2xl shadow-sm">
          <i data-lucide="${topic.icon || 'Sparkles'}" class="w-6 h-6"></i>
        </div>
        <div class="flex flex-col">
          <span class="font-sanskrit text-sm text-stone-500 dark:text-stone-400 font-semibold">${topic.sanskritName}</span>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold font-cinzel text-stone-900 dark:text-stone-100">
            ${title}
          </h1>
        </div>
      </div>

      <p class="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
        ${description}
      </p>

      <!-- Self-Reflection Questions Box -->
      <div class="mt-2 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-stone-900/60 border border-amber-500/20 flex flex-col gap-2.5">
        <div class="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider font-cinzel text-xs">
          <span>🧠</span>
          <span>${t.topics.reflectionsTitle}</span>
        </div>
        <ul class="flex flex-col gap-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 ${lang === 'te' ? 'font-telugu' : ''}">
          ${reflections
            .map(
              ref => `
              <li class="flex items-start gap-2">
                <span class="text-amber-600 dark:text-amber-400 font-bold mt-0.5">✦</span>
                <span>${ref}</span>
              </li>
            `
            )
            .join('')}
        </ul>
      </div>
    </div>

    <!-- Curated Key Verses Section -->
    <div class="flex flex-col gap-5">
      <div class="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-3">
        <h3 class="text-xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
          ${t.topics.versesCountLabel} (${matchedVerses.length})
        </h3>
      </div>

      <!-- Verses Mount -->
      <div id="topic-verses-mount" class="flex flex-col gap-6"></div>
    </div>
  `;

  const versesMount = page.querySelector('#topic-verses-mount');
  const backBtn = page.querySelector('#back-to-topics-btn');
  const topicAskBtn = page.querySelector('#topic-ask-btn');

  matchedVerses.forEach(verse => {
    const card = renderVerseCard(verse, {
      lang,
      theme,
      sanskritDisplay,
      showExplanation: true,
      showPractical: true
    });
    versesMount.appendChild(card);
  });

  backBtn.onclick = () => {
    soundSynthesizer.playChime();
    if (onNavigate) onNavigate('topics');
  };

  topicAskBtn.onclick = () => {
    soundSynthesizer.playZenBell();
    if (onNavigate) {
      onNavigate('askGeetha', {
        query: lang === 'te' ? `${topic.teluguName} గురించి భగవద్గీత ఏం చెబుతోంది?` : `What does the Bhagavad Gita teach about overcoming ${topic.name}?`
      });
    }
  };

  if (window.lucide) window.lucide.createIcons();
  return page;
}

