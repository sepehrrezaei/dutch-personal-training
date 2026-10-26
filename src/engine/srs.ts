import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type Grade } from 'ts-fsrs';
import type { SrsCard } from '@/store/types';

export { Rating };

const scheduler = fsrs(generatorParameters({ request_retention: 0.9, enable_fuzz: true, maximum_interval: 180 }));
/** Marked (hard) words aim for higher retention, so they come back sooner and more often. */
const flashScheduler = fsrs(generatorParameters({ request_retention: 0.95, enable_fuzz: true, maximum_interval: 120 }));

function toCard(c: SrsCard): Card {
  return {
    due: new Date(c.due),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state as State,
    last_review: c.last_review ? new Date(c.last_review) : undefined,
  } as Card;
}

function fromCard(id: string, lesson: number, c: Card): SrsCard {
  return {
    id,
    lesson,
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    last_review: c.last_review?.getTime(),
  };
}

export function newCard(id: string, lesson: number, now = new Date()): SrsCard {
  return fromCard(id, lesson, createEmptyCard(now));
}

export function review(card: SrsCard, rating: Grade, now = new Date(), flash = false): SrsCard {
  const next = (flash ? flashScheduler : scheduler).next(toCard(card), now, rating);
  return fromCard(card.id, card.lesson, next.card);
}

/** When each rating would bring a flashcard back, e.g. { 1: "10m", 3: "2d" }. */
export function previewIntervals(card: SrsCard, now = new Date()): Record<Grade, string> {
  const out = {} as Record<Grade, string>;
  for (const g of [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy] as Grade[]) {
    const due = flashScheduler.next(toCard(card), now, g).card.due.getTime();
    out[g] = formatInterval(due - now.getTime());
  }
  return out;
}

export function formatInterval(ms: number): string {
  const min = Math.max(1, Math.round(ms / 60000));
  if (min < 60) return `${min}m`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d < 31) return `${d}d`;
  return `${Math.round(d / 30)}mo`;
}

/** Words forgotten again and again ("leeches") deserve a mnemonic or extra flashcard practice. */
export function isLeech(card: SrsCard): boolean {
  return card.lapses >= 3;
}

/** Cards due by `now`, most overdue first, capped at `limit`. */
export function dueCards(cards: Record<string, SrsCard>, now = Date.now(), limit = Infinity): SrsCard[] {
  return Object.values(cards)
    .filter((c) => c.due <= now)
    .sort((a, b) => a.due - b.due)
    .slice(0, limit);
}

export function dueCount(cards: Record<string, SrsCard>, now = Date.now()): number {
  let n = 0;
  for (const c of Object.values(cards)) if (c.due <= now) n++;
  return n;
}

/**
 * How a card should be practised. New and shaky cards are recognised (Dutch → English),
 * settled cards are produced (English → Dutch, typed), and some mature cards are heard.
 */
export type ReviewMode = 'recognize' | 'produce' | 'listen';

export function modeFor(card: SrsCard, seed = Math.random()): ReviewMode {
  if (card.state === State.New || card.state === State.Learning || card.state === State.Relearning) {
    return card.reps < 2 ? 'recognize' : seed < 0.5 ? 'recognize' : 'produce';
  }
  if (card.stability < 4) return seed < 0.6 ? 'produce' : 'recognize';
  return seed < 0.65 ? 'produce' : 'listen';
}

/** Cards whose stability is high enough to count as "known" words. */
export function isKnown(card: SrsCard): boolean {
  return card.state === State.Review && card.stability >= 7;
}

export function vocabCardId(lesson: number, nl: string): string {
  return `v:${lesson}:${nl}`;
}
