/// <reference lib="webworker" />
/* Runs Piper (open-source neural TTS, ONNX/WebAssembly) off the main thread so the UI never freezes. */
import { download, stored, TtsSession } from '@mintplex-labs/piper-tts-web';

type Request =
  | { id: number; type: 'speak'; voiceId: string; text: string; background?: boolean }
  | { id: number; type: 'download'; voiceId: string }
  | { id: number; type: 'stored' };

let session: TtsSession | null = null;
let sessionVoice = '';

async function createSession(voiceId: string): Promise<TtsSession> {
  // TtsSession is a singleton inside the library; reset it so a new voice really loads.
  (TtsSession as unknown as { _instance: TtsSession | null })._instance = null;
  session = await TtsSession.create({ voiceId });
  sessionVoice = voiceId;
  return session;
}

async function synthesize(voiceId: string, text: string): Promise<Blob> {
  if (!session || sessionVoice !== voiceId) {
    try {
      await createSession(voiceId);
    } catch {
      // Right after a download the model file can still be settling; try once more.
      await new Promise((r) => setTimeout(r, 500));
      await createSession(voiceId);
    }
  }
  return session!.predict(text);
}

async function handle(msg: Request) {
  try {
    if (msg.type === 'stored') {
      self.postMessage({ id: msg.id, ok: true, value: await stored() });
    } else if (msg.type === 'download') {
      await download(msg.voiceId, (p) => self.postMessage({ id: msg.id, progress: p.total ? p.loaded / p.total : 0 }));
      session = null;
      self.postMessage({ id: msg.id, ok: true });
    } else {
      self.postMessage({ id: msg.id, ok: true, value: await synthesize(msg.voiceId, msg.text) });
    }
  } catch (err) {
    session = null;
    self.postMessage({ id: msg.id, ok: false, error: err instanceof Error ? err.message : String(err) });
  }
}

// One request at a time (the ONNX session must not run two inferences at once), and sentences the
// learner is waiting for go before background prefetches.
const urgent: Request[] = [];
const background: Request[] = [];
let busy = false;

async function pump() {
  if (busy) return;
  busy = true;
  while (urgent.length || background.length) await handle((urgent.shift() ?? background.shift())!);
  busy = false;
}

self.onmessage = (e: MessageEvent<Request>) => {
  const msg = e.data;
  (msg.type === 'speak' && msg.background ? background : urgent).push(msg);
  pump();
};
