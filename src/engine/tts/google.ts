/* Google Cloud Text-to-Speech, called directly from the browser with the learner's own API key.
   Restrict the key in Google Cloud to the Text-to-Speech API and to this site's address. */

const API = 'https://texttospeech.googleapis.com/v1';

export interface GoogleVoice {
  name: string;
  gender: 'MALE' | 'FEMALE' | 'NEUTRAL' | string;
  tier: 'chirp' | 'neural' | 'wavenet' | 'standard';
}

function tierOf(name: string): GoogleVoice['tier'] {
  if (/Chirp/i.test(name)) return 'chirp';
  if (/Neural2|Studio|Polyglot/i.test(name)) return 'neural';
  if (/Wavenet/i.test(name)) return 'wavenet';
  return 'standard';
}

const TIER_RANK: Record<GoogleVoice['tier'], number> = { chirp: 0, neural: 1, wavenet: 2, standard: 3 };

async function errorText(res: Response): Promise<string> {
  try {
    const j = await res.json();
    return j?.error?.message ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

/** Dutch (Netherlands) voices for this key, most natural first. */
export async function googleVoices(key: string): Promise<GoogleVoice[]> {
  const res = await fetch(`${API}/voices?languageCode=nl-NL&key=${encodeURIComponent(key)}`);
  if (!res.ok) throw new Error(await errorText(res));
  const data = (await res.json()) as { voices?: { name: string; ssmlGender: string; languageCodes: string[] }[] };
  return (data.voices ?? [])
    .filter((v) => v.languageCodes.includes('nl-NL'))
    .map((v) => ({ name: v.name, gender: v.ssmlGender, tier: tierOf(v.name) }))
    .sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier] || a.name.localeCompare(b.name));
}

/** Two default voices for dialogues: the best female and the best male voice. */
export function defaultGooglePair(voices: GoogleVoice[]): [string | undefined, string | undefined] {
  const best = voices[0]?.tier;
  const top = voices.filter((v) => v.tier === best);
  const female = top.find((v) => v.gender === 'FEMALE') ?? voices.find((v) => v.gender === 'FEMALE');
  const male = top.find((v) => v.gender === 'MALE') ?? voices.find((v) => v.gender === 'MALE');
  return [female?.name ?? voices[0]?.name, male?.name ?? voices[1]?.name];
}

export async function googleSpeak(key: string, voice: string, text: string): Promise<Blob> {
  const res = await fetch(`${API}/text:synthesize?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: 'nl-NL', name: voice },
      audioConfig: { audioEncoding: 'MP3' },
    }),
  });
  if (!res.ok) throw new Error(await errorText(res));
  const { audioContent } = (await res.json()) as { audioContent: string };
  const bytes = Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0));
  return new Blob([bytes], { type: 'audio/mpeg' });
}
