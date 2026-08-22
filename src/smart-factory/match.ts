/**
 * Smart Factory — deterministic product↔prospect matching.
 *
 * Scores every prospect against every catalog product using token overlap
 * between the prospect's industry / signals / org text and the product's
 * normalized keywords, with boosts for regulation and industry hits.
 * Deterministic and dependency-free so it is unit-testable and cheap enough
 * to run across N products × M prospects on every daily run.
 */

import type {
  MatchedProspect,
  NormalizedProduct,
  ProductMatch,
  ProspectCandidate,
} from './types.js';

/** Minimum score for a product to count as a match. */
export const MATCH_THRESHOLD = 0.2;

/** Maximum matched products kept per prospect (best first). */
export const MAX_MATCHES_PER_PROSPECT = 3;

function tokenize(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9äöüå+ ]+/gi, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3);
}

/**
 * Score one prospect against one product.
 * Returns null when the score is below MATCH_THRESHOLD.
 */
export function scoreProspectForProduct(
  prospect: ProspectCandidate,
  product: NormalizedProduct,
): ProductMatch | null {
  if (product.keywords.length === 0) return null;

  // Prospect-side searchable text: signals are the strongest demand evidence.
  const signalTokens = new Set(tokenize((prospect.signals || []).join(' ')));
  const orgTokens = tokenize(
    [prospect.industry, prospect.orgName, prospect.title].filter(Boolean).join(' '),
  );

  if (signalTokens.size === 0 && orgTokens.length === 0) return null;

  let keywordHits = 0;
  const hitTerms: string[] = [];
  for (const kw of product.keywords) {
    const kwTokens = tokenize(kw);
    const hit =
      kwTokens.some((t) => signalTokens.has(t)) ||
      kwTokens.every((t) => orgTokens.includes(t)) ||
      signalTokens.has(kw) ||
      orgTokens.includes(kw);
    if (hit) {
      keywordHits += 1;
      hitTerms.push(kw);
    }
  }

  const lowerSignal = (prospect.signals || []).join(' ').toLowerCase();
  const regHits = product.regulations.filter((r) => lowerSignal.includes(r.toLowerCase()));
  const industryHits = product.industries.filter(
    (i) => i === prospect.industry?.toLowerCase() || lowerSignal.includes(i),
  );

  // Weighted score: keyword overlap dominates; regulation/industry add boost.
  const kwScore = keywordHits / Math.min(product.keywords.length, 20);
  const score = Math.min(1, kwScore + regHits.length * 0.15 + industryHits.length * 0.1);

  if (score < MATCH_THRESHOLD) return null;

  const reasons: string[] = [];
  if (hitTerms.length > 0) reasons.push(`matches: ${hitTerms.slice(0, 5).join(', ')}`);
  if (regHits.length > 0) reasons.push(`regulation exposure: ${regHits.join('/')}`);
  if (industryHits.length > 0) reasons.push(`industry fit: ${industryHits.join('/')}`);

  return {
    productId: product.id,
    productName: product.name,
    score: Math.round(score * 100) / 100,
    reason: reasons.join(' · ') || 'keyword match',
  };
}

/** Match a prospect against the full catalog; returns matches sorted by score. */
export function matchProspectToCatalog(
  prospect: ProspectCandidate,
  products: NormalizedProduct[],
): { matches: ProductMatch[]; fitScore: number } {
  const matches = products
    .map((p) => scoreProspectForProduct(prospect, p))
    .filter((m): m is ProductMatch => m !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_MATCHES_PER_PROSPECT);

  const fitScore = matches.length > 0 ? matches[0].score : 0;
  return { matches, fitScore };
}

/** Stable dedup key: domain → email → linkedin → org name (lowercased). */
export function dedupKeyFor(p: ProspectCandidate): string {
  const key =
    p.domain?.trim().toLowerCase() ||
    p.email?.trim().toLowerCase() ||
    p.linkedinUrl?.trim().toLowerCase() ||
    p.orgName.trim().toLowerCase();
  return key.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/** Run the matcher over all candidates, keeping only prospects with ≥1 match. */
export function matchAll(
  candidates: ProspectCandidate[],
  products: NormalizedProduct[],
): MatchedProspect[] {
  const out: MatchedProspect[] = [];
  for (const c of candidates) {
    const { matches, fitScore } = matchProspectToCatalog(c, products);
    if (matches.length === 0) continue;
    out.push({ ...c, matches, fitScore, dedupKey: dedupKeyFor(c) });
  }
  return out.sort((a, b) => b.fitScore - a.fitScore);
}
