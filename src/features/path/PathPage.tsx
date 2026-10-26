import { Link } from 'react-router-dom';
import { curriculum, getLesson, LESSON_COUNT, lessonsOf, UNITS } from '@/content';
import { countDone, nextPart } from '@/engine/scheduler';
import { Icon } from '@/design/icons';
import { LessonMark } from '@/design/LessonMark';
import type { TileState } from '@/design/Tile';
import { PageHeader } from '@/design/ui';
import { useStore } from '@/store/store';
import { tileState } from '../today/TodayPage';
import { practiceHref } from '@/app/PracticeRoute';

function StatusChip({ state, isNext }: { state: TileState; isNext: boolean }) {
  if (state === 'done')
    return (
      <span className="chip shrink-0 border-polder/40 text-polder">
        <Icon name="check" size={13} /> <span className="hidden sm:inline">Klaar</span>
      </span>
    );
  if (isNext) return <span className="chip shrink-0 border-cobalt bg-cobalt text-onprimary">{state === 'half' ? 'Deel 2' : 'Volgende'}</span>;
  if (state === 'half') return <span className="chip shrink-0 border-cobalt/40 text-cobalt">Deel 2</span>;
  return <span className="hidden shrink-0 text-xs text-muted sm:inline">~35 min</span>;
}

export function PathPage() {
  const state = useStore();
  const current = nextPart(state, curriculum)?.lesson ?? LESSON_COUNT + 1;
  const done = countDone(state.lessons);
  return (
    <div>
      <PageHeader eyebrow="Pad · your course" title="Van nul tot A2">
        42 lessons in six units, following the Delftse Methode. {done} done.
      </PageHeader>
      <div className="space-y-10">
        {UNITS.map((u) => {
          const lessons = lessonsOf(u.n);
          const unitDone = state.checkpoints.includes(u.n);
          const allLessons = lessons.every((n) => (state.lessons[n]?.steps.length ?? 0) >= 7);
          return (
            <section key={u.n} className="card overflow-hidden">
              <div className={`flex items-center gap-4 px-6 py-5 ${unitDone ? 'bg-cobalt text-onprimary' : 'bg-cobalt-soft/50'}`}>
                <span className={`font-display text-5xl ${unitDone ? 'text-white/80' : 'text-cobalt/40'}`}>{u.n}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl">{u.title}</h2>
                  <p className={`text-sm ${unitDone ? 'text-white/80' : 'text-muted'}`}>
                    {u.titleEn} — {u.blurb}
                  </p>
                </div>
                {unitDone && <Icon name="medal" size={30} />}
              </div>
              <ol className="px-3 py-3 sm:px-4">
                {lessons.map((n, i) => {
                  const l = getLesson(n);
                  const st = tileState(state.lessons, n, current);
                  const isNext = n === current;
                  const last = i === lessons.length - 1;
                  return (
                    <li key={n} className="relative">
                      {!last && (
                        <span
                          aria-hidden
                          className={`absolute left-[35px] top-[62px] h-[calc(100%-52px)] w-[3px] rounded-full sm:left-[39px] ${st === 'done' ? 'bg-cobalt' : 'bg-line'}`}
                        />
                      )}
                      <Link
                        to={`/lesson/${n}`}
                        className={`group relative flex items-center gap-4 rounded-2xl px-3 py-3 transition sm:px-4 ${isNext ? 'bg-cobalt-soft/60' : 'hover:bg-line/40'}`}
                      >
                        <LessonMark n={n} icon={l?.icon ?? 'book'} state={st} size={isNext ? 52 : 48} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold leading-snug group-hover:text-cobalt">{l?.title ?? 'Binnenkort'}</p>
                          <p className="truncate text-sm text-muted">{l?.titleEn}</p>
                        </div>
                        <StatusChip state={st} isNext={isNext} />
                        <Icon name="chevronRight" size={18} className="shrink-0 text-muted" />
                      </Link>
                    </li>
                  );
                })}
              </ol>
              <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
                <p className="text-sm text-muted">{unitDone ? 'Unit test passed.' : allLessons ? 'All lessons done — take the unit test!' : 'Finish all 7 lessons to unlock the unit test.'}</p>
                <Link to={practiceHref({ kind: 'checkpoint', unit: u.n, minutes: 20 }, '/path')} className={allLessons ? 'btn-orange py-2 text-sm' : 'btn-ghost pointer-events-none py-2 text-sm opacity-40'}>
                  <Icon name="medal" size={16} /> Unit test
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
