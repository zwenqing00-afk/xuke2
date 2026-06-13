// Web Audio API Heartbeat Synthesizer
export class HeartbeatSynthesizer {
  private ctx: AudioContext | null = null;

  public init() {
    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
      } catch (e) {
        console.warn('Web Audio API is not supported in this browser.', e);
      }
    }
    // Resume context if suspended (browser security)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playLub() {
    this.init();
    if (!this.ctx) return;
    
    const time = this.ctx.currentTime;
    
    // Oscillator 1: fundamental low sound
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, time); // Low pitch (A1)
    osc.frequency.exponentialRampToValueAtTime(25, time + 0.18);
    
    // Low pass filter to make it sound muffled like a chest chest wall
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, time);
    
    // Quick gain ramp
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.8, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    
    osc.start(time);
    osc.stop(time + 0.22);
  }

  public playDub() {
    this.init();
    if (!this.ctx) return;
    
    const time = this.ctx.currentTime;
    
    // Oscillator: Dub sound (slightly higher frequency, slightly snappier)
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, time); // Slightly higher pitch (B1/C2)
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.15);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, time);
    
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.65, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
    
    osc.start(time);
    osc.stop(time + 0.18);
  }
}

export const synther = new HeartbeatSynthesizer();
