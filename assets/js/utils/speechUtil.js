/**
 * Geetha GPT - Web Speech API Text-to-Speech Engine
 * Multi-language voice reading for all 22 Scheduled Indian Languages + English
 * Features:
 * - Comprehensive language-to-voice locale mapping
 * - Safe chunking for long Sanskrit verses & commentaries
 * - Mutual exclusivity (only 1 voice active at a time; new speech stops previous speech)
 * - Active button tracking and global event bus
 */

const VOICE_LOCALES = {
  en: ['en-IN', 'en-GB', 'en-US'],
  hi: ['hi-IN'],
  te: ['te-IN'],
  ta: ['ta-IN'],
  kn: ['kn-IN'],
  ml: ['ml-IN'],
  mr: ['mr-IN'],
  bn: ['bn-IN'],
  gu: ['gu-IN'],
  pa: ['pa-IN'],
  or: ['or-IN'],
  as: ['as-IN'],
  ur: ['ur-IN'],
  sa: ['sa-IN', 'hi-IN'], // Sanskrit falls back to Hindi Devanagari voice
  ks: ['ks-IN', 'hi-IN'],
  kok: ['kok-IN', 'mr-IN', 'hi-IN'],
  mai: ['mai-IN', 'hi-IN'],
  mni: ['mni-IN', 'bn-IN', 'hi-IN'],
  ne: ['ne-NP', 'hi-IN'],
  brx: ['brx-IN', 'as-IN', 'hi-IN'],
  sat: ['sat-IN', 'hi-IN'],
  sd: ['sd-IN', 'gu-IN', 'hi-IN'],
  doi: ['doi-IN', 'hi-IN']
};

class SpeechEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.activeButtonId = null;
    this.currentText = '';
    this.listeners = [];
    this.cachedVoices = [];

    if (this.synth) {
      this.cachedVoices = this.synth.getVoices();
      if (typeof window !== 'undefined' && 'onvoiceschanged' in this.synth) {
        this.synth.onvoiceschanged = () => {
          this.cachedVoices = this.synth.getVoices();
        };
      }
    }
  }

  onStateChange(cb) {
    if (typeof cb === 'function') {
      this.listeners.push(cb);
    }
  }

  notify(isSpeaking, activeId = null) {
    this.isSpeaking = isSpeaking;
    this.activeButtonId = isSpeaking ? activeId : null;
    this.listeners.forEach(cb => {
      try {
        cb({ isSpeaking: this.isSpeaking, activeButtonId: this.activeButtonId });
      } catch (e) {
        console.warn('Speech listener error:', e);
      }
    });
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
      this.notify(false, null);
    }
  }

  /**
   * Returns matching voice for the requested language code
   * @param {string} langCode 
   */
  findVoiceForLang(langCode = 'en') {
    if (!this.synth) return null;
    const voices = (this.cachedVoices && this.cachedVoices.length) ? this.cachedVoices : this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    const candidateLocales = VOICE_LOCALES[langCode] || [langCode, 'en-IN', 'en-US'];

    // 1. Exact locale match (e.g. te-IN)
    for (const locale of candidateLocales) {
      const match = voices.find(v => v.lang === locale || v.lang.replace('_', '-') === locale);
      if (match) return { voice: match, locale: match.lang };
    }

    // 2. Prefix match (e.g. te)
    for (const locale of candidateLocales) {
      const prefix = locale.split('-')[0];
      const match = voices.find(v => v.lang.toLowerCase().startsWith(prefix.toLowerCase()));
      if (match) return { voice: match, locale: match.lang };
    }

    // 3. Fallback to Hindi for Indian classical/Devanagari scripts
    if (['sa', 'ks', 'kok', 'mai', 'doi', 'sat'].includes(langCode)) {
      const hindiVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi'));
      if (hindiVoice) return { voice: hindiVoice, locale: hindiVoice.lang };
    }

    // 4. Default Indian English or standard voice
    const inVoice = voices.find(v => v.lang === 'en-IN' || v.lang.includes('IN'));
    if (inVoice) return { voice: inVoice, locale: inVoice.lang };

    return voices[0] ? { voice: voices[0], locale: voices[0].lang } : null;
  }

  /**
   * Chunks text by punctuation into natural speech segments
   * @param {string} text 
   */
  chunkText(text) {
    if (!text) return [];
    const clean = text
      .replace(/[#*_`]/g, '')
      .replace(/\|/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Split by danda (।), sentence terminators, or newlines
    const regex = /([^।\.\?!;]+[।\.\?!;]*)/g;
    const matches = clean.match(regex);
    if (!matches || matches.length === 0) return [clean];
    return matches.map(s => s.trim()).filter(Boolean);
  }

  /**
   * Speaks the given text in the appropriate voice
   * @param {string} text 
   * @param {string} langCode 
   * @param {function} onEndCallback 
   * @param {string} buttonId 
   */
  speak(text, langCode = 'en', onEndCallback = null, buttonId = null) {
    if (!this.synth) {
      console.warn("Web Speech API not supported in this environment.");
      if (onEndCallback) onEndCallback();
      return false;
    }

    // If already speaking THIS exact button, toggle off (stop)
    if (this.isSpeaking && this.activeButtonId === buttonId && buttonId !== null) {
      this.stop();
      return false;
    }

    // Always stop any other ongoing speech before starting new speech
    this.stop();

    if (!text || !text.trim()) {
      if (onEndCallback) onEndCallback();
      return false;
    }

    const voiceInfo = this.findVoiceForLang(langCode);
    const chunks = this.chunkText(text);
    if (chunks.length === 0) {
      if (onEndCallback) onEndCallback();
      return false;
    }

    this.notify(true, buttonId);

    let currentChunkIndex = 0;

    const speakNextChunk = () => {
      if (currentChunkIndex >= chunks.length) {
        this.notify(false, null);
        if (onEndCallback) onEndCallback();
        return;
      }

      const chunkText = chunks[currentChunkIndex];
      const utterance = new SpeechSynthesisUtterance(chunkText);

      if (voiceInfo && voiceInfo.voice) {
        utterance.voice = voiceInfo.voice;
        utterance.lang = voiceInfo.locale || voiceInfo.voice.lang;
      } else {
        utterance.lang = VOICE_LOCALES[langCode] ? VOICE_LOCALES[langCode][0] : 'en-US';
      }

      utterance.rate = 0.90; // Slightly measured, peaceful cadence
      utterance.pitch = 1.0;

      utterance.onend = () => {
        currentChunkIndex++;
        speakNextChunk();
      };

      utterance.onerror = (err) => {
        console.warn("SpeechSynthesis error on chunk:", err);
        this.notify(false, null);
        if (onEndCallback) onEndCallback();
      };

      this.currentUtterance = utterance;
      try {
        this.synth.speak(utterance);
      } catch (e) {
        console.warn("Speech speak error:", e);
        this.notify(false, null);
        if (onEndCallback) onEndCallback();
      }
    };

    speakNextChunk();
    return true;
  }
}

export const speechEngine = new SpeechEngine();

export const SPEECH_RECOGNITION_LOCALES = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN',
  ur: 'ur-IN',
  sa: 'sa-IN',
  ks: 'ks-IN',
  kok: 'kok-IN',
  mai: 'mai-IN',
  mni: 'mni-IN',
  ne: 'ne-NP',
  brx: 'brx-IN',
  sat: 'sat-IN',
  sd: 'sd-IN',
  doi: 'doi-IN'
};

/**
 * Multi-Language Speech Recognition Engine for Web Speech API
 */
export class MultiLanguageSpeechRecognizer {
  constructor() {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition || null);
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.isListening = false;
    this.currentLang = 'en';
  }

  isSupported() {
    return Boolean(this.recognition);
  }

  start(options = {}) {
    const {
      lang = 'en',
      onResult = null,
      onError = null,
      onStart = null,
      onEnd = null
    } = options;

    if (!this.recognition) {
      if (onError) onError({ error: 'not-supported', message: 'Speech recognition is not supported in this browser' });
      return false;
    }

    try {
      this.currentLang = lang;
      this.recognition.lang = SPEECH_RECOGNITION_LOCALES[lang] || 'en-IN';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.isListening = true;
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        if (onResult) {
          onResult({
            finalTranscript: finalTranscript.trim(),
            interimTranscript: interimTranscript.trim(),
            transcript: (finalTranscript || interimTranscript).trim(),
            isFinal: Boolean(finalTranscript)
          });
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('SpeechRecognition start error:', e);
      if (onError) onError(e);
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
  }
}

export const speechRecognizer = new MultiLanguageSpeechRecognizer();

