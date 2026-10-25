import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { Lesson, VocabItem } from '@/content/schema';
import { withArticle } from '@/content/dsl';
import { vocabCardId } from '@/engine/srs';
import { speak } from '@/engine/speech';
import { Icon } from '@/design/icons';
import { shuffle, SpeakButton } from '@/design/ui';
import { useStore } from '@/store/store';
import { Run } from '../../practice/Run';
import { Choices } from '../../practice/Exercises';

const GROUP = 8;

export function ArticleChip({ art }: { art?: 'de' | 'het' }) {
  if (!art) return null;
  return <span className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white ${art === 'de' ? 'bg-cobalt' : 'bg-oranje'}`}>{art}</span>;
}

function WordCard({ v }: { v: VocabItem }) {
  useEffect(() => {
    speak(withArticle(v));
  }, [v]);
  return (
    <div className="card relative overflow-hidden p-7 text-center">
      <div className={`absolute inset-x-0 top-0 h-1.5 ${v.art === 'het' ? 'bg-oranje' : v.art === 'de' ? 'bg-cobalt' : 'bg-line'}`} />
      <div className="mb-2 flex justify-center">
        <ArticleChip art={v.art} />
      </div>
      <p className="font-display text-4xl sm:text-5xl" lang="nl">
        {v.nl}
      </p>
      {v.pl && <p className="mt-1 text-sm text-muted">plural: {v.pl}</p>}
      <p className="mt-4 text-xl text-ink/80">{v.en}</p>
      {v.ex && (
        <p className="mt-3 text-sm text-muted">
          <span lang="nl">{v.ex[0]}</span> — {v.ex[1]}
        </p>
      )}
      <div className="mt-5 flex justify-center gap-2">
        <SpeakButton text={withArticle(v)} size="lg" />
        <SpeakButton text={withArticle(v)} slow />
      </div>
    </div>
  );
}

type QuizItem = { v: VocabItem; mode: 'meaning' | 'listen' | 'reverse'; options: string[] };

function distractors(v: VocabItem, pool: VocabItem[], key: (x: VocabItem) => string): string[] {
  return shuffle(pool.filter((x) => key(x) !== key(v)))
    .slice(0, 3)
    .map(key);
}

export function WordsStep({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const addCards = useStore((s) => s.addCards);
  const groups = useMemo(() => {
    const out: VocabItem[][] = [];
    for (let i = 0; i < lesson.vocab.length; i += GROUP) out.push(lesson.vocab.slice(i, i + GROUP));
    return out;
  }, [lesson]);
  const [g, setG] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'quiz'>('intro');
  const [card, setCard] = useState(0);
  const group = groups[g];

  const quiz: QuizItem[] = useMemo(
    () =>
      shuffle(
        group.map((v, i) => {
          const mode = (['meaning', 'listen', 'reverse'] as const)[i % 3];
          const key = mode === 'meaning' ? (x: VocabItem) => x.en : mode === 'reverse' ? withArticle : (x: VocabItem) => `${withArticle(x)} — ${x.en}`;
          return { v, mode, options: [key(v), ...distractors(v, lesson.vocab, key)] };
        }),
      ),
    [group, lesson],
  );

  const finishGroup = () => {
    if (g + 1 < groups.length) {
      setG(g + 1);
      setPhase('intro');
      setCard(0);
    } else {
      addCards(lesson.vocab.map((v) => ({ id: vocabCardId(lesson.n, v.nl), lesson: lesson.n })));
      onDone();
    }
  };

  if (phase === 'intro') {
    const v = group[card];
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>
            Words {g * GROUP + 1}–{g * GROUP + group.length} of {lesson.vocab.length}
          </span>
          <span className="flex gap-1">
            {group.map((_, i) => (
              <span key={i} className={`h-1.5 w-5 rounded-full ${i <= card ? 'bg-cobalt' : 'bg-line'}`} />
            ))}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={v.nl} initial={{ rotateY: -70, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 70, opacity: 0 }} transition={{ duration: 0.25 }}>
            <WordCard v={v} />
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-3">
          <button className="btn-ghost" disabled={card === 0} onClick={() => setCard(card - 1)} aria-label="Previous">
            <Icon name="arrowLeft" />
          </button>
          {card < group.length - 1 ? (
            <button className="btn-primary flex-1" onClick={() => setCard(card + 1)}>
              Next word <Icon name="arrowRight" size={18} />
            </button>
          ) : (
            <button className="btn-orange flex-1" onClick={() => setPhase('quiz')}>
              Quick check <Icon name="bolt" size={18} />
            </button>
          )}
        </div>
        <p className="text-center text-xs text-muted">
          <span className="font-bold text-cobalt">blue = de</span> · <span className="font-bold text-oranje">orange = het</span> — colour helps you remember the article.
        </p>
      </div>
    );
  }

  return (
    <Run
      key={g}
      items={quiz}
      skill="woorden"
      onFinish={finishGroup}
      render={(item, answer, locked) => {
        const { v, mode } = item;
        if (mode === 'meaning')
          return (
            <div className="flex flex-col gap-5">
              <p className="eyebrow">What does it mean?</p>
              <div className="flex items-center gap-3">
                <p className="font-display text-4xl" lang="nl">
                  {withArticle(v)}
                </p>
                <SpeakButton text={withArticle(v)} />
              </div>
              <Choices options={item.options} answer={0} onAnswer={answer} locked={locked} />
            </div>
          );
        if (mode === 'listen')
          return (
            <ListenPick v={v} options={item.options} answer={answer} locked={locked} />
          );
        return (
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Which Dutch word?</p>
            <p className="font-display text-4xl">{v.en}</p>
            <Choices options={item.options} answer={0} onAnswer={answer} locked={locked} speakOptions />
          </div>
        );
      }}
    />
  );
}

function ListenPick({ v, options, answer, locked }: { v: VocabItem; options: string[]; answer: Parameters<typeof Choices>[0]['onAnswer']; locked: boolean }) {
  useEffect(() => {
    speak(withArticle(v));
  }, [v]);
  return (
    <div className="flex flex-col gap-5">
      <p className="eyebrow">What do you hear?</p>
      <div className="flex gap-2">
        <SpeakButton text={withArticle(v)} size="lg" />
        <SpeakButton text={withArticle(v)} slow />
      </div>
      <Choices options={options} answer={0} onAnswer={answer} locked={locked} />
    </div>
  );
}
