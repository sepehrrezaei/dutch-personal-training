import { describe, expect, it } from 'vitest';
import { dueCards, newCard, Rating, review } from './srs';

describe('srs', () => {
  it('pushes a well-known card further out than a forgotten one', () => {
    const now = new Date(2026, 9, 26, 12);
    const c = newCard('v:1:hallo', 1, now);
    const good = review(c, Rating.Good, now);
    const again = review(c, Rating.Again, now);
    expect(good.due).toBeGreaterThan(again.due);
    expect(good.reps).toBe(1);
  });
  it('round-trips through JSON', () => {
    const c = review(newCard('x', 1), Rating.Easy);
    expect(JSON.parse(JSON.stringify(c))).toEqual(c);
  });
  it('orders due cards by most overdue and respects the limit', () => {
    const a = { ...newCard('a', 1), due: 3 };
    const b = { ...newCard('b', 1), due: 1 };
    const c = { ...newCard('c', 1), due: Date.now() + 1e9 };
    expect(dueCards({ a, b, c }, Date.now(), 1).map((x) => x.id)).toEqual(['b']);
  });
});
