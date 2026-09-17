/**
 * Guards for the Aegis / Store i18n pipeline.
 * Catalog pages must be built from JSON arrays via build-i18n-pages.cjs.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '../../..');

function readJson(rel: string) {
  return JSON.parse(readFileSync(join(ROOT, rel), 'utf8')) as Record<string, unknown>;
}

describe('aegis-products i18n pipeline', () => {
  it('config points at dual-folder product dirs that exist', () => {
    const cfg = readJson('scripts/i18n/aegis-products/config.json') as {
      master: string;
      outDirs: string[];
      files: Record<string, string>;
      urlBase: string;
    };
    expect(existsSync(join(ROOT, cfg.master))).toBe(true);
    expect(cfg.outDirs).toEqual(['dws10.com/products', 'landing-pages/dws10-com/products']);
    for (const dir of cfg.outDirs) {
      expect(existsSync(join(ROOT, dir))).toBe(true);
    }
    expect(cfg.urlBase).toBe('https://dws10.com/products/');
    expect(cfg.files.en).toBe('aegis.html');
  });

  it('object-section string files are not JSON arrays (builder must refuse)', () => {
    for (const lang of ['en', 'fi', 'sv', 'de', 'fr']) {
      const data = readJson(`scripts/i18n/aegis-products/${lang}-strings.json`);
      expect(Array.isArray(data)).toBe(false);
      expect(data.hero).toBeDefined();
      expect(data.seo).toBeDefined();
    }
  });

  it('translate.cjs refuses to overwrite object-section files', () => {
    expect(() =>
      execFileSync('node', ['scripts/i18n/aegis-products/translate.cjs'], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
    ).toThrow();
  });

  it('generate-translations.cjs refuses to write stubs', () => {
    expect(() =>
      execFileSync('node', ['scripts/i18n/aegis-products/generate-translations.cjs'], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
    ).toThrow();
  });

  it('retired python stub generator exits non-zero', () => {
    try {
      execFileSync('python3', ['scripts/i18n/generate-hreflang-html.py'], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      expect.unreachable();
    } catch (err) {
      const e = err as { status?: number; stderr?: string };
      expect(e.status).not.toBe(0);
      expect(String(e.stderr)).toMatch(/retired/);
    }
  });

  it('Swedish glossary does not use German Souverän or spårighet-for-sovereignty', () => {
    const gloss = readJson('docs/localization/aegis-glossary.json') as Record<
      string,
      Record<string, string>
    >;
    for (const row of Object.values(gloss)) {
      expect(row.sv).not.toMatch(/Souverän/);
      expect(row.sv).not.toMatch(/spårighet/);
    }
    expect(gloss.sovereign.sv).toBe('Suverän');
    expect(gloss.data_sovereignty.sv).toBe('Datasuveränitet');
    expect(gloss.single_tenant.fr).toBe('locataire unique');
  });
});
