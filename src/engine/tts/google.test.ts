import { afterEach, describe, expect, it, vi } from 'vitest';
import { defaultGooglePair, googleSpeak, googleVoices } from './google';

afterEach(() => vi.unstubAllGlobals());

describe('google tts', () => {
  it('lists Dutch voices, most natural first, and picks a female + male pair', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            voices: [
              { name: 'nl-NL-Standard-A', ssmlGender: 'FEMALE', languageCodes: ['nl-NL'] },
              { name: 'nl-NL-Wavenet-B', ssmlGender: 'MALE', languageCodes: ['nl-NL'] },
              { name: 'nl-NL-Chirp3-HD-Charon', ssmlGender: 'MALE', languageCodes: ['nl-NL'] },
              { name: 'nl-NL-Chirp3-HD-Aoede', ssmlGender: 'FEMALE', languageCodes: ['nl-NL'] },
              { name: 'nl-BE-Wavenet-A', ssmlGender: 'FEMALE', languageCodes: ['nl-BE'] },
            ],
          }),
        ),
      ),
    );
    const voices = await googleVoices('k');
    expect(voices.map((v) => v.name)).toEqual(['nl-NL-Chirp3-HD-Aoede', 'nl-NL-Chirp3-HD-Charon', 'nl-NL-Wavenet-B', 'nl-NL-Standard-A']);
    expect(defaultGooglePair(voices)).toEqual(['nl-NL-Chirp3-HD-Aoede', 'nl-NL-Chirp3-HD-Charon']);
  });

  it('decodes synthesized MP3 audio', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ audioContent: btoa('ID3abc') }))));
    const blob = await googleSpeak('k', 'nl-NL-Chirp3-HD-Aoede', 'Hallo');
    expect(blob.type).toBe('audio/mpeg');
    expect(await blob.text()).toBe('ID3abc');
  });

  it('surfaces the API error message', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: { message: 'API key not valid' } }), { status: 400 })));
    await expect(googleVoices('bad')).rejects.toThrow('API key not valid');
  });
});
