import { describe, expect, it } from 'vitest';
import { buildFlashQueue } from './FlashSession';
import { useStore } from '@/store/store';
import { emptyData } from '@/store/defaults';
import { buildSession, WEEKDAY_MINUTES } from '@/engine/scheduler';
import { curriculum } from '@/content';
import { Rating } from '@/engine/srs';

const MON = new Date(2026, 9, 26);

describe('flashcards', () => {
  it('marking creates two cards and unmarking removes them', () => {
    const s = useStore.getState();
    s.reset();
    expect(s.toggleMark('v:1:hallo', 1)).toBe(true);
    let st = useStore.getState();
    expect(Object.keys(st.flash).sort()).toEqual(['v:1:hallo|en', 'v:1:hallo|nl']);
    st.setMarkNote('v:1:hallo', '  hello sounds like hallo ');
    expect(useStore.getState().marked['v:1:hallo'].note).toBe('hello sounds like hallo');
    expect(useStore.getState().toggleMark('v:1:hallo', 1)).toBe(false);
    st = useStore.getState();
    expect(st.flash).toEqual({});
    expect(st.marked).toEqual({});
  });

  it('shows only one direction of a word per round', () => {
    const s = useStore.getState();
    s.reset();
    s.toggleMark('v:1:hallo', 1);
    s.toggleMark('v:1:naam', 1);
    const q = buildFlashQueue(useStore.getState().flash, 50, Date.now() + 1000);
    expect(q.map((i) => i.vocabId).sort()).toEqual(['v:1:hallo', 'v:1:naam']);
  });

  it('schedules a hard card that was forgotten again soon', () => {
    const s = useStore.getState();
    s.reset();
    s.toggleMark('v:1:komen', 1);
    s.reviewFlash('v:1:komen|nl', Rating.Again);
    const c = useStore.getState().flash['v:1:komen|nl'];
    expect(c.due - Date.now()).toBeLessThan(30 * 60_000);
  });

  it('adds a flashcard round to the daily plan, still within 30 minutes', () => {
    const d = emptyData();
    for (let i = 0; i < 60; i++) d.flash[`v:1:w${i}|nl`] = { id: `v:1:w${i}|nl`, lesson: 1, due: 0, stability: 0, difficulty: 0, elapsed_days: 0, scheduled_days: 0, reps: 0, lapses: 0, state: 0 };
    const plan = buildSession(d, curriculum, MON);
    expect(plan.activities.some((a) => a.kind === 'flash')).toBe(true);
    expect(plan.minutes).toBeLessThanOrEqual(WEEKDAY_MINUTES);
  });
});
