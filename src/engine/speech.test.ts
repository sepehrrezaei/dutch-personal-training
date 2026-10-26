import { describe, expect, it } from 'vitest';
import { voiceLabel, voiceQuality } from './speech';

const v = (name: string, lang = 'nl-NL') => ({ name, lang, voiceURI: name, localService: true, default: false }) as SpeechSynthesisVoice;

describe('voice quality', () => {
  it('recognises natural, premium and basic voices', () => {
    expect(voiceQuality(v('Microsoft Fenna Online (Natural) - Dutch (Netherlands)'))).toBe('natural');
    expect(voiceQuality(v('Xander (Enhanced)'))).toBe('premium');
    expect(voiceQuality(v('Claire (Premium)'))).toBe('premium');
    expect(voiceQuality(v('Google Nederlands'))).toBe('premium');
    expect(voiceQuality(v('Xander'))).toBe('basic');
  });
  it('makes readable labels', () => {
    expect(voiceLabel(v('Microsoft Fenna Online (Natural) - Dutch (Netherlands)'))).toBe('Fenna (Netherlands) · natural');
    expect(voiceLabel(v('Ellen', 'nl-BE'))).toBe('Ellen (Belgium) · basic');
  });
});
