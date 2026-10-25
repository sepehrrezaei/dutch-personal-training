import { describe, expect, it } from 'vitest';
import { cefrOf, levelOf, liveStreak, touchStreak } from './xp';

const empty = { count: 0, best: 0, freezes: 1 };

describe('streak', () => {
  it('counts consecutive days', () => {
    let s = touchStreak(empty, new Date(2026, 9, 26));
    s = touchStreak(s, new Date(2026, 9, 27));
    s = touchStreak(s, new Date(2026, 9, 27));
    expect(s.count).toBe(2);
  });
  it('uses a freeze for one missed day', () => {
    let s = touchStreak(empty, new Date(2026, 9, 26));
    s = touchStreak(s, new Date(2026, 9, 28));
    expect(s.count).toBe(2);
    expect(s.freezes).toBe(0);
  });
  it('resets after a longer gap', () => {
    let s = touchStreak(empty, new Date(2026, 9, 26));
    s = touchStreak(s, new Date(2026, 9, 30));
    expect(s.count).toBe(1);
    expect(s.best).toBe(1);
  });
  it('shows 0 once the streak is broken', () => {
    const s = touchStreak(empty, new Date(2026, 9, 26));
    expect(liveStreak(s, new Date(2026, 9, 27))).toBe(1);
    expect(liveStreak(s, new Date(2026, 9, 30))).toBe(0);
  });
});

describe('levels', () => {
  it('grows the XP needed per level', () => {
    expect(levelOf(0).level).toBe(1);
    expect(levelOf(60).level).toBe(2);
    expect(levelOf(179).level).toBe(2);
    expect(levelOf(180).level).toBe(3);
  });
  it('estimates CEFR from lessons', () => {
    expect(cefrOf(0, false).label).toBe('A0');
    expect(cefrOf(12, false).label).toBe('A1');
    expect(cefrOf(42, true).label).toBe('A2');
  });
});
