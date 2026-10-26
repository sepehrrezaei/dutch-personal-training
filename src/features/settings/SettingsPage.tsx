import { useRef, useState } from 'react';
import { AI_MODELS, tutorTurn } from '@/engine/ai';
import { speak, voiceLabel } from '@/engine/speech';
import { useDutchVoices, VoiceHelp } from './VoiceHelp';
import { VoiceEngine } from './VoiceEngine';
import { Icon } from '@/design/icons';
import { Modal, PageHeader } from '@/design/ui';
import { toast } from '@/design/fx';
import { snapshot, useStore } from '@/store/store';
import type { AppData, Settings } from '@/store/types';

const STYLES: { id: Settings['style']; name: string; blurb: string; bg: string; swatches: string[]; display: string; weight: number }[] = [
  { id: 'claude', name: 'Claude', blurb: 'Warm ivory, clay accents, serif reading text', bg: '#F0EEE6', swatches: ['#C96442', '#4F6BBF', '#1F1E1D'], display: "'Source Serif 4 Variable', serif", weight: 500 },
  { id: 'intellij', name: 'IntelliJ', blurb: 'New UI colours, JetBrains Mono and Inter', bg: '#1E1F22', swatches: ['#3574F0', '#C77DBB', '#5FB865'], display: "'JetBrains Mono Variable', monospace", weight: 600 },
  { id: 'delft', name: 'Delft', blurb: 'The original cobalt tiles on cream', bg: '#F6F0E3', swatches: ['#1D3F8F', '#F07A1A', '#D6442F'], display: 'Gloock, serif', weight: 400 },
];

function VoiceSelect({ value, onChange, voices, speaker }: { value?: string; onChange: (v: string | undefined) => void; voices: SpeechSynthesisVoice[]; speaker?: number }) {
  return (
    <div className="flex gap-2">
      <select className="input py-2 text-base" value={value ?? ''} onChange={(e) => onChange(e.target.value || undefined)}>
        <option value="">Automatic — best available</option>
        {voices.map((v) => (
          <option key={v.voiceURI} value={v.voiceURI}>
            {voiceLabel(v)}
          </option>
        ))}
      </select>
      <button
        className="btn-ghost shrink-0 px-3 py-2"
        aria-label="Listen to this voice"
        onClick={() => speak('Hallo, ik ben je Nederlandse stem.', value ? { voiceURI: value } : { speaker })}
      >
        <Icon name="speaker" size={18} />
      </button>
    </div>
  );
}

function Row({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-line py-4 last:border-0 sm:flex-row sm:items-center">
      <div className="sm:w-1/2">
        <p className="font-semibold">{title}</p>
        {hint && <p className="text-sm text-muted">{hint}</p>}
      </div>
      <div className="sm:w-1/2">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);
  const replaceAll = useStore((s) => s.replaceAll);
  const reset = useStore((s) => s.reset);
  const voices = useDutchVoices();
  const [key, setKey] = useState(settings.apiKey ?? '');
  const [testing, setTesting] = useState<'idle' | 'busy' | 'ok' | string>('idle');
  const [confirmReset, setConfirmReset] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(snapshot(), null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tegel-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = async (f: File) => {
    try {
      const data = JSON.parse(await f.text()) as AppData;
      if (data.version !== 1 || typeof data.lessons !== 'object') throw new Error('Not a Tegel progress file');
      replaceAll(data);
      toast({ icon: 'check', title: 'Progress imported' });
    } catch (e) {
      toast({ icon: 'x', title: 'Import failed', text: e instanceof Error ? e.message : undefined });
    }
  };

  const testKey = async () => {
    setTesting('busy');
    try {
      await tutorTurn(key.trim(), settings.model, { role: 'a friendly classmate', goal: 'say hello', opener: 'Hoi!' }, [
        { role: 'assistant', text: 'Hoi!' },
        { role: 'user', text: 'Hallo!' },
      ]);
      setTesting('ok');
    } catch (e) {
      setTesting(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Instellingen" title="Settings" />

      <section className="card px-5">
        <Row title="Your name">
          <input className="input py-2 text-base" value={settings.name ?? ''} onChange={(e) => update({ name: e.target.value || undefined })} />
        </Row>
        <div className="border-b border-line py-4">
          <p className="mb-3 font-semibold">Style</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {STYLES.map((st) => {
              const active = (settings.style ?? 'claude') === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => update({ style: st.id })}
                  className={`overflow-hidden rounded-2xl border-2 text-left transition ${active ? 'border-cobalt' : 'border-line hover:border-muted'}`}
                  aria-pressed={active}
                >
                  <div className="flex h-16 items-end gap-1.5 p-3" style={{ background: st.bg }}>
                    {st.swatches.map((c) => (
                      <span key={c} className="h-6 w-6 rounded-md" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="p-3">
                    <p className="text-lg leading-tight" style={{ fontFamily: st.display, fontWeight: st.weight }}>
                      {st.name}
                    </p>
                    <p className="text-xs text-muted">{st.blurb}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <Row title="Light or dark">
          <div className="grid grid-cols-3 gap-2">
            {(['system', 'light', 'dark'] as const).map((t) => (
              <button key={t} className={settings.theme === t ? 'btn-primary py-2 text-sm' : 'btn-ghost py-2 text-sm'} onClick={() => update({ theme: t })}>
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </Row>
        <Row title="Weekend session" hint="Saturday and Sunday. Weekdays are always 30 minutes or less.">
          <div className="grid grid-cols-3 gap-2">
            {([60, 90, 120] as const).map((m) => (
              <button key={m} className={settings.weekendMinutes === m ? 'btn-primary py-2 text-sm' : 'btn-ghost py-2 text-sm'} onClick={() => update({ weekendMinutes: m })}>
                {m} min
              </button>
            ))}
          </div>
        </Row>
        <Row title="Sound effects">
          <button className={settings.sound ? 'btn-primary py-2 text-sm' : 'btn-ghost py-2 text-sm'} onClick={() => update({ sound: !settings.sound })}>
            {settings.sound ? 'On' : 'Off'}
          </button>
        </Row>
      </section>

      <section className="card px-5">
        <h2 className="pt-5 text-xl">Voice</h2>
        <VoiceEngine>
          <VoiceHelp />
          <Row title="Main voice">
            <VoiceSelect value={settings.voiceURI} onChange={(voiceURI) => update({ voiceURI })} voices={voices} />
          </Row>
          <Row title="Second voice" hint="Used for the other person in dialogues.">
            <VoiceSelect value={settings.voiceURI2} onChange={(voiceURI2) => update({ voiceURI2 })} voices={voices} speaker={1} />
          </Row>
        </VoiceEngine>
        <Row title={`Speaking speed: ${settings.rate.toFixed(2)}×`}>
          <div className="flex items-center gap-3">
            <input type="range" min={0.6} max={1.2} step={0.05} value={settings.rate} onChange={(e) => update({ rate: Number(e.target.value) })} className="flex-1 accent-[rgb(var(--cobalt))]" />
            <button className="btn-ghost px-3 py-2" onClick={() => speak('Goedemorgen! Hoe gaat het met je?')} aria-label="Test voice">
              <Icon name="speaker" size={18} />
            </button>
          </div>
        </Row>
      </section>

      <section className="card px-5">
        <h2 className="pt-5 text-xl">AI tutor (optional)</h2>
        <p className="mt-1 text-sm text-muted">
          Paste your own Anthropic API key to unlock role-play conversations and AI feedback on writing and speaking. The key is stored only in this browser
          (IndexedDB) and is sent only to api.anthropic.com. Usage is billed to your Anthropic account.
        </p>
        <Row title="API key">
          <div className="flex gap-2">
            <input className="input py-2 text-base" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-ant-…" autoComplete="off" />
            <button className="btn-primary py-2 text-sm" onClick={() => update({ apiKey: key.trim() || undefined })}>
              Save
            </button>
          </div>
        </Row>
        <Row title="Model">
          <select className="input py-2 text-base" value={settings.model} onChange={(e) => update({ model: e.target.value })}>
            {AI_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </Row>
        <Row title="Check the key">
          <div className="flex items-center gap-3">
            <button className="btn-ghost py-2 text-sm" disabled={!key.trim() || testing === 'busy'} onClick={testKey}>
              {testing === 'busy' ? 'Testing…' : 'Test connection'}
            </button>
            {testing === 'ok' && <span className="text-sm text-polder">Works!</span>}
            {testing !== 'ok' && testing !== 'busy' && testing !== 'idle' && <span className="text-sm text-tulip">{testing}</span>}
          </div>
        </Row>
        {settings.apiKey && (
          <Row title="Remove key">
            <button
              className="btn-ghost py-2 text-sm"
              onClick={() => {
                update({ apiKey: undefined });
                setKey('');
              }}
            >
              Remove
            </button>
          </Row>
        )}
      </section>

      <section className="card px-5">
        <h2 className="pt-5 text-xl">Your data</h2>
        <p className="mt-1 text-sm text-muted">Progress is saved on this device. Export it to move to your phone or laptop, then import it there.</p>
        <Row title="Export / import">
          <div className="flex gap-2">
            <button className="btn-ghost py-2 text-sm" onClick={exportData}>
              <Icon name="download" size={16} /> Export
            </button>
            <button className="btn-ghost py-2 text-sm" onClick={() => file.current?.click()}>
              <Icon name="upload" size={16} /> Import
            </button>
            <input ref={file} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
          </div>
        </Row>
        <Row title="Start over" hint="Deletes all progress on this device.">
          <button className="btn-ghost py-2 text-sm text-tulip" onClick={() => setConfirmReset(true)}>
            Reset progress
          </button>
        </Row>
      </section>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Reset all progress?">
        <p className="mb-4 text-muted">This removes lessons, words, streak and settings on this device. Export first if you want a backup.</p>
        <div className="flex gap-2">
          <button className="btn-ghost flex-1" onClick={() => setConfirmReset(false)}>
            Cancel
          </button>
          <button
            className="btn flex-1 bg-tulip text-white"
            onClick={() => {
              reset();
              setConfirmReset(false);
            }}
          >
            Reset
          </button>
        </div>
      </Modal>
    </div>
  );
}
