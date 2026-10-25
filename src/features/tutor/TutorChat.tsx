import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getScenario, TUTOR_SCENARIOS } from '@/content/tutor';
import { tutorFeedback, tutorTurn, type TutorFeedback, type TutorTurn } from '@/engine/ai';
import { listen, speak, sttSupported } from '@/engine/speech';
import { Icon } from '@/design/icons';
import { SpeakButton } from '@/design/ui';
import { sfx } from '@/design/fx';
import { useStore } from '@/store/store';

interface Msg extends TutorTurn {
  en?: string;
  correction?: string | null;
  why?: string | null;
}

function Bubble({ m }: { m: Msg }) {
  const [showEn, setShowEn] = useState(false);
  const mine = m.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-lg ${mine ? 'rounded-br-md bg-cobalt text-white' : 'rounded-bl-md border border-line bg-paper'}`} lang="nl">
        {m.text}
      </div>
      {!mine && (
        <div className="mt-1 flex items-center gap-2 pl-2 text-xs text-muted">
          <SpeakButton text={m.text} size="sm" />
          {m.en && (
            <button className="hover:text-cobalt" onClick={() => setShowEn(!showEn)}>
              {showEn ? m.en : 'Translate'}
            </button>
          )}
        </div>
      )}
      {mine && m.correction && (
        <div className="mt-1 max-w-[85%] rounded-2xl bg-[rgb(var(--oranje)/0.12)] px-3 py-2 text-sm">
          <span className="font-semibold text-oranje">Better: </span>
          <span lang="nl">{m.correction}</span>
          {m.why && <span className="block text-muted">{m.why}</span>}
        </div>
      )}
    </motion.div>
  );
}

function FeedbackView({ fb, onDone }: { fb: TutorFeedback; onDone: () => void }) {
  return (
    <div className="card space-y-4 p-6">
      <div className="flex items-center gap-4">
        <span className="font-display text-5xl text-cobalt">{fb.score}/10</span>
        <p>{fb.summary}</p>
      </div>
      {fb.strengths.length > 0 && (
        <div>
          <p className="eyebrow mb-1 text-polder">Goed gedaan</p>
          <ul className="list-inside list-disc text-sm">
            {fb.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {fb.fixes.length > 0 && (
        <div>
          <p className="eyebrow mb-1 text-oranje">Verbeteringen</p>
          <ul className="space-y-1.5 text-sm">
            {fb.fixes.map((f, i) => (
              <li key={i}>
                <span className="text-tulip line-through">{f.wrong}</span> → <strong className="text-polder">{f.right}</strong>
                <span className="block text-muted">{f.why}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {fb.newWords.length > 0 && (
        <div>
          <p className="eyebrow mb-1">Handige woorden</p>
          <div className="flex flex-wrap gap-1.5">
            {fb.newWords.map((w) => (
              <button key={w.nl} className="chip hover:border-cobalt" onClick={() => speak(w.nl)}>
                <span lang="nl" className="text-ink">
                  {w.nl}
                </span>{' '}
                — {w.en}
              </button>
            ))}
          </div>
        </div>
      )}
      <button className="btn-primary w-full" onClick={onDone}>
        Continue <Icon name="arrowRight" size={18} />
      </button>
    </div>
  );
}

/** Role-play conversation with the AI tutor. Needs the learner's own API key. */
export function TutorChat({ scenario: id, onDone }: { scenario: string; onDone: () => void }) {
  const scenario = getScenario(id) ?? TUTOR_SCENARIOS[0];
  const settings = useStore((s) => s.settings);
  const answerSkill = useStore((s) => s.answer);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', text: scenario.opener }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ended, setEnded] = useState(false);
  const [fb, setFb] = useState<TutorFeedback | null>(null);
  const [recording, setRecording] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (settings.apiKey) speak(scenario.opener, { speaker: 1 });
  }, [scenario, settings.apiKey]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy]);

  if (!settings.apiKey) {
    return (
      <div className="card flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cobalt-soft text-cobalt">
            <Icon name="chat" />
          </div>
          <div>
            <p className="eyebrow">Rollenspel</p>
            <h2 className="text-2xl">{scenario.title}</h2>
          </div>
        </div>
        <p className="text-muted">
          The AI conversation partner needs your own Anthropic API key. Add it in{' '}
          <Link to="/settings" className="text-cobalt underline">
            Settings
          </Link>
          . Until then, practise this situation out loud with these phrases:
        </p>
        <p className="font-display text-xl" lang="nl">
          “{scenario.opener}”
        </p>
        <ul className="grid gap-2">
          {scenario.hints.map((h) => (
            <li key={h} className="flex items-center gap-2">
              <SpeakButton text={h.replace('…', '')} size="sm" />
              <span lang="nl">{h}</span>
            </li>
          ))}
        </ul>
        <button className="btn-primary" onClick={onDone}>
          Done <Icon name="check" size={18} />
        </button>
      </div>
    );
  }

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setInput('');
    setError('');
    const history: Msg[] = [...msgs, { role: 'user', text: t }];
    setMsgs(history);
    setBusy(true);
    try {
      const r = await tutorTurn(settings.apiKey!, settings.model, scenario, history);
      answerSkill('spreken', !r.correction);
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { ...copy[copy.length - 1], correction: r.correction, why: r.why };
        return [...copy, { role: 'assistant', text: r.reply, en: r.en }];
      });
      speak(r.reply, { speaker: 1 });
      if (r.done) setEnded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
    setBusy(false);
  };

  const finish = async () => {
    setBusy(true);
    try {
      setFb(await tutorFeedback(settings.apiKey!, settings.model, scenario, msgs));
      sfx.done();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
    setBusy(false);
  };

  const mic = async () => {
    if (recording) return;
    setRecording(true);
    try {
      const l = listen(setInput);
      const text = await l.done;
      setRecording(false);
      if (text) send(text);
    } catch (e) {
      setRecording(false);
      setError(e instanceof Error ? e.message : 'Microphone error');
    }
  };

  if (fb) return <FeedbackView fb={fb} onDone={onDone} />;

  return (
    <div className="flex h-[calc(100dvh-11rem)] flex-col md:h-[calc(100dvh-6rem)]">
      <header className="mb-3 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-oranje/15 text-oranje">
          <Icon name="chat" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl">{scenario.title}</h2>
          <p className="truncate text-xs text-muted">Goal: {scenario.goal}</p>
        </div>
        <button className="btn-ghost px-3 py-2 text-sm" onClick={finish} disabled={busy || msgs.length < 3}>
          Finish
        </button>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto rounded-tile border border-line bg-glaze/60 p-4">
        {msgs.map((m, i) => (
          <Bubble key={i} m={m} />
        ))}
        <AnimatePresence>
          {busy && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1 pl-2">
              {[0, 1, 2].map((d) => (
                <motion.span key={d} className="h-2 w-2 rounded-full bg-muted" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {ended && !busy && (
          <div className="rounded-2xl bg-[rgb(var(--polder)/0.12)] p-3 text-center text-sm">
            Goal reached! Tap <strong>Finish</strong> for your feedback.
          </div>
        )}
        <div ref={endRef} />
      </div>
      {error && <p className="mt-2 text-sm text-tulip">{error}</p>}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {scenario.hints.map((h) => (
          <button key={h} className="chip hover:border-cobalt" onClick={() => setInput(h.replace('…', ''))} lang="nl">
            {h}
          </button>
        ))}
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        {sttSupported() && (
          <button type="button" onClick={mic} className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${recording ? 'bg-tulip text-white' : 'bg-cobalt-soft text-cobalt'}`} aria-label="Speak">
            <Icon name="mic" />
          </button>
        )}
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Antwoord in het Nederlands…" lang="nl" disabled={busy} />
        <button className="btn-primary px-4" disabled={busy || !input.trim()} aria-label="Send">
          <Icon name="arrowRight" />
        </button>
      </form>
    </div>
  );
}
