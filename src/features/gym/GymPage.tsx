import { Link } from 'react-router-dom';
import { GRAMMAR } from '@/content';
import { countDone, unlockedDrills } from '@/engine/scheduler';
import { Icon } from '@/design/icons';
import { PageHeader } from '@/design/ui';
import { useStore } from '@/store/store';
import type { DrillId } from '@/store/types';
import { practiceHref } from '@/app/PracticeRoute';
import { DRILL_META } from '../session/activityMeta';
import { useState } from 'react';
import { GrammarPractice } from '../lesson/steps/GrammarStep';

export function GymPage() {
  const lessonsDone = countDone(useStore((s) => s.lessons));
  const unlocked = unlockedDrills(lessonsDone);
  const [topic, setTopic] = useState<string | null>(null);

  if (topic)
    return (
      <div className="mx-auto max-w-2xl">
        <button className="mb-4 flex items-center gap-1 text-sm font-semibold text-muted" onClick={() => setTopic(null)}>
          <Icon name="arrowLeft" size={16} /> Oefenen
        </button>
        <GrammarPractice topicIds={[topic]} onDone={() => setTopic(null)} max={10} />
      </div>
    );

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Oefenen · practice gym" title="Train je skills">
        Quick drills for the things that need repetition, and every grammar topic of the course.
      </PageHeader>
      <section>
        <h2 className="mb-3 text-2xl">Drills</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(DRILL_META) as DrillId[]).map((id) => {
            const open = unlocked.includes(id);
            const m = DRILL_META[id];
            return (
              <Link
                key={id}
                to={open ? practiceHref({ kind: 'drill', drill: id, minutes: 5 }, '/gym') : '#'}
                className={`card flex items-center gap-4 p-4 transition ${open ? 'hover:-translate-y-0.5 hover:border-cobalt/50' : 'pointer-events-none opacity-50'}`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-oranje/15 text-oranje">
                  <Icon name={open ? m.icon : 'lock'} />
                </span>
                <span>
                  <span className="block font-semibold">{m.title}</span>
                  <span className="block text-sm text-muted">{m.blurb}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-2xl">Grammatica</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {GRAMMAR.map((g) => (
            <button key={g.id} onClick={() => setTopic(g.id)} className="card flex items-center gap-3 p-4 text-left transition hover:border-cobalt/50">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cobalt-soft font-display text-cobalt">{g.lesson}</span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{g.title}</span>
                <span className="block truncate text-sm text-muted">{g.titleEn}</span>
              </span>
              <Icon name="chevronRight" className="ml-auto text-muted" size={18} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
