/**
 * Geetha GPT - Web Speech API Text-to-Speech Engine
 * Multi-language voice reading for Sanskrit, English, and Telugu
 */

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.listeners = [];
  }

  onStateChange(cb) {
    this.listeners.push(cb);
  }

  notify(state) {
    this.isSpeaking = state;
    this.listeners.forEach(cb => cb(state));
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false);
    }
  }

  /**
   * Speaks the given text in appropriate language
   * @param {string} text 
   * @param {string} langCode 'en' | 'te' | 'sa' | 'hi'
   * @param {function} onEndCallback
   */
  speak(text, langCode = 'en', onEndCallback = null) {
    if (!this.synth) {
      console.warn("Web Speech API not supported in this browser.");
      return;
    }

    this.stop();

    if (!text || !text.trim()) return;

    // Clean text of markdown characters
    const cleanText = text
      .replace(/[#*_`]/g, '')
      .replace(/\|/g, '')
      .replace(/\n+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Voice selection matching language
    const voices = this.synth.getVoices();
    let targetLang = 'en-US';
    if (langCode === 'te') targetLang = 'te-IN';
    else if (langCode === 'sa' || langCode === 'hi') targetLang = 'hi-IN';

    // Find best voice match
    const voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0])) || 
                  voices.find(v => v.lang.includes('en'));
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = targetLang;
    utterance.rate = 0.92; // Slightly measured, peaceful pace
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      this.notify(false);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }
}

export const speechEngine = new SpeechEngine();

