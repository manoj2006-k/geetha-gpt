/**
 * Geetha GPT - Reusable Voice / Text-to-Speech Button Component
 * Provides seamless Play / Stop states, mutual exclusivity across the entire DOM,
 * animated audio wave bars, accessible ARIA labels, and multilingual voice mapping.
 */

import { speechEngine } from '../utils/speechUtil.js';
import { soundSynthesizer } from '../utils/soundUtil.js';
import { I18N } from '../data/i18n.js';
import { toastManager } from './Toast.js';

let voiceButtonCounter = 0;

/**
 * Creates and returns a reactive VoiceButton DOM node
 * @param {Object} options
 * @param {string} options.text - The text to be spoken
 * @param {string} [options.lang='en'] - The language of the text ('sa', 'en', 'te', 'hi', etc.)
 * @param {string} [options.uiLang='en'] - The current interface language for localized labels
 * @param {string} [options.label=''] - Optional custom button text override
 * @param {boolean} [options.showLabel=true] - Whether to display text alongside the icon
 * @param {string} [options.variant='pill'] - 'pill' | 'compact' | 'icon' | 'outline'
 * @param {string} [options.ariaLabel=''] - Accessible label for screen readers
 * @param {string} [options.className=''] - Additional CSS classes
 * @returns {HTMLButtonElement}
 */
export function renderVoiceButton(options = {}) {
  const {
    text = '',
    lang = 'en',
    uiLang = 'en',
    label = '',
    showLabel = true,
    variant = options.variant || options.buttonStyle || 'pill',
    ariaLabel = '',
    className = ''
  } = options;

  const btnId = `voice-btn-${++voiceButtonCounter}`;
  const dict = I18N[uiLang] || I18N.en;
  const voiceText = dict.voice || {};

  const listenLabel = label || voiceText.listen || 'Listen';
  const stopLabel = voiceText.stop || 'Stop';
  const defaultAria = ariaLabel || voiceText.ariaListen || 'Listen to this passage';
  const stopAria = voiceText.ariaStop || 'Stop audio playback';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = btnId;
  btn.setAttribute('aria-label', defaultAria);

  // Variant styling
  let baseClasses = 'inline-flex items-center gap-1.5 transition-all duration-200 select-none font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30';
  if (variant === 'pill') {
    baseClasses += ' px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/20 text-xs shadow-sm';
  } else if (variant === 'compact') {
    baseClasses += ' px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-500/15 text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 text-[11px]';
  } else if (variant === 'icon') {
    baseClasses += ' p-2 rounded-xl text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 hover:bg-amber-500/10';
  } else if (variant === 'outline') {
    baseClasses += ' px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 text-stone-700 dark:text-stone-300 hover:text-amber-600 text-xs';
  } else if (variant === 'ghost') {
    baseClasses += ' px-2.5 py-1 rounded-lg hover:bg-amber-500/10 text-stone-600 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 text-xs';
  } else if (variant === 'secondary') {
    baseClasses += ' px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs';
  }

  btn.className = `${baseClasses} ${className}`.trim();

  // Set initial idle HTML
  const setIdleState = () => {
    btn.setAttribute('aria-label', defaultAria);
    btn.classList.remove('bg-amber-600', 'text-white', 'hover:bg-amber-700', 'border-transparent');
    btn.innerHTML = `
      <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
      </svg>
      ${showLabel ? `<span class="voice-btn-label">${listenLabel}</span>` : ''}
    `;
  };

  // Set speaking active HTML
  const setSpeakingState = () => {
    btn.setAttribute('aria-label', stopAria);
    btn.classList.add('bg-amber-600', 'text-white', 'hover:bg-amber-700', 'border-transparent');
    btn.innerHTML = `
      <span class="flex items-center gap-0.5 flex-shrink-0">
        <span class="w-0.5 h-3 bg-white animate-pulse"></span>
        <span class="w-0.5 h-4 bg-white animate-pulse delay-75"></span>
        <span class="w-0.5 h-2 bg-white animate-pulse delay-150"></span>
      </span>
      <svg class="w-3 h-3 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="2"></rect>
      </svg>
      ${showLabel ? `<span class="voice-btn-label font-bold">${stopLabel}</span>` : ''}
    `;
  };

  setIdleState();

  // Listen to speechEngine global events for mutual exclusivity
  speechEngine.onStateChange(({ isSpeaking, activeButtonId }) => {
    if (activeButtonId === btnId && isSpeaking) {
      setSpeakingState();
    } else {
      setIdleState();
    }
  });

  // On click: toggle play/stop
  btn.onclick = (e) => {
    e.stopPropagation();
    if (speechEngine.isSpeaking && speechEngine.activeButtonId === btnId) {
      speechEngine.stop();
      setIdleState();
    } else {
      if (!text || !text.trim()) {
        toastManager.show("No text to speak", "info");
        return;
      }
      soundSynthesizer.playZenBell();
      const started = speechEngine.speak(text, lang, () => {
        setIdleState();
      }, btnId);

      if (!started && !speechEngine.synth) {
        toastManager.show(voiceText.error || "Web Speech API is unavailable in this browser.", "info");
      }
    }
  };

  return btn;
}
