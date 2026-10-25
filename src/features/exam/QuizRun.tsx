import { useEffect } from 'react';
import { speak } from '@/engine/speech';
import { SpeakButton } from '@/design/ui';
import { Run, type AnswerResult, type RunResult } from '../practice/Run';
import { ExerciseView, TextAnswer } from '../practice/Exercises';
import { gradeDictation } from '../lesson/steps/DictationStep';
import type { QuizItem } from './quizItems';

function Dictation({ text, answer, locked }: { text: string; answer: (r: AnswerResult) => void; locked: boolean }) {
  useEffect(() => {
    speak(text);
  }, [text]);
  return (
    <div className="flex flex-col gap-5">
      <p className="eyebrow">Dictee — write what you hear</p>
      <div className="flex gap-2">
        <SpeakButton text={text} size="lg" />
        <SpeakButton text={text} slow />
      </div>
      <TextAnswer
        locked={locked}
        big
        onSubmit={(v) => {
          const g = gradeDictation(v, text);
          answer({ ok: g.ok, expected: text, note: g.note });
        }}
      />
    </div>
  );
}

export function QuizRun({ items, onDone, onExit, title }: { items: QuizItem[]; onDone: (r: RunResult) => void; onExit?: () => void; title?: React.ReactNode }) {
  return (
    <Run
      items={items}
      skill="grammatica"
      requeue={false}
      onFinish={onDone}
      onExit={onExit}
      title={title}
      render={(item, answer, locked) =>
        item.kind === 'dictation' ? <Dictation text={item.text} answer={answer} locked={locked} /> : <ExerciseView ex={item.ex} onAnswer={answer} locked={locked} />
      }
    />
  );
}
