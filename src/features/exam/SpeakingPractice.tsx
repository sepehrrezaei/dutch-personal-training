import { useEffect, useMemo, useState } from 'react';
import { pickItems, SPEAKING } from '@/content/exam';
import type { SpeakingTask } from '@/content/schema';
import { gradeSpeaking, type SpeakingFeedback } from '@/engine/ai';
import { normalize } from '@/engine/checker';
import { speak } from '@/engine/speech';
import { Icon } from '@/design/icons';
import { SpeakButton } from '@/design/ui';
import { useStore } from '@/store/store';
import { Run, type AnswerResult, type RunResult } from '../practice/Run';
import { SpeakAttempt, type SpeakOutcome } from '../practice/SpeakAttempt';

function AiSpeaking({ prompt, transcript }: { prompt: string; transcript: string }) {
  const settings = useStore((s) => s.settings);
  const [fb, setFb] = useState<SpeakingFeedback | null>(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  if (!settings.apiKey || !transcript) return null;
  if (fb)
    return (
      <div className="mt-2 rounded-xl bg-cobalt-soft/50 p-3 text-sm">
        <strong>{fb.score}/10</strong> — {fb.comment}
        <p className="mt-1" lang="nl">
          <span className="text-muted">Better: </span>
          {fb.better}
        </p>
      </div>
    );
  return (
    <button
      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-cobalt"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          setFb(await gradeSpeaking(settings.apiKey!, settings.model, prompt, transcript));
        } catch (e) {
          setErr(e instanceof Error ? e.message : 'AI error');
        }
        setLoading(false);
      }}
    >
      <Icon name="sparkles" size={14} /> {loading ? 'Listening…' : 'AI feedback'} {err && <span className="text-tulip">{err}</span>}
    </button>
  );
}

export function SpeakingTaskView({ task, answer, locked }: { task: SpeakingTask; answer: (r: AnswerResult) => void; locked: boolean }) {
  useEffect(() => {
    speak(task.prompt);
  }, [task]);
  const result = (o: SpeakOutcome) => {
    const t = normalize(o.transcript ?? '');
    const hits = task.keywords.filter((k) => t.includes(normalize(k)));
    const ok = o.transcript ? hits.length >= Math.ceil(task.keywords.length / 2) && t.split(' ').length >= (task.kind === 'long' ? 12 : 3) : !!o.selfOk;
    answer({
      ok,
      unscored: !o.transcript,
      expected: task.model,
      note: o.transcript ? (task.kind === 'long' ? 'Long answers: aim for 3–4 sentences with because (want/omdat) and examples.' : 'Short answers: one or two clear sentences are enough.') : undefined,
      extra: o.transcript ? (
        <div className="text-sm">
          <p>
            <span className="text-muted">You said: </span>“{o.transcript}”
          </p>
          <AiSpeaking prompt={`${task.situation} ${task.prompt}`} transcript={o.transcript} />
        </div>
      ) : undefined,
    });
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="card p-5">
        <p className="eyebrow mb-1">Spreken · {task.kind === 'short' ? 'kort antwoord' : 'lang antwoord'}</p>
        <p className="text-muted" lang="nl">
          {task.situation}
        </p>
        <div className="mt-2 flex items-start gap-3">
          <p className="flex-1 font-display text-2xl" lang="nl">
            {task.prompt}
          </p>
          <SpeakButton text={task.prompt} />
        </div>
      </div>
      <SpeakAttempt freeAnswer locked={locked} onResult={result} />
    </div>
  );
}

/** Spreken practice: situations with short and long spoken answers. */
export function SpeakingPractice({ unit, count, onDone, tasks: given, onExit }: { unit: number; count: number; onDone: (r: RunResult) => void; tasks?: SpeakingTask[]; onExit?: () => void }) {
  const seen = useStore((s) => s.seen);
  const markSeen = useStore((s) => s.markSeen);
  const tasks = useMemo(() => given ?? pickItems(SPEAKING, unit, count, seen), []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Run
      items={tasks}
      skill="spreken"
      requeue={false}
      onExit={onExit}
      onFinish={(r) => {
        markSeen(tasks.map((t) => t.id));
        onDone(r);
      }}
      render={(task, answer, locked) => <SpeakingTaskView task={task} answer={answer} locked={locked} />}
    />
  );
}
