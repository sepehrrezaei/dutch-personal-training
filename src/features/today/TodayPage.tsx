import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLesson, LESSON_COUNT, lessonsOf, unitOf, UNITS } from '@/content';
import { activityKey, countDone, dateKey, nextPart, WEEKDAY_MINUTES } from '@/engine/scheduler';
import { curriculum } from '@/content';
import { dueCount, isKnown } from '@/engine/srs';
import { dutchVoices, onVoicesChanged, speak } from '@/engine/speech';
import { cefrOf, levelOf, liveStreak } from '@/engine/xp';
import { Icon } from '@/design/icons';
import { Bar, Modal, ProgressRing } from '@/design/ui';
import type { TileState } from '@/design/Tile';
import { LessonMark } from '@/design/LessonMark';
import { useStore } from '@/store/store';
import { ALL_STEPS, PART1 } from '@/store/types';
import { activityInfo } from '../session/activityMeta';
import { useTodayPlan } from '../session/usePlan';

const DAY_NL = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const MONTH_NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

function greeting(h: number) {
  if (h < 6) return 'Goedenacht';
  if (h < 12) return 'Goedemorgen';
  if (h < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

export function tileState(lessons: ReturnType<typeof useStore.getState>['lessons'], n: number, current: number): TileState {
  const steps = lessons[n]?.steps ?? [];
  if (ALL_STEPS.every((s) => steps.includes(s))) return 'done';
  if (PART1.every((s) => steps.includes(s))) return 'half';
  if (n === current) return 'current';
  if (n < current) return 'open';
  return getLesson(n) ? 'open' : 'locked';
}

function Welcome() {
  const settings = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);
  const [open, setOpen] = useState(!settings.name && !settings.startDate);
  const [name, setName] = useState('');
  const [voices, setVoices] = useState(dutchVoices().length);
  useEffect(() => onVoicesChanged(() => setVoices(dutchVoices().length)), []);
  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Welkom bij Tegel!">
      <div className="space-y-5">
        <p className="text-muted">
          Your daily Dutch, tile by tile: <strong>≤ 30 minutes on weekdays</strong> and a longer exam-skills session at the weekend — from zero to the
          Inburgeringsexamen A2 in about six months.
        </p>
        <label className="grid gap-1">
          <span className="text-sm font-semibold">What should I call you?</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" autoFocus />
        </label>
        <div className="grid gap-1">
          <span className="text-sm font-semibold">How long can you study on Saturday and Sunday?</span>
          <div className="grid grid-cols-3 gap-2">
            {([60, 90, 120] as const).map((m) => (
              <button key={m} className={settings.weekendMinutes === m ? 'btn-primary py-2' : 'btn-ghost py-2'} onClick={() => update({ weekendMinutes: m })}>
                {m === 60 ? '1 hour' : m === 90 ? '1½ hours' : '2 hours'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-glaze p-3 text-sm">
          <button className="btn-ghost px-3 py-2" onClick={() => speak('Hallo! Welkom. Ik ben je Nederlandse stem.')}>
            <Icon name="speaker" size={18} /> Test voice
          </button>
          {voices ? (
            <span className="text-muted">{voices} Dutch voice{voices > 1 ? 's' : ''} found.</span>
          ) : (
            <span className="text-tulip">No Dutch voice found. On a Mac/iPhone add one in System Settings → Accessibility → Spoken Content → System voice → Manage voices → Dutch.</span>
          )}
        </div>
        <button
          className="btn-orange w-full"
          onClick={() => {
            update({ name: name.trim() || undefined, startDate: dateKey(new Date()) });
            setOpen(false);
          }}
        >
          Let's start <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </Modal>
  );
}

function WeekDots() {
  const days = useStore((s) => s.days);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return (
    <div className="flex gap-1.5">
      {['M', 'D', 'W', 'D', 'V', 'Z', 'Z'].map((l, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const k = dateKey(d);
        const studied = (days[k]?.done.length ?? 0) > 0 || (days[k]?.seconds ?? 0) >= 300;
        const isToday = k === dateKey(now);
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${studied ? 'bg-oranje text-white' : isToday ? 'border-2 border-oranje text-oranje' : 'bg-line/60 text-muted'}`}>
              {studied ? <Icon name="flame" size={14} /> : l}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function TodayPage() {
  const navigate = useNavigate();
  const { plan, done, finished } = useTodayPlan();
  const state = useStore();
  const now = new Date();
  const today = state.days[dateKey(now)];
  const minutes = Math.round((today?.seconds ?? 0) / 60);
  const target = plan.dayType === 'saturday' || plan.dayType === 'sunday' ? state.settings.weekendMinutes : WEEKDAY_MINUTES;
  const lessonsDone = countDone(state.lessons);
  const next = nextPart(state, curriculum);
  const current = next?.lesson ?? LESSON_COUNT;
  const unit = unitOf(current);
  const lvl = levelOf(state.xp);
  const cefr = cefrOf(lessonsDone, state.results.some((r) => r.kind === 'mock' && r.score / r.total >= 0.6));
  const known = Object.values(state.srs).filter(isKnown).length;
  const due = dueCount(state.srs);
  const streak = liveStreak(state.streak, now);
  const started = done.length > 0;
  const weekend = plan.dayType === 'saturday' || plan.dayType === 'sunday';

  return (
    <div className="space-y-6">
      <Welcome />
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">
          {DAY_NL[now.getDay()]} {now.getDate()} {MONTH_NL[now.getMonth()]}
        </p>
        <h1 className="text-4xl sm:text-5xl">
          {greeting(now.getHours())}
          {state.settings.name ? `, ${state.settings.name}` : ''}!
        </h1>
      </motion.header>

      <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        {/* Session card */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card relative overflow-hidden">
          <div className={`absolute inset-x-0 top-0 h-1.5 ${weekend ? 'bg-oranje' : 'bg-cobalt'}`} />
          <div className="flex items-start gap-4 p-6 pb-4">
            <div className="min-w-0 flex-1">
              <span className={`chip ${weekend ? 'border-oranje/50 text-oranje' : 'border-cobalt/40 text-cobalt'}`}>
                <Icon name={weekend ? 'sun' : 'timer'} size={14} />
                {weekend ? `Weekend · ${target} min` : `Weekday · ${WEEKDAY_MINUTES} min`}
              </span>
              <h2 className="mt-3 text-3xl leading-tight">{plan.title}</h2>
              <p className="text-muted">{plan.subtitle}</p>
            </div>
            <ProgressRing value={minutes / target} size={78} stroke={8}>
              <div className="text-center leading-none">
                <span className="font-display text-xl">{minutes}</span>
                <span className="block text-[10px] text-muted">/ {target} min</span>
              </div>
            </ProgressRing>
          </div>
          <ol className="space-y-1 px-4">
            {plan.activities.map((a, i) => {
              const info = activityInfo(a);
              const isDone = done.includes(activityKey(a));
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.04 }}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${isDone ? 'opacity-60' : ''}`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isDone ? 'bg-polder text-white' : 'bg-cobalt-soft text-cobalt'}`}>
                    <Icon name={isDone ? 'check' : info.icon} size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate font-semibold ${isDone ? 'line-through' : ''}`}>{info.title}</p>
                    <p className="truncate text-sm text-muted">{info.sub}</p>
                  </div>
                  <span className="shrink-0 text-sm text-muted">{a.minutes}′</span>
                </motion.li>
              );
            })}
          </ol>
          <div className="p-5 pt-4">
            {finished ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 font-semibold text-polder">
                  <Icon name="check" /> Today's session is done. Goed gedaan!
                </div>
                <button className="btn-ghost" onClick={() => navigate('/session?bonus=1')}>
                  <Icon name="bolt" size={18} /> Bonus round
                </button>
              </div>
            ) : (
              <button className="btn-orange w-full py-4 text-lg" onClick={() => navigate('/session')}>
                <Icon name="play" size={20} /> {started ? 'Continue session' : 'Start session'} · {plan.minutes} min
              </button>
            )}
          </div>
        </motion.section>

        {/* Stats column */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span animate={streak ? { scale: [1, 1.15, 1] } : undefined} transition={{ repeat: Infinity, duration: 2 }} className="text-oranje">
                  <Icon name="flame" size={30} />
                </motion.span>
                <div>
                  <p className="font-display text-3xl leading-none">{streak}</p>
                  <p className="text-xs text-muted">day streak · best {state.streak.best}</p>
                </div>
              </div>
              <span className="chip" title="Streak freezes this week">
                <Icon name="shield" size={14} /> {state.streak.freezes}
              </span>
            </div>
            <WeekDots />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card space-y-4 p-5">
            <div>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="font-semibold">Level {lvl.level}</span>
                <span className="text-xs text-muted">
                  {lvl.into} / {lvl.need} XP
                </span>
              </div>
              <Bar value={lvl.into / lvl.need} />
            </div>
            <div>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="font-semibold">
                  Niveau <span className="font-display text-xl text-cobalt">{cefr.label}</span>
                </span>
                <span className="text-xs text-muted">next: {cefr.next}</span>
              </div>
              <Bar value={cefr.pct} color="bg-cobalt" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <Link to="/progress" className="rounded-2xl border border-line p-3 hover:border-cobalt/50">
                <p className="font-display text-2xl">{known}</p>
                <p className="text-xs text-muted">words known</p>
              </Link>
              <Link to="/review" className="rounded-2xl border border-line p-3 hover:border-cobalt/50">
                <p className="font-display text-2xl">{due}</p>
                <p className="text-xs text-muted">due for review</p>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Current unit tiles */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Unit {unit} of 6</p>
            <h2 className="text-2xl">{UNITS[unit - 1].title}</h2>
          </div>
          <Link to="/path" className="flex items-center gap-1 text-sm font-semibold text-cobalt">
            Whole course <Icon name="chevronRight" size={16} />
          </Link>
        </div>
        <ol className="flex overflow-x-auto pb-2">
          {lessonsOf(unit).map((n, i, all) => {
            const l = getLesson(n);
            const st = tileState(state.lessons, n, current);
            return (
              <li key={n} className="relative flex w-[104px] shrink-0 flex-col items-center">
                {i < all.length - 1 && (
                  <span aria-hidden className={`absolute left-[calc(50%+30px)] top-[23px] h-[3px] w-[calc(100%-60px)] rounded-full ${st === 'done' ? 'bg-cobalt' : 'bg-line'}`} />
                )}
                <Link to={`/lesson/${n}`} className="group flex flex-col items-center gap-2 px-1 text-center">
                  <LessonMark n={n} icon={l?.icon ?? 'book'} state={st} size={48} />
                  <span className={`line-clamp-2 text-xs font-semibold group-hover:text-cobalt ${n === current ? 'text-cobalt' : ''}`}>{l?.title ?? 'Binnenkort'}</span>
                </Link>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span>
            {lessonsDone} of {LESSON_COUNT} lessons done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded border-2 border-cobalt" /> next
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 overflow-hidden rounded border-2 border-cobalt bg-[linear-gradient(to_top,rgb(var(--cobalt)/0.35)_50%,transparent_50%)]" /> part 1 done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-cobalt" /> finished
          </span>
        </p>
      </motion.section>
    </div>
  );
}
