import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { speechScore } from '@/engine/checker';
import { listen, record, sttSupported, type Listening, type Recording } from '@/engine/speech';
import { Icon } from '@/design/icons';

export interface SpeakOutcome {
  /** 0..1 when speech recognition ran; null when the learner rated themselves. */
  score: number | null;
  transcript?: string;
  missed?: string[];
  selfOk?: boolean;
}

/**
 * Microphone practice. With speech recognition: transcribe and score against `target`.
 * Without it: record, play back, and let the learner judge.
 */
export function SpeakAttempt({ target, onResult, locked, freeAnswer = false }: { target?: string; onResult: (o: SpeakOutcome) => void; locked: boolean; freeAnswer?: boolean }) {
  const stt = sttSupported();
  const [state, setState] = useState<'idle' | 'listening' | 'recorded'>('idle');
  const [interim, setInterim] = useState('');
  const [audio, setAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lis = useRef<Listening | null>(null);
  const rec = useRef<Recording | null>(null);

  useEffect(
    () => () => {
      lis.current?.stop();
      rec.current?.stop().catch(() => {});
    },
    [],
  );

  const start = async () => {
    setError(null);
    setInterim('');
    try {
      if (stt) {
        setState('listening');
        lis.current = listen(setInterim, freeAnswer);
        const text = await lis.current.done;
        setState('idle');
        if (!text) {
          setError("I didn't hear anything. Try again, a bit louder.");
          return;
        }
        if (target && !freeAnswer) {
          const { score, missed } = speechScore(text, target);
          onResult({ score, transcript: text, missed });
        } else onResult({ score: null, transcript: text });
      } else {
        rec.current = await record();
        setState('listening');
      }
    } catch (e) {
      setState('idle');
      setError(e instanceof Error ? e.message : 'Microphone not available.');
    }
  };

  const stop = async () => {
    if (stt) lis.current?.stop();
    else if (rec.current) {
      const url = await rec.current.stop();
      rec.current = null;
      setAudio(url);
      setState('recorded');
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {state === 'listening' ? (
        <motion.button
          type="button"
          onClick={stop}
          className="grid h-20 w-20 place-items-center rounded-full bg-tulip text-white shadow-lg"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.1 }}
          aria-label="Stop"
        >
          <Icon name="stop" size={30} />
        </motion.button>
      ) : (
        <button type="button" disabled={locked} onClick={start} className="grid h-20 w-20 place-items-center rounded-full bg-cobalt text-white shadow-lg transition hover:scale-105 disabled:opacity-40" aria-label="Speak">
          <Icon name="mic" size={32} />
        </button>
      )}
      <p className="min-h-[1.5rem] text-center text-sm text-muted">
        {state === 'listening' ? (interim ? <span className="text-ink">“{interim}”</span> : stt ? 'Listening… tap to stop' : 'Recording… tap to stop') : stt ? 'Tap and speak' : 'Tap to record yourself'}
      </p>
      {error && <p className="text-sm text-tulip">{error}</p>}
      {state === 'recorded' && audio && !locked && (
        <div className="flex w-full flex-col items-center gap-3">
          <audio src={audio} controls className="w-full max-w-xs" />
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => onResult({ score: null, selfOk: false })}>
              Try again later
            </button>
            <button className="btn-primary" onClick={() => onResult({ score: null, selfOk: true })}>
              Sounds good
            </button>
          </div>
        </div>
      )}
      {!locked && state === 'idle' && (
        <button className="text-xs text-muted underline-offset-2 hover:underline" onClick={() => onResult({ score: null, selfOk: true })}>
          I can't speak now — skip
        </button>
      )}
    </div>
  );
}

/** Show a transcript with the words the learner missed. */
export function TranscriptView({ outcome }: { outcome: SpeakOutcome }) {
  if (!outcome.transcript) return null;
  return (
    <p className="text-sm">
      <span className="text-muted">You said: </span>“{outcome.transcript}”
      {outcome.missed && outcome.missed.length > 0 && (
        <span className="block text-muted">
          Missed: <span className="font-semibold text-tulip">{outcome.missed.join(', ')}</span>
        </span>
      )}
    </p>
  );
}
