import { useEffect, useMemo } from 'react';
import type { Lesson } from '@/content/schema';
import { check, speechScore } from '@/engine/checker';
import { speak } from '@/engine/speech';
import { SpeakButton } from '@/design/ui';
import { Run, type AnswerResult } from '../../practice/Run';
import { TextAnswer } from '../../practice/Exercises';
import { practicePhrases } from './phrases';

/** Grade a dictation: exact (with typo tolerance) or nearly all words right. */
export function gradeDictation(given: string, target: string) {
  const r = check(given, target);
  if (r.ok) return { ok: true, note: r.note };
  const { score, missed } = speechScore(given, target);
  if (score >= 0.85) return { ok: true, note: `Almost perfect — check: ${missed.join(', ') || 'spelling'}` };
  return { ok: false, note: missed.length ? `Words to check: ${missed.join(', ')}` : undefined };
}

function DictationItem({ text, answer, locked }: { text: string; answer: (r: AnswerResult) => void; locked: boolean }) {
  useEffect(() => {
    speak(text);
  }, [text]);
  return (
    <div className="flex flex-col gap-5">
      <p className="eyebrow">Write what you hear</p>
      <div className="flex gap-2">
        <SpeakButton text={text} size="lg" />
        <SpeakButton text={text} slow />
      </div>
      <TextAnswer
        locked={locked}
        big
        placeholder="Type the sentence…"
        onSubmit={(v) => {
          const g = gradeDictation(v, text);
          answer({ ok: g.ok, expected: text, note: g.note });
        }}
      />
    </div>
  );
}

/** Delft step 4: dictation. */
export function DictationStep({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const items = useMemo(() => practicePhrases(lesson, 5, 10), [lesson]);
  return <Run items={items} skill="schrijven" requeue={false} onFinish={onDone} render={(p, answer, locked) => <DictationItem text={p.nl} answer={answer} locked={locked} />} />;
}
