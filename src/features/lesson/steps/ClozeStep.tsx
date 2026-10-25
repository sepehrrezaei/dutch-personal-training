import { useMemo, useState } from 'react';
import type { Lesson } from '@/content/schema';
import { check, tokenize } from '@/engine/checker';
import { Icon } from '@/design/icons';
import { shuffle } from '@/design/ui';
import { sfx } from '@/design/fx';
import { useStore } from '@/store/store';
import { guessLemma } from '../InteractiveText';

interface Gap {
  line: number;
  token: number;
  answer: string;
}

const MAX_GAPS = 10;

/** Choose words to blank: known lesson words, at most one per line, spread over the text. */
export function buildGaps(lesson: Lesson): Gap[] {
  const vocabSet = new Set(lesson.vocab);
  const candidates: Gap[] = [];
  lesson.text.forEach((p, line) => {
    const toks = tokenize(p.nl);
    const options = toks
      .map((t, token) => ({ t, token }))
      .filter(({ t, token }) => token > 0 && t.length > 2 && /^\p{L}/u.test(t) && vocabSet.has(guessLemma(t)!));
    if (options.length) {
      const pick = options[(line * 7) % options.length];
      candidates.push({ line, token: pick.token, answer: pick.t });
    }
  });
  if (candidates.length <= MAX_GAPS) return candidates;
  const step = candidates.length / MAX_GAPS;
  return Array.from({ length: MAX_GAPS }, (_, i) => candidates[Math.floor(i * step)]);
}

/** "Test jezelf": the lesson text with gaps to fill. */
export function ClozeStep({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const gaps = useMemo(() => buildGaps(lesson), [lesson]);
  const bank = useMemo(() => shuffle(gaps.map((g) => g.answer)), [gaps]);
  const answerSkill = useStore((s) => s.answer);
  const [values, setValues] = useState<string[]>(() => gaps.map(() => ''));
  const [checked, setChecked] = useState(false);
  const [showBank, setShowBank] = useState(true);

  const results = gaps.map((g, i) => check(values[i], g.answer));
  const score = results.filter((r) => r.ok).length;

  const submit = () => {
    setChecked(true);
    results.forEach((r) => answerSkill('woorden', r.ok));
    if (score >= gaps.length * 0.7) sfx.right();
    else sfx.wrong();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Fill in the missing words. Try from memory first.</p>
        <button className="chip shrink-0" onClick={() => setShowBank(!showBank)}>
          <Icon name={showBank ? 'eyeOff' : 'eye'} size={14} /> Word bank
        </button>
      </div>
      {showBank && !checked && (
        <div className="flex flex-wrap gap-1.5">
          {bank.map((w, i) => (
            <span key={i} className={`rounded-lg border border-line px-2 py-1 text-sm ${values.some((v) => v.trim().toLowerCase() === w.toLowerCase()) ? 'text-muted/40 line-through' : 'bg-paper'}`}>
              {w}
            </span>
          ))}
        </div>
      )}
      <div className="card space-y-2 p-5 text-lg leading-[2.4]" lang="nl">
        {lesson.text.map((p, line) => {
          const toks = tokenize(p.nl);
          return (
            <p key={line}>
              {p.who && <span className="mr-2 text-sm font-bold text-cobalt">{p.who}:</span>}
              {toks.map((t, k) => {
                const gi = gaps.findIndex((g) => g.line === line && g.token === k);
                const space = k > 0 && !/^[.,!?;:)]$/.test(t) ? ' ' : '';
                if (gi < 0) return <span key={k}>{space + t}</span>;
                const r = results[gi];
                return (
                  <span key={k}>
                    {space}
                    <input
                      value={values[gi]}
                      disabled={checked}
                      onChange={(e) => setValues((v) => v.map((x, j) => (j === gi ? e.target.value : x)))}
                      style={{ width: `${Math.max(4, t.length + 1)}ch` }}
                      className={`rounded-lg border-b-[3px] bg-cobalt-soft/50 px-1.5 text-center outline-none focus:border-oranje ${
                        checked ? (r.ok ? 'border-polder text-polder' : 'border-tulip text-tulip') : 'border-cobalt/40'
                      }`}
                      autoCapitalize="off"
                      autoComplete="off"
                      spellCheck={false}
                      aria-label={`Gap ${gi + 1}`}
                    />
                    {checked && !r.ok && <span className="ml-1 text-sm font-semibold text-polder">{t}</span>}
                  </span>
                );
              })}
            </p>
          );
        })}
      </div>
      {checked ? (
        <div className="flex items-center gap-4">
          <p className="flex-1 font-display text-2xl">
            {score} / {gaps.length} {score === gaps.length ? '— perfect!' : ''}
          </p>
          <button className="btn-primary" onClick={onDone}>
            Continue <Icon name="arrowRight" size={18} />
          </button>
        </div>
      ) : (
        <button className="btn-primary" onClick={submit}>
          Check answers
        </button>
      )}
    </div>
  );
}
