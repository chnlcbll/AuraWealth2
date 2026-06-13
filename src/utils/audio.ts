// A simple Web Audio API synthesizer for tiny UI sounds

let audioCtx: AudioContext | null = null;
let isMuted = false;

try {
  if (typeof window !== 'undefined') {
    isMuted = localStorage.getItem('aurawealth_muted') === 'true';
  }
} catch (e) {}

export const toggleMute = () => {
  isMuted = !isMuted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('aurawealth_muted', String(isMuted));
  }
  return isMuted;
};

export const getMuteState = () => isMuted;

const getContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const playSound = (type: 'click' | 'hover' | 'success' | 'save' | 'coin' | 'keystroke' = 'click') => {
  if (isMuted) return;
  try {
    const ctx = getContext();
    if (!ctx) return;
    
    // Resume context if suspended (browser behavior)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gainNode.gain.setValueAtTime(0.02, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'keystroke') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(Math.random() * 200 + 400, now);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success' || type === 'save') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(600, now + 0.1);
      osc.frequency.setValueAtTime(800, now + 0.2);
      
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.setValueAtTime(0.05, now + 0.1);
      gainNode.gain.setValueAtTime(0.05, now + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (err) {
    // Ignore audio errors
  }
};
