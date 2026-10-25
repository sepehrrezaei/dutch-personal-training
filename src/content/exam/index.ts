import type { ListeningItem, ReadingItem, SpeakingTask, WritingTask } from '../schema';
import { READING } from './reading';
import { LISTENING } from './listening';
import { WRITING } from './writing';
import { SPEAKING } from './speaking';

export { READING, LISTENING, WRITING, SPEAKING };

/**
 * Choose `count` items for practice: material from units up to `unit`, unseen items first,
 * preferring the current unit.
 */
export function pickItems<T extends { id: string; unit: number }>(all: T[], unit: number, count: number, seen: string[]): T[] {
  const pool = all.filter((x) => x.unit <= unit);
  const rank = (x: T) => (seen.includes(x.id) ? 100 : 0) + (unit - x.unit) + Math.random();
  return [...(pool.length ? pool : all)].sort((a, b) => rank(a) - rank(b)).slice(0, count);
}

export const findReading = (id: string): ReadingItem | undefined => READING.find((x) => x.id === id);
export const findListening = (id: string): ListeningItem | undefined => LISTENING.find((x) => x.id === id);
export const findWriting = (id: string): WritingTask | undefined => WRITING.find((x) => x.id === id);
export const findSpeaking = (id: string): SpeakingTask | undefined => SPEAKING.find((x) => x.id === id);
