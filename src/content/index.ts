import type { Curriculum } from '@/engine/scheduler';
import type { GrammarTopic, KnmTheme, Lesson, Unit, VocabItem } from './schema';
import { unit1 } from './lessons/unit1';
import { grammar1 } from './grammar/g1';
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

export const LESSONS: Lesson[] = [...unit1].sort((a, b) => a.n - b.n);
export const LESSON_COUNT = 42;

const byN = new Map(LESSONS.map((l) => [l.n, l]));
export function getLesson(n: number): Lesson | undefined {
  return byN.get(n);
}

export const GRAMMAR: GrammarTopic[] = [...grammar1];
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

/** Find a vocab item by card id "v:<lesson>:<nl>". */
export function vocabByCardId(id: string): { lesson: Lesson; item: VocabItem } | undefined {
  const m = id.match(/^v:(\d+):(.+)$/);
  if (!m) return undefined;
  const l = getLesson(Number(m[1]));
  const item = l?.vocab.find((v) => v.nl === m[2]);
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
  }
  return glossary.get(word.toLowerCase().replace(/[’]/g, "'"));
}
