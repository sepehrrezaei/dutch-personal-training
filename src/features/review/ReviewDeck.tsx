import { useEffect, useMemo, useRef, useState } from 'react';
import { acceptedForms, vocabByCardId } from '@/content';
import { withArticle } from '@/content/dsl';
import type { VocabItem } from '@/content/schema';
import { check } from '@/engine/checker';
import { dueCards, modeFor, Rating, type ReviewMode } from '@/engine/srs';
import { speak } from '@/engine/speech';
import { Icon } from '@/design/icons';
import { Empty, SpeakButton } from '@/design/ui';
import { useStore } from '@/store/store';
import type { Grade } from 'ts-fsrs';
import { Run, type AnswerResult, type RunResult } from '../practice/Run';
import { TextAnswer } from '../practice/Exercises';
import { ArticleChip } from '../lesson/steps/WordsStep';

interface Item {
  id: string;
  v: VocabItem;
  mode: ReviewMode;
}

function Recognize({ v, rate }: { v: VocabItem; rate: (g: Grade) => void }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    speak(withArticle(v));
  }, [v]);
  return (
    <div className="flex flex-col gap-6">
      <p className="eyebrow">Do you know this word?</p>
      <div className="card p-8 text-center">
        <div className="mb-2 flex justify-center">
          <ArticleChip art={v.art} />
        </div>
        <p className="font-display text-5xl" lang="nl">
          {v.nl}
        </p>
        <div className="mt-3 flex justify-center">
          <SpeakButton text={withArticle(v)} />
        </div>
        {shown && <p className="mt-5 text-2xl text-ink/80">{v.en}</p>}
      </div>
      {!shown ? (
        <button className="btn-primary" onClick={() => setShown(true)} autoFocus>
          Show meaning
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {(
            [
              [Rating.Again, 'Again', 'bg-tulip'],
              [Rating.Hard, 'Hard', 'bg-oranje'],
              [Rating.Good, 'Good', 'bg-cobalt'],
              [Rating.Easy, 'Easy', 'bg-polder'],
            ] as const
          ).map(([g, label, bg]) => (
            <button key={label} className={`btn ${bg} px-2 text-white shadow-press`} onClick={() => rate(g)}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Produce({ v, mode, answer, locked }: { v: VocabItem; mode: ReviewMode; answer: (r: AnswerResult, g: Grade) => void; locked: boolean }) {
  const started = useRef(Date.now());
  useEffect(() => {
    if (mode === 'listen') speak(withArticle(v));
  }, [v, mode]);
  const accepted = acceptedForms(v);
  return (
    <div className="flex flex-col gap-5">
      {mode === 'listen' ? (
        <>
          <p className="eyebrow">Write the word you hear</p>
          <div className="flex gap-2">
            <SpeakButton text={withArticle(v)} size="lg" />
            <SpeakButton text={withArticle(v)} slow />
          </div>
        </>
      ) : (
        <>
          <p className="eyebrow">In Dutch{v.art ? ' — with de or het' : ''}</p>
          <p className="font-display text-4xl">{v.en}</p>
        </>
      )}
      <TextAnswer
        locked={locked}
        onSubmit={(val) => {
          const r = check(val, accepted);
          const secs = (Date.now() - started.current) / 1000;
          const g: Grade = !r.ok ? Rating.Again : r.verdict === 'correct' ? (secs < 6 ? Rating.Easy : Rating.Good) : Rating.Hard;
          speak(withArticle(v));
          answer({ ok: r.ok, expected: `${withArticle(v)} — ${v.en}`, note: r.note }, g);
        }}
      />
    </div>
  );
}

/** Spaced-repetition review of learned words. */
export function ReviewDeck({ limit = 40, onDone, onExit }: { limit?: number; onDone: (r: RunResult) => void; onExit?: () => void }) {
  const srs = useStore((s) => s.srs);
  const reviewCard = useStore((s) => s.reviewCard);
  const rated = useRef(new Set<string>());
  // Snapshot the queue when the deck opens so reviewing doesn't reshuffle it.
  const items: Item[] = useMemo(
    () =>
      dueCards(srs, Date.now(), limit)
        .map((c) => {
          const hit = vocabByCardId(c.id);
          return hit ? { id: c.id, v: hit.item, mode: modeFor(c) } : null;
        })
        .filter((x): x is Item => !!x),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!items.length) {
    return (
      <Empty icon="sparkles" title="All caught up!">
        No words are due for review right now. New words are added when you finish the “Woorden” step of a lesson.
        <button className="btn-primary mt-4" onClick={() => onDone({ correct: 0, total: 0 })}>
          Continue <Icon name="arrowRight" size={18} />
        </button>
      </Empty>
    );
  }

  const rate = (id: string, g: Grade) => {
    if (rated.current.has(id)) return;
    rated.current.add(id);
    reviewCard(id, g);
  };

  return (
    <Run
      items={items}
      skill="woorden"
      onFinish={onDone}
      onExit={onExit}
      title={<p className="text-sm text-muted">{items.length} words to review</p>}
      render={(item, answer, locked) =>
        item.mode === 'recognize' ? (
          <Recognize
            v={item.v}
            rate={(g) => {
              rate(item.id, g);
              answer({ ok: g !== Rating.Again, auto: true });
            }}
          />
        ) : (
          <Produce
            v={item.v}
            mode={item.mode}
            locked={locked}
            answer={(r, g) => {
              rate(item.id, g);
              answer(r);
            }}
          />
        )
      }
    />
  );
}
