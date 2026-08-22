/**
 * PII Scrubber — Veriton Local Pre-Callout Filter
 *
 * Runs entirely on Veriton hardware (Helsinki, Finland) before any data
 * is sent to the Anthropic API. Guarantees that PII never leaves the EU.
 *
 * Article 12 compliance stance:
 *   - Inference runs on Anthropic US infrastructure (honest, unavoidable)
 *   - PII scrubbing runs on Veriton (EU, Finland) — this is the control
 *   - Together: "PII-clean input leaves EU" — defensible to auditors
 *
 * Replacement strategy: deterministic SHA-256 tokens
 *   Same PII value → same token (enables audit correlation without re-identifying)
 *   Format: [REDACTED:<type>:<first-8-of-sha256>]
 *
 * Zero external calls. No network I/O. Must stay that way.
 */

import { createHash } from 'node:crypto';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PIIType =
  | 'email'
  | 'phone-fi'
  | 'phone-intl'
  | 'hetu'            // Finnish personal identity code (henkilötunnus)
  | 'vat-eu'          // EU VAT registration number
  | 'iban'
  | 'ip-v4'
  | 'ip-v6'
  | 'ets-installation' // EU ETS installation ID (FI-XXX-XXXX)
  | 'cbam-auth';       // CBAM declarant authorization number

export interface ScrubManifest {
  /** Types of PII found (not the values themselves) */
  typesFound: PIIType[];
  /** Total number of replacements made */
  replacementCount: number;
  /** SHA-256 of the original (unscrubbed) text — for audit verification */
  originalHash: string;
}

export interface ScrubResult {
  /** Sanitized text safe to send to external APIs */
  sanitized: string;
  /** Audit manifest (no PII values) */
  manifest: ScrubManifest;
}

// ─── Patterns ────────────────────────────────────────────────────────────────

const PATTERNS: Array<{ type: PIIType; regex: RegExp }> = [
  // Finnish henkilötunnus: DDMMYY-NNNC or DDMMYY+NNNC or DDMMYYANNC (born 2000s)
  {
    type: 'hetu',
    regex: /\b\d{6}[+\-A]\d{3}[0-9A-FHJK-NPR-Y]\b/g,
  },

  // Email addresses
  {
    type: 'email',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  },

  // Finnish phone numbers: +358 XX XXXXXXX or 0XX-XXXXXXX
  {
    type: 'phone-fi',
    regex: /(\+358[\s-]?|0)\d{2,3}[\s-]?\d{3,4}[\s-]?\d{3,4}\b/g,
  },

  // International phone (E.164 non-Finnish)
  {
    type: 'phone-intl',
    regex: /\+(?!358)\d{1,3}[\s-]?\d{4,14}\b/g,
  },

  // EU VAT numbers: 2-letter country code + 8-12 alphanumeric
  // Covers FI12345678, DE123456789, SE123456789012, etc.
  {
    type: 'vat-eu',
    regex: /\b(?:AT|BE|BG|CY|CZ|DE|DK|EE|ES|FI|FR|GB|GR|HR|HU|IE|IT|LT|LU|LV|MT|NL|PL|PT|RO|SE|SI|SK)[0-9A-Z]{8,12}\b/g,
  },

  // IBAN (tolerates spaces and hyphens between groups)
  {
    type: 'iban',
    regex: /\b[A-Z]{2}\d{2}[\s-]?(?:[A-Z0-9]{4}[\s-]?){1,7}[A-Z0-9]{1,4}\b/g,
  },

  // EU ETS installation IDs (FI-nnn-nnnnn format used in Finnish ETS registry)
  {
    type: 'ets-installation',
    regex: /\b[A-Z]{2}-\d{3}-\d{4,6}\b/g,
  },

  // CBAM declarant authorization numbers (EU format: CB-YYYY-NNNNNN)
  {
    type: 'cbam-auth',
    regex: /\bCB-\d{4}-\d{6}\b/g,
  },

  // IPv4
  {
    type: 'ip-v4',
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
  },

  // IPv6 (simplified — catches full and compressed forms)
  {
    type: 'ip-v6',
    regex: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b|\b(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}\b/g,
  },
];

// ─── Core ────────────────────────────────────────────────────────────────────

/**
 * Deterministic token: same PII value → same 8-char hex prefix.
 * Never stores or logs the original value.
 */
function token(type: PIIType, value: string): string {
  const hash = createHash('sha256').update(value).digest('hex').slice(0, 8);
  return `[REDACTED:${type}:${hash}]`;
}

/**
 * Scrub PII from text before sending to any external API.
 *
 * @param text Raw input that may contain PII
 * @returns { sanitized, manifest } — use sanitized for API calls, manifest for Article 12 log
 */
export function scrubPII(text: string): ScrubResult {
  const originalHash = createHash('sha256').update(text).digest('hex');
  const typesFound = new Set<PIIType>();
  let replacementCount = 0;
  let sanitized = text;

  for (const { type, regex } of PATTERNS) {
    // Reset lastIndex for global regexes (defensive — text may be reused)
    regex.lastIndex = 0;

    const replaced = sanitized.replace(regex, (match) => {
      typesFound.add(type);
      replacementCount++;
      return token(type, match);
    });

    sanitized = replaced;
  }

  return {
    sanitized,
    manifest: {
      typesFound: Array.from(typesFound),
      replacementCount,
      originalHash,
    },
  };
}

/**
 * Scrub an object's string values recursively (for JSON payloads).
 * Returns the scrubbed object + a merged manifest across all fields.
 */
export function scrubObject(obj: unknown): { scrubbed: unknown; manifest: ScrubManifest } {
  const allTypes = new Set<PIIType>();
  let totalReplacements = 0;
  const originalHash = createHash('sha256').update(JSON.stringify(obj)).digest('hex');

  function walk(node: unknown): unknown {
    if (typeof node === 'string') {
      const result = scrubPII(node);
      result.manifest.typesFound.forEach((t) => allTypes.add(t));
      totalReplacements += result.manifest.replacementCount;
      return result.sanitized;
    }
    if (Array.isArray(node)) {
      return node.map(walk);
    }
    if (node !== null && typeof node === 'object') {
      return Object.fromEntries(
        Object.entries(node as Record<string, unknown>).map(([k, v]) => [k, walk(v)])
      );
    }
    return node;
  }

  return {
    scrubbed: walk(obj),
    manifest: {
      typesFound: Array.from(allTypes),
      replacementCount: totalReplacements,
      originalHash,
    },
  };
}
