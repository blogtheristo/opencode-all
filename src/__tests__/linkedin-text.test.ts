import { describe, expect, it } from 'vitest';
import { escapeLinkedInLittleText, normalizeLinkedInText } from '../utils/linkedin-text.js';

describe('normalizeLinkedInText', () => {
  it('keeps Finnish and Swedish letters intact', () => {
    const fi = 'Päärni — metsäteollisuus äöå';
    const sv = 'Öppen för en snabb demo?';
    expect(normalizeLinkedInText(fi)).toBe(fi);
    expect(normalizeLinkedInText(sv)).toBe(sv);
  });

  it('NFC-composes decomposed Scandinavian letters', () => {
    // a + combining diaeresis → ä
    const decomposed = 'Pa\u0308a\u0308rni';
    expect(normalizeLinkedInText(decomposed)).toBe('Päärni');
  });
});

describe('escapeLinkedInLittleText', () => {
  it('escapes reserved punctuation without touching Scandinavian letters', () => {
    const input = 'Risto Päärni (CEO) — #FitFor55 *pilot*_v1 @team';
    const out = escapeLinkedInLittleText(input);
    expect(out).toContain('Päärni');
    expect(out).toContain('\\(CEO\\)');
    expect(out).toContain('\\#FitFor55');
    expect(out).toContain('\\*pilot\\*\\_v1');
    expect(out).toContain('\\@team');
  });

  it('escapes backslash before other reserved chars', () => {
    expect(escapeLinkedInLittleText('a\\b(c)')).toBe('a\\\\b\\(c\\)');
  });
});
