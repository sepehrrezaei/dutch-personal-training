import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/design/icons';
import { Bar } from '@/design/ui';
import { sfx } from '@/design/fx';
import { useStore } from '@/store/store';
import type { Skill } from '@/store/types';

export interface AnswerResult {
  ok: boolean;
  /** The right answer to show when wrong (or as a reminder). */
  expected?: string;
  note?: string;
  /** Extra content under the verdict, e.g. a translation. */
  extra?: ReactNode;
  /** Don't count this answer towards the score (e.g. self-rated speaking). */
  unscored?: boolean;
  /** Skip the feedback bar and move straight on (self-rated flashcards). */
  auto?: boolean;
}

export interface RunResult {
  correct: number;
  total: number;
}

interface Props<T> {
  items: T[];
  skill: Skill;
  /** Put wrongly answered items back at the end of the queue (once). */
  requeue?: boolean;
  title?: ReactNode;
  render: (item: T, answer: (r: AnswerResult) => void, locked: boolean) => ReactNode;
  onFinish: (r: RunResult) => void;
  onExit?: () => void;
}

/** Runs a queue of exercises: progress bar, combo counter, feedback bar and continue. */
export function Run<T>({ items, skill, requeue = true, title, render, onFinish, onExit }: Props<T>) {
  const answerSkill = useStore((s) => s.answer);
  const [queue, setQueue] = useState(() => items.map((item, i) => ({ item, key: `${i}` })));
  const [pos, setPos] = useState(0);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [combo, setCombo] = useState(0);
  const score = useRef({ correct: 0, total: 0 });
  const requeued = useRef(new Set<string>());
  const continueRef = useRef<HTMLButtonElement>(null);

  const current = queue[pos];
  const done = pos >= queue.length;

  useEffect(() => {
    if (done) onFinish(score.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => {
    if (result) continueRef.current?.focus();
  }, [result]);

  if (done || !current) return null;

  const answer = (r: AnswerResult) => {
    if (result) return;
    if (!r.auto) setResult(r);
    else setTimeout(() => setPos((p) => p + 1), 120);
    if (r.unscored) return;
    const first = !current.key.endsWith('r');
    if (first) {
      score.current.total++;
      if (r.ok) score.current.correct++;
      answerSkill(skill, r.ok);
    }
    if (r.ok) {
      sfx.right();
      setCombo((c) => c + 1);
    } else {
      sfx.wrong();
      setCombo(0);
      if (requeue && !requeued.current.has(current.key)) {
        requeued.current.add(current.key);
        setQueue((q) => [...q, { item: current.item, key: `${current.key}r` }]);
      }
    }
  };

  const next = () => {
    setResult(null);
    setPos((p) => p + 1);
  };

  return (
    <div className="flex min-h-[60dvh] flex-col">
      <div className="mb-5 flex items-center gap-3">
        {onExit && (
          <button className="rounded-full p-1.5 text-muted hover:bg-line/60" onClick={onExit} aria-label="Stop">
            <Icon name="x" />
          </button>
        )}
        <Bar value={pos / queue.length} />
        <AnimatePresence>
          {combo >= 3 && (
            <motion.span key={combo} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 whitespace-nowrap text-sm font-bold text-oranje">
              <Icon name="bolt" size={16} /> {combo}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {title && <div className="mb-4">{title}</div>}
      <AnimatePresence mode="wait">
        <motion.div key={current.key + pos} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }} className="flex-1">
          {render(current.item, answer, !!result)}
        </motion.div>
      </AnimatePresence>
      <Feedback result={result} onNext={next} buttonRef={continueRef} />
    </div>
  );
}

export function Feedback({ result, onNext, buttonRef }: { result: AnswerResult | null; onNext: () => void; buttonRef?: React.Ref<HTMLButtonElement> }) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className={`safe-bottom fixed inset-x-0 bottom-0 z-40 border-t-2 px-4 pt-4 md:left-64 ${
            result.unscored ? 'border-line bg-paper' : result.ok ? 'border-polder/40 bg-[rgb(var(--polder)/0.12)]' : 'border-tulip/40 bg-[rgb(var(--tulip)/0.12)]'
          } backdrop-blur`}
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-3 pb-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-start gap-3">
              {!result.unscored && (
                <motion.div
                  initial={{ scale: 0.4, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-white ${result.ok ? 'bg-polder' : 'bg-tulip'}`}
                >
                  <Icon name={result.ok ? 'check' : 'x'} size={22} strokeWidth={2.6} />
                </motion.div>
              )}
              <div className="min-w-0">
                <p className={`font-display text-xl ${result.unscored ? 'text-ink' : result.ok ? 'text-polder' : 'text-tulip'}`}>
                  {result.unscored ? 'Compare' : result.ok ? pick(PRAISE) : 'Not quite'}
                </p>
                {result.expected && (!result.ok || result.note || result.unscored) && (
                  <p className="text-ink">
                    <span className="text-muted">{result.unscored ? 'Model answer: ' : result.ok ? 'Answer: ' : 'Correct answer: '}</span>
                    <strong>{result.expected}</strong>
                  </p>
                )}
                {result.note && <p className="text-sm text-muted">{result.note}</p>}
                {result.extra}
              </div>
            </div>
            <button ref={buttonRef} className={result.ok || result.unscored ? 'btn-primary sm:w-44' : 'btn-orange sm:w-44'} onClick={onNext}>
              Continue <Icon name="arrowRight" size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const PRAISE = ['Goed zo!', 'Prima!', 'Heel goed!', 'Uitstekend!', 'Super!', 'Top!', 'Knap!'];
function pick<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}
