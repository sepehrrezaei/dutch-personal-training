import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { check } from '@/engine/checker';
import { Icon } from '@/design/icons';
import { shuffle, SpeakButton } from '@/design/ui';
import type { Exercise } from '@/content/schema';
import type { AnswerResult } from './Run';

type Answer = (r: AnswerResult) => void;

const SPECIAL = ['é', 'ë', 'ï', 'ö', 'ü', 'è', "'"];

/** Text input with Enter-to-submit and buttons for Dutch accented letters. */
export function TextAnswer({ onSubmit, locked, placeholder = 'Type in Dutch…', autoFocus = true, big = false }: { onSubmit: (v: string) => void; locked: boolean; placeholder?: string; autoFocus?: boolean; big?: boolean }) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const insert = (ch: string) => {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart ?? value.length;
    const e = el.selectionEnd ?? value.length;
    const v = value.slice(0, s) + ch + value.slice(e);
    setValue(v);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + ch.length, s + ch.length);
    });
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!locked && value.trim()) onSubmit(value);
      }}
      className="flex flex-col gap-2"
    >
      <input
        ref={ref}
        className={`input ${big ? 'py-4 text-xl' : ''}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={locked}
        autoFocus={autoFocus}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        lang="nl"
      />
      <div className="flex flex-wrap items-center gap-1.5">
        {SPECIAL.map((c) => (
          <button key={c} type="button" disabled={locked} onClick={() => insert(c)} className="h-8 min-w-8 rounded-lg border border-line bg-paper px-2 text-sm text-muted hover:border-cobalt hover:text-cobalt">
            {c}
          </button>
        ))}
        <button type="submit" disabled={locked || !value.trim()} className="btn-primary ml-auto py-2.5">
          Check
        </button>
      </div>
    </form>
  );
}

export function Choices({ options, answer, onAnswer, locked, speakOptions = false, explain }: { options: string[]; answer: number; onAnswer: Answer; locked: boolean; speakOptions?: boolean; explain?: string }) {
  const order = useMemo(() => shuffle(options.map((_, i) => i)), [options]);
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (i: number) => {
    setPicked(i);
    onAnswer({ ok: i === answer, expected: options[answer], note: explain });
  };
  useEffect(() => {
    if (locked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = Number(e.key);
      if (k >= 1 && k <= order.length) pick(order[k - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  return (
    <div className="grid gap-2.5">
      {order.map((i, k) => {
        const isRight = i === answer;
        const state = picked === null ? 'idle' : isRight ? 'right' : picked === i ? 'wrong' : 'dim';
        return (
          <motion.button
            key={i}
            type="button"
            disabled={locked}
            whileTap={{ scale: 0.98 }}
            animate={state === 'wrong' ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
            onClick={() => pick(i)}
            className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-lg transition ${
              state === 'right'
                ? 'border-polder bg-[rgb(var(--polder)/0.1)]'
                : state === 'wrong'
                  ? 'border-tulip bg-[rgb(var(--tulip)/0.1)]'
                  : state === 'dim'
                    ? 'border-line opacity-50'
                    : 'border-line bg-paper hover:border-cobalt/60'
            }`}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-line text-xs font-bold text-muted">{k + 1}</span>
            <span className="flex-1">{options[i]}</span>
            {speakOptions && <SpeakButton text={options[i]} size="sm" />}
          </motion.button>
        );
      })}
    </div>
  );
}

/** Rebuild a sentence from shuffled word chips. */
export function WordOrder({ words, accepted, onAnswer, locked, en }: { words: string[]; accepted: string[]; onAnswer: Answer; locked: boolean; en?: string }) {
  const bank = useMemo(() => {
    let s = shuffle(words.map((w, i) => ({ w, i })));
    // Avoid presenting the sentence already in order.
    if (s.every((x, k) => x.i === k) && words.length > 1) s = [...s.slice(1), s[0]];
    return s;
  }, [words]);
  const [chosen, setChosen] = useState<number[]>([]);
  const sentence = chosen.map((i) => words[i]).join(' ');
  return (
    <div className="flex flex-col gap-4">
      {en && <p className="text-muted">{en}</p>}
      <div className="flex min-h-[64px] flex-wrap content-start gap-2 rounded-2xl border-2 border-dashed border-line p-3">
        {chosen.map((i) => (
          <motion.button layoutId={`w${i}`} key={i} disabled={locked} onClick={() => setChosen((c) => c.filter((x) => x !== i))} className="rounded-xl border border-cobalt/40 bg-cobalt-soft px-3 py-2 text-lg font-medium text-cobalt">
            {words[i]}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {bank.map(({ w, i }) =>
          chosen.includes(i) ? (
            <span key={i} className="rounded-xl border border-line bg-line/40 px-3 py-2 text-lg text-transparent">
              {w}
            </span>
          ) : (
            <motion.button layoutId={`w${i}`} key={i} disabled={locked} onClick={() => setChosen((c) => [...c, i])} className="rounded-xl border border-line bg-paper px-3 py-2 text-lg shadow-tile hover:border-cobalt/60">
              {w}
            </motion.button>
          ),
        )}
      </div>
      <button
        className="btn-primary self-end"
        disabled={locked || chosen.length !== words.length}
        onClick={() => {
          const r = check(sentence, accepted);
          onAnswer({ ok: r.ok, expected: accepted[0], note: r.note });
        }}
      >
        Check
      </button>
    </div>
  );
}

/** Render one grammar/lesson exercise of any type. */
export function ExerciseView({ ex, onAnswer, locked }: { ex: Exercise; onAnswer: Answer; locked: boolean }) {
  switch (ex.type) {
    case 'mc':
      return (
        <div className="flex flex-col gap-5">
          <Prompt text={ex.prompt} />
          <Choices options={ex.options} answer={ex.answer} onAnswer={onAnswer} locked={locked} explain={ex.explain} />
        </div>
      );
    case 'fill': {
      const accepted = Array.isArray(ex.answer) ? ex.answer : [ex.answer];
      return (
        <div className="flex flex-col gap-5">
          <Prompt text={ex.prompt} />
          {ex.en && <p className="-mt-3 text-muted">{ex.en}</p>}
          {ex.hint && <p className="-mt-3 text-sm text-muted">Hint: {ex.hint}</p>}
          <TextAnswer
            locked={locked}
            onSubmit={(v) => {
              const r = check(v, accepted);
              onAnswer({ ok: r.ok, expected: ex.prompt.replace('___', accepted[0]), note: r.note ?? ex.explain });
            }}
          />
        </div>
      );
    }
    case 'order': {
      const accepted = [ex.words.join(' '), ...(ex.alt ?? []).map((a) => a.join(' '))];
      return (
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Build the sentence</p>
          <WordOrder words={ex.words} accepted={accepted} onAnswer={onAnswer} locked={locked} en={ex.en} />
        </div>
      );
    }
    case 'transform': {
      const accepted = Array.isArray(ex.answer) ? ex.answer : [ex.answer];
      return (
        <div className="flex flex-col gap-5">
          <div>
            <p className="eyebrow mb-1">{ex.instruction}</p>
            <Prompt text={ex.prompt} />
          </div>
          <TextAnswer
            locked={locked}
            onSubmit={(v) => {
              const r = check(v, accepted);
              onAnswer({ ok: r.ok, expected: accepted[0], note: r.note ?? ex.explain });
            }}
          />
        </div>
      );
    }
  }
}

export function Prompt({ text, speakable = false }: { text: string; speakable?: boolean }) {
  const parts = text.split('___');
  return (
    <div className="flex items-start gap-3">
      <p className="font-display text-2xl leading-snug sm:text-3xl">
        {parts.map((p, i) => (
          <span key={i}>
            {p}
            {i < parts.length - 1 && <span className="mx-1 inline-block min-w-[3.5rem] border-b-[3px] border-oranje align-baseline">&nbsp;</span>}
          </span>
        ))}
      </p>
      {speakable && <SpeakButton text={text.replace('___', '…')} />}
    </div>
  );
}

export function ListenPrompt({ text, label = 'Listen' }: { text: string; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <SpeakButton text={text} size="lg" />
      <SpeakButton text={text} slow />
      <span className="text-muted">{label}</span>
      <Icon name="headphones" className="ml-auto text-muted/60" />
    </div>
  );
}
