import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getGrammar, getLesson, LESSON_COUNT, UNITS } from '@/content';
import { withArticle } from '@/content/dsl';
import { Icon } from '@/design/icons';
import { LessonMark } from '@/design/LessonMark';
import { Empty, SpeakButton } from '@/design/ui';
import { celebrate } from '@/design/fx';
import { useStore } from '@/store/store';
import { ALL_STEPS, PART1, PART2, type StepId } from '@/store/types';
import { LessonPlayer, STEP_META } from '../lesson/LessonPlayer';
import { InteractiveText } from '../lesson/InteractiveText';
import { ArticleChip } from '../lesson/steps/WordsStep';
import { GrammarCard } from '../lesson/steps/GrammarStep';
import { NoticeCard, speakerVoices } from '../lesson/steps/ListenStep';

type Tab = 'text' | 'words' | 'grammar';

export function LessonPage() {
  const n = Number(useParams().n);
  const lesson = getLesson(n);
  const navigate = useNavigate();
  const progress = useStore((s) => s.lessons[n]);
  const [playing, setPlaying] = useState<StepId[] | null>(null);
  const [tab, setTab] = useState<Tab>('text');
  const [showEn, setShowEn] = useState(false);

  if (!lesson)
    return (
      <Empty icon="lock" title={`Les ${n} is coming soon`}>
        <Link to="/path" className="text-cobalt underline">
          Back to the course
        </Link>
      </Empty>
    );

  if (playing)
    return (
      <div className="mx-auto max-w-2xl">
        <LessonPlayer
          lesson={lesson}
          steps={playing}
          onExit={() => setPlaying(null)}
          onDone={() => {
            const done = useStore.getState().lessons[n]?.steps ?? [];
            if (ALL_STEPS.every((s) => done.includes(s))) celebrate(true);
            setPlaying(null);
          }}
        />
      </div>
    );

  const done = progress?.steps ?? [];
  const part1Left = PART1.filter((s) => !done.includes(s));
  const part2Left = PART2.filter((s) => !done.includes(s));
  const complete = !part1Left.length && !part2Left.length;
  const state = complete ? 'done' : !part1Left.length ? 'half' : 'current';
  const voiceOf = speakerVoices(lesson.text);

  const StepCard = ({ s }: { s: StepId }) => (
    <button onClick={() => setPlaying([s])} className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-3 text-left transition hover:border-cobalt/50">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${done.includes(s) ? 'bg-polder text-white' : 'bg-cobalt-soft text-cobalt'}`}>
        <Icon name={done.includes(s) ? 'check' : STEP_META[s].icon} size={20} />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold">{STEP_META[s].label}</span>
        <span className="block truncate text-xs text-muted">{STEP_META[s].blurb}</span>
      </span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <Link to="/path" className="flex items-center gap-1 font-semibold text-muted hover:text-cobalt">
          <Icon name="arrowLeft" size={16} /> Unit {lesson.unit}: {UNITS[lesson.unit - 1].title}
        </Link>
        <div className="flex gap-1">
          <button className="btn-ghost px-2.5 py-1.5" disabled={n <= 1} onClick={() => navigate(`/lesson/${n - 1}`)} aria-label="Previous lesson">
            <Icon name="arrowLeft" size={16} />
          </button>
          <button className="btn-ghost px-2.5 py-1.5" disabled={n >= LESSON_COUNT} onClick={() => navigate(`/lesson/${n + 1}`)} aria-label="Next lesson">
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </div>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <LessonMark n={n} icon={lesson.icon} state={state} size={88} />
        <div className="flex-1">
          <p className="eyebrow">Les {n}</p>
          <h1 className="text-4xl sm:text-5xl">{lesson.title}</h1>
          <p className="text-muted">{lesson.titleEn}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {lesson.goals.map((g) => (
              <li key={g} className="chip">
                <Icon name="target" size={13} /> {g}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl">Deel 1</h2>
            <span className="text-xs text-muted">~15 min</span>
          </div>
          <div className="grid gap-2">
            {PART1.map((s) => (
              <StepCard key={s} s={s} />
            ))}
          </div>
          <button className={part1Left.length ? 'btn-orange mt-4 w-full' : 'btn-ghost mt-4 w-full'} onClick={() => setPlaying(part1Left.length ? part1Left : PART1)}>
            {part1Left.length ? 'Start part 1' : 'Do part 1 again'}
          </button>
        </section>
        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl">Deel 2</h2>
            <span className="text-xs text-muted">~20 min</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {PART2.map((s) => (
              <StepCard key={s} s={s} />
            ))}
          </div>
          <button
            className={!part1Left.length && part2Left.length ? 'btn-orange mt-4 w-full' : 'btn-ghost mt-4 w-full'}
            onClick={() => setPlaying(part2Left.length ? part2Left : PART2)}
          >
            {part2Left.length ? 'Start part 2' : 'Do part 2 again'}
          </button>
        </section>
      </div>

      <section className="card overflow-hidden">
        <div className="flex border-b border-line">
          {(
            [
              ['text', 'Tekst', 'book'],
              ['words', `Woorden (${lesson.vocab.length})`, 'cards'],
              ['grammar', 'Grammatica', 'pencil'],
            ] as const
          ).map(([id, label, icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold ${tab === id ? 'border-b-[3px] border-cobalt text-cobalt' : 'text-muted'}`}>
              <Icon name={icon} size={16} /> {label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === 'text' && (
            <div className="space-y-4">
              <button className="chip" onClick={() => setShowEn(!showEn)}>
                <Icon name="translate" size={14} /> {showEn ? 'Hide English' : 'Show English'}
              </button>
              <div className="space-y-2.5">
                {lesson.text.map((p, i) => (
                  <div key={i} className="flex gap-3">
                    <SpeakButton text={p.nl} speaker={voiceOf(p)} size="sm" />
                    <div>
                      {p.who && <span className="mr-1.5 text-sm font-bold text-cobalt">{p.who}:</span>}
                      <InteractiveText text={p.nl} className="text-lg" />
                      {showEn && <p className="text-sm text-muted">{p.en}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <NoticeCard lesson={lesson} />
            </div>
          )}
          {tab === 'words' && (
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {lesson.vocab.map((v) => (
                <li key={v.nl} className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-glaze">
                  <SpeakButton text={withArticle(v)} size="sm" />
                  <ArticleChip art={v.art} />
                  <span className="font-semibold" lang="nl">
                    {v.nl}
                  </span>
                  <span className="ml-auto truncate text-right text-sm text-muted">{v.en}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === 'grammar' && (
            <div className="space-y-4">
              {lesson.grammar.map((id) => {
                const g = getGrammar(id);
                return g ? <GrammarCard key={id} topic={g} /> : null;
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
