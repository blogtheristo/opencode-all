/**
 * Heuristic ERP hint for contracting authority (buyer) name + country.
 * Source: training data / public patterns — not a guarantee.
 * Refine with CRM data or manual mapping over time.
 */

export type ResolvedErp =
  | 'SAP'
  | 'Oracle'
  | 'IFS'
  | 'Microsoft_Dynamics'
  | 'Infor'
  | 'Epicor'
  | 'Unit4'
  | 'unknown';

const PATTERNS: Array<{ test: RegExp; erp: ResolvedErp }> = [
  { test: /\b(strabag|hochtief|bilfinger|züblin)\b/i, erp: 'SAP' },
  { test: /\b(siemens energy|siemens ag)\b/i, erp: 'SAP' },
  { test: /\b(skf|volvo|atlas copco)\b/i, erp: 'IFS' },
  { test: /\b(ncc|skanska|peab)\b/i, erp: 'IFS' },
  { test: /\b(yit|destia|granlund)\b/i, erp: 'SAP' },
  { test: /\b(veolia|suez)\b/i, erp: 'Oracle' },
  { test: /\b(bouygues|eiffage|vinci)\b/i, erp: 'SAP' },
  { test: /\b(royal bam|bam groep)\b/i, erp: 'SAP' },
  { test: /\b(ferrovial|acs|acciona)\b/i, erp: 'SAP' },
  { test: /\b(kiewit|bechtel|fluor)\b/i, erp: 'Oracle' },
  { test: /\b(balfour beatty)\b/i, erp: 'SAP' },
];

const COUNTRY_HINT: Record<string, ResolvedErp> = {
  FI: 'IFS',
  SE: 'IFS',
  NO: 'IFS',
  DK: 'Microsoft_Dynamics',
  DE: 'SAP',
  AT: 'SAP',
  FR: 'SAP',
  NL: 'SAP',
  UK: 'SAP',
  US: 'Oracle',
};

/**
 * Resolve best-effort ERP label for outreach routing / template selection.
 */
export function resolveErpForBuyer(
  buyerName: string | null | undefined,
  countryCode: string | null | undefined,
): ResolvedErp {
  const name = (buyerName || '').trim();
  const cc = (countryCode || '').toUpperCase();

  for (const { test, erp } of PATTERNS) {
    if (test.test(name)) return erp;
  }

  if (cc && COUNTRY_HINT[cc]) {
    return COUNTRY_HINT[cc];
  }

  return 'unknown';
}
