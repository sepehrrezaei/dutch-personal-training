import { getGrammar, getLesson } from '@/content';
import { withArticle } from '@/content/dsl';
import type { Exercise, Lesson } from '@/content/schema';
import { shuffle } from '@/design/ui';
import { practicePhrases } from '../lesson/steps/phrases';

export type QuizItem = { kind: 'ex'; ex: Exercise; skill: 'woorden' | 'grammatica' | 'luisteren' } | { kind: 'dictation'; text: string };

function vocabEx(l: Lesson, n: number): QuizItem[] {
  return shuffle(l.vocab)
    .slice(0, n)
    .map((v) => {
      const wrong = shuffle(l.vocab.filter((x) => x !== v))
        .slice(0, 3)
        .map(withArticle);
      return { kind: 'ex', skill: 'woorden', ex: { type: 'mc', prompt: v.en, options: [withArticle(v), ...wrong], answer: 0 } } as QuizItem;
    });
}

function grammarEx(l: Lesson, n: number): QuizItem[] {
  const ex = l.grammar.flatMap((id) => getGrammar(id)?.exercises ?? []);
  return shuffle(ex)
    .slice(0, n)
    .map((e) => ({ kind: 'ex', skill: 'grammatica', ex: e }) as QuizItem);
}

/** Mixed quiz over a set of lessons: words, grammar, text questions and a dictation. */
export function buildQuiz(lessonNs: number[], perLesson = { vocab: 3, grammar: 2, text: 1, dictation: 1 }): QuizItem[] {
  const lessons = lessonNs.map(getLesson).filter((l): l is Lesson => !!l);
  const items: QuizItem[] = [];
  for (const l of lessons) {
    items.push(...vocabEx(l, perLesson.vocab), ...grammarEx(l, perLesson.grammar));
    items.push(
      ...shuffle(l.listening)
        .slice(0, perLesson.text)
        .map((q) => ({ kind: 'ex', skill: 'luisteren', ex: { type: 'mc', prompt: q.q, options: q.options, answer: q.answer } }) as QuizItem),
    );
    items.push(
      ...practicePhrases(l, perLesson.dictation, 9).map((p) => ({ kind: 'dictation', text: p.nl }) as QuizItem),
    );
  }
  return shuffle(items);
}
