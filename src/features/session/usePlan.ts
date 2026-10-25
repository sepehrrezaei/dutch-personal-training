import { useEffect, useMemo } from 'react';
import { curriculum } from '@/content';
import { activityKey, buildSession, dateKey, PLAN_VERSION } from '@/engine/scheduler';
import { useStore } from '@/store/store';
import type { SessionPlan } from '@/store/types';

/** Today's plan, frozen for the day once built so finishing work doesn't reshuffle it. */
export function useTodayPlan(): { plan: SessionPlan; done: string[]; remaining: number; finished: boolean } {
  const key = dateKey(new Date());
  const day = useStore((s) => s.days[key]);
  const setPlan = useStore((s) => s.setPlan);
  const stored = day?.plan && day.plan.date === key && day.plan.v === PLAN_VERSION ? day.plan : null;
  const plan = useMemo(() => stored ?? buildSession(useStore.getState(), curriculum, new Date()), [stored, key]);
  useEffect(() => {
    if (!stored) setPlan(plan);
  }, [stored, plan, setPlan]);
  const done = day?.done ?? [];
  const remaining = plan.activities.filter((a) => !done.includes(activityKey(a))).length;
  return { plan, done, remaining, finished: remaining === 0 };
}
