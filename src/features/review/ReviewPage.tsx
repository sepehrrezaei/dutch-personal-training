import { useState } from 'react';
import { dueCount, isKnown } from '@/engine/srs';
import { Icon } from '@/design/icons';
import { PageHeader } from '@/design/ui';
import { celebrate } from '@/design/fx';
import { useStore } from '@/store/store';
import { ReviewDeck } from './ReviewDeck';

export function ReviewPage() {
  const srs = useStore((s) => s.srs);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);
  const cards = Object.values(srs);
  const due = dueCount(srs);
  const known = cards.filter(isKnown).length;
  const learning = cards.length - known;
  const tomorrow = cards.filter((c) => c.due <= Date.now() + 864e5).length;

  if (running)
    return (
      <div className="mx-auto max-w-2xl">
        <ReviewDeck
          key={round}
          limit={50}
          onExit={() => setRunning(false)}
          onDone={() => {
            celebrate();
            setRunning(false);
            setRound((r) => r + 1);
          }}
        />
      </div>
    );

  return (
    <div>
      <PageHeader eyebrow="Herhalen · spaced repetition" title="Je woorden">
        Words come back just before you would forget them (FSRS algorithm). A few minutes every day is all it takes.
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['cards', due, 'due now', 'text-oranje'],
          ['sparkles', learning, 'still learning', 'text-cobalt'],
          ['check', known, 'known well', 'text-polder'],
        ].map(([icon, n, label, color]) => (
          <div key={label as string} className="card flex items-center gap-4 p-5">
            <Icon name={icon as string} size={28} className={color as string} />
            <div>
              <p className="font-display text-4xl leading-none">{n}</p>
              <p className="text-sm text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card mt-5 flex flex-col items-center gap-3 p-8 text-center">
        {due > 0 ? (
          <>
            <h2 className="text-3xl">{due} words are waiting</h2>
            <p className="text-muted">Recognise, type and listen. Mistakes come back sooner — that's how memory works.</p>
            <button className="btn-orange mt-2" onClick={() => setRunning(true)}>
              <Icon name="play" size={18} /> Review now
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl">All caught up!</h2>
            <p className="text-muted">{cards.length ? `${tomorrow} words will be due within a day.` : 'Words appear here after the “Woorden” step of a lesson.'}</p>
          </>
        )}
      </div>
    </div>
  );
}
