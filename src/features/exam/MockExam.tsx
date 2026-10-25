import { useEffect, useMemo, useState } from 'react';
import { findListening, findReading, findSpeaking, findWriting } from '@/content/exam';
import { MOCKS } from '@/content/exam/mocks';
import type { ListeningItem, ReadingItem, SpeakingTask, WritingTask } from '@/content/schema';
import { Icon } from '@/design/icons';
import { Bar } from '@/design/ui';
import { celebrate } from '@/design/fx';
import { useStore } from '@/store/store';
import type { Skill } from '@/store/types';
import type { RunResult } from '../practice/Run';
import { ReadingQuestions } from './ReadingPractice';
import { ListeningQuestions } from './ListeningPractice';
import { KnmQuestions, randomKnm } from './KnmQuiz';
import { WritingTaskView } from './WritingPractice';
import { SpeakingPractice } from './SpeakingPractice';
import { SectionIntro } from './shared';

const PASS = 0.6;
const PART_MINUTES = { A: 60, B: 35 };

type Section = 'lezen' | 'luisteren' | 'knm' | 'schrijven' | 'spreken';
const SECTIONS: Record<'A' | 'B', Section[]> = { A: ['lezen', 'luisteren', 'knm'], B: ['schrijven', 'spreken'] };
const SECTION_INFO: Record<Section, { title: string; icon: string; text: string }> = {
  lezen: { title: 'Lezen', icon: 'book', text: 'Read real-life texts and answer the questions. Take your time — read the question first, then look for the answer in the text.' },
  luisteren: { title: 'Luisteren', icon: 'headphones', text: 'Listen to short conversations. You can play each one twice. Read the question before you listen again.' },
  knm: { title: 'KNM', icon: 'landmark', text: 'Questions about life, work and rules in the Netherlands.' },
  schrijven: { title: 'Schrijven', icon: 'letter', text: 'Fill in a form and write a short message. Make sure you include every point of the task.' },
  spreken: { title: 'Spreken', icon: 'mic', text: 'Answer out loud. Short questions: one or two sentences. Long questions: three or four sentences with a reason.' },
};

function useElapsed() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return secs;
}

function WritingSection({ tasks, onDone }: { tasks: WritingTask[]; onDone: (r: RunResult) => void }) {
  const [i, setI] = useState(0);
  const [sum, setSum] = useState(0);
  return (
    <WritingTaskView
      key={tasks[i].id}
      task={tasks[i]}
      onSubmit={(s) => {
        const total = sum + s;
        if (i + 1 < tasks.length) {
          setSum(total);
          setI(i + 1);
        } else onDone({ correct: Math.round(total * 10), total: tasks.length * 10 });
      }}
    />
  );
}

/** A timed mock exam, split into part A (Lezen, Luisteren, KNM) and part B (Schrijven, Spreken). */
export function MockExam({ n, part, onDone }: { n: number; part: 'A' | 'B'; onDone: (r: RunResult) => void }) {
  const mock = MOCKS.find((m) => m.n === n) ?? MOCKS[0];
  const addResult = useStore((s) => s.addResult);
  const elapsed = useElapsed();
  const sections = SECTIONS[part];
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [scores, setScores] = useState<Partial<Record<Section, RunResult>>>({});

  const data = useMemo(
    () => ({
      reading: mock.reading.map(findReading).filter((x): x is ReadingItem => !!x),
      listening: mock.listening.map(findListening).filter((x): x is ListeningItem => !!x),
      knm: randomKnm(mock.knm),
      writing: mock.writing.map(findWriting).filter((x): x is WritingTask => !!x),
      speaking: mock.speaking.map(findSpeaking).filter((x): x is SpeakingTask => !!x),
    }),
    [mock],
  );

  const section = sections[idx];
  const finishSection = (r: RunResult) => {
    const next = { ...scores, [section]: r };
    setScores(next);
    setStarted(false);
    if (idx + 1 < sections.length) setIdx(idx + 1);
    else {
      const correct = Object.values(next).reduce((s, x) => s + (x?.correct ?? 0), 0);
      const total = Object.values(next).reduce((s, x) => s + (x?.total ?? 0), 0);
      const bySkill = Object.fromEntries(Object.entries(next).map(([k, v]) => [k, [v!.correct, v!.total]])) as Partial<Record<Skill, [number, number]>>;
      addResult({ kind: 'mock', ref: `${n}${part}`, score: correct, total, bySkill });
      if (Object.values(next).every((x) => x && (!x.total || x.correct / x.total >= PASS))) celebrate(true);
      setIdx(sections.length);
    }
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  const header = (
    <div className="mb-4 flex items-center gap-3">
      <span className="chip border-oranje text-oranje">
        Proefexamen {n} · deel {part}
      </span>
      <span className={`ml-auto flex items-center gap-1 font-mono text-sm ${elapsed > PART_MINUTES[part] * 60 ? 'text-tulip' : 'text-muted'}`}>
        <Icon name="timer" size={16} /> {mm}:{ss} / {PART_MINUTES[part]}:00
      </span>
    </div>
  );

  if (idx >= sections.length) {
    return (
      <div className="card flex flex-col gap-5 p-8">
        <div className="text-center">
          <p className="eyebrow">Result</p>
          <h2 className="text-4xl">Proefexamen {n} · deel {part}</h2>
          <p className="text-muted">Time: {mm}:{ss}</p>
        </div>
        {sections.map((s) => {
          const r = scores[s];
          const pct = r && r.total ? r.correct / r.total : 0;
          return (
            <div key={s} className="flex items-center gap-4">
              <Icon name={SECTION_INFO[s].icon} className="text-cobalt" />
              <span className="w-24 font-semibold">{SECTION_INFO[s].title}</span>
              <Bar value={pct} color={pct >= PASS ? 'bg-polder' : 'bg-tulip'} />
              <span className="w-24 text-right text-sm">
                {Math.round(pct * 100)}% {pct >= PASS ? '✓' : ''}
              </span>
            </div>
          );
        })}
        <p className="text-center text-sm text-muted">
          A pass estimate needs about {PASS * 100}% per part. Practise weaker skills in the Exam centre.
        </p>
        <button className="btn-primary" onClick={() => onDone(Object.values(scores).reduce((a, b) => ({ correct: a.correct + (b?.correct ?? 0), total: a.total + (b?.total ?? 0) }), { correct: 0, total: 0 }))}>
          Continue <Icon name="arrowRight" size={18} />
        </button>
      </div>
    );
  }

  if (!started)
    return (
      <div>
        {header}
        <SectionIntro icon={SECTION_INFO[section].icon} title={`${idx + 1}. ${SECTION_INFO[section].title}`} onStart={() => setStarted(true)} cta="Begin">
          {SECTION_INFO[section].text}
        </SectionIntro>
      </div>
    );

  return (
    <div>
      {header}
      {section === 'lezen' && <ReadingQuestions items={data.reading} onDone={finishSection} />}
      {section === 'luisteren' && <ListeningQuestions items={data.listening} onDone={finishSection} />}
      {section === 'knm' && <KnmQuestions questions={data.knm} onDone={finishSection} />}
      {section === 'schrijven' && <WritingSection tasks={data.writing} onDone={finishSection} />}
      {section === 'spreken' && <SpeakingPractice unit={7} count={data.speaking.length} tasks={data.speaking} onDone={finishSection} />}
    </div>
  );
}
