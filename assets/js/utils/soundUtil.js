/**
 * Geetha GPT - Web Audio API Zen Bell & Chime Synthesizer
 * 100% Client-Side, No External Audio Files Required
 */

class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
  }

  setEnabled(val) {
    this.enabled = !!val;
  }

  /**
   * Plays a peaceful, resonant Tibetan Singing Bowl / Temple Bell harmonic tone
   */
  playZenBell() {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Frequencies for a soothing warm temple bell chord (G4, D5, G5)
      const freqs = [392.0, 587.33, 783.99, 1174.66];
      const masterGain = this.audioCtx.createGain();
      masterGain.connect(this.audioCtx.destination);
      masterGain.gain.setValueAtTime(0.2, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      freqs.forEach((f, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        
        gain.gain.setValueAtTime(0.25 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch (e) {
      console.warn("Audio synthesis not available:", e);
    }
  }

  /**
   * Plays a subtle, gentle water drop / affirmation chime
   */
  playChime() {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now); // 528Hz Transformation tone
      osc.frequency.exponentialRampToValueAtTime(1056, now + 0.25);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }
}

export const soundSynthesizer = new SoundSynthesizer();

