import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { Lesson } from '@/content/schema';
import { stopSpeaking } from '@/engine/speech';
import { Icon } from '@/design/icons';
import { sfx } from '@/design/fx';
import { useStore } from '@/store/store';
import type { StepId } from '@/store/types';
import { WordsStep } from './steps/WordsStep';
import { ListenStep } from './steps/ListenStep';
import { ShadowStep } from './steps/ShadowStep';
import { DictationStep } from './steps/DictationStep';
import { ClozeStep } from './steps/ClozeStep';
import { GrammarPractice } from './steps/GrammarStep';
import { QuestionsStep } from './steps/QuestionsStep';

export const STEP_META: Record<StepId, { label: string; icon: string; blurb: string }> = {
  words: { label: 'Woorden', icon: 'cards', blurb: 'Meet the new words' },
  listen: { label: 'Luisteren', icon: 'headphones', blurb: 'Read & listen, then listen through' },
  shadow: { label: 'Nazeggen', icon: 'mic', blurb: 'Repeat without the text' },
  dictation: { label: 'Dictee', icon: 'pencil', blurb: 'Write what you hear' },
  cloze: { label: 'Test jezelf', icon: 'target', blurb: 'Fill the gaps in the text' },
  grammar: { label: 'Grammatica', icon: 'book', blurb: 'The pattern of this lesson' },
  questions: { label: 'Geef antwoord', icon: 'chat', blurb: 'Listening check and speaking' },
};

export function LessonPlayer({ lesson, steps, onDone, onExit }: { lesson: Lesson; steps: StepId[]; onDone: () => void; onExit?: () => void }) {
  const completeSteps = useStore((s) => s.completeSteps);
  const [i, setI] = useState(0);
  const step = steps[i];

  const finishStep = () => {
    stopSpeaking();
    completeSteps(lesson.n, [step]);
    sfx.done();
    if (i + 1 < steps.length) setI(i + 1);
    else onDone();
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
            aria-label="Close lesson"
          >
            <Icon name="x" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Les {lesson.n}</p>
          <h1 className="truncate text-2xl sm:text-3xl">{lesson.title}</h1>
        </div>
      </header>
      <nav className="flex gap-1.5 overflow-x-auto pb-1" aria-label="Steps">
        {steps.map((s, k) => (
          <div
            key={s}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              k === i ? 'border-cobalt bg-cobalt text-onprimary' : k < i ? 'border-polder/40 bg-[rgb(var(--polder)/0.1)] text-polder' : 'border-line text-muted'
            }`}
          >
            <Icon name={k < i ? 'check' : STEP_META[s].icon} size={14} />
            {STEP_META[s].label}
          </div>
        ))}
      </nav>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          {step === 'words' && <WordsStep lesson={lesson} onDone={finishStep} />}
          {step === 'listen' && <ListenStep lesson={lesson} onDone={finishStep} />}
          {step === 'shadow' && <ShadowStep lesson={lesson} onDone={finishStep} />}
          {step === 'dictation' && <DictationStep lesson={lesson} onDone={finishStep} />}
          {step === 'cloze' && <ClozeStep lesson={lesson} onDone={finishStep} />}
          {step === 'grammar' && <GrammarPractice topicIds={lesson.grammar} onDone={finishStep} />}
          {step === 'questions' && <QuestionsStep lesson={lesson} onDone={finishStep} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
