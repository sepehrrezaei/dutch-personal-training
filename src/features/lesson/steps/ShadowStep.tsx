import { useEffect, useMemo, useState } from 'react';
import type { Lesson, Phrase } from '@/content/schema';
import { speak } from '@/engine/speech';
import { Icon } from '@/design/icons';
import { SpeakButton } from '@/design/ui';
import { Run, type AnswerResult } from '../../practice/Run';
import { SpeakAttempt, TranscriptView } from '../../practice/SpeakAttempt';
import { practicePhrases } from './phrases';
import { speakerVoices } from './ListenStep';

function ShadowItem({ p, voice, answer, locked }: { p: Phrase; voice: number; answer: (r: AnswerResult) => void; locked: boolean }) {
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    speak(p.nl, { speaker: voice });
  }, [p, voice]);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow mb-2">Listen, then say it — without reading</p>
        <div className="flex items-center gap-2">
          <SpeakButton text={p.nl} speaker={voice} size="lg" />
          <SpeakButton text={p.nl} speaker={voice} slow />
          <button className="chip ml-auto" onClick={() => setReveal(!reveal)}>
            <Icon name={reveal ? 'eyeOff' : 'eye'} size={14} /> {reveal ? 'Hide' : 'Peek'}
          </button>
        </div>
        <div className="mt-4 min-h-[3.5rem] rounded-2xl bg-line/30 p-3 text-lg">
          {reveal || locked ? <span lang="nl">{p.nl}</span> : <span className="select-none tracking-widest text-muted/50">{p.nl.replace(/[^\s.,!?]/g, '•')}</span>}
          <p className="text-sm text-muted">{p.en}</p>
        </div>
      </div>
      <SpeakAttempt
        target={p.nl}
        locked={locked}
        onResult={(o) => {
          if (o.score === null) answer({ ok: !!o.selfOk, unscored: true, expected: p.nl });
          else
            answer({
              ok: o.score >= 0.7,
              expected: p.nl,
              note: o.score >= 0.95 ? 'Perfect pronunciation!' : o.score >= 0.7 ? 'Good — most words were clear.' : 'Listen once more and try to say every word.',
              extra: <TranscriptView outcome={o} />,
            });
        }}
      />
    </div>
  );
}

/** Delft step 3: listen and repeat each sentence without seeing the text. */
export function ShadowStep({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const items = useMemo(() => practicePhrases(lesson, 8), [lesson]);
  const voiceOf = speakerVoices(lesson.text);
  return <Run items={items} skill="spreken" requeue={false} onFinish={onDone} render={(p, answer, locked) => <ShadowItem p={p} voice={voiceOf(p)} answer={answer} locked={locked} />} />;
}
