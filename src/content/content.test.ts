import { describe, expect, it } from 'vitest';
import { GRAMMAR, LESSON_COUNT, LESSONS, getGrammar, curriculum } from './index';
import { KNM } from './knm';
import { LISTENING, READING, SPEAKING, WRITING } from './exam';
import { MOCKS } from './exam/mocks';
import { TUTOR_SCENARIOS } from './tutor';
import { buildGaps } from '@/features/lesson/steps/ClozeStep';
import { normalize } from '@/engine/checker';

describe('lessons', () => {
  it('has all 42 lessons, numbered 1..42, in the right units', () => {
    expect(LESSONS.map((l) => l.n)).toEqual(Array.from({ length: LESSON_COUNT }, (_, i) => i + 1));
    for (const l of LESSONS) expect(l.unit).toBe(curriculum.unitOf(l.n));
  });

  it.each(LESSONS.map((l) => [l.n, l] as const))('lesson %i is complete', (_n, l) => {
    expect(l.title).toBeTruthy();
    expect(l.goals.length).toBeGreaterThanOrEqual(2);
    expect(l.vocab.length).toBeGreaterThanOrEqual(25);
    expect(l.text.length).toBeGreaterThanOrEqual(10);
    expect(l.questions.length).toBeGreaterThanOrEqual(4);
    expect(l.speaking.length).toBeGreaterThanOrEqual(2);
    expect(l.listening.length).toBeGreaterThanOrEqual(3);
    expect(l.grammar.length).toBeGreaterThanOrEqual(1);
    for (const g of l.grammar) expect(getGrammar(g), `grammar ${g}`).toBeDefined();
    for (const q of l.listening) expect(q.options[q.answer]).toBeDefined();
  });

  it.each(LESSONS.map((l) => [l.n, l] as const))('lesson %i has no duplicate words', (_n, l) => {
    const words = l.vocab.map((v) => `${v.art ?? ''} ${v.nl}`);
    expect(new Set(words).size).toBe(words.length);
  });

  it.each(LESSONS.map((l) => [l.n, l] as const))('lesson %i yields a usable gap-fill text', (_n, l) => {
    const gaps = buildGaps(l);
    expect(gaps.length).toBeGreaterThanOrEqual(5);
    for (const g of gaps) expect(l.text[g.line].nl).toContain(g.answer);
  });
});

describe('grammar', () => {
  it('has unique topic ids, each used by a lesson', () => {
    const ids = GRAMMAR.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    const used = new Set(LESSONS.flatMap((l) => l.grammar));
    for (const id of ids) expect(used.has(id), id).toBe(true);
  });

  it.each(GRAMMAR.map((g) => [g.id, g] as const))('topic %s has valid exercises', (_id, g) => {
    expect(g.exercises.length).toBeGreaterThanOrEqual(7);
    for (const ex of g.exercises) {
      if (ex.type === 'mc') expect(ex.options[ex.answer]).toBeDefined();
      if (ex.type === 'fill') expect(ex.prompt).toContain('___');
      if (ex.type === 'order') expect(ex.words.length).toBeGreaterThan(1);
    }
  });
});

describe('KNM', () => {
  it('covers the 8 exam themes with enough questions', () => {
    expect(KNM.length).toBe(8);
    for (const k of KNM) {
      expect(k.facts.length).toBeGreaterThanOrEqual(6);
      expect(k.questions.length).toBeGreaterThanOrEqual(15);
    }
  });
  it('has no duplicate questions', () => {
    const qs = KNM.flatMap((k) => k.questions.map((q) => normalize(q.q)));
    expect(new Set(qs).size).toBe(qs.length);
  });
});

describe('exam bank', () => {
  const all = [...READING, ...LISTENING, ...WRITING, ...SPEAKING];
  it('has unique ids', () => {
    const ids = all.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('has practice material for every unit', () => {
    for (let u = 1; u <= 6; u++) {
      expect(READING.filter((x) => x.unit === u).length, `reading unit ${u}`).toBeGreaterThanOrEqual(4);
      expect(LISTENING.filter((x) => x.unit === u).length, `listening unit ${u}`).toBeGreaterThanOrEqual(4);
      expect(WRITING.filter((x) => x.unit === u).length, `writing unit ${u}`).toBeGreaterThanOrEqual(3);
      expect(SPEAKING.filter((x) => x.unit === u).length, `speaking unit ${u}`).toBeGreaterThanOrEqual(5);
    }
  });
  it('mock exams reference existing items', () => {
    const ids = new Set(all.map((x) => x.id));
    for (const m of MOCKS) for (const id of [...m.reading, ...m.listening, ...m.writing, ...m.speaking]) expect(ids.has(id), id).toBe(true);
  });
  it('writing forms have fields', () => {
    for (const w of WRITING) if (w.kind === 'form') expect(w.fields?.length).toBeGreaterThan(2);
  });
  it('tutor scenarios exist for every unit', () => {
    for (let u = 1; u <= 6; u++) expect(TUTOR_SCENARIOS.some((s) => s.unit === u)).toBe(true);
  });
});
