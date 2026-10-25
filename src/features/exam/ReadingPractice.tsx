import { useMemo } from 'react';
import { pickItems, READING } from '@/content/exam';
import type { MCQ, ReadingItem } from '@/content/schema';
import { useStore } from '@/store/store';
import { Run, type RunResult } from '../practice/Run';
import { Choices } from '../practice/Exercises';
import { DocumentCard } from './shared';

export function ReadingQuestions({ items, onDone, onExit }: { items: ReadingItem[]; onDone: (r: RunResult) => void; onExit?: () => void }) {
  const flat = useMemo(() => items.flatMap((item) => item.questions.map((q, i) => ({ item, q, i }))), [items]);
  return (
    <Run
      items={flat}
      skill="lezen"
      requeue={false}
      onFinish={onDone}
      onExit={onExit}
      render={({ item, q }: { item: ReadingItem; q: MCQ }, answer, locked) => (
        <div className="flex flex-col gap-4">
          <DocumentCard item={item} />
          <p className="font-display text-2xl" lang="nl">
            {q.q}
          </p>
          <Choices options={q.options} answer={q.answer} onAnswer={answer} locked={locked} explain={q.explain} />
        </div>
      )}
    />
  );
}

/** Lezen practice: real-life texts with exam-style questions. */
export function ReadingPractice({ unit, count, onDone, onExit }: { unit: number; count: number; onDone: (r: RunResult) => void; onExit?: () => void }) {
  const seen = useStore((s) => s.seen);
  const markSeen = useStore((s) => s.markSeen);
  const items = useMemo(() => pickItems(READING, unit, count, seen), []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ReadingQuestions
      items={items}
      onExit={onExit}
      onDone={(r) => {
        markSeen(items.map((i) => i.id));
        onDone(r);
      }}
    />
  );
}
