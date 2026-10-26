import type { Curriculum } from '@/engine/scheduler';
import type { Bonus, GrammarTopic, KnmTheme, Lesson, Unit, VocabItem } from './schema';
import { unit1 } from './lessons/unit1';
import { unit2 } from './lessons/unit2';
import { unit3 } from './lessons/unit3';
import { unit4 } from './lessons/unit4';
import { unit5 } from './lessons/unit5';
import { unit6 } from './lessons/unit6';
import { grammar1 } from './grammar/g1';
import { grammar2 } from './grammar/g2';
import { grammar3 } from './grammar/g3';
import { grammar4 } from './grammar/g4';
import { grammar5 } from './grammar/g5';
import { grammar6 } from './grammar/g6';
import { bonus1 } from './bonus/b1';
import { bonus2 } from './bonus/b2';
import { bonus3 } from './bonus/b3';
import { bonus4 } from './bonus/b4';
import { bonus5 } from './bonus/b5';
import { bonus6 } from './bonus/b6';
import { KNM } from './knm';
import { MOCKS } from './exam/mocks';
import { TUTOR_SCENARIOS } from './tutor';

export const UNITS: Unit[] = [
  { n: 1, title: 'Kennismaken', titleEn: 'Getting to know each other', blurb: 'Names, countries, days, the class, your day, shopping and how to learn.' },
  { n: 2, title: 'Dagelijks leven', titleEn: 'Daily life', blurb: 'Food, getting around, the seasons, housing, directions, weekends and family.' },
  { n: 3, title: 'In de buurt', titleEn: 'In the neighbourhood', blurb: 'Neighbours, school, housework, the GP, the bank, travel and a day out.' },
  { n: 4, title: 'Nederland', titleEn: 'The Netherlands', blurb: 'Population, relationships, the map, the police, celebrations and the Randstad.' },
  { n: 5, title: 'Werk & gezondheid', titleEn: 'Work & health', blurb: 'Free time, work, health, nature, official papers, history and children.' },
  { n: 6, title: 'Samenleving', titleEn: 'Society', blurb: 'Provinces, the municipality, climate, politics, change and your life here.' },
];

export const LESSONS: Lesson[] = [...unit1, ...unit2, ...unit3, ...unit4, ...unit5, ...unit6].sort((a, b) => a.n - b.n);
export const LESSON_COUNT = 42;

const byN = new Map(LESSONS.map((l) => [l.n, l]));
export function getLesson(n: number): Lesson | undefined {
  return byN.get(n);
}

/** Optional bonus rounds, one per lesson. */
export const BONUSES: Bonus[] = [...bonus1, ...bonus2, ...bonus3, ...bonus4, ...bonus5, ...bonus6].sort((a, b) => a.n - b.n);
const bonusByN = new Map(BONUSES.map((b) => [b.n, b]));
export function getBonus(n: number): Bonus | undefined {
  return bonusByN.get(n);
}

/** A bonus round shaped like a lesson, so the lesson steps (words, listening) can play it. */
const bonusLessons = new Map<number, Lesson>();
export function bonusAsLesson(b: Bonus): Lesson {
  let l = bonusLessons.get(b.n);
  if (!l) {
    const base = getLesson(b.n);
    l = {
      n: b.n,
      title: b.title,
      titleEn: b.titleEn,
      unit: unitOf(b.n),
      icon: base?.icon ?? 'sparkles',
      goals: [b.focus],
      kind: b.text.some((p) => p.who) ? 'mixed' : 'text',
      vocab: b.vocab,
      text: b.text,
      questions: [],
      speaking: [],
      grammar: [],
      listening: [],
    };
    bonusLessons.set(b.n, l);
  }
  return l;
}

export const GRAMMAR: GrammarTopic[] = [...grammar1, ...grammar2, ...grammar3, ...grammar4, ...grammar5, ...grammar6].sort((a, b) => a.lesson - b.lesson);
const grammarById = new Map(GRAMMAR.map((g) => [g.id, g]));
export function getGrammar(id: string): GrammarTopic | undefined {
  return grammarById.get(id);
}

export function unitOf(lesson: number): number {
  return Math.min(6, Math.ceil(lesson / 7));
}

export function lessonsOf(unit: number): number[] {
  return Array.from({ length: 7 }, (_, i) => (unit - 1) * 7 + i + 1);
}

export function knmFor(lesson: number): KnmTheme {
  return KNM.find((k) => k.lessons.includes(lesson)) ?? KNM[(lesson - 1) % KNM.length];
}

export const curriculum: Curriculum = {
  lessonCount: LESSON_COUNT,
  unitOf,
  lessonsOf,
  knmFor: (n) => knmFor(n).id,
  tutorFor: (unit) => TUTOR_SCENARIOS.filter((s) => s.unit <= unit).slice(-1)[0]?.id ?? TUTOR_SCENARIOS[0].id,
  mockCount: MOCKS.length,
  hasBonus: (n) => bonusByN.has(n),
};

/** Accepted spellings for a vocab item, e.g. "jij / je" → ["jij", "je"]; nouns with their article. */
export function acceptedForms(v: VocabItem): string[] {
  const base = v.nl
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .split(' / ')
    .map((s) => s.trim())
    .filter(Boolean);
  return v.art ? base.map((b) => `${v.art} ${b}`) : base;
}

/** Find a vocab item by card id: "v:<lesson>:<nl>" for lesson words, "v:b<lesson>:<nl>" for bonus words. */
export function vocabByCardId(id: string): { lesson: Lesson; item: VocabItem } | undefined {
  const m = id.match(/^v:(b?)(\d+):(.+)$/);
  if (!m) return undefined;
  const b = m[1] ? getBonus(Number(m[2])) : undefined;
  const l = m[1] ? b && bonusAsLesson(b) : getLesson(Number(m[2]));
  const item = l?.vocab.find((v) => v.nl === m[3]);
  return l && item ? { lesson: l, item } : undefined;
}

/** Lookup of every taught word (lower-case, first form) for tap-to-translate in texts. */
let glossary: Map<string, VocabItem> | null = null;
export function lookupWord(word: string): VocabItem | undefined {
  if (!glossary) {
    glossary = new Map();
    for (const l of LESSONS)
      for (const v of l.vocab) {
        for (const f of acceptedForms({ ...v, art: undefined })) {
          const key = f.toLowerCase();
          if (!glossary.has(key)) glossary.set(key, v);
        }
        if (v.pl) glossary.set(v.pl.toLowerCase(), v);
      }
    // Bonus words fill gaps only: a lesson's own entry wins.
    for (const b of BONUSES)
      for (const v of b.vocab) {
        for (const f of acceptedForms({ ...v, art: undefined })) {
          const key = f.toLowerCase();
          if (!glossary.has(key)) glossary.set(key, v);
        }
        if (v.pl && !glossary.has(v.pl.toLowerCase())) glossary.set(v.pl.toLowerCase(), v);
      }
  }
  return glossary.get(word.toLowerCase().replace(/[’]/g, "'"));
}

const lessonByVocab = new Map<VocabItem, number>(LESSONS.flatMap((l) => l.vocab.map((v) => [v, l.n] as const)));
const bonusByVocab = new Map<VocabItem, number>(BONUSES.flatMap((b) => b.vocab.map((v) => [v, b.n] as const)));
/** The lesson that teaches a vocab item (for bonus words: the lesson the bonus belongs to). */
export function lessonOfVocab(v: VocabItem): number | undefined {
  return lessonByVocab.get(v) ?? bonusByVocab.get(v);
}

/** The SRS / flashcard id of a vocab item, namespaced for bonus words. */
export function cardIdOf(v: VocabItem): string | undefined {
  const n = lessonByVocab.get(v);
  if (n) return `v:${n}:${v.nl}`;
  const b = bonusByVocab.get(v);
  return b ? `v:b${b}:${v.nl}` : undefined;
}

/** A sentence that uses the word: its own example, or a line from the lesson text. */
export function exampleFor(lesson: number, v: VocabItem): [string, string] | undefined {
  if (v.ex) return v.ex;
  const text = bonusByVocab.has(v) ? getBonus(lesson)?.text : getLesson(lesson)?.text;
  if (!text) return undefined;
  const forms = [...acceptedForms({ ...v, art: undefined }), v.pl].filter((f): f is string => !!f && f.length > 1).map((f) => f.toLowerCase());
  const hit = text.find((p) => {
    const words = p.nl.toLowerCase().replace(/[.,!?;:"“”()]/g, ' ').split(/\s+/);
    return forms.some((f) => (f.includes(' ') ? p.nl.toLowerCase().includes(f) : words.includes(f)));
  });
  return hit ? [hit.nl, hit.en] : undefined;
}
