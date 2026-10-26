import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { exampleFor, vocabByCardId } from '@/content';
import { withArticle } from '@/content/dsl';
import type { VocabItem } from '@/content/schema';
import { dueCards, isLeech, previewIntervals, Rating } from '@/engine/srs';
import { speak } from '@/engine/speech';
import type { Grade } from 'ts-fsrs';
import { Icon } from '@/design/icons';
import { Bar, Empty, SpeakButton } from '@/design/ui';
import { celebrate, sfx } from '@/design/fx';
import { useStore } from '@/store/store';
import type { SrsCard } from '@/store/types';
import { ArticleChip } from '../lesson/steps/WordsStep';
import { InteractiveText } from '../lesson/InteractiveText';
import type { RunResult } from '../practice/Run';

interface Item {
  card: SrsCard;
  vocabId: string;
  side: 'nl' | 'en';
  v: VocabItem;
  lesson: number;
}

/** Due flashcards, most overdue first. Only one direction of each word per session ("sibling burying"). */
export function buildFlashQueue(flash: Record<string, SrsCard>, limit: number, now = Date.now()): Item[] {
  const seen = new Set<string>();
  const out: Item[] = [];
  for (const card of dueCards(flash, now)) {
    const [vocabId, side] = card.id.split('|') as [string, 'nl' | 'en'];
    if (seen.has(vocabId)) continue;
    const hit = vocabByCardId(vocabId);
    if (!hit) continue;
    seen.add(vocabId);
    out.push({ card, vocabId, side, v: hit.item, lesson: hit.lesson.n });
    if (out.length >= limit) break;
  }
  return out;
}

const RATINGS: [Grade, string, string, string][] = [
  [Rating.Again, 'Again', 'bg-tulip', '1'],
  [Rating.Hard, 'Hard', 'bg-muted', '2'],
  [Rating.Good, 'Good', 'bg-cobalt', '3'],
  [Rating.Easy, 'Easy', 'bg-polder', '4'],
];

function NoteEditor({ vocabId }: { vocabId: string }) {
  const note = useStore((s) => s.marked[vocabId]?.note ?? '');
  const setNote = useStore((s) => s.setMarkNote);
  const [value, setValue] = useState(note);
  const [editing, setEditing] = useState(false);
  if (!editing && !note)
    return (
      <button className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cobalt" onClick={(e) => (e.stopPropagation(), setEditing(true))}>
        <Icon name="bulb" size={15} /> Add a memory hook
      </button>
    );
  if (!editing)
    return (
      <button className="mt-3 w-full rounded-xl bg-oranje/10 px-3 py-2 text-left text-sm" onClick={(e) => (e.stopPropagation(), setEditing(true))}>
        <span className="font-semibold text-oranje">Memory hook: </span>
        {note}
      </button>
    );
  return (
    <div className="mt-3 w-full text-left" onClick={(e) => e.stopPropagation()}>
      <textarea
        autoFocus
        className="input min-h-[70px] py-2 text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          setNote(vocabId, value);
          setEditing(false);
        }}
        onKeyDown={(e) => e.stopPropagation()}
        placeholder="A picture, a sound-alike, a funny sentence… e.g. “de fiets — I fit my feet on the fiets”"
      />
      <p className="text-xs text-muted">Saved when you click outside the box.</p>
    </div>
  );
}

function Card({ item, flipped, onFlip }: { item: Item; flipped: boolean; onFlip: () => void }) {
  const { v, side, lesson } = item;
  const ex = exampleFor(lesson, v);
  const dutch = withArticle(v);
  useEffect(() => {
    if (side === 'nl' && !flipped) speak(dutch);
    if (side === 'en' && flipped) speak(dutch);
  }, [side, flipped, dutch]);

  const front =
    side === 'nl' ? (
      <>
        <ArticleChip art={v.art} />
        <p className="mt-2 font-display text-5xl" lang="nl">
          {v.nl}
        </p>
        <p className="mt-4 text-sm text-muted">What does it mean?</p>
      </>
    ) : (
      <>
        <p className="font-display text-4xl">{v.en}</p>
        <p className="mt-4 text-sm text-muted">Say it in Dutch{v.art ? ' — with de or het' : ''}</p>
      </>
    );

  return (
    <motion.div
      key={item.card.id + (flipped ? 'b' : 'f')}
      initial={{ rotateY: flipped ? -90 : 0, opacity: flipped ? 0 : 1 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.22 }}
      onClick={() => !flipped && onFlip()}
      className={`card relative flex min-h-[300px] flex-col items-center justify-center p-8 text-center ${flipped ? '' : 'cursor-pointer'}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-tile ${v.art === 'het' ? 'bg-het' : v.art === 'de' ? 'bg-de' : 'bg-line'}`} />
      <span className="absolute left-4 top-4 chip">Les {lesson}</span>
      {!flipped ? (
        front
      ) : (
        <>
          <div className="flex items-center gap-2">
            <ArticleChip art={v.art} />
            <p className="font-display text-4xl" lang="nl">
              {v.nl}
            </p>
            <SpeakButton text={dutch} size="sm" />
          </div>
          {v.pl && <p className="text-sm text-muted">plural: {v.pl}</p>}
          <p className="mt-2 text-2xl">{v.en}</p>
          {ex && (
            <div className="mt-4 w-full rounded-xl bg-glaze px-4 py-3 text-left">
              <div className="flex items-start gap-2">
                <SpeakButton text={ex[0]} size="sm" />
                <div>
                  <InteractiveText text={ex[0]} />
                  <p className="text-sm text-muted">{ex[1]}</p>
                </div>
              </div>
            </div>
          )}
          {isLeech(item.card) && (
            <p className="mt-3 text-sm text-tulip">You keep forgetting this one. A memory hook helps a lot.</p>
          )}
          <NoteEditor vocabId={item.vocabId} />
        </>
      )}
    </motion.div>
  );
}

/** A flashcard round for the words the learner marked as hard. */
export function FlashSession({ limit = 30, onDone, onExit }: { limit?: number; onDone: (r: RunResult) => void; onExit?: () => void }) {
  const reviewFlash = useStore((s) => s.reviewFlash);
  const initial = useMemo(() => buildFlashQueue(useStore.getState().flash, limit), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [queue, setQueue] = useState(initial);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const score = useRef({ correct: 0, total: 0 });
  const again = useRef(new Set<string>());
  const item = queue[pos];

  const rate = (g: Grade) => {
    if (!item || !flipped) return;
    reviewFlash(item.card.id, g);
    if (!again.current.has(item.card.id)) {
      score.current.total++;
      if (g !== Rating.Again) score.current.correct++;
    }
    g === Rating.Again ? sfx.wrong() : sfx.right();
    // "Again" means it isn't learned yet: see it once more at the end of this round.
    if (g === Rating.Again && !again.current.has(item.card.id)) {
      again.current.add(item.card.id);
      setQueue((q) => [...q, { ...item, card: useStore.getState().flash[item.card.id] ?? item.card }]);
    }
    setFlipped(false);
    setPos((p) => p + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      }
      const r = RATINGS.find((x) => x[3] === e.key);
      if (r && flipped) rate(r[0]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const finished = pos >= queue.length;
  useEffect(() => {
    if (finished && initial.length) {
      sfx.done();
      if (score.current.total && score.current.correct === score.current.total) celebrate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (!initial.length)
    return (
      <Empty icon="star" title="No flashcards due">
        Mark hard words with the ☆ star — on word cards, in reviews and in a lesson’s word list. They come back here as flashcards.
        <button className="btn-primary mt-4" onClick={() => onDone({ correct: 0, total: 0 })}>
          Continue
        </button>
      </Empty>
    );

  if (finished)
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <Icon name="star" size={36} className="text-oranje" />
        <h2 className="text-3xl">Kaarten klaar!</h2>
        <p className="text-muted">
          {score.current.correct} of {score.current.total} remembered. Hard words come back sooner — that’s what makes them stick.
        </p>
        <button className="btn-primary mt-2" onClick={() => onDone(score.current)}>
          Continue <Icon name="arrowRight" size={18} />
        </button>
      </div>
    );

  const intervals = flipped ? previewIntervals(item.card) : null;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        {onExit && (
          <button className="rounded-full p-1.5 text-muted hover:bg-line/60" onClick={onExit} aria-label="Stop">
            <Icon name="x" />
          </button>
        )}
        <Bar value={pos / queue.length} />
        <span className="whitespace-nowrap text-xs text-muted">
          {pos + 1} / {queue.length}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <Card key={item.card.id + pos} item={item} flipped={flipped} onFlip={() => setFlipped(true)} />
      </AnimatePresence>
      {!flipped ? (
        <button className="btn-primary" onClick={() => setFlipped(true)}>
          Show answer <span className="text-xs opacity-70">(space)</span>
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {RATINGS.map(([g, label, bg, key]) => (
            <button key={label} className={`btn ${bg} flex-col gap-0 px-2 py-2.5 text-white shadow-press`} onClick={() => rate(g)}>
              <span>{label}</span>
              <span className="text-[11px] font-normal opacity-80">
                {intervals?.[g]} · {key}
              </span>
            </button>
          ))}
        </div>
      )}
      <p className="text-center text-xs text-muted">Try to recall the answer before you flip. Be honest — “Again” is how hard words get learned.</p>
    </div>
  );
}
