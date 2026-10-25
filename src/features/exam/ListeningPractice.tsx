import { useMemo } from 'react';
import { LISTENING, pickItems } from '@/content/exam';
import type { ListeningItem, MCQ } from '@/content/schema';
import { useStore } from '@/store/store';
import { Run, type RunResult } from '../practice/Run';
import { Choices } from '../practice/Exercises';
import { DialoguePlayer, Transcript } from './shared';

export function ListeningQuestions({ items, onDone, onExit, maxPlays = 2 }: { items: ListeningItem[]; onDone: (r: RunResult) => void; onExit?: () => void; maxPlays?: number }) {
  const flat = useMemo(() => items.flatMap((item) => item.questions.map((q, i) => ({ item, q, i }))), [items]);
  return (
    <Run
      items={flat}
      skill="luisteren"
      requeue={false}
      onFinish={onDone}
      onExit={onExit}
      render={({ item, q, i }: { item: ListeningItem; q: MCQ; i: number }, answer, locked) => (
        <div className="flex flex-col gap-4">
          <DialoguePlayer item={item} maxPlays={maxPlays} autoPlay={i === 0} />
          <p className="font-display text-2xl" lang="nl">
            {q.q}
          </p>
          <Choices
            options={q.options}
            answer={q.answer}
            locked={locked}
            onAnswer={(r) => answer({ ...r, extra: i === item.questions.length - 1 ? <Transcript item={item} /> : undefined })}
          />
        </div>
      )}
    />
  );
}

/** Luisteren practice: everyday dialogues with exam-style questions. */
export function ListeningPractice({ unit, count, onDone, onExit }: { unit: number; count: number; onDone: (r: RunResult) => void; onExit?: () => void }) {
  const seen = useStore((s) => s.seen);
  const markSeen = useStore((s) => s.markSeen);
  const items = useMemo(() => pickItems(LISTENING, unit, count, seen), []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ListeningQuestions
      items={items}
      onExit={onExit}
      onDone={(r) => {
        markSeen(items.map((i) => i.id));
        onDone(r);
      }}
    />
  );
}
