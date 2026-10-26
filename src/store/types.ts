export type StepId = 'words' | 'listen' | 'shadow' | 'dictation' | 'cloze' | 'grammar' | 'questions';

export const PART1: StepId[] = ['words', 'listen'];
export const PART2: StepId[] = ['shadow', 'dictation', 'cloze', 'grammar', 'questions'];
export const ALL_STEPS: StepId[] = [...PART1, ...PART2];

export type Skill = 'woorden' | 'grammatica' | 'lezen' | 'luisteren' | 'schrijven' | 'spreken' | 'knm';

export interface LessonProgress {
  steps: StepId[];
  completedAt?: string;
}

/** FSRS card serialised with timestamps so it survives JSON export. */
export interface SrsCard {
  id: string;
  lesson: number;
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  last_review?: number;
}

export interface MarkedWord {
  lesson: number;
  addedAt: number;
  /** The learner's own memory hook (mnemonic). */
  note?: string;
}

export type DrillId = 'dehet' | 'verbs' | 'numbers' | 'clock' | 'spelling' | 'perfect';

export type Activity =
  | { kind: 'srs'; minutes: number; limit: number }
  | { kind: 'flash'; minutes: number; limit: number }
  | { kind: 'lesson'; lesson: number; steps: StepId[]; minutes: number }
  | { kind: 'drill'; drill: DrillId; minutes: number }
  | { kind: 'quiz'; lessons: number[]; minutes: number }
  | { kind: 'reading'; unit: number; count: number; minutes: number }
  | { kind: 'listening'; unit: number; count: number; minutes: number }
  | { kind: 'knm'; theme: string; minutes: number }
  | { kind: 'writing'; unit: number; count: number; minutes: number }
  | { kind: 'speaking'; unit: number; count: number; minutes: number }
  | { kind: 'tutor'; scenario: string; minutes: number }
  | { kind: 'checkpoint'; unit: number; minutes: number }
  | { kind: 'mock'; mock: number; part: 'A' | 'B'; minutes: number };

export type DayType = 'weekday' | 'friday' | 'saturday' | 'sunday';

export interface SessionPlan {
  /** Scheduler version that built the plan; plans from older versions are rebuilt. */
  v?: number;
  date: string;
  dayType: DayType;
  title: string;
  subtitle: string;
  activities: Activity[];
  minutes: number;
}

export interface DayLog {
  seconds: number;
  xp: number;
  done: string[];
  plan?: SessionPlan;
  /** Extra sessions started after finishing the planned one. */
  bonus?: number;
}

export interface ExamResult {
  date: string;
  kind: 'mock' | 'checkpoint' | 'quiz' | 'knm';
  ref: string;
  score: number;
  total: number;
  bySkill?: Partial<Record<Skill, [number, number]>>;
}

export interface Settings {
  theme: 'system' | 'light' | 'dark';
  style: 'claude' | 'intellij' | 'delft';
  voiceURI?: string;
  voiceURI2?: string;
  /** Which speech engine reads Dutch aloud. */
  ttsEngine?: 'device' | 'piper' | 'google';
  piperVoice?: string;
  googleTtsKey?: string;
  googleVoice?: string;
  googleVoice2?: string;
  rate: number;
  weekendMinutes: 60 | 90 | 120;
  apiKey?: string;
  model: string;
  sound: boolean;
  startDate?: string;
  name?: string;
}

export interface AppData {
  version: 1;
  lessons: Record<number, LessonProgress>;
  checkpoints: number[];
  srs: Record<string, SrsCard>;
  /** Words the learner marked as hard, keyed by vocab card id ("v:<lesson>:<word>"). */
  marked: Record<string, MarkedWord>;
  /** Flashcards for marked words: two per word, "<vocabId>|nl" (Dutch → English) and "<vocabId>|en". */
  flash: Record<string, SrsCard>;
  days: Record<string, DayLog>;
  xp: number;
  streak: { count: number; best: number; last?: string; freezes: number; freezeWeek?: string };
  skills: Record<Skill, [number, number]>;
  results: ExamResult[];
  badges: string[];
  /** Ids of reading/listening/writing/speaking items already practised, to rotate fresh material. */
  seen: string[];
  settings: Settings;
}
