/**
 * Geetha GPT - Share Verse & Quote Modal
 */

import { generateQuoteCardImage } from '../utils/quoteCanvas.js';
import { toastManager } from './Toast.js';
import { soundSynthesizer } from '../utils/soundUtil.js';

export function openShareModal(verse, lang = 'en', theme = 'light') {
  // Remove existing modal if any
  const existing = document.getElementById('share-modal-container');
  if (existing) existing.remove();

  const imageUrl = generateQuoteCardImage(verse, lang, theme);
  const translationText = lang === 'te' ? (verse.teluguTranslation || verse.englishTranslation) : verse.englishTranslation;
  const quoteText = `Bhagavad Gita — Chapter ${verse.chapter}, Verse ${verse.verse}\n\n${verse.sanskrit}\n\n${translationText}\n\nVia Geetha GPT (Wisdom Platform)`;

  const modal = document.createElement('div');
  modal.id = 'share-modal-container';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm page-fade-in';

  modal.innerHTML = `
    <div class="relative w-full max-w-xl bg-white dark:bg-[#1A1816] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-amber-500/5">
        <div class="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-cinzel font-bold text-lg">
          <span class="text-xl">🪔</span>
          <span>Share Wisdom Card</span>
        </div>
        <button id="close-share-modal-btn" class="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Card Preview -->
      <div class="p-6 overflow-y-auto flex flex-col items-center gap-4 bg-stone-50/50 dark:bg-stone-900/30">
        <div class="relative rounded-xl overflow-hidden shadow-md border border-amber-500/20 max-w-full">
          <img src="${imageUrl}" alt="Bhagavad Gita Quote Card" class="w-full h-auto object-contain rounded-xl" />
        </div>
        <p class="text-xs text-stone-500 dark:text-stone-400 text-center">
          Rendered in high resolution with gold borders and sacred typography.
        </p>
      </div>

      <!-- Footer Actions -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1816]">
        <button id="copy-quote-text-btn" class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-sm transition">
          <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          <span>Copy Text</span>
        </button>

        <a id="download-card-btn" href="${imageUrl}" download="GeethaGPT_Chapter_${verse.chapter}_Verse_${verse.verse}.png" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium text-sm shadow-md shadow-amber-600/20 transition hover-lift">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>Download Image</span>
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event Listeners
  modal.querySelector('#close-share-modal-btn').onclick = () => modal.remove();
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.querySelector('#copy-quote-text-btn').onclick = () => {
    navigator.clipboard.writeText(quoteText);
    soundSynthesizer.playChime();
    toastManager.show(lang === 'te' ? "కోట్ టెక్స్ట్ కాపీ చేయబడింది!" : "Quote text copied to clipboard!", "success");
  };

  modal.querySelector('#download-card-btn').onclick = () => {
    soundSynthesizer.playZenBell();
    toastManager.show(lang === 'te' ? "కార్డ్ డౌన్‌లోడ్ ప్రారంభమైంది!" : "Quote card image downloaded!", "success");
  };
}

