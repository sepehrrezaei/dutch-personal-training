/* Browser speech: Dutch text-to-speech, speech recognition and a simple recorder. */
import { cached } from './tts/cache';
import { googleSpeak } from './tts/google';
import { piperSpeak, piperStored } from './tts/piper';

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

export type SpeechEngine = 'device' | 'piper' | 'google';

export interface SpeechConfig {
  rate: number;
  voiceURI?: string;
  voiceURI2?: string;
  engine?: SpeechEngine;
  piperVoice?: string;
  googleKey?: string;
  googleVoice?: string;
  googleVoice2?: string;
}

let config: SpeechConfig = { rate: 0.95 };
let piperReady = new Set<string>();

export function configureSpeech(c: SpeechConfig) {
  config = c;
  // Load the Piper model in the background so the first sentence plays quickly.
  if (c.engine === 'piper') refreshPiperReady().then(() => prefetch('Hallo.'));
}

/** Re-read which Piper voices are downloaded on this device. */
export async function refreshPiperReady(): Promise<Set<string>> {
  try {
    piperReady = new Set(await piperStored());
  } catch {
    piperReady = new Set();
  }
  return piperReady;
}

type ErrorListener = (message: string) => void;
const errorListeners = new Set<ErrorListener>();
/** Get notified when the selected voice engine fails and the device voice is used instead. */
export function onSpeechError(cb: ErrorListener): () => void {
  errorListeners.add(cb);
  return () => errorListeners.delete(cb);
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

/** Built-in browser voice. */
function deviceSpeak(text: string, opts: SpeakOptions): Promise<void> {
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

/** Generate (or fetch from cache) audio with the selected neural engine. */
async function synthesize(text: string, speaker = 0, background = false): Promise<Blob> {
  if (config.engine === 'google') {
    if (!config.googleKey) throw new Error('No Google API key set.');
    const voice = (speaker === 1 ? config.googleVoice2 : config.googleVoice) ?? config.googleVoice;
    if (!voice) throw new Error('No Google voice chosen.');
    return cached('google', voice, text, () => googleSpeak(config.googleKey!, voice, text));
  }
  if (config.engine === 'piper') {
    const voice = config.piperVoice ?? 'nl_NL-mls-medium';
    if (!piperReady.has(voice)) throw new Error('The Piper voice is not downloaded yet (Settings → Voice).');
    return cached('piper', voice, text, () => piperSpeak(voice, text, background));
  }
  throw new Error('device');
}

let current: { audio: HTMLAudioElement; done: () => void } | null = null;
let playToken = 0;

function playBlob(blob: Blob, rate: number): Promise<void> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.playbackRate = rate;
    audio.preservesPitch = true;
    const done = () => {
      URL.revokeObjectURL(url);
      if (current?.audio === audio) current = null;
      resolve();
    };
    current = { audio, done };
    audio.onended = done;
    audio.onerror = done;
    audio.play().catch(done);
  });
}

/** Speak Dutch text; resolves when finished (or immediately if speech is unavailable). */
export async function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  const engine = config.engine ?? 'device';
  if (engine === 'device' || opts.voiceURI) return deviceSpeak(text, opts);
  stopSpeaking();
  const token = ++playToken;
  try {
    const blob = await synthesize(text, opts.speaker);
    if (token !== playToken) return;
    // Neural voices sound natural at full speed; the learner's speed setting is applied on playback.
    await playBlob(blob, opts.rate ?? config.rate);
  } catch (err) {
    if (token !== playToken) return;
    const message = err instanceof Error ? err.message : String(err);
    errorListeners.forEach((cb) => cb(message));
    return deviceSpeak(text, opts);
  }
}

/** Generate audio in the background so it plays without delay later. */
export function prefetch(text: string, speaker = 0) {
  if ((config.engine ?? 'device') === 'device') return;
  synthesize(text, speaker, true).catch(() => {});
}

export function stopSpeaking() {
  playToken++;
  if (current) {
    current.audio.pause();
    current.done();
  }
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
    if (lines[i + 1]) prefetch(lines[i + 1].text, lines[i + 1].speaker);
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
