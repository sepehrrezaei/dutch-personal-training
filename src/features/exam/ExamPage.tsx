import { Link } from 'react-router-dom';
import { curriculum } from '@/content';
import { KNM } from '@/content/knm';
import { MOCKS } from '@/content/exam/mocks';
import { countDone, nextPart } from '@/engine/scheduler';
import { Icon } from '@/design/icons';
import { Bar, PageHeader } from '@/design/ui';
import { useStore } from '@/store/store';
import type { Activity } from '@/store/types';
import { practiceHref } from '@/app/PracticeRoute';

const SKILLS = [
  { key: 'lezen', title: 'Lezen', en: 'Reading', icon: 'book', exam: '65 min · multiple choice about letters, ads and notices', act: (u: number): Activity => ({ kind: 'reading', unit: u, count: 3, minutes: 15 }) },
  { key: 'luisteren', title: 'Luisteren', en: 'Listening', icon: 'headphones', exam: '45 min · short conversations, multiple choice', act: (u: number): Activity => ({ kind: 'listening', unit: u, count: 3, minutes: 12 }) },
  { key: 'schrijven', title: 'Schrijven', en: 'Writing', icon: 'letter', exam: '40 min · fill in forms, write short messages and emails', act: (u: number): Activity => ({ kind: 'writing', unit: u, count: 1, minutes: 10 }) },
  { key: 'spreken', title: 'Spreken', en: 'Speaking', icon: 'mic', exam: '35 min · answer questions on the computer, short and long', act: (u: number): Activity => ({ kind: 'speaking', unit: u, count: 4, minutes: 10 }) },
] as const;

export function ExamPage() {
  const state = useStore();
  const unit = curriculum.unitOf(nextPart(state, curriculum)?.lesson ?? 42);
  const skills = state.skills;
  const knmBest = (id: string) => Math.max(0, ...state.results.filter((r) => r.kind === 'knm' && r.ref === id).map((r) => r.score / r.total));
  const mockBest = (n: number, part: string) => {
    const rs = state.results.filter((r) => r.kind === 'mock' && r.ref === `${n}${part}`);
    return rs.length ? Math.max(...rs.map((r) => r.score / r.total)) : null;
  };
  const done = countDone(state.lessons);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Examen · Inburgeringsexamen A2" title="Exam centre">
        Practise every part of the exam in its real format. Material follows your course: you see texts up to unit {unit}.
      </PageHeader>

      <section className="grid gap-3 sm:grid-cols-2">
        {SKILLS.map((s) => {
          const [r, t] = skills[s.key] ?? [0, 0];
          return (
            <Link key={s.key} to={practiceHref(s.act(unit), '/exam')} className="card group flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:border-cobalt/50">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cobalt text-white">
                  <Icon name={s.icon} />
                </span>
                <div>
                  <h3 className="text-2xl">{s.title}</h3>
                  <p className="text-xs text-muted">{s.en}</p>
                </div>
                <Icon name="play" className="ml-auto text-cobalt opacity-0 transition group-hover:opacity-100" />
              </div>
              <p className="text-sm text-muted">{s.exam}</p>
              <div className="flex items-center gap-3">
                <Bar value={t ? r / t : 0} color="bg-cobalt" />
                <span className="w-16 text-right text-xs text-muted">{t ? `${Math.round((r / t) * 100)}%` : '—'}</span>
              </div>
            </Link>
          );
        })}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-2xl">KNM</h2>
            <p className="text-sm text-muted">Kennis van de Nederlandse Maatschappij — 8 themes</p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {KNM.map((k) => {
            const best = knmBest(k.id);
            return (
              <Link key={k.id} to={practiceHref({ kind: 'knm', theme: k.id, minutes: 12 }, '/exam')} className="card flex flex-col gap-2 p-4 transition hover:border-cobalt/50">
                <span className="font-semibold">{k.title}</span>
                <span className="text-xs text-muted">{k.titleEn}</span>
                <Bar value={best} color={best >= 0.8 ? 'bg-polder' : 'bg-oranje'} />
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-2xl">Proefexamens</h2>
        <p className="mb-3 text-sm text-muted">{done >= 30 ? 'You are ready for mock exams.' : 'Mock exams are scheduled automatically after lesson 42 — you can try one any time.'}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {MOCKS.map((m) => (
            <div key={m.n} className="card p-5">
              <h3 className="text-2xl">Proefexamen {m.n}</h3>
              {(['A', 'B'] as const).map((part) => {
                const best = mockBest(m.n, part);
                return (
                  <Link key={part} to={practiceHref({ kind: 'mock', mock: m.n, part, minutes: part === 'A' ? 60 : 35 }, '/exam')} className="mt-3 flex items-center gap-3 rounded-2xl border border-line p-3 hover:border-cobalt/50">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-oranje/15 font-bold text-oranje">{part}</span>
                    <span className="text-sm">
                      <span className="block font-semibold">{part === 'A' ? 'Lezen · Luisteren · KNM' : 'Schrijven · Spreken'}</span>
                      <span className="text-muted">{best === null ? 'not taken' : `best ${Math.round(best * 100)}%`}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
