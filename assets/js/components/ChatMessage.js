/**
 * Geetha GPT - Reusable Chat Message Component
 */

import { renderVerseCard } from './VerseCard.js';
import { speechEngine } from '../utils/speechUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from './Toast.js';

export function renderChatMessage(message, options = {}) {
  const {
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    onExplainMore = null,
    onRelatedVerses = null
  } = options;

  const container = document.createElement('div');
  container.className = 'w-full flex flex-col gap-3 page-fade-in';

  if (message.role === 'user') {
    // User Message Bubble
    container.innerHTML = `
      <div class="flex items-start justify-end gap-3 max-w-3xl ml-auto">
        <div class="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-md text-sm md:text-base leading-relaxed max-w-[85%] sm:max-w-xl font-medium">
          ${message.text}
        </div>
        <div class="w-9 h-9 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm border border-amber-300 dark:border-amber-700">
          <span>You</span>
        </div>
      </div>
    `;
    return container;
  }

  // Assistant / Geetha GPT Message
  const wrapper = document.createElement('div');
  wrapper.className = 'flex items-start gap-3 md:gap-4 max-w-3xl mr-auto w-full';

  // Format response paragraphs
  const paragraphs = message.text
    .split('\n\n')
    .map(p => `<p class="leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  wrapper.innerHTML = `
    <!-- Geetha GPT Avatar -->
    <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md shadow-amber-500/20 border border-amber-400/40 relative">
      <span class="animate-flame">🪔</span>
      <span class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900"></span>
    </div>

    <!-- Message Content Body -->
    <div class="flex-1 flex flex-col gap-4 bg-white dark:bg-[#1A1816] p-5 md:p-6 rounded-3xl rounded-tl-sm border border-stone-200/80 dark:border-stone-800 shadow-sm">
      <!-- Top Bar: Model Name & Audio/Copy Controls -->
      <div class="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 pb-3">
        <div class="flex items-center gap-2">
          <span class="font-cinzel font-bold text-sm text-stone-900 dark:text-stone-100">
            Geetha GPT
          </span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
            Gita Wisdom
          </span>
        </div>

        <div class="flex items-center gap-1">
          <!-- Listen Button -->
          <button class="chat-audio-btn p-1.5 rounded-lg text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition" title="Listen to response">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
          </button>

          <!-- Copy Button -->
          <button class="chat-copy-btn p-1.5 rounded-lg text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition" title="Copy response">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          </button>
        </div>
      </div>

      <!-- Expandable AI Thought Reflection Process -->
      ${
        message.thought
          ? `
          <details class="group/thought bg-amber-500/[0.04] dark:bg-amber-500/[0.06] rounded-xl border border-amber-500/15 overflow-hidden text-xs">
            <summary class="flex items-center justify-between px-3.5 py-2.5 cursor-pointer select-none font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-500/10 transition">
              <span class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>${lang === 'te' ? 'AI ఆలోచనా విధానం & అంతర్మథనం' : 'View AI Contemplation Process'}</span>
              </span>
              <svg class="w-4 h-4 transform group-open/thought:rotate-180 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </summary>
            <div class="px-3.5 py-3 border-t border-amber-500/10 text-stone-600 dark:text-stone-300 font-mono leading-relaxed whitespace-pre-line bg-amber-500/[0.02]">
              ${message.thought}
            </div>
          </details>
          `
          : ''
      }

      <!-- Main Guidance Content -->
      <div class="text-sm md:text-base text-stone-800 dark:text-stone-200 flex flex-col gap-3">
        ${paragraphs}
      </div>

      <!-- Embedded Relevant Verse Card Container -->
      <div class="embedded-verse-card-mount"></div>

      <!-- Practical Action Steps Checklist -->
      ${
        message.actionSteps && message.actionSteps.length
          ? `
          <div class="p-4 rounded-2xl bg-amber-500/[0.05] dark:bg-amber-500/[0.08] border border-amber-500/20 flex flex-col gap-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 font-cinzel flex items-center gap-2">
              <span>🎯</span>
              <span>${lang === 'te' ? 'ఆచరణాత్మక కార్యాచరణ' : 'Actionable Guidance Steps'}</span>
            </span>
            <ul class="flex flex-col gap-2 text-xs md:text-sm text-stone-700 dark:text-stone-300 ${lang === 'te' ? 'font-telugu' : ''}">
              ${message.actionSteps
                .map(
                  step => `
                  <li class="flex items-start gap-2">
                    <span class="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
                    <span>${step}</span>
                  </li>
                  `
                )
                .join('')}
            </ul>
          </div>
          `
          : ''
      }

      <!-- Interactive Follow-up Action Buttons -->
      <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
        <button class="explain-more-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition">
          <span>✨</span>
          <span>${lang === 'te' ? 'మరింత వివరంగా వివరించండి' : 'Explain More'}</span>
        </button>

        <button class="related-verses-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition">
          <span>📜</span>
          <span>${lang === 'te' ? 'సంబంధిత శ్లోకాలు' : 'Related Verses'}</span>
        </button>
      </div>
    </div>
  `;

  // Mount embedded verse card if present
  if (message.verse) {
    const verseMount = wrapper.querySelector('.embedded-verse-card-mount');
    const vCard = renderVerseCard(message.verse, {
      lang,
      theme,
      sanskritDisplay,
      showExplanation: false,
      showPractical: false
    });
    verseMount.appendChild(vCard);
  }

  // Event Listeners
  const audioBtn = wrapper.querySelector('.chat-audio-btn');
  const copyBtn = wrapper.querySelector('.chat-copy-btn');
  const explainBtn = wrapper.querySelector('.explain-more-btn');
  const relatedBtn = wrapper.querySelector('.related-verses-btn');

  audioBtn.onclick = () => {
    soundSynthesizer.playZenBell();
    speechEngine.speak(message.text, lang === 'te' ? 'te' : 'en');
  };

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(message.text);
    soundSynthesizer.playChime();
    toastManager.show(lang === 'te' ? "సమాధానం కాపీ చేయబడింది!" : "Response copied to clipboard!", "success");
  };

  explainBtn.onclick = () => {
    if (onExplainMore) onExplainMore(message);
  };

  relatedBtn.onclick = () => {
    if (onRelatedVerses) onRelatedVerses(message);
  };

  container.appendChild(wrapper);
  return container;
}

