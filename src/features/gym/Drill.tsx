import { useEffect, useMemo } from 'react';
import { LESSONS } from '@/content';
import { withArticle } from '@/content/dsl';
import type { Exercise, VocabItem } from '@/content/schema';
import { numberToDutch, presentForm, SUBJECTS, timeToDutch, VERBS } from '@/content/verbs';
import { countDone } from '@/engine/scheduler';
import { speak } from '@/engine/speech';
import { shuffle, SpeakButton } from '@/design/ui';
import { useStore } from '@/store/store';
import type { DrillId, Skill } from '@/store/types';
import { Run, type AnswerResult, type RunResult } from '../practice/Run';
import { Choices, ExerciseView, TextAnswer } from '../practice/Exercises';
import { DRILL_META } from '../session/activityMeta';

type DrillItem =
  | { kind: 'ex'; ex: Exercise }
  | { kind: 'hear-number'; n: number; label: string }
  | { kind: 'dehet'; v: VocabItem };

const rand = (n: number) => Math.floor(Math.random() * n);

function numbersDrill(level: number): DrillItem[] {
  const items: DrillItem[] = [];
  for (let i = 0; i < 10; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const n = level < 3 ? rand(21) : level < 8 ? rand(100) : rand(2100);
      items.push({ kind: 'hear-number', n, label: String(n) });
    } else if (kind === 1) {
      const n = 13 + rand(level < 3 ? 8 : 87);
      const wrong = shuffle([n + 1, n - 1, n % 10 * 10 + Math.floor(n / 10), n + 10].filter((x) => x !== n && x > 0)).slice(0, 3);
      items.push({ kind: 'ex', ex: { type: 'mc', prompt: numberToDutch(n), options: [String(n), ...wrong.map(String)], answer: 0, explain: 'Dutch says the units first: 47 = zeven-en-veertig.' } });
    } else {
      const euros = 1 + rand(level < 3 ? 20 : 60);
      const cents = [0, 25, 50, 75, 95, 99][rand(6)];
      const label = `€ ${euros},${String(cents).padStart(2, '0')}`;
      items.push({ kind: 'hear-number', n: euros * 100 + cents, label });
    }
  }
  return items;
}

function clockDrill(): DrillItem[] {
  return Array.from({ length: 10 }, (_, i) => {
    const h = 1 + rand(12);
    const m = 5 * rand(12);
    const right = timeToDutch(h, m);
    const digital = `${h}:${String(m).padStart(2, '0')}`;
    if (i % 2 === 0) {
      const wrongs = new Set<string>();
      while (wrongs.size < 3) {
        const alt = timeToDutch(h + (rand(2) ? 1 : 0), (m + 5 * (1 + rand(11))) % 60);
        if (alt !== right) wrongs.add(alt);
      }
      return { kind: 'ex', ex: { type: 'mc', prompt: digital, options: [right, ...wrongs], answer: 0 } } as DrillItem;
    }
    const wrongs = new Set<string>();
    while (wrongs.size < 3) {
      const alt = `${1 + rand(12)}:${String(5 * rand(12)).padStart(2, '0')}`;
      if (alt !== digital) wrongs.add(alt);
    }
    return { kind: 'ex', ex: { type: 'mc', prompt: `Het is ${right}.`, options: [digital, ...wrongs], answer: 0 } } as DrillItem;
  });
}

function verbsDrill(maxLesson: number): DrillItem[] {
  const pool = VERBS.filter((v) => v.lesson <= maxLesson);
  return Array.from({ length: 10 }, () => {
    const v = pool[rand(pool.length)];
    const subj = SUBJECTS[rand(SUBJECTS.length)].s;
    const form = presentForm(v, subj);
    const question = rand(3) === 0 && subj === 'jij';
    const prompt = question ? `___ jij …? (${v.inf})` : `${subj[0].toUpperCase()}${subj.slice(1)} ___ (${v.inf} — ${v.en})`;
    const answer = question ? (v.inf === 'zijn' ? 'Ben' : v.inf === 'hebben' ? 'Heb' : v.ik[0].toUpperCase() + v.ik.slice(1)) : form;
    return { kind: 'ex', ex: { type: 'fill', prompt, answer, explain: question ? 'Jij after the verb: no -t.' : undefined } } as DrillItem;
  });
}

function perfectDrill(maxLesson: number): DrillItem[] {
  const pool = VERBS.filter((v) => v.lesson <= Math.max(maxLesson, 13) && v.inf !== 'zijn');
  return Array.from({ length: 10 }, (_, i) => {
    const v = pool[rand(pool.length)];
    const s = SUBJECTS[rand(SUBJECTS.length)];
    const aux = s.aux[v.aux];
    const subj = s.s[0].toUpperCase() + s.s.slice(1);
    if (i % 2 === 0) return { kind: 'ex', ex: { type: 'fill', prompt: `${subj} ${aux} ___ (${v.inf})`, answer: v.pp } } as DrillItem;
    return { kind: 'ex', ex: { type: 'mc', prompt: `${subj} ___ ${v.pp}.`, options: [aux, s.aux[v.aux === 'hebben' ? 'zijn' : 'hebben']], answer: 0, explain: v.aux === 'zijn' ? 'Movement to a place or change of state → zijn.' : undefined } } as DrillItem;
  });
}

function learnedNouns(maxLesson: number): VocabItem[] {
  return LESSONS.filter((l) => l.n <= maxLesson).flatMap((l) => l.vocab.filter((v) => v.art));
}

function spellingDrill(maxLesson: number): DrillItem[] {
  const nouns = learnedNouns(maxLesson).filter((v) => v.pl && v.pl.length > 0);
  return shuffle(nouns)
    .slice(0, 10)
    .map((v) => ({ kind: 'ex', ex: { type: 'fill', prompt: `één ${v.nl} → twee ___`, answer: v.pl!, en: v.en } }) as DrillItem);
}

function dehetDrill(maxLesson: number): DrillItem[] {
  return shuffle(learnedNouns(maxLesson))
    .slice(0, 15)
    .map((v) => ({ kind: 'dehet', v }) as DrillItem);
}

export function buildDrill(id: DrillId, lessonsDone: number): DrillItem[] {
  const maxLesson = Math.max(1, lessonsDone + 1);
  switch (id) {
    case 'numbers':
      return numbersDrill(lessonsDone);
    case 'clock':
      return clockDrill();
    case 'verbs':
      return verbsDrill(maxLesson);
    case 'perfect':
      return perfectDrill(maxLesson);
    case 'spelling':
      return spellingDrill(maxLesson);
    case 'dehet':
      return dehetDrill(Math.max(maxLesson, 3));
  }
}

const SKILL: Record<DrillId, Skill> = { numbers: 'luisteren', clock: 'woorden', verbs: 'grammatica', perfect: 'grammatica', spelling: 'schrijven', dehet: 'woorden' };

function HearNumber({ item, answer, locked }: { item: { n: number; label: string }; answer: (r: AnswerResult) => void; locked: boolean }) {
  const spoken = item.label.startsWith('€') ? item.label.replace('€ ', '') + ' euro' : item.label;
  useEffect(() => {
    speak(spoken);
  }, [spoken]);
  return (
    <div className="flex flex-col gap-5">
      <p className="eyebrow">Write the {item.label.startsWith('€') ? 'price' : 'number'} in digits</p>
      <div className="flex gap-2">
        <SpeakButton text={spoken} size="lg" />
        <SpeakButton text={spoken} slow />
      </div>
      <TextAnswer
        locked={locked}
        placeholder={item.label.startsWith('€') ? 'e.g. 4,50' : 'e.g. 47'}
        onSubmit={(v) => {
          const clean = (s: string) => s.replace(/[€\s]/g, '').replace('.', ',').replace(/,00$/, '');
          const ok = clean(v) === clean(item.label);
          answer({ ok, expected: item.label, note: item.label.startsWith('€') ? undefined : numberToDutch(item.n) });
        }}
      />
    </div>
  );
}

function DeHet({ v, answer, locked }: { v: VocabItem; answer: (r: AnswerResult) => void; locked: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="eyebrow">de or het?</p>
      <div className="text-center">
        <p className="font-display text-5xl" lang="nl">
          {v.nl}
        </p>
        <p className="mt-2 text-muted">{v.en}</p>
      </div>
      <Choices
        options={['de', 'het']}
        answer={v.art === 'de' ? 0 : 1}
        locked={locked}
        onAnswer={(r) => {
          speak(withArticle(v));
          answer({ ...r, expected: withArticle(v), note: r.ok ? undefined : v.art === 'het' ? 'Het-words are fewer: learn them as a list. Diminutives (-je) are always het.' : undefined });
        }}
      />
    </div>
  );
}

export function Drill({ id, onDone, onExit }: { id: DrillId; onDone: (r: RunResult) => void; onExit?: () => void }) {
  const done = countDone(useStore((s) => s.lessons));
  const items = useMemo(() => buildDrill(id, done), [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const meta = DRILL_META[id];
  if (!items.length) {
    return (
      <div className="card p-8 text-center">
        <p className="mb-4">Finish a few more lessons to unlock this drill.</p>
        <button className="btn-primary" onClick={() => onDone({ correct: 0, total: 0 })}>
          Continue
        </button>
      </div>
    );
  }
  return (
    <Run
      items={items}
      skill={SKILL[id]}
      onFinish={onDone}
      onExit={onExit}
      title={
        <div>
          <p className="eyebrow">Drill</p>
          <h2 className="text-2xl">{meta.title}</h2>
        </div>
      }
      render={(item, answer, locked) => {
        if (item.kind === 'hear-number') return <HearNumber item={item} answer={answer} locked={locked} />;
        if (item.kind === 'dehet') return <DeHet v={item.v} answer={answer} locked={locked} />;
        return <ExerciseView ex={item.ex} onAnswer={answer} locked={locked} />;
      }}
    />
  );
}

