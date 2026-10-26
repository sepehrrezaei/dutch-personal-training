import { describe, expect, it } from 'vitest';
import { activityKey, buildBonus, buildSession, dateKey, lessonsBehind, nextExtra, nextPart, WEEKDAY_MINUTES, type Curriculum } from './scheduler';
import { emptyData } from '@/store/defaults';
import { ALL_STEPS, PART1, type AppData } from '@/store/types';
import { newCard } from './srs';

const cur: Curriculum = {
  lessonCount: 42,
  unitOf: (n) => Math.ceil(n / 7),
  lessonsOf: (u) => Array.from({ length: 7 }, (_, i) => (u - 1) * 7 + i + 1),
  knmFor: () => 'wonen',
  tutorFor: () => 'bakker',
  mockCount: 3,
};

// 2026-10-26 is a Monday.
const MON = new Date(2026, 9, 26);
const FRI = new Date(2026, 9, 30);
const SAT = new Date(2026, 9, 31);
const SUN = new Date(2026, 10, 1);

function withLessons(n: number, data = emptyData()): AppData {
  for (let i = 1; i <= n; i++) data.lessons[i] = { steps: [...ALL_STEPS] };
  return data;
}

function withDueCards(n: number, data: AppData): AppData {
  for (let i = 0; i < n; i++) data.srs[`v:1:w${i}`] = { ...newCard(`v:1:w${i}`, 1), due: 0 };
  return data;
}

describe('nextPart', () => {
  it('starts with part 1 of lesson 1', () => {
    expect(nextPart(emptyData(), cur)).toEqual({ lesson: 1, steps: PART1 });
  });
  it('moves to part 2 once part 1 is done', () => {
    const d = emptyData();
    d.lessons[1] = { steps: [...PART1] };
    expect(nextPart(d, cur)?.steps).toContain('grammar');
  });
  it('returns null when the course is finished', () => {
    expect(nextPart(withLessons(42), cur)).toBeNull();
  });
});

describe('buildSession', () => {
  it('keeps weekday sessions within 30 minutes even with many due cards', () => {
    for (let lessons = 0; lessons <= 42; lessons += 7) {
      const plan = buildSession(withDueCards(300, withLessons(lessons)), cur, MON);
      expect(plan.minutes).toBeLessThanOrEqual(WEEKDAY_MINUTES);
    }
  });
  it('puts the next lesson part in a weekday session', () => {
    const plan = buildSession(withLessons(3), cur, MON);
    expect(plan.activities.find((a) => a.kind === 'lesson')).toMatchObject({ lesson: 4 });
  });
  it('makes Friday a review day once something has been learned', () => {
    const plan = buildSession(withDueCards(20, withLessons(4)), cur, FRI);
    expect(plan.activities.some((a) => a.kind === 'quiz')).toBe(true);
    expect(plan.activities.some((a) => a.kind === 'lesson')).toBe(false);
  });
  it('still teaches a lesson on a first-day Friday', () => {
    const plan = buildSession(emptyData(), cur, FRI);
    expect(plan.activities.some((a) => a.kind === 'lesson')).toBe(true);
  });
  it.each([60, 90, 120] as const)('fills a %i-minute weekend without going over', (minutes) => {
    const d = withDueCards(40, withLessons(9));
    d.settings.weekendMinutes = minutes;
    for (const day of [SAT, SUN]) {
      const plan = buildSession(d, cur, day);
      expect(plan.minutes).toBeLessThanOrEqual(minutes);
      expect(plan.minutes).toBeGreaterThanOrEqual(minutes - 15);
    }
  });
  it('adds exam-skill practice on Saturday and production on Sunday', () => {
    const d = withLessons(5);
    expect(buildSession(d, cur, SAT).activities.map((a) => a.kind)).toEqual(expect.arrayContaining(['reading', 'listening', 'knm']));
    expect(buildSession(d, cur, SUN).activities.map((a) => a.kind)).toEqual(expect.arrayContaining(['writing', 'speaking']));
  });
  it('offers the AI tutor only with an API key', () => {
    const d = withLessons(5);
    expect(buildSession(d, cur, SUN).activities.some((a) => a.kind === 'tutor')).toBe(false);
    d.settings.apiKey = 'sk-test';
    expect(buildSession(d, cur, SUN).activities.some((a) => a.kind === 'tutor')).toBe(true);
  });
  it('schedules a unit checkpoint once a unit is finished', () => {
    const plan = buildSession(withLessons(7), cur, SAT);
    expect(plan.activities).toContainEqual(expect.objectContaining({ kind: 'checkpoint', unit: 1 }));
  });
  it('adds a catch-up lesson on the weekend when behind pace', () => {
    const d = withLessons(2);
    d.settings.startDate = dateKey(new Date(2026, 8, 1));
    expect(lessonsBehind(d, cur, SUN)).toBeGreaterThan(0);
    d.settings.weekendMinutes = 120;
    expect(buildSession(d, cur, SUN).activities.some((a) => a.kind === 'lesson')).toBe(true);
  });
  it('teaches lessons first on the very first weekend', () => {
    const plan = buildSession(emptyData(), cur, SUN);
    expect(plan.activities[0]).toMatchObject({ kind: 'lesson', lesson: 1 });
    expect(plan.activities.some((a) => a.kind === 'writing')).toBe(false);
  });
  it('does not let one exam skill swallow the weekend', () => {
    const d = withLessons(3);
    d.settings.weekendMinutes = 120;
    for (const day of [SAT, SUN]) {
      for (const a of buildSession(d, cur, day).activities) if ('count' in a) expect(a.count).toBeLessThanOrEqual(5);
    }
  });
  it('switches to mock exams after the last lesson', () => {
    const d = withLessons(42);
    expect(buildSession(d, cur, SAT).activities).toContainEqual(expect.objectContaining({ kind: 'mock', part: 'A' }));
    expect(buildSession(d, cur, SUN).activities).toContainEqual(expect.objectContaining({ kind: 'mock', part: 'B' }));
  });
  it('gives every activity in a plan a distinct key', () => {
    const d = withDueCards(10, withLessons(9));
    for (const day of [MON, FRI, SAT, SUN]) {
      const keys = buildSession(d, cur, day).activities.map(activityKey);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});

describe('bonus rounds (extra)', () => {
  const withBonus: Curriculum = { ...cur, hasBonus: () => true };

  it('suggests the most recently finished lesson whose bonus is open', () => {
    const d = withLessons(5);
    expect(nextExtra(d, withBonus)).toBe(5);
    d.bonusDone = [5, 4];
    expect(nextExtra(d, withBonus)).toBe(3);
    expect(nextExtra(withLessons(0), withBonus)).toBeUndefined();
    expect(nextExtra(d, cur)).toBeUndefined();
  });
  it('never puts a bonus round in a weekday or Friday session', () => {
    for (const day of [MON, FRI]) expect(buildSession(withLessons(6), withBonus, day).activities.some((a) => a.kind === 'extra')).toBe(false);
  });
  it('fills spare weekend time with a bonus round, within the weekend target', () => {
    const d = withLessons(6);
    d.settings.weekendMinutes = 120;
    for (const day of [SAT, SUN]) {
      const plan = buildSession(d, withBonus, day);
      expect(plan.activities.some((a) => a.kind === 'extra')).toBe(true);
      expect(plan.minutes).toBeLessThanOrEqual(120);
    }
  });
  it('offers an open bonus round in the bonus session', () => {
    const plan = buildBonus(withLessons(3), withBonus, MON);
    expect(plan.activities.find((a) => a.kind === 'extra')).toMatchObject({ lesson: 3 });
    expect(activityKey({ kind: 'extra', lesson: 3, minutes: 15 })).toBe('extra:3');
  });
});
