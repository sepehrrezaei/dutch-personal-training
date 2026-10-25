import { dateKey } from '@/engine/scheduler';
import { isKnown } from '@/engine/srs';
import { BADGES, cefrOf, levelOf } from '@/engine/xp';
import { countDone } from '@/engine/scheduler';
import { Icon } from '@/design/icons';
import { PageHeader } from '@/design/ui';
import { SKILLS, useStore } from '@/store/store';
import type { Skill } from '@/store/types';

const SKILL_LABEL: Record<Skill, string> = {
  woorden: 'Woorden',
  grammatica: 'Grammatica',
  lezen: 'Lezen',
  luisteren: 'Luisteren',
  schrijven: 'Schrijven',
  spreken: 'Spreken',
  knm: 'KNM',
};

function Radar({ values }: { values: { label: string; v: number; n: number }[] }) {
  const size = 300;
  const c = size / 2;
  const r = 105;
  const pt = (i: number, f: number) => {
    const a = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    return [c + Math.cos(a) * r * f, c + Math.sin(a) * r * f];
  };
  const poly = values.map((x, i) => pt(i, x.n ? Math.max(0.05, x.v) : 0.05).join(',')).join(' ');
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[320px]" role="img" aria-label="Skill accuracy">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={values.map((_, i) => pt(i, f).join(',')).join(' ')} fill="none" stroke="rgb(var(--line))" />
      ))}
      {values.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="rgb(var(--line))" />;
      })}
      <polygon points={poly} fill="rgb(var(--cobalt) / 0.22)" stroke="rgb(var(--cobalt))" strokeWidth="2" strokeLinejoin="round" />
      {values.map((x, i) => {
        const [px, py] = pt(i, 1.22);
        return (
          <text key={i} x={px} y={py} textAnchor="middle" dominantBaseline="middle" className="fill-ink text-[11px] font-semibold">
            {x.label}
            <tspan x={px} dy="13" className="fill-muted text-[10px] font-normal">
              {x.n ? `${Math.round(x.v * 100)}%` : '—'}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}

function Heatmap() {
  const days = useStore((s) => s.days);
  const weeks = 18;
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7) - (weeks - 1) * 7);
  const cells: { k: string; m: number; future: boolean }[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const k = dateKey(d);
    cells.push({ k, m: Math.round((days[k]?.seconds ?? 0) / 60), future: d > today });
  }
  const shade = (m: number) => (m === 0 ? 'bg-line/60' : m < 10 ? 'bg-cobalt/25' : m < 25 ? 'bg-cobalt/50' : m < 50 ? 'bg-cobalt/75' : 'bg-cobalt');
  return (
    <div className="overflow-x-auto">
      <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
        {cells.map((c) => (
          <span key={c.k} title={`${c.k}: ${c.m} min`} className={`h-3.5 w-3.5 rounded-[4px] ${c.future ? 'opacity-0' : shade(c.m)}`} />
        ))}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
        less {['bg-line/60', 'bg-cobalt/25', 'bg-cobalt/50', 'bg-cobalt/75', 'bg-cobalt'].map((c) => <span key={c} className={`h-3 w-3 rounded ${c}`} />)} more
      </p>
    </div>
  );
}

export function ProgressPage() {
  const s = useStore();
  const lessons = countDone(s.lessons);
  const known = Object.values(s.srs).filter(isKnown).length;
  const minutes = Math.round(Object.values(s.days).reduce((a, d) => a + d.seconds, 0) / 60);
  const studyDays = Object.values(s.days).filter((d) => d.seconds >= 300 || d.done.length).length;
  const lvl = levelOf(s.xp);
  const cefr = cefrOf(lessons, s.results.some((r) => r.kind === 'mock' && r.score / r.total >= 0.6));
  const radar = SKILLS.map((k) => {
    const [r, t] = s.skills[k] ?? [0, 0];
    return { label: SKILL_LABEL[k], v: t ? r / t : 0, n: t };
  });
  const recent = [...s.results].reverse().slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Voortgang · progress" title="Hoe gaat het?" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['book', `${lessons}/42`, 'lessons'],
          ['cards', known, 'words known'],
          ['timer', `${Math.floor(minutes / 60)}h ${minutes % 60}m`, `on ${studyDays} days`],
          ['star', `Lv ${lvl.level}`, `${s.xp} XP · ${cefr.label}`],
        ].map(([icon, v, l]) => (
          <div key={l as string} className="card p-5">
            <Icon name={icon as string} className="mb-2 text-oranje" />
            <p className="font-display text-3xl">{v}</p>
            <p className="text-sm text-muted">{l}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-2 text-xl">Skills</h2>
          <Radar values={radar} />
          <p className="text-center text-xs text-muted">Accuracy on first attempts. Aim for 70%+ in every exam skill.</p>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 text-xl">Study calendar</h2>
          <Heatmap />
          <h3 className="mb-2 mt-6 font-semibold">Recent tests</h3>
          {recent.length ? (
            <ul className="space-y-1.5 text-sm">
              {recent.map((r, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="capitalize">
                    {r.kind} {r.ref}
                  </span>
                  <span className={r.score / r.total >= 0.6 ? 'text-polder' : 'text-tulip'}>{Math.round((r.score / r.total) * 100)}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Quizzes and tests will show up here.</p>
          )}
        </section>
      </div>
      <section className="card p-5">
        <h2 className="mb-4 text-xl">Badges</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BADGES.map((b) => {
            const have = s.badges.includes(b.id);
            return (
              <div key={b.id} className={`flex flex-col items-center gap-1.5 rounded-2xl border p-4 text-center ${have ? 'border-oranje/40 bg-oranje/5' : 'border-line opacity-50 grayscale'}`}>
                <span className={`grid h-12 w-12 place-items-center rounded-full ${have ? 'bg-oranje text-white' : 'bg-line text-muted'}`}>
                  <Icon name={b.icon} />
                </span>
                <span className="text-sm font-semibold">{b.title}</span>
                <span className="text-xs text-muted">{b.desc}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
