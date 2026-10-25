import { useMemo, useState } from 'react';
import { lessonsOf, UNITS } from '@/content';
import { pickItems, READING } from '@/content/exam';
import { Icon } from '@/design/icons';
import { celebrate } from '@/design/fx';
import { useStore } from '@/store/store';
import type { RunResult } from '../practice/Run';
import { buildQuiz } from './quizItems';
import { QuizRun } from './QuizRun';
import { ReadingQuestions } from './ReadingPractice';
import { ScoreCard, SectionIntro } from './shared';

const PASS = 0.6;

/** End-of-unit test. Passing it completes the unit. */
export function Checkpoint({ unit, onDone, onExit }: { unit: number; onDone: (r: RunResult) => void; onExit?: () => void }) {
  const u = UNITS[unit - 1];
  const complete = useStore((s) => s.completeCheckpoint);
  const addResult = useStore((s) => s.addResult);
  const quiz = useMemo(() => buildQuiz(lessonsOf(unit), { vocab: 2, grammar: 1, text: 1, dictation: 0 }), [unit]);
  const reading = useMemo(() => pickItems(READING, unit, 1, []), [unit]);
  const [stage, setStage] = useState<'intro' | 'quiz' | 'reading' | 'done'>('intro');
  const [score, setScore] = useState<RunResult>({ correct: 0, total: 0 });

  if (stage === 'intro')
    return (
      <SectionIntro icon="medal" title={`Toets: ${u.title}`} onStart={() => setStage('quiz')}>
        A test on all of unit {unit}: words, grammar, the lesson texts and a reading text. Score {PASS * 100}% or more to complete the unit.
      </SectionIntro>
    );
  if (stage === 'quiz')
    return (
      <QuizRun
        items={quiz}
        onExit={onExit}
        onDone={(r) => {
          setScore(r);
          setStage('reading');
        }}
      />
    );
  if (stage === 'reading')
    return (
      <ReadingQuestions
        items={reading}
        onExit={onExit}
        onDone={(r) => {
          const total = { correct: score.correct + r.correct, total: score.total + r.total };
          setScore(total);
          addResult({ kind: 'checkpoint', ref: String(unit), score: total.correct, total: total.total });
          if (total.total && total.correct / total.total >= PASS) {
            complete(unit);
            celebrate(true);
          }
          setStage('done');
        }}
      />
    );
  const passed = score.total > 0 && score.correct / score.total >= PASS;
  return (
    <ScoreCard title={`Toets unit ${unit}`} correct={score.correct} total={score.total} pass={PASS} onContinue={() => onDone(score)}>
      {passed ? (
        <p className="flex items-center gap-2 font-semibold text-polder">
          <Icon name="medal" /> Unit {unit} complete — the tiles are fired!
        </p>
      ) : (
        <p className="text-sm text-muted">The test comes back next weekend. Review the words of this unit until then.</p>
      )}
    </ScoreCard>
  );
}
