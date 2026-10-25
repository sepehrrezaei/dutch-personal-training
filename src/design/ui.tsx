import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Icon } from './icons';
import { speak } from '@/engine/speech';

export function ProgressRing({ value, size = 64, stroke = 7, children, color = 'rgb(var(--oranje))' }: { value: number; size?: number; stroke?: number; children?: ReactNode; color?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgb(var(--line))" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v) }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function Bar({ value, className = '', color = 'bg-oranje' }: { value: number; className?: string; color?: string }) {
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-line/70 ${className}`}>
      <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} transition={{ duration: 0.5 }} />
    </div>
  );
}

export function SpeakButton({ text, speaker, className = '', size = 'md', slow = false }: { text: string; speaker?: number; className?: string; size?: 'sm' | 'md' | 'lg'; slow?: boolean }) {
  const dims = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text, { speaker, rate: slow ? 0.7 : undefined });
      }}
      className={`grid shrink-0 place-items-center rounded-full bg-cobalt-soft text-cobalt transition hover:scale-105 active:scale-95 ${dims} ${className}`}
      aria-label={slow ? 'Play slowly' : 'Play'}
      title={slow ? 'Slow' : 'Listen'}
    >
      <Icon name={slow ? 'slow' : 'speaker'} size={size === 'lg' ? 26 : size === 'sm' ? 16 : 20} />
    </button>
  );
}

export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-end bg-black/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="card max-h-[88dvh] w-full overflow-y-auto rounded-b-none p-6 sm:max-w-lg sm:rounded-tile"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              {title && <h3 className="text-2xl">{title}</h3>}
              <button className="ml-auto rounded-full p-2 text-muted hover:bg-line/50" onClick={onClose} aria-label="Close">
                <Icon name="x" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-6">
      {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
      <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
      {children && <div className="mt-2 text-muted">{children}</div>}
    </header>
  );
}

export function Empty({ icon, title, children }: { icon: string; title: string; children?: ReactNode }) {
  return (
    <div className="card grid place-items-center gap-2 p-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cobalt-soft text-cobalt">
        <Icon name={icon} size={28} />
      </div>
      <h3 className="text-xl">{title}</h3>
      {children && <div className="max-w-sm text-sm text-muted">{children}</div>}
    </div>
  );
}

/** Shuffle a copy of an array (Fisher–Yates). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
