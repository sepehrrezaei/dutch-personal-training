import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { del, get, set } from 'idb-keyval';
import type { Grade } from 'ts-fsrs';
import { newCard, review } from '@/engine/srs';
import { dateKey } from '@/engine/scheduler';
import { newBadges, touchStreak, XP, type Badge } from '@/engine/xp';
import { emptyData } from './defaults';
import type { AppData, DayLog, ExamResult, SessionPlan, Settings, Skill, StepId } from './types';

export { emptyData, SKILLS } from './defaults';

const idbStorage: StateStorage = {
  getItem: async (name) => (await get<string>(name)) ?? null,
  setItem: async (name, value) => set(name, value),
  removeItem: async (name) => del(name),
};

interface Actions {
  completeSteps(lesson: number, steps: StepId[]): void;
  addCards(cards: { id: string; lesson: number }[]): void;
  reviewCard(id: string, rating: Grade): void;
  toggleMark(vocabId: string, lesson: number): boolean;
  setMarkNote(vocabId: string, note: string): void;
  reviewFlash(id: string, rating: Grade): void;
  answer(skill: Skill, ok: boolean): void;
  addXp(n: number): void;
  addSeconds(n: number): void;
  markDone(key: string): void;
  setPlan(plan: SessionPlan): void;
  addBonus(): void;
  addResult(r: Omit<ExamResult, 'date'>): void;
  completeCheckpoint(unit: number): void;
  markSeen(ids: string[]): void;
  updateSettings(s: Partial<Settings>): void;
  replaceAll(d: AppData): void;
  reset(): void;
  checkBadges(lessonsDone: number): Badge[];
}

export type Store = AppData & Actions & { hydrated: boolean };

const today = () => dateKey(new Date());

function withDay(s: AppData, fn: (d: DayLog) => DayLog): Pick<AppData, 'days'> {
  const k = today();
  const cur = s.days[k] ?? { seconds: 0, xp: 0, done: [] };
  return { days: { ...s.days, [k]: fn(cur) } };
}

export const useStore = create<Store>()(
  persist(
    (setState, getState) => ({
      ...emptyData(),
      hydrated: false,

      completeSteps(lesson, steps) {
        setState((s) => {
          const prev = s.lessons[lesson]?.steps ?? [];
          const merged = Array.from(new Set([...prev, ...steps]));
          const fresh = steps.filter((x) => !prev.includes(x)).length;
          const completedAt = merged.length >= 7 ? s.lessons[lesson]?.completedAt ?? new Date().toISOString() : undefined;
          return {
            lessons: { ...s.lessons, [lesson]: { steps: merged, completedAt } },
            xp: s.xp + fresh * XP.step,
            streak: touchStreak(s.streak, new Date()),
            ...withDay(s, (d) => ({ ...d, xp: d.xp + fresh * XP.step })),
            settings: s.settings.startDate ? s.settings : { ...s.settings, startDate: today() },
          };
        });
      },

      addCards(cards) {
        setState((s) => {
          const srs = { ...s.srs };
          for (const c of cards) if (!srs[c.id]) srs[c.id] = newCard(c.id, c.lesson);
          return { srs };
        });
      },

      toggleMark(vocabId, lesson) {
        const s = getState();
        if (s.marked[vocabId]) {
          const marked = { ...s.marked };
          delete marked[vocabId];
          const flash = { ...s.flash };
          delete flash[`${vocabId}|nl`];
          delete flash[`${vocabId}|en`];
          setState({ marked, flash });
          return false;
        }
        setState({
          marked: { ...s.marked, [vocabId]: { lesson, addedAt: Date.now() } },
          flash: { ...s.flash, [`${vocabId}|nl`]: newCard(`${vocabId}|nl`, lesson), [`${vocabId}|en`]: newCard(`${vocabId}|en`, lesson) },
        });
        return true;
      },

      setMarkNote(vocabId, note) {
        setState((s) => (s.marked[vocabId] ? { marked: { ...s.marked, [vocabId]: { ...s.marked[vocabId], note: note.trim() || undefined } } } : {}));
      },

      reviewFlash(id, rating) {
        setState((s) => {
          const c = s.flash[id];
          if (!c) return {};
          return { flash: { ...s.flash, [id]: review(c, rating, new Date(), true) }, streak: touchStreak(s.streak, new Date()) };
        });
      },

      reviewCard(id, rating) {
        setState((s) => {
          const c = s.srs[id];
          if (!c) return {};
          return { srs: { ...s.srs, [id]: review(c, rating) } };
        });
      },

      answer(skill, ok) {
        setState((s) => {
          const [r, t] = s.skills[skill] ?? [0, 0];
          const gain = ok ? XP.correct : 0;
          return {
            skills: { ...s.skills, [skill]: [r + (ok ? 1 : 0), t + 1] },
            xp: s.xp + gain,
            streak: touchStreak(s.streak, new Date()),
            ...withDay(s, (d) => ({ ...d, xp: d.xp + gain })),
          };
        });
      },

      addXp(n) {
        setState((s) => ({ xp: s.xp + n, ...withDay(s, (d) => ({ ...d, xp: d.xp + n })) }));
      },

      addSeconds(n) {
        setState((s) => withDay(s, (d) => ({ ...d, seconds: d.seconds + n })));
      },

      markDone(key) {
        setState((s) => ({
          streak: touchStreak(s.streak, new Date()),
          ...withDay(s, (d) => (d.done.includes(key) ? d : { ...d, done: [...d.done, key] })),
        }));
      },

      setPlan(plan) {
        setState((s) => withDay(s, (d) => ({ ...d, plan })));
      },

      addBonus() {
        setState((s) => withDay(s, (d) => ({ ...d, bonus: (d.bonus ?? 0) + 1 })));
      },

      addResult(r) {
        setState((s) => ({ results: [...s.results, { ...r, date: new Date().toISOString() }] }));
      },

      completeCheckpoint(unit) {
        setState((s) => (s.checkpoints.includes(unit) ? {} : { checkpoints: [...s.checkpoints, unit] }));
      },

      markSeen(ids) {
        setState((s) => ({ seen: Array.from(new Set([...s.seen, ...ids])) }));
      },

      updateSettings(patch) {
        setState((s) => ({ settings: { ...s.settings, ...patch } }));
      },

      replaceAll(d) {
        setState({ ...emptyData(), ...d, settings: { ...emptyData().settings, ...d.settings } });
      },

      reset() {
        setState({ ...emptyData() });
      },

      checkBadges(lessonsDone) {
        const s = getState();
        const earned = newBadges(s, lessonsDone);
        if (earned.length) setState({ badges: [...s.badges, ...earned.map((b) => b.id)] });
        return earned;
      },
    }),
    {
      name: 'tegel-v1',
      storage: createJSONStorage(() => idbStorage),
      partialize: ({ hydrated: _h, ...rest }) =>
        Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== 'function')) as unknown as Store,
      onRehydrateStorage: () => () => useStore.setState({ hydrated: true }),
    },
  ),
);

/** Plain data snapshot for export. */
export function snapshot(): AppData {
  const s = useStore.getState();
  const out = emptyData();
  for (const k of Object.keys(out) as (keyof AppData)[]) (out as unknown as Record<string, unknown>)[k] = s[k];
  return out;
}
