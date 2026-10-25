import { dateKey, parseKey } from './scheduler';
import type { AppData } from '@/store/types';

export const XP = {
  correct: 2,
  step: 10,
  activity: 15,
  session: 40,
  perfect: 10,
};

/** Level n needs 60·n·(n+1)/2 XP in total: 60, 180, 360, ... */
export function levelOf(xp: number): { level: number; into: number; need: number } {
  let level = 1;
  let floor = 0;
  while (xp >= floor + 60 * level) {
    floor += 60 * level;
    level++;
  }
  return { level, into: xp - floor, need: 60 * level };
}

/** Rough CEFR estimate from lessons finished and mock results. */
export function cefrOf(lessonsDone: number, passedMock: boolean): { label: string; next: string; pct: number } {
  if (passedMock && lessonsDone >= 42) return { label: 'A2', next: 'Exam ready', pct: 1 };
  if (lessonsDone >= 32) return { label: 'A2−', next: 'A2', pct: (lessonsDone - 32) / 10 };
  if (lessonsDone >= 21) return { label: 'A1+', next: 'A2−', pct: (lessonsDone - 21) / 11 };
  if (lessonsDone >= 10) return { label: 'A1', next: 'A1+', pct: (lessonsDone - 10) / 11 };
  return { label: 'A0', next: 'A1', pct: lessonsDone / 10 };
}

function isoWeek(d: Date): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
  return `${t.getUTCFullYear()}-W${week}`;
}

function daysBetween(a: string, b: string): number {
  return Math.round((parseKey(b).getTime() - parseKey(a).getTime()) / 864e5);
}

/**
 * Register study activity on `today`. One missed day per ISO week is covered by a streak freeze;
 * a bigger gap resets the streak.
 */
export function touchStreak(streak: AppData['streak'], today: Date): AppData['streak'] {
  const key = dateKey(today);
  const week = isoWeek(today);
  const s = { ...streak };
  if (s.freezeWeek !== week) {
    s.freezes = 1;
    s.freezeWeek = week;
  }
  if (s.last === key) return s;
  if (!s.last) {
    s.count = 1;
  } else {
    const gap = daysBetween(s.last, key);
    if (gap === 1) s.count += 1;
    else if (gap === 2 && s.freezes > 0) {
      s.freezes -= 1;
      s.count += 1;
    } else s.count = 1;
  }
  s.last = key;
  s.best = Math.max(s.best, s.count);
  return s;
}

/** The streak as it should be displayed today (it breaks visually once the gap can't be bridged). */
export function liveStreak(streak: AppData['streak'], today: Date): number {
  if (!streak.last) return 0;
  const gap = daysBetween(streak.last, dateKey(today));
  if (gap <= 1) return streak.count;
  if (gap === 2 && (streak.freezes > 0 || streak.freezeWeek !== isoWeek(today))) return streak.count;
  return 0;
}

export interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  test: (d: AppData, lessonsDone: number) => boolean;
}

const knownWords = (d: AppData) => Object.values(d.srs).filter((c) => c.state === 2 && c.stability >= 7).length;

export const BADGES: Badge[] = [
  { id: 'first-step', title: 'Eerste stap', desc: 'Finish your first lesson part', icon: 'footprints', test: (d) => Object.keys(d.lessons).length > 0 },
  { id: 'unit-1', title: 'Kennismaken', desc: 'Finish unit 1', icon: 'handshake', test: (d) => d.checkpoints.includes(1) },
  { id: 'unit-2', title: 'Dagelijks leven', desc: 'Finish unit 2', icon: 'bike', test: (d) => d.checkpoints.includes(2) },
  { id: 'unit-3', title: 'In de buurt', desc: 'Finish unit 3', icon: 'house', test: (d) => d.checkpoints.includes(3) },
  { id: 'unit-4', title: 'Nederland', desc: 'Finish unit 4', icon: 'windmill', test: (d) => d.checkpoints.includes(4) },
  { id: 'unit-5', title: 'Werk & gezondheid', desc: 'Finish unit 5', icon: 'briefcase', test: (d) => d.checkpoints.includes(5) },
  { id: 'unit-6', title: 'Samenleving', desc: 'Finish unit 6', icon: 'landmark', test: (d) => d.checkpoints.includes(6) },
  { id: 'halfway', title: 'Op de helft', desc: 'Finish 21 lessons', icon: 'flag', test: (_d, n) => n >= 21 },
  { id: 'streak-7', title: 'Een hele week', desc: '7-day streak', icon: 'flame', test: (d) => d.streak.best >= 7 },
  { id: 'streak-30', title: 'Doorzetter', desc: '30-day streak', icon: 'flame', test: (d) => d.streak.best >= 30 },
  { id: 'words-100', title: '100 woorden', desc: '100 words known well', icon: 'book', test: (d) => knownWords(d) >= 100 },
  { id: 'words-500', title: '500 woorden', desc: '500 words known well', icon: 'book', test: (d) => knownWords(d) >= 500 },
  { id: 'words-1000', title: '1000 woorden', desc: '1000 words known well', icon: 'book', test: (d) => knownWords(d) >= 1000 },
  { id: 'weekend', title: 'Weekendkrijger', desc: 'Study an hour on a weekend day', icon: 'sun', test: (d) => Object.entries(d.days).some(([k, v]) => [0, 6].includes(parseKey(k).getDay()) && v.seconds >= 3600) },
  { id: 'mock-pass', title: 'Geslaagd!', desc: 'Pass a full mock exam', icon: 'medal', test: (d) => d.results.some((r) => r.kind === 'mock' && r.score / r.total >= 0.6) },
  { id: 'knm-all', title: 'Kenner', desc: 'Score 80%+ on every KNM theme', icon: 'landmark', test: (d) => new Set(d.results.filter((r) => r.kind === 'knm' && r.score / r.total >= 0.8).map((r) => r.ref)).size >= 8 },
];

export function newBadges(d: AppData, lessonsDone: number): Badge[] {
  return BADGES.filter((b) => !d.badges.includes(b.id) && b.test(d, lessonsDone));
}
