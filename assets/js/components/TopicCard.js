/**
 * Geetha GPT - Reusable Topic Card Component
 */

export function renderTopicCard(topic, options = {}) {
  const { lang = 'en', onSelect = null } = options;

  const card = document.createElement('div');
  card.className = 'group relative bg-white dark:bg-[#1A1816] rounded-2xl p-5 md:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-amber-500/50 dark:hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover-lift';

  const title = lang === 'te' ? topic.teluguName : topic.name;
  const tagline = lang === 'te' ? topic.teluguTagline : topic.tagline;

  card.innerHTML = `
    <!-- Glowing subtle background accent -->
    <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition duration-500"></div>

    <div class="flex flex-col gap-3 relative z-10">
      <!-- Top Icon & Sanskrit Tag -->
      <div class="flex items-center justify-between">
        <div class="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300 shadow-sm">
          <i data-lucide="${topic.icon || 'Sparkles'}" class="w-6 h-6"></i>
        </div>
        <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800/90 text-stone-600 dark:text-stone-300 font-sanskrit">
          ${topic.sanskritName}
        </span>
      </div>

      <!-- Title & Tagline -->
      <div class="flex flex-col gap-1 mt-1">
        <h3 class="text-base md:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition font-cinzel">
          ${title}
        </h3>
        <p class="text-xs md:text-sm text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
          ${tagline}
        </p>
      </div>
    </div>

    <!-- Bottom Verse Count & Arrow -->
    <div class="flex items-center justify-between pt-4 mt-3 border-t border-stone-100 dark:border-stone-800/80 text-xs font-medium text-stone-500 dark:text-stone-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition relative z-10">
      <span class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        ${topic.keyVerses.length} ${lang === 'te' ? 'ఎంపిక చేసిన శ్లోకాలు' : 'Curated Verses'}
      </span>
      <span class="flex items-center gap-1 group-hover:translate-x-1 transition duration-200 text-amber-600 dark:text-amber-400 font-semibold">
        <span>${lang === 'te' ? 'చూడండి' : 'Explore'}</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </span>
    </div>
  `;

  card.onclick = () => {
    if (onSelect) onSelect(topic);
  };

  return card;
}

