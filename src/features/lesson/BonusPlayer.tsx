import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { bonusAsLesson } from '@/content';
import type { Bonus, Exercise, MCQ, WritingTask } from '@/content/schema';
import { SOURCES } from '@/content/sources';
import { stopSpeaking } from '@/engine/speech';
import { Icon } from '@/design/icons';
import { celebrate, sfx } from '@/design/fx';
import { useStore } from '@/store/store';
import { Run, type RunResult } from '../practice/Run';
import { Choices, ExerciseView } from '../practice/Exercises';
import { WritingTaskView } from '../exam/WritingPractice';
import { WordsStep } from './steps/WordsStep';
import { ListenStep } from './steps/ListenStep';
import { OpenAnswer } from './steps/QuestionsStep';

type BonusStep = 'words' | 'read' | 'check' | 'task' | 'more';

const STEPS: { id: BonusStep; label: string; icon: string }[] = [
  { id: 'words', label: 'Woorden', icon: 'cards' },
  { id: 'read', label: 'Lezen', icon: 'headphones' },
  { id: 'check', label: 'Oefenen', icon: 'target' },
  { id: 'task', label: 'Opdracht', icon: 'mic' },
  { id: 'more', label: 'Verder', icon: 'external' },
];

/** The trusted links of a bonus round: where to read, watch or practise more. */
export function BonusLinks({ ids }: { ids: string[] }) {
  return (
    <ul className="grid gap-2">
      {ids
        .map((id) => SOURCES[id])
        .filter(Boolean)
        .map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-3 transition hover:border-cobalt/50">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cobalt-soft text-cobalt">
                <Icon name="external" size={18} />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold" lang="nl">
                  {s.label}
                </span>
                <span className="block text-xs text-muted">{s.publisher}</span>
                <span className="mt-1 block text-sm">{s.note}</span>
              </span>
            </a>
          </li>
        ))}
    </ul>
  );
}

type CheckItem = { kind: 'mcq'; q: MCQ } | { kind: 'ex'; ex: Exercise };

function Check({ bonus, onDone }: { bonus: Bonus; onDone: (r: RunResult) => void }) {
  const items: CheckItem[] = useMemo(() => [...bonus.questions.map((q) => ({ kind: 'mcq' as const, q })), ...bonus.exercises.map((ex) => ({ kind: 'ex' as const, ex }))], [bonus]);
  return (
    <Run
      items={items}
      skill="lezen"
      onFinish={onDone}
      render={(item, answer, locked) =>
        item.kind === 'mcq' ? (
          <div className="flex flex-col gap-5">
            <p className="eyebrow">About the text</p>
            <p className="font-display text-3xl" lang="nl">
              {item.q.q}
            </p>
            <Choices options={item.q.options} answer={item.q.answer} onAnswer={answer} locked={locked} explain={item.q.explain} />
          </div>
        ) : (
          <ExerciseView ex={item.ex} onAnswer={answer} locked={locked} />
        )
      }
    />
  );
}

function Task({ bonus, onDone }: { bonus: Bonus; onDone: () => void }) {
  const writing: WritingTask = useMemo(
    () => ({
      id: `bonus-${bonus.n}`,
      unit: bonusAsLesson(bonus).unit,
      kind: 'message',
      title: bonus.title,
      situation: bonus.task.prompt,
      mustInclude: ['hele zinnen', 'woorden uit deze bonusronde', 'minstens vier zinnen'],
      model: bonus.task.model,
      minWords: 25,
    }),
    [bonus],
  );
  if (bonus.task.kind === 'write') return <WritingTaskView task={writing} onSubmit={onDone} />;
  return (
    <Run
      items={[bonus.task]}
      skill="spreken"
      requeue={false}
      onFinish={onDone}
      render={(t, answer, locked) => <OpenAnswer question={t.prompt} model={t.model} answer={answer} locked={locked} />}
    />
  );
}

/** An optional bonus round: new words, a real-life text, practice, one task and trusted links to go further. */
export function BonusPlayer({ bonus, onDone, onExit }: { bonus: Bonus; onDone: (r?: RunResult) => void; onExit?: () => void }) {
  const completeBonus = useStore((s) => s.completeBonus);
  const [i, setI] = useState(0);
  const [score, setScore] = useState<RunResult>({ correct: 0, total: 0 });
  const step = STEPS[i].id;
  const lesson = bonusAsLesson(bonus);

  const next = () => {
    stopSpeaking();
    sfx.done();
    setI((k) => Math.min(k + 1, STEPS.length - 1));
  };

  const finish = () => {
    completeBonus(bonus.n);
    celebrate();
    onDone(score);
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center gap-3">
        {onExit && (
          <button
            className="rounded-full p-2 text-muted hover:bg-line/60"
            onClick={() => {
              stopSpeaking();
              onExit();
            }}
            aria-label="Close bonus round"
          >
            <Icon name="x" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="eyebrow flex items-center gap-1 text-oranje">
            <Icon name="sparkles" size={14} /> Bonus · Les {bonus.n}
          </p>
          <h1 className="truncate text-2xl sm:text-3xl">{bonus.title}</h1>
        </div>
      </header>
      <nav className="flex gap-1.5 overflow-x-auto pb-1" aria-label="Steps">
        {STEPS.map((s, k) => (
          <div
            key={s.id}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              k === i ? 'border-oranje bg-oranje text-white' : k < i ? 'border-polder/40 bg-[rgb(var(--polder)/0.1)] text-polder' : 'border-line text-muted'
            }`}
          >
            <Icon name={k < i ? 'check' : s.icon} size={14} />
            {s.label}
          </div>
        ))}
      </nav>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          {step === 'words' && (
            <div className="flex flex-col gap-4">
              <p className="rounded-2xl bg-oranje/10 px-4 py-3 text-sm">
                <strong>{bonus.titleEn}.</strong> {bonus.focus}
              </p>
              <WordsStep lesson={lesson} onDone={next} />
            </div>
          )}
          {step === 'read' && <ListenStep lesson={lesson} onDone={next} />}
          {step === 'check' && (
            <Check
              bonus={bonus}
              onDone={(r) => {
                setScore(r);
                next();
              }}
            />
          )}
          {step === 'task' && <Task bonus={bonus} onDone={next} />}
          {step === 'more' && (
            <div className="flex flex-col gap-4">
              <div className="card p-5">
                <p className="eyebrow mb-1">Verder oefenen</p>
                <h3 className="text-2xl">Go further with real sources</h3>
                <p className="mt-1 text-sm text-muted">Official and trusted Dutch websites about this topic. They open in a new tab — try reading the Dutch pages first.</p>
              </div>
              <BonusLinks ids={bonus.links} />
              <button className="btn-orange" onClick={finish}>
                Finish bonus round <Icon name="check" size={18} />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
