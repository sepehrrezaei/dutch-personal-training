import { useMemo, useState } from 'react';
import type { GrammarTopic } from '@/content/schema';
import { getGrammar } from '@/content';
import { Icon } from '@/design/icons';
import { shuffle, SpeakButton } from '@/design/ui';
import { Run, type RunResult } from '../../practice/Run';
import { ExerciseView } from '../../practice/Exercises';

export function GrammarCard({ topic }: { topic: GrammarTopic }) {
  return (
    <article className="card overflow-hidden">
      <div className="border-b border-line bg-cobalt-soft/50 px-5 py-4">
        <p className="eyebrow">Grammatica · les {topic.lesson}</p>
        <h2 className="text-3xl">{topic.title}</h2>
        <p className="text-sm text-muted">{topic.titleEn}</p>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-lg">{topic.summary}</p>
        {topic.table && (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-line/40">
                <tr>
                  {topic.table.head.map((h, i) => (
                    <th key={i} className="px-3 py-2 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topic.table.rows.map((r, i) => (
                  <tr key={i} className="border-t border-line">
                    {r.map((c, j) => (
                      <td key={j} className={`px-3 py-2 ${j === 0 ? 'text-muted' : 'font-medium'}`} lang="nl">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {topic.points.map((pt, i) => (
          <div key={i}>
            <p className="mb-2">{pt.text}</p>
            <ul className="space-y-1.5">
              {pt.examples.map(([nl, en]) => (
                <li key={nl} className="flex items-center gap-2 rounded-xl bg-glaze px-3 py-2">
                  <SpeakButton text={nl.split('→')[0].split('—')[0]} size="sm" />
                  <span>
                    <span lang="nl" className="font-semibold">
                      {nl}
                    </span>{' '}
                    <span className="text-sm text-muted">— {en}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}

/** Explain the grammar topics of a lesson, then practise with their exercises. */
export function GrammarPractice({ topicIds, onDone, max = 12 }: { topicIds: string[]; onDone: (r: RunResult) => void; max?: number }) {
  const topics = topicIds.map(getGrammar).filter((t): t is GrammarTopic => !!t);
  const [stage, setStage] = useState<'learn' | 'practice'>('learn');
  const exercises = useMemo(() => shuffle(topics.flatMap((t) => t.exercises)).slice(0, max), [topicIds.join()]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!topics.length) {
    return (
      <button className="btn-primary" onClick={() => onDone({ correct: 0, total: 0 })}>
        Continue
      </button>
    );
  }
  if (stage === 'learn') {
    return (
      <div className="flex flex-col gap-5">
        {topics.map((t) => (
          <GrammarCard key={t.id} topic={t} />
        ))}
        <button className="btn-orange" onClick={() => setStage('practice')}>
          Practise ({exercises.length} exercises) <Icon name="arrowRight" size={18} />
        </button>
      </div>
    );
  }
  return <Run items={exercises} skill="grammatica" onFinish={onDone} render={(ex, answer, locked) => <ExerciseView ex={ex} onAnswer={answer} locked={locked} />} />;
}
