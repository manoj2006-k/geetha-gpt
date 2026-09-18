/**
 * Geetha GPT - History Page Component
 */

import { I18N } from '../data/i18n.js';
import { storageManager } from '../utils/storageUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from '../components/Toast.js';

export function renderHistoryPage(options = {}) {
  const { lang = 'en', onNavigate = null } = options;
  const t = I18N[lang] || I18N.en;

  const page = document.createElement('div');
  page.className = 'w-full flex flex-col gap-8 pb-16 page-fade-in max-w-4xl mx-auto px-4 sm:px-6';

  function renderList() {
    const historyList = storageManager.getChatHistory();

    page.innerHTML = `
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div class="flex flex-col gap-1">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-semibold w-max">
            <span>🕰️</span>
            <span class="${lang === 'te' ? 'font-telugu' : 'font-cinzel'}">${historyList.length} ${lang === 'te' ? 'సంభాషణలు' : 'Dialogues Logged'}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 font-cinzel">
            ${t.history.title}
          </h1>
          <p class="text-stone-600 dark:text-stone-300 text-sm sm:text-base ${lang === 'te' ? 'font-telugu' : ''}">
            ${t.history.subtitle}
          </p>
        </div>

        ${
          historyList.length > 0
            ? `
            <button id="clear-all-history-btn" class="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-xs font-bold transition">
              <span>✕</span>
              <span>${t.history.clearHistory}</span>
            </button>
            `
            : ''
        }
      </div>

      <!-- History List Content Grouped by Today & Yesterday -->
      <div id="history-items-mount" class="flex flex-col gap-6"></div>
    `;

    const itemsMount = page.querySelector('#history-items-mount');

    if (historyList.length === 0) {
      itemsMount.innerHTML = `
        <div class="py-20 px-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 text-center flex flex-col items-center gap-4 shadow-sm">
          <div class="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl">
            <span>🪔</span>
          </div>
          <div class="flex flex-col gap-1 max-w-md">
            <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100 font-cinzel">
              ${t.history.emptyTitle}
            </h3>
            <p class="text-sm text-stone-500 dark:text-stone-400 leading-relaxed ${lang === 'te' ? 'font-telugu' : ''}">
              ${t.history.emptySubtitle}
            </p>
          </div>
          <button id="history-start-chat-btn" class="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition hover-lift mt-2">
            <span>💬</span>
            <span>${t.history.startChatBtn}</span>
          </button>
        </div>
      `;

      itemsMount.querySelector('#history-start-chat-btn').onclick = () => {
        soundSynthesizer.playZenBell();
        if (onNavigate) onNavigate('askGeetha');
      };
      return;
    }

    // Separate into Today and Yesterday sections
    const todayItems = historyList.filter(it => it.section === 'Today' || (!it.section && Date.now() - it.timestamp < 86400000));
    const yesterdayItems = historyList.filter(it => it.section === 'Yesterday' || (!it.section && Date.now() - it.timestamp >= 86400000));

    function createSectionBlock(sectionTitle, items) {
      if (items.length === 0) return null;

      const secWrapper = document.createElement('div');
      secWrapper.className = 'flex flex-col gap-3';

      secWrapper.innerHTML = `
        <div class="flex items-center gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-cinzel">
            ✦ ${sectionTitle}
          </span>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-500">
            ${items.length}
          </span>
        </div>
        <div class="flex flex-col gap-3"></div>
      `;

      const listContainer = secWrapper.querySelector('.flex.flex-col.gap-3:last-child');

      items.forEach(entry => {
        const itemCard = document.createElement('div');
        itemCard.className = 'p-5 rounded-2xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 shadow-sm hover:border-amber-500/50 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group';

        const titleText = entry.title || (lang === 'te' && entry.teluguQuery ? entry.teluguQuery : entry.query) || 'Gita Dialogue';
        const msgCountText = entry.messageCount 
          ? `${entry.messageCount} ${lang === 'te' ? 'సందేశాలు' : 'messages'}` 
          : (entry.messages ? `${entry.messages.length} ${lang === 'te' ? 'సందేశాలు' : 'messages'}` : `2 ${lang === 'te' ? 'సందేశాలు' : 'messages'}`);

        itemCard.innerHTML = `
          <div class="flex items-start gap-3.5 flex-1">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 group-hover:bg-amber-600 text-amber-700 dark:text-amber-400 group-hover:text-white flex items-center justify-center font-bold text-base flex-shrink-0 transition duration-300">
              <span>💬</span>
            </div>
            <div class="flex flex-col gap-1">
              <h4 class="font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 text-base transition ${lang === 'te' ? 'font-telugu' : ''}">
                "${titleText}"
              </h4>
              <div class="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
                <span class="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold">${sectionTitle} • ${msgCountText}</span>
                ${entry.topic ? `<span>•</span> <span class="text-stone-600 dark:text-stone-400 font-cinzel font-medium">Topic: ${entry.topic}</span>` : ''}
                ${entry.chapterRef ? `<span>•</span> <span class="text-stone-600 dark:text-stone-400 font-cinzel font-medium">${entry.chapterRef}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-center">
            <button class="resume-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 text-xs font-bold transition">
              <span>${lang === 'te' ? 'తెరవండి' : 'Open'}</span>
              <span>→</span>
            </button>

            <button class="delete-btn p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition" title="${t.history.deleteEntry}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        `;

        itemCard.onclick = (e) => {
          if (e.target.closest('.delete-btn')) return;
          soundSynthesizer.playZenBell();
          if (onNavigate) onNavigate('askGeetha', { historyId: entry.id });
        };

        itemCard.querySelector('.delete-btn').onclick = (e) => {
          e.stopPropagation();
          storageManager.deleteChatHistoryEntry(entry.id);
          soundSynthesizer.playChime();
          toastManager.show(lang === 'te' ? "ఎంట్రీ తొలగించబడింది" : "History entry removed", "info");
          renderList();
        };

        listContainer.appendChild(itemCard);
      });

      return secWrapper;
    }

    if (todayItems.length > 0) {
      const sec = createSectionBlock(lang === 'te' ? 'నేడు (Today)' : 'Today', todayItems);
      if (sec) itemsMount.appendChild(sec);
    }

    if (yesterdayItems.length > 0) {
      const sec = createSectionBlock(lang === 'te' ? 'నిన్న (Yesterday)' : 'Yesterday', yesterdayItems);
      if (sec) itemsMount.appendChild(sec);
    }

    const clearAllBtn = page.querySelector('#clear-all-history-btn');
    if (clearAllBtn) {
      clearAllBtn.onclick = () => {
        if (confirm(lang === 'te' ? "సంభాషణల చరిత్ర మొత్తాన్ని తొలగించాలా?" : "Clear all conversation history?")) {
          storageManager.clearChatHistory();
          renderList();
          toastManager.show(lang === 'te' ? "చరిత్ర క్లియర్ చేయబడింది" : "History cleared", "info");
        }
      };
    }
  }

  renderList();
  return page;
}
