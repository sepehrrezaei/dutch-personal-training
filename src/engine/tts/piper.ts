/* Client for the Piper worker: on-device neural Dutch voices. The model (~60 MB) downloads once
   from Hugging Face and is kept in the browser's private file storage, so it then works offline. */

export const PIPER_VOICES = [
  { id: 'nl_NL-mls-medium', label: 'Netherlands · mixed speaker', size: 77 },
  { id: 'nl_BE-nathalie-medium', label: 'Nathalie · Flemish accent, clearest', size: 63 },
  { id: 'nl_BE-rdh-medium', label: 'RDH · Flemish accent, male', size: 63 },
];

let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void; progress?: (p: number) => void }>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./piperWorker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e) => {
    const { id, ok, value, error, progress } = e.data as { id: number; ok?: boolean; value?: unknown; error?: string; progress?: number };
    const p = pending.get(id);
    if (!p) return;
    if (progress !== undefined) {
      p.progress?.(progress);
      return;
    }
    pending.delete(id);
    if (ok) p.resolve(value);
    else p.reject(new Error(error ?? 'Piper error'));
  };
  return worker;
}

function call<T>(msg: Record<string, unknown>, progress?: (p: number) => void): Promise<T> {
  const id = nextId++;
  return new Promise<T>((resolve, reject) => {
    pending.set(id, { resolve: resolve as (v: unknown) => void, reject, progress });
    getWorker().postMessage({ id, ...msg });
  });
}

export function piperSupported(): boolean {
  return typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined' && !!navigator.storage?.getDirectory;
}

export function piperStored(): Promise<string[]> {
  return call<string[]>({ type: 'stored' });
}

export function piperDownload(voiceId: string, onProgress: (p: number) => void): Promise<void> {
  return call<void>({ type: 'download', voiceId }, onProgress);
}

export function piperSpeak(voiceId: string, text: string, background = false): Promise<Blob> {
  return call<Blob>({ type: 'speak', voiceId, text, background });
}
