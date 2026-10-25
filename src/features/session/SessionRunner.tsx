import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { curriculum } from '@/content';
import { activityKey, buildBonus, countDone, dateKey } from '@/engine/scheduler';
import { liveStreak, XP } from '@/engine/xp';
import { Icon } from '@/design/icons';
import { celebrate, sfx, toast } from '@/design/fx';
import { useStore } from '@/store/store';
import type { Activity } from '@/store/types';
import type { RunResult } from '../practice/Run';
import { ActivityView } from './ActivityView';
import { activityInfo } from './activityMeta';
import { useTodayPlan } from './usePlan';

function Interstitial({ last, next, onGo, xp }: { last: Activity; next: Activity; onGo: () => void; xp: number }) {
  const a = activityInfo(last);
  const n = activityInfo(next);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
      <motion.div initial={{ rotate: -30, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring' }} className="grid h-16 w-16 place-items-center rounded-full bg-polder text-white">
        <Icon name="check" size={32} strokeWidth={2.6} />
      </motion.div>
      <div>
        <p className="font-display text-2xl">{a.title}</p>
        <p className="font-semibold text-oranje">+{xp} XP</p>
      </div>
      <div className="w-full rounded-2xl border border-line p-4 text-left">
        <p className="eyebrow mb-1">Next up</p>
        <div className="flex items-center gap-3">
          <Icon name={n.icon} className="text-cobalt" />
          <div>
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-muted">{n.sub}</p>
          </div>
          <span className="ml-auto text-sm text-muted">{next.minutes} min</span>
        </div>
      </div>
      <button className="btn-primary w-full" onClick={onGo} autoFocus>
        Continue <Icon name="arrowRight" size={18} />
      </button>
    </motion.div>
  );
}

function Complete({ bonus }: { bonus: boolean }) {
  const navigate = useNavigate();
  const day = useStore((s) => s.days[dateKey(new Date())]);
  const streak = useStore((s) => s.streak);
  const minutes = Math.round((day?.seconds ?? 0) / 60);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mx-auto flex max-w-md flex-col items-center gap-5 p-8 text-center">
      <p className="eyebrow">{bonus ? 'Bonus done' : 'Session complete'}</p>
      <h1 className="text-5xl">Goed gedaan!</h1>
      <div className="grid w-full grid-cols-3 gap-3">
        {[
          ['flame', liveStreak(streak, new Date()), 'day streak'],
          ['timer', minutes, 'minutes today'],
          ['star', day?.xp ?? 0, 'XP today'],
        ].map(([icon, v, l]) => (
          <div key={l as string} className="rounded-2xl border border-line p-3">
            <Icon name={icon as string} className="mx-auto text-oranje" />
            <p className="font-display text-3xl">{v}</p>
            <p className="text-xs text-muted">{l}</p>
          </div>
        ))}
      </div>
      <p className="text-muted">Tot morgen! Small daily steps beat long cramming sessions.</p>
      <button className="btn-primary w-full" onClick={() => navigate('/')}>
        Back to today
      </button>
    </motion.div>
  );
}

/** Runs today's planned activities in order, with a short celebration between them. */
export function SessionRunner() {
  const [params] = useSearchParams();
  const bonus = params.get('bonus') === '1';
  const navigate = useNavigate();
  const today = useTodayPlan();
  const markDone = useStore((s) => s.markDone);
  const addXp = useStore((s) => s.addXp);
  const addBonus = useStore((s) => s.addBonus);
  const checkBadges = useStore((s) => s.checkBadges);
  const bonusPlan = useMemo(() => (bonus ? buildBonus(useStore.getState(), curriculum, new Date()) : null), [bonus]);
  const plan = bonusPlan ?? today.plan;
  const [bonusDone, setBonusDone] = useState<string[]>([]);
  const doneList = bonus ? bonusDone : today.done;
  const pending = plan.activities.filter((a) => !doneList.includes(activityKey(a)));
  const [between, setBetween] = useState<{ last: Activity; xp: number } | null>(null);
  const current = pending[0];

  const onDone = (r?: RunResult) => {
    const a = current;
    const k = activityKey(a);
    let xp = XP.activity;
    if (r && r.total && r.correct === r.total) xp += XP.perfect;
    if (bonus) setBonusDone((d) => [...d, k]);
    else markDone(k);
    addXp(xp);
    const lessonsDone = countDone(useStore.getState().lessons);
    for (const b of checkBadges(lessonsDone)) toast({ icon: b.icon, title: `Badge: ${b.title}`, text: b.desc });
    const left = pending.length - 1;
    if (left <= 0) {
      addXp(XP.session);
      if (bonus) addBonus();
      sfx.done();
      celebrate(true);
      setBetween(null);
    } else setBetween({ last: a, xp });
  };

  if (!current) return <Complete bonus={bonus} />;
  if (between) return <Interstitial last={between.last} next={current} xp={between.xp} onGo={() => setBetween(null)} />;

  const total = plan.activities.length;
  const index = total - pending.length;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-muted">
        <span>{plan.title}</span>
        <span className="ml-auto flex gap-1">
          {plan.activities.map((a, i) => (
            <span key={i} className={`h-2 w-6 rounded-full ${i < index ? 'bg-polder' : i === index ? 'bg-oranje' : 'bg-line'}`} title={activityInfo(a).title} />
          ))}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activityKey(current)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ActivityView activity={current} onDone={onDone} onExit={() => navigate('/')} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
