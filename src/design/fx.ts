import confetti from 'canvas-confetti';
import { create } from 'zustand';
import { useStore } from '@/store/store';

/* Celebration effects: confetti in Delft colours, tiny synthesized sounds, and toasts. */

const COLORS = ['#1d3f8f', '#f07a1a', '#d6442f', '#f6f0e3', '#2e875c'];

export function celebrate(big = false) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  confetti({ particleCount: big ? 160 : 70, spread: big ? 100 : 70, origin: { y: 0.65 }, colors: COLORS, scalar: big ? 1.1 : 0.9, disableForReducedMotion: true });
  if (big) setTimeout(() => confetti({ particleCount: 90, angle: 60, spread: 70, origin: { x: 0 }, colors: COLORS }), 250);
  if (big) setTimeout(() => confetti({ particleCount: 90, angle: 120, spread: 70, origin: { x: 1 }, colors: COLORS }), 400);
}

let ctx: AudioContext | null = null;
function tone(freqs: number[], dur = 0.09, type: OscillatorType = 'sine', gain = 0.07) {
  if (!useStore.getState().settings.sound) return;
  try {
    ctx ??= new AudioContext();
    let t = ctx.currentTime;
    for (const f of freqs) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.6);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur * 1.7);
      t += dur;
    }
  } catch {
    /* audio unavailable */
  }
}

export const sfx = {
  right: () => tone([660, 880], 0.08, 'triangle'),
  wrong: () => tone([220, 180], 0.11, 'sine', 0.06),
  done: () => tone([523, 659, 784, 1047], 0.1, 'triangle'),
  tap: () => tone([440], 0.04, 'sine', 0.03),
};

export interface Toast {
  id: number;
  icon: string;
  title: string;
  text?: string;
}

export const useToasts = create<{ toasts: Toast[]; push(t: Omit<Toast, 'id'>): void; dismiss(id: number): void }>((set) => ({
  toasts: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 4200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export function toast(t: Omit<Toast, 'id'>) {
  useToasts.getState().push(t);
}
