import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '../../..');

function readJson(rel: string) {
  return JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
}

describe('dws-dictionary shape', () => {
  const dict = readJson('docs/localization/dws-dictionary.json') as {
    shared: Record<
      string,
      { en: string; fi: string; sv: string; de: string; fr: string; ontologyId?: string }
    >;
    industries: Record<
      string,
      {
        id: number;
        aegisInScope: boolean;
        terms: Record<string, { en: string; sv?: string }>;
        sources: string[];
        outreachUse: string;
      }
    >;
    bannedTokens: { sv: string[]; all: string[]; sovereigntyMustNotUse: string[] };
    kyaJev: { sku: string; role: string; specVersion: string };
  };

  it('has industries 1–25 once each', () => {
    const ids = Object.keys(dict.industries)
      .map(Number)
      .sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    for (const id of ids) {
      expect(dict.industries[String(id)].id).toBe(id);
    }
  });

  it('records kya-jev as advisory bind, SKU only', () => {
    expect(dict.kyaJev.sku).toBe('KYA-JEV-001');
    expect(dict.kyaJev.role).toMatch(/advisory-only/);
    expect(dict.kyaJev.specVersion).toBe('0.8');
    expect(dict.shared.kya_jev.en).toBe('kya-jev');
    const spec = readFileSync(join(ROOT, 'docs/KYA_JEV_SPECIFICATION.md'), 'utf8');
    const latest = spec.match(/^Version: (\d+)\.(\d+) \[Latest\]$/m);
    if (!latest) throw new Error('Specification latest version is missing');
    const [, major, minor] = latest;
    expect(Number(major) * 100 + Number(minor)).toBeGreaterThanOrEqual(8);
  });

  it('shared terms have five languages and ontologyId', () => {
    expect(Object.keys(dict.shared).length).toBeGreaterThan(10);
    for (const [key, term] of Object.entries(dict.shared)) {
      for (const lang of ['en', 'fi', 'sv', 'de', 'fr'] as const) {
        expect(term[lang], `${key}.${lang}`).toBeTruthy();
      }
      expect(term.ontologyId, key).toBeDefined();
    }
  });

  it('bans Souverän in Swedish, Monolocalisation, and spårighet-for-sovereignty', () => {
    const displaySv: string[] = [];
    for (const term of Object.values(dict.shared)) {
      displaySv.push(term.sv);
    }
    for (const industry of Object.values(dict.industries)) {
      for (const term of Object.values(industry.terms)) {
        if (term.sv) displaySv.push(term.sv);
      }
    }
    for (const sv of displaySv) {
      expect(sv).not.toMatch(/Souverän/);
      expect(sv).not.toMatch(/Monolocalisation/);
    }
    for (const term of Object.values(dict.shared)) {
      if (/sovereign/i.test(term.en)) {
        expect(term.sv.toLowerCase()).not.toContain('spårighet');
      }
    }
    expect(dict.bannedTokens.sv).toContain('Souverän');
    expect(dict.bannedTokens.all).toContain('Monolocalisation');
    expect(dict.bannedTokens.sovereigntyMustNotUse).toContain('spårighet');
  });

  it('Aegis exclusions are industries 17, 19, 20, 21', () => {
    expect(dict.industries['17'].aegisInScope).toBe(false);
    expect(dict.industries['19'].aegisInScope).toBe(false);
    expect(dict.industries['20'].aegisInScope).toBe(false);
    expect(dict.industries['21'].aegisInScope).toBe(false);
    expect(dict.industries['8'].aegisInScope).toBe(true);
    expect(dict.industries['2'].aegisInScope).toBe(true);
  });

  it('wave0 inventory exists and dual-folder missing is zero', () => {
    const inv = readJson('docs/localization/dws10-wave0-inventory.json') as {
      counts: { masters: number; dualFolderMissing: number; industriesServed?: number };
    };
    expect(inv.counts.masters).toBeGreaterThan(100);
    expect(inv.counts.dualFolderMissing).toBe(0);
  });

  it('wave3 configs exist for construction landing + SKU', () => {
    expect(existsSync(join(ROOT, 'scripts/i18n/ind-mars.config.json'))).toBe(true);
    expect(existsSync(join(ROOT, 'scripts/i18n/constr-t2.config.json'))).toBe(true);
  });
});
