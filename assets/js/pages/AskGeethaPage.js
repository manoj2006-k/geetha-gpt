/**
 * Geetha GPT - Ask Geetha Chatbot Page
 */

import { I18N } from '../data/i18n.js';
import { CHAT_SUGGESTIONS, getGeethaGPTResponse } from '../data/chatMockData.js';
import { VERSES_DATA } from '../data/versesData.js';
import { renderChatMessage } from '../components/ChatMessage.js';
import { storageManager } from '../utils/storageUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { toastManager } from '../components/Toast.js';

export function renderAskGeethaPage(options = {}) {
  const {
    lang = 'en',
    theme = 'light',
    sanskritDisplay = 'devanagari',
    initialQuery = '',
    historyId = null,
    onNavigate = null
  } = options;

  const t = I18N[lang] || I18N.en;
  const page = document.createElement('div');
  page.className = 'w-full flex-1 flex flex-col max-w-4xl mx-auto px-4 sm:px-6 pb-28 pt-2 page-fade-in relative min-h-[calc(100vh-5rem)]';

  // Initialize conversation: If historyId is passed from History, load that conversation. Otherwise, start fresh!
  let currentConversationId = historyId || ('chat-' + Date.now());
  let messages = [];

  if (historyId) {
    const savedConv = storageManager.getChatConversation(historyId);
    if (savedConv && Array.isArray(savedConv.messages)) {
      messages = [...savedConv.messages];
    }
  }

  page.innerHTML = `
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800 pb-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-amber-600/20">
          <span class="animate-flame">🪔</span>
        </div>
        <div class="flex flex-col">
          <h1 class="text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-cinzel tracking-tight">
            ${t.chat.title}
          </h1>
          <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 ${lang === 'te' ? 'font-telugu' : ''}">
            ${t.chat.subtitle}
          </p>
        </div>
      </div>

      <!-- Action Buttons: New Chat / Clear Chat -->
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <button id="new-chat-btn" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-900 dark:text-amber-200 hover:bg-amber-500/25 text-xs font-bold transition">
          <span>+</span>
          <span>${lang === 'te' ? 'కొత్త సంభాషణ' : 'New Chat'}</span>
        </button>

        <button id="clear-chat-btn" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          <span>${t.chat.clearChat}</span>
        </button>
      </div>
    </div>

    <!-- Quick Suggestions Carousel (Top Bar) -->
    <div id="top-suggestions-bar" class="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
      <span class="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-cinzel flex-shrink-0">
        ✦ ${t.chat.suggestedPrompts}:
      </span>
      ${CHAT_SUGGESTIONS.map(
        sug => `
        <button class="chat-sug-chip flex-shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1816] hover:bg-amber-500/10 text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 border border-stone-200/80 dark:border-stone-800 text-xs font-medium transition shadow-sm ${lang === 'te' ? 'font-telugu' : ''}" data-query="${lang === 'te' ? sug.te : sug.en}">
          ${lang === 'te' ? sug.te : sug.en}
        </button>
      `
      ).join('')}
    </div>

    <!-- Chat Messages / Welcome Area -->
    <div id="chat-messages-container" class="flex-1 flex flex-col gap-6 overflow-y-auto"></div>

    <!-- AI Streaming / Thinking Indicator Placeholder -->
    <div id="chat-thinking-indicator" class="hidden flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#1A1816] border border-amber-500/30 max-w-md animate-pulse mt-2">
      <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-sm">
        <span class="animate-spin">☸</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-xs font-bold text-amber-800 dark:text-amber-300 font-cinzel">
          ${t.chat.thinking}
        </span>
        <div class="w-36 h-2 rounded bg-amber-500/20 animate-shimmer"></div>
      </div>
    </div>

    <!-- Voice Waveform Overlay (Visible during simulated mic listening) -->
    <div id="voice-waveform-overlay" class="hidden fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 bg-stone-900/90 text-amber-300 px-6 py-3 rounded-full backdrop-blur-md shadow-2xl flex items-center gap-3 border border-amber-500/40">
      <div class="flex items-center gap-1">
        <span class="w-1 bg-amber-400 rounded-full wave-bar"></span>
        <span class="w-1 bg-amber-400 rounded-full wave-bar"></span>
        <span class="w-1 bg-amber-400 rounded-full wave-bar"></span>
        <span class="w-1 bg-amber-400 rounded-full wave-bar"></span>
      </div>
      <span class="text-xs font-semibold">${t.chat.listening}</span>
      <button id="stop-voice-btn" class="p-1 rounded-full hover:bg-stone-700 text-stone-300 text-xs ml-2">✕</button>
    </div>

    <!-- Bottom Sticky Chat Input Bar -->
    <div class="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent dark:from-[#121110] dark:via-[#121110]/95 lg:pl-68">
      <div class="max-w-3xl mx-auto flex items-center gap-2 bg-white dark:bg-[#1A1816] rounded-2xl shadow-2xl border border-amber-500/30 p-2 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15 transition-all">
        <!-- Voice Input Mic Icon Button -->
        <button id="chat-mic-btn" class="p-2.5 rounded-xl text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 hover:bg-amber-500/10 transition relative group" title="${t.chat.micTooltip}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
          <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded text-[10px] bg-stone-900 text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Voice Mode
          </span>
        </button>

        <!-- Main Chat Text Input -->
        <input 
          type="text" 
          id="chat-user-input" 
          placeholder="${t.chat.placeholder}" 
          class="flex-1 bg-transparent border-none outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm sm:text-base px-2 py-1 font-medium ${lang === 'te' ? 'font-telugu' : ''}" 
        />

        <!-- Send Button -->
        <button 
          id="chat-send-btn" 
          class="flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md shadow-amber-600/25 transition hover-lift flex-shrink-0" 
          title="${t.chat.send}"
        >
          <svg class="w-4 h-4 transform rotate-45 -translate-y-0.5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </div>
    </div>
  `;

  const messagesContainer = page.querySelector('#chat-messages-container');
  const thinkingIndicator = page.querySelector('#chat-thinking-indicator');
  const userInput = page.querySelector('#chat-user-input');
  const sendBtn = page.querySelector('#chat-send-btn');
  const micBtn = page.querySelector('#chat-mic-btn');
  const waveformOverlay = page.querySelector('#voice-waveform-overlay');
  const stopVoiceBtn = page.querySelector('#stop-voice-btn');
  const clearChatBtn = page.querySelector('#clear-chat-btn');
  const newChatBtn = page.querySelector('#new-chat-btn');

  // Render Welcome State (when conversation is fresh with 0 messages)
  function renderWelcomeState() {
    messagesContainer.innerHTML = `
      <div id="chat-welcome-state" class="py-12 px-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-stone-200/80 dark:border-stone-800 text-center flex flex-col items-center gap-6 shadow-sm my-auto">
        <div class="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-amber-600/25">
          <span class="animate-flame">🪔</span>
        </div>
        
        <div class="flex flex-col gap-2 max-w-lg">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-cinzel">
            Geetha GPT
          </h2>
          <p class="text-base sm:text-lg text-amber-800 dark:text-amber-300 font-medium ${lang === 'te' ? 'font-telugu' : ''}">
            ${lang === 'te' ? 'భగవద్గీత దివ్య జ్ఞానాన్ని అన్వేషించడానికి నేను మీకు ఎలా సహాయపడగలను?' : 'How can I help you explore the wisdom of the Bhagavad Gita?'}
          </p>
          <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            ${lang === 'te' ? 'మీ జీవిత సమస్యలు, మానసిక సందిగ్ధతలు, లేదా ధర్మ సందేహాల గురించి అడగండి.' : 'Ask about life challenges, anxiety, relationships, career dilemmas, or spiritual wisdom.'}
          </p>
        </div>

        <!-- Suggested Guidance Topics Grid -->
        <div class="w-full max-w-2xl flex flex-col gap-3 pt-2 text-left">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 font-cinzel text-center sm:text-left">
            ✦ ${t.chat.suggestedPrompts}
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${CHAT_SUGGESTIONS.map(sug => `
              <button class="welcome-sug-card p-3.5 rounded-2xl bg-amber-500/[0.04] hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium transition text-left flex items-center justify-between group shadow-sm" data-query="${lang === 'te' ? sug.te : sug.en}">
                <span class="${lang === 'te' ? 'font-telugu' : ''}">${lang === 'te' ? sug.te : sug.en}</span>
                <span class="text-amber-600 group-hover:translate-x-1 transition font-bold">→</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Wire suggestion cards in welcome state
    messagesContainer.querySelectorAll('.welcome-sug-card').forEach(btn => {
      btn.onclick = () => {
        const q = btn.dataset.query;
        handleSendMessage(q);
      };
    });
  }

  // Render current messages list
  function renderAllMessages() {
    if (messages.length === 0) {
      renderWelcomeState();
      return;
    }

    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
      const msgNode = renderChatMessage(msg, {
        lang,
        theme,
        sanskritDisplay,
        onExplainMore: (m) => {
          handleSendMessage(lang === 'te' ? 'ఈ శ్లోకం యొక్క లోతైన తాత్త్విక భావాన్ని మరింత వివరించండి.' : 'Explain the deeper spiritual philosophy behind this verse in more detail.');
        },
        onRelatedVerses: (m) => {
          if (onNavigate && m.verse) {
            onNavigate('chapterDetail', { chapterNumber: m.verse.chapter });
          }
        }
      });
      messagesContainer.appendChild(msgNode);
    });

    // Auto scroll to bottom
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  // Handle Send Question
  function handleSendMessage(queryText) {
    const text = (queryText || userInput.value).trim();
    if (!text) return;

    // Add user message
    messages.push({ role: 'user', text });
    userInput.value = '';
    renderAllMessages();
    soundSynthesizer.playChime();

    // Show thinking indicator
    thinkingIndicator.classList.remove('hidden');
    messagesContainer.appendChild(thinkingIndicator);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    // Simulate AI response delay
    setTimeout(() => {
      thinkingIndicator.classList.add('hidden');
      const aiResult = getGeethaGPTResponse(text, lang);

      const assistantMsg = {
        role: 'assistant',
        thought: aiResult.thought,
        text: aiResult.response,
        verse: aiResult.verse,
        actionSteps: aiResult.actionSteps
      };

      messages.push(assistantMsg);
      renderAllMessages();
      soundSynthesizer.playZenBell();

      // Auto-save full conversation to LocalStorage History
      const firstUserMsg = messages.find(m => m.role === 'user');
      storageManager.saveChatConversation({
        id: currentConversationId,
        title: firstUserMsg ? firstUserMsg.text : text,
        messages: messages,
        topic: aiResult.verse?.topics?.[0] || 'Wisdom',
        chapterRef: aiResult.verse ? `Chapter ${aiResult.verse.chapter}, Verse ${aiResult.verse.verse}` : ''
      });
    }, 700);
  }

  // Event Listeners
  sendBtn.onclick = () => handleSendMessage();
  userInput.onkeydown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  // Quick suggestion chips (Top bar)
  page.querySelectorAll('.chat-sug-chip').forEach(btn => {
    btn.onclick = () => {
      const q = btn.dataset.query;
      handleSendMessage(q);
    };
  });

  // Start a completely fresh chat (New Chat button)
  if (newChatBtn) {
    newChatBtn.onclick = () => {
      if (messages.length > 0) {
        storageManager.saveChatConversation({
          id: currentConversationId,
          messages: messages
        });
      }
      currentConversationId = 'chat-' + Date.now();
      messages = [];
      renderAllMessages();
      soundSynthesizer.playChime();
      toastManager.show(lang === 'te' ? "కొత్త సంభాషణ ప్రారంభించబడింది" : "New chat started", "info");
    };
  }

  // Clear chat
  clearChatBtn.onclick = () => {
    if (messages.length > 0) {
      // Save current conversation to History before clearing
      storageManager.saveChatConversation({
        id: currentConversationId,
        messages: messages
      });
    }
    currentConversationId = 'chat-' + Date.now();
    messages = [];
    renderAllMessages();
    soundSynthesizer.playChime();
    toastManager.show(lang === 'te' ? "సంభాషణ క్లియర్ చేయబడింది" : "Conversation cleared", "info");
  };

  // Simulated Mic Voice Input
  let isListening = false;
  micBtn.onclick = () => {
    isListening = !isListening;
    if (isListening) {
      waveformOverlay.classList.remove('hidden');
      soundSynthesizer.playChime();
      setTimeout(() => {
        if (isListening) {
          waveformOverlay.classList.add('hidden');
          isListening = false;
          const sampleSpeech = lang === 'te' ? 'నాకు మనశ్శాంతిని పొందేందుకు భగవద్గీత మార్గం ఏమిటి?' : 'How do I cultivate peace of mind and overcome anxiety?';
          userInput.value = sampleSpeech;
          handleSendMessage(sampleSpeech);
        }
      }, 2500);
    } else {
      waveformOverlay.classList.add('hidden');
    }
  };

  stopVoiceBtn.onclick = () => {
    isListening = false;
    waveformOverlay.classList.add('hidden');
  };

  // Initial render: If no messages, render fresh welcome view; otherwise render messages
  renderAllMessages();

  // If pre-filled query was passed from Home Hero or external navigation
  if (initialQuery) {
    setTimeout(() => {
      handleSendMessage(initialQuery);
    }, 300);
  }

  return page;
}

