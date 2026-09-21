/**
 * CODE VERSIONING NOTE
 * Code-Version: 1.0.0
 * Introduced-In: PR-2038
 * Branch: cursor/sales-outreach-ted-grok-pack-a455
 * Date: 2026-09-18
 * Owner: DWS Platform / Cursor Agent
 * Env-Schema: env-v1.0
 * TED CPV → canonical DWS industry (INDUSTRIES.md ids 1–25).
 *
 * Longest prefix wins. Search parents are the 8-digit division/group codes
 * the daily TED fetch ORs together (not construction-only CPV 45).
 */

import { getIndustryById, type IndustryProfile } from './industry-registry.js';
import industryCpvJson from './industry-cpv.json';

interface IndustryCpvPrefix {
  prefix: string;
  industryId: number;
}

interface IndustryCpvFile {
  version: string;
  canonical: string;
  tedSearchCpvCodes: string[];
  prefixes: IndustryCpvPrefix[];
}

const CPV_FILE = industryCpvJson as IndustryCpvFile;

/** Parent CPV codes for TED search across all 25 industries. */
export const TED_SEARCH_CPV_CODES: readonly string[] = CPV_FILE.tedSearchCpvCodes;

const SORTED_PREFIXES: IndustryCpvPrefix[] = [...CPV_FILE.prefixes].sort(
  (a, b) => b.prefix.length - a.prefix.length,
);

function digitsOnly(cpv: string): string {
  return cpv.replace(/[^0-9]/g, '');
}

/** Map a TED CPV (with or without check digit) to a canonical industry profile. */
export function cpvToIndustry(cpv: string | null | undefined): IndustryProfile | undefined {
  if (!cpv) return undefined;
  const code = digitsOnly(cpv);
  if (!code) return undefined;
  for (const row of SORTED_PREFIXES) {
    if (code.startsWith(row.prefix)) {
      return getIndustryById(row.industryId);
    }
  }
  return undefined;
}

export function cpvToIndustryId(cpv: string | null | undefined): number | undefined {
  return cpvToIndustry(cpv)?.id;
}

/** Expert-search CPV clause for TED v3.0 GET (`CPV=… OR CPV=…`). */
export function buildTedExpertCpvClause(codes: readonly string[] = TED_SEARCH_CPV_CODES): string {
  return `(${codes.map((c) => `CPV=${c}`).join(' OR ')})`;
}

/** TED Search API v3 POST clause (`cpv=… OR cpv=…`). */
export function buildTedV3CpvClause(codes: readonly string[] = TED_SEARCH_CPV_CODES): string {
  return codes.map((c) => `cpv=${c}`).join(' OR ');
}

/** Industry ids that have at least one CPV prefix (must be 1–25). */
export function industryIdsCoveredByCpvMap(): number[] {
  return [...new Set(CPV_FILE.prefixes.map((p) => p.industryId))].sort((a, b) => a - b);
}
