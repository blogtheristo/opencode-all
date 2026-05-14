/**
 * TED notice compliance / climate keyword filter (title + description + CPV text).
 * Used to narrow construction tenders to DWS-relevant procurement language.
 */

import type { TedNotice } from './types.js';

/** Default keywords — broad enough to avoid an empty pipeline; tune via TED_COMPLIANCE_EXTRA. */
export const DEFAULT_COMPLIANCE_KEYWORDS = [
  'carbon',
  'climate',
  'energy',
  'sustainab',
  'environment',
  'lca',
  'lifecycle',
  'bim',
  'digital',
  'green',
  'ghg',
  'emission',
  'esg',
  'csrd',
  'net-zero',
  'net zero',
  'decarbon',
  'renewable',
  'circular',
] as const;

function normalizeText(notice: TedNotice): string {
  const parts = [
    notice.TI,
    notice.titleOriginalLanguage,
    notice.cpvDescription,
    typeof notice.CONTENT === 'string' ? notice.CONTENT : '',
  ].filter(Boolean);
  return parts.join(' ').toLowerCase();
}

/**
 * Returns matched keyword stems (lowercase) for auditing.
 */
export function matchComplianceKeywords(notice: TedNotice): string[] {
  const hay = normalizeText(notice);
  if (!hay) return [];

  const extra = (process.env.TED_COMPLIANCE_EXTRA || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const all = [...DEFAULT_COMPLIANCE_KEYWORDS.map((k) => k.toLowerCase()), ...extra];
  const hits: string[] = [];

  for (const kw of all) {
    if (kw.length >= 3 && hay.includes(kw)) {
      hits.push(kw);
    }
  }

  return [...new Set(hits)];
}

/**
 * strict: at least one compliance keyword required.
 * off: always true (keywords still recorded when present).
 */
export function passesComplianceFilter(notice: TedNotice): boolean {
  const mode = (process.env.TED_COMPLIANCE_FILTER || 'strict').toLowerCase();
  if (mode === 'off') return true;
  return matchComplianceKeywords(notice).length > 0;
}
