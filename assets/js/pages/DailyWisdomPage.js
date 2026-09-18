/**
 * Geetha GPT - Daily Wisdom Page
 */

import { I18N } from '../data/i18n.js';
import { DAILY_WISDOM_DATA } from '../data/dailyWisdomData.js';
import { VERSES_DATA } from '../data/versesData.js';
import { storageManager } from '../utils/storageUtil.js';
import { speechEngine } from '../utils/speechUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from '../components/Toast.js';
import { openShareModal } from '../components/ShareModal.js';

export function renderDailyWisdomPage(options = {}) {
  const {
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    onNavigate = null
  } = options;

  const t = I18N[lang] || I18N.en;
  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-10 pb-16 page-fade-in max-w-5xl mx-auto px-4 sm:px-6';

  let selectedDayIndex = 0;
  const currentWisdom = DAILY_WISDOM_DATA[selectedDayIndex] || DAILY_WISDOM_DATA[0];
  const currentVerseObj = VERSES_DATA.find(v => v.id === currentWisdom.verseId) || VERSES_DATA[0];

  function renderContent() {
    const wisdom = DAILY_WISDOM_DATA[selectedDayIndex];
    const verseObj = VERSES_DATA.find(v => v.id === wisdom.verseId) || VERSES_DATA[0];
    const isSaved = storageManager.isVerseSaved(wisdom.verseId);

    // Script handling
    let scriptText = wisdom.sanskrit;
    if (sanskritDisplay === 'translit') {
      scriptText = wisdom.transliteration;
    } else if (sanskritDisplay === 'telugu') {
      scriptText = wisdom.teluguSanskrit || wisdom.sanskrit;
    }

    const titleText = lang === 'te' ? wisdom.teluguChapterTitle : wisdom.chapterTitle;
    const translationText = lang === 'te' ? wisdom.teluguTranslation : wisdom.translation;
    const explanationText = lang === 'te' ? wisdom.teluguExplanation : wisdom.explanation;
    const reflectionText = lang === 'te' ? wisdom.teluguReflectionQuestion : wisdom.reflectionQuestion;
    const mindfulnessText = lang === 'te' ? wisdom.teluguMindfulnessPractice : wisdom.mindfulnessPractice;

    page.innerHTML = `
      <!-- Header -->
      <div class="flex flex-col gap-2 text-center sm:text-left mt-2">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-semibold w-max self-center sm:self-start">
          <span class="animate-flame">🪔</span>
          <span class="${lang === 'te' ? 'font-telugu' : 'font-cinzel'}">${wisdom.dateString}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 font-cinzel">
          ${t.dailyWisdom.title}
        </h1>
        <p class="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-2xl ${lang === 'te' ? 'font-telugu' : ''}">
          ${t.dailyWisdom.subtitle}
        </p>
      </div>

      <!-- Main Wisdom Spotlight Card -->
      <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1A1816] border-2 border-amber-500/30 dark:border-amber-500/30 p-6 sm:p-10 shadow-xl flex flex-col gap-6">
        <!-- Top Bar: Chapter Reference & Actions -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-cinzel font-bold text-xs flex items-center justify-center shadow-sm">
              BG
            </span>
            <span class="font-cinzel font-bold text-sm sm:text-base text-stone-800 dark:text-stone-200">
              ${titleText}
            </span>
          </div>

          <!-- Main Actions: Save Verse, Share, Read Aloud -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Save Bookmark -->
            <button id="daily-save-btn" class="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition ${
              isSaved
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-800 dark:text-amber-300'
                : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500 hover:text-amber-600'
            }">
              <svg class="w-4 h-4 ${isSaved ? 'fill-current' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
              <span>${isSaved ? (lang === 'te' ? 'భద్రపరిచారు' : 'Verse Saved') : (lang === 'te' ? 'భద్రపరుచు' : 'Save Verse')}</span>
            </button>

            <!-- Generate Share Card -->
            <button id="daily-share-btn" class="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500 text-stone-700 dark:text-stone-300 text-xs font-bold transition">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              <span>${lang === 'te' ? 'పంచుకోండి' : 'Share'}</span>
            </button>

            <!-- Audio Read Aloud Button -->
            <button id="daily-audio-btn" class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold transition">
              <svg class="w-4 h-4 play-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
              <span>${lang === 'te' ? 'వినండి' : 'Read Aloud'}</span>
            </button>
          </div>
        </div>

        <!-- Sanskrit Shloka Block -->
        <div class="py-6 px-4 rounded-2xl bg-amber-500/[0.05] dark:bg-amber-500/[0.07] border border-amber-500/20 text-center">
          <p class="font-sanskrit text-lg sm:text-2xl text-stone-900 dark:text-amber-100 font-bold leading-relaxed whitespace-pre-line">
            ${scriptText}
          </p>
          ${
            wisdom.transliteration
              ? `<p class="mt-3 text-xs sm:text-sm text-stone-500 dark:text-stone-400 italic font-sans">
                  ${wisdom.transliteration}
                </p>`
              : ''
          }
        </div>

        <!-- Word-by-Word Sanskrit Breakdown -->
        ${
          wisdom.wordByWord && wisdom.wordByWord.length
            ? `
            <div class="flex flex-col gap-3">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 font-cinzel flex items-center gap-1.5">
                <span>📖</span>
                <span>${t.dailyWisdom.wordByWordTitle}</span>
              </span>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                ${wisdom.wordByWord
                  .map(
                    wbw => `
                    <div class="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex flex-col gap-0.5 text-xs">
                      <span class="font-sanskrit font-bold text-amber-800 dark:text-amber-300">${wbw.sanskrit}</span>
                      <span class="text-[10px] text-stone-400 italic font-sans">${wbw.translit}</span>
                      <span class="text-stone-700 dark:text-stone-200 font-medium mt-0.5 ${lang === 'te' ? 'font-telugu' : ''}">${lang === 'te' ? wbw.teluguMeaning : wbw.meaning}</span>
                    </div>
                  `
                  )
                  .join('')}
              </div>
            </div>
            `
            : ''
        }

        <!-- Translation & Commentary -->
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 font-cinzel">
              ${lang === 'te' ? 'తాత్పర్యం' : 'Translation'}
            </span>
            <p class="text-stone-800 dark:text-stone-200 text-base sm:text-lg leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
              ${translationText}
            </p>
          </div>

          <div class="flex flex-col gap-1 bg-amber-500/[0.03] dark:bg-amber-500/[0.05] p-4 rounded-2xl border border-amber-500/15 text-sm text-stone-700 dark:text-stone-300">
            <span class="text-xs font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <span>✨</span>
              <span>${lang === 'te' ? 'లోతైన వివరణ' : 'Spiritual Commentary'}</span>
            </span>
            <p class="leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
              ${explanationText}
            </p>
          </div>
        </div>

        <!-- Daily Reflection & Mindfulness Boxes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Daily Contemplation Question -->
          <div class="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 flex flex-col gap-2">
            <div class="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wider font-cinzel">
              <span>🤔</span>
              <span>${t.dailyWisdom.reflectionTitle}</span>
            </div>
            <p class="text-xs sm:text-sm text-stone-700 dark:text-stone-200 italic leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
              "${reflectionText}"
            </p>
          </div>

          <!-- Daily Mindfulness Action -->
          <div class="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 flex flex-col gap-2">
            <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider font-cinzel">
              <span>🌿</span>
              <span>${t.dailyWisdom.mindfulnessTitle}</span>
            </div>
            <p class="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
              ${mindfulnessText}
            </p>
          </div>
        </div>
      </div>

      <!-- Previous Wisdom Archive List -->
      <div class="flex flex-col gap-4">
        <h3 class="text-xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
          ${t.dailyWisdom.archiveTitle}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          ${DAILY_WISDOM_DATA.map(
            (dw, idx) => `
            <div class="archive-wisdom-card p-5 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/50 shadow-sm transition cursor-pointer hover-lift flex flex-col justify-between ${
              idx === selectedDayIndex ? 'ring-2 ring-amber-500' : ''
            }" data-index="${idx}">
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between text-xs text-stone-400 font-semibold">
                  <span class="font-cinzel text-amber-700 dark:text-amber-400">Day ${dw.dayNumber}</span>
                  <span>${dw.dateString}</span>
                </div>
                <h4 class="font-bold text-stone-900 dark:text-stone-100 font-cinzel text-sm">
                  ${lang === 'te' ? dw.teluguChapterTitle : dw.chapterTitle}
                </h4>
                <p class="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 ${lang === 'te' ? 'font-telugu' : ''}">
                  ${lang === 'te' ? dw.teluguTranslation : dw.translation}
                </p>
              </div>
              <span class="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3">Read Wisdom →</span>
            </div>
          `
          ).join('')}
        </div>
      </div>
    `;

    // Reattach Event Handlers
    const audioBtn = page.querySelector('#daily-audio-btn');
    const shareBtn = page.querySelector('#daily-share-btn');
    const saveBtn = page.querySelector('#daily-save-btn');

    audioBtn.onclick = () => {
      soundSynthesizer.playZenBell();
      const speakText = lang === 'te'
        ? `${wisdom.sanskrit}. తాత్పర్యం: ${wisdom.teluguTranslation}`
        : `${wisdom.sanskrit}. Translation: ${wisdom.translation}`;
      speechEngine.speak(speakText, lang === 'te' ? 'te' : 'sa');
    };

    shareBtn.onclick = () => {
      soundSynthesizer.playChime();
      openShareModal(verseObj, lang, theme);
    };

    saveBtn.onclick = () => {
      const nowSaved = !storageManager.isVerseSaved(wisdom.verseId);
      if (nowSaved) {
        storageManager.saveVerse(wisdom.verseId);
        soundSynthesizer.playChime();
        if (window.confetti) {
          window.confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 }, colors: ['#D97706', '#F59E0B'] });
        }
        toastManager.show(lang === 'te' ? "బుక్‌మార్క్‌లలో భద్రపరచబడింది!" : "Verse saved to bookmarks!", "success");
      } else {
        storageManager.removeVerse(wisdom.verseId);
        toastManager.show(lang === 'te' ? "బుక్‌మార్క్‌ల నుండి తొలగించబడింది" : "Verse removed", "info");
      }
      renderContent();
    };

    page.querySelectorAll('.archive-wisdom-card').forEach(card => {
      card.onclick = () => {
        selectedDayIndex = parseInt(card.dataset.index, 10);
        soundSynthesizer.playChime();
        renderContent();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });
  }

  renderContent();
  return page;
}

