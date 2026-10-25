import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Lesson, Phrase } from '@/content/schema';
import { speak, speakSequence, stopSpeaking } from '@/engine/speech';
import { Icon } from '@/design/icons';
import { SpeakButton } from '@/design/ui';
import { InteractiveText } from '../InteractiveText';

/** Map each speaker to voice 0 or 1 so dialogues alternate voices. Narration uses voice 0. */
export function speakerVoices(text: Phrase[]): (p: Phrase) => number {
  const order: string[] = [];
  for (const p of text) if (p.who && !order.includes(p.who)) order.push(p.who);
  return (p) => (p.who ? order.indexOf(p.who) % 2 : 0);
}

export function NoticeCard({ lesson }: { lesson: Lesson }) {
  if (!lesson.notice && !lesson.culture) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {lesson.notice && (
        <div className="card border-l-4 border-l-oranje p-4">
          <p className="eyebrow mb-1 text-oranje">Kijk goed</p>
          <p className="mb-2 font-display text-lg">{lesson.notice.title}</p>
          <ul className="space-y-1 text-sm">
            {lesson.notice.lines.map(([nl, en]) => (
              <li key={nl}>
                <span lang="nl" className="font-semibold">
                  {nl}
                </span>{' '}
                <span className="text-muted">— {en}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {lesson.culture && (
        <div className="card border-l-4 border-l-polder p-4">
          <p className="eyebrow mb-1 flex items-center gap-1 text-polder">
            <Icon name="bulb" size={14} /> Good to know
          </p>
          <p className="text-sm">{lesson.culture}</p>
        </div>
      )}
    </div>
  );
}

function Line({ p, active, showEn, voice, onClick }: { p: Phrase; active: boolean; showEn: boolean; voice: number; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [active]);
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group flex cursor-pointer gap-3 rounded-2xl px-3 py-2.5 transition ${active ? 'bg-cobalt-soft ring-2 ring-cobalt/30' : 'hover:bg-line/40'}`}
    >
      {p.who ? (
        <span className={`mt-1 h-fit shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${voice ? 'bg-oranje/15 text-oranje' : 'bg-cobalt/10 text-cobalt'}`}>{p.who}</span>
      ) : (
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-line" />
      )}
      <div className="min-w-0 flex-1">
        <InteractiveText text={p.nl} className="text-lg leading-relaxed" />
        {showEn && <p className="text-sm text-muted">{p.en}</p>}
      </div>
    </div>
  );
}

/** Delft steps 1 and 2: read and listen phrase by phrase, then listen to the whole text without pauses. */
export function ListenStep({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const [stage, setStage] = useState<1 | 2>(1);
  const [i, setI] = useState(0);
  const [showEn, setShowEn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [heard, setHeard] = useState(false);
  const cancelled = useRef(false);
  const voiceOf = speakerVoices(lesson.text);
  const text = lesson.text;

  useEffect(() => () => {
    cancelled.current = true;
    stopSpeaking();
  }, []);

  useEffect(() => {
    if (stage === 1) speak(text[i].nl, { speaker: voiceOf(text[i]) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, stage]);

  const playAll = async () => {
    stopSpeaking();
    cancelled.current = false;
    setPlaying(true);
    await speakSequence(
      text.map((p) => ({ text: p.nl, speaker: voiceOf(p) })),
      { gapMs: 250, onLine: (k) => setI(k), isCancelled: () => cancelled.current },
    );
    setPlaying(false);
    if (!cancelled.current) setHeard(true);
  };

  const stopAll = () => {
    cancelled.current = true;
    stopSpeaking();
    setPlaying(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`chip ${stage === 1 ? 'border-cobalt text-cobalt' : ''}`}>Step 1 · read & listen</span>
        <span className={`chip ${stage === 2 ? 'border-cobalt text-cobalt' : ''}`}>Step 2 · listen without pauses</span>
        <button className="chip ml-auto hover:border-cobalt" onClick={() => setShowEn(!showEn)}>
          <Icon name={showEn ? 'eyeOff' : 'translate'} size={14} /> {showEn ? 'Hide English' : 'Show English'}
        </button>
      </div>

      {stage === 1 ? (
        <>
          <p className="text-sm text-muted">Listen to each sentence and read along. Tap any underlined word for its meaning. Then <strong>say the sentence aloud</strong> before you go on.</p>
          <div className="card max-h-[48dvh] overflow-y-auto p-2">
            {text.map((p, k) => (
              <Line key={k} p={p} active={k === i} showEn={showEn || k === i} voice={voiceOf(p)} onClick={() => setI(k)} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)} aria-label="Previous sentence">
              <Icon name="arrowLeft" />
            </button>
            <SpeakButton text={text[i].nl} speaker={voiceOf(text[i])} size="lg" />
            <SpeakButton text={text[i].nl} speaker={voiceOf(text[i])} slow />
            {i < text.length - 1 ? (
              <button className="btn-primary flex-1" onClick={() => setI(i + 1)}>
                Next sentence <Icon name="arrowRight" size={18} />
              </button>
            ) : (
              <button
                className="btn-orange flex-1"
                onClick={() => {
                  setStage(2);
                  setI(-1);
                }}
              >
                Step 2 <Icon name="arrowRight" size={18} />
              </button>
            )}
          </div>
          <p className="text-center text-xs text-muted">
            Sentence {i + 1} of {text.length}
          </p>
          <NoticeCard lesson={lesson} />
        </>
      ) : (
        <>
          <p className="text-sm text-muted">Now listen to the whole text without stopping. Try to follow along — read only when you get lost.</p>
          <div className="card max-h-[52dvh] overflow-y-auto p-2">
            {text.map((p, k) => (
              <Line key={k} p={p} active={k === i} showEn={showEn} voice={voiceOf(p)} />
            ))}
          </div>
          <div className="flex gap-2">
            {playing ? (
              <button className="btn-ghost flex-1" onClick={stopAll}>
                <Icon name="stop" size={18} /> Stop
              </button>
            ) : (
              <motion.button className="btn-primary flex-1" onClick={playAll} animate={heard ? undefined : { scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                <Icon name="play" size={18} /> {heard ? 'Play again' : 'Play the whole text'}
              </motion.button>
            )}
            <button className={heard ? 'btn-orange flex-1' : 'btn-ghost flex-1'} onClick={onDone} disabled={playing}>
              Done <Icon name="check" size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
