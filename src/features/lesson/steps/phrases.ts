import type { Lesson, Phrase } from '@/content/schema';

/** Pick up to `max` phrases of a manageable length, spread across the text. */
export function practicePhrases(lesson: Lesson, max: number, maxWords = 14): Phrase[] {
  const ok = lesson.text.filter((p) => {
    const n = p.nl.split(/\s+/).length;
    return n >= 3 && n <= maxWords && !p.nl.includes('—');
  });
  const pool = ok.length >= max ? ok : lesson.text;
  if (pool.length <= max) return pool;
  const step = pool.length / max;
  return Array.from({ length: max }, (_, i) => pool[Math.floor(i * step)]);
}
