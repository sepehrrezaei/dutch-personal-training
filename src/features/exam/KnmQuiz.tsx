import { useMemo, useState } from 'react';
import { getKnm, KNM } from '@/content/knm';
import type { MCQ } from '@/content/schema';
import { Icon } from '@/design/icons';
import { shuffle } from '@/design/ui';
import { useStore } from '@/store/store';
import { Run, type RunResult } from '../practice/Run';
import { Choices } from '../practice/Exercises';
import { ScoreCard } from './shared';

export function KnmQuestions({ questions, onDone, onExit }: { questions: MCQ[]; onDone: (r: RunResult) => void; onExit?: () => void }) {
  return (
    <Run
      items={questions}
      skill="knm"
      requeue={false}
      onFinish={onDone}
      onExit={onExit}
      render={(q, answer, locked) => (
        <div className="flex flex-col gap-5">
          <p className="eyebrow flex items-center gap-1">
            <Icon name="landmark" size={14} /> KNM
          </p>
          <p className="font-display text-2xl leading-snug" lang="nl">
            {q.q}
          </p>
          <Choices options={q.options} answer={q.answer} onAnswer={answer} locked={locked} explain={q.explain} />
        </div>
      )}
    />
  );
}

/** Random KNM questions across all themes (for mock exams). */
export function randomKnm(n: number): MCQ[] {
  return shuffle(KNM.flatMap((k) => k.questions)).slice(0, n);
}

/** Learn a KNM theme: key facts first, then 10 questions. */
export function KnmQuiz({ theme, onDone, onExit }: { theme: string; onDone: (r: RunResult) => void; onExit?: () => void }) {
  const t = getKnm(theme) ?? KNM[0];
  const addResult = useStore((s) => s.addResult);
  const [stage, setStage] = useState<'learn' | 'quiz' | 'done'>('learn');
  const [score, setScore] = useState<RunResult>({ correct: 0, total: 0 });
  const questions = useMemo(() => shuffle(t.questions).slice(0, 10), [t]);

  if (stage === 'learn')
    return (
      <div className="flex flex-col gap-5">
        <header>
          <p className="eyebrow">Kennis van de Nederlandse Maatschappij</p>
          <h2 className="text-4xl">{t.title}</h2>
          <p className="text-muted">
            {t.titleEn} — {t.intro}
          </p>
        </header>
        <ul className="grid gap-2.5">
          {t.facts.map(([nl, en], i) => (
            <li key={i} className="card flex gap-3 p-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-oranje/15 text-sm font-bold text-oranje">{i + 1}</span>
              <div>
                <p lang="nl" className="font-medium">
                  {nl}
                </p>
                <p className="text-sm text-muted">{en}</p>
              </div>
            </li>
          ))}
        </ul>
        <button className="btn-orange" onClick={() => setStage('quiz')}>
          Test yourself ({questions.length} questions) <Icon name="arrowRight" size={18} />
        </button>
      </div>
    );

  if (stage === 'quiz')
    return (
      <KnmQuestions
        questions={questions}
        onExit={onExit}
        onDone={(r) => {
          addResult({ kind: 'knm', ref: t.id, score: r.correct, total: r.total });
          setScore(r);
          setStage('done');
        }}
      />
    );

  return <ScoreCard title={`KNM · ${t.title}`} correct={score.correct} total={score.total} onContinue={() => onDone(score)} />;
}
