import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { curriculum, getLesson, LESSON_COUNT, lessonsOf, UNITS } from '@/content';
import { countDone, nextPart } from '@/engine/scheduler';
import { Icon } from '@/design/icons';
import { Tile } from '@/design/Tile';
import { PageHeader } from '@/design/ui';
import { useStore } from '@/store/store';
import { tileState } from '../today/TodayPage';
import { practiceHref } from '@/app/PracticeRoute';

/* Horizontal offsets (in % of row width) that make the tiles wind like a canal. */
const WAVE = [50, 72, 84, 70, 46, 26, 18];

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
              <div className={`flex items-center gap-4 px-6 py-5 ${unitDone ? 'bg-cobalt text-white' : 'bg-cobalt-soft/50'}`}>
                <span className={`font-display text-5xl ${unitDone ? 'text-white/80' : 'text-cobalt/40'}`}>{u.n}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl">{u.title}</h2>
                  <p className={`text-sm ${unitDone ? 'text-white/80' : 'text-muted'}`}>
                    {u.titleEn} — {u.blurb}
                  </p>
                </div>
                {unitDone && <Icon name="medal" size={30} />}
              </div>
              <div className="relative px-4 py-6">
                <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 700" aria-hidden>
                  <path
                    d={WAVE.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${50 + i * 100}`).join(' ')}
                    fill="none"
                    stroke="rgb(var(--cobalt) / 0.18)"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {lessons.map((n, i) => {
                  const l = getLesson(n);
                  const st = tileState(state.lessons, n, current);
                  return (
                    <motion.div key={n} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative h-[100px]">
                      <Link to={`/lesson/${n}`} className="group">
                        <span className="absolute top-2" style={{ left: `calc(${WAVE[i]}% - 42px)` }}>
                          <Tile icon={l?.icon ?? 'book'} state={st} size={84} />
                        </span>
                        <span
                          className={`absolute top-1/2 max-w-[38%] -translate-y-1/2 rounded-xl bg-paper/90 px-2 py-1 ${WAVE[i] > 60 ? 'text-right' : ''}`}
                          style={WAVE[i] > 60 ? { right: `calc(${100 - WAVE[i]}% + 54px)` } : { left: `calc(${WAVE[i]}% + 54px)` }}
                        >
                          <span className="block text-xs font-bold text-muted">Les {n}</span>
                          <span className="block font-semibold leading-tight group-hover:text-cobalt">{l?.title ?? 'Binnenkort'}</span>
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
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
