import type { Article, Lesson, MCQ, Phrase, Question, VocabItem } from './schema';

/* Compact authoring helpers so lesson files read like word lists and scripts. */

/** [nl, en, plural?] — nouns are written with their article: "de naam", "het huis". */
export type V = [string, string, string?];

export function vocab(items: V[]): VocabItem[] {
  return items.map(([raw, en, pl]) => {
    const m = raw.match(/^(de|het) (.+)$/);
    if (m) return { nl: m[2], en, art: m[1] as Article, pl: pl || undefined, pos: 'n' };
    return { nl: raw, en };
  });
}

/** [speaker, nl, en] — use '' as speaker for narration. */
export function script(lines: [string, string, string][]): Phrase[] {
  return lines.map(([who, nl, en]) => (who ? { who, nl, en } : { nl, en }));
}

/** [question, model answer] */
export function qa(items: [string, string][]): Question[] {
  return items.map(([q, model]) => ({ q, model }));
}

/** Multiple choice: the first option is the correct one; options are shuffled at display time. */
export function mc(q: string, right: string, ...wrong: string[]): MCQ {
  return { q, options: [right, ...wrong], answer: 0 };
}

export function lesson(l: Omit<Lesson, 'vocab' | 'text' | 'questions'> & { vocab: V[]; text: [string, string, string][]; questions: [string, string][] }): Lesson {
  return { ...l, vocab: vocab(l.vocab), text: script(l.text), questions: qa(l.questions) };
}

/** Display form of a vocab item including its article. */
export function withArticle(v: VocabItem): string {
  return v.art ? `${v.art} ${v.nl}` : v.nl;
}
