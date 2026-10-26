/* Generated speech is cached in the browser (Cache Storage), so each sentence is synthesised once:
   repeats play instantly, work offline, and don't cost API calls again. */

const CACHE = 'tegel-tts-v1';

async function key(engine: string, voice: string, text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(`${engine}|${voice}|${text}`));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `https://tts.tegel.local/${engine}/${hex}`;
}

export async function cached(engine: string, voice: string, text: string, make: () => Promise<Blob>): Promise<Blob> {
  if (typeof caches === 'undefined') return make();
  const k = await key(engine, voice, text);
  let cache: Cache | null = null;
  try {
    cache = await caches.open(CACHE);
    const hit = await cache.match(k);
    if (hit) return await hit.blob();
  } catch {
    cache = null;
  }
  const blob = await make();
  cache?.put(k, new Response(blob, { headers: { 'Content-Type': blob.type } })).catch(() => {});
  return blob;
}

export async function clearSpeechCache(): Promise<void> {
  if (typeof caches !== 'undefined') await caches.delete(CACHE);
}
