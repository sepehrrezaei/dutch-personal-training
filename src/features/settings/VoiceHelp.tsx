import { useEffect, useState } from 'react';
import { bestQuality, dutchVoices, onVoicesChanged, speak, voiceLabel, type VoiceQuality } from '@/engine/speech';
import { Icon } from '@/design/icons';

type Platform = 'edge' | 'mac' | 'ios' | 'android' | 'windows' | 'other';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'edge';
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/Macintosh/.test(ua)) return 'mac';
  if (/Windows/.test(ua)) return 'windows';
  return 'other';
}

const STEPS: Record<Platform, { title: string; steps: string[] }> = {
  edge: {
    title: 'Microsoft Edge',
    steps: ['Edge has natural Dutch voices built in (Fenna, Maarten, Colette). They need an internet connection.', 'Choose one marked "natural" below.'],
  },
  mac: {
    title: 'Mac (Safari or Chrome)',
    steps: [
      'Open System Settings → Accessibility → Spoken Content.',
      'Next to "System voice", click the ⓘ / Manage Voices… button.',
      'Find Dutch and download a voice marked Premium or Enhanced (e.g. Xander or Claire).',
      'Quit and reopen your browser, then pick that voice below.',
      'Easiest alternative: open Tegel in Microsoft Edge, which has natural voices built in.',
    ],
  },
  ios: {
    title: 'iPhone / iPad',
    steps: [
      'Open Settings → Accessibility → Spoken Content → Voices → Dutch.',
      'Tap a voice and download its Premium or Enhanced version (e.g. Xander or Claire).',
      'Close Tegel completely and open it again, then pick that voice below.',
    ],
  },
  android: {
    title: 'Android',
    steps: [
      'Open Settings → System → Languages → Text-to-speech output and choose "Speech Services by Google".',
      'Tap the gear → Install voice data → Dutch (Netherlands) and download it.',
      'Reopen Tegel in Chrome and pick "Google Nederlands" below.',
    ],
  },
  windows: {
    title: 'Windows',
    steps: [
      'Easiest: open Tegel in Microsoft Edge, which has natural Dutch voices built in.',
      'In Chrome, pick "Google Nederlands" below (needs internet).',
      'Or add a Dutch voice in Settings → Time & language → Speech → Add voices.',
    ],
  },
  other: {
    title: 'Your browser',
    steps: ['For the most natural sound, use Microsoft Edge, or Chrome with "Google Nederlands".'],
  },
};

const QUALITY_TEXT: Record<VoiceQuality, { label: string; tone: string; text: string }> = {
  natural: { label: 'Natural voice', tone: 'text-polder border-polder/40', text: 'You have a natural Dutch voice. This is the best quality available.' },
  premium: { label: 'Good voice', tone: 'text-cobalt border-cobalt/40', text: 'Your Dutch voice is good. A natural voice (Edge) sounds even more like a real person.' },
  basic: { label: 'Basic voice', tone: 'text-tulip border-tulip/40', text: 'Your device only has a basic Dutch voice, which sounds robotic. You can get a much better one for free:' },
};

export function useDutchVoices() {
  const [voices, setVoices] = useState(dutchVoices());
  useEffect(() => {
    setVoices(dutchVoices());
    return onVoicesChanged(() => setVoices(dutchVoices()));
  }, []);
  return voices;
}

/** Shows how natural the available voice is, and how to get a better one on this device. */
export function VoiceHelp({ compact = false }: { compact?: boolean }) {
  const voices = useDutchVoices();
  const quality = voices.length ? bestQuality() : null;
  const platform = detectPlatform();
  const [open, setOpen] = useState(!compact);
  const info = quality ? QUALITY_TEXT[quality] : null;
  const steps = STEPS[platform];

  return (
    <div className="rounded-2xl border border-line bg-glaze/60 p-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`chip ${info?.tone ?? 'border-tulip/40 text-tulip'}`}>
          <Icon name="speaker" size={13} /> {info?.label ?? 'No Dutch voice'}
        </span>
        {voices[0] && <span className="text-muted">Best on this device: {voiceLabel(voices[0])}</span>}
        <button className="ml-auto font-semibold text-cobalt" onClick={() => speak('Hallo! Zo klinkt mijn stem. Hoe vind je het?')}>
          Listen
        </button>
      </div>
      <p className="mt-2">{info?.text ?? 'This browser has no Dutch voice yet. Here is how to add one for free:'}</p>
      {quality !== 'natural' && (
        <>
          {compact && !open ? (
            <button className="mt-2 font-semibold text-cobalt" onClick={() => setOpen(true)}>
              Show me how →
            </button>
          ) : (
            <div className="mt-3">
              <p className="mb-1 font-semibold">{steps.title}</p>
              <ol className="list-inside list-decimal space-y-1 text-muted">
                {steps.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}
    </div>
  );
}
