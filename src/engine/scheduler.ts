import { dueCount } from './srs';
import { ALL_STEPS, PART1, PART2, type Activity, type AppData, type DayType, type DrillId, type SessionPlan, type StepId } from '@/store/types';

/** What the scheduler needs to know about the course. Kept small so tests can fake it. */
export interface Curriculum {
  lessonCount: number;
  unitOf(lesson: number): number;
  lessonsOf(unit: number): number[];
  knmFor(lesson: number): string;
  tutorFor(unit: number): string;
  mockCount: number;
  /** Whether a lesson has an optional bonus round. */
  hasBonus?(lesson: number): boolean;
}

export const WEEKDAY_MINUTES = 30;
export const PLAN_VERSION = 4;
const LESSONS_PER_WEEK = 2;

export const STEP_MINUTES: Record<StepId, number> = {
  words: 8,
  listen: 7,
  shadow: 4,
  dictation: 4,
  cloze: 4,
  grammar: 6,
  questions: 4,
};

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function dayTypeOf(d: Date): DayType {
  const dow = d.getDay();
  if (dow === 0) return 'sunday';
  if (dow === 6) return 'saturday';
  if (dow === 5) return 'friday';
  return 'weekday';
}

export function stepsMinutes(steps: StepId[]): number {
  return steps.reduce((s, id) => s + STEP_MINUTES[id], 0);
}

export function isLessonDone(data: AppData, n: number): boolean {
  const p = data.lessons[n];
  return !!p && ALL_STEPS.every((s) => p.steps.includes(s));
}

/** Number of fully finished lessons. */
export function countDone(lessons: AppData['lessons']): number {
  return Object.values(lessons).filter((p) => ALL_STEPS.every((s) => p.steps.includes(s))).length;
}

export function completedLessons(data: AppData, cur: Curriculum): number[] {
  const out: number[] = [];
  for (let n = 1; n <= cur.lessonCount; n++) if (isLessonDone(data, n)) out.push(n);
  return out;
}

/** The next lesson part to study: part 1 (words + first listening) or part 2 (everything else). */
export function nextPart(data: AppData, cur: Curriculum, skip: number[] = []): { lesson: number; steps: StepId[] } | null {
  for (let n = 1; n <= cur.lessonCount; n++) {
    if (skip.includes(n)) continue;
    const done = data.lessons[n]?.steps ?? [];
    const p1 = PART1.filter((s) => !done.includes(s));
    if (p1.length) return { lesson: n, steps: p1 };
    const p2 = PART2.filter((s) => !done.includes(s));
    if (p2.length) return { lesson: n, steps: p2 };
  }
  return null;
}

/** Up to `k` upcoming lesson parts in order (part 1 then part 2, lesson by lesson). */
export function nextParts(data: AppData, cur: Curriculum, k: number): { lesson: number; steps: StepId[] }[] {
  const out: { lesson: number; steps: StepId[] }[] = [];
  for (let n = 1; n <= cur.lessonCount && out.length < k; n++) {
    const done = data.lessons[n]?.steps ?? [];
    const p1 = PART1.filter((s) => !done.includes(s));
    const p2 = PART2.filter((s) => !done.includes(s));
    if (p1.length) out.push({ lesson: n, steps: p1 });
    if (p2.length && out.length < k) out.push({ lesson: n, steps: p2 });
  }
  return out;
}

/** Lessons behind the 2-per-week pace since the start date (0 when on track). */
export function lessonsBehind(data: AppData, cur: Curriculum, today: Date): number {
  if (!data.settings.startDate) return 0;
  const start = parseKey(data.settings.startDate);
  const weeks = Math.floor((today.getTime() - start.getTime()) / (7 * 864e5));
  const expected = Math.min(cur.lessonCount, weeks * LESSONS_PER_WEEK);
  return Math.max(0, expected - completedLessons(data, cur).length);
}

function pendingCheckpoint(data: AppData, cur: Curriculum): number | null {
  const units = new Set<number>();
  for (let n = 1; n <= cur.lessonCount; n++) units.add(cur.unitOf(n));
  for (const u of [...units].sort((a, b) => a - b)) {
    if (data.checkpoints.includes(u)) continue;
    if (cur.lessonsOf(u).every((n) => isLessonDone(data, n))) return u;
  }
  return null;
}

const DRILL_UNLOCK: [DrillId, number][] = [
  ['numbers', 1],
  ['verbs', 2],
  ['clock', 5],
  ['spelling', 6],
  ['dehet', 11],
  ['perfect', 22],
];

export function unlockedDrills(lessonsDone: number): DrillId[] {
  const out = DRILL_UNLOCK.filter(([, n]) => lessonsDone + 1 >= n).map(([d]) => d);
  return out.length ? out : ['numbers'];
}

function dayIndex(d: Date): number {
  return Math.floor(d.getTime() / 864e5);
}

function pickDrill(lessonsDone: number, d: Date, offset = 0): DrillId {
  const list = unlockedDrills(lessonsDone);
  return list[(dayIndex(d) + offset) % list.length];
}

/** Marked hard words: a short flashcard round when some are due. */
function flashActivity(data: AppData, now: Date, cap: number): Activity | null {
  const due = dueCount(data.flash ?? {}, now.getTime());
  if (!due) return null;
  const minutes = Math.max(2, Math.min(cap, Math.ceil(due * 0.25)));
  return { kind: 'flash', minutes, limit: minutes * 5 };
}

function srsActivity(due: number, cap: number): Activity | null {
  if (due <= 0) return null;
  const minutes = Math.max(3, Math.min(cap, Math.ceil(due * 0.2)));
  return { kind: 'srs', minutes, limit: Math.round(minutes * 6) };
}

function total(acts: Activity[]): number {
  return acts.reduce((s, a) => s + a.minutes, 0);
}

/** Drop or shrink low-priority work until the plan fits `target` minutes. */
function fit(acts: Activity[], target: number): Activity[] {
  const out = [...acts];
  while (total(out) > target) {
    const drill = out.findIndex((a) => a.kind === 'drill');
    if (drill >= 0) {
      out.splice(drill, 1);
      continue;
    }
    const flash = out.find((a) => a.kind === 'flash');
    if (flash && flash.minutes > 2) {
      flash.minutes = Math.max(2, flash.minutes - (total(out) - target));
      if (flash.kind === 'flash') flash.limit = flash.minutes * 5;
      continue;
    }
    const srs = out.find((a) => a.kind === 'srs');
    if (srs && srs.minutes > 3) {
      const over = total(out) - target;
      srs.minutes = Math.max(3, srs.minutes - over);
      if (srs.kind === 'srs') srs.limit = srs.minutes * 6;
      continue;
    }
    break;
  }
  return out;
}

const GROW: Partial<Record<Activity['kind'], [step: number, max: number]>> = { reading: [6, 4], listening: [5, 4], speaking: [3, 5], writing: [10, 2] };

export const EXTRA_MINUTES = 15;

/** The bonus round to suggest: the most recently finished lesson whose bonus is still open. */
export function nextExtra(data: AppData, cur: Curriculum): number | undefined {
  if (!cur.hasBonus) return undefined;
  const done = data.bonusDone ?? [];
  return completedLessons(data, cur)
    .reverse()
    .find((n) => cur.hasBonus!(n) && !done.includes(n));
}

/** Fill leftover weekend time: first an open bonus round, then drills not yet in the plan, then more exam items. */
function pad(acts: Activity[], target: number, lessonsDone: number, d: Date, extra?: number): Activity[] {
  const out = acts.map((a) => ({ ...a }));
  if (extra && target - total(out) >= EXTRA_MINUTES) out.push({ kind: 'extra', lesson: extra, minutes: EXTRA_MINUTES });
  const unused = unlockedDrills(lessonsDone).filter((dr) => !out.some((a) => a.kind === 'drill' && a.drill === dr));
  const offset = dayIndex(d) % Math.max(1, unused.length);
  const drills = [...unused.slice(offset), ...unused.slice(0, offset)].slice(0, 2);
  for (const drill of drills) {
    if (target - total(out) < 6) break;
    out.push({ kind: 'drill', drill, minutes: 6 });
  }
  let grew = true;
  while (grew) {
    grew = false;
    for (const a of out) {
      const g = GROW[a.kind];
      if (!g || !('count' in a) || target - total(out) < g[0] || a.count >= g[1]) continue;
      a.count += 1;
      a.minutes += g[0];
      grew = true;
    }
  }
  return out;
}

export function buildSession(data: AppData, cur: Curriculum, today: Date): SessionPlan {
  const dayType = dayTypeOf(today);
  const due = dueCount(data.srs, today.getTime());
  const done = completedLessons(data, cur);
  const next = nextPart(data, cur);
  const recent = done.slice(-2);
  const currentLesson = next?.lesson ?? cur.lessonCount;
  const unit = cur.unitOf(recent.length ? recent[recent.length - 1] : currentLesson);
  const weekend = data.settings.weekendMinutes;
  const behind = lessonsBehind(data, cur, today);
  const checkpoint = pendingCheckpoint(data, cur);
  const acts: Activity[] = [];
  const push = (a: Activity | null) => a && acts.push(a);
  let title: string;
  let subtitle: string;
  let target: number;

  const examPhase = !next;

  if (dayType === 'weekday' || (dayType === 'friday' && !done.length)) {
    target = WEEKDAY_MINUTES;
    push(srsActivity(due, 8));
    push(flashActivity(data, today, 4));
    if (next) {
      acts.push({ kind: 'lesson', lesson: next.lesson, steps: next.steps, minutes: stepsMinutes(next.steps) });
      title = `Les ${next.lesson}`;
      subtitle = next.steps.includes('words') ? 'New words and a first listen' : 'Shadow, dictate, grammar and speak';
    } else {
      const skills = ['reading', 'listening', 'writing', 'speaking', 'knm'] as const;
      const s = skills[dayIndex(today) % skills.length];
      if (s === 'knm') acts.push({ kind: 'knm', theme: cur.knmFor(1 + (dayIndex(today) % cur.lessonCount)), minutes: 12 });
      else acts.push({ kind: s, unit: 1 + (dayIndex(today) % 6), count: s === 'writing' ? 1 : 3, minutes: 15 } as Activity);
      title = 'Exam training';
      subtitle = 'One exam skill a day, plus review';
    }
    acts.push({ kind: 'drill', drill: pickDrill(done.length, today), minutes: 5 });
    return finish(today, dayType, title, subtitle, fit(acts, target));
  }

  if (dayType === 'friday') {
    target = WEEKDAY_MINUTES;
    push(srsActivity(due, 10));
    push(flashActivity(data, today, 6));
    acts.push({ kind: 'quiz', lessons: done.slice(-4), minutes: 8 });
    acts.push({ kind: 'speaking', unit, count: 2, minutes: 6 });
    acts.push({ kind: 'drill', drill: pickDrill(done.length, today), minutes: 6 });
    return finish(today, dayType, 'Review Friday', 'Look back at the week: quiz, speaking and drills', fit(acts, target));
  }

  target = weekend;
  const mockNo = 1 + (Math.floor(data.results.filter((r) => r.kind === 'mock').length / 2) % cur.mockCount);
  const parts = nextParts(data, cur, 2);
  /** Add upcoming lesson parts that still fit in the weekend target. */
  const addParts = () => {
    for (const p of parts) {
      const m = stepsMinutes(p.steps);
      if (total(acts) + m > target) break;
      acts.push({ kind: 'lesson', lesson: p.lesson, steps: p.steps, minutes: m });
    }
  };

  if (!examPhase && !done.length) {
    // Very first weekend: lessons before exam practice.
    push(srsActivity(due, 8));
    addParts();
    acts.push({ kind: 'reading', unit: 1, count: 2, minutes: 12 });
    acts.push({ kind: 'listening', unit: 1, count: 2, minutes: 10 });
    title = 'Weekend start';
    subtitle = 'Your first lessons at your own pace, then a taste of the exam';
    return finish(today, dayType, title, subtitle, pad(fit(acts, target), target, done.length, today, nextExtra(data, cur)));
  }

  if (dayType === 'saturday') {
    push(srsActivity(due, 10));
    push(flashActivity(data, today, 8));
    if (examPhase) {
      acts.push({ kind: 'mock', mock: mockNo, part: 'A', minutes: 60 });
      title = `Mock exam ${mockNo} · part A`;
      subtitle = 'Lezen, Luisteren and KNM under exam timing';
    } else {
      if (behind > 0) addParts();
      const n = weekend >= 90 ? 3 : 2;
      acts.push({ kind: 'reading', unit, count: n, minutes: n * 6 });
      acts.push({ kind: 'listening', unit, count: n, minutes: n * 5 });
      acts.push({ kind: 'knm', theme: cur.knmFor(recent[recent.length - 1] ?? currentLesson), minutes: 12 });
      if (checkpoint) acts.push({ kind: 'checkpoint', unit: checkpoint, minutes: 20 });
      if (!behind) addParts();
      title = 'Exam skills Saturday';
      subtitle = behind > 0 ? 'Catch up a lesson, then reading, listening and society' : 'Reading, listening and Dutch society';
    }
  } else {
    push(srsActivity(due, 10));
    push(flashActivity(data, today, 8));
    if (examPhase) {
      acts.push({ kind: 'mock', mock: mockNo, part: 'B', minutes: 35 });
      title = `Mock exam ${mockNo} · part B`;
      subtitle = 'Schrijven and Spreken under exam timing';
    } else {
      if (behind > 0) addParts();
      const w = weekend >= 120 ? 2 : 1;
      acts.push({ kind: 'writing', unit, count: w, minutes: w * 10 });
      acts.push({ kind: 'speaking', unit, count: 3, minutes: 9 });
      if (data.settings.apiKey) acts.push({ kind: 'tutor', scenario: cur.tutorFor(unit), minutes: 12 });
      acts.push({ kind: 'quiz', lessons: done.slice(-2), minutes: 8 });
      if (checkpoint) acts.push({ kind: 'checkpoint', unit: checkpoint, minutes: 20 });
      if (!behind) addParts();
      title = 'Speaking & writing Sunday';
      subtitle = behind > 0 ? 'Catch up a lesson, then write and speak' : 'Produce Dutch: write, speak, chat';
    }
  }
  return finish(today, dayType, title, subtitle, pad(fit(acts, target), target, done.length, today, nextExtra(data, cur)));
}

/** A follow-up session for learners who finished today's plan and want more. */
export function buildBonus(data: AppData, cur: Curriculum, today: Date): SessionPlan {
  const next = nextPart(data, cur);
  const done = completedLessons(data, cur);
  const acts: Activity[] = [];
  const extra = nextExtra(data, cur);
  if (next) acts.push({ kind: 'lesson', lesson: next.lesson, steps: next.steps, minutes: stepsMinutes(next.steps) });
  else if (!extra) acts.push({ kind: 'reading', unit: 1 + (dayIndex(today) % 6), count: 2, minutes: 12 });
  if (extra) acts.push({ kind: 'extra', lesson: extra, minutes: EXTRA_MINUTES });
  else acts.push({ kind: 'drill', drill: pickDrill(done.length, today, 2), minutes: 5 });
  return finish(today, dayTypeOf(today), 'Bonus round', 'Extra practice — you are ahead of plan', acts);
}

function finish(today: Date, dayType: DayType, title: string, subtitle: string, activities: Activity[]): SessionPlan {
  return { v: PLAN_VERSION, date: dateKey(today), dayType, title, subtitle, activities, minutes: total(activities) };
}

/** Stable key used to mark an activity as completed in the day log. */
export function activityKey(a: Activity): string {
  switch (a.kind) {
    case 'lesson':
      return `lesson:${a.lesson}:${a.steps.join('+')}`;
    case 'drill':
      return `drill:${a.drill}`;
    case 'knm':
      return `knm:${a.theme}`;
    case 'checkpoint':
      return `checkpoint:${a.unit}`;
    case 'mock':
      return `mock:${a.mock}:${a.part}`;
    case 'tutor':
      return `tutor:${a.scenario}`;
    case 'quiz':
      return `quiz:${a.lessons.join(',')}`;
    case 'extra':
      return `extra:${a.lesson}`;
    default:
      return a.kind;
  }
}
