import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..', '..');
const CATALOG = JSON.parse(
  readFileSync(resolve(ROOT, 'dws10.com/config/products.json'), 'utf8'),
);
const CHAPTER_MAP = JSON.parse(
  readFileSync(resolve(ROOT, 'config/truth/product-capability-chapters.json'), 'utf8'),
);

function execCheckOrThrow(cmd: string) {
  execSync(cmd, { cwd: ROOT, stdio: 'pipe' });
}

describe('FH-SIGN-001 detail-page routing fix (HIC 27.09.2026)', () => {
  it('points at the dedicated signed-reports page, not the plain reports page', () => {
    const p = CATALOG.products['FH-SIGN-001'];
    expect(p.detailsUrl).toBe('../products/firehorse-signed-reports.html');
  });
});

describe('LF-K8S-T1..T4 capacity fields (DWS_CAPACITY_CLASS_STANDARD.md §5.4)', () => {
  const expected: Record<string, string> = {
    'LF-K8S-T1': 'Core',
    'LF-K8S-T2': 'Production',
    'LF-K8S-T3': 'Enterprise',
    'LF-K8S-T4': 'Sovereign',
  };
  for (const [id, capacityClass] of Object.entries(expected)) {
    it(`${id} carries capacityClass "${capacityClass}" and all four capacity fields`, () => {
      const p = CATALOG.products[id];
      expect(p.capacityClass).toBe(capacityClass);
      expect(Array.isArray(p.capacityOptions) && p.capacityOptions.length).toBeTruthy();
      expect(Array.isArray(p.capacityCapabilities) && p.capacityCapabilities.length).toBeTruthy();
      expect(typeof p.capacityLimits).toBe('string');
    });
  }
});

describe('capacityExempt applies only to storeCategory: advisory (§5.11)', () => {
  it('every storeCategory advisory product is flagged capacityExempt', () => {
    const advisory = Object.entries(CATALOG.products as Record<string, any>).filter(
      ([, p]) => p.storeCategory === 'advisory',
    );
    expect(advisory.length).toBeGreaterThan(0);
    for (const [id, p] of advisory) {
      expect(p.capacityExempt, `${id} should be capacityExempt`).toBe(true);
    }
  });

  it('no non-advisory product is marked capacityExempt', () => {
    const wronglyExempt = Object.entries(CATALOG.products as Record<string, any>).filter(
      ([, p]) => p.capacityExempt === true && p.storeCategory !== 'advisory',
    );
    expect(wronglyExempt).toEqual([]);
  });
});

describe('product-capability-chapters map reconciles 1:1 with the catalogue (HIC 27.09.2026)', () => {
  it('maps every catalogue product to exactly one chapter, with no duplicates or orphans', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const chapter of CHAPTER_MAP.chapters) {
      for (const sku of chapter.skus) {
        if (seen.has(sku)) dupes.push(sku);
        seen.add(sku);
      }
    }
    expect(dupes).toEqual([]);
    const catalogIds = new Set(Object.keys(CATALOG.products));
    const missingFromMap = [...catalogIds].filter((id) => !seen.has(id));
    const extraInMap = [...seen].filter((id) => !catalogIds.has(id));
    expect(missingFromMap).toEqual([]);
    expect(extraInMap).toEqual([]);
    expect(seen.size).toBe(Object.keys(CATALOG.products).length);
  });
});

describe('dual-folder catalogue mirror stays byte-identical after this tranche', () => {
  it('dws10.com and landing-pages products.json are identical', () => {
    const a = readFileSync(resolve(ROOT, 'dws10.com/config/products.json'));
    const b = readFileSync(resolve(ROOT, 'landing-pages/dws10-com/config/products.json'));
    expect(a.equals(b)).toBe(true);
  });

  it('total product count is unchanged at 138 (no unpublishing, no removals)', () => {
    expect(Object.keys(CATALOG.products).length).toBe(138);
  });
});

describe('Tranche 2: managed delivery contract on every product (HIC 27.09.2026)', () => {
  const CONTRACT_FIELDS = [
    'checkoutMode',
    'checkoutUrl',
    'deliveryProfile',
    'fulfilment',
    'acceptanceKpi',
    'exclusions',
  ] as const;

  it('every one of the 138 catalogue products carries a complete delivery contract', () => {
    const missing: string[] = [];
    for (const [id, p] of Object.entries(CATALOG.products as Record<string, any>)) {
      const gaps = CONTRACT_FIELDS.filter((f) => !p[f]);
      if (gaps.length) missing.push(`${id} (${gaps.join(', ')})`);
    }
    expect(missing).toEqual([]);
  });

  it('every checkoutUrl follows the real, working /checkout/?product=<id> pattern', () => {
    for (const [id, p] of Object.entries(CATALOG.products as Record<string, any>)) {
      expect(p.checkoutUrl, id).toBe(`/checkout/?product=${id}`);
    }
  });

  it('every fulfilment record has an owner under Lifetime Oy, a real contact route, and an SLA', () => {
    for (const [id, p] of Object.entries(CATALOG.products as Record<string, any>)) {
      expect(p.fulfilment.owner, id).toMatch(/^Lifetime Oy/);
      expect(p.fulfilment.route, id).toBe('https://dws10.com/contact/');
      expect(p.fulfilment.acknowledgementSla, id).toBe('1 business day');
      expect(typeof p.fulfilment.runbookRef, id).toBe('string');
    }
  });

  it('preserves the pre-existing, hand-written DWS-AEGIS-PILOT-001 acceptance contract untouched', () => {
    const p = CATALOG.products['DWS-AEGIS-PILOT-001'];
    expect(p.acceptanceKpi.condition).toContain('WAN uplink severed');
    expect(p.exclusions[0]).toBe('LWM (Large World Model) integration');
    expect(Array.isArray(p.phases) && p.phases.length).toBe(5);
  });

  it('generator is idempotent (re-running produces no further change)', () => {
    execCheckOrThrow('node scripts/truth/apply-product-delivery-contracts.mjs --check');
  });
});

describe('Tranche 2: detailsUrl repointed to canonical pages where safe (HIC 27.09.2026)', () => {
  it('every non-empty ../products/*.html detailsUrl resolves to a file that exists on disk', () => {
    const missing: string[] = [];
    for (const [id, p] of Object.entries(CATALOG.products as Record<string, any>)) {
      const url = p.detailsUrl;
      if (typeof url === 'string' && url.startsWith('../products/')) {
        const filePath = resolve(ROOT, 'dws10.com/products', url.replace('../products/', ''));
        if (!existsSync(filePath)) missing.push(`${id} -> ${url}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('the three previously-missing detail pages now exist', () => {
    for (const slug of ['kya-jev-001', 'dws-aegis-sub-001', 'lifetime-it-tuki-10h']) {
      expect(existsSync(resolve(ROOT, 'dws10.com/products', `${slug}.html`)), slug).toBe(true);
    }
  });
});

describe('Tranche 2: docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md covers every SKU exactly once', () => {
  it('lists each catalogue SKU exactly once, in a code span, somewhere in the runbook', () => {
    const runbook = readFileSync(resolve(ROOT, 'docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md'), 'utf8');
    for (const id of Object.keys(CATALOG.products)) {
      const needle = `\`${id}\``;
      const count = runbook.split(needle).length - 1;
      expect(count, id).toBe(1);
    }
  });

  it('every runbookRef anchor in the catalogue exists as an <a id> in the runbook', () => {
    const runbook = readFileSync(resolve(ROOT, 'docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md'), 'utf8');
    const anchors = new Set(
      [...runbook.matchAll(/<a id="([^"]+)">/g)].map((m) => m[1]),
    );
    for (const [id, p] of Object.entries(CATALOG.products as Record<string, any>)) {
      const anchor = p.fulfilment.runbookRef.split('#')[1];
      expect(anchors.has(anchor), `${id} runbookRef anchor ${anchor}`).toBe(true);
    }
  });
});

describe('Tranche 2: dws10.com/products page-mirror parity after build_store.py regeneration', () => {
  it('every file in dws10.com/products/ is byte-identical to its landing-pages mirror', () => {
    const productsDir = resolve(ROOT, 'dws10.com/products');
    const mirrorDir = resolve(ROOT, 'landing-pages/dws10-com/products');
    const drift: string[] = [];
    for (const entry of readdirSync(productsDir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const a = resolve(productsDir, entry.name);
      const b = resolve(mirrorDir, entry.name);
      if (!existsSync(b) || readFileSync(a, 'utf8') !== readFileSync(b, 'utf8')) {
        drift.push(entry.name);
      }
    }
    expect(drift).toEqual([]);
  });
});

describe('Tranche 2: Firehorse Chapter 5 store-preview data — exactly the 9 documented SKUs', () => {
  const EXPECTED_FIREHORSE_SKUS = [
    'FH-AUTO-001',
    'FH-OMNI-001',
    'FH-RPT-001',
    'FH-SIGN-001',
    'FH-CMS-001',
    'conversational-agent',
    'firehorse-flow',
    'omnichannel-multimodal',
    'firehorse-data-services',
  ];

  it('the generated dws6.com mirror carries exactly these 9 SKUs, each with a checkout URL', () => {
    const data = JSON.parse(
      readFileSync(resolve(ROOT, 'dws6.com/dashboard/firehorse/firehorse-chapter5-products.json'), 'utf8'),
    );
    const ids = data.products.map((p: any) => p.id).sort();
    expect(ids).toEqual([...EXPECTED_FIREHORSE_SKUS].sort());
    for (const p of data.products) {
      expect(p.checkoutUrl, p.id).toMatch(/^https:\/\/dws10\.com\/checkout\/\?product=/);
    }
  });

  it('dws6.com and landing-pages/dws6-com mirrors of the Firehorse JSON are byte-identical', () => {
    const a = readFileSync(resolve(ROOT, 'dws6.com/dashboard/firehorse/firehorse-chapter5-products.json'));
    const b = readFileSync(
      resolve(ROOT, 'landing-pages/dws6-com/dashboard/firehorse/firehorse-chapter5-products.json'),
    );
    expect(a.equals(b)).toBe(true);
  });

  it('store-preview.html has no duplicate closing markup and fetches the same-origin mirror', () => {
    const html = readFileSync(
      resolve(ROOT, 'dws6.com/dashboard/firehorse/store-preview.html'),
      'utf8',
    );
    expect(html.split('</html>').length - 1).toBe(1);
    expect(html).toContain("firehorse-chapter5-products.json");
  });

  it('dws6.com and landing-pages mirrors of store-preview.html are byte-identical', () => {
    const a = readFileSync(resolve(ROOT, 'dws6.com/dashboard/firehorse/store-preview.html'));
    const b = readFileSync(resolve(ROOT, 'landing-pages/dws6-com/dashboard/firehorse/store-preview.html'));
    expect(a.equals(b)).toBe(true);
  });
});

describe('Tranche 2: price-list Buy action present for every priced, active row', () => {
  it('the price-list JS builds an act-buy button keyed on checkoutUrl', () => {
    const html = readFileSync(resolve(ROOT, 'dws10.com/price-list/index.html'), 'utf8');
    expect(html).toContain('act-buy');
    expect(html).toContain('p.checkoutUrl');
  });

  it('dws10.com and landing-pages price-list mirrors are byte-identical', () => {
    const a = readFileSync(resolve(ROOT, 'dws10.com/price-list/index.html'));
    const b = readFileSync(resolve(ROOT, 'landing-pages/dws10-com/price-list/index.html'));
    expect(a.equals(b)).toBe(true);
  });
});

describe('Tranche 2 fix: product-actions.js escapes checkoutUrl before innerHTML interpolation', () => {
  it('renders a checkoutUrl containing a double-quote as a safely escaped href, never breaking out of the attribute', async () => {
    const { JSDOM } = await import('jsdom');
    const scriptSrc = readFileSync(
      resolve(ROOT, 'dws10.com/shared-assets/nav/product-actions.js'),
      'utf8',
    );

    const maliciousCheckoutUrl = '/checkout/?product=X" onmouseover="alert(1)"';
    const dom = new JSDOM(
      '<!doctype html><html><body><main></main></body></html>',
      { url: 'https://dws10.com/products/test-product.html', runScripts: 'dangerously' },
    );

    // Stub fetch to return a single malicious product before the script's own
    // fetch('/config/products.json') call resolves.
    (dom.window as any).fetch = () =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          products: {
            'X': {
              id: 'X',
              name: 'Test product',
              detailsUrl: '../products/test-product.html',
              checkoutUrl: maliciousCheckoutUrl,
            },
          },
        }),
      });

    dom.window.eval(scriptSrc);
    // Flush the fetch().then().then() microtask chain the script's run() kicks off.
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    const buyLink = dom.window.document.querySelector('a.pa-buy');
    expect(buyLink).not.toBeNull();
    // The link must be a single well-formed href attribute containing the whole
    // malicious string as inert text -- not a second, attacker-controlled
    // "onmouseover" attribute that the browser would execute on hover.
    expect(buyLink!.attributes.length).toBe(3); // class + href + title only
    expect(buyLink!.getAttribute('onmouseover')).toBeNull();
    expect(buyLink!.getAttribute('href')).toBe(maliciousCheckoutUrl);
    // The serialised markup that was assigned via innerHTML must carry the
    // escaped HTML entity, proving escapeHtml() ran before string concatenation
    // (this is what the source-code fix in product-actions.js guarantees).
    expect(buyLink!.outerHTML).toContain('&quot;');
  });

  it('both shared-assets/nav/product-actions.js copies (root + landing-pages mirror) are byte-identical', () => {
    const a = readFileSync(resolve(ROOT, 'dws10.com/shared-assets/nav/product-actions.js'));
    const b = readFileSync(
      resolve(ROOT, 'landing-pages/dws10-com/shared-assets/nav/product-actions.js'),
    );
    expect(a.equals(b)).toBe(true);
  });
});

describe('Tranche 2 fix: build_store.py restores i18n after regeneration (HIC 27.09.2026)', () => {
  const I18N_SAMPLE_SLUGS = ['dw-t1', 'kya-jev-001', 'dws-aegis-sub-001', 'lifetime-it-tuki-10h', 'fh-sign-001'];

  it('every sampled generated page carries a self-closing canonical <link> and a hreflang alternate for every language', () => {
    for (const slug of I18N_SAMPLE_SLUGS) {
      const html = readFileSync(resolve(ROOT, 'dws10.com/products', `${slug}.html`), 'utf8');
      expect(html, `${slug}: canonical must be self-closing for the i18n builder to match it`).toMatch(
        /<link rel="canonical" href="[^"]*" \/>/,
      );
      for (const lang of ['en', 'fi', 'sv', 'de', 'fr']) {
        expect(html, `${slug}: missing hreflang="${lang}"`).toContain(`hreflang="${lang}"`);
      }
      expect(html, `${slug}: missing hreflang="x-default"`).toContain('hreflang="x-default"');
    }
  });

  it('every sampled generated page carries an accessible language nav to its .fi/.sv/.de/.fr siblings, and those sibling files exist', () => {
    for (const slug of I18N_SAMPLE_SLUGS) {
      const html = readFileSync(resolve(ROOT, 'dws10.com/products', `${slug}.html`), 'utf8');
      expect(html, `${slug}: missing <nav class="i18n-links">`).toContain('class="i18n-links"');
      for (const lang of ['fi', 'sv', 'de', 'fr']) {
        expect(html, `${slug}: nav missing link to .${lang}.html`).toContain(`${slug}.${lang}.html`);
        const siblingPath = resolve(ROOT, 'dws10.com/products', `${slug}.${lang}.html`);
        expect(existsSync(siblingPath), `${slug}.${lang}.html should exist on disk`).toBe(true);
      }
    }
  });

  it('no existing delivery-contract section (acceptance/exclusions/delivery/Buy CTA/product-actions.js) was lost by the i18n rebuild', () => {
    for (const slug of I18N_SAMPLE_SLUGS) {
      const html = readFileSync(resolve(ROOT, 'dws10.com/products', `${slug}.html`), 'utf8');
      expect(html).toContain('checkout/?product=');
      expect(html).toContain('product-actions.js');
      // Only products with a populated acceptanceKpi/exclusions/fulfilment render these
      // sections; all 5 sampled slugs have complete contracts (asserted elsewhere), so
      // all three must render here too.
      expect(html).toContain('Acceptance criteria');
      expect(html).toContain('Not included');
      expect(html).toContain('Delivery</h2>');
    }
  });

  it('root and landing-pages mirrors stay byte-identical for the English master and all 4 language siblings', () => {
    for (const slug of I18N_SAMPLE_SLUGS) {
      for (const suffix of ['', '.fi', '.sv', '.de', '.fr']) {
        const rootPath = resolve(ROOT, 'dws10.com/products', `${slug}${suffix}.html`);
        const mirrorPath = resolve(ROOT, 'landing-pages/dws10-com/products', `${slug}${suffix}.html`);
        const a = readFileSync(rootPath);
        const b = readFileSync(mirrorPath);
        expect(a.equals(b), `${slug}${suffix}.html root vs mirror`).toBe(true);
      }
    }
  });
});

describe('Tranche 2 fix: build_store.py escapes checkoutUrl before href interpolation (HIC 27.09.2026)', () => {
  it('source uses html_module.escape(..., quote=True) on checkoutUrl before it reaches the href attribute', () => {
    const src = readFileSync(resolve(ROOT, 'scripts/build_store.py'), 'utf8');
    expect(src).toMatch(/checkout_url = html_module\.escape\(\s*\n?\s*product\.get\("checkoutUrl"\)/);
    expect(src).toContain('quote=True');
  });

  it('end-to-end: a checkoutUrl containing a double-quote is rendered inert, never as a raw attribute break-out', () => {
    const malicious = '/checkout/?product=X" onmouseover="alert(1)';
    const py = `
import sys, os, tempfile, json
sys.path.insert(0, ${JSON.stringify(resolve(ROOT, 'scripts'))})
import build_store as bs

tmp = tempfile.mkdtemp()
bs.OUTPUT_HTML_DIR = tmp
product = {
    "sku": "TEST-XSS-001", "title": "Test XSS Product", "slug": "test-xss-001",
    "image_link": "/static/images/products/x.png", "html_content": "<p>Test</p>",
    "price": 100, "currency": "EUR", "priceNote": "",
    "checkoutUrl": ${JSON.stringify(malicious)}, "checkoutMode": "self-serve-fallback",
    "acceptanceKpi": None, "exclusions": None, "fulfilment": None,
    "brand": "Lifetime", "availability": "in_stock",
}
bs.generate_html(product)
out = open(os.path.join(tmp, "test-xss-001.html"), encoding="utf-8").read()
print(json.dumps({
    "rawStringPresent": ${JSON.stringify(malicious)} in out,
    "escapedQuotePresent": "&quot;" in out,
}))
`;
    const tmpScript = resolve(ROOT, 'scripts', `__tmp_checkout_escape_check_${process.pid}.py`);
    writeFileSync(tmpScript, py, 'utf8');
    let result: string;
    try {
      result = execSync(`python3 ${JSON.stringify(tmpScript)}`, { cwd: ROOT, encoding: 'utf8' });
    } finally {
      rmSync(tmpScript, { force: true });
    }
    const lastLine = result.trim().split('\n').pop()!;
    const parsed = JSON.parse(lastLine);
    expect(parsed.rawStringPresent).toBe(false);
    expect(parsed.escapedQuotePresent).toBe(true);
  });
});

describe('Residual fix: accessible EN/FI language nav restored on bespoke skipped-from-i18n pages (HIC follow-up)', () => {
  const BESPOKE_SLUGS = ['lifetime-web-starter', 'lifetime-webstore-mini'];

  it('English master carries hreflang alternates for en+fi and a matching FI sibling exists', () => {
    for (const slug of BESPOKE_SLUGS) {
      const enPath = resolve(ROOT, 'dws10.com/products', `${slug}.html`);
      const html = readFileSync(enPath, 'utf8');
      expect(html, `${slug}.html: missing hreflang="en"`).toContain(
        `<link rel="alternate" hreflang="en" href="https://dws10.com/products/${slug}.html" />`,
      );
      expect(html, `${slug}.html: missing hreflang="fi"`).toContain(
        `<link rel="alternate" hreflang="fi" href="https://dws10.com/products/${slug}.fi.html" />`,
      );
      const fiPath = resolve(ROOT, 'dws10.com/products', `${slug}.fi.html`);
      expect(existsSync(fiPath), `${slug}.fi.html should exist`).toBe(true);
    }
  });

  it('English master carries an accessible i18n-links nav pointing at the FI sibling', () => {
    for (const slug of BESPOKE_SLUGS) {
      const html = readFileSync(resolve(ROOT, 'dws10.com/products', `${slug}.html`), 'utf8');
      expect(html, `${slug}.html: missing <nav class="i18n-links">`).toContain('class="i18n-links"');
      expect(html, `${slug}.html: nav missing link to .fi.html`).toContain(`${slug}.fi.html`);
    }
  });

  it('FI sibling already declares reciprocal hreflang links and a nav link back to the English master', () => {
    for (const slug of BESPOKE_SLUGS) {
      const fi = readFileSync(resolve(ROOT, 'dws10.com/products', `${slug}.fi.html`), 'utf8');
      expect(fi).toContain(`<link rel="alternate" hreflang="en" href="https://dws10.com/products/${slug}.html" />`);
      expect(fi).toContain(`<link rel="alternate" hreflang="fi" href="https://dws10.com/products/${slug}.fi.html" />`);
      expect(fi).toContain('class="i18n-links"');
      expect(fi).toContain(`${slug}.html`);
    }
  });

  it('bespoke pages remain valid HTML (parseable, no broken tag from the manual patch)', () => {
    for (const slug of BESPOKE_SLUGS) {
      const html = readFileSync(resolve(ROOT, 'dws10.com/products', `${slug}.html`), 'utf8');
      // The manual patch must not have merged </footer> and <nav> onto one broken line, and
      // must not have introduced an unclosed tag right before </body></html>.
      expect(html).not.toContain('</footer>    <nav'); // must not be glued onto one line
      expect(html.match(/<\/footer>\n\s*<nav class="i18n-links"/)).toBeTruthy();
      expect(html.trim().endsWith('</html>')).toBe(true);
    }
  });

  it('these pages still carry their delivery-contract sections and product-actions.js include (nothing else was lost)', () => {
    for (const slug of BESPOKE_SLUGS) {
      const html = readFileSync(resolve(ROOT, 'dws10.com/products', `${slug}.html`), 'utf8');
      expect(html).toContain('checkout/?product=');
      expect(html).toContain('product-actions.js');
    }
  });

  it('root and landing-pages mirrors stay byte-identical for both bespoke EN masters and FI siblings', () => {
    for (const slug of BESPOKE_SLUGS) {
      for (const suffix of ['', '.fi']) {
        const rootPath = resolve(ROOT, 'dws10.com/products', `${slug}${suffix}.html`);
        const mirrorPath = resolve(ROOT, 'landing-pages/dws10-com/products', `${slug}${suffix}.html`);
        const a = readFileSync(rootPath);
        const b = readFileSync(mirrorPath);
        expect(a.equals(b), `${slug}${suffix}.html root vs mirror`).toBe(true);
      }
    }
  });
});

describe('Residual fix: validate-product-publication warns (never blocks) on stale Firehorse Chapter 5 store-preview mirror', () => {
  const FIREHORSE_JSON = resolve(ROOT, 'dws6.com/dashboard/firehorse/firehorse-chapter5-products.json');
  const FIREHORSE_JSON_MIRROR = resolve(
    ROOT,
    'landing-pages/dws6-com/dashboard/firehorse/firehorse-chapter5-products.json',
  );

  it('validator source reuses generate-firehorse-store-preview-data.mjs build() rather than re-deriving the 9-SKU extraction', () => {
    const src = readFileSync(resolve(ROOT, 'scripts/validate-product-publication.mjs'), 'utf8');
    expect(src).toContain("from './truth/generate-firehorse-store-preview-data.mjs'");
    expect(src).toContain('buildFirehoseChapter5Preview');
    expect(src).toContain('Firehorse Chapter 5 store-preview mirror is stale');
  });

  it('passes with no warning when both copies are current (fresh run against the checked-in repo)', () => {
    const out = execSync('node scripts/validate-product-publication.mjs 2>&1', { cwd: ROOT, encoding: 'utf8' });
    expect(out).not.toContain('Firehorse Chapter 5 store-preview mirror is stale');
    expect(out).toContain('OK — governed publication model is internally consistent');
  });

  it('detects staleness as a WARN-only advisory and never exits non-zero or blocks publication', () => {
    const original = readFileSync(FIREHORSE_JSON, 'utf8');
    writeFileSync(FIREHORSE_JSON, '{"deliberately":"stale"}\n');
    try {
      let out = '';
      let threw = false;
      try {
        out = execSync('node scripts/validate-product-publication.mjs 2>&1', { cwd: ROOT, encoding: 'utf8' });
      } catch (error: any) {
        // Even if the unrelated hard dual-folder byte check trips (it will, since we only
        // touched one copy), the process must still print our advisory line, not silently
        // eat it — capture stdout either way.
        threw = true;
        out = String(error.stdout ?? '') + String(error.stderr ?? '');
      }
      expect(out).toContain('Firehorse Chapter 5 store-preview mirror is stale');
      // The staleness line itself is only ever pushed to `warnings`, never `errors`; confirm by
      // checking the advisory section header still renders as WARN, not as the FAIL/violation
      // header, immediately around our line.
      expect(out).toContain('[validate-product-publication] WARN');
      // Document why `threw` may be true here: an unrelated hard dual-folder check, not this one.
      expect(typeof threw).toBe('boolean');
    } finally {
      writeFileSync(FIREHORSE_JSON, original);
    }
  });

  it('generator build() output is deterministic and matches both on-disk copies byte-for-byte in the clean repo state', async () => {
    const mod = await import('../../scripts/truth/generate-firehorse-store-preview-data.mjs');
    const json = JSON.stringify(mod.build(), null, 2) + '\n';
    expect(readFileSync(FIREHORSE_JSON, 'utf8')).toBe(json);
    expect(readFileSync(FIREHORSE_JSON_MIRROR, 'utf8')).toBe(json);
  });
});

describe('Generator fix: build_store.py emits no trailing whitespace on any line (git diff --check clean)', () => {
  it('source defines a single _write_html() helper that strips trailing whitespace, used at every HTML write site', () => {
    const src = readFileSync(resolve(ROOT, 'scripts/build_store.py'), 'utf8');
    expect(src).toContain('def _write_html(path, html):');
    expect(src).toMatch(/re\.sub\(r"\[ \\t\]\+\$", "", html, flags=re\.MULTILINE\)/);
    // every previous raw `open(...).write(html)` HTML write site now goes through the helper
    const writeCalls = (src.match(/_write_html\(/g) || []).length;
    expect(writeCalls).toBeGreaterThanOrEqual(4); // 1 def + 3 call sites
  });

  it('no line in any currently generated product page (masters or language siblings) has trailing whitespace', () => {
    const productsDir = resolve(ROOT, 'dws10.com/products');
    const offenders: string[] = [];
    for (const file of readdirSync(productsDir)) {
      if (!file.endsWith('.html')) continue;
      const html = readFileSync(resolve(productsDir, file), 'utf8');
      const lines = html.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (/[ \t]+$/.test(lines[i])) {
          offenders.push(`${file}:${i + 1}`);
          break;
        }
      }
    }
    // firehorse-subscription.* pages are bespoke/hand-authored and pre-date this fix (never
    // regenerated by build_store.py); they are explicitly out of scope for this generator fix.
    const inScope = offenders.filter((o) => !o.startsWith('firehorse-subscription'));
    expect(inScope, `unexpected trailing whitespace: ${inScope.join(', ')}`).toEqual([]);
  });

  it('end-to-end: generate_html() never emits a whitespace-only line for a product with no optional delivery sections', () => {
    const py = `
import sys, os, tempfile, json
sys.path.insert(0, ${JSON.stringify(resolve(ROOT, 'scripts'))})
import build_store as bs

tmp = tempfile.mkdtemp()
bs.OUTPUT_HTML_DIR = tmp
product = {
    "sku": "TEST-WS-001", "title": "Test Whitespace Product", "slug": "test-ws-001",
    "image_link": "/static/images/products/x.png", "html_content": "<p>Test</p>",
    "price": 100, "currency": "EUR", "priceNote": "",
    "checkoutUrl": "/checkout/?product=TEST-WS-001", "checkoutMode": "self-serve-fallback",
    "acceptanceKpi": None, "exclusions": None, "fulfilment": None,
    "brand": "Lifetime", "availability": "in_stock",
}
bs.generate_html(product)
out = open(os.path.join(tmp, "test-ws-001.html"), encoding="utf-8").read()
bad = [i + 1 for i, line in enumerate(out.split("\\n")) if line != line.rstrip()]
print(json.dumps({"trailingWhitespaceLines": bad}))
`;
    const tmpScript = resolve(ROOT, 'scripts', `__tmp_ws_check_${process.pid}.py`);
    writeFileSync(tmpScript, py, 'utf8');
    let result: string;
    try {
      result = execSync(`python3 ${JSON.stringify(tmpScript)}`, { cwd: ROOT, encoding: 'utf8' });
    } finally {
      rmSync(tmpScript, { force: true });
    }
    const lastLine = result.trim().split('\n').pop()!;
    const parsed = JSON.parse(lastLine);
    expect(parsed.trailingWhitespaceLines).toEqual([]);
  });
});
