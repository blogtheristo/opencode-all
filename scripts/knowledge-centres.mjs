// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=claude-code Date=2026-09-30
// Audit trail: git log -- scripts/knowledge-centres.mjs
/**
 * The centres and hubs (HIC 30.09.2026): investor, customer and partner centres, sales materials,
 * and the legal and compliance hubs. Shared by the blog editor (a button row under Thesis) and the
 * Active Ontology (one node group per centre), so both show the same set.
 *
 * `site` roots are the live dws10.com pages (English; language copies are counted, not listed).
 * Their content is public, so the tools may embed it, and each carries its live URL.
 * `internal` roots are repository folders behind the document access policy: only a count is
 * shown, never titles or content (same rule as withheld Learn documents).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const CENTRES = [
  {
    key: 'investor',
    name: 'Investor centre',
    site: ['investor-centre', 'investor-relations', 'series-a', 'investment-safety'],
    internal: ['docs/investor', 'docs/Investor', 'investor-outreach'],
  },
  {
    key: 'customer',
    name: 'Customer centre',
    site: ['captain/customer', 'get-started', 'free-audit', 'book', 'testimonials'],
    internal: ['sales-outreach', 'sales-rooms', 'docs/CUSTOMER_KB.md'],
  },
  {
    key: 'partner',
    name: 'Partner centre',
    site: [
      'partners',
      'aegis-partners',
      'connect-partners',
      'sovereign-infra-partners',
      'nvidia-inception',
    ],
    internal: ['docs/partnerships', 'Partners', 'partners-outreach'],
  },
  {
    key: 'materials',
    name: 'Materials',
    site: [
      'whitepapers',
      'kya-standard',
      'playbooks',
      'press-releases',
      'price-list/index.html',
      'progress-report.html',
    ],
    internal: ['sales-package-v1.0', 'buyer-package-v1.2', 'sales-packages-serious'],
  },
  {
    key: 'legal',
    name: 'Legal hub',
    site: [
      'legal-hub',
      'legal',
      'privacy-policy',
      'terms',
      'terms-dws-iq',
      'terms-firehorse',
      'terms-lifetime-fleet',
      'terms-professional',
      'data-handling-policy',
      'data-security-policy',
      'regulatory-notice',
      'return-policy',
    ],
    internal: ['Legal', 'docs/legal', 'contracts'],
  },
  {
    key: 'compliance',
    name: 'Compliance hub',
    site: ['compliance'],
    internal: ['docs/compliance'],
  },
];

const SITE = 'dws10.com';
const LANG = /\/(fi|sv|de|fr)\/|\.(fi|sv|de|fr)\.html$/;
const EMBED_MAX = 600 * 1024; // larger pages (inline images) open live instead

const walk = (root, dir, pred) => {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  if (statSync(abs).isFile()) return pred(dir) ? [dir] : [];
  return readdirSync(abs, { withFileTypes: true }).flatMap((e) =>
    walk(root, `${dir}/${e.name}`, pred),
  );
};
const decode = (t) =>
  t.replace(
    /&(mdash|ndash|amp|middot|nbsp|#39|quot);/g,
    (_, e) =>
      ({ mdash: '—', ndash: '–', amp: '&', middot: '·', nbsp: ' ', '#39': "'", quot: '"' })[e],
  );
const liveUrl = (p) =>
  `https://${SITE}/${p
    .slice(SITE.length + 1)
    .replace(/(^|\/)index\.html$/, '$1')
    .replace(/\.html$/, '')}`;

/** → { docs: [{centre, file, url, title, kb, embed, html}], langCopies, withheld } */
export function collectCentres(root) {
  const docs = [];
  const langCopies = {};
  const withheld = {};
  for (const c of CENTRES) {
    for (const s of c.site) {
      for (const p of walk(root, `${SITE}/${s}`, (f) => f.endsWith('.html'))) {
        if (LANG.test(p)) {
          langCopies[c.key] = (langCopies[c.key] ?? 0) + 1;
          continue;
        }
        const html = readFileSync(join(root, p), 'utf8');
        const size = statSync(join(root, p)).size;
        docs.push({
          centre: c.key,
          file: p,
          url: liveUrl(p),
          title: decode((html.match(/<title>([^<]{1,200})<\/title>/i)?.[1] ?? p).trim()),
          kb: Math.round(size / 1024),
          embed: size <= EMBED_MAX,
          html,
        });
      }
    }
    withheld[c.key] = c.internal.reduce(
      (n, d) => n + walk(root, d, (f) => /\.(md|html)$/.test(f)).length,
      0,
    );
  }
  return { docs, langCopies, withheld };
}
