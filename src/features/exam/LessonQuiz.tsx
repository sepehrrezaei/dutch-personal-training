import { useMemo, useState } from 'react';
import { Empty } from '@/design/ui';
import { celebrate } from '@/design/fx';
import { useStore } from '@/store/store';
import type { RunResult } from '../practice/Run';
import { buildQuiz } from './quizItems';
import { QuizRun } from './QuizRun';
import { ScoreCard } from './shared';

/** Weekly quiz on recent lessons. */
export function LessonQuiz({ lessons, onDone, onExit }: { lessons: number[]; onDone: (r: RunResult) => void; onExit?: () => void }) {
  const items = useMemo(() => buildQuiz(lessons), [lessons.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  const addResult = useStore((s) => s.addResult);
  const [score, setScore] = useState<RunResult | null>(null);
  if (!items.length)
    return (
      <Empty icon="target" title="Nothing to quiz yet">
        Finish a lesson first — then the weekly quiz checks what you learned.
        <button className="btn-primary mt-4" onClick={() => onDone({ correct: 0, total: 0 })}>
          Continue
        </button>
      </Empty>
    );
  if (score) return <ScoreCard title="Weektoets" correct={score.correct} total={score.total} onContinue={() => onDone(score)} />;
  return (
    <QuizRun
      items={items}
      onExit={onExit}
      title={
        <div>
          <p className="eyebrow">Weektoets</p>
          <h2 className="text-2xl">Lessons {lessons.join(', ')}</h2>
        </div>
      }
      onDone={(r) => {
        addResult({ kind: 'quiz', ref: lessons.join(','), score: r.correct, total: r.total });
        if (r.total && r.correct / r.total >= 0.8) celebrate();
        setScore(r);
      }}
    />
  );
}
