import { useEffect, useState } from 'react';
import { onSpeechError, refreshPiperReady, speak } from '@/engine/speech';
import { clearSpeechCache } from '@/engine/tts/cache';
import { defaultGooglePair, googleVoices, type GoogleVoice } from '@/engine/tts/google';
import { PIPER_VOICES, piperDownload, piperSupported } from '@/engine/tts/piper';
import { Icon } from '@/design/icons';
import { Bar } from '@/design/ui';
import { toast } from '@/design/fx';
import { useStore } from '@/store/store';
import type { Settings } from '@/store/types';

const SAMPLE = 'Goedemorgen! Ik ben Ana en ik kom uit Brazilië. Hoe gaat het met jou?';

const ENGINES: { id: NonNullable<Settings['ttsEngine']>; title: string; text: string; icon: string }[] = [
  { id: 'device', title: 'Device voice', text: 'Built into your browser. Works everywhere, but often sounds robotic.', icon: 'speaker' },
  { id: 'piper', title: 'Piper', text: 'Open-source neural voice that runs on your device. One-time download, then free and offline.', icon: 'sparkles' },
  { id: 'google', title: 'Google Cloud', text: 'Google’s most natural voices, two speakers for dialogues. Needs your own API key.', icon: 'globe' },
];

function PiperPanel() {
  const settings = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);
  const voice = settings.piperVoice ?? PIPER_VOICES[0].id;
  const [ready, setReady] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    refreshPiperReady().then(setReady);
  }, []);

  if (!piperSupported()) return <p className="text-sm text-tulip">This browser can’t run Piper. Try a recent Chrome, Edge or Safari.</p>;

  const download = async () => {
    setError('');
    setProgress(0);
    try {
      await piperDownload(voice, setProgress);
      setReady(await refreshPiperReady());
      speak(SAMPLE);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed');
    }
    setProgress(null);
  };

  const meta = PIPER_VOICES.find((v) => v.id === voice)!;
  return (
    <div className="space-y-3">
      <label className="grid gap-1">
        <span className="text-sm font-semibold">Voice</span>
        <select className="input py-2 text-base" value={voice} onChange={(e) => update({ piperVoice: e.target.value })}>
          {PIPER_VOICES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label} {ready.has(v.id) ? '· downloaded' : `· ${v.size} MB`}
            </option>
          ))}
        </select>
      </label>
      {ready.has(voice) ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip border-polder/40 text-polder">
            <Icon name="check" size={13} /> Ready, works offline
          </span>
          <button className="btn-ghost py-2 text-sm" onClick={() => speak(SAMPLE)}>
            <Icon name="speaker" size={16} /> Listen
          </button>
        </div>
      ) : progress !== null ? (
        <div className="space-y-1">
          <Bar value={progress} />
          <p className="text-xs text-muted">Downloading {Math.round(progress * 100)}% of about {meta.size} MB…</p>
        </div>
      ) : (
        <button className="btn-primary py-2 text-sm" onClick={download}>
          <Icon name="download" size={16} /> Download voice ({meta.size} MB, once)
        </button>
      )}
      {error && <p className="text-sm text-tulip">{error}</p>}
      <p className="text-xs text-muted">
        Piper’s Dutch voices come from open datasets: the Netherlands voice is a mix of speakers, the Flemish voices are clearer but have a Belgian accent. The
        model is stored in this browser only; download it again on each device.
      </p>
    </div>
  );
}

function GooglePanel() {
  const settings = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);
  const [key, setKey] = useState(settings.googleTtsKey ?? '');
  const [voices, setVoices] = useState<GoogleVoice[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const load = async (k = key.trim()) => {
    if (!k) return;
    setState('loading');
    setError('');
    try {
      const list = await googleVoices(k);
      setVoices(list);
      const [a, b] = defaultGooglePair(list);
      update({
        googleTtsKey: k,
        googleVoice: list.some((v) => v.name === settings.googleVoice) ? settings.googleVoice : a,
        googleVoice2: list.some((v) => v.name === settings.googleVoice2) ? settings.googleVoice2 : b,
      });
      setState('idle');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach Google');
      setState('error');
    }
  };

  useEffect(() => {
    if (settings.googleTtsKey) load(settings.googleTtsKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label = (v: GoogleVoice) => `${v.name.replace('nl-NL-', '')} · ${v.gender === 'FEMALE' ? 'female' : v.gender === 'MALE' ? 'male' : 'neutral'} · ${v.tier}`;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="input py-2 text-base" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Google Cloud API key (AIza…)" autoComplete="off" />
        <button className="btn-primary shrink-0 py-2 text-sm" disabled={!key.trim() || state === 'loading'} onClick={() => load()}>
          {state === 'loading' ? 'Checking…' : 'Connect'}
        </button>
      </div>
      {error && <p className="text-sm text-tulip">{error}</p>}
      {voices.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ['googleVoice', 'Main voice', 0],
              ['googleVoice2', 'Second voice (dialogues)', 1],
            ] as const
          ).map(([field, title, speaker]) => (
            <label key={field} className="grid gap-1">
              <span className="text-sm font-semibold">{title}</span>
              <div className="flex gap-2">
                <select className="input py-2 text-sm" value={settings[field] ?? ''} onChange={(e) => update({ [field]: e.target.value })}>
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {label(v)}
                    </option>
                  ))}
                </select>
                <button className="btn-ghost shrink-0 px-3 py-2" aria-label="Listen" onClick={() => speak(SAMPLE, { speaker })}>
                  <Icon name="speaker" size={16} />
                </button>
              </div>
            </label>
          ))}
        </div>
      )}
      <details className="text-sm">
        <summary className="cursor-pointer font-semibold text-cobalt">How do I get a key?</summary>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-muted">
          <li>Go to console.cloud.google.com and create a project (a billing account is required, but normal use stays inside the free monthly quota).</li>
          <li>Enable the “Cloud Text-to-Speech API” for the project.</li>
          <li>Open APIs &amp; Services → Credentials → Create credentials → API key.</li>
          <li>Restrict the key: API restrictions → only Cloud Text-to-Speech; Website restrictions → your Tegel address (e.g. sepehrrezaei.github.io/*) and localhost.</li>
          <li>Paste the key here and press Connect.</li>
        </ol>
        <p className="mt-2 text-xs text-muted">The key is stored only in this browser and sent only to Google. Every sentence is generated once and then cached, so repeats cost nothing.</p>
      </details>
    </div>
  );
}

/** Choose how Dutch is read aloud: device voice, Piper (on-device, open source) or Google Cloud. */
export function VoiceEngine({ children }: { children: React.ReactNode }) {
  const engine = useStore((s) => s.settings.ttsEngine) ?? 'device';
  const update = useStore((s) => s.updateSettings);
  useEffect(
    () =>
      onSpeechError((m) => {
        if (m !== 'device') toast({ icon: 'speaker', title: 'Using the device voice', text: m });
      }),
    [],
  );
  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-2 sm:grid-cols-3">
        {ENGINES.map((e) => (
          <button
            key={e.id}
            onClick={() => update({ ttsEngine: e.id })}
            aria-pressed={engine === e.id}
            className={`rounded-2xl border-2 p-3 text-left transition ${engine === e.id ? 'border-cobalt bg-cobalt-soft/40' : 'border-line hover:border-muted'}`}
          >
            <span className="flex items-center gap-2 font-semibold">
              <Icon name={e.icon} size={18} className="text-cobalt" /> {e.title}
            </span>
            <span className="mt-1 block text-xs text-muted">{e.text}</span>
          </button>
        ))}
      </div>
      {engine === 'piper' && <PiperPanel />}
      {engine === 'google' && <GooglePanel />}
      {engine === 'device' && children}
      {engine !== 'device' && (
        <button
          className="text-xs text-muted underline-offset-2 hover:underline"
          onClick={async () => {
            await clearSpeechCache();
            toast({ icon: 'check', title: 'Saved audio cleared' });
          }}
        >
          Clear saved audio
        </button>
      )}
    </div>
  );
}
