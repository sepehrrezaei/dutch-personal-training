import { useMemo, useState } from 'react';
import { pickItems, WRITING } from '@/content/exam';
import type { WritingTask } from '@/content/schema';
import { gradeWriting, type WritingFeedback } from '@/engine/ai';
import { Icon } from '@/design/icons';
import { sfx } from '@/design/fx';
import { useStore } from '@/store/store';
import type { RunResult } from '../practice/Run';

function AiWritingFeedback({ fb }: { fb: WritingFeedback }) {
  return (
    <div className="space-y-3 rounded-2xl border border-cobalt/30 bg-cobalt-soft/40 p-4">
      <div className="flex items-center gap-3">
        <span className={`font-display text-3xl ${fb.passLikely ? 'text-polder' : 'text-tulip'}`}>{fb.score}/10</span>
        <p className="text-sm">{fb.comment}</p>
      </div>
      {fb.corrections.length > 0 && (
        <ul className="space-y-1.5 text-sm">
          {fb.corrections.map((c, i) => (
            <li key={i}>
              <span className="text-tulip line-through">{c.original}</span> → <strong className="text-polder">{c.corrected}</strong>
              <span className="block text-muted">{c.explanation}</span>
            </li>
          ))}
        </ul>
      )}
      <div>
        <p className="eyebrow mb-1">Improved version</p>
        <p className="whitespace-pre-wrap text-sm" lang="nl">
          {fb.improved}
        </p>
      </div>
    </div>
  );
}

export function WritingTaskView({ task, onSubmit }: { task: WritingTask; onSubmit: (selfScore: number) => void }) {
  const settings = useStore((s) => s.settings);
  const answerSkill = useStore((s) => s.answer);
  const [fields, setFields] = useState<string[]>(() => (task.fields ?? []).map(() => ''));
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(() => task.mustInclude.map(() => false));
  const [ai, setAi] = useState<WritingFeedback | null>(null);
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [aiError, setAiError] = useState('');

  const answer = task.kind === 'form' ? (task.fields ?? []).map((f, i) => `${f.label}: ${fields[i]}`).join('\n') : text;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const ready = task.kind === 'form' ? fields.every((f) => f.trim()) : words >= Math.max(5, Math.floor((task.minWords ?? 15) * 0.6));

  const askAi = async () => {
    if (!settings.apiKey) return;
    setAiState('loading');
    try {
      const fb = await gradeWriting(settings.apiKey, settings.model, task, answer);
      setAi(fb);
      setChecks(task.mustInclude.map((_, i) => fb.covered[i] ?? false));
      setAiState('idle');
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'AI error');
      setAiState('error');
    }
  };

  const finish = () => {
    const score = ai ? ai.score / 10 : checks.filter(Boolean).length / checks.length;
    answerSkill('schrijven', score >= 0.6);
    sfx.done();
    onSubmit(score);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card p-5">
        <p className="eyebrow mb-1">Schrijven · {task.kind === 'form' ? 'formulier' : task.kind === 'email' ? 'e-mail' : 'bericht'}</p>
        <h3 className="text-2xl">{task.title}</h3>
        <p className="mt-2">{task.situation}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {task.mustInclude.map((m) => (
            <li key={m} className="chip" lang="nl">
              {m}
            </li>
          ))}
        </ul>
      </div>

      {task.kind === 'form' ? (
        <div className="card grid gap-3 p-5">
          {task.fields!.map((f, i) => (
            <label key={f.label} className="grid gap-1">
              <span className="text-sm font-semibold">{f.label}</span>
              <input className="input py-2 text-base" value={fields[i]} disabled={submitted} placeholder={f.answerHint} onChange={(e) => setFields((v) => v.map((x, j) => (j === i ? e.target.value : x)))} lang="nl" />
            </label>
          ))}
        </div>
      ) : (
        <div className="card p-3">
          <textarea className="min-h-[180px] w-full resize-y bg-transparent p-2 text-lg outline-none" value={text} disabled={submitted} onChange={(e) => setText(e.target.value)} placeholder="Schrijf hier je tekst…" lang="nl" spellCheck={false} />
          <p className="px-2 text-right text-xs text-muted">
            {words} words{task.minWords ? ` · aim for ${task.minWords}+` : ''}
          </p>
        </div>
      )}

      {!submitted ? (
        <button className="btn-primary" disabled={!ready} onClick={() => setSubmitted(true)}>
          Done writing <Icon name="check" size={18} />
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <p className="eyebrow mb-2">Check yourself: did you include…</p>
            <div className="grid gap-2">
              {task.mustInclude.map((m, i) => (
                <label key={m} className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" className="h-5 w-5 accent-[rgb(var(--polder))]" checked={checks[i]} onChange={(e) => setChecks((c) => c.map((x, j) => (j === i ? e.target.checked : x)))} />
                  <span lang="nl">{m}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <p className="eyebrow mb-2">Model answer</p>
            <p className="whitespace-pre-wrap" lang="nl">
              {task.model}
            </p>
          </div>
          {settings.apiKey ? (
            ai ? (
              <AiWritingFeedback fb={ai} />
            ) : (
              <button className="btn-ghost" onClick={askAi} disabled={aiState === 'loading'}>
                <Icon name="sparkles" size={18} /> {aiState === 'loading' ? 'The AI tutor is reading…' : 'Get AI feedback'}
              </button>
            )
          ) : (
            <p className="text-center text-sm text-muted">Add an Anthropic API key in Settings to get AI corrections on your writing.</p>
          )}
          {aiState === 'error' && <p className="text-sm text-tulip">{aiError}</p>}
          <button className="btn-orange" onClick={finish}>
            Next <Icon name="arrowRight" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

/** Schrijven practice: forms, messages and emails. */
export function WritingPractice({ unit, count, onDone }: { unit: number; count: number; onDone: (r: RunResult) => void }) {
  const seen = useStore((s) => s.seen);
  const markSeen = useStore((s) => s.markSeen);
  const tasks = useMemo(() => pickItems(WRITING, unit, count, seen), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const task = tasks[i];
  return (
    <WritingTaskView
      key={task.id}
      task={task}
      onSubmit={(s) => {
        markSeen([task.id]);
        const total = score + s;
        if (i + 1 < tasks.length) {
          setScore(total);
          setI(i + 1);
        } else onDone({ correct: Math.round(total * 10), total: tasks.length * 10 });
      }}
    />
  );
}
