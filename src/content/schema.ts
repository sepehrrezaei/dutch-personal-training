export type Article = 'de' | 'het';
export type PartOfSpeech = 'n' | 'v' | 'adj' | 'adv' | 'prep' | 'pron' | 'conj' | 'num' | 'phrase' | 'int';

/** One word or fixed expression taught in a lesson. `nl` is the dictionary form without article. */
export interface VocabItem {
  nl: string;
  en: string;
  art?: Article;
  pl?: string;
  pos?: PartOfSpeech;
  /** Example sentence in Dutch, with its translation. */
  ex?: [string, string];
}

/** A line of the lesson text. `who` names the speaker in a dialogue; omitted for narration. */
export interface Phrase {
  nl: string;
  en: string;
  who?: string;
}

export interface MCQ {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
}

export type Exercise =
  | { type: 'mc'; prompt: string; options: string[]; answer: number; explain?: string }
  /** `prompt` contains "___" where the answer goes. Several accepted answers allowed. */
  | { type: 'fill'; prompt: string; answer: string | string[]; hint?: string; explain?: string; en?: string }
  /** Words given shuffled; learner rebuilds the sentence in `words` order. */
  | { type: 'order'; words: string[]; en: string; alt?: string[][] }
  /** Rewrite `prompt` following `instruction`. */
  | { type: 'transform'; prompt: string; instruction: string; answer: string | string[]; explain?: string };

export interface GrammarTopic {
  id: string;
  title: string;
  titleEn: string;
  /** Lesson where the topic is introduced. */
  lesson: number;
  summary: string;
  points: { text: string; examples: [string, string][] }[];
  table?: { head: string[]; rows: string[][] };
  exercises: Exercise[];
}

export interface Question {
  q: string;
  /** A short model answer the learner can compare with. */
  model: string;
}

export interface Lesson {
  n: number;
  title: string;
  titleEn: string;
  unit: number;
  /** Key of an icon in design/icons. */
  icon: string;
  goals: string[];
  kind: 'dialogue' | 'text' | 'email' | 'mixed';
  vocab: VocabItem[];
  text: Phrase[];
  questions: Question[];
  speaking: string[];
  grammar: string[];
  listening: MCQ[];
  /** "Kijk goed": a short pattern to notice, shown with the text. */
  notice?: { title: string; lines: [string, string][] };
  culture?: string;
}

export interface Unit {
  n: number;
  title: string;
  titleEn: string;
  blurb: string;
}

export interface KnmTheme {
  id: string;
  title: string;
  titleEn: string;
  lessons: number[];
  intro: string;
  facts: [string, string][];
  questions: MCQ[];
}

export interface ReadingItem {
  id: string;
  unit: number;
  title: string;
  /** Kind of real-life text: letter, ad, notice, email, form, schedule. */
  genre: string;
  body: string;
  questions: MCQ[];
}

export interface ListeningItem {
  id: string;
  unit: number;
  title: string;
  situation: string;
  lines: Phrase[];
  questions: MCQ[];
}

export interface WritingTask {
  id: string;
  unit: number;
  kind: 'form' | 'message' | 'email';
  title: string;
  situation: string;
  /** Points the answer must cover; used for the self-check list and AI rubric. */
  mustInclude: string[];
  fields?: { label: string; answerHint: string }[];
  model: string;
  minWords?: number;
}

export interface SpeakingTask {
  id: string;
  unit: number;
  kind: 'short' | 'long';
  situation: string;
  prompt: string;
  model: string;
  keywords: string[];
}
