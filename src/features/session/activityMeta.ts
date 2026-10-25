import { getLesson, UNITS } from '@/content';
import { getKnm } from '@/content/knm';
import { getScenario } from '@/content/tutor';
import type { Activity, DrillId } from '@/store/types';
import { STEP_META } from '../lesson/LessonPlayer';

export const DRILL_META: Record<DrillId, { title: string; icon: string; blurb: string }> = {
  numbers: { title: 'Getallen', icon: 'target', blurb: 'Hear and write numbers, prices and phone numbers' },
  verbs: { title: 'Werkwoorden', icon: 'bolt', blurb: 'Conjugate verbs in the present tense' },
  clock: { title: 'De klok', icon: 'clock', blurb: 'Tell the time the Dutch way' },
  spelling: { title: 'Spelling', icon: 'pencil', blurb: 'Long and short vowels: maan – manen' },
  dehet: { title: 'De of het?', icon: 'cards', blurb: 'Choose the right article' },
  perfect: { title: 'Voltooid', icon: 'refresh', blurb: 'heb / ben + past participle' },
};

export function activityInfo(a: Activity): { title: string; sub: string; icon: string } {
  switch (a.kind) {
    case 'srs':
      return { title: 'Herhalen', sub: 'Review words that are due', icon: 'cards' };
    case 'lesson': {
      const l = getLesson(a.lesson);
      return { title: `Les ${a.lesson}: ${l?.title ?? ''}`, sub: a.steps.map((s) => STEP_META[s].label).join(' · '), icon: l?.icon ?? 'book' };
    }
    case 'drill':
      return { title: DRILL_META[a.drill].title, sub: DRILL_META[a.drill].blurb, icon: DRILL_META[a.drill].icon };
    case 'quiz':
      return { title: 'Weektoets', sub: a.lessons.length ? `Quiz on lessons ${a.lessons.join(', ')}` : 'Quiz', icon: 'target' };
    case 'reading':
      return { title: 'Lezen', sub: `${a.count} exam-style texts`, icon: 'book' };
    case 'listening':
      return { title: 'Luisteren', sub: `${a.count} exam-style dialogues`, icon: 'headphones' };
    case 'knm':
      return { title: `KNM: ${getKnm(a.theme)?.title ?? a.theme}`, sub: 'Knowledge of Dutch society', icon: 'landmark' };
    case 'writing':
      return { title: 'Schrijven', sub: `${a.count} writing ${a.count === 1 ? 'task' : 'tasks'}`, icon: 'letter' };
    case 'speaking':
      return { title: 'Spreken', sub: `${a.count} speaking tasks`, icon: 'mic' };
    case 'tutor':
      return { title: `Gesprek: ${getScenario(a.scenario)?.title ?? 'AI tutor'}`, sub: 'Role-play with the AI tutor', icon: 'chat' };
    case 'checkpoint':
      return { title: `Toets unit ${a.unit}`, sub: UNITS[a.unit - 1]?.title ?? '', icon: 'medal' };
    case 'mock':
      return { title: `Proefexamen ${a.mock} · deel ${a.part}`, sub: a.part === 'A' ? 'Lezen · Luisteren · KNM' : 'Schrijven · Spreken', icon: 'medal' };
  }
}
