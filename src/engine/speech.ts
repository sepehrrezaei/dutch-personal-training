/* Browser speech: Dutch text-to-speech, speech recognition and a simple recorder. */

let voicesCache: SpeechSynthesisVoice[] = [];

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export type VoiceQuality = 'natural' | 'premium' | 'basic';

/**
 * How natural a voice sounds, guessed from its name:
 * natural = neural voices (Edge "Online (Natural)", Android network voices),
 * premium = Apple Premium/Enhanced voices and Google's Chrome voices, basic = compact system voices.
 */
export function voiceQuality(v: SpeechSynthesisVoice): VoiceQuality {
  if (/natural|neural|online|wavenet/i.test(v.name)) return 'natural';
  if (/premium|enhanced|verbeterd|hoogwaardig|google|siri/i.test(v.name)) return 'premium';
  return 'basic';
}

const QUALITY_RANK: Record<VoiceQuality, number> = { natural: 0, premium: 10, basic: 20 };

/** Dutch voices, best first: quality, then Netherlands Dutch before Flemish. */
export function dutchVoices(): SpeechSynthesisVoice[] {
  if (!ttsSupported()) return [];
  const all = window.speechSynthesis.getVoices();
  if (all.length) voicesCache = all;
  const nl = voicesCache.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('nl'));
  const rank = (v: SpeechSynthesisVoice) => QUALITY_RANK[voiceQuality(v)] + (v.lang.toLowerCase().replace('_', '-') === 'nl-nl' ? 0 : 3);
  return nl.sort((a, b) => rank(a) - rank(b));
}

/** The best quality available on this device, or null when there is no Dutch voice at all. */
export function bestQuality(): VoiceQuality | null {
  const v = dutchVoices()[0];
  return v ? voiceQuality(v) : null;
}

/** A readable label for a voice: "Fenna (Netherlands) · natural". */
export function voiceLabel(v: SpeechSynthesisVoice): string {
  const name = v.name
    .replace(/^Microsoft\s+/i, '')
    .replace(/\s*Online \(Natural\)/i, '')
    .replace(/\s*-\s*Dutch.*$/i, '');
  const region = v.lang.toLowerCase().includes('be') ? 'Belgium' : 'Netherlands';
  return `${name} (${region}) · ${voiceQuality(v)}`;
}

export function onVoicesChanged(cb: () => void): () => void {
  if (!ttsSupported()) return () => {};
  window.speechSynthesis.addEventListener('voiceschanged', cb);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', cb);
}

export interface SpeakOptions {
  rate?: number;
  voiceURI?: string;
  /** 0 = primary voice, 1 = second voice for the other speaker in dialogues. */
  speaker?: number;
}

let config: { rate: number; voiceURI?: string; voiceURI2?: string } = { rate: 0.95 };

export function configureSpeech(c: { rate: number; voiceURI?: string; voiceURI2?: string }) {
  config = c;
}

function pickVoice(opts: SpeakOptions): SpeechSynthesisVoice | undefined {
  const voices = dutchVoices();
  if (!voices.length) return undefined;
  const wanted = opts.voiceURI ?? (opts.speaker === 1 ? config.voiceURI2 : config.voiceURI);
  const exact = wanted ? voices.find((v) => v.voiceURI === wanted) : undefined;
  if (exact) return exact;
  if (opts.speaker === 1) {
    // Second speaker: the best voice that differs from the main one, so dialogues have two people.
    const primary = (config.voiceURI && voices.find((v) => v.voiceURI === config.voiceURI)) || voices[0];
    return voices.find((v) => v !== primary && v.name.split(' ')[0] !== primary.name.split(' ')[0]) ?? voices.find((v) => v !== primary) ?? primary;
  }
  return voices[0];
}

/** Speak Dutch text; resolves when finished (or immediately if speech is unavailable). */
export function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  if (!ttsSupported()) return Promise.resolve();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'nl-NL';
    const v = pickVoice(opts);
    if (v) u.voice = v;
    u.rate = opts.rate ?? config.rate;
    // A different pitch helps tell speakers apart when only one Dutch voice is installed.
    if (opts.speaker === 1 && dutchVoices().length < 2) u.pitch = 0.8;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel();
}

/** Speak a list of lines in order. `isCancelled` lets the caller stop between lines. */
export async function speakSequence(
  lines: { text: string; speaker?: number }[],
  opts: { rate?: number; gapMs?: number; onLine?: (i: number) => void; isCancelled?: () => boolean } = {},
) {
  for (let i = 0; i < lines.length; i++) {
    if (opts.isCancelled?.()) return;
    opts.onLine?.(i);
    await speak(lines[i].text, { rate: opts.rate, speaker: lines[i].speaker });
    if (opts.gapMs) await new Promise((r) => setTimeout(r, opts.gapMs));
  }
  opts.onLine?.(-1);
}

/* ---------- Speech recognition ---------- */

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

function recognitionCtor(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function sttSupported(): boolean {
  return !!recognitionCtor();
}

export interface Listening {
  stop(): void;
  done: Promise<string>;
}

/** Listen for Dutch speech. `onInterim` receives partial transcripts while the learner speaks. */
export function listen(onInterim?: (t: string) => void, continuous = false): Listening {
  const Ctor = recognitionCtor();
  if (!Ctor) return { stop() {}, done: Promise.reject(new Error('Speech recognition is not supported in this browser.')) };
  const rec = new Ctor();
  rec.lang = 'nl-NL';
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  rec.continuous = continuous;
  let finalText = '';
  let latest = '';
  const done = new Promise<string>((resolve, reject) => {
    rec.onresult = (e) => {
      let interim = '';
      finalText = '';
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript + ' ';
        else interim += r[0].transcript;
      }
      latest = (finalText + interim).trim();
      onInterim?.(latest);
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') resolve(latest);
      else reject(new Error(e.error === 'not-allowed' ? 'Microphone access was blocked.' : `Speech recognition error: ${e.error}`));
    };
    rec.onend = () => resolve((finalText || latest).trim());
  });
  rec.start();
  return { stop: () => rec.stop(), done };
}

/* ---------- Recorder (record yourself, play it back) ---------- */

export interface Recording {
  stop(): Promise<string>;
}

export async function record(): Promise<Recording> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  rec.start();
  return {
    stop: () =>
      new Promise((resolve) => {
        rec.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          resolve(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })));
        };
        rec.stop();
      }),
  };
}
