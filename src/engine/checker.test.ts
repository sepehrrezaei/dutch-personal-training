import { describe, expect, it } from 'vitest';
import { check, normalize, speechScore, tokenize } from './checker';

describe('check', () => {
  it('accepts exact answers regardless of case and punctuation', () => {
    expect(check('Ik woon in Delft.', 'ik woon in Delft').verdict).toBe('correct');
  });
  it('forgives missing accents but notes them', () => {
    const r = check('tweeentwintig', 'tweeëntwintig');
    expect(r.ok).toBe(true);
    expect(r.verdict).toBe('accent');
  });
  it('forgives a small typo on longer words', () => {
    expect(check('telefonnummer', 'telefoonnummer').verdict).toBe('typo');
  });
  it('does not forgive typos on short words', () => {
    expect(check('han', 'hen').ok).toBe(false);
  });
  it('flags a wrong or missing article', () => {
    expect(check('het tafel', 'de tafel')).toMatchObject({ verdict: 'article', ok: false });
    expect(check('tafel', 'de tafel')).toMatchObject({ verdict: 'article', ok: false });
  });
  it('picks the best of several accepted answers', () => {
    expect(check('Ze woont in Rotterdam', ['Zij woont in Rotterdam', 'Ze woont in Rotterdam']).verdict).toBe('correct');
  });
  it('rejects empty answers', () => {
    expect(check('  ', 'ja').ok).toBe(false);
  });
});

describe('normalize/tokenize', () => {
  it('keeps apostrophes used in Dutch', () => {
    expect(normalize("Hoe gaat 't?")).toBe("hoe gaat 't");
    expect(tokenize("Ik ga 's avonds.")).toEqual(['Ik', 'ga', "'s", 'avonds', '.']);
  });
});

describe('speechScore', () => {
  it('scores a full match as 1', () => {
    expect(speechScore('ik kom uit frankrijk', 'Ik kom uit Frankrijk.').score).toBe(1);
  });
  it('reports missed words', () => {
    const r = speechScore('ik kom frankrijk', 'Ik kom uit Frankrijk.');
    expect(r.score).toBeCloseTo(0.75);
    expect(r.missed).toEqual(['uit']);
  });
});
