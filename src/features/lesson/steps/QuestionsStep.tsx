import { useMemo, useRef, useState } from 'react';
import type { Lesson, MCQ, Question } from '@/content/schema';
import { speakSequence, stopSpeaking } from '@/engine/speech';
import { Icon } from '@/design/icons';
import { SpeakButton } from '@/design/ui';
import { Run } from '../../practice/Run';
import { Choices, TextAnswer } from '../../practice/Exercises';
import { SpeakAttempt, TranscriptView } from '../../practice/SpeakAttempt';
import { speakerVoices } from './ListenStep';

type Item = { kind: 'listen'; q: MCQ } | { kind: 'answer'; q: Question } | { kind: 'speak'; prompt: string };

/** Answer a question by speaking or typing; then compare with a model answer. */
export function OpenAnswer({ question, model, answer, locked }: { question: string; model: string; answer: (r: { ok: boolean; unscored?: boolean; expected?: string; extra?: React.ReactNode }) => void; locked: boolean }) {
  const [mode, setMode] = useState<'speak' | 'type'>('speak');
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <p className="font-display text-3xl leading-snug" lang="nl">
          {question}
        </p>
        <SpeakButton text={question} />
      </div>
      <div className="flex gap-2">
        <button className={`chip ${mode === 'speak' ? 'border-cobalt text-cobalt' : ''}`} onClick={() => setMode('speak')}>
          <Icon name="mic" size={14} /> Speak
        </button>
        <button className={`chip ${mode === 'type' ? 'border-cobalt text-cobalt' : ''}`} onClick={() => setMode('type')}>
          <Icon name="pencil" size={14} /> Type
        </button>
      </div>
      {mode === 'speak' ? (
        <SpeakAttempt freeAnswer locked={locked} onResult={(o) => answer({ ok: true, unscored: true, expected: model, extra: <TranscriptView outcome={o} /> })} />
      ) : (
        <TextAnswer locked={locked} placeholder="Answer in Dutch…" onSubmit={(v) => answer({ ok: true, unscored: true, expected: model, extra: <p className="text-sm">You wrote: “{v}”</p> })} />
      )}
    </div>
  );
}

/** Listening check on the whole text, "Geef antwoord" questions, and speaking prompts. */
export function QuestionsStep({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const [heard, setHeard] = useState(false);
  const [playing, setPlaying] = useState(false);
  const cancelled = useRef(false);
  const voiceOf = speakerVoices(lesson.text);
  const items: Item[] = useMemo(
    () => [
      ...lesson.listening.map((q) => ({ kind: 'listen' as const, q })),
      ...lesson.questions.slice(0, 4).map((q) => ({ kind: 'answer' as const, q })),
      ...lesson.speaking.slice(0, 1).map((prompt) => ({ kind: 'speak' as const, prompt })),
    ],
    [lesson],
  );

  const play = async () => {
    cancelled.current = false;
    setPlaying(true);
    await speakSequence(lesson.text.map((p) => ({ text: p.nl, speaker: voiceOf(p) })), { gapMs: 200, isCancelled: () => cancelled.current });
    setPlaying(false);
    setHeard(true);
  };

  if (!heard) {
    return (
      <div className="card flex flex-col items-center gap-4 p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-cobalt-soft text-cobalt">
          <Icon name="headphones" size={32} />
        </div>
        <h3 className="text-2xl">Listening check</h3>
        <p className="max-w-md text-muted">Listen to the whole text once more — no reading this time. Then answer questions about it, and talk about yourself.</p>
        {playing ? (
          <button
            className="btn-ghost"
            onClick={() => {
              cancelled.current = true;
              stopSpeaking();
            }}
          >
            <Icon name="stop" size={18} /> Stop
          </button>
        ) : (
          <button className="btn-primary" onClick={play}>
            <Icon name="play" size={18} /> Listen
          </button>
        )}
        <button className="text-sm text-muted underline-offset-2 hover:underline" onClick={() => setHeard(true)}>
          Skip listening
        </button>
      </div>
    );
  }

  return (
    <Run
      items={items}
      skill="luisteren"
      requeue={false}
      onFinish={onDone}
      render={(item, answer, locked) => {
        if (item.kind === 'listen')
          return (
            <div className="flex flex-col gap-5">
              <p className="eyebrow">About the text</p>
              <p className="font-display text-3xl" lang="nl">
                {item.q.q}
              </p>
              <Choices options={item.q.options} answer={item.q.answer} onAnswer={answer} locked={locked} explain={item.q.explain} />
            </div>
          );
        if (item.kind === 'answer') return <OpenAnswer question={item.q.q} model={item.q.model} answer={answer} locked={locked} />;
        return <OpenAnswer question={item.prompt} model="Speak for 20–30 seconds. Use words from this lesson." answer={answer} locked={locked} />;
      }}
    />
  );
}
