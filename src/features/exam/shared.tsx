import { useEffect, useRef, useState } from 'react';
import type { ListeningItem, ReadingItem } from '@/content/schema';
import { speakSequence, stopSpeaking } from '@/engine/speech';
import { Icon } from '@/design/icons';
import { speakerVoices } from '../lesson/steps/ListenStep';

const GENRE_LABEL: Record<string, string> = {
  notice: 'Mededeling',
  schedule: 'Rooster',
  form: 'Formulier',
  message: 'Bericht',
  instructions: 'Instructie',
  article: 'Artikel',
  ad: 'Advertentie',
  letter: 'Brief',
  email: 'E-mail',
};

/** A reading text styled as a real-world document. */
export function DocumentCard({ item, compact = false }: { item: ReadingItem; compact?: boolean }) {
  const [open, setOpen] = useState(!compact);
  return (
    <div className="card relative overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line bg-glaze/80 px-4 py-2">
        <span className="chip">{GENRE_LABEL[item.genre] ?? item.genre}</span>
        <p className="truncate font-semibold">{item.title}</p>
        {compact && (
          <button className="ml-auto text-sm text-cobalt" onClick={() => setOpen(!open)}>
            {open ? 'Hide text' : 'Show text'}
          </button>
        )}
      </div>
      {open && (
        <pre className="max-h-[42dvh] overflow-y-auto whitespace-pre-wrap px-5 py-4 font-sans text-[15px] leading-relaxed" lang="nl">
          {item.body}
        </pre>
      )}
    </div>
  );
}

/** Plays a dialogue with two voices; limits plays like the exam does. */
export function DialoguePlayer({ item, maxPlays = 2, autoPlay = true }: { item: ListeningItem; maxPlays?: number; autoPlay?: boolean }) {
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState(-1);
  const cancelled = useRef(false);
  const voiceOf = speakerVoices(item.lines);

  const play = async () => {
    if (playing || plays >= maxPlays) return;
    cancelled.current = false;
    setPlaying(true);
    setPlays((p) => p + 1);
    await speakSequence(
      item.lines.map((l) => ({ text: l.nl, speaker: voiceOf(l) })),
      { gapMs: 350, onLine: setLine, isCancelled: () => cancelled.current },
    );
    setPlaying(false);
  };

  useEffect(() => {
    if (autoPlay) play();
    return () => {
      cancelled.current = true;
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const speakers = [...new Set(item.lines.map((l) => l.who).filter(Boolean))];
  return (
    <div className="card flex items-center gap-4 p-4">
      <button
        onClick={play}
        disabled={playing || plays >= maxPlays}
        className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-cobalt text-white shadow-press disabled:opacity-40"
        aria-label="Play"
      >
        <Icon name={playing ? 'headphones' : 'play'} size={24} />
      </button>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{item.title}</p>
        <p className="text-sm text-muted">{item.situation}</p>
        <div className="mt-2 flex gap-1">
          {item.lines.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i === line && playing ? 'bg-oranje' : 'bg-line'}`} />
          ))}
        </div>
      </div>
      <div className="text-right text-xs text-muted">
        {speakers.join(' · ')}
        <br />
        {maxPlays - plays} {maxPlays - plays === 1 ? 'play' : 'plays'} left
      </div>
    </div>
  );
}

export function Transcript({ item }: { item: ListeningItem }) {
  return (
    <details className="mt-2 text-sm">
      <summary className="cursor-pointer text-cobalt">Show transcript</summary>
      <ul className="mt-1 space-y-0.5">
        {item.lines.map((l, i) => (
          <li key={i}>
            {l.who && <strong>{l.who}: </strong>}
            <span lang="nl">{l.nl}</span> <span className="text-muted">— {l.en}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SectionIntro({ icon, title, children, onStart, cta = 'Start' }: { icon: string; title: string; children: React.ReactNode; onStart: () => void; cta?: string }) {
  return (
    <div className="card flex flex-col items-center gap-4 p-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-cobalt-soft text-cobalt">
        <Icon name={icon} size={32} />
      </div>
      <h2 className="text-3xl">{title}</h2>
      <div className="max-w-md text-muted">{children}</div>
      <button className="btn-primary" onClick={onStart} autoFocus>
        {cta} <Icon name="arrowRight" size={18} />
      </button>
    </div>
  );
}

export function ScoreCard({ correct, total, title, pass = 0.6, children, onContinue }: { correct: number; total: number; title: string; pass?: number; children?: React.ReactNode; onContinue: () => void }) {
  const pct = total ? correct / total : 1;
  const ok = pct >= pass;
  return (
    <div className="card flex flex-col items-center gap-3 p-8 text-center">
      <p className="eyebrow">{title}</p>
      <p className={`font-display text-6xl ${ok ? 'text-polder' : 'text-tulip'}`}>{Math.round(pct * 100)}%</p>
      <p className="text-muted">
        {correct} of {total} correct · {ok ? 'Passed' : `Aim for ${Math.round(pass * 100)}% — try again soon`}
      </p>
      {children}
      <button className="btn-primary mt-2" onClick={onContinue}>
        Continue <Icon name="arrowRight" size={18} />
      </button>
    </div>
  );
}
