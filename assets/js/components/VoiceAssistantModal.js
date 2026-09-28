/**
 * Geetha GPT - Interactive Multi-Language Voice Assistant
 * Supports real-time speech recognition and text-to-speech across
 * English, Telugu, Hindi, Tamil, Kannada, and all 23 supported languages.
 */

import { LANGUAGES, getLanguage, getScriptFontClass } from '../data/languages.js';
import { speechRecognizer, speechEngine } from '../utils/speechUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { CHAT_MOCK_RESPONSES, CHAT_SUGGESTIONS } from '../data/chatMockData.js';
import { VERSES_DATA } from '../data/versesData.js';
import { I18N, t } from '../data/i18n.js';
import { toastManager } from './Toast.js';

export class VoiceAssistantModal {
  constructor() {
    this.modalEl = null;
    this.currentLang = 'en';
    this.isListening = false;
    this.isSpeaking = false;
    this.currentTranscript = '';
    this.lastAnswer = '';
    this.onNavigate = null;
  }

  open(options = {}) {
    this.currentLang = options.lang || 'en';
    this.onNavigate = options.onNavigate || null;
    this.currentTranscript = '';
    this.lastAnswer = '';
    this.render();
  }

  close() {
    this.stopListening();
    speechEngine.stop();
    if (this.modalEl && this.modalEl.parentNode) {
      this.modalEl.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        if (this.modalEl && this.modalEl.parentNode) {
          this.modalEl.parentNode.removeChild(this.modalEl);
          this.modalEl = null;
        }
      }, 200);
    }
  }

  stopListening() {
    speechRecognizer.stop();
    this.isListening = false;
    this.updateMicVisuals();
  }

  startListening() {
    speechEngine.stop();
    soundSynthesizer.playChime();
    this.currentTranscript = '';
    const transcriptEl = this.modalEl.querySelector('#va-transcript-text');
    const statusEl = this.modalEl.querySelector('#va-status-label');
    const langObj = getLanguage(this.currentLang);

    if (transcriptEl) {
      transcriptEl.textContent = this.currentLang === 'te' 
        ? 'మీ ప్రశ్నను చెప్పండి, గీతా GPT వింటోంది...' 
        : (this.currentLang === 'hi' ? 'अपना प्रश्न बोलें, गीता GPT सुन रहा है...' : 'Speak your question, Geetha GPT is listening...');
      transcriptEl.classList.add('italic', 'opacity-60');
    }

    if (statusEl) {
      statusEl.textContent = `Listening in ${langObj.nativeName} (${langObj.name})...`;
    }

    const started = speechRecognizer.start({
      lang: this.currentLang,
      onStart: () => {
        this.isListening = true;
        this.updateMicVisuals();
      },
      onResult: (res) => {
        if (transcriptEl) {
          transcriptEl.textContent = res.transcript;
          transcriptEl.classList.remove('italic', 'opacity-60');
        }
        this.currentTranscript = res.transcript;
        if (res.isFinal && res.transcript.trim()) {
          this.stopListening();
          this.processVoiceQuery(res.transcript.trim());
        }
      },
      onError: (err) => {
        this.isListening = false;
        this.updateMicVisuals();
        if (statusEl) {
          statusEl.textContent = 'Voice input ready. Tap microphone to speak.';
        }
        if (err && err.error === 'not-supported') {
          toastManager.show('Voice recognition not supported in this browser. Please use Chrome/Edge or type your question.', 'warning');
        }
      },
      onEnd: () => {
        this.isListening = false;
        this.updateMicVisuals();
      }
    });

    if (!started) {
      // Graceful fallback simulation if Web Speech API recognition isn't permitted in browser
      this.isListening = true;
      this.updateMicVisuals();
      setTimeout(() => {
        if (this.isListening) {
          const sample = this.currentLang === 'te' 
            ? 'నాకు మనశ్శాంతిని పొందేందుకు భగవద్గీత మార్గం ఏమిటి?' 
            : (this.currentLang === 'hi' ? 'मन की शांति और चिंता से मुक्ति का गीता में क्या उपाय है?' : 'How do I cultivate peace of mind and overcome anxiety?');
          if (transcriptEl) {
            transcriptEl.textContent = sample;
            transcriptEl.classList.remove('italic', 'opacity-60');
          }
          this.currentTranscript = sample;
          this.stopListening();
          this.processVoiceQuery(sample);
        }
      }, 2500);
    }
  }

  processVoiceQuery(query) {
    if (!query) return;
    const answerContainer = this.modalEl.querySelector('#va-answer-container');
    const answerTextEl = this.modalEl.querySelector('#va-answer-text');
    const statusEl = this.modalEl.querySelector('#va-status-label');
    const thinkingEl = this.modalEl.querySelector('#va-thinking-indicator');

    if (thinkingEl) thinkingEl.classList.remove('hidden');
    if (statusEl) statusEl.textContent = 'Contemplating eternal Gita wisdom...';

    setTimeout(() => {
      if (thinkingEl) thinkingEl.classList.add('hidden');
      if (answerContainer) answerContainer.classList.remove('hidden');

      // Resolve response based on query keywords
      let responseObj = CHAT_MOCK_RESPONSES.default;
      const lower = query.toLowerCase();
      if (lower.includes('peace') || lower.includes('శాం') || lower.includes('शांत') || lower.includes('stress') || lower.includes('భయం') || lower.includes('डर')) {
        responseObj = CHAT_MOCK_RESPONSES.peace;
      } else if (lower.includes('anger') || lower.includes('కోపం') || lower.includes('क्रोध')) {
        responseObj = CHAT_MOCK_RESPONSES.anger;
      } else if (lower.includes('duty') || lower.includes('కర్మ') || lower.includes('कर्म') || lower.includes('work')) {
        responseObj = CHAT_MOCK_RESPONSES.duty;
      }

      const answer = this.currentLang === 'te' ? responseObj.te : (this.currentLang === 'hi' ? (responseObj.hi || responseObj.en) : responseObj.en);
      this.lastAnswer = answer;

      if (answerTextEl) {
        answerTextEl.innerHTML = `<p class="leading-relaxed ${getScriptFontClass(this.currentLang)}">${answer.replace(/\n/g, '<br/>')}</p>`;
      }

      if (statusEl) {
        statusEl.textContent = 'Geetha GPT answered with wisdom.';
      }

      // Auto-speak response in the selected language
      soundSynthesizer.playZenBell();
      this.isSpeaking = true;
      speechEngine.speak(answer, this.currentLang, () => {
        this.isSpeaking = false;
        this.updateMicVisuals();
      });
      this.updateMicVisuals();
    }, 1200);
  }

  updateMicVisuals() {
    if (!this.modalEl) return;
    const micBtn = this.modalEl.querySelector('#va-mic-trigger');
    const waves = this.modalEl.querySelectorAll('.va-wave-ring');
    const statusEl = this.modalEl.querySelector('#va-status-label');

    if (this.isListening) {
      micBtn.classList.add('bg-red-600', 'text-white', 'shadow-red-500/40', 'scale-110');
      micBtn.classList.remove('bg-amber-600', 'text-white');
      waves.forEach(w => w.classList.remove('hidden'));
    } else {
      micBtn.classList.remove('bg-red-600', 'shadow-red-500/40', 'scale-110');
      micBtn.classList.add('bg-gradient-to-br', 'from-amber-500', 'to-amber-700', 'text-white');
      waves.forEach(w => w.classList.add('hidden'));
    }
  }

  render() {
    if (this.modalEl && this.modalEl.parentNode) {
      this.modalEl.parentNode.removeChild(this.modalEl);
    }

    const currentLangObj = getLanguage(this.currentLang);
    const popularPrompts = CHAT_SUGGESTIONS.slice(0, 3);

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md transition-opacity duration-300';
    overlay.id = 'voice-assistant-modal';

    overlay.innerHTML = `
      <div class="relative w-full max-w-xl bg-white dark:bg-[#1A1816] rounded-3xl shadow-2xl border border-amber-500/40 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        
        <!-- Header -->
        <div class="p-5 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-transparent to-transparent">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-600/25 border border-amber-400/40">
              <span class="animate-flame">🎙️</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-extrabold text-stone-900 dark:text-stone-100 font-cinzel">
                  Geetha Voice Assistant
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 uppercase">
                  Multi-Language
                </span>
              </div>
              <p class="text-xs text-stone-500 dark:text-stone-400">
                Speak in any Indian language or English
              </p>
            </div>
          </div>

          <button id="va-close-btn" class="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition">
            ✕
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 flex-1 overflow-y-auto flex flex-col items-center gap-6 text-center">
          
          <!-- Language Selector Pill -->
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs">
            <span class="text-amber-600 dark:text-amber-400">🌐 Voice Language:</span>
            <select id="va-lang-select" class="bg-transparent font-bold text-stone-800 dark:text-stone-200 outline-none cursor-pointer">
              ${LANGUAGES.map(l => `
                <option value="${l.code}" ${l.code === this.currentLang ? 'selected' : ''} class="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                  ${l.nativeName} (${l.name})
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Central Voice Microphone Trigger with Animated Wave Rings -->
          <div class="relative flex items-center justify-center my-3">
            <div class="va-wave-ring hidden absolute w-28 h-28 rounded-full border-2 border-red-500/40 animate-ping"></div>
            <div class="va-wave-ring hidden absolute w-24 h-24 rounded-full bg-red-500/15 animate-pulse"></div>

            <button id="va-mic-trigger" class="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white flex items-center justify-center shadow-xl shadow-amber-600/30 transition-transform duration-300 transform active:scale-95 cursor-pointer">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </button>
          </div>

          <!-- Status Indicator Label -->
          <div class="flex flex-col gap-1">
            <span id="va-status-label" class="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider font-cinzel">
              Tap microphone to speak
            </span>
            <span class="text-[11px] text-stone-400">
              Speak in ${currentLangObj.nativeName} or English
            </span>
          </div>

          <!-- Live Transcribed Voice Speech Box -->
          <div class="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 text-left min-h-[60px] flex items-center">
            <p id="va-transcript-text" class="text-sm text-stone-800 dark:text-stone-200 font-medium italic opacity-60">
              Your spoken words will appear here...
            </p>
          </div>

          <!-- Thinking Spinner -->
          <div id="va-thinking-indicator" class="hidden flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 animate-pulse">
            <span class="animate-spin">☸</span>
            <span>Contemplating relevant shlokas...</span>
          </div>

          <!-- AI Spoken Answer Container -->
          <div id="va-answer-container" class="hidden w-full p-5 rounded-2xl bg-amber-500/[0.06] dark:bg-amber-500/[0.08] border border-amber-500/25 text-left flex flex-col gap-3">
            <div class="flex items-center justify-between border-b border-amber-500/15 pb-2">
              <span class="text-xs font-bold font-cinzel text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <span>🪔</span>
                <span>Geetha GPT Counsel</span>
              </span>
              <button id="va-replay-audio-btn" class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1">
                <span>🔊</span>
                <span>Listen Again</span>
              </button>
            </div>
            <div id="va-answer-text" class="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed max-h-48 overflow-y-auto"></div>
            
            <button id="va-open-full-chat-btn" class="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 hover:from-amber-700 hover:to-amber-800 transition">
              Open Full Chat & Related Verses →
            </button>
          </div>

          <!-- Quick Example Spoken Prompts -->
          <div class="w-full flex flex-col gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
            <span class="text-[11px] font-bold text-stone-400 uppercase tracking-wider font-cinzel">
              Example Voice Prompts:
            </span>
            <div class="flex flex-wrap items-center justify-center gap-2">
              ${popularPrompts.map(p => `
                <button class="va-prompt-chip px-3 py-1 rounded-full bg-stone-100 hover:bg-amber-500/15 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs transition" data-text="${this.currentLang === 'te' ? p.te : p.en}">
                  "${this.currentLang === 'te' ? p.te : p.en}"
                </button>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;

    // Event Handlers
    const closeBtn = overlay.querySelector('#va-close-btn');
    const micTrigger = overlay.querySelector('#va-mic-trigger');
    const langSelect = overlay.querySelector('#va-lang-select');
    const replayBtn = overlay.querySelector('#va-replay-audio-btn');
    const openFullChatBtn = overlay.querySelector('#va-open-full-chat-btn');

    closeBtn.onclick = () => this.close();
    overlay.onclick = (e) => {
      if (e.target === overlay) this.close();
    };

    langSelect.onchange = (e) => {
      this.currentLang = e.target.value;
      soundSynthesizer.playChime();
      this.render();
    };

    micTrigger.onclick = () => {
      if (this.isListening) {
        this.stopListening();
      } else {
        this.startListening();
      }
    };

    overlay.querySelectorAll('.va-prompt-chip').forEach(chip => {
      chip.onclick = () => {
        const text = chip.dataset.text;
        const transcriptEl = overlay.querySelector('#va-transcript-text');
        if (transcriptEl) {
          transcriptEl.textContent = text;
          transcriptEl.classList.remove('italic', 'opacity-60');
        }
        this.currentTranscript = text;
        this.processVoiceQuery(text);
      };
    });

    if (replayBtn) {
      replayBtn.onclick = () => {
        if (this.lastAnswer) {
          soundSynthesizer.playChime();
          speechEngine.speak(this.lastAnswer, this.currentLang);
        }
      };
    }

    if (openFullChatBtn) {
      openFullChatBtn.onclick = () => {
        const q = this.currentTranscript;
        this.close();
        if (this.onNavigate) {
          this.onNavigate('askGeetha', { query: q });
        }
      };
    }

    this.modalEl = overlay;
    document.body.appendChild(overlay);
  }
}

export const voiceAssistantModal = new VoiceAssistantModal();
