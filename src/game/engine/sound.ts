/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private enabled: boolean = true;
  private volume: number = 0.9;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        // Master Dynamics Compressor for loud, punchy arcade game feel
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume * 1.5, this.ctx.currentTime);

        this.compressor.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getDestination(): AudioNode | null {
    const ctx = this.initContext();
    if (!ctx) return null;
    return this.compressor || ctx.destination;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume * 1.5, this.ctx.currentTime);
    }
  }

  public getEnabled(): boolean {
    return this.enabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Loud, punchy arcade card flip with mechanical laser chirp
   */
  public playCardFlip() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.initContext();
      const dest = this.getDestination();
      if (!ctx || !dest) return;

      const now = ctx.currentTime;

      // 1. Retro arcade laser swoop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.09);

      // 2. Tactile click pop
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'square';
      click.frequency.setValueAtTime(800, now);
      click.frequency.exponentialRampToValueAtTime(200, now + 0.035);

      clickGain.gain.setValueAtTime(0.5, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      click.connect(clickGain);
      clickGain.connect(dest);
      click.start(now);
      click.stop(now + 0.035);
    } catch {
      // Audio playback fails silently if restricted
    }
  }

  /**
   * Rich, loud, celebratory arcade match jingle with sub-bass punch & 16-bit power-up chimes
   */
  public playMatchSuccess(combo: number = 1) {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.initContext();
      const dest = this.getDestination();
      if (!ctx || !dest) return;

      const now = ctx.currentTime;

      // 1. Sub-bass arcade impact (punchy 100Hz -> 45Hz thud)
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(45, now + 0.28);

      subGain.gain.setValueAtTime(1.0, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      sub.connect(subGain);
      subGain.connect(dest);
      sub.start(now);
      sub.stop(now + 0.3);

      // 2. 16-bit Arcade celebratory arpeggio (C5 -> E5 -> G5 -> C6 -> E6)
      const pitchMultiplier = Math.min(1.8, 1 + (combo - 1) * 0.15);
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];

      notes.forEach((base, idx) => {
        const freq = base * pitchMultiplier;

        // Dual oscillators (square + triangle) for bright arcade retro bite
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(freq, now + idx * 0.05);
        osc2.frequency.setValueAtTime(freq * 1.005, now + idx * 0.05); // Chorus detune

        const noteStart = now + idx * 0.05;
        const dur = idx === notes.length - 1 ? 0.45 : 0.25;

        noteGain.gain.setValueAtTime(0, noteStart);
        noteGain.gain.linearRampToValueAtTime(0.75, noteStart + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(dest);

        osc1.start(noteStart);
        osc2.start(noteStart);
        osc1.stop(noteStart + dur);
        osc2.stop(noteStart + dur);
      });

      // 3. Arcade Coin / Shimmer bell
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(2093 * pitchMultiplier, now + 0.2); // C7
      bell.frequency.exponentialRampToValueAtTime(3135 * pitchMultiplier, now + 0.45);

      bellGain.gain.setValueAtTime(0.6, now + 0.2);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      bell.connect(bellGain);
      bellGain.connect(dest);
      bell.start(now + 0.2);
      bell.stop(now + 0.45);
    } catch {
      // Audio playback fails silently if restricted
    }
  }

  /**
   * Loud retro buzzer / deflection sound on failed attempt
   */
  public playMatchFail() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.initContext();
      const dest = this.getDestination();
      if (!ctx || !dest) return;

      const now = ctx.currentTime;

      // Two detuned sawtooth waves for arcade "uh-oh" buzzer
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(260, now);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.2);

      osc2.frequency.setValueAtTime(250, now);
      osc2.frequency.exponentialRampToValueAtTime(115, now + 0.2);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(dest);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.22);
      osc2.stop(now + 0.22);
    } catch {
      // Audio playback fails silently
    }
  }

  /**
   * Grand 8-bit / 16-bit Victory Stage Clear Fanfare
   */
  public playVictory() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.initContext();
      const dest = this.getDestination();
      if (!ctx || !dest) return;

      const now = ctx.currentTime;
      // Classic triumphant arcade fanfare
      const melody = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.5]; // C5, C5, C5, E5, G5, C6
      const timings = [0, 0.12, 0.24, 0.36, 0.52, 0.72];

      melody.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const start = now + timings[idx];
        const dur = idx === melody.length - 1 ? 1.2 : 0.22;

        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.85, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(start);
        osc.stop(start + dur);
      });

      // Triumphant sub-bass chord
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sawtooth';
      bass.frequency.setValueAtTime(130.81, now + 0.72); // C3
      bassGain.gain.setValueAtTime(0.7, now + 0.72);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      bass.connect(bassGain);
      bassGain.connect(dest);
      bass.start(now + 0.72);
      bass.stop(now + 1.8);
    } catch {
      // Audio playback fails silently
    }
  }

  /**
   * Loud retro Game Over sound
   */
  public playDefeat() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.initContext();
      const dest = this.getDestination();
      if (!ctx || !dest) return;

      const now = ctx.currentTime;
      const notes = [440, 415.3, 392, 349.23, 261.63];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        const start = now + idx * 0.14;
        const dur = idx === notes.length - 1 ? 0.8 : 0.25;

        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.95, start + dur);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.75, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch {
      // Audio playback fails silently
    }
  }

  public playTimerWarning() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.initContext();
      const dest = this.getDestination();
      if (!ctx || !dest) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const now = ctx.currentTime;

      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio playback fails silently
    }
  }

  public playUiClick() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.initContext();
      const dest = this.getDestination();
      if (!ctx || !dest) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;

      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio playback fails silently
    }
  }

  /**
   * Distinctive two-tone cyber alert when turn switches between players in 2-player mode
   */
  public playTurnSwitch() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.initContext();
      const dest = this.getDestination();
      if (!ctx || !dest) return;

      const now = ctx.currentTime;

      // Tone 1: Cyber chirp ping
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.08); // G5
      gain1.gain.setValueAtTime(0.8, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(dest);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Tone 2: Ascending resolution chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.09); // A5
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22); // D6
      gain2.gain.setValueAtTime(0.85, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(dest);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.35);
    } catch {
      // Audio playback fails silently
    }
  }

  /**
   * Iconic retro arcade 8-bit coin insertion sound
   */
  public playCoinInsert() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.initContext();
      const dest = this.getDestination();
      if (!ctx || !dest) return;

      const now = ctx.currentTime;

      // Note 1: B5 (987.77 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(987.77, now);
      gain1.gain.setValueAtTime(0.85, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
      osc1.connect(gain1);
      gain1.connect(dest);
      osc1.start(now);
      osc1.stop(now + 0.07);

      // Note 2: E6 (1318.51 Hz) - held with punchy ringing decay
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1318.51, now + 0.07);
      gain2.gain.setValueAtTime(0.9, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc2.connect(gain2);
      gain2.connect(dest);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.42);
    } catch {
      // Audio playback fails silently
    }
  }

  /**
   * Triumphant fanfare when player advances in pilot rank
   */
  public playRankUp() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      const ctx = this.initContext();
      const dest = this.getDestination();
      if (!ctx || !dest) return;

      const now = ctx.currentTime;
      const notes = [
        { f: 261.63, t: 0, d: 0.1 },     // C4
        { f: 329.63, t: 0.09, d: 0.1 },  // E4
        { f: 392.00, t: 0.18, d: 0.1 },  // G4
        { f: 523.25, t: 0.27, d: 0.12 }, // C5
        { f: 659.25, t: 0.38, d: 0.12 }, // E5
        { f: 783.99, t: 0.49, d: 0.14 }, // G5
        { f: 1046.50, t: 0.62, d: 0.6 }, // C6 grand finale
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        const start = now + t;
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.8, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(start);
        osc.stop(start + d);
      });

      // Sub-bass impact
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'triangle';
      bass.frequency.setValueAtTime(130.81, now + 0.62);
      bassGain.gain.setValueAtTime(0.85, now + 0.62);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      bass.connect(bassGain);
      bassGain.connect(dest);
      bass.start(now + 0.62);
      bass.stop(now + 1.4);
    } catch {
      // Audio playback fails silently
    }
  }
}

export const soundManager = new SoundSynthesizer();
